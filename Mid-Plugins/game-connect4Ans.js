export async function before(m) {
  this.connectgame = this.connectgame ? this.connectgame : {};
  let room = Object.values(this.connectgame).find((room)  => room && room.id.startsWith('cf') && (m.sender === room.connectgame.playerA || m.sender === room.connectgame.playerB) && room.chat === m.chat);
    if(!room || !/^([1-7]|safi|stop)$/i.test(m.text.toLowerCase())) return;
  if (/^(safi|stop)$/i.test(m.text.toLowerCase())) {
   for (let roomId in this.connectgame) {
    delete this.connectgame[roomId];
}
    m.react(done);
    return true;
  }

    let cp;
    let chat = room.chat;
    let currColor = room.connectgame.currColor;
    let playerA = room.connectgame.playerA;
    let playerB = room.connectgame.playerB;
    let playerRed = room.connectgame.playerRed;
    let playerYellow = room.connectgame.playerYellow;
    let currentPlayer = room.connectgame.currentPlayer;

    let number = parseInt(m.text.trim()) - 1;
    if (m.sender !== currentPlayer) {
     return m.react('🙅🏻‍♂️');
    }

      if (this.connectgame[m.chat].key) {
        await conn.sendMessage(m.chat, { delete: this.connectgame[m.chat].key});
      }
  
      let column = number;
      let row = room.connectgame.currColumns[column];

      if (row < 0) {
        return m.react('🔒');
      }

      room.connectgame.board[row][column] = currColor;
      room.connectgame.currColumns[column] = row - 1;
      await room.connectgame.togglePlayer();
      
      if (m.sender === room.connectgame.playerA) {
          cp = room.connectgame.playerB;
      } else if (m.sender === room.connectgame.playerB) {
          cp = room.connectgame.playerA;
      } 
      let board = room.connectgame.board.map((row) => row.join("  ")).join("\n");

      let str = `${playerYellow} @${playerB.split("@")[0]}・@${playerA.split("@")[0]} ${playerRed}

${board}
 ❶  •  ❷  •  ❸  •  ❹  •  ❺  •  ❻  •  ❼
◣━━━━━━━━━━━━━━━━━◢
🤾🏻 *نوبة:* @${cp.split("@")[0]}`;


      const { key } = await this.reply(chat, str, null, { mentions: await this.parseMention(str)});
      this.connectgame[m.chat].key = key;
      
      this.room = room;
      await this.room.connectgame.checkWinner();

      if (this.room.connectgame.currColor === '🔵') {
        let winner = currentPlayer.replace("@s.whatsapp.net", "");
        await this.reply(chat, `🧮 *اللاعب @${winner} هو الرابح!*`, null, { mentions: await this.parseMention(str),});
        delete this.connectgame[room.id];
        return true;
      }
    }
  
