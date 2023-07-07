// components/product/areaItem/areaItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    areaDialog: {
      type: Boolean,
      value: false
    },
    region: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    city: '', //市
    cityId: '', //市
    county: '', //区县
    countyId: '', //区县
    pIndex: 0,//市
    cIndex: 0,//区县
    value: [0,0]

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDialog(){
      this.setData({
        areaDialog: false
      })
      this.triggerEvent('getCityName', '');
    },
    bindChange(e) {
      const val = e.detail.value
      console.log(val,'444444444444444')
      this.setData({
        value: val,
        pIndex: val[0],
        cIndex: val[1]
      })
    },
    cancel(){
      this.triggerEvent('getCityName', '');
      this.setData({
        areaDialog: false,
        value: [0, 0],
        pIndex: 0,
        cIndex: 0
      })
    },
    submit(){
      let data = this.data.region
      let pIndex = this.data.pIndex
      let cIndex = this.data.cIndex
      if(pIndex != 0){
        this.setData({
          city: data[pIndex].name,
          cityId: data[pIndex].no,
        })
        if(cIndex != 0){
          this.setData({
            county: data[pIndex].children[cIndex].name,
            countyId: data[pIndex].children[cIndex].no,
          })
        }else{
          this.setData({
            county: '',
            countyId: ''
          })
        }
      }else{
        this.setData({
          city: '',
          cityId: ''
        })
      }
      let areaNo = ''
      let areaName = ''
      if(pIndex != 0){
        areaNo = cIndex != 0 ? this.data.cityId + ',' + this.data.countyId : this.data.cityId
        areaName =  cIndex != 0 ? this.data.city + ',' + this.data.county : this.data.city
      }else{
        areaNo = ''
        areaName = ''
      }
      this.setData({
        areaDialog: false
      })
      this.triggerEvent('getCityName', {
        areaNo: areaNo,
        areaName: areaName
      });
    }
  },
})
