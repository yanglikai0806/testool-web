<template>
  <div class="body-content">
    <task-table :data-from="`test_cases`"></task-table>
  </div>
</template>

<script>
import TaskTable from "./TaskTable";
export default {
  components: {
    TaskTable,
  },
  data() {
    return {
    };
  },
  methods:{
    // tab 切换
    tabChange(key){
      console.log(key)
    },
  }
};
</script>

<style scoped>
  .body-content {
    background-color: white;
    padding: 3px;

  }
</style>



