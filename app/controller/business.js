module.exports = (app) => {
  const baseController = require("./base")(app);
  return class BusinessController extends baseController {
    remove(ctx) {
      const { product_id: productId } = ctx.request.body;
      this.success(ctx, { product_id: productId });
    }
    getList(ctx) {
      const { page, size } = ctx.request.query;
      this.success(
        ctx,
        [
          {
            product_id: "1",
            product_name: `${ctx.projKey}大前端面试宝典`,
            price: 39.9,
            inventory: 999999,
            create_time: "2023-07-03 20:23:22",
          },
          {
            product_id: "2",
            product_name: "《前端求职之道》",
            price: 199,
            inventory: 100000,
            create_time: "2023-07-03 20:23:22",
          },
          {
            product_id: "3",
            product_name: "《大前端全栈实践》",
            price: 899,
            inventory: 108800,
            create_time: "2024-11-17 20:23:22",
          },
        ],
        { total: 3, page, size },
      );
    }
  };
};
