'use strict';

const dotenv = require('dotenv');
const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

dotenv.load();

const production = process.env.NODE_ENV === 'production';

let plugins = [
  new ExtractTextPlugin('bundle-[hash].css'),
  new HTMLPlugin({ template: `${__dirname}/app/index.html` }),
  new webpack.DefinePlugin({
    __API_URL__: JSON.stringify(process.env.API_URL),
    __DEBUG__: JSON.stringify(!production),
  }),
];

if (production) {
  plugins = plugins.concat([
    new CleanPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false,
      },
    }),
  ]);
}

module.exports = {
  plugins,
  entry: `${__dirname}/app/entry.js`,
  output: {
    filename: 'bundle-[hash].js',
    path: `${__dirname}/build`,
    publicPath: process.env.CDN_URL,
  },
  devServer: {
    historyApiFallback: true,
  },
  devtool: production ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.(eot|ttf|woff|svg).*/,
        loader: 'url-loader?limit=60000&name=font/[name].[ext]',
      },
      {
        test: /\.scss$/,
        // loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader']),
        loader: [
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [`${__dirname}/app/scss/`],
            },
          },
        ],
      },
      {
        test: /\.(jpg|jpeg|tiff|png|gif)$/,
        loader: 'url-loader?limit=60000&name=image/[name].[ext]',
      },
    ],
  },
};
