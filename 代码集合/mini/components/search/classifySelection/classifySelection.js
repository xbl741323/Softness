// components/search/classifySelection/classifySelection.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    leftList: [{
      name: '全部',
      value: 0,
    },{
      name: '企业服务',
      value: 1,
    },{
      name: '卧涛课程',
      value: 2,
    }], // 左侧产品栏
    category:[{
      categoryName: "全部",
      id: 0,
    },{
      categoryName: "项目申报",
      id: 1,
    },{
      categoryName: "知识产权",
      id: 2,
    },{
      categoryName: "工商财税",
      id: 7,
    },{
      categoryName: "融资上市",
      id: 9,
    },{
      categoryName: "法律服务",
      id: 10,
    },{
      categoryName: "软件开发",
      id: 11,
    }],
    course:[{
      categoryName: "全部",
      id: 0,
    },{
      categoryName: "课程",
      id: 1,
    },{
      categoryName: "短视频",
      id: 2,
    }],
    newIndex: 0,
    newClickIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindChange(e) {
      this.setData({
        newIndex: e.currentTarget.dataset.index
      })
      this.triggerEvent('passval', e.currentTarget.dataset)
    },
    bindClickChange(e){
      this.setData({
        newClickIndex: e.currentTarget.dataset.index
      })
      this.triggerEvent('category', e.currentTarget.dataset)
    }
  }
})
