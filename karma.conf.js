// Karma configuration
// Generated on Mon Nov 27 2017 11:16:26 GMT+0800 (中国标准时间)
module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["mocha", "chai"],


        // list of files / patterns to load in the browser
        files: [
            "src/core/foundation.js",
            "src/core/lodash.js",
            "src/core/base.js",
            "src/core/ob.js",
            "src/core/widget.js",
            "src/core/shortcut.js",
            "src/core/utils/**/*.js",
            "src/core/behavior/behavior.js",
            "src/core/wrapper/layout.js",
            "src/core/plugin.js",
            "src/core/**/*.js",
            "src/data/**/*.js",
            "src/**/*.test.js",
            "test/**/*.test.js"
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "src/core/alias.js": "coverage",
            "src/core/base.js": "coverage"
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["progress", "coverage"],

        coverageReporter: {
            // specify a common output directory
            dir: "coverage/",
            reporters: [
                // reporters not supporting the `file` property
                { type: "html", subdir: "report-html" },
                { type: "json-summary", subdir: "report-json-summary" }
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


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // browsers: [isJenkins ? "Chrome" : "ChromeHeadless"],
        browsers: ["Chrome"],

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
