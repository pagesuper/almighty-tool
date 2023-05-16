import { EnumObject, I18nValues } from '../../../src/common/enum-object';

enum ENUM_HELLO {
  Age = 'age',
  Name = 'name',
  Number = 1024,
}

const i18n = {
  t: (key: string, _values?: I18nValues): string => {
    return `Test:${key}`;
  },
};

EnumObject.setDefaultI18n(i18n);

const EnumHello = new EnumObject<ENUM_HELLO>({
  source: ENUM_HELLO,
  sourceName: 'ENUM_HELLO',
});

/* eslint-disable @typescript-eslint/no-empty-function */
describe('EnumObject', () => {
  test('成功', async () => {
    expect(EnumHello.getText('Age')).toEqual('Test:enum.ENUM_HELLO.Age');
    expect(EnumHello.getValueText('age')).toEqual('Test:enum.ENUM_HELLO.Age');
    expect(EnumHello.getValue('Age')).toEqual('age');
    expect(EnumHello.getKey('age')).toEqual('Age');

    expect(EnumHello.getText('Number')).toEqual('Test:enum.ENUM_HELLO.Number');
    expect(EnumHello.getValueText(1024)).toEqual('Test:enum.ENUM_HELLO.Number');
    expect(EnumHello.getValue('Number')).toEqual(1024);
    expect(EnumHello.getKey(1024)).toEqual('Number');

    expect(EnumHello.getSelectOptions()).toEqual([
      { key: 'Age', label: 'Test:enum.ENUM_HELLO.Age', value: 'age' },
      { key: 'Name', label: 'Test:enum.ENUM_HELLO.Name', value: 'name' },
      { key: 'Number', label: 'Test:enum.ENUM_HELLO.Number', value: 1024 },
    ]);
  });
});
