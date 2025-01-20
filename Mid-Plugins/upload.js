import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw `رد على صورة أو فيديو لحفظه \n*${usedPrefix + command}*`
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
  let link = await (isTele ? uploadImage : uploadFile)(media)
  m.reply(`*رابط الملف:* ${link}
${media.length} بايت
${isTele ? '(لا يوجد تاريخ انتهاء الصلاحية)' : '(تاريخ الصلاحية غير معروف)'}`)
}
handler.help = ['upload']
handler.tags = ['tools']
handler.command = /^upload1$/i

export default handler