import input from "./compelx-view/input/input.vue";
import select from "./compelx-view/select/select.vue";
import dynamicSelect from "./compelx-view/dynamic-select/dynamic-select.vue";
import dateRange from "./compelx-view/date-range/date-range.vue";

const SearchItemConfig = {
  input: {
    component: input,
  },
  select: {
    component: select,
  },
  dynamicSelect: {
    component: dynamicSelect,
  },
  dateRange: {
    component: dateRange,
  },
};

export default SearchItemConfig;
