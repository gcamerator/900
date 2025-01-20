import Tesseract from 'tesseract.js';
import {writeFile, unlink} from 'fs/promises';
const handler = async (m, { conn, args }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";
    if (!mime) throw `Fotonya Mana Kak?`;
    if (!/image\/(jpe?g|png)/.test(mime)) throw `*الصورة*`;
  let img = await q.download?.();
  const filePath = `./hh.png`;
   await writeFile(filePath, img);
let lang = 'eng';
    if(args[0] === 'ar'){lang = 'ara'} else if(args[0] === 'en'){lang = 'eng'}
  const { data: { text } } = await Tesseract.recognize(filePath, lang);
  await conn.sendMessage(m.chat, { text: text }, { quoted: null }); 
  await unlink(filePath); 
} catch (ee){
console.log(ee)
}
}
handler.command = /^(img2txt|imgtxt)$/i
export default handler
