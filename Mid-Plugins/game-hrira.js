let fila, columna, sopaNube, sopaWORD, sopaDir, userNum, cambioLetra = null
let intentos = 0

let handler = async (m, { conn, text, usedPrefix, command}) => {
if (!userNum) {
userNum = m.sender.split("@")[0]}
async function generarHriraGame() {
const Side = 13 
let HriraGame = new Array(Side);
  
for (let i = 0; i < Side; i++) {
HriraGame[i] = new Array(Side)}
  
const WORDS = ['ARTE', 'AVATAR', 'LOGIA', 'ZAHRA', 'DANZA', 'DEBATE', 'DEPORT', 'DRAGON', 'EINSTE', 'ESCUDO', 'ESTUDI', 'FANTAS', 'LAPTOP', 'FUTBOL', 'GUITAR', 'HIPHOP', 'INGENI', 'JARDIN', 'KARATE', 'LEYEND', 'MAGIA', 'MARVEL', 'MUSEOS', 'NARUTO', 'ORNITO', 'PIZZA', 'QUIZAS', 'SALUD', 'SISTEM', 'TALENT', 'TAROT', 'TRIVIA', 'URBANI', 'VETERI', 'VIAJES', 'ZOLOG', 'CERVEZ', 'CIGARR', 'CRUCIG', 'TANGER', 'FRUTAS', 'INSECT', 'MOSAIC', 'PAYASO', 'POESIA', 'FATIZAHRA', 'TABACO', 'VINO', 'ZAPATO', 'ACTUAL', 'ARTIST', 'BASQUE', 'BONITO', 'BROCHE', 'CABEZA', 'FATIMA', 'CANCER', 'COLORE', 'CORDER', 'COSSIO', 'CURIOS', 'DANIEL', 'DEDICA', 'DEPORT', 'LIBYA', 'DUBAI', 'EDICIO', 'ESPADA', 'FABRIC', 'FUTURO', 'HOMBRE', 'JUGADO', 'LETRAS', 'LLEGAR', 'LUNA', 'MAESTR', 'NADADO', 'NATURA', 'NIROS', 'HAJEB', 'PATRIA', 'PINTOR', 'RAMIRE', 'HAMID', 'RESUMI', 'ROBOTS', 'ROMANT', 'RUSSIA', 'SACAR', 'SHOJO', 'SKETCH', 'SOLUCI', 'SONRIS', 'STUDIO', 'SUCEDI', 'TRUCOS', 'VERSOS', 'VIDRI', 'VILLAN', 'YOUTUBE', 'ZONZA']
const WORD = WORDS[Math.floor(Math.random() * WORDS.length)]
  
let iniRow = Math.floor(Math.random() * Side)
let iniColum = Math.floor(Math.random() * Side)
const Directions = ["horizontal", "vertical", "diagonalDerecha", "diagonalIzquierda"]
const Direction = Directions[Math.floor(Math.random() * Directions.length)]

let WORDAgregada = false
while (!WORDAgregada) {
iniRow = Math.floor(Math.random() * Side)
iniColum = Math.floor(Math.random() * Side)

// Algoritmo para garantizar la WORD 
let WORDEntra = true;
for (let i = 0; i < WORD.length; i++) {
if (Direction === "horizontal" && (iniColum + i >= Side)) {
WORDEntra = false
break;
} else if (Direction === "vertical" && (iniRow + i >= Side)) {
WORDEntra = false
break;
} else if (Direction === "diagonalDerecha" && (iniRow + i >= Side || iniColum + i >= Side)) {
WORDEntra = false
break;
} else if (Direction === "diagonalIzquierda" && (iniRow + i >= Side || iniColum - i < 0)) {
WORDEntra = false
break;}}

if (WORDEntra) {
for (let i = 0; i < WORD.length; i++) {
if (Direction === "horizontal") {
HriraGame[iniRow][iniColum + i] = WORD.charAt(i)
} else if (Direction === "vertical") {
HriraGame[iniRow + i][iniColum] = WORD.charAt(i)
} else if (Direction === "diagonalDerecha") {
HriraGame[iniRow + i][iniColum + i] = WORD.charAt(i)
} else {
HriraGame[iniRow + i][iniColum - i] = WORD.charAt(i)
}
}
WORDAgregada = true;
}
}
  let PossLittres;
  if (command === 'hr') {
    PossLittres = "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓜⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ";
  } else {
    PossLittres = "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ";
  }

const numerosUni = ["⓿", "❶", "❷", "❸", "❹", "❺", "❻", "❼", "❽", "❾", "❿", "⓫", "⓬", "⓭", "⓮", "⓯", "⓰", "⓱", "⓲", "⓳", "⓴"]
let HriraGameConBordes = ""
HriraGameConBordes += "     " + [...Array(Side).keys()].map(num => numerosUni[num]).join("•") + "\n"
//HriraGameConBordes += "   *╭" + "┄".repeat(Side) + '┄┄' + "╮*\n"
for (let i = 0; i < Side; i++) {
let fila = numerosUni[i] + " "

for (let j = 0; j < Side; j++) {
if (HriraGame[i][j]) {
fila += HriraGame[i][j] + " "
} else {
let RanLettre = PossLittres.charAt(Math.floor(Math.random() * PossLittres.length))
fila += RanLettre + " "
}
}
fila += ""
HriraGameConBordes += fila + "\n"
}
//HriraGameConBordes += "   *╰" + "┄".repeat(Side) + '┄┄' + "╯*"
HriraGameConBordes = HriraGameConBordes.replace(/[a-zA-Z]/g, letra => PossLittres[letra.charCodeAt() - 65] || letra)

  await m.reply(`🔠 *${WORD.split("").join(" ")}* 🔠\n\n` + HriraGameConBordes.trimEnd())
  await m.reply(`*أخل رقم الصفوف التي تبدأ منها الكلمة:*\n\n*مثال:*\n❇️ ${usedPrefix + command} 23\n➡️ الصف الأفقي 2 ⬇️ الصف العمودي 3`)
fila = iniRow 
columna = iniColum
sopaNube = HriraGameConBordes
sopaWORD = WORD 
sopaDir = Direction.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())
}

