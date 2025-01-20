import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  conn.ledouzd = conn.ledouzd ? conn.ledouzd : {};

  const res = await allelledouz();
  const instructions = "📢 *رد على الرسالة برقم الخبر لعرضه كاملا*";

  const smCaps = '¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ¹⁰ ¹¹ ¹² ¹³ ¹⁴ ¹⁵ ¹⁶ ¹⁷ ¹⁸ ¹⁹ ²⁰ ²¹ ²² ²³ ²⁴ ²⁵ ²⁶ ²⁷ ²⁸ ²⁹ ³⁰ ³¹ ³² ³³ ³⁴ ³⁵ ³⁶ ³⁷ ³⁸ ³⁹ ⁴⁰ ⁴¹ ⁴² ⁴³ ⁴⁴ ⁴⁵ ⁴⁶ ⁴⁷ ⁴⁸ ⁴⁹ ⁵⁰ ⁵¹ ⁵² ⁵³ ⁵⁴ ⁵٥ ⁵٦ ⁵٧ ⁵٨ ⁵٩ ⁶٠';
  const smCapsArray = smCaps.split(' ');

  let teks = res.slice(0, 50).map((item, index) => {
    return `${smCapsArray[index]} *[${item.date}]* ${item.title}`;
  }).join("\n\n");

  const { key } = await m.reply(`${teks}\n\n${instructions}`);

  // قم بتخزين بيانات القرآن في متغير conn.ledouzd للاستخدام لاحقًا
  conn.ledouzd[m.chat] = { list: res, key, timeout: setTimeout(() => { conn.sendMessage(m.chat, { delete: key }); delete conn.ledouzd[m.chat]; }, 60 * 1000)};
}

handler.before = async (m, { conn }) => {
  conn.ledouzd = conn.ledouzd ? conn.ledouzd : {};

  if (m.isBaileys || !(m.chat in conn.ledouzd)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return; 

  const { list, key } = conn.ledouzd[m.chat];
  const index = parseInt(input);

  const selectedNewsIndex = index - 1;
  if (selectedNewsIndex >= 0 && selectedNewsIndex < list.length) {
    const url = list[selectedNewsIndex].link;
    console.log(url);
    let item = await readelledouz(url);
    let cap = `${item.content}`;
    const image = item.image;
    const imageRelativeSrc = image;
    const baseUrl = 'https:';
    const fullImageUrl = baseUrl + imageRelativeSrc;

    await conn.sendFile(m.chat, image, '', cap, m);
 //  await conn.sendMessage(m.chat, { delete: key });

    // تعديل توقيت الحذف إلى دقيقتين بدلاً من دقيقة واحدة
    clearTimeout(conn.ledouzd[m.chat].timeout);
    conn.ledouzd[m.chat].timeout = setTimeout(() => {
      conn.sendMessage(m.chat, { delete: key });
      delete conn.ledouzd[m.chat];
    }, 1 * 60 * 1000);
  }
}

async function allelledouz() {
  try {
    const response = await fetch('https://www.le12.ma/');
    const html = await response.text();
    const $ = cheerio.load(html);
    const result = [];

    $('.row .col-300 .flash-news article.post').each((index, element) => {
        const card = {
            title: $(element).find('a h3.entry-title').text(), 
            date: $(element).find('a span.entry-time').text(),
            link: $(element).find('a').attr('href')
        };
        result.push(card);
    });
    return result;
  } catch (error) {
    console.error('Error in allelledouz:', error);
    throw error;
  }
}

async function readelledouz(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    $('script').remove();
    $('style').remove();
    const header = $('.entry-header');
    const title = header.find('h1').text().trim();
    const image = $('.content-area main article .featured-image img').attr('src');
    const image2 = $('.entry-content p img').attr('src');
    const content = $('.entry-content').text().trim().replace(/\./g, '.\n\n');
    const article = {
      title,
      image: image2 || image,
      content
    };
    return article;

  } catch (error) {
    console.error('Error in readelledouz:', error);
    throw error;
  }
}

handler.help = ["elledouz"]
handler.tags = ["internet"]
handler.command = /^(le12|le12ma)$/i
export default handler;
