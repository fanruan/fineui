const webpack = require("webpack");
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const isBuilt4IE8 = process.env.BROWSER_VERSION === "ie8";

const dirs = require("./dirs");

const common = require("./webpack.common.js");

module.exports = merge.smart(common, {
    mode: "production",

    devtool: "hidden-source-map",

    output: {
        path: dirs.DEST,
        filename: isBuilt4IE8 ? "fineui.typescript.ie.js" : "fineui.typescript.js",
    },

    plugins: [
        new MiniCssExtractPlugin({
            path: dirs.DEST,
            filename: "fineui.typescript.css",
        }),
        new UglifyJsPlugin({
            test: /\.js(\?.*)?$/i,
            parallel: true,
            sourceMap: true,
            uglifyOptions: {
                ie8: true,
                output: {
                    comments: false,
                },
            },
        }),
        new webpack.BannerPlugin({
            banner: `time: ${new Date().toLocaleString()}`,
        }),
        new ForkTsCheckerWebpackPlugin({
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require("cssnano"),
            cssProcessorPluginOptions: {
                preset: ["default", {
                    discardComments: {
                        removeAll: true,
                    },
                    normalizeUnicode: false,
                }],
            },
            canPrint: true,
        }),
    ],

    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [],
                        },
                    },
                ],
            },
        ],
    },
});
