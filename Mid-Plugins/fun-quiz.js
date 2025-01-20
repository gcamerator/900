import fs from 'fs';

let timeout = 45000;
let handler = async (m, { conn, mCommand }) => {
const user = global.db.data.users[m.sender].games;
  let id = m.chat;
  let command = mCommmand;
  let player = m.sender
  conn.games = conn.games ? conn.games : {};

  if (id in conn.games) {
    conn.reply(m.chat, 'لا تزال هناك أسئلة لم يتم الرد عليها، أو أنك لست الشخص الذي يلعب حاليا.', conn.games[id][0]);
    throw false;
  }

 let Type;
  let pathUrl;
  if (command === 'qu1' || command === 'سؤال') {
    pathUrl = './src/quran/quiz1.json';
   Type = 'quiz1';
  } else if (command === 'qu2' || command === 'سؤاال') {
    pathUrl = './src/quran/quiz2.json';
   Type = 'quiz2';
  } else if (command === 'qu3' || command === 'سؤااال') {
    pathUrl = './src/quran/quiz3.json';
   Type = 'quiz3';
  } else if (command === 'word' || command === 'klma') {
    pathUrl = './src/game/word.json';
   Type = 'word';
    } else if (command === 'cap' || command === 'عواصم') {
     pathUrl = './src/game/cap.json';
Type = 'cap';
    } else if (command === 'qaya') {
     pathUrl = './src/quran/qaya.json';
Type = 'qaya';
  } else if (command === 'flags') {
    pathUrl = './src/game/flags.json'; 
  Type = 'flags';} else {
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
  let caption, replyParams;
  if (command === 'flags') {
    caption = `*علم أي دولة هذا:* ${json.name}

🕘 *• الوقت:* ${Math.round(timeout / 1000)} ثانية
  `.trim();

    replyParams = [
      await conn.reply(m.chat, caption, m),
      json,
       Type
    ];
  } 
  else if (command === 'word' || command === 'klma') {
    caption = `*${json.qq}*

🕘 *• الوقت:* ${Math.round(timeout / 1000)} ثانية
`.trim();

    replyParams = [
      await conn.reply(m.chat, caption, m),
      json,
     Type
    ];
  } 
     else if (command === 'qaya') {
    caption = `📜 *أكمل الآية:* أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ :\n\n ${json.path}

🕘 *• الوقت:* ${Math.round(timeout / 1000)} ثانية
`.trim();

    replyParams = [
      await conn.reply(m.chat, caption, m),
      json,
      Type
    ];
  } 
  else if (command === 'cap' || command === 'عواصم') {
    caption = `🌍 *ماهي عاصمة دولة ${json.name}:*

🕘 *• الوقت:* ${Math.round(timeout / 1000)} ثانية
  `.trim();

    replyParams = [
      await conn.reply(m.chat, caption, m),
      json,
     Type
    ];
  }
  else { if (!json.q4) {
      var options = [
`❶- *${json.q1}*`,
`❷- *${json.q2}*`,
`❸- *${json.q3}*`
      ].join('\n');
    } else {
      var options = [
`❶- *${json.q1}*`,
`❷- *${json.q2}*`,
`❸- *${json.q3}*`,
`❹- *${json.q4}*`
      ].join('\n');
    }

    let caption = `
• *${json.path}*\n
${options}\n
🕘 *• الوقت:* ${Math.round(timeout / 1000)} ثانية
    `.trim();

    replyParams = [
      await conn.reply(m.chat, caption, m),
      json,
     Type,
      player
    ];
  }

  conn.games[id] = replyParams
}
handler.customPrefix = /^(cap|qaya|flags|عواصم|word|klma|qu1|qu2|qu3|سؤال|سؤاال|سؤااال)(\s|$)/i;
handler.command = new RegExp;
export default handler;
