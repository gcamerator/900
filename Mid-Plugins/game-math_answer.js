let handler = m => m
handler.before = async function (m) {
    if (!/^-?[0-9]+(\.[0-9]+)?$/.test(m.text)) return !0
    let id = m.chat
    if (!m.text) return !0
    this.math = this.math ? this.math : {}
    if (id in this.math) {
        let math = JSON.parse(JSON.stringify(this.math[id][1]))
        if (m.text == math.result) {
            global.db.data.users[m.sender].exp += math.bonus
            clearTimeout(this.math[id][3])
            delete this.math[id]
            m.reply(`✅ *الإجابة صحيحة!*\n\n‣ لقد ربحت: *+${math.bonus} نقطة*`)
        } else {
            if (--this.math[id][2] == 0) {
                clearTimeout(this.math[id][3])
                delete this.math[id]
                m.reply(`*❌ لا توجد مزيد من الفرص*\n\n الإجابة: *${math.result}*`)
            } else
                m.reply(`⚠️ *الإجابة غير صحيحة*\n\n لا يزال لديك ${this.math[id][2]} فرصة`)
        }
    }
    return !0
}
export default handler
