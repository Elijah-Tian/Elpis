module.exports = (app) => {
  const BaseController = require("./base")(app);
  return class ProjectController extends BaseController {
    /**
     * 获取项目列表
     * @pram {object} ctx 上下文
     */
    async getList(ctx) {
      const { project: projectService } = app.service;
      const projectList = await projectService.getList();
      this.success(ctx, projectList)
    }
  };
};
