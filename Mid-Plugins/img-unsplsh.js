import axios from "axios";
import {translate} from '@vitalets/google-translate-api';

let handler = async (m, { conn, isOwner, usedPrefix, command, args }) => {
  let query = "هذا الامر خاص بتحميل الصور من موقع\n\nunsplash.com/\n\n نكتب هكدا على سبيل المثال: \n*.unsplash* night stars";
  let text;

  if (args.length >= 1) {
    text = args.join(" ");
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text;
  } else {
    throw query;
  }

  try {
    let translatedText = await translate(text, { from: 'auto', to: 'en' });
    var images = await searchImages(translatedText.text);

    if (images.length > 0) {
      var randomImage = images[Math.floor(Math.random() * images.length)];
      conn.sendFile(m.chat, randomImage.urls.full || randomImage.urls.regular, "النتيجة", `♥ *${translatedText.text}*`, m);
    } else {
      throw "لم يتم العثور على صورة مناسبة.";
    }
  } catch (e) {
    throw e;
  }
};

handler.help = ["unsplash"];
handler.tags = ["misc"];
handler.command = /^(unsplash)$/i;
export default handler;

async function searchImages(term) {
  const response = await axios.get("https://api.unsplash.com/search/photos", {
    headers: {
      Authorization: "Client-ID mxr-J3YtqewQPrikLf7npmJY7ZvKKcxg7erlUer4bJM",
    },
    params: {
      query: term,
    },
  });

  return response.data.results;
}
