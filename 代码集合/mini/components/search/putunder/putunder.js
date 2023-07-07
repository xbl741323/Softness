// components/search/putunder/putunder.js
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
    putunderList:[{
      title:'全部',
      type: 0
    },{
      title:'科技厅',
      type: 4,
    },{
      title:'经信（工信）厅',
      type: 5,
    },{
      title:'发改委',
      type: 6,
    },{
      title:'文旅厅',
      type: 7,
    },{
      title:'林业局',
      type: 8,
    },{
      title:'农业厅',
      type: 9,
    },{
      title:'商务厅',
      type: 10,
    },{
      title:'其他',
      type: 11,
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
