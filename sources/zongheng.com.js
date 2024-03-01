// ==UserScript==
// @name          纵横中文网
// @domain        zongheng.com
// @description   上纵横小说, 看大神之作
// @version       1.0.1
// @icon          https://www.zongheng.com/favicon.ico
// @supportURL    https://github.com/open-source-scripts/book-scripts/issues
// @function      categories
// @function      search
// @function      toc
// @function      chapter
// @function      configure
// ==/UserScript==

async function subCategories(bookType) {
  let response = await fetch(`https://www.zongheng.com/api2/catefine/storeSearchConf?bookType=${bookType}`);
  if (response.status !== 200) {
    throw new NetworkError(response.status);
  }
  let $ = JSON.parse(response.data);
  if ($.code !== 200) {
    throw new SourceError(`${$.message}(${$.code})`);
  }
  let node = {
    key: '作品分类', value: 0, child: {
      children: $.result.categoryList.list.map((item) => {
        let child;
        if (item.categoryList) {
          child = {children: item.categoryList.map(item => ({key: item.name, value: item.paramValue}))};
        }
        return {key: item.name, value: item.paramValue, child: child};
      }),
    },
  };
  let items = [
    ...$.result.filtrateTypeList.map(item => ({
      key: item.name, value: item.paramName, child: {
        children: item.filtrateOptionList.map(item => ({key: item.name, value: item.paramValue})),
      },
    })),
    {
      key: '作品排序', value: 0, child: {
        children: $.result.sortOptionList.map((item) => {
          if (item.subSortList) {
            return item.subSortList.map((item) => ({key: item.name, value: item.paramValue}));
          } else {
            return [{key: item.name, value: item.paramValue}];
          }
        }).flat(),
      },
    },
  ];
  for (const childNode of node.child.children) {
    let filter = childNode.child;
    if (filter) {
      let nodes = filter.children;
      for (const item of items) {
        nodes.map(e => e.child = item.child);
        nodes = item.child.children;
      }
    } else {
      let nodes;
      for (const item of items) {
        if (nodes) {
          nodes.map(e => e.child = item.child);
          nodes = item.child.children;
        } else {
          childNode.child = {children: item.child.children};
          nodes = childNode.child.children;
        }
      }
    }
  }
  return node.child;
}

// 分类配置
async function categories() {
  return {
    data: {
      children: [
        {
          key: '排行榜', value: '', child: {
            children: [
              {key: '月票榜', value: 1},
              {key: '新书榜', value: 4},
              {key: '点击榜', value: 5},
              {key: '推荐榜', value: 6},
              {key: '捧场榜', value: 7},
              {key: '完结榜', value: 8},
              {key: '新书订阅榜', value: 9},
              {key: '24小时畅销榜', value: 3},
              {key: '24小时更新榜', value: 10},
              {key: '作者人气榜', value: 12},
            ],
          },
        },
        {key: '男生', value: 0, child: await subCategories(0)},
        {key: '女生', value: 1, child: await subCategories(1)},
      ],
    },
  };
}

// 获取分类数据
async function category(categories, opaque) {
  let type = categories[0];
  let page = opaque ? opaque.page : 1;
  if (type === '') {
    let response = await fetch(`https://www.zongheng.com/api/rank/details`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: `cateFineId=0&cateType=0&pageNum=${page}&pageSize=20&period=0&rankNo=&rankType=${categories[1]}`,
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
        data: $.result.resultList.map((item) => ({
          id: `${item.bookId}`,
          name: item.bookName,
          authorId: `${item.authorId}`,
          author: item.pseudonym,
          cover: item.bookCover,
          intro: item.description,
          updateTime: Date.parseWithFormat(item.latestChapterTime, item.latestChapterTime.length === 11 ? 'MM-dd HH:mm' : 'yyyy-MM-dd HH:mm'),
          lastChapterName: item.latestChapterName,
          category: item.cateFineName,
          status: item.serialStatus === 0 ? 0 : 1,
        })),
        hasMore: $.result.pageNum * $.result.pageSize < $.result.rankCount,
        opaque: {
          page: $.result.pageNum + 1,
        },
      },
    };
  } else {
    let categoryPid = categories[1];
    let categoryId, word, status, vip, order;
    if (categoryPid === '') {
      categoryId = 0;
      word = categories[2];
      status = categories[3];
      vip = categories[4];
      order = categories[5];
    } else {
      categoryId = categories[2];
      word = categories[3];
      status = categories[4];
      vip = categories[5];
      order = categories[6];
    }
    let response = await fetch(`https://www.zongheng.com/api2/catefine/storeSearch`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: `worksTypes=${categoryPid}&bookType=${type}&subWorksTypes=0&totalWord=${word}&serialStatus=${status}&vip=${vip}&pageNum=${page}&pageSize=20&categoryId=${categoryId}&categoryPid=${categoryPid}&order=${order}&naodongFilter=0`,
    });
    if (response.status !== 200) {
      throw new NetworkError(response.status);
    }
    let $ = JSON.parse(response.data);
    if ($.code !== 200) {
      throw new SourceError(`${$.message}(${$.code})`);
    }
    return {
      data: {
        data: $.result.bookList.map((item) => ({
          id: `${item.bookId}`,
          name: item.name,
          authorId: `${item.authorId}`,
          author: item.authorName,
          cover: item.picUrl,
          words: item.totalWords,
          intro: item.description,
          lastChapterName: item.theNewChapter,
          category: item.categoryName,
          status: item.serialStatus === 0 ? 0 : 1,
        })),
        hasMore: $.result.pageNum < $.result.pageCount,
        opaque: {
          page: $.result.pageNum + 1,
        },
      },
    };
  }
}

