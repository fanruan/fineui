const { sync, uniq } = require("./utils");

const fixJs = "./dist/fix/fix.js";
const fixProxyJs = './dist/fix/fix.proxy.js';
const fixCompact = "./dist/fix/fix.compact.js";
const workerCompact = './dist/fix/worker.compact.js';
const lodashJs = "src/core/1.lodash.js";

const basicAttachmentMap = {
    polyfill: sync(["src/core/0.foundation.js", "src/polyfill/**/*.js"]).concat(["@babel/polyfill", "es6-promise/auto"]),
    core: sync([
        "src/less/core/**/*.less",
        "src/less/theme/**/*.less",
        lodashJs,
        "src/core/**/*.js",
        "src/data/**/*.js",
    ]),
    // 最基础的控件
    base: sync([
        "src/less/base/**/*.less",
        "src/third/**/*.js",
        "src/base/**/*.js",
    ]),
    // 实现好的一些基础实例
    case: sync([
        "src/case/**/*.js",
    ]),
    widget: sync([
        "src/less/widget/**/*.less",
        "src/less/component/**/*.less",
        "src/widget/**/*.js",
        "src/component/**/*.js",
    ]),
    router: sync([
        "src/router/**/*.js",
    ]),
    core_without_platform: sync([
        "src/core/0.foundation.js",
        lodashJs,
        "src/core/**/*.js",
        "src/data/**/*.js",
    ], [
        "src/core/platform/**/*.js",
        "src/core/controller/**/*.js",
    ]),
    core_without_normalize: sync(
        ["src/less/core/**/*.less", "src/less/theme/**/*.less"], ["src/less/core/normalize.less", "src/less/core/normalize2.less"]
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
        "src/core/0.foundation.js",
        lodashJs,
        "src/core/constant/**/*.js",
        "src/core/func/**/*.js",
        "src/core/2.base.js",
        "src/core/3.ob.js",
        "src/core/5.inject.js",
        "src/core/utils/*.js",
        "i18n/i18n.cn.js",
        "_mobile/date.i18n.cn.js",
        "src/data/**/*.js",
    ]),
    fix: [fixJs],
    fixProxy: [fixProxyJs],
    less: sync([
        "src/less/core/**/*.less",
        "src/less/theme/**/*.less",
        "src/less/base/**/*.less",
        "src/less/widget/**/*.less",
        "src/less/component/**/*.less",
    ]),
};

const bundle = [].concat(
    basicAttachmentMap.polyfill,
    basicAttachmentMap.core,
    basicAttachmentMap.fix,
    basicAttachmentMap.base,
    basicAttachmentMap.case,
    basicAttachmentMap.widget,
    sync(["public/less/app.less", "public/less/**/*.less"]),
    [fixCompact, workerCompact],
    basicAttachmentMap.router,
    sync(["public/js/**/*.js", "public/js/index.js", "i18n/i18n.cn.js"]),
    basicAttachmentMap.ts,
);

const bundleCss = [].concat(
    basicAttachmentMap.less,
    sync(["public/less/app.less", "public/less/**/*.less"]),
);

// const bundleModern = [].concat(
//     sync(["src/less/modern.less"]),
//     sync(["public/modern/app.less", "public/modern/**/*.less"]),
// );

const coreJs = [].concat(
    basicAttachmentMap.polyfill,
    basicAttachmentMap.core,
    basicAttachmentMap.fix,
    basicAttachmentMap.base,
    basicAttachmentMap.case,
    basicAttachmentMap.widget,
    ['./dist/fix/fix.compact.js'],
    basicAttachmentMap.router,
    basicAttachmentMap.ts,
);

const resource = sync(["private/less/app.less", "private/less/**/*.less"]);

const config = sync(["public/js/**/*.js", "public/js/index.js", "i18n/i18n.cn.js"]);

const bundleWithoutNormalize = [].concat(
    basicAttachmentMap.core_without_normalize,
    sync([
        "src/less/base/**/*.less",
        "src/less/widget/**/*.less",
        "src/less/component/**/*.less",
        "public/less/**/*.less",
        // ts的less
    ], [
        "public/less/app.less",
    ]),
);

const fineuiWithoutNormalize = [].concat(
    basicAttachmentMap.core_without_normalize,
    sync([
        "src/less/base/**/*.less",
        "src/less/widget/**/*.less",
        "src/less/component/**/*.less",
        'ui/less/app.less',
        'ui/less/**/*.less',
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
    [fixCompact, workerCompact],
    basicAttachmentMap.ui,
    basicAttachmentMap.ts,
);

// const fineuiModern = [].concat(
//     sync(["src/less/modern.less"]),
//     sync([
//         'ui/modern/app.less',
//         'ui/modern/**/*.less',
//     ]),
// );

const fineuiProxy = [].concat(
    basicAttachmentMap.polyfill,
    basicAttachmentMap.core,
    basicAttachmentMap.fixProxy,
    basicAttachmentMap.base,
    basicAttachmentMap.case,
    basicAttachmentMap.widget,
    basicAttachmentMap.router,
    [fixCompact, workerCompact],
    basicAttachmentMap.ui,
    basicAttachmentMap.ts,
);

const fineuiWithoutJqueryAndPolyfillJs = [].concat(
    sync([
        "src/core/0.foundation.js",
        lodashJs,
        "src/core/**/*.js",
        "src/data/**/*.js",
    ], [
        "src/core/platform/web/**/*.js",
    ]),
    basicAttachmentMap.fix,
    sync([
        "src/base/**/*.js",
        "src/case/**/*.js",
    ], [
        "src/base/single/input/file.js",
        "src/case/ztree/**/*.js",
    ]),
    basicAttachmentMap.widget,
    sync([fixCompact, workerCompact, "ui/js/**/*.js"]),
    basicAttachmentMap.ts,
);

const demo = [].concat(
    basicAttachmentMap.polyfill,
    basicAttachmentMap.core,
    basicAttachmentMap.fix,
    basicAttachmentMap.base,
    basicAttachmentMap.case,
    basicAttachmentMap.widget,
    basicAttachmentMap.router,
    sync(["public/less/app.less", "public/less/**/*.less"]),
    [fixCompact, workerCompact],
    basicAttachmentMap.config,
    basicAttachmentMap.ts,
    sync(["demo/less/*.less", "demo/less/**/*.less", "demo/app.js", "demo/js/**/*.js", "demo/config.js"]),
);

module.exports = {
    fix: fixJs,
    fixProxy: fixProxyJs,
    lodash: lodashJs,
    font: basicAttachmentMap.font,
    bundle: uniq(bundle),
    fineuiWithoutNormalize: uniq(fineuiWithoutNormalize),
    bundleWithoutNormalize: uniq(bundleWithoutNormalize),
    fineui: uniq(fineui),
    fineuiProxy: uniq(fineuiProxy),
    fineuiWithoutJqueryAndPolyfillJs: uniq(fineuiWithoutJqueryAndPolyfillJs),
    utils: uniq(basicAttachmentMap.utils),
    demo: uniq(demo),
    coreWithoutPlatform: uniq(basicAttachmentMap.core_without_platform),
    coreJs: uniq(coreJs),
    resource: uniq((resource)),
    config: uniq(config),
    bundleCss: uniq(bundleCss),
};
