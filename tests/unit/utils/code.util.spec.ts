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
});

describe('codeUtil.getBooleanValue()', () => {
  test('成功', async () => {
    expect(codeUtil.getBooleanValue('true')).toBe(true);
    expect(codeUtil.getBooleanValue('false')).toBe(false);
    expect(codeUtil.getBooleanValue(true)).toBe(true);
    expect(codeUtil.getBooleanValue(false)).toBe(false);
  });
});
