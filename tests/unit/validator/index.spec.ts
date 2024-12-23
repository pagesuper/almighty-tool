import { validatorUtils } from '../../../src/validator';

describe('utils', () => {
  test('get rule', () => {
    const rule = validatorUtils.getRule({ regexpKey: 'url' });

    expect(rule.type).toBe('string');
    expect(rule.message).toBe('Invalid:url');
  });

  test('get rule: reversed', () => {
    const rule = validatorUtils.getRule({ regexpKey: 'url', regexpReversed: true });

    expect(rule.type).toBe('string');
    expect(rule.message).toBe('InvalidReversed:url');
  });
});
