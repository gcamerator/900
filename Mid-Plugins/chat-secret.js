export async function before(m, { conn }) {
  let chat = global.db.data.chats[m.chat];
  if (!chat.msg) {chat.msg = {};}
  if (chat.secret) {
    if (m.key.fromMe) {
      try {
        let key = m.key;
        let id = key.id; // Use message ID
        let msg = m.message?.conversation;

        await conn.relayMessage(m.chat, {
          protocolMessage: {
            key: key,
            type: 14,
            editedMessage: {
              conversation: '',
            },
          },
        }, {});

        // Store the message using its ID as the key
        chat.msg[id] = { msg: msg, key: key };
      } catch (error) {
        console.log(error);
      }
    }

    // Check for the message in chat.msg
    if (m.message?.reactionMessage?.text === '😮') {
      let reactionKeyId = m.message.reactionMessage.key.id; // Use message ID for lookup
      let storedData = chat.msg[reactionKeyId];
      if (storedData) {
        let storedMsg = storedData.msg;
        let keyMsg = storedData.key;
        if (storedMsg) {
          await conn.relayMessage(m.chat, {
            protocolMessage: {
              key: keyMsg,
              type: 14,
              editedMessage: {
                conversation: storedMsg,
              },
            },
          }, {});
        }
      }
    }

    if (m.message?.reactionMessage?.text === '😢') {
      let reactionKeyId = m.message.reactionMessage.key.id; // Use message ID for lookup
      let storedData = chat.msg[reactionKeyId];
      if (storedData) {
        let storedMsg = storedData.msg;
        let keyMsg = storedData.key;
        await conn.relayMessage(m.chat, {
          protocolMessage: {
            key: keyMsg,
            type: 14,
            editedMessage: {
              conversation: '',
            },
          },
        }, {});
      }
    }
  }
}
