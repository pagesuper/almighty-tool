/* eslint-disable @typescript-eslint/no-empty-function */
import Validator from '../../../src/common/validator';

describe('Validator.validate', () => {
  test('校验成功', async () => {
    expect(
      Validator.validate(
        {
          name: { type: 'string' },
        },
        {
          name: 1024,
        },
      ),
    ).toEqual({
      errors: [{ info: 'validate.fail', message: 'name is not a string', path: 'name' }],
      options: {},
    });
  });
});
