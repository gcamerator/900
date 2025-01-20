let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) return m.react('✌🏼');
  conn.xo = conn.xo ? conn.xo : {};
  let id = m.chat;
  if (id in conn.xo) {
    delete conn.xo[id];
  }
  const xoPlus = new TicTacToe(m.sender, m.quoted ? m.quoted.sender : null);
  let currentPlayer = Math.random() < 0.5 ? m.sender : m.quoted.sender;
  let playerX = currentPlayer;
  let playerO = currentPlayer === m.sender ? m.quoted.sender : m.sender;

  let room = {
    id: id,
    xoPlus: xoPlus,
    playerX: playerX,
    playerO: playerO,
    currentPlayer: currentPlayer,
  };

  conn.xo[id] = room;
  let str = `⭕ ⋅ @${room.playerO.split('@')[0]}\n❎ ⋅ @${room.playerX.split('@')[0]}\n── ⋆⋅⋆⋅⋆ ──\n${room.xoPlus.board.map(row => row.join(' ')).join('\n')}\n── ⋆⋅⋅⋅⋆ ──\n*نوبة: @${room.currentPlayer.split('@')[0]}*`;

  const key = await conn.reply(m.chat, str, null, { mentions: await conn.parseMention(str) });
  conn.xo[m.chat].key = key;
};

handler.before = async (m, { conn }) => {
  conn.xo = conn.xo ? conn.xo : {};
  let room = conn.xo[m.chat];
  if (!room || !/^([1-9]|safi|stop)$/i.test(m.text.toLowerCase())) return;
  if (m.sender !== room.currentPlayer) return;
  if (/^(safi|stop)$/i.test(m.text.toLowerCase())) {
    delete conn.xo[m.chat];
    return m.react('✅');
  }
  if (conn.xo[m.chat].key) {
    await conn.sendMessage(m.chat, { delete: conn.xo[m.chat].key });
  }

  let input = m.text;
  let x, y;
  if (input === '1') x = 0, y = 0;
  if (input === '2') x = 0, y = 1;
  if (input === '3') x = 0, y = 2;
  if (input === '4') x = 1, y = 0;
  if (input === '5') x = 1, y = 1;
  if (input === '6') x = 1, y = 2;
  if (input === '7') x = 2, y = 0;
  if (input === '8') x = 2, y = 1;
  if (input === '9') x = 2, y = 2;
  if (x === undefined || y === undefined) return;

  let validMove = room.xoPlus.makeMove(x, y);
  if (!validMove) return;

  let nextMoveText = room.xoPlus.next ? ` ${room.xoPlus.next}` : '';
  let boardStr = room.xoPlus.board.map(row => row.join(' ')).join('\n');
  let str = `⭕ ⋅ @${room.playerO.split('@')[0]}\n❎ ⋅ @${room.playerX.split('@')[0]}\n── ⋆⋅⋆⋅⋆ ──\n${boardStr}\n── ⋆⋅⋆⋅⋆ ──\n`;

  if (!room.xoPlus.win) {
    room.currentPlayer = room.currentPlayer === room.playerX ? room.playerO : room.playerX;
    let nextPlayerStr = `*نوبة: @${room.currentPlayer.split('@')[0]}*${nextMoveText}`;
    str += nextPlayerStr;
    const key = await conn.reply(m.chat, str, null, { mentions: await conn.parseMention(str) });
    conn.xo[m.chat].key = key;
  } else {
    let winStr = `🥳 *فاز اللاعب @${room.currentPlayer.split('@')[0]}*`;
    str += winStr;
    await conn.reply(m.chat, str, null, { mentions: await conn.parseMention(str) });
    delete conn.xo[m.chat];
  }
};

handler.customPrefix = /^(ttt2|xo2|xoplus|ox2)(\s|$)/i;
handler.command = new RegExp;
export default handler;

class TicTacToe {
  constructor(x, o) {
    this.board = [
      ['1️⃣', '2️⃣', '3️⃣'],
      ['4️⃣', '5️⃣', '6️⃣'],
      ['7️⃣', '8️⃣', '9️⃣']
    ];
    this.PlayerX = x;
    this.PlayerO = o;
    this.EmoX = '❎';
    this.EmoO = '⭕️';
    this.next = '';
    this.str = '';
    this.win = false;
    this.currEmo = this.EmoX;
    this.currentPlayer = this.PlayerX;
    this.moves = { X: [], O: [] };
    this.removeQueue = [];
  }

  makeMove(row, col) {
    let validInputs = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    if (!validInputs.includes(this.board[row][col])) {
      return false;
    }
    this.board[row][col] = this.currEmo;
    this.moves[this.currEmo === this.EmoX ? 'X' : 'O'].push({ row, col });
    this.removeQueue.push({ row, col });

    if (this.removeQueue.length === 6) {
      const moveToRemove = this.removeQueue[0];
      this.next = `(غاتحيد ${moveToRemove.row * 3 + moveToRemove.col + 1})`;
    } else if (this.removeQueue.length > 6) {
      const mm = this.removeQueue.shift();
      const tt = this.removeQueue;
      const moveToRemove = tt[0];
      this.next = `(غاتحيد ${moveToRemove.row * 3 + moveToRemove.col + 1})`;
      const originalValue = mm.row * 3 + mm.col + 1;
      this.board[mm.row][mm.col] = validInputs[originalValue - 1];
    }

    const b = this.board;
    const p = this.currEmo;
    const winConditions = [
      [b[0][0], b[0][1], b[0][2]],
      [b[1][0], b[1][1], b[1][2]],
      [b[2][0], b[2][1], b[2][2]],
      [b[0][0], b[1][0], b[2][0]],
      [b[0][1], b[1][1], b[2][1]],
      [b[0][2], b[1][2], b[2][2]],
      [b[0][0], b[1][1], b[2][2]],
      [b[2][0], b[1][1], b[0][2]]
    ];
    this.win = winConditions.some(condition => condition.every(cell => cell === this.currEmo));

    if (!this.win) {
      this.currEmo = this.currEmo === this.EmoX ? this.EmoO : this.EmoX;
      this.currentPlayer = this.currentPlayer === this.PlayerX ? this.PlayerO : this.PlayerX;
    }

    this.str = this.board.map(row => row.join(' ')).join('\n');
    return true;
  }
}
