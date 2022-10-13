<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "App",
  };
</script>

<style>
  .app{
    overflow: hidden
  }
  .dialog .ant-modal-header {
    background-color: #001529;
  }

  .dialog .ant-modal-title {
    color: white;
  }
  .ant-modal-header {
    background-color: #001529 !important;
  }
  .ant-modal-title {
    color: white !important;
    margin-left: -10px !important;
  }
  .ant-modal-close-x {
    color: white !important;
  }

  /* 整个滚动条 */
  ::-webkit-scrollbar {
    width : 5px;
    height: 8px;
  }
  /* 滚动条里面滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(168,168,168, 0.8);
  }
  /*滚动条里面轨道*/
  ::-webkit-scrollbar-track {
    border-radius: 6px;
    /*box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.2);*/
    /*background: #eee;*/
  }
</style>
