let handler = async (m, { conn }) => {
  let images = [
    'https://i.ibb.co/7VsLMqj/dado1.webp',
    'https://i.ibb.co/KLZHqgD/dado2.webp',
    'https://i.ibb.co/Ltnnmjb/dado3.webp',
    'https://i.ibb.co/y6rSMpY/dado4.webp',
    'https://i.ibb.co/vDK2D59/dado5.webp',
    'https://i.ibb.co/JcMhXW5/dado6.webp'
  ];
  let randomImg = images[Math.floor(Math.random() * images.length)];
  conn.sendFile(m.chat, randomImg, 'dice.webp', '', m, { asSticker: true });
}

handler.command = ['dado', 'رقم', 'dice'];
export default handler;
