const path = require('path');
const glob = require('glob');

// const glob = require('fast-glob');

function uniq(names) {
    return [...new Set(names)];
}

const globalExcludes = [
    "**/*/__test__/*.js",
];

function sync(patterns, excludes = []) {
    const ignore = globalExcludes.concat(excludes).map(pattern => path.join(__dirname, "../", pattern).replace(/\\/g, '/'));

    return patterns.map(pattern => glob.sync(path.join(__dirname, "../", pattern).replace(/\\/g, '/'), { ignore })).flat();
}


module.exports = {
    sync,
    uniq,
};
