const { resolve } = require("path");
const { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } = require("fs");
const rimraf = require("rimraf");

const dest = resolve(__dirname, '../../dist');

const $dest = resolve(dest, './2.0');

if (!existsSync($dest)) {
    mkdirSync($dest);
}

const deleteList = [
    "bundle.ie.css",
    "bundle_without_normalize.js",
    "bundle_without_normalize.js.map",
    "fineui.ie.css",
    "fineui_without_jquery_polyfill.css",
];

const copyList = [{
    source: "bundle.min",
    exts: ["css", "js", "js.map"],
    targets: ["2.0/fineui", "2.0/fineui.min"],
}, {
    source: "bundle_without_normalize",
    exts: ["css"],
    targets: ["2.0/fineui_without_normalize", "2.0/fineui_without_normalize.min"],
}, {
    source: "fineui",
    exts: ["css", "js", "js.map"],
    targets: ["fineui.min"],
}, {
    source: "utils",
    exts: ["js", "js.map"],
    targets: ["utils.min"],
}, {
    source: "bundle.ie",
    exts: ["js", "js.map"],
    targets: ["2.0/fineui.ie", "2.0/fineui.ie.min"],
}];

copyList.forEach(conf => {
    conf.exts.forEach(ext => {
        const sourcefile = resolve(dest, `./${conf.source}.${ext}`);

        if (!existsSync(sourcefile)) {
            console.log(`${sourcefile} does not exist!`);
        }

        conf.targets.forEach(target => {
            copyFileSync(sourcefile, resolve(dest, `./${target}.${ext}`));
        });
    });
});

deleteList.forEach(filename => {
    const sourcefile = resolve(dest, `./${filename}`);

    rimraf(sourcefile, () => {
        console.log(`${sourcefile} deleted`);
    });
});

const demoJs = resolve(dest, './demo.js');

const content = `${readFileSync(demoJs, { encoding: 'utf8' })}
//# sourceMappingURL=./demo.js.map`;

writeFileSync(demoJs, content);
