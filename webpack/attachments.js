const grunt = require("grunt");

function uniq(names) {
    return [...new Set(names)];
}

function sync(patterns) {
    return uniq(grunt.file.expand({ filter: path => !new RegExp(/__test__/g).test(path) }, patterns)).map(name => `./${name}`);
}

const fixJs = "./dist/fix/fix.js";
const fixIEJs = "./dist/fix/fix.ie.js";
const lodashJs = "src/core/lodash.js";

const basicAttachmentMap = {
    polyfill: sync(["src/core/foundation.js", "src/polyfill/**/*.js"]).concat(["@babel/polyfill", "es6-promise/auto"]),
    polyfillIE: sync(["src/core/foundation.js", "src/polyfill/**/*.js"]).concat([
        "core-js/features/object/define-property",
        "core-js/features/object/create",
        "core-js/features/object/assign",
        "core-js/features/object/get-own-property-symbols",
        "core-js/features/object/get-prototype-of",
        "core-js/features/array/for-each",
        "core-js/features/array/index-of",
        "core-js/features/function/bind",
        "core-js/features/promise",
        "core-js/features/string/replace",
        "core-js/es/map",
        // "core-js",
    ]),
    core: sync([
        "src/less/core/**/*.less",
        "src/less/theme/**/*.less",
        "src/core/foundation.js",
        lodashJs,
        // 'src/core/mvc/**/*.js',
        "src/core/base.js",
        "src/core/ob.js",
        "src/core/widget.js",
        // 'src/core/model.js',
        // 'src/core/view.js',
        "src/core/shortcut.js",
        "src/core/utils/**/*.js",
        "src/core/behavior/behavior.js",
        "src/core/wrapper/layout.js",
        "src/core/plugin.js",
        "src/core/**/*.js",
        "src/data/data.js",
        "src/data/**/*.js",
    ]),
    // 最基础的控件
    base: sync([
        "src/less/base/**/*.less",
        "src/third/**/*.js",
        "src/base/pane.js",
        "src/base/single/single.js",
        "src/base/single/text.js",
        "src/base/single/button/button.basic.js",
        "src/base/single/button/button.node.js",
        "src/base/single/tip/tip.js",
        "src/base/combination/group.button.js",
        "src/base/combination/tree.button.js",
        "src/base/tree/ztree/treeview.js",
        "src/base/tree/ztree/asynctree.js",
        "src/base/tree/ztree/parttree.js",
        "src/base/tree/ztree/list/listtreeview.js",
        "src/base/tree/ztree/list/listasynctree.js",
        "src/base/tree/ztree/list/listparttree.js",
        "src/base/**/*.js",
    ]),
    // 实现好的一些基础实例
    case: sync([
        "src/case/combo/popup.bubble.js",
        "src/case/**/*.js",
    ]),
    widget: sync([
        "src/less/widget/**/*.less",
        "src/widget/**/*.js",
        "src/component/**/*.js",
    ]),
    router: sync([
        "src/router/**/*.js",
    ]),
    'core_without_normalize': sync(
        ["src/less/core/**/*.less", "src/less/theme/**/*.less", "!src/less/core/normalize.less", "!src/less/core/normalize2.less"],
    ),
    resource: sync(["src/less/resource/**/*.less"]),
    font: sync(["public/less/font.less"]),
    ts: ['./typescript/bundle.ts'],
    ui: sync([
        'ui/less/app.less',
        'ui/less/**/*.less',
        'ui/js/**/*.js',
    ]),
    config: sync(["demo/version.js", "i18n/i18n.cn.js"]),
    utils: sync([
        "src/core/foundation.js",
        lodashJs,
        "src/core/var.js",
        "src/core/func/array.js",
        "src/core/func/number.js",
        "src/core/func/string.js",
        "src/core/func/date.js",
        "src/core/func/function.js",
        "src/core/base.js",
        "src/core/ob.js",
        "src/core/alias.js",
        "src/core/inject.js",
        "src/core/i18n.js",
        "src/core/utils/*.js",
        "i18n/i18n.cn.js",
        "_mobile/date.i18n.cn.js",
        "src/data/data.js",
        "src/data/**/*.js",
    ]),
    fix: [fixJs],
    fixIE: [fixIEJs],
};

const bundle = [].concat(
    basicAttachmentMap.polyfill,
    basicAttachmentMap.core,
    basicAttachmentMap.fix,
    basicAttachmentMap.base,
    basicAttachmentMap.case,
    basicAttachmentMap.widget,
    sync(["public/less/app.less", "public/less/**/*.less"]),
    ['./dist/fix/fix.compact.js'],
    basicAttachmentMap.router,
    sync(["public/js/**/*.js", "public/js/index.js", "i18n/i18n.cn.js"]),
    basicAttachmentMap.ts,
);

