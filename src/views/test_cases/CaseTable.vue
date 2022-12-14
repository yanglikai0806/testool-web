<template>
  <div class="content-main">
    <div style="margin:5px 0; display: flex; justify-content: space-between">
      <div>
        <a-button style="margin-right: 5px" icon="plus" type="primary" @click="showDrawer({})">
          新增
        </a-button>

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
      <span slot="case_step" slot-scope="text">
        <p>{{text.step}}</p>
      </span>
      <span slot="check_point" slot-scope="text">
        <p>{{text}}</p>
      </span>
      <span slot="status" slot-scope="text,record">
        <a-tag v-if="record.flag === 1" color="green"> 上线 </a-tag>
        <a-tag v-else-if="record.flag === 2" color="red"> 新增 </a-tag>
        <a-tag v-else color="gray"> 下线 </a-tag>
      </span>
      <span slot="operation" slot-scope="text,record">
        <a @click="showDrawer(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
                title="确认执行该操作吗?"
                ok-text="是"
                cancel-text="否"
                @confirm="shiftStatus(record)"
        >
      <a>{{record.flag === 1? "下线": "上线"}}</a>
      </a-popconfirm>
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
      :key="caseRecord.id"
      title="自动化用例"
      :width="480"
      :visible="drawerVisible"
      :body-style="{ paddingBottom: '80px'}"
      @close="drawerClose"
    >
      <case-auto-test :key="caseRecord.id" :json-case-id="auto_case" :case-content="caseRecord"></case-auto-test>
    </a-drawer>

  </div>
</template>

<script>
  import CaseAutoTest from "../auto_case/CaseAutoTest";
  import {getCasesApi, modifyCaseApi} from '@/apis/case'
  export default {
    name: "CaseTable",
    props:{
      dataFrom: {
        type: String,
        default: ""
      }
    },
    components: {CaseAutoTest},
    mounted() {
      this.getCasesData()
    },
    data(){
      return {
        // 数据
        id: "",
        domain:"",
        // drawer
        drawerVisible: false,
        caseRecord:{},
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
            title: '集合',
            dataIndex: "domain",
            width: "5%",
          },
          {
            title: '测试步骤',
            dataIndex: "case",
            width: "20%",
            scopedSlots: { customRender: "case_step" },
          },
          {
            title: '检查点',
            dataIndex: "check_point",
            width: "15%",
            scopedSlots: { customRender: "check_point" },
          },
          {
            title: '标签',
            dataIndex: "case.case_tag",
            width: "10%",
          },
          {
            title: '创建时间',
            dataIndex: "create_time",
            width: "10%",
          },
          {
            title: '更新时间',
            dataIndex: "update_time",
            width: "10%",
          },
          {
            title: '状态',
            dataIndex: "status",
            width: "5%",
            scopedSlots: { customRender: "status" },
          },
          {
            title: '维护人',
            dataIndex: "owner",
            key: "owner",
            width: "10%",
          },
          {
            title: '操作',
            dataIndex: "operation",
            key: "operation",
            width: "10%",
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
          this.getCasesData(0)
        } else if (value==="online"){
          this.flag = 1
          this.getCasesData(1)
        } else if (value === "update"){
          this.flag = 2
          this.getCasesData(2)
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
      async getCasesData(flag){
        if (this.dataFrom === ""){
          return
        }
        const res = await getCasesApi(flag)
        this.dataCopy = res.data
        this.dataCount = this.dataCopy.length
        this.data = this.dataCopy.slice((this.page-1)*this.limit, this.page*this.limit)
        this.total = this.dataCopy.length
      },

      shiftStatus(record){
        record.flag = Math.abs(1 - record.flag)
        let _data = {
          table: "test_cases",
          what:"update",
          case_data: record,
          find:{id: record.id}
        }
        modifyCaseApi(_data).then(resp=>{
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
        console.log(record)
        if (record) {
          this.drawerVisible = true
          this.caseRecord = record
          this.auto_case = record.id
        } else {
          this.drawerVisible = true
          this.auto_case = -1
        }

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