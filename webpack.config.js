const webpack = require('webpack');

module.exports = {
    entry: [
        './public/js/main.js'
    ],
    plugins: [
        new webpack.ProvidePlugin({
            "$": 'jquery',
            "jQuery": 'jquery'
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
                test: /\.jpg$/,
                loader: "file-loader"
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

