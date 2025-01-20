import axios from 'axios';
import * as cheerio from 'cheerio';
let cities = {
    "1": "الرباط وسلا",
    "2": "الخميسات",
    "3": "تيفلت",
    "4": "الرماني",
    "5": "والماس",
    "6": "بوزنيقة",
    "7": "القنيطرة",
    "8": "سيدي قاسم",
    "9": "سيدي يحيى الغرب",
    "10": "سيدي سليمان",
    "11": "سوق أربعاء الغرب",
    "12": "عرباوة",
    "13": "مولاي بوسلهام",
    "15": "الدار البيضاء",
    "16": "المحمدية",
    "17": "بن سليمان",
    "18": "سطات",
    "19": "الكارة",
    "20": "البروج",
    "21": "ابن أحمد",
    "22": "برشيد",
    "23": "الجديدة",
    "24": "أزمور",
    "25": "سيدي بنور",
    "26": "خميس الزمامرة",
    "28": "بني ملال",
    "29": "خنيفرة",
    "30": "مولاي بوعزة",
    "31": "زاوية أحنصال",
    "32": "أزيلال",
    "33": "الفقيه بنصالح",
    "34": "دمنات",
    "35": "القصيبة",
    "36": "قصبة تادلة",
    "37": "خريبكة",
    "38": "وادي زم",
    "40": "مراكش",
    "41": "قلعة السراغنة",
    "42": "الصويرة",
    "43": "شيشاوة",
    "44": "بنجرير",
    "45": "الرحامنة",
    "46": "تمنار",
    "47": "آسفي",
    "48": "الوليدية",
    "49": "اليوسفية",
    "50": "تسلطانت",
    "51": "تامصلوحت",
    "52": "قطارة",
    "54": "كلميم",
    "55": "أسا",
    "56": "الزاك",
    "57": "طانطان",
    "58": "سيدي إفني",
    "60": "طنجة",
    "61": "تطوان",
    "62": "العرائش",
    "63": "أصيلة",
    "64": "شفشاون",
    "65": "مرتيل",
    "66": "المضيق",
    "67": "القصر الكبير",
    "68": "القصر الصغير",
    "69": "الحسيمة",
    "70": "سبتة",
    "71": "الفنيدق",
    "72": "الجبهة",
    "73": "واد لاو",
    "74": "باب برد",
    "75": "وزان",
    "76": "بوسكور",
    "78": "وجدة",
    "79": "بركان",
    "80": "فكيك",
    "81": "بوعرفة",
    "82": "كرسيف",
    "83": "جرادة",
    "84": "عين الشعير",
    "85": "تاوريرت",
    "86": "الناظور",
    "87": "مليلية",
    "88": "دبدو",
    "89": "سلوان",
    "90": "بني أنصار",
    "91": "فرخانة",
    "92": "تالسينت",
    "93": "تندرارة",
    "94": "العيون الشرقية",
    "95": "بني ادرار",
    "96": "السعيدية",
    "97": "رأس الماء",
    "98": "تافوغالت",
    "99": "فزوان",
    "100": "أحفير",
    "101": "زايو",
    "102": "دريوش",
    "103": "بني تجيت",
    "104": "بوعنان",
    "106": "فاس",
    "107": "صفرو",
    "108": "مولاي يعقوب",
    "109": "بولمان",
    "110": "ميسور",
    "111": "رباط الخير",
    "112": "المنزل بني يازغة",
    "113": "إموزار كندر",
    "114": "تازة",
    "115": "تاونات",
    "116": "أكنول",
    "117": "تيزي وسلي",
    "118": "بورد",
    "119": "تاهلة",
    "120": "تيسة",
    "121": "قرية با محمد",
    "122": "كتامة",
    "123": "واد أمليل",
    "124": "مكناس",
    "125": "يفرن",
    "126": "الحاجب",
    "127": "زرهون",
    "128": "آزرو",
    "130": "الرشيدية",
    "131": "الريصاني",
    "132": "أرفود",
    "133": "تنديت",
    "134": "كلميمة",
    "135": "إملشيل",
    "136": "تنجداد",
    "137": "الريش",
    "138": "ميدلت",
    "139": "زاكورة",
    "140": "ورزازات",
    "141": "تنغير",
    "142": "هسكورة",
    "143": "قلعة مكونة",
    "144": "أكدز",
    "145": "بومالن دادس",
    "146": "النيف",
    "147": "أسول",
    "148": "أمسمرير",
    "149": "تازارين",
    "151": "أكادير",
    "152": "تارودانت",
    "153": "تزنيت",
    "154": "إغرم",
    "155": "تالوين",
    "156": "تافراوت",
    "157": "طاطا",
    "158": "أقا",
    "159": "فم لحصن",
    "160": "بويكرة",
    "161": "أولاد تايمة",
    "163": "العيون",
    "164": "بوجدور",
    "165": "طرفاية",
    "166": "السمارة",
    "168": "الداخلة",
    "169": "أوسرد",
    "170": "بويزكارن",
    "171": "بوكراع",
    "172": "تفاريتي",
    "173": "المحبس",
    "174": "الكويرة"
};
let handler = async (m, {args, command}) => {
if(command === 'ville'){
let user1;
if (m.quoted) {user = m.quoted.sender} else {user1 = m.sender}
const user = global.db.data.users[user1];
if (!args[0]) {
let citiesList = "*أدخل إسم مدينتك:*\n\nمثال: *.ville 15*\n";
Object.entries(cities).forEach(([key, value]) => {
citiesList += `\n${key} - ${value}`;
});
m.reply(citiesList);
return;
}
user.adan = args[0];
m.react('✅');
} else {
try {
const usr = global.db.data.users[m.sender];
let q = usr.adan;
if (!q) {
let citiesList = `قبل إستعمال الأمر أدخل رقم مدينتك، مثال:\n.ville 15\n\n*قائمة المدن وأرقامها:*\n\n`;
for (const [code, cityName] of Object.entries(cities)) {citiesList += `${code}: ${cityName}\n`}
return m.reply(citiesList);
}
const res = await salat(q); {
      const salat = JSON.parse(res);
      const mdina = salat[0].mdina;
      const salatTimes = salat[0].salat;
let message = ``; 
  message += `${mdina}\n\n`;
        for (const prayer in salatTimes[0]) {
  message += ` 🕋 *${prayer}*: ${salatTimes[0][prayer]}\n`;
      }
      await m.reply(message);
}
} catch (error) {
    console.error('Error fetching data:', error);
  }
}
}
handler.command = /^(salah|adan|ville)$/i;
export default handler;

