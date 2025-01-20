import fetch from 'node-fetch';
let handler = async (m, {command, text}) => {
  conn.tempmail = conn.tempmail || {};
  if(conn.tempmail[m.sender]){
    let idd = conn.tempmail[m.sender]
    let check = await fetch(`https://api.bk9.site/tools/get_inbox_tempmail?q=${idd}`)
    let res = await check.json()
    if(!res.BK9) throw 'لا توجد إيميلات جديدة';
    let emailData = res.BK9[0];
    let from = emailData[0].fromAddr;
    let header = emailData[0].headerSubject;
    let text = emailData[0].text;
    await conn.sendMessage(m.chat, {
        text: '*From:* ' + from + '\n\n*Title:* ' + header + '\n\n*Text:* ' + text
    });
  } else {
  let aa = await fetch ('https://api.bk9.site/tools/tempmail')
  let a = await aa.json()
  let email =  a.BK9[0];
  let id = a.BK9[1];
  conn.tempmail[m.sender] = id;
  let cap = '*هذا هو الايميل الخاص بك والذي سيحذف بعد 10 دقائق:*\n\n' + email + '\n\n*بعد تلقى الرسائل يمكنك عرضها بإستعمال نفس الأمر*\n\n*مثال:*\n.' + command;
  await conn.sendMessage(m.chat, {text: cap})
setTimeout(async () => {
  delete conn.tempmail[m.sender]
}, 600000)
  }
}
handler.command = /^(email|tempmail)$/i
export default handler
