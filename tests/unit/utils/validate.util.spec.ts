import validateUtil, { ValidateOptionRules, ValidateRules, ValidateSchema, Validator } from '../../../src/utils/validate.util';

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
      values: { name: '' },
      errors: [
        {
          field: 'name',
          fieldValue: '',
          message: '字段不能为空',
          model: 'Base',
          data: {
            message: 'validate.default.field-is-required',
            rules: {
              required: true,
            },
          },
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
          data: {
            message: 'validate.default.field-is-required',
            rules: {
              required: true,
              type: 'number',
            },
          },
          message: '字段不能为空',
          path: 'age',
          required: true,
          type: 'number',
        },
        {
          data: {
            message: 'validate.number.must-be-between-the-range-of-numbers',
            rules: {
              max: 81,
              min: 18,
              required: true,
              type: 'number',
            },
          },
          max: 81,
          message: '大小必须在 18 和 81 之间',
          min: 18,
          path: 'age',
          required: true,
          type: 'number',
        },
      ],
    });

    expect(result).toEqual({
      success: false,
      values: { age: 17 },
      errors: [
        {
          field: 'age',
          fieldValue: 17,
          message: '大小必须在 18 和 81 之间',
          model: 'Base',
          data: {
            message: 'validate.number.must-be-between-the-range-of-numbers',
            rules: {
              max: 81,
              min: 18,
              required: true,
              type: 'number',
            },
          },
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
      values: { name: 'ABC123' },
      errors: [
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
          data: {
            message: 'validate.string.pattern-mismatch',
            rules: {
              pattern: '/^\\d+$/',
              required: true,
              type: 'string',
            },
          },
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
      values: { idText: '11010519491231893' },
      errors: [
        {
          field: 'idText',
          fieldValue: '11010519491231893',
          message: '身份证号码格式错误',
          model: 'Base',
          data: {
            message: 'validate.regexp-key.invalid:id-card-china',
            rules: {
              regexpKey: 'id-card-china',
              required: true,
              type: 'string',
            },
          },
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
      values: { idText: '11010519491231893X' },
      errors: [
        {
          field: 'idText',
          fieldValue: '11010519491231893X',
          message: '不能为身份证号码格式',
          model: 'Base',
          data: {
            message: 'validate.regexp-key.invalid-reversed:id-card-china',
            rules: {
              regexpKey: 'id-card-china',
              regexpReversed: true,
              required: true,
              type: 'string',
            },
          },
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
      values: { user: { age: 17 } },
      errors: [
        {
          field: 'user.age',
          fieldValue: 17,
          message: '大小必须在 18 和 81 之间',
          model: 'Base',
          data: {
            rules: {
              min: 18,
              max: 81,
              required: true,
              type: 'number',
            },
            message: 'validate.number.must-be-between-the-range-of-numbers',
          },
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
      values: { age: 17 },
      errors: [
        {
          field: 'age',
          fieldValue: 17,
          message: 'Must be between 18 and 81',
          model: 'Base',
          data: {
            rules: {
              min: 18,
              max: 81,
              required: true,
              type: 'number',
            },
            message: 'validate.number.must-be-between-the-range-of-numbers',
          },
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
      values: { name: 'ABC123' },
      errors: [
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '长度至少为 12 个字符',
          model: 'Base',
          data: {
            rules: {
              min: 12,
            },
            message: 'validate.string.must-be-at-least-characters',
          },
        },
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
          data: {
            rules: {
              pattern: '/^\\d+$/',
              required: true,
              type: 'string',
            },
            message: 'validate.string.pattern-mismatch',
          },
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
      values: { name: 'ABC123' },
      errors: [
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '长度至少为 12 个字符',
          model: 'Base',
          data: {
            rules: {
              min: 12,
            },
            message: 'validate.string.must-be-at-least-characters',
          },
        },
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
          data: {
            rules: {
              pattern: '/^\\d+$/',
              required: true,
              type: 'string',
            },
            message: 'validate.string.pattern-mismatch',
          },
        },
      ],
    });

    const result2 = await validator.validate({ name: 'ABC123' });

    expect(result2).toEqual({
      success: false,
      values: { name: 'ABC123' },
      errors: [
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
          data: {
            rules: {
              pattern: '/^\\d+$/',
              required: true,
              type: 'string',
            },
            message: 'validate.string.pattern-mismatch',
          },
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
      values: { name: 'ABC123' },
      errors: [
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '长度至少为 12 个字符',
          model: 'Base',
          data: {
            rules: {
              min: 12,
            },
            message: 'validate.string.must-be-at-least-characters',
          },
        },
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
          data: {
            rules: {
              pattern: '/^\\d+$/',
              required: true,
              type: 'string',
            },
            message: 'validate.string.pattern-mismatch',
          },
        },
      ],
    });

    const result2 = await validator.validate({ name: 'ABC123' });

    expect(result2).toEqual({
      success: false,
      values: { name: 'ABC123' },
      errors: [
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '长度至少为 12 个字符',
          model: 'Base',
          data: {
            rules: {
              min: 12,
            },
            message: 'validate.string.must-be-at-least-characters',
          },
        },
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
          data: {
            rules: {
              pattern: '/^\\d+$/',
              required: true,
              type: 'string',
            },
            message: 'validate.string.pattern-mismatch',
          },
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
          data: {
            message: 'validate.default.field-is-required',
            rules: {
              required: true,
              type: 'string',
            },
          },
          message: '字段不能为空',
          path: 'name',
          required: true,
          type: 'string',
        },
        {
          data: {
            message: 'validate.string.pattern-mismatch',
            rules: {
              pattern: '/^\\d+$/',
              required: true,
              type: 'string',
            },
          },
          message: '格式不正确，不符合要求的正则表达式',
          path: 'name',
          pattern: /^\d+$/,
          type: 'string',
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
          data: {
            rules: {
              pattern: '/^\\d+$/',
              required: true,
              type: 'string',
            },
            message: 'validate.string.pattern-mismatch',
          },
        },
      ],
      values: { name: 'ABC123' },
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
          data: {
            rules: {
              min: 12,
            },
            message: 'validate.string.must-be-at-least-characters',
          },
        },
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
          data: {
            rules: {
              pattern: '/^\\d+$/',
              required: true,
              type: 'string',
            },
            message: 'validate.string.pattern-mismatch',
          },
        },
      ],
      values: { name: 'ABC123' },
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
          data: {
            rules: {
              min: 12,
            },
            message: 'validate.string.must-be-at-least-characters',
          },
        },
        {
          field: 'name',
          fieldValue: 'ABC123',
          message: '格式不正确，不符合要求的正则表达式',
          model: 'Base',
          data: {
            rules: {
              pattern: '/^\\d+$/',
              required: true,
              type: 'string',
            },
            message: 'validate.string.pattern-mismatch',
          },
        },
      ],
      values: { name: 'ABC123' },
    });
  });

  test('失败: 一层/正则, omitRules', async () => {
    const rules: ValidateRules = {
      name: { type: 'string', required: true, pattern: /^\d+$/ },
      age: { type: 'number', required: true, min: 18, max: 81 },
    };

    const validator = new Validator({ rules, action: 'validate' });

    expect(Object.keys(validator.getLocaleRules())).toEqual(['name', 'age']);
    expect(Object.keys(validator.omitRules({ fieldKeys: ['age'] }).getLocaleRules())).toEqual(['name']);
  });

  test('成功: 合并设置', async () => {
    const rules: ValidateRules = {
      name: { type: 'string', required: true },
      age: { type: 'number', required: true, min: 18, max: 81 },
    };

    const validator = new Validator({ rules, action: 'validate' });
    validator.mergeSettings({ name: { disabled: true } });
    expect(validator.getLocaleRules()).toEqual({
      age: [
        {
          data: {
            message: 'validate.default.field-is-required',
            rules: {
              required: true,
              type: 'number',
            },
          },
          message: '字段不能为空',
          path: 'age',
          required: true,
          type: 'number',
        },
        {
          data: {
            message: 'validate.number.must-be-between-the-range-of-numbers',
            rules: {
              max: 81,
              min: 18,
              required: true,
              type: 'number',
            },
          },
          max: 81,
          message: '大小必须在 18 和 81 之间',
          min: 18,
          path: 'age',
          required: true,
          type: 'number',
        },
      ],
    });

    const result = await validator.validate({ name: 'Jack', age: 12 });
    expect(result).toEqual({
      errors: [
        {
          data: {
            message: 'validate.number.must-be-between-the-range-of-numbers',
            rules: {
              max: 81,
              min: 18,
              required: true,
              type: 'number',
            },
          },
          field: 'age',
          fieldValue: 12,
          message: '大小必须在 18 和 81 之间',
          model: 'Base',
        },
      ],
      success: false,
      values: {
        age: 12,
        name: 'Jack',
      },
    });

    validator.mergeSettings({ name: { disabled: false }, age: { disabled: true } });
    const result2 = await validator.validate({ age: 12 });
    expect(result2).toEqual({
      errors: [
        {
          data: {
            message: 'validate.default.field-is-required',
            rules: {
              required: true,
              type: 'string',
            },
          },
          field: 'name',
          fieldValue: undefined,
          message: '字段不能为空',
          model: 'Base',
        },
      ],
      success: false,
      values: {
        age: 12,
      },
    });
  });
});

