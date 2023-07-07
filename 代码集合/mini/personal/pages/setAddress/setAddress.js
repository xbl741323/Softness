// personal/pages/setAddress/setAddress.js
import { getAreaTree } from "../../../utils/api"
import {
  addAddress,
  updateAddress,
  getAddressDetail
} from "../../../utils/api/address"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    pageType: "",
    id: "",
    phoneFlag: false,
    customArray: [],
    userInfo: {},
    areaId: "",
    //当前多列选中数组的下标值
    customIndex: [0, 0, 0],
    //当前选中数组
    onlyArray: [
      [],
      [],
      []
    ],
    receiver: "",
    phone: "",
    areaName: "",
    detailAddress: "",
    isDefault: false
  },
  checkPhone() {
    let phone = this.data.phone
    if (!(/^1[345789]\d{9}$/.test(phone))) {
      this.setData({
        phoneFlag: true
      })
      wx.showToast({
        icon: "none",
        title: '请输入正确的手机号',
      })
      console.log("手机号错误！")
    } else {
      console.log("手机号正确！")
      this.setData({
        phoneFlag: false
      })
    }
  },
  // 保存数据
  saveData() {
    let basic = this.data
    if (!this.data.phoneFlag) {
      if (Number(basic.receiver) == 0 || Number(basic.phone) == 0 || Number(basic.areaName) == 0 || Number(basic.detailAddress) == 0) {
        wx.showToast({
          title: '请补全信息！',
          icon: 'error',
          duration: 1000
        })
      } else {
        this.data.pageType == 1 ? this.addAddressData() : this.updateAddressData()

      }
    } else {
      wx.showToast({
        icon: "none",
        title: '请输入正确的手机号',
      })
    }
  },
  // 获取收件地址详情数据
  getData(id) {
    getAddressDetail(id).then(res => {
      if (res.code == 0) {
        let r = res.data
        this.setData({
          receiver: r.receiverName,
          phone: r.mobilePhoneNumber,
          // areaName: "地区",
          areaId: r.areaNo,
          detailAddress: r.detailAddress,
          isDefault: r.isDefault == 1 ? true : false
        })
      }
    })
  },
  // 回显赋值
  setNavTitle(type, obj) {
    wx.setNavigationBarTitle({
      title: type == 0 ? '编辑收件地址' : '添加收件地址',
    })
    this.setData({
      pageType: type
    })
    if (type == 0) {
      let info = JSON.parse(obj)
      this.setData({
        id: info.id,
        areaName: info.areaName
      })
      this.getData(info.id)
    }
  },
  receiverChange(val) {
    this.setData({
      receiver: val.detail.value
    })
  },
  phoneChange(val) {
    this.setData({
      phone: val.detail.value
    })
  },
  detailChange(val) {
    this.setData({
      detailAddress: val.detail.value
    })
  },
  switchChange(val) {
    this.setData({
      isDefault: val.detail.value
    })
  },
  //多列自创选择器换列方法
  bindCustomPickerColumnChange: function (e) {
    var customArray = this.data.customArray;
    let customIndex = this.data.customIndex;
    let onlyArray = this.data.onlyArray;
    customIndex[e.detail.column] = e.detail.value;
    var searchColumn = () => {
      for (var i = 0; i < customArray.length; i++) {
        var arr1 = [];
        var arr2 = [];
        if (i == customIndex[0]) {
          if (customArray[i].children && customArray[i].children.length > 0) {
            for (var j = 0; j < customArray[i].children.length; j++) {
              let item = customArray[i].children[j]
              arr1.push({
                id: item.id,
                name: item.areaName
              });
              if (j == customIndex[1]) {
                for (var k = 0; k < customArray[i].children[j].children.length; k++) {
                  let item = customArray[i].children[j].children[k]
                  arr2.push({
                    id: item.id,
                    name: item.areaName
                  });
                }
                onlyArray[2] = arr2;
              }
            }
          }
          onlyArray[1] = arr1;
        }
      };
    }
    switch (e.detail.column) {
      case 0:
        customIndex[1] = 0;
        customIndex[2] = 0;
        searchColumn();
        break;
      case 1:
        customIndex[2] = 0;
        searchColumn();
        break;
    }
    this.setData({
      onlyArray: onlyArray,
      customIndex: customIndex
    });
  },
  //多列自定义选择器改变value的方法
  bindCustomPickerChange: function (e) {
    let customIndex = this.data.customIndex;
    let onlyArray = this.data.onlyArray;
    let addressIdList = []
    let addressNameList = []
    onlyArray.forEach((item, index) => {
      if (item.length > 0 && item[customIndex[index]] && item[customIndex[index]].id) {
        addressIdList.push(item[customIndex[index]].id)
      }
      if (item.length > 0 && item[customIndex[index]] && item[customIndex[index]].name) {
        addressNameList.push(item[customIndex[index]].name)
      }
    })
    this.setData({
      customIndex: e.detail.value,
      areaId: addressIdList.join(','),
      areaName: addressNameList.join(''),
    })
  },
  getArea() {
    getAreaTree().then(res => {
      if (res.code == 0) {
        this.setData({
          customArray: res.data
        })
        var data = {
          customArray: this.data.customArray,
          customIndex: this.data.customIndex,
          onlyArray: this.data.onlyArray,
        };
        for (var i = 0; i < data.customArray.length; i++) {
          data.onlyArray[0].push({
            id: data.customArray[i].id,
            name: data.customArray[i].areaName
          });
        }
        for (var j = 0; j < data.customArray[data.customIndex[0]].children.length; j++) {
          let item = data.customArray[data.customIndex[0]].children[j]
          data.onlyArray[1].push({
            id: item.id,
            name: item.areaName
          });
        }
        for (var k = 0; k < data.customArray[data.customIndex[0]].children[data.customIndex[1]].children.length; k++) {
          let item = data.customArray[data.customIndex[0]].children[data.customIndex[1]].children[k];
          data.onlyArray[2].push({
            id: item.id,
            name: item.areaName
          });
        }
        this.setData({
          customArray: data.customArray,
          customIndex: data.customIndex,
          onlyArray: data.onlyArray,
        });
      }
    })
  },
  // 添加收件地址
  addAddressData() {
    let info = this.data.userInfo
    let params = {
      accountId: info.accountId,
      areaNo: this.data.areaId,
      detailAddress: this.data.detailAddress,
      receiverName: this.data.receiver,
      mobilePhoneNumber: this.data.phone,
      isDefault: this.data.isDefault == true ? 1 : 0
    }
    addAddress(params).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: '添加成功！',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }
    })
  },
  // 修改收件地址
  updateAddressData() {
    let info = this.data.userInfo
    let params = {
      id: Number(this.data.id),
      accountId: info.accountId,
      areaNo: this.data.areaId,
      detailAddress: this.data.detailAddress,
      receiverName: this.data.receiver,
      mobilePhoneNumber: this.data.phone,
      isDefault: this.data.isDefault == true ? 1 : 0
    }
    updateAddress(params).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: '修改成功！',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setNavTitle(options.type, options.info);
    this.getArea();
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})