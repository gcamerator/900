import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
const maxResults = 30;
const searchJumi = async (minDiscount = 40, maxPage = 15) => {
    try {
        const result = [];
        for (let page = 1; page <= maxPage; page++) {
            const url = `https://www.jumia.ma/ar/epicerie/?sort=lowest-price&price_discount=40-100&shop_premium_services=shop_express&page=${page}`;
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);
            $('.prd._fb.col.c-prd').each((index, element) => {
                const card = {
                    name: $(element).find('.name').text().trim(),
                    prc: $(element).find('.prc').text().trim(),
                    img: $(element).find('.img-c .img').attr('data-src'),
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


const handler = async (m, {conn, args, usedPrefix, text, command}) => {
    try {
      if (args.length === 0) { // إذا لم يتم إدخال أي قيمة
          await conn.reply(m.chat, `*أدخل نسبة التخفيض:*\n\n*مثال:*\n\n*.jmarket 50*`, m); return;
      }
        await m.reply(wait);
        let minDiscount = 70; // القيمة الافتراضية إذا لم يتم تحديدها في الأمر
        if (args.length > 0) {
            minDiscount = parseInt(args[0]);
            if (isNaN(minDiscount) || minDiscount < 0 || minDiscount > 99) {
                await m.reply("يرجى تقديم قيمة خصم صحيحة بين 0 و 99.");
                return;}}
        const products = await searchJumi(minDiscount);
        let response = '';
        if (products.length > 0) {
            response = `*🍱 منتجات المارشي بتخفيض فوق ${minDiscount}%:*\n`;
            let filteredProducts = products.filter(product => {
                const dscValue = parseInt(product.dsc);
                return dscValue >= minDiscount && dscValue <= 99;
            });
            filteredProducts.slice(0, maxResults).forEach((product, index) => {
                response += `__________\n[${index + 1}]. ${product.name}\n`;
                response += `💰 *الثمن:* ${product.prc}\n`;
              //  response += `*التخفيض:* ${product.dsc}\n`;
                //  response += `الصورة: ${product.img}\n`;
                response += `🖱️ *الرابط:* ${product.link}\n`;
            });
        } else {
            response = 'عذراً، لم يتم العثور على منتجات.';
        }
        await conn.reply(m.chat, response, m);
    } catch (e) {
        await m.reply("*خطأ:* حدث خطأ أثناء البحث عن المنتجات.");}
};
handler.help = ["مارشي"];
handler.tags = ["مارشي"];
handler.command = /^(jmarket|jmarche|jm|jsm)$/i;
export default handler;