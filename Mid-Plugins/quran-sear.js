import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) { 
        throw `أدخل كلمة البحث، مثال:\n\n.${command} الله نور السماوات`; 
    }
    try {
       let res = await searchQuran(text);
        m.reply(`أَعُوذُ بِٱللَّهِ مِنَ ٱلشَّيۡطَـٰنِ ٱلرَّجِيمِ${res}`);
    } catch (errorr) {
        console.log(errorr);
        m.reply(errorr);
    }
}
handler.command = /^(qs|qurans|searchq)$/i;

async function searchQuran(text) {
    try {
        let response = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(text)}/all/ar`);
        let data = await response.json();
        const matches = data.data.matches.filter(match => match.edition.type === 'quran');
        let result = '';
        matches.forEach((match, index) => {
result += `\n\n*﴿${match.text}﴾*\n${match.surah.name} - الأية: ${match.numberInSurah}`;
        });
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export default handler;
