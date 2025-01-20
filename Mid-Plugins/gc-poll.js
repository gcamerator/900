const handler = async (m, {conn, command, text}) => {
    if(!text) return m.reply(`*أكتب النص والخيارات مفصولة بنقطة على شكل:*\n\n.${command} خبار3.خيار2.خيار1.سؤال...`);
  const q = text.split('.')[0];
  const caption = `‏📊 ‏*سؤال:* ‏${q}`.trim();
  const options = text.split(".").slice(1).map(option => ({ optionName: option.trim() }));  
  const sendPollMessage = {
    messageContextInfo: {
        messageSecret: "bT3tfZngfSMWK2zOEL8pSclPG+xldidYDX+ybB8vdEw="
    },
    pollCreationMessage: { 
        name: caption,
        options: options,
        selectableOptionsCount: 1,
    }
  };
conn.relayMessage(m.chat, sendPollMessage, {quoted: null});
};
handler.command = ['poll', 'استطلاع'];
export default handler;
