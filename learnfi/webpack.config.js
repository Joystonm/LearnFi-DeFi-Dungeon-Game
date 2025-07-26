const path = require('path');
const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      "process": require.resolve("process/browser")
    },
    alias: {
      'process/browser': require.resolve('process/browser')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ]
};
