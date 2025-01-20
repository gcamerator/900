import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

const leagues = {
  'afc': 'https://www.yallakora.com/afc-asian-cup/2824/fixtures/%D9%83%D8%A3%D8%B3-%D8%A2%D8%B3%D9%8A%D8%A7',
  'can': 'https://www.yallakora.com/afcon/2830/fixtures/%D9%83%D8%A3%D8%B3-%D8%A7%D9%84%D8%A3%D9%85%D9%85-%D8%A7%D9%84%D8%A3%D9%81%D8%B1%D9%8A%D9%82%D9%8A%D8%A9',
  'bundesliga': 'https://www.yallakora.com/bundesliga/2837/standing',
  'ligue': 'https://www.yallakora.com/ligue1/2838/standing',
  'calcio': 'https://www.yallakora.com/serie-a/2836/standing',
  'laliga': 'https://www.yallakora.com/la-liga/2833/standing',
  'euro': 'https://www.yallakora.com/euro-2024/2871/group-standing',
  'cl': 'https://www.yallakora.com/uefa/2849/fixtures/%D8%AF%D9%88%D8%B1%D9%8A-%D8%A3%D8%A8%D8%B7%D8%A7%D9%84-%D8%A3%D9%88%D8%B1%D9%88%D8%A8%D8%A7',
  'botola': 'https://www.yallakora.com/morrocan-league/2851/standing',
  'premier': 'https://www.yallakora.com/epl/2829/standing/',
  'caf': 'https://www.yallakora.com/african-champions-league/2839/group-standing/',
  'egyleague': 'https://www.yallakora.com/egyptian-league/2846/standing',
  'rsl': 'https://www.yallakora.com/ksa-league/2842/standing',
  'emaleague': 'https://www.yallakora.com/uael-league/2852/standing',
  'qsl': 'https://www.yallakora.com/qatar-league/2848/standing',
};

const rankSymbols = ['❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽', '❾', '❿', '⓫', '⓬', '⓭', '⓮', '⓯', '⓰', '⓱', '⓲', '⓳', '⓴'];

async function allJdwel(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const result = [];
    const title = $('#fbTitle').attr('content'); 
    $('.wRow').each((index, element) => {
      const league = $(element).find('.ttl.groupTtlStand h2').text().trim();
      const rank = $(element).find('.item.arrng').text().trim();
      const teamName = $(element).find('.item.team a p').text().trim();
      const points = $(element).find('.item.dtls:last-child').text().trim();
      const plays = $(element).find('.item.dtls:eq(0)').text().trim();
      result.push({
        rank, plays, league,
        teamName,
        points
      });
    });

    return {result, title};
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

let handler = async (m, { conn, command }) => {
  if (leagues[command]) {
    let url = leagues[command];
    let { result: res, title } = await allJdwel(url); 
    let teks = `🏆 *◈ ${title} ◈* 🏆\n\n`; 

    if (command === 'caf' || command === 'euro') {
      let repetitionCounter = 0;
      res.forEach((item) => {
        repetitionCounter++;
        const prefix = repetitionCounter <= 9 ? '  ' : '';
        const result = `${prefix}${item.rank} - [${item.points} نقطة] ◂◂ *${item.teamName}*` + '\n';
        teks += result;
        if (repetitionCounter % 4 === 0 && repetitionCounter !== res.length) {
          teks += '‏━━━━━━━━━━━━━━━━━━━━\n';
        }
      });
      conn.reply(m.chat, teks, m);
    }
    else if (command === 'cl' || command === 'can' || command === 'afc') {
      let ress = await allJdwelm(url);
      console.log(ress)
      let tekss = `*نتائج* *${ress.title}*\n`;
      let repetitionCounter = 0;
      ress.result.forEach((item) => {
        repetitionCounter++;
        const prefix = repetitionCounter <= 9 ? '  ' : '';
        const result = `${prefix}\n${item.mstat} ${item.date}\n*${item.teamA}* ${item.score} *${item.teamB}*` + '\n';
        tekss += result;
      });

      conn.reply(m.chat, tekss, null);
    } else {
      let repetitionCounter = 0;
      let del = res.length * 2 - 2;
      res.forEach((item) => {
        repetitionCounter++;
        const prefix = repetitionCounter <= 9 ? '  ' : '';
        const result = `${prefix}${item.rank} - [${item.points} ن] ◂◂ *${item.teamName}* (${del - item.plays}-)` + '\n';
        teks += result;
        if (repetitionCounter % 4 === 0 && repetitionCounter !== res.length) { }
      });
      conn.reply(m.chat, teks, m);
    }

  } else if (command === 'korank') {
    throw '*لعرض جدول الترتيب لأحد الدوريات، أدخل:*\n\n*.botola* (الدوري المغربي)\n*.laliga* (الدوري الإسباني)\n*.premier* (الدوري الإنجليزي)\n*.ligue* (الدوري الفرنسي)\n*.calcio* (الدوري الإيطالي)\n*.bundesliga* (الدوري الألماني)\n*.rsl* (الدوري السعوي)\n*.qsl* (الدوري القطري)\n*.egyleague* (الدوري المصري)\n*.emaleague* (الدوري الإماراتي)\n*.cl* (دوري أبطال أوروبا)\n*.euro* (يورو 2024)\n*.caf* (دوري أبطال أفريقيا)';
    return;
  }
}
handler.command = /^(premier|egyleague|rsl|qsl|emaleague|euro|caf|botola|ligue|can|afc|cl|laliga|bundesliga|calcio|korank)$/i;

export default handler;

async function allJdwelm(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const result = [];
    const title = $('.tourTtl h1').text().trim();
    $('.liItem').each((index, element) => {
      const dateElement = $(element).find('.allData .topData .date');
      const dateClone = dateElement.clone();
      dateClone.find('span').remove();
      const date = dateClone.text().trim();
      const mstat = $(element).find('.allData .topData .matchStatus').text().trim().replace(/انتهت/g, '✅').replace(/لم تبدأ/g, '⏳');
      const teamA = $(element).find('.allData .teamCntnr .teamsData .teams.teamA p').text().trim();
      const scoreElement = $(element).find('.allData .teamCntnr .teamsData .MResult');
      const scoreTexts = scoreElement.find('.score').map((index, el) => $(el).text().trim()).get();
      const pnTexts = scoreElement.find('.penaltyRes').map((index, el) => $(el).text().trim()).get();
      const score = scoreTexts.join(' × ') + (pnTexts.length > 0 ? ` ${pnTexts.join(' × ')}` : '');
      const teamB = $(element).find('.allData .teamCntnr .teamsData .teams.teamB p').text().trim();
      result.push({
        date,
        mstat,
        score,
        teamA,
        teamB
      });
    });

    return { result, title };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
