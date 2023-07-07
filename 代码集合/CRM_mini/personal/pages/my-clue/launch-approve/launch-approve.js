// personal/pages/my-clue/launch-approve/launch-approve.js
import {
  getClueDetail,
  listAuthCompanyUserVoByMobile,
  listCertifiedAuthorized,
  saveCertified
} from "../../../../utils/api/clue"
import * as CodeMsg from "../../../../utils/common/codeMsg";
import {
  throttle,
  message
} from "../../../../utils/common/utils"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clueId: '', //线索ID
    clueType: null,//线索类型 
    clueDetailList: {}, //线索单位详情信息
    clueCompanyContactList: [], //联系人信息
    name: '', //姓名
    mobile: '', //手机号
    userList: [], //用户信息
    businessList: [], //营业执照
    contractFileList: [], //合同附件
    approverInfo: { // 审批人信息
      id: "",
      name: "",
      no: ""
    },
    grantInfo: {}, //授权人信息
    approverList: [], // 审批人列表
    grantMobile: '', //授权人手机号
    grantName: '', //授权人姓名
    authRemark: '', //备注
    userDialog: false, //选择用户弹窗
    isApprove: false, //是否提交审核
    userInfo: [],
    userTip: '选择用户',
    accessInfo: {},
    isInconsistent: false,
    authType: null, //认证类型
    createId: null,
    idCard: "",//个人身份证号
    isShow: false,
    tipText: ''
  },
  // 获取单位线索详情
  getClueDetail(id, clueType) {
    let params = {}
    if(clueType==1){
      params.cluePersonId = id
    }else{
      params.clueCompanyId = id
    }
    getClueDetail(Object.assign({},params), clueType, true).then(res => {
      if (res.code != CodeMsg.CODE_0) {
        message(res.msg)
        return false
      }
      let reg = /^1[3456789]\d{9}$/
      if(clueType==2){
        res.data.clueCompanyContactList.map((item, index) => {
          item.checked = false
          if (reg.test(item.mobile)) {
            item.disabled = false
            this.setData({
              isInconsistent: false
            })
          } else {
            item.disabled = true
            this.setData({
              isInconsistent: true
            })
          }
        })
        this.setData({
          clueDetailList: res.data,
          clueCompanyContactList: res.data.clueCompanyContactList,
          name: res.data.clueCompanyStaff.legalName,
          mobile: res.data.clueCompanyStaff.legalMobile
        })
      }else{
        let para = {}
        para.contactName = res.data.contactName
        para.mobile = res.data.mobile
        para.id = this.data.clueId
        if (reg.test(para.mobile)) {
          para.disabled = false
          para.checked = true
          this.setData({
            isInconsistent: false,
            grantMobile: res.data.mobile
          })
        } else {
          para.disabled = true
          para.checked = false
          this.setData({
            isInconsistent: true
          })
        }
        res.data.clueCompanyContactList = [para]
        this.setData({
          clueDetailList: res.data,
        })
      }
      this.confirmLeave()
    })
  },
  // 修改法人信息
  changeInput(e) {
    let type = e.currentTarget.dataset.type
    let val = e.detail.value.trim()
    let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    let regs = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    if(type == 0){
      this.setData({
        name: val
      })
    }
    if (type == 1) {
      if (!reg.test(val)) {
        message('请输入正确的手机号')
        this.setData({
          mobile: ''
        })
        return false
      }
      this.setData({
        mobile: val
      })
    } 
    if(type == 2){
      if (!regs.test(val)) {
        message('请输入正确的18位身份证号')
        this.setData({
          idCard: ''
        })
        return false
      } 
      this.setData({
        idCard: val
      })
    }
  },
  // 授权人信息
  radioChange(e) {
    let clueCompanyContactList = this.data.clueCompanyContactList
    clueCompanyContactList.map(item => {
      item.checked = item.mobile === e.detail.value
    })
    let grantInfo = clueCompanyContactList.find(item => item.mobile === e.detail.value)
    this.setData({
      clueCompanyContactList: clueCompanyContactList,
      grantMobile: e.detail.value,
      grantInfo: grantInfo,
    })
  },
  // 选择用户
  chooseUser() {
    let clueCompanyContactList = this.data.clueDetailList.clueCompanyContactList
    let grantMobile = this.data.grantMobile
    let authType = this.data.authType
    if (this.data.grantMobile) {
      listAuthCompanyUserVoByMobile(grantMobile).then(res => {
        if (res.code != CodeMsg.CODE_0) {
          message(res.msg)
          return false
        }
        res.data.forEach(item => {
          item.checked = false
        })
        this.setData({
          userList: res.data,
        })
        if(res.data.length == 0){
          // 后台自主认证
          if(authType == 1){
            this.setData({
              tipText: '暂无用户信息，请根据所选联系人手机号注册一个卧涛网新账号！',
              isShow: true
            })
            setTimeout(()=>{
              this.setData({
                isShow: false
              })
            }, 1500)
          }
          
          // 电商认证
          let that = this
          authType==2 && wx.showModal({
            title: "提示",
            content: "该授权人无用户账号信息（卧涛网），认证成功后系统将自动为该授权人创建一个用户账号!",
            confirmColor: "#36A6FE",
            confirmText: "确定",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                let arr = clueCompanyContactList.filter(item =>item.mobile == grantMobile)
                arr.length>0 && that.setData({
                  createId: arr[0].id
                })
              } else if (res.cancel) {}
            }
          })
          return false
        }
        wx.navigateTo({
          url: `/personal/pages/my-clue/choose-user/choose-user?data=${JSON.stringify(res.data)}`
        })
      })
    }
  },
  // 合同附件选择文件
  chooseFile() {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: this.authType==1?'file':'all',
      success(res) {
        // tempFilePath可以作为 img 标签的 src 属性显示图片
        let file = res.tempFiles[0]
        let startIndex = file.path.indexOf('.')
        let fileName = file.name
        let fileType = file.path.slice(startIndex + 1)
        let fileSize = file.size
        if(that.data.authType == 1){
          if (fileType != 'pdf') {
            message('请选择pdf格式的文件！')
            return false
          } 
          if (fileSize > 20 * (1024 * 1024)) {
            message('文件大小不能超过20M！')
            return false
          }
          that.uploadImage(file, fileName)
          return false
        }
        if (fileType != 'pdf' && fileType != 'jpg' && fileType != 'png' && fileType != 'jpeg') {
          message('请选择pdf格式的文件或者图片格式！')
          return false
        }
        if (fileSize > 4 * (1024 * 1024)) {
          message('文件大小不能超过4M！')
          return false
        }
        that.uploadBusinessFile(file, fileName, 2)
      }
    })
  },
  // 上传文件
  uploadImage(item, name) {
    wx.showLoading({
      title: '上传中，请稍等',
    })
    let contractFileList = []
    let that = this
    wx.uploadFile({
      filePath: item.path,
      name: 'multipartFile', //后台接收图片的字段
      url: app.globalData.baseURL + "/wtess/paperContract/upLoadClueFollowFile",
      method: "post",
      header: {
        "Content-Type": "multipart/form-data",
        'Authorization': 'Bearer ' + that.data.accessInfo.access_token,
      },
      success(res) {
        let result = JSON.parse(res.data)
        if (result.code == CodeMsg.CODE_0) {
          contractFileList.push({
            name: name,
            url: result.data.url,
          })
          that.setData({
            contractFileList: contractFileList
          })
          wx.hideLoading({
            success: (res) => {},
          })
        }
      }
    })
  },
  // 清空合同附件
  delContractFile() {
    this.setData({
      contractFileList: [],
    })
  },
  //营业执照选择图片
  chooseBusinessFile() {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success(res) {
        // tempFilePath可以作为 img 标签的 src 属性显示图片
        let file = res.tempFiles[0]
        let startIndex = file.path.indexOf('.')
        let fileName = file.name
        let fileType = file.path.slice(startIndex + 1)
        let fileSize = file.size
        if (fileType != 'pdf' && fileType != 'jpg' && fileType != 'png' && fileType != 'jpeg') {
          message('请选择pdf格式的文件或者图片格式！')
          return false
        }
        if (fileSize > 4 * (1024 * 1024)) {
          message('文件大小不能超过4M！')
          return false
        }
        that.uploadBusinessFile(file, fileName, 1)
      }
    })
  },
  // 上传文件
  uploadBusinessFile(item, name, type) {
    //type 1 营业执照 2 合同附件或电商订单截图
    wx.showLoading({
      title: '上传中，请稍等',
    })
    let businessList = []
    let that = this
    wx.uploadFile({
      filePath: item.path,
      name: 'file', //后台接收图片的字段
      url: app.globalData.baseURL + "/wtcrm/file/upload",
      method: "post",
      header: {
        "Content-Type": "multipart/form-data",
        'Authorization': 'Bearer ' + that.data.accessInfo.access_token,
      },
      success(res) {
        let result = JSON.parse(res.data)
        if (result.code == CodeMsg.CODE_0) {
          businessList.push({
            name: name,
            url: result.data,
          })
          if(type==1){
            that.setData({
              businessList: businessList
            })
          }else{
            that.setData({
              contractFileList: businessList
            })
          }
          wx.hideLoading({
            success: (res) => {},
          })
        }
      }
    })
  },
  // 清空营业执照信息
  delBusinessFile() {
    this.setData({
      businessList: [],
    })
  },
  // 获取审批人列表
  getApproverList() {
    listCertifiedAuthorized().then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          approverList: res.data
        })
      }
    })
  },
  // 修改审批人
  changeApprover(e) {
    let index = Number(e.detail.value)
    let approverInfo = this.data.approverInfo
    let approverList = this.data.approverList
    approverInfo.id = approverList[index].userId
    approverInfo.name = approverList[index].name
    approverInfo.no = approverList[index].number
    this.setData({
      approverInfo: approverInfo,
    })
  },
  // 修改备注
  changeRemark(e) {
    let val = e.detail.value.trim()
    this.setData({
      authRemark: val
    })
  },
  // 取消/提交审核 false-取消 true-提交审核
  handleOperate: throttle(function (e) {
    let that = this
    let status = e.currentTarget.dataset.type
    that.setData({
      isApprove: status
    })
    status && that.validateAuthenticationInfo();
    !status && wx.showModal({
      content: "确定取消？",
      cancelColor: "#999999",
      cancelText: "取消",
      confirmColor: "#36A6FE",
      confirmText: "确定",
      success(res) {
        if (res.confirm) {
          setTimeout(() => {
            wx.navigateTo({
              url: `/personal/pages/my-clue/list/list?clueType=${that.data.clueType}`,
            })
          }, 500)
        } else if (res.cancel) {}
      }
    })
  }, 2000),
  //发起认证必填项校验
  validateAuthenticationInfo() {
    let isApprove = this.data.isApprove
    let validError = false
    let msg = ''
    if (this.data.name == '' && this.data.clueType == 2) {
      validError = true
      msg = "请输入法人姓名！"
    } else if (this.data.mobile == '' && this.data.clueType == 2) {
      validError = true
      msg = "请输入法人手机号！"
    } else if (this.data.grantMobile == '') {
      validError = true
      msg = "请选择授权人！"
    } else if (this.data.userInfo.length == 0 && this.data.authType == 1) {
      validError = true
      console.log(this.data.userInfo.length);
      msg = "请选择待认证的用户信息！"
    } else if (this.data.idCard == '' && this.data.clueType == 1) {
      validError = true
      msg = "请输入身份证号码！"
    } else if (this.data.businessList.length == 0 && this.data.clueType == 2) {
      validError = true
      msg = "请上传营业执照！"
    } else if (this.data.contractFileList.length == 0) {
      validError = true
      msg = this.data.clueType == 2&&this.data.authType==1 ? "请上传合同附件！" : "请上传订单截图！"
    } else if (this.data.approverInfo.id=='') {
      validError = true
      msg = "请选择审批人！"
    }
    if (validError) {
      message(msg)
    } else {
      this.launchAuthentication()
    }
  },
  // 返回发起认证参数
  returnAuthParam() {
    let clueType =  this.data.clueType
    let params = {
      auditId: this.data.approverInfo.id, //审核人id
      auditName: this.data.approverInfo.name, //审核人姓名
      auditNo: this.data.approverInfo.no, //审核人编号
      authType: this.data.authType,//认证类型 1-后台自主认证 2-电商认证
      clueId: this.data.clueId, //线索id
      clueName: clueType == 2 ? this.data.clueDetailList.companyName : this.data.clueDetailList.contactName, //线索名称
      clueNo: this.data.clueDetailList.clueNo, //线索编号
      clueType: clueType,//线索类型 //1-个人 2-单位
      contactMobile: this.data.grantMobile, //联系人手机号
      contactName: clueType == 2 ? this.data.grantInfo.contactName : this.data.clueDetailList.contactName, //联系人名称
      contractName: this.data.contractFileList[0].name, //合同附件名称
      contractUrl: this.data.contractFileList[0].url, //合同附件url
      legalMobile: clueType == 2 ? this.data.mobile : '', //法人手机号
      legalName: clueType == 2 ? this.data.name : '', //法人姓名
      organization: clueType == 2 ? this.data.clueDetailList.organization : this.data.idCard, //信用代码
      remark: this.data.authRemark, //备注信息
      type: 1, //类型 1-认证 2-授权
      userId: this.data.userInfo.length > 0 ? this.data.userInfo[0].userId : null, //用户信息id
      userNo: this.data.userInfo.length > 0 ? this.data.userInfo[0].userNo : null, //用户编号
    }
    if(clueType == 2){
      params.licenseName = this.data.businessList[0].name, //营业执照名称
      params.licenseUrl = this.data.businessList[0].url //营业执照url
    }
    return params
  },
  // 发起认证
  launchAuthentication() {
    let params = this.returnAuthParam()
    if (this.data.isApprove) {
      saveCertified(params).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          message('创建认证成功！')
          setTimeout(() => {
            wx.navigateTo({
              url:  `/personal/pages/my-clue/list/list?clueType=${this.data.clueType}`,
            })
          }, 500)
        } else {
          message(res.msg+'，请稍后重试！')
        }
      })
    }
  },
  // 离开页面提示
  confirmLeave() {
    if (wx.enableAlertBeforeUnload) {
      wx.enableAlertBeforeUnload({
        message: '返回后无法保存你所填写的数据，确定返回？',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      accessInfo: wx.getStorageSync('accessInfo'),
    })
    if (options.id) {
      this.setData({
        clueId: options.id,
        clueType: options.clueType,
        authType: options.authType
      })
      this.getClueDetail(options.id, options.clueType)
    }
    this.getApproverList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (wx.getStorageSync('chooseUserList')) {
      let data = [...JSON.parse(wx.getStorageSync('chooseUserList'))]
      console.log(data)
      this.setData({
        userInfo: data,
        userTip: '更换用户'
      })
      wx.removeStorageSync('chooseUserList')
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})