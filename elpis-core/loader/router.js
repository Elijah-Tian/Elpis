const path = require("path");
const glob = require("glob");
const { sep } = path;
const KoaRouter = require("koa-router");

/**
 * router loader
 * @param {object} app koa 实例
 *
 * 解析所有 app/touter/ 下所有 js 文件，加载到KoaRouter 下
 */

module.exports = (app) => {
  //找到路由文件路径
  const routerPath = path.resolve(app.businessPath, `.${sep}router`);

  //实例化KoaRouter
  const router = new KoaRouter();

  //注册所有路由
  const fileList = glob.sync(path.resolve(routerPath, `.${sep}**${sep}**.js`));
  fileList.forEach((file) => {
    require(path.resolve(file))(app, router);
  });

  //路由兜底（健壮性）
  router.get("*", async (ctx, next) => {
    ctx.status = 302; //临时重定向
    ctx.redirect("/");
  });

  //路由注册到app上
  app.use(router.routes());
  app.use(router.allowedMethods());  //处理路由请求方式错误，如：应是get 写成post
};
