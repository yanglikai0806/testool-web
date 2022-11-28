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
      <span slot="case_count" slot-scope="text">
        <a-tag color="blue">{{text.length}}</a-tag>
      </span>
      <span slot="check_point" slot-scope="text">
        <p>{{text}}</p>
      </span>
      <span slot="status" slot-scope="text,record">
        <a-tag v-if="record.task_status === 0" color="green"> 空闲 </a-tag>
        <a-tag v-else-if="record.task_status === 1" color="yellow"> 执行中 </a-tag>
        <a-tag v-else-if="record.task_status === 2" color="red"> 完成 </a-tag>
        <a-tag v-else-if="record.task_status === 3" color="pink"> 更新 </a-tag>
        <a-tag v-else color="gray"> 下线 </a-tag>
      </span>
      <span slot="operation" slot-scope="text,record">
        <a @click="showDrawer(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="startTask(record)" >{{record.task_status === 1?'停止':'启动'}}</a>
        <a-divider type="vertical" />
        <a-popconfirm
                title="确认执行该操作吗?"
                ok-text="是"
                cancel-text="否"
                @confirm="deleteTask(record)"
        >
      <a>删除</a>
      </a-popconfirm>
      <a-divider type="vertical" />
      <a :href="`${baseUrl}/task_plan?task_id=${record.id}`" target="_blank">报告</a>

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
      :key="task_param.id||-1"
      title="编辑测试任务"
      :width="600"
      :visible="drawerVisible"
      :body-style="{ paddingBottom: '80px'}"
      @close="drawerClose"
    >
      <task-create :record="task_param" @updateTaskList="getTaskList"></task-create>
    </a-drawer>

  </div>
</template>

<script>
  import {modifyTaskApi, getTaskDataApi} from '@/apis/task'
  import TaskCreate from "./TaskCreate";
  export default {
    name: "TaskTable",
    props:{
      dataFrom: {
        type: String,
        default: ""
      }
    },
    components: {TaskCreate},
    mounted() {
      this.getTaskList()
    },
    data(){
      return {
        baseUrl:process.env.VUE_APP_BASE_API,
        // drawer
        drawerVisible: false,
        task_param:{},
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
            title: '应用',
            dataIndex: "apk",
            width: "10%",
          },
          {
            title: '用例数量',
            dataIndex: "case_list",
            width: "10%",
            scopedSlots: { customRender: "case_count" },
          },
          {
            title: '执行模式',
            dataIndex: "task_mode",
            width: "10%",
            scopedSlots: { customRender: "task_mode" },
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
            dataIndex: "task_owner",
            key: "task_owner",
            width: "10%",
          },
          {
            title: '描述',
            dataIndex: "task_note",
            key: "task_note",
          },
          {
            title: '操作',
            dataIndex: "operation",
            key: "operation",
            width: "15%",
            scopedSlots: { customRender: "operation" },
          }

        ],
        data:[],
        dataCopy:[], //用于搜索时暂存数据
        dataCount:0,
        //操作
      }
    },
    methods:{
      // 状态选择
      handleChange(value){
        console.log(value)
        if (value === "offline"){
          this.flag = 0
          this.getTaskList(0)
        } else if (value==="online"){
          this.flag = 1
          this.getTaskList(1)
        } else if (value === "update"){
          this.flag = 2
          this.getTaskList(2)
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
      async getTaskList(){
        const res = await getTaskDataApi({query:"task_list"});
        console.log(res)
        this.dataCopy = res.data.task_list || [];
        this.dataCount = this.dataCopy.length;
        this.data = this.dataCopy.slice((this.page-1)*this.limit, this.page*this.limit);
        this.total = this.dataCopy.length
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
        this.drawerVisible = true
        this.task_param = record

      },
      drawerClose(){
        this.drawerVisible = false
      },
      // 操作
      // 启动任务
      startTask(record){
        let data = {task_id: record.id, case_list: record.case_list, task_status: 1}
        if (record.task_status === 1) {
          data = {task_id: record.id, case_list: record.case_list, task_status: 2}
        }
        modifyTaskApi({data}).then(res=>{
          console.log(res)
          this.getTaskList()
        })

      },

      deleteTask(record){
        let data = {task_id: record.id, task_status: -1};
        modifyTaskApi({data}).then(res=>{
          console.log(res)
          this.getTaskList()
        })
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