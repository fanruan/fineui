const merge = require("webpack-merge");

const dirs = require("./dirs");

const common = require("./webpack.prod.js");
common.entry = {};

const attachments = require("./attachments");

module.exports = merge.smart(common, {
    mode: "production",
    entry: {
        [`2.0/${process.env.LESS_FILE_NAME}.min`]: attachments.bundleCss,
    },

    output: {
        path: dirs.DEST,
        filename: "[name].js",
    },
});
