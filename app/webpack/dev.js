// 本地开发启动 devServe
const express = require("express");
const path = require("path");
const consoler = require("consoler");
const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");

// 从 webpack.dev.js 获取 webpack 配置和 devServer配置
const { webpackConfig, DEV_SERVER_CONFIG } = require("./config/webpack.dev.js");

const app = express();

const compiler = webpack(webpackConfig);

// 指定静态文件目录
app.use(express.static(path.join(__dirname, "../public/dist")));

// 引入 devMiddleware 中间件（监控文件改动）
app.use(
  devMiddleware(compiler, {
    // 落地文件
    writeToDisk: (filePath) => filePath.endsWith(".html"),

    // 资源路径
    publicPath: webpackConfig.output.publicPath,

    // headers 配置
    headers: {
      "Access-Contrl-Allow-Origin": "*",
      "Access-Contrl-Allow-Methods": "GET,POST,DELETE,PATCH,OPTIONS",
      "Access-Contrl-Allow-Headers":
        "X-Requested-With, content-type,Authorization",
    },
    stats: {
      colors: true,
    },
  }),
);

// 引用 hotMiddleware 中间件（实现热更新通讯）
app.use(
  hotMiddleware(compiler, {
    path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
    log: () => {},
  }),
);

consoler.info("请等待webpack初次构建完成提示");

const port = DEV_SERVER_CONFIG.PORT;

// 启动 devServer
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
