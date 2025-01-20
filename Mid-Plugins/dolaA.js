let handler = async (m, { conn, text, command }) => {
  if (!text) {
    m.reply(`أضف الموعد على شكل:\n\n.${command} event date\n\n.${command} ماتش غدا مع 16:36`);
    return 0;
  }
  m.react('⏰');
  let dola = '19165628142@s.whatsapp.net';
  let words = text.trim().split(/\s+/); 
  let ss = words.slice(0, -1).join(' ');
  let dd = words[words.length - 1];
  let user = m.sender.split('@')[0].trim();
  let message = 'ذكرني بـ ' + ss + ' مع ملاحظة 765@' + user + ' عند الوقت ' + dd ;
  conn.reply(dola, message, null);
};
handler.command = /^(dola|reminder|فكرني)$/i;
export default handler;
