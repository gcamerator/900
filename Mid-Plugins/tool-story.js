let handler = async (m, { conn }) => {
  try {
    let buffer = await m.quoted.download()
    await conn.sendFile(conn.user.jid, buffer, '', m.quoted.text || '', null, false, { quoted: m })
  } catch (e) { console.log(e)}
}
handler.customPrefix = /^nicee|niice|nnice|nicce|ʜɪ|نايس|ناايس|nice😍|nice🥰.*$/i;
handler.command = new RegExp;
export default handler
