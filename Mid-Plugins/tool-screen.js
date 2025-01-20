import axios from "axios";
import fetch from "node-fetch";
import uploadImage from "../lib/uploadImage.js";
let handler = async (m, { text, usedPrefix, args, command}) => {
    if(!text) return;
    let LinkReg = /https?:\/\//.test(text) ? text : "https://" + text;
    if (!LinkReg) return m.reply("يرجى إدخال رابط صحيح");
    if(command === 'screen' || command === 'ssweb'){
    if(!args[1]) args[1] = 'desktop'
    try {
        let st = await ssweb(LinkReg, "full", args[1]);
        let res = await uploadImage(st);
        await conn.sendFile(m.chat, res, "", `*الطلب:* ${text}`, m);
    } catch (e) {
        throw e;}
} else if (command === 'ssphone') {
var phone = await sswebb(text, 'phone')
await conn.sendFile(m.chat, phone.result, '',res, null, false)
}
if (command === 'sstab') {
var tablet = await sswebb(text, 'tablet')
await conn.sendFile(m.chat, tablet.result, '',res, null, false)
}
if (command === 'sspc') {
var desktop = await sswebb(text, 'desktop')
await conn.sendFile(m.chat, desktop.result, '',res, null, false)
} else {
   let img = await fetch('https://image.thum.io/get/width/1200/'+ text)
    let res = await img.buffer()
    await conn.sendFile(m.chat, res, 'image.jpg', '', m)
    }
}
handler.command = /^ssweb|ssweb2|screen2|screen|sspc|sstab|ssphone$/i;
export default handler;

async function sswebb(url, device){
     return new Promise((resolve, reject) => {
          const base = 'https://www.screenshotmachine.com'
          const param = {
            url: url,
            device: device,
            cacheLimit: 0
          }
          axios({url: base + '/capture.php',
               method: 'POST',
               data: new URLSearchParams(Object.entries(param)),
               headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
               }
          }).then((data) => {
               const cookies = data.headers['set-cookie']
               if (data.data.status == 'success') {
                    axios.get(base + '/' + data.data.link, {
                         headers: {
                              'cookie': cookies.join('')
                         },
                         responseType: 'arraybuffer'
                    }).then(({ data }) => {
                       let result = {
                            result: data
                        }
                         resolve(result)
                    })
               } else {
                    reject({ status: 404, author: '♥', message: data.data })
               }
          }).catch(reject)
     })
}
async function ssweb(url = "", full = false, type = "desktop") {
    type = type.toLowerCase();
    if (!["desktop", "tablet", "phone"].includes(type)) type = "desktop";
    let form = new URLSearchParams();
    form.append("url", url);
    form.append("device", type);
    if (!!full) form.append("full", "on");
    form.append("cacheLimit", 0);
    let res = await axios({
        url: "https://www.screenshotmachine.com/capture.php",
        method: "post",
        data: form
    });
    let cookies = res.headers["set-cookie"];
    let buffer = await axios({
        url: "https://www.screenshotmachine.com/" + res.data.link,
        headers: {
            "cookie": cookies.join("")
        },
        responseType: "arraybuffer"
    });
    return Buffer.from(buffer.data);
}



// import fetch from 'node-fetch' 
// import axios from "axios"
// const handler = async (m, {conn, text, args, usedPrefix, isPrems}) => {   
// if (!args[0]) return conn.reply(m.chat, '*Por favor ingresa una url de la página a la que se le tomará captura 🔎*', m)  
// let user = global.db.data.users[m.sender]
// try{
//      await conn.sendMessage(m.chat, { image: { url: `https://image.thum.io/get/fullpage/${args[0]}` }, caption: `Tu imagen 📷` }, { quoted: m })
// }
// catch{
// try {
// let krt = await ssweb(args[0])
// await conn.sendMessage(m.chat, { image: { url: krt.result }, caption: `Tu imagen 📷` }, { quoted: m }) 
// //}
// } catch { 
// m.reply("Error.")
// }}}
// handler.command = /^ss(web)?f?$/i  
// export default handler

// async function ssweb(url, device = 'desktop') {
//      return new Promise((resolve, reject) => {
//           const base = 'https://www.screenshotmachine.com'
//           const param = {
//             url: url,
//             device: device,
//             cacheLimit: 0
//           }
//           axios({url: base + '/capture.php',
//                method: 'POST',
//                data: new URLSearchParams(Object.entries(param)),
//                headers: {
//                     'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
//                }
//           }).then((data) => {
//                const cookies = data.headers['set-cookie']
//                if (data.data.status == 'success') {
//                     axios.get(base + '/' + data.data.link, {
//                          headers: {
//                               'cookie': cookies.join('')
//                          },
//                          responseType: 'arraybuffer'
//                     }).then(({ data }) => {
//                         result = {
//                             status: 200,
//                             result: data
//                         }
//                          resolve(result)
//                     })
//                } else {
//                     reject({ status: 404, statuses: `Link Error`, message: data.data })
//                }
//           }).catch(reject)
//      })
// }
