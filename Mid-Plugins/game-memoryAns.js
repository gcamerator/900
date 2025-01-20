const { delay } = await import("@whiskeysockets/baileys");

export async function before(m) { 
  this.memorygame = this.memorygame || {};
  let room = Object.values(this.memorygame).find(room => room && room.chat === m.chat && (m.sender === room.memorygame.playerA || m.sender === room.memorygame.playerB));
  let user = global.db.data.users[m.sender];
if(!room) return;
  if (!/^((safi|stop)|(\d{1,2} \d{1,2}))$/i.test(m.text.toLowerCase())) return;

  if (/^(safi|stop)$/i.test(m.text.toLowerCase())) {
    delete this.memorygame[room.id];
    return m.react("✅")
  }
  let parts = m.text.split(" ");
  let num1 = parseInt(parts[0]);
  let num2 = parseInt(parts[1]);
  let mg = room.memorygame;
  let chat = room.chat;

  if (m.chat !== chat || isNaN(num1) || isNaN(num2) || parts.length != 2 || num1 < 1 || num1 > 40 || num2 < 1 || num2 > 40) return;
  let pc1 = num1 - 1;
  let pc2 = num2 - 1;
  let currentPlayer = mg.currentPlayer;

  if (m.sender !== currentPlayer || pc1 == pc2 || pc1 >= mg.cardslength || pc2 >= mg.cardslength || mg.matched.includes(pc1) || mg.matched.includes(pc2))  return;

  if (this.memorygame[room].key) { 
    await conn.sendMessage(m.chat, { delete: this.memorygame[room].key });
  }
  if (this.memorygame[room].keyy) { 
    await conn.sendMessage(m.chat, { delete: this.memorygame[room].keyy });
  }

  let player1 = global.db.data.users[mg.playerA];
  let player2 = global.db.data.users[mg.playerB];

  mg.chooseCard(pc1, pc2);

  if (mg.match) {
    let rc = mg.playerCard1.trim();
    m.react(rc);
    user.memory += 15;
    if (m.sender === mg.playerA) { 
      mg.playerApoints += 2;
    } else if (m.sender === mg.playerB) {
      mg.playerBpoints += 2;
    }
  } else {
    await mg.togglePlayer();
  }

  let ep = mg.emptyboard.join(",").replace(/,/g, "");
  let emptyboard;
  if (mg.cardslength < 20) {
    emptyboard = ep.replace(/(.{16})/g, "$1\n");
  } else {
    emptyboard = ep.replace(/(.{32})/g, "$1\n");
  }

  let str = `‏🤠 @${mg.playerA.split`@`[0]} • *${player1.memory} نقطة*\n‏🤠 @${mg.playerB.split`@`[0]} • *${player2.memory} نقطة*\n\n${emptyboard}\n\n‏🤾🏻 *نوبة:* @${mg.currentPlayer.split("@")[0]}`;
  let winner = await mg.checkForWin();

  const key = await this.reply(chat, str, null, {
    mentions: await this.parseMention(str),
  });
  m.react("5️⃣");
  await delay(850);
     m.react("4️⃣");
     await delay(850);
     m.react("3️⃣");
     await delay(850);
     m.react("2️⃣");
     await delay(850);
     m.react("1️⃣");
     await delay(850);
      m.react("");
  let epp = mg.emptyboard.join(",").replace(/,/g, "");
  let emptyboaard;
  if (mg.cardslength < 20) {
    emptyboaard = epp.replace(/(.{16})/g, "$1\n");
  } else {
    emptyboaard = epp.replace(/(.{32})/g, "$1\n");
  }

  let rt = `🤠 @${mg.playerA.split`@`[0]} • *${player1.memory} نقطة*\n🤠 @${mg.playerB.split`@`[0]} • *${player2.memory} نقطة*\n\n${emptyboaard}\n\n🤾🏻 *نوبة:* @${mg.currentPlayer.split("@")[0]}`;
  const keyy = await this.sendMessage(chat, { text: rt, edit: key.key, mentions: await this.parseMention(rt) });

  if (winner) {
    if (mg.playerApoints < mg.playerBpoints) {
      await this.reply(chat, `🥇 *الفائز هو:* @${mg.playerB.split`@`[0]} • *${player2.memory} نقطة*`, null, { mentions: await this.parseMention(str) });
    } else if (mg.playerBpoints < mg.playerApoints) {
      await this.reply(chat, `🥇 *الفائز هو:* @${mg.playerA.split`@`[0]} • *${player1.memory} نقطة*`, null, { mentions: await this.parseMention(str) });
    } else {
      await this.reply(chat, `@${mg.playerA.split`@`[0]} ━ ◦ ${player1.memory} ◦━ @${mg.playerB.split`@`[0]}`, null, { mentions: await this.parseMention(str) });
    }
    delete room.memorygame;
  }
  console.log('OK')
  this.memorygame[room].key = key;
  this.memorygame[room].keyy = keyy;
  this.room = room;
}
