const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');
const selectors = require('./index-selectors.js');

const HTML_VARS = {
    FAVICON_HREF: 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22/%3E',
    IDX_SELECTORS: selectors,
    PKG_JSON: (({ name, description }) => ({ name, description }))(pkg),
    TEMPLATE_CONTENT: fs.readFileSync(path.resolve(__dirname, '../assets/srt.svg'), 'utf8'),
};

module.exports = {
    mode: 'development',
    devServer: {
        port: 8082,
        http2: true, // ref: https://github.com/expressjs/express/pull/3730
        https: { // ref: https://github.com/FiloSottile/mkcert
            key: fs.readFileSync(path.resolve(__dirname, '../mkcert/localhost-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '../mkcert/localhost.pem')),
            ca: fs.readFileSync(path.resolve(process.env.HOME, './Library/Application Support/mkcert/rootCA.pem')),
        },
    },
    entry: {
        index: './src/index.js',
        extractor: './src/Extractor/script/index.js',
        [`${pkg.name}.sw`]: './src/ServiceWorker/script/index.js',
    },
    output: {
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            IDX_SELECTORS: JSON.stringify(Object.values(selectors)),
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: './index.html',
            ...HTML_VARS,
        }),
    ],
};
