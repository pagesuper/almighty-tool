// only for local test

import path from 'path';
import yargs from 'yargs';
import codeUtil from '../../../src/utils/code.util';

const argv = yargs(process.argv.slice(2)).argv as any;

// console.log('process.argv: ...', argv);

const templatePath = path.resolve(process.cwd(), argv.templatePath);
const targetPath = path.resolve(process.cwd(), argv.targetPath);
const data = argv.data ?? {};

console.log('templatePath: ...', templatePath);
console.log('targetPath: ...', targetPath);
console.log('data: ...', targetPath);

codeUtil.generate({
  data,
  templatePath,
  targetPath,
});

// bun esno tests/unit/scripts/code-generate.ts --template-path tests/unit/scripts/templates/input.ts.template --target-path tmp/input.ts --data.ClassName HappyUser --data.User.name Happy
