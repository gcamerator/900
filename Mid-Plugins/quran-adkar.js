import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  conn.adkar = conn.adkar ? conn.adkar : {};
  const response = await fetch('https://github.com/Alsarmad/whatsapp_adhkar/raw/main/files/json/adhkar.json');
 const res = await response.json();
let teks = '📚 *أقسام الأذكار:*\n\n';
const instructions = "📢 *رد على الرسالة برقم القسم لعرض الأحاديث*";
teks += res.slice(0, 150).map((item, index) => {
  return `📁 ${index + 1} *${item.category}*`;
}).join("\n");
const { key } = await conn.reply(m.chat, `${instructions}\n\n${teks}`, null);
  conn.adkar[m.chat] = { list: res, key, timeout: setTimeout(() => { 
    delete conn.adkar[m.chat]; }, 250 * 1000)};
}
handler.before = async (m, { conn }) => {
  conn.adkar = conn.adkar ? conn.adkar : {};

  if (m.isBaileys || !(m.chat in conn.adkar)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return; 

  const { list, key } = conn.adkar[m.chat];
  const index = parseInt(input);

  const res = list;

  const sai = index - 1;
  if (sai >= 0 && sai < res.length) {
    if (sai >= 0 && sai < 132) {
        const section = res[sai];
        let reply = `*📓 أذكار ${section.category}:*\n\n`;

        section.array.forEach((adhkar, index) => {
            reply += `📜 [${index + 1}] ${adhkar.text}/n/n`;
        });

        conn.reply(m.chat, reply, null, { quoted: m, contextInfo: { mentionedJid: conn.parseMention(reply) } });
    } else {
        conn.reply(m.chat, 'الرقم المدخل غير صالح. الرجاء استخدام رقم من بين الأقسام المعروضة.', null, { quoted: m });
    }
    clearTimeout(conn.adkar[m.chat].timeout);
    conn.adkar[m.chat].timeout = setTimeout(() => {
      delete conn.adkar[m.chat];
    }, 3 * 60 * 1000);
  }
}

handler.command = /^(adkar)$/i;

export default handler;

