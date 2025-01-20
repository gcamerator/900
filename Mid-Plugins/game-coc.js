import axios from "axios";

let handler = async (m, { command, conn, text, args }) => {
let users = global.db.data.users['212621124079@s.whatsapp.net'];
let key = users.cockey
let user = global.db.data.users[m.sender];
let id;

if (command === 'coc'){
if (args[0] === 'me' || args[0] === 'hamid') {
    id = '#2PPUVLPCJ';
} else if (args[0] === 'mazen') {
    id = '#U8POVLQQ';
} else if (args[0] === 'safah') {
    id = '#RU228RJ2';
} else if (args[0]) {
    id = args[0];
} else {
    id = user.cocid;
}
if(!args[0] && !user.cocid) throw '*أدخل الأي دي بعد الأمر على شكل*\n\n.${command} #PGxxxx';
if (!id.startsWith('#')) {id = `#${id}`}
let url = `https://api.clashofclans.com/v1/players/${encodeURIComponent(id)}`;
const headers = {
    hostname: '54.75.227.164',
    port: 80,
    Accept: 'application/json',
    Authorization: `Bearer ${key}`
};

  try {
const res = await axios.get(url, { headers: headers });
const data = res.data;
let tag = data.tag.replace('#', '');
let ctag = data.clan.tag.replace('#', '');
let img = data.clan.badgeUrls.medium
let str = '⚔️ *معلومات اللاعب في كلاش أوف كلانس* ⚔️\n'
 str += `
◎ *الإسم:* ${data.name}
◎ *الأي دي:* ${tag}
◎ *المستوى:* ${data.expLevel}
◎ *مستوى التاون:* ${data.townHallLevel}
◎ *مستوى سلاح التاون:* ${data.townHallWeaponLevel || ""}
◎ *أعلى كؤوس:* ${data.trophies}
◎ *عدد الكؤوس:* ${data.bestTrophies}
◎ *نجوم الحرب:* ${data.warStars}
◎ *الدور في الكلان:* ${data.role.replace('coLeader', 'قائد مساعد').replace('admin', 'عضو مميز').replace('leader', 'قائد مساعد').replace('member', 'عضو')}
◎ *المشاركة في الحرب:* ${data.warPreference.replace('in', 'نعم ').replace('out', 'ليش ما تشارك يا نوب')}
◎ *القرية الليلية:* ${data.builderHallLevel}
◎ *الكؤوس الليلية:* ${data.builderBaseTrophies}
◎ *أعلى كؤوس ليلية:* ${data.bestBuilderBaseTrophies}
◎ *الدعم الحالي:* ${data.donations}
◎ *الدعم المتلقي:* ${data.donationsReceived}
◎ *الدعم الإجمالي:* ${data.achievements[14].value}
◎ *المساهمة في عاصمة القبيلة:* ${data.clanCapitalContributions}

🎪 *الكلان:* 🎪
◎ *إسم الكلان:* ${data.clan.name}
◎ *مستوى الكلان:* ${data.clan.clanLevel}
◎ *أي دي الكلان:* ${ctag}

◎ *دوري المدينة:* ${data.league.name}
◎ *دوري البناء:* ${data.builderBaseLeague.name}

👑 *مستوى الملوك:* 👑\n`
data.heroes.forEach(hero => {
    let her = hero.name.replace('Barbarian King', 'الملك').replace('Archer Queen', 'الملكة').replace('Grand Warden', 'الآمر').replace('Royal Champion', 'البطلة').replace('Battle Machine', 'آلة المعركة').replace('Battle Copter', 'المروحية');
    str += `◎ *${her}:* ${hero.level}/${hero.maxLevel}\n`;
});
    str += '\n🏞 *قوات القرية الأساسية*\n';
data.troops.forEach(troop => {
    if (troop.village === "home") {  
        str += `◎ *${troop.name}:* ${troop.level}/${troop.maxLevel}\n`;
    }
});

str += '\n🎑 *قوات القرية الليلية*\n';
data.troops.forEach(troop => {
    if (troop.village === "builderBase") {
        str += `◎ *${troop.name}:* ${troop.level}/${troop.maxLevel}\n`;
    }
});
   str += '\n🦦 *أدوات الأبطال*\n';
data.heroEquipment.forEach(he => {
      str += `◎ *${he.name}:* ${he.level}/${he.maxLevel}\n`
    });
       str += '\n🍯 *التعويذات*\n';
    data.spells.forEach(spell => {  
      str += `◎ *${spell.name}:* ${spell.level}/${spell.maxLevel}\n`;
    });
   await conn.sendMessage(m.chat, {image: {url: img}, caption: str, mentions: [m.sender]}, {quoted: null});
      } catch (e) {
          console.log(e);
          await m.reply(e.response.data.message);
    }} else if (command === 'cockey'){
    user.cockey = args[0]
    m.react(done)
  } else if (command === 'cocid'){
    user.cocid = args[0]
    m.react(done)
  }
}
  handler.command = /^(coc|cocid|cockey)$/i;
  export default handler;