function salat(q) {
  if(!q) {let q = "15"}
       return new Promise((resolve, reject) => {
    axios.get('https://fm6oa.org/prieres/code/index.php?ville=' + q)
    .then(({ data }) => {
      const $ = cheerio.load(data);
      let hasil = [];
      $('div.prayer-body > div.prayerAdan > table > tbody > tr').each(function (index, row) {
          if (index === 0) return;
          var prayers = $(row).find('td.nextprayer').map(function() {
              return $(this).text().trim();
          }).get();
          var times = ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'];
          var prayerTimes = {};
          for (var i = 0; i < times.length; i++) {
              prayerTimes[times[i]] = prayers[i] || ''; 
          }
          hasil.push(prayerTimes);
      });
      let day = $('body > div > div:eq(1) > div.prayer-body.col-lg-12 > div > table > tbody > tr.active > td:eq(0)').text().trim();
      let nhar = $('body > div > div:eq(1) > div.prayer-body.col-lg-12 > div > table > tbody > tr.active > td:eq(1)').text().trim();
      let month = $('body > div > div:eq(1) > div.prayer-body.col-lg-12 > div > table > tbody > tr > td:eq(1)').text().trim();
      let md = $('body > div > div > div > div.prayer-titre.col-lg-9.col-xs-9.col-sm-9 > h2').text().trim().replace('الصلاة', `الصلاة ليوم ${day} ${nhar} ${month}`).replace('  ', ' ');

      let mdina = `*${md}*`
      var hasill = [{
          mdina,
          salat: hasil
      }] ;
      let hasilll = JSON.stringify(hasill);
      resolve(hasilll);

    })
        })
}
