// ==UserScript==
// @name          番茄小说网
// @domain        fanqienovel.com
// @version       1.0.6
// @icon          https://p1-tt.byteimg.com/origin/novel-static/a3621391ca2e537045168afda6722ee9
// @supportURL    https://github.com/open-source-scripts/book-scripts/issues
// @function      categories
// @function      search
// @function      detail
// @function      toc
// @function      chapter
// ==/UserScript==

function _convertStatus(status) {
  return status === '0' ? 1 : status === '1' ? 0 : status === '4' ? 2 : undefined;
}

// 搜索
async function search(keyword, opaque) {
  let offset = opaque ? opaque.offset : 0;
  let response = await fetch(`https://api5-normal-lf.fqnovel.com/reading/bookapi/search/page/v/?query=${keyword}&aid=1967&channel=0&os_version=0&device_type=0&device_platform=0&iid=466614321180296&passback=${offset}&version_code=999`);
  if (response.status !== 200) {
    throw new NetworkError(response.status);
  }
  let $ = JSON.parse(response.data);
  if ($.code !== 0) {
    throw new SourceError(`${$.message}(${$.code})`);
  }
  return {
    data: {
      data: $.data.map(e => ({
        id: e.book_data[0].book_id,
        name: e.book_data[0].book_name,
        author: e.book_data[0].author,
        intro: e.book_data[0].abstract,
        cover: e.book_data[0].thumb_url,
        category: e.book_data[0].category,
        status: _convertStatus(e.creation_status),
      })),
      hasMore: $.has_more,
      opaque: {
        offset: $.passback,
      },
    },
  };
}

// 详情
async function detail(id) {
  let response = await fetch(`https://api5-normal-sinfonlineb.fqnovel.com/reading/bookapi/multi-detail/v/?aid=1967&iid=1&version_code=999&book_id=${id}`);
  if (response.status !== 200) {
    throw new NetworkError(response.status);
  }
  let $ = JSON.parse(response.data);
  if ($.code !== 0) {
    throw new SourceError(`${$.message}(${$.code})`);
  }
  let data = $.data[0];
  return {
    data: {
      id: data.book_id,
      name: data.book_name,
      author: data.author,
      intro: data.abstract,
      cover: data.thumb_url,
      words: parseInt(data.word_number),
      updateTime: data.last_publish_time * 1000,
      lastChapterName: data.last_chapter_title,
      category: data.category,
      status: _convertStatus(data.creation_status),
    },
  };
}

// 目录
async function toc(id) {
  let response = await fetch(`https://novel.snssdk.com/api/novel/book/directory/list/v1/?device_platform=android&version_code=600&novel_version=&app_name=news_article&version_name=6.0.0&app_version=6.0.0aid=520&channel=1&device_type=landseer&os_api=25&os_version=10&book_id=${id}`);
  if (response.status !== 200) {
    throw new NetworkError(response.status);
  }
  let $ = JSON.parse(response.data);
  if ($.code !== 0) {
    throw new SourceError(`${$.message}(${$.code})`);
  }
  let array = [];
  let items = $.data.item_list;
  // 2048 characters
  let size = 80;
  for (let i = 0; i < items.length; i += size) {
    let ids = items.slice(i, i + size).join(',');
    response = await fetch(`https://novel.snssdk.com/api/novel/book/directory/detail/v1/?item_ids=${ids}`);
    if (response.status !== 200) {
      throw new NetworkError(response.status);
    }
    $ = JSON.parse(response.data);
    if ($.code !== 0) {
      throw new SourceError(`${$.message}(${$.code})`);
    }
    $.data.forEach((item) => {
      array.push({
        name: item.title,
        id: JSON.stringify({
          gid: item.group_id,
          id: item.item_id,
        }),
      });
    });
  }
  return {
    data: array,
  };
}

