import {delay} from '@whiskeysockets/baileys';
export async function before(m) {
  this.mathGame = this.mathGame ? this.mathGame : {};
  let room = Object.values(this.mathGame).find(
      (room) => room && room.id.startsWith("math") && room.chat === m.chat && (m.sender === room.mathGame.playerA || m.sender === room.mathGame.playerB));
  if(!room || isNaN(m.text) || !m.text) return;
  let mathGame = room.mathGame;
   let cx = `${room.mathGame.emoA} *${room.nameA} : ${mathGame.Apoints}*\n${room.mathGame.emoB} *${room.nameB} : ${mathGame.Bpoints}*`;
  if (/^(safi|stop)$/i.test(m.text.toLowerCase())) {
    conn.sendMessage(m.chat, { text: cx }, {quoted: null});
    if (this.mathGame[m.chat].key) {
        await conn.sendMessage(m.chat, {
            delete: this.mathGame[m.chat].key,
        });
    }
      delete this.mathGame[m.chat];
      m.react(done);
      return;
  }
   if (isNaN(m.text)) return;
    if (!mathGame.Question) return;
    if (mathGame.checkAnswer(m.text)) { 
    await mathGame.updatePoints(m.sender, 10);
      let ca = `${room.mathGame.emoA} *${room.nameA} : ${room.mathGame.Apoints}*\n${room.mathGame.emoB} *${room.nameB} : ${room.mathGame.Bpoints}*`;
       m.react('✅');
       await delay(3000);
      if (this.mathGame[m.chat].key) {
          await conn.sendMessage(m.chat, {
              delete: this.mathGame[m.chat].key,
          });
      }
      await mathGame.checkForWin();
        if (room.mathGame.winner){
        let winnerName = mathGame.playerA ? global.db.data.users[mathGame.playerA].name || mathGame.playerA.split('@')[0] : global.db.data.users[mathGame.playerB].name || mathGame.playerB.split('@')[0];
          if (this.mathGame[m.chat].key) {
              await conn.sendMessage(m.chat, {
                  delete: this.mathGame[m.chat].key,
              });
          }
      let {yy} = conn.sendMessage(m.chat, { text: ca + `\n\n🎉 *إنتهت اللعبة، مبروك ${winnerName}*` });
        setTimeout(() => {
           conn.sendMessage(m.chat, {
              delete: yy,
          });
        }, 10000);
        delete this.mathGame[m.chat];
        return;
      }
      let newCalc = mathGame.generateCalculation(mathGame.difficulty);
      let cap = `${ca}\n\n🧮 ${newCalc} *= ???*\n\n⏰ *الوقت: ${room.mathGame.timeLimit.toString().slice(0, 2)} ثانية*`
    let key = conn.sendMessage(m.chat, { text: cap }, {quoted: null});
      this.mathGame[m.chat].key = key
    }
    else if (mathGame.timeOut){
      let tt = m.reply(`⌛ *إنتهى الوقت*\n\n📝 *الجواب الصحيح كان هو: ${mathGame.Answer}*`, null)
      if (this.mathGame[m.chat].key) {
          await conn.sendMessage(m.chat, {
              delete: this.mathGame[m.chat].key,
          });
      }
      mathGame.QuestionA = false;
      await delay(3000);
        await conn.sendMessage(m.chat, {
            delete: tt,
        });
      let newCalc = mathGame.generateCalculation(mathGame.difficulty);
      let cap = `${cx}\n\n🧮 ${newCalc} *= ???*\n\n⏰ *الوقت: ${mathGame.timeLimit.toString().slice(0, 2)} ثانية*`
      let key = conn.sendMessage(m.chat, { text: cap });
      this.mathGame[m.chat].key = key
    } else {
      m.react('❌');
    }
  };
