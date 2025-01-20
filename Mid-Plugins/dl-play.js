import fetch from 'node-fetch'
import yts from 'yt-search'
const apis = 'https://deliriussapi-oficial.vercel.app'
const handler = async (m, {conn, mCommand, mTexts}) => {
let command = mCommand
const yt_play = await search(mTexts.join(' '))
const texto1 = `★ *${yt_play[0].title}* ★`.trim()
await conn.sendFile(m.chat, yt_play[0].thumbnail, 'error.jpg', texto1, null, null)

if (command == 'play' || command == 'خدم' || command == 'music') {
try {
const res = await fetch(`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${yt_play[0].url}`)
let { result } = await res.json()
await conn.sendMessage(m.chat, { audio: { url: await result.download.url }, mimetype: 'audio/mpeg' }, { quoted: null })
} catch (e) {
try {
let d2 = await fetch(`https://exonity.tech/api/ytdlp?apikey=adminsepuh&url=${yt_play[0].url}`)
let dp = await d2.json()
const audioUrl = dp.result.audio
await conn.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: null }) 
} catch (e) { 
try {
let d3 = await fetch(`https://api.dorratz.com/v2/yt-mp3?url=${yt_play[0].url}`)
await conn.sendMessage(m.chat, { audio: d3, mimetype: 'audio/mp4' }, { quoted: null })   
} catch (e) { 
await m.react('❌')
console.log(e)
}}}}

if (command == 'فيديو' || command == 'video') {
try {  
  let dataa = await fetch(`https://api.dreaded.site/api/alldl?url=${yt_play[0].url}`);
   let data = await dataa.json();

    const fbvid = data.data.videoUrl;
    await conn.sendMessage(m.chat, {video: { url: fbvid }, caption: ``, gifPlayback: false}, { quoted: null });
} catch (e) {
await m.react('')
console.log(e)
}} 

if (command == 'videodoc' || command == 'ytdoc') {

const yt_play = await search(mTexts);

try {
const apiUrl = `${apis}/download/ytmp4?url=${encodeURIComponent(yt_play[0].url)}`;
const apiResponse = await fetch(apiUrl);
const delius = await apiResponse.json();
if (!delius.status) return m.react("😅");
const downloadUrl = delius.data.download.url;
await conn.sendMessage(m.chat, { document: { url: downloadUrl }, fileName: `${yt_play[0].title}.mp4`, caption: ``, thumbnail: yt_play[0].thumbnail, mimetype: 'video/mp4' }, { quoted: null })     
} catch (e1) {
}}
}
  handler.customPrefix = /^(ytdoc|audio|videodoc|music|play|خدم|فيديو)(\s|$)/i;
  handler.command = new RegExp;
  export default handler;

async function search(query, options = {}) {
const search = await yts.search({query, hl: 'ar', gl: 'MA', ...options});
return search.videos;
}