// 章节
async function chapter(bid, cid) {
  let args = JSON.parse(cid);
  let response = await fetch(`https://novel.snssdk.com/api/novel/book/reader/full/v1/?device_platform=android&version_code=973&app_name=news_article&version_name=9.7.3&app_version=9.7.3&device_id=1&channel=google&device_type=1&os_api=33&os_version=13&item_id=${args.id}&aid=1319`, {
    headers: {'User-Agent': UserAgents.android},
  });
  if (response.status !== 200) {
    throw new NetworkError(response.status);
  }
  let $ = JSON.parse(response.data);
  if ($.code !== 0) {
    throw new SourceError(`${$.message}(${$.code})`);
  }
  return {
    data: {
      finalUrl: response.finalUrl,
      body: new Document($.data.content).querySelector('article').outerHtml,
    },
  };
}

const _boys_categories = {
  children: [
    {key: '都市', value: 1},
    {key: '都市生活', value: 2},
    {key: '玄幻', value: 7},
    {key: '科幻', value: 8},
    {key: '悬疑', value: 10},
    {key: '乡村', value: 11},
    {key: '历史', value: 12},
    {key: '体育', value: 15},
    {key: '武侠', value: 16},
    {key: '影视小说', value: 45},
    {key: '文学小说', value: 47},
    {key: '生活', value: 48},
    {key: '成功励志', value: 56},
    {key: '文化历史', value: 62},
    {key: '赘婿', value: 25},
    {key: '神医', value: 26},
    {key: '战神', value: 27},
    {key: '奶爸', value: 42},
    {key: '学霸', value: 82},
    {key: '天才', value: 90},
    {key: '腹黑', value: 92},
    {key: '扮猪吃虎', value: 93},
    {key: '鉴宝', value: 17},
    {key: '系统', value: 19},
    {key: '神豪', value: 20},
    {key: '种田', value: 23},
    {key: '重生', value: 36},
    {key: '穿越', value: 37},
    {key: '二次元', value: 39},
    {key: '海岛', value: 40},
    {key: '娱乐圈', value: 43},
    {key: '空间', value: 44},
    {key: '推理', value: 61},
    {key: '洪荒', value: 66},
    {key: '三国', value: 67},
    {key: '末世', value: 68},
    {key: '直播', value: 69},
    {key: '无限流', value: 70},
    {key: '诸天万界', value: 71},
    {key: '大唐', value: 73},
    {key: '宠物', value: 74},
    {key: '外卖', value: 75},
    {key: '星际', value: 77},
    {key: '美食', value: 78},
    {key: '年代', value: 79},
    {key: '剑道', value: 80},
    {key: '盗墓', value: 81},
    {key: '战争', value: 97},
    {key: '灵异', value: 100},
    {key: '都市修真', value: 124},
    {key: '家庭', value: 125},
    {key: '明朝', value: 126},
    {key: '职场', value: 127},
    {key: '都市日常', value: 261},
    {key: '都市脑洞', value: 262},
    {key: '都市种田', value: 263},
    {key: '历史脑洞', value: 272},
    {key: '历史古代', value: 273},
    {key: '惊悚', value: 322},
    {key: '奥特同人', value: 367},
    {key: '火影', value: 368},
    {key: '反派', value: 369},
    {key: '海贼', value: 370},
    {key: '神奇宝贝', value: 371},
    {key: '网游', value: 372},
    {key: '西游', value: 373},
    {key: '漫威', value: 374},
    {key: '特种兵', value: 375},
    {key: '龙珠', value: 376},
    {key: '大秦', value: 377},
    {key: '女帝', value: 378},
    {key: '求生', value: 379},
    {key: '聊天群', value: 381},
    {key: '穿书', value: 382},
    {key: '九叔', value: 383},
    {key: '无敌', value: 384},
    {key: '校花', value: 385},
    {key: '单女主', value: 389},
    {key: '无女主', value: 391},
    {key: '都市青春', value: 396},
    {key: '架空', value: 452},
    {key: '开局', value: 453},
    {key: '综漫', value: 465},
    {key: '钓鱼', value: 493},
    {key: '囤物资', value: 494},
    {key: '四合院', value: 495},
    {key: '国运', value: 496},
    {key: '武将', value: 497},
    {key: '皇帝', value: 498},
    {key: '断层', value: 500},
    {key: '宋朝', value: 501},
    {key: '宫廷侯爵', value: 502},
    {key: '清朝', value: 503},
    {key: '抗战谍战', value: 504},
    {key: '破案', value: 505},
    {key: '神探', value: 506},
    {key: '谍战', value: 507},
    {key: '电竞', value: 508},
    {key: '游戏主播', value: 509},
    {key: '东方玄幻', value: 511},
    {key: '异世大陆', value: 512},
    {key: '高武世界', value: 513},
    {key: '灵气复苏', value: 514},
    {key: '末日求生', value: 515},
    {key: '都市异能', value: 516},
    {key: '修仙', value: 517},
    {key: '特工', value: 518},
    {key: '大小姐', value: 519},
    {key: '大佬', value: 520},
    {key: '打脸', value: 522},
    {key: '双重生', value: 524},
    {key: '同人', value: 538},
    {key: '悬疑脑洞', value: 539},
    {key: '克苏鲁', value: 705},
    {key: '衍生同人', value: 718},
    {key: '游戏体育', value: 746},
    {key: '悬疑灵异', value: 751},
    {key: '搞笑轻松', value: 778},
    {key: '官场', value: 788}],
};

