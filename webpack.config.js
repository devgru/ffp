const path = require('path');

module.exports = {
  context: path.join(__dirname),
  entry: './index.js',

  output: {
    path: path.join(__dirname),
    filename: 'dist.js',
    libraryTarget: 'umd',
    library: 'ZIndices'
  },

  module: {
    loaders: [
      {
        test: /(\.js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        }
      }
    ]
  }
};
