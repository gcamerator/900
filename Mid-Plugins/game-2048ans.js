export async function before(m) {
    this.game2048 = this.game2048 ? this.game2048 : {};
    let room = Object.values(this.game2048).find((room) => room && room.id.startsWith("2048") && room.chat === m.chat);
    if (!room) return;
    if (/^(safi|stop)$/i.test(m.text.toLowerCase())) {
        await conn.sendMessage(m.chat, {
            delete: this.game2048[m.chat].key,
        });
        delete this.game2048[m.chat];
        m.react(done);
        return;
    }
      let moved = false;
    let player = room.game2048.player;
    if (m.sender !== player) return;
    if (this.game2048[m.chat].key) {
        await conn.sendMessage(m.chat, {
       delete: this.game2048[m.chat].key,
        });
    }
let command;
const leftCommands = new Set(['a', 's', 'f', 'd', 'w', 'q', 'e', 'z']);
const upCommands = new Set(['r', 't', 'y', 'u']);
const rightCommands = new Set(['m', 'l', 'k', 'j', 'h', 'o', 'o', 'i']);
const downCommands = new Set(['x', 'c', 'v', 'b']);
const textLower = m.text.toLowerCase();
if (leftCommands.has(textLower)) {
      command = 'left';
    } else if (upCommands.has(textLower)) {
      command = 'up';
    } else if (rightCommands.has(textLower)) {
      command = 'right';
    } else if (downCommands.has(textLower)) {
      command = 'down';
    }
 moved = await room.game2048.move(command)
    this.room = room
  if (moved) {
  let aa = room.game2048.board.map((v) => v.join('')).join('\n');

 let key = await conn.sendMessage(m.chat, {text: aa}, {quoted: null}) 
      await room.game2048.checkWinner()
      if (room.game2048.winner) {
   await conn.sendMessage(m.chat, {text: '🥳 *مبروك لقد فزت باللعبة* 🥳'}, {quoted: null}) 
          if (this.game2048[m.chat].key) {
              await conn.sendMessage(m.chat, {
             delete: this.game2048[m.chat].key,
              });
          }
          delete this.game2048[m.chat];
      }
    this.game2048[m.chat].key = key
}}
