const glob = require("glob");
const path = require("path");
const { sep } = path;

/**
 * extend loader
 * @param {object} app Koa 实例
 *
 * 加载所有 extend，可通过'app.extend.${目录}.${文件}' 访问
 *
 * 例子：
 *    app/extend
 *       |
 *       | -- custom-extend.js
 *
 *    => app.extend.customExtend
 */
module.exports = (app) => {
  //读取 app/extend/**.js 下所有文件
  const extendPath = path.resolve(app.businessPath, `.${sep}extend`);
  const fileList = glob.sync(
    path.resolve(extendPath, `.${sep}**${sep}**.js`),
  );

  fileList.forEach((file) => {
    //提取名称
    let name = path.resolve(file);

    //截取路径 app/extend/custom-module/custom-extend.js => custom-module/customExtend
    name = name.substring(
      name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length,
      name.lastIndexOf("."),
    );

    //把'-'统一改为驼峰式，custom-moudle/custom-extend.js => customMoudle.customExtend
    name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase());
    
    //过滤 app 已经存在的 key
    for(const key in app){
        if(key === name) {
            console.log(`[extend load error] name:${name} is already in app`);
            return
        }
    }
    
    //挂在 extend 到 app 上
    app[name] = require(path.resolve(file))(app)
  });
};
