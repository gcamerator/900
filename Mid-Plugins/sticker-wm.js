import {addExif} from '../lib/sticker.js';
const handler = async (m, {conn, text}) => {
  if (!m.quoted) throw '*رد على الملصق الذي تريد إضافة حزمة واسم*';
  let stiker = false;
  try {
    let [packname, ...author] = text.split('_');
    author = (author || []).join('•');
    const mime = m.quoted.mimetype || '';
    if (!/webp/.test(mime)) throw '*[❗]*';
    const img = await m.quoted.download();
    if (!img) throw '❗';
    stiker = await addExif(img, packname || global.packname, author || global.author);
  } catch (e) {
    console.error(e);
    if (Buffer.isBuffer(e)) stiker = e;
  } finally {
    if (stiker) conn.sendFile(m.chat, stiker, 'wm.webp', '', m, false, {asSticker: true});
    else throw '*[❗خطأ❗] آسف، هناك خطأ ما. تحقق من الرد على ملصق وإضافة اسم حزمة واسم مستخدم*';
  }
};
handler.help = ['wm <packname>|<author>'];
handler.tags = ['sticker'];
handler.command = /^sowner|حقوق|wm$/i;
export default handler;
