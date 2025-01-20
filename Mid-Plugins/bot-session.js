// استيراد المكتبات والوحدات اللازمة
import { Boom } from "@hapi/boom";
  import NodeCache from "node-cache";
import baileys from "@whiskeysockets/baileys";
  import fs from 'fs';
  import pino from "pino";
import Pino from "pino";
import { makeWASocket } from '../lib/simple.js';
const {
  useMultiFileAuthState,
  DisconnectReason, fetchLatestBaileysVersion,
  makeInMemoryStore, MessageRetryMap,
  jidNormalizedUser,
  makeCacheableSignalKeyStore,
  delay,
} = baileys;

const handler = async (m, { conn, args, text, command }) => {
const remove = async () => {
  try {
    if (fs.existsSync(`CredsByMidSoune/${text}`)) {
      await fs.rmdirSync(`CredsByMidSoune/${text}/creds.json`, {
        recursive: true
      });
    }
  } catch {}
};

// رقم الهاتف
const phoneNumber = text;
let dirName = "CredsByMidSoune/" + phoneNumber;

try {
  // حذف المجلد
  remove(dirName);
} catch (et) {
  console.log(et);
}

// إعداد مخزن الحالة
const store = makeInMemoryStore({
  logger: Pino({
    level: "silent"
  }).child({
    level: 'silent'
  })
});

// دالة لبدء التشغيل
async function start() {
  // معالجة الأخطاء غير المُعالجة
  process.on("unhandledRejection", err => console.error(err));

  // استخدام حالة المصادقة
  const { state, saveCreds  } = await useMultiFileAuthState('./' + dirName);

  // مخزن العدد لإعادة المحاولة للرسائل
  const msgRetryCounterCache = new NodeCache();
  const msgRetryCounterMap = (MessageRetryMap) => { };
  const {version} = await fetchLatestBaileysVersion();
  // إنشاء اتصال
  const connectionOptions = {
  logger: pino({ level: 'silent' }),
  printQRInTerminal: false,
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
  store.bind(conn.ev);

  // إذا كان لم يتم تسجيل الهاتف الجوال، يُطلب كود الإقران
  if (true && !conn.authState.creds.registered) {
    setTimeout(async () => {
      let code = await conn.requestPairingCode(phoneNumber);
      code = code?.['match'](/.{1,4}/g)?.["join"]('-') || code;
      await conn.sendMessage(phoneNumber, { text: code });
      console.log("\n\nYour Pairing Code:" + "\t" + code + "\n");
      console.log();
    }, 2000);
  }

  // معالج الأحداث
  conn.ev.on("connection.update", async update => {
    const {
      lastDisconnect,
      connection,
    } = update;

    // إذا كان الاتصال مغلقًا
    if (connection === "close") {
      let reason  = new Boom(lastDisconnect?.["error"])?.["output"]["statusCode"];

      // معالجة الأسباب المختلفة للانقطاع
      if (reason  === DisconnectReason.badSession) {
        console.log("Bad Session File, Please Delete Session and Scan Again");
        process.exit(0);
      } else {
        // اعادة الاتصال في حالات مختلفة
        if (reason  === DisconnectReason.connectionClosed || reason  === DisconnectReason.connectionLost || reason  === DisconnectReason.restartRequired || reason  === DisconnectReason.timedOut) {
          console.log("Connection closed, reconnecting....");
          await start();
        } else if (reason  === DisconnectReason.connectionReplaced) {
          console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
          process.exit(1);
        } else if (reason  === DisconnectReason.loggedOut) {
          console.log("Device Logged Out, Please Scan Again And Run.");
          process.exit(1);
        } else if (reason  === DisconnectReason.multideviceMismatch) {
          console.log("Multi device mismatch, please scan again");
          process.exit(0);
        } else {
          console.log(reason);
          process.exit(0);
        }
      }
    }

    // إذا كان الاتصال مفتوحًا
    if (connection === "open") {
      console.log("Connected");

      // إرسال رسالة وإغلاق البرنامج
      await delay(2000);
      let sesPath = await fs.readFileSync(dirName + "/creds.json");
      c = Buffer.from(sesPath).toString("utf-8");

      await conn.sendMessage(conn.user.id, {text: c });
      try {
        remove(dirName);
      } catch {}
      process.exit(1);
    }
  });

  // معالج حفظ بيانات المصادقة
  conn.ev.on("creds.update", saveCreds);
}

// بدء التشغيل
start();
}
handler.command = ["session"];
export default handler;
