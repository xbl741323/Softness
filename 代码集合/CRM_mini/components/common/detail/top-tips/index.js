// components/common/detail/top-tips/index.js
var handles = require('../../../../utils/common/handles')
Component({
  /**
   * 组件的属性列表
   */
  options:{
    multipleSlots: true
  },

  properties: {
    processData: {
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
    copyText(e){
      handles.copyTap(e.currentTarget.dataset.no)
    },
  },
  lifetimes:{
    attached(){
      console.log(this.data.processNo,'000');
    }
  }
})
