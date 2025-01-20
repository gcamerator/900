export async function before(m) {
  this.colorgame = this.colorgame ? this.colorgame : {};
  let room = Object.values(this.colorgame).find((room) => room && room.chat === m.chat && room.player === m.sender);
   if (!room) return;

  if (/^(safi|stop)$/i.test(m.text.toLowerCase())) {
    delete this.colorgame[room.id];
    return m.react("✅");
  }
  let cl = room.colorgame;
  if (isNaN(parseInt(m.text.trim().split(" ")[0])) && isNaN(parseInt(m.text.trim().split(" ")[1]))) return;
  let pc1 = parseInt(m.text.trim().split(" ")[0]) - 1;
  let pc2 = parseInt(m.text.trim().split(" ")[1]) - 1;
   if((!pc2 && pc2 != 0) || m.text.length > 3 || pc1 == -1 || pc2 == -1 || pc1 > room.max || pc2 > room.max) return;
  let move = await cl.moveColor(pc1, pc2);
  if (move) {
    room.move += 1;
    const board = room.colorgame.display();
    let name = global.db.data.users[m.sender].name;
    let str = `◈ *${name} - [${room.move}]*\n\n${board}`;
    if (this.colorgame[room.chat].key) {
      await conn.sendMessage(m.chat, { delete: this.colorgame[room.chat].key });
    }
    const key = await this.sendMessage(m.chat, { text: str });
    this.colorgame[room.chat].key = key;
  } else {
    m.react(error);
  }
  let solved = room.colorgame.isSolved()
if (solved){
   const keyy = await this.sendMessage(m.chat, { text: `*🥳 مبرووك! قمت بحل جميع الألوان بعد [${room.move}] حركات.*` });

  setTimeout(async () => {
    await this.sendMessage(m.chat, { delete: keyy });
    await this.sendMessage(m.chat, { delete: this.colorgame[room.chat].key });
    delete this.colorgame[m.chat];
  }, 9000)
}
}
