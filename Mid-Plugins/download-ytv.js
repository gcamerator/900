import axios from 'axios'
const handler = async (m, { conn, args, command }) => {
  const videoUrl = `https://api.cafirexos.com/api/v1/ytmp4?url=${args[0]}&apikey=BrunoSobrino`;
  const buff_vid = await getBuffer(videoUrl);
  const fileSizeInBytes = buff_vid.byteLength;
  const fileSizeInKB = fileSizeInBytes / 1024;
  const fileSizeInMB = fileSizeInKB / 1024;
  if (fileSizeInMB > 100) {
    await conn.sendMessage(m.chat, { document: buff_vid, caption: ``, fileName:  'ytb.mp4', mimetype: 'video/mp4' }, { quoted: null });
  } else {
    await conn.sendMessage(m.chat, { video: buff_vid, caption: ``, fileName: 'ytb.mp4', mimetype: 'video/mp4' }, { quoted: null });
  }

}

handler.command = /^(ytv|video|ytb)$/i
export default handler

const getBuffer = async (url, options = {}) => {
  const res = await axios({
    method: 'get', 
    url, 
    headers: {'DNT': 1, 'Upgrade-Insecure-Request': 1},
    ...options, 
    responseType: 'arraybuffer'
  });
  return res.data;
};
