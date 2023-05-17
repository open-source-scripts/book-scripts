// ==UserScript==
// @name          起点中文网
// @name:zh-CN    起点中文网
// @domain        qidian.com
// @require       https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js
// @version       1.0.0
// @icon          https://imgservices-1252317822.image.myqcloud.com/coco/s02202023/6acc624d.7d98d6.png
// @supportURL    https://github.com/open-book-source/booksource/issues
// @function      categories
// @function      search
// @function      detail
// @function      toc
// @function      chapter
// ==/UserScript==

async function search(key) {
  let response = await fetch(`https://druid.if.qidian.com/Atom.axd/Api/Search/GetBookStoreWithCategory?type=-1&needDirect=1&key=${encodeURI(key)}`);
}