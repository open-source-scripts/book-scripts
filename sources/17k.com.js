// ==UserScript==
// @name          17K小说网
// @domain        17k.com
// @description   一起看小说
// @version       1.0.3
// @icon          https://www.17k.com/favicon.ico
// @supportURL    https://github.com/open-book-source/booksource/issues
// @function      categories
// @function      search
// @function      detail
// @function      toc
// @function      chapter
// @function      authorization
// @function      profile
// @function      author
// @function      schedules
// ==/UserScript==

// 搜索
async function search(keyword, opaque) {
  let page = opaque ? opaque.page : 1;
  let response = await fetch(`https://api.17k.com/v2/book/search?sort_type=0&app_key=4037465544&_access_version=2&cps=0&channel=2&_versions=1070&merchant=17KH5&page=${page}&client_type=1&_filter_data=1&class=0&key=${encodeURI(keyword)}`, {
    headers: { 'User-Agent': UserAgents.macos }
  });
  if (response.status !== 200) {
    return {
      code: response.status,
      message: 'Network error!',
    };
  }
  let $ = JSON.parse(response.data);
  if ($.status.code !== 0) {
    return {
      code: 1,
      message: `${$.status.msg}(${$.status.code})`,
    };
  }

  let array = [];
  if ($.data) {
    for (let i = 0; i < $.data.length; i++) {
      let item = $.data[i];
      if (item.type) continue;
      array.push({
        id: `${item.id}`,
        name: item.book_name,
        author: item.author_name,
        authorId: `${item.author_id}`,
        intro: item.intro,
        cover: item.cover,
        words: item.word_count,
        updateTime: item.updated_at,
        lastChapterName: item.last_update_chapter_name,
        category: item.category_name_2,
        // 01: 连载 03: 完结
        status: item.book_status === "03" ? 1 : 0,
        opaque: undefined,
      });
    }
  }
  return {
    data: {
      data: array,
      hasMore: $.cur_page < $.total_page,
      opaque: {
        page: $.cur_page + 1,
      },
    },
  };
}

// 详情
async function detail(id) {
  let response = await fetch(`https://api.17k.com/book/${id}/split1/merge?iltc=1&cpsOpid=0&_filterData=1&device_id=&channel=0&_versions=1160&merchant=17Kyyb&platform=2&manufacturer=Xiaomi&clientType=1&appKey=4037465544&model=&cpsSource=0&brand=Redmi&youthModel=0`, {
    headers: { 'User-Agent': UserAgents.macos }
  });
  if (response.status !== 200) {
    return {
      code: response.status,
      message: 'Network error!',
    };
  }
  let $ = JSON.parse(response.data);
  if ($.status.code !== 0) {
    return {
      code: 1,
      message: `${$.status.msg}(${$.status.code})`,
    };
  }
  let item = $.data.find(e => e.type === 'bookTop').bookTop;
  return {
    data: {
      id: `${item.bookId}`,
      name: item.bookName,
      author: item.authorPenName,
      authorId: `${item.authorId}`,
      intro: item.introduction,
      cover: item.coverImg,
      words: item.wordCount,
      updateTime: item.updateTime,
      lastChapterName: item.lastUpdateChapter.name,
      category: item.bookCategory.name,
      // 01: 连载 03: 完结
      status: item.bookStatus.id === 3 ? 1 : 0,
      opaque: undefined,
    }
  };
}

// 目录
async function toc(id) {
  let response = await fetch(`https://api.17k.com/v2/book/${id}/volumes?app_key=4037465544&price_extend=1&_versions=1070&client_type=2&_filter_data=1&channel=2&merchant=17Khwyysd&_access_version=2&cps=0&book_id=${id}`, {
    headers: { 'User-Agent': UserAgents.macos }
  });
  if (response.status !== 200) {
    return {
      code: response.status,
      message: 'Network error!',
    };
  }
  let $ = JSON.parse(response.data);
  if ($.status.code !== 0) {
    return {
      code: 1,
      message: `${$.status.msg}(${$.status.code})`,
    };
  }

  let array = [];
  $.data.volumes.forEach((item) => {
    let children = [];
    array.push({
      name: item.volume_name,
      children: children
    })
    item.chapters.forEach((item) => {
      children.push({
        name: item.name,
        id: `${item.chapter_id}`,
        vip: item.vip === "Y",
        url: `https://h5.17k.com/chapter/${id}/${item.chapter_id}.html`
      })
    })
  })
  return {
    data: array,
  };
}

