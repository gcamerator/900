import fs from "fs"
let handler  = async (m, { conn, command }) => {
let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let authFolderB = `${who.split`@`[0]}`;
if (command === 'stopbot') {
if (global.conn.user.jid == conn.user.jid) conn.reply(m.chat, `*أرسل هذا الأمر في الرقم الرئيسي للبوت*`, null)
else {
await conn.reply(m.chat, `*لقد قمت بتسجيل الخروج*`, m)
  await fs.rm("CredsByMidSoune/" + authFolderB, { recursive: true, force: true });
    await conn.sendMessage(conn.user.jid, {text : '✅ *File Deleted*'}, { quoted: null })
    m.react(done) 
  conn.ws.close()
}} else if (command === 'deletebot'){
  try {
 await fs.rm("CredsByMidSoune/" + authFolderB, { recursive: true, force: true });
  m.react(done)
} catch(err) {
console.error('La carpeta o archivo de sesion no existen ', err)   
}}}
handler.command = /^(deletebot|stopbot)$/i
handler.private = true
handler.fail = null
export default handler
