const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.js',

  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
    // directories where to look for modules
    extensions: ['.js'],
  },

  output: {
    path: path.resolve(__dirname, 'build'),
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
