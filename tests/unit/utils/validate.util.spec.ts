import validateUtil, { ValidateSchema } from '../../../src/utils/validate.util';

describe('validateUtil.getSchema()', () => {
  test('成功', async () => {
    expect(validateUtil.getSchema({})).toBeInstanceOf(ValidateSchema);
  });
});

describe('validateUtil.validate()', () => {
  test('失败: 一层/number', async () => {
    const result = await validateUtil.validate(
      {
        age: { type: 'number', required: true, min: 18, max: 81 },
      },
      { age: 17 },
    );

    expect(result).toEqual({
      success: false,
      errors: [
        {
          field: 'age',
          fieldValue: 17,
          message: 'validate.number.must-be-between-the-range-of-numbers',
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
          message: 'validate.string.pattern-mismatch',
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
          message: 'validate.regexp-key.invalid:id-card-china',
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
          message: 'validate.regexp-key.invalid-reversed:id-card-china',
          model: 'Base',
        },
      ],
    });
  });
});
