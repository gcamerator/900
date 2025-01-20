import * as cheerio from 'cheerio';
import fetch from "node-fetch";

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
  let lister = ["iq", "aq", "book", "pdf"];

  let [feature, inputs, inputs_, inputs__, inputs___] = text.split(" ");
  if (!lister.includes(feature))
    return m.reply(
      "*مثال لطريقة الإستخدام:*\n\n👈🏼 *لعرض الأقسام:*\n.fbook aq\n\n👈🏼 *لعرض كتب قسم ما:*\n.fbook book رابط القسم\n\n👈🏼 *لتحميل ملف:*\n.fbook pdf رابط الملف\n\n👈🏼 *إقتباس عشوائي:*\n.fbook iq",
    );
  let regpdf = /^(?!.*-pdf$).*$/;

  if (lister.includes(feature)) {
    if (feature == "pdf") {
      if (regpdf.test(inputs))
        return m.reply(
          "*أدخل رابط الكتاب*\n\nمثال:\n\n.fbook book رابط الكتاب",
        );
      try {
        let array = await getPdf(inputs);
        let resl = array[Math.floor(Math.random() * array.length)];
        let cap = `*الإسم:* ${resl.ogTitle}
${wait}`;
        await conn.sendFile(m.chat, resl.ogImage, "", cap, m);
        await conn.sendFile(
          m.chat,
          resl.downloadLink,
          resl.ogTitle,
          "",
          m,
          false,
          { asDocument: true },
        );
      } catch (e) {
        await m.reply(eror);
      }
    }
    if (feature == "iq") {
      try {
        let array = await getQuotes(inputs);
        let resl = array[Math.floor(Math.random() * array.length)];
        let cap = `*الإقتباس:* ${resl.content}

*القائل:* ${resl.author.name}
`;
        await conn.sendFile(m.chat, resl.author.photo, "", cap, m);
      } catch (e) {
        await m.reply(eror);
      }
    }
    if (feature == "book") {
      if (!regpdf.test(inputs))
        return m.reply("*أدخل رابط القسم*\n\nمثال:\n\n.fbook book رابط االقسم");
      try {
        let res = await getBooks(inputs);
        let teks = res
          .map((item, index) => {
            return `*[ ${index + 1} ]*
*العنوان:* ${item.title}
*الرابط:* ${item.link}`;
          })
          .filter((v) => v)
          .join("\n________________________\n");
        await m.reply(teks);
      } catch (e) {
        await m.reply(eror);
      }
    }
    if (feature == "aq") {
      try {
        let data = await getAllCategories();

        // قائمة لتخزين الأقسام التي تم إرسالها بالفعل
        let sentSections = [];

        for (let sectionIndex = 0; sectionIndex < data.length; sectionIndex++) {
          let section = data[sectionIndex];

          // التحقق من أن القسم لم يتم إرساله بالفعل وأن اسمه أقل من أو يساوي 15 حرفًا
          if (
            !sentSections.includes(section.title) &&
            section.title.length <= 19
          ) {
            let sectionText = `*[ ${sectionIndex + 1}. ${section.title} ]*\n`;

            for (
              let subSectionIndex = 0;
              subSectionIndex < section.subSections.length;
              subSectionIndex++
            ) {
              let subSection = section.subSections[subSectionIndex];
              sectionText += `${subSectionIndex + 1}. (${subSection.title}) ${
                subSection.link
              }\n`;
            }

            await m.reply(sectionText);

            sentSections.push(section.title);
          }
        }
      } catch (e) {
        await m.reply(eror);
      }
    }
  }
};
handler.help = ["foulabook"];
handler.tags = ["internet"];
handler.command = /^(fbook|foulabook|k4)$/i;
export default handler;

/* New Line */
async function getPdf(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const elements = $(".col-md-4 .col-md-12");

    const dataArray = elements
      .map((index, element) => {
        const ogImage = $('meta[property="og:image"]').attr("content");
        const ogTitle = $('meta[property="og:title"]').attr("content");
        const ogDescription = $('meta[property="og:description"]').attr(
          "content",
        );
        const downloadLink = $(
          'a[href^="https://foulabook.com/book/downloading/"]',
          element,
        ).attr("href");
        const downloadButtonText = $(
          'a[href^="https://foulabook.com/book/downloading/"]',
          element,
        )
          .text()
          .trim();
        const readLink = $(
          'a[href^="https://foulabook.com/ar/read/"]',
          element,
        ).attr("href");
        const readButtonText = $(
          'a[href^="https://foulabook.com/ar/read/"]',
          element,
        )
          .text()
          .trim();

        return {
          ogImage,
          ogTitle,
          ogDescription,
          downloadLink,
          downloadButtonText,
          readLink,
          readButtonText,
        };
      })
      .get();

    return dataArray;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function getQuotes(page) {
  try {
    let url = "https://foulabook.com/ar/quotes";
    if (page !== "") {
      url += `?page=${page}`;
    }
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const results = [];

    $("div.pi-testimonial.pi-testimonial-author-with-photo").each(
      (index, element) => {
        const testimonial = {};
        testimonial.content = $(element)
          .find("div.pi-testimonial-content p")
          .text()
          .trim();
        testimonial.author = {
          name: $(element)
            .find("span.pi-testimonial-author-name strong")
            .text()
            .trim(),
          url: $(element)
            .find("span.pi-testimonial-author-name a")
            .attr("href")
            .trim(),
          photo: $(element)
            .find("span.pi-testimonial-author-photo a img")
            .attr("src"),
        };

        results.push(testimonial);
      },
    );

    return results;
  } catch (error) {
    console.error(error);
  }
}

async function getBooks(url) {
  try {
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const results = [];

    $("figure.animated-overlay").each((index, element) => {
      const book = {};

      const img = $(element).find("img");
      book.imageSrc = img.attr("src");

      const link = $(element).find("a");
      book.link = link.attr("href");

      const title = $(element).next("h5").find("a");
      book.title = title.text();

      results.push(book);
    });

    return results;
  } catch (error) {
    console.error(error);
  }
}

async function getCategory(pageNumber) {
  try {
    const url = `https://foulabook.com/ar/categories?page=${pageNumber}`;
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const results = [];

    $(".row").each((index, element) => {
      const section = {};
      const heading = $(element).find(".v-heading-v2 h3 a");
      section.title = heading.text().trim();
      section.link = heading.attr("href");

      const subSections = [];
      $(element)
        .find(".col-md-3")
        .each((subIndex, subElement) => {
          const link = $(subElement).find(".v-li-v1 a");
          const title = link.find("span").text().trim();
          const subSection = { title, link: link.attr("href") };

          subSections.push(subSection);
        });

      if (subSections.length > 0) {
        section.subSections = subSections;
        results.push(section);
      }
    });

    return results;
  } catch (error) {
    console.error(error);
  }
}

async function getAllCategories() {
  const totalPages = 7; // تحديد عدد الصفحات التي تريد البحث فيها
  const allResults = [];

  for (let page = 1; page <= totalPages; page++) {
    const pageResults = await getCategory(page);
    allResults.push(...pageResults);
  }

  return allResults;
}