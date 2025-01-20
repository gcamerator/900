let handler = async (m, { conn, mText }) => {
  if(!m.quoted) return conn.reply(m.chat, '👥 *طاغي لي باغي تلعب معاه*', null)
  if(mText && (mText < 2 || mText % 2 !== 0 || mText > 40 )) return conn.reply(m.chat, '🎲 *العدد لي دخلتي غلط، دخل رقم زوجي بين 2 و 40*', null)
  let room;
  if (conn.memorygame) delete conn.memorygame;
  if(!mText) mText = 12;
  conn.memorygame = conn.memorygame ? conn.memorygame : {};
   const memorygame = new MemoryGame(mText);

  room = {
    id: 'mg-' + (+new Date()),
    chat: m.chat,
    memorygame: memorygame
  };
  room.memorygame.currentPlayer = m.quoted.sender;
  room.memorygame.playerA = m.sender;
  room.memorygame.cardslength = mText;
  room.memorygame.playerB = m.quoted.sender;
  room.memorygame.setMemoryGame();
  let men = global.db.data.users[m.quoted.sender].name
  global.db.data.users[m.sender].memory = 0
  global.db.data.users[m.quoted.sender].memory = 0
  let ep = room.memorygame.emptyboard.join(',').replace(/,/g, '');
  let emptyboard;
  if (room.memorygame.cardslength < 20){
   emptyboard = ep.replace(/(.{16})/g, "$1\n");}
  else {
  emptyboard = ep.replace(/(.{32})/g, "$1\n");}

  let strs = [`💭 *لــعـــبـــة الـــــذاكــــرة* 🎮

🎴 🎴 🎴 🎴 🎴 🎴 🎴 🎴
🎴 🎴 🎴 🎴 🎴 🎴 🎴 🎴
🎴 🎴 🎴 🎴 🎴 🎴 🎴 🎴
🎴 🎴 🎴 🎴 🎴 🎴 🎴 🎴

📝 *ختار جوج أرقام من لفوق، مثلا 4 7*\n\n🤾🏻 *نوبة: ${men}*`,`💭 *لــعـــبـــة الـــــذاكــــرة* 🎮

${emptyboard}
📝 *ختار جوج أرقام من لفوق، مثلا 4 7*\n\n🤾🏻 *نوبة: ${men}*`];
  let editedMessage = '';


  let pingMsg = await conn.sendMessage(m.chat, {text: ''})
  for (let i = 0; i < strs.length; i++) {
    editedMessage = strs[i];
   await conn.relayMessage(m.chat, {
      protocolMessage: {
        key: pingMsg.key,
        type: 14,
        editedMessage: {
          conversation: editedMessage
        }
      }
    },{});

  await new Promise(resolve => setTimeout(resolve, 3000));
  conn.memorygame[room] = { key: pingMsg, ...room };
  }
};

handler.customPrefix = /^(mg|memorygame|memory)(\s|$)/i;
handler.command = new RegExp;
export default handler;

function MemoryGame(cl) {
  this.cards = [];
  this.emptyboard = [];
  this.matched = [];
  this.match = false;
  this.cardslength = cl;
  this.playerCard1 = '';
  this.playerCard2 = '';
  this.playerApoints = 0;
  this.playerBpoints = 0;
}

MemoryGame.prototype.checkForWin = function() {
  return (this.playerApoints + this.playerBpoints >= this.cardslength);
}

MemoryGame.prototype.chooseCard = function(firstCard, secondCard) {
  let card1 = this.cards[firstCard];
  let card2 = this.cards[secondCard];

  this.playerCard1 = card1;
  this.playerCard2 = card2;

  this.emptyboard[firstCard] = card1;
  this.emptyboard[secondCard] = card2;

  if (card1 === card2) {
    this.matched.push(firstCard);
    this.matched.push(secondCard);
    this.match = true;
  } else {
    this.match = false;
    setTimeout(() => {
      let hiddencards = [' ① ', ' ② ', ' ③ ', ' ④ ', ' ⑤ ', ' ⑥ ', ' ⑦ ', ' ⑧ ', ' ⑨ ', ' ⑩ ', ' ⑪ ', ' ⑫ ', ' ⑬ ', ' ⑭ ', ' ⑮ ', ' ⑯ ', ' ⑰ ', ' ⑱ ', ' ⑲ ', ' ⑳ ', ' ㉑ ', ' ㉒ ', ' ㉓ ', ' ㉔ ', ' ㉕ ', ' ㉖ ', ' ㉗ ', ' ㉘ ', ' ㉙ ', ' ㉚ ', ' ㉛ ', ' ㉜ ', ' ㉝ ', ' ㉞ ', ' ㉟ ', ' ㊱ ', ' ㊲ ', ' ㊳ ', ' ㊴ ', ' ㊵ '];
      this.emptyboard[firstCard] = hiddencards[firstCard];
      this.emptyboard[secondCard] = hiddencards[secondCard];
    }, 1000);
  }
}

MemoryGame.prototype.togglePlayer = function() {
  this.currentPlayer = (this.currentPlayer === this.playerA) ? this.playerB : this.playerA;
}

MemoryGame.prototype.shuffle = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

MemoryGame.prototype.setMemoryGame = function() {
  this.emptyboard = Array.from({ length: this.cardslength }, () => '⁣⁣⁣');
  this.cards = [' 🥑 ', ' 🥑 ', ' 🍊 ', ' 🍊 ', ' 🍒 ', ' 🍒 ', ' 🥕 ', ' 🥕 ', ' 🍅 ', ' 🍅 ', ' 🍉 ', ' 🍉 ', ' 🍆 ', ' 🍆 ', ' 🌶️ ', ' 🌶️ ', ' 🍇 ', ' 🍇 ', ' 🍋 ', ' 🍋 ', ' 🍓 ', ' 🍓 ', ' 🍏 ', ' 🍏 ', ' 🥥 ', ' 🥥 ', ' 🍑 ', ' 🍑 ', ' 🥝 ', ' 🥝 ', ' 🍐 ', ' 🍐 ', ' 🍎 ', ' 🍎 ', ' 🍌 ', ' 🍌 ', ' 🥭 ', ' 🥭 ', ' 🧄 ', ' 🧄 '];

  let hiddencards = [' ① ', ' ② ', ' ③ ', ' ④ ', ' ⑤ ', ' ⑥ ', ' ⑦ ', ' ⑧ ', ' ⑨ ', ' ⑩ ', ' ⑪ ', ' ⑫ ', ' ⑬ ', ' ⑭ ', ' ⑮ ', ' ⑯ ', ' ⑰ ', ' ⑱ ', ' ⑲ ', ' ⑳ ', ' ㉑ ', ' ㉒ ', ' ㉓ ', ' ㉔ ', ' ㉕ ', ' ㉖ ', ' ㉗ ', ' ㉘ ', ' ㉙ ', ' ㉚ ', ' ㉛ ', ' ㉜ ', ' ㉝ ', ' ㉞ ', ' ㉟ ', ' ㊱ ', ' ㊲ ', ' ㊳ ', ' ㊴ ', ' ㊵ '];
  this.emptyboard.forEach((_, index) => {
    this.emptyboard[index] = hiddencards[index % hiddencards.length];
  });

  this.cards = this.shuffle(this.cards.slice(0, this.cardslength));
}
