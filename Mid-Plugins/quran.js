import fetch from 'node-fetch';
const reciters = [{
    name: "1",
    folder: "ahmed_ibn_3ali_al-3ajamy",
    arname : "أحمد بن علي العجمي" },{
    name: "2",
    folder: "fares",
    arname : "فارس عباد"},{
    name: "3",
    folder: "abdurrahmaan_as-sudays",
    arname : "عبد الرحمان السديس"},{
    name:  "4",
    folder: "maher_almu3aiqly/year1440",
    arname : "ماهر المعيقلي" },{
    name: "5",
    folder: "sa3d_al-ghaamidi/complete",
   arname : "سعد الغامدي"},{
    name: "6",
    folder: "yasser_ad-dussary",
    arname : "ياسر الدوسري"} ];

let handler = async (m, { conn, args }) => {
  try {
    let surahInput = args[0];
    let reciterInput = args[1];
    if (!surahInput || !reciterInput) {
      throw new Error(`يرجى إدخال رقم السورة متبوعا برقم المقرئ\n\n1. أحمد بن علي العجمي\n2. فارس عباد\n3. عبد الرحمان السديس\n4. ماهر المعيقلي\n5. سعد الغامدي\n6. ياسر الدوسري\n\n*مثال:*\n.quran 99 1\n\nلعرض أرقام السور، أكتب *سور القران*`);
    }
    let selectedReciter = reciters.find(reciter =>
      reciter.name.toLowerCase() === reciterInput.toLowerCase()
    );
    if (!selectedReciter) {
      throw new Error(`المقرئ رقم "${reciterInput}" غير متاح.\n الخيارات المتاحة\n1\n2\n3\n4\n5\n6`);
    }
    let res = await fetch('https://quran-endpoint.vercel.app/quran/' + surahInput);
    let surahList = await res.json();
    let surahData = surahList.data

    if (!surahData) {
      throw new Error(`لا توجد سورة بالرقم أو الإسم الذي أدخلته "${surahInput}\n\nلعرض جميع سور القرآن أكتب *_سور القران_*`);
    }
console.log(surahData)
    let city = "";
    if (surahData.type.en === "Medinan") {
      city = "مدنية";
    } else if (surahData.type.en === "Meccan") {
      city = "مكية";
    } else {
      city = "غير معروفة";
    }
    let quranSurah = `📜 *السورة : ${surahData.asma.ar.long}*
📚 *النوع :* ${city}
🔢 *عدد الأيات :* ${surahData.ayahCount}
👳🏻 *المقرئ :* ${selectedReciter.arname}`;

m.reply(quranSurah);
let surahNumber = String(surahData.number).padStart(3, '0'); // تأكد من أن الرقم يكون ثلاثة أرقام
let recitationUrl = `http://download.quranicaudio.com/quran/${selectedReciter.folder}/${surahNumber}.mp3`;

    conn.sendMessage(m.chat, { audio: { url: recitationUrl }, mimetype: 'audio/mpeg' }, `${surahNumber}_${surahData.asma.ar.long}.mp3`, `${surahNumber}_${surahData.asma.ar.long}`, { quoted: m });
  } catch (error) {
    console.error(error);
    m.reply(`خطأ: ${error.message}`);
  }
};
handler.command = ['quran', 'surah'];
export default handler;
