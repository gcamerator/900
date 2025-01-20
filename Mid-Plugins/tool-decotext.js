let handler = async (m, { conn }) => {
  let letters = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];
  let letters1 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let text = m.text.split(' ')
  text = text.slice(1).join('\n')
  let convertedText = "";
  for (let char of text.toLowerCase()) {
    let index = letters1.indexOf(char);
    if (index !== -1) {
      convertedText += letters[index] + ' ';
      console.log('ffff'); 
    } else {
      convertedText += char; 
      console.log('convertedText'); 
    }
  }
await conn.sendMessage(m.chat, {text: convertedText}, {quoted: null});
};
handler.customPrefix = /^(flagtext|deco|.deco)(\s|$)/i;
handler.command = new RegExp;
export default handler;
