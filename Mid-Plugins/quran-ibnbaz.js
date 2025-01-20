import fetch from 'node-fetch';
let handler = async (m, { args, command }) => {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Alsarmad/binbaz_database/main/database/books_ar.json');
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
            if (!args[0]) {
                let reply = '📚 *كتب إبن باز:*\n\n';
                data.forEach((section, index) => {
                    reply += `📁 ${index + 1}- ${section.title}\n`;
                });

                let reply2 = `*✅ أدخل الأمر ${command} ورقم القسم لتظهر لك الكتب الخاصة بذلك القسم*\n\n*مثال:*\n_.${command} 1_`;
                m.reply(reply);
                setTimeout(() => {
                    m.reply(reply2);
                }, 1000); 
            } else {
              const sectionIndex = parseInt(args[0]) - 1;
              if (sectionIndex >= 0 && sectionIndex < data.length) {
                  const section = data[sectionIndex];
                  let reply = `*📓 كتب ${section.title}:*\n\n`;
                  section.pdf.forEach((pdf, index) => {
                 const link = pdf.link.replace(/ /g, '%20');
                      reply += `📜 [${index + 1}] ${pdf.name}\n${link}\n\n`;
                     
                  });
               if (data[sectionIndex].pdf.length > 1){
                 m.reply(reply);
                  await m.reply('لتحميل الملف أدخل الأمر:\n\n.pdf (رابط الكتاب)\n*مثال:*\n.pdf https://files.zadapps.info/binbaz.org.sa/la_tofsed_sawm.pdf');} else {
                   await conn.sendFile(m.chat, section.pdf[0].link, `${section.title}`+'.pdf', `${section.title}`, null)
                  }
                } else {
  m.reply('الرقم المدخل غير صالح. الرجاء استخدام رقم من بين الأقسام المعروضة.');
                }
            }
        } else {
            m.reply('لا يمكن العثور على البيانات المطلوبة.');
        }
    } catch (error) {
        console.error(error);
        m.reply('حدث خطأ أثناء جلب البيانات.');
    }
};
handler.command = /^(binbaz)$/i;
export default handler;
