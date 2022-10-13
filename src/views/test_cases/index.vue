<template>
  <div class="body-content">
    <case-table :data-from="`test_cases`"></case-table>
  </div>
</template>

<script>
import CaseTable from "./CaseTable";
export default {
  components: {
    CaseTable,
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