// 搜索
async function search(keyword, opaque) {
  let page = opaque ? opaque.page : 1;
  let response = await fetch(`https://search.zongheng.com/search/book?keyword=${keyword}}&sort=null&pageNo=${page}&pageNum=20&isFromHuayu=0`);
  if (response.status !== 200) {
    throw new NetworkError(response.status);
  }
  let $ = JSON.parse(response.data);
  if ($.code !== 0) {
    throw new SourceError(`${$.message}(${$.code})`);
  }
  return {
    data: {
      data: $.data.datas.list.map((item) => ({
        id: `${item.bookId}`,
        name: new Document(item.name).text,
        authorId: `${item.authorId}`,
        author: new Document(item.authorName).text,
        cover: `https://static.zongheng.com/upload${item.coverUrl}`,
        intro: new Document(item.description).text,
        words: item.totalWord,
        updateTime: item.updateTime,
        lastChapterName: item.chapterName,
        category: item.cateFineName,
        tags: new Document(item.keyword).text.split(' '),
        status: item.serialStatus === 0 ? 0 : 1,
      })),
      hasMore: $.data.datas.pageNo < $.data.datas.totalPage,
      opaque: {page: $.data.datas.pageNo + 1},
    },
  };
}

async function toc(id) {
  let response = await fetch(`https://bookapi.zongheng.com/api/chapter/getChapterList`, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: `bookId=${id}`,
  });
  if (response.status !== 200) {
    throw new NetworkError(response.status);
  }
  let $ = JSON.parse(response.data);
  if ($.code !== 0) {
    throw new SourceError(`${$.message}(${$.code})`);
  }
  return {
    data: $.result.chapterList.map((item) => ({
      name: item.tome.tomeName,
      children: item.chapterViewList.map(item => ({
        name: item.chapterName,
        id: `${item.chapterId}`,
        vip: item.level === 1,
        url: `https://read.zongheng.com/chapter/${id}/${item.chapterId}.html`,
      })),
    })),
  };
}

async function chapter(bid, cid) {
  let response = await fetch(`https://read.zongheng.com/chapter/${bid}/${cid}.html`, {
    headers: {cookie: await Storage.get('cookie')},
  });
  if (response.status !== 200) {
    throw new NetworkError(response.status);
  }
  let $ = new Document(response.data);
  let vip = $.querySelector('div.reader-end.reader-order > div.tit');
  if (vip) {
    throw new UnconfiguredError('Vip 章节，请购买后阅读');
  }
  return {
    data: {
      finalUrl: response.finalUrl,
      body: $.querySelector('.content').text,
    },
  };
}

// 配置
async function configure() {
  // 网页登录
  let response = await UI.configure({
    cookie: {
      'type': 'string',
      'required': true,
      'description': '输入 www.zongheng.com 网站 cookie 值',
      'hint': 'ZHID=...',
      'tip': '登录 www.zongheng.com 后, 复制浏览器中的 cookie 值, 粘贴到此处',
    },
  });
  // 判断是否已登录
  if (response && response['cookie']) {
    await Storage.put('cookie', response['cookie']);
    return true;
  }
  return false;
}

// 是否已配置
async function configured() {
  return Storage.exists('cookie');
}

// 取消配置
async function unconfigure() {
  return Storage.delete('cookie');
}
