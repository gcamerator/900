
let handler = async (m, { conn, text, usedPrefix, command }) => {
  let cm = copy(m)
  let who
  if (text.includes('@0')) who = '0@s.whatsapp.net'
  else if (m.isGroup) who = cm.participant = m.mentionedJid[0]
  else who = m.chat
  cm.key.fromMe = false 
  cm.message[m.mtype] = copy(m.msg)
  let sp = '_'
  let [fake, ...real] = text.split(sp)
  conn.fakeReply(m.chat, real.join(sp).trimStart(), who, fake.trimEnd(), m.isGroup ? m.chat : false, {
    contextInfo: {
      mentionedJid: conn.parseMention(real.join(sp).trim())
    }
  })
}
handler.command = /^(f|fake)$/

export default handler

function copy(obj) {
  return JSON.parse(JSON.stringify(obj))
}
