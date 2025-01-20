import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

let handler = async (m, {conn, usedPrefix, command}) => {
    try {
        let res = await bimPhotos();
        const maxResults = Math.min(10, res.length);
        for (let i = 0; i < maxResults; i++) {
            let item = res[i];
            await conn.sendFile(m.chat, item.img, m);
        }
    } catch (e) {
        await m.reply("*خطأ:* شي حاجة ماشي هي هاديك.");
    }
}
handler.help = ["bim"];
handler.tags = ["تسوق"];
handler.command = /^(bim)$/i;
export default handler;

async function bimPhotos() {
    try {
        const baseUrl = 'https://www.bim.ma'; // رابط الموقع الأساسي
        const url = baseUrl + `/default.aspx`;
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        const result = [];
        // استخراج مسارات الصور وإكمالها باستخدام الرابط الأساسي
        $('.col-md-12 .carousel.slide .carousel-inner .item img').each((index, element) => {
            const relativePath = $(element).attr('src'); // الرابط النسبي
            const absolutePath = baseUrl + relativePath; // إكمال الرابط
            const card = {
                img: absolutePath, // الرابط المكتمل
            };
            result.push(card);
        });
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}