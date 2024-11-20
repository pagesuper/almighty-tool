"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
var code_util_1 = (0, tslib_1.__importDefault)(require("../utils/code.util"));
var argv = yargs_1.default.argv;
// console.log('process.argv: ...', argv);
var templatePath = path_1.default.resolve(process.cwd(), argv.templatePath);
var targetPath = path_1.default.resolve(process.cwd(), argv.targetPath);
var data = (_a = argv.data) !== null && _a !== void 0 ? _a : {};
console.log('templatePath: ...', templatePath);
console.log('targetPath: ...', targetPath);
console.log('data: ...', targetPath);
code_util_1.default.generate({
    data: data,
    templatePath: templatePath,
    targetPath: targetPath,
});
// bun esno src/scripts/code-generate.ts --template-path tests/unit/scripts/code-generate/input.ts.template --target-path tmp/input.ts --data.ClassName HappyUser
// bun esno lib/scripts/code-generate.js --template-path tests/unit/scripts/code-generate/input.ts.template --target-path tmp/input.ts --data.ClassName HappyUser
//# sourceMappingURL=code-generate.js.map