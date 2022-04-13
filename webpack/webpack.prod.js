const webpack = require("webpack");
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJsPlugin = require("terser-webpack-plugin");

const dirs = require("./dirs");

const common = require("./webpack.common.js");

const attachments = require("./attachments");
const components = require("./components");

module.exports = merge.smart(common, {
    mode: "production",
    entry: {
        font: attachments.font,
        "fineui.min": attachments.fineui,
        "fineui_without_normalize.min": attachments.fineuiWithoutNormalize,
        "fineui.proxy.min": attachments.fineuiProxy,
        "core_without_platform": attachments.coreWithoutPlatform,
        utils: attachments.utils,
        "utils.min": attachments.utils,
        "fineui_without_jquery_polyfill": attachments.fineuiWithoutJqueryAndPolyfillJs,
        "fineui_without_jquery_polyfill.min": attachments.fineuiWithoutJqueryAndPolyfillJs,
        "2.0/fineui": attachments.bundle,
        "2.0/fineui.min": attachments.bundle,
        "2.0/fineui_without_normalize": attachments.bundleWithoutNormalize,
        "2.0/fineui_without_normalize.min": attachments.bundleWithoutNormalize,
        "2.0/core_without_platform": attachments.coreWithoutPlatform,
        "2.0/core_without_platform.min": attachments.coreWithoutPlatform,
        core: attachments.coreJs,
        resource: attachments.resource,
        "lib/single": components.single,
        "lib/layers": components.layer,
        "lib/pane": components.pane,
        "lib/button_group": components.button_group,
        "lib/buttons": components.buttons,
        "lib/checkboxes": components.checkboxes,
        "lib/combos": components.combos,
        "lib/editors": components.editors,
        "lib/triggers": components.triggers,
        "lib/calendar": components.calendar,
        "lib/color_chooser": components.color_chooser,
        "lib/segment": components.segment,
        "lib/linear_segment": components.linear_segment,
        "lib/date": components.date,
        "lib/down_list": components.down_list,
        "lib/text_value_down_list_combo": components.text_value_down_list_combo,
    },
    optimization: {
        minimizer: [
            new TerserJsPlugin({
                include: /\.min/,
                parallel: true,
                sourceMap: true,
                terserOptions: {
                    output: {
                        comments: false
                    }
                }
            }),
            new webpack.BannerPlugin({
                banner: `time: ${new Date().toLocaleString()}`
            })
        ]
    },

    devtool: "hidden-source-map",

    output: {
        path: dirs.DEST,
        filename: "[name].js"
    },

    plugins: [
        new MiniCssExtractPlugin({
            path: dirs.DEST,
            filename: "[name].css"
        }),
        new ForkTsCheckerWebpackPlugin({}),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require("cssnano"),
            cssProcessorPluginOptions: {
                preset: ["default", {
                    discardComments: {
                        removeAll: true
                    },
                    normalizeUnicode: false
                }]
            },
            canPrint: true
        })
    ],

    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: []
                        }
                    }
                ]
            }
        ]
    }
});
