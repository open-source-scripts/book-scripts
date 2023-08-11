/** 平台 */
interface Platform {
    /** 系统 */
    readonly os: string;
    /** 系统版本 */
    readonly osVersion: string;
}

/** 环境信息 */
interface Info {
    /** 引擎版本 */
    readonly version: string;
    /** 平台信息 */
    readonly platform: Platform;
}

/** 环境信息 */
declare var info: Info;

interface DateConstructor {
    /**
     * Parses a string containing a date, and returns the number of milliseconds between that date and midnight, January 1, 1970.
     * @param text 日期文本
     * @param pattern 日期格式
     */
    parseWithFormat(text: string, pattern: string): number;
}

declare var Date: DateConstructor;

/**
 * 用户代理
 */
interface UserAgents {
    /** 
     * Android 用户代理: Mozilla/5.0 (Android 12; Mobile; rv:97.0) Gecko/97.0 Firefox/97.0
     */
    readonly android: string;

    /** 
     * iphon 用户代理: Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148
     */
    readonly iphone: string;

    /**
     * ipad 用户代理: Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148
     */
    readonly ipad: string;

    /**
     * macos 用户代理: Mozilla/5.0 (Macintosh; Intel Mac OS X 11_14; rv:97.0) Gecko/20110101 Firefox/97.0
     */
    readonly macos: string;

    /**
     * windows 用户代理: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0
     */
    readonly windows: string;

    /**
     * linux 用户代理: Mozilla/5.0 (X11; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0
     */
    readonly linux: string;
}

declare var UserAgents: UserAgents;

/**
 * 剪切板
 */
interface Clipboard {
    /** 设置剪切板内容 */
    set(text: string): Promise<void>;

    /** 获取剪切板内容 */
    get(): Promise<string>;
}

declare var Clipboard: Clipboard;

/**
 * 存储
 */
interface Storage {
    /** 保存记录 */
    put(key: string, value: any): Promise<void>;

    /** 获取记录 */
    get(key: string): Promise<any>;

    /** 删除记录 */
    delete(key: string): Promise<boolean>;

    /** 获取所有 keys */
    keys(): Promise<string[]>;

    exists(key: string): Promise<boolean>;
}

declare var Storage: Storage;

interface RequestOptions {
    /**
     * 请求方式: `GET` 👈(默认值) `POST` `HEAD` `PUT` `DELETE` `PATCH` `OPTIONS` `TRACE` `CONNECT`
     */
    method?: String

    /**
     * 请求头, 例如: `{ 'name1': 'value1', 'name2': 'value2' }`
     */
    headers?: object;

    /**
     * 返回类型
     * 
     * - text 文本类型 👈(默认值)
     * - bytes 二进制类型
     */
    responseType: string;

    /**
     * 超时时间, 单位: 毫秒
     */
    timeout?: number;

    /**
     * 与请求一起发送的数据，通常用于 `POST` 和 `PUT` 请求.
     */
    data?: string | object | Uint8Array;
}

/**
 * 响应对象
 */
interface Response {
    /**
     * 响应状态
     */
    readonly status: number;

    /**
     * 响应头
     */
    readonly headers?: object;

    /**
     * 响应数据. 具体类型取决于 `responseType` 的值
     */
    readonly data?: string | Uint8Array;

    /**
     * 重定向后的最终 URL
     */
    readonly finalUrl: string;
}

/**
 * 网络请求
 * @param url 请求地址
 * @param options 请求配置
 */
declare function fetch(url: string, options?: RequestOptions): Promise<Response>;

/**
 * 字符集检测
 * @param data 待检测的数据
 */
declare function chardet(data: Uint8Array): Promise<string>;

/**
 * 编解码器
 */
interface Codec {
    /**
     * 编码
     * @param text 待编码的文本
     * @param charset 字符集, 默认为 utf8
     */
    encode(text: string, charset?: string): Promise<Uint8Array>;

