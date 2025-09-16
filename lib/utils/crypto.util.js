"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_forge_1 = tslib_1.__importDefault(require("node-forge"));
var uuid_1 = require("uuid");
var random_util_1 = tslib_1.__importDefault(require("./random.util"));
var DEFAULT_KEY_ENCRYPTION_SCHEME = 'RSA-OAEP';
var DEFAULT_CIPHER_ALGORITHM = 'AES-CBC';
var DEFAULT_JOIN_SEPARATOR = '::';
var cryptoUtil = {
    /** 获取 uuid */
    uuid: function () {
        return (0, uuid_1.v4)();
    },
    /** 获取md5摘要 */
    md5: function (value) {
        var md5 = node_forge_1.default.md.md5.create();
        md5.update(node_forge_1.default.util.encodeUtf8(value));
        return md5.digest().toHex();
    },
    /** 获取hmac摘要 */
    hmac: function (key, bytes, md) {
        if (md === void 0) { md = 'sha256'; }
        var hmac = node_forge_1.default.hmac.create();
        hmac.start(md, typeof key === 'string' ? node_forge_1.default.util.encodeUtf8(key) : key);
        hmac.update(node_forge_1.default.util.encodeUtf8(bytes));
        return hmac.digest().toHex();
    },
    /** 获取sha1摘要 */
    sha1: function (value) {
        var sha1 = node_forge_1.default.md.sha1.create();
        sha1.update(node_forge_1.default.util.encodeUtf8(value));
        return sha1.digest().toHex();
    },
    /** 获取sha256摘要 */
    sha256: function (value) {
        var sha256 = node_forge_1.default.md.sha256.create();
        sha256.update(node_forge_1.default.util.encodeUtf8(value));
        return sha256.digest().toHex();
    },
    /** 获取sha384摘要 */
    sha384: function (value) {
        var sha384 = node_forge_1.default.md.sha384.create();
        sha384.update(node_forge_1.default.util.encodeUtf8(value));
        return sha384.digest().toHex();
    },
    /** 获取sha512摘要 */
    sha512: function (value) {
        var sha512 = node_forge_1.default.md.sha512.create();
        sha512.update(node_forge_1.default.util.encodeUtf8(value));
        return sha512.digest().toHex();
    },
    /** base64编码 */
    base64Encode: function (value) {
        return node_forge_1.default.util.encode64(node_forge_1.default.util.encodeUtf8(value));
    },
    /** base64解码 */
    base64Decode: function (value) {
        return node_forge_1.default.util.decodeUtf8(node_forge_1.default.util.decode64(value));
    },
    /** 生成密钥对 */
    generateAesKeyAndIV: function () {
        return {
            key: this.generateAesKey(),
            iv: this.generateAesIv(),
        };
    },
    /** 生成密钥Key */
    generateAesKey: function (length) {
        if (length === void 0) { length = 16; }
        return cryptoUtil.generateRandomString(length);
    },
    /** 生成密钥IV */
    generateAesIv: function (length) {
        if (length === void 0) { length = 16; }
        return cryptoUtil.generateRandomString(length);
    },
    /** 生成随机的字符串 */
    generateRandomString: function (length) {
        return random_util_1.default.generateRandomString({ length: length, ranges: ['lower', 'number', 'upper', 'symbol'] });
    },
    /**
     * 加密
     *
     * iv-length: 192/8
     */
    aesEncrypt: function (data, key, iv, options) {
        var _a;
        if (options === void 0) { options = {}; }
        var algorithm = (_a = options.algorithm) !== null && _a !== void 0 ? _a : DEFAULT_CIPHER_ALGORITHM;
        var cipher = node_forge_1.default.cipher.createCipher(algorithm, key);
        cipher.start({ iv: iv });
        cipher.update(node_forge_1.default.util.createBuffer(node_forge_1.default.util.encodeUtf8(data)));
        cipher.finish();
        return node_forge_1.default.util.encode64(cipher.output.data);
    },
    /**
     * 解密
     */
    aesDecrypt: function (data, key, iv, options) {
        var _a;
        if (options === void 0) { options = {}; }
        var algorithm = (_a = options.algorithm) !== null && _a !== void 0 ? _a : DEFAULT_CIPHER_ALGORITHM;
        var decipher = node_forge_1.default.cipher.createDecipher(algorithm, key);
        decipher.start({ iv: iv });
        decipher.update(node_forge_1.default.util.createBuffer(node_forge_1.default.util.decode64(data)));
        decipher.finish();
        return node_forge_1.default.util.decodeUtf8(decipher.output.data);
    },
    /** ========= RSA 实现部分 ========= */
    // 生成RSA密钥对
    generateRsaKeyPair: function (bits) {
        if (bits === void 0) { bits = 2048; }
        var keypair = node_forge_1.default.pki.rsa.generateKeyPair({ bits: bits });
        return {
            publicKey: node_forge_1.default.pki.publicKeyToPem(keypair.publicKey),
            privateKey: node_forge_1.default.pki.privateKeyToPem(keypair.privateKey),
        };
    },
    // 公钥加密
    publicEncrypt: function (publicKey, data, options) {
        var _a;
        if (options === void 0) { options = {}; }
        var algorithm = (_a = options.algorithm) !== null && _a !== void 0 ? _a : DEFAULT_KEY_ENCRYPTION_SCHEME;
        var key = node_forge_1.default.pki.publicKeyFromPem(publicKey);
        return this.base64Encode(key.encrypt(data, algorithm));
    },
    // 私钥解密
    privateDecrypt: function (privateKey, encrypted, options) {
        var _a;
        if (options === void 0) { options = {}; }
        var algorithm = (_a = options.algorithm) !== null && _a !== void 0 ? _a : DEFAULT_KEY_ENCRYPTION_SCHEME;
        var key = node_forge_1.default.pki.privateKeyFromPem(privateKey);
        return key.decrypt(this.base64Decode(encrypted), algorithm);
    },
    /** 长文本混合加密 */
    longPublicEncrypt: function (publicKey, data, options) {
        var _a, _b, _c;
        if (options === void 0) { options = {}; }
        var algorithm = (_a = options.algorithm) !== null && _a !== void 0 ? _a : DEFAULT_KEY_ENCRYPTION_SCHEME;
        var aesAlgorithm = (_b = options.aesAlgorithm) !== null && _b !== void 0 ? _b : DEFAULT_CIPHER_ALGORITHM;
        var joinSeparator = (_c = options.joinSeparator) !== null && _c !== void 0 ? _c : DEFAULT_JOIN_SEPARATOR;
        var _d = this.generateAesKeyAndIV(), aesKey = _d.key, iv = _d.iv;
        return {
            encryptedAesKey: this.publicEncrypt(publicKey, aesKey, { algorithm: algorithm }),
            encryptedData: this.joinStrings(cryptoUtil.base64Encode(iv), this.aesEncrypt(data, aesKey, iv, { algorithm: aesAlgorithm }), joinSeparator),
        };
    },
    longPrivateDecrypt: function (privateKey, encryptedAesKey, encryptedData, options) {
        var _a, _b, _c;
        if (options === void 0) { options = {}; }
        var algorithm = (_a = options.algorithm) !== null && _a !== void 0 ? _a : DEFAULT_KEY_ENCRYPTION_SCHEME;
        var aesAlgorithm = (_b = options.aesAlgorithm) !== null && _b !== void 0 ? _b : DEFAULT_CIPHER_ALGORITHM;
        var joinSeparator = (_c = options.joinSeparator) !== null && _c !== void 0 ? _c : DEFAULT_JOIN_SEPARATOR;
        var aesKey = this.privateDecrypt(privateKey, encryptedAesKey, { algorithm: algorithm });
        var _d = this.splitJoinedStrings(encryptedData, joinSeparator), iv = _d[0], data = _d[1];
        return this.aesDecrypt(data, aesKey, cryptoUtil.base64Decode(iv), { algorithm: aesAlgorithm });
    },
    /** 辅助方法 */
    joinStrings: function (txt1, txt2, separator) {
        return [txt1, txt2].join(separator);
    },
    splitJoinedStrings: function (str, separator) {
        var index = str.indexOf(separator);
        return index !== -1 ? [str.slice(0, index), str.slice(index + separator.length)] : [str];
    },
};
exports.default = cryptoUtil;
//# sourceMappingURL=crypto.util.js.map