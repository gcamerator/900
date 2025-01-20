import axios from "axios"
import { readFileSync } from "fs"

let handler = async (m, { conn, usedPrefix, command, text }) => {

let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || ''
if (!mime) throw 'أرسل الصورة'
if (!text) throw "أدخل معرّف الشعر المطلوب ويجب أن تكون الصورة واضحة\n\nقائمة معرّفات الشعر:\n- fishtail_girl\n- mermaid_girl\n- bluntbangs_girl\n- curtains_girl\n- school_girl\n- straight_girl\n- shorthair_girl\n- shor_man\n- k_man\n- natural_man\n- side_man\n- slicked_man\n- comma_man\n\nمثال: .hairstyle k_man"
let media = await q.download()
const imageBufer = media
const form = new FormData();
const blob = new Blob([imageBufer], { type: "image/jpg" });
form.append("file", blob, "image.jpg");
  const { data } = await axios.request({
    baseURL: "https://api.itsrose.life",
    url: "/image/hair_style",
    method: "POST",
    params: {
      hair_id: text,
      json: true,
      apikey: 'LYXO8zhnUuk1icehXQaI4l6ojZI3TV38ahuwbOwKhd7bAHVI1fV1K43DYbNvap1S',
    },
    data: form,
  }).catch((e) => {
    console.error(e);
    return {}; // إعادة كائن فارغ في حالة حدوث خطأ
  });

  if (data) {
    const { status, message } = data;

    if (!status) {
      console.error(message);
      return; // التعامل مع خطأ آخر
    }

    const { result } = data;
    console.log(result);
    const buffer = Buffer.from(result.base64Image, 'base64');
    await conn.sendFile(m.chat, buffer, 'conco.jpg', '', m);
  } else {
    console.error('No valid data received from the server.');
  }
}
handler.command = /^(hair)$/i
export default handler
