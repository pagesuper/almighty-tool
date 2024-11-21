import codeUtil from '../../../src/utils/code.util';

describe('codeUtil.getGenerateData()', () => {
  test('成功', async () => {
    expect(codeUtil.getGenerateData({ modelName: 'authCollection', modulePath: 'service-forum/src/modules/auth' })).toEqual({
      FirstLowerModelName: 'authCollection',
      FirstLowerModelsName: 'authCollections',
      ModulePath: 'service-forum/src/modules/auth',
      ModelName: 'AuthCollection',
      ModelsName: 'AuthCollections',
      KebabCaseModelName: 'auth-collection',
      KebabCaseModelsName: 'auth-collections',
      UnderscoreModelName: 'auth_collection',
      UnderscoreModelsName: 'auth_collections',
    });
  });

  test('a.name ??= "Hello"', async () => {
    const a: { name?: string } = { name: 'Jack' };
    a.name = undefined;
    a.name ??= 'Hello';
    expect(a.name).toBe('Hello');
  });
});

describe('codeUtil.getBooleanValue()', () => {
  test('成功', async () => {
    expect(codeUtil.getBooleanValue('true')).toBe(true);
    expect(codeUtil.getBooleanValue('false')).toBe(false);
    expect(codeUtil.getBooleanValue(true)).toBe(true);
    expect(codeUtil.getBooleanValue(false)).toBe(false);
  });
});
