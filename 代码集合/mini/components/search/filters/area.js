// components/search/filters/area.js
import { switchProvincePC, selection } from "../../../utils/api/search"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    indexP:{
      type: String,
      value: ''
    },
    indexC:{
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    provinces: [],
    cityList: [],
    cityItem: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击省份筛选市级
    clickProvince(e){
      let no = e.currentTarget.dataset.area;
      this.getCity(no)
    },
    //获取城市数据
    getCity(no){
      this.setData({
        indexP: no
      })
      let list = this.data.cityList;
      let idx = list.findIndex(item=>item.value == no);
      if (idx == -1) return this.noCity(no);
      list.forEach(item=>{
        if(item.value == no) {
          this.setData({
            cityItem: item.children
          })
        }
      });
    },
    //选择城市
    clickCity(e){
      let city = e.currentTarget.dataset.city
      this.setData({
        indexC: city.value
      });
      this.triggerEvent('childChange', city) 
    },
    //省份下无数据
    noCity(data){
      let city = [
          {parentNo: data, label: "国家级", value: "100001"},
          {parentNo: data, label: "省级", value: "320001"}
      ];
      this.setData({
        cityItem:city
      })
    },
    //获取地区数据
    getAreaData(){
      switchProvincePC().then(res=>{
        this.setData({
          provinces: res.data
        })
      });
      selection(4).then(res=>{
        this.setData({
          cityList: res.data.area
        })
      });
      setTimeout(()=>{
        if(this.data.indexP !='') return this.getCity(this.data.indexP)
      },300)      
    }
  },
  lifetimes:{
    attached: function () {
      this.getAreaData()
    }
  }
})
