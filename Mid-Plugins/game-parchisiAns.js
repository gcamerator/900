const { delay } = await import("@whiskeysockets/baileys");

export async function before(m) {
    this.parchisigame = this.parchisigame ? this.parchisigame : {};
    let room = Object.values(this.parchisigame).find(
        (room) => room && room.id.startsWith("pr") && room.chat === m.chat,
    );
    if (!room) return;
    if (/^(safi|stop)$/i.test(m.text.toLowerCase())) {
        await conn.sendMessage(m.chat, {
            delete: this.parchisigame[m.chat].key,
        });
        delete conn.parchisigame;
        m.react(done);
        return;
    }
console.log(room.parchisigame)
    let chat = room.chat;
    let currColor = room.parchisigame.currColor;
    let playerA = room.parchisigame.playerA;
    let playerB = room.parchisigame.playerB;
    let currentPlayer = room.parchisigame.currentPlayer;
    if (m.sender !== currentPlayer || m.text != "🎲") return;

    if (this.parchisigame[m.chat].key) {
        await conn.sendMessage(m.chat, {
            delete: this.parchisigame[m.chat].key,
        });
    }
    let emojis = ["⏸️", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];
  let images = [
      '',
    'https://i.ibb.co/7VsLMqj/dado1.webp',
    'https://i.ibb.co/KLZHqgD/dado2.webp',
    'https://i.ibb.co/Ltnnmjb/dado3.webp',
    'https://i.ibb.co/y6rSMpY/dado4.webp',
    'https://i.ibb.co/vDK2D59/dado5.webp',
    'https://i.ibb.co/JcMhXW5/dado6.webp'
  ];
    for (let i = 0; i < 6; i++) {
        let randomIndex = Math.floor(Math.random() * emojis.length);
        let randomEmoji = emojis[randomIndex];

        setTimeout(async () => {
            await m.react(randomEmoji);
        }, 500 * i);
    }
    await delay(2800);

  let randomNumber = Math.floor(Math.random() * 6) + 1;
  let randomImg = images[randomNumber];
    if(room.sticker && randomImg){
  await conn.sendFile(m.chat, randomImg, 'dice.webp', '', m, { asSticker: true });}
   await m.react(emojis[randomNumber]);
    await room.parchisigame.setPiece(randomNumber + 1);
    await room.parchisigame.togglePlayer();

    let cc, cp;
    if (m.sender === room.parchisigame.playerA) {
        cp = playerB;
        cc = room.parchisigame.playerYellow;
    } else if (m.sender === playerB) {
        cp = playerA;
        cc = room.parchisigame.playerGreen;
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

    let str = `${currColor} @${currentPlayer.split("@")[0]} = ${emojis[randomNumber]}\n
${road}

> 🤾🏻 *نوبة:* @${cp.split("@")[0]} ${cc}`;

    const { key } = await this.reply(chat, str, null, {
        mentions: await this.parseMention(str),
    });

    if (room.parchisigame.win === 1) {
        await this.sendMessage(room.chat, { react: { text: "🤩", key: key } });
        room.parchisigame.win = 0;
    } else if (room.parchisigame.lose === 1) {
        await this.sendMessage(room.chat, { react: { text: "😈", key: key } });
        room.parchisigame.lose = 0;
    }

    this.parchisigame[m.chat].key = key;

    this.room = room;
    await this.room.parchisigame.checkWinner();
    if (this.room.parchisigame.gameOver) {
        let winner = currentPlayer.replace("@s.whatsapp.net", "");
        await this.reply(chat, `🏆 *اللاعب @${winner} هو لي ربح!*`, null, {
            mentions: await this.parseMention(str),
        });
        setTimeout(async () => {
            await conn.sendMessage(m.chat, {
                delete: this.parchisigame[m.chat].key,
            });
            delete this.parchisigame[m.chat];
        }, 5000);
    }
}
