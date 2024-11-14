// webpack.config.js
import dotenv from 'dotenv';
import webpack from 'webpack'


// Load environment variables from .env file
const env = dotenv.config().parsed;

module.exports = {
  // Other configurations...
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env),
    }),
  ],
};
