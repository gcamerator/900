let handler = async (m, {
    conn,
    groupMetadata,
    usedPrefix,
    text,
    command
}) => {
if (!text && !m.quoted) return m.reply("أدخل نص الرسالة?")
    let get = await groupMetadata.participants.filter(v => v.id.endsWith('.net')).map(v => v.id)
    let count = get.length;
    let sentCount = 0;


// let { key } = await conn.sendMessage(m.chat, {text: '_Loading_'})//Pengalih isu

    for (let i = 0; i < get.length; i++) {
        setTimeout(function() {
            if (text) {
                conn.sendMessage(get[i], {
                    text: text
                });
            } else if (m.quoted) {
                conn.copyNForward(get[i], m.getQuotedObj(), false);
            } else if (text && m.quoted) {
                conn.sendMessage(get[i], {
                    text: text + "\n" + m.quoted.text
                });
            }
            count--;
            sentCount++;
            if (count === 0) {
            //    m.reply(`*${sentCount}*`);
            }
        }, i * 1000); // delay setiap pengiriman selama 1 detik
    }
}
handler.command = handler.help = ["push", "sift"]
handler.tags = ["owner"]
handler.group = true
export default handler