// personal/components/my-order/selector/selector.js
// pages/components/selector/selector.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectShow: false,
    index: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击下拉显示框
    selectTap() {
      this.setData({
        selectShow: !this.data.selectShow
      });
    },
    removerName() {
      this.setData({
        nameUser: null
      })
    },
    // 点击下拉列表
    optionTap(e) {
      let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
      this.setData({
        selectShow: !this.data.selectShow,
        index: Index,
        nameUser: this.data.listData[Index].name
      });
      this.triggerEvent('optionTap', this.data.listData[Index])

    },
  }
})