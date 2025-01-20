import * as cheerio from 'cheerio';
import axios from 'axios';
import iconv from 'iconv-lite';

const handler = async (m, { conn }) => {
        conn.koorainfo = conn.koorainfo ? conn.koorainfo : {};

    let lg = [
        {'🇪🇸 الدوري الإسباني': '?gc=518'},
        {'🇮🇹 الدوري الإيطالي': '?gc=314'},
        {'🏴󠁧󠁢󠁥󠁮󠁧󠁿 الدوري الإنجليزي': '?gc=205'},
        {'🇩🇪 الدوري الألماني': '?gc=252'},
        {'🇫🇷 الدوري الفرنسي': '?gc=241'},
        {'🇲🇦 الدوري المغربي': '?c=26190'},
        {'🇸🇦 الدوري السعودي': '?gc=487'}
    ];

    let text = `*🔍 قم بإختيار رقم الدوري الذي تريد.*\n\n`;

    lg.forEach((league, index) => {
        text += `${index + 1} - *${Object.keys(league)[0]}*\n`;
    });

    let key = await m.reply(text);

    conn.koorainfo[m.chat] = { list: lg, key, timeout: setTimeout(() => { 
        delete conn.koorainfo[m.chat];
    }, 120000)};

}

handler.before = async (m, { conn }) => {
    conn.koorainfo = conn.koorainfo ? conn.koorainfo : {};
    const input = m.text.trim();
    if (m.isBaileys || !(m.chat in conn.koorainfo) || !/^\d+$/.test(input)) return;
    const { list, key } = conn.koorainfo[m.chat];
    const index = parseInt(input);
    const selected = index - 1;
    if (selected >= 0 && selected < 7) {
        const url = 'https://clw.kooora.com/' + Object.values(list[selected])[0];
        let text = `🥇 *ترتيب الدوري:*\n‏⋄⋆⋅⋆⋅⋆⋅⋆⋄\n`;
       let res = await KoooraRank(url)
       let resss = await KooorChannels(url)
       let ress = await KoooraNext(url)
     let a = res.forEach((team, index) => {
            text += `${index + 1} - *${team.points} نقطة* - *${team.teamName}*\n`;
        });
        text += `\n\n🤾🏻 *المباريات المقبلة:*\n‏⋄⋆⋅⋆⋅⋆⋅⋆⋄\n`;
        let c = ress.forEach((team, index) => {
            text += `*${team.date}* : *${team.teamA}* / *${team.teamB}*\n`;
        });
        text += `\n\n📡 *القنوات الناقلة:*\n‏⋄⋆⋅⋆⋅⋆⋅⋆⋄\n`;
        let b = resss.forEach((team, index) => {
            text += `${index + 1} - *${team.channel}*\n`;
        });
      m.reply(text);
    conn.koorainfo[m.chat].timeout = setTimeout(() => {
      delete conn.koorainfo[m.chat];
    }, 120000);
  }
} 
handler.command = /^(kooorainfo|ikora)$/i;
export default handler;

async function KooorChannels(q) {
    try {
        const url = q;
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const html = iconv.decode(response.data, 'Windows-1256'); 
        const $ = cheerio.load(html);
        const str = $("script").eq(-5).text();

        const regex = /var comp_broadcasters = new Array \(([\s\S]*?)\);/;
        const matches = str.match(regex);

        if (matches && matches.length > 1) {
            const dataString = matches[1].trim();
            const dataArray = dataString.split("\n");  
         const games = [];

      for (let i = 0; i < dataArray.length - 1; i++) {
const columns = dataArray[i].split(",");
const ch = columns[1].replace(/^"(.*)"$/, '$1'); 
const lien = 'https://clw.kooora.com/?channel=' + columns[0]
const game = {
        channel: ch,
        lien: lien
};

games.push(game);
            } 
            return games;
        } 
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}
async function KoooraRank(q) {
    try {
        const url = q;
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const html = iconv.decode(response.data, 'Windows-1256'); 
        const $ = cheerio.load(html);
        const str = $("script").eq(-5).text();

        const regex = /var rankstable = new Array \(([\s\S]*?)\);/;
        const matches = str.match(regex);

        if (matches && matches.length > 1) {
            const dataString = matches[1].trim();
            const dataArray = dataString.split("\n");
            const games = [];
            let max;
            if(url.includes('?gc=487') || url.includes('?gc=241')){ max = 20
            } else if (url.includes('?c=26190')){  max = 18 } else { max = 22 }
            for (let i = 3; i <= max; i++) {
const columns = dataArray[i].split(",");
const points = columns[11]; 
const regex = /(\d+)/ || '';
const match = points.match(regex);
let pointsValue = null;
if (match) {
    pointsValue = match[0];
}
const teamNameHTML = columns[2]; 
const regexx = /<a[^>]*>([^<]+)<\/a>/; 
const matcch = teamNameHTML.match(regexx);
let teamName = null;
if (matcch) {
    teamName = matcch[1];
}
const game = {
    teamName: teamName,
    points: pointsValue
};
games.push(game);
            } 
            return games;
        } 
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}
async function KoooraNext(q) {
    try {
        const url = q;
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const html = iconv.decode(response.data, 'Windows-1256'); 
        const $ = cheerio.load(html);
        const str = $("script").eq(-5).text();

        const regex = /var comp_matches = new Array \(([\s\S]*?)\);/;
        const matches = str.match(regex);

        if (matches && matches.length > 1) {
            const dataString = matches[1].trim();
            const dataArray = dataString.split("\n");  
         const games = [];

      for (let i = 0; i < dataArray.length - 1; i++) {
const columns = dataArray[i].split(",");
const teamA = columns[4].replace(/^"(.*)"$/, '$1'); 
const teamB = columns[6].replace(/^"(.*)"$/, '$1');
const timestamp = parseInt(columns[0].replace(/"/g, "").replace(/#/g, ""), 10);
const date = new Date(timestamp * 1000);
date.setHours(date.getHours() + 1);
const day = date.getDate().toString().padStart(2, '0'); 
const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
const hours = date.getHours().toString().padStart(2, '0');
const minutes = date.getMinutes().toString().padStart(2, '0');
const dateString = `${day}/${month} ${hours}:${minutes}`; 

const game = {
        teamA: teamA,
        teamB: teamB,
       date: dateString
};

games.push(game);
            } 
            return games;
        } 
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

