import similarity from 'similarity'
import fs from 'fs'
const threshold = 0.67

const handler = (m) => m;
handler.before = async function(m) {
  const user = global.db.data.users[m.sender].games;
  let id = m.chat
  let userAnswer = m.text.trim().toLowerCase() || m.text;
  this.games = this.games ? this.games : {}
  if(!this.games.length > 0 || m.chat in this.games ) return;
  let player = this.games[id][3];
  let Type = this.games[id][2];
  let json = this.games[id][1];
  if (!(id in this.games) || userAnswer.isBaileys || userAnswer.fromMe || !userAnswer || userAnswer.startsWith('.') || userAnswer === 'مساعدة' || m.sender != player) return !0;
  if (userAnswer === 'ماعرفتش') {
    delete this.games;
    return !0;
  }
  let maxAttempts = 3;
  this.games[id].attempts = this.games[id].attempts ? this.games[id].attempts : 0;

  const gameData = JSON.parse(JSON.stringify(json)); // تعديل اسم المتغير

  let capen = typeof gameData.en_capital;
    if ((userAnswer === '1' && gameData.filename === gameData.q1) ||
      (userAnswer === '2' && gameData.filename === gameData.q2) ||
      (userAnswer === '3' && gameData.filename === gameData.q3) ||
      (userAnswer === '4' && gameData.filename === gameData.q4) ||
      (userAnswer && userAnswer === gameData.capital) ||
      (userAnswer && userAnswer === gameData.en_capital) ||
      (userAnswer === gameData.filename) ||
      (userAnswer && userAnswer === capen.toLowerCase()) ||
      (userAnswer && userAnswer === gameData.rr)) {
    m.react('✅'); 
    user[Type] = (user[Type] || 0) + 1;

    let pathUrl;
    if (Type === 'quiz1') {
      pathUrl = './src/quran/quiz1.json';
    } else if (Type === 'quiz2') {
      pathUrl = './src/quran/quiz2.json';
      Type = 'quiz2';
    } else if (Type === 'quiz3') {
      pathUrl = './src/quran/quiz3.json';
      Type = 'quiz3';
    } else if (Type === 'word') {
      pathUrl = './src/game/word.json';
      Type = 'word';
    } else if (Type === 'cap') {
      pathUrl = './src/game/cap.json';
      Type = 'cap';
    } else if (Type === 'qaya') {
      pathUrl = './src/quran/qaya.json';
      Type = 'qaya';
    } else if (Type === 'flags') {
      pathUrl = './src/game/flags.json'; 
      Type = 'flags';
    } else {
      return;
    }

      let games = JSON.parse(fs.readFileSync(pathUrl));
      let nextQuestion = user[Type];
        if (nextQuestion === games.length) { 
          conn.reply(m.chat, '🤷🏻‍♂️ *انتهت الأسئلة!*', null);
          delete conn.games[id];
          return;
      }
      let json = games[user[Type]];
      let nextQuestionData = json;
      let caption, replyParams;
    if (Type === 'flags') {
      caption = `*علم أي دولة هذا:* ${nextQuestionData.name}

      🕘 *• الوقت:* 30 ثانية
      `.trim();
    } else if (Type === 'word' || Type === 'klma') {
      caption = `*${nextQuestionData.qq}*

      🕘 *• الوقت:* 30 ثانية
      `.trim();
    } else if (Type === 'qaya') {
      caption = `📜 *أكمل الآية:* أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ :\n\n ${nextQuestionData.path}

      🕘 *• الوقت:* 30 ثانية
      `.trim();
    } else if (Type === 'cap' || Type === 'عواصم') {
      caption = `🌍 *ماهي عاصمة دولة ${nextQuestionData.name}:*

      🕘 *• الوقت:* 30 ثانية
      `.trim();
    } else {
      let options = [
        `❶- *${nextQuestionData.q1}*`,
        `❷- *${nextQuestionData.q2}*`,
        `❸- *${nextQuestionData.q3}*`,
        `❹- *${nextQuestionData.q4}*`
      ].join('\n');
      caption = `
      • *${nextQuestionData.path}*\n
      ${options}\n
      🕘 *• الوقت:* 30 ثانية
      `.trim();
    }
     replyParams = [
      await this.reply(m.chat, caption),
      json,
      Type
    ];

     conn.games[id] = replyParams
    
  } else if ((similarity(userAnswer, gameData.capital) >= threshold) || 
             (similarity(userAnswer, gameData.en_capital) >= threshold) ||
             (similarity(userAnswer, capen) >= threshold) || 
             (similarity(userAnswer, gameData.filename) >= threshold) || 
             (similarity(userAnswer, gameData.rr) >= threshold)) {
    m.react('😬');
  } else {
    this.games[id].attempts++;
    if (this.games[id].attempts >= maxAttempts) {
      m.react('❌');
      let rep = gameData.capital || gameData.filename || gameData.rr || gameData.en_capital || capen;
      this.reply(m.chat, `الجواب هو: *${rep}*`, this.games[id][0])
      delete this.games[id];
    } else {
      m.react('🙅🏻‍♂️');
      m.reply(`*إجابة خاطئة* لديك *${maxAttempts - this.games[id].attempts}* محاولات متبقية.`);
    }
  }

  return !0
}
export default handler
