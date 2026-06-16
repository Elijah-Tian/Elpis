module.exports = (app) => {
  const BaseService = require("./base")(app);
  return class ProjectService extends BaseService{
    async getList() {
      return [
        {
          name: "Elijah",
          desc: "123",
        },
        {
          name: "Elijah",
          desc: "123",
        },
        {
          name: "Elijah",
          desc: "123",
        },
      ];
    }
  };
};
