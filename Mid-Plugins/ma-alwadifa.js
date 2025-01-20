import axios from 'axios'
import * as cheerio from 'cheerio';
let handler = async (m) => {
  conn.wadifa = conn.wadifa ? conn.wadifa : {};
  let message = ''; 

  let res = await alwadifa();
  res.forEach((item, index) => {
      message += `> ‏[${item.date}] ـ\n‏*[${index + 1}].* *${item.jobTitle}*\n`;
  });
const key =  await conn.sendMessage(m.chat, { text: message }, { quoted: null });

    conn.wadifa[m.chat] = { list: res, key, timeout: setTimeout(() => { 
      delete conn.wadifa[m.chat]; }, 250 * 1000)};
  };
handler.before = async (m, { conn }) => {
  conn.wadifa = conn.wadifa ? conn.wadifa : {};

  if (m.isBaileys || !(m.chat in conn.wadifa)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return; 

  const { list, key } = conn.wadifa[m.chat];
  const index = parseInt(input);
  let r = index - 1
  let res = await alwadifau(list[r].link)
  if (res.img) {
    await conn.sendMessage(m.chat, {
        image: { url: res.img },
        caption: res.results[0].cont
    }, { quoted: null });
  }

  for (let i = 1; i < res.results[0].images.length; i++) {
    await conn.sendMessage(m.chat, {
        image: { url: res.results[0].images[i] }
    }, { quoted: null });
  }
  }

handler.command = /^(jobs|alwadifa|الوظيفة)$/i;
export default handler

async function alwadifa(){
  const url = 'http://alwadifa-maroc.com/';
  try {
    const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const jobListings = $('.bloc-content');
      let result = [];

      jobListings.each((index, element) => {
          const jobTitle = $(element).find('a').text().trim();
          const jobDetails = $(element).find('p').text().trim();
          const link = url + $(element).find('a').attr('href');
          const date = $(element).find('ul li').first().text().trim(); //.substring(0, 5);)
          result.push({ jobTitle, jobDetails, date, link });
      });

      return result;
  } catch (error) {
  console.log(`An error occurred: ${error.message}`);
  }
}

async function alwadifau(url){
  try {
    const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const jobListings = $('.contenu-offre');
      let results = [];

      jobListings.each((index, element) => {
          const images = $(element).find('p img').map((i, img) => $(img).attr('src')).get();
          const cont = $(element).find('p span').map((i, span) => $(span).text().trim()).get().join('\n');
          results.push({ images, cont });
      });
      const img = results.length > 0 && results[0].images.length > 0 ? results[0].images[0] : null;
      return { img, results };
  } catch (error) {
  console.log(`An error occurred: ${error.message}`);
  }
}
