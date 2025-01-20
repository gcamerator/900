import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.chomicha = conn.chomicha ? conn.chomicha : {};
 if(!text && !isNaN(text)) return m.reply(`*أدخل إسم الوصفة أو رقم:*\n\n*مثال:*\n\n${usedPrefix + command} *مطيشة*\n${usedPrefix + command} *4*`)
  let res;
  if(isNaN(text)){
  res = await searchCook(`https://www.choumicha.ma/ar/Search.html?searchphrase=all&searchword=${text}`);
  } else {
  res = await home(`https://www.choumicha.ma/ar/home-recipes/-${text}.html`)
  }
  const instructions = "📢 *رد على الرسالة برقم الوصفة لعرضها*";
  const smCaps = '¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ¹⁰ ¹¹ ¹² ¹³ ¹⁴ ¹⁵ ¹⁶ ¹⁷ ¹⁸ ¹⁹';
  const smCapsArray = smCaps.split(' ');
let teks = res.slice(0, 19).map((item, index) => {
    return `${smCapsArray[index]} *${item.title}* `;
}).join("\n\n");
  const { key } = await m.reply(`${teks}\n\n${instructions}`);
  conn.chomicha[m.chat] = { list: res, key, timeout: setTimeout(() => {  
    delete conn.chomicha[m.chat]; }, 220 * 1000)};
}

handler.before = async (m, { conn }) => {
  conn.chomicha = conn.chomicha ? conn.chomicha : {};

  if (m.isBaileys || !(m.chat in conn.chomicha)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return; 

  const { list, key } = conn.chomicha[m.chat];
  const index = parseInt(input);

  const selectedNewsIndex = index - 1;
  if (selectedNewsIndex >= 0 && selectedNewsIndex < list.length) {
    const url = list[selectedNewsIndex].link;
    let a = await readCook(url);
        const cap = `
📜 *المعلومات:*\n${a.type}\n
🍲 *الوصفة:* *${a.title}*\n
🍱 *المقادير:* \n${a.ingr}\n
🫕 *الخطوات:* \n${a.rece}`;
      await conn.sendFile(m.chat, a.image, '', cap, m);

    clearTimeout(conn.chomicha[m.chat].timeout);
    conn.chomicha[m.chat].timeout = setTimeout(() => {
      delete conn.chomicha[m.chat];
    }, 5 * 60 * 1000);
  }
}
handler.command = /^(chomicha|شوميشة|choumicha|شميشة)$/i;
export default handler;

async function home() {
  try {
    const response = await fetch('https://www.choumicha.ma/ar/accueil-recettes.html');
    const html = await response.text();
    const $ = cheerio.load(html);
    const result = [];
    $('.yoorecipe-cont-results .span4').each((index, element) => {
      const card = {
        link: 'https://www.choumicha.ma' + $(element).find('div a').attr('href'),
        title: $(element).find('div a img').attr('title')
      };

      result.push(card);
    });
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function searchCook(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const result = [];
    $('div.list-recettes-search .items .list_items ul.search-results li.uk-width-medium-1-3').each((index, element) => {
      const card = {
        link: 'https://www.choumicha.ma' + $(element).find('.uk-grid .uk-width-medium-3-4 h2.uk-h3 a').attr('href'),
        title: $(element).find('.uk-grid .uk-width-medium-3-4 h2.uk-h3 a').attr('title')
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
//    $('script').remove();
    $('style').remove();
    const image = 'https://www.choumicha.ma' + $('div.row-fluid.hrecipe ul.recette_divider li a img').attr('src');
    const type = $('div.row-fluid.hrecipe ul.recipe-info li').map((index, element) => {
    const info = $(element).find('strong').text().trim();
    const infoo = $(element).find('span').text().trim();
      if(info){
      return `• *${info}* ${infoo}`;}
      }).get().join('\n');
      
    const title = $('meta[property="og:title"]').attr('content');
    const ingr = $('div.ingredients ul.unstyled li').map((index, element) => {
      const ingredient = $(element).find('.name').text().trim();
      return `• ${ingredient}`;
    }).get().join('\n');
    const rece = $('li.recette_details .preparation ul li').map((index, element) => {
      const receps = $(element).text().trim();
    return `*${index + 1}.* ${receps}`;
    }).get().join('\n');
    const article = {
      title,
      image,
      ingr,
      rece, type
    };
    return article;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
