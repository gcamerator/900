let handler = async (m, { conn, mText }) => {
  let who;
  if(m.quoted) who = m.quoted.sender;
  if(mText) who = `212${mText}@s.whatsapp.net`;
  if(!mText && !m.quoted) who = m.chat;
  let name = conn.getName(who)
  let me = conn.user.jid
  let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './logo.jpg')
  conn.sendFile(me, pp, 'img.png', name, null)
}

handler.customPrefix = /^(🙄🙄|👀👀|👁️👁️)(\s|$)/i;
handler.command = new RegExp;
export default handler
