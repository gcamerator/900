import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
let url;
let handler = async (m, { conn, mText, mCommand }) => {
  if (!mText) {throw `*دخل رقم السطاج لي أنت فيه دابا*\n\n💡 *باش تشوف كلمة واحدة*\n*.krach 200*\n\n💡 *باش تشوف كاع الكلمات*\n*.krach1 200*`; return}
 let text = mText;
 let command = mCommand;
    try {
    if (text < 1530) {
      url = `https://ramezz.com/%D9%83%D9%84%D9%85%D8%A7%D8%AA-%D9%83%D8%B1%D8%A7%D8%B4-${text}.html`;
  } else if (text >= 1531) {
      m.reply (`⚠️ *المرحلة الأخيرة هي 1530 حاليا*`);
    }
    let item = await fetchCrashSolution(text);
    const texxt = item.solu;
    const words = texxt.split(/[,،\s]+/).filter(word => word.length > 0); 
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const allwords = words.join("* \n∘ *");
    let caption1 = `‏ ∘ *${randomWord}*`;
    let caption2 = `‏ *${item.title}:M*\n\n‏ ∘ *${allwords}*`;
    if (command === 'krach' || command === 'kalima' || command === 'كراش') {
      if (words.length > 0) {
       await m.reply(caption1, null);}
    } else if (command === 'kraach' || command === 'kalimat' || command === 'كرااش') {
      await m.reply(caption2, null);
    } 
  } catch (e) {
    console.error('Error:', e);
  }
};
async function fetchCrashSolution(text) {
  try {
    const response = await fetch(url);
 const html = await response.text();
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr('content').replace(' - الحل الكامل مع الشرح', '');
    const solu = $('#solutionModal .bg-green-100 p.solution-text').text().trim();
return { solu, title}; // image
  } catch (error) {
    console.error('Error:', error);
    throw error;}}
handler.customPrefix = /^(كراش|krach|kraach|kalima|kalimat|كرااش)(\s|$)/i;
handler.command = new RegExp;
export default handler;
