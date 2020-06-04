const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");

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
                exclude: /(node_modules(\/|\\)core-js|\.\/demo|\.\/src|\.\/public|\.\/i18n|\.\/ui|\.\/_mobile|\.dist).+\.js$/,
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
