import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, command }) => {

let tks = `*هذه أكثر الكتب تحميلا*\n\n‏• *للبحث عن كتاب*:\nــــــــــــــــــــ\n  _أكتب إسم الكتاب بعد الأمر_\n*مثال:*\n.${command} في المنزل المجاور\n\n‏• *لتحميل الكتاب*:\nــــــــــــــــــــ\n _أدخل رابط الكتاب بعد الأمر_\n*مثال:*\n.${command} https://www.kutubypdf.com`

    if (text.startsWith("https://www.kutubypdf.com")) {
      let url = text;
      try {
        let res = await downloadBook(url);
        await m.reply(`*تم تحميل ${res.title} بنجاح ✅*`)
        await conn.sendFile(m.chat, res.link, `${res.title}.`,  ``, m)
      } catch (e) {
        console.error(e);
        await m.reply(e);
      }
    }
    else {
      try {
        if (!text) {
          let url = "https://www.kutubypdf.com/popular-books/";
                   const res = await popBook(url);
                           const teks = res.map((item, index) => {
return `*[ ${index + 1} ]*
*العنون:* ${item.title}
*الرابط:* ${item.link}`;
                           }).filter(v => v).join("\n________________________\n");
                           await m.reply(teks);
          await m.reply(tks);
                   }  else {
        const res = await searchBook(text);
        const teks = res.map((item, index) => {
          return `*[ ${index + 1} ]*
*العنون:* ${item.title}
*الرابط:* ${item.link}`;
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
handler.command = /^(kutuby|k6)$/i;
export default handler;

async function popBook(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const result = [];

    $('.container-fluid .col a').each((index, element) => {
      const title = $(element).text().trim();
      const link = $(element).attr('href');
      if (title && link) {
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
async function searchBook(text, maxResults = 12) {
  try {
    const response = await fetch(`https://www.kutubypdf.com/?s=${encodeURIComponent(text)}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    const result = [];

    $('.row .col-sm-4.col-md-3').each((index, element) => {
      if (index < maxResults) {
        const title = $(element).find('.card .card-body h2').text().trim();
        const link = $(element).find('.card .card-body a').attr('href');
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
  const base = 'https://www.kutubypdf.com';
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const ulink = $('.entry-content .row a.btn').attr('href');
    const dlink = base + ulink;
    const response2 = await fetch(dlink);
    const html2 = await response2.text();
    const $$ = cheerio.load(html2);
    const link = $$('main article .row a.m-1').attr('href');
    const title = $$('main h1').text().trim().replace(/\رابط تحميل /g, '');
    return { link, title };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
