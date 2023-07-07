// personal/pages/perAuthentication/operatePage/operatePage.js
const app = getApp();
import {
  checkPersonalAuth,
  getzfbUrl
} from "../../../../utils/api/authentication"
import {
  throttle
} from "../../../../utils/common/utils"
import base64 from "../../../../components/common/tools/base64"
import {
  getAreaTree,
} from "../../../../utils/api"
import {
  updatePersonAuth,
  addAuthPerson,
  againAddAuthPerson,
  essAddAuthPerson,
} from "../../../../utils/api/user"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageForm: {},
    alirzUrl: 'https://cn-shanghai-aliyun-cloudauth.oss-cn-shanghai.aliyuncs.com/web_sdk_js/jsvm_all.js',
    userInfo: {},
    fddUrl: '',
    type: "", // 认证方式 0：支付宝认证 1：阿里刷脸认证
    customArray: [],
    //当前多列选中数组的下标值
    customIndex: [0, 0, 0],
    //当前选中数组
    onlyArray: [
      [],
      [],
      []
    ],
    areaId: "",
    areaName: "",
    isAgain: false,
    optionList: [{
        title: "真实姓名",
        value: "",
        placeholder: "请填写真实姓名",
        required: true,
        validate: false,
        validateText: "请填写真实姓名",
      },
      {
        title: "身份证号",
        value: "",
        placeholder: "请填写真实的18位身份证号码",
        required: true,
        validate: false,
        validateText: "请输入正确的身份证号",
      },
      {
        title: "个人所在地",
        value: "",
        placeholder: "请选择个人所在地",
        required: true,
        validate: false,
        validateText: "请选择个人所在地",
      },
    ],
    signPhone: null,
    model: null,
  },
  // 多列自创选择器换列方法
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
  // 多列自定义选择器改变value的方法
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
    });
  },
  // 进入页面时初始化数据
  setInitialData(options) {
    this.setData({
      type: 0
    })
    wx.setNavigationBarTitle({
      title: options.type == 0 ? "支付宝个人认证" : "刷脸实名认证",
    })
  },
  // 提交认证操作
  submitOperate: throttle(function () {
    // return  this.checkPerAuth();      
    let areaId = this.data.areaId
    let nameRule = /^(?:[\u4E00-\u9FFF]{1,8}·\u4E00-\u9FFF]{1,8})|(?:[\u4E00-\u9FFF]{2,5})$/
    let cardRule = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    let phoneRule = /^1[3-9]\d{9}$/
    let optionList = this.data.optionList
    optionList.forEach((item, index) => {
      if (index < 2 && item.value.trim() == "") {
        item.validate = true
      } else if (index == 0 && !(nameRule.test(item.value))) {
        item.validate = true
      } else if (index == 1 && !(cardRule.test(item.value))) {
        item.validate = true
      } else if (index == 2 && areaId.trim() == "" && !this.data.model) {
        item.validate = true
      } else if (index == 2 && !(phoneRule.test(item.value)) && this.data.model) {
        item.validate = true
      } else {
        item.validate = false
      }
    })
    this.setData({
      optionList: optionList
    })
    if (!optionList[0].validate && !optionList[1].validate && !optionList[2].validate) {
      this.checkPerAuth();
    }
  }, 2000),
  // 修改输入值
  changeValue(e) {
    let optionList = this.data.optionList
    let index = e.currentTarget.dataset.index
    let value = e.detail.value
    optionList[index].value = value
    this.setData({
      optionList: optionList
    })
    console.log(e)
  },
  // 检查个人身份信息
  checkPerAuth() {
    if (this.data.model) return this.updateSubmit();
    // return this.toFdd()
    let optionList = this.data.optionList
    let data = {
      idCard: optionList[1].value, //optionList[1].value,
      autClient: 2,
      idCardName: optionList[0].value, //optionList[0].value,
      diyOrgAddress: this.data.areaId ? this.data.areaId : 'shiqi', //this.data.areaId
      isAgain: this.data.isAgain,
      returnUrl: 'wx://pages/redirect/redirect?root=auth'
    }
    // return console.log(this.data.isAgain);
    console.log(this.data.pageForm.from);
    let url = this.data.pageForm.from == 'old-sign' ? essAddAuthPerson : this.data.isAgain === 'true' ? againAddAuthPerson : addAuthPerson
    url(data).then(res => {
      if (res.code == 0) {
        this.setData({
          fddUrl: res.data
        })
        // 进行下一步，调用认证接口
        wx.setStorageSync('reloadUrl', res.data);
        wx.navigateTo({
          url: `/pagesFace/pages/webview/webview?root=user`
        })
        // this.toFdd()
      } else {
        wx.showToast({
          title: res.msg,
          duration: 2000,
          icon: 'none'
        })
      }
    })
  },
  toFdd() {
    // let url = 'https://realnameverify-test.fadada.com/fddAuthenticationService/v1/api/synsAuthentication.action?transaction_no=05F9E2A190456CF0909ED36CA5B33D3ABAEC8F430507AC31E8FE255AEC5E88F84093F7D8366D011E&sign=MjdCMDE2NDkyOTU4MTk1REY3MjgwMEZGRjczNUU0RDk5NTdFNkJCQw==&app_id=406287&timestamp=1656126985569';
    wx.navigateToMiniProgram({
      appId: 'wxa1439f77c6d06a15',
      path: 'pages/result-loading/result-loading?verifyUrl=' + this.data.fddUrl,
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  // 根据认证方式调用认证接口
  submitCertify() {
    let userInfo = this.data.userInfo
    let optionList = this.data.optionList
    let type = this.data.type
    if (type == 0) {
      let data = {
        personalName: optionList[1].value,
        idCard: optionList[2].value,
        authType: 0,
        authSource: 2,
        userId: userInfo.userId,
        mobilPhone: userInfo.accountNo,
        type: 0
      }
      getzfbUrl(data).then(res => {
        if (res.code == 0) {
          wx.showToast({
            icon: "success",
            title: '提交成功！',
          })
          data.certifyId = res.data.certifyId
          data.certifyUrl = res.data.certifyUrl
          data.plat = 1 // 1：支付宝 2：阿里刷脸（不支持小程序）
          wx.setStorageSync('authent-result', JSON.stringify(data))
          setTimeout(() => {
            wx.navigateTo({
              url: `/personal/pages/perAuthentication/skipPage/skipPage?skipType=${1}`,
            })
          }, 1000)
        }
      })
    }
  },
  // 获取地区筛选下拉框数据
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
  updateSubmit() {
    let optionList = this.data.optionList
    let data = {
      idCard: optionList[1].value, //optionList[1].value,
      autClient: 2,
      idCardName: optionList[0].value, //optionList[0].value,
      returnUrl: 'wx://pages/redirect/redirect?root=auth',
      mobile: optionList[2].value,
    }
    updatePersonAuth(data).then(res => {
      if (res.code == 0) {
        this.setData({
          fddUrl: res.data
        })
        // 进行下一步，调用认证接口
        wx.setStorageSync('reloadUrl', res.data);
        wx.navigateTo({
          url: `/pagesFace/pages/webview/webview?root=user`
        })
      } else {
        wx.showToast({
          title: res.msg,
          duration: 2000,
          icon: 'none'
        })
      }
    })
  },
  modelUpdateInitialize(data, Bool) {
    let store = wx.getStorageSync('userInfo');
    let optionList = this.data.optionList;
    optionList[2].title = '手机号码';
    optionList[2].placeholder = '请输入手机号码';
    optionList[2].validateText = '请输入手机号码';
    optionList[0].value = store.personName;
    optionList[1].value = store.idCardNoSensitive;
    optionList[1].disabled = true;
    optionList[2].value = store.phone;
    this.setData({
      optionList: optionList,
      model: data
    })
    if (Bool) {
      this.getArea()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
    if (options.newapprove == "newapprove") return this.modelUpdateInitialize(options.newapprove, true)
    if (options.model == "update") return this.modelUpdateInitialize(options.model)
    if (options.again == 'true') {
      this.setData({
        isAgain: true
      })
    }
    if (options.data) {
      let optionList = this.data.optionList;
      let data = JSON.parse(options.data);
      console.log(data);
      let previous = data.from == 'old-sign' ? 'userInfo' : 'launchUser';
      let store = wx.getStorageSync(previous);
      optionList[0].value = store.personName;
      optionList[0].disabled = true;
      if (data.from == 'old-sign') {
        optionList[1].value = store.idCardNoSensitive;
        optionList[1].disabled = optionList[2].disabled = true;
        // optionList[2].title = '手机号';
        // optionList[2].value = store.phone;
        // optionList[2].from = data.from
      }
      this.setData({
        optionList: optionList,
        pageForm: data
      })
    };
    this.setInitialData(options)
    this.getArea()
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