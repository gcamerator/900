import axios from 'axios';
import * as cheerio from 'cheerio';
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36';
const urlsc = "https://fmmods.com/download-center/mega.php";
const Proxy = (url) => (url ? `https://translate.google.com/translate?sl=en&tl=fr&hl=en&u=${encodeURIComponent(url)}&client=webapp` : '');
const mods = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const list = [];
    const response = await axios.get(Proxy(urlsc), {
      headers: {
        'User-Agent': userAgent,
      },
    });
    const $ = cheerio.load(response.data);
    $('div.su-button-center').each((i, element) => {
      const link = $(element).find("a").attr("href");
      list.push({
        name: link.split('/')[7].replace('.', '_').replace('_apk', '.apk'),
        link: link.replace('https://translate.google.com/website?sl=en&tl=fr&hl=en&client=webapp&u=',''),
      });
    });

    const result = {};
    result.com_whatsapp = list && list[0] ? list[0] : undefined;
    result.com_fmwhatsapp = list && list[1] ? list[1] : undefined;
    result.com_gbwhatsapp = list && list[2] ? list[2] : undefined;
    result.com_yowhatsapp = list && list[3] ? list[3] : undefined;

    return result;
  } catch (error) {
    throw error;
  }
}

const handler = async (m, { conn }) => {
  try {
    const result = await mods();
    let message =  `رد على الرسالة برقم التطبيق (1 2 3 أو 4) لتحميله:\n`;
    Object.keys(result).forEach((app, index) => {
      if (result[app]) {
        message += `*${index + 1}: ${result[app].name}*\n`;
      }
    });
    const { key } = await m.reply(m.chat, message, null);

    if (!conn.fouad) {conn.fouad = {};
    }

    conn.fouad[m.chat] = { list: result, key, timeout: setTimeout(() => { delete conn.fouad[m.chat]; }, 3 * 60 * 1000)};

  } catch (error) {
    m.reply("حدث خطأ: " + error.message);
  }
}

handler.before = async (m, { conn }) => {
  conn.fouad = conn.fouad ? conn.fouad : {};

  if (m.isBaileys || !(m.chat in conn.fouad)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return;

  const { list, key } = conn.fouad[m.chat];
  const index = parseInt(input);
  const selectedNewsIndex = index - 1;
  if (selectedNewsIndex >= 0 && selectedNewsIndex < Object.keys(list).length) {
    const app = Object.keys(list)[selectedNewsIndex];
    const url = list[app].link;
    const name = list[app].name;

    conn.sendFile(m.chat, url, name, ``, null, false, { mimetype: "application/vnd.android.package-archive" })
    clearTimeout(conn.fouad[m.chat].timeout);
    conn.fouad[m.chat].timeout = setTimeout(() => {
      conn.sendMessage(m.chat, { delete: key });
      delete conn.fouad[m.chat];
    }, 3 * 60 * 1000);
  }
}

handler.command = /^(fm|fouad)$/i;
export default handler;
