let handler = async (m, { command, conn, args }) => {
    let id = m.chat;
    conn.qsura = conn.qsura ? conn.qsura : {};
    if (id in conn.qsura) {
        conn.reply(m.chat, 'لا تزال هناك أسئلة لم يتم الرد عليها', conn.qsura[id][0]);
        throw false;
    }
    const randomAyah = await getRandomAyah();
    const randomSurahList = await getRandomSurah(randomAyah.surahIndex);

    let response = `*إختر السورة الصحيحة لهاتين الآيتين:*\n\n*﴿${randomAyah.randomAyahText} ۞ ${randomAyah.randomAyahText2}﴾*\n\n`;
    for (let i = 0; i < randomSurahList.length; i++) {
        response += ` *${i + 1}. ${randomSurahList[i].name}*\n`;
    }

    let correctIndex = randomSurahList.findIndex(surah => surah.isCorrect) + 1;

    if (correctIndex !== -1) {
     const reply = await conn.reply(m.chat, response, m);
        const correctSurah = randomSurahList.find(surah => surah.isCorrect);
        conn.qsura[id] = [reply, correctSurah.name, correctIndex];
         } else {
        m.reply('ERR');
    }
}
handler.customPrefix = /^(qquiz|quranquiz|quizq)(\s|$)/i;
handler.command = new RegExp;
export default handler;

async function getRandomAyah() {
    const res = await fetch('https://raw.githubusercontent.com/midsoune/JSON/main/quran.json');
    const data = await res.json();
    const rsi = Math.floor(Math.random() * data.length);
    const rat = Math.floor(Math.random() * data[rsi].ayahs.length);
    const randomAyahText = data[rsi].ayahs[rat].text.ar
    const randomAyahText2 = data[rsi].ayahs[rat + 1].text.ar;
    const surahName = data[rsi].asma.ar.long;
    return { surahName, randomAyahText, randomAyahText2, surahIndex: rsi };
}

async function getRandomSurah(correctSurahIndex) {
    const res = await fetch('https://raw.githubusercontent.com/midsoune/JSON/main/quran.json');
    const data = await res.json();
    const randomSurahIndices = [];
    while (randomSurahIndices.length < 3) {
        const randomIndex = Math.floor(Math.random() * data.length);
        if (!randomSurahIndices.includes(randomIndex) && randomIndex !== correctSurahIndex) {
            randomSurahIndices.push(randomIndex);
        }
    }
    const surahList = [{ name: data[correctSurahIndex].asma.ar.long, isCorrect: true }];
    for (const index of randomSurahIndices) {
        surahList.push({ name: data[index].asma.ar.long, isCorrect: false });
    }
    surahList.sort(() => Math.random() - 0.5);
    return surahList;
}
