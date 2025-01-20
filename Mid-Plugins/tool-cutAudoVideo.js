import { unlinkSync, readFileSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

const handler = async (m, { conn, args, __dirname, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';
  if (command === 'cutaudio' && !/audio/.test(mime)) {
    throw `يرجى إرسال أو الإشارة إلى مقطع صوتي *${usedPrefix + command}*`;
  }
  if (command === 'cutvideo' && !/video/.test(mime)) {
    throw `يرجى إرسال أو الإشارة إلى مقطع فيديو *${usedPrefix + command}*`;
  }
  const media = await q.download?.();
  if (!media) {
    throw `لا يمكن تحميل ${command === 'cutaudio' ? 'المقطع الصوتي' : 'مقطع الفيديو'}!`;
  }
  if (!args[0] || !args[1]) {
    throw `مثال: ${usedPrefix + command} 00:30 00:60`;
  }

  const start = args[0].split(':').map(Number);
  const end = args[1].split(':').map(Number);

  if (start.length !== 2 || end.length !== 2) {
    throw 'صيغة وقت غير صالحة. يجب أن تكون الصيغة كالتالي: 01:15';
  }

  const startTimeInSeconds = start[0] * 60 + start[1];
  const endTimeInSeconds = end[0] * 60 + end[1];
  const ran = getRandom(`.${command === 'cutaudio' ? 'mp3' : 'mp4'}`);
  const filename = join(__dirname, '../tmp/' + ran.toString());

  exec(`ffmpeg -i ${media} -ss ${args[0]} -to ${args[1]} -c copy ${filename}`, async (err) => {
    await unlinkSync(media);
    if (err) {
      throw `_*Error!*_`;
    }
    const buff = await readFileSync(filename);
    m.reply(wait);
    conn.sendFile(m.chat, buff, ran, null, m, true);
    await unlinkSync(filename);
  });
};

handler.help = ['cutaudio', 'cutvideo'].map((v) => v + ' <text>');
handler.tags = ['audio', 'video'];
handler.command = /^(cutaudio|cutvideo)$/i;

export default handler;

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};
