import fs from 'fs';
import { photofunSearch, photofunEffect, photofunUse, photofunImg, photofunImg2, photofunText } from '../lib/photofunia.js';

let handler = async (m, { conn, text }) => {
  const parts = text.trim().split(" ").map(item => item.trim());

  if (parts.length < 1) {
    conn.reply(m.chat, '📚 مثال على الاستخدام: *photofunia استعلام صفحة جزء*', m);
    return;
  }

  const query = parts[0];
  const part = parseInt(parts[1]) || 0;
  const input = parts[2];

  try {
    const data = await photofunSearch(query);

    if (data && data.length > 0) {
      if (part > 0 && part <= data.length) {
        const result = data[part - 1];
        const message = `
📜 *العنوان:* ${result.judul}
💬 *التعليقات:* ${result.desc}`;

        const effect = await photofunEffect(result.link);

        if (effect[0].inputs[0].input == 'image') {
          if (input) {
          if (effect[0].inputs.length == 2) {
            const buffer = await(await conn.getFile(input.split(" ")[0])).data;
            const buffer2 = await(await conn.getFile(input.split(" ")[1])).data;
            const imagePath = './tmp/image.jpg';
            const imagePath2 = './tmp/image2.jpg';
            fs.writeFileSync(imagePath, buffer);
            fs.writeFileSync(imagePath2, buffer2);
            const output = await photofunImg2(result.link, fs.readFileSync(imagePath), fs.readFileSync(imagePath2));
            await conn.sendFile(m.chat, output.url || result.thumb, '', message, m);
            fs.unlinkSync(imagePath);
            fs.unlinkSync(imagePath2);
            } else if (effect[0].inputs.length == 1) {
            const buffer = await(await conn.getFile(input)).data;
            const imagePath = './tmp/image.jpg';
            fs.writeFileSync(imagePath, buffer);
            const output = await photofunImg(result.link, fs.readFileSync(imagePath));
            await conn.sendFile(m.chat, output.url || result.thumb, '', message, m);
            fs.unlinkSync(imagePath);
            } else {
             await m.reply("هناك خطأ");
            }
          } else {
              await m.reply("قم بإدخال " + effect[0].inputs.length + " روابط صور في النهاية مع فاصل المسافة.");
            }
        } else if (effect[0].inputs[0].input == 'text') {
          if (input) {
            const output = await photofunText(result.link, input.split("-"));
            await conn.sendFile(m.chat, output.url || result.thumb, '', message, m);
          } else {
            await m.reply("أدخل " + effect[0].inputs.length + " نصًا في النهاية مع فاصل الرسالة -.");
            }
        }
      } else if (!part) {
          // عرض قائمة النتائج المتاحة إذا لم يتم تحديد رقم الصفحة
          const listMessage = data.map((post, index) => `*${index + 1}.* ${post.judul}`).join('\n');
          const helpMessage = `\n\n📚 مثال على الاستخدام: *photofunia استعلام|صفحة|جزء*`;
          conn.reply(m.chat, listMessage + helpMessage, m);
        } else {
          // رسالة خطأ إذا كان رقم الصفحة غير صحيح
          conn.reply(m.chat, '❌ رقم الصفحة غير صحيح. يرجى إدخال رقم صفحة صحيح.\n\n📚 مثال على الاستخدام: *photofunia استعلام صفحة جزء*', m);
        }
      } else {
        // رسالة إذا لم يتم العثور على نتائج
        conn.reply(m.chat, '📭 لا توجد نتائج.', m);
      }
  } catch (error) {
    console.error('حدث خطأ:', error);
     conn.reply(m.chat, '❌ حدث خطأ أثناء جلب البيانات. تأكد من صحة تنسيق الإدخال.\n\n📚 مثال على الاستخدام: *photofunia استعلام|صفحة|جزء*', m);
  }
};

handler.help = ['photofunia'].map(v => v + ' query|page|part');
handler.tags = ['internet'];
handler.command = /^(photofunia|pf)$/i;

export default handler;