describe('direction', () => {
  test('成功: 方向, 前缀prefix', async () => {
    const result = validateUtil.parseRules({ name: { min: 12 } }, { name: { min: 10 } }, { direction: 'prefix' });
    expect(result).toEqual({
      name: [
        {
          message: 'json:{"rules":{"min":12},"message":"validate.string.must-be-at-least-characters"}',
          min: 12,
          path: 'name',
          type: 'string',
        },
        {
          min: 10,
          message: 'json:{"rules":{"min":10},"message":"validate.string.must-be-at-least-characters"}',
          path: 'name',
          type: 'string',
        },
      ],
    });
  });

  test('成功: 方向, 后缀suffix', async () => {
    const result = validateUtil.parseRules({ name: { min: 12 } }, { name: { min: 10 } }, { direction: 'suffix' });
    expect(result).toEqual({
      name: [
        {
          min: 10,
          message: 'json:{"rules":{"min":10},"message":"validate.string.must-be-at-least-characters"}',
          path: 'name',
          type: 'string',
        },
        {
          message: 'json:{"rules":{"min":12},"message":"validate.string.must-be-at-least-characters"}',
          min: 12,
          path: 'name',
          type: 'string',
        },
      ],
    });
  });
});

describe('transform', () => {
  test('成功: 转换', async () => {
    const validator = new Validator({
      rules: {
        name: { type: 'string', min: 6 },
        user: {
          fields: {
            name: { type: 'string', min: 6 },
          },
        },
      },
      action: 'validate',
    });

    const result = await validator.validate({ name: '  AB12', user: { name: '  AB45' } });

    expect(result).toEqual({
      success: true,
      values: { name: '  AB12', user: { name: '  AB45' } },
    });

    const result2 = await validator
      .wrapRules({
        rules: {
          name: {
            transformers: ['trim'],
          },
          user: {
            fields: {
              name: { transformers: ['trim'] },
            },
          },
        },
        direction: 'prefix',
      })
      .validate({ name: '  AB12', user: { name: '  AB45' } });

    expect(result2).toEqual({
      success: false,
      values: { name: 'AB12', user: { name: 'AB45' } },
      errors: [
        {
          field: 'name',
          fieldValue: 'AB12',
          message: '长度至少为 6 个字符',
          model: 'Base',
          data: {
            message: 'validate.string.must-be-at-least-characters',
            rules: {
              min: 6,
              type: 'string',
            },
          },
        },
      ],
    });
  });
});

