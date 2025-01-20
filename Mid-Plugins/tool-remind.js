import moment from "moment-timezone";

let handler = async (m, { conn, command, isOwner, args }) => {
  const dates = new Date();
  let days = moment(dates).add(1, "hours").format("YYYY-MM-DD");
  let hours = moment(dates).add(1, "hours").format("HH:mm");

  if (!global.db.data.settings[conn.user.jid].reminders)  global.db.data.settings[conn.user.jid].reminders = [];
  let reminders = global.db.data.settings[conn.user.jid].reminders;

  if (command === "remind") {
    if (!args || args.length < 2) return m.reply(`*يجب عليك تحديد إسم الحدث والتاريخ.*\n\n‏*مثال: (24 ساعة القادمة)*\n*.remind Smiya ${hours}*\n\n‏*مثال: (بعد X من الأيام)*\n*.remind +X Smiya ${hours}*`);
    let user = m.sender.split("@")[0];
    let id = user.slice(7, 10), event;
    let first = args[0].replace("+", "");
    let time = args[args.length - 1];
    if (args[0].startsWith("+") && !isNaN(first) && first.length == 1) {
      days = moment(days).add(first, "day").format("YYYY-MM-DD");
      event = args.slice(1, -1).join(" ");
    } else {
      days = days;
      event = args.slice(0, -1).join(" ");
    }
    let remind = {user: m.chat,  id: id, event: event, date: days + " " + time };
    reminders.push(remind);
    const now = moment().tz("Africa/Casablanca").add(1, 'hours');
    const eventDate = moment(remind.date, "YYYY-MM-DD HH:mm").tz("Africa/Casablanca");
    m.react('⏰')
    const duration = moment.duration(eventDate.diff(now));
    const d = `${duration.days()} يوم, ${duration.hours()} ساعة, ${duration.minutes()} دقيقة`;
    m.reply(`📅 *تم إضافة التذكير:*\n\n📋 *إسم الحدث: ${remind.event}*\n ⏰ *التوقيت: ${args[args.length - 1]}*\n ⏳ *متبقي: ${d}*\n\n*يمكنك إلغاء التذكير باستخدام الأمر:*\n‎*.remindr ${remind.id}*`    );
    }
  else if (command === "reminds") {
    if (!isOwner) return;
    if (reminders.length === 0) return m.reply("📅 لا توجد تذكيرات حالية.");

    let reminderList = reminders.map((reminder, index) =>
          `[${index + 1}]. ${reminder.id}: ${reminder.event} - ${reminder.date}`).join("\n");
    m.reply(`📅 *التذكيرات الحالية:*\n\n${reminderList}`);
  }
  else if (command === "remindr") {
    if (args.length < 1 || isNaN(args[0])) return m.reply("*يجب عليك تحديد رقم التذكير الذي تريد إزالته.*\n\n*مثال:*\n .remindr 123");
    let id = args[0];
    let userr = reminders.findIndex((reminder) => reminder.user === m.sender);
    let reminderIndex = reminders.findIndex((reminder) => reminder.id === id);
    if (reminderIndex === -1)  return m.reply("❗ *تذكير غير موجود.*");
    if (userr === -1)  return m.reply("❗ *لست صاحب هدا التذكير.*");
    reminders.splice(reminderIndex, 1);
    m.reply(`❌ *تم إزالة التذكير.*`);
  }
};

handler.command = ["remind", "reminds", "remindr"];
export default handler;
