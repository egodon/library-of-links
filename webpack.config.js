const webpack = require('webpack');

let config = {
    entry: './public/js/main.js',
    output: {
        path: __dirname,
        filename: './public/bundle.js'
    }
}

module.exports = config;