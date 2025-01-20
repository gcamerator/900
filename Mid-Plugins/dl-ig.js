// const { igdl } = await import('ruhend-scraper')
// let handler = m => m
// handler.before = async function (m) {  
//     let doo = m.text.match(/(https?:\/\/(?:www\.)?instagram\.[a-z\.]{2,6}\/[\w\-\.]+(\/[^\s]*)?)/g);
//       if (doo) { 
//          let res = await igdl(doo[0]);
//          let data = await res.data;
//          if (data.length > 0) {
//             for (let i of data) {
//           conn.sendFile(m.chat, i.url, {quoted: null });
//   } }}}
// export default handler

import axios from 'axios';
import * as cheerio from 'cheerio';
let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `✳️ \n *${usedPrefix + command}* https://www.instagram.com/p/CYHeKxyMj-J/?igshid=YmMyMTA2M2Y=`
   

   let res = await igdl(args[0])
    for (let result of res.data) {
    conn.sendFile(m.chat, result.url, 'igdl.mp4', ``, m)
  }
}
handler.help = ['instagram <link ig>']
handler.tags = ['dl']
handler.command = ['ig', 'igdl', 'instagram', 'igimg', 'igvid'] 

export default handler 


async function igdl(url) {
   try {
      const response = await axios.post("https://saveig.app/api/ajaxSearch", new URLSearchParams({ q: url, t: "media", lang: "en" }).toString(), {
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Origin': 'https://saveig.app/en',
            'Referer': 'https://saveig.app/en',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
         }
      });

      const $ = cheerio.load(response.data.data);
      const data = $('div.download-items__btn').map((i, e) => {
         const type = $(e).find('a.abutton ').attr('href').match('.jpg') ? 'image' : 'video';
         const url = $(e).find('a').attr('href');
         return {
 type, 
url
 };
      }).get();

      return {
         status: data.length > 0,
         data
      };
   } catch (error) {

      return {
         status: false,
         msg: error.message
      };
   }
} 
