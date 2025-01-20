let handler = async (m, { conn }) => {
  let room;
  delete conn.floodgame;
  conn.floodgame = conn.floodgame ? conn.floodgame : {};
  const floodgame = new FloodGame();
  let name = global.db.data.users[m.sender].name;

  room = {
      id: 'fl-' + (+new Date()),
      chat: m.chat,
      floodgame: floodgame 
  };

  room.floodgame.player = m.sender;
  room.floodgame.playername = name;
  room.floodgame.setFloodGame();

  let board = room.floodgame.printGrid();
  let str = 
 `◈ *اللاعب: ${name}*

${board}
◣━━━━━━━━━━━━━━◢
*طريقة اللعب:* بداية من المربع الأعلى على اليسار، يجب وضع رقم اللون الذي بجانبه حتى يتم إكمال تلوين جميع المربعات.

🔫 *عدد المحاولات: 10*

*1🟥 2🟦 3🟧 4🟨 5🟩*`;
 let key = await conn.sendMessage(m.chat, { text: str, mentions: [m.sender] });

  conn.floodgame[room.id] = { key: key, ...room };
};

handler.customPrefix = /^(flood|فلود)(\s|$)/i;
handler.command = new RegExp;
export default handler;

function FloodGame() {
    this.gameOver = false;
    this.gridSize = 6;
    this.moves = 0;
    this.squares = ['🟥', '🟦', '🟧', '🟨', '🟩'];
    this.grid = [];
}

FloodGame.prototype.setFloodGame = function() {
    for (let i = 0; i < this.gridSize; i++) {
        let row = [];
        for (let j = 0; j < this.gridSize; j++) {
            row.push(this.squares[Math.floor(Math.random() * this.squares.length)]);
        }
        this.grid.push(row);
    }
};

FloodGame.prototype.printGrid = function() {
    return this.grid.map(row => row.join(' ')).join('\n');
};

FloodGame.prototype.floodFill = function(x, y, targetColor, replacementColor) {
    if (targetColor === replacementColor) return;
    if (this.grid[x][y] !== targetColor) return;

    this.grid[x][y] = replacementColor;

    if (x > 0) this.floodFill(x - 1, y, targetColor, replacementColor);
    if (x < this.gridSize - 1) this.floodFill(x + 1, y, targetColor, replacementColor);
    if (y > 0) this.floodFill(x, y - 1, targetColor, replacementColor);
    if (y < this.gridSize - 1) this.floodFill(x, y + 1, targetColor, replacementColor);
};

FloodGame.prototype.makeMove = function(newColor) {
    let targetColor = this.grid[0][0];
    this.floodFill(0, 0, targetColor, newColor);
    this.moves += 1;
    if (this.checkWin()) {
       return this.gameOver = true;
    }
 };

FloodGame.prototype.checkWin = function() {
    let firstColor = this.grid[0][0];
    for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
            if (this.grid[i][j] !== firstColor) {
                return false;
            }
        }
    }
    return true;
};
