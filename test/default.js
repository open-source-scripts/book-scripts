// 默认测试脚本

async function main() {
    console.verbose('书源测试开始\n');

    let firstBook;
    let firstChapter;

    // 分类
    if (typeof (categories) !== 'undefined') {
        let cateArgs = [];
        let children;
        if (typeof categories === 'function') {
            children = (await categories()).data.children;
        } else {
            children = categories.data.children;
        }

        while (children && children.length > 0) {
            let child = children[0];
            cateArgs.push(child.value);
            children = child.child?.children;
        }
        console.log(`分类开始, 参数: ${JSON.stringify(cateArgs)}`);
        let response = await category(cateArgs);
        if (response.code !== undefined && response.code !== 0) {
            console.error(`分类失败: ${response.message ?? '未知'}\n`);
            return;
        }
        let length = response.data.data?.length;
        if (!(length && length > 0)) {
            console.error('分类失败: 没有找到书籍\n');
            return;
        }
        console.log(`书籍数据: ${JSON.stringify(response.data.data[0])}`);
        console.log(`分类结束, 找到${length}本书, ${response.data.hasMore ? '有' : '没有'}更多\n`);

        // 分类下一页
        let nextOpaque = response.data.opaque;
        if (response.data.hasMore) {
            console.log(`分类下一页, 参数: ${JSON.stringify(cateArgs)}, ${JSON.stringify(nextOpaque)}`);
            let response = await category(cateArgs, nextOpaque);
            if (response.code !== undefined && response.code !== 0) {
                console.error(`分类下一页失败: (${response.code})${response.message ?? '未知'}\n`);
                return;
            }
            let length = response.data.data?.length;
            if (!(length && length > 0)) {
                console.error('分类下一页失败: 没有找到书籍\n');
                return;
            }
            console.log(`分类下一页结束, 找到${length}本书, ${response.data.hasMore ? '有' : '没有'}更多\n`);
        }
    } else {
        console.log(`分类方法不存在\n`);
    }

    // 搜索
    if (typeof (search) !== 'undefined') {
        let keyword = '都市';
        console.log(`搜索开始, 关键字: ${keyword}`);
        let response = await search(keyword);
        if (response.code !== undefined && response.code !== 0) {
            console.error(`搜索失败: (${response.code})${response.message ?? '未知'}\n`);
            return;
        }
        let length = response.data.data?.length;
        if (!(length && length > 0)) {
            console.error('搜索失败: 没有找到书籍\n');
            return;
        }
        console.log(`搜索结束, 找到${length}本书, ${response.data.hasMore ? '有' : '没有'}更多`);

        firstBook = response.data.data[0];
        console.log(`搜索结束, 书籍: ${JSON.stringify(firstBook)}\n`);

        // 搜索下一页
        let nextOpaque = response.data.opaque;
        if (response.data.hasMore) {
            console.log(`搜索下一页, 关键字: ${keyword}, 参数: ${JSON.stringify(nextOpaque)}`);
            let response = await search(keyword, nextOpaque);
            if (response.code !== undefined && response.code !== 0) {
                console.error(`搜索下一页失败: (${response.code})${response.message ?? '未知'}\n`);
                return;
            }
            let length = response.data.data?.length;
            if (!(length && length > 0)) {
                console.error('搜索下一页失败: 没有找到书籍\n');
                return;
            }
            console.log(`搜索下一页结束, 找到${length}本书, ${response.data.hasMore ? '有' : '没有'}更多\n`);
        }
    } else {
        console.log(`搜索方法不存在\n`);
    }

    // 详情
    if (typeof (detail) !== 'undefined') {
        console.log(`详情开始, 书籍: ${firstBook.id}`);
        let response = await detail(firstBook.id);
        if (response.code !== undefined && response.code !== 0) {
            console.error(`详情失败: ${response.message}\n`);
            return;
        }
        console.log(`详情结束, 书籍: ${JSON.stringify(response.data)}\n`);
    } else {
        console.log(`详情方法不存在\n`);
    }

    // 目录
    if (typeof (toc) !== 'undefined') {
        console.log(`目录开始`);
        let response = await toc(firstBook.id);
        if (response.code !== undefined && response.code !== 0) {
            console.error(`目录失败: ${response.message}\n`);
            return;
        }
        let tocLength = response.data?.length;
        if (!(tocLength && tocLength > 0)) {
            console.error('目录失败: 没有找到书籍\n');
            return;
        }
        console.log(`目录结束, 找到${response.data.length}章节`);

        firstChapter = response.data[0];
        console.log(`目录结束, 目录: ${JSON.stringify(firstChapter)}\n`);
    } else {
        console.log(`目录方法不存在\n`);
    }

    // 章节
    if (typeof (chapter) !== 'undefined') {
        console.log(`章节开始, 章节: (${firstBook.id}, ${firstChapter.id})`);
        let response = await chapter(firstBook.id, firstChapter.id);
        if (response.code !== undefined && response.code !== 0) {
            console.error(`章节失败: ${response.message}\n`);
            return;
        }
        console.log(`章节结束, 内容: ${JSON.stringify(response.data)}\n`);
    } else {
        console.log(`章节方法不存在\n`);
    }

    console.verbose('书源测试结束');
}

main();
