// personal/components/my-user/user-info/user-info.js
import {
  accountDisabled
} from "../../../../utils/api/user"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    registerInfo: {
      type: Object
    },
    userType: {
      type: Number
    },
    userDetailInfo: {
      type: Object
    },
    clueInfo: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  
  },

  /**
   * 组件的方法列表
   */
  methods: {
    accountDisabled(e){
      let item = e.currentTarget.dataset.item
      let params = {
        accountId: item.accountId,
        isDisabled: item.isDisabled == 0 ? 1 : 0
      }
      accountDisabled(params).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          wx.showToast({
            icon: "success",
            title: '账户状态已更改成功',
          })
          this.triggerEvent('refresh')
        } else {
          wx.showToast({
            icon: "none",
            title: res.msg,
          })
        }
      })
    }
  },
})