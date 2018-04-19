module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            options: {
                separator: ""
            },
            polyfillJs: {
                src: ["src/polyfill/**/*.js"],
                dest: "dist/polyfill.js"
            },
            coreJs: {
                src: [
                    "src/core/jquery.js",
                    "src/core/lodash.js",
                    "src/core/foundation.js",
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

                    "src/data/data.js",
                    "src/data/**/*.js"
                ],
                dest: "dist/core.js"
            },

            // 最基础的控件
            baseJs: {
                src: [
                    "src/third/**/*.js",
                    "src/base/formula/config.js",
                    "src/base/pane.js",
                    "src/base/single/single.js",
                    "src/base/single/text.js",
                    "src/base/single/button/button.basic.js",
                    "src/base/single/button/button.node.js",
                    "src/base/single/tip/tip.js",
                    "src/base/combination/group.button.js",
                    "src/base/combination/tree.button.js",
                    "src/base/combination/map.button.js",
                    "src/base/tree/treeview.js",
                    "src/base/tree/asynctree.js",
                    "src/base/tree/parttree.js",
                    "src/base/**/*.js"
                ],
                dest: "dist/base.js"
            },
            // 实现好的一些基础实例
            caseJs: {
                src: [
                    "src/case/combo/popup.bubble.js",
                    "src/case/**/*.js"
                ],
                dest: "dist/case.js"
            },
            widgetJs: {
                src: [
                    "src/widget/paramsettingcombo/popup.param.js",
                    "src/widget/sequencetable/treenumber.sequencetable.js",
                    "src/widget/**/*.js",
                    "src/component/**/*.js"
                ],
                dest: "dist/widget.js"
            },
            routerJs: {
                src: [
                    "src/router/**/*.js"
                ],
                dest: "dist/router.js"
            },
            coreCss: {
                src: ["src/css/core/**/*.css", "src/css/theme/**/*.css"],
                dest: "dist/core.css"
            },
            coreWithoutNormalizeCss: {
                src: ["src/css/core/**/*.css", "src/css/theme/**/*.css", "!src/css/core/normalize.css", "!src/css/core/normalize2.css"],
                dest: "dist/core_without_normalize.css"
            },
            baseCss: {
                src: ["src/css/base/**/*.css"],
                dest: "dist/base.css"
            },
            widgetCss: {
                src: ["src/css/widget/**/*.css"],
                dest: "dist/widget.css"
            },
            resourceCss: {
                src: ["src/css/resource/**/*.css"],
                dest: "dist/resource.css"
            },

            bundleJs: {
                src: ["dist/core.js", "dist/fix/fix.js", "dist/base.js", "dist/case.js", "dist/widget.js", "dist/fix/fix.compact.js", "dist/router.js", "public/js/**/*.js", "public/js/index.js"],
                dest: "dist/bundle.js"
            },

            bundleCss: {
                src: ["dist/core.css", "dist/base.css", "dist/widget.css", "public/css/app.css", "public/css/**/*.css"],
                dest: "dist/bundle.css"
            },

            fineuiJs: {
                src: ["dist/_fineui.min.js", "src/base/formula/formulaeditor.js"],
                dest: "dist/fineui.min.js"
            },

            fineuiCss: {
                src: ["dist/core.css", "dist/base.css", "dist/widget.css", "ui/css/app.css", "ui/css/**/*.css"],
                dest: "dist/fineui.css"
            },

            configJs: {
                src: ["demo/version.js"],
                dest: "dist/config.js"
            },
            demoJs: {
                src: ["demo/app.js", "demo/js/**/*.js", "demo/config.js"],
                dest: "dist/demo.js"
            },
            demoCss: {
                src: ["demo/css/**/*.css"],
                dest: "dist/demo.css"
            },
            utilsJs: {
                src: [
                    "src/core/lodash.js",
                    "src/core/foundation.js",
                    "src/core/var.js",
                    "src/core/proto/array.js",
                    "src/core/proto/number.js",
                    "src/core/proto/string.js",
                    "src/core/proto/date.js",
                    "src/core/proto/function.js",
                    "src/core/base.js",
                    "src/core/ob.js",
                    "src/core/alias.js",
                    "src/core/inject.js",
                    "src/core/utils/*.js",

                    "src/data/data.js",
                    "src/data/**/*.js"
                ],
                dest: "utils/utils.js"
            }
        },

        less: {
            demo: {
                expand: true,
                cwd: "demo/less",
                src: ["**/*.less"],
                dest: "demo/css/",
                ext: ".css"
            },
            main: {
                expand: true,
                cwd: "public/less",
                src: ["**/*.less"],
                dest: "public/css",
                ext: ".css"
            },
            ui: {
                expand: true,
                cwd: "ui/less",
                src: ["**/*.less"],
                dest: "ui/css",
                ext: ".css"
            },
            src: {
                expand: true,
                cwd: "src/less",
                src: ["**/*.less"],
                dest: "src/css",
                ext: ".css"
            },
            dev: {
                options: {
                    compress: true,
                    yuicompress: false
                }
            }
        },

        uglify: {
            options: {
                banner: "/*! <%= pkg.name %> */\n"
            },
            dist: {
                files: {
                    "dist/bundle.min.js": ["<%= concat.bundleJs.dest %>"],
                    "dist/_fineui.min.js": ["dist/polyfill.js", "dist/core.js", "ui/js/**/*.js", "dist/fix/fix.js", "src/third/**/*.js",
                        "src/base/formula/config.js",
                        "src/base/pane.js",
                        "src/base/single/single.js",
                        "src/base/single/text.js",
                        "src/base/single/button/button.basic.js",
                        "src/base/single/button/button.node.js",
                        "src/base/single/tip/tip.js",
                        "src/base/combination/group.button.js",
                        "src/base/combination/tree.button.js",
                        "src/base/combination/map.button.js",
                        "src/base/tree/treeview.js",
                        "src/base/tree/asynctree.js",
                        "src/base/tree/parttree.js",
                        "src/base/**/*.js",
                        "!src/base/formula/formulaeditor.js",
                        "dist/case.js", "dist/widget.js", "dist/fix/fix.compact.js", "dist/router.js"]
                }
            }
        },

        cssmin: {

            bundleCss: {

                src: "<%= concat.bundleCss.dest %>",

                dest: "dist/bundle.min.css"

            },
            fineuiCss: {

                src: "<%= concat.fineuiCss.dest %>",

                dest: "dist/fineui.min.css"

            }
        },

        jshint: {
            files: ["Gruntfile.js", "src/**/*.js"],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        watch: {
            scripts: {
                files: ["src/**/*.js", "demo/js/**/*.js", "demo/version.js", "demo/config.js", "demo/less/**/*.less"],
                tasks: ["less", "concat"],
                options: {
                    spanw: true,
                    interrupt: true
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-cssmin");

    grunt.registerTask("default", ["less", "concat", "watch"]);
    grunt.registerTask("min", ["less", "concat", "uglify", "cssmin"]);
    grunt.registerTask("build", ["less", "concat", "uglify", "cssmin", "uglify", "concat"]);
};