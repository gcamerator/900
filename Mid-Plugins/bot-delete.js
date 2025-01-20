let handler = async (m, { conn, command, isBotAdmin }) => {
if (!m.quoted) return;

let user = m.quoted.sender ? m.message.extendedTextMessage.contextInfo.participant : m.key.participant
let msg = m.quoted.id ? m.message.extendedTextMessage.contextInfo.stanzaId : m.key.id
if (isBotAdmin) return conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: msg, participant: user }})
if (!isBotAdmin) return conn.sendMessage(m.chat, { delete: m.quoted.vM.key })

}
handler.customPrefix = /^(مسح|msh)$/i
handler.command = new RegExp
export default handler
