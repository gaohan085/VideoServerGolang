// Generated using webpack-cli https://github.com/webpack/webpack-cli
// @ts-check
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const isProduction = process.env.NODE_ENV == "production";
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

/** @type {import("webpack").Configuration} */
const config = {
  entry: "./web_src/index.ts",
  output: {
    clean: true,
    path: path.resolve(__dirname, "dist"),
    filename: !isProduction ? "[name].js" : "js/[name].js?[contenthash:10]",
  },
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: 3333,
    hot: true,
    allowedHosts: ["http://192.168.1.31"],
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "/dist/"),
      publicPath: "/",
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./web_src/index.html",
      filename: "index.html",
      publicPath: !isProduction ? "/" : "/dist/",
      hash: false,
    }),
    new webpack.EnvironmentPlugin(),
    !isProduction && new ReactRefreshWebpackPlugin({ overlay: true }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("swc-loader"),
            options: {
              jsc: {
                transform: {
                  react: {
                    development: !isProduction,
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
                  : "[path][name]-[local]--[hash:base64:5]",
              },
            },
          },

          "sass-loader",
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|ico)$/i,
        type: "asset/resource",
        generator: {
          filename: isProduction
            ? "assets/[hash:15][ext][query]"
            : "[name][ext][query]",
        },
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".css", "..."],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              "default",
              {
                discardComments: {
                  removeAll: true,
                },
              },
            ],
          },
        }),
      ],
      splitChunks: {
        // maxSize: 100000,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module, chunks, cacheGroupKey) {
              const chunkInfoSlice = module.identifier().split("/");
              const moduleSlice =
                chunkInfoSlice[
                  chunkInfoSlice.lastIndexOf("node_modules") - 1
                ].split(/(?:@|_)/);
              const moduleName = moduleSlice[0];
              const version = moduleSlice[1];

              if (!/[\d.]/.test(version)) {
                return chunkInfoSlice[
                  chunkInfoSlice.lastIndexOf("node_modules") + 1
                ].replace("@", "");
              }

              return `${moduleName}/${version}/${moduleName}`;
            },
            chunks: "all",
            priority: -10,
          },
          default: {
            test: /[\\/]web_src[\\/]/,
            name: "main",
          },
        },
      },
    };
    config.plugins?.push(
      new MiniCssExtractPlugin({
        filename: "css/[id].[contenthash:10].css",
        chunkFilename: "css/[id].[contenthash:10].css",
        runtime: true,
      }),
    );
    config.externals = [
      { react: "React" },
      { "react-dom": "ReactDOM" },
      { axios: "axios" },
      { plyr: "Plyr" },
    ];
    config.devtool = "source-map";
  } else {
    config.mode = "development";
    config.devtool = "eval-source-map";
    config.plugins?.push(new MiniCssExtractPlugin());
  }
  return config;
};
