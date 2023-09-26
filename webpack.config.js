// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

const config = {
  entry: "./web_src/index.tsx",
  output: {
    clean: false,
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    assetModuleFilename: "[name][contenthash][query]",
  },
  devServer: {
    open: false,
    host: "localhost",
    port: 3333,
    static: {
      directory: path.join(__dirname, ""),
    },
    allowedHosts: ["http://192.168.1.11"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./web_src/index.html",
      filename: "index.html",
      publicPath: isProduction ? "dist" : "auto",
      hash: true,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "./node_modules/plyr-react/plyr.css",
          to: isProduction ? path.resolve(__dirname, "dist") : "./dist/",
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module, chunks, cacheGroupKey) {
            const moduleFileName = module
              .identifier()
              .split("/")
              .reduceRight((item) => item);
            return `${cacheGroupKey}.${moduleFileName.slice(
              0,
              moduleFileName.indexOf(".")
            )}`;
          },
          chunks: "all",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "swc-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.css$/i,
        type: "asset/resource",
      },
      {
        test: /\.(s[ac]ss)$/i,
        use: [
          stylesHandler,
          {
            loader: "css-loader",
            options: {
              modules: { localIdentName: "[path][name]-[hash:base64:5]" },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new MiniCssExtractPlugin());
  } else {
    config.mode = "development";
  }
  return config;
};
