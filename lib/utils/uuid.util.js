"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidUtils = void 0;
var uuidUtils = {
    v4: function () {
        // 生成标准UUID格式 (xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
        var chars = '0123456789abcdef'.split('');
        var uuid = '';
        for (var i = 0; i < 36; i++) {
            if (i === 8 || i === 13 || i === 18 || i === 23) {
                uuid += '-';
            }
            else if (i === 14) {
                uuid += '4';
            }
            else if (i === 19) {
                uuid += chars[(Math.floor(Math.random() * 4) + 8) % 16];
            }
            else {
                uuid += chars[Math.floor(Math.random() * 16)];
            }
        }
        return uuid;
    },
};
exports.uuidUtils = uuidUtils;
exports.default = uuidUtils;
//# sourceMappingURL=uuid.util.js.map