import fetch from 'node-fetch'
import gtts from 'node-gtts';
import {join} from 'path';
import {readFileSync, unlinkSync} from 'fs';
import { webp2png, webp2mp4 } from '../lib/webp2mp4.js'
import { toAudio, toPTT, ffmpeg } from '../lib/converter.js'
import uploadImage from '../lib/uploadImage.js'
import { toDataURL } from 'qrcode'
const defaultLang = 'ar'

let handler = async (m, { conn, usedPrefix, text, args, command }) => { 

 if (command === 'togif'){
if (!m.quoted) throw `*جاوب على شي فيديو باش تردو صورة متحركة*`
const q = m.quoted || m
let mime = (q.msg || q).mimetype || ''
if (!/(mp4)/.test(mime)) throw `*نوع الملف ${mime} ماشي هو المطلوب*`
m.reply(global.wait)
let media = await q.download()
conn.sendMessage(m.chat, { video: media, gifPlayback: true, caption: '*ها هي الـ Gif ديالك*' }, { quoted: m })
 }
 else if (command === 'toimg'){
  const notStickerMessage = `*جاوب على ستيكر باش تردها صورة، ودير*\n*${usedPrefix + command}*`
  if (!m.quoted) throw notStickerMessage
  try {
    const q = m.quoted || m;
    const mime = q.mediaType || '';
    if (!m.quoted || !/sticker/.test(mime)) return m.reply(notStickerMessage);
    const media = await q?.download();
    if (media) await conn.sendMessage(m.chat, {image: media, caption: null}, {quoted: null});
  } catch (error) {
  try {
      const out = await webp2png(media) || Buffer.alloc(0);
      if (out) conn.sendFile(m.chat, out, 'out.png', null, null);
    } catch (e) { console.error(e) }  }
 }
 else if (command === 'tomp3'){
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    if (!m.quoted && !m.quoted) throw `*جاوب على شي أوديو*`;
    if (!/video|audio/.test(mime)) throw `*[خطأ] نوع الملف غير مدعوم، يجب أن يكون فيديو أو صوت فقط*`;
    let media = await q.download?.();
    if (!media && !/video/.test(mime)) throw '*[خطأ] لا يمكن العثور على الملف، يجب أن يكون ملف فيديو فقط للتحويل*';
    if (!media && !/audio/.test(mime)) throw '*[خطأ] لا يمكن العثور على الملف، يجب أن يكون ملف صوت فقط للتحويل*';
    let audio = await toAudio(media, 'mp4');
    if (!audio.data && !/audio/.test(mime)) throw '*[خطأ] فشل التحويل، الملف ليس صالحًا للتحويل إلى ملف صوتي/فيديو MP3، يجب أن يكون ملف صوتي/فيديو فقط للتحويل*';
    if (!audio.data && !/video/.test(mime)) throw '*[خطأ] فشل التحويل، الملف ليس صالحًا للتحويل إلى ملف صوتي/فيديو MP3، يجب أن يكون ملف صوتي/فيديو فقط للتحويل*';
    conn.sendFile(m.chat, audio.data, 'error.mp3', '', null, null, { mimetype: 'audio/mp4' })
 }
    else if (command === 'tovideo' || command === 'tomp4'){
      if (!m.quoted) throw `*جاوب على ستيكر باش تردها فيديو، ودير\n ${usedPrefix + command}*`
      let mime = m.quoted.mimetype || ''
      if (!/webp/.test(mime)) throw `*جاوب على ستيكر باش تردها فيديو، ودير*\n ${usedPrefix + command}`
      let media = await m.quoted.download()
      let out = Buffer.alloc(0)
      if (/webp/.test(mime)) {
      out = await webp2mp4(media)
      } else if (/audio/.test(mime)) {
      out = await ffmpeg(media, ['-filter_complex', 'color', '-pix_fmt', 'yuv420p', '-crf', '51', '-c:a', 'copy', '-shortest'], 'mp3', 'mp4')}
      await conn.sendFile(m.chat, out, 'error.mp4', '*ᴍɪᴅsᴏᴜɴᴇ*', null, 0, { thumbnail: out })
    }
    else if (command === 'toppt'){
    try {
      let q = m.quoted ? m.quoted : m
      let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
      //if (!/video|audio/.test(mime)) throw `✳️:\n *${usedPrefix + command}*`
      let media = await q.download?.()
      if (!media) throw '❎ Error al descargar medios'
      let audio = await toPTT(media, 'mp4')
      if (!audio.data) throw '❎ Error al convertir'
      conn.sendFile(m.chat, audio.data, 'audio.mp3', '', null, true, { mimetype: 'audio/mp4' })
      } catch (e) {
          m.reply(`✳️:\n *${usedPrefix + command}*`)
     }}
    else if (command === 'gol' || command === 'goli'){
      if (!args[0]) {m.reply(m.chat, 'أكتب نص لتحويله لصوت', null)}
      let lang = args[0]
      let text = args.slice(1).join(' ')
      if ((args[0] || '').length !== 2) {
      lang = defaultLang
      text = args.join(' ')
      }
      if (!text && m.quoted?.text) text = m.quoted.text
      let res
      try { res = await tts(text, lang) }
      catch (e) {
      m.reply(e + '')
      text = args.join(' ')
      if (!text) throw `
      اكتب نصا لتحويله إلى مذكرة صوتية\nمثال:\n*${usedPrefix + command} مرحبا*`
      res = await tts(text, defaultLang)
      } finally {
      if (res) await conn.sendMessage(m.chat, {audio: res, fileName: 'error.mp3', mimetype: 'audio/mpeg', ptt: true}, {quoted: m})
        }}
    else if (command === 'totext'){
      let q = m.quoted ? m.quoted : m,
      mime = (q || q.msg).mimetype || q.mediaType || ''
      if (/image/.test(mime)) {
      let url = await webp2png(await q.download()),
      res = await fetch(API('https://api.ocr.space', '/parse/imageurl', { apikey: '8e65f273cd88957', url }))
      if (res.status !== 200) throw res.statusText
      let json = await res.json()
      m.reply(json?.ParsedResults?.[0]?.ParsedText)
      } else throw 'خطأ ما حدث'
    }
    else if (command === 'topdf'){
      const q = m.quoted ? m.quoted : m;
      const mime = (q.msg || q).mimetype || '';
      if (!mime) throw '*رد على صورة*';
      const img = await q.download?.();
      const url = await uploadImage(img);
      const docname = text ? text : m.pushName || 'documento';
      conn.sendFile(m.chat, `http://api.lolhuman.xyz/api/convert/imgtopdf?apikey=${lolkeysapi}&img=${url}`, docname + '.pdf', '', null, false, {asDocument: true});
    }
    else if (command === 'qrcode') {
      let text
        if (args.length >= 1) {
            text = args.slice(0).join(" ")
        } else if (m.quoted && m.quoted.text) {
            text = m.quoted.text
        } else throw "أدخل نص لتحويله إلى Qr Code!"
        await m.reply(wait)
        let caption = `هذه هي نتيجة QR Code لنصك.\n
        قم بالرد على هذه الرسالة لقراءته. اكتب \n*.readqr* `
        try {
            await conn.sendFile(m.chat, await toDataURL(text.slice(0, 2048), {
                scale: 8
            }), 'qrcode.png', caption, m)
        } catch (e) {
            await m.reply(eror)
        }
    } else return
}
handler.command = ["toppt", "tomp3", "toimg", "togif", "tovideo", "topdf", "tomp4", "qrcode", "totext", "gol", "goli"]
export default handler

function tts(text, lang = 'ar') {
  return new Promise((resolve, reject) => {
  try {
  let tts = gtts(lang)
  let filePath = join(global.__dirname(import.meta.url), '../tmp', (1 * new Date) + '.wav')
  tts.save(filePath, text, () => {
  resolve(readFileSync(filePath))
  unlinkSync(filePath)
  })
  } catch (e) { reject(e) }
  })}
