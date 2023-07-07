
import { getUserInfo } from '@/api/login'
import { getArea } from '@/api/common-service'
import { reject } from 'lodash'

export const strict = false
export const state = () => ({
    searchTxt: '',//全局搜索
    sType: null,//全局搜索类型
    locales: ['en-US', 'zh-CN'],
    locale: 'zh-CN',
    Set_LocationNo: '',//areaNo
    userInfo: {},//登录用户信息
    loading: false,//是否展示loading
    authDialog: false,//是否显示认证提示框
    phone:'',
    area:[]
})

export const mutations = {
    searchTxt(state, searchTxt) {
        state.searchTxt = searchTxt;
    },
    sType(state, sType) {
        state.sType = sType;
    },
    SET_LANG(state, locale) {
        if (state.locales.indexOf(locale) !== -1) {
            state.locale = locale;
        }
    },
    Set_LocationNo(state, Set_LocationNo) {
        state.Set_LocationNo = Set_LocationNo;
    },
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = userInfo
    },
    SET_AREA:(state, area) => {
        state.area = area
    },
}

export const actions = {
    getUserInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getUserInfo().then(response => {
                commit('SET_USERINFO', response.data.data)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    getAreaData({commit,state}){
        return new Promise((resolve,reject) => {
            getArea(4).then(res => {
                commit('SET_AREA',res.data.data.area)
                console.log(res.data.data.area,'---------');
                resolve(resolve)
            }).catch(error =>{
                reject(error)
            })
        })
    }
}

