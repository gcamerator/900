import fetch from 'node-fetch';

let handler = async (m, { text, command }) => {
  let url = text;
  let q = await res(url)
  if (q.startsWith('<!DOCTYPE html>')){
  await m.react(done)}else {m.react(error)}
};
handler.command = /^(fetc)$/i;
export default handler;

async function res(url){
  let response = await fetch(url);
  let html = await response.text();
return html;
}
