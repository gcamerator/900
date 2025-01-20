import uploadImage from '../lib/uploadImage.js';
import fetch from 'node-fetch';
const handler = async (m, {conn, text, usedPrefix, command}) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';
  if (!mime) throw '*قم بالرد على صورة رمز الإستجابة السريعة QR Code*';
  const img = await q.download?.();
  const url = await uploadImage(img);
  const anu = await fetch(`https://api.lolhuman.xyz/api/read-qr?apikey=${lolkeysapi}&img=${url}`);
  const json = await anu.json();
  await m.reply(`*النص  في هذا الكود هو:* \n ${json.result}`);
};
handler.command = /^(readqr|qrread)$/i;
export default handler;
