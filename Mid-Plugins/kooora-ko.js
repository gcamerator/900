import * as cheerio from 'cheerio';
import fetch from "node-fetch";
import moment from "moment";

async function kora(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const result = [];
    $(".panel .albaflex .match-container").each((index, element) => {
      const card = {
    teamA: $(element).find(".right-team .team-name").text().trim(),
    teamB: $(element).find(".left-team .team-name").text().trim(),
    time: $(element).find(".match-center .match-timing div#match-time").text().trim(),
    score: $(element).find(".match-center .match-timing .result").text().trim(),
    info: $(element).find(".match-info ul li span").map((index, el) => $(el).text()).get().join(' • ')
          .replace(/\غير معروف/g, "-").replace(/\للمحترفين/g, "").replace(/\الممتاز/g, ""),
    statu: $(element).find(".match-center .match-timing .date").text().trim()
          .replace(/\لم تبدأ بعد/g, "")
          .replace(/\جارية الان/g, "مباشر")
          .replace(/\إنتهت المباراة/g, "إنتهت"),
      };
      result.push(card);
    });
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

let handler = async (m, { conn, text, command }) => {
  let url, txtx, shownOnce = false;
  if (command === "ko") {
    url = "https://go.spor-live.com/matches-today/";
    txtx = "*مباريات اليوم* :\n‏▬▬▬▬▬▬▬▬▬▬";
  } else if (command === "kon") {
    url = "https://go.spor-live.com/matches-today/";
    txtx = "*المباريات الجارية حاليا* :\n‏▬▬▬▬▬▬▬▬▬▬▬";
  } else if (command === "kot") {
    url = "https://go.spor-live.com/matches-tomorrow/";
    txtx = "*مباريات الغد* :\n‏▬▬▬▬▬▬▬▬▬";
  } else if (command === "koy") {
    url = "https://go.spor-live.com/matches-yesterday/";
    txtx = "*مباريات الأمس* :\n\n‏▬▬▬▬▬▬▬▬▬▬";
  }

  try {
    let res = await kora(url);
    let teks = res
      .map((item, index) => {
        const date = item.time;
        const statu = item.statu;
        const originalMoment = moment(date, "hh:mm A");
        const cm = originalMoment
          .clone()
          .subtract(2, "hours")
          .format("HH:mm");
        if (!shownOnce) { // يتحقق إذا كان النص لم يتم عرضه بعد
            shownOnce = true; // يعين القيمة إلى true بمجرد عرض النص للمرة الأولى
            return `${txtx}`; // يظهر النص مرة واحدة فقط في بداية الرسالة
        }
        if (statu === "قريبا") {
          return `【 *${item.teamA}* ✘ *${item.teamB}* 】${statu}\n_${item.info}_`;
        } else {
          return `【 *${item.teamA}* ✘ *${item.teamB}* 】${statu}\n_${item.info}_`;
        }
      })
      .filter((v) => v)
      .join("\n\n");
    await conn.reply(m.chat, teks, m);
  } catch (e) {
    console.error("Error:", e);
    await conn.reply(m.chat, "حدث خطأ أثناء استرجاع الأخبار من kora", m);
  }
};

handler.help = ["kora"];
handler.tags = ["internet"];
handler.command = /^(ko|kot|koy)$/i;

export default handler;