describe('transform: array', () => {
  test('成功: 转换', async () => {
    const validator = new Validator({
      rules: {
        names: { type: 'array' },
      },
      action: 'validate',
    });

    const result = await validator
      .wrapRules({
        rules: {
          names: {
            type: 'array',
            defaultField: {
              type: 'string',
              transform: (value) => {
                return (value ?? '').trim();
              },
            },
          },
        },
      })
      .validate({ names: ['  AB12', '  AB45'] });

    expect(result).toEqual({
      success: true,
      values: { names: ['AB12', 'AB45'] },
    });
  });

  test('成功: 未转换', async () => {
    const validator = new Validator({
      rules: {
        users: {
          type: 'array',
          fields: {
            name: { type: 'string', min: 6 },
          },
        },
      },
      action: 'validate',
    });

    const result = await validator.validate({ users: [{ name: ' AB12' }, { name: ' AB45' }] });

    expect(result).toEqual({
      success: true,
      values: { users: [{ name: ' AB12' }, { name: ' AB45' }] },
    });
  });

  test('成功: 对象数组转换', async () => {
    const validator = new Validator({
      rules: {
        users: {
          type: 'array',
          defaultField: {
            type: 'object',
            fields: {
              name: { type: 'string', min: 6 },
            },
          },
        },
      },
      action: 'validate',
    });

    const result = await validator
      .wrapRules({
        rules: {
          users: {
            type: 'array',
            defaultField: {
              type: 'object',
              fields: {
                name: [
                  {
                    type: 'string',
                    transform: (value) => {
                      if (value) {
                        return value.trim();
                      }

                      return value;
                    },
                  },
                ],
              },
            },
          },
        },
      })
      .validate({ users: [{ name: '  AB12' }, { name: '  AB45' }] });

    expect(result).toEqual({
      success: true,
      values: { users: [{ name: 'AB12' }, { name: 'AB45' }] },
    });
  });
});

