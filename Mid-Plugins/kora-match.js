import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import moment from 'moment';
const leagueEmojis = [
  { league: 'الدوري الفرنسي', emoji: '🇫🇷' },
  { league: 'الدوري الإنجليزي الممتاز', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { league: 'كأس رابطة الدوري الإنجليزي', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { league: 'الدوري الإيطالي', emoji: '🇮🇹' },
  { league: 'كأس إيطاليا', emoji: '🇮🇹' },
  { league: 'كأس ألمانيا', emoji: '🇩🇪' },
  { league: 'كأس فرنسا', emoji: '🇫🇷' },
  { league: 'الدوري الإسباني', emoji: '🇪🇸' },
  { league: 'كأس ملك إسبانيا', emoji: '🇪🇸' },
  { league: 'الدوري الألماني', emoji: '🇩🇪' },
  { league: 'الدوري الهولندي الممتاز', emoji: '🇳🇱' },
  { league: 'الدوري الهولندي', emoji: '🇳🇱' },
  { league: 'الدوري البرتغالي الممتاز', emoji: '🇵🇹' },
  { league: 'كأس البرتغال', emoji: '🇵🇹' },
  { league: 'الدوري التركي الممتاز', emoji: '🇹🇷' },
  { league: 'كأس تركيا', emoji: '🇹🇷' },
  { league: 'دوري أبطال أوروبا', emoji: '🇪🇺' },
  { league: 'كأس أمم أوروبا يورو', emoji: '🇪🇺' },
  { league: 'الدوري الأوروبي', emoji: '🇪🇺' },
  { league: 'دوري المؤتمر الأوروبي', emoji: '🇪🇺' },
  { league: 'كأس العالم للناشئين تحت 17 سنة', emoji: '🏆' },
  { league: 'تصفيات أمم أوروبا', emoji: '🇪🇺' },
  { league: 'تصفيات كأس العالم أمريكا الجنوبية', emoji: '🌎' },
  { league: 'كوبا أمريكا', emoji: '🌎' },
  { league: 'تصفيات كأس العالم آسيا', emoji: '🌏' },
  { league: 'كأس آسيا', emoji: '🌏' },
  { league: 'كأس آسيا تحت 23 سنة', emoji: '🌏' },
  { league: 'دوري المحترفين الإماراتي', emoji: '🇦🇪' },
  { league: 'كأس المحترفين الإماراتي', emoji: '🇦🇪' },
  { league: 'الدوري المغربي القسم الثاني  البطولة الإحترافية', emoji: '🇲🇦' },
  { league: 'الدوري المغربي البطولة الإحترافية', emoji: '🇲🇦' },
  { league: 'كأس العرش المغربي', emoji: '🇲🇦' },
  { league: 'مباريات ودية', emoji: '🇺🇳' },
  { league: 'كأس المانيا', emoji: '🇩🇪' },
  { league: 'وديات منتخبات', emoji: '🇧🇱' },
  { league: 'وديات منتخبات تحت 23', emoji: '🇧🇱' },
  { league: 'وديات أندية', emoji: '🇧🇱' },
  { league: 'الدوري البلجيكي', emoji: '🇧🇪' },
  { league: 'الدوري السعودي للمحترفين', emoji: '🇸🇦' },
  { league: 'تصفيات أمريكا الجنوبية لكأس العالم', emoji: '🌎' },
  { league: 'دوري أبطال الكونكاكاف', emoji: '🌎' },
  { league: 'كوبا ليبرتادوريس', emoji: '🌎' },
  { league: 'تصفيات آسيا لكأس العالم', emoji: '🌏' },
  { league: 'كأس الاتحاد الإنجليزي', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { league: 'كأس الرابطة الإنجليزية للمحترفين', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'},
  { league: 'كأس رابطة الدوري الإنجليزي EFL', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'},
  { league: 'كأس الاتحاد الآسيوي', emoji: '🌏' },
  { league: 'كأس السوبر الإسباني', emoji: '🇪🇸' },
  { league: 'دوري أبطال آسيا', emoji: '🌏' },
  { league: 'كأس أمم أفريقيا', emoji: '🌍' },
  { league: 'تصفيات كأس أمم افريقيا', emoji: '🌍' },
  { league: 'تصفيات كأس العالم أفريقيا', emoji: '🌍' },
  { league: 'دوري أبطال أفريقيا', emoji: '🌍' },
  { league: 'كأس الاتحاد الأفريقي', emoji: '🌍' },
  { league: 'كأس الكونفدرالية الأفريقية', emoji: '🌍' },
  { league: 'دوري السوبر الأفريقي', emoji: '🌍' },
  { league: 'كأس السوبر الأرجنتيني', emoji: '🇦🇷' },
  { league: 'كأس الأمير قطر', emoji: '🇶🇦' },
];

const handler = async (m, { conn }) => {
let command = m.text.toLowerCase();
  let excludedLeagues;
if (['kora', 'koray', 'koray', 'koran', '.kora', '.koray', '.koray', '.koran'].includes(command)) {
 excludedLeagues = [ 'الدوري الكندي الممتاز',
  'دوري الرديف السعودي',  'الدوري الكوري الجنوبي',  'الدوري الأمريكي MLS',  'كوبا سود أمريكانا',  'كأس الخليج العربي الإماراتي',  'بطولة باوليستا البرازيل',  'الدوري الليبيري الممتاز',  'الدوري الصيني سوبر',  'الدوري الموريتاني الممتاز',  'الدوري الأوزبكي سوبر',  'الدوري القطري نجوم قطر',  'كأس الولايات المتحدة المفتوحة',  'الدوري الروسي الممتاز',  'الدوري الليبي الممتاز',  'كأس الرابطة المصرية',  'الدوري الياباني الممتاز',  'الدوري المصري الممتاز',  'الدوري الكويتي الممتاز',  'الدوري العراقي نجوم',  'الدوري الإنجليزي للسيدات سوبر',  'الدوري الإسباني للسيدات',  'الدوري الإماراتي',  'الدوري الإسباني الدرجة الثانية',  'الدوري الإنجليزي الدرجة الثانية',  'الدوري الجزائري القسم الثاني',  'الدوري الإيراني للمحترفين',  'تشامبيونشيب البطولة الإنجليزية',  'الدوري السعودي للسيدات الممتاز',  'الدوري السعودي للناشئين تحت 17 سنة',  'الدوري التونسي الرابطة المحترفة الأولى',  'الدوري النرويجي الممتاز',  'الدوري البحريني الممتاز',  'الدوري الماليزي السوبر',  'الدوري الأرجنتيني الممتاز',  'الدوري النمساوي الممتاز',  'الدوري البولندي الممتاز',  'الدوري التشيكي الممتاز',  'الدوري الأوكراني الممتاز', 'الدوري البرتغالي الدرجة الثانية', 'الدوري الصربي الممتاز',  'كأس QSL القطرية Ooredoo',  'كأس رئيس الدولة الإماراتي',  'الدوري المجري الممتاز',  'الدوري التونسي الدرجة الثاني الرابطة المحترفة الثانية',  'الدوري الكرواتي الممتاز',  'الدوري الألماني الدرجة الثانية',  'الدوري الفرنسي الدرجة الثانية', 'الدوري الإيطالي الدرجة الثاني الدرجة B',  'الدوري السعودي للشباب تحت 19 سنة',  'الدوري الأسترالي الدرجة A',  'الدوري المكسيكي الممتاز',  'الدوري السويدي الممتاز',  'الدوري الهولندي',  'الدوري اليوناني السوبر',  'الدوري الدنماركي السوبر',  'الدوري السويسري الممتاز',  'الدوري الإسكتلندي للمحترفين',  'الدوري المصري الدرجة الثانية (أ)',  'الدوري الاسباني - الدرجة الثانية',  'الدوري الجزائري الدرجة الثانية',  'دوري المحترفين الإماراتي',  'الدوري اللبناني الممتاز',  'مباريات ودية -  أندية',  'البحرين - كاس الملك',  'كأس الاتحاد الآسيوي للأندية',  'بطولة الألعاب الآسيوية - كرة القدم',  'الدوري البرازيلي',  'دوري الدرجة 2 السعودي',  'دوري محمد بن سلمان د. أولى',  'دوري الشباب السعودي',  'دوري السعودي يلو',  'دوري جنوب أفريقيا',  'دوري أبطال أوروبا للشباب',  'ليسوتو - دوري ليسوتو الممتاز',  'دوري الدرجة الأولى الكويتي',  'دوري الدرجة الثانية التونسي',  'دوري الدرجة الثانية السعودي',  'دوري الدرجة الثانية القطري', 'الدوري البحريني',  'الدوري اليمني', 'الدوري الليبي',  'الدوري السوري الممتاز',  'دوري نجوم قطر',  'الدوري الجزائري',  'كأس خادم الحرمين الشريفين',  'الدوري الإماراتي للمحترفين',  'الدوري المصري',  'الدوري العماني',  'الدوري الكويتي', 'كأس تركيا',  'كأس الأردن',  'وديات أندية (3)',  'كأس مصر',  'كأس اليونان',  'كأس الجزائر',  'كأس الأرجنتين',  'كأس إيران حذفي',  'كأس اسكتلندا',  'كأس روسيا',  'كأس السلطان العماني',  'كأس البرازيل',  'الدوري التونسي',  'كأس رابطة الدوري الارجنتيني',  'كأس ولي العهد الكويتي',  'الدوري الأمريكي للسيدات NWSL',
  'الدوري الأردني للمحترفين',  'الدوري الروماني سوبر',  'الدوري الروماني سوبر',  'الدوري السلوفيني الممتاز',  'الدوري البلغاري الأول',  'الدوري التايلندي',  'كأس تونس',  'الدوري الأوروغواياني الممتاز', 'الدوري الفيتنامي',  'دوري أبطال أوقيانوسيا', 'الدوري البلغاري الأول', 'كأس الأمير الكويتي', ];
} else {  excludedLeagues = []}

  const getLiveMatches = async (command) => {
    let kurl, txtx;
    switch (command) {
      case 'kora': case 'koraa': case '.kora':
        kurl = 'https://jdwel.com/today/';
        txtx = '*مباريات اليوم* :\n‏▬▬▬▬▬▬';
        break;
      case 'korat': case 'korata': case '.korta':
        kurl = 'https://jdwel.com/tomorrow/';
        txtx = '*مباريات الغد* :\n‏▬▬▬▬▬▬';
        break;
      case 'koray': case 'koraya': case '.koray':
        kurl = 'https://jdwel.com/yesterday/';
        txtx = '*مباريات الأمس* :\n‏▬▬▬▬▬▬';
        break;
      case 'koran': case 'korana': case '.koran':
        kurl = 'https://jdwel.com/today/';
        txtx = '*مباريات الأن* :\n‏▬▬▬▬▬\n';
        break;
      default:
        return; // إذا لم يتم العثور على الأمر المطلوب، يتم الخروج من الدالة
    }

    const url = kurl;
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      const matchesInfo = [];
      let currentLeague = '';

      matchesInfo.push(`${txtx}`);
      $('ul.comp_matches_list.matches_list').each((index, element) => {
        const leagueName = $(element).find('.comp_separator.container .main h4').text().trim().replace(/ الدرجة الاولى/g, '').replace(/ الدرجة الأولى/g, '').replace('كأس آسيا تحت 23 سنة', '🌏 كأس آسيا تحت 23 سنة');
        const leagueMatches = $(element).find('.single_match');

        if (excludedLeagues.includes(leagueName)) {
          return;
        }
        if (leagueName !== currentLeague) {
          currentLeague = leagueName;
          const getLeagueEmoji = (leagueName) => {
            const match = leagueEmojis.find((item) => item.league === leagueName);
            return match ? match.emoji : '‏';
          };
          const leagueEmoji = getLeagueEmoji(currentLeague);
          if (command !== 'koran' & command !== '.koran' && command !== 'korana') {
            matchesInfo.push(`\n*${leagueEmoji} ${currentLeague}‎*\n‏══════ ⋆★⋆ ══════`);
          }
        }
        leagueMatches.each((index, matchElement) => {
          const teamA = $(matchElement).find('.team.hometeam span.the_team').text().trim();
          const teamB = $(matchElement).find('.team.awayteam span.the_team').text().trim();
          const dateTime = $(matchElement).find('.middle_column.cell.col-2 .match_time .the_otime').text();
          const time = moment(dateTime).subtract(2, 'hours').format('HH:mm');
          const liveStatus = $(matchElement).find('.match_status');
          const matchStatusText = liveStatus.find('span').text().trim().replace(/بين الشوطين/g, '½').replace(/انتهت/g, '✅').replace(/'/g, '"').replace(/تبدأ قريباً/g, '⏳').replace(/ألغيت/g, '❌')
          const matchStatus = '"' + matchStatusText.split('"')[0];
          const mst = matchStatus.replace(/"½/g, '½').replace(/"✅/g, '✅').replace(/""/g, '"').replace(/"⏳/g, '⏳').replace(/"❌/g, '❌');
          const matchScore = $(matchElement).find('.match_score');
          const homeTeamScore = matchScore.find('.hometeam').text();
          const awayTeamScore = matchScore.find('.awayteam').text();
          let liveScore = `${homeTeamScore} - ${awayTeamScore}`;
          let matchResult = ``;
          if (command === 'koran') {
            if (matchStatusText.includes('"')) {
              matchResult += `‏【 *${teamA}* *${liveScore}* *${teamB}* 】${mst}\n`;
            } else {
              return;
            }
          } else {
            if (command !== 'koran' && liveStatus.text().includes('بدأت')) {
              matchResult += `‏【 *${teamA}* ✘ *${teamB}* 】${time}\n`;
            } else {
              matchResult += `‏【 *${teamA}* *${liveScore}* *${teamB}* 】${mst}\n`;
            }
          }

          matchesInfo.push(matchResult);
        });
      });

      return matchesInfo;
    } catch (error) {
      console.error('حدث خطأ أثناء الاتصال بالموقع:', error);
      return null;
    }
  };
//
  try {
    const matchesInfo = await getLiveMatches(command);
    if (matchesInfo && matchesInfo.length > 0) {
      const replyMessage = matchesInfo.join('\n');
      conn.reply(m.chat, replyMessage, m);
    } else {
      conn.reply(m.chat, 'لا يمكن العثور على المباريات الملعوبة حالياً.');
    }
  } catch (error) {
    console.error('حدث خطأ أثناء استخراج معلومات المباريات:', error);
  }
};

handler.customPrefix = /^(.kora|.koray|.koran|.korat|kora|koray|koran|korat|koraa|koraya|korana|korata)$/i;
handler.command = new RegExp;
export default handler;
