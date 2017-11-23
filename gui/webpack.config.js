var packageJSON = require('./package.json');
var path = require('path');
var webpack = require('webpack');

const PATHS = {
    build: path.join(__dirname, 'target', 'classes', 'META-INF', 'resources', 'webjars', packageJSON.name, packageJSON.version)
};

module.exports = {
    entry: './app/index.js',

    output: {
        path: PATHS.build,
        filename: 'app-bundle.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            minimize: true,
            mangle: {
                screw_ie8: true,
                keep_fnames: false
            },
            compress: {
                screw_ie8: true,
                //drop_console: true, // strips console statements
                unused: true,
                dead_code: true, // big one--strip code that will never execute
            },
            comments: false
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            }
        ]
    }
};