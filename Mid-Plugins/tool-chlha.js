const amazighToLatinMap = {
  'ⴰ': 'a',
  'ⴱ': 'b',
  'ⴳ': 'gh',
  'ⴷ': 'd',
  'ⴻ': 'e',
  'ⴹ': 'ḍ',
  'ⴼ': 'f',
  'ⵅ': 'kh',
  'ⴽ': 'k',
  'ⵀ': 'h',
  'ⵃ': '7',
  'ⵄ': '3',
  'ⵇ': '9',
  'ⵊ':'j',
  'ⵉ': 'i',
  'ⵍ': 'l',
  'ⵎ': 'm',
  'ⵏ': 'n',
  'ⵓ': 'o',
  'ⵔ': 'r',
  'ⵕ': 'ṛ',
  'ⵖ': 'gh',
  'ⵙ': 's',
  'ⵚ': 'ṣ',
  'ⵛ': 'ch',
  'ⵜ': 't',
  'ⵟ': 'ṭ',
  'ⵡ': 'w',
  'ⵢ': 'y',
  'ⵣ': 'z',
};

const latinToAmazighMap = {};
for (const [amazigh, latin] of Object.entries(amazighToLatinMap)) {
  latinToAmazighMap[latin] = amazigh;
}

const translateText = (text, direction) => {
  const translationMap = direction === 'amazighToLatin' ? amazighToLatinMap : latinToAmazighMap;
  return Array.from(text, char => translationMap[char] || char).join('');
};

let handler = async (m, { text, command }) => {
let txt = text.toLowerCase();
  // Check if there is no specified text, use the quoted text
  if (!txt && m.quoted && m.quoted.text) {
    txt = m.quoted.text;
  }

  const direction = command === 'ch' ? 'latinToAmazigh' : 'amazighToLatin';

  // خاصية خاصة لتحويل "kh" إلى "ⵅ"
  if (direction === 'latinToAmazigh') {
    text = text.replace(/kh/g, 'ⵅ').replace(/ch/g, 'ⵛ').replace(/gh/g, 'ⵖ');
  }

  const translatedText = translateText(txt, direction);

  m.reply(`${translatedText}`);
  if (translatedText.includes('ⵀ')) {
     throw `هو حرف الهاء ⵀ\n\nإن كنت تقصد حرف الحاء فأستعمل الرقم 7 بدلا من الحرف H`;
  }
};

handler.command = /^(ch|fr)$/i;
handler.help = ['toamazigh', 'tolatin'];
handler.tags = ['translation'];

export default handler;