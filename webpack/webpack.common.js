const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');
const fs = require('fs');

const dirs = require('./dirs');

const attachments = require('./attachments');

let lessVariables = {};

if (process.env.LESS_CONFIG_PATH) {
    const lessConfigPath = path.isAbsolute(process.env.LESS_CONFIG_PATH)
        ? process.env.LESS_CONFIG_PATH
        : path.resolve(__dirname, '../', process.env.LESS_CONFIG_PATH);

    lessVariables = fs.existsSync(lessConfigPath)
        ? require(lessConfigPath) || {}
        : {};
}

module.exports = {
    entry: {
        demo: attachments.demo,
        // 用于启动dev模式时，工程引用调试
        fineui: attachments.fineui,
        "fineui.proxy": attachments.fineuiProxy,
    },
    externals: {
        lodash: '_',
        underscore: '_',
    },
    resolve: {
        mainFields: ['module', 'main'],
        extensions: ['.js', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.(jsx?|tsx?)$/i,
                include: [
                    dirs.NODE_MODULES,
                    dirs.PRIVATE,
                    dirs.PUBLIC,
                    dirs.MOBILE,
                    dirs.DEMO,
                    dirs.I18N,
                    dirs.UI,
                    dirs.FIX,
                    dirs.TYPESCRIPT,
                    dirs.SRC,
                ],
                exclude: /node_modules(\/|\\)core-js/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            configFile: dirs.BABEL_CONFIG,
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, '../', attachments.lodash)],
                use: [
                    {
                        loader: 'script-loader',
                    },
                ],
            },
            {
                test: path.resolve(__dirname, '../', attachments.fix),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'Fix',
                    },
                ],
            }, {
                test: path.resolve(__dirname, '../', attachments.fixProxy),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'Fix',
                    },
                ],
            },
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer],
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            relativeUrls: false,
                            modifyVars: lessVariables,
                        },
                    },
                ],
            },
        ],
    },
};