const _girls_categories = {
  children: [
    {key: '都市生活', value: 2},
    {key: '现代言情', value: 3},
    {key: '古代言情', value: 5},
    {key: '科幻', value: 8},
    {key: '悬疑', value: 10},
    {key: '乡村', value: 11},
    {key: '武侠', value: 16},
    {key: '幻想言情', value: 32},
    {key: '婚恋', value: 34},
    {key: '影视小说', value: 45},
    {key: '文学小说', value: 47},
    {key: '生活', value: 48},
    {key: '成功励志', value: 56},
    {key: '文化历史', value: 62},
    {key: '萌宝', value: 28},
    {key: '豪门总裁', value: 29},
    {key: '宠妻', value: 30},
    {key: '学霸', value: 82},
    {key: '公主', value: 83},
    {key: '皇后', value: 84},
    {key: '王妃', value: 85},
    {key: '女强', value: 86},
    {key: '皇叔', value: 87},
    {key: '嫡女', value: 88},
    {key: '精灵', value: 89},
    {key: '天才', value: 90},
    {key: '腹黑', value: 92},
    {key: '扮猪吃虎', value: 93},
    {key: '团宠', value: 94},
    {key: '校园', value: 4},
    {key: '系统', value: 19},
    {key: '种田', value: 23},
    {key: '快穿', value: 24},
    {key: '重生', value: 36},
    {key: '穿越', value: 37},
    {key: '二次元', value: 39},
    {key: '娱乐圈', value: 43},
    {key: '空间', value: 44},
    {key: '推理', value: 61},
    {key: '末世', value: 68},
    {key: '直播', value: 69},
    {key: '兽世', value: 72},
    {key: '清穿', value: 76},
    {key: '星际', value: 77},
    {key: '美食', value: 78},
    {key: '年代', value: 79},
    {key: '盗墓', value: 81},
    {key: '虐文', value: 95},
    {key: '甜宠', value: 96},
    {key: '战争', value: 97},
    {key: '灵异', value: 100},
    {key: '家庭', value: 125},
    {key: '职场', value: 127},
    {key: '宫斗宅斗', value: 246},
    {key: '医术', value: 247},
    {key: '玄幻言情', value: 248},
    {key: '古言脑洞', value: 253},
    {key: '都市日常', value: 261},
    {key: '马甲', value: 266},
    {key: '现言脑洞', value: 267},
    {key: '现言复仇', value: 268},
    {key: '双男主', value: 275},
    {key: '反派', value: 369},
    {key: '病娇', value: 380},
    {key: '穿书', value: 382},
    {key: '无敌', value: 384},
    {key: '青梅竹马', value: 387},
    {key: '女扮男装', value: 388},
    {key: '民国', value: 390},
    {key: '无CP', value: 392},
    {key: '可盐可甜', value: 454},
    {key: '天作之合', value: 455},
    {key: '情有独钟', value: 456},
    {key: '虐渣', value: 457},
    {key: '护短', value: 458},
    {key: '古灵精怪', value: 459},
    {key: '独宠', value: 460},
    {key: '群穿', value: 461},
    {key: '古穿今', value: 462},
    {key: '今穿古', value: 463},
    {key: '异世穿越', value: 464},
    {key: '综漫', value: 465},
    {key: '闪婚', value: 466},
    {key: '隐婚', value: 467},
    {key: '冰山', value: 468},
    {key: '双面', value: 469},
    {key: '替身', value: 470},
    {key: '契约婚姻', value: 471},
    {key: '豪门世家', value: 473},
    {key: '日久生情', value: 474},
    {key: '破镜重圆', value: 475},
    {key: '双向奔赴', value: 476},
    {key: '一见钟情', value: 477},
    {key: '强强', value: 478},
    {key: '带球跑', value: 479},
    {key: '逃婚', value: 480},
    {key: '暗恋', value: 482},
    {key: '相爱相杀', value: 483},
    {key: 'HE', value: 484},
    {key: '职场商战', value: 485},
    {key: '明星', value: 486},
    {key: '医生', value: 487},
    {key: '律师', value: 488},
    {key: '现言萌宝', value: 489},
    {key: '厨娘', value: 490},
    {key: '毒医', value: 491},
    {key: '将军', value: 492},
    {key: '囤物资', value: 494},
    {key: '四合院', value: 495},
    {key: '抗战谍战', value: 504},
    {key: '破案', value: 505},
    {key: '电竞', value: 508},
    {key: '游戏主播', value: 509},
    {key: '大小姐', value: 519},
    {key: '大佬', value: 520},
    {key: '作精', value: 521},
    {key: '打脸', value: 522},
    {key: '前世今生', value: 523},
    {key: '双重生', value: 524},
    {key: '同人', value: 538},
    {key: '悬疑脑洞', value: 539},
    {key: '逃荒', value: 557},
    {key: '双洁', value: 702},
    {key: '双女主', value: 704},
    {key: '衍生同人', value: 718},
    {key: '豪门爽文', value: 745},
    {key: '游戏体育', value: 746},
    {key: '悬疑恋爱', value: 747},
    {key: '霸总', value: 748},
    {key: '青春甜宠', value: 749},
    {key: '职场婚恋', value: 750},
    {key: '搞笑轻松', value: 778}],
};
const _publishing_categories = {
  children: [
    {key: '都市', value: 1},
    {key: '都市生活', value: 2},
    {key: '现代言情', value: 3},
    {key: '古代言情', value: 5},
    {key: '玄幻', value: 7},
    {key: '科幻', value: 8},
    {key: '悬疑', value: 10},
    {key: '历史', value: 12},
    {key: '武侠', value: 16},
    {key: '幻想言情', value: 32},
    {key: '影视小说', value: 45},
    {key: '诗歌散文', value: 46},
    {key: '文学小说', value: 47},
    {key: '生活', value: 48},
    {key: '社会科学', value: 50},
    {key: '名著经典', value: 51},
    {key: '科技', value: 52},
    {key: '经济管理', value: 53},
    {key: '教育', value: 54},
    {key: '成功励志', value: 56},
    {key: '推理悬疑', value: 61},
    {key: '文化历史', value: 62},
    {key: '中国名著', value: 98},
    {key: '外国名著', value: 99},
    {key: '战神', value: 27},
    {key: '萌宝', value: 28},
    {key: '豪门总裁', value: 29},
    {key: '宠妻', value: 30},
    {key: '学霸', value: 82},
    {key: '公主', value: 83},
    {key: '皇后', value: 84},
    {key: '王妃', value: 85},
    {key: '女强', value: 86},
    {key: '嫡女', value: 88},
    {key: '精灵', value: 89},
    {key: '天才', value: 90},
    {key: '腹黑', value: 92},
    {key: '校园', value: 4},
    {key: '种田', value: 23},
    {key: '重生', value: 36},
    {key: '穿越', value: 37},
    {key: '娱乐圈', value: 43},
    {key: '推理', value: 61},
    {key: '直播', value: 69},
    {key: '大唐', value: 73},
    {key: '美食', value: 78},
    {key: '年代', value: 79},
    {key: '剑道', value: 80},
    {key: '盗墓', value: 81},
    {key: '甜宠', value: 96},
    {key: '战争', value: 97},
    {key: '灵异', value: 100},
    {key: '国学', value: 116},
    {key: '家庭', value: 125},
    {key: '明朝', value: 126},
    {key: '职场', value: 127},
    {key: '法律', value: 142},
    {key: '宫斗宅斗', value: 246},
    {key: '玄幻言情', value: 248},
    {key: '古言脑洞', value: 253},
    {key: '都市日常', value: 261},
    {key: '都市脑洞', value: 262},
    {key: '现言脑洞', value: 267},
    {key: '历史古代', value: 273},
    {key: '两性', value: 274},
    {key: '特种兵', value: 375},
    {key: '青梅竹马', value: 387},
    {key: '女扮男装', value: 388},
    {key: '民国', value: 390},
    {key: '外国文学', value: 397},
    {key: '古代文学', value: 398},
    {key: '当代文学', value: 399},
    {key: '现实小说', value: 400},
    {key: '文学理论', value: 401},
    {key: '中国历史', value: 402},
    {key: '世界历史', value: 403},
    {key: '历史传记', value: 404},
    {key: '人文社科', value: 405},
    {key: '哲学宗教', value: 406},
    {key: '心理学', value: 407},
    {key: '政治军事', value: 408},
    {key: '人物传记', value: 409},
    {key: '个人成长', value: 410},
    {key: '思维智商', value: 411},
    {key: '人际交往', value: 412},
    {key: '文化艺术', value: 413},
    {key: '亲子家教', value: 415},
    {key: '保健养生', value: 416},
    {key: '时尚美妆', value: 418},
    {key: '美食休闲', value: 419},
    {key: '家居旅游', value: 420},
    {key: '风水占卜', value: 421},
    {key: '经典国学', value: 423},
    {key: '架空', value: 452},
    {key: '今穿古', value: 463},
    {key: '冰山', value: 468},
    {key: '豪门世家', value: 473},
    {key: '一见钟情', value: 477},
    {key: '暗恋', value: 482},
    {key: 'HE', value: 484},
    {key: '学校教育', value: 721},
    {key: '成人教育', value: 722},
    {key: '豪门爽文', value: 745},
    {key: '悬疑恋爱', value: 747},
    {key: '霸总', value: 748},
    {key: '青春甜宠', value: 749},
    {key: '职场婚恋', value: 750},
    {key: '悬疑灵异', value: 751},
    {key: '官场', value: 788}],
};

