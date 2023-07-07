// pages/me/me.js
const app = getApp();
const getPolicyAreaOptions = require('../../../utils/api.js').getPolicyAreaOptions;
Component({
  // externalClasses: ['no-radius','banner-item','text','dialog'], // 暴露需要重写的样式
  data: {
    isShow: false,
    departList: [{
      id: "noDepart",
      name: "全部"
    }],
    orderList: [{
      id: null,
      name: "默认"
    }, {
      id: "lastest",
      name: "最新"
    }, {
      id: "hottest",
      name: "最热"
    }],
    areaList: [{
      id: "noArea",
      name: "全部"
    }],
    isShowCity: [],
    showList: [],
    areaName: '',
    areaNo: '',
    cityChoosed: ""
  },
  properties: {
    isShow: {
      type: Boolean, //格式有Object、Array、String等
      value: ''
    },
    bannerList: {
      type: Array,
      value: []
    },
    isGlobal: {
      type: Boolean,
      value: '',
    },
    optionId: {
      type: String,
      value: ''
    },
    cityChoosed: {
      type: String,
      value: ""
    },
  },
  lifetimes: {
    ready: function () {
      var that = this;
      getPolicyAreaOptions({
        type: 4
      }).then(res => {
        if (res.code == 0) {
          let areaList = [];
          let departList = [];
          res.data.selection[0].options.forEach(item => {
            departList.push({
              type: 2,
              id: item.id,
              name: item.name
            });
            if (this.data.optionId == item.id) {
              let bannerList = that.data.bannerList;
              bannerList[1] = {
                type: 2,
                id: item.id,
                name: item.name
              };
              this.setData({
                bannerList: bannerList
              })
            }
          })
          that.setData({
            departList: that.data.departList.concat(departList)
          })
          for (let i = 0; i < res.data.area.length; i++) {
            let item = res.data.area[i];
            if (item.value == "100000") { //国家级，不渲染children下拉框
              areaList.push({
                id: item.value,
                name: item.label
              })
            } else { //省  
              let allCode = [item.children[0].value, item.children[1].value, item.value].join(',') //各省底下的"全部"传值：国家级、省级、省
              areaList.push({
                id: item.value,
                name: item.label,
                children: [{
                  value: allCode,
                  label: "全部"
                }].concat(item.children)
              })
            }
          }
          that.setData({
            areaList: that.data.areaList.concat(areaList) //地区筛选列表拼接，看不懂不要骂，打印出来就明了
          })
          console.log(that.data.areaList, "areaList")
        }
      })
    },
  },
  methods: {
    // 二级切换
    getProjectList(e) {
      console.log(e.currentTarget.dataset.type, "e.currentTarget.dataset.type")
      let bannerList = this.data.bannerList
      if (e.currentTarget.dataset.type.children) { //点击“省”
        if (this.data.cityChoosed == e.currentTarget.dataset.type.id) {
          this.setData({
            cityChoosed: '',
          })
        } else {
          this.setData({
            cityChoosed: e.currentTarget.dataset.type.id,
          })
        }
      } else {
        if (this.data.showList == this.data.areaList) {
          //一级存的是id,name 
          if (e.currentTarget.dataset.type.value) { //二级（含children)，存的是value     
            bannerList[0] = {
              type: 1, //type区分是哪个导航变化
              id: e.currentTarget.dataset.type.value,
              name: e.currentTarget.dataset.type.label
            }
            this.setData({
              cityChoosed: e.currentTarget.dataset.type.value,
            })
            this.triggerEvent('cityChange', e.currentTarget.dataset.type.value);
          } else {
            bannerList[0] = {
              type: 1, //type区分是哪个导航变化
              id: e.currentTarget.dataset.type.id,
              name: e.currentTarget.dataset.type.name
            }
            this.setData({
              cityChoosed: e.currentTarget.dataset.type.id,
            })

            this.triggerEvent('cityChange', e.currentTarget.dataset.type.id);
          }
        } else if (this.data.showList == this.data.departList) {
          if (e.currentTarget.dataset.type.id == "noDepart") {
            bannerList[1] = {
              type: 2,
              id: e.currentTarget.dataset.type.id,
              name: "归口"
            };
          } else {
            bannerList[1] = {
              type: 2,
              id: e.currentTarget.dataset.type.id,
              name: e.currentTarget.dataset.type.name
            };
          }
          this.setData({
            optionId: e.currentTarget.dataset.type.id
          })
        } else {
          bannerList[2] = {
            type: 3,
            id: e.currentTarget.dataset.type.id,
            name: e.currentTarget.dataset.type.name
          }
        }
        this.setData({
          bannerList: bannerList,
          isShow: false,
        })
      }
      console.log(this.data.cityChoosed, "cityChoosed222")
      console.log(this.data.bannerList[0].id, "cityChoosed33")
      this.triggerEvent("numChange", this.data.isShow);
      this.triggerEvent("bannerChange", this.data.bannerList);
    },
    // banner下拉框选项切换
    checked(e) {
      if (this.data.choosedBanner == e.currentTarget.dataset.type.type) {
        this.setData({
          isShow: !this.data.isShow,
          choosedBanner: e.currentTarget.dataset.type.type
        })
      } else {
        this.setData({
          isShow: true,
          choosedBanner: e.currentTarget.dataset.type.type
        })
        switch (e.currentTarget.dataset.type.type) {
          case 1:
            this.setData({
              showList: this.data.areaList,
            });
            break;
          case 2:
            this.setData({
              showList: this.data.departList,
            });
            break;
          case 3:
            this.setData({
              showList: this.data.orderList,
            });
            break;
        }
      }
      this.triggerEvent("numChange", this.data.isShow);
    },
  }
})