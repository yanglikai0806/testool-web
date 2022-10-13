<template>
  <div class="content-main">
    <div style="margin:5px 0; display: flex; justify-content: space-between">
      <div>
        <a-select default-value="online" style="width: 100px" @change="handleChange">
          <a-select-option value="online">
            上线
          </a-select-option>
          <a-select-option value="offline">
            下线
          </a-select-option>
        </a-select>

        <a-select default-value="online" style="width: 100px" @change="handleChange">
          <a-select-option value="online">
            上线
          </a-select-option>
          <a-select-option value="offline">
            下线
          </a-select-option>
        </a-select>

      </div>
      <a-input-search placeholder="输入搜索内容" enter-button @search="onSearch" style="width:360px"/>
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :rowKey="record=>record.id"
      >
      <span slot="idle" slot-scope="text">
        <a-tag>{{status[text]}}</a-tag>
      </span>

      <span slot="operation" slot-scope="text,record">
        <a @click="showDrawer(record)">查看</a>
        <a-divider type="vertical" />
        <a @click="showDrawer(record)">任务</a>
        <a-divider type="vertical" />
        <a @click="showDrawer(record)">独占</a>
      </span>

      </a-table>
      <a-pagination
              style="text-align: right; margin-top: 20px"
              :page-size-options="pageSizeOptions"
              :total="total"
              :show-total="(total) => `Total ${total} items`"
              :page-size="limit"
              :default-current="1"
              @change="onChange"
              @showSizeChange="onShowSizeChange"
              show-size-changer
              show-quick-jumper
      >
        <template slot="buildOptionText" slot-scope="props">
          <span>{{ props.value }}条/页</span>
        </template>
      </a-pagination>
    </div>
    <div>
    </div>
    <a-drawer
      :key="theRecord.id"
      :title="'ID: ' + theRecord.device_id +' | IP: ' + theRecord.device_ip"
      width="90%"
      height="100%"
      :visible="drawerVisible"
      :body-style="{ paddingBottom: '80px', height:'100%'}"
      @close="drawerClose"
    >
      <iframe-page :url="`${baseUrl}/device_remote?ip=${theRecord.device_ip}&device_id=${theRecord.device_id}`"></iframe-page>
    </a-drawer>

  </div>
</template>

<script>
  import {getDevicesApi, modifyDeviceApi} from '@/apis/device'
  import IframePage from "../iframe_page/IframePage";
  export default {
    name: "DeviceTable",
    props:{
      dataFrom: {
        type: String,
        default: ""
      }
    },
    components: {IframePage},
    mounted() {
      this.getData()
    },
    data(){
      return {
        baseUrl:process.env.VUE_APP_BASE_API,
        // 数据
        id: "",
        status:{"-2": "异常", "-1": "离线", "0": "占用", "1": "空闲", "2": "在线"},
        // drawer
        drawerVisible: false,
        theRecord:{},
        auto_case:"",
        // 分页控件参数
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        page: 1,
        limit: 10,
        total: 0,
        // table
        columns: [
          {
            title: 'ID',
            dataIndex: "id",
            width: "5%",
          },
          {
            title: '类型',
            dataIndex: "device_type",
            width: "10%",
          },
          {
            title: '设备ID',
            dataIndex: "device_id",
            width: "10%",
          },
          {
            title: '设备IP',
            dataIndex: "device_ip",
            width: "10%",
          },
          {
            title: '设备信息',
            dataIndex: "device_info",
            width: "30%",
          },
          {
            title: '状态',
            dataIndex: "idle",
            width: "5%",
            scopedSlots: { customRender: "idle" },
          },
          {
            title: '维护人',
            dataIndex: "owner",
            key: "owner",
            width: "8%",
          },
          {
            title: '操作',
            dataIndex: "operation",
            key: "operation",
            width: "12%",
            scopedSlots: { customRender: "operation" },
          }

        ],
        data:[],
        dataCopy:[], //用于搜索时暂存数据
        dataCount:0,
      }
    },
    methods:{
      // 状态选择
      handleChange(value){
        console.log(value)
        if (value === "offline"){
          this.flag = 0
          this.getData(0)
        } else if (value==="online"){
          this.flag = 1
          this.getData(1)
        } else if (value === "update"){
          this.flag = 2
          this.getData(2)
        }
      },

    // search
    onSearch(value){
      if (value.length > 0){
        this.data = this.dataCopy.filter(item=>{
          return (JSON.stringify(item).includes(value))
        })
      } else {
        if (this.dataCopy.length > 0){
          this.data = this.dataCopy.slice((this.page-1)*this.limit, this.page*this.limit)
        }
      }

    },
    // table
      async getData(){
        if (this.dataFrom === ""){
          return
        }
        const res = await getDevicesApi()
        console.log(res)
        this.dataCopy = res.data
        this.dataCount = this.dataCopy.length
        this.data = this.dataCopy.slice((this.page-1)*this.limit, this.page*this.limit)
        this.total = this.dataCopy.length
      },

      shiftStatus(record){
        record.idle = -1
        let _data = {
          table: "test_cases",
          what:"update",
          case_data: record,
          find:{device_id: record.device_id}
        }
        modifyDeviceApi(_data).then(resp=>{
          console.log(resp)
          this.$message.info(resp.desc)
          console.log(resp.data)
        })

      },
      // 分页逻辑
      onChange(page, pageSize){
        this.page = page
        this.limit = pageSize
        this.data = this.dataCopy.slice((this.page-1)*this.limit, this.page*this.limit)
      },

      onShowSizeChange(current, pageSize) {
        this.page = current
        this.limit = pageSize
        this.data = this.dataCopy.slice((this.page-1)*this.limit, this.page*this.limit)
      },

      // drawer
      showDrawer(record){
        this.drawerVisible = true
        this.theRecord = record
        console.log(record)
      },

      drawerClose(){
        this.drawerVisible = false
      },
    }
  }
</script>

<style scoped>
  .content-main {
    background-color: white;
    padding: 0 15px 10px 15px;
    height: 100%;
  }

</style>