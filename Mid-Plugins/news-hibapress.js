import * as cheerio from 'cheerio';
import fetch from "node-fetch";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
const handler = async (m, { conn }) => {
  conn.hibad = conn.hibad ? conn.hibad : {};

  const res = await allelhiba();
  const instructions = "📢 *رد على الرسالة برقم الخبر لعرضه كاملا*";

  const smCaps =
    "¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ¹⁰ ¹¹ ¹² ¹³ ¹⁴ ¹⁵ ¹⁶ ¹⁷ ¹⁸ ¹⁹ ²⁰ ²¹ ²² ²³ ²⁴ ²⁵ ²⁶ ²⁷ ²⁸ ²⁹ ³⁰ ³¹ ³² ³³ ³⁴ ³⁵ ³⁶ ³⁷ ³⁸ ³⁹ ⁴⁰ ⁴¹ ⁴² ⁴³ ⁴⁴ ⁴⁵ ⁴⁶ ⁴⁷ ⁴⁸ ⁴⁹ ⁵⁰ ⁵¹ ⁵² ⁵³ ⁵⁴ ⁵٥ ⁵٦ ⁵٧ ⁵٨ ⁵٩ ⁶٠";
  const smCapsArray = smCaps.split(" ");

  let teks = res
    .slice(0, 50)
    .map((item, index) => {
      const date = item.date;
      return `${smCapsArray[index]} *[${date}]* ${item.title}`;
    })
    .join("\n\n");

  const { key } = await m.reply(`${teks}\n\n${instructions}`);

  // قم بتخزين بيانات القرآن في متغير conn.hibad للاستخدام لاحقًا
  conn.hibad[m.chat] = {
    list: res,
    key,
    timeout: setTimeout(() => {
      conn.sendMessage(m.chat, { delete: key });
      delete conn.hibad[m.chat];
    }, 60 * 10000),
  };
};

handler.before = async (m, { conn }) => {
  conn.hibad = conn.hibad ? conn.hibad : {};

  if (m.isBaileys || !(m.chat in conn.hibad)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return;

  const { list, key } = conn.hibad[m.chat];
  const index = parseInt(input);

  const selectedNewsIndex = index - 1;
  if (selectedNewsIndex >= 0 && selectedNewsIndex < list.length) {
    const url = list[selectedNewsIndex].link;
    console.log(url);
    let item = await readelhiba(url);
    let cap = `*${item.title}*\n
${item.content}`;
    const image = item.image;

    await conn.sendFile(m.chat, image, "", cap, m);
    await conn.sendMessage(m.chat, { delete: key });

    // تعديل توقيت الحذف إلى دقيقتين بدلاً من دقيقة واحدة
    clearTimeout(conn.hibad[m.chat].timeout);
    conn.hibad[m.chat].timeout = setTimeout(
      () => {
        conn.sendMessage(m.chat, { delete: key });
        delete conn.hibad[m.chat];
      },
      1 * 600 * 1000,
    );
  }
};
async function allelhiba() {
  try {
    const response = await fetch("http://ar.hibapress.com/akhbar.php");
    const html = await response.text();
    const $ = cheerio.load(html);
    const result = [];

    $("ul#latest_posts li").each((index, element) => {
      const card = {
        title: $(element).find("div.lastNewsText a").attr("title"),
        date: $(element).find("span.time").text().replace(/ /g, ""),
        link: $(element).find("div.lastNewsText a").attr("href"),
      };
      result.push(card);
    });

    return result;
  } catch (error) {
    console.error("Error in hiba:", error);
    throw error;
  }
}
async function readelhiba(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    $("script").remove();
    $("style").remove();
    const title = $("h1.post-title.entry-title").text().trim();
    const image = $("div.featured-area-inner img").attr("src");
    const content = $(".entry-content p").text().trim().replace(/\./g, ".\n\n");
    const article = {
      title,
      image,
      content,
    };
    return article;
  } catch (error) {
    console.error("Error in readelhiba:", error);
    throw error;
  }
}
handler.help = ["elhiba"];
handler.tags = ["internet"];
handler.command = /^(hibapress|hiba)$/i;
export default handler;
