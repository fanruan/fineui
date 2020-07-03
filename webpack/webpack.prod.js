const webpack = require("webpack");
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const dirs = require("./dirs");

const common = require("./webpack.common.js");

const attachments = require("./attachments");

module.exports = merge.smart(common, {
    mode: "production",
    entry: {
        font: attachments.font,
        "fineui.min": attachments.fineui,
        "fineui.ie.min": attachments.fineuiIE,
        utils: attachments.utils,
        "utils.min": attachments.utils,
        "bundle.min": attachments.bundle,
        "fineui_without_jquery_polyfill": attachments.fineuiWithoutJqueryAndPolyfillJs,
        "2.0/fineui.ie.min": attachments.bundleIE,
        "2.0/fineui": attachments.bundle,
        "2.0/fineui.min": attachments.bundle,
        '2.0/fineui_without_normalize': attachments.bundleWithoutNormalize,
        '2.0/fineui_without_normalize.min': attachments.bundleWithoutNormalize,
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                include: /\.min/,
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
        ],
    },

    devtool: "hidden-source-map",

    output: {
        path: dirs.DEST,
        filename: "[name].js",
    },

    plugins: [
        new MiniCssExtractPlugin({
            path: dirs.DEST,
            filename: "[name].css",
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
