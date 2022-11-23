<template>
    <a-form :form="form" layout="vertical" hide-required-mark>
        <a-row :gutter="16">
            <a-col :span="12">
                <a-form-item label="选择应用">
                    <a-select
                        @select="handleAppSelect"
                    >
                        <a-select-option v-for="(val,key,i) in apks" :key="i" :value="val">
                            {{key + "(" + val + ")"}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="执行模式">
                    <a-select>
                        <a-select-option v-for="(val,i) in taskModes" :key="i" :value="val">
                            {{val}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="24">
                <a-form-item label="选择集合">
                    <a-select mode="tags" style="width: 100%" placeholder="Tags Mode" @change="handleTestDomainSelected">
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
                <br />
                <a-row v-for="(val,key) in options" :key="key">
<!--                    <div :style="{ borderBottom: '1px solid #E9E9E9' }">-->
<!--                        <a-checkbox :checked="checkDomain" :key="key" @change="onCheckDomainChange">-->
<!--                            {{key}}-->
<!--                        </a-checkbox>-->
<!--                    </div>-->
                    <br />
                    <a-checkbox-group v-model="checkedMap[key]" :options="options[key]" @change="onChange"/>
                </a-row>
            </a-form-item>
        </a-row>
        <a-row :gutter="16">
            <a-col :span="12">
                <a-form-item label="Approver">
                    <a-select
                            v-decorator="[
              'approver',
              {
                rules: [{ required: true, message: 'Please choose the approver' }],
              },
            ]"
                            placeholder="Please choose the approver"
                    >
                        <a-select-option value="jack">
                            Jack Ma
                        </a-select-option>
                        <a-select-option value="tom">
                            Tom Liu
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="DateTime">
                    <a-date-picker
                            v-decorator="[
              'dateTime',
              {
                rules: [{ required: true, message: 'Please choose the dateTime' }],
              },
            ]"
                            style="width: 100%"
                            :get-popup-container="trigger => trigger.parentNode"
                    />
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter="16">
            <a-col :span="24">
                <a-form-item label="Description">
                    <a-textarea
                            v-decorator="[
              'description',
              {
                rules: [{ required: true, message: 'Please enter url description' }],
              },
            ]"
                            :rows="4"
                            placeholder="please enter url description"
                    />
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
</template>

<script>
    import {getTaskDataApi} from '@/apis/task'
    export default {
        name: "TaskCreate",
        // props:{
        //   apks:{
        //       type: Object,
        //       default: ()=>{
        //           return {}
        //       }
        //   },
        //   domains:{
        //       type: Object,
        //       default: ()=>{
        //           return {}
        //         }
        // }
        // },
        mounted(){
          this.getTaskData({query: "apk_map"})
        },
        data(){
            return {
                form: this.$form.createForm(this),
                apks:{},
                domains:[],
                caseMap:{},
                selectedApk:"",
                selectedDomain:[],
                selectedTaskMode:"",
                taskModes:["全量", "分布"],
                // 复选框
                checkedList: [],
                checkedMap: {},
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
            // 选择需要测试的用例集合
            handleTestDomainSelected(value){
                this.selectedDomain = value;
                console.log(this.selectedDomain);
                for (let item of value){
                    this.options[item] = this.caseMap[item].map((val) => {
                        return val + ""
                    })

                }
                console.log("-----------",this.options)


            },
            onChange(checkedValue) {
                let allCheckedList = [];
                for (let k in this.options){
                    allCheckedList.push(...this.options[k])
                }
                this.indeterminate = !!checkedValue.length && checkedValue.length < allCheckedList.length;
                this.checkAll = checkedValue.length === allCheckedList.length;
            },
            onCheckAllChange(e) {
                // let allCheckedList = [];
                // for (let k in this.options){
                //     allCheckedList.push(...this.options[k])
                // }

                Object.assign(this, {
                    checkedMap: e.target.checked ? this.options : [],
                    indeterminate: false,
                    checkAll: e.target.checked,
                });
                console.log(this.checkedMap)
            },
            onCheckDomainChange(e) {
                console.log(e)
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
                    console.log(res.data);
                    this.domains = res.data.case_domain_map[this.selectedApk];
                    this.caseMap = res.data.case_id_map
                })
            }
        }
    }
</script>

<style scoped>

</style>