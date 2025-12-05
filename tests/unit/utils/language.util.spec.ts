import languageUtil from '../../../src/utils/language.util'; // 根据实际文件路径调整

// describe('languageUtil', () => {
//   describe('getKeyByText - CebabCase 全语言测试', () => {
//     // 亚洲语言测试
//     test('中文文本应返回 zh-CN', () => {
//       const result = languageUtil.getKeyByText('这是一段中文文本');
//       expect(result).toBe('zh-CN');
//     });

//     test('日语文本应返回 ja-JP', () => {
//       const result = languageUtil.getKeyByText('これは日本語のテキストです');
//       expect(result).toBe('ja-JP');
//     });

//     test('韩语文本应返回 ko-KR', () => {
//       const result = languageUtil.getKeyByText('안녕하세요');
//       expect(result).toBe('ko-KR');
//     });

//     test('印地语文本应返回 hi-IN', () => {
//       const result = languageUtil.getKeyByText('नमस्ते');
//       expect(result).toBe('hi-IN');
//     });

//     test('泰语文本应返回 th-TH', () => {
//       const result = languageUtil.getKeyByText('สวัสดี');
//       expect(result).toBe('th-TH');
//     });

//     test('越南语文本应返回 vi-VN', () => {
//       const result = languageUtil.getKeyByText('Xin chào');
//       expect(result).toBe('vi-VN');
//     });

//     test('印尼语文本应返回 id-ID', () => {
//       const result = languageUtil.getKeyByText('Halo');
//       expect(result).toBe('id-ID');
//     });

//     test('马来语文本应返回 ms-MY', () => {
//       const result = languageUtil.getKeyByText('Helo');
//       expect(result).toBe('ms-MY');
//     });

//     test('菲律宾语文本应返回 tl-PH', () => {
//       const result = languageUtil.getKeyByText('Kamusta');
//       expect(result).toBe('tl-PH');
//     });

//     // 欧洲语言测试
//     test('英语文本应返回 en-US', () => {
//       const result = languageUtil.getKeyByText('This is an English text');
//       expect(result).toBe('en-US');
//     });

//     test('西班牙语文本应返回 es-ES', () => {
//       const result = languageUtil.getKeyByText('Hola mundo');
//       expect(result).toBe('es-ES');
//     });

//     test('法语文本应返回 fr-FR', () => {
//       const result = languageUtil.getKeyByText('Bonjour le monde');
//       expect(result).toBe('fr-FR');
//     });

//     test('德语文本应返回 de-DE', () => {
//       const result = languageUtil.getKeyByText('Hallo Welt');
//       expect(result).toBe('de-DE');
//     });

//     test('意大利语文本应返回 it-IT', () => {
//       const result = languageUtil.getKeyByText('Ciao mondo');
//       expect(result).toBe('it-IT');
//     });

//     test('俄语文本应返回 ru-RU', () => {
//       const result = languageUtil.getKeyByText('Привет мир');
//       expect(result).toBe('ru-RU');
//     });

//     test('葡萄牙语文本应返回 pt-BR', () => {
//       const result = languageUtil.getKeyByText('Olá mundo');
//       expect(result).toBe('pt-BR');
//     });

//     test('荷兰语文本应返回 nl-NL', () => {
//       const result = languageUtil.getKeyByText('Hallo wereld');
//       expect(result).toBe('nl-NL');
//     });

//     test('波兰语文本应返回 pl-PL', () => {
//       const result = languageUtil.getKeyByText('Cześć świecie');
//       expect(result).toBe('pl-PL');
//     });

//     test('乌克兰语文本应返回 uk-UA', () => {
//       const result = languageUtil.getKeyByText('Привіт світ');
//       expect(result).toBe('uk-UA');
//     });

//     test('捷克语文本应返回 cs-CZ', () => {
//       const result = languageUtil.getKeyByText('Ahoj světe');
//       expect(result).toBe('cs-CZ');
//     });

//     test('瑞典语文本应返回 sv-SE', () => {
//       const result = languageUtil.getKeyByText('Hej världen');
//       expect(result).toBe('sv-SE');
//     });

//     test('丹麦语文本应返回 da-DK', () => {
//       const result = languageUtil.getKeyByText('Hej verden');
//       expect(result).toBe('da-DK');
//     });

//     test('芬兰语文本应返回 fi-FI', () => {
//       const result = languageUtil.getKeyByText('Hei maailma');
//       expect(result).toBe('fi-FI');
//     });

//     test('挪威语文本应返回 no-NO', () => {
//       const result = languageUtil.getKeyByText('Hei verden');
//       expect(result).toBe('no-NO');
//     });

