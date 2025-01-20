import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'
import fs from "fs"
let handler = async (m, { conn, text, command, args }) => {
if (!args[0]) throw '*يجب استخدام هذا الأمر على شكل:*\n.${command} <إيموجي 1> <إيموجي 2>*\n*مثال:*\n.${command} 🤨 😣'
let [emoji1, emoji2] = text.split` `
let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
for (let res of anu.results) {
let stiker = await sticker(false, res.url, global.packname, global.author)
conn.sendFile(m.chat, stiker, null, { asSticker: true })
}}
handler.command = /^(emojimix|emomix)$/i
export default handler
const fetchJson = (url, options) => new Promise(async (resolve, reject) => {
fetch(url, options)
.then(response => response.json())
.then(json => {
resolve(json)
})
.catch((err) => {
reject(err)
})})
