const { resolve } = require("path");
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("fs");
const rimraf = require("rimraf");
const grunt = require("grunt");

const dest = resolve(__dirname, '../../dist');

const $dest = resolve(dest, './2.0');

if (!existsSync($dest)) {
    mkdirSync($dest);
}

const deleteList = [
    "fineui.ie.min.css",
    "fineui_without_jquery_polyfill.css",
    "font.js",
    "font.js.map",
    "2.0/fineui.ie.min.css",
    "2.0/fineui_without_normalize.js",
    "2.0/fineui_without_normalize.js.map",
    "2.0/fineui_without_normalize.min.js",
    "2.0/fineui_without_normalize.min.js.map",
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

const fileList = ['demo.js', 'fineui.js', '2.0/fineui.js'];
fileList.forEach(filename => {
    const sourcefile = resolve(dest, `./${filename}`);
    
    const content = `${readFileSync(sourcefile, { encoding: 'utf8' })}
//# sourceMappingURL=./${filename}.map`;

    writeFileSync(sourcefile, content);
});
