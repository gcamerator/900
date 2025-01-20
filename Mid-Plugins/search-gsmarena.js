import gsmarena from 'gsmarena-api';
import {translate} from '@vitalets/google-translate-api';
let handler = async (m, { command, args, text }) => {
  try {
         if (command === 'gsmbrands') {
      const brands = await gsmarena.catalog.getBrands();
      const formattedBrands = brands.map(brand => `${brand.name} (${brand.devices})`);
      m.reply(`*لائحة شركات الهواتف:*\n\n★ ${formattedBrands.join('\n')}`);
    }
    else if (command === 'gsmdevices') {
             try {
               const brandName = text.split(' ')[1];
               const brand = await gsmarena.catalog.getBrand(brandName);
               if (!brand || brand.length === 0) {
                 m.reply('No devices found for this brand.');
                 return;
               }
               let response = 'Devices for ' + brand[0].name + ':';
               for (const device of brand) {
                 response += '\n\n';
                 response += 'الهاتف: ' + device.name + '\n';
                 response += 'الوصف: ' + device.description;
               }
               m.reply(response);
             } catch (error) {
               console.error(error);
               m.reply('An error occurred while fetching device information.');
             }
           }
    else if (command === 'gsmr') {
        const query = text.split('%20');
        const devices = await gsmarena.search.search(query);
      console.log(devices);
        if (devices.length === 0) {
          m.reply('لا توجد نتائج للهات الذي تبحث عنه');
          return;
        }
        // بناء الرد بناءً على البيانات المسترجعة
      let response = '*نتائج البحث:*';

      for (let index = 0; index < devices.length; index++) {
        const device = devices[index];
        response += `\n\n*[${index + 1}] ${device.name}*\n ${device.description}`;
      }
      m.reply(response);
      }
    else if (command === 'gsm') {
          const query = text.split('%20');
          const searchResults = await gsmarena.search.search(query);
         console.log(searchResults)
          if (searchResults.length === 0) {
            m.reply('لا توجد نتائج للهاتف الذي تبحث عنه، حاول كتابته بطريقة صحيحة');
          }
        const firstDevice = searchResults[0];
          const device = await gsmarena.catalog.getDevice(firstDevice.id);

          // استخراج المعلومات التي تريد عرضها
          let detailSpec = device.detailSpec;

          // بناء السلسلة لعرض معلومات جميع الفئات
          let deviceInfoStr = `*مواصفات هاتف ${device.name}:*`;
          const customCategoryNames = {
              'Network': 'الشبكة والإتصال',
            'Launch': 'موعد الإصدار',
              'Body': 'الشكل والجسم',
            'Display': 'الشاشة',
            'Platform': 'النظام',
            'Memory': 'الذاكرة',
            'Main camera': 'الكاميرا الرئيسية',
            'Main Camera': 'الكاميرا الرئيسية',
            'Selfie Camera': 'كاميرا السيلفي',
            'Selfie camera': 'كاميرا السيلفي',
            'Sound': 'الصوت',
            'Comms': 'الاتصالات',
            'Features': 'المستشعرات',
            'Battery': 'البطارية',
            'Misc': 'أخرى',
            'Tests': 'الاختبارات',
              // يمكنك إضافة مزيد من الفئات الأخرى هنا
          };

          let textToSend = '';

          for (let category of detailSpec) {
              // التحقق إذا كانت الفئة موجودة في الكائن المخصص
              if (customCategoryNames[category.category]) {
                  textToSend += `\n\n✩ *${customCategoryNames[category.category]}:*\n`;
              } else {
                textToSend += `\n\n✩ *${category.category}:*\n`;
            }
            
            for (let spec of category.specifications) {
          //    spec.name = spec.name.replace(/Announced/g, 'تاريخ الإعلان').replace(/Status/g, 'الحالة').replace(/Weight/g, 'الوزن').replace(/Dimensions/g, 'الأبعاد').replace(/SIM/g, 'الشريحة').replace(/Build/g, 'الجسم').replace(/Bands/g, 'ترددات').replace(/Technology/g, 'تيكنولوجيا الإتصال').replace(/Speed/g, 'السرعة').replace(/Type/g, 'النوع').replace(/Size/g, 'الحجم').replace(/Resolution/g, 'الدقة').replace(/Protection/g, 'الحماية').replace(/Battery life/g, 'مدة البطارية');

              textToSend += `\n• *${spec.name}:* ${spec.value}`;
            }
        }
        let cap = `${deviceInfoStr}\n\n${textToSend}`;
          let image = device.img 
        await conn.sendFile(m.chat, image || logo, "", cap, m);
      }
    else if (command === 'gsmarena'){
      m.reply('*طريقة الإستعمال:*\n\n.gsmbrands (لعرض الماركات) \n.gsmr (للبحث عن الهواتف)\n.gsm (مواصفات هاتف)\n');
    }
  } catch (error) {
    m.reply(`خطأ: ${error}`);
  }
}
handler.command = /^(gsm|gsmarena|gsmdevices|gsmbrands|gsmr)$/i;
handler.premium = false;
export default handler;
