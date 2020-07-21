const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const TerserJSPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const pkg = require('../package.json');
const selectors = require('./index-selectors.js');

const dist = path.resolve(__dirname, '../dist');

const HTML_VARS = {
    FAVICON_HREF: 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22/%3E',
    IDX_SELECTORS: selectors,
    PKG_JSON: (({ name, description }) => ({ name, description }))(pkg),
    TEMPLATE_CONTENT: fs.readFileSync(path.resolve(__dirname, '../assets/srt.min.svg'), 'utf8'),
};

// remove dist directory
fs.rmdirSync(dist, { recursive: true });

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.js',
        extractor: './src/Extractor/script/index.js',
        [`${pkg.name}.sw`]: './src/ServiceWorker/script/index.js',
    },
    output: {
        // never hash service-worker filename
        filename: (data) => ((data.chunk.name.includes(`${pkg.name}.sw`)) ? '[name].js' : '[name].[contenthash].js'),
        path: dist,
    },
    module: {
        rules: [{
            exclude: /node_modules/,
            test: /\.js$/,
            use: [
                'eslint-loader',
            ],
        }, {
            exclude: /node_modules/,
            test: /\.less$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'less-loader',
            ],
        }],
    },
    optimization: {
        minimizer: [
            new TerserJSPlugin({}),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            IDX_SELECTORS: JSON.stringify(Object.values(selectors)),
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: './index.html',
            minify: { // ref: https://github.com/kangax/html-minifier#options-quick-reference
                collapseWhitespace: true,
                removeComments: true,
            },
            ...HTML_VARS,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
    ],
};
