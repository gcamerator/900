import { Prodia } from "prodia.js";
const apiKey = "51364495-b04b-4d5a-9b11-a02940fc0e3e";
const prodia = new Prodia(apiKey);

import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import fetch from 'node-fetch'
let handler = async (m, { command, usedPrefix, conn, text, args }) => {
    if (command === 'prodiaimg' || command === 'img2img') {
        const input_data = await prodia.getModels();

        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime) throw 'No media found';
        let media = await q.download();
        let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
        let link = await (isTele ? uploadImage : uploadFile)(media);

        let [urutan, tema] = text.split(" ");
        if (!tema) return m.reply("Input query!\n*Example:*\n.img2img 2 red car");

        await m.reply(wait);
        try {
            let data = input_data.map((item, index) => ({
                title: item.replace(/[_-]/g, ' ').replace(/\..*/, ''),
                id: item
            }));
            if (!urutan) return m.reply("Input query!\n*Example:*\n.img2img [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
            if (isNaN(urutan)) return m.reply("Input query!\n*Example:*\n.img2img [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
            if (urutan > data.length) return m.reply("Input query!\n*Example:*\n.img2img [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
            let out = data[urutan - 1].id;

            // Replace the placeholder with the correct function
            const generateImageParams = {
                prompt: encodeURIComponent(tema),
                upscale: true,
                imageUrl: link,
                model: out
            };
            const openAIResponse = await generateImage(generateImageParams);

            if (openAIResponse) {
                const result = openAIResponse;
                const tag = `@${m.sender.split('@')[0]}`;

                await conn.sendMessage(m.chat, {
                    image: {
                        url: result.imageUrl
                    },
                    caption: `Nih effect *${out}* nya\nRequest by: ${tag}`,
                    mentions: [m.sender]
                }, {
                    quoted: m
                });
            } else {
                console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
            }
        } catch (e) {
            await m.reply(eror);
        }
    } else if (command === 'prodiatext' || command === 'text2img') {
        const input_data = await prodia.getModels();

        let [urutan, tema] = text.split(" ");
        if (!tema) return m.reply("Input query!\n*Example:*\n.txt2img 1 red car");

        await m.reply(wait);
        try {
            let data = input_data.map((item, index) => ({
                title: item.replace(/[_-]/g, ' ').replace(/\..*/, ''),
                id: item
            }));
            if (!urutan) return m.reply("Input query!\n*Example:*\n.txt2img [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
            if (isNaN(urutan)) return m.reply("Input query!\n*Example:*\n.txt2img [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
            if (urutan > data.length) return m.reply("Input query!\n*Example:*\n.txt2img [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
            let out = data[urutan - 1].id;

            // Replace the placeholder with the correct function
            const generateImageParams = {
                prompt: encodeURIComponent(tema),
                model: out,
                upscale: true
            };
            const openAIResponse = await generateImg(generateImageParams);

            if (openAIResponse) {
                const result = openAIResponse;
                const tag = `@${m.sender.split('@')[0]}`;

                await conn.sendMessage(m.chat, {
                    image: {
                        url: result.imageUrl
                    },
                    caption: `Nih effect *${out}* nya\nRequest by: ${tag}`,
                    mentions: [m.sender]
                }, {
                    quoted: m
                });
            } else {
                console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
            }
        } catch (e) {
            await m.reply(eror);
        }
    }
};

handler.help = ["img2img *[nomor]|[query]*"];
handler.tags = ["ai"];
handler.command = /^(img2img|prodiaimg|text2img|prodiatext)$/i;

export default handler;

async function generateImage(params) {
    const generate = await prodia.transformImage(params);

    while (generate.status !== "succeeded" && generate.status !== "failed") {
        await new Promise((resolve) => setTimeout(resolve, 250));

        const job = await prodia.getJob(generate.job);

        if (job.status === "succeeded") {
            return job;
        }    }}
    async function generateImg(params) {
    const generate = await prodia.generateImage(params);

    while (generate.status !== "succeeded" && generate.status !== "failed") {
        await new Promise((resolve) => setTimeout(resolve, 250));

        const job = await prodia.getJob(generate.job);

        if (job.status === "succeeded") {
            return job;
        }  }}
