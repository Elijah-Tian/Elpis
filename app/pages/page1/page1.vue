<template>
  <h1>page1</h1>
  <el-input v-model="content" style="width: 300" />
</template>
<script setup>
import { ref } from "vue";

const content = ref("");
</script>
<style lang="less" scoped></style>
