import { cpus as _cpus, totalmem, freemem} from 'os'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'
import { join } from 'path'
import { promises } from 'fs'
import moment from 'moment-timezone'
const more = String.fromCharCode(8206)
let format = sizeFormatter({
 std: 'JEDEC', // 'SI' (default) | 'IEC' | 'JEDEC'
 decimalPlaces: 2,
 keepTrailingZeroes: false,
 render: (literal, symbol) => `${literal} ${symbol}B`,
})
let handler = async (m, { conn, command, __dirname}) => {
 if(command === 'mchat'){
  let chat = m.chat.split('@')[0];
  let chats = m.chat;
await m.reply(chat)
 await m.reply(chats)
  return true;
 }
 let date = moment.tz('Africa/Casablanca').format("dddd, Do MMMM, YYYY")
 let time = moment.tz('Africa/Casablanca').format('HH:mm:ss')
 let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
 let _uptime = process.uptime() * 1000
 let uptime = clockString(_uptime)
 let totalreg = Object.keys(global.db.data.users).length
 const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
 const groupsIn = chats.filter(([id]) => id.endsWith('@g.us')) //groups.filter(v => !v.read_only)
 const used = process.memoryUsage()
  console.log(used)
 const cpus = _cpus().map(cpu => {
  cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
  return cpu
 })
 const cpu = cpus.reduce((last, cpu, _, {
  length
 }) => {
  last.total += cpu.total
  last.speed += cpu.speed / length
  last.times.user += cpu.times.user
  last.times.nice += cpu.times.nice
  last.times.sys += cpu.times.sys
  last.times.idle += cpu.times.idle
  last.times.irq += cpu.times.irq
  return last
 }, {
  speed: 0,
  total: 0,
  times: {
 user: 0,
 nice: 0,
 sys: 0,
 idle: 0,
 irq: 0
  }
 })
 let old = performance.now()
 let neww = performance.now()
 let speed = neww - old
 let capti = `🤖 ɴᴀᴍᴇ: ${_package.name}
🧩 ᴠᴇʀsɪᴏɴ: ${_package.version}
🗃️ ᴘʟᴀᴛғᴏʀᴍ: ${_package.description}

⏳ ᴜᴩᴛɪᴍᴇ: *${uptime}*

📈 ᴅᴀᴛᴀʙᴀsᴇ: ${totalreg}

📅 ᴅᴀᴛᴇ: ${date}
⌚ ᴛɪᴍᴇ: ${time} ﹙ɢᴍᴛ +1﹚

💻 sᴇʀᴠᴇʀ ɪɴғᴏ :
⮕ ᴩɪɴɢ: ${speed} ᴍs
⮕ ʀᴀᴍ: ${format(totalmem() - freemem())} / ${format(totalmem())}

💬 ᴡʜᴀᴛsᴀᴩᴩ sᴛᴀᴛᴜs :
⮕ ${groupsIn.length} - Group Chats
⮕ ${groupsIn.length} - Groups Joined
⮕ ${groupsIn.length - groupsIn.length} - Groups Left
⮕ ${chats.length - groupsIn.length} - Personal Chats
⮕ ${chats.length} - Total Chats
`.trim()

 await m.reply(capti)

}
handler.command = /^(bot(info)?|infobot|mchat)$/i

export default handler

function clockString(ms) {
 let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
 let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
 let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
 let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
 return [d, 'D ', h, 'H ', m, 'M ', s, 'S'].map(v => v.toString().padStart(2, 0)).join('')
}
