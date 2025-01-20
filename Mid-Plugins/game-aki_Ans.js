const teks = '➊ *- أه*\n➋ *- لا*\n➌ *- ماعرفتش*\n➍ *- يمكن أه*\n➎ *- غالبا لا*\n\n➏ *- رجع للسؤل لي قبل*\n➐ *- إنهاء اللعبة*';

export async function before(m) {
  this.akinator = this.akinator ? this.akinator : {}
  let Aki = this.akinator[m.sender];
  if(isNaN(m.text) || !Aki || Aki.chat != m.chat) return;
  let soal;
  const answer = m.text - 1
  
try {   
  await conn.sendMessage(m.chat, {
      delete: this.akinator[m.sender].msg,
  });

if (answer === 6 || m.text === 'akix' || m.text === 'Akix'){
  delete this.akinator[m.sender];
  return;}
else if(answer === 7) { soal = await this.reply(m.chat, `🧞 𝘼𝙆𝙄𝙉𝘼𝙏𝙊𝙍 𝙂𝘼𝙈𝙀  *${Aki.progress.toFixed(0)}%* 🧞\n\n*${Aki.currentStep}. ${Aki.question}*\n\n${teks}`)
Aki.msg = soal 
Aki.currentStep = Aki.currentStep
Aki.progress = Aki.progress}
else if(5 > answer)  {await Aki.step(answer)}
else if(5 === answer) {await Aki.back()}
if (answer != 7){
 if (Aki.guess && Aki.guess.completion === 'OK') {
const ans = Aki.guess;
await this.sendMessage(m.chat, {image: {url: ans.photo}, caption: `\n*واش كاتفكر فـ:* *${ans.name_proposition}* (_${ans.description_proposition}_)\n\n➐. *أه*\n➑. *لا*`, mentions: [m.sender]}, {quoted: null})
} 
   else {
   soal = await this.reply(m.chat, `🧞 𝘼𝙆𝙄𝙉𝘼𝙏𝙊𝙍 𝙂𝘼𝙈𝙀  *${Aki.progress.toFixed(0)}%* 🧞\n\n*${Aki.currentStep}. ${Aki.question}*\n\n${teks}`)
Aki.msg = soal 
Aki.currentStep = Aki.currentStep
Aki.progress = Aki.progress
}
  }
} catch (ee) {
  await console.log('ERROR', ee)
}
return !0
}
