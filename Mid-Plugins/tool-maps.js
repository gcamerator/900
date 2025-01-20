import axios from 'axios';
import * as cheerio from 'cheerio';

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0';

async function mapcity(cityA, cityB) {
    let html = (await axios.get(`https://www.google.co.ma/search?gl=MA&q=${encodeURIComponent('من ' + cityA + ' إلى ' + cityB)}&hl=ar`, {
        headers: {'User-Agent': userAgent}
    })).data;
    let $ = cheerio.load(html);
    let obj = {};

    let img = html.split("var s=\'")?.[1]?.split("\'")?.[0];
    obj.img = /^data:.*?\/.*?;base64,/i.test(img) ? Buffer.from(img.split(',')[1], 'base64') : '';
    
    obj.captions = [];
    $('div.BbbuR.uc9Qxb.uE1RRc').each((index, element) => {
        let caption = $(element).text()?.trim();
        obj.captions.push(caption);
    });

    return obj;
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    let [cityA, cityB] = text.split(' ');
    if (!cityA || !cityB) throw `*مثال لطريقة الإستخدام:*\n\n${usedPrefix + command} Agadir Oujda`;
    
    if (cityA.toLowerCase() === cityB.toLowerCase()) {
        return;
    }
let txt = '🛣️ *المسافة والمدة بين المدينتين هي:*';
let result = await mapcity(cityA, cityB);
let cap = result.captions.map(caption => `-----------------\n🚗 *${caption}*`);

if (result.img) {
    let imgBuffer = Buffer.from(result.img, 'base64');

    conn.sendMessage(
        m.chat,
        { image: imgBuffer, caption: txt + '\n' + cap.join('\n')},
        { quoted: m }
    );
} else {
    conn.reply(m.chat, txt + '\n' + cap.join('\n') + `\n\n${site}`, m);
}
};
handler.command = /^(gmaps|maps)$/i;

export default handler;
