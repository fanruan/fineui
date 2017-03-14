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
                    'src/data/**/*.js'
                ],
                dest: 'dist/core.js'
            },
            //最基础的控件
            baseJs: {
                src: [
                    'src/third/codemirror/codemirror.js',
                    'src/third/**/*.js',
                    'src/base/pane.js',
                    'src/base/single/single.js',
                    'src/base/single/text.js',
                    'src/base/single/button/button.basic.js',
                    'src/base/single/button/button.node.js',
                    'src/base/**/*.js'
                ],
                dest: 'dist/base.js'
            },
            //实现好的一些基础实例
            caseJs: {
                src: [
                    'src/case/**/*.js'
                ],
                dest: 'dist/case.js'
            },
            coreCss: {
                src: ['src/css/core/**/*.css'],
                dest: 'dist/core.css'
            },
            baseCss: {
                src: ['src/css/base/**/*.css'],
                dest: 'dist/base.css'
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
                files: ['src/**/*.js'],
                tasks: ['concat'],
                options: {
                    spanw: true,
                    interrupt: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['concat', 'watch']);
};