//     test('希腊语文本应返回 el-GR', () => {
//       const result = languageUtil.getKeyByText('Γειά σου κόσμε');
//       expect(result).toBe('el-GR');
//     });

//     test('匈牙利语文本应返回 hu-HU', () => {
//       const result = languageUtil.getKeyByText('Helló világ');
//       expect(result).toBe('hu-HU');
//     });

//     test('罗马尼亚语文本应返回 ro-RO', () => {
//       const result = languageUtil.getKeyByText('Salut lume');
//       expect(result).toBe('ro-RO');
//     });

//     test('保加利亚语文本应返回 bg-BG', () => {
//       const result = languageUtil.getKeyByText('Здравей свят');
//       expect(result).toBe('bg-BG');
//     });

//     // 中东和非洲语言测试
//     test('阿拉伯语文本应返回 ar-SA', () => {
//       const result = languageUtil.getKeyByText('مرحبا بالعالم');
//       expect(result).toBe('ar-SA');
//     });

//     test('希伯来语文本应返回 he-IL', () => {
//       const result = languageUtil.getKeyByText('שלום עולם');
//       expect(result).toBe('he-IL');
//     });

//     test('土耳其语文本应返回 tr-TR', () => {
//       const result = languageUtil.getKeyByText('Merhaba dünya');
//       expect(result).toBe('tr-TR');
//     });

//     test('波斯语文本应返回 fa-IR', () => {
//       const result = languageUtil.getKeyByText('سلام دنیا');
//       expect(result).toBe('fa-IR');
//     });

//     test('斯瓦希里语文本应返回 sw-KE', () => {
//       const result = languageUtil.getKeyByText('Hujambo dunia');
//       expect(result).toBe('sw-KE');
//     });

//     test('南非荷兰语文本应返回 af-ZA', () => {
//       const result = languageUtil.getKeyByText('Hallo wêreld');
//       expect(result).toBe('af-ZA');
//     });

//     test('祖鲁语文本应返回 zu-ZA', () => {
//       const result = languageUtil.getKeyByText('Sawubona');
//       expect(result).toBe('zu-ZA');
//     });

//     // 南亚语言测试
//     test('孟加拉语文本应返回 bn-BD', () => {
//       const result = languageUtil.getKeyByText('হ্যালো দুনিয়া');
//       expect(result).toBe('bn-BD');
//     });

//     test('泰米尔语文本应返回 ta-IN', () => {
//       const result = languageUtil.getKeyByText('வணக்கம்');
//       expect(result).toBe('ta-IN');
//     });

//     test('泰卢固语文本应返回 te-IN', () => {
//       const result = languageUtil.getKeyByText('హలో వరల్డ్');
//       expect(result).toBe('te-IN');
//     });

//     test('马拉地语文本应返回 mr-IN', () => {
//       const result = languageUtil.getKeyByText('नमस्कार');
//       expect(result).toBe('mr-IN');
//     });

//     test('古吉拉特语文本应返回 gu-IN', () => {
//       const result = languageUtil.getKeyByText('હેલો વર્લ્ડ');
//       expect(result).toBe('gu-IN');
//     });

//     test('卡纳达语文本应返回 kn-IN', () => {
//       const result = languageUtil.getKeyByText('ಹಲೋ ವರ್ಲ್ಡ್');
//       expect(result).toBe('kn-IN');
//     });

//     test('马拉雅拉姆语文本应返回 ml-IN', () => {
//       const result = languageUtil.getKeyByText('ഹലോ വേൾഡ്');
//       expect(result).toBe('ml-IN');
//     });

//     test('旁遮普语文本应返回 pa-IN', () => {
//       const result = languageUtil.getKeyByText('ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ');
//       expect(result).toBe('pa-IN');
//     });

//     test('乌尔都语文本应返回 ur-PK', () => {
//       const result = languageUtil.getKeyByText('ہیلو دنیا');
//       expect(result).toBe('ur-PK');
//     });

//     // 其他重要语言测试
//     test('加泰罗尼亚语文本应返回 ca-ES', () => {
//       const result = languageUtil.getKeyByText('Hola món');
//       expect(result).toBe('ca-ES');
//     });

//     test('巴斯克语文本应返回 eu-ES', () => {
//       const result = languageUtil.getKeyByText('Kaixo mundua');
//       expect(result).toBe('eu-ES');
//     });

//     test('加利西亚语文本应返回 gl-ES', () => {
//       const result = languageUtil.getKeyByText('Ola mundo');
//       expect(result).toBe('gl-ES');
//     });

