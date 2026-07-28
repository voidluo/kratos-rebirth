// @ts-check
/**
 * 修复 hexo-server 在开发环境下为 atom.xml / rss.xml 设置 Content-Type 时缺少 charset=utf-8 的问题。
 * 该脚本在 postinstall 后自动执行，将 node_modules 中的硬编码 'application/atom+xml' 追加 charset。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(
    __dirname,
    '..',
    'node_modules',
    'hexo-server',
    'lib',
    'middlewares',
    'route.js'
);

if (!fs.existsSync(targetPath)) {
    console.warn('[patch-atom-charset] route.js not found, skipping.');
    process.exit(0);
}

let content = fs.readFileSync(targetPath, 'utf8');

const atomOld = "res.setHeader('Content-Type', 'application/atom+xml')";
const atomNew = "res.setHeader('Content-Type', 'application/atom+xml; charset=utf-8')";

const rssOld = "res.setHeader('Content-Type', 'application/rss+xml')";
const rssNew = "res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')";

let changed = false;

if (content.includes(atomOld) && !content.includes(atomNew)) {
    content = content.split(atomOld).join(atomNew);
    changed = true;
}

if (content.includes(rssOld) && !content.includes(rssNew)) {
    content = content.split(rssOld).join(rssNew);
    changed = true;
}

if (changed) {
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log('[patch-atom-charset] ✓ 已为 atom.xml/rss.xml 添加 charset=utf-8');
} else {
    console.log('[patch-atom-charset] - 无需修改');
}
