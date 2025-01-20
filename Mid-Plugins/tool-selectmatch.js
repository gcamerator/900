import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  conn.trhtr = conn.trhtr ? conn.trhtr : {};
  let res = await matches()
  const smCaps = '¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ¹⁰ ¹¹ ¹² ¹³ ¹⁴ ¹⁵ ¹⁶ ¹⁷ ¹⁸ ¹⁹ ²⁰';
  const smCapsArray = smCaps.split(' ');
  let teks = res.slice(0, 50).map((item, index) => {
    let name = item.name
    return `${smCapsArray[index]} ${name}`;
  }).join("\n\n");
  const { key } = await m.reply(`${teks}`);
  conn.trhtr[m.chat] = { list: res, key, timeout: setTimeout(() => { conn.sendMessage(m.chat, { delete: key }); delete conn.trhtr[m.chat]; }, 60 * 1000)};
}

handler.before = async (m, { conn }) => {
  conn.trhtr = conn.trhtr ? conn.trhtr : {};

  if (m.isBaileys || !(m.chat in conn.trhtr)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return; 
  let bot = global.db.data.settings[conn.user.jid]
  const { list, key } = conn.trhtr[m.chat];
  const index = parseInt(input);

  const selectedNewsIndex = index - 1;
  if (selectedNewsIndex >= 0 && selectedNewsIndex < list.length) {
    const url = list[selectedNewsIndex].link + '/#id=2';
    let parts = url.split('/');
if (parts.length > 5) {
  parts.splice(5, 0, 'coverage');
}
let newUrl = parts.join('/');
    bot.matchurl = newUrl;
    m.react(done)
    clearTimeout(conn.trhtr[m.chat].timeout);
    conn.trhtr[m.chat].timeout = setTimeout(() => {
      conn.sendMessage(m.chat, { delete: key });
      delete conn.trhtr[m.chat];
    }, 3 * 60 * 1000);
  }
}
handler.command = /^(match)$/i
export default handler;
   
async function matches(){
  let date = new Date();
  let options = { timeZone: 'Africa/Casablanca', year: 'numeric', month: '2-digit', day: '2-digit' };
  let fulldate = date.toLocaleDateString('en-US', options);
  let [month, day, year] = fulldate.split('/');
  let formattedDate = `${year}-${month}-${day}`;
let url = 'https://www.filgoal.com/matches/?date='+formattedDate
  try {   
    let res = await fetch(url);
    const html = await res.text(); 
    const $ = cheerio.load(html);
    const result = [];
    const linksSet = new Set();

    $('div#match-list-viewer a').each((index, element) => {
      const link = 'https://www.filgoal.com' + $(element).attr('href');
      const name = link.split('/')[5].replace(/-/g, ' ');
        if (link.startsWith('https://www.filgoal.com/matches/') && !linksSet.has(link)) {
        linksSet.add(link);
        result.push({ link, name});
      }
    });

    console.log(result);
    return result;
  } catch (e) {
    console.error(e);
  } 
}
