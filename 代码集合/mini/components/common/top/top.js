// components/common/top.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,  //采用全局样式
  },
  properties: {
    showTop:{
      type: Boolean,
      value: false
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
    toTop(){
      app.toTop()
    },
  },  
})
