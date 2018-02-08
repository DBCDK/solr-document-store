var packageJSON = require("./package.json");
var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const PATHS = {
  build: path.join(
    __dirname,
    "target",
    "classes",
    "META-INF",
    "resources",
    "webjars",
    packageJSON.name,
    packageJSON.version
  )
};

const extract = new ExtractTextPlugin({
  filename: "solr-docstore-gui-styles.css",
  disable: process.env.NODE_ENV === "development"
});

var plugins = [
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    )
  }),
  extract
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
        dead_code: true // big one--strip code that will never execute
      },
      comments: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: function(module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.includes("node_modules");
      }
    })
  );
} else {
  plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  );
}

module.exports = {
  entry: {
    "solr-docstore-gui": ["react-hot-loader/patch", "./app/index.js"],
    "queue-admin-gui": ["react-hot-loader/patch", "./app/queue-admin.js"]
  },
  output: {
    path: PATHS.build,
    publicPath: "/",
    filename: "[name]-bundle.js"
  },
  devtool: "inline-source-map",
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: extract.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.(woff|woff2|png|jpg|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          publicPath: "",
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
      }
    }
  }
};
