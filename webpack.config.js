let webpack = require('webpack');
let path = require('path');
let config = require('./config/index.js');
let autoprefixer = require('autoprefixer');
let HtmlwebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let WebpackMd5Hash = require('webpack-md5-hash');
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');
const NODE_MODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');

let _config = config();
let is_dev = process.env.NODE_ENV === 'development';


let ignore_css = [
  path.resolve(ROOT_PATH, "node_modules/perfect-scrollbar/dist/css/"),
]

let webpackConfig = {
  entry: {
    commons: [
      'react', 'react-dom', 'react-router',
      'redux', 'react-redux', 'redux-saga', 'lodash',
      'classnames', 'babel-polyfill', 'react-css-modules'
    ],
    index: ['./src/index']
  },
  output: {
    path: BUILD_PATH,
    publicPath: '/',
    filename: is_dev ? 'js/[name].js' : 'js/[name].[chunkhash].js',
    chunkFilename: is_dev ? 'js/[name].js' : 'js/[name].[chunkhash].js'
  },
  resolve: {
    modules: [
      ROOT_PATH,
      "node_modules"
    ],
    alias: {
      "src": SRC_PATH,
      "root": ROOT_PATH,
    },
    extensions: ['.ts', '.tsx', '.js', '.css', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        enforce: 'pre',
        use: 'tslint-loader',
        exclude: /(node_modules)/
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
          test: /\.(woff|eot|ttf)\??.*$/i,
          loader: 'url-loader?limit=10000&name=fonts/[name].[hash].[ext]'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url-loader?limit=10000&name=img/[hash].[ext]',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-withimg-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use:[
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: 'sass-loader'},
        ],
        include: ignore_css
      },
      {
        test: /\.s?css$/,
        exclude: ignore_css,
        include: SRC_PATH,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader?importLoaders=1&modules&localIdentName=[name]__[local]___[hash:base64:5]'},
          {
            loader: 'postcss-loader', options: {
              plugins: [autoprefixer({ browsers: ['Chrome >= 35',
                'Firefox >= 38',
                'Edge >= 12',
                'Explorer >= 10',
                'iOS >= 8',
                'Safari >= 8',
                'Android 2.3',
                'Android >= 4',
                'Opera >= 12']
              })]
            }
          },
          {loader: 'sass-loader'},
        ],
        // publicPath: "/"
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      },
      'DEBUG': _config.runtime.debug,
      config : JSON.stringify(_config)
    }),
    new HtmlwebpackPlugin({
      favicon: './favicon.ico', //favicon路径
      filename: 'index.html',
      chunks: ['commons', 'index'],
      template: './src/index.html',
      inject: true, //所有的 javascript 资源将被放置到 body 元素的底部
      hash: false, //为静态资源生成hash值
      minify: false
    }),
    new CleanWebpackPlugin(
      ['build'],
      {
        root: ROOT_PATH, // An absolute path for the root.
        verbose: true, // Write logs to console.
        dry: false, // Use boolean 'true' to test/emulate delete. (will not remove files).
      }
    ),
    new CopyWebpackPlugin([]),
    new ExtractTextPlugin({
      filename: 'css/[name].[contenthash].css',
      disable: false,
      allChunks: true
    }),
    new WebpackMd5Hash(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      minChunks: Infinity
    }),
  ],
}

// 开启sourcemap
if (is_dev || _config.runtime.sourcemap) {
  webpackConfig.devtool = 'inline-source-map';
  webpackConfig.module.rules.unshift(
    {
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "source-map-loader"
    },
    {
      enforce: 'pre',
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: "source-map-loader"
    });
}

// uglify
if (_config.buildtime.uglify) {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    compress: {
      warnings: false,
      drop_console: false,
    }
  }));
}

// analyzer
if (_config.buildtime.analyze) {
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig
