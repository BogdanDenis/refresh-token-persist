const path = require('path');
console.log(path.resolve(__dirname, 'example/build'));

module.exports = {
  entry: './example/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  devServer: {
    port: 3000,
    historyApiFallback: {
      index: './example/index.html',
    },
  },
};
