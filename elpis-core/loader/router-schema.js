const glob = require("glob");
const path = require("path");
const { sep } = path;

/**
 * router-schema loader
 * @param {object} app koa 实例
 *
 * 通过'json-schema & ajv' 对API 规则进行约束，配合 api-params-verify 中间件使用
 *
 * app/router-schema/**.js
 *
 * 输出：
 * app.rouSchema ={
 *   '${api1}': ${jsonSchema},
 *   '${api2}': ${jsonSchema},
 *   '${api3}': ${jsonSchema},
 *    ...
 * }
 */
module.exports = (app) => {
  //读取 app/router-schema/**/**.js 下所有文件
  const routerSchemaPath = path.resolve(
    app.businessPath,
    `.${sep}router-schema`,
  );
  const fileList = glob.sync(
    path.resolve(routerSchemaPath, `.${sep}**${sep}**.js`),
  );

  //注册所有routerSchema，使得可以以 'app.routerSchema' 方式访问
  let routerSchema = {};
  fileList.forEach((file) => {
    routerSchema = {
      ...routerSchema,
      ...require(path.resolve(file)),
    };
  });
  app.routerSchema = routerSchema;
};
