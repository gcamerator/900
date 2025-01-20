let handler = async (m, { conn }) => {
  delete conn.memGame;
  conn.memGame = conn.memGame ? conn.memGame : {};
  const memGame = new MemoryGame();
  let name = global.db.data.users[m.sender].name;

  let room = {
    id: 'mem-' + (+new Date()),
    chat: m.chat,
    player: m.sender,
    memGame: memGame,
  };
  room.memGame.rich = 0;
  room.memGame.date = 1234;
  room.memGame.player = m.sender;
  room.memGame.playername = name;
  let board = room.memGame.start();
  let b = room.memGame.convertToSymbols(board[0]);
  let str =
    `🥷🏼 *اللاعب: ${name}*\n\n🎯 *طريقة اللعب: ستظهر أرقام ملونة عليك تذكر هذه الأرقام بالترتيب.*\n\n${b}\n\n🖍️ *أكتب 0 لبدء للعبة.*`;
  let key = await conn.sendMessage(m.chat, { text: str, mentions: [m.sender] });

  conn.memGame[m.chat] = { key: key, ...room };
};

handler.before = async (m, { conn }) => {
  conn.memGame = conn.memGame ? conn.memGame : {};

  if (!conn.memGame[m.chat] || !/^[0-99999999]|(safi|stop)$/i.test(m.text.toLowerCase())) return;
  if (m.sender !== conn.memGame[m.chat].memGame.player) return;
  let room = conn.memGame[m.chat];
  if (/^(safi|stop)$/i.test(m.text.toLowerCase())) {
    delete conn.memGame[m.chat];
    return m.react('✅');
  }

  let input = m.text.replace(' ', '');
  let chose = room.memGame.chose.join('');
  let err = room.memGame.err;

  if (conn.memGame[m.chat].key) { 
    await conn.sendMessage(m.chat, { delete: conn.memGame[m.chat].key });
  }
   if(room.memGame.rich > 5) {
      conn.sendMessage(m.chat, { text: ',🤨 *إنتهت اللعبة، ماتبقاااش تغش*' });
     return delete conn.memGame[m.chat]}
  if (input !== chose) {
    m.react('❌');
    room.memGame.err += 1;

    if (room.memGame.err === 3) {
      conn.sendMessage(m.chat, { text: `☹️ *إنتهت اللعبة.*\n\n*الجواب كان هو: ${chose}*`, mentions: [m.sender] });

      const leaderboard = global.db.data.settings[conn.user.jid].memoleaderboard;
      const playerIndex = leaderboard.findIndex(entry => entry.player === room.memGame.playername);
      if (playerIndex !== -1) {
        leaderboard[playerIndex].score = room.memGame.level;
      } else {
        leaderboard.push({ player: room.memGame.playername, score: room.memGame.level });
      }
      leaderboard.sort((a, b) => b.score - a.score);
      let leaderboardDisplay = '*ترتيب اللاعبين:*\n';
      for (let i = 0; i < leaderboard.length; i++) {
        leaderboardDisplay += `\n*${i + 1}. ${leaderboard[i].player}: ${leaderboard[i].score * 5} نقطة*`;
      }
      conn.sendMessage(m.chat, { text: leaderboardDisplay, mentions: [m.sender] });
      return delete conn.memGame[m.chat];
    } else {
      let firstboard = room.memGame.convertToSymbols(room.memGame.firstboard);
      let pingMsg = await conn.sendMessage(m.chat, { text: `🎮 *المستوى: ${room.memGame.level}*\n❎ *الأخطاء: ${err}*\n\n` + firstboard + '\n' });
      room.memGame.date = Math.floor(Date.now() / 1000) + room.memGame.level + room.memGame.level + 1;
      for (let i = 0; i < room.memGame.boards.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        let gg = room.memGame.convertToSymbols(room.memGame.boards[i]);
        await conn.relayMessage(m.chat, {
          protocolMessage: {
            key: pingMsg.key,
            type: 14,
            editedMessage: {
              conversation: `🎮 *المستوى: ${room.memGame.level}*\n❎ *الأخطاء: ${err}*\n\n` + gg,
            },
          },
        }, {});
      }
      await conn.sendMessage(m.chat,{react: { text: "🤔", key: pingMsg.key}})
      console.log(room.memGame.date, Math.floor(Date.now() / 1000));
      conn.memGame[m.chat].key = pingMsg;
    }
    return console.log();
  }

  let boards = await room.memGame.newRound();
  let firstboard = room.memGame.convertToSymbols(room.memGame.firstboard);
  let pingMsg = await conn.sendMessage(m.chat, { text: `🎮 *المستوى: ${room.memGame.level}*\n❎ *الأخطاء: ${err}*\n\n` + firstboard + '\n' });
  room.memGame.date = Math.floor(Date.now() / 1000) + room.memGame.level + room.memGame.level + 1;
  for (let i = 0; i < room.memGame.boards.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    let gg = room.memGame.convertToSymbols(room.memGame.boards[i]);
    await conn.relayMessage(m.chat, {
      protocolMessage: {
        key: pingMsg.key,
        type: 14,
        editedMessage: {
          conversation: `🎮 *المستوى: ${room.memGame.level}*\n❎ *الأخطاء: ${err}*\n\n` + gg,
        },
      },
    }, {});
  }
  await conn.sendMessage(m.chat,{react: { text: "🤔", key: pingMsg.key}})
  console.log(room.memGame.date, Math.floor(Date.now() / 1000));
  conn.memGame[m.chat].key = pingMsg;
};

handler.customPrefix = /^(memo|memogame)(\s|$)/i;
handler.command = new RegExp;
export default handler;

class MemoryGame {
  constructor() {
    this.firstboard = '1234567890';
    this.board = ['123456789x', 'x234567890', '1x34567890', '12x4567890', '123x567890', '1234x67890', '12345x7890', '123456x890', '1234567x90', '12345678x0'];
    this.chose = ['0'];
    this.level = 0;
    this.boards = [];
    this.err = 0;
  }

  start() {
    this.boards.push(this.firstboard);
    return this.boards;
  }

  newRound() {
    this.level += 1;
    this.chose = [];
    this.boards = [];
    let newBoard = [];
    for (let i = 0; i < this.level; i++) {
      const randomIndex = Math.floor(Math.random() * this.board.length);
      newBoard.push(this.board[randomIndex]);
      this.chose.push(randomIndex);
      newBoard.push(this.firstboard);
    }
    this.boards = newBoard;
    return this.boards;
  }

  convertToSymbols(board) {
    const l = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'x'];
    const m = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🟥'];
    let result = board;
    for (let i = 0; i < l.length; i++) {
      const regex = new RegExp(l[i], 'g');
      result = result.replace(regex, m[i]);
    }
    return result;
  }
}
