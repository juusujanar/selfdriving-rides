const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.js',

  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
    extensions: ['.js'],
  },

  output: {
    path: path.resolve(__dirname, 'build/assets'),
    publicPath: '/assets/',
    filename: 'bundle.js',
  },

  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 4000,
    inline: true,
  },
};
