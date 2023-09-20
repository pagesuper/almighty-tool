"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var crypto_1 = tslib_1.__importDefault(require("crypto"));
var general_1 = tslib_1.__importDefault(require("../common/general"));
var deepmerge_1 = tslib_1.__importDefault(require("deepmerge"));
/**
 * http://nodejs.cn/api/crypto.html
 */
exports.default = {
    /** 私钥加密: 对长文字进行 */
    longPrivateEncrypt: function (privateKey, buffer) {
        var aesKey = this.generateAesKey('aes-128-cbc');
        var aesIv = this.generateAesIv('aes-128-cbc');
        var encryptedAesKey = this.privateEncrypt(privateKey, aesKey);
        var encryptedData = "".concat(aesIv).concat(this.aesEncrypt(buffer.toString(), aesKey, aesIv));
        return {
            encryptedAesKey: encryptedAesKey,
            encryptedData: encryptedData,
        };
    },
    /** 公钥解密: 对长文字进行 */
    longPublicDecrypt: function (publicKey, encryptedAesKey, encryptedData) {
        var key = this.publicDecrypt(publicKey, encryptedAesKey).toString();
        var iv = encryptedData.slice(0, 16);
        return this.aesDecrypt(encryptedData.slice(16), key, iv);
    },
    /** 公钥加密: 对长文字进行 */
    longPublicEncrypt: function (publicKey, buffer) {
        var aesKey = this.generateAesKey('aes-128-cbc');
        var aesIv = this.generateAesIv('aes-128-cbc');
        var encryptedAesKey = this.publicEncrypt(publicKey, aesKey);
        var encryptedData = "".concat(aesIv).concat(this.aesEncrypt(buffer.toString(), aesKey, aesIv));
        return {
            encryptedAesKey: encryptedAesKey,
            encryptedData: encryptedData,
        };
    },
    /** 私钥解密: 对长文字进行 */
    longPrivatgeDecrypt: function (privateKey, encryptedAesKey, encryptedData) {
        var key = this.privateDecrypt(privateKey, encryptedAesKey).toString();
        var iv = encryptedData.slice(0, 16);
        return this.aesDecrypt(encryptedData.slice(16), key, iv);
    },
    /** 私钥加密 */
    privateEncrypt: function (privateKey, buffer) {
        return crypto_1.default.privateEncrypt(privateKey, Buffer.from(buffer)).toString('base64');
    },
    /** 公钥解密 */
    publicDecrypt: function (publicKey, buffer) {
        return crypto_1.default.publicDecrypt(publicKey, Buffer.from(buffer.toString(), 'base64'));
    },
    /** 公钥加密 */
    publicEncrypt: function (publicKey, buffer) {
        return crypto_1.default.publicEncrypt(publicKey, Buffer.from(buffer)).toString('base64');
    },
    /** 私钥解密 */
    privateDecrypt: function (privateKey, buffer) {
        return crypto_1.default.privateDecrypt(privateKey, Buffer.from(buffer.toString(), 'base64'));
    },
    /** 生成RSA的钥匙对 */
    generateRsaKeyPair: function (options) {
        if (options === void 0) { options = {}; }
        var _a = crypto_1.default.generateKeyPairSync('rsa', (0, deepmerge_1.default)({
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                // cipher: 'aes-256-cbc',
                // passphrase: 'top secret',
            },
        }, options)), publicKey = _a.publicKey, privateKey = _a.privateKey;
        return {
            publicKey: "".concat(publicKey),
            privateKey: "".concat(privateKey),
        };
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
//# sourceMappingURL=crypto.util.js.map