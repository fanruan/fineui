const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const path = require("path");

const dirs = require("./dirs");

const attachments = require("./attachments");

module.exports = {
    entry: {
        demo: attachments.demo,
    },
    externals: {
        lodash: '_',
        underscore: '_',
    },
    resolve: {
        mainFields: ["module", "main"],
        extensions: [".js", ".ts"],
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                include: [dirs.NODE_MODULES, dirs.PRIVATE, dirs.TYPESCRIPT],
                exclude: /node_modules(\/|\\)core-js/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        configFile: dirs.IE8_BABEL_CONFIG,
                    },
                }, {
                    loader: "source-map-loader",
                    options: {
                        enforce: "pre",
                    },
                }],
            },
            {
                test: /\.js$/,
                include: [
                    dirs.DEMO,
                    dirs.SRC,
                    dirs.PUBLIC,
                    dirs.MOBILE,
                    dirs.I18N,
                    dirs.UI,
                    dirs.FIX,
                ],
                use: [
                    {
                        loader: "source-map-loader",
                        options: {
                            enforce: "pre",
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, '../', attachments.lodash)],
                use: [
                    {
                        loader: "script-loader",
                    },
                ],
            },
            {
                test: path.resolve(__dirname, '../', attachments.fix),
                use: [{
                    loader: 'expose-loader',
                    options: 'Fix',
                }],
            },
            {
                test: path.resolve(__dirname, '../', attachments.fixIE),
                use: [{
                    loader: 'expose-loader',
                    options: 'Fix',
                }],
            },
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [autoprefixer],
                        },
                    },
                    {
                        loader: "less-loader",
                        options: {
                            relativeUrls: false,
                        },
                    },
                ],
            },
        ],
    },
};
