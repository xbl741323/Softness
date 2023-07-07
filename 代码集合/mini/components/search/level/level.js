// components/search/level/level.js
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
    levelList:[{
      title:'全部',
      type: 0
    },{
      title:'国家级',
      type: 1
    },{
      title:'省级',
      type: 2
    },{
      title:'市级',
      type: 3
    },{
      title:'区级',
      type: 4
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
