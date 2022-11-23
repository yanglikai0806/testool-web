import { axiosGet, axiosPost} from './http'
// import store from '@/store'


export function getTaskApi(taskId){
    return axiosGet('/task_plan?task_id='+taskId)
}

export function getTaskDataApi(param){
    return axiosGet(`/task_plan`, param)
}

export function modifyTaskApi(_data){
    return axiosPost('/task_plan', _data)
}

