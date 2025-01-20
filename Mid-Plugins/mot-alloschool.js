import fetch from "node-fetch";
import got from "got";
import * as cheerio from 'cheerio';

const handler = async (m, { conn, text }) => {
  conn.alloschool = conn.alloschool ? conn.alloschool : {};
if (!text) throw `أدخل إسم الدرس`;
  const res = await searchAlloschool(text);
  const instructions = "📢 *رد على الرسالة برقم الدرس لتحميله*";

  const smCaps =
    "¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ¹⁰ ¹¹ ¹² ¹³ ¹⁴ ¹⁵ ¹⁶ ¹⁷ ¹⁸ ¹⁹ ²⁰ ²¹ ²² ²³ ²⁴ ²⁵ ²⁶ ²⁷ ²⁸ ²⁹ ³⁰ ³¹ ³² ³³ ³⁴ ³⁵ ³⁶ ³⁷ ³⁸ ³⁹ ⁴⁰";
  const smCapsArray = smCaps.split(" ");
  let teks = res.slice(0, 50).map((item, index) => {
    return `${smCapsArray[index]} _${item.fil}_ ${item.title}`;
  }).join("\n\n");
  const { key } = await await m.reply(teks + instructions);
    conn.alloschool[m.chat] = { list: res, key, timeout: setTimeout(() => { delete conn.alloschool[m.chat]; }, 100 * 1000)};
};

handler.before = async (m, { conn }) => {
  conn.alloschool = conn.alloschool ? conn.alloschool : {};

  if (m.isBaileys || !(m.chat in conn.alloschool)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return;

  const { list, key } = conn.alloschool[m.chat];
  const index = parseInt(input);

  const selectedNewsIndex = index - 1;
  if (selectedNewsIndex >= 0 && selectedNewsIndex < list.length) {
    const url = list[selectedNewsIndex].surl;
    console.log(url);
    let item = await getAlloschool(url);
    if (item.url) {
    await conn.sendFile(m.chat, item.uurl, item.title + '.pdf', "", m, false, {
      asDocument: true,
    }); } else {throw 'لا يوجد روابط للتحميل، جرب درس أخر'}

    clearTimeout(conn.alloschool[m.chat].timeout);
    conn.alloschool[m.chat].timeout = setTimeout(
      () => {
   //     conn.sendMessage(m.chat, { delete: key });
        delete conn.alloschool[m.chat];
      },
      2 * 60 * 1000,
    );
  }
};

handler.command = /^(drs|mdrasa|9raya|alloschool|school)$/i;
export default handler;

async function searchAlloschool(query) {
  try {
    const searchResponse = await fetch(`https://www.alloschool.com/search?q=${query}`);
    const searchBody = await searchResponse.text();
    const $search = cheerio.load(searchBody);
    const elements = $search('ul.list-unstyled li').slice(0, 200);
    const result = [];

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const title = $search('a', el).text().trim();
      const fil = $search('span', el).text().trim();
      const surl = $search('a', el).attr('href');

      if (surl.startsWith("https://www.alloschool.com/element/")) {
          result.push({
            index: i + 1,
            title, fil,
            surl
          });
        }
    }

    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getAlloschool(url) {
    try {
      const sresponse = await fetch(url);
      const sbody = await sresponse.text();
      const $ = cheerio.load(sbody);
      const uurl = $('.row .pdf-tag-hide a.btn').attr('href');
      const title = $('.container ol li.active').text().trim();
return {uurl, title};
    } catch (error) {
        console.error(error);
        throw "حدث خطأ أثناء جلب الملفات PDF";
    }
}
