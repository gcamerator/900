let midsoune = async (m, { args, command }) => {
  if (!args || args.length < 2) throw `*أدخل رقم البداية والنهاية*\n\n*مثلاً:*\n\n*.${command} 0 25*`;
  let minNumber = parseInt(args[0]);
  let maxNumber = parseInt(args[1]);
  if (isNaN(minNumber) || isNaN(maxNumber)) throw '*الرجاء إدخال أرقام صحيحة*';
  let randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  m.reply('*رقمك العشوائي هو:* ' + randomNumber.toString());
};
midsoune.command = /^number|rannum|ranum$/i;
export default midsoune;
