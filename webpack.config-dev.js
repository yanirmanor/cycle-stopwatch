const path = require("path");
const webpack = require("webpack");

module.exports = {
    
    entry:{
        'src' : './src/js/imv.js'
    },
    
    output: {
        path : __dirname,
        filename: 'public/bundle.js',
        sourceMapFilename: "debugging/[file].map",
        pathinfo: true,
    },
    
    debug: true,
    
    devtool: "source-map",
    
    profile: true,
    
    module:{
        loaders:[{
            test: /\.js$/,
            loaders: ['babel'],
            exclude: /node_modules/
        }]
    }
    
}