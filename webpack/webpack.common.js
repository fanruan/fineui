const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");

const dirs = require("./dirs");

const isBuilt4IE8 = process.env.BROWSER_VERSION === "ie8";

module.exports = {
    entry: {
        polyfill: isBuilt4IE8
            ? [
                "core-js/features/object/define-property",
                "core-js/features/object/create",
                "core-js/features/object/assign",
                "core-js/features/object/get-own-property-symbols",
                "core-js/features/object/get-prototype-of",
                "core-js/features/array/for-each",
                "core-js/features/array/index-of",
                "core-js/features/function/bind",
                "core-js/features/promise",
                "core-js/features/string/replace",
                "core-js/es/map",
                // "core-js",
            ]
            : [
                "@babel/polyfill",
                "es6-promise/auto",
            ],
        fineui: [
            "./typescript/bundle.ts",
        ],
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
                        configFile: isBuilt4IE8 ? dirs.IE8_BABEL_CONFIG : dirs.BABEL_CONFIG,
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
