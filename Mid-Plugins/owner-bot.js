import { spawn } from 'child_process';
import fs from 'fs';
import syntaxError from 'syntax-error';
const _fs = fs.promises;
let cities = {"1":"الرباط وسلا","2":"الخميسات","3":"تيفلت","4":"الرماني","5":"والماس","6":"بوزنيقة","7":"القنيطرة","8":"سيدي قاسم","9":"سيدي يحيى الغرب","10":"سيدي سليمان","11":"سوق أربعاء الغرب","12":"عرباوة","13":"مولاي بوسلهام","15":"الدار البيضاء","16":"المحمدية","17":"بن سليمان","18":"سطات","19":"الكارة","20":"البروج","21":"ابن أحمد","22":"برشيد","23":"الجديدة","24":"أزمور","25":"سيدي بنور","26":"خميس الزمامرة","28":"بني ملال","29":"خنيفرة","30":"مولاي بوعزة","31":"زاوية أحنصال","32":"أزيلال","33":"الفقيه بنصالح","34":"دمنات","35":"القصيبة","36":"قصبة تادلة","37":"خريبكة","38":"وادي زم","40":"مراكش","41":"قلعة السراغنة","42":"الصويرة","43":"شيشاوة","44":"بنجرير","45":"الرحامنة","46":"تمنار","47":"آسفي","48":"الوليدية","49":"اليوسفية","50":"تسلطانت","51":"تامصلوحت","52":"قطارة","54":"كلميم","55":"أسا","56":"الزاك","57":"طانطان","58":"سيدي إفني","60":"طنجة","61":"تطوان","62":"العرائش","63":"أصيلة","64":"شفشاون","65":"مرتيل","66":"المضيق","67":"القصر الكبير","68":"القصر الصغير","69":"الحسيمة","70":"سبتة","71":"الفنيدق","72":"الجبهة","73":"واد لاو","74":"باب برد","75":"وزان","76":"بوسكور","78":"وجدة","79":"بركان","80":"فكيك","81":"بوعرفة","82":"كرسيف","83":"جرادة","84":"عين الشعير","85":"تاوريرت","86":"الناظور","87":"مليلية","88":"دبدو","89":"سلوان","90":"بني أنصار","91":"فرخانة","92":"تالسينت","93":"تندرارة","94":"العيون الشرقية","95":"بني ادرار","96":"السعيدية","97":"رأس الماء","98":"تافوغالت","99":"فزوان","100":"أحفير","101":"زايو","102":"دريوش","103":"بني تجيت","104":"بوعنان","106":"فاس","107":"صفرو","108":"مولاي يعقوب","109":"بولمان","110":"ميسور","111":"رباط الخير","112":"المنزل بني يازغة","113":"إموزار كندر","114":"تازة","115":"تاونات","116":"أكنول","117":"تيزي وسلي","118":"بورد","119":"تاهلة","120":"تيسة","121":"قرية با محمد","122":"كتامة","123":"واد أمليل","124":"مكناس","125":"يفرن","126":"الحاجب","127":"زرهون","128":"آزرو","130":"الرشيدية","131":"الريصاني","132":"أرفود","133":"تنديت","134":"كلميمة","135":"إملشيل","136":"تنجداد","137":"الريش","138":"ميدلت","139":"زاكورة","140":"ورزازات","141":"تنغير","142":"هسكورة","143":"قلعة مكونة","144":"أكدز","145":"بومالن دادس","146":"النيف","147":"أسول","148":"أمسمرير","149":"تازارين","151":"أكادير","152":"تارودانت","153":"تزنيت","154":"إغرم","155":"تالوين","156":"تافراوت","157":"طاطا","158":"أقا","159":"فم لحصن","160":"بويكرة","161":"أولاد تايمة","163":"العيون","164":"بوجدور","165":"طرفاية","166":"السمارة","168":"الداخلة","169":"أوسرد","170":"بويزكارن","171":"بوكراع","172":"تفاريتي","173":"المحبس","174":"الكويرة"};

