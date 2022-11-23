<template>
  <div>
    <vue-json-editor
    :value="json"
    :mode="mode"
    lang="zh"
    @json-change="onJsonChange"
    @json-save="onJsonSave"
    @has-error="onError"/>
  </div>
</template>
<script>
    import vueJsonEditor from 'vue-json-editor'
    export default {
        props:{
            json:{
                type: [Object,Array]
            },
          mode:{
              type: String,
              default:"tree"
          }
        },
        components:{
            vueJsonEditor
        },
        data() {
            return {
              jsonTemp:this.json,
              key:0
            }
        },
        methods:{
            // json编辑框实现
            onJsonChange (value) {
                // console.log('更改value:', value);
                // 实时保存
                this.onJsonSave(value)
            },
            onJsonSave (value) {
                // console.log('保存value:', value);
                this.jsonTemp = value
                this.hasJsonFlag = true
                this.$emit("updateJson", value)
            },
            onError(value) {
                console.log("json格式错误:", value);
                this.hasJsonFlag = false
            },
            // 检查json
            checkJson() {
                if (this.hasJsonFlag === false) {
                    this.$message.warn("json格式错误")
                    return false
                } else {
                    return true
                }
            },
        }
    }
</script>


<style scoped>
    /*>>> div.jsoneditor {*/
    /*    border:0*/
    /*}*/
    /*>>> .jsoneditor-menu {*/
    /*    background-color: #001529;*/
    /*}*/
    /*>>> .jsoneditor-poweredBy {*/
    /*    display: none;*/
    /*}*/
</style>