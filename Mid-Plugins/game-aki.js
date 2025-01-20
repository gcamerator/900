import { Aki } from 'aki-api';

let handler = async (m, {conn}) => {
  conn.akinator = conn.akinator || {};
  if (m.text === 'akix') {
      if (!conn.akinator[m.sender]) return m.react(error)
      delete conn.akinator[m.sender]
      m.react(done)
  }
  else {
  if (conn.akinator[m.sender]) return conn.reply(m.chat, '*كمل هاد اللعبة 🙄، ولا كتب akix باش تمسحها.*', conn.akinator[m.sender].msg)
      try {
  conn.akinator[m.sender] = new Aki({ region: 'ar', childMode: false, proxy: undefined });
  await conn.akinator[m.sender].start();
if (conn.akinator[m.sender]){
  conn.akinator[m.sender].chat = m.chat;
}
let txt = `
🧞‍♂️ 𝘼𝙆𝙄𝙉𝘼𝙏𝙊𝙍 𝙂𝘼𝙈𝙀 🧞‍♂️\n\n*0. ${conn.akinator[m.sender].question}*\n\n`;
txt += '➊ *- أه*\n';
txt += '➋ *- لا*\n';
txt += '➌ *- ماعرفتش*\n';
txt += '➍ *- يمكن أه*\n';
txt += '➎ *- غالبا لا*\n\n';
txt += '➐ *- إنهاء اللعبة*';
  let soal = await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: null })
  conn.akinator[m.sender].msg = soal
      } catch (e) {
  console.log(e)
  await m.react(error)
      }
  } 
}
handler.command = new RegExp
handler.customPrefix = /^(akinator|aki|akix)$/i;
export default handler
