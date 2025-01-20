let handler = async (m, { conn, text, mText }) => {
   if (!mText || !m.quoted || !m.quoted.fromMe) return;
    let q = m.quoted ? m.quoted : m;
    await conn.sendMessage(m.chat, { text: mText, edit: q })
}
handler.customPrefix = /^(بدل|bdl)(\s|$)/i;
handler.command = new RegExp;
export default handler;
