const merge = require("webpack-merge");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const dirs = require("./dirs");

const common = require("./webpack.common.js");

module.exports = merge(common, {
    devtool: "source-map",
    output: {
        path: dirs.DEST,
        filename: "[name].js",
    },
    devServer: {
        contentBase: path.join(__dirname, ".."),
        port: 9001,
        liveReload: true,
    },
    plugins: [
        new MiniCssExtractPlugin({
            path: dirs.DEST,
            filename: "[name].css",
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../template/index.html"),
            chunks: ["demo"],
            chunksSortMode: "manual",
        }),
        new ForkTsCheckerWebpackPlugin({
            watch: ["./typescript"],
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
});
