const generate = (x, y, bombs) => {
  const field = Array.from({ length: x }, () => Array(y).fill(0));

  for (let i = 0; i < bombs; i++) {
    let xBomb, yBomb;
    do {
      xBomb = Math.floor(Math.random() * x);
      yBomb = Math.floor(Math.random() * y);
    } while (field[xBomb][yBomb] === 'x');

    field[xBomb][yBomb] = 'x';
  }

  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      if (field[i][j] !== 'x') {
        for (let k = -1; k <= 1; k++) {
          for (let l = -1; l <= 1; l++) {
            const ni = i + k;
            const nj = j + l;
if (ni >= 0 && ni < x && nj >= 0 && nj < y && field[ni][nj] === 'x') {
              field[i][j]++;
            }
          }
        }
      }
    }
  }
 
  return field;
};

const generateEmpty = (x, y) => Array.from({ length: x }, () => Array(y).fill(0));

const translate = (value) => {
  switch (value) {
      case 9:
        return '🚩';
    case 0:
      return '🟩';
    case 1:
      return '1️⃣';
    case 2:
      return '2️⃣';
    case 3:
      return '3️⃣';
    case 4:
      return '4️⃣';
    case 5:
      return '5️⃣';
    case 6:
      return '6️⃣';
    case 7:
      return '7️⃣';
    case 8:
      return '8️⃣';
    case 'x':
      return '💣';
     case 'b':
     return '💥';
    case 'e':
      return '🆒';
  }
};

const generateString = (map) => {
  const numbers = ['➊', '➋', '➌', '➍', '➎', '➏', '➐', '➑', '➒'];
  let result = '     ';
  for (let i = 0; i < 9; i++) {
    result += `  ${numbers[i]} `;
  }
  result += '\n';

  result += map.map((row, index) => {
    const rowString = row.map(cell => translate(cell)).join('');
    return `${numbers[index]} ${rowString}`;
  }).join('\n');

  return result;
};

const detectZero = (map, x, y) => {
  const queue = [[x, y]];
  const result = [];
  const visited = new Set();

  while (queue.length > 0) {
    const [cx, cy] = queue.shift();
    if (!visited.has(`${cx},${cy}`)) {
      visited.add(`${cx},${cy}`);
      result.push([cx, cy]);

      // Update the map with the "⏹️" symbol
      if (map[cx][cy] === 0) {
        map[cx][cy] = 'e'; // استخدام الرمز 'e' لتمثيل المربعات المفتوحة بدون أرقام

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const ni = cx + i;
            const nj = cy + j;
            if (ni >= 0 && ni < map.length && nj >= 0 && nj < map[0].length) {
              queue.push([ni, nj]);
            }
          }
        }
      }
    }
  }
  return result;
};

const handler = async (m, { conn }) => {
  conn.minesweeper = conn.minesweeper || {};
  const x = 9;
  const y = 9;
  const bombs = 10;
  if (conn.minesweeper[m.chat] && m.text.toLowerCase() != 'bombx') {
    return conn.reply(m.chat, `🕹️ *Minesweeper Game* 🕹️\n*⛔ .bombx* - لحذف اللعبة السابقة`, null);
  }
  else {
    conn.reply(m.chat, `🕹️ *Minesweeper Game* 🕹️\n\n*X Y (فتح رقم)*\n*مثال:*\n*3 5*\n*bombx (لحذف اللعبة)*`, null);
    const map = generate(x, y, bombs);
    const empty = generateEmpty(x, y);
    const { key } = await conn.reply(m.chat, '   🕹️ *Minesweeper Game* 🕹️\n\n' + generateString(empty), null);
    conn.minesweeper[m.chat] = {
      'map': map,
      'current': empty,
      'key': key
    };
  }
  
};
handler.before = async (m, { conn }) => {
  conn.minesweeper = conn.minesweeper ? conn.minesweeper : {};
  let oX, oY, oZ;
  if (!conn.minesweeper[m.chat]) return;
  const numbers = m.text.split(' ');
  if (numbers) {
    oX = numbers[0];
    oY = numbers[1];
    oZ = numbers[2];
  }
  
        if (m.text.toLowerCase() === 'bombx') {
    if (conn.minesweeper[m.chat]) {
      delete conn.minesweeper;
      return conn.reply(m.chat, '🏳️ *تم حذف اللعبة.*', null);
    }
    else if (!conn.minesweeper[m.chat]) {
        return conn.reply(m.chat, '🚨 *لم تبدأ أي لعبة.*', null);
      }
    }
   else if (numbers.length > 0 && oX < 10 && oY < 10) {
    const g = conn.minesweeper[m.chat];
        if (oZ === 'f') {
      g.current[oX - 1][oY - 1] = 9;
    }
    else {
      const openedCell = g.map[oX - 1][oY - 1];

         if (openedCell != 'x') {
        const zero = detectZero(g.map, oX - 1, oY - 1);
        for (const coords of zero) {
          g.current[coords[0]][coords[1]] = g.map[coords[0]][coords[1]];
        }
      }
    else if (openedCell === 'x') {
      g.current[oX - 1][oY - 1] = 'b';
        const { key: loseKey } = await conn.reply(m.chat, `💥 *BOOM!* 💥\n\n${generateString(g.current)}\n\n*💣 خسرتي 💣*`, null);
        conn.minesweeper[m.chat] = { 'key': loseKey };
        delete conn.minesweeper[m.chat];
        return;
      }
    else {
        g.current[oX - 1][oY - 1] = openedCell;
      }
    }
    await conn.sendMessage(m.chat, { delete: g.key });
g.current = g.current
     console.log(g)
    const { key: newKey } = await conn.reply(m.chat, '   🕹️ *Minesweeper Game* 🕹️\n\n' + generateString(g.current), null);
    conn.minesweeper[m.chat].key = newKey;
    return;
  }
}
handler.customPrefix = /^(minesweeper|bomb|bombs|ms)$/i;
handler.command = new RegExp
export default handler;
