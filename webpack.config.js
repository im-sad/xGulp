const path = require(`path`);
const {CleanWebpackPlugin} = require(`clean-webpack-plugin`);

module.exports = {
  context: path.resolve(__dirname, `src`),
  mode: process.env.NODE_ENV || `development`, // development or production
  devtool: process.env.NODE_ENV == `development` ? 'eval' : false, // https://webpack.js.org/configuration/devtool/
  entry: {
    main: `./js/main.ts`,
    libs: `./js/libs.ts`,
  },
  output: {
    filename: process.env.NODE_ENV === `production` ? `[name].min.js` : `[name].js`,
    path: path.join(__dirname, `build/js`),
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: `babel-loader`,
        options: {
          presets: [`@babel/preset-env`],
        },
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
