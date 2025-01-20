import fetch from 'node-fetch';
import { translate } from '@vitalets/google-translate-api';

let handler = async (m, { conn }) => {
  let room;
  let id = m.chat;
  conn.rathergame = conn.rathergame ? conn.rathergame : {};
  let name = global.db.data.users[m.sender].name;

  if (conn.rathergame[id]) delete conn.rathergame[id];

  room = {
    id: 'rt-' + (+new Date()),
    chat: m.chat,
    player: m.sender,
    rathergame: {}
  };

  let num = Math.floor(Math.random() * 670) + 1;
  const res = await fetch('https://wouldurather.io/api/question?id=' + num);
  const aa = await res.json();
  let options = await translate(`${aa.option1} - ${aa.option2}`, { from: 'en', to: 'ar', autoCorrect: true})
 let option1 = options.text.split(' - ')[0]
 let option2 = options.text.split(' - ')[1]
  if(option2.length < 10){
let opts = await translate(`${aa.option1} - ${aa.option2}`, { from: 'en', to: 'ar', autoCorrect: true})
 option1 = opts.text.split('-')[0]
 option2 = opts.text.split('-')[1]
  }
  let totalVotes = aa.option1Votes + aa.option2Votes;
  let op1v = ((aa.option1Votes / totalVotes) * 100).toFixed(2);
  let op2v = ((aa.option2Votes / totalVotes) * 100).toFixed(2);

  room.rathergame.op1v = op1v;
  room.rathergame.op2v = op2v;
  room.rathergame.op1 = option1;
  room.rathergame.op2 = option2;
  room.rathergame.name = name;

  let bord = `◈ *اللاعب: ${name}*\n\n❶ *${option1}*.\n\n❷ *${option2}*.`;

  let key = await conn.sendMessage(m.chat, { text: bord, mentions: [m.sender] });
  conn.rathergame[m.chat] = { key: key, ...room };
};

handler.before = async (m, { conn }) => {
  conn.rathergame = conn.rathergame ? conn.rathergame : {};

  if (m.isBaileys || !(m.chat in conn.rathergame)) return;
  if (/^(safi|stop)$/i.test(m.text.toLowerCase())) {
    for (let id in conn.rathergame) {
      delete conn.rathergame[id];
    }
    await m.react('✅');
    return true;
  }

  const input = m.text.trim();
  if (!/^[1|2]$/.test(input)) return;

  let room = conn.rathergame[m.chat];
  let selectedOption = input == 1 ? room.rathergame.op1 : room.rathergame.op2;
  let selectedVotes = input == 1 ? room.rathergame.op1v : room.rathergame.op2v;
  let otherVotes = input == 1 ? room.rathergame.op2v : room.rathergame.op1v;
  if (conn.rathergame[m.chat].key) {
    await conn.sendMessage(m.chat, { delete: room.key });
  }

   let key;
  if (parseFloat(selectedVotes) > parseFloat(otherVotes)) {
   key = await m.reply(`😃 أنت مع *الأغلبية* ✅ الذين يفضلون *"${selectedOption}"* بنسبة *%${selectedVotes}*`, null);
  } else {
   key = await m.reply(`🙁 أنت مع *الأقلية* ✴️ الذين يفضلون *"${selectedOption}"* بنسبة *%${selectedVotes}*`, null);
  }
await delay(4000);
  let num = Math.floor(Math.random() * 670) + 1;
  const res = await fetch('https://wouldurather.io/api/question?id=' + num);
  const aa = await res.json();
 let option1, option2;
  try {
    let options = await translate(`${aa.option1} - ${aa.option2}`, { from: 'en', to: 'ar', autoCorrect: true });
    option1 = options.text.split(' - ')[0].trim();
    option2 = options.text.split(' - ')[1].trim();

    if (option2.length < 10) {
      options = await translate(`${aa.option1} - ${aa.option2}`, { from: 'en', to: 'ar', autoCorrect: true });
      option1 = options.text.split(' - ')[0].trim();
      option2 = options.text.split(' - ')[1].trim();
    }

  } catch (error) {
    try {
      let zzz = await fetch(`https://api.popcat.xyz/translate?to=ar&text=${encodeURIComponent(`${aa.option1} - ${aa.option2}`)}`);
      let re = await zzz.json();
      option1 = re.translated.split('-')[0].trim();
      option2 = re.translated.split('-')[1].trim();
    } catch (error) {
    }
  }
  let totalVotes = aa.option1Votes + aa.option2Votes;
  let op1v = ((aa.option1Votes / totalVotes) * 100).toFixed(2);
  let op2v = ((aa.option2Votes / totalVotes) * 100).toFixed(2);
  room.rathergame.op1v = op1v;
  room.rathergame.op2v = op2v;
  room.rathergame.op1 = option1;
  room.rathergame.op2 = option2;

let bord = `◈ *اللاعب: ${room.rathergame.name}*\n\n❶ *${option1}*.\n\n❷ *${option2}*.`;

  setTimeout(async () => {
    await conn.sendMessage(m.chat, { delete: key });
  }, 5000);

  let pingMsg = await conn.sendMessage(m.chat, { text: bord, mentions: [m.sender] });
  conn.rathergame[m.chat].key = pingMsg
  conn.rathergame[m.chat] = {...room};
  setTimeout(async () => {
    delete conn.rathergame[m.chat];
  }, 300000); // 5 minutes
};

handler.customPrefix = /^(highlow|hl)(\s|$)/i;
handler.command = new RegExp;
export default handler;
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
