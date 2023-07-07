// components/search/charge/charge.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    newIndex:{
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    chargeList:[{
      title:'全部',
      type: 0
    },{
      title:'完全免费',
      type: 1
    },{
      title:'VIP免费',
      type: 2
    },{
      title:'单独收费',
      type: 3
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeNew(e){
      let index = e.currentTarget.dataset.type;
      this.setData({
        newIndex: index,
      });
      this.triggerEvent('childChange',e.currentTarget.dataset.type) 
    }
  }
})
