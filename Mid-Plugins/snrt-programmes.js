import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

let handler = async (m, { text, command }) => {
  const dayy = text;
  const date = new Date();
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = dayy || date.getDate().toString().padStart(2, '0');
  let cl = `${year}${month}${day}`;
  let url, ch;
    if (command === 'snrt'){
      let cap = `📺 *إختر القناة:*\n
*.alaoula / الأولى*
*.arriadia / الرياضية*
*.arrabia / الرابعة*
*.almaghribia / المغربية*
*.assadisa / السادسة*
*.tamazight / تمازيغت*
*.laayoune / العيون*
*.2m / دوزيم*`
return m.reply(cap)
    } else if(command === '2m' || command === 'دوزيم'){
      let res = await m2();
      let programs = res.map(program => {
        return {
          title: program.title,
          time: subtractOneHour(program.time)
        };
      });
      let message = `*برامج قناة 2M ليوم ${day} من هذا الشهر:*\n`;
      if(res.length > 0){
      for (const item of programs) {
        message += `\n📺 *${item.time} - ${item.title}*`;
      }
      return m.reply(message);
    }} else {
  if (command === 'arriadia' || command === 'الرياضية') {
    url = '4070';
    ch = 'الرياضية' } 
  else if (command === 'tamazight' || command === 'تمازيغت') {
    url = '4075';
    ch = 'تمازيغت'} 
  else if (command === 'assadisa' || command === 'السادسة') {
      url = '4073';
      ch = 'السادسة'}
  else if (command === 'alaoula' || command === 'الأولى') {
    url = '1208';
    ch = 'الأولى'}
  else if (command === 'arrabia' || command === 'الرابعة') {
    url = '4071';
    ch = 'الرابعة'} 
  else if (command === 'almaghribia' || command === 'المغربية') {
    url = '4072';
    ch = 'المغربية'} 
      else if (command === 'laayoune' || command === 'العيون') {
        url = '4069';
        ch = 'العيون'} 
  const res = await pro(cl, url);
  if(res.length > 0){
  let message = `*برامج قناة ${ch} ليوم ${day} من هذا الشهر:*\n`;
  for (const a of res) {
    message += `\n‏📺 *${a.time} - ${a.title}*`;
  }
  m.reply(message);
      }

    }
};
handler.command = /^(snrt|alaoula|arriadia|assadisa|almaghribia|arrabia|الرياضية|الأولى|العيون|laayoune|السادسة|تمازيغت|دوزيم|2m|الرابعة|المغربية)$/i;
export default handler;

async function pro(cl, ch){
  let response = await fetch('https://www.snrt.ma/ar/node/'+ch);
  let html = await response.text();
  let $ = cheerio.load(html);
  let data = [];
    $(`div.col-12.col-lg-9 .row.${cl}`).each((i, el) => {
        let title = $(el).find(`a h2`).text().trim().replace(/\t/g, '');
        let time = $(el).find(`.col-4`).text().trim().replace(/\s+/g, '').replace('H', ':');
        data.push({ title, time });
  });
return data;
}
function subtractOneHour(time) {
  // تحويل النص إلى كائن تاريخ
  let [hours, minutes] = time.split(':').map(Number);
  let date = new Date();
  date.setHours(hours - 1, minutes, 0, 0);

  // تعديل الساعات في حال كانت سالبة
  if (date.getHours() < 0) {
    date.setHours(24 + date.getHours());
  }

  // إعادة تحويل الوقت إلى نص بصيغة 'HH:mm'
  return date.toTimeString().slice(0, 5);
}
async function m2() {
  try{
    let response = await fetch('https://lematin.ma/television/2m');
    let html = await response.text();
    let $ = cheerio.load(html);
      let data = [];
        $(`.matin-program-tv .content .table-content`).each((i, el) => {
            let title = $(el).find(`.right-tab .program-title`).text().trim().replace(/\t/g, '').replace('Coran avec lauréats ', '');
            let time = $(el).find(`.left-tab`).text().trim().replace(/\s+/g, '');
            data.push({ title, time });
      });
    return data;
    } catch (e){
    console.log(e)
  }}
