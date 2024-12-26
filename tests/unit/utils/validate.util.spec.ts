import validateUtil, {
  ValidateInternalRuleItem,
  ValidateRules,
  ValidateSchema,
  Validator,
} from '../../../src/utils/validate.util';

describe('validateUtil.getSchema()', () => {
  test('成功', async () => {
    expect(validateUtil.getSchema({})).toBeInstanceOf(ValidateSchema);
  });
});

describe('validateUtil.validate()', () => {
  test('成功: empty', async () => {
    const result = await validateUtil.validate({}, {});
    expect(result).toEqual({ success: true });
  });

  test('成功: 单个字段', async () => {
    const result = await validateUtil.validate({ name: { type: 'string', required: true } }, { name: '' });

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'name',
          fieldValue: '',
          message: 'name is required',
          model: 'Base',
        },
      ],
    });
  });

  test('成功: 多个字段', async () => {
    const result = await validateUtil.validate(
      {
        name: { type: 'string', required: true },
        age: { type: 'number', required: true },
      },
      { name: 'jack', age: 18 },
    );

    expect(result).toEqual({
      success: true,
    });
  });

  test('成功: 嵌套', async () => {
    const result = await validateUtil.validate(
      {
        user: {
          type: 'object',
          required: true,
          fields: {
            name: { type: 'string', required: true },
          },
        },
      },
      { user: { name: '' } },
    );

    expect(result).toEqual({
      success: false,
      errors: [
        {
          message: 'user.name is required',
          fieldValue: '',
          field: 'user.name',
          model: 'Base',
        },
      ],
    });
  });

  test('成功: 异步', async () => {
    const rules: ValidateRules = {
      user: {
        type: 'object',
        required: true,
        fields: {
          name: { type: 'string', required: true },
          age: [
            {
              type: 'number',
              required: true,
            },
            {
              type: 'number',
              asyncValidator: (rule: ValidateInternalRuleItem, value) => {
                return new Promise((resolve, reject) => {
                  if (value < 18) {
                    reject(new Error('too young'));
                  } else {
                    resolve();
                  }
                });
              },
            },
          ],
        },
      },
    };

    const result1 = await validateUtil.validate(rules, { user: { name: 'Haha', age: 17 } });

    expect(result1).toEqual({
      success: false,
      errors: [
        {
          field: 'user.age',
          fieldValue: 17,
          message: 'too young',
          model: 'Base',
        },
      ],
    });

    const result2 = await validateUtil.validate(rules, { user: { name: 'Haha' } });

    expect(result2).toEqual({
      success: false,
      errors: [
        {
          field: 'user.age',
          fieldValue: undefined,
          message: 'user.age is required',
          model: 'Base',
        },
      ],
    });

    const result3 = await validateUtil.validate(rules, { user: { name: 'Haha' } }, { model: 'User' });

    expect(result3).toEqual({
      success: false,
      errors: [
        {
          field: 'user.age',
          fieldValue: undefined,
          message: 'user.age is required',
          model: 'User',
        },
      ],
    });
  });

  test('成功: 异步 other error', async () => {
    const rules: ValidateRules = {
      user: {
        type: 'object',
        required: true,
        fields: {
          name: { type: 'string', required: true },
          age: [
            {
              type: 'number',
              required: true,
            },
            {
              type: 'number',
              asyncValidator: (rule: ValidateInternalRuleItem, value) => {
                return new Promise((resolve, reject) => {
                  if (value < 18) {
                    reject(new Error('too young'));
                  } else {
                    resolve();
                  }
                });
              },
            },
          ],
        },
      },
    };

    const result1 = await validateUtil.validate(rules, { user: { name: 'Haha', age: 17 } });

    expect(result1).toEqual({
      success: false,
      errors: [
        {
          field: 'user.age',
          fieldValue: 17,
          message: 'too young',
          model: 'Base',
        },
      ],
    });
  });
});

