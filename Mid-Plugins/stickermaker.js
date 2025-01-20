import uploadImage from '../lib/uploadImage.js'
import { createSticker } from 'wa-sticker-formatter'
import fs from 'fs'
const effects = ['jail', 'gay', 'glass', 'wasted' ,'triggered']

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    let effect = text.trim().toLowerCase()
  if (!effects.includes(effect)) throw `
*طريقة الإتعمال:*
${usedPrefix}skmaker <التأثير>_n
*مثال:*\n ${usedPrefix}smaker glass

*لائحة التأتيرات:*
${effects.map(effect => `• ${effect}`).join('\n')}
`.trim()
    if (/image/g.test(mime) && !/webp/g.test(mime)) {
    	try {
			let img = await q.download?.()
			let out = await uploadImage(img)
			let apiUrl = global.API('https://some-random-api.com/canvas/', encodeURIComponent(effect), {
    avatar: out
  })
			let stiker = await createSticker(apiUrl, { pack: packname, author: author })
            await conn.sendFile(m.chat, stiker, 'atet.webp', '', m)
    	} catch (e) {
    		console.log(e)
    	}
    } else {
    	m.reply(`أرسل الصورة مع الأمر والتأثير *${usedPrefix + command}* أو رد على صورة تم إرسالها`)
    }
}

handler.help = ['stickmaker (caption|reply media)']
handler.tags = ['sticker']
handler.command = /^(stickmaker|smaker)$/i

export default handler