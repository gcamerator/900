import { parseString } from 'xml2js';
import iconv from 'iconv-lite';
import axios from 'axios';
let handler = async (m, { con, mText }) => {
  conn.feud = conn.feud ? conn.feud : {};
  const feud = new feudGame();
  if (Object.values(conn.feud).find((room) => room.id.startsWith('fd') && [room.feud.playerA, room.feud.playerB].includes(m.sender))) throw '*أنت ديجا بديتي شي لعبة كتب، Stop باش تحبس*';
  if(!m.quoted) return conn.reply(m.chat, '👥 *طاغي لي باغي تلعب معاه*', null)
const quess = ['كيفية أكل', 'ما لون', 'مدينة', 'صلاة', 'كيفية طبخ', 'السفر إلى دولة', 'هل يمكن أكل', 'دواء لمرض', 'تحميل لعبة', 'تحميل تطبيق', 'مشاهدة فيلم', 'كم عدد أيام شهر', 'صور لفريق', 'سورة', 'كم عدد', 'كم هي مدة'];
  let ques;
  if (mText) {ques = mText} else { ques = quess[Math.floor(Math.random() * quess.length)]}
  let res = await feudG(ques);
  let room = {
      id: 'fd-' + (+new Date()),
      chat: m.chat,
      feud: feud 
  }; 
  room.feud.ques = ques;
  room.feud.playerA = m.sender,
  room.feud.playerB = m.quoted.sender,
  room.feud.currentPlayer = m.sender,
  room.feud.words = res;

 await conn.sendMessage(m.chat, {text: `🎮 𝙂𝙊𝙊𝙂𝙇𝙀 𝙁𝙀𝙐𝘿 𝙂𝘼𝙈𝙀 🎮\n\n🔎 *عندما يبحث الناس عن [ ${ques} ... ]*\n*يظهر جوجل بعض الإقتراحات:*\n\n• *${ques} ....*\n• *${ques} ....*\n• *${ques} ....*\n• *${ques} ....*\n\n🖊️ *أدخل كلمة من الممكن تواجدها ضمن إقتراحات جوجل.*`});

  conn.feud[room] = room;
}
handler.customPrefix = /^(feud|googlefeud|فيود)$/i
handler.command = new RegExp
export default handler

function feudGame() {
 this.gameOver = false;
 this.words = [];
 this.right = [];
 this.rights = [];
 this.playerA = null;
 this.playerB = null;
 this.currentPlayer = null;
 this.playerApoints = 0;
 this.playerBpoints = 0;
}
feudGame.prototype.matchCheck = function(aa) {
  let answer = aa.toLowerCase();
  const matched = this.words.find(sentence => {
    const words = sentence.split(' ');
    return words.some(word => word === answer);
  });
  if (matched) {
    this.words.splice(this.words.indexOf(matched), 1); 
      this.rights.push(matched);
      this.right.push(matched);
      return true;
    } else {
      return false;
    }
};


feudGame.prototype.togglePlayer = function() {
    this.currentPlayer = this.currentPlayer === this.playerA ? this.playerB : this.playerA;
};

async function feudG(query) {
  const lang = ['ar', 'es', 'fr', 'en'];
  const urlPromises = lang.map(async (langCode) => {
    const url = `http://clients1.google.com/complete/search?hl=${langCode}&output=toolbar&cr=countryMA&gl=ma&q=${encodeURIComponent(query)}`;
    try {

      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const xml = iconv.decode(response.data, 'Windows-1256'); 

      return new Promise((resolve, reject) => {
        parseString(xml, (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          if (result && result.toplevel && result.toplevel.CompleteSuggestion) {
            const suggestions = result.toplevel.CompleteSuggestion.map(item => item.suggestion[0]['$'].data.replace(`${query} `, ''));
            resolve(suggestions);
          } else {
            resolve([]);
          }
        });
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  try {
    const allResults = await Promise.all(urlPromises);
    const mergedResults = allResults.reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
    const uniqueResultsSet = new Set(mergedResults);
    const uniqueResults = Array.from(uniqueResultsSet);
    console.log(uniqueResults)
    return uniqueResults;

  } catch (error) {
    console.error(error);
    return [];
  }
}
