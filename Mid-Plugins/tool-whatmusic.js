import fs from 'fs'
import acrcloud from 'acrcloud'
let acr = new acrcloud({
host: 'identify-eu-west-1.acrcloud.com',
	access_key: '9b4e89c29304c1285480d0f4f632fdd1',
	access_secret: '1C8eUNLe1UNr95hkuMgUU0jwy9avHfGkTGoivap9'
})

let handler = async (m) => {
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || ''
if (/audio|video/.test(mime)) { if ((q.msg || q).seconds > 20) return m.reply('المقطع الذي حددنه طويل جدا، نقترح عليك قصه، 10-20 ثانية كافية لتحديد إسم الأغنية')
let media = await q.download()
let ext = mime.split('/')[1]
fs.writeFileSync(`./tmp/${m.sender}.${ext}`, media)
let res = await acr.identify(fs.readFileSync(`./tmp/${m.sender}.${ext}`))
let { code, msg } = res.status
if (code !== 0) throw msg
let { title, artists, album, genres, release_date } = res.metadata.music[0]
let txt = `
• 📌 *العنوان:* ${title}
• 👨‍🎤 *المغني:* ${artists !== undefined ? artists.map(v => v.name).join(', ') : 'غير معروف'}
• 💾 *الألبوم:* ${album.name || 'غير معروف'}
• 🌐 *النوع:* ${genres !== undefined ? genres.map(v => v.name).join(', ') : 'غير معروف'}
• 📆 *تاريخ الإصدار:* ${release_date || 'غير معروف'}
`.trim()
fs.unlinkSync(`./tmp/${m.sender}.${ext}`)
m.reply(txt)
} else throw '╰⊱❗️⊱ *قم بالرد على موسيقى أو فيديو'
}
handler.command = /^سميت هادي|شناهي|whatmusic$/i
export default handler
