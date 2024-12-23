import validateUtil, {
  ValidateInternalRuleItem,
  ValidateRules,
  ValidateSchema,
  Validator,
} from '../../../src/utils/validate.util';

// describe('validateUtil.getSchema()', () => {
//   test('成功', async () => {
//     expect(validateUtil.getSchema({})).toBeInstanceOf(ValidateSchema);
//   });
// });

// describe('validateUtil.validate()', () => {
//   test('成功: empty', async () => {
//     const result = await validateUtil.validate({}, {});
//     expect(result).toEqual({ success: true });
//   });

//   test('成功: 单个字段', async () => {
//     const result = await validateUtil.validate({ name: { type: 'string', required: true } }, { name: '' });

//     expect(result).toEqual({
//       success: false,
//       errors: [
//         {
//           field: 'name',
//           fieldValue: '',
//           message: 'name is required',
//           model: 'Base',
//         },
//       ],
//     });
//   });

//   test('成功: 多个字段', async () => {
//     const result = await validateUtil.validate(
//       {
//         name: { type: 'string', required: true },
//         age: { type: 'number', required: true },
//       },
//       { name: 'jack', age: 18 },
//     );

//     expect(result).toEqual({
//       success: true,
//     });
//   });

//   test('成功: 嵌套', async () => {
//     const result = await validateUtil.validate(
//       {
//         user: {
//           type: 'object',
//           required: true,
//           fields: {
//             name: { type: 'string', required: true },
//           },
//         },
//       },
//       { user: { name: '' } },
//     );

//     expect(result).toEqual({
//       success: false,
//       errors: [
//         {
//           message: 'user.name is required',
//           fieldValue: '',
//           field: 'user.name',
//           model: 'Base',
//         },
//       ],
//     });
//   });

//   test('成功: 异步', async () => {
//     const rules: ValidateRules = {
//       user: {
//         type: 'object',
//         required: true,
//         fields: {
//           name: { type: 'string', required: true },
//           age: [
//             {
//               type: 'number',
//               required: true,
//             },
//             {
//               type: 'number',
//               asyncValidator: (rule: ValidateInternalRuleItem, value) => {
//                 return new Promise((resolve, reject) => {
//                   if (value < 18) {
//                     reject(new Error('too young'));
//                   } else {
//                     resolve();
//                   }
//                 });
//               },
//             },
//           ],
//         },
//       },
//     };

//     const result1 = await validateUtil.validate(rules, { user: { name: 'Haha', age: 17 } });

//     expect(result1).toEqual({
//       success: false,
//       errors: [
//         {
//           field: 'user.age',
//           fieldValue: 17,
//           message: 'too young',
//           model: 'Base',
//         },
//       ],
//     });

//     const result2 = await validateUtil.validate(rules, { user: { name: 'Haha' } });

//     expect(result2).toEqual({
//       success: false,
//       errors: [
//         {
//           field: 'user.age',
//           fieldValue: undefined,
//           message: 'user.age is required',
//           model: 'Base',
//         },
//       ],
//     });

//     const result3 = await validateUtil.validate(rules, { user: { name: 'Haha' } }, { model: 'User' });

//     expect(result3).toEqual({
//       success: false,
//       errors: [
//         {
//           field: 'user.age',
//           fieldValue: undefined,
//           message: 'user.age is required',
//           model: 'User',
//         },
//       ],
//     });
//   });

//   test('成功: 异步 other error', async () => {
//     const rules: ValidateRules = {
//       user: {
//         type: 'object',
//         required: true,
//         fields: {
//           name: { type: 'string', required: true },
//           age: [
//             {
//               type: 'number',
//               required: true,
//             },
//             {
//               type: 'number',
//               asyncValidator: (rule: ValidateInternalRuleItem, value) => {
//                 return new Promise((resolve, reject) => {
//                   if (value < 18) {
//                     reject(new Error('too young'));
//                   } else {
//                     resolve();
//                   }
//                 });
//               },
//             },
//           ],
//         },
//       },
//     };

//     const result1 = await validateUtil.validate(rules, { user: { name: 'Haha', age: 17 } });

//     expect(result1).toEqual({
//       success: false,
//       errors: [
//         {
//           field: 'user.age',
//           fieldValue: 17,
//           message: 'too young',
//           model: 'Base',
//         },
//       ],
//     });
//   });
// });

describe('Validator', () => {
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

});

