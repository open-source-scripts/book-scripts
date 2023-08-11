const METABLOCK_RE = /(?:^|\n)\s*\/\/\x20==UserScript==([\s\S]*?\n)\s*\/\/\x20==\/UserScript==|$/;

exports.isUserScript = function isUserScript(text) {
    if (/^\s*</.test(text)) return false; // HTML
    if (text.indexOf('// ==UserScript==') < 0) return false; // Lack of meta block
    return true;
}

const arrayType = {
    default: () => [],
    transform: (res, val) => {
        res.push(val);
        return res;
    },
};
const defaultType = {
    default: () => null,
    transform: (res, val) => (res == null ? val : res),
};
const metaTypes = {
    include: arrayType,
    exclude: arrayType,
    match: arrayType,
    excludeMatch: arrayType,
    require: arrayType,
    resource: {
        default: () => ({}),
        transform: (res, val) => {
            const pair = val.match(/^(\w\S*)\s+(.*)/);
            if (pair) res[pair[1]] = pair[2];
            return res;
        },
    },
    grant: arrayType,
    noframes: {
        default: () => false,
        transform: () => true,
    },
};

/**
 * Copy from https://github.com/violentmonkey/violentmonkey/blob/710e9949d5f85abbad4254fc1ff1422ca33ba872/src/background/utils/script.js#L66
 */
exports.parseMeta = function parseMeta(code) {
    // initialize meta
    const meta = Object.keys(metaTypes)
        .reduce((res, key) => Object.assign(res, {
            [key]: metaTypes[key].default(),
        }), {});
    const metaBody = code.match(METABLOCK_RE)[1] || '';
    metaBody.replace(/(?:^|\n)\s*\/\/\x20(@\S+)(.*)/g, (_match, rawKey, rawValue) => {
        const [keyName, locale] = rawKey.slice(1).split(':');
        const camelKey = keyName.replace(/[-_](\w)/g, (m, g) => g.toUpperCase());
        const key = locale ? `${camelKey}:${locale.toLowerCase()}` : camelKey;
        const val = rawValue.trim();
        const metaType = metaTypes[key] || defaultType;
        let oldValue = meta[key];
        if (typeof oldValue === 'undefined') oldValue = metaType.default();
        meta[key] = metaType.transform(oldValue, val);
    });
    meta.resources = meta.resource;
    delete meta.resource;
    // @homepageURL: compatible with @homepage
    if (!meta.homepageURL && meta.homepage) meta.homepageURL = meta.homepage;
    return meta;
}
