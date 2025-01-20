import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const maxResults = 25;

const searchJumia = async (command, maxPage = 50) => {
        if (command === 'haw') {
        return [];
    }
    try {
        const result = [];
        let pathUrl;
        if (command === 'haw1') {
            pathUrl = `https://www.jumia.ma/ar/all-products/?sort=lowest-price&price_discount=50-100&page=`;
        } else if (command === 'haw2') {
            pathUrl = `https://www.jumia.ma/ar/all-products/?sort=lowest-price&price_discount=50-100&price=27-6999&page=`;
        } else if (command === 'haw3') {
            pathUrl = `https://www.jumia.ma/ar/all-products/?sort=lowest-price&price_discount=50-100&price=29-6999&page=`;
        } else if (command === 'haw4') {
            pathUrl = `https://www.jumia.ma/ar/all-products/?sort=lowest-price&price_discount=50-100&price=32-6999&page=`;
        } else {
            return [];
        }

        for (let page = 1; page <= maxPage; page++) {
            const url = pathUrl + page;
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);

            $('.prd._fb.col.c-prd').each((index, element) => {
                const card = {
                    name: $(element).find('.name').text().trim(),
                    prc: $(element).find('.prc').text().trim(),
                    dsc: $(element).find('.bdg._dsct._sm').text().trim(),
                    link: 'https://www.jumia.ma/ar' + $(element).find('a').attr('href')
                };
                result.push(card);
            });
        }

        return result;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

const handler = async (m, { args, usedPrefix, text, command }) => {
    try {
              if (command === 'haw') {
            // عرض رسالة فقط بدون البحث
            await conn.sendMessage(m.chat, '*استخدم الأوامر التالية:*\n\n.haw1\n.haw2\n.haw3\n.haw4', MessageType.text);
            return;
        }
        await m.reply(wait);
        const products = await searchJumia(command);
        let response = '';

        if (products.length > 0) {
            response = `قائمة بالمنتجات من جوميا بتخفيض فوق 90% :\n`;
            let filteredProducts = products.filter(product => {
                const dscValue = parseInt(product.dsc);
                return dscValue >= 90 && dscValue <= 99;
            });

            filteredProducts.slice(0, maxResults).forEach((product, index) => {
                response += `*${index + 1}.* ${product.name}\n`;
                response += `*السعر:* ${product.prc}\n`;
                response += `*التخفيض:* ${product.dsc}\n`;
                response += `*الرابط:* ${product.link}\n_____________________\n`;
            });
        } else {
            response = 'عذراً، لم يتم العثور على منتجات.';
        }

        await conn.reply(m.chat, response, m);
    } catch (e) {
        await m.reply("*استخدم الأوامر التالية:*\n\n.haw1\n.haw2\n.haw3\n.haw4");
    }
};

handler.help = ["هوتة"];
handler.tags = ["هو"];
handler.command = /^(haw|haw1|haw2|haw3|haw4)$/i;
export default handler;
