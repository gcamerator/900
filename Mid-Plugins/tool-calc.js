import {translate} from "@vitalets/google-translate-api";
let handler = async (m, { conn, text, command }) => {
   let id = m.chat;
   if (command === "mat") {
    try {
      let gpt = await fetch(
        global.API(`https://api.bk9.site/ai/mathssolve?q=${text}`),
      );
      let res = await gpt.json();
      const trt = await translate(res.BK9, { to: "ar" });
      await m.reply(trt.text);
    } catch {
      m.reply(`❎ Error`);
    }
  } else {     
    conn.math = conn.math ? conn.math : {};
    if (id in conn.math) {
      clearTimeout(conn.math[id][3]);
      delete conn.math[id];
      m.reply("*😨 عملية حسابية ملغاة!*");
    }

    let val = text
      .replace(/[^0-9\-\/+*×÷πEe()piPI/]/g, "")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/π|pi/gi, "Math.PI")
      .replace(/e/gi, "Math.E")
      .replace(/\/+/g, "/")
      .replace(/\++/g, "+")
      .replace(/-+/g, "-");

    let format = val
      .replace(/Math\.PI/g, "π")
      .replace(/Math\.E/g, "e")
      .replace(/\//g, "÷")
      .replace(/\*×/g, "×");

    try {
      console.log(val);
      let result = new Function("return " + val)();

      if (!result) throw result;

      m.reply(`*${format}* = _${result}_`);
    } catch (e) {
      if (e == undefined) throw `$التعبير الرياضي غير صحيح`;
      throw `حدثت مشكلة في حساب النتيجة، تأكد من وجود أعداد وعمليات صحيحة`;
    }
  }
};
handler.command = /^(calc|hsb|حسب|mat|wbi)$/i;
export default handler;
