import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

let handler = async (m, { conn }) => {
    conn.qisasData = conn.qisasData ? conn.qisasData : {};

    try {
        const response = await fetch('https://raw.githubusercontent.com/midsoune/JSON/main/qisas.json');
        const data = await response.json();

        const formattedList = data.map((item, index) => {
            return `*${index + 1}.* ${item.story}`;
        }).join('\n');

        const messageContent = `📚 *أسماء القصص:*\n--------------\n${formattedList}\n\n📢 *يمكنك الرد برقم القصة لقراءتها.*`;

        const { key } = await m.reply(messageContent);
        conn.qisasData[m.chat] = { list: Object.values(data), key, timeout: setTimeout(() => { conn.sendMessage(m.chat, { delete: key }); delete conn.qisasData[m.chat]; }, 2000 * 600)};
    } catch (error) {
        console.error(error);
        m.reply('حدث خطأ أثناء جلب البيانات.');
    }
};

handler.before = async (m, { conn }) => {
    conn.qisasData = conn.qisasData || {};

    if (m.isBaileys || !(m.chat in conn.qisasData)) return;
    const input = m.text.trim();
    if (!/^\d+$/.test(input)) return;

    const { list, key } = conn.qisasData[m.chat];
    if (!m.quoted || m.quoted.id !== key.id || !m.text) return;
    const index = parseInt(input);

    if (isNaN(index) || index < 1 || index > list.length) {
        m.reply("❌ يرجى الرد برقم القصة من القصص أعلاه.");
    } else {
        const selectedObj = list[index - 1];
        const qsaUrl = selectedObj.link;
        const sqsa = selectedObj.story;

        m.reply(`قمت بإختيار قصة *${sqsa}*`);

        // Fetch and extract the content of the selected story
        const storyContent = await searchQisa(selectedObj.link);

        // Send the extracted content to the user
        conn.sendMessage(m.chat, { text: storyContent, url: qsaUrl }, 'htmlMessage', { quoted: m });
    }
};

handler.command = /^(qisas|story)$/i;

export default handler;
async function searchQisa(link) {
    try {
        let response = await fetch(link);
      const html = await response.text();
        const $ = cheerio.load(html);
      $('script').remove();
      $('style').remove();
        const paragraphs = $('table#AutoNumber1 p');
        const paragraphsText = paragraphs.map((_, p) => $(p).text()).get();

        // Join the paragraphs into a single string
        const extractedContent = paragraphsText.join('\n\n');

        return extractedContent;
    } catch (error) {
        console.log(error);
        return 'حدث خطأ أثناء البحث';
    }
}