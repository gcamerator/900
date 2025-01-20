let handler = async (m, { conn, args, usedPrefix, command }) => {
    conn.math = conn.math ? conn.math : {}
    
    if (args.length < 1) throw `
*Mathématiques - الرياضيات*
🧮 الصعوبات المتاحة:
  
${Object.keys(modes).join(' • ')}

مثال:
${usedPrefix + command} 2
`.trim()
    let mode = args[0].toLowerCase()
    if (!(mode in modes)) throw `
*Mathématiques - الرياضيات*
🧮 الصعوبات المتاحة:
  
${Object.keys(modes).join(' • ')}

مثال:
${usedPrefix + command} 2
`.trim()
    
    let id = m.chat
    if (id in conn.math) return conn.reply(m.chat, '⚠️ لا تزال هناك أسئلة دون إجابة في هذه المحادثة', conn.math[id][0])
    let math = genMath(mode)
    conn.math[id] = [
        await conn.reply(m.chat, `🧮 كم هو ناتج:\n*${math.str}* =\n\nلديك: ${(math.time / 1000).toFixed(2)} ثانية للإجابة\n\n🎁 مكافأة: ${math.bonus} نقطة`, m),
        math, 4,
        setTimeout(() => {
            if (conn.math[id]) conn.reply(m.chat, `⏰ انتهى الوقت!\nالإجابة هي: *${math.result}*`, conn.math[id][0])
            delete conn.math[id]
        }, math.time)
    ]
}
handler.command = ['ماط', 'ماتي', 'math', 'رياضيات'] 

let modes = {
    1: [-10, 10, -10, 10, '*/+-', 40000, 40],
    2: [-40, 50, -10, 50, '*/+-', 50000, 150],
    3: [-100, 200, -20, 200, '*/+-', 60000, 350],
    4: [-99, 999, -50, 1000, '*/+-', 99999, 9999]
}

let operators = {
    '+': '+',
    '-': '-',
    '*': '×',
    '/': '÷'
}

function genMath(mode) {
    let [a1, a2, b1, b2, ops, time, bonus] = modes[mode]
    let a = randomInt(a1, a2)
    let b = randomInt(b1, b2)
    let op = pickRandom([...ops])
    let result = (new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? `(${b})` : b}`))()
    if (op == '/') [a, result] = [result, a]
    return {
        str: `${a} ${operators[op]} ${b}`,
        mode,
        time,
        bonus,
        result
    }
}

function randomInt(from, to) {
    if (from > to) [from, to] = [to, from]
    from = Math.floor(from)
    to = Math.floor(to)
    return Math.floor((to - from) * Math.random() + from)
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

handler.modes = modes

export default handler
