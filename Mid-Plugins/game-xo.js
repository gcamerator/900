import TicTacToe from '../lib/tictactoe.js'
let handler = async (m, { conn, mTexts }) => {
  let userA = global.db.data.users[m.sender].name
  let userB;
   let mt = mTexts
  if (m.quoted) {
      userB = global.db.data.users[m.quoted.sender].name;
  } else {
      m.react('✌🏼');
      return;
  }
    if (Object.values(conn.tttgame).find(room => room.id.startsWith('xo') && [room.tttgame.playerX].includes(m.sender))) { 
      delete conn.tttgame;
    }
  conn.tttgame = conn.tttgame ? conn.tttgame : {}
  let pc = mt[0] || '❎'
  let pv = mt[1] || '⭕'
 let room = {
    id: 'xo-' + (+new Date),
    x: m.chat,
    o: m.chat,
    XX: pc,
    OO: pv,
    tttgame: new TicTacToe(m.quoted.sender, m.sender),
    state: 'PLAYING',
    chat: m.chat 
  }
room.tttgame.playerO = m.sender;
room.tttgame.playerX = m.quoted.sender;   

  if (room) { 
let arr = room.tttgame.render().map(v => {
return {X: '❎',O: '⭕',1: '1️⃣',2: '2️⃣',3: '3️⃣',4: '4️⃣',5: '5️⃣',6: '6️⃣',7: '7️⃣',8: '8️⃣',9: '9️⃣'}[v]})

let str = `
${pv} ⋅ ${userA}
${pc} ⋅ ${userB}
*─── ⋆⋅⋆⋅⋆ ───*
    ${arr.slice(0, 3).join('')}  
    ${arr.slice(3, 6).join('')}
    ${arr.slice(6).join('')}
*─── ⋆⋅⋆⋅⋆ ───*
🪄 *نوبة:* @${room.tttgame.currentTurn.split('@')[0]}`.trim()

 
   const key = await conn.reply(m.chat, str, null, {mentions: await conn.parseMention(str)})
conn.tttgame[room.id] = { key: key, ...room };
    }
}
handler.customPrefix = /^(ttt|xo|ox|دير لينا نلعبو اكس او)(\s|$)/i;
handler.command = new RegExp;
export default handler;
