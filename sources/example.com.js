// ==UserScript==
// @status        obsolete
// @testScript    ../test/example.com.js
// @type          插件类型
// @name          网站名字
// @domain        example.com
// @homepage      网站主页
// @description   网站描述
// @version       1.0.0
// @icon          https://open-book-source.com/favicon.ico
// @supportUrl    https://github.com/open-source-scripts/book-scripts-third-party/issues
// @require       https://example.com/example.min.js
// @function      categories
// @function      search
// @function      detail
// @function      toc
// @function      chapter
// @function      synchronization
// @function      configure
// @function      profile
// @function      author
// @function      schedules
// ==/UserScript==

/**
 * 分类配置
 */
function categories() {
  return {
    code: 0,
    message: 'success',
    data: {
      children: [
        {
          key: '分类名称_0', value: 0, child: {
            children: [
              {key: '子分类名称_0', value: 0},
              {key: '子分类名称_1', value: 1},
              {key: '子分类名称_2', value: 2},
            ],
          },
        },
        {
          key: '分类名称_1', value: 1, child: {
            children: [
              {key: '子分类名称_0', value: 0},
              {key: '子分类名称_1', value: 1},
              {key: '子分类名称_2', value: 2},
            ],
          },
        },
      ],
    },
  };
}

/**
 * 分类
 * @param {Object} categories 选中的分类配置
 * @param {Object} opaque 透传数据
 * @return {Object} 返回书籍列表数据
 */
async function category(categories, opaque) {
  // ... // 获取并解析数据
  return {
    code: 0,
    message: 'success',
    // 分页数据
    data: {
      // 书籍数据
      data: [
        {
          id: '书籍ID',
          name: '书源宝典',
          author: '作者',
          authorId: '作者ID',
          category: '武侠',
          tags: ['教程', '宝典'],
          intro: '简介',
          cover: '封面链接',
          words: 19800000,
          updateTime: 1684061017355, // 更新日期
          lastChapterName: '最后章节名',
          status: 0, // 状态: 0: 连载; 1: 完本; 2: 断更;
        },
        // ...
      ],
      // 是否有更多数据
      hasMore: true,
      // 如果 hasMore 为 true, 在请求下一页时, opaque 将会传入 search 方法
      opaque: {
        // 透传数据
      },
    },
  };
}

/**
 * 搜索
 * @param keyword {String} 关键字
 * @param opaque {Object} 透传数据
 * @return {Object} 返回书籍列表数据
 */
async function search(keyword, opaque) {
  // ... // 获取并解析数据
  return {
    code: 0,
    message: 'success',
    // 分页数据
    data: {
      // 书籍数据
      data: [
        {
          id: '书籍ID',
          name: '书源宝典',
          author: '作者',
          authorId: '作者ID',
          category: '武侠',
          tags: ['教程', '宝典'],
          intro: '简介',
          cover: '封面链接',
          words: 19800000,
          updateTime: 1684061017355, // 更新日期
          lastChapterName: '最后章节名',
          status: 0, // 状态: 0: 连载; 1: 完本; 2: 断更;
        },
        // ...
      ],
      // 是否有更多数据
      hasMore: true,
      // 如果 hasMore 为 true, 在请求下一页时, opaque 将会传入 search 方法
      opaque: {
        // 透传数据
      },
    },
  };
}

/**
 * 详情
 * @param {String} id 书籍ID
 * @return {Object} 返回书籍数据
 */
async function detail(id) {
  // ... // 获取并解析数据
  return {
    code: 0,
    message: 'success',
    // 书籍数据
    data: {
      id: '书籍ID',
      name: '书源宝典',
      author: '作者',
      authorId: '作者ID',
      category: '武侠',
      tags: ['教程', '宝典'],
      intro: '简介',
      cover: '封面链接',
      words: 19800000,
      updateTime: 1684061017355, // 更新日期
      lastChapterName: '最新章节名',
      status: 0, // 状态: 0: 连载; 1: 完本; 2: 断更;
    },
  };
}

/**
 * 目录
 * @param {String} id 书籍ID
 * @return {Object} 返回目录树数据
 */
async function toc(id) {
  // ... // 获取并解析数据
  return {
    code: 0,
    message: 'success',
    // 书籍目录
    data: [
      {
        name: '卷名称',
        children: [
          // 书籍章节
          {
            id: 0, // 章节ID
            name: '章节名称',
            vip: false, // 是否 vip 章节
            url: '章节链接',
          },
          // ... // 更多章节
        ],
      },
      // ... 更多卷
      // ... 更多章节
    ],
  };
}

/**
 * 章节
 * @param {String} bid 书籍ID
 * @param {String} cid 章节ID
 * @return {Object} 返回章节数据
 */
async function chapter(bid, cid) {
  // ... // 获取并解析数据
  return {
    code: 0,
    message: 'success',
    data: {
      method: 'GET',
      status: 200,
      headers: null, // 响应头: Map<String, List<String>>
      finalUrl: '最终链接',
      body: '章节内容',
    },
  };
}

/**
 * 同步阅读进度
 */
async function synchronization(bid, cid) {
  // ...
}

/**
 * 配置扩展
 */
async function configure() {
  let inputs = {
    log_level: {
      'type': 'choice',
      'description': 'Select Level',
      'required': true,
      'default': 'warning',
      'options': [
        'info', 'debug', 'warning', 'error',
      ],
    },
    auth_token: {
      'type': 'string',
      'description': 'Input your auth token',
      'required': true,
    },
    tags: {
      'type': 'boolean',
      'description': 'Enable tags',
      'required': true,
    },
    port: {
      'type': 'number',
      'description': 'Input port',
      'required': true,
      'default': '9090',
    },
  };
  let response = await UI.configure(inputs);
  // 判断配置信息, 并保存相关信息
}

// 是否已配置
async function configured() {
  return false;
}

// 取消配置
async function unconfigure() {

}

/**
 * 个人信息
 */
async function profile() {
  // ... // 获取并解析数据
  return {
    code: 0,
    message: 'success',
    data: [
      // 信息块
      {
        type: '类型', // view: 查看 items: 书籍列表
        name: '名称',
        description: undefined,
        value: '值',
        action: '点击该信息块时, 执行 action() 方法的参数',
      },
      // ...
    ],
  };
}

/**
 * 调用 action
 * @param {String} action 信息块中的action字段
 */
async function action(action) {
  // 处理 action , 比如跳转到 WebView 页面, 返回书籍列表.
}

/**
 * 作者
 * @param {String} id 作者ID
 */
async function author(id) {
  // ... // 获取并解析数据
  return {
    code: 0,
    message: 'success',
    data: {
      id: '作者ID',
      name: '名称',
      avatar: '头像',
      intro: '简介',
      items: [
        // 书籍列表
      ],
    },
  };
}

/**
 * 定时任务
 */
async function schedules() {
  return [
    {
      name: '签到',
      description: '签到获取积分',
      action: 'checkin',
      cron: await Storage.get('schedule_checkin_cron') ?? '0 0 12 * * ?',
      enabled: await Storage.get('schedule_checkin_enabled') ?? true,
      logs: await Storage.get('schedule_checkin_logs'),
    },
    // ...
  ];
}

// 配置定时任务
async function scheduleConfigure(action, opaque) {
  let enabled = opaque['enabled'];
  if (enabled) {
    await Storage.put(`schedule_${action}_enabled`, enabled);
  }
  let cron = opaque['cron'];
  if (cron) {
    await Storage.put(`schedule_${action}_cron`, cron);
  }
}

// 定时任务日志
async function scheduleLogs(action) {
  return Storage.get(`schedule_${action}_logs`);
}
