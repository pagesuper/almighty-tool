"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var crypto_1 = tslib_1.__importDefault(require("crypto"));
var general_1 = tslib_1.__importDefault(require("../common/general"));
exports.default = {
    /** base64编码 */
    base64Encode: function (value) {
        return Buffer.from(value).toString('base64');
    },
    /** base64解码 */
    base64Decode: function (value) {
        return Buffer.from(value, 'base64').toString();
    },
    /** 生成随机的aes iv */
    generateAesIv: function (algorithm) {
        if (algorithm === void 0) { algorithm = 'aes-128-cbc'; }
        return general_1.default.generateRandomString({ length: Number(algorithm.split('-')[1]) / 8 });
    },
    /** 生成随机的aes key */
    generateAesKey: function (algorithm) {
        if (algorithm === void 0) { algorithm = 'aes-128-cbc'; }
        return general_1.default.generateRandomString({ length: Number(algorithm.split('-')[1]) / 8 });
    },
    /**
     * 加密
     *
     * iv-length: 192/8
     */
    aesEncrypt: function (data, key, iv, algorithm) {
        if (algorithm === void 0) { algorithm = 'aes-128-cbc'; }
        var cipherChunks = [];
        var cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
        cipher.setAutoPadding(true);
        cipherChunks.push(cipher.update(data, 'utf8', 'base64'));
        cipherChunks.push(cipher.final('base64'));
        return cipherChunks.join('');
    },
    /**
     * 解密
     */
    aesDecrypt: function (data, key, iv, algorithm) {
        if (algorithm === void 0) { algorithm = 'aes-128-cbc'; }
        var cipherChunks = [];
        var decipher = crypto_1.default.createDecipheriv(algorithm, key, iv);
        decipher.setAutoPadding(true);
        cipherChunks.push(decipher.update(data, 'base64', 'utf8'));
        cipherChunks.push(decipher.final('utf8'));
        return cipherChunks.join('');
    },
};
//# sourceMappingURL=crypto-util.js.map