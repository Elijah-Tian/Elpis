<template>
  <el-input v-model="value" v-bind="schema.option" class="input"></el-input>
</template>
<script setup>
import { ref } from "vue";

const { schemaKey, schema } = defineProps({
  schemaKEy: String,
  schema: Object,
});

// const emit = defineEmits(["loaded"]);

const dtoValue = ref();
const getValue = () => {
  return dtoValue.value !== undefined
    ? {
        [schemaKey]: dtoValue.value,
      }
    : {};
};

const reset = () => {
  dtoValue.value = schema?.option?.default;
};

defineExpose({
  getValue,
  reset,
});
</script>
<style lang="less" scoped></style>
