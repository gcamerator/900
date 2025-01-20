import axios from 'axios'
import * as cheerio from 'cheerio';
import uploadImage from "../lib/uploadImage.js";

let handler = async (m, { conn, command, usedPrefix, text }) => {
  conn.dgoogle = conn.dgoogle ? conn.dgoogle : {};
  if (!text)
    return conn.reply(
      m.chat,
      `ما الذي تبحث عنه؟?🤔\n*مثال*\n*${usedPrefix + command} نتائج*`,
      m,
    );
  m.react(rwait)
  const ull = 'https://www.google.co.ma/search?gl=MA&q=' + encodeURIComponent(text);
  const res = await getSearchResults(text);
  let st = await ssweb(ull, "full", "desktop");
  let re = await uploadImage(st);
  const teksArray = res.slice(0, 10).map((g, index) => {
  let title = g.title ? g.title : 'لا يوجد عنوان';
    return `${index + 1}. *${title}*\n_${decodeURIComponent(g.link)}_\n${
      g.description
    }\n`;
  });
  const teks = `*🔍 نتائج بحث:* ${text}\n\n${teksArray.join("\n")}`;
  const instructions = "\n📢 *رد على هذه الرسالة برقم النتيجة لتصفحها*";
  const { key } = await conn.sendFile(m.chat, re, '', teks + instructions, m);
  conn.dgoogle[m.chat] = {
    list: res,
    key,
    timeout: setTimeout(() => {
      delete conn.dgoogle[m.chat];
    }, 100 * 1000),
  };
};

handler.before = async (m, { conn }) => {
  conn.dgoogle = conn.dgoogle ? conn.dgoogle : {};

  if (m.isBaileys || !(m.chat in conn.dgoogle)) return;

  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return;

  const { list, timeout } = conn.dgoogle[m.chat];
  const selectedNewsIndex = parseInt(input) - 1;

  if (selectedNewsIndex >= 0 && selectedNewsIndex < list.length) {
    const url = list[selectedNewsIndex].link;
    let st = await ssweb(url, "full", "desktop");
    let res = await uploadImage(st);
    await conn.sendFile(m.chat, res, "", ``, m);
    clearTimeout(timeout);
    conn.dgoogle[m.chat].timeout = setTimeout(
      () => {
        delete conn.dgoogle[m.chat];
      },
      2 * 60 * 1000,
    );
  }
};

handler.command = /^googlef|google|جوجل?$/i;
export default handler;

async function ssweb(url = "", full = false, type = "desktop") {
  type = type.toLowerCase();
  if (!["desktop", "tablet", "phone"].includes(type)) type = "desktop";
  let form = new URLSearchParams();
  form.append("url", url);
  form.append("device", type);
  if (!!full) form.append("full", "on");
  form.append("cacheLimit", 0);
  let res = await axios({
    url: "https://www.screenshotmachine.com/capture.php",
    method: "post",
    data: form,
  });
  let cookies = res.headers["set-cookie"];
  let buffer = await axios({
    url: "https://www.screenshotmachine.com/" + res.data.link,
    headers: {
      cookie: cookies.join(""),
    },
    responseType: "arraybuffer",
  });
  return Buffer.from(buffer.data);
}

async function getSearchResults(query) {
  const url = 'https://www.google.com/search?gl=MA&q=' + encodeURIComponent(query);
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const resultDivs = $('div.Gx5Zad.fP1Qef.xpd.EtOod.pkphOe');
  const results = [];

  resultDivs.each((index, div) => {
      if (!$(div).find('div.egMi0.kCrYT').length) {
          return;
      }
      const title = $(div).find('h3').text();
  const dlink = $(div).find('a').attr('href').split('/url?q=')[1].replace(/&sa=.*/, '');
      const description = $(div).find('div.BNeawe.s3v9rd.AP7Wnd').text();
    const link = decodeURIComponent(dlink);
      results.push({ title, link, description });
  });

  return results;
}
