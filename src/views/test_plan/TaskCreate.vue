<template>
    <a-form layout="vertical" hide-required-mark>
        <a-row :gutter="16">
            <a-col :span="12">
                <a-form-item label="选择应用">
                    <a-select :default-value="selectedApk" @select="handleAppSelect">
                        <a-select-option v-for="(val,key,i) in apks" :key="i" :value="val">
                            {{key + "(" + val + ")"}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="执行模式">
                    <a-select :default-value="selectedTaskMode" @select="selectTaskMode">
                        <a-select-option v-for="(val,i) in taskModes" :key="i" :value="val">
                            {{val}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter="16">
            <a-col :span="12">
                <a-form-item label="测试环境">
                    <a-select :default-value="selectedEnv" @select="selectTestEnv">
                        <a-select-option v-for="(val,i) in envs" :key="i" :value="val">
                            {{val}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="测试负责人">
                    <a-select :default-value="selectedTester" @select="selectTestOwner">
                        <a-select-option v-for="(val,i) in testers" :key="i" :value="val">
                            {{val}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="24">
                <a-form-item label="选择集合">
                    <a-select :default-value="selectedDomain" mode="tags" style="width: 100%" placeholder="选择测试集合" @change="handleTestDomainSelected">
                        <a-select-option v-for="dm in domains" :key="dm">
                            {{ dm }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-form-item label="选择用例">
                <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                    <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
                        全选
                    </a-checkbox>
                </div>
                <a-row v-for="(val,key) in options" :key="key">
<!--                    <div :style="{ borderBottom: '1px solid #E9E9E9' }">-->
<!--                        <a-checkbox :checked="checkDomain" :key="key" @change="onCheckDomainChange">-->
<!--                            {{key}}-->
<!--                        </a-checkbox>-->
<!--                    </div>-->
                    <a-divider orientation="left">{{key + " (" + val.length + " 个)"}}</a-divider>
                    <a-checkbox-group v-model="checkedMap[key]" :options="val" @change="onChange"/>
                </a-row>
            </a-form-item>
        </a-row>
        <a-row :gutter="16">
            <a-col :span="24">
                <a-form-item label="任务描述">
                    <a-textarea
                        :rows="4"
                        placeholder="输入任务描述"
                        allow-clear
                        v-model="description"
                    />
                </a-form-item>
            </a-col>
        </a-row>
        <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
        >
            <a-button type="primary" @click="onSubmit">
                Submit
            </a-button>
        </div>
    </a-form>
</template>

<script>
    import {getTaskDataApi, modifyTaskApi} from '@/apis/task'
    export default {
        name: "TaskCreate",
        props:{
          record:{
              type: Object,
              default: ()=>{
                  return {}
              }
          }
        },
        created(){
            if (Object.keys(this.record).length > 0){
                this.task_id = this.record.id
                this.selectedApk = this.record.apk
                this.selectedDomain = Object.keys(this.record.case_map||{})
                this.selectedTaskMode = this.record.task_mode
                this.selectedEnv = this.record.task_env
                this.selectedTester = this.record.task_owner
                this.description = this.record.task_note
                this.checkedMap = this.record.case_map
                this.options = this.record.case_map
                this.getDomainsFromApk()
            }
        },
        mounted(){
          this.getTaskData({query: "apk_map"})
        },
        data(){
            return {
                task_id:-1,
                apks:{},
                envs:["pro","pre"],
                testers:["tester1"],
                domains:[],
                caseMap:{},
                taskModes:["全量", "分布"],
                //选中的数据
                selectedApk:"",
                selectedDomain:[],
                selectedTaskMode:"全量",
                selectedEnv:"",
                selectedTester:"",
                description:"",
                checkedMap: {},
                // 复选框
                checkedList: [],
                indeterminate: true,
                checkAll: false,
                checkDomain: false,
                options:{},
            }
        },
        methods:{
            handleAppSelect(value){
                console.log(`选择应用 ${value}`)
                this.selectedApk = value
                this.getDomainsFromApk()
            },

            selectTaskMode(value){
                this.selectedTaskMode = value
            },
            selectTestEnv(value){
                this.selectedEnv = value
            },
            selectTestOwner(value){
                this.selectedTester = value
            },
            // 选择需要测试的用例集合
            handleTestDomainSelected(value){
                this.selectedDomain = value;
                for (let item of value){
                    this.options[item] = this.caseMap[item].map((val) => {
                        return val + ""
                    })

                }
            },
            onChange(checkedValue) {
                let allCheckedList = [];
                for (let k in this.options){
                    allCheckedList.push(...this.options[k])
                }
                this.indeterminate = !!checkedValue.length && checkedValue.length < allCheckedList.length;
                this.checkAll = checkedValue.length === allCheckedList.length;
                console.log("----", this.checkedMap)
            },
            onCheckAllChange(e) {
                Object.assign(this, {
                    checkedMap: e.target.checked ? this.options : {},
                    indeterminate: false,
                    checkAll: e.target.checked,
                });
            },

            onCheckDomainChange(e) {
                Object.assign(this, {
                    checkedList: e.target.checked ? this.options : [],
                    indeterminate: false,
                    checkDomain: e.target.checked,
                });
            },
            async getTaskData(param){
                const res = await getTaskDataApi(param);
                this.apks = res.data.apk_map || {};
            },

            getDomainsFromApk(){
                if (!this.selectedApk){
                    this.$message.warn("请选择被测应用")
                    return
                }
                getTaskDataApi({query: "case_domain_map", apk: this.selectedApk}).then(res=>{
                    this.domains = res.data.case_domain_map[this.selectedApk];
                    this.caseMap = res.data.case_id_map
                })
            },

            onSubmit(){
                let caseList = []
                for (let key in this.checkedMap){
                    caseList.push(...this.checkedMap[key])
                }
                let data = {"apk": this.selectedApk, "case_list": caseList,"case_map": this.checkedMap, "task_mode": this.selectedTaskMode, "task_env": this.selectedEnv,
                    "task_owner": this.selectedTester, "task_note": this.description, "task_status": 0};
                if (this.task_id > 0){
                    data["task_id"] = this.task_id
                    data["task_status"] = 3 // 修改更新任务
                }
                modifyTaskApi({data}).then(res=>{
                    console.log(res)
                })

            }

        }
    }
</script>

<style scoped>

</style>