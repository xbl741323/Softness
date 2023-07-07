// personal/pages/my-clue/launch-accredit/launch-accredit.js
import {
  getByOrganization,
  getClueDetail,
  listAuthCompanyUserVoByMobile,
  listCertifiedAuthorized,
  saveAuthorized
} from "../../../../utils/api/clue"
import * as CodeMsg from "../../../../utils/common/codeMsg";
import {
  throttle
} from "../../../../utils/common/utils"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accessInfo: {},
    userData: null, //线索详情
    userAuthInfo: [], //用户已认证信息
    accreditInfo: {}, //待授权信息
    approverList: [], // 审批人列表
    approverInfo: { // 审批人信息
      id: "",
      name: "",
      no: ""
    },
    contractFileList: [], //合同附件
    authRemark: '', //备注
    id: '', //线索ID
    certifiedLabel: null, //认证标签
    isApprove: false, //是否提交审核
  },
  // 获取数据
  getData(obj) {
    this.setData({
      id: obj.id,
      certifiedLabel: obj.certifiedLabel
    })
    this.getAuthInfo(obj.organization)
    this.getClueDetail(obj)
    this.getApproverList()
    this.confirmLeave()
  },
  // 获取用户已认证信息
  getAuthInfo(val) {
    getByOrganization(val).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          userAuthInfo: [res.data][0]
        })
      }
    })
  },
  // 获取待授权信息
  getClueDetail(val) {
    getClueDetail({
      clueCompanyId: val.id
    }, 2, true).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let obj = res.data.clueCompanyContactList.filter(item => item.id == val.chooseId)
        this.setData({
          userData: res.data,
          accreditInfo: obj[0]
        })
      }
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
  // 合同附件选择文件
  chooseFile() {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        // tempFilePath可以作为 img 标签的 src 属性显示图片
        let file = res.tempFiles[0]
        let startIndex = file.path.indexOf('.')
        let fileName = file.name
        let fileType = file.path.slice(startIndex + 1)
        let fileSize = file.size
        if (fileType == 'pdf') {
          if (fileSize <= 20 * (1024 * 1024)) {
            that.uploadImage(file, fileName)
          } else {
            wx.showToast({
              icon: 'none',
              title: '文件大小不能超过20M！',
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '请选择pdf格式的文件！',
          })
        }
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
  // 修改授权备注
  changeRemark(e) {
    let val = e.detail.value.trim()
    this.setData({
      authRemark: val
    })
  },
  submitAudit() {
    let validError = false
    let msg = ''
    if (this.data.contractFileList.length == 0) {
      validError = true
      msg = "请上传合同附件！"
    } else if (this.data.approverInfo.id == '') {
      validError = true
      msg = "请选择审批人！"
    }
    if (validError) {
      wx.showToast({
        icon: "none",
        title: msg,
      })
    } else {
      this.launchGrant()
    }
  },
  // 返回发起授权参数
  returnAuthParam() {
    let params = {
      auditId: this.data.approverInfo.id, //审核人id
      auditName: this.data.approverInfo.name, //审核人姓名
      auditNo: this.data.approverInfo.no, //审核人编号
      clueId: this.data.id, //线索id
      clueName: this.data.userData.companyName, //线索名称
      clueNo: this.data.userData.clueNo, //线索编号
      contactMobile: this.data.accreditInfo.mobile, //联系人手机号
      contactName: this.data.accreditInfo.contactName, //联系人名称
      contractName: this.data.contractFileList[0].name, //合同附件名称
      contractUrl: this.data.contractFileList[0].url, //合同附件url
      legalMobile: this.data.userAuthInfo.legalMobile, //法人手机号
      legalName: this.data.userAuthInfo.legalName, //法人姓名
      organization: this.data.userData.organization, //信用代码
      remark: this.data.authRemark, //备注信息
      type: 2, //类型 1-认证 2-授权
      userId: this.data.userAuthInfo.userId, //用户信息id
      userNo: this.data.userAuthInfo.userNo, //用户编号
    }
    return params
  },
  // 发起授权
  launchGrant() {
    let params = this.returnAuthParam()
    if (this.data.isApprove) {
      saveAuthorized(params).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          wx.showToast({
            icon: "none",
            title: "提交审核成功！",
          })
          setTimeout(() => {
            wx.navigateTo({
              url: `/personal/pages/my-clue/detail/detail?id=${this.data.id}&clueType=2&certifiedLabel=${this.data.certifiedLabel}`,
            })
          }, 500)
        } else {
          wx.showToast({
            icon: "none",
            title: res.msg,
          })
        }
      })
    }
  },
  // 取消/提交审核 false-取消 true-提交审核
  handleOperate: throttle(function (e) {
    let that = this
    let status = e.currentTarget.dataset.type
    that.setData({
      isApprove: status
    })
    status && that.submitAudit();
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
              url: `/personal/pages/my-clue/detail/detail?id=${that.data.id}&clueType=2&certifiedLabel=${that.data.certifiedLabel}`,
            })
          }, 500)
        } else if (res.cancel) {}
      }
    })
  }, 2000),
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
      this.getData(options)
    }
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