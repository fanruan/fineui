module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ''
            },
            coreJs: {
                src: [
                    'src/core/jquery.js',
                    'src/core/underscore.js',
                    'src/core/foundation.js',
                    'src/core/mvc/**/*.js',
                    'src/core/base.js',
                    'src/core/ob.js',
                    'src/core/widget.js',
                    'src/core/model.js',
                    'src/core/view.js',
                    'src/core/shortcut.js',
                    'src/core/utils/*.js',
                    'src/core/behavior/behavior.js',
                    'src/core/wrapper/layout.js',
                    'src/core/**/*.js',

                    'src/data/data.js',
                    'src/data/**/*.js',
                    'src/config.js'
                ],
                dest: 'dist/core.js'
            },
            biCoreJs: {
                src: [
                    'src/core/underscore.js',
                    'src/core/foundation.js',
                    'src/core/mvc/**/*.js',
                    'src/core/base.js',
                    'src/core/alias.js',
                    'src/core/events.js',
                    'src/core/var.js',
                    'src/core/ob.js',
                    'src/core/widget.js',
                    'src/core/model.js',
                    'src/core/view.js',
                    'src/core/shortcut.js',
                    'src/core/plugin.js',
                    'src/core/controller.js',
                    'src/core/proto/**/*.js',
                    'src/core/utils/**/*.js',
                    'src/core/behavior/behavior.js',
                    'src/core/wrapper/layout.js',
                    'src/core/action/**/*.js',
                    'src/core/adapter/**/*.js',
                    'src/core/controller/**/*.js',
                    'src/core/event/**/*.js',
                    'src/core/func/**/*.js',
                    'src/core/listener/**/*.js',
                    'src/core/loader/**/*.js',
                    'src/core/logic/**/*.js',

                    'src/data/data.js',
                    'src/data/**/*.js',
                    'src/config.js'
                ],
                dest: 'bi/core.js'
            },
            //最基础的控件
            baseJs: {
                src: [
                    'src/third/**/*.js',
                    'src/base/pane.js',
                    'src/base/single/single.js',
                    'src/base/single/text.js',
                    'src/base/single/button/button.basic.js',
                    'src/base/single/button/button.node.js',
                    'src/base/single/tip/tip.js',
                    'src/base/combination/group.button.js',
                    'src/base/combination/tree.button.js',
                    'src/base/combination/map.button.js',
                    'src/base/tree/treeview.js',
                    'src/base/tree/synctree.js',
                    'src/base/tree/parttree.js',
                    'src/base/**/*.js'
                ],
                dest: 'dist/base.js'
            },
            //实现好的一些基础实例
            caseJs: {
                src: [
                    'src/case/combo/popup.bubble.js',
                    'src/case/**/*.js'
                ],
                dest: 'dist/case.js'
            },
            widgetJs: {
                src: [
                    'src/widget/paramsettingcombo/popup.param.js',
                    'src/widget/sequencetable/treenumber.sequencetable.js',
                    'src/widget/**/*.js',
                    'src/component/**/*.js'
                ],
                dest: "dist/widget.js"
            },
            coreCss: {
                src: ['src/css/core/**/*.css'],
                dest: 'dist/core.css'
            },
            baseCss: {
                src: ['src/css/base/**/*.css'],
                dest: 'dist/base.css'
            },
            widgetCss: {
                src: ['src/css/widget/**/*.css'],
                dest: 'dist/widget.css'
            },
            resourceCss: {
                src: ['src/css/resource/**/*.css'],
                dest: 'dist/resource.css'
            },

            demoJs: {
                src: ['demo/version.js', 'demo/app.js', 'demo/js/**/*.js', 'demo/config.js'],
                dest: 'demo/dist/demo.js'
            },
            demoCss: {
                src: ['demo/css/**/*.css'],
                dest: 'demo/dist/demo.css'
            },

            bi_coreJs: {
                src: [
                    'src/core/underscore.js',
                    'src/core/foundation.js',
                    'src/core/mvc/**/*.js',
                    'src/core/base.js',
                    'src/core/alias.js',
                    'src/core/events.js',
                    'src/core/var.js',
                    'src/core/ob.js',
                    'src/core/widget.js',
                    'src/core/model.js',
                    'src/core/view.js',
                    'src/core/shortcut.js',
                    'src/core/plugin.js',
                    'src/core/controller.js',
                    'src/core/proto/**/*.js',
                    'src/core/utils/**/*.js',
                    'src/core/behavior/behavior.js',
                    'src/core/behavior/**/*.js',
                    'src/core/wrapper/layout.js',
                    'src/core/wrapper/**/*.js',
                    'src/core/action/**/*.js',
                    'src/core/adapter/**/*.js',
                    'src/core/controller/**/*.js',
                    'src/core/event/**/*.js',
                    'src/core/func/**/*.js',
                    'src/core/listener/**/*.js',
                    'src/core/loader/**/*.js',
                    'src/core/logic/**/*.js',

                    'src/data/data.js',
                    'src/data/**/*.js',
                    'src/config.js'
                ],
                dest: 'bi/core.js'
            },
            //最基础的控件
            bi_baseJs: {
                src: [
                    'src/third/**/*.js',
                    'src/base/pane.js',
                    'src/base/single/single.js',
                    'src/base/single/text.js',
                    'src/base/single/button/button.basic.js',
                    'src/base/single/button/button.node.js',
                    'src/base/single/tip/tip.js',
                    'src/base/combination/group.button.js',
                    'src/base/combination/tree.button.js',
                    'src/base/combination/map.button.js',
                    'src/base/tree/treeview.js',
                    'src/base/tree/synctree.js',
                    'src/base/tree/parttree.js',
                    'src/base/**/*.js'
                ],
                dest: 'bi/base.js'
            },
            //实现好的一些基础实例
            bi_caseJs: {
                src: [
                    'src/case/combo/popup.bubble.js',
                    'src/case/**/*.js'
                ],
                dest: 'bi/case.js'
            },
            bi_widgetJs: {
                src: [
                    'src/widget/paramsettingcombo/popup.param.js',
                    'src/widget/sequencetable/treenumber.sequencetable.js',
                    'src/widget/**/*.js',
                    'src/component/**/*.js'
                ],
                dest: "bi/widget.js"
            },
            bi_coreCss: {
                src: ['src/css/core/**/*.css'],
                dest: 'bi/core.css'
            },
            bi_baseCss: {
                src: ['src/css/base/**/*.css'],
                dest: 'bi/base.css'
            },
            bi_widgetCss: {
                src: ['src/css/widget/**/*.css'],
                dest: 'bi/widget.css'
            }
        },

        less: {
            main: {
                expand: true,
                cwd: 'demo/less',
                src: ['**/*.less'],
                dest: 'demo/css/',
                ext: '.css'
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
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/core.min.js': ['<%= concat.coreJs.dest %>'],
                    'dist/base.min.js': ['<%= concat.baseJs.dest %>'],
                    'dist/case.min.js': ['<%= concat.caseJs.dest %>']
                }
            }
        },

        cssmin: {

            coreCss: {

                src: '<%= concat.coreCss.dest %>',

                dest: 'dist/core.min.css'

            },
            baseCss: {

                src: '<%= concat.baseCss.dest %>',

                dest: 'dist/base.min.css'

            }

        },

        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
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
                files: ['src/**/*.js', 'demo/js/**/*.js', 'demo/config.js', 'demo/less/**/*.less'],
                tasks: ['less', 'concat'],
                options: {
                    spanw: true,
                    interrupt: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['less', 'concat', 'watch']);
};