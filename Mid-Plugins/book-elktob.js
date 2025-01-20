import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';

async function searchBook(q, maxResults = 10) {
  try {
    const response = await fetch('https://www.elktob.online/search/' + q);
    const html = await response.text();
    const $ = cheerio.load(html);
    const result = [];

    $('div.col-lg-2.col-md-6.mb-4.bookMob').each((index, element) => {
      if (index < maxResults) {
      const title = $(element).find('h4.card-title').text().trim();
      const link = $(element).find('a').attr('href');
      const author = $(element).find('.card-text').text().trim();
      result.push({
        title,
        link,
        author
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
    const body = await response.text();
    const $ = cheerio.load(body);

    const buttonOnClick = $('button#downloadbt').attr('onclick');
    const match = /location.href='(.+?)'/.exec(buttonOnClick);
    const downloadLink = match ? match[1] : null;
    const title = $('div.col-lg-12 h2').text().trim();

    if (downloadLink) {
      console.log('Download link:', downloadLink);
    } else {
      console.error('Download link not found');
    }

    return { title, downloadLink };
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
}

let handler = async (m, { conn, text, command }) => {
  const inputs = text.trim().split(' ');
  if (text.length === 0 && (command === 'ktb' || command === 'elktob' || command === 'k3')) {
    // إذا كان المدخل يحتوي على الأمر فقط وبدون نص إضافي
    await m.reply("• *للبحث عن كتاب*:\nــــــــــــــــــــ\n  _أكتب إسم الكتاب بعد الأمر_\n*مثال:*\n.ktb في المنزل المجاور\n\n• *لتحميل الكتاب*:\nــــــــــــــــــــ\n _أدخل رابط الكتاب بعد الأمر_\n*مثال:*\n.ktb https://www.elktxxx*");
    await m.reply("*إليك أبرز 20 كتب في الموقع:*");
  }
    if (inputs[0].startsWith("https://www.elktob.online") || inputs[0].startsWith(" https://www.elktob.online")) {
      try {
        let pdfLink = await downloadBook(inputs[0]);
        if (pdfLink.downloadLink) {
        let res = await fetch(pdfLink.downloadLink);
        let  redirectUrl = pdfLink.downloadLink
        const contentType = res.headers.get('content-type')
let filename = '';

const pdfMatch = redirectUrl.match(/\/([^/]+\.pdf)$/);
if (pdfMatch) {
    filename = decodeURIComponent(pdfMatch[1]); // لفك ترميز النص إذا كان مشفرًا
}

// ngendaliin konten tipe yang bisa aja berbeda
if (/^application\/pdf/.test(contentType)) {
    let pdfBuffer = await res.buffer();
    conn.sendFile(m.chat, pdfBuffer, filename, null, m);
        }  
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        let searchQuery = inputs.join('-');
        let res = await searchBook(searchQuery);
        if (res.length === 0) {
  return m.reply("لا توجد نتائج للكتاب الذي تبحث عنه");
}
let teks = res.map((item, index) => {
          let downloadLink = item.link.replace('/book/', '/download/');
          return `*[ النتيجة ${index + 1} ]*
  *العنون:* ${item.title}
  *المؤلف:* ${item.author}
  *الرابط:* ${downloadLink}`;
        }).filter(v => v).join("\n________________________\n");

        await m.reply(teks);
      } catch (e) {
        console.error(e);
        await m.reply("error occurred.");
      }
  }
};

handler.help = ["ktab", "riwaya"];
handler.tags = ["internet"];
handler.command = /^(elktob|ktb|k3)$/i;
export default handler;