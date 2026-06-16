module.exports = (app) => {
  return class ViewController {
    /**
     * 渲染页面
     * @pram {object} ctx 上下文
     */
    async renderPage(ctx) {
      await ctx.render(`dist/entry.${ctx.params.page}`);
    }
  };
};
