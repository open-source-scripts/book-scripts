// ==UserScript==
// @status        obsolete
// @name          起点中文网
// @domain        qidian.com
// @version       1.0.0
// @icon          https://imgservices-1252317822.image.myqcloud.com/coco/s02202023/6acc624d.7d98d6.png
// @supportURL    https://github.com/open-source-scripts/book-scripts/issues
// @function      categories
// @function      search
// @function      detail
// @function      toc
// @function      chapter
// ==/UserScript==

function parseWords(text) {
  if (text.endsWith('万')) {
    return parseInt(text.replace('万', '')) * 10000;
  } else {
    return parseInt(text);
  }
}

async function search(keyword, opaque) {
  let page = opaque ? opaque.page : 1;
  let response = await fetch(`https://www.qidian.com/soushu/${keyword}.html?page=${page}`, {
    headers: {
      'User-Agent': UserAgents.macos,
    },
  });
  if (response.status !== 200) {
    throw new NetworkError(response.status);
  }
  let $ = new Document(response.data);
  let nodes = $.querySelectorAll('.book-img-text ul li');
  return {
    data: {
      data: nodes?.map(item => {
        let nameElement = item.querySelector('div.book-mid-info a');
        let authorElement = item.querySelector('.author a');
        return {
          id: `${nameElement.getAttribute('data-bid')}`,
          name: nameElement.text.trim(),
          author: authorElement.text,
          authorId: authorElement.getAttribute('href').split('/')[4],
          intro: item.querySelector('.intro').text,
          cover: item.querySelector('div.book-img-box img').getAttribute('src'),
          words: parseWords(item.querySelector('.total p span').text.trim()),
          lastChapterName: item.querySelector('.update a').text.replace('最新更新 ', ''),
          category: item.querySelector('.author a:nth-child(4)').text,
        };
      }),
      hasMore: !!$.querySelector('.lbf-pagination-next.lbf-pagination-disabled'),
      opaque: {
        page: page + 1,
      },
    },
  };
}