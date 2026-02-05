"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var crypto_js_1 = tslib_1.__importDefault(require("crypto-js"));
var uuid_1 = require("uuid");
var random_util_1 = tslib_1.__importDefault(require("./random.util"));
var jsencrypt_1 = tslib_1.__importDefault(require("jsencrypt"));
var DEFAULT_KEY_ENCRYPTION_SCHEME = 'RSA-OAEP';
var DEFAULT_CIPHER_ALGORITHM = 'AES-CBC';
var DEFAULT_JOIN_SEPARATOR = '::';
var cryptoUtil = {
    uuid: function () {
        return (0, uuid_1.v4)();
    },
    md5: function (value) {
        return crypto_js_1.default.MD5(value).toString(crypto_js_1.default.enc.Hex);
    },
    hmac: function (key, bytes, md) {
        if (md === void 0) { md = 'sha256'; }
        var keyStr = key || '';
        if (md === 'sha1') {
            return crypto_js_1.default.HmacSHA1(bytes, keyStr).toString(crypto_js_1.default.enc.Hex);
        }
        else if (md === 'sha512') {
            return crypto_js_1.default.HmacSHA512(bytes, keyStr).toString(crypto_js_1.default.enc.Hex);
        }
        else {
            return crypto_js_1.default.HmacSHA256(bytes, keyStr).toString(crypto_js_1.default.enc.Hex);
        }
    },
    sha1: function (value) {
        return crypto_js_1.default.SHA1(value).toString(crypto_js_1.default.enc.Hex);
    },
    sha256: function (value) {
        return crypto_js_1.default.SHA256(value).toString(crypto_js_1.default.enc.Hex);
    },
    sha384: function (value) {
        return crypto_js_1.default.SHA384(value).toString(crypto_js_1.default.enc.Hex);
    },
    sha512: function (value) {
        return crypto_js_1.default.SHA512(value).toString(crypto_js_1.default.enc.Hex);
    },
    base64Encode: function (value) {
        return crypto_js_1.default.enc.Utf8.parse(value).toString(crypto_js_1.default.enc.Base64);
    },
    base64Decode: function (value) {
        return crypto_js_1.default.enc.Base64.parse(value).toString(crypto_js_1.default.enc.Utf8);
    },
    generateAesKeyAndIV: function () {
        return {
            key: this.generateAesKey(),
            iv: this.generateAesIv(),
        };
    },
    generateAesKey: function (length) {
        if (length === void 0) { length = 16; }
        return cryptoUtil.generateRandomString(length);
    },
    generateAesIv: function (length) {
        if (length === void 0) { length = 16; }
        return cryptoUtil.generateRandomString(length);
    },
    generateRandomString: function (length) {
        return random_util_1.default.generateRandomString({ length: length, ranges: ['lower', 'number', 'upper', 'symbol'] });
    },
    aesEncrypt: function (data, key, iv, options) {
        var _a;
        if (options === void 0) { options = {}; }
        var algorithm = (_a = options.algorithm) !== null && _a !== void 0 ? _a : DEFAULT_CIPHER_ALGORITHM;
        var result;
        if (algorithm === 'AES-CBC') {
            result = crypto_js_1.default.AES.encrypt(data, crypto_js_1.default.enc.Utf8.parse(key), {
                iv: crypto_js_1.default.enc.Utf8.parse(iv),
                mode: crypto_js_1.default.mode.CBC,
                padding: crypto_js_1.default.pad.Pkcs7,
            });
        }
        else if (algorithm === 'AES-ECB') {
            result = crypto_js_1.default.AES.encrypt(data, crypto_js_1.default.enc.Utf8.parse(key), {
                mode: crypto_js_1.default.mode.ECB,
                padding: crypto_js_1.default.pad.Pkcs7,
            });
        }
        else {
            result = crypto_js_1.default.AES.encrypt(data, crypto_js_1.default.enc.Utf8.parse(key), {
                iv: crypto_js_1.default.enc.Utf8.parse(iv),
                mode: crypto_js_1.default.mode.CBC,
                padding: crypto_js_1.default.pad.Pkcs7,
            });
        }
        return result.ciphertext.toString(crypto_js_1.default.enc.Base64);
    },
    aesDecrypt: function (data, key, iv, options) {
        var _a;
        if (options === void 0) { options = {}; }
        var algorithm = (_a = options.algorithm) !== null && _a !== void 0 ? _a : DEFAULT_CIPHER_ALGORITHM;
        var keyHex = crypto_js_1.default.enc.Utf8.parse(key);
        var ivHex = crypto_js_1.default.enc.Utf8.parse(iv);
        var decrypted = crypto_js_1.default.AES.decrypt(data, keyHex, {
            iv: ivHex,
            mode: crypto_js_1.default.mode.CBC,
            padding: crypto_js_1.default.pad.Pkcs7,
        });
        return decrypted.toString(crypto_js_1.default.enc.Utf8);
    },
    generateRsaKeyPair: function (bits) {
        if (bits === void 0) { bits = 2048; }
        var jsEncrypt = new jsencrypt_1.default({ default_key_size: String(bits) });
        var publicKey = jsEncrypt.getPublicKey();
        var privateKey = jsEncrypt.getPrivateKey();
        return { publicKey: publicKey, privateKey: privateKey };
    },
    publicEncrypt: function (publicKey, data, options) {
        var _a;
        if (options === void 0) { options = {}; }
        var algorithm = (_a = options.algorithm) !== null && _a !== void 0 ? _a : DEFAULT_KEY_ENCRYPTION_SCHEME;
        var jsEncrypt = new jsencrypt_1.default();
        jsEncrypt.setPublicKey(publicKey);
        var encrypted = jsEncrypt.encrypt(data);
        if (!encrypted) {
            throw new Error('RSA encryption failed');
        }
        return encrypted;
    },
    privateDecrypt: function (privateKey, encrypted, options) {
        var _a;
        if (options === void 0) { options = {}; }
        var algorithm = (_a = options.algorithm) !== null && _a !== void 0 ? _a : DEFAULT_KEY_ENCRYPTION_SCHEME;
        var jsEncrypt = new jsencrypt_1.default();
        jsEncrypt.setPrivateKey(privateKey);
        var decrypted = jsEncrypt.decrypt(encrypted);
        if (!decrypted) {
            throw new Error('RSA decryption failed');
        }
        return decrypted;
    },
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