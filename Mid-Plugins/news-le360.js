import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
     conn.le360 = conn.le360 ? conn.le360 : {};
      const res = await allLe360();
      const instructions = "📢 *رد على الرسالة برقم الخبر لعرضه كاملا*";
      const smCaps = '¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ¹⁰ ¹¹ ¹² ¹³ ¹⁴ ¹⁵ ¹⁶ ¹⁷ ¹⁸ ¹⁹ ²⁰';
      const smCapsArray = smCaps.split(' ');
      let teks = res.slice(0, 50).map((item, index) => {
        return `${smCapsArray[index]} ${item.title}`;
      }).join("\n\n");
      const { key } = await m.reply(`${teks}\n\n${instructions}`);
      conn.le360[m.chat] = { list: res, key, timeout: setTimeout(() => { 
m.react('⌛');
conn.sendMessage(m.chat, { delete: key });
delete conn.le360[m.chat]; }, 200 * 1000)};
    
}

handler.before = async (m, { conn }) => {
  conn.le360 = conn.le360 ? conn.le360 : {};

  if (m.isBaileys || !(m.chat in conn.le360)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return; 

  const { list, key } = conn.le360[m.chat];
  const index = parseInt(input);

  const selectedNewsIndex = index - 1;
  if (selectedNewsIndex >= 0 && selectedNewsIndex < list.length) {
    const url = list[selectedNewsIndex].link;
    let item = await readLe360(url);
let cap = `*العنوان:* ${item.title}\n\n*الموضوع:* ${item.content}\n\n${item.content2}`;
    const image = item.image;
    await conn.sendFile(m.chat, image, '', cap, m);

    clearTimeout(conn.le360[m.chat].timeout);
    conn.le360[m.chat].timeout = setTimeout(() => {
        m.react('⌛');
      conn.sendMessage(m.chat, { delete: key });
      delete conn.le360[m.chat];
    }, 200 * 1000);
  }
}

async function readLe360(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();

        const $ = cheerio.load(html);
        $('style').remove();
        const title = $('h1').text().trim();
        const image = 'https://le360.ma/' + $('figure.lead-art-wrapper picture picture source:eq(1)').attr('srcset');
        const content = $('h2.subheadline-container').text().trim().replace(/\./g, '\n\n');
        const content2 = $('article.article-body-wrapper').text().trim().replace(/\./g, '\n\n');

        const article = {
            title, image,
            content,
          content2
        };

        return article;
    } catch (error) {
        console.error('Error:', error);
    }
}
async function allLe360() {
    try {
        const response = await fetch('https://ar.le360.ma/toutes-les-actualites');
        const html = await response.text();

        const $ = cheerio.load(html);
        const result = [];

        $('.col-sm-12.col-md-6.col-lg-3.col-xl-3.top360-item').each((index, element) => {
            const card = {
                title: $(element).find('.top360-item-title').text().trim(),
             link : 'https://ar.le360.ma' + $(element).find('a').attr('href')};

            result.push(card);
        });

        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

handler.command = /^(le360|360)$/i
export default handler
