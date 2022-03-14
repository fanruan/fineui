const { resolve, relative, join } = require("path");
const { writeFileSync, readdirSync, statSync } = require("fs");
const { spawnSync } = require('child_process');

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

function readDirSync(directoryPath) {
    let content = '';
    const pa = readdirSync(directoryPath);
    pa.forEach(file => {
        const filePath = `${directoryPath}/${file}`;
        const info = statSync(filePath);
        if (info.isDirectory()) {
            content += readDirSync(filePath);
        } else {
            content += `@import "./${relative(lessPath, filePath)}";\n`;
        }
    });

    return content;
}

function finalizeCompile() {
    let componentsLessContent = readDirSync(lessPath);

    componentsLessContent += `@import "./public.less";\n`;

    writeFileSync(
        join(lessPath, 'fineui.less'),
        componentsLessContent,
    );
}

removeFiles(`${lessPath}/font`);
removeFiles(`${lessPath}/public.less`);
removeFiles(`${lessPath}/fineui.less`);

finalizeCompile();

copyFiles(`${process.cwd()}/dist/font`, lessPath);
copyFiles(`${process.cwd()}/public/less/var.less`, `${lessPath}/public.less`);
