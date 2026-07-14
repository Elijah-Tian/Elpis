<template>
  <el-row class="schema-view">
    <search-panel
      v-if="
        searchSchema?.properties &&
        Object.keys(searchSchema.properties).length > 0
      "
      @search="onSearch"
    ></search-panel>
    <table-panel ref="tablePanelRef" @operate="onTableOperate"></table-panel>
    <component
      v-for="(item, key) in components"
      :key="key"
      :is="ComponentConfig[key]?.component"
      ref="comListRef"
      @command="onComponentCommand"
    ></component>
  </el-row>
</template>
<script setup>
import { provide, ref } from "vue";
import SearchPanel from "./comlex-view/search-panel/search-panel.vue";
import TablePanel from "./comlex-view/table-panel/tabel-panel.vue";
import { useSchema } from "./hook/schema.js";
import ComponentConfig from "./components/component-config.js";

const {
  api,
  apiParams,
  tableSchema,
  tableConfig,
  searchConfig,
  searchSchema,
  components,
} = useSchema();

provide("schemaViewData", {
  api,
  apiParams,
  tableSchema,
  tableConfig,
  searchConfig,
  searchSchema,
  components,
});

const tablePanelRef = ref(null);
const comListRef = ref([]);

const onSearch = (searchValObj) => {
  apiParams.value = searchValObj;
};

// table 事件映射
const EventHandlerMap = {
  showComponent: showComponent,
};

const onTableOperate = ({ btnConfig, rowData }) => {
  const { eventKey } = btnConfig;
  if (EventHandlerMap[eventKey]) {
    EventHandlerMap[eventKey]({ btnConfig, rowData });
  }
};

// 展示动态组件
function showComponent({ btnConfig, rowData }) {
  const { comName } = btnConfig.eventOption;
  if (!comName) {
    return;
  }

  const comRef = comListRef.value.find((item) => item.name === comName);
  if (!comRef || typeof comRef.show !== "function") {
    return;
  }

  comRef.show(rowData);
}

// 响应组件事件
const onComponentCommand = (data) => {
  const { event } = data;
  if (event === "loadTableData") {
    tablePanelRef.value.loadTableData();
  }
};
</script>
<style lang="less" scoped>
.schema-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
