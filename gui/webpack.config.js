var packageJSON = require("./package.json");
var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const publicPathFolders = ["webjars", packageJSON.name, packageJSON.version];

const PATHS = {
  // For path to be absolute we prepend a /
  publicPath: "/" + path.join(...publicPathFolders) + "/",
  build: path.join(
    __dirname,
    "target",
    "classes",
    "META-INF",
    "resources",
    ...publicPathFolders
  )
};

const createExtractPlugin = mode =>
  new ExtractTextPlugin({
    filename: "solr-docstore-gui-styles.css",
    disable: mode === "development"
  });

var createPlugins = extractPlugin => [
  // Only includes desired locales in moment.js, I assume en (united states) is default included. We further include Danish
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /da/),
  extractPlugin
];

var createConfig = (plugins, extractPlugin) => ({
  entry: {
    "solr-docstore-gui": "./app/index.js"
  },
  output: {
    path: PATHS.build,
    publicPath: PATHS.publicPath,
    filename: "[name]-bundle.js"
  },
  plugins: plugins,
  optimization: {
    //runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          beautify: false,
          minimize: true,
          mangle: {
            keep_fnames: false
          },
          compress: {
            //drop_console: true, // strips console statements
            unused: true,
            dead_code: true // big one--strip code that will never execute
          },
          comments: false
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: extractPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.(woff|woff2|png|jpg|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          publicPath: PATHS.publicPath,
          name: "[name].[ext]"
        }
      }
    ]
  },
  devServer: {
    hot: true,
    port: 8090,
    // Send API requests on localhost to API server get around CORS.
    proxy: {
      "/development/api": {
        target: {
          host: process.env.IS_DOCKERIZED ? "docstore-service" : "localhost",
          protocol: "http:",
          port: 8080
        },
        pathRewrite: {
          "^/development/api": "/api"
        }
      },
      "/api": {
        target: {
          host: process.env.IS_DOCKERIZED ? "docstore-service" : "localhost",
          protocol: "http:",
          port: 8080
        }
      },
      "/ws": {
        target: {
          host: process.env.IS_DOCKERIZED ? "docstore-service" : "localhost",
          protocol: "ws:",
          port: 8080
        },
        loglevel: "debug",
        ws: true
        //changeOrigin: true
      }
    }
  }
});

module.exports = (env, argv) => {
  const extract = createExtractPlugin(argv.mode);
  const plugins = createPlugins(extract);
  const config = createConfig(plugins, extract);
  if (argv.mode === "development") {
    config.devtool = "source-map";
  }
  return config;
};
