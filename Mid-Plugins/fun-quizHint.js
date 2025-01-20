const handler = async (m, { conn }) => {
  conn.tekateki = conn.tekateki ? conn.tekateki : {};
  let id = m.chat;
  if (!(id in conn.tekateki)) throw false;
  let json = conn.tekateki[id][1];
if (json.q1) return 0;
  let firstChar = json.capital?.charAt(0) || json.filename?.charAt(0) || json.rr?.charAt(0) || json.en_capital?.charAt(0); 
  let pattern = createPattern(firstChar); // لا حاجة لـ await هنا
 
  conn.reply(m.chat, 'الجواب يبدأ بحرف: ' + pattern, null); 
}

handler.customPrefix = /^مساعدة.*$/i;
handler.command = new RegExp;

function createPattern(firstChar) {
  let pattern = firstChar;
  for (let i = 1; i < firstChar.length; i++) {
    pattern += '_'; // نضيف شرطة تحت كل حرف آخر
  }
  return pattern;
}

export default handler;
