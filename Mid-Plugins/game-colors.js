let handler = async (m, { conn, mCommand, mText }) => {
  let room;
  if (conn.colorgame) delete conn.colorgame;
  conn.colorgame = conn.colorgame ? conn.colorgame : {};
  let level = mText;
    if (!level || level < 1 || level > 3) return m.reply(`📢 *يجب عليك تحديد مستوى الصعوبة من 1 إلى 3.*\n\n*مثال:*\n*${mCommand} 2*`, null)
  const colorgame = new ColorSortSolver(level);
  let name = global.db.data.users[m.sender].name;
  room = {
      id: "color-" + +new Date(),
      chat: m.chat,
      player: m.sender,
      colorgame: colorgame,
      move: 0,
      max: parseInt(level) + 3,
  };
  const board = room.colorgame.display();
  let str = `◈ *${name}*\n\n${board}\n\n*طريقة اللعبة: أدخل رقمي المكان الذي تريد التحويل منه والمكان الذي تريد التحويل له.*\n\n   *مثال:*\n*2 4*`;
  const key = await conn.sendMessage(m.chat, { text: str });
    conn.colorgame[room.chat] = { key: key, ...room };
};

handler.customPrefix = /^(color|.color|colorgame|.colorgame|colors|.colors)(\s|$)/i;
handler.command = new RegExp();
export default handler;

class Tube {
  constructor(capacity) {
      this.colors = [];
      this.capacity = capacity;
  }

  addColor(color) {
      if (this.colors.length < this.capacity) {
          this.colors.push(color);
          return true;
      }
      return false;
  }
 
  removeColor() {
      if (this.colors.length > 0) {
          return this.colors.pop();
      }
      return null;
  }

  topColor() {
      if (this.colors.length > 0) {
          return this.colors[this.colors.length - 1];
      }
      return null;
  }

  isFull() {
      return this.colors.length === this.capacity;
  }

  isEmpty() {
      return this.colors.length === 0;
  }

  toString() {
      return this.colors.join(', ');
  }
}

class ColorSortSolver {
  constructor(level) {
      this.level = parseInt(level); // تحويل المستوى إلى رقم صحيح
      this.tubeCapacity = this.level + 3;
      this.numTubes = this.level + 4;
      this.tubes = [];
      for (let i = 0; i < this.numTubes; i++) {
          this.tubes.push(new Tube(this.tubeCapacity));
      }
      this.initializeTubes();
  }

  initializeTubes() {
      let colors = [];
      if (this.level === 1) {
          colors = ['🔵', '🔴', '🟢'];
      } else if (this.level === 2) {
          colors = ['🔵', '🔴', '🟢', '🟡'];
      } else if (this.level === 3) {
          colors = ['🔵', '🔴', '🟢', '🟡', '🟤'];
      }

      const numColorsPerTube = this.tubeCapacity - 1;
      const totalColors = (this.numTubes - 1) * numColorsPerTube;
      const shuffledColors = [];

      // ملء الألوان بالتساوي في الأنابيب
      for (let color of colors) {
          for (let i = 0; i < Math.floor(totalColors / colors.length); i++) {
              shuffledColors.push(color);
          }
      }

      // خلط الألوان عشوائياً
      shuffledColors.sort(() => Math.random() - 0.5);

      let colorIndex = 0;
      for (let i = 0; i < this.numTubes - 1; i++) {
          for (let j = 0; j < numColorsPerTube; j++) {
              this.tubes[i].addColor(shuffledColors[colorIndex]);
              colorIndex++;
          }
      }
  }

  moveColor(fromTubeIndex, toTubeIndex) {
      const fromTube = this.tubes[fromTubeIndex];
      const toTube = this.tubes[toTubeIndex];

      if (fromTube.isEmpty()) {
          console.log('أنبوب البداية فارغ.');
          return false;
      } else

      if (toTube.isFull()) {
          console.log('أنبوب النهاية ممتلئ.');
          return false;
      } else {

      toTube.addColor(fromTube.removeColor());
           console.log('نجح التحويل');
      return true;
      }
  }

  isSolved() {
      return this.tubes.every(tube => tube.isEmpty() || (tube.isFull() && new Set(tube.colors).size === 1));
  }

  display() {
      let board = '';
      for (let i = this.tubeCapacity - 1; i >= 0; i--) {
          for (let j = 0; j < this.tubes.length; j++) {
              board += this.tubes[j].colors[i] || '▪️';
              if (j < this.tubes.length - 1) {
                  board += ' *|* ';
              }
          }
          board += '\n';
      }
      for (let i = 1; i <= this.numTubes; i++) {
          board += i + '️⃣';
          if (i < this.numTubes) {
              board += ' *|* ';
          }
      }
      return board;
  }
}
