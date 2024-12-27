import { EnumObject } from '../../../src/common/enum-object';
import { i18nConfig } from '../../../src/i18n/index';

enum ENUM_HELLO {
  Age = 'age',
  Name = 'name',
  Number = 1024,
}

const EnumHello = new EnumObject({
  source: ENUM_HELLO,
  name: 'ENUM_HELLO',
  i18n: i18nConfig.i18n,
});

describe('EnumObject', () => {
  test('成功', async () => {
    expect(EnumHello.getTranslateOptionWithKey('Age')).toEqual({
      key: 'Age',
      translate: {
        en: 'enum.types.ENUM_HELLO.options.Age',
        'zh-CN': 'enum.types.ENUM_HELLO.options.Age',
      },
      value: 'age',
    });

    expect(EnumHello.getTranslateOptionWithValue(1024)).toEqual({
      key: 'Number',
      translate: {
        en: 'enum.types.ENUM_HELLO.options.Number',
        'zh-CN': 'enum.types.ENUM_HELLO.options.Number',
      },
      value: 1024,
    });

    expect(EnumHello.getI18n().t('Age')).toEqual('Age');
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

    expect(EnumHello.getDialectName('en')).toEqual('enum.types.ENUM_HELLO.name');
    expect(EnumHello.getDialectName('zh-CN')).toEqual('enum.types.ENUM_HELLO.name');

    expect(EnumHello.getDialectOptions('en')).toEqual([
      {
        key: 'Age',
        value: 'age',
        dialect: 'enum.types.ENUM_HELLO.options.Age',
      },
      {
        dialect: 'enum.types.ENUM_HELLO.options.Name',
        key: 'Name',
        value: 'name',
      },
      {
        dialect: 'enum.types.ENUM_HELLO.options.Number',
        key: 'Number',
        value: 1024,
      },
    ]);

    expect(EnumHello.getDialectOptions('zh-CN')).toEqual([
      {
        key: 'Age',
        value: 'age',
        dialect: 'enum.types.ENUM_HELLO.options.Age',
      },
      {
        dialect: 'enum.types.ENUM_HELLO.options.Name',
        key: 'Name',
        value: 'name',
      },
      {
        dialect: 'enum.types.ENUM_HELLO.options.Number',
        key: 'Number',
        value: 1024,
      },
    ]);

    expect(EnumHello.keyMap.get('age')).toEqual('Age');
    expect(EnumHello.valueMap.get('Age')).toEqual('age');
  });
});
