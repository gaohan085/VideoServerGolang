// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const BundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

const config = {
  entry: "./web_src/index.ts",
  output: {
    clean: true,
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-[contenthash].js",
  },
  devServer: {
    open: false,
    host: "localhost",
    port: 3333,
    hot: true,
    allowedHosts: ["http://192.168.1.31"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./web_src/index.html",
      filename: "index.html",
      publicPath: isProduction ? "dist" : "auto",
      hash: isProduction ? true : false,
    }),
    new webpack.EnvironmentPlugin(),
    !isProduction && new ReactRefreshWebpackPlugin({ overlay: false }),
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
            return `${cacheGroupKey}.${moduleFileName.slice(
              0,
              moduleFileName.indexOf("."),
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
        test: /\.(s[ac]ss)$/i,
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

    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: "[contenthash].css",
      }),
      new CopyPlugin({
        patterns: [
          {
            from: "./assets/favicon.ico",
            to: path.resolve(__dirname, "dist/"),
          },
        ],
      }),
      new webpack.ProgressPlugin({}),
      new BundleAnalyzer({ analyzerPort: 3000 }),
    );
    config.externals = [
      { react: "React" },
      { "react-dom": "ReactDOM" },
      { axios: "axios" },
    ];
  } else {
    config.mode = "development";
    config.devtool = "source-map";
    config.plugins.push(
      new CopyPlugin({
        patterns: [{ from: "./assets/favicon.ico", to: "./dist/" }],
      }),
      new TimerLoggerPlugin(),
    );
  }
  return config;
};

//TimerLoggerPlugin=============================================================
const PluginName = "TimerLoggerPlugin";
class TimerLoggerPlugin {
  apply(compiler) {
    compiler.hooks.watchRun.tap(PluginName, (compiler) => {
      const logger = compiler.getInfrastructureLogger(PluginName);
      logger.warn(`Compilation Done at ${new Date().toLocaleString()}\n`);
    });
  }
}
//==============================================================================
