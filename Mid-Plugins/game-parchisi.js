let handler = async (m, { conn,  mTexts }) => {
    let room;
    if (conn.parchisigame) delete conn.parchisigame;
    conn.parchisigame = conn.parchisigame ? conn.parchisigame : {};
    let mA = mTexts[0]
    let mB = mTexts[1]
    let mC = mTexts[2]
    const parchisigame = new Parchisi();
    let smen = global.db.data.users[m.sender].name;
    let qmen = global.db.data.users[m.quoted.sender].name;
    room = {
        sticker: false,
        id: "pr-" + +new Date(),
        chat: m.chat,
        parchisigame: parchisigame,
    };
    room.parchisigame.currentPlayer = m.quoted.sender;
    room.parchisigame.playerYellow = mB || "🟡";
    room.parchisigame.currColor = mB || "🟡";
    room.parchisigame.both = mC || "🔰";
    room.parchisigame.playerA = m.sender;
    room.parchisigame.playerB = m.quoted.sender;
    room.parchisigame.setparchisigame();
if(mA === 's') {room.sticker = true;
room.parchisigame.playerGreen = "🟢";
} else {
room.parchisigame.playerGreen = mA || "🟢";
}
    let road = room.parchisigame.road;
    road = road.map((row) => row.join(" ")).join(" ");
    road =
        road.substring(0, 30) +
        "\n                                                               " +
        road.substring(30, 33) +
        "\n" +
        road.substring(33, 63) +
        "\n" +
        road.substring(63, 66) +
        "\n" +
        road.substring(66, 96) +
        "\n                                                               " +
        road.substring(96, 99) +
        "\n" +
        road.substring(99, 129) +
        "\n" +
        road.substring(129, 132) +
        "\n" +
        road.substring(132);

let bord = `◈ ${room.parchisigame.playerYellow} *${qmen}*
◈ ${room.parchisigame.playerGreen} *${smen}*

${road}

> 🎲 *طريقة اللعب: أول من يصل للنهاية.*

🤾🏻 *نوبة: ${qmen}*`;
    
    const key = await conn.sendMessage(m.chat, { text: bord });
    conn.parchisigame[m.chat] = room;
    conn.parchisigame[m.chat].key = key;
};

handler.customPrefix = /^(parchisi|par|بارشيسي)(\s|$)/i;
handler.command = new RegExp();
export default handler;

function Parchisi() {
    this.lose = 0;
    this.win = 0;
    this.playerGreen = null;
    this.playerYellow = null;
    this.currColor = null;
    this.both = null;
    this.gameOver = false;
    this.road = [];
    this.oldAposition = -1;
    this.oldBposition = -1;
    this.Atry = 0;
    this.Btry = 0;
    this.winner = 0;
}

Parchisi.prototype.togglePlayer = function () {
    this.currColor =
        this.currColor === this.playerGreen
            ? this.playerYellow
            : this.playerGreen;
    this.currentPlayer =
        this.currentPlayer === this.playerA ? this.playerB : this.playerA;
};

Parchisi.prototype.setparchisigame = function () {
    this.road = [];
    let roadString = `🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟩 🟦 🟦 🟦 🟦 🟥 🟦 🟦 🟥 🟦 🟦 🟦 🟦 🟦 🟩 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟥 🟦 🟦 🟩 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🟦 🏆`;
    let positions = roadString.split(" ");

    for (let i = 0; i < positions.length; i++) {
        let rowValues = [positions[i]];
        this.road.push(rowValues);
    }
};
Parchisi.prototype.updatePosition = function(oldAp, oldBp, num, CurrColor, opponentSymbol, playerWin, playerLose) {
    const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54];
    let pp = oldAp + num;
    let newPlace;

    if (pp === 12 || pp === 24 || pp === 36) {
        newPlace = key.indexOf(pp - 5);
        this[playerLose] = 1;
    }
    else if (pp === 17 || pp === 30 || pp === 44) {
        newPlace = key.indexOf(pp + 4);
        this[playerWin] = 1;
    } else {
        newPlace = key.indexOf(pp);
    }

    if (newPlace < 1 && this.Btry != 0 && this.Atry != 0) {
        for (let i = -1; i < key.length; i++) {
            this.road[key[i]] = [CurrColor];
        }
        this.road[54] = ["🏆"];
         this.gameOver = true;
        return;
    }
    else if (newPlace === oldBp) {
        this.road[newPlace] = [this.both];
        this.road[oldAp] = ["🟦"];
    }
    else if (oldAp === oldBp && oldAp != -1) {
        this.road[newPlace] = [CurrColor];
        this.road[oldBp] = [opponentSymbol];
    }  else {
        this.road[newPlace] = [CurrColor];
        this.road[oldAp] = ["🟦"];
    }

    return newPlace;
};

Parchisi.prototype.setPiece = function(num) {
    if (num == 1) return;
    if (this.currColor === this.playerGreen) {
        this.oldAposition = this.updatePosition(this.oldAposition, this.oldBposition, num, this.playerGreen, this.playerYellow, "win", "lose");
        this.Atry += 1;
    } else if (this.currColor === this.playerYellow) {
        this.oldBposition = this.updatePosition(this.oldBposition, this.oldAposition, num, this.playerYellow, this.playerGreen, "win", "lose");
        this.Btry += 1;
    }
};

Parchisi.prototype.checkWinner = function () {
    if (this.oldAposition < 0 && this.Atry != 0) {
        this.gameOver = true;
    } else if (this.oldBposition < 0 && this.Btry != 0) {
        this.gameOver = true;
    }
};
