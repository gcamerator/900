let handler = async (m, { conn, mTexts }) => {
  if(!m.quoted) return conn.reply(m.chat, '👥 *طاغي لي باغي تلعب معاه*', null)
  let room;
  conn.connectgame = conn.connectgame ? conn.connectgame : {};
  const connectgame = new ConnectFour();
  let id = m.chat;
  let men = global.db.data.users[m.quoted.sender].name
  let imen = global.db.data.users[m.sender].name
  room = {
      id: 'cf-' + (+new Date()),
      chat: m.chat,
      connectgame: connectgame 
  }; 
  room.connectgame.currentPlayer = m.quoted.sender
    if (mTexts[1]){
  room.connectgame.playerRed = mTexts[0] || "🔴";
  room.connectgame.playerYellow = mTexts[1] || "🟡"; 
} else {
  room.connectgame.playerRed = "🔴";
  room.connectgame.playerYellow = "🟡"; 
}
  room.connectgame.currColor = room.connectgame.playerYellow;
  room.connectgame.playerA = m.sender;
  room.connectgame.playerB = m.quoted.sender;
  room.connectgame.setconnectgame();

  let board = room.connectgame.board.join('\n');
  let bord = 
 `◈ ${room.connectgame.playerYellow} ${men}
◈ ${room.connectgame.playerRed} ${imen}

🔵  🔵  🔵  🔵  🔵  🔵  🔵
🔵  🔵  🔵  🔵  🔵  🔵  🔵
🔵  🔵  🔵  🔵  🔵  🔵  🔵
🔵  🔵  🔵  🔵  🔵  🔵  🔵
🔵  🔵  🔵  🔵  🔵  🔵  🔵
🔵  🔵  🔵  🔵  🔵  🔵  🔵
❶  •  ❷  •  ❸  •  ❹  •  ❺  •  ❻  •  ❼
◣━━━━━━━━━━━━━━━━━◢
🤾🏻 *نوبة: ${men}*

🥏 *طريقة اللعب:* *دير 4 كرات من اللون ديالك فنفس الخط، سوا أفقيا ولا عموديا ولا بشكل مائل.*`;
  board = board.replace(/,/g, '  ');

  let pingMsg = await conn.sendMessage(m.chat, {text: bord, mentions: [m.quoted.sender, m.sender]})

    conn.connectgame[id] = { key: pingMsg, ...room };
};

handler.customPrefix = /^(cf|connectfour|c4)(\s|$)/i;
handler.command = new RegExp;
export default handler;

class ConnectFour {
  constructor() {
    this.gameOver = false;
    this.board = [];
    this.winner = [];
    this.rows = 6;
    this.columns = 7; 
    this.currColumns = [];
}

togglePlayer () {
    this.currColor = this.currColor ===  this.playerRed  ? this.playerYellow : this.playerRed;
    this.currentPlayer = this.currentPlayer === this.playerA ? this.playerB : this.playerA;
};

setconnectgame () {
    this.board = [];
    this.currColumns = [5, 5, 5, 5, 5, 5, 5];
    let boardString = `🔵  🔵  🔵  🔵  🔵  🔵  🔵
🔵  🔵  🔵  🔵  🔵  🔵  🔵
🔵  🔵  🔵  🔵  🔵  🔵  🔵
🔵  🔵  🔵  🔵  🔵  🔵  🔵
🔵  🔵  🔵  🔵  🔵  🔵  🔵
🔵  🔵  🔵  🔵  🔵  🔵  🔵`;

    let boardRows = boardString.split('\n');
    for (let i = 0; i < boardRows.length; i++) {
        let rowValues = boardRows[i].split('  '); 
        this.board.push(rowValues); 
    }
}

checkWinner () {
    // horizontal
    for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.columns - 3; c++) {
            if (this.board[r][c] !== '🔵') {
   if (this.board[r][c] === this.board[r][c + 1] && this.board[r][c + 1] === this.board[r][c + 2] && this.board[r][c + 2] === this.board[r][c + 3]) {
       this.setWinner(r, c);
       return;
   }
            }
        }
    }

    // vertical
    for (let c = 0; c < this.columns; c++) {
        for (let r = 0; r < this.rows - 3; r++) {
            if (this.board[r][c] !== '🔵') {
   if (this.board[r][c] === this.board[r + 1][c] && this.board[r + 1][c] === this.board[r + 2][c] && this.board[r + 2][c] === this.board[r + 3][c]) {
       this.setWinner(r, c);
       return;
   }
            }
        }
    }

    // anti diagonal
    for (let r = 0; r < this.rows - 3; r++) {
        for (let c = 0; c < this.columns - 3; c++) {
            if (this.board[r][c] !== '🔵') {
   if (this.board[r][c] === this.board[r + 1][c + 1] && this.board[r + 1][c + 1] === this.board[r + 2][c + 2] && this.board[r + 2][c + 2] === this.board[r + 3][c + 3]) {
       this.setWinner(r, c);
       return;
   }
            }
        }
    }

    // diagonal
    for (let r = 3; r < this.rows; r++) {
        for (let c = 0; c < this.columns - 3; c++) {
            if (this.board[r][c] !== '🔵') {
   if (this.board[r][c] === this.board[r - 1][c + 1] && this.board[r - 1][c + 1] === this.board[r - 2][c + 2] && this.board[r - 2][c + 2] === this.board[r - 3][c + 3]) {
       this.setWinner(r, c);
       return;
   }
            }
        }
    }
}

setWinner (r, c) {
    if (this.board[r][c] === this.playerRed) {
        this.gameOver = 'true';
        this.winner = 'Red';
        this.currColor = '🔵';
       return;
    } else if (this.board[r][c] === this.playerYellow){
        this.gameOver = 'true';
        this.winner = 'Yellow';
        this.currColor = '🔵';

        return;
    }
}
}
