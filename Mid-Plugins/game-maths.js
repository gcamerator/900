let handler = async (m, { conn, mText }) => {
  if (!m.quoted) return conn.reply(m.chat, '👥 *طاغي لي باغي تلعب معاه*', null);
  delete conn.mathGame;
  let mt = parseInt(mText);
  if (!conn.mathGame) conn.mathGame = {};
  let sname = global.db.data.users[m.sender].name
  let qname = global.db.data.users[m.quoted.sender].name

  let room = {
    id: 'math-' + (+new Date()),
    chat: m.chat,
    nameA: sname,
    nameB: qname,
    mathGame: new MathGame(mt || 3)
  };
  room.mathGame.playerA = m.sender;
  room.mathGame.difficulty = mt || 3;
  room.mathGame.playerB = m.quoted.sender;

  let calc = room.mathGame.generateCalculation(room.mathGame.difficulty);

  let str = `🔢 *𝙼𝙰𝚃𝙷 𝙶𝙰𝙼𝙴 لعبة الرياضيات* 🔢\n\n【 *${room.nameA}* ✘ *${room.nameB}* 】\n\n🧮 ${calc} *= ???*\n\n⏰ *الوقت: ${room.mathGame.timeLimit.toString().slice(0, 2)} ثانية*`
  let pingMsg = await conn.sendMessage(m.chat, { text: str });

  conn.mathGame[m.chat] = { key: pingMsg, ...room };
};

handler.customPrefix =  /^(الماط|gamemath|maths)(\s|$)/i;
handler.command = new RegExp;
export default handler;

function MathGame(difficulty) {
  this.difficulty = difficulty;
  this.playerA = null;
  this.playerB = null;
  this.Apoints = 0;
  this.emoA = null;
  this.emoB = null;
  this.Bpoints = 0;
  this.Question = null;
  this.Answer = 0;
  this.timeLimit = 0;
  this.timeOut = false;
  this.winner = false;
}

MathGame.prototype.generateCalculation = function(difficulty, conn, id) {
  let settings = {
    1: [-10, 10, -10, 10, '×÷+-', 10000],
    2: [-40, 50, -10, 50, '×÷+-', 20000],
    3: [-99, 200, -20, 200, '×÷+-', 30000],
    4: [-99, 2000, -50, 500, '×÷+-', 45000],
    5: [-99, 5000, -99, 2000, '×÷+-', 60000]
  };
  let second;
  let [min1, max1, min2, max2, ops, timeLimit] = settings[difficulty];
  this.timeLimit = timeLimit;

  let num1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
  let num2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
  let operator = ops[Math.floor(Math.random() * ops.length)];

  if (operator === '×') {
    num1 = Math.floor(Math.random() * 3 * this.difficulty) + 1; 
    num2 = Math.floor(Math.random() * 3 * this.difficulty) + 1;
  } else if (operator === '+') {
    num1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
    num2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
  } else if (operator === '÷') {
    let max = 10;
    let min = 5;
     num2 = Math.floor(Math.random() * max) + 3 + this.difficulty;
     second = Math.floor(Math.random() * min) + 3 + this.difficulty;
    num1 = num2 * second;
  } else {
    num1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
    num2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
  }
  this.Question = `*${num1} ${operator} ${num2}*`;
   switch (operator) {
    case '+': 
      this.Answer = num1 + num2;
      break;
    case '-':
      this.Answer = num1 - num2;
      break;
    case '×':
      this.Answer = num1 * num2;
      break;
    case '÷':
      this.Answer = num1 / num2;
      break;
  }
   this.Question = `*${num1} ${operator} ${num2}*`;
  setTimeout(() => {
      return this.timeOut = true;
  }, this.timeLimit);

  return this.Question;
};



MathGame.prototype.checkAnswer = function(answer) {
  return parseFloat(answer) === this.Answer;
};
MathGame.prototype.checkForWin = function() {
  if (this.Apoints >= 100 || this.Bpoints >= 100) return this.winner = true;
};
MathGame.prototype.updatePoints = function(player, points) {
  if (player === this.playerA) {
    this.Apoints += points;
  } else if (player === this.playerB) {
    this.Bpoints += points;
  }
  if (this.Apoints > this.Bpoints) {
    this.emoA = '😃'; this.emoB = '☹️';
  } else if (this.Bpoints > this.Apoints) {
      this.emoA = '☹️'; this.emoB = '😃';
  } else {
      this.emoA = this.emoB = '🙂';
  }
};
