// import fetch from 'node-fetch';
// const handler = async (m, { conn }) => {
//   delete conn.motamadris 
//   conn.motamadris = conn.motamadris || {};
//   conn.motamadris[m.chat] = conn.motamadris[m.chat] || {};
//   let user =  m.sender.split('@')[0]
//   let a = await fetch('https://midsouneapi-fee7b0be8faf.herokuapp.com/api/moutamadris?user=' + user);
//   const res = await a.json();
// let data = res.result
//   const key = await conn.sendMessage(m.chat, { text: data.msg }, { quoted: null });
//   conn.motamadris[m.chat] = { key: key, user: user, chat: m.chat, step: 1 };
// };
// handler.command = /^(moutapi|motapi|متمدرس2)$/i;
// export default handler;

// handler.before = async (m, { conn }) => {
//   conn.motamadris = conn.motamadris || {};
//    let room = Object.values(conn.motamadris).find((room) => room && (m.sender.split('@')[0] || m.sender == room.user) && room.chat === m.chat);
// if(!room) return;
// if (m.isBaileys || (isNaN(m.text) && !/^(safi|stop)$/i.test(m.text.toLowerCase()))) return 
//   if (/^(safi|stop)$/i.test(m.text.toLowerCase())) {
//     delete conn.motamadris[m.chat];
//     return true;
//   }
//   if (room) {
//     let step = room.step;
//     let choice = m.text;
//       if (choice == 0){
//         step = step - 1;
//       } else {step = step};
    
//     if (choice > room.max) return true;
//     let url = `https://midsouneapi-fee7b0be8faf.herokuapp.com/api/moutamadris/choice?num=${choice}&step=${step}&user=` + room.user
//     let res = await fetch(url);
//     const result = await res.json();
//     let key;
//     let data = result.result;
//     if (room.key) {
//       await conn.sendMessage(m.chat, { delete: room.key });
//     }
//     if (data.step == 3 && data.choose == 4) {
//       key = await conn.sendMessage(m.chat, { image: { url: data.lien || 'https://moutamadris.ma/wp-content/uploads/2021/06/mlogo.png' }, caption: data.msg}, { quoted: null });
//     }
//     else {
//     if (data.download){
//       const fileName = data.lien.split('/').pop();
//    await conn.sendFile(m.chat, data.lien, fileName, data.msg, null)
//       conn.motamadris[m.chat] = { ...room, max: data.max, key: key };
//     } 
//     else {
//      key = await conn.sendMessage(m.chat, { text: data.msg }, { quoted: null });
//       conn.motamadris[m.chat] = { ...room, max: data.max, key: key, step: step + 1 };
//     }}
//     if (data.max == 0) {
//     //  delete conn.motamadris[m.chat];
//     //  return true;
//     }

//   }
// };
