import path from 'path';
import yargs from 'yargs';
import codeUtil from '../utils/code.util';

const argv = yargs.argv as any;

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

// bun esno src/scripts/code-generate.ts --template-path tests/unit/scripts/code-generate/input.ts.template --target-path tmp/input.ts --data.ClassName HappyUser
// bun esno lib/scripts/code-generate.js --template-path tests/unit/scripts/code-generate/input.ts.template --target-path tmp/input.ts --data.ClassName HappyUser
