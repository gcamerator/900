import * as cheerio from 'cheerio';
import fetch from "node-fetch";

let handler = async (m, { conn, text, command }) => {
  let tks = `*هذه أكثر الكتب تحميلا*\n\n‏• *للبحث عن كتاب*:\nــــــــــــــــــــ\n  _أكتب إسم الكتاب بعد الأمر_\n*مثال:*\n.${command} في المنزل المجاور\n\n‏• *لتحميل الكتاب*:\nــــــــــــــــــــ\n _أدخل رابط الكتاب بعد الأمر_\n*مثال:*\n.${command} https://kutub.talalm.com*`;

  if (text.startsWith("https://kutub.talalm.com/")) {
    try {
      let url = text;
      let res = await downloadBook(url);
      await conn.sendFile(m.chat, res.fileContent, `${res.title}.pdf`, "", m);
    } catch (e) {
      console.error(e);
      await m.reply("حدث خطأ أثناء تحميل الملف.");
    }
  } else {
    try {
      const res = await searchBook(text);
      const teks = res
        .map((item, index) => {
          // التحقق من وجود قيمة للعنوان قبل إضافته إلى الرسالة
          const titleText = item.title
            ? `*العنوان:* ${item.title}`
            : "*العنوان:* غير متوفر";
          return `*[ ${index + 1} ]*
${titleText}
*الرابط:* https://kutub.talalm.com/download/?book_id=${decodeURI(item.link)}`;
        })
        .filter((v) => v)
        .join("\n________________________\n");

      if (teks.trim().length > 0) {
        await m.reply(teks);
      } else {
        await m.reply("للأسف، لم يتم العثور على نتائج.");
      }
    } catch (e) {
      console.error(e);
      await m.reply("حدث خطأ أثناء البحث.");
    }
  }
};

handler.help = ["ktab", "riwaya"];
handler.tags = ["internet"];
handler.command = /^(kotob|k5)$/i;
export default handler;

async function searchBook(text) {
  try {
    const response = await fetch(
      `https://kutub.talalm.com/?s=${encodeURIComponent(text)}`,
    );
    const html = await response.text();
    const $ = cheerio.load(html);
    const result = [];

    $(".p-2.p-md-3.p-lg-5 .container .row.gy-3 .col-12").each(
      (index, element) => {
        const title = $(element).find("a").attr("title").replace(/تنزيل/g, "");
        const rawLink = $(element).find("div").attr("id").replace(/book-/g, "");

        // التحقق من عدم وجود "post-" في الرابط أو "book_author-"
        const link =
          rawLink &&
          !(
            /post-/i.test(rawLink) ||
            /book_author-/i.test(rawLink) ||
            /publisher-/i.test(rawLink)
          )
            ? rawLink
            : null;

        if (link) {
          result.push({
            title,
            link,
          });
        }
      },
    );

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function downloadBook(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const dLink = $(
      ".col-lg-8 .cardd.mb-4 .cardd-body .fg-download-timer a",
    ).attr("href");
    const title = $(".col-lg-8 .cardd.mb-4 .cardd-body h6.cardd-title.d-block")
      .text()
      .trim()
      .replace(/تنزيل/g, "");

    return { fileContent: dLink, title };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
