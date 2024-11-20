import { EnumObject, TranslateOptions } from '../../../src/common/enum-object';

enum ENUM_HELLO {
  Age = 'age',
  Name = 'name',
  Number = 1024,
}

const i18n = {
  t: (key: string, _options?: TranslateOptions): string => {
    return `${key}`;
  },
};

const EnumHello = new EnumObject({
  source: ENUM_HELLO,
  name: 'ENUM_HELLO',
  i18n,
});

describe('EnumObject', () => {
  test('成功', async () => {
    expect(EnumHello.i18n.t('Age')).toEqual('Age');
    expect(EnumHello.getOptions()).toEqual([
      {
        key: 'Age',
        translate: {
          en: 'enum.types.ENUM_HELLO.options.Age',
          'zh-CN': 'enum.types.ENUM_HELLO.options.Age',
        },
        value: 'age',
      },
      {
        key: 'Name',
        translate: {
          en: 'enum.types.ENUM_HELLO.options.Name',
          'zh-CN': 'enum.types.ENUM_HELLO.options.Name',
        },
        value: 'name',
      },
      {
        key: 'Number',
        translate: {
          en: 'enum.types.ENUM_HELLO.options.Number',
          'zh-CN': 'enum.types.ENUM_HELLO.options.Number',
        },
        value: 1024,
      },
    ]);

    expect(EnumHello.getTranslate()).toEqual({
      en: 'enum.types.ENUM_HELLO.name',
      'zh-CN': 'enum.types.ENUM_HELLO.name',
    });

    expect(EnumHello.keyMap.get('age')).toEqual('Age');
    expect(EnumHello.valueMap.get('Age')).toEqual('age');
  });
});
