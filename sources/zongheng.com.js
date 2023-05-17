// ==UserScript==
// @name:zh-CN    纵横中文网
// @domain        zongheng.com
// @description   上纵横小说, 看大神之作
// @version       1.0.0
// @icon          https://www.zongheng.com/favicon.ico
// @supportURL    https://github.com/open-book-source/booksource/issues
// @function      search
// ==/UserScript==

// 搜索
async function search(keyword, opaque) {
  let page = opaque ? opaque.page : 1;
  let response = await fetch(`https://search.zongheng.com/search/book?keyword=${keyword}&pageNo=${page}&pageNum=20&isFromHuayu=0`);
  if (response.status !== 200) {
    return {
      code: response.status,
      message: 'Network error!',
    };
  }
  let $ = JSON.parse(response.data);
  if ($.code !== 0) {
    return {
      code: 1,
      message: `${$.message}(${$.code})`,
    };
  }

  let array = [];
  $.data.datas.list.forEach((item) => {
    array.push({
      id: `${item.bookId}`,
      name: new Document(item.name).text,
      authorId: `${item.authorId}`,
      author: new Document(item.authorName).text,
      cover: `https://static.zongheng.com/upload${item.coverUrl}`,
      intro: new Document(item.description).text,
      words: item.totalWord,
      updateTime: item.updateTime,
      lastChapterName: item.chapterName,
      category: item.catePName,
      tags: new Document(item.keyword).text.split(' '),
      status: item.serialStatus === 0 ? 0 : 1,
    });
  });
  return {
    data: {
      data: array,
      hasMore: $.data.datas.pageNo < $.data.datas.totalPage,
      opaque: {
        page: $.data.datas.pageNo + 1,
      },
    },
  };
}
