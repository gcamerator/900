import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.cook = conn.cook ? conn.cook : {};
  const res = await searchCook(text);
  const instructions = "📢 *رد على الرسالة برقم الخبر لعرضه كاملا*";
  const smCaps = '¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ¹⁰ ¹¹ ¹² ¹³ ¹⁴ ¹⁵ ¹⁶';
  const smCapsArray = smCaps.split(' ');
let teks = res.slice(0, 15).map((item, index) => {
    return `${smCapsArray[index]} *${item.name}*\n${item.dsc.replace(/,\s*/g, ', ')}`;
}).join("\n\n");
  const { key } = await m.reply(`${teks}\n\n${instructions}`);
  conn.cook[m.chat] = { list: res, key, timeout: setTimeout(() => {  
    delete conn.cook[m.chat]; }, 220 * 1000)};
}

handler.before = async (m, { conn }) => {
  conn.cook = conn.cook ? conn.cook : {};

  if (m.isBaileys || !(m.chat in conn.cook)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return; 

  const { list, key } = conn.cook[m.chat];
  const index = parseInt(input);

  const selectedNewsIndex = index - 1;
  if (selectedNewsIndex >= 0 && selectedNewsIndex < list.length) {
    const url = list[selectedNewsIndex].link;
    let a = await readCook(url);
        const cap = `
🍲 *الوصفة:* *${a.title}*\n
🍱 *المقادير:* \n${a.ingr}\n
🫕 *الخطوات:* \n${a.rece}`;
      await conn.sendFile(m.chat, a.image, '', cap, m);

    clearTimeout(conn.cook[m.chat].timeout);
    conn.cook[m.chat].timeout = setTimeout(() => {
      delete conn.cook[m.chat];
    }, 5 * 60 * 1000);
  }
}
handler.command = /^(cook|cok|طبخ|كوزينة)$/i;
export default handler;


async function searchCook(text) {
  try {
    const response = await fetch(`http://cookpad.com/ma/search/${text}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    const result = [];
    $('div.relative ul li.block-link.card').each((index, element) => {
      const card = {
        name: $(element).find('.flex.justify-between h2 a').text().trim(),
        dsc: $(element).find('.flex.justify-between div div.line-clamp-3').text().trim().replace('  ', ''),
        link: 'http://cookpad.com' + $(element).find('.flex.justify-between h2 a').attr('href')
      };
      
      result.push(card);
    });
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function readCook(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    $('script').remove();
    $('style').remove();
    const image = $('meta[property="og:image"]').attr('content');
    const title = $('meta[property="og:title"]').attr('content');
    const ingr = $('#ingredients .ingredient-list ol li').map((index, element) => {
    const ingredient = $(element).text().trim();
    return `${index + 1}. ${ingredient}`;
    }).get().join('\n');
const rece = $('#steps ol.list-none li.step.mb-rg').map((index, element) => {
    const receps = $(element).find('div[dir="auto"] p').text().trim();
    return `${index + 1}. ${receps}`;
}).get().join('\n');
    const article = {
      title,
      image,
      ingr,
      rece
    };
    return article;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
