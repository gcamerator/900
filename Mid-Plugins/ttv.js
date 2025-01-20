import axios from "axios";
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
if(!text) return m.reply(`*Example:*\n\n*${usedPrefix + command} Casablanca*`)
    const res = await tikSearch(text);
    let i = res[0].play;
    await conn.sendFile(m.chat, i, "error.mp4", null, m);
  } catch (e) {}
};
handler.command = ["ttv", "tiktokvideo", "تيكتوك"];
export default handler;

async function tikSearch(text) {
  const options = {
    method: "GET",
    url: "https://tiktok-scraper7.p.rapidapi.com/feed/search",
    params: {
      keywords: text,
      region: "ma",
      count: "1",
      cursor: "0",
      publish_time: "0",
      sort_type: "0",
    },
    headers: {
      "X-RapidAPI-Key": "b38444b5b7mshc6ce6bcd5c9e446p154fa1jsn7bbcfb025b3b",
      "X-RapidAPI-Host": "tiktok-scraper7.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
     return response.data.data.videos;
  } catch (error) {
    console.error(error);
    return null;
  }
}
