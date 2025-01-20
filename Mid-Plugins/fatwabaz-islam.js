import axios from 'axios';
import * as cheerio from 'cheerio';

let handler = async (m, { conn, command, usedPrefix, text }) => {
  conn.ftw = conn.ftw ? conn.ftw : {};
  if (!text)
    return conn.reply(
      m.chat,
      `ما الذي تبحث عنه؟ 🤔\n*مثال:*\n*${usedPrefix + command} حكم إفطار المريض*`,
      m,
    );
  const res = await GoogleSearch(text, command);
  const teksArray = res.slice(0, 10).map((g, index) => {
  let title = g.title ? g.title : 'لا يوجد عنوان';
    return `${index + 1}. *${title}*\n`;
  });
  const teks = `*🔍 نتائج بحث:* ${text}\n\n${teksArray.join("\n")}`;
  const instructions = "\n📢 *رد على هذه الرسالة برقم النتيجة لعرضها*";
  const { key } = await m.reply(teks + instructions);
  conn.ftw[m.chat] = {
    list: res,
    key, command,
    timeout: setTimeout(() => {
      delete conn.ftw[m.chat];
    }, 100 * 1000),
  };
};

handler.before = async (m, { conn }) => {
  conn.ftw = conn.ftw ? conn.ftw : {};

  if (m.isBaileys || !(m.chat in conn.ftw)) return;

  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return;

  const { list, timeout } = conn.ftw[m.chat];
  const selectedNewsIndex = parseInt(input) - 1;

  if (selectedNewsIndex >= 0 && selectedNewsIndex < list.length) {
    const url = list[selectedNewsIndex].link;
    if (conn.ftw[m.chat].command === 'fatwabaz'){
      let res = await binBaz(url)
      await m.reply(`*${res.h}*\n\n` + '*السؤال:* ' + res.q + '\n\n💡' + res.a + '\n\n*المصدر:* binbaz.org.sa');
    } else if (conn.ftw[m.chat].command === 'islamweb'){
       let res = await islamWeb(url)
      await m.reply('*السؤال:* ' + res.q + '\n\n*الجواب:*' + res.a + '\n\n*المصدر:* islamweb.net');
    }

    clearTimeout(timeout);
    conn.ftw[m.chat].timeout = setTimeout(
      () => {
        delete conn.ftw[m.chat];
      },
      2 * 60 * 1000,
    );
  }
};

handler.command = /^islamweb|fatwabaz?$/i;
export default handler;

async function GoogleSearch(query, c) {
  let site;
  if (c === 'islamweb') {site = 'islamweb.net';}
  else if (c === 'fatwabaz') {site = 'binbaz.org.sa'};
  const url = `https://www.google.com/search?gl=MA&q=site:${site} ` + encodeURIComponent(query);
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
async function islamWeb(url) {
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const q = $('.right-nav .mainitem.quest-fatwa:eq(0) div p').text().trim();
// const a = $('.right-nav .mainitem.quest-fatwa:eq(1) div p').text().trim();
  const aa = $('.right-nav .mainitem.quest-fatwa:eq(1) div[itemprop="text"]').html();
  const cleanText = aa.replace(/<[^>]*>/g, '');
  const formattedText = cleanText.replace(/&amp;sa=.*?ktsih/g, ''); 

  const lines = formattedText.split('\n').filter(line => line.trim() !== ''); 
  const a = lines.map(line => line.replace(/\t/g, '') + '\n\n').join('');
      return { q, a };

}
async function binBaz(url) {
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);
  const h = $('.row .col-md-9 article h1').text().trim();
  const q = $('.row .col-md-9 article h2').text().trim();
  const a = $('.row .col-md-9 article .article-content').text().trim();
return {h, q, a} 

}
