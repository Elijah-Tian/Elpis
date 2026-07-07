<template>
  <el-row class="schema-view">
    <search-panel></search-panel>
    <table-panel></table-panel>
  </el-row>
</template>
<script setup>
import { provide } from "vue";
import SearchPanel from "./comlex-view/search-panel/search-panel.vue";
import TablePanel from "./comlex-view/table-panel/tabel-panel.vue";
import { useSchema } from "./hook/schema.js";

const { api, tableSchema, tableConfig, searchConfig, searchSchema } =
  useSchema();

provide("schemaViewData", {
  api,
  tableSchema,
  tableConfig,
  searchConfig,
  searchSchema,
});
</script>
<style lang="less" scoped>
.schema-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
