// components/common/query-emp/query-emp.js
import {
  getEmpOption
} from "../../../utils/api/category"
import * as CodeMsg from "../../../utils/common/codeMsg";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "选择员工"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    empInfo: {},
    value: [0],
    keyWord: "",
    show: true,
    empList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 改变搜索关键词
    changeSearch(e) {
      this.setData({
        keyWord: e.detail.value.trim()
      })
      this.getEmpList()
    },
    // 根据姓名获取员工
    getEmpList() {
      let params = {
        name: this.data.keyWord
      }
      getEmpOption(params).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          this.setData({
            empList: res.data
          })
        }
      })
    },
    // 显示选择器
    show() {
      this.setData({
        show: false,
        keyWord: ""
      })
      this.getEmpList()
    },
    // 关闭选择框
    close() {
      this.setData({
        show: true,
        keyWord: ""
      })
    },
    // 选择员工后关闭选择框
    confirm() {
      this.setData({
        show: true
      })
      let empList = this.data.empList
      let index = this.data.value[0]
      if (empList.length > 0) {
        this.setData({
          empInfo: empList[index]
        })
        this.triggerEvent('selectEmp', this.data.empInfo)
      }
    },
    // 滚动切换员工
    changePicker(e) {
      console.log(e, "输出员工信息")
      this.setData({
        value: e.detail.value
      })
    },
  },
})