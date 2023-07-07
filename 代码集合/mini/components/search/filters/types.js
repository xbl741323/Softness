// components/search/filters/types.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    newIndex:{
      type: Number,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    newList: [{
      title: "全部",
      type: ''
    },
    {
      title: "知识产权",
      type: 2
    },
    {
      title: "项目申报",
      type: 1
    },
    {
      title: "工商注册",
      type: 7
    },
    {
      title: "融资上市",
      type: 9
    },
    {
      title: "法律服务",
      type: 10
    },
    {
      title: "软件开发",
      type: 11
    }
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
