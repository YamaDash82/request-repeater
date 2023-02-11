const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development', 
  target: 'node', 
  externals: [ nodeExternals() ], 
  devtool: 'eval-source-map', 
  module: {
    rules: [
      {
        loader: 'ts-loader', 
        test: /\.ts$/, 
        exclude: [/node_modules/], 
        options: { configFile: 'tsconfig.json'}
      }
    ]
  }, 
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }, 
  entry: './src/server.ts', 
  output: {
    filename: 'server.js', 
    path: path.resolve(__dirname, 'dist')
  }, 
  node: {
    __dirname: false
  }
};