import fetch from 'node-fetch'
import * as cheerio from 'cheerio';

const handler = async (m, { conn, mText }) => {
  conn.Pharmacie = conn.Pharmacie ? conn.Pharmacie : {};
  const res = await dwa(mText);
  const instructions = "📢 *رد على الرسالة برقم الدواء لعرضه كاملا*";
  const smCaps = '¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ¹⁰ ¹¹ ¹² ¹³ ¹⁴ ¹⁵ ¹⁶ ¹⁷ ¹⁸ ¹⁹ ²⁰';
  const smCapsArray = smCaps.split(' ');
  let teks = res.slice(0, 50).map((item, index) => {
    return `${smCapsArray[index]} ${item.name} - ${item.prix} Dhs`;
  }).join("\n\n");
  const { key } = await m.reply(`${teks}\n\n${instructions}`);
  conn.Pharmacie[m.chat] = { list: res, key, timeout: setTimeout(() => { delete conn.Pharmacie[m.chat]; }, 600 * 1000)};
}
handler.before = async (m, { conn }) => {
  conn.Pharmacie = conn.Pharmacie ? conn.Pharmacie : {};

  if (m.isBaileys || !(m.chat in conn.Pharmacie)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return; 

  const { list, key } = conn.Pharmacie[m.chat];
  const index = parseInt(input);

  const selectedNewsIndex = index - 1;
  if (selectedNewsIndex >= 0 && selectedNewsIndex < list.length) {
    const url = list[selectedNewsIndex].link;
    let item = await dwar(url);

    // تحويل محتوى item.content إلى نص منسق
    let contentText = Object.entries(item.content)
      .map(([field, value]) => `• *${field}:* ${value}`)
      .join('\n');
 let a = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ar&dt=t&q=${contentText}`)
      a = await a.json()  
      a = a[0][0][0]
 let aar = a.replace(/•/g, '•\n'); 
 let tit = `〝 *${item.title}* 〞`;
    await conn.sendMessage(m.chat, { text: tit + '\n\n' + contentText + '\n\n' + aar }, { quoted: null });


    clearTimeout(conn.Pharmacie[m.chat].timeout);
    conn.Pharmacie[m.chat].timeout = setTimeout(() => {
      delete conn.Pharmacie[m.chat];
    }, 300 * 1000);
  }
}
handler.customPrefix = /^(dwa|pharm|دواء)(\s|$)/i;
handler.command = new RegExp
export default handler

async function dwar(url) { 
    try {
        const response = await fetch(url);
        const html = await response.text();

      const $ = cheerio.load(html);
      $('script').remove();
      $('style').remove();

      const header = $('.col-md-9');
      const title = header.find('.single.single-medicament h3').text().trim();

      const article = { title, content: {} };

      header.find('table.table-details tbody tr').each((index, element) => {
        const field = $(element).find('td.field').text().trim();
        const value = $(element).find('td.value').text().trim();
        article.content[field] = value;
      });

      return article;

    } catch (error) {
        console.error('Error:', error);
    }
}

async function dwa(q){
  let url = `https://medicament.ma/?choice=specialite&keyword=contains&s=${encodeURIComponent(q)}`
let res = await fetch(url)
const html = await res.text();
const $ = cheerio.load(html);
  const result = [];

  $('.search-results table tbody tr').each((index, element) => {
      const details = $(element).find('td a span.details').text().trim();
      const name = details.split('\n')[0].trim();
      const prixText = $(element).find('td a span.small').text().trim();
      const prixMatch = prixText.match(/PPV: ([\d.]+) dhs/);
      const prix = prixMatch ? prixMatch[1] : 'N/A';
      const link = $(element).find('td a').attr('href');

      let d = { name, prix, link };
      result.push(d);
  });

  return result;

}
