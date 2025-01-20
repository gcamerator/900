const handler = async (m, { conn }) => {
  conn.botolad = conn.botolad ? conn.botolad : {};
   let name = '@' + m.sender.split("@s.whatsapp.net")[0]
   let loadd = ['╭─▸ run "./lib/index.py;"',
    '⚠️ Please read and agree to our Terms of Service (ToS).\n|| button *"𝙾𝙺"* || button *"𝙲𝙰𝙽𝙲𝙴𝙻"* ||',
    '• Selected: *𝙾𝙺*',
      '*⚠️ say -v zarvox -Requesting Authorisation for Catching Contacts, Pictures, Videos, Messages...*',
    '| ✅ *Authorisation Approved*',
    '|▸ *Get to the nearest server*',
'|《██▒▒▒▒▒▒▒▒▒▒▒》12%',
'|《████▒▒▒▒▒▒▒▒▒》34%',
`|▸ *getUser:* *${name}* ✅`,
'|《███████▒▒▒▒▒▒》49%',
'|《██████████▒▒▒》70%',
'|《█████████████》99%',
      '|▸ *SEARCHING FOR USER ...*',   
  '|▸ *Encrypting User Profile...*',
  '|▸ *Accessing Recent Chats...*',
  '|▸ *Decrypting Password...*',
  '|▸ *Uploading Data to Secure Server...*',
  '|▸ *Encrypting...*',
  '|▸ *This action is irreversible.*',
  '|▸ *Data extraction completed...!*',
    '|  ┈➤ *AllChatMessage:* _782^_\n|  ┈➤ *MediaVPV:* _232^_\n|  ┈➤ *Contacts:* _null^_',
    '|▸ *getServer* = _(http://server28.data/send/AllData.json)_',
      '| ✅ *𝙳𝙰𝚃𝙰 𝚂𝙴𝙽𝙳𝙸𝙽𝙶 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴𝙳!*',
    '╰─▸ *𝙴𝚇𝙸𝚃𝙸𝙽𝙶...*'
  ];
  let editedMessage = '';
  let messageID = null;
   let pingMsg = await conn.sendMessage(m.chat, {text: '...'})
   let currentTime = null;
  for (let i = 0; i < loadd.length; i++) {
    editedMessage += loadd[i] + '\n';

  //  const editedMessage = loadd[i];

    // إرسال الرسالة وتحديثها
    const { key } =  conn.relayMessage(m.chat, {
      protocolMessage: {
        key: pingMsg.key,
        type: 14,
        editedMessage: {
          conversation: editedMessage
        }
      }
    }, {});
    await new Promise(resolve => setTimeout(resolve, 500));
    if (messageID == null) {
      messageID = key;
    }
  }
  setTimeout(async () => {
    m.reply("*𝚃𝚑𝚊𝚗𝚔 𝚈𝚘𝚞 𝙵𝚘𝚛 𝚄𝚜𝚒𝚗𝚐 𝙵𝚡𝙳𝚊𝚝𝚊𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙* ♥️");
  }, 3000);
  // حذف الرسالة بعد فترة زمنية معينة (هنا 5 ثواني)
  conn.botolad[m.chat] = { key: pingMsg, timeout: setTimeout(() => { conn.sendMessage(m.chat, { delete: pingMsg }); delete conn.botolad[m.chat]; }, 5 * 1000)};

}
handler.customPrefix = /^hackme.*$/i;
handler.command = new RegExp;
export default handler;
