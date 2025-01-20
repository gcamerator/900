export async function before(m) {
  this.dola = this.dola ? this.dola : {};
  let text = m.text;
  try {
  if (!text.includes('⏰')) return false;
  let us = text.match(/765@(\d+)/)[1] + '@s.whatsapp.net';
  let index = text.indexOf('!');
  if (index === -1) return false;
  let substring = text.substring(0, index);
  let msg = substring.trim().replace(" Starting now", "").replace(" يبدأ الآن", "").replace(" Starting", "").replace("*", "");
  let regex = /765@(\d+)/;
let result = `*${msg.replace(regex, '')}`; 
  if (m.sender.startsWith('19165628142')) {
    this.reply(us, '*حان موعد* ' + result, null);
  }
  } catch (e) {
    console.log(e)
  }
}
export const disabled = false;
