import * as cheerio from 'cheerio';
const cities = {
  "Aarab Sebbah Ziz": 505,
  "Agadir": 1, 
  "Bouachiba": 426, 
  "Inzgane": 11,
  "Agdz": 235,
  "Aghbalou": 358,
  "Aglou": 504,
  "Agouim": 204,
  "Ahfir": 274,
  "Ain Aicha": 351,
  "Ain Bni Mathar": 26,
  "Ain Chair": 465,
  "Ain Defali": 268,
  "Ait Aissa Ou Brahim": 507,
  "Ait Amira": 120,
  "Ait Attab": 353,
  "Ait Baha": 16,
  "Ait Daoud": 373,
  "Ait Iaaza": 192,
  "Aït Ishaq": 170,
  "Ait Kamara": 252,
  "Ait Majden": 375,
  "Ait Melloul": 139,
  "Ait Ouabelli": 388,
  "Ait Ourir": 257,
  "Ait Saoun": 236,
  "Ait Sedrate Sahl Gharbia": 369,
  "Ait Abdellah": 71,
  "Ajdir": 315,
  "Akhfenir": 382,
  "Akka": 209,
  "Aklim": 314,
  "Aknoul": 66,
  "Al Aounate": 226,
  "Al Aroui": 92,
  "Al Hoceïma": 65,
  "Amerzgane": 468,
  "Ameskend": 541,
  "Amizimz": 230,
  "Anza": 338,
  "Aoufous": 506,
  "Aoulouz": 44,
  "Aourir": 337,
  "Arbaoua": 461,
  "Arfoud": 62,
  "Argoube": 280,
  "Assa": 46,
  "Assaka (Haha)": 335,
  "Assaki": 384,
  "Assif El Mal": 262,
  "Azemmour": 220,
  "Azilal": 281,
  "Azrou": 58,
  "Aïn Erreggada": 318,
  "Bab Berred": 247,
  "Bab Taza": 244,
  "Barakat Radi": 218,
  "Barrakte El Amine": 326,
  "Bejaâd": 114,
  "Bel Ksiri": 254,
  "Ben Guerir": 188,
  "Beni Abdellah": 251,
  "Beni Bouayach": 87,
  "Beni Drar": 317,
  "Beni Ensar": 306,
  "Beni Tajdite": 282,
  "Béni Mellal": 76,
  "Benslimane": 726,
  "Berkane": 31,
  "Berrechid": 224,
  "Bhalil": 277,
  "Biougra": 22,
  "Bir Jdid": 222,
  "Birguendouz": 302,
  "Birkouate": 216,
  "Bni Hadifa": 250,
  "Borj Agharghar": 348,
  "Bouabout": 543,
  "Bouamssa": 544,
  "Bouanane": 464,
  "Bouarfa": 28,
  "Boudenib": 463,
  "Boufakrane": 70,
  "Bouguedra": 215,
  "Bouizakarne": 185,
  "Boujdour": 33,
  "Boukidarn": 422,
  "Boulaouane": 225,
  "Boulemane": 102,
  "Boumalne Dades": 238,
  "Boumia": 99,
  "Bouskoura": 580,
  "Bruxelles": 141,
  "Bzou": 261,
  "Casablanca": 15,
  "Lissasfa": 685,
  "Ain Sebaa": 307,
  "Benjdia": 364,
  "Oulfa": 361,
  "Maarif": 308,
  "Sidi Maarouf": 760,
  "Chefchaouen": 266,
  "Chemaia": 263,
  "Cherafate": 245,
  "Chichaoua": 39,
  "Chwiter": 258,
  "Dakhla": 34,
  "Dar Ould Zidouh": 722,  
  "Dar Si Aissa": 805,
  "Demnate": 116,
  "Derdara": 243,
  "Douar Ouled Allou": 586,
  "Douar Sahrij": 378,
  "Douar Tikni": 329,
  "Driouch": 94,
  "El Aioune Charkia": 105,
  "El Attaouia": 117,
  "El Borouj": 272,
  "El Hajeb": 255,
  "El Henchane": 196,
  "El Jadida": 49,
  "El Ksabi": 356,
  "El Menzel": 190,
  "El Ouatia - Tan Tan": 381,
  "El jebha": 283,
  "Errachidia": 61,
  "Essaouira": 51, 
  "Fask": 312,
  "Fes": 23,
  "Figuig": 285,
  "Fnideq": 121,
  "Foum El Hassan": 210,
  "Foum Jemaâ": 260,
  "Foum zguid": 287,
  "Fquih Ben Salah": 74,
  "Frouga": 349, 
  "Ghazoua": 331,
  "Goulmima": 108,
  "Gourrama": 288,
  "Guelmim": 37,
  "Guenfouda": 380,
  "Guercif": 90,
  "Guerguerat": 362,
  "Guigou": 103,
  "Guisser": 578,
  "Had Boumoussa": 723,
  "Had Draa": 325,
  "Had Soualem": 223,
  "Hassi Berkane": 112,
  "Hed Hrara": 652,
  "Icht": 387,
  "Ida Osmlal": 214,
  "Ida Ougnidif": 88,
  "Idelsane": 370,
  "Idouirane": 341,
  "Iflilte": 471,
  "Ifrane": 80,
  "Ighrem": 207,
  "Ighrem N Ougdal": 203,
  "Ikkaouen": 424,
  "Imi n Tlit": 374,
  "Imintanoute": 40,
  "Imiter": 367,
  "Imouzzer Kandar": 191,
  "Imsouane": 334,
  "Imzouren": 86,
  "Iriq": 347,
  "Issafen": 208,
  "Issaguen": 248,
  "Isserarene Tamdafelt": 355,
  "Jdour": 725,
  "Jemaa Mtal": 585,
  "Jemaa Shaim": 55,
  "Jemâa Feddalat": 727,
  "Jerada": 205,
  "Jorf El Melha": 267,
  "[Karia Benaouda]": 803,
  "Kariat Ba Mohamed": 721,
  "Kasba Tadla": 101,
  "Kassita": 85,
  "Kelaa Mgouna": 123,
  "Kelaa sraghna": 81,
  "Kenitra": 21,
  "Khamis M'Diq": 246,
  "Khemis Ksiba (Doukala)": 582,
  "[Khemis Ouled Haj]": 796,
  "Khemisset": 17,
  "Khenichet": 619,
  "Khénifra": 73,
  "Khouribga": 75,
  "Ksar El Kébir": 144,
  "Ksar Sghir": 256, 
  "Laaouamera": 462,
  "Laathamena": 584,
  "Laâyoune": 32,
  "Laâyoune Port": 38,
  "Laghnimyene": 581,
  "Lahri": 324,
  "Lakhssas": 311,
  "Lalla Takerkoust": 231,
  "Larache": 111,
  "Lbour": 371,
  "Leqliaa -Agadir-": 363,
  "Loudaya": 345,
  "MHAMID EL GHIZLANE": 289,
  "Marrakech": 19,
  "Masmouda": 804,
  "Maaziz": 321,
  "Mdiq": 122,
  "Adrej": 69,
  "Mejjat": 342,
  "Meknes": 64,
  "Melga el Ouidane": 316,
  "Mengoub": 466,
  "Mernissa": 350,
  "Merzouga": 385,
  "Messawer Rasso": 328,
  "Metrane": 583,
  "Midar": 95,
  "Midelt": 59,
  "Mirleft": 41,
  "Missour": 354,
  "[Mograne]": 801,
  "Mohammédia": 115,
  "Moulay Bochta": 720,
  "Moulay Idriss Zerhoun": 270,
  "Moulay Yaâcoub": 310,
  "M'rirt": 72,
  "Mzouda": 343, 
  "N'zalat Bni Amar": 271,
  "Nador": 91,
  "Nfifa": 540,
  "Nkob": 290,
  "Oualidia": 264,
  "[Ouaouizeght]": 798,
  "Ouaoumana": 322,
  "Ouargui": 379,
  "Ouarzazate": 20,
  "Oued Amlil": 83,
  "Oued Zem": 113,
  "Oued laabid": 291,
  "Ouezzane": 78,
  "Oujda": 25,
  "Oulad Aaissa": 193,
  "Oulad Abbou": 340,
  "Oulad Berhil": 43,
  "Oulad Said": 265,
  "Oulad Teima": 54,
  "Ouled Amrane": 228,
  "Ouled Ayad": 253,
  "Ouled Aziz": 719,
  "Ouled Khellouf": 377,
  "Ouled Mbarek": 800,
  "Oulmès": 319,
  "Ounagha": 195,
  "Ourtofelleh": 333,
  "Ourtzagh": 718,
  "RP 33": 359,
  "Rabat": 7,
  "Ribate El Kheir": 68,
  "Rich": 60,
  "Rissani": 63,
  "Safi": 53,
  "Saidia": 293,
  "Sakka": 93,
  "Salé": 77,
  "Sebt Ait Imour": 344,
  "Sebt gzoula": 57,
  "Sefrou": 67,
  "Selouane": 242,
  "Settat": 82,
  "Sid L'Mokhtar": 198,
  "[Sidi Al Kamel]": 802,
  "Sidi Allal Tazi": 240,
  "Sidi Bennour": 227,
  "Sidi Bou Othmane": 360,
  "Sidi Ettiji": 724,
  "Sidi Hajjaj Oued Hassar": 728,
  "Sidi Harazem": 617,
   "Sidi Kacem": 110,
   "Sidi Rahhal": 425,  
   "Sidi Slimane": 109,
   "Sidi Yahya El Gharb": 618,
   "Sidi Yahya Ousaad": 357,
   "Sidi Ifni": 42,
   "Skhour Rehamna": 189,
   "Skoura": 237,
   "Smara": 194,
   "Smimou": 187,  
   "Souira Kedima": 797,
   "Souk Aam": 795, 
   "Souk El Had Des Bradia": 366,
   "Souk El Khemis Dades": 368,
   "Souk Sebt Oulad Nemaa": 119,
   "Souk El Arbaa": 79,
   "Sour El Aaz": 376,
   "Taddart (Tichka)": 202,
   "Tafraout": 12,
   "Taftecht": 197,
   "Taghazout": 52,
   "Taghjijt": 212,
   "Tagounite": 294,
   "Tah": 383,
   "Tahla": 89,
   "Taliouine": 125,
   "Talmest": 217,
   "Talsint": 295,
   "Tamanar": 186,
   "Tamanart": 211, 
   "Tamegroute": 297,
   "Tamelelt": 118,
   "Tamorot": 503,
   "Tamri": 336,
   "Tan Tan": 35,
   "Tanant": 259,
   "Tanger": 13,
   "Tansikhte": 234,
   "Taouloukoult": 542,
   "Taounate": 298,
   "Taourirt": 24,
   "Tarfaya": 184,
   "Targoumait": 313,
   "Targuist": 249,
   "Tarifa": 142,
   "Taroudant": 45,
   "Tassaout": 273,
   "Tata": 206,
   "Taza": 29,
   "Tazarine": 299,
   "Tazart": 428,
   "Tazlida": 201,
   "Taznakht": 124,
   "Temara": 545,
   "Tendrara": 30,
   "Tetouan": 96,
   "Tiddas": 320,
   "Tidili Fetouaka": 427,
   "Tidzi": 332,
   "Tiflet": 18,
   "Tighassaline": 300,
   "Timahdite": 372,
   "Timedline": 467,
   "Timguilcht": 213,
   "Timoulay": 386,
   "[Timoulilte]": 799,
   "Tinejdad": 107,
   "Tinghir": 106,
   "Tinzouline": 233,
   "Tiourjdal": 470,
   "Tissint": 301,
   "Titt Mellil": 729,
   "Tizi Ouasli": 84,
   "Tiznit": 36,
   "Tizounine": 389,
   "Tlata Ketama": 423,
   "Tnine Beni Meskine": 579,
   "Tnine Chtouka": 221,
   "Tnine Ghiat": 327,
   "[Tnine Lgharbia]": 806,
   "Torremolinos (Espagne)": 128,
   "Touama": 199,
   "Toufliht": 200,
   "Valdepenas (Espagne)": 133,
   "Youssoufia": 229,
   "Zag": 48,
   "Zagora": 232,
   "Zaida": 98,
   "Zaio": 241,
   "Zaouiat Sidi Smail": 219,
   "Zaouiet Bouzarktoune": 793,
   "Zaouïat Cheikh": 100,
   "Zegota": 269,
   "Zemamra": 56,
   "Zerarda": 339,
   "Zerkten": 469,
   "Znada": 346,
   "Zrizer": 352
}
const handler = async (m, { conn, args, command}) => {
  try {
    if (!args[0]) {
        m.reply(`💡 *طريقة الاستعمال:*\n.${command} المدينة1+المدينة2\n🔦 *أو على شكل:*\n\n.${command} تاريخ_اليوم عدد_الأشخاص المدينة1+المدينة2\n\n🕯️ *مثال:*\n.${command} casablanca+rabat 2 31`); } return;
    const [city1, city2] = args[0]
      .split("+")
      .map((city) => city.charAt(0).toUpperCase() + city.slice(1));
const id1 = cities[city1];
const id2 = cities[city2];
let id3 = args[1];
let id4 = args[2];
const today = new Date();
const formattedDate = today.getDate().toString().padStart(2, '0');
if (!id4 || (!id3 && !id4)) {
    id4 = formattedDate;
    id3 = 1;}
    const data = await getTravelData(id1, id2, id3, id4);
    if (data === "404") {
      await m.reply("⛔ لا توجد رحلات بين المدينتين ⛔");
      return true;
    }
    const dataArray = JSON.parse(data);

    let message = `الرحلات بين ${city1} و ${city2} بتاريخ ${id4} لـ ${id3} أشخاص:\n`;

    for (let i = 0; i < dataArray.length; i++) {
      const trip = dataArray[i];
      if (!trip.voyageId) throw `لا توجد رحلات`;
      const timeagdep = trip.agDep.tempsArret.slice(0, 5);
      if (trip.prix !== 0) {
        if (trip.isAvailable === 0) {
          message += `
🚌 *الكار ${i + 1}:* ~${trip.societeNom}~
⏳ *الإنطلاق:* ~${timeagdep}~
💸 *السعر:* ~${trip.prix} درهم~
ʙʏ ᴍɪᴅsᴏᴜɴᴇ`;
        } else {
          message += `
🚌 *الكار ${i + 1}:* ${trip.societeNom}
⏳ *الإنطلاق:* ${timeagdep}
💸 *السعر:* ${trip.prix} درهم
ʙʏ ᴍɪᴅsᴏᴜɴᴇ`;
        }
      }
    }

    message = message.trim();

    await m.reply(message);
  } catch (e) {
    console.error("Error:", e);
    await m.react(error);
  }
};

handler.command = /^(car|mrkoub|markoub|مركوب)$/i;
export default handler;

async function getTravelData(id1, id2, id3, id4) {
  try {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    const url = `https://www.markoub.ma/fr/Recherche/Show?villeDepartId=${id1}&villeArriveeId=${id2}&nbrSeat=${id3}&dateDepart=${formattedDate}-${id4}`;
    console.log(url);
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const scriptText = $("script").eq(-2).text();

    const regex = /prices:\s*_.map\(\[\s*.*?\],function\(f\){/;
    const match = scriptText.match(regex);
    if (!match || !match[0]) {
      let errorr = "404";
      return errorr;
    }

    const final = match[0]
      .replace("prices: _.map([", "")
      .replace("],function(f){", "")
      .replace("false},", "false}")
      .replace('false}{"voyageId', 'false},{"voyageId')
      .replace('true}{"voyageId', 'true},{"voyageId');

    const jsonData = `[${final}]`;
    return jsonData;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
