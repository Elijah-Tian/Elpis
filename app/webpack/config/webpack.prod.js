const path = require("path");
const merge = require("webpack-merge");
const os = require("os");
const HappyPack = require("happypack");

const MinCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CSSMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackInjectAttributesPlugin = require("html-webpack-inject-attributes-plugin");
const TreserWepackPlugin = require('terser-webpack-plugin')

// 多线程 build 设置
const happypackCommonConfig = {
  debug: false,
  threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
};

// 基类配置
const baseConfig = require("./webpack.base.js");

// 生产环境 webpack 配置
const webpackConfig = merge.smart(baseConfig, {
  // 指定生产环境模式
  mode: "production",
  // 生产环境的 output 配置
  output: {
    filename: "js/[name]_[chunkhash:8].bundle.js",
    path: path.join(process.cwd(), "./app/public/dist/prod"),
    publicPath: "/dist/prod/",
    crossOriginLoading: "anonymous", //跨域配置
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MinCssExtractPlugin.loader, "happypack/loader?id=css"],
      },
      {
        test: /\.js$/,
        include: [
          // 只对业务代码进行 babel，加快 webpack 打包速度
          path.resolve(process.cwd(), "./app/pages"),
        ],
        use: ["happypack/loader?id=js"],
      },
    ],
  },
  // webpack 不会有大量 hints 信息，默认为 warning
  performance: {
    hints: false,
  },
  plugins: [
    // 每次 build 前，清空 public/dist 目录
    new CleanWebpackPlugin(["public/dist"], {
      root: path.resolve(process.cwd(), "./app/"),
      exclude: [],
      verbose: true,
      dry: false,
    }),
    // 提取 css 的公共部分，有效利用缓存
    new MinCssExtractPlugin({
      chunkFilename: "css/[name]_[contenthash:8].bundle.css",
    }),
    // 优化并压缩css资源
    new CSSMinimizerPlugin(),
    // 多线程打包 JS，加快打包速度
    new HappyPack({
      ...happypackCommonConfig,
      id: "js",
      loaders: [
        `babel-loader?${JSON.stringify({
          presets: ["@babel/preset-env"],
          plugins: ["@babel/plugin-transform-runtime"],
        })}`,
      ],
    }),
    // 多线程打包 CSS，加快打包速度
    new HappyPack({
      ...happypackCommonConfig,
      id: "css",
      loaders: [
        {
          path: "css-loader",
          options: {
            importLoaders: 1,
          },
        },
      ],
    }),
    // 浏览器在请求资源时不发送用户的身份凭证
    new HtmlWebpackInjectAttributesPlugin({
      crossorigin: "anonymous",
    }),
  ],
  optimization: {
    // 使用 TerserPlugin 的并发和缓存，提升压缩阶段的性能
    // 清除 console.log
    minimize: true,
    minimizer: [
      new TreserWepackPlugin({
        // cache: true, // 启用缓存来加速构建过程  5.x 的 API 里 不再有 cache 选项（缓存由 webpack 5 自己管）
        parallel: true, // 利用多核 CPU 的优势来加快压缩速度
        terserOptions: {
          compress: {
            drop_console: true, // 去掉console.log
          },
        },
      }),
    ],
  },
});

module.exports = webpackConfig;