describe('Validator', () => {
  test('失败: 不能为空', async () => {
    const validator = new Validator({
      action: 'create',
      rules: {
        name: { regexpKey: 'blank-string', regexpReversed: true },
      },
    });

    const result = await validator.validate({ name: ' 　' });

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'name',
          fieldValue: ' 　',
          message: 'InvalidReversed:blank-string',
          model: 'Base',
        },
      ],
    });
  });

  test('失败: 不能为空(自定义message)', async () => {
    const validator = new Validator({
      action: 'create',
      rules: {
        // eslint-disable-next-line no-template-curly-in-string
        name: { regexpKey: 'blank-string', regexpReversed: true, message: '{label} can not be blank' },
      },
    });

    const result = await validator.validate({ name: ' 　' });

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'name',
          fieldValue: ' 　',
          message: '{label} can not be blank',
          model: 'Base',
        },
      ],
    });
  });

  test('成功', async () => {
    const validator = new Validator({
      action: 'create',
      rules: {
        name: { type: 'string', required: true },
        age: { type: 'number', required: true },
      },
    });

    const result = await validator.validate({ name: 'jack20', age: 20 });

    expect(result).toEqual({
      success: true,
    });
  });

  test('失败', async () => {
    const validator = new Validator({
      action: 'create',
      rules: {
        name: { type: 'string', required: true },
        age: { type: 'number', required: true },
      },
    });

    const result = await validator.validate({ name: 'rose', age: 'jack' });

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'age',
          fieldValue: 'jack',
          message: 'age is not a number',
          model: 'Base',
        },
      ],
    });
  });

  test('失败: 自定义正则', async () => {
    const validator = new Validator({
      action: 'create',
      rules: {
        name: { regexpKey: 'email' },
      },
    });

    const result = await validator.validate({ name: 'rose', age: 'jack' }, { model: 'User' });

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'name',
          fieldValue: 'rose',
          message: 'Invalid:email',
          model: 'User',
        },
      ],
    });
  });

  test('失败: 自定义正则, message 为函数', async () => {
    const validator = new Validator({
      action: 'create',
      rules: {
        name: { regexpKey: 'email', message: (label) => `${label} can not be email` },
      },
    });

    const result = await validator.validate({ name: 'rose', age: 'jack' }, { model: 'User' });

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'name',
          fieldValue: 'rose',
          message: 'name can not be email',
          model: 'User',
        },
      ],
    });
  });

  test('失败: 是否必须的验证', async () => {
    const validator = new Validator({
      action: 'create',
      rules: {
        name: { required: true },
      },
    });

    const result = await validator.validate({ name: undefined });

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'name',
          fieldValue: undefined,
          message: 'name is required',
          model: 'Base',
        },
      ],
    });
  });

  test('失败: 嵌套', async () => {
    const validator = new Validator({
      action: 'create',
      rules: {
        name: [{ required: true }],
        student: {
          type: 'object',
          fields: {
            name: [{ required: true }],
          },
        },
      },
    });

    const result = await validator.validate(
      { name: undefined, student: { name: undefined } },
      { rules: { name: { required: false }, student: { fields: { name: { required: false } } } } },
    );

    expect(result).toEqual({
      success: true,
    });
  });

  test('失败: 包装', async () => {
    const validator = new Validator({
      action: 'create',
      rules: {
        name: [{ required: true }],
        student: {
          type: 'object',
          fields: {
            name: [{ required: true }],
          },
        },
      },
    });

    const result = await validator
      .wrapRules({
        rules: { name: { required: false }, student: { fields: { name: { required: false } } } },
        override: false,
      })
      .validate({ name: undefined, student: { name: undefined } });

    expect(result).toEqual({
      success: true,
    });

    const result2 = await validator.validate({ name: undefined, student: { name: undefined } });

    expect(result2).toEqual({
      success: false,
      errors: [
        {
          field: 'name',
          fieldValue: undefined,
          message: 'name is required',
          model: 'Base',
        },
        {
          field: 'student.name',
          fieldValue: undefined,
          message: 'student.name is required',
          model: 'Base',
        },
      ],
    });

    const result3 = await validator
      .wrapRules({
        rules: { name: { required: false }, student: { fields: { name: { required: false } } } },
        override: true,
      })
      .validate({ name: undefined, student: { name: undefined } });

    expect(result3).toEqual({
      success: true,
    });

    const result4 = await validator.validate({ name: undefined, student: { name: undefined } });

    expect(result4).toEqual({
      success: true,
    });

    const result5 = await validator.validate(
      { name: '', student: { name: '' } },
      {
        rules: { name: { required: true }, student: { fields: { name: { required: true } } } },
      },
    );

    expect(result5).toEqual({
      errors: [
        {
          field: 'name',
          fieldValue: '',
          message: 'name is required',
          model: 'Base',
        },
        {
          field: 'student.name',
          fieldValue: '',
          message: 'student.name is required',
          model: 'Base',
        },
      ],
      success: false,
    });
  });
});
