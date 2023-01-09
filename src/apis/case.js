import { axiosGet, axiosPost} from './http'
// import store from '@/store'


export function getCaseApi(CaseId){
    return axiosGet('/cases?table=test_cases&id='+CaseId)
}

export function getCasesApi(flag){
    if (flag === undefined) {
        flag=1;
    }
    return axiosGet('/cases?table=test_cases&flag=' + flag)
}

export function searchCase(table, word) {
    return axiosGet(`/cases?table=${table}&word=%${word}%`)
}

export function modifyCaseApi(_data){
    return axiosPost('/cases', _data)
}

