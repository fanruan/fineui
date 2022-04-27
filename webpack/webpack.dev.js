const merge = require("webpack-merge");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const dirs = require("./dirs");

const common = require("./webpack.common.js");

const ModuleDependencyWarning = require("webpack/lib/ModuleDependencyWarning");

class IgnoreNotFoundExportPlugin {
    apply(compiler) {
        const messageRegExp = /export '.*'( \(reexported as '.*'\))? was not found in/;
        function doneHook(stats) {
            stats.compilation.warnings = stats.compilation.warnings.filter(warn => {
                if (warn instanceof ModuleDependencyWarning && messageRegExp.test(warn.message)) {
                    return false;
                }

                return true;
            });
        }
        if (compiler.hooks) {
            compiler.hooks.done.tap("IgnoreNotFoundExportPlugin", doneHook);
        } else {
            compiler.plugin("done", doneHook);
        }
    }
}

module.exports = merge(common, {
    devtool: "inline-source-map",
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
        new IgnoreNotFoundExportPlugin(),
    ],
});