const bundleIE = [].concat(
    basicAttachmentMap.polyfillIE,
    basicAttachmentMap.core,
    basicAttachmentMap.fixIE,
    basicAttachmentMap.base,
    basicAttachmentMap.case,
    basicAttachmentMap.widget,
    sync(["public/less/app.less", "public/less/**/*.less"]),
    ['./dist/fix/fix.compact.ie.js'],
    basicAttachmentMap.router,
    sync(["public/js/**/*.js", "public/js/index.js", "i18n/i18n.cn.js"]),
    basicAttachmentMap.ts,
);

const bundleWithoutNormalize = [].concat(
    basicAttachmentMap.core_without_normalize,
    sync([
        "src/less/base/**/*.less",
        "src/less/widget/**/*.less",
        "public/less/app.less",
        "public/less/**/*.less",
        // ts的less
    ]),
);

const fineui = [].concat(
    basicAttachmentMap.polyfill,
    basicAttachmentMap.core,
    basicAttachmentMap.fix,
    basicAttachmentMap.base,
    basicAttachmentMap.case,
    basicAttachmentMap.widget,
    basicAttachmentMap.router,
    ["./dist/fix/fix.compact.js"],
    basicAttachmentMap.ui,
    basicAttachmentMap.ts,
);

const fineuiIE = [].concat(
    basicAttachmentMap.polyfillIE,
    basicAttachmentMap.core,
    basicAttachmentMap.fixIE,
    basicAttachmentMap.base,
    basicAttachmentMap.case,
    basicAttachmentMap.widget,
    basicAttachmentMap.router,
    ["./dist/fix/fix.compact.ie.js"],
    basicAttachmentMap.ui,
    basicAttachmentMap.ts,
);

const fineuiWithoutJqueryAndPolyfillJs = [].concat(
    sync([
        "src/core/foundation.js",
        lodashJs,
        // 'src/core/mvc/**/*.js',
        "src/core/base.js",
        "src/core/ob.js",
        "src/core/widget.js",
        // 'src/core/model.js',
        // 'src/core/view.js',
        "src/core/shortcut.js",
        "src/core/utils/*.js",
        "src/core/behavior/behavior.js",
        "src/core/wrapper/layout.js",
        "src/core/plugin.js",
        "src/core/**/*.js",
        "!src/core/platform/web/**/*.js",
        "src/data/data.js",
        "src/data/**/*.js",
        "dist/fix/fix.js",
        "src/base/pane.js",
        "src/base/single/single.js",
        "src/base/single/text.js",
        "src/base/single/button/button.basic.js",
        "src/base/single/button/button.node.js",
        "src/base/single/tip/tip.js",
        "src/base/combination/group.button.js",
        "src/base/combination/tree.button.js",
        "src/base/combination/map.button.js",
        "src/base/**/*.js",
        "!src/base/tree/ztree/**/*.js",
        "!src/base/single/input/file.js",
        "src/case/combo/popup.bubble.js",
        "src/case/**/*.js",
        "!src/case/colorchooser/**/*.js",
        "!src/case/tree/ztree/**/*.js",
    ]),
    basicAttachmentMap.widget,
    sync(["dist/fix/fix.compact.js", "ui/js/**/*.js"]),
    basicAttachmentMap.ts,
);

const demo = [].concat(
    basicAttachmentMap.polyfill,
    basicAttachmentMap.core,
    basicAttachmentMap.router,
    basicAttachmentMap.fix,
    basicAttachmentMap.base,
    basicAttachmentMap.case,
    basicAttachmentMap.widget,
    sync(["public/less/app.less", "public/less/**/*.less"]),
    ['./dist/fix/fix.compact.js'],
    basicAttachmentMap.config,
    basicAttachmentMap.ts,
    sync(["demo/less/*.less", "demo/less/**/*.less", "demo/app.js", "demo/js/**/*.js", "demo/config.js"]),
);

module.exports = {
    fix: fixJs,
    fixIE: fixIEJs,
    lodash: lodashJs,
    font: basicAttachmentMap.font,
    bundle: uniq(bundle),
    bundleIE: uniq(bundleIE),
    bundleWithoutNormalize: uniq(bundleWithoutNormalize),
    fineui: uniq(fineui),
    fineuiIE: uniq(fineuiIE),
    fineuiWithoutJqueryAndPolyfillJs: uniq(fineuiWithoutJqueryAndPolyfillJs),
    utils: uniq(basicAttachmentMap.utils),
    demo: uniq(demo),
};
