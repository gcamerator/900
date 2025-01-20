let handler = async (m, { conn, command, text }) => {
 let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let to = '212621124079@s.whatsapp.net';
  if (command === 'ytcomment') {
if (!text) throw 'أكتب تعليقا بعد الأمر'
  conn.sendFile(m.chat, global.API('https://some-random-api.com', '/canvas/youtube-comment', {
    avatar: await conn.profilePictureUrl(who, 'image').catch((_) => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
    comment: text,
    username: conn.getName(who),
}), 'error.png', '', m)}
else if (command === 'blur' || command === 'ضباب') {
  conn.sendFile(m.chat, global.API('https://some-random-api.com', '/canvas/blur', {
    avatar: await conn.profilePictureUrl(who, 'image').catch((_) => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
  }), 'error.png', '', m);
}
  else if (command === 'pixel') {
    conn.sendFile(m.chat, global.API('https://some-random-api.com', '/canvas/pixelate', {
      avatar: await conn.profilePictureUrl(who, 'image').catch((_) => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
      comment: text,
      username: conn.getName(m.sender),
    }), 'error.png', '', m);
  }
 else if(command === 'wasted'){
  let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './Menu.jpg')
  conn.sendFile(m.chat, global.API('https://some-random-api.com', '/canvas/overlay/wasted', {
    avatar: pp, 
  }), 'waste.png', ``, m)
 }
}

handler.command = /^(ytcomment|blur|wasted|pixel|ضباب)$/i
export default handler