// 分类配置
const categories = {
  data: {
    children: [
      {key: '男生', value: 1, child: _boys_categories},
      {key: '女生', value: 0, child: _girls_categories},
      {key: '出版', value: 150, child: _publishing_categories},
    ],
  },
};

// 获取分类数据
async function category(categories, opaque) {
  let type = categories[0];
  let category = categories[1];
  let offset = opaque ? opaque.offset : 0;
  let typeArg;
  if (type === 160) {
    typeArg = `genre_type=160`;
  } else {
    typeArg = `gender=${type}`;
  }
  let response = await fetch(`https://novel.snssdk.com/api/novel/channel/homepage/new_category/book_list/v1/?app_version=4.6.0&device_platform=android&aid=1319&app_name=super&parent_enterfrom=novel_channel_category.tab.&channel=ppx_wy_and_gaox_d_5&version_code=460&version_name=4.6.0&word_count=9&genre_type=0&creation_status=9&offset=${offset}&limit=100&category_id=${category}&${typeArg}`);
  if (response.status !== 200) {
    throw new NetworkError(response.status);
  }
  let $ = JSON.parse(response.data);
  if ($.code !== 0) {
    throw new SourceError(`${$.message}(${$.code})`);
  }
  return {
    data: {
      data: $.data.data.map(e => ({
        id: e.book_id,
        name: e.book_name,
        author: e.author,
        intro: e.abstract,
        cover: e.thumb_url,
        words: parseInt(e.word_number),
        category: e.category,
        updateTime: e.last_publish_time * 1000,
        lastChapterName: e.last_chapter_title,
        status: _convertStatus(e.creation_status),
      })),
      hasMore: $.data.has_more === 1,
      opaque: {
        offset: offset + 10,
      },
    },
  };
}
