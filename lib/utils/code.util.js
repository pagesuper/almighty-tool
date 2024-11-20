"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = (0, tslib_1.__importDefault)(require("fs"));
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var handlebars_1 = (0, tslib_1.__importDefault)(require("handlebars"));
var codeUtil = {
    /**
     * 通过模板生成代码
     * @param options 生成选项
     */
    generate: function (options) {
        var variables = options.data, templatePath = options.templatePath, targetPath = options.targetPath;
        // 检查模板文件是否存在
        if (!fs_1.default.existsSync(templatePath)) {
            throw new Error("Template file not found: ".concat(templatePath));
        }
        // 确保目标目录存在
        var targetDir = path_1.default.dirname(targetPath);
        if (!fs_1.default.existsSync(targetDir)) {
            fs_1.default.mkdirSync(targetDir, { recursive: true });
        }
        // 读取模板内容
        var template = fs_1.default.readFileSync(templatePath, 'utf-8');
        // 编译模板
        var compiled = handlebars_1.default.compile(template);
        // 使用变量渲染模板
        var result = compiled(variables);
        // 写入目标文件
        fs_1.default.writeFileSync(targetPath, result, 'utf-8');
    },
};
exports.default = codeUtil;
//# sourceMappingURL=code.util.js.map