const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const glob = require("glob");

// 动态构造 pageEntries、htmlWebpackPluginList
const pageEntries = {};
const htmlWebpackPluginList = [];

// 获取 app/pages 目录下所有文件（entry.xx.js）
const entryList = path.resolve(process.cwd(), "./app/pages/**/entry.*.js");
glob.sync(entryList).forEach((file) => {
  const entryName = path.basename(file, ".js");

  // 构造 entry
  pageEntries[entryName] = file;
  // 构造最终渲染页面文件
  htmlWebpackPluginList.push(
    // html-webpack-plugin 辅助注入打包后的 bundle 文件到 html 中
    new HtmlWebpackPlugin({
      // 产物 （最终模板）输出路径
      filename: path.resolve(
        process.cwd(),
        "./app/public/dist/",
        `${entryName}.html`,
      ),
      // 指定要使用的模板文件
      template: path.resolve(process.cwd(), "./app/view/entry.html"),
      // 要注入的代码块
      chunks: [entryName],
    }),
  );
});

/**
 * webpack 基础配置
 */
module.exports = {
  // 入口配置
  entry: {
    // "entry.page1": "./app/pages/page1/entry.page1.js",
    // "entry.page2": "./app/pages/page2/entry.page2.js",
    ...pageEntries
  },
  // 模块解析配置(决定了要加载解析哪些模块，以及用什么方式解析)
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
        },
      },
      {
        test: /\.js$/,
        // 只对业务代码进行 babel，加快 webpack 打包速度
        include: [path.resolve(process.cwd(), "./app/pages")],
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpe?g|gif)(\?.)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 300,
            esModule: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        use: "file-loader",
      },
    ],
  },
  // 产物输出路径，因为开发和生产环境输出不一致，所以在各自环境中自行配置
  output: {},
  // 配置模块解析得具体行为(定义 webpack 在打包时，如何找到并解析具体模块的路径)
  resolve: {
    extensions: [".js", ".vue", ".less", ".css"],
    alias: {
      $pages: path.resolve(process.cwd(), "./app/pages"),
      $common: path.resolve(process.cwd(), "./app/pages/common"),
      $widgets: path.resolve(process.cwd(), "./app/pages/widgets"),
      $store: path.resolve(process.cwd(), "./app/pages/store"),
    },
  },
  // 配置 webpack 插件
  plugins: [
    // 处理 .vue 文件，这个插件是必须的
    // 他的职能是将你定义过的其他规则复制并应用到 .vue 文件里
    // 例如，有一条匹配规则 /\.js$/ 的规则，那么他会应用到 .vue 文件中的 <script> 板块中
    new VueLoaderPlugin(),
    // 把第三方库暴露到 window context 下，即 注入这些模块到每个模块的作用域
    new webpack.ProvidePlugin({
      Vue: "vue", // 代码里写 Vue → 自动 import Vue from "vue"
      axios: "axios", // 代码里写 axios → 自动 import axios from "axios"
      _: "lodash", // 代码里写 _ → 自动 import _ from "lodash"
    }),
    // 定义全局常量
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true, // 支持 vue 解析 optionsAPI
      __VUE_PROD_DEVTOOLS__: "false", // 禁用 VUE 调试工具
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false", // 禁用生产环境显示水合信息
    }),
    // 构造最终渲染的页面模板(html)
    ...htmlWebpackPluginList,
  ],
  // 配置打包输出优化(代码分割，模块合并，缓存，TreeShaking，压缩等优化策略)
  optimization: {
    /**
     * 把 js 文件打包成三种类型
     * 1. vendor 第三方 lib 库，基本不会改动，除非依赖版本升级
     * 2. common 业务组件代码的公共部分抽取出来，改动较少
     * 3. entry.{page} 不用 entry 页面里的业务组件代码的差异部分，会经常改动
     * 目的：把改动和引用频率不一样的 js 区分出来，以达到更好利用浏览器缓存的效果
     */
    splitChunks: {
      chunks: "all", // 对同步和异步模块都进行分割
      maxAsyncRequests: 10, //每次异步加载的最大并行请求数
      maxInitialRequests: 10, // 入口点的最大并行请求数
      cacheGroups: {
        vendor: {
          // 第三方依赖库
          test: /[\\/]node_modules[\\/]/, // 打包 node_modules 中的文件
          name: "vendor", // 模块名称
          priority: 20, // 优先级，数字越大，优先级越高
          enforce: true, // 强制执行
          reuseExistingChunk: true, // 服用已有的公共 chunk
        },
        common: {
          //公共模块
          name: "common", // 模块名称
          minChunks: 2, // 被两处引用即被归为公共模块
          minSize: 1, // 最小分割文件大小 （1 byte）
          priority: 10, // 优先级，数字越大，优先级越高
          reuseExistingChunk: true, // 服用已有的公共 chunk
        },
      },
    },
    // 讲 webpack 运行时生成的代码打包到 runtime.js
    runtimeChunk: true,
  },
};
