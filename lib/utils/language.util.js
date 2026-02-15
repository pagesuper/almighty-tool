"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageUtil = void 0;
var tslib_1 = require("tslib");
var heavy_1 = require("tinyld/heavy");
var languageLocaleMap = {
    afr: { key: 'af-ZA', lang: 'af', name: 'Afrikaans', chinese: '南非荷兰语' },
    amh: { key: 'am-ET', lang: 'am', name: 'Amharic', chinese: '阿姆哈拉语' },
    ara: { key: 'ar-SA', lang: 'ar', name: 'Arabic', chinese: '阿拉伯语' },
    bel: { key: 'be-BY', lang: 'be', name: 'Belarusian', chinese: '白俄罗斯语' },
    ben: { key: 'bn-BD', lang: 'bn', name: 'Bengali', chinese: '孟加拉语' },
    ber: { key: 'ber-DZ', lang: 'ber', name: 'Berber', chinese: '柏柏尔语' },
    bul: { key: 'bg-BG', lang: 'bg', name: 'Bulgarian', chinese: '保加利亚语' },
    ces: { key: 'cs-CZ', lang: 'cs', name: 'Czech', chinese: '捷克语' },
    cmn: { key: 'zh-CN', lang: 'zh', name: 'Chinese (Simplified)', chinese: '中文(简体)' },
    dan: { key: 'da-DK', lang: 'da', name: 'Danish', chinese: '丹麦语' },
    deu: { key: 'de-DE', lang: 'de', name: 'German', chinese: '德语' },
    ell: { key: 'el-GR', lang: 'el', name: 'Greek', chinese: '希腊语' },
    eng: { key: 'en-US', lang: 'en', name: 'English', chinese: '英语' },
    epo: { key: 'eo', lang: 'eo', name: 'Esperanto', chinese: '世界语' },
    est: { key: 'et-EE', lang: 'et', name: 'Estonian', chinese: '爱沙尼亚语' },
    fin: { key: 'fi-FI', lang: 'fi', name: 'Finnish', chinese: '芬兰语' },
    fra: { key: 'fr-FR', lang: 'fr', name: 'French', chinese: '法语' },
    gle: { key: 'ga-IE', lang: 'ga', name: 'Irish', chinese: '爱尔兰语' },
    guj: { key: 'gu-IN', lang: 'gu', name: 'Gujarati', chinese: '古吉拉特语' },
    heb: { key: 'he-IL', lang: 'he', name: 'Hebrew', chinese: '希伯来语' },
    hin: { key: 'hi-IN', lang: 'hi', name: 'Hindi', chinese: '印地语' },
    hun: { key: 'hu-HU', lang: 'hu', name: 'Hungarian', chinese: '匈牙利语' },
    hye: { key: 'hy-AM', lang: 'hy', name: 'Armenian', chinese: '亚美尼亚语' },
    ind: { key: 'id-ID', lang: 'id', name: 'Indonesian', chinese: '印尼语' },
    isl: { key: 'is-IS', lang: 'is', name: 'Icelandic', chinese: '冰岛语' },
    ita: { key: 'it-IT', lang: 'it', name: 'Italian', chinese: '意大利语' },
    jpn: { key: 'ja-JP', lang: 'ja', name: 'Japanese', chinese: '日语' },
    kan: { key: 'kn-IN', lang: 'kn', name: 'Kannada', chinese: '卡纳达语' },
    kaz: { key: 'kk-KZ', lang: 'kk', name: 'Kazakh', chinese: '哈萨克语' },
    khm: { key: 'km-KH', lang: 'km', name: 'Khmer', chinese: '高棉语' },
    kor: { key: 'ko-KR', lang: 'ko', name: 'Korean', chinese: '韩语' },
    lat: { key: 'la', lang: 'la', name: 'Latin', chinese: '拉丁语' },
    lit: { key: 'lt-LT', lang: 'lt', name: 'Lithuanian', chinese: '立陶宛语' },
    lvs: { key: 'lv-LV', lang: 'lv', name: 'Latvian', chinese: '拉脱维亚语' },
    mkd: { key: 'mk-MK', lang: 'mk', name: 'Macedonian', chinese: '马其顿语' },
    mon: { key: 'mn-MN', lang: 'mn', name: 'Mongolian', chinese: '蒙古语' },
    mya: { key: 'my-MM', lang: 'my', name: 'Burmese', chinese: '缅甸语' },
    nld: { key: 'nl-NL', lang: 'nl', name: 'Dutch', chinese: '荷兰语' },
    nob: { key: 'nb-NO', lang: 'nb', name: 'Norwegian Bokmål', chinese: '挪威书面语' },
    pes: { key: 'fa-IR', lang: 'fa', name: 'Persian', chinese: '波斯语' },
    pol: { key: 'pl-PL', lang: 'pl', name: 'Polish', chinese: '波兰语' },
    por: { key: 'pt-PT', lang: 'pt', name: 'Portuguese', chinese: '葡萄牙语' },
    run: { key: 'rn-BI', lang: 'rn', name: 'Rundi', chinese: '基隆迪语' },
    ron: { key: 'ro-RO', lang: 'ro', name: 'Romanian', chinese: '罗马尼亚语' },
    rus: { key: 'ru-RU', lang: 'ru', name: 'Russian', chinese: '俄语' },
    slk: { key: 'sk-SK', lang: 'sk', name: 'Slovak', chinese: '斯洛伐克语' },
    spa: { key: 'es-ES', lang: 'es', name: 'Spanish', chinese: '西班牙语' },
    srp: { key: 'sr-RS', lang: 'sr', name: 'Serbian', chinese: '塞尔维亚语' },
    swe: { key: 'sv-SE', lang: 'sv', name: 'Swedish', chinese: '瑞典语' },
    tam: { key: 'ta-IN', lang: 'ta', name: 'Tamil', chinese: '泰米尔语' },
    tat: { key: 'tt-RU', lang: 'tt', name: 'Tatar', chinese: '鞑靼语' },
    tel: { key: 'te-IN', lang: 'te', name: 'Telugu', chinese: '泰卢固语' },
    tgl: { key: 'fil-PH', lang: 'fil', name: 'Filipino', chinese: '菲律宾语' },
    tha: { key: 'th-TH', lang: 'th', name: 'Thai', chinese: '泰语' },
    tlh: { key: 'tlh', lang: 'tlh', name: 'Klingon', chinese: '克林贡语' },
    tuk: { key: 'tk-TM', lang: 'tk', name: 'Turkmen', chinese: '土库曼语' },
    tur: { key: 'tr-TR', lang: 'tr', name: 'Turkish', chinese: '土耳其语' },
    ukr: { key: 'uk-UA', lang: 'uk', name: 'Ukrainian', chinese: '乌克兰语' },
    urd: { key: 'ur-PK', lang: 'ur', name: 'Urdu', chinese: '乌尔都语' },
    vie: { key: 'vi-VN', lang: 'vi', name: 'Vietnamese', chinese: '越南语' },
    vol: { key: 'vo', lang: 'vo', name: 'Volapük', chinese: '沃拉普克语' },
    yid: { key: 'yi', lang: 'yi', name: 'Yiddish', chinese: '意第绪语' },
};
var languageCodeMap = Object.entries(languageLocaleMap).reduce(function (acc, _a) {
    var key = _a[0], value = _a[1];
    Reflect.set(acc, value.key, key);
    return acc;
}, {});
var languageLangCodeMap = Object.values(languageLocaleMap).reduce(function (acc, item) {
    Reflect.set(acc, item.lang, item.key);
    return acc;
}, {});
var languageUtil = {
    detectAll: function (text, options) {
        var only;
        if (options === null || options === void 0 ? void 0 : options.only) {
            only = [];
            for (var _i = 0, _a = options.only; _i < _a.length; _i++) {
                var item = _a[_i];
                var language = Reflect.get(languageCodeMap, item);
                if (language) {
                    only.push(Reflect.get(languageLocaleMap, language).lang);
                }
                else if (Reflect.get(languageLocaleMap, item)) {
                    only.push(Reflect.get(languageLocaleMap, item).lang);
                }
            }
        }
        var result = (0, heavy_1.detectAll)(text);
        if (only) {
            result = result.filter(function (item) {
                return only.includes(item.lang);
            });
        }
        return result.map(function (item) {
            return tslib_1.__assign(tslib_1.__assign({}, item), { key: Reflect.get(languageLangCodeMap, item.lang) });
        });
    },
    getKeyByText: function (text, options) {
        var _a;
        var result = languageUtil.detectAll(text, options);
        if (result.length) {
            return result[0].key;
        }
        return (_a = options === null || options === void 0 ? void 0 : options.default) !== null && _a !== void 0 ? _a : null;
    },
};
exports.languageUtil = languageUtil;
exports.default = languageUtil;
//# sourceMappingURL=language.util.js.map