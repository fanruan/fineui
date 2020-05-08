// Karma configuration
// Generated on Mon Nov 27 2017 11:16:26 GMT+0800 (中国标准时间)

const os = require("os");

process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["mocha", "chai"],


        // list of files / patterns to load in the browser
        files: [
            "src/css/core/**/*.css",
            "src/css/theme/**/*.css",
            "src/css/base/**/*.css",
            "src/css/widget/**/*.css",
            "public/css/app.css",
            "src/core/foundation.js",
            "src/core/lodash.js",
            "src/core/base.js",
            "i18n/i18n.cn.js",
            "src/core/ob.js",
            "src/core/widget.js",
            "src/core/shortcut.js",
            "src/core/utils/**/*.js",
            "src/core/behavior/behavior.js",
            "src/core/wrapper/layout.js",
            "src/core/plugin.js",
            "src/core/**/*.js",
            "src/data/**/*.js",
            "src/data/**/*.js",
            "src/data/**/*.js",
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
            "src/case/**/*.js",
            "src/widget/**/*.js",
            "src/component/**/*.js",
            "src/**/*.test.js",
            "test/**/*.js"
        ],

        exclude: [
            "src/base/tree/ztree/jquery.ztree.core-3.5.js",
            "src/base/tree/ztree/jquery.ztree.excheck-3.5.js",
            "src/base/single/input/file.js",
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "src/core/alias.js": "coverage",
            "src/core/base.js": "coverage",
            "src/core/func/date.js": "coverage",
            "src/base/**/!(*.test).js": "coverage",
            "src/case/**/!(*.test).js": "coverage",
            "src/widget/**/!(*.test).js": "coverage",
            "src/component/**/!(*.test).js": "coverage"
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["progress", "coverage"],

        browserDisconnectTolerance: 3,
        browserDisconnectTimeout : 300000,
        browserNoActivityTimeout : 300000,

        coverageReporter: {
            // specify a common output directory
            dir: "coverage/",
            reporters: [
                // reporters not supporting the `file` property
                { type: "html", subdir: "report-html" },
                { type: "json-summary", subdir: "report-json-summary" },
                { type: "cobertura", subdir: "report-cobertura"}
            ]
        },


        // web server port
        port: 9878,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        customLaunchers: {
            HeadlessChrome: {
                base: "ChromeHeadless",
                flags: [
                    "--no-sandbox",
                    "--remote-debugging-port=9222",
                    "--enable-logging",
                    "--user-data-dir=./karma-chrome",
                    "--v=1",
                    "--disable-background-timer-throttling",
                    "--disable-renderer-backgrounding",
                    "--proxy-bypass-list=*",
                    "--disable-web-security",
                    "--disable-gpu",
                    "--no-sandbox",
                ],
            },
        },


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [os.platform() === "win32"
            && parseFloat(os.release()
                .split(".")
                .slice(0, 2)
                .join(".")) <= 6.1
            ? "HeadlessChrome" : "ChromeHeadless"],

        retryLimit: 30,

        captureTimeout: 30000,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        plugins: [
            "karma-mocha",
            "karma-chai",
            "karma-chrome-launcher",
            "karma-coverage"
        ]
    });
};
