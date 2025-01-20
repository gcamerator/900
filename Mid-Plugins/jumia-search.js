import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const translations = {
    "Dhs": "درهم",
};

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    let isRatingSearch = false; // تعيين متغير للتحقق من بحث التصنيف
    let searchText = text.trim(); // استخدم النص الأصلي للبحث

    // إذا كان النص يبدأ بـ "+"، قم بإزالة الرمز وتعيين المتغير للبحث بالتصنيف
    if (searchText.startsWith("x")) {
      searchText = searchText.replace(/\x/g, '');
        isRatingSearch = true;
        searchText = searchText.substring(1).trim();
    }

    if (!searchText) return m.reply("حط سميت داكشي لي كاتقلب عليه.");

    try {
        let res = await searchJumia(searchText, isRatingSearch);

        if (res.length === 0) {
            return m.reply("*مالقيت حتى حاجة بهاد الاسم* ☹️");
        }

        const maxResults = Math.min(10, res.length);
        let message = ''; // سلسلة النص التي ستحتوي على النتائج

        for (let i = 0; i < maxResults; i++) {
            let item = res[i];
            let translatedPrice = translate(item.prc);
            // إضافة معلومات النتيجة الحالية إلى سلسلة النص
            message += `*[ ${i + 1} ] ᵐⁱᵈˢᵒᵘⁿᵉ*\n`;
            message += `*🛒 الاسم:* ${item.name}\n\n`;
            message += `*💰 الثمن:* ${translatedPrice} • ${item.dsc}\n\n`;
            message += `🔗 *الرابط:* ${item.link}\n_____________________\n`;
        }
        m.reply(message);

    } catch (e) {
        await m.reply("خطأ: شي حاجة ماشي هي هاديك");
    }
}

handler.help = ["جوميا"];
handler.tags = ["تسوق"];
handler.command = /^(جوميا|jumia)$/i;
export default handler;

async function searchJumia(keywords, isRatingSearch) {
    try {
        keywords = keywords.replace(" ", "+");
        const url = isRatingSearch
            ? `https://www.jumia.ma/catalog/?q=${keywords}&rating=1-5`
            : `https://www.jumia.ma/catalog/?q=${keywords}`;

        const response = await fetch(url);
        const html = await response.text();

        const $ = cheerio.load(html);
        const result = [];
      
        $('.prd._fb.col.c-prd').each((index, element) => {
            const card = {
                name: $(element).find('.name').text().trim(),
                prc: $(element).find('.prc').text().trim(),
                img: $(element).find('.img-c .img').attr('data-src'),
                dsc: $(element).find('.bdg._dsct._sm').text().trim(),
                link: 'https://www.jumia.ma' + $(element).find('a').attr('href')
            };

            result.push(card);
        });

        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function translate(text) {
    for (const key in translations) {
        if (translations.hasOwnProperty(key)) {
            text = text.replace(new RegExp(key, 'g'), translations[key]);
        }
    }
    return text;
}
