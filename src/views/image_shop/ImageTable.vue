<template>
  <div class="content-main">
    <div style="margin:5px 0; display: flex; justify-content: space-between">
      <div>
        <a-button style="margin-right: 5px" icon="plus" type="primary" @click="addPicture">
          添加图片
        </a-button>

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
      <a-modal
              title="添加图片"
              :width="540"
              :bodyStyle="{padding:`10px 10px 10px 10px`}"
              :visible="showAddPictureModal"
              ok-text="确认"
              cancel-text="取消"
              @ok="closePictureModal"
              @preview="handlePreview"
              @cancel="closePictureModal"
      >
        <a-upload-dragger
                name="file"
                :data='{tag:"attachment"}'
                :multiple="false"
                :action="uploadUrl"
                @change="handleUploadChange"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p class="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
          </p>
        </a-upload-dragger>

      </a-modal>
    </div>

  </div>
</template>

<script>
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  import {getCasesApi} from '@/apis/case'
  export default {
    name: "ImageTable",
    props:{
      dataFrom: {
        type: String,
        default: ""
      }
    },
    components: {},
    mounted() {
      this.getCasesData()
    },
    data(){
      return {
        // 数据
        id: "",
        domain:"",
        // modal
        showAddPictureModal: false,
        uploadUrl: process.env.VUE_APP_BASE_API + "/image",

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
            width: "10%",
          },
          {
            title: 'tag',
            dataIndex: "tag",
            width: "10%",
          },
          {
            title: '图片',
            dataIndex: "image",
            scopedSlots: { customRender: "image" },
          },

          {
            title: '更新时间',
            dataIndex: "update_time",
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

      addPicture(){
        this.showAddPictureModal = true
      },
      closePictureModal(){
        this.showAddPictureModal = false
      },

      handleUploadChange(info){
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          console.log(info.file.response)
        } else if (status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      },

      async handlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
          console.log(file.preview)
        }
        // this.previewImage = file.url || file.preview;
        // this.previewVisible = true;
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