let handler = async (m, { conn, mText }) => {
  conn.guessnum = conn.guessnum ? conn.guessnum : {};
  if (m.chat in conn.guessnum)  delete conn.guessnum[m.chat];
  let command = m.text.split(' ')[0];
  let text = mText;
  let level, difuc, trys;
       if (text === '1') { level = 50; difuc = "سهل"; trys = 8 }
  else if (text === '2') { level = 200; difuc = "عادي"; trys = 9 }
  else if (text === '3') { level = 500; difuc = "متوسط"; trys = 10 }
  else if (text === '4') { level = 1000; difuc = "صعب"; trys = 11 }
  else if (text === '5') { level = 5000; difuc = "صعب جدا"; trys = 12 }
  else throw `❓ *أدخل رقم المستوى بين 1 و 5*\n\n*مثال:*\n\n*${command} 1 (سهل)*\n*${command} 2 (عادي)*\n*${command} 3 (متوسط)*\n*${command} 4 (صعب)*\n*${command} 5 (صعب جدا)*\n`;

  let randomNumber = Math.floor(Math.random() * level) + 1;
  let cap = `🎮 *لعبة التخمين* 🎮\n\n🧮 *الصعوبة: ${difuc}*\n\n🤖 *الرقم الذي أفكر فيه يوجد بين 1 و ${level}*\n\n💬 *حاول تخمين الرقم في أقل من ${trys} محاولات.*`;

  let key = await conn.sendMessage(m.chat, { text: cap }, { quoted: null });
  conn.guessnum[m.chat] = { key: key, number: randomNumber, level: level, difuc: difuc, player: m.sender, trying: 0, trys: trys };
};

handler.before = async (m, { conn }) => {
    conn.guessnum = conn.guessnum ? conn.guessnum : {};
 if(!(m.chat in conn.guessnum)) return;
  if (isNaN(m.text) || conn.guessnum[m.chat].player != m.sender) return;
  let guess = parseInt(m.text, 10); 
  let game = conn.guessnum[m.chat];
  let txxt;
  if (guess > game.number) txxt = '⏬ الرقم الذي أدخلته أكبر من الرقم الذي أفكر فيه.';
  else if (guess < game.number) txxt = '⏫ الرقم الذي أدخلته أصغر من الرقم الذي أفكر فيه.';
  else if (guess === game.number) {
    txxt = '🥳 مبروووك! لقد وجدت الرقم الذي أفكر فيه.';
     setTimeout(() => {
     conn.sendMessage(m.chat, { delete: wkey.key });
     }, 8000)
    return delete conn.guessnum[m.chat];
  } else return;
  game.trying++;
  if(game.key) await conn.sendMessage(m.chat, { delete: game.key });
  if(game.trys == game.trying) {
  let wkey = conn.sendMessage(m.chat, { text: `🎮 *لعبة التخمين 1 - ${game.level}* 🎮\n\n☹️ *إنتهت عدد المحاولات لديك: الرقم الذي أفكر فيه هو: ${game.number}*\n\n🔂 *عدد المحاولات: [${game.trying}/${game.trys}]*` }, { quoted: null });
 setTimeout(() => { conn.sendMessage(m.chat, { delete: wkey.key })}, 8000)
  return delete conn.guessnum[m.chat];                       
 }
  let cap = `🎮 *لعبة تخمين رقم بين 1 و ${game.level}* 🎮\n\n*${txxt}*\n\n🔂 *عدد المحاولات: [${game.trying}/${game.trys}]*`;
 let key = await conn.sendMessage(m.chat, { text: cap }, { quoted: null });
  game.key = key
};
handler.customPrefix = /^(guess|خمن|guessnum|guessnumber)(\s|$)/i;
handler.command = new RegExp;
export default handler;
