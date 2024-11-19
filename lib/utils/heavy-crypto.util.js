"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var crypto_1 = (0, tslib_1.__importDefault)(require("crypto"));
var node_rsa_1 = (0, tslib_1.__importDefault)(require("node-rsa"));
var uuid_1 = require("uuid");
/**
 * 这个heavyCryptoUtil与cryptoUtil的区别是: heavyCryptoUtil 用到了node 里的crypto, 并且heavyCryptoUtil 有 rsa 非对称加密算法。
 * 两个 util 不要同时引入，heavyCryptoUtil 的体积要比cryptoUtil 大很多。如果不需要 rsa 加密，就用cryptoUtil 就好了。
 */
var heavyCryptoUtil = {
    /** 获取 uuid */
    uuid: function () {
        return (0, uuid_1.v4)();
    },
    /** 获取md5摘要 */
    md5: function (value, encoding) {
        if (encoding === void 0) { encoding = 'hex'; }
        return crypto_1.default.createHash('md5').update(value).digest(encoding);
    },
    /** 获取hmac摘要 */
    hmac: function (key, bytes, algorithm) {
        if (algorithm === void 0) { algorithm = 'sha256'; }
        var hmac = crypto_1.default.createHmac(algorithm, key);
        hmac.update(bytes);
        return hmac.digest('hex');
    },
    /** 获取sha1摘要 */
    sha1: function (value, encoding) {
        if (encoding === void 0) { encoding = 'hex'; }
        return crypto_1.default.createHash('sha1').update(value).digest(encoding);
    },
    /** 获取sha384摘要 */
    sha384: function (value, encoding) {
        if (encoding === void 0) { encoding = 'hex'; }
        return crypto_1.default.createHash('sha384').update(value).digest(encoding);
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
    /** 生成密钥对 */
    generateAesKeyAndIV: function (algorithm) {
        if (algorithm === void 0) { algorithm = 'aes-128-cbc'; }
        return {
            key: heavyCryptoUtil.generateRandomString(Number(algorithm.split('-')[1]) / 8),
            iv: heavyCryptoUtil.generateRandomString(Number(algorithm.split('-')[1]) / 8),
        };
    },
    /** 生成随机的字符串 */
    generateRandomString: function (length) {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters[randomIndex];
        }
        return randomString;
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
    // Base64 编码
    base64Encode: function (value) {
        return Buffer.from(value).toString('base64');
    },
    // Base64 解码
    base64Decode: function (value) {
        return Buffer.from(value, 'base64').toString();
    },
    // 以下是rsa相关的方法
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
        var _a = heavyCryptoUtil.generateAesKeyAndIV(), aesKey = _a.key, aesIv = _a.iv;
        var encryptedAesKey = heavyCryptoUtil.privateEncrypt(privateKey, aesKey);
        var encryptedData = heavyCryptoUtil.joinStrings(aesIv, heavyCryptoUtil.aesEncrypt(buffer.toString(), aesKey, aesIv));
        return {
            encryptedAesKey: encryptedAesKey,
            encryptedData: encryptedData,
        };
    },
    /** 公钥解密: 对长文字进行 */
    longPublicDecrypt: function (publicKey, encryptedAesKey, encryptedData) {
        var key = heavyCryptoUtil.publicDecrypt(publicKey, encryptedAesKey).toString();
        var _a = heavyCryptoUtil.splitJoinedStrings(encryptedData), iv = _a[0], encrypted = _a[1];
        return heavyCryptoUtil.aesDecrypt(encrypted, key, iv);
    },
    /** 公钥加密: 对长文字进行 */
    longPublicEncrypt: function (publicKey, buffer) {
        var _a = heavyCryptoUtil.generateAesKeyAndIV(), aesKey = _a.key, aesIv = _a.iv;
        var encryptedAesKey = heavyCryptoUtil.publicEncrypt(publicKey, aesKey);
        var encryptedData = heavyCryptoUtil.joinStrings(aesIv, heavyCryptoUtil.aesEncrypt(buffer.toString(), aesKey, aesIv));
        return {
            encryptedAesKey: encryptedAesKey,
            encryptedData: encryptedData,
        };
    },
    /** 私钥解密: 对长文字进行 */
    longPrivatgeDecrypt: function (privateKey, encryptedAesKey, encryptedData) {
        var key = heavyCryptoUtil.privateDecrypt(privateKey, encryptedAesKey).toString();
        var _a = heavyCryptoUtil.splitJoinedStrings(encryptedData), iv = _a[0], encrypted = _a[1];
        return heavyCryptoUtil.aesDecrypt(encrypted, key, iv);
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
exports.default = heavyCryptoUtil;
//# sourceMappingURL=heavy-crypto.util.js.map