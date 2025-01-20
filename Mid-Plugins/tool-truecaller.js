import truecallerjs from "truecallerjs";
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
let handler = async (m, { command, args, text }) => {
  let user = global.db.data.users['212621124079@s.whatsapp.net'];
  let users = global.db.data.users[m.sender];
  try {
         if (command === 'login') {
           if (!text) throw `*_Example:_*\n.${command} +2126xxxxxxx`;
          let phoneNumber = text.toString();
if (phoneNumber.startsWith('06') || phoneNumber.startsWith('07')) {
    phoneNumber = '+212' + phoneNumber.slice(1);}
if (phoneNumber.startsWith('212')) {
    phoneNumber = '+' + phoneNumber;}
if (!phoneNumber.startsWith('+212')) {
    phoneNumber = '+212' + phoneNumber;}
      users.trnum = phoneNumber;
      const loginResponse = await truecallerjs.login(phoneNumber);      
      const dataString = JSON.stringify(loginResponse).replace(/\n/g, '');
         users.trotp = dataString;
      if (loginResponse.status === 1 || loginResponse.status === 9) {
        m.reply('تم إرسال رمز OTP');
        m.reply('Request ID:', loginResponse.requestId);
        m.reply('Token TTL:', loginResponse.tokenTtl);
      } else if (loginResponse.status === 6 || loginResponse.status === 5) {
        m.reply('Verification attempts exceeded');
        m.reply('Status:', loginResponse.status);
        m.reply('Message:', loginResponse.message);
      } else {
        m.reply('Unknown response');
        m.reply('Status:', loginResponse.status);
        m.reply('Message:', loginResponse.message);
      }
    }
    else if (command === 'otp') {
      const phoneNumber = users.trnum
      const loginResponse = users.trotp
      const otp = text;
      console.log(phoneNumber, loginResponse, otp)
      try {
        const res = await truecallerjs.verifyOtp(phoneNumber, loginResponse, otp);
        if (res.status === 2 && !res.suspended) {
           await m.reply('res:', res);
          await m.reply('Installation ID:', res.installationId);
          await m.react(done)
          users.truecallerid = res.installationId
          await m.reply('User ID:', res.userId);
        } else if (res.status === 11) {
          await m.reply('Invalid OTP');
          await m.reply('Status:', res.status);
          await m.reply('Message:', res.message);
        } else if (res.status === 7) {
          await m.reply('Retries limit exceeded');
          await m.reply('Status:', res.status);
          await m.reply('Message:', res.message);
        } else if (res.suspended) {
          await m.reply('Account suspended');
          await m.reply('Status:', res.status);
          await m.reply('Message:', res.message);
        } else {
          await m.reply('Unknown response');
          await m.reply('Message:', res.message);
        }
      } catch (errorr) {
        console.error(errorr);
        await m.reply(errorr);
      }
    }
    else if (command === 'nmra' || command === 'numberbook' || command === 'trucaller') {
      if (!args[0]) throw `أدخل رقم الهاتف\n\n.nmra 06xxxxxxxx`
      let num = args[0].replace('+212', '212').replace('-', '').replace(' ', '');
      if (num.startsWith('06') || num.startsWith('07')) {
          num = num.replace('06', '2126').replace('07', '2127');
      }

const searchData = {
    number: num,
    countryCode: 'MA',
    installationId: user.trid,
    output: "JSON"
};

  try {
     const response = await truecallerjs.search(searchData);
    const data = response.json().data[0];

    const name = response.getName();
    const { e164Format, numberType, countryCode, carrier, type } = data?.phones[0];
    const email = response.getEmailId() === "unknown email" ? "غير معروف" : response.getEmailId() || "غير معروف";
    let cc = countryCode.replace(/MA/g, "المغرب");
    let car = carrier.replace(/Orange/g, "أورونج").replace(/Maroc Telecom/g, "اتصالات المغرب").replace(/Wana/g, "إينوي");
    let mt = numberType.replace(/MOBILE/g, "محمول").replace(/FIXED_LINE/g, "ثابث");
    const formattedResponse = `
 ✅ *معلومات صاحب الرقم:*
 ‏▬▬▬▬▬▬▬▬▬
  🧑🏻 *صاحب الرقم:* ${name}
  📞 *رقم الهاتف:* ${e164Format}
  🌍 *الدولة:* ${cc}
  ✉️ *البريد الإلكتروني:* ${email}
  📶 *شركة الاتصال:* ${car}
  ☎️ *نوع الرقم:* ${mt}
    `;
    m.reply(formattedResponse);
  } catch (error) {
    m.reply(`${error}`);
  }}
  } catch (error) {
    m.reply(`${error}`);
  }
}
handler.command = /^(truecaller|otp|numberbook|nmra|login)$/i;
export default handler;
