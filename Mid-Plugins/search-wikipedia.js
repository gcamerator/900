import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

let handler = async (m, {
    text,
    usedPrefix,
    command
}) => {
    let image = 'https://telegra.ph/file/9c2801a3ce54201f49266.png' 
    if (!text) throw `أمثلة على الاستخدام\n\n${usedPrefix + command} العدالة`
    await m.reply(wait)

    try {
        let item = await Wikipedia(text)
        let caption = `${site}
        
📰 *العنوان:* ${item.title || 'غير معروف'}

📝 *الموضوع:* ${item.content || 'غير معروف'}

🗂️ *معومات:* ${item.infoTable || '--'}
`
  if (item.image) {
          await conn.sendFile(m.chat, image, '', caption, m);
      } else {
          // إذا لم تكن هناك صورة، ارسل النص دون صورة
          await conn.sendFile(m.chat, image, '', caption, m);
      }
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ['wikipedia'].map(v => v + ' <apa>')
handler.tags = ['edukasi']
handler.command = /^(wiki|wikipedia)$/i

export default handler

async function Wikipedia(query) {
    const response = await fetch(`https://ar.wikipedia.org/w/index.php?search=${query}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    const contentArray = [];
    $('div.mw-parser-output p').each((index, element) => {
        contentArray.push($(element).text().trim());
    });

    const infoTable = [];
    $('table.infobox tr').each((index, element) => {
        const label = $(element).find('th.infobox-label').text().trim();
        const value = $(element).find('td.infobox-data').text().trim() || $(element).find('td.infobox-data a').text().trim();
        if (label && value) {
            infoTable.push(`${label}: ${value}`);
        }
    });

    const data = {
        title: $('title').text().trim(),
        content: contentArray.join('\n'), // Menggabungkan konten menjadi satu string dengan newline separator
        image: 'https:' + ($('#mw-content-text img').attr('src') || '//pngimg.com/uploads/wikipedia/wikipedia_PNG35.png'),
        infoTable: infoTable.join('\n') // Menggabungkan infoTable menjadi satu string dengan newline separator
    };

    return data;
};