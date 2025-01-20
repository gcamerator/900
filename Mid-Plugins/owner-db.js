import fs from 'fs';
    let handler = async (m, {command, args, isOwner}) => {
if (!isOwner) return;
let us;
if (m.quoted) {us = m.quoted.sender} else if (args[0] === '+'){us = args[1] + '@s.whatsapp.net'} else {us = m.sender}
   let chats = global.db.data.chats[m.chat] 
   let users = global.db.data.users[us] 
   let settings = global.db.data.settings[conn.user.jid]
   let usersData = JSON.stringify(global.db.data.users, null, 2);
   let userData = JSON.stringify(global.db.data.users[us], null, 2);
   let chatsData = JSON.stringify(global.db.data.chats, null, 2);
   let chatData = JSON.stringify(global.db.data.chats[us], null, 2);
   let settingsData = JSON.stringify(global.db.data.settings, null, 2);
   let settingData = JSON.stringify(global.db.data.settings[conn.user.jid], null, 2);
if (command === 'dbuser'){
    m.reply(userData);
} else if (command === 'test'){
    let a, b, c;
if (args[0] in chats) {  a = chats[args[0]]} else {  a = '-'}
if (args[0] in users) {  b = users[args[0]]} else {  b = '-'}
if (args[0] in settings) { c = settings[args[0]]} else {  c = '-'}
await m.reply('*Chats:* ' + a + '\n\n*Users:* ' + b + '\n\n*Settings:* ' + c);
} else if (command === 'dbusers'){
    m.reply(usersData);
} else if (command === 'dbsettings'){
    m.reply(settingsData);
} else if (command === 'dbsetting'){
    m.reply(settingData);
    } else if (command === 'dbchats'){
    m.reply(chatsData);
} else if (command === 'dbchat'){
    m.reply(chatData);
    }
}
handler.command = /^(dbusers|dbuser|dbsetting|dbsettings|dbchat|dbchats|test)$/i
export default handler
