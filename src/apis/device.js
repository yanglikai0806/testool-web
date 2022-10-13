import { axiosGet, axiosPost} from './http'
// import store from '@/store'


export function getDeviceApi(){
    return axiosGet('/devices')
}

export function getDevicesApi(flag){
    if (flag === undefined) {
        flag=1;
    }
    return axiosGet('/devices')
}

export function modifyDeviceApi(_data){
    return axiosPost('/devices', _data)
}

