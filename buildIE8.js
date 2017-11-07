var rollup = require('rollup');
var fs = require('fs');
var babel = require("babel-core");
var transform = require('es3ify').transform;
var less = function(a) { return a } //require('semicolon-less')

// used to track the cache for subsequent bundles
var cache;
var json = require('./package.json')
var v = 'version:' + JSON.stringify(json.version)
var sourcemaps = require('rollup-plugin-sourcemaps')
var buble = require('rollup-plugin-buble')

module.exports = rollup.rollup({
    // The bundle's starting point. This file will be
    // included, along with the minimum necessary code
    // from its dependencies

    entry: 'demo/index.js',
    // If you have a bundle you want to re-use (e.g., when using a watcher to rebuild as files change),
    // you can tell rollup use a previous bundle as its starting point.
    // This is entirely optional!
    cache: cache,

    plugins: [
        buble({
            jsx: 'h',
            transforms: {
                modules: false
            }
        }),
        sourcemaps()
    ]
}).then(function(bundle) {
    // Generate bundle + sourcemap
    var result = bundle.generate({
        sourceMap: true,
        format: 'umd',
        moduleName: 'h'
    });
    // Cache our bundle for later use (optional)
    cache = bundle;
    result.code = result.code.replace(
        /Object\.defineProperty\(exports,\s*'__esModule',\s*\{\s*value:\s*true\s*\}\);/,
        "exports.__esModule = true").

    replace(/version\:\s*1/, v)


    result = babel.transform(result.code, {
        presets: ['avalon'],
        compact: false
    })

    var code = transform(result.code).
    replace(/\}\)\(undefined,/, '})(this,').
    replace(/h\$\d/g, 'h')

    //这个不需要了
    //  replace(/'use strict';?/g, '')
    fs.writeFileSync('./dist/h.js', less(code));


}).catch(function(e) {
    console.log('error', e)
})