let midsoune = async (m, { usedPrefix, args, isOwner, command, __dirname }) => {
  let text, filename;
  if(m.quoted) {
    text = m.quoted.text;
    filename = args[0]} else {
    text = args.slice(1).join(' ');
    filename = args[0];
  }
    let path1 = `Mid-Plugins/${args[0]}.js`;
    let path2 = args[0];
  try {
    if (command === 'write') {
      if (!isOwner) return;
        if (!m.quoted && !text) {
            throw 'TAG';
        }
        await fs.promises.writeFile(path1, text);
        m.reply(`تم إنشاء الملف في Home/${path1}`);
    }
    else if (command === 'read'){
  if (!isOwner) return;
      let file;
      try {
        file = fs.readFileSync(path1, 'utf-8');
      } catch (err) {
        try {
          file = fs.readFileSync(path2, 'utf-8');
        } catch (err) {
        }
      }
      if(file) await m.reply(file)
    }
    else if(command === 'delete') {
      if (!isOwner) return;
     await fs.unlinkSync(path1)
      m.reply(`تم حذف الملف Home/${path1}`)
  }
    else if(command === 'rename') {
     if (!isOwner) return;
      let npath = path1.replace(path1, `Mid-Plugins/${args[1]}.js`)
    await fs.renameSync(path1, npath)
      m.reply(`تم تسمية الملف في Home/${path1} من قبل ${path1} إلى ${npath}`)
  }
    else if(command === 'update') {
  if (!isOwner) return;
    await fs.appendFileSync(path2, text)
      m.reply(`تم إضافة النص إلى الملف Home/${path1}`)
  }
    else if (command === 'down'){
      if (!isOwner) return;
     let file = filname; 
    let filePath;
    let mimeType;
    let fileName;

    if (fs.existsSync(file) && path.extname(file) === '.js') {
        filePath = file;
        mimeType = 'text/javascript';
    } else if (fs.existsSync(file) && path.extname(file) === '.json') {
        filePath = file;
        mimeType = 'application/json';
    } else {
        console.error('No valid file found with .js or .json extension.');
        return;
    }
        let filef = fs.readFileSync(filePath);
       await conn.sendFile(m.chat, filef, fileName, null, null, true, { mimetype: mimeType });
  }
     else if (command === 'npm' || command === 'unpm'){
      if (!isOwner) return;
        if (!text) m.reply(`
      ✳️ طريقة الإستخدام : ${usedPrefix + command} <إسم المكتبة>

      📌 مثال:
           ${usedPrefix}npm axios
           ${usedPrefix}unpm axios
      `).trim()
      let cmd;
    if (command === 'npm') {
      cmd = 'npm install ' + filename.toLowerCase() + ' --save';
    }
    else if (command === 'unpm') {
      cmd = 'npm uninstall ' + filename.toLowerCase();
    }
    let npmProcess = spawn(cmd, { shell: true });
    npmProcess.stdout.on('data', (data) => {
     m.reply(`stdout: ${data}`, null); 
    });
    npmProcess.stderr.on('data', (data) => {
    });
    npmProcess.on('close', (code) => {
      if (code === 0) {
        m.react(done);
      } else {
        m.react(error);
      }
    })}
    else if (command === 'tcid') {
          const user = global.db.data.users[m.sender];
          user.trid = filename;
          m.react('✅');
        }
    else if (command === 'bingid') {
        const user = global.db.data.users[m.sender];
        if (!args[0]) {
            m.reply(user.bingimage);
            return;
        }
        else {
        user.bingimage = filename;
        m.react('✅');
      }}
    else if (command === 'note') {
        const user = global.db.data.users[m.sender];
        if (!args[0]) {
            m.reply(user.note);
            return;
        }
        else {
        user.note = filename;
        m.react('✅');
      }}
    else if (command === 'exp') {
          let user1;
          if (m.quoted) {
            user1 = m.quoted.sender;
          } else {
            user1 = m.sender;
          }

          const user = global.db.data.users[user1];
        if (!args[0]) {
            if (!user.exp) {
  user.exp = 15;
} else {
  user.exp = user.exp + 15;
}
      m.reply(user.exp.toString(), null);
              return;
          }
          else {
          user.exp += filename;
          m.react('✅');
        }}
    else if (command === 'getf') {
      if (!isOwner) return;
      if (!filename) m.reply(`✳️ طريقة الإستخدام : ${usedPrefix + command} <إسم الملف>\n\n📌\nمثال:\n${usedPrefix}getf main.js`).trim()
        let file, ff;
        const pathFile = filename;
      if (filename.endsWith('.json')) {
         ff = await Buffer.from(fs.readFileSync('./'+ pathFile, 'utf8'));
          let jsonData = JSON.parse(ff);
          file = JSON.stringify(jsonData, null, 2);
      } else {
        ff = await _fs.readFile(pathFile, 'utf8')
        file = ff.trim();
      }
        m.reply(file)
    }
    else if (command === 'getp') {
     if (!isOwner) return;
        if (!filename) m.reply(`✳️ طريقة الإستخدام : ${usedPrefix + command} <إسم الملف>

      📌 مثال:
           ${usedPrefix}getp owner-info / .js 
      `).trim()
      filename = filename + (/\.js$/i.test(text) ? '' : '.js')
      const pathFile = `Mid-Plugins/${filename}`
      const file = await _fs.readFile(pathFile, 'utf8')
      m.reply(file)
      }
    else if (command === 'path') {
      if (!isOwner) return;
        if (!filename) m.reply(`✳️ طريقة الإستخدام : ${usedPrefix + command} <إسم الملف>

      📌 مثال:
           ${usedPrefix}path lib
      `).trim()
        const files = await _fs.readdir('./'+filename)
        const fileList = files.map(file => '📁 ' + file).join('\n')
        await m.reply(`
🗃️ MidSoune/${filename}

${fileList}`.trim())
    }
    else if (command === 'dallow'){
  try {
    let newUser;
    if (m.quoted) {
      newUser = m.quoted.sender;
    } else if (args) {
      newUser = args[0];
    } else {
      newUser = m.sender;
    }
    if (!newUser) {
      return m.reply('⚠️ معرف المستخدم غير صالح.');
    }
    let User = newUser.split('@')[0];
    let allowedUsers = global.db.data.settings[conn.user.jid].allowed || [];

    if (allowedUsers.includes(User)) {
      global.db.data.settings[conn.user.jid].allowed = allowedUsers.filter(user => user !== User);
      m.react('✅');
    } else {
      m.react('❌');
    }
  } catch (error) {
    console.error('Error in handler:', error);
    m.reply('حدث خطأ: ' + error.message);
  }
} else if(command === 'allows'){
 let allowedUsers = global.db.data.settings[conn.user.jid].allowed || [];
 let userList = '📜 قائمة المستخدمين المسموح لهم:\n\n';
      allowedUsers.forEach((user, index) => {
        userList += `${index + 1}. @${user}\n`;
      });
  m.reply(userList, null, { mentions: allowedUsers.map(user => user + '@s.whatsapp.net') });
}
      else if(command === 'jsjs'){
 let allowedUsers = global.db.data.settings[conn.user.jid].tjss || [];
 let userList = '📜 قائمة الأرقام \n\n';
      allowedUsers.forEach((user, index) => {
        userList += `${index + 1}. @${user}\n`;
      });
  m.reply(userList, null, { mentions: allowedUsers.map(user => user + '@s.whatsapp.net') });
}
else if (command === 'allow'){
  try {
    let newUser;
    if (m.quoted) {
      newUser = m.quoted.sender;
    } else if (args) {
      newUser = args[0];
    } else {
      newUser = m.sender;
    }
    if (!newUser) {
      return m.reply('⚠️ معرف المستخدم غير صالح.');
    }
    let User = newUser.split('@')[0];
    let allowedUsers = global.db.data.settings[conn.user.jid].allowed || [];
    if (!allowedUsers.includes(User)) {
      global.db.data.settings[conn.user.jid].allowed.push(User);
      m.react('✅');
    } else {
      m.react('❌');
    }
  } catch (error) {
    console.error('Error in handler:', error);
    m.reply('حدث خطأ: ' + error.message);
  }
}
  } catch (e) {
    console.error(e)
  }}
midsoune.command = /^getf|path|allow|jsjs|allows|getp|tcid|exp|npm|dallow|unpm|note|bingid|write|read|rename|down|delete|update$/i
export default midsoune
