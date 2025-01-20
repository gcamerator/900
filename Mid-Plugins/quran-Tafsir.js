import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  try {
    const surahNumber = args[0];
    const ayahNumber = args[1];
    const response = await fetch('https://raw.githubusercontent.com/midsoune/JSON/main/quran.json');
    const api = await response.json();

    if (!surahNumber || !ayahNumber) {
      throw new Error(`*يجب إدخال رقم السورة ورقم الآية معًا*\n\n*مثال*:\n.tafsir 2 18\n\n(هنا سيعطينا تفسير الآية رقم 18 من السورة رقم 2)`);
    }

    const tafsirResult = await surahTafsir('ar-tafsir-muyassar', surahNumber, ayahNumber);
    const tafsirIbnKatir = await await surahTafsir('ar-tafsir-ibn-kathir', surahNumber, ayahNumber);

    if (tafsirResult && tafsirIbnKatir) {
      const text = `🔍 *التفسير الميسر للآية:*\n\n📜 *الآية:* ${api[surahNumber - 1].ayahs[ayahNumber - 1].text.ar}\n\n📖 *التفسير الميسر:* ${tafsirResult}\n\n📖 *تفسير ابن كثير:* ${tafsirIbnKatir}\n\n( سورة ${api[surahNumber - 1].asma.ar.short} : الآية ${args[1]} )`;
      await m.reply(text);
    }
  } catch (error) {
    console.error(error);
  }
};
handler.command = /^(tafsir)$/i;

export default handler;

async function surahTafsir(tafsirType, surahNumber, ayahNumber) {
  try {
    const url = `https://quran.com/ar/${surahNumber}:${ayahNumber}/tafsirs/${tafsirType}`;
    const re = await fetch(url);
    const html = await re.text();
    const $ = cheerio.load(html);

    // استخرج التفسير
    const tafsirText = $('.tafsirs_tafsirContainer__DIxKj div.TafsirText_md__mJWtv').text().trim();
    return tafsirText;
  } catch (error) {
    console.error(error);
    return null;
  }
}
