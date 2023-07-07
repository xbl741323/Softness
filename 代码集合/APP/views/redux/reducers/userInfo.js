import { createSlice } from '@reduxjs/toolkit'
import { getUserInfo, getMyAccountAndVipInfo, logOut } from '../../api/user'
import Storage from '../../utils/common/storage'
import * as CodeMsg from "../../utils/common/codeMsg";

export const counterSlice = createSlice({
  name: 'userInfo',
  initialState: {
    value: null,
  },
  reducers: {
    // 获取用户信息
    getAccountInfo: (state, val) => {
      let token = val.payload
      saveToken(token)
      getUserInfo().then(res => {
        if (res.code == CodeMsg.CODE_0) {
          saveUserInfo(res.data)
          saveLoginStatus()
          getVipInfo()
        }
      })
    },
    // 更新用户课堂vip信息
    refreshVipInfo: () => {
      getMyAccountAndVipInfo().then(res => {
        if (res.code == CodeMsg.CODE_0 && res.data.vipInfo) {
          saveVipInfo(res.data.vipInfo)
        }
      })
    },
    // 清除用户信息（10002问题需要后端解决）
    clearAccountInfo: () => {
      Storage.clear()
      logOut().then(res => {
        if (res.code == CodeMsg.CODE_0) {
          console.log('清除了')
        }
      })
    },
  },
})

// 获取用户课堂vip信息
const getVipInfo = () => {
  getMyAccountAndVipInfo().then(res => {
    if (res.code == CodeMsg.CODE_0 && res.data.vipInfo) {
      saveVipInfo(res.data.vipInfo)
    }
  })
}

// 存储用户信息
const saveUserInfo = async (data) => {
  try {
    await Storage.setItem('userInfo', data)
  } catch (e) {
    // saving error
  }
}

// 存储用户vip信息
const saveVipInfo = async (data) => {
  try {
    await Storage.setItem('vipInfo', data)
  } catch (e) {
    // saving error
  }
}

// 存储登录状态
const saveLoginStatus = async () => {
  try {
    await Storage.setItem('isLogin', true)
  } catch (e) {
    // saving error
  }
}

// 存储登录token
const saveToken = async (data) => {
  try {
    await Storage.setItem('token', data)
  } catch (e) {
    // saving error
  }
}

// 移除用户信息
const removeUserInfo = async () => {
  try {
    await Storage.removeItem('userInfo')
  } catch (e) {
    // saving error
  }
}

// 移除登录状态
const removeLoginStatus = async () => {
  try {
    await Storage.removeItem('isLogin')
  } catch (e) {
    // saving error
  }
}

// 移除登录token
const removeToken = async () => {
  try {
    await Storage.removeItem('token')
  } catch (e) {
    // saving error
  }
}

export const { getAccountInfo, refreshVipInfo, clearAccountInfo } = counterSlice.actions

export default counterSlice.reducer