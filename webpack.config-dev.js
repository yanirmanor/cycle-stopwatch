const path = require("path");
const webpack = require("webpack");
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    
    context: path.join(__dirname, 'src'),
    
    entry: ["./js/imv.js", "./style/app.scss"],

    output: {
        path: __dirname,
        filename: 'public/bundle.js',
        sourceMapFilename: "debugging/[file].map",
        pathinfo: true,
    },

    debug: true,

    devtool: "source-map",

    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/
            },
            // Extract SCSS
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css-loader?sourceMap!postcss-loader?sourceMap!sass-loader?sourceMap=true&sourceMapContents=true')
            }
        ]
    },

    postcss: function () {
        return [autoprefixer];
    },

    plugins: [
        new ExtractTextPlugin('public/app.css', { allChunks: false }),
    ],

}