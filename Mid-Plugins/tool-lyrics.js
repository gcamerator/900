import axios from "axios";
import * as cheerio from 'cheerio';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let text;
    if (args.length >= 1) {
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else throw ".lyrics إسم الأغنية";
 
            try {
                const { data } = await axios.get("https://www.lyricsfreak.com/search.php?a=search&q=" + text);
                const $ = cheerio.load(data);
                const h1 = $(".song");
                const hh = h1.attr("href");
              if (!hh) return m.react(error);
                const huu = await axios.get("https://www.lyricsfreak.com" + hh);
     const s = cheerio.load(huu.data);
     const h2 = s(".lyrictxt").text().replace('Verse ', ' 📃 ').replace('Pre-Chorus ', ' 🥁 ').replace('Bridge', ' 🔉🔉 ').replace('1', '').replace('2', '').replace('3', '');
                const frank = `🎧 *كلمات الأغنية* 🎧\n${h2}`;
                await m.reply(frank);
            } catch (error) {
                throw error;
            }

    };
handler.command = /^lyrics/i;
export default handler;