describe('validateUtil.parseRules()', () => {
  test('成功: 一层/规则拆分/required', async () => {
    const rules = {
      name: { required: true },
    };

    const newRules = await validateUtil.parseRules(rules);

    expect(newRules).toEqual({
      name: [
        {
          message: 'json:{"rules":{"required":true},"message":"validate.default.field-is-required"}',
          path: 'name',
          required: true,
          type: 'string',
        },
      ],
    });
  });

  test('成功: 一层/规则拆分/required', async () => {
    const rules = {
      name: {
        required: true,
        min: 4,
        max: 20,
      },
    };

    const newRules = await validateUtil.parseRules(rules);

    expect(newRules).toEqual({
      name: [
        {
          message: 'json:{"rules":{"required":true},"message":"validate.default.field-is-required"}',
          path: 'name',
          required: true,
          type: 'string',
        },
        {
          max: 20,
          message:
            'json:{"rules":{"min":4,"max":20,"required":true},"message":"validate.string.must-be-between-the-range-of-characters"}',
          min: 4,
          path: 'name',
          required: true,
          type: 'string',
        },
      ],
    });
  });
});

describe('validateUtil.validate() with omitKeys', () => {
  test('成功: 一层/必须', async () => {
    const rules: ValidateOptionRules = {
      name: { required: true },
      age: { required: true },
      student: {
        type: 'object',
        fields: {
          name: { required: true },
        },
      },
    };

    const result = await validateUtil.validate(rules, { name: 'Jack', age: 12 }, { omitKeys: ['age'] });

    expect(result).toEqual({
      errors: [
        {
          data: {
            message: 'validate.default.field-is-required',
            rules: {
              required: true,
            },
          },
          field: 'age',
          fieldValue: undefined,
          message: '字段不能为空',
          model: 'Base',
        },
      ],
      success: false,
      values: {
        name: 'Jack',
      },
    });
  });
});

describe('validateUtil.validate() with pickKeys', () => {
  test('成功: 一层/必须', async () => {
    const rules: ValidateOptionRules = {
      name: { required: true },
      age: { required: true },
      student: {
        type: 'object',
        fields: {
          name: { required: true },
          age: { required: true, type: 'number' },
        },
      },
    };

    const result = await validateUtil.validate(rules, { name: 'Jack', age: 12 }, { pickKeys: ['name'] });

    expect(result).toEqual({
      errors: [
        {
          data: {
            message: 'validate.default.field-is-required',
            rules: {
              required: true,
            },
          },
          field: 'age',
          fieldValue: undefined,
          message: '字段不能为空',
          model: 'Base',
        },
      ],
      success: false,
      values: {
        name: 'Jack',
      },
    });
  });
});

describe('validateUtil.parseRule()', () => {
  test('成功: 转换', async () => {
    const rules: ValidateOptionRules = { name: { transformers: ['trim', 'firstLetterUpper'], max: 4 } };
    const result = await validateUtil.validate(rules, { name: '  jck1' });

    expect(result).toEqual({
      success: true,
      values: {
        name: 'Jck1',
      },
    });
  });
});

