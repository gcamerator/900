import axios from 'axios';
let handler = async (m, { conn, usedPrefix, command }) => {
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || ''
if (!mime) throw 'المرجو الاشارة للصورة التي تريد ان تزيل خلفيتها ثم  اكتب \n' + usedPrefix+command 
try {
const img = await q.download()
const { data } = await axios.post("https://backend.zyro.com/v1/ai/remove-background", { 
image: "data:image/jpeg;base64," + img.toString("base64") 
})
const image = Buffer.from(data.result.split(",")[1], "base64")
await conn.sendMessage(m.chat, {image: image, caption: ''}, {quoted: null})
} catch (e) {
m.react(error)
  console.log(e)
} finally {
  }  
}
handler.command = /^(rbg|removebg)$/i
export default handler
// import uploadImage from '../lib/uploadImage.js';
// import {sticker} from '../lib/sticker.js';
// const handler = async (m, {conn, command, text}) => {
//   try {
//     const q = m.quoted ? m.quoted : m;
//     const mime = (q.msg || q).mimetype || '';
//     const img = await q.download();
//     const url = await uploadImage(img);
//     const sremovebg = global.API(`https://api.lolhuman.xyz/api/removebg?apikey=${lolkeysapi}&img=${url}`);
//     if (command === 'rbg' || command === 'removebg') {
//         conn.sendFile(m.chat, sremovebg, 'image.jpeg', '', m, {asSticker: false});
//     } else {
//     const stickerr = await sticker(false, sremovebg, global.packname, global.author);
//     conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, {asSticker: true});}
//   } catch (e) {
//     m.reply(e);
//   }
// };
// handler.command = /^rbg|removebg|sremovebg|srbg$/i;
// export default handler;
