import { ImageProcessor } from '../lib/bing-image.js';
const convert = new ImageProcessor();
let handler = async (m, { command, usedPrefix, conn, args, text }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime || !/image\/(png|jpe?g)/.test(mime)) throw 'No valid image found';

    if (!text) {
        return m.reply(`
- 1. autoColorContrast
- 2. autoColorImage
- 3. compressImage
- 4. convertImage
- 5. createQr
- 6. distortionImage
- 7. enlargeImage
- 8. fairyTaleEffect
- 9. frameBlurImage
- 10. frameImage
- 11. ocrImage
- 12. replaceBackground
- 13. resizeImage
- 14. retouchPhoto
- 15. scanQr
- 16. textOnImage
- 17. tiltImage
- 18. whirlpoolEffect`);
    }

    try {
        let [order, order1, order2] = text.includes(' ') ? text.split(' ') : [text];

        if (!order) throw new Error(`ℹ️ .${command} 1\nℹ️ .${command} 1 2\nℹ️ .${command} 1 2 3`);

        const numericOrder = parseInt(order);

        if (isNaN(numericOrder) || numericOrder <= 0 || numericOrder > 18) throw new Error("ℹ️ دخل رقم بين 1 و 18.");

        m.react(rwait);

        let output;
        let media = await q.download();
        if (numericOrder === 1) output = await convert.autoColorContrast(media);
        else if (numericOrder === 2) output = await convert.autoColorImage(media);
        else if (numericOrder === 3) output = await convert.compressImage(media);
        else if (numericOrder === 4) output = await convert.convertImage(media, order1 || null, order2 || null);
        else if (numericOrder === 5) output = await convert.createQr(media);
        else if (numericOrder === 6) output = await convert.distortionImage(media, order1 || null);
        else if (numericOrder === 7) output = await convert.enlargeImage(media);
        else if (numericOrder === 8) output = await convert.fairyTaleEffect(media);
        else if (numericOrder === 9) output = await convert.frameBlurImage(media, order1 || null);
        else if (numericOrder === 10) output = await convert.frameImage(media, order1 || null);
        else if (numericOrder === 11) output = await convert.ocrImage(media);
        else if (numericOrder === 12) output = await convert.replaceBackground(media, order1 || null);
        else if (numericOrder === 13) output = await convert.resizeImage(media, order1 || null, order2 || null);
        else if (numericOrder === 14) output = await convert.retouchPhoto(media);
        else if (numericOrder === 15) output = await convert.scanQr(media);
        else if (numericOrder === 16) output = await convert.textOnImage(media, order1 || null);
        else if (numericOrder === 17) output = await convert.tiltImage(media);
        else if (numericOrder === 18) output = await convert.whirlpoolEffect(media);
        output && output.url && output.url.length > 0
  ? await conn.sendFile(m.chat, output.url[0], '', '', m)
  : output && output.text
  ? await conn.reply(m.chat, output.text, m)
  : null;
    } catch (error) {
        m.reply(`${error.message}`);
    }
};

handler.help = ["imgonline type"];
handler.tags = ["tools"];
handler.command = /^(imgonline|imgo)$/i;

export default handler;
