const Koa = require("koa");
const path = require("path");
const { sep } = path; //兼容不同系统上的斜杠

const env = require("./env");

const middlewareLoader = require("./loader/middleware");
const routerSchemaLoader = require("./loader/router-schema");
const routerLoader = require("./loader/router");
const serviceLoader = require("./loader/service");
const configLoader = require("./loader/config");
const controllerLoader = require("./loader/controller");
const extendLoader = require("./loader/extend");

module.exports = {
  /**
   *  启动项目
   * @param options 项目配置
   *        options = {
   *          name //项目名称
   *          homePath //项目首页
   *        }
   */
  start(options = {}) {
    // koa 示例
    const app = new Koa();

    //应用配置
    app.options = options;

    //基础路径
    app.baseDir = process.cwd();

    //业务文件路径
    app.businessPath = path.resolve(app.baseDir, `.${sep}app`);

    // 初始化环境配置
    app.env = env();
    console.log(`-- [start] env: ${app.env.get()} --`);

    //加载 midedleware
    middlewareLoader(app);
    console.log(`-- [start] load middleware done --`);

    //加载 routerSchema
    routerSchemaLoader(app);
    console.log(`-- [start] load routerSchema done --`);

    //加载 controller
    controllerLoader(app);
    console.log(`-- [start] load controller done --`);

    //加载 service
    serviceLoader(app);
    console.log(`-- [start] load service done --`);

    //加载 config
    configLoader(app);
    console.log(`-- [start] load config done --`);
    // console.log(app.config);

    //加载 extend
    extendLoader(app);
    console.log(`-- [start] load extend done --`);

    //注册全局中间件
    try {
      require(`${app.businessPath}${sep}middleware.js`)(app);
      console.log(`-- [start] load global middleware done --`);
    } catch (e) {
      console.log("[exception] there is no global middleware file");
    }

    //加载 router
    routerLoader(app);
    console.log(`-- [start] load router done --`);

    //启动服务
    try {
      const port = process.env.PORT || 8080;
      const host = process.env.IP || "0.0.0.0";
      app.listen(port, host);
      console.log(`Server runing on port:${port}`);
    } catch (error) {
      console.error(error);
    }
  },
};
