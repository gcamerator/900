import axios from "axios";
import * as cheerio from 'cheerio';
import request from "request";
import jwt from "jsonwebtoken";

let handler = async (m, { conn, mCommand, mTexts }) => {
    let user;
    if(m.quoted){user = global.db.data.users[m.quoted.sender]} else { user = global.db.data.users[m.sender]};
    if (mCommand.toLowerCase() === "ugeen") {
        user.ulogin = { email: mTexts[0], pass: mTexts[1] };
        return m.react(done);
    } else if (mCommand.toLowerCase() === "m3u") {
        if (user.iptv) {
            return await conn.sendFile(m.chat, user.iptv, user.name + "_iptv.m3u", "", null);
        } else {
            return m.reply("*لم تقم بتفعيل إشتراكك بعد*");
        }
    } else if (mCommand.toLowerCase() === "iptv") {
        if(user.limit > Math.floor(Date.now() / 1000) && m.sender !== conn.user.jid) return m.react('⏳');
        if (!user.ulogin)
            return m.reply("*أدخل الإيميل وكلمة السر، مثل*:\nugeen <email> <pass>");
        const url = "http://176.123.9.60:3000/auth/login";
        const email = user.ulogin.email || mTexts[0];
        const password = user.ulogin.pass || mTexts[1];
        const recaptcha = await main();
        const data = {
            email: email,
            password: password,
            recaptcha: recaptcha,
        };
        axios
            .post(url, data)
            .then((response) => {
                let key = "Bearer " + response.data.access.token;
                const getOptions = {
                    url: "http://176.123.9.60:3000/v1/codes",
                    headers: {
                        Authorization: key,
                        Host: "176.123.9.60:3000",
                        Accept: "application/json",
                        "Accept-Encoding": "gzip, deflate, br",
                        Connection: "keep-alive",
                    },
                };

                request.get(getOptions, (error, response, body) => {
                    if (error) {
                        console.error(error);
                        m.reply(error);
                        return;
                    }

                    try {
                        const data = JSON.parse(body);
                        if (data.success) {
                            const token = data.token;
                            const decodedToken = jwt.decode(token, {
                                complete: true,
                            });

                            if (
                                decodedToken &&
                                decodedToken.payload &&
                                decodedToken.payload.code
                            ) {
                                const code = decodedToken.payload.code.code;
                                const postOptions = {
                                    url: "http://176.123.9.60:3000/v1/subscriptions",
                                    headers: {
                                        Authorization: key,
                                        Host: "176.123.9.60:3000",
                                        Accept: "application/json",
                                        "Accept-Encoding": "gzip, deflate, br",
                                        Connection: "keep-alive",
                                    },
                                    json: {
                                        bouquetId: "384",
                                        code: code,
                                        token: token,
                                    },
                                };

                                request.post(
                                    postOptions,
                                    (error, response, body) => {
                                        if (error) {
                                            m.reply(error);
                                            console.error(error);
                                        } else {
                                            if (body.success) {
                                                m.reply(`✅ *تم تفعيل الاشتراك بنجاح*\n\n*المدة: ${body.duration} ساعة*\n*تاريخ الإنتهاء:*\n*${body.expire.split(' ')[1]}*\n* ${body.expire.split(' ')[0]}*`);
                                                user.iptv = `http://ugeen.live:8080/get.php?username=${body.iptv.user}&password=${body.iptv.pass}&type=m3u`;
                                                m.reply("*لتحميل ملف IPTV أكتب الأمر\n\n*m3u*");
                                                user.limit = Math.floor(Date.now() / 1000) + 80000;
                                            } else if (body.message) {
                                               m.reply(`*${body.message}*`);
                                            }
                                            console.log("Response:", body);
                                        }
                                    },
                                );
                            } else {
                                console.log(
                                    "Failed to decode token or retrieve code.",
                                );
                            }
                        } else {
                            console.log("Failed", data);
                        }
                    } catch (err) {
                        console.error("Error parsing JSON response:", err);
                    }
                });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
};
handler.customPrefix = /^(ugeen|iptv|m3u)(\s|$)/i;
handler.command = new RegExp();
export default handler;

async function getPageData(url) {
    try {
        const data = await axios.get(url);
        return data.data;
    } catch (e) {
        console.error("getPageData error", e.message);
        return null;
    }
}
function parserData(html) {
    try {
        const $ = cheerio.load(html);
        return $("[data-sitekey]").data("sitekey");
    } catch (e) {
        console.error("parserData error", e.message);
        return null;
    }
}
async function createCaptchaTask(url, siteKey) {
    try {
        const data = await axios.post(
            "https://api.nextcaptcha.com/createTask",
            {
                clientKey: "next_be4da4f19919a924c07ca22f051656d0f6",
                task: {
                    type: "RecaptchaV2TaskProxyless",
                    websiteURL: url,
                    websiteKey: siteKey,
                },
            },
        );
        return data.data;
    } catch (e) {
        console.error("createCaptchaTask error", e.message);
        return null;
    }
}
async function sleep(time = 500) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}
async function getTaskResult(taskId, tryTimes = 60) {
    try {
        const data = await axios.post(
            "https://api.nextcaptcha.com/getTaskResult",
            {
                clientKey: "next_be4da4f19919a924c07ca22f051656d0f6", // clientKey from NextCaptcha
                taskId,
            },
        );
        if (data.data.status === "ready") {
            return data.data;
        } else if (data.data.status === "processing" && tryTimes >= 0) {
            await sleep();
            return getTaskResult(taskId);
        } else {
            if (tryTimes < 0) {
                console.error("getTaskResult out of time");
            } else {
                console.error("getTaskResult errorCode", data.data.errorCode);
                console.error(
                    "getTaskResult errorDescription",
                    data.data.errorDescription,
                );
            }
            return null;
        }
    } catch (e) {
        console.error("getTaskResult error", e.message);
        return null;
    }
}
async function main() {
    const url = "http://ugeen.live/signin.html";
    const html = await getPageData(url);
    const sitekey = parserData(html);
    const task = await createCaptchaTask(url, sitekey, true);
    const result = await getTaskResult(task.taskId);
    const vv = result.solution.gRecaptchaResponse;
    return vv;
}
