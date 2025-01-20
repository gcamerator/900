import * as cheerio from 'cheerio';
import fetch from "node-fetch"
import {
    generateWAMessageFromContent
} from "@whiskeysockets/baileys"

let handler = async (m, {
    conn,
    text,
    args,
    usedPrefix,
    command
}) => {
    if (!text) return m.reply("*دخل رابط سناب شات*\n\nمثال: https://t.snapchat.com/2SUKN21")
    // Panggil fungsi getSnapchatVideo dengan URL yang sesuai
    try {
        let res = await getSnapchatVideo(text)
        let snap_caption = `*💌 ألوصف:* ${res.name}

*👤 إسم الحساب:* ${res.creator.alternateName}
*🔗 رابط الحساب:* ${res.creator.url}
`
        let msg = await generateWAMessageFromContent(m.chat, {
            extendedTextMessage: {
                text: snap_caption}
        }, {
            quoted: m
        })
        await conn.relayMessage(m.chat, msg.message, {})
        await conn.sendFile(m.chat, res.contentUrl, res.name, "", m, null, {
            mimetype: res.encodingFormat,
            asVideo: true
        })
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ['cocofun'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^snap(chat|dl)$/i
export default handler

async function getSnapchatVideo(url) {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const scriptElement = $('script[type="application/ld+json"]');
    const scriptContent = scriptElement.html();
    return scriptContent ? JSON.parse(scriptContent) : null;
}