// components/search/type/type.js
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
    typeList:[{
      title:'全部',
      type: 0
    },{
      title:'版权',
      type: 4
    },{
      title:'商标',
      type: 5
    },{
      title:'专利',
      type: 3
    },{
      title:'其他',
      type: 6
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeNew(e){
      let item = e.currentTarget.dataset.type;
      this.setData({
        newIndex: item,
      });
      this.triggerEvent('childChange', item) 
    }
  }
})