    /**
     * 解码
     * @param text 待解码的数据
     * @param charset 字符集, 默认为 utf8
     */
    decode(data: Uint8Array, charset?: string): Promise<string>;

    /**
     * URL 编码
     * @param text 待编码的文本
     * @param charset 字符集, 默认为 utf8
     */
    encodeURIComponent(text: string, charset?: string): Promise<string>;

    /**
     * URL 解码
     * @param text 待解码的文本
     * @param charset 字符集, 默认为 utf8
     */
    decodeURIComponent(text: string, charset?: string): Promise<string>;
}

declare var Codec: Codec;

interface Node {
    /**
     * 查找第一个与 selectors 表达式匹配的节点
     * @param selectors css 表达式
     */
    querySelector(selectors: string): Element?;

    /**
     * 查找与 selectors 表达式匹配的节点
     * @param selectors css 表达式
     */
    querySelectorAll(selectors: string): Element[];

    /**
     * 查找与 xpath 表达式匹配的节点
     * @param xpath xpath 表达式
     */
    queryXpath(xpath: string): Element[];

    /**
     * 移除该节点
     */
    remove();
}

interface Element extends Node {
    /**
     * 获取当前节点下的文本
     */
    text: string;

    /**
     * 仅获取当前节点的文本
     */
    ownText: string;

    /**
     * 该元素的 HTML 文本
     */
    innerHtml: string;

    /**
     * 该 DOM 元素及其后代的 HTML 文本
     */
    outerHtml: string;
}

/**
 * 
 */
interface Document extends Node {

}

declare var Document: {
    new(text: string): Document;
};

interface UriReplaceOptions {
    scheme?: string;
    userInfo?: string;
    host?: string;
    port?: number;
    path?: string;
    pathSegments?: string[];
    query?: string;
    queryParameters?: object;
    fragment?: string;
}

interface Uri {
    /** The scheme component of the URI. */
    scheme: string;
    /** The authority component. */
    authority: string;
    /** The user info part of the authority component. */
    userInfo: string;
    /** The host part of the authority component. */
    host: string;
    /** The port part of the authority component. */
    port: number;
    /** The path component. */
    path: string;
    /** The URI path split into its segments. */
    pathSegments: string[];
    /** The query component. */
    query: string;
    /** The URI query split into a map according to the rules */
    queryParameters: object;
    /** The URI query split into a map according to the rules */
    queryParametersAll: object;
    /** The fragment identifier component. */
    fragment: string;

    /**
     * 基于当前创建一个新的 Uri, 但替换了一些部分
     */
    replace(options: object): Uri;

    /**
     * 将 reference 解析为相对于当前的 Uri
     * @param reference 
     */
    resolve(reference: string): Uri;

    /**
     * URI的规范化字符串表示形式
     */
    toString(): string;
}

declare var Uri: {
    parse(text: string): Uri;
}

interface UI {
    /**
     * 显示 toast 信息
     * @param text 信息内容
     */
    toast(text: string): Promise<void>;

    /**
     * 提示对话框
     * @param text 信息内容
     */
    alert(text: string): Promise<boolean>;

    /**
     * 确认对话框
     * @param text 信息内容
     * @param single 是否单选
     * @param options 选择项
     */
    confirm(text: string, single?: boolean, options?: string[]): Promise<null | boolean | number | number[]>;

    /**
     * 输入对话框
     * @param text 信息内容
     */
    prompt(text: string): Promise<null | string>;

    /**
     * 网页类型认证页面
     * @param url 验证地址
     * @param domain 获取 cookies 域名
     * @param params 请求参数: {cookies: [...], userAgent: ''}
     */
    authorization(url: string, domain: string, params?: object): Promise<null | object>;

     /**
     * 输入类型认证页面
     * @param params 页面参数
     */ 
     authorization(params: object): Promise<null | object>;
}

declare var UI: UI;