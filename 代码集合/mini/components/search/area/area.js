// components/search/area/area.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    newIndex:{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    areaList: [],
    province: wx.getStorageSync('province'),
    provinceId: wx.getStorageSync('provinceId')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeProvince(){
     let obj = {
       name: wx.getStorageSync('province'),
       level: 2,
       no: wx.getStorageSync('provinceId')
     }
     this.newIndex = wx.getStorageSync('provinceId')
     console.log(obj,'78778')
     this.triggerEvent('childChange', obj)
    },
    changeNew(e){
      let item = e.currentTarget.dataset.type;
      this.setData({
        newIndex: item.no,
      });
      this.triggerEvent('childChange', item) 
    }
  },
  lifetimes:{
    attached(){
      if(wx.getStorageSync('district')){
        this.setData({
          province: wx.getStorageSync('province')
        })
        let data = wx.getStorageSync('district')
        let arr = []
        let provinceId = wx.getStorageSync('provinceId')
        data.forEach(item => {
          if(item.children.length>0){
            item.children.map(item => {
              if(item.no == provinceId){
                arr = item.children
              }
            })
          }
        })
        this.setData({
          areaList: arr
        })
      }
    }
  }
})
