import validateUtil, { ValidateRules, ValidateSchema, Validator } from '../../../src/utils/validate.util';

describe('validateUtil.getSchema()', () => {
  test('成功', async () => {
    expect(validateUtil.getSchema({})).toBeInstanceOf(ValidateSchema);
  });
});

describe('validateUtil.validate()', () => {
  test('成功: 一层/必须', async () => {
    const rules = {
      name: { required: true },
    };

    const result = await validateUtil.validate(rules, { name: '' });

    expect(result).toEqual({
      errors: [
        {
          field: 'name',
          fieldValue: '',
          message: '字段不能为空',
          model: 'Base',
        },
      ],
      success: false,
    });
  });

  test('失败: 一层/number', async () => {
    const rules: ValidateRules = {
      age: { type: 'number', required: true, min: 18, max: 81 },
    };

    const result = await validateUtil.validate(rules, { age: 17 });

    expect(validateUtil.getLocaleRules(rules)).toEqual({
      age: [
        {
          type: 'number',
          required: true,
          path: 'age',
          min: 18,
          max: 81,
          message: '大小必须在 18 和 81 之间',
        },
      ],
    });

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'age',
          fieldValue: 17,
          message: '大小必须在 18 和 81 之间',
          model: 'Base',
        },
      ],
    });
  });

  test('失败: 一层/正则', async () => {
    const result = await validateUtil.validate(
      {
        name: { type: 'string', required: true, pattern: /^\d+$/ },
      },
      { name: 'ABC123' },
    );

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
        },
      ],
    });
  });

  test('失败: 一层/正则Key/正想', async () => {
    const result = await validateUtil.validate(
      {
        idText: { type: 'string', required: true, regexpKey: 'id-card-china' },
      },
      { idText: '11010519491231893' },
    );

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'idText',
          fieldValue: '11010519491231893',
          message: '身份证号码格式错误',
          model: 'Base',
        },
      ],
    });
  });

  test('失败: 一层/正则Key/反向', async () => {
    const result = await validateUtil.validate(
      {
        idText: { type: 'string', required: true, regexpKey: 'id-card-china', regexpReversed: true },
      },
      { idText: '11010519491231893X' },
    );

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'idText',
          fieldValue: '11010519491231893X',
          message: '不能为身份证号码格式',
          model: 'Base',
        },
      ],
    });
  });

  test('失败: 2层/number', async () => {
    const result = await validateUtil.validate(
      {
        user: {
          fields: {
            age: { type: 'number', required: true, min: 18, max: 81 },
          },
        },
      },
      { user: { age: 17 } },
    );

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'user.age',
          fieldValue: 17,
          message: '大小必须在 18 和 81 之间',
          model: 'Base',
        },
      ],
    });
  });
});

describe('validateUtil.validate() 英文', () => {
  test('失败: 一层/number', async () => {
    const result = await validateUtil.validate(
      {
        age: { type: 'number', required: true, min: 18, max: 81 },
      },
      { age: 17 },
      { lang: 'en-US' },
    );

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'age',
          fieldValue: 17,
          message: 'Must be between 18 and 81',
          model: 'Base',
        },
      ],
    });
  });
});

describe('validator', () => {
  test('失败: 一层/正则 选项', async () => {
    const validator = new Validator({
      rules: {
        name: { type: 'string', required: true, pattern: /^\d+$/ },
      },
      action: 'validate',
    });

    const result = await validator.validate({ name: 'ABC123' }, { rules: { name: { min: 12 } } });

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '长度至少为 12 个字符',
          model: 'Base',
        },
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
        },
      ],
    });
  });

  test('失败: 一层/正则 wrapRules不覆盖', async () => {
    const validator = new Validator({
      rules: {
        name: { type: 'string', required: true, pattern: /^\d+$/ },
      },
      action: 'validate',
    });

    const result = await validator.wrapRules({ rules: { name: { min: 12 } } }).validate({ name: 'ABC123' });

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '长度至少为 12 个字符',
          model: 'Base',
        },
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
        },
      ],
    });

    const result2 = await validator.validate({ name: 'ABC123' });

    expect(result2).toEqual({
      success: false,
      errors: [
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
        },
      ],
    });
  });

  test('失败: 一层/正则 wrapRules覆盖', async () => {
    const validator = new Validator({
      rules: {
        name: { type: 'string', required: true, pattern: /^\d+$/ },
      },
      action: 'validate',
    });

    const result = await validator.wrapRules({ rules: { name: { min: 12 } }, override: true }).validate({ name: 'ABC123' });

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '长度至少为 12 个字符',
          model: 'Base',
        },
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
        },
      ],
    });

    const result2 = await validator.validate({ name: 'ABC123' });

    expect(result2).toEqual({
      success: false,
      errors: [
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '长度至少为 12 个字符',
          model: 'Base',
        },
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
        },
      ],
    });
  });

  test('失败: 一层/正则', async () => {
    const rules: ValidateRules = {
      name: { type: 'string', required: true, pattern: /^\d+$/ },
    };

    const validator = new Validator({ rules, action: 'validate' });

    expect(validator.getLocaleRules()).toMatchObject({
      name: [
        {
          type: 'string',
          required: true,
          path: 'name',
          pattern: /^\d+$/,
          message: '格式不正确，不符合要求的正则表达式',
        },
      ],
    });

    const result = await validator.validate({ name: 'ABC123' });

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
        },
      ],
    });
  });
});
