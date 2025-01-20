import { delay } from '@whiskeysockets/baileys';

export async function before(m) {
  this.emojigame = this.emojigame ? this.emojigame : {};
  let room = Object.values(this.emojigame).find((room) => room && room.id && room.id.startsWith('emo-'));

  if (room && /^(Stop|stop)$/i.test(m.text)) {
    delete this.emojigame[room.id];
    m.react(done);
    return true;
  }

  if (room) {
    let chat = room.chat;
    let playerA = room.emojigame.playerA;
    let playerB = room.emojigame.playerB;
    let gameOver = room.emojigame.gameOver;
    let aname = global.db.data.users[playerA].name;
    let bname = global.db.data.users[playerB].name;
    let answer = m.text;
    let winner, co = true;
    
    if (answer === room.emojigame.emo.join('')) {
      if (m.sender === playerA && co) {
        m.react(done);
        room.emojigame.playerApoints += 15;
        co = false;
        room.emojigame.emo = [];
        winner = m.sender;
        } else if (m.sender === playerB && co) {
        m.react(done);
        room.emojigame.playerBpoints += 15;
        co = false;
        room.emojigame.emo = [];  
        winner = m.sender;} else return;
      
      if (this.emojigame[room.id].key) {
        setTimeout(async () => {
          await conn.sendMessage(m.chat, {
            delete: this.emojigame[room.id].key
          });
        }, 2000); 
      }

 room = room;
      
let str = `‏◈ *@${playerA.split('@')[0]} - ${room.emojigame.playerApoints} نقطة*
‏◈ *@${playerB.split('@')[0]} - ${room.emojigame.playerBpoints} نقطة*`;
   
      await room.emojigame.checkWinner();

      if (room.emojigame.gameOver) {
        await this.reply(chat, str, null, { mentions: await this.parseMention(str) });
        await this.reply(chat, `🧮 *اللاعب @${winner.split('@')[0]} هو الرابح!*`, null, { mentions: await this.parseMention(str) });
        delete this.emojigame[room.id];
        return true;
      }

      await delay(4000);
      if (!co && !gameOver) {
        await room.emojigame.newEmo();
let str = `╔════▣ 𝔼𝕄𝕆𝕁𝕀 𝔾𝔸𝕄𝔼 ▣════╗\n
‏◈ *${aname} - ‏${room.emojigame.playerApoints} نقطة*
‏◈ *${bname} - ‏${room.emojigame.playerBpoints} نقطة*

*الإيموجي التالي:*

‎╰┈➤ ‎${room.emojigame.emo.join('‎')}‎`;

        let { key } = await conn.sendMessage(m.chat, { text: str });

        this.emojigame[room.id].key = key;
        this.room = room;
   
      }
    } else return;
  }
}
