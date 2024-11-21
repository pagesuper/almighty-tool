// only for local test

import path from 'path';
import codeUtil from '../../../src/utils/code.util';

const argv = codeUtil.getArgv();

console.log('process.argv: ...', argv);

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

// bun tsx tests/unit/scripts/code-generate.ts --template-path tests/unit/scripts/templates/input.ts.template --target-path tmp/input.ts --data.ClassName HappyUser --data.User.name Happy
