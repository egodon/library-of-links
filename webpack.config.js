const webpack = require('webpack');

let config = {
    entry: [
        './public/js/main.js'
    ],

    output: {
        path: __dirname,
        filename: 'public/bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ]
    },
    devtool: "#eval"

}

module.exports = config;