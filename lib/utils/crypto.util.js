"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_forge_1 = (0, tslib_1.__importDefault)(require("node-forge"));
var uuid_1 = require("uuid");
var random_util_1 = (0, tslib_1.__importDefault)(require("./random.util"));
var DEFAULT_KEY_ENCRYPTION_SCHEME = 'RSA-OAEP';
var DEFAULT_CIPHER_ALGORITHM = 'AES-CBC';
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
    aesEncrypt: function (data, key, iv, algorithm) {
        if (algorithm === void 0) { algorithm = DEFAULT_CIPHER_ALGORITHM; }
        var cipher = node_forge_1.default.cipher.createCipher(algorithm, key);
        cipher.start({ iv: iv });
        cipher.update(node_forge_1.default.util.createBuffer(node_forge_1.default.util.encodeUtf8(data)));
        cipher.finish();
        return node_forge_1.default.util.encode64(cipher.output.data);
    },
    /**
     * 解密
     */
    aesDecrypt: function (data, key, iv, algorithm) {
        if (algorithm === void 0) { algorithm = DEFAULT_CIPHER_ALGORITHM; }
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
    publicEncrypt: function (publicKey, data, encryptAlgorithm) {
        if (encryptAlgorithm === void 0) { encryptAlgorithm = DEFAULT_KEY_ENCRYPTION_SCHEME; }
        var key = node_forge_1.default.pki.publicKeyFromPem(publicKey);
        return this.base64Encode(key.encrypt(data, encryptAlgorithm));
    },
    // 私钥解密
    privateDecrypt: function (privateKey, encrypted, decryptAlgorithm) {
        if (decryptAlgorithm === void 0) { decryptAlgorithm = DEFAULT_KEY_ENCRYPTION_SCHEME; }
        var key = node_forge_1.default.pki.privateKeyFromPem(privateKey);
        return key.decrypt(this.base64Decode(encrypted), decryptAlgorithm);
    },
    /** 长文本混合加密 */
    longPublicEncrypt: function (publicKey, data, encryptAlgorithm) {
        if (encryptAlgorithm === void 0) { encryptAlgorithm = DEFAULT_KEY_ENCRYPTION_SCHEME; }
        var _a = this.generateAesKeyAndIV(), aesKey = _a.key, iv = _a.iv;
        return {
            encryptedAesKey: this.publicEncrypt(publicKey, aesKey, encryptAlgorithm),
            encryptedData: this.joinStrings(iv, this.aesEncrypt(data, aesKey, iv)),
        };
    },
    longPrivateDecrypt: function (privateKey, encryptedAesKey, encryptedData, decryptAlgorithm) {
        if (decryptAlgorithm === void 0) { decryptAlgorithm = DEFAULT_KEY_ENCRYPTION_SCHEME; }
        var aesKey = this.privateDecrypt(privateKey, encryptedAesKey, decryptAlgorithm);
        var _a = this.splitJoinedStrings(encryptedData), iv = _a[0], data = _a[1];
        return this.aesDecrypt(data, aesKey, iv);
    },
    /** 辅助方法 */
    joinStrings: function (txt1, txt2, separator) {
        if (separator === void 0) { separator = '##'; }
        return [txt1, txt2].join(separator);
    },
    splitJoinedStrings: function (str, separator) {
        if (separator === void 0) { separator = '##'; }
        var index = str.indexOf(separator);
        return index !== -1 ? [str.slice(0, index), str.slice(index + separator.length)] : [str];
    },
};
exports.default = cryptoUtil;
//# sourceMappingURL=crypto.util.js.map