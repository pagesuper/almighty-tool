"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// import { franc, Options } from 'franc-all';
var franc_1 = require("franc");
var get_1 = tslib_1.__importDefault(require("lodash-es/get"));
// 定义语言代码到区域标识的映射配置对象
var languageLocaleMap = {
    // 亚洲语言
    cmn: 'zh-CN',
    jpn: 'ja-JP',
    kor: 'ko-KR',
    hin: 'hi-IN',
    tha: 'th-TH',
    vie: 'vi-VN',
    ind: 'id-ID',
    ms: 'ms-MY',
    fil: 'tl-PH',
    // 欧洲语言
    eng: 'en-US',
    spa: 'es-ES',
    fra: 'fr-FR',
    deu: 'de-DE',
    ita: 'it-IT',
    rus: 'ru-RU',
    por: 'pt-BR',
    nld: 'nl-NL',
    pol: 'pl-PL',
    ukr: 'uk-UA',
    ces: 'cs-CZ',
    swe: 'sv-SE',
    dan: 'da-DK',
    fin: 'fi-FI',
    nor: 'no-NO',
    ell: 'el-GR',
    hun: 'hu-HU',
    ron: 'ro-RO',
    bul: 'bg-BG',
    // 中东和非洲语言
    arb: 'ar-SA',
    heb: 'he-IL',
    tur: 'tr-TR',
    fas: 'fa-IR',
    swh: 'sw-KE',
    af: 'af-ZA',
    zu: 'zu-ZA',
    // 南亚语言
    ben: 'bn-BD',
    tam: 'ta-IN',
    tel: 'te-IN',
    mar: 'mr-IN',
    guj: 'gu-IN',
    kan: 'kn-IN',
    mal: 'ml-IN',
    pan: 'pa-IN',
    urd: 'ur-PK',
    // 其他重要语言
    cat: 'ca-ES',
    eus: 'eu-ES',
    glg: 'gl-ES',
    hrv: 'hr-HR',
    srp: 'sr-RS',
    slk: 'sk-SK',
    slv: 'sl-SI',
    lit: 'lt-LT',
    lav: 'lv-LV',
    est: 'et-EE',
    isl: 'is-IS',
};
var languageCodeMap = Object.entries(languageLocaleMap).reduce(function (acc, _a) {
    var key = _a[0], value = _a[1];
    Reflect.set(acc, value, key);
    return acc;
}, {});
var languageUtil = {
    /** 通过文本获取语言标识 */
    getKeyByText: function (text, options) {
        var _a;
        var only;
        if (options === null || options === void 0 ? void 0 : options.only) {
            only = [];
            for (var _i = 0, _b = options.only; _i < _b.length; _i++) {
                var item = _b[_i];
                var code_1 = Reflect.get(languageCodeMap, item);
                if (code_1) {
                    only.push(code_1);
                }
                else if (Reflect.get(languageLocaleMap, item)) {
                    only.push(item);
                }
            }
        }
        var code = (0, franc_1.franc)(text, tslib_1.__assign(tslib_1.__assign({}, options), { only: only }));
        var style = (options === null || options === void 0 ? void 0 : options.style) || 'CebabCase';
        if (style === 'Code') {
            return code;
        }
        // 使用配置对象进行判断
        var cebabCaseKey = (0, get_1.default)(languageLocaleMap, code, (_a = options === null || options === void 0 ? void 0 : options.default) !== null && _a !== void 0 ? _a : 'zh-CN');
        if (style === 'SnakeCase') {
            return cebabCaseKey.replace(/-/g, '_');
        }
        return cebabCaseKey;
    },
};
exports.default = languageUtil;
//# sourceMappingURL=language.util.js.map