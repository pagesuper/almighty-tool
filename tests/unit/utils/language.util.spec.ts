import languageUtil from '../../../src/utils/language.util';

describe('languageUtil', () => {
  const only = ['zh-CN', 'en-US', 'vi-VN', 'th-TH', 'ru-RU', 'es-ES', 'id-ID', 'de-DE', 'fr-FR'];

  describe('getKeyByText - 核心语言 CebabCase 测试', () => {
    test('中英文混排 (cmn) 文本应返回 zh-CN', () => {
      const text = 'Redmine, GitLab, Github, SSO系统用来干啊？';
      const key = languageUtil.getKeyByText(text, { only });
      expect(key).toBe('zh-CN');
    });

    test('中文 (cmn) 文本应返回 zh-CN', () => {
      const text = '这是一段用于测试的中文文本';
      const key = languageUtil.getKeyByText(text, { only });
      expect(key).toBe('zh-CN');
    });

    test('英语 (eng) 文本应返回 en-US', () => {
      const text = 'This is a sample English text for testing';
      const key = languageUtil.getKeyByText(text, { only });
      expect(key).toBe('en-US');
    });

    test('越南语 (vie) 文本应返回 vi-VN', () => {
      const text = 'Xin chào đây là một văn bản tiếng Việt để kiểm tra';
      const key = languageUtil.getKeyByText(text, { only });
      expect(key).toBe('vi-VN');
    });

    test('泰语 (tha) 文本应返回 th-TH', () => {
      const text = 'นี่คือตัวอย่างข้อความภาษาไทยสำหรับการทดสอบ';
      const key = languageUtil.getKeyByText(text, { only });
      expect(key).toBe('th-TH');
    });

    test('俄语 (rus) 文本应返回 ru-RU', () => {
      const text = 'Это пример русского текста для тестирования';
      const key = languageUtil.getKeyByText(text, { only });
      expect(key).toBe('ru-RU');
    });

    test('西班牙语 (spa) 文本应返回 es-ES', () => {
      const text = 'Este es un texto de ejemplo en español para pruebas';
      const key = languageUtil.getKeyByText(text, { only });
      expect(key).toBe('es-ES');
    });

    test('印尼语 (ind) 文本应返回 id-ID', () => {
      const text = 'Ini adalah contoh teks bahasa Indonesia untuk pengujian';
      const key = languageUtil.getKeyByText(text, { only });
      expect(key).toBe('id-ID');
    });

    test('德语 (deu) 文本应返回 de-DE', () => {
      const text = 'Dies ist ein Beispieltext auf Deutsch zum Testen';
      const key = languageUtil.getKeyByText(text, { only });
      expect(key).toBe('de-DE');
    });

    test('法语 (fra) 文本应返回 fr-FR', () => {
      const text = 'Ceci est un exemple de texte en français pour les tests';
      const key = languageUtil.getKeyByText(text, { only });
      expect(key).toBe('fr-FR');
    });

    test(' (null) 文本应返回', () => {
      const text = 'Cześć świecie';
      const key = languageUtil.getKeyByText(text, { only });
      expect(key).toBe(null);
    });

    test(' (null) 文本应返回 default', () => {
      const text = 'Cześć świecie';
      const key = languageUtil.getKeyByText(text, { only, default: 'zh-CN' });
      expect(key).toBe('zh-CN');
    });
  });
});
