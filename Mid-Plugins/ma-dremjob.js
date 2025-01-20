import axios from 'axios'
import * as cheerio from 'cheerio';
let handler = async (m) => {
  delete conn.dreamj[m.chat];
  conn.dreamj = conn.dreamj ? conn.dreamj : {};
  let message = ''; 

  let res = await dreamJob();
  res.forEach((item, index) => {
      message += `> [${item.date}]\n*| [${index + 1}].* *${item.title}*\n\n`;
  });
const key =  await conn.sendMessage(m.chat, { text: message }, { quoted: null });

    conn.dreamj[m.chat] = { list: res, key, timeout: setTimeout(() => { 
      delete conn.dreamj[m.chat]; }, 2500 * 1000)};
  };
handler.before = async (m, { conn }) => {
  conn.dreamj = conn.dreamj ? conn.dreamj : {};

  if (m.isBaileys || !(m.chat in conn.dreamj)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return; 

  const { list, key } = conn.dreamj[m.chat];
  const index = parseInt(input);
  let r = index - 1
  let res = await dreamJobu(list[r].link)
  if (res.cont) {
    let txt = res.cont.replace(/\t\t/g, '').replace(/\n\n\n/g, '\n');
    await conn.sendMessage(m.chat, {
        image: { url: res.image },
        caption: res.cont // txt
    }, { quoted: null });
  }
  console.log(res.results[0].images)
  for (let i = 0; i < res.results[0].images.length; i++) {
      await conn.sendMessage(m.chat, {
          image: { url: res.results[0].images[i] }
      }, { quoted: null });
  }
  }

handler.command = /^(dreamjob|dreamj|djob)$/i;
export default handler

async function dreamJob(){
  const url = 'https://www.dreamjob.ma';
  try {
    const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const jobListings = $('.jeg_posts_wrap article');
      let result = [];

      jobListings.each((index, element) => {
          const title = $(element).find('.jeg_postblock_content h3 a').text().trim();
          const link = $(element).find('.jeg_thumb a').attr('href');
          const date = $(element).find('.jeg_postblock_content .jeg_post_meta a').text().trim(); 
          result.push({ title, date, link });
      });
      return result;
  } catch (error) {
  console.log(`An error occurred: ${error.message}`);
  }
}

async function dreamJobu(url){
  try {
    const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const jobListings = $('.content-inner');
      let results = [];

    jobListings.each((index, element) => {
        const images = $(element).find('a').map((i, img) => $(img).attr('href')).get().filter(src => src.endsWith('.jpg') || src.endsWith('.png'));
        results.push({ images });
    });
     const image = $('.featured_image a img').attr('src');
    const cont = $('.entry-content p span').map((i, span) => $(span).text().trim()).get().join('\n\n');
      return { cont, image, results };
  } catch (error) {
  console.log(`An error occurred: ${error.message}`);
  }
} 
