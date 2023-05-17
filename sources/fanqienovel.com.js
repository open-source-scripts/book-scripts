// ==UserScript==
// @name:zh-CN    番茄小说网
// @domain        fanqienovel.com
// @version       1.0.0
// @icon          https://p1-tt.byteimg.com/origin/novel-static/a3621391ca2e537045168afda6722ee9
// @supportURL    https://github.com/open-book-source/booksource/issues
// @function      categories
// @function      search
// @function      detail
// @function      toc
// @function      chapter
// ==/UserScript==

function _convertStatus(status) {
  return status === '0' ? 1 : status === '1' ? 0 : status === '4' ? 2 : undefined
}

// 搜索
async function search(keyword, opaque) {
  let offset = opaque ? opaque.offset : 0;
  let response = await fetch(`https://api5-normal-lf.fqnovel.com/reading/bookapi/search/tab/v/?offset=${offset}&passback=&query=${keyword}&search_id=&iid=308323375917453&aid=1967&app_name=novelapp&version_code=504&version_name=5.0.4.32&device_platform=android`)
  if (response.status !== 200) {
    return {
      code: response.status,
      message: 'Network error!',
    };
  }
  let $ = JSON.parse(response.data);
  if ($.code !== 0) {
    return {code: 1, message: `${$.message}(${$.code})`};
  }
  let array = [];
  let tab = $.search_tabs[0];
  if (tab) {
    for (let i = 0; i < tab.data.length; i++) {
      let data = tab.data[i];
      let bookData = data.book_data;
      if (!bookData) continue;
      let item = bookData[0];
      array.push({
        id: item.book_id,
        name: item.book_name,
        author: item.author,
        intro: item.abstract,
        cover: item.thumb_url,
        words: parseInt(item.word_number),
        category: item.category,
        updateTime: item.last_publish_time * 1000,
        status: _convertStatus(item.creation_status),
      });
    }
  }
  return {
    data: {
      data: array,
    },
  };
}

// 详情
async function detail(id) {
  let response = await fetch(`https://api5-normal-lq.fqnovel.com/reading/bookapi/detail/v/?book_id=${id}&iid=466614321180296&aid=1967&version_code=290`);
  if (response.status !== 200) {
    return {
      code: response.status,
      message: 'Network error!',
    };
  }
  let $ = JSON.parse(response.data);
  if ($.code !== 0) {
    return {code: 1, message: `${$.message}(${$.code})`};
  }
  let item = $.data;
  return {
    data: {
      id: item.book_id,
      name: item.book_name,
      author: item.author,
      authorId: item.author_info.user_id,
      intro: item.abstract,
      cover: item.thumb_url,
      words: parseInt(item.word_number),
      updateTime: item.last_publish_time * 1000,
      lastChapterName: item.last_chapter_title,
      category: item.category,
      status: _convertStatus(item.creation_status),
    }
  };
}

// 目录
async function toc(id) {
  let response = await fetch(`https://api5-normal-lf.fqnovel.com/reading/bookapi/directory/all_items/v/?book_id=${id}&iid=2159861899465991&aid=1967&app_name=novelapp&version_code=311`);
  if (response.status !== 200) {
    return {
      code: response.status,
      message: 'Network error!',
    };
  }
  let $ = JSON.parse(response.data);
  if ($.code !== 0) {
    return {code: 1, message: `${$.message}(${$.code})`};
  }
  let array = [];
  let items = $.data.item_list;
  // 2048 characters
  let size = 80
  for (let i = 0; i < items.length; i += size) {
    let ids = items.slice(i, i + size).join(",");
    response = await fetch(`https://api5-normal-lf.fqnovel.com/reading/bookapi/directory/all_infos/v/?item_ids=${ids}&iid=2159861899465991&aid=1967&version_code=311&update_version_code=31132`);
    if (response.status !== 200) {
      return {
        code: response.status,
        message: 'Network error!',
      };
    }
    $ = JSON.parse(response.data);
    if ($.code !== 0) {
      return {code: 1, message: `${$.message}(${$.code})`};
    }
    $.data.forEach((item) => {
      array.push({
        name: item.title,
        id: JSON.stringify({
          gid: item.group_id,
          id: item.item_id,
        }),
      });
    })
  }
  return {
    data: array,
  };
}

// 章节
async function chapter(bid, cid) {
  let args = JSON.parse(cid);
  let response = await fetch(`https://novel.snssdk.com/api/novel/book/reader/full/v1/?group_id=${args.gid}&item_id=${args.id}&aid=1977`);
  if (response.status !== 200) {
    return {
      code: response.status,
      message: 'Network error!',
    };
  }
  let $ = JSON.parse(response.data)
  if ($.code !== 0) {
    return {code: 1, message: `${$.message}(${$.code})`};
  }
  return {
    data: {
      finalUrl: response.finalUrl,
      body: new Document($.data.content).querySelector('article').outerHtml,
    },
  };
}

const _sub_categories = {
  children: [
    // 全部,都市,玄幻,穿越,系统,重生,战神,都市修真,游戏动漫,神豪,悬疑,历史,赘婿,灵异,诸天万界,神医
    // 0,1,7,37,19,36,27,124,57,20,10,12,25,100,71,26
    {key: '全部', value: 0},
    {key: '都市', value: 1},
    {key: '玄幻', value: 7},
    {key: '穿越', value: 37},
    {key: '系统', value: 19},
    {key: '重生', value: 36},
    {key: '战神', value: 27},
    {key: '都市修真', value: 124},
    {key: '游戏动漫', value: 57},
    {key: '神豪', value: 20},
    {key: '悬疑', value: 10},
    {key: '历史', value: 12},
    {key: '赘婿', value: 25},
    {key: '灵异', value: 100},
    {key: '诸天万界', value: 71},
    {key: '神医', value: 26}
  ]
};

// 分类配置
const categories = {
  data: {
    children: [
      // 推荐榜,阅读榜,口碑榜,新书榜,完本榜,高分榜
      // 135,111,104,108,116,115
      {key: '推荐榜', value: 135, child: _sub_categories},
      {key: '完本榜', value: 116, child: _sub_categories},
      {key: '口碑榜', value: 104, child: _sub_categories},
      {key: '阅读榜', value: 111, child: _sub_categories},
      {key: '高分榜', value: 115, child: _sub_categories},
      {key: '新书榜', value: 108, child: _sub_categories},
    ]
  },
};

// 获取分类数据
async function category(categories, opaque) {
  let type = categories[0];
  let category = categories[1];
  let offset = opaque ? opaque.offset : 0;
  let response = await fetch(`https://api5-normal-lf.fqnovel.com/reading/bookapi/bookmall/cell/change/v1/?offset=${offset}&algo_type=${type}&category_id=${category}&cell_gender=1&cell_id=7012498137822527496&genre_type=0&list_type=daily&change_type=1&book_type=0&iid=730526249649336&aid=1967&app_name=novelapp&version_code=307`)
  if (response.status !== 200) {
    return {
      code: response.status,
      message: 'Network error!',
    };
  }
  let $ = JSON.parse(response.data)
  if ($.code !== 0) {
    return {code: 1, message: `${$.message}(${$.code})`};
  }
  let array = [];
  let data = $.data.cell_view.book_data;
  if (data) {
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      array.push({
        id: item.book_id,
        name: item.book_name,
        author: item.author,
        intro: item.abstract,
        cover: item.thumb_url,
        words: parseInt(item.word_number),
        category: item.category,
        updateTime: item.last_publish_time * 1000,
        status: _convertStatus(item.creation_status),
      });
    }
  }
  return {
    data: {
      data: array,
    },
  };
}
