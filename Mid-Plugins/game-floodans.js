export async function before(m) {
  this.floodgame = this.floodgame ? this.floodgame : {};
  let room = Object.values(conn.floodgame).find(room => 
    room && room.id.startsWith('fl-') && m.sender === room.floodgame.player && room.chat === m.chat
  );
  console.log(room)
    if(!room || !/^([1-5]|safi|stop)$/i.test(m.text.toLowerCase())) return;
  if (/^(safi|stop)$/i.test(m.text.toLowerCase())) {
    delete this.floodgame[room.id];
    delete conn.floodgame[room.id];
    m.react(done);
    return true;
  }
  let number = parseInt(m.text.trim());
        let choices = { 1: "🟥", 2: "🟦", 3: "🟧", 4: "🟨", 5: "🟩" };
        let newColor = choices[number];
        if (newColor) {
          if (conn.floodgame[room.id].key) {
            await conn.sendMessage(m.chat, { delete: this.floodgame[room.id].key });
          }
          await room.floodgame.makeMove(newColor);
          if(room.floodgame.moves > 11) {
            await conn.sendMessage(m.chat, { text: '☹️ *إنتهت اللعبة، حاول مجددا*', mentions: [m.sender] });
 return delete this.floodgame[room.id]}
          let updatedBoard = await room.floodgame.printGrid();
          let updatedStr = 
`◈ ${room.floodgame.playername}

${updatedBoard}
◣━━━━━━━━━━━━━━◢
*1🟥 2🟦 3🟧 4🟨 5🟩*`;
if(room.floodgame.gameOver){updatedStr = updatedStr.replace('*1🟥 2🟦 3🟧 4🟨 5🟩*', '🥳 *إنتهت اللعبة* 🥳\n\n*عدد المحاولات:* ' + room.floodgame.moves );
delete this.floodgame[room.id];}
       let key = await conn.sendMessage(m.chat, { text: updatedStr, mentions: [m.sender] });
  this.floodgame[room.id].key = key;
        }
       }
