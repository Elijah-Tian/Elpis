module.exports = (app) => {
  const BaseController = require("./base")(app);
  return class ProjectController extends BaseController {
    /**
     * 根据 proj_key 获取项目配置
     */
    get(ctx) {
      const { proj_key: projKey } = ctx.request.query;

      const { project: projectService } = app.service;
      const projConfig = projectService.get(projKey);

      if (!projConfig) {
        this.fail(ctx, "项目获取异常", 50000);
        return;
      }

      this.success(ctx, projConfig);
    }
    /**
     * 获取当前 projectKey 对应模型下的项目列表（如果无 projectKey，全量获取）
     */
    async getList(ctx) {
      const { proj_key: projKey } = ctx.request.query;

      const { project: projectService } = app.service;
      const projectList = projectService.getList({ projKey });

      const dtoProjectList = projectList.map((item) => {
        const { modelKey, key, name, desc, homePage } = item;
        return { modelKey, key, name, desc, homePage };
      });

      this.success(ctx, dtoProjectList);
    }
    /**
     * 获取所有模型与项目的结构化数据
     */
    async getModeList(ctx) {
      const { project: projectService } = app.service;
      const modelList = await projectService.getModelList();

      // 构造返回结构，只返回关键数据
      const dtoModelList = modelList.reduce((preList, item) => {
        const { model, project } = item;

        // 构造 model 关键数据
        const { key, name, desc } = model;
        const dtoModel = { key, name, desc };

        // 构造 peoject 关键数据
        const dtoProject = Object.keys(project).reduce((preObj, projKey) => {
          const { key, name, desc, homePage } = project[projKey];
          preObj[projKey] = { key, name, desc, homePage };
          return preObj;
        }, {});

        // 整合返回结构
        preList.push({
          model: dtoModel,
          project: dtoProject,
        });

        return preList;
      }, []);
      this.success(ctx, dtoModelList);
    }
  };
};