// Condiciones del juego
cambioLetra = sopaDir
let tagUser = userNum + '@s.whatsapp.net'
if (userNum != m.sender.split("@")[0]) {
await conn.reply(m.chat, `*هذا دور @${tagUser.split("@")[0]} 🔠*`, null, { mentions: [tagUser] })
return
}
  // userAnswer
if (intentos === 0) {
intentos = 3  
generarHriraGame()
resetuserNum(sopaDir)

async function resetuserNum() {
await new Promise((resolve) => setTimeout(resolve, 3 * 60 * 1000)) // 3 min
if (intentos !== 0) {
    await conn.reply(m.chat, `*@${m.sender.split("@")[0]} إنتهى الوقت!!* 😧\n\n*الكلمة _"${sopaWORD}"_ كانت تبدأ من الصف الأفقي _${fila}_ والعمودي _${columna}_*`, m, { mentions: [m.sender] })
fila = null, columna = null, sopaNube = null, sopaWORD = null, sopaDir = null, userNum = null, cambioLetra = null
intentos = 0
}
}
} 
else {
if (`${fila}${columna}` == text) {
 await m.reply(`🎊 *الجواب صحيح!! كلمة _"${sopaWORD}"_ كانت تبدأ في الصف الأفقي _${fila}_ والصف العمودي _${columna}_*`)
fila = null, columna = null, sopaNube = null, sopaWORD = null, sopaDir = null, userNum = null, cambioLetra = null
intentos = 0
return
} 
else {
if (intentos === 1) {
fila = null, columna = null, sopaNube = null, sopaWORD = null, sopaDir = null, userNum = null, cambioLetra = null
intentos = 0
await m.reply(`🫡 *لقد نفدت محاولاتك !! الكلمة _"${sopaWORD}"_ كانت تقع في الاتجاه _${cambioLetra}_ افي_${fila}_ Aعمودي_${columna}_*`)
return  
} 
else {
intentos -= 1
await m.reply(`😮‍💨 *خطأ. لديك _${intentos}_ محاولات متبقية!!*${intentos === 1 ? '' : `\n*الكلمة التي تبحث عنها هي:* \`\`\`${sopaWORD}\`\`\``}\n\n${intentos === 1 ? `💡مساعدة: *الكلمة _${sopaWORD}_ تقع في الاتجاه _"${cambioLetra}"_*\n\n` : ''}${sopaNube}`)
return
}}}
  //
}

handler.command = /^(hr|sopa|soup|wordsearch|wordfind|hrira|soba|sWORDS|hrx)$/i
export default handler
