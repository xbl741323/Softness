// personal/pages/orgAuthentication/orgAuthentication.js
const app = getApp();
import {
  getAreaTree,
  submitAuth,
  checkAuth
} from "../../../utils/api"
import {
  updateCompanyAuth,
  addAuthCompany,
  againAddAuthCompany,
  addCompanyAuthorizer,
  essAddAuthCompany,
  getMyAccountAndVipInfo
} from "../../../utils/api/user"
Page({
  data: {
    userObj: {},
    typeState: null,
    userInfo: {},
    errorType: {
      orgName: false,
      creditCode: false,
      area: false,
      phone: false
    },
    userObj: {},
    verifiedWay: '3',
    lastTime: new Date().getTime(),
    fddUrl: '',
    isAgain: false,
    orgNameErrorCode: "请填写单位名称",
    creditCodeErrorCode: "请填写统一社会信用代码",
    areaErrorCode: "请选择单位所在地",
    phoneErrorCode: "请输入手机号码",
    orgName: "",
    creditCode: "",
    userInfo: {},
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
    isAgain: false,
    areaName: "",
    pageFrom: '',
    lauchInfo: {},
    impower: wx.getStorageSync('launchUser').step == '4' ? true : false,
    impowerStep: [{
      step: 1,
      status: true,
      title: '提交授权信息',
    }, {
      step: 2,
      status: false,
      title: '等待授权结果',
    }, {
      step: 3,
      status: false,
      title: '完成',
    }],
    model: null,
    signPhone: wx.getStorageSync('launchUser').mobile ? wx.getStorageSync('launchUser').mobile : '',
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
    })
  },
  // 改变认证方式
  changeWay(e) {
    this.setData({
      verifiedWay: e.detail.value
    })
  },
  getPhone(e) {
    this.setData({
      signPhone: e.detail.value
    })
  },
  // 获取单位名称
  getOrgName(e) {
    console.log(e.detail.value)
    let errorType = this.data.errorType;
    let params = {
      orgName: e.detail.value.trim()
    }
    if (!e.detail.value.trim()) {
      errorType.orgName = true
    } else {
      let reg = /^[^\s]*$/
      if (reg.test(e.detail.value.trim())) {
        checkAuth(params).then(res => {
          if (res.code == 0) {
            errorType.orgName = false;
          } else {
            errorType.orgName = true;
            this.setData({
              orgNameErrorCode: res.msg
            })
          }
        })
      } else {
        errorType.orgName = true;
        this.setData({
          orgNameErrorCode: "单位名称不能有空格"
        })
      }
    }
    this.setData({
      orgName: e.detail.value.trim(),
      errorType: errorType
    })
  },
  // 获取统一信用码
  getCreditCode(e) {
    let errorType = this.data.errorType;
    if (!e.detail.value.trim()) {
      errorType.creditCode = true
    } else {
      let reg = /^[A-Za-z0-9]+$/;
      if (reg.test(e.detail.value.trim())) {
        let params = {
          creditCode: this.data.creditCode
        }
        checkAuth(params).then(res => {
          if (res.code == 0) {
            errorType.creditCode = false;
          } else {
            errorType.creditCode = true;
            this.setData({
              creditCodeErrorCode: res.msg
            })
          }
        })
      } else {
        errorType.creditCode = true;
        this.setData({
          creditCodeErrorCode: "信用代码格式错误"
        })
      }
    }
    this.setData({
      creditCode: e.detail.value.trim(),
      errorType: errorType
    })
  },
  // 检查提交认证
  checkSubmit() {
    let now = new Date().getTime()
    console.log(this.data.lastTime, now);
    if (now - this.data.lastTime > 3000) {
      let errorType = this.data.errorType;
      errorType.orgName = Number(this.data.orgName) == 0 ? true : false
      errorType.creditCode = Number(this.data.creditCode) == 0 ? true : false
      if (this.data.model || this.data.impower) {
        errorType.phone = Number(this.data.signPhone) == 0 ? true : false
      } else {
        errorType.area = Number(this.data.areaId) == 0 ? true : false
      }
      this.setData({
        errorType: errorType
      })
      if (this.data.pageFrom.from == 'senior-approve') return this.submitData();
      if (!errorType.orgName && !errorType.creditCode && !errorType.area && !errorType.phone) {
        this.submitData()
      } else {
        wx.showToast({
          title: '信息填写不完整',
          icon: 'none',
          duration: 3000
        })
      }
      this.setData({
        lastTime: now
      })
    }
  },
  // 提交认证
  submitData() {
    if (this.data.model) return this.modelSubmit();
    let param = {
      autClient: 2,
      companyName: this.data.orgName,
      diyOrgAddress: this.data.areaId,
      organization: this.data.creditCode,
      verifiedWay: this.data.verifiedWay,
      isAgain: this.data.isAgain,
      returnUrl: 'wx://pages/redirect/redirect?root=auth'
    }
    if (this.data.impower) {
      param.mobile = this.data.signPhone;
    }
    console.log(this.data.isAgain);
    let url = this.data.impower ? addCompanyAuthorizer : this.data.pageFrom.from == 'old-sign' ? essAddAuthCompany : this.data.isAgain === 'true' ? againAddAuthCompany : addAuthCompany
    console.log(url);
    url(param).then(res => {
      if (res.code == 0) {
        this.setData({
          fddUrl: res.data
        });
        // 进行下一步，调用认证接口
        wx.setStorageSync('reloadUrl', res.data);
        wx.navigateTo({
          url: `/pagesFace/pages/webview/webview?root=user`
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  toFdd() {
    wx.navigateToMiniProgram({
      appId: 'wxa1439f77c6d06a15',
      path: 'pages/result-loading/result-loading?verifyUrl=' + this.data.fddUrl,
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
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
  modelSubmit() {
    let param = {
      autClient: 2,
      companyName: this.data.orgName,
      mobile: this.data.signPhone,
      organization: this.data.creditCode,
      verifiedWay: this.data.verifiedWay,
      isAgain: this.data.isAgain,
      returnUrl: 'wx://pages/redirect/redirect?root=auth'
    };
    updateCompanyAuth(param).then(res => {
      if (res.code == 0) {
        this.setData({
          fddUrl: res.data
        });
        // 进行下一步，调用认证接口
        wx.setStorageSync('reloadUrl', res.data);
        wx.navigateTo({
          url: `/pagesFace/pages/webview/webview?root=user`
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  modelUpdateInitialize(data, Bool) {
    this.setData({
      model: data.model,
      isAgain: data.again,
      creditCode: wx.getStorageSync('userInfo').organizationNoSensitive,
      orgName: wx.getStorageSync('userInfo').companyName,
      signPhone: wx.getStorageSync('userInfo').phone
    })
    if (Bool) {
      this.getArea();
      // this.data.
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getAutstate() {
    getAutStatus().then(res => {
      console.log(res);
      if (res.code == 0) {
        this.setData({
          userObj: res.data
        })
      }
    })
  },
  onLoad: function (options) {
    this.getMyAccountAndVip()
    if (options && options.type == 1) {
      const userInfo = wx.getStorageSync('userInfo')
      if (wx.getStorageSync('userInfo')) {
        this.setData({
          userInfo: wx.getStorageSync('userInfo')
        })
      }
      this.setData({
        typeState: options.type,
        creditCode: userInfo.organizationNoSensitive,
        orgName: userInfo.companyName
      })
    }
    if (options.newapprove == "newapprove") return this.modelUpdateInitialize(options,
      true)
    if (options.model == "update") return this.modelUpdateInitialize(options)
    this.getArea();
    if (options.again) {
      this.setData({
        isAgain: options.again
      })
    };
    if (options.data) {
      let data = JSON.parse(options.data);
      console.log(data, 'dadadra');
      if(data.authorizer == 'sq'){
        this.setData({
          impower: true
        })
      }
      let previous = data.from == 'old-sign' || data.from == 'senior-approve' ? 'userInfo' : 'launchUser';
      let store = wx.getStorageSync(previous);
      console.log(store, 'storestorestore');
      if (data.from) return this.setData({
        pageFrom: data,
        orgName: store.companyName,
        creditCode: data.from == 'old-sign' || data.from == 'senior-approve' ? store.organizationNoSensitive : store.organization,
        signPhone: data.from == 'old-sign' || data.from == 'senior-approve' ? store.phone : store.mobile,
      })
    };
  },
  getMyAccountAndVip() {
    getMyAccountAndVipInfo().then(res => {
      if (res.code == 0) {
        this.setData({
          userObj: res.data.accountInfo
        })
        console.log(res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.switchTab({
      url: '/pages/me/me'
    })
  },
})