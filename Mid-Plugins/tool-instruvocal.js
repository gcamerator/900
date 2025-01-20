import axios from 'axios';
import FormData from 'form-data';
import qs from 'querystring';

let handler = async (m, { conn}) => {
  let q = m.quoted ? m.quoted : m
  let music = await q.download()
 let res = await hiyd(music)
  if(!res.error) {
   await conn.sendFile(m.chat, res.instrumental_path, 'instrumental.mp3', null, null)
     await conn.sendFile(m.chat, res.vocal_path, 'vocal.mp3', null, null)
  }
}
handler.command = ['instru', 'vocal']
export default handler

async function smiya() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let filename = '';

  for (let i = 0; i < 10; i++) {
    filename += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return filename + '.mp3';
}

async function hiyd(musicc) {
    return new Promise(async (resolve, reject) => {
          const names = await smiya();
          const bodyForm = new FormData()
          bodyForm.append('fileName', musicc, { filename: names, contentType: 'audio/mpeg' })
          axios({
               method: 'post',
               url: 'https://aivocalremover.com/api/v2/FileUpload',
               data: bodyForm,
               headers: {
                    'Content-Type': `multipart/form-data; boundary=${bodyForm._boundary}`
               }
          }).then(({ data }) => {
               axios({
                    method: 'post',
                    url: 'https://aivocalremover.com/api/v2/ProcessFile',
                    data: qs.stringify({
                         file_name: data.file_name,
                         action: 'watermark_video',
                         key: 'X9QXlU9PaCqGWpnP1Q4IzgXoKinMsKvMuMn3RYXnKHFqju8VfScRmLnIGQsJBnbZFdcKyzeCDOcnJ3StBmtT9nDEXJn',
                         web: 'web'
                    }),
                    headers: {
                         'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                    }
               }).then(({ data }) => {
                    resolve(data)
               })
                    .catch(reject)
          })
               .catch(reject)
     })
}
