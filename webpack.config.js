const webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');


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
        })
    ],
    output: {
        path: __dirname + "/dist",
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.png$/,
                loader: "url-loader"
            },
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
                loader: 'file-loader'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader'
            }
        ]
    },

    devtool: "#eval"

}

