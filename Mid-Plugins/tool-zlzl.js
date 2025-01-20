import axios from "axios";
import dateFormat from "dateformat";
import {translate} from "@vitalets/google-translate-api";

let handler = async (m, { conn }) => {
  try {
    const earthquakeDataURL =
      "https://www.seismicportal.eu/fdsnws/event/1/query?limit=100&format=json";

    const response = await axios.get(earthquakeDataURL);

    if (response.status === 200) {
      const earthquakeData = response.data;
      const earthquakes = earthquakeData.features;
      const earthquakeDetails = earthquakes
        .filter((earthquake) => earthquake.properties.mag > 3.5) // التصفية بحسب القوة
        .map(async (earthquake) => {
          const mag = earthquake.properties.mag;
          const depth = earthquake.properties.depth;
          const place = earthquake.properties.flynn_region;
          const time = new Date(earthquake.properties.time);
          const url = `https://www.seismicportal.eu/event/${earthquake.id}`;

          const currentTime = new Date(); // الوقت الحالي
          const previousTime = time; // وقت الزلزال
          const timeDifference = Math.abs(currentTime - previousTime);
          const hours = Math.floor(timeDifference / 3600000);
          const minutes = Math.floor((timeDifference % 3600000) / 60000);
          const formattedTime = `قبل ${hours} ساعة و ${minutes} دقيقة`;

          // ترجمة النص إلى اللغة العربية
          const translatedText = await translate(place, {
            from: "en",
            to: "ar",
            autoCorrect: true,
          });

          return `🪜 *قوة الزلزال:* ${mag} درجة\n🗺️ *المكان:* *${translatedText.text}*\n📍 *العمق:* ${depth} كيلومتر\n🕰️ *الوقت:* ${formattedTime}`;
        });

      const earthquakeMessages = await Promise.all(earthquakeDetails);

      // انضم جميع التفاصيل معًا
      const responseMessage = earthquakeMessages.join("\n‏________________\n");

      if (earthquakeDetails.length === 0) {
        m.reply("لم يتم العثور على زلازل بقوة أكبر من 4.");
      } else {
        // أرسل الرسالة المنسقة
        m.reply(
          `*أحدث الزلازل أعلى من 4 درجات:*\n\n${responseMessage}\n\n${site}`,
        );
      }
    } else {
      m.reply("لم يتم العثور على بيانات الزلازل.");
    }
  } catch (error) {
    m.reply("حدث خطأ أثناء جلب بيانات الزلازل.");
  }
};
handler.help = ["earthquake"];
handler.tags = ["tools"];
handler.command = /^(eq|earthquake|zlzl|زلزال)$/i;

export default handler;
