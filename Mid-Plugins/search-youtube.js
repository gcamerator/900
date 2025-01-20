import yts from 'yt-search';
const handler = async (m, { conn, text }) => {
  conn.ytsearch = conn.ytsearch ? conn.ytsearch : {};
  if (!text) {
    return m.reply(`*⚠️ يرجى كتابة اسم الفيديو أو اسم قناة على YouTube*`); }
    let results = await yts(text);
    let tes = results.all;
    const instructions = "📢 *رد على الرسالة برقم الفيديو لتحميله*";
    const smCaps =
      "¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ¹⁰ ¹¹ ¹² ¹³ ¹⁴ ¹⁵ ¹⁶ ¹⁷ ¹⁸ ¹⁹ ²⁰ ²¹ ²² ²³ ²⁴ ²⁵ ²⁶ ²⁷ ²⁸ ²⁹ ³⁰ ³¹ ³² ³³ ³⁴ ³⁵ ³⁶ ³⁷ ³⁸ ³⁹ ⁴⁰";
    const smCapsArray = smCaps.split(" ");
   let teks = tes.slice(0, 50).map((item, index) => {
     switch (item.type) { case 'video':
          return `${smCapsArray[index]} *${item.timestamp}* ${item.title}`;
    }
    }).filter(item => item).join('\n\n');

    const { key } = m.reply(`${teks}\n\n${instructions}`);
  conn.ytsearch[m.chat] = { list: tes, user: m.sender, key, timeout: setTimeout(() => { delete conn.ytsearch[m.chat]; }, 120 * 1000) };
};

handler.before = async (m, { conn }) => {
  conn.ytsearch = conn.ytsearch ? conn.ytsearch : {};
  if (!conn.ytsearch.length > 0) return;
  if (!m.sender in conn.ytsearch) return; 
  if (!m.chat in conn.ytsearch) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return;
  const { list, key } = conn.ytsearch[m.chat];
  const index = parseInt(input);

  const selectedNewsIndex = index - 1;
  if (selectedNewsIndex >= 0 && selectedNewsIndex < list.length) {
    if(list[selectedNewsIndex].timestamp.slice(0,2) > 14 || list[selectedNewsIndex].timestamp.length > 5) return conn.sendMessage(m.chat, {text: '⚠️ *الفيديو طويل يجب أن يكون أقل من 15 دقيقة.*'}, {quoted: null});
    await m.react(rwait)
    const url = list[selectedNewsIndex].url;
     const video = `https://api-brunosobrino-dcaf9040.koyeb.app/api/v1/ytmp4?url=${url}`
     await conn.sendFile(m.chat, video, 'error.mp4', null, null, true, {type: 'video/mp4'});
     clearTimeout(conn.ytsearch[m.chat].timeout);
    conn.ytsearch[m.chat].timeout = setTimeout(
      () => {
        delete conn.ytsearch[m.chat];
      },
      120 * 1000,
    );
  }
};
handler.command = /^youtube|يوتوب|yts?$/i;
export default handler;
