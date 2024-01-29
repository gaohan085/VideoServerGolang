// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  entry: "./web_src/index.ts",
  output: {
    clean: true,
    path: path.resolve(__dirname, "dist"),
    filename: "[contenthash:15].js",
  },
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: 3333,
    hot: true,
    allowedHosts: ["http://192.168.1.31"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./web_src/index.html",
      filename: "index.html",
      publicPath: isProduction ? "dist" : "auto",
      hash: false,
    }),
    new webpack.EnvironmentPlugin(),
    new MiniCssExtractPlugin({
      filename: "[contenthash:15].css",
    }),
    !isProduction && new ReactRefreshWebpackPlugin({ overlay: true }),
  ].filter(Boolean),
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
            return moduleFileName;
          },
          chunks: "all",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.([jt]s|[jt]sx)$/i,
        exclude: ["/node_modules/"],
        use: [
          {
            loader: "swc-loader",
            options: {
              parseMap: !isProduction ? true : false,
              env: { mode: "entry" },
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                  dynamicImport: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    refresh: !isProduction,
                  },
                },
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          stylesHandler,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: isProduction
                  ? "[local]"
                  : "[path][name]__[local]--[hash:base64:5]",
              },
            },
          },
          ,
          "sass-loader",
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|ico)$/i,
        type: "asset/resource",
        generator:{
          filename:"[hash:15][ext][query]"
        }
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
  } else {
    config.mode = "development";
    config.devtool = "source-map";
  }
  return config;
};
