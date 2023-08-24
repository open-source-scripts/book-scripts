// ==UserScript==
// @name          番茄小说网
// @description   感谢 https://github.com/fengyuecanzhu/FQWeb 项目
// @domain        fanqienovel.com
// @version       1.0.1
// @icon          https://p1-tt.byteimg.com/origin/novel-static/a3621391ca2e537045168afda6722ee9
// @supportURL    https://github.com/open-book-source/booksource/issues
// @function      categories
// @function      search
// @function      detail
// @function      toc
// @function      chapter
// ==/UserScript==

const host = `http://list.fqapi.jilulu.cn`;

function _convertStatus(status) {
  return status === '0' ? 1 : status === '1' ? 0 : status === '4' ? 2 : undefined
}

// 搜索
async function search(keyword, opaque) {
  let page = opaque ? opaque.page : 1;
  let response = await fetch(`${host}/search?query=${keyword}&page=${page}`)
  if (response.status !== 200) {
    return { code: response.status, message: 'Network error!' };
  }
  let $ = JSON.parse(response.data);
  if (!$.isSuccess) {
    return { code: 1, message: `${$.errorMsg}` };
  }
  if ($.data.code !== '0') {
    return { code: 2, message: `${$.data.message}(${$.data.code})` };
  }
  let array = [];
  let tab = $.data.search_tabs[0];
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
  let response = await fetch(`${host}/info?book_id=${id}`);
  if (response.status !== 200) {
    return { code: response.status, message: 'Network error!' };
  }
  let $ = JSON.parse(response.data);
  if (!$.isSuccess) {
    return { code: 1, message: `${$.errorMsg}` };
  }
  if ($.data.code !== '0') {
    return { code: 2, message: `${$.data.message}(${$.data.code})` };
  }
  let item = $.data.data;
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
  let response = await fetch(`${host}/catalog?book_id=${id}`);
  if (response.status !== 200) {
    return { code: response.status, message: 'Network error!' };
  }
  let $ = JSON.parse(response.data);
  if (!$.isSuccess) {
    return { code: 1, message: `${$.errorMsg}` };
  }
  if ($.data.code !== '0') {
    return { code: 2, message: `${$.data.message}(${$.data.code})` };
  }
  return {
    data: $.data.data.item_data_list.map((e) => {
      return {
        id: e.item_id,
        name: e.title,
      };
    }),
  };
}

// 章节
async function chapter(bid, cid) {
  let response = await fetch(`${host}/content?item_id=${cid}`);
  if (response.status !== 200) {
    return { code: response.status, message: 'Network error!' };
  }
  let $ = JSON.parse(response.data);
  if ($.code != 0) {
    return { code: 1, message: `${$.message}` };
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
    // 全部,都市,玄幻,穿越,系统,重生,战神,都市修真,游戏动漫,神豪,悬疑,历史,赘婿,灵异,诸天万界,神医
    // 0,1,7,37,19,36,27,124,57,20,10,12,25,100,71,26
    { key: '全部', value: 0 },
    { key: '都市', value: 1 },
    { key: '玄幻', value: 7 },
    { key: '穿越', value: 37 },
    { key: '系统', value: 19 },
    { key: '重生', value: 36 },
    { key: '战神', value: 27 },
    { key: '都市修真', value: 124 },
    { key: '游戏动漫', value: 57 },
    { key: '神豪', value: 20 },
    { key: '悬疑', value: 10 },
    { key: '历史', value: 12 },
    { key: '赘婿', value: 25 },
    { key: '灵异', value: 100 },
    { key: '诸天万界', value: 71 },
    { key: '神医', value: 26 }
  ]
};

// 分类配置
const categories = {
  data: {
    children: [
      // 推荐榜,阅读榜,口碑榜,新书榜,完本榜,高分榜
      // 135,111,104,108,116,115
      { key: '推荐榜', value: 135, child: _sub_categories },
      { key: '完本榜', value: 116, child: _sub_categories },
      { key: '口碑榜', value: 104, child: _sub_categories },
      { key: '阅读榜', value: 111, child: _sub_categories },
      { key: '高分榜', value: 115, child: _sub_categories },
      { key: '新书榜', value: 108, child: _sub_categories },
    ]
  },
};

// 获取分类数据
async function category(categories, opaque) {
  let type = categories[0];
  let category = categories[1];
  let offset = opaque ? opaque.offset : 0;
  let response = await fetch(`${host}/reading/bookapi/bookmall/cell/change/v1/?offset=${offset}&algo_type=${type}&category_id=${category}&cell_gender=1&cell_id=7012498137822527496&genre_type=0&list_type=daily&change_type=1&book_type=0&iid=730526249649336&aid=1967&app_name=novelapp&version_code=307`)
  if (response.status !== 200) {
    return { code: response.status, message: 'Network error!' };
  }
  let $ = JSON.parse(response.data);
  if (!$.isSuccess) {
    return { code: 1, message: `${$.errorMsg}` };
  }
  if ($.data.code !== '0') {
    return { code: 2, message: `${$.data.message}(${$.data.code})` };
  }
  return {
    data: {
      data: $.data.data.cell_view.book_data.map((e) => {
        return {
          id: e.book_id,
          name: e.book_name,
          author: e.author,
          intro: e.abstract,
          cover: e.thumb_url,
          words: parseInt(e.word_number),
          category: e.category,
          updateTime: e.last_publish_time * 1000,
          status: _convertStatus(e.creation_status),
        };
      }),
    },
  };
}
