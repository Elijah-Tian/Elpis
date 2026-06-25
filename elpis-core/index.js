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

    //挂载 midedleware  中间件层 目前放了api的一些校验需求，签名、参数验证、错误处理等
    middlewareLoader(app);
    console.log(`-- [start] load middleware done --`);

    //挂载 routerSchema  路由架构层  放了路由的规则
    routerSchemaLoader(app);
    console.log(`-- [start] load routerSchema done --`);

    //挂载 controller  控制层  一般放业务API  如 获取用户信息、页面渲染等
    controllerLoader(app);
    console.log(`-- [start] load controller done --`);

    //挂载 service  服务层  通常是操作数据库的接口、调用第三方接口的接口等
    serviceLoader(app);
    console.log(`-- [start] load service done --`);

    //挂载 config   配置层 如 开发环境、测试环境、生产环境等
    configLoader(app);
    console.log(`-- [start] load config done --`);
    // console.log(app.config);

    //挂载 extend   工具层 如日志、缓存、工具类等
    extendLoader(app);
    console.log(`-- [start] load extend done --`);

    //注册(使用)全局中间件  即 用户自定义中间件
    try {
      require(`${app.businessPath}${sep}middleware.js`)(app);
      console.log(`-- [start] load global middleware done --`);
    } catch (e) {
      console.log("[exception] there is no global middleware file");
    }

    //挂载 router  路由曾  加载路由
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

    return app
  },
};