// 章节
async function chapter(bid, cid) {
  let response = await fetch(`https://api.17k.com/v2/book/${bid}/chapter/${cid}/content?app_type=8&app_key=4037465544&_versions=979&client_type=1&_filter_data=1&channel=2&merchant=17Khwyysd&_access_version=2&cps=0`, {
    headers: { 'User-Agent': UserAgents.macos }
  });
  if (response.status !== 200) {
    return {
      code: response.status,
      message: 'Network error!',
    };
  }
  let $ = JSON.parse(response.data)
  if ($.status.code !== 0) {
    return {
      code: 1,
      message: `${$.status.msg}(${$.status.code})`,
    };
  }

  return {
    data: {
      finalUrl: response.finalUrl,
      body: $.data.content,
    },
  };
}

const _sub_categories = {
  children: [
    {
      key: '全部',
      value: 0,
      child: { children: [{ key: '周', value: 1 }, { key: '月', value: 2 }, { key: '总', value: 3 }] }
    },
    {
      key: '男生',
      value: 2,
      child: { children: [{ key: '周', value: 1 }, { key: '月', value: 2 }, { key: '总', value: 3 }] }
    },
    {
      key: '女生',
      value: 3,
      child: { children: [{ key: '周', value: 1 }, { key: '月', value: 2 }, { key: '总', value: 3 }] }
    },
  ]
};

// 分类配置
function categories() {
  return {
    data: {
      children: [
        { key: '畅销榜', value: 2, child: _sub_categories },
        { key: '礼物榜', value: 15, child: _sub_categories },
        { key: '新书榜', value: 9, child: _sub_categories },
        { key: '人气榜', value: 10, child: _sub_categories },
        { key: '完本榜', value: 11, child: _sub_categories },
        { key: '热评榜', value: 5, child: _sub_categories },
        { key: '更新榜', value: 6, child: _sub_categories },
        { key: '推荐票榜', value: 7, child: _sub_categories },
        { key: '包月书榜', value: 8, child: _sub_categories },
        { key: '免费书榜', value: 14, child: _sub_categories },
      ]
    },
  };
}

// 获取分类数据
async function category(categories, opaque) {
  let type = categories[0];
  let classId;
  let orderTime;
  if (type === 12) {
    classId = categories[1];
    orderTime = '';
  } else if (type === 13) {
    classId = '';
    orderTime = categories[1];
  } else {
    classId = categories[1];
    orderTime = categories[2];
  }
  let page = opaque ? opaque.page : 1;
  let response = await fetch(`https://api.17k.com/book/rank/client?classId=${classId}&orderTime=${orderTime}&orderBy=1&page=${page}&type=${type}&clientType=1&cpsOpid=0&_filterData=1&channel=0&_versions=1070&merchant=17Kyyb&appKey=4037465544&cpsSource=0&platform=2`, {
    headers: { 'User-Agent': UserAgents.macos }
  });
  if (response.status !== 200) {
    return {
      code: response.status,
      message: 'Network error!',
    };
  }
  let $ = JSON.parse(response.data);
  if ($.status.code !== 0) {
    return {
      code: 1,
      message: `${$.status.msg}(${$.status.code})`,
    };
  }

  let array = [];
  for (let i = 0; i < $.data.length; i++) {
    let item = $.data[i];
    array.push({
      id: `${item.id}`,
      name: item.bookName,
      author: item.authorPenName,
      authorId: `${item.authorId}`,
      intro: item.introduction,
      cover: item.coverImg,
      words: item.wordCount,
      updateTime: item.lastUpdateChapterDate,
      lastChapterName: item.lastUpdateChapterName,
      category: `${item.categoryName}`,
      // 01: 连载 03: 完结
      status: item.bookStatus === 3 ? 1 : 0,
      opaque: undefined,
    });
  }
  return {
    data: {
      data: array,
      hasMore: $.curPage < $.totalPage,
      opaque: {
        page: $.curPage + 1,
      },
    },
  };
}

