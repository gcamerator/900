const {useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion,  MessageRetryMap, makeCacheableSignalKeyStore, jidNormalizedUser, PHONENUMBER_MCC } = await import('@whiskeysockets/baileys')
import NodeCache from 'node-cache'
import readline from 'readline'
import crypto from 'crypto'
import fs from "fs"
import pino from 'pino';
import * as ws from 'ws';
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js';
if (global.conns instanceof Array) console.log()
else global.conns = []
let handler = async (m, { conn: _conn, args, text, usedPrefix, command }) => {
 let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let authFolderB;
 let midsoune = args[1] ? _conn : await global.conn

async function CredsMidSoune() {
if (text) {
authFolderB = text; } else {    
 authFolderB = `${who.split`@`[0]}`;
}
if (!fs.existsSync("CredsByMidSoune/"+ authFolderB)){
 fs.mkdirSync("CredsByMidSoune/"+ authFolderB, { recursive: true }); }
args[1] ? fs.writeFileSync("CredsByMidSoune/" + authFolderB + "/creds.json", JSON.stringify(JSON.parse(Buffer.from(args[1]).toString("utf-8")), null, '\n')) : ""
const {state, saveState, saveCreds} = await useMultiFileAuthState(`CredsByMidSoune/${authFolderB}`)
const msgRetryCounterMap = (MessageRetryMap) => { };
const msgRetryCounterCache = new NodeCache()
const {version} = await fetchLatestBaileysVersion();
let phoneNumber = authFolderB;
const methodCode = !!phoneNumber || process.argv.includes("code")
const MethodMobile = process.argv.includes("mobile")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))
const connectionOptions = {
logger: pino({ level: 'silent' }),
printQRInTerminal: false,
mobile: MethodMobile, 
browser: [ "Ubuntu", "Chrome", "20.0.04" ], 
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })), },
markOnlineOnConnect: true, 
generateHighQualityLinkPreview: true, 
getMessage: async (clave) => {
let jid = jidNormalizedUser(clave.remoteJid)
let msg = await store.loadMessage(jid, clave.id)
return msg?.message || ""
},
msgRetryCounterCache,
msgRetryCounterMap,
defaultQueryTimeoutMs: undefined,   
version }
let conn = makeWASocket(connectionOptions)
if (methodCode && !conn.authState.creds.registered) {
if (!phoneNumber) {
process.exit(0); }
let cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
if (!Object.keys(PHONENUMBER_MCC).some(v => cleanedNumber.startsWith(v))) {
process.exit(0); }
setTimeout(async () => {
let pairingCode = await conn.requestPairingCode(cleanedNumber);
pairingCode = pairingCode?.match(/.{1,4}/g)?.join("-") || pairingCode;
midsoune.sendMessage(m.chat, {text : `*${pairingCode}*`}, { quoted: null })
rl.close(); }, 3000); }

conn.isInit = false
let isInit = true
async function connectionUpdate(update) {
const { connection, lastDisconnect, isNewLogin, qr } = update
if (isNewLogin) conn.isInit = true
const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
let i = global.conns.indexOf(conn)
if (i < 0) return console.log(await creloadHandler(true).catch(console.error))
delete global.conns[i]
global.conns.splice(i, 1)
if (code !== DisconnectReason.connectionClosed){ 
midsoune.sendMessage(conn.user.jid, {text : ''}, { quoted: null }) 
} else {
midsoune.sendMessage(m.chat, {text : '✅ *Connexion Closed*'}, { quoted: null })
} }
if (global.db.data == null) loadDatabase()
if (connection == 'open') {
conn.isInit = true
global.conns.push(conn)
await sleep(8000)
if (args[1]) return
await midsoune.sendMessage(conn.user.jid, {text : '✅ *Connected*'}, { quoted: null })

await sleep(3000)
  let ff = await Buffer.from(fs.readFileSync("CredsByMidSoune/" + authFolderB + "/creds.json"), 'utf8');
  await midsoune.sendMessage(conn.user.jid, {text : ff}, { quoted: null })
  await sleep(300)
  await fs.rm("CredsByMidSoune/" + authFolderB, { recursive: true, force: true });
    await midsoune.sendMessage(conn.user.jid, {text : '✅ *File Deleted*'}, { quoted: null })
  conn.ws.close()

} }
setInterval(async () => {
if (!conn.user) {
try { conn.ws.close() } catch { }
conn.ev.removeAllListeners()
let i = global.conns.indexOf(conn)
if (i < 0) return
delete global.conns[i]
global.conns.splice(i, 1)
}}, 60000)
let handler = await import('../handler.js')
let creloadHandler = async function (restatConn) {
try {
const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler
} catch (e) {
console.error(e) }
if (restatConn) {
try { conn.ws.close() } catch { }
conn.ev.removeAllListeners()
conn = makeWASocket(connectionOptions)
isInit = true
}
if (!isInit) {
conn.ev.off('messages.upsert', conn.handler)
conn.ev.off('group-participants.update', conn.participantsUpdate)
conn.ev.off('groups.update', conn.groupsUpdate)
conn.ev.off('message.delete', conn.onDelete)
conn.ev.off('call', conn.onCall)
conn.ev.off('connection.update', conn.connectionUpdate)
conn.ev.off('creds.update', conn.credsUpdate)
}
conn.welcome = global.conn.welcome + ''
conn.bye = global.conn.bye + ''
conn.spromote = global.conn.spromote + ''
conn.sdemote = global.conn.sdemote + ''
conn.handler = handler.handler.bind(conn)
conn.participantsUpdate = handler.participantsUpdate.bind(conn)
conn.groupsUpdate = handler.groupsUpdate.bind(conn)
conn.onDelete = handler.deleteUpdate.bind(conn)
conn.connectionUpdate = connectionUpdate.bind(conn)
conn.credsUpdate = saveCreds.bind(conn, true)
conn.ev.on('messages.upsert', conn.handler)
conn.ev.on('group-participants.update', conn.participantsUpdate)
conn.ev.on('groups.update', conn.groupsUpdate)
conn.ev.on('message.delete', conn.onDelete)
conn.ev.on('connection.update', conn.connectionUpdate)
conn.ev.on('creds.update', conn.credsUpdate)
isInit = false
return true
}
creloadHandler(false)
}
CredsMidSoune()
}
handler.command = ['creds']
handler.private = true
export default handler

function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms)); }
