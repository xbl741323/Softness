import { getLocation } from "@/api/home";
import { getUserInfo } from "@/api/login"
import * as CodeMsg from "@/api/CodeMsg"

export const strict = false;
let defaultCity = '全国'
let defaultNo = 100000

export const state = () => ({
  locales: ['en', 'cn'],
  locale: 'cn',
  city: defaultCity,
  areaNo: defaultNo,
  userInfo: {},
  authDialog: false,
  Set_LocationNo:''// areaNo
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    }
  },
  changeCity(state, city) {
    state.city = city
  },
  changeNo(state, areaNo) {
    state.areaNo = areaNo
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  Set_LocationNo(state, Set_LocationNo) {
    state.Set_LocationNo = Set_LocationNo;
},
}

export const actions = {
  getUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
          getUserInfo().then(response => {
              resolve(response)
          }).catch(error => {
              reject(error)
          })
      })
  },
} 

export const getters = {
  userInfo(state) {
    return state.userInfo
  }
}