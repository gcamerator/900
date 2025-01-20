import axios from 'axios';

let handler = async (m, { conn, args, text, command }) => {
    let hizb = parseInt(args[0]);
    if (isNaN(hizb) || hizb <= 0 || hizb > 60) {
        throw 'الرجاء إدخال رقم صحيح للحزب.';
    }
    let a, z;
    if (hizb === 1) {
        a = 1;
        z = 11;
    } else {
        a = (hizb - 1) * 10 + 2;
        z = (hizb * 10) + 1;
    }

    for (let i = a; i <= z; i++) {
        try {
            const response = await axios.get(`https://raw.githubusercontent.com/Mohamed-Nagdy/Quran-App-Data/main/quran_images_new_2/${i}.png`, { responseType: 'arraybuffer' });
            if (response.status === 200) {
                await conn.sendFile(m.chat, response.data, 'image.png', '');
            } else {
                console.error(`فشل جلب الصورة ${i}:`, response.statusText);
            }
        } catch (error) {
            console.error(`فشل جلب الصورة ${i}:`, error);
        }
    }
}

handler.command = /^(hizb|حزب)$/i;
export default handler;
// https://raw.githubusercontent.com/Mohamed-Nagdy/Quran-App-Data/main/quran_images/100.png
// https://raw.githubusercontent.com/Mohamed-Nagdy/Quran-App-Data/main/quran_images_new/image_Page100.png
// https://raw.githubusercontent.com/Mohamed-Nagdy/Quran-App-Data/main/quran_images_new_2/11.png`
