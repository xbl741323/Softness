// components/search/filters/most.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    newIndex:{
      type: String,
      value: 'latest'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    mostList:[{
      title:'最新',
      type: 'latest'
    },{
      title:'最热',
      type: 'hottest'
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
