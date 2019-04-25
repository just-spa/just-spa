<template>
  <label>
    每页显示
    <select class="form-control input-sm inline-select" v-model="limit$">
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="40">40</option>
      <option value="80">80</option>
      <option value="100">100</option>
    </select>
    条
  </label>
</template>
<script>
import autoSyncWithQuery from "@/mixins/autoSyncWithQuery";
import { change, asyncChange, promiseChange } from "./events";
/**
 * 每页显示多少条的选择框
 */
export default {
  mixins: [autoSyncWithQuery],
  data: () => ({ limit$: 5 }),
  ready() {
    this.autoSyncWithQuery();
  },
  methods: {
    change() {
      change.call(this);
    },
    asyncChange() {
      asyncChange.call(this);
    },
    promiseChange() {
      promiseChange.call(this);
    }
  }
};
</script>
<style>
.inline-select {
  display: inline-block;
  width: 45%;
}
</style>
