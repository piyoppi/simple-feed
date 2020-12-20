const path = require('path');
const BuildFeedWebpackPlugin = require('./../src/lib/plugins/feed')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [".js"]
  },
  plugins: [
    new BuildFeedWebpackPlugin()
  ]
};
