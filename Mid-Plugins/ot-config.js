let handler = async (m, { conn }) => {
  const chat = global.db.data.chats[m.chat];
  const user = global.db.data.users[m.sender];
  const bot = global.db.data.settings[conn.user.jid];
const chats_functions = [
  'simi',
  'coc',
  'bard',
'darija',
 'eng',
  'hamid',
  'jamila',
  'down',
  'zmr',
  'gemini',
  'gemi',
  'go',
  'gpt',
  'gptv',
  'chatnews',
  'chatmatch',
  'salat',
  'secret',
  'elegpt',
  'matchat'
]
  const settings_functions = [
    '__',
    'match',
    'news',
    'antidelete',
    'viewstory',
    'autoread',
    'anticall',
    'js',
    'onlyprv',
    'onlyme',
    'onlyallow',
    'onlygroup',
    'onlyprv'
  ];
  let rows = settings_functions.map(func => {
    let oo = chat[func] ? 'إيقاف هذه الميزة' : 'تشغيل هذه الميزة';
    let ed = bot[func] ? '.0 ' : '.1 ';
    return {
      header: func,
      title: '', description: oo,
      id: ed + func
    };
  });

  let rows2 = chats_functions.map(func => {
    let ooo = chat[func] ? 'إيقاف هذه الميزة' : 'تشغيل هذه الميزة';
    let ed = chat[func] ? '.0 ' : '.1 ';
    return {
      header: func,
      title: '', description: ooo,
      id: ed + func
    };
  });
  let allRows = rows2.concat(rows);
  let message = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            title: '*📜 قائمه التشغيل والإيقاف 📜*'
          },
          body: {
            text: 'اختر أحد الخيارات التالية:'
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                  title: 'اضغط هنا للأختيار ✅',
                  sections: [
                    {
                      rows: allRows
                    }
                  ]
                }),
                messageParamsJson: ''
              }
            ]
          }
        }
      }
    }
  };

  conn.relayMessage(m.chat, message, {});

}
handler.command = ['config', 'onoff'];

export default handler;
