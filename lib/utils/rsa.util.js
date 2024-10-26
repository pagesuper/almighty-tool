"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_rsa_1 = (0, tslib_1.__importDefault)(require("node-rsa"));
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
};
exports.default = rsaUtil;
//# sourceMappingURL=rsa.util.js.map