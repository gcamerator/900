
let handler = async (m, { args, usedPrefix, command }) => {
    if (!(args[0] || args[1])) throw `👈🏼 *يجب عليك كتابة:* \n\n_مثال:_\n${usedPrefix + command} 1 2\n\nرقم السورة ورقم الآية`;
    if (isNaN(args[0]) || isNaN(args[1])) throw `👈🏼 *يجب عليك كتابة:* \n\n_مثال:_\n${usedPrefix + command} 1 3\n\nرقم السورة ورقم الآية، هنا سنحصل على سورة الفاتحة الآية رقم 3`;
  const response = await fetch('https://raw.githubusercontent.com/midsoune/JSON/main/Quran.json');
  const zpi = await response.json();
  const api = zpi.data;
if (command === 'aya'){
  let mesa = `
*الآية:* ${api[args[0] - 1].verses[args[1] - 1].text.arab}

( ${api[args[0] - 1].name.long} : الآية ${args[0]} )
  `.trim();
  m.reply(mesa);
} else if (command === 'ayamp3'){
   conn.sendFile(m.chat, api[args[0] - 1].verses[args[1] - 1].audio.primary, '', '', m)
};
}
handler.command = /^(aya|ayamp3)$/i;
export default handler;
