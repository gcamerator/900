let handler = async (m, { conn, args }) => {
  let a,b;
if (args[0] === 'me'){
  a = 33.555732; b = -7.701717} else
  if (args[0] === 'mer'){
  a = 33.559353; b = -7.604366} else
  if (args[0] === 'khd'){
  a = 33.545052; b = -7.591747} else {
if (args[0].includes(',')) {
    a = args[0].split(',')[0];
    b = args[0].split(',')[1];
} else {
    a = args[0];
    b = args[1];
}
  }
  if (!args[0]){return m.reply(m.chat, `*أدخل إحاثييات الموقع*\n\n*مثال:*\n*.${command} 23.5732 39.5732*`, null)}
  m.react('🗺️')
  conn.sendMessage(m.chat, {location: { degreesLatitude: a , degreesLongitude: b }})}

handler.command = /^(loc|localisation|location)$/i
export default handler
