module.exports = (app) => {
  const baseController = require("./base")(app);
  return class BusinessController extends baseController {
    update(ctx) {
      const { product_id: productId } = ctx.request.body;
      this.success(ctx, { product_name: productId });
    }
    get(ctx) {
      const { product_id: productId } = ctx.request.query;
      const productList = this.getProductList(ctx);
      const productItem = productList.find(item => item.product_id === productId)
      this.success(ctx, productItem);
    }
    create(ctx) {
      const { product_name: productName } = ctx.request.body;
      this.success(ctx, { product_name: productName });
    }
    remove(ctx) {
      const { product_id: productId } = ctx.request.body;
      this.success(ctx, { product_id: productId });
    }
    getList(ctx) {
      const { product_name: productName, page, size } = ctx.request.query;

      let productList = this.getProductList(ctx);
      if (productName && productName !== "all") {
        productList = productList.filter(
          (item) => item.product_name === productName,
        );
      }
      this.success(ctx, productList, { total: 3, page, size });
    }
    getProductEnumList(ctx) {
      this.success(ctx, [
        {
          label: "全部",
          value: "all",
        },
        {
          label: `${ctx.projKey}大前端面试宝典`,
          value: `${ctx.projKey}大前端面试宝典`,
        },
        {
          label: "《前端求职之道》",
          value: `《前端求职之道》`,
        },
        {
          label: "《大前端全栈实践》",
          value: `《大前端全栈实践》`,
        },
      ]);
    }
    getProductList(ctx) {
      return [
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
      ];
    }
  };
};
