"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var crypto_1 = (0, tslib_1.__importDefault)(require("crypto"));
var deepmerge_1 = (0, tslib_1.__importDefault)(require("deepmerge"));
var shortRsaUtil = {
    // 私钥加密
    privateEncrypt: function (privateKey, buffer) {
        var key = typeof privateKey === 'string' ? Buffer.from(privateKey) : privateKey;
        return crypto_1.default.privateEncrypt(key, Buffer.from(buffer)).toString('base64');
    },
    // 公钥解密
    publicDecrypt: function (publicKey, buffer) {
        var key = typeof publicKey === 'string' ? Buffer.from(publicKey) : publicKey;
        return crypto_1.default.publicDecrypt(key, Buffer.from(buffer.toString(), 'base64')).toString();
    },
    // 公钥加密
    publicEncrypt: function (publicKey, buffer) {
        var key = typeof publicKey === 'string' ? Buffer.from(publicKey) : publicKey;
        return crypto_1.default.publicEncrypt(key, Buffer.from(buffer)).toString('base64');
    },
    // 私钥解密
    privateDecrypt: function (privateKey, buffer) {
        var key = typeof privateKey === 'string' ? Buffer.from(privateKey) : privateKey;
        return crypto_1.default.privateDecrypt(key, Buffer.from(buffer.toString(), 'base64')).toString();
    },
    // 生成 RSA 密钥对
    generateRsaKeyPair: function (options) {
        if (options === void 0) { options = {}; }
        var defaultOptions = {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        };
        var mergedOptions = (0, deepmerge_1.default)(defaultOptions, options);
        var _a = crypto_1.default.generateKeyPairSync('rsa', mergedOptions), publicKey = _a.publicKey, privateKey = _a.privateKey;
        return { publicKey: "".concat(publicKey), privateKey: "".concat(privateKey) };
    },
};
exports.default = shortRsaUtil;
//# sourceMappingURL=short-rsa.util.js.map