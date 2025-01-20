import {translate} from '@vitalets/google-translate-api';
const handler = async (m, { mTexts, mCommand, mText}) => {
let lang = mTexts[0];
let text = mText;
let command = mCommand;
if (!text && !m.quoted.text) return m.reply(`*دخل النص لي بغيتي تترجمو للعربية أو اللغة + النص لي بغيتي تترجمو للغة أخرى*\n\n*مثال:*\n.${command} Hello\n.${command} fr Hello`);
let langs = ['ar', 'fr', 'en', 'es', 'de', 'it', 'ja', 'ko', 'zh', 'ru'];
let emo = ['🇲🇦', '🇫🇷', '🇺🇸', '🇪🇸', '🇩🇪', '🇮🇹', '🇯🇵', '🇰🇷', '🇨🇳', '🇷🇺'];

if (!langs.includes(lang) && mTexts[0].length != 2) {
  lang = 'ar'; // تعيين اللغة الافتراضية إلى 'ar'
  text = mText; // استخدام النص بالكامل دون تقسيم
} else {
  lang = mTexts[0]
  text = mText.split(' ').slice(1).join(' '); // استخدام النص بدون الجزء الأول الذي يمثل اللغة
}

if (!text && m.quoted.text) {
  text = m.quoted.text;
}

  try {
    const result = await translate(text, { to: lang, autoCorrect: true });
    let emoji = emo[langs.indexOf(lang)];
    await conn.reply(m.chat, `${emoji} *${result.text}*`, null);
  } catch (err) {
    console.error(err);
  }
};
handler.customPrefix = /^(ترجم|translate|traduire|ترجمة)(\s|$)/i;
handler.command = new RegExp;
export default handler
