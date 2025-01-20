import Game2048 from '../lib/2048.js';
const handler = async (m, { conn }) => {
    delete conn.game2048;
   let room;
conn.game2048 = conn.game2048 ? conn.game2048 : {};
 const game2048 = new Game2048();  
     room = {
       id: '2048-' + (+new Date()),
       chat: m.chat,
       game2048: game2048 
     };
     room.game2048.player = m.sender;

   let aa = room.game2048.board.map((v) => v.join('')).join('\n');

   let str = `🕹️ *لعبة 2048* 🕹️\n\n` + aa + `\n\n🚴🏼 *الهدف: الحصول على الرقم 10*\n\n> *إستعمل حروف لوحة المفاتيح للتحرك حسب جهتها (الحروف العلوية للأعلى واليمنى لليمين ...)*`;
     let pingMsg = await conn.sendMessage(m.chat, {text: str});
     conn.game2048[m.chat] = { key: pingMsg, ...room };
}
handler.customPrefix = /^(2048)$/i;
handler.command = new RegExp
export default handler;
