var packageJSON = require('./package.json');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const PATHS = {
    build: path.join(__dirname, 'target', 'classes', 'META-INF', 'resources', 'webjars', packageJSON.name, packageJSON.version)
};

var plugins = [
    new ExtractTextPlugin({
        filename: "solr-docstore-gui-styles.css"
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
];
if (process.env.NODE_ENV === "production") {
    plugins.push(
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
        })
    )
}


module.exports = {
    entry: ['react-hot-loader/patch','./app/index.js'],

    output: {
        path: PATHS.build,
        publicPath: '/',
        filename: 'solr-docstore-gui-bundle.js'
    },
    devtool: 'inline-source-map',
    plugins: plugins,
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(woff|woff2|png|jpg|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    publicPath: '',
                    name: '[name].[ext]'
                }
            }
        ]
    },
    devServer: {
        hot: true,
        port: 8090,
        // Send API requests on localhost to API server get around CORS.
        proxy: {
            '/development/api': {
                target: {
                    host: "localhost",
                    protocol: 'http:',
                    port: 8080
                },
                pathRewrite: {
                    '^/development/api': '/solr-doc-store/api'
                }
            }
        }
    }
};