// components/search/profession/profession.js
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
    professionData: [
      {type: 0, title: '全部'},  
      {type: 1, title: '项目申报'},
      {type: 2, title: '知识产权'},
      {type: 7, title: '工商注册'},
      {type: 8, title: '财税服务'},
      {type: 9, title: '融资上市'},
      {type: 10, title: '法律服务'},
      {type: 11, title: '软件开发'},
  ]
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