//     test('克罗地亚语文本应返回 hr-HR', () => {
//       const result = languageUtil.getKeyByText('Pozdrav svijete');
//       expect(result).toBe('hr-HR');
//     });

//     test('塞尔维亚语文本应返回 sr-RS', () => {
//       const result = languageUtil.getKeyByText('Здраво свете');
//       expect(result).toBe('sr-RS');
//     });

//     test('斯洛伐克语文本应返回 sk-SK', () => {
//       const result = languageUtil.getKeyByText('Ahoj svet');
//       expect(result).toBe('sk-SK');
//     });

//     test('斯洛文尼亚语文本应返回 sl-SI', () => {
//       const result = languageUtil.getKeyByText('Pozdravljen svet');
//       expect(result).toBe('sl-SI');
//     });

//     test('立陶宛语文本应返回 lt-LT', () => {
//       const result = languageUtil.getKeyByText('Labas pasauli');
//       expect(result).toBe('lt-LT');
//     });

//     test('拉脱维亚语文本应返回 lv-LV', () => {
//       const result = languageUtil.getKeyByText('Sveika pasaule');
//       expect(result).toBe('lv-LV');
//     });

//     test('爱沙尼亚语文本应返回 et-EE', () => {
//       const result = languageUtil.getKeyByText('Tere maailm');
//       expect(result).toBe('et-EE');
//     });

//     test('冰岛语文本应返回 is-IS', () => {
//       const result = languageUtil.getKeyByText('Halló heimur');
//       expect(result).toBe('is-IS');
//     });

//     // 边界情况测试
//     test('空文本应返回默认值 zh-CN', () => {
//       const result = languageUtil.getKeyByText('');
//       expect(result).toBe('zh-CN');
//     });

//     test('undefined 文本应返回默认值 zh-CN', () => {
//       const result = languageUtil.getKeyByText(undefined);
//       expect(result).toBe('zh-CN');
//     });

//     test('无法识别的语言应回退到默认值 zh-CN', () => {
//       const result = languageUtil.getKeyByText('Lorem ipsum dolor sit amet');
//       expect(result).toBe('zh-CN');
//     });

//     // 样式选项简单测试
//     test('SnakeCase 样式应正确转换格式', () => {
//       const result = languageUtil.getKeyByText('Hello', { style: 'SnakeCase' });
//       expect(result).toBe('en_US');
//     });

//     test('Code 样式应返回语言代码', () => {
//       const result = languageUtil.getKeyByText('Hello', { style: 'Code' });
//       expect(result).toBe('eng');
//     });
//   });
// });

describe('languageUtil', () => {
  // const only = ['cmn', 'eng', 'vie', 'tha', 'rus', 'spa', 'ind'];
  const only = ['zh-CN', 'en-US', 'vi-VN', 'th-TH', 'ru-RU', 'es-ES', 'id-ID'];

  describe('getKeyByText - 核心语言 CebabCase 测试', () => {
    test('中文 (cmn) 文本应返回 zh-CN', () => {
      const result = languageUtil.getKeyByText('这是一段用于测试的中文文本', { only });
      expect(result).toBe('zh-CN');
    });

    test('英语 (eng) 文本应返回 en-US', () => {
      const result = languageUtil.getKeyByText('This is a sample English text for testing', { only });
      expect(result).toBe('en-US');
    });

    test('越南语 (vie) 文本应返回 vi-VN', () => {
      const result = languageUtil.getKeyByText('Xin chào đây là một văn bản tiếng Việt để kiểm tra', { only });
      expect(result).toBe('vi-VN');
    });

    test('泰语 (tha) 文本应返回 th-TH', () => {
      const result = languageUtil.getKeyByText('นี่คือตัวอย่างข้อความภาษาไทยสำหรับการทดสอบ', { only });
      expect(result).toBe('th-TH');
    });

    test('俄语 (rus) 文本应返回 ru-RU', () => {
      const result = languageUtil.getKeyByText('Это пример русского текста для тестирования', { only });
      expect(result).toBe('ru-RU');
    });

    test('西班牙语 (spa) 文本应返回 es-ES', () => {
      const result = languageUtil.getKeyByText('Este es un texto de ejemplo en español para pruebas', { only });
      expect(result).toBe('es-ES');
    });

    test('印尼语 (ind) 文本应返回 id-ID', () => {
      const result = languageUtil.getKeyByText('Ini adalah contoh teks bahasa Indonesia untuk pengujian', { only });
      expect(result).toBe('id-ID');
    });
  });
});
