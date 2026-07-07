/**
 * projectHandler 相关项目处理内容
 * @param {object} app  实例
 */
module.exports = (app) => {
  return async (ctx, next) => {
    // 只对 业务API 进行proj_key 处理
    if (ctx.path.indexOf("/api/proj/") < 0) {
      return await next();
    }

    // 获取 projKey
    const { proj_key: projKey } = ctx.request.headers;

    if (!projKey) {
      ctx.status = 200;
      ctx.body = {
        success: 200,
        message: "proj_key not found",
        code: 446,
      };

      return;
    }

    ctx.projKey = projKey;

    await next();
  };
};
