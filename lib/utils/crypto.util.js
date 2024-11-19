"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_forge_1 = (0, tslib_1.__importDefault)(require("node-forge"));
var uuid_1 = require("uuid");
var random_util_1 = (0, tslib_1.__importDefault)(require("./random.util"));
var cryptoUtil = {
    /** 获取 uuid */
    uuid: function () {
        return (0, uuid_1.v4)();
    },
    /** 获取md5摘要 */
    md5: function (value) {
        var md5 = node_forge_1.default.md.md5.create();
        md5.update(value);
        return md5.digest().toHex();
    },
    /** 获取hmac摘要 */
    hmac: function (key, bytes, md) {
        if (md === void 0) { md = 'sha1'; }
        var hmac = node_forge_1.default.hmac.create();
        hmac.start(md, key);
        hmac.update(bytes);
        return hmac.digest().toHex();
    },
    /** 获取sha1摘要 */
    sha1: function (value) {
        var sha1 = node_forge_1.default.md.sha1.create();
        sha1.update(value);
        return sha1.digest().toHex();
    },
    /** 获取sha256摘要 */
    sha256: function (value) {
        var sha256 = node_forge_1.default.md.sha256.create();
        sha256.update(value);
        return sha256.digest().toHex();
    },
    /** 获取sha384摘要 */
    sha384: function (value) {
        var sha384 = node_forge_1.default.md.sha384.create();
        sha384.update(value);
        return sha384.digest().toHex();
    },
    /** 获取sha512摘要 */
    sha512: function (value) {
        var sha512 = node_forge_1.default.md.sha512.create();
        sha512.update(value);
        return sha512.digest().toHex();
    },
    /** base64编码 */
    base64Encode: function (value) {
        return node_forge_1.default.util.encode64(value);
    },
    /** base64解码 */
    base64Decode: function (value) {
        return node_forge_1.default.util.decode64(value);
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
        if (length === void 0) { length = 32; }
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
        if (algorithm === void 0) { algorithm = 'AES-CBC'; }
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
        if (algorithm === void 0) { algorithm = 'AES-CBC'; }
        var decipher = node_forge_1.default.cipher.createDecipher(algorithm, key);
        decipher.start({ iv: iv });
        decipher.update(node_forge_1.default.util.createBuffer(node_forge_1.default.util.decode64(data)));
        decipher.finish();
        return node_forge_1.default.util.decodeUtf8(decipher.output.data);
    },
};
exports.default = cryptoUtil;
//# sourceMappingURL=crypto.util.js.map