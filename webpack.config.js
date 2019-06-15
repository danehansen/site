const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: path.join(__dirname + "/src/index.js"),
  output: {
    path: path.join(__dirname + "/dist"),
    filename: "index.[hash].js",
    publicPath: "/"
  },
  devtool: "source-map",
  devServer: {
    open: true,
    contentBase: path.join(__dirname, "/dist"),
    compress: true,
    port: 6969,
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      meta: {
        viewport: "width=device-width, initial-scale=1, maximum-scale=1"
      },
      template: path.join(__dirname, "/src/index.html")
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
      // TODO: take out jpg loader later
    ]
  },
  resolve: {
    modules: [path.join(__dirname, "node_modules"), path.join(__dirname, "src")]
  }
};
