export async function before(m) {
  this.feud = this.feud ? this.feud : {};
  let room = Object.values(this.feud).find((room) => room && room.id.startsWith('fd') && (m.sender === room.feud.playerA ||  m.sender === room.feud.playerB) && room.chat === m.chat); 
  if (!room) return;
  let playerA = room.feud.playerA;
  let playerB = room.feud.playerB;
  if (/^(safi|stop)$/i.test(m.text.toLowerCase())) {
    let str = `*❌ تم إنهاء اللعبة*\n\n@${playerA.split`@`[0]} - *${room.feud.playerApoints} نقطة*\n@${playerB.split`@`[0]} - *${room.feud.playerBpoints} نقطة*`;
 let sttr = `*الإقتراحات المتبقية كانت:*\n\n- ${room.feud.ques} ${room.feud.words.join(`\n- ${room.feud.ques} `)}`;
    this.reply(m.chat, str, null, { mentions: await this.parseMention(str)});
    this.reply(m.chat, sttr, null);
    delete this.feud[room];
    m.react(done);
    return true;
  }
    let currentPlayer = room.feud.currentPlayer;
    let answer = m.text;
  let aa = answer;
    if (m.sender !== currentPlayer) {
      return !0;
    }
    const match = await room.feud.matchCheck(aa);
  if (match) {
   this.sendMessage(m.chat, {text: `💭 *${room.feud.ques} ${room.feud.right[0]}*\n\n👏🏼 *جواب صحيح : +15 نقطة*` })
   if(m.sender === room.feud.playerA){
    room.feud.playerApoints += 15} else {
     room.feud.playerBpoints += 15
    }
 } else {
   m.react('❌');
   await room.feud.togglePlayer();
 }
    room.feud.right = [];
  return true;
}
