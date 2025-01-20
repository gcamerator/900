import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const maxResults = 20;

const searchJumia = async ( prix0 = args[0], prix1 = args[1], maxPage = 1) => {
    try {
        const result = [];

        for (let page = 1; page <= maxPage; page++) {
            const url = `https://www.jumia.ma/ar/all-products/?sort=lowest-price&price=${prix0}-${prix1}`;
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

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    try {
if (args.length === 0) { // إذا لم يتم إدخال أي قيمة
    await conn.reply(m.chat, `يمكنك استخدام الأمر بهذا الشكل أو بتحديد الثمن:\n\n*مثال 1:*\n*${usedPrefix}dh*\n\n*مثال 2:*\n*${usedPrefix}dh <الثمن>*\n\n*مثال 3:*\n*${usedPrefix}dh <أعلى الثمن> <أدنى الثمن>*`, m);
}

        let prix0 = 0;
        let prix1 = 1;

        if (args.length === 1) {
            prix0 = prix1 = args[0];
        } else if (args.length === 2) {
            prix0 = args[0];
            prix1 = args[1];
        }

        const products = await searchJumia(prix0, prix1);

        let response = '';

        if (products.length > 0) {
            response = `*قائمة بالمنتجات من جوميا بين ${prix0} و ${prix1} درهم:*\n`;
            products.slice(0, maxResults).forEach((product, index) => {
                response += `__________________\n`;
                response += `\n${index + 1}. ${product.name}\n`;
                response += `\n*💰 Prix:* ${product.prc}\n`;

                if (product.dsc) {
                    response += `🎟 *Réduction:* ${product.dsc}\n`;
                } else {
                    response += ``}

                response += `\n🧲 *Lien:* ${product.link}\n`;
            });
        } else {
            response = 'لم يتم العثور على منتجات.';
        }

        await conn.reply(m.chat, response, m);
    } catch (e) {
        console.error('Error:', e);
        await conn.reply(m.chat, "*خطأ:* حدث خطأ أثناء البحث عن المنتجات.", m);
    }
};

handler.help = ["هوتة"];
handler.tags = ["هو"];
handler.command = /^(jumiadh|1dh|jdh|dh)$/i;
export default handler; 