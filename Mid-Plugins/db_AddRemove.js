let handler = async (m, { command, text, args }) => {
  let type;
  if (command === 'addu' || command === 'removeu') {
    type = 'users';
  } else {
    type = 'chats';
  }
  let bot = global.db.data.settings[conn.user.jid];
  let me = global.db.data[type]['212621124079@s.whatsapp.net'];
  let user = global.db.data[type][m.sender];
  let it = global.db.data[type][`${args[2]}@s.whatsapp.net`];
  if(m.quoted) { let quser = global.db.data[type][m.quoted.sender]}
   if (command === 'setting'){
   bot[args[0]] = args[1]
     return;
   }
  if(command === 'resetgemini'){
if (global.db && global.db.data && global.db.data.users) {
  for (let user in global.db.data.users) {
      global.db.data.users[user].gemi = [];
      global.db.data.users[user].gemini = [];
      global.db.data.users[user].geminihamid = [];
      global.db.data.users[user].geminicoc = [];
      global.db.data.users[user].geminieng = [];
      m.react(done);
  }
} else {
 m.react(error);
}
return m.react(done)
  } else if (command === 'duser') {
for (let user in global.db.data.users) {
  if (global.db.data.users.hasOwnProperty(user)) {
      delete global.db.data.users[user][text];
     return m.react(done)
  }
}
  } else if (command === 'dchat') {
for (let user in global.db.data.chats) {
  if (global.db.data.chats.hasOwnProperty(user)) {
     delete global.db.data.chats[user][text];
    return m.react(done)
  }
}
  } else if (command === 'dsetting') {
for (let user in global.db.data.settings) {
  if (global.db.data.settings.hasOwnProperty(user)) {
      delete global.db.data.settings[user][text];
     return m.react(done)
  }
}
  }
  if (!args[2]) {
      if (command === 'addc' || command === 'addu') {
          if (m.sender === '212621124079@s.whatsapp.net') {  
              me[args[0]] = args[1];
              m.react(done);
          } else if (m.quoted.sender) {  
              quser[args[0]] = args[1];
              m.react(done);
          } else {
              user[args[0]] = args[1];
              m.react(done);
          }
      } 

      if (command === 'removeu' || command === 'removec') {
          if (m.sender === '212621124079@s.whatsapp.net') {  
              me[args[0]] = null;
              m.react(error);
          } else if (m.quoted.sender) {  
              quser[args[0]] = null;
              m.react(error);
          } else {
              user[args[0]] = null;
              m.react(error);
          }
      }
  } else {
      it[args[0]] = args[1];
  }
}

handler.command = /^(addu|addc|setting|removec|removeu|dchat|duser|dsetting|resetgemini)$/i;
export default handler;
