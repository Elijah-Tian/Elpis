<template>
  <el-sub-menu :index="menuItemEmits.key">
    <template #title>{{ menuItem.name }}</template>
    <div :key="ItemStyleMixin.key" v-for="item in menuItem.subMenu">
      <SubMenu v-if="item.subMenu && item.subMenu.length > 0"></SubMenu>
      <el-menu-item v-else :index="item.key">{{ item.name }}</el-menu-item>
    </div>
  </el-sub-menu>
</template>
<script setup>
// defineOptions({
//   name: "SubMenu",
// });
const { menuItem } = defineProps(["menuItem"]);
</script>
<style lang="less" scoped></style>
