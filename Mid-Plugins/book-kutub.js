import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
let handler = async (m, { conn, text, command }) => {
    // إذا كان المدخل يحتوي على الأمر فقط وبدون نص إضافي
    let tks = `*هذه أكثر الكتب تحميلا*\n\n‏• *للبحث عن كتاب*:\nــــــــــــــــــــ\n  _أكتب إسم الكتاب بعد الأمر_\n*مثال:*\n.${command} في المنزل المجاور\n\n‏• *لتحميل الكتاب*:\nــــــــــــــــــــ\n _أدخل رابط الكتاب بعد الأمر_\n*مثال:*\n.${command} https://www.kutub-pdf-ar.com*`;

    if (text.startsWith("https://www.kutub-pdf-ar.com")) {
      try {
        let url = text;
        let res = await downloadBook(url);
        await m.reply(`*تم تحميل ${res.title} بنجاح ✅*`)
        await conn.sendFile(m.chat, res.fileContent, `${res.title}.pdf`, '', m);
      } catch (e) {
        console.error(e);
        await m.reply("حدث خطأ أثناء تحميل الملف.");
      }
    } else {
      try {
        if (text.length === 0) {
          const res = await searchBook();
 const teks = res.map((item, index) => {
        return `*[ ${index + 1} ]*
        *العنون:* ${item.title}
        *الرابط:* ${item.link}`;
                                   }).filter(v => v).join("\n________________________\n");
  await m.reply(teks);
await m.reply(tks);
        } else {
          const res = await searchBook(text);
        const teks = res.map((item, index) => {
          return `*[ ${index + 1} ]*
  *العنون:* ${item.title}
  *الرابط:* ${decodeURI(item.link)}`;
        }).filter(v => v).join("\n________________________\n");
        await m.reply(teks);}
      } catch (e) {
        console.error(e);
        await m.reply("حدث خطأ أثناء البحث.");
      }
    }
};

handler.help = ["ktab", "riwaya"];
handler.tags = ["internet"];
handler.command = /^(kk)$/i;
export default handler;


async function searchBook(text, maxResults = 20) {
  try {
    const response = await fetch(`https://www.kutub-pdf-ar.com/?s=${encodeURIComponent(text)}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    const result = [];

    $('article.type-post').each((index, element) => {
      if (index < maxResults) {
        const title = $(element).find('h2.title a').text().trim();
        const link = $(element).find('h2.title a').attr('href');
        result.push({
          title,
          link,
        });
      }
    });

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
    const downloadLink = $('a.wpdm-download-link').attr('data-downloadurl');
    const title = $('h2.bs-shortcode-alert span').text().trim().replace(/\تحميل رواية /g, '');

    if (downloadLink) {
      const downloadResponse = await fetch(downloadLink);

      if (downloadResponse.ok) {
        const fileContent = await downloadResponse.buffer();
        return {
          fileContent,
          title: title,
        };
      }
    }

    throw new Error('فشل تحميل الملف.');
  } catch (error) {
    console.error(error);
    throw error;
  }
}
