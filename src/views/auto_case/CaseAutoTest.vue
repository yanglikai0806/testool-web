<template>
  <div>
    <div v-if="jsonCaseId === -1">
      <JsonEditor class="main-content" :json="json" :mode="`code`" @updateJson="updateJson"></JsonEditor>
      <div class="json-action">
        <a-button type="primary" @click="showDebugModal">调试</a-button>
        <a-button type="primary" @click="createCase">保存</a-button>
      </div>
    </div>
    <div v-else>
      <JsonEditor class="main-content" :json="json" :mode="`text`" @updateJson="updateJson"></JsonEditor>
      <div class="json-action">
        <a-button type="primary" @click="showDebugModal">调试</a-button>
        <a-button type="primary" @click="updateCase">更新</a-button>
      </div>
    </div>
    <div>
    </div>
    <a-modal
        :width=420
        title="输入设备id:"
        :visible="visible"
        ok-text="确定"
        cancel-text="取消"
        @ok="debugCase"
        @cancel="handleCancel"
    >
      <a-input v-model="deviceId"></a-input>
      <p style="margin: 3px">注:自动化测试工具开启调试任务</p>
    </a-modal>
  </div>
</template>

<script>
  import JsonEditor from "../common/JsonEditor";
  import {debugAutoCaseApi, getCaseApi, modifyCaseApi} from "@/apis/case";

  export default {
    name: "CaseAutoTest",
    components: {JsonEditor},
    props:{
      jsonCaseId:{ // 自动化用例ID
        type: Number,
        default: -1
      },
      caseContent:{ // 功能用例数据
        type: Object,
        default: null
      }
    },
    mounted() {
      console.log(this.jsonCaseId)
      this.init(this.jsonCaseId)
    },
    data(){
      return {
        newAutoCase:{
          "id": -1,
          "domain": "",
          "flag": 1, // 0 下线，1 上线， 2 待上线
          "case": {
            "owner": "",
            "case_desc": this.caseContent.desc,
            "case_tag": "",
            "step": [
            ],
            "wait_time": [
              3
            ]
          },
          "check_point": {
            "text": "检测点"
          },
          "skip_condition": {}
        },
        json: {},
        visible: false,
        deviceId:"",
        linkedCase:""
      }
    },
    methods:{
      init(caseId){
        if (caseId !== -1 ){
          this.getAutoCase(caseId)
        } else {
          this.json = this.newAutoCase
        }
      },
      updateJson(value){
        this.json = value
      },

      getAutoCase(id){
        if (id){
          getCaseApi(id).then(resp=>{
            if (resp.data.length > 0){
              let case_json = resp.data[0]
              delete case_json._id
              this.json = case_json
            } else {
              this.$message.warn(resp)
            }
          })
        } else {
          this.init(-1)
        }
      },

      createCase(){
        this.json.case.owner = this.$store.getters.username || ""
        let _data = {
          table: "test_cases",
          what:"create",
          case_data: this.json
        }
        modifyCaseApi(_data).then(resp=>{
          this.$message.info(resp.desc)
          console.log(resp.data)
        })
      },

      updateCase(){
        this.json.case.owner = this.$store.getters.username || ""
        let _data = {
          table: "test_cases",
          what:"update",
          case_data: this.json,
          find:{id: this.json.id}
        }
        modifyCaseApi(_data).then(resp=>{
          console.log(resp)
          this.$message.info(resp.desc)
          console.log(resp.data)
        })
      },

      debugCase(){
        debugAutoCaseApi(this.deviceId, [this.json]).then(resp=>{
          console.log(resp)
          this.$message.info(resp.desc)
        })
      },
      showDebugModal(){
        this.visible = true
      },
      handleCancel(){
        this.visible = false
      },
    }
  }
</script>

<style scoped>
  >>> .jsoneditor-outer {
    height: 600px;
  }
  .json-action {
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: justify;
  }

</style>