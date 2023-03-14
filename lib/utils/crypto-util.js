"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var crypto_1 = tslib_1.__importDefault(require("crypto"));
var general_1 = tslib_1.__importDefault(require("../common/general"));
var uuid_1 = tslib_1.__importDefault(require("uuid"));
/**
 * http://nodejs.cn/api/crypto.html
 */
exports.default = {
    generateUUID: function (type) {
        if (type === void 0) { type = 'v4'; }
        switch (type) {
            case 'v1':
                return uuid_1.default.v1();
            case 'v4':
            default:
                return uuid_1.default.v4();
        }
    },
    /** 获取md5摘要 */
    md5: function (value, encoding) {
        if (encoding === void 0) { encoding = 'hex'; }
        return crypto_1.default.createHash('md5').update(value).digest(encoding);
    },
    /** 获取sha256摘要 */
    sha256: function (value, encoding) {
        if (encoding === void 0) { encoding = 'hex'; }
        return crypto_1.default.createHash('sha256').update(value).digest(encoding);
    },
    /** 获取sha512摘要 */
    sha512: function (value, encoding) {
        if (encoding === void 0) { encoding = 'hex'; }
        return crypto_1.default.createHash('sha512').update(value).digest(encoding);
    },
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
        return general_1.default.generateRandomString({
            length: Number(algorithm.split('-')[1]) / 8,
        });
    },
    /** 生成随机的aes key */
    generateAesKey: function (algorithm) {
        if (algorithm === void 0) { algorithm = 'aes-128-cbc'; }
        return general_1.default.generateRandomString({
            length: Number(algorithm.split('-')[1]) / 8,
        });
    },
    /** 生成随机的字节 */
    generateRandomBytes: function (bytes) {
        if (bytes === void 0) { bytes = 16; }
        return crypto_1.default.randomBytes(bytes);
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