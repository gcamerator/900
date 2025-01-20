import similarity from 'similarity'
const threshold = 0.67
const maxAttempts = 2

const handler = (m) => m;

handler.before = async function(m) {
  let id = m.chat
  let ca = false;
  let userAnswer = m.text;
  this.qsura = this.qsura || {};


  if (!(id in this.qsura) || !userAnswer || userAnswer.startsWith('.') || userAnswer === 'مساعدة') return !0;

  if (userAnswer === 'ماعرفتش') {
    delete this.qsura;
    m.react('🙁');
    return !0;
  }

  let isura = this.qsura[id][2];
 console.log(userAnswer, isura)
  let nsura = this.qsura[id][1];
  nsura = nsura.replace('*', '');

if (userAnswer === isura){
  ca = true;
}

  this.qsura[id].attempts = this.qsura[id].attempts ? this.qsura[id].attempts : 0;

  if (ca === true || userAnswer == isura || userAnswer === nsura) {
      m.react('✅'); 
      delete this.qsura[id];
  } else if (isNaN(userAnswer) && similarity(userAnswer, nsura) >= threshold) {
      m.react('😬')
  } else {
    this.qsura[id].attempts++;
    if (this.qsura[id].attempts >= maxAttempts) {
      m.react('❌');
      this.reply(m.chat, `۩ الجواب هو: رقم *${isura}.* *${nsura}*`, this.qsura[id][2])
      delete this.qsura[id];
    } else {
      m.react('🙅🏻‍♂️');
      this.reply(`*إجابة خاطئة* لديك محاولة أخيرة.*`);
    }
  }

  return !0
}

export default handler
