import fg from 'api-dylux';
import fetch from 'node-fetch';
import axios from 'axios';

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) throw `*كتب .${command} موراها رابط الفيسبوك، بحال:*\n\n${usedPrefix + command} https://fb.watch/fOTpgn6UQ*`;

  try {
    const response = await fetch(`https://api.cafirexos.com/api/facebook?url=${args[0]}&apikey=BrunoSobrino`);
    const data = await response.json();
    if (data?.status === true) {
      const videoBuffer = await getBuffer(data.resultado.data);
      await conn.sendMessage(m.chat, {video: videoBuffer,  mimetype: 'video/mp4', filename: 'video.mp4'}, { quoted: null });
    }
  } catch (err) {
    console.log(err);
    try {
      let ress = await fg.fbdl(args[0]);
      let urll = ress.videoUrl;
      let buff = await conn.getFile(urll);
      await conn.sendMessage(m.chat, { video: buff.data, mimetype: 'video/mp4', fileName: 'fb.mp4'}, { quoted: null });
    } catch (err3) {
      console.log(err3);
    }
  }
};

handler.command = /^(facebook|fb2|fb)$/i;
export default handler;

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
