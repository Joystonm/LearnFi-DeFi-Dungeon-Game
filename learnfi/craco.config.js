const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify"),
          "os": require.resolve("os-browserify/browser"),
          "url": require.resolve("url"),
          "assert": require.resolve("assert"),
          "buffer": require.resolve("buffer"),
          "process": require.resolve("process/browser"),
          "path": require.resolve("path-browserify"),
          "fs": false,
          "net": false,
          "tls": false,
          "zlib": require.resolve("browserify-zlib"),
        },
        alias: {
          'process/browser': require.resolve('process/browser')
        }
      },
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ]
    }
  },
};
