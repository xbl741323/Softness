import request from '@/plugins/request'
import { method } from 'lodash'

export function returnName(){
    return request({
        url:'/announce/aaa',
        method:'GET'
    })
}