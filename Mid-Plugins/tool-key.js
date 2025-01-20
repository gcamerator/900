async function twe(frfrf, geger, hytht) {
  let gt = await frfrf.sendMessage(geger, { text: ' ...MidSoune... ' });
  for (let i = 0; i < hytht.length; i++) {const hhtft = hytht.slice(0, i + 1);
    await frfrf.relayMessage(geger, {protocolMessage: {key: gt.key, type: 14, editedMessage: {conversation: hhtft}}},{});
    await new Promise(resolve => setTimeout(resolve, 150))}}
let btata = async (m, { conn }) => {
  let hhk, trtr;

  if(!m.text[1]) return m.reply('فاتي - فاطومة - نور  - امونة - سوم - انا')
   hhk = m.text.split(" ")[1];
   trtr = m.text.split(" ").slice(2).join(" ");
let num = {
  'فاطومة': '212623538210',
  'نور': '212717457920',
  'سوم': '212607407062',
  'فاتي': '212707904850',
  'امونة': '212691913870',
  'انا': '212621124079',
  'جوم': '212625694838',
};

let hhhk = num[hhk] || '212' + hhk;
  let rty = hhhk + '@s.whatsapp.net';
  if (!trtr && m.quoted && m.quoted.text) {trtr = m.quoted.text}
    conn.sendPresenceUpdate('composing', rty);
    await twe(conn, rty, trtr)}; 
btata.customPrefix = /^(key|كي)(\s|$)/i;
btata.command = new RegExp;
export default btata; 
