"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_rsa_1 = (0, tslib_1.__importDefault)(require("node-rsa"));
var crypto_util_1 = (0, tslib_1.__importDefault)(require("./crypto.util"));
var rsaUtil = {
    // Base64 编码
    base64Encode: function (value) {
        return Buffer.from(value).toString('base64');
    },
    // Base64 解码
    base64Decode: function (value) {
        return Buffer.from(value, 'base64').toString();
    },
    // 私钥加密
    privateEncrypt: function (privateKey, buffer) {
        var key = new node_rsa_1.default(privateKey);
        return key.encryptPrivate(buffer, 'base64');
    },
    // 公钥解密
    publicDecrypt: function (publicKey, buffer) {
        var key = new node_rsa_1.default(publicKey);
        return key.decryptPublic(buffer, 'utf8');
    },
    // 公钥加密
    publicEncrypt: function (publicKey, buffer) {
        var key = new node_rsa_1.default(publicKey);
        return key.encrypt(buffer, 'base64');
    },
    // 私钥解密
    privateDecrypt: function (privateKey, buffer) {
        var key = new node_rsa_1.default(privateKey);
        return key.decrypt(buffer, 'utf8');
    },
    // 生成 RSA 密钥对
    generateRsaKeyPair: function (bits) {
        if (bits === void 0) { bits = 2048; }
        var key = new node_rsa_1.default({ b: bits });
        return { publicKey: key.exportKey('public'), privateKey: key.exportKey('private') };
    },
    /** 私钥加密: 对长文字进行 */
    longPrivateEncrypt: function (privateKey, buffer) {
        var _a = crypto_util_1.default.generateAesKeyAndIV(), aesKey = _a.key, aesIv = _a.iv;
        var encryptedAesKey = rsaUtil.privateEncrypt(privateKey, aesKey);
        var encryptedData = rsaUtil.joinStrings(aesIv, crypto_util_1.default.aesEncrypt(buffer.toString(), aesKey, aesIv));
        return {
            encryptedAesKey: encryptedAesKey,
            encryptedData: encryptedData,
        };
    },
    /** 公钥解密: 对长文字进行 */
    longPublicDecrypt: function (publicKey, encryptedAesKey, encryptedData) {
        var key = rsaUtil.publicDecrypt(publicKey, encryptedAesKey).toString();
        var _a = rsaUtil.splitJoinedStrings(encryptedData), iv = _a[0], encrypted = _a[1];
        return crypto_util_1.default.aesDecrypt(encrypted, key, iv);
    },
    /** 公钥加密: 对长文字进行 */
    longPublicEncrypt: function (publicKey, buffer) {
        var _a = crypto_util_1.default.generateAesKeyAndIV(), aesKey = _a.key, aesIv = _a.iv;
        var encryptedAesKey = rsaUtil.publicEncrypt(publicKey, aesKey);
        var encryptedData = rsaUtil.joinStrings(aesIv, crypto_util_1.default.aesEncrypt(buffer.toString(), aesKey, aesIv));
        return {
            encryptedAesKey: encryptedAesKey,
            encryptedData: encryptedData,
        };
    },
    /** 私钥解密: 对长文字进行 */
    longPrivatgeDecrypt: function (privateKey, encryptedAesKey, encryptedData) {
        var key = rsaUtil.privateDecrypt(privateKey, encryptedAesKey).toString();
        var _a = rsaUtil.splitJoinedStrings(encryptedData), iv = _a[0], encrypted = _a[1];
        return crypto_util_1.default.aesDecrypt(encrypted, key, iv);
    },
    joinStrings: function (txt1, txt2) {
        return [txt1, txt2].join('##');
    },
    splitJoinedStrings: function (joinedString) {
        var index = joinedString.indexOf('##');
        if (index !== -1) {
            return [joinedString.slice(0, index), joinedString.slice(index + 2)];
        }
        return [joinedString];
    },
};
exports.default = rsaUtil;
//# sourceMappingURL=rsa.util.js.map