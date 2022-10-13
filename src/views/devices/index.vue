<template>
  <div class="body-content">
    <device-table :data-from="`test_cases`"></device-table>
  </div>
</template>

<script>
import DeviceTable from "./DeviceTable";
export default {
  components: {
    DeviceTable,
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



