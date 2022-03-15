const { resolve, join } = require("path");
const { writeFileSync } = require("fs");
const { spawnSync } = require('child_process');
const { bundleWithoutNormalize } = require('../../webpack/attachments');

function pad2(n) {// always returns a string
    return (n < 10 ? "0" : "") + n;
}

const d = new Date();

const version = d.getFullYear() +
    pad2(d.getMonth() + 1) +
    pad2(d.getDate()) +
    pad2(d.getHours()) +
    pad2(d.getMinutes()) +
    pad2(d.getSeconds());

const packageJSON = require("../../package.json");

const versionChars = packageJSON.version.split(".");

versionChars[versionChars.length - 1] = version;

packageJSON.version = versionChars.join(".");

packageJSON.publishConfig.registry = 'https://npm.fineres.com/';

packageJSON.name = "@fui/core";

writeFileSync(resolve(__dirname, "../../package.json"), JSON.stringify(packageJSON, null, 2));

// 将less打包成fineui.less发布到npm以供用户定制主题
const lessPath = join(process.cwd(), '/src/less');

function copyFiles(from, to) {
    spawnSync('cp', ['-r', from, to]);
}

function removeFiles(src) {
    spawnSync('rm', ['-rf', src]);
}

function finalizeCompile() {
    let lessContent = '';

    bundleWithoutNormalize.forEach(path => {
        const relativePath = path.replace(/.*src\/less/, 'src/less').replace(/.*public\/less/, 'public/less');
        lessContent += `@import "../../${relativePath}";\n`;
    });

    writeFileSync(
        join(lessPath, 'fineui.less'),
        lessContent,
    );
}

removeFiles(`${lessPath}/font`);
removeFiles(`${lessPath}/fineui.less`);

finalizeCompile();

copyFiles(`${process.cwd()}/dist/font`, lessPath);