// 授权
async function authorization() {
  // 网页登录
  let response = await UI.authorization('https://h5.17k.com/passport', 'https://17k.com');
  // 判断是否已登录
  if (response && response.indexOf('accessToken=') !== -1) {
    await Storage.put('cookie', response);
    return true;
  }
  return false;
}

// 取消授权
async function unauthorization() {
  return Storage.delete('cookie');
}

// 是否已授权
async function authenticated() {
  return Storage.exists('cookie');
}

// 个人信息
async function profile() {
  let response = await fetch(`https://api.17k.com/user/mine/merge?access_token=1&accountInfo=1&bindInfo=1&benefitsType=1&cpsOpid=0&_filterData=1&device_id=&channel=0&_versions=1230&merchant=17Khwyysd&platform=2&manufacturer=Xiaomi&clientType=1&width=1080&appKey=4037465544&cpsSource=0&youthModel=0&height=2175`, {
    headers: { 'User-Agent': UserAgents.macos, cookie: await Storage.get('cookie') }
  });
  if (response.status !== 200) {
    return {
      code: response.status,
      message: 'Network error!',
    };
  }
  let $ = JSON.parse(response.data);
  if ($.status.code !== 0) {
    return {
      code: 1,
      message: `${$.status.msg}(${$.status.code})`,
    };
  }
  return {
    data: [
      {
        type: 'view',
        name: '账号',
        description: undefined,
        value: $.data.nickname,
        action: 'https://user.17k.com/h5/info'
      },
      {
        type: 'view',
        name: 'VIP',
        description: undefined,
        value: $.data.vipLevel
      },
      {
        type: 'view',
        name: 'k币',
        description: undefined,
        value: $.data.accountInfo.balance,
        action: 'https://pay.17k.com/h5'
      },
      {
        type: 'view',
        name: '代金券',
        description: undefined,
        value: $.data.accountInfo.totalBalance,
        action: 'https://user.17k.com/h5/coupons'
      },
      {
        type: 'view',
        name: '推荐票',
        description: undefined,
        value: $.data.cardInfo.recommendTicketCount
      },
      {
        type: 'items',
        name: '书架',
        description: undefined,
        value: undefined,
        action: 'bookshelf'
      },
    ]
  };
}

// 作者(未完成)
async function author(id) {
  return {
    data: {
      author: {},
      items: [],
    },
  };
}

// 定时任务
async function schedules() {
  return [
    {
      name: '签到',
      description: '签到获取积分',
      action: 'checkin',
      cron: "0 0 12 * * ?",
      enabled: await Storage.get('schedule_checkin') ?? true,
      logs: await Storage.get('schedule_checkin_logs'),
      authorization: true
    },
  ];
}

// 设置定时任务是否开启
async function scheduleEnable(action, enabled) {
  await Storage.put(`schedule_${action}`, enabled);
}

// 调用 action
async function action(action) {
  if (action === 'bookshelf') {
    return bookshelf();
  } else if (action === 'checkin') {
    return checkin();
  } else {
    return UI.open(`obs://webview?url=${encodeURIComponent(action)}`);
  }
}

// 获取书架书籍
async function bookshelf() {
  let response = await fetch(`https://user.17k.com/ck/author/shelf?platform=4&appKey=1351550300`, {
    headers: { 'User-Agent': UserAgents.macos, cookie: await Storage.get('cookie') }
  });
  if (response.status !== 200) {
    return {
      code: response.status,
      message: 'Network error!',
    };
  }
  let $ = JSON.parse(response.data);
  if ($.status.code !== 0) {
    return {
      code: 1,
      message: `${$.status.msg}(${$.status.code})`,
    };
  }
  return {
    data: {
      data: $.data.map(item => ({
        id: `${item.bookId}`,
        name: item.bookName,
        author: item.authorPenName,
        authorId: `${item.authorId}`,
        intro: item.introduction,
        cover: item.coverImg,
        words: item.wordCount,
        updateTime: item.bookupdateTimeValue,
        lastChapterName: item.lastUpdateChapter.name,
        category: `${item.bookCategory.name}`,
        // 01: 连载 03: 完结
        status: item.bookStatus.id === 3 ? 1 : 0,
        opaque: undefined,
      })),
      hasMore: false,
      opaque: undefined,
    },
  }
}

// 签到
async function checkin() {

}