describe('validateUtil.parseRule() trigger', () => {
  test('成功: 转换', async () => {
    const rules = await validateUtil.parseRules({ name: { trigger: 'change' } });

    expect(rules).toEqual({
      name: [
        {
          message: undefined,
          path: 'name',
          trigger: 'change',
          type: 'string',
        },
      ],
    });
  });
});

describe('validateUtil.filterRules()', () => {
  test('成功: 过滤', async () => {
    const rules: ValidateRules = {
      name: [
        {
          required: true,
        },
      ],
      student: [
        {
          required: true,
          fields: {
            name: {
              required: true,
            },
          },
        },
      ],
      users: {
        type: 'array',
        defaultField: {
          type: 'object',
          fields: {
            name: [
              {
                type: 'string',
                required: true,
              },
            ],
          },
        },
      },
    };

    const result = await validateUtil.validate(
      rules,
      {
        name: 'Jack',
        // student: { name: 'Tom' },
        // users: [{ name: 'John' }, { name: 'Jane' }],
        // users: [{}, { name: '' }],
      },
      {
        settings: {
          name: { disabled: true },
          student: { disabled: true },
          // 'student.name': { disabled: true },
          // 'users.name': { disabled: true },
        },
      },
    );

    expect(result).toEqual({
      success: true,
      values: {
        name: 'Jack',
      },
    });
  });
});

describe('validateUtil.getRules()', () => {
  test('成功: 获取校验规则', async () => {
    const rulesOptions: ValidateRules = {
      name: { required: true },
      student: {
        type: 'object',
        fields: {
          name: { required: true },
        },
      },
      users: {
        type: 'array',
        defaultField: {
          type: 'object',
          fields: {
            name: { required: true },
            age: { min: 18 },
          },
        },
      },
    };

    const rules = validateUtil.getRules(rulesOptions);

    expect(rules).toEqual({
      name: [
        {
          message: 'json:{"rules":{"required":true},"message":"validate.default.field-is-required"}',
          path: 'name',
          required: true,
          type: 'string',
        },
      ],
      student: [
        {
          fields: {
            name: [
              {
                message: 'json:{"rules":{"required":true},"message":"validate.default.field-is-required"}',
                path: 'student.name',
                required: true,
                type: 'string',
              },
            ],
          },
          message: undefined,
          path: 'student',
          type: 'object',
        },
      ],
      users: [
        {
          defaultField: {
            fields: {
              age: [
                {
                  message: 'json:{"rules":{"min":18},"message":"validate.string.must-be-at-least-characters"}',
                  min: 18,
                  path: 'users.age',
                  type: 'string',
                },
              ],
              name: [
                {
                  message: 'json:{"rules":{"required":true},"message":"validate.default.field-is-required"}',
                  path: 'users.name',
                  required: true,
                  type: 'string',
                },
              ],
            },
            path: 'users',
            type: 'object',
          },
          message: undefined,
          path: 'users',
          type: 'array',
        },
      ],
    });

    const rules2 = validateUtil.getRules(rulesOptions, {
      settings: {
        name: { disabled: true },
        'student.name': { disabled: true },
        'users.name': { disabled: true },
      },
    });

    expect(rules2).toEqual({
      student: [
        {
          fields: {},
          message: undefined,
          path: 'student',
          type: 'object',
        },
      ],
      users: [
        {
          defaultField: {
            fields: {
              age: [
                {
                  message: 'json:{"rules":{"min":18},"message":"validate.string.must-be-at-least-characters"}',
                  min: 18,
                  path: 'users.age',
                  type: 'string',
                },
              ],
            },
            path: 'users',
            type: 'object',
          },
          message: undefined,
          path: 'users',
          type: 'array',
        },
      ],
    });
  });
});

describe('validateUtil.validate()', () => {
  test('成功: 获取校验规则 with enum', async () => {
    const rules = await validateUtil.validate({ type: { type: 'enum', enum: [1, 2, 3], required: true } }, { type: 34 });
    expect(rules).toEqual({
      errors: [
        {
          data: {
            message: 'validate.default.field-must-be-enum',
            rules: {
              enum: [1, 2, 3],
              required: true,
              type: 'enum',
            },
          },
          field: 'type',
          fieldValue: 34,
          message: '字段必须为列表中的值',
          model: 'Base',
        },
      ],
      success: false,
      values: {
        type: 34,
      },
    });
  });
});
