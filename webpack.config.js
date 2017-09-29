const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');


module.exports = {
    entry: [
        './public/js/main.js'
    ],
    plugins: [
        new webpack.ProvidePlugin({
            "$": 'jquery',
            "jQuery": 'jquery'
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            proxy:'http://localhost:5000/',
            
        },
        {
            reload: false
        }),
        new ExtractTextPlugin("styles.css"),
    ],
    output: {
        path: __dirname + "/dist",
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
              test: /\.css$/,
              use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
              })
            },
            {
                test: /\.png$/,
                loader: "url-loader"
            },
            // Bootstrap
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    emitFile: false
                  }  
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader'
            }
        ]
    },

    devtool: "#eval"

}

