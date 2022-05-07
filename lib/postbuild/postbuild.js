const { resolve } = require("path");
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("fs");
const rimraf = require("rimraf");
const grunt = require("grunt");
const concat = require("concat");
const { config } = require("../../webpack/attachments")

const dest = resolve(__dirname, '../../dist');

const $dest = resolve(dest, './2.0');

if (!existsSync($dest)) {
    mkdirSync($dest);
}

const deleteList = [
    "fineui_without_jquery_polyfill.css",
    "font.js",
    "font.js.map",
    "resource.js",
    "resource.js.map",
    "2.0/fineui_without_normalize.js",
    "2.0/fineui_without_normalize.js.map",
    "2.0/fineui_without_normalize.min.js",
    "2.0/fineui_without_normalize.min.js.map",
    "fineui_without_normalize.min.js",
    "fineui_without_normalize.min.js.map",
].concat(grunt.file.expand({}, [
    "dist/*.css.map",
    "dist/**/*.css.map",
]).map(name => name.replace("dist/", "")));

deleteList.forEach(filename => {
    const sourcefile = resolve(dest, `./${filename}`);

    rimraf(sourcefile, () => {
        console.log(`${sourcefile} deleted`);
    });
});

const fileList = ['demo.js', 'fineui.js', '2.0/fineui.js', 'core.js'];
fileList.forEach(filename => {
    const sourcefile = resolve(dest, `./${filename}`);

    const paths = filename.split("/");

    const name = paths[paths.length - 1];

    const content = `${readFileSync(sourcefile, { encoding: 'utf8' })}
//# sourceMappingURL=./${name}.map`;

    writeFileSync(sourcefile, content);
});

concat(config, resolve(dest, "resource.js"));
