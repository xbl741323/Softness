// account/pages/approveFind/approveFind.js
const app = getApp();
import { authByOnlyPerson, userNameCheck,updatePwdByAuth,getAuthPersonStatus } from "../../../utils/api/user"
import { throttle } from "../../../utils/common/utils"
import { hexMD5 } from "../../../utils/md5.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    findStep:[{
      step: 1,
      title: '验证身份',
    },{
      step: 2,
      title: '找回密码',
    },{
      step: 3,
      title: '完成',
    }],
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
      title: "新手机号码",
      value: "",
      placeholder: "请输入新手机号码",
      required: true,
      validate: false,
      validateText: "请输入正确的手机号码",
    }],
    resetList: [{
      title: "账号名",
      value: "shiqi11",
      placeholder: "请填写账号名",
      required: true,
      validate: false,
      validateText: "请填写账号名",
    },
    {
      title: "新密码",
      value: "",
      placeholder: "请输入新密码",
      required: true,
      validate: false,
      validateText: "请输入6~16位字母+数字/符号组合",
    },
    {
      title: "再次确认密码",
      value: "",
      placeholder: "再次确认新密码",
      required: true,
      validate: false,
      validateText: "请再次输入新密码",
    }],
    sliderStatus: false,
    accountNull: false,//控制账号名输入状态
    accountStatus:false, //控制账号状态
    accountValidate:'请输入账号名',
    eyesOn: false,
    accountName:'',
    auditFailReason:'',
    step: 0,
    transactionNo: wx.getStorageSync('transactionNo'),
    authStatus: 1,//1:未认证；2:审核通过；3:已提交待审核；4:审核不通过 5:重新认证
  },
  // 重置密码表单blur赋值
  getValueItem(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let value = e.detail.value;
    let list = this.data.resetList;
    let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/;
    list[index].value = value;
    if(value==""||!reg.test(value)){
      list[index].validate = true
    } else {
      list[index].validate = false
    }
    this.setData({
      resetList: list
    })
  },
  // 密码显示
  eyeStatus() {
    this.setData({
      eyesOn: !this.data.eyesOn
    })
  },
  // blur获取账号名称校验
  getAccount(e){
    console.log(e.detail.value);
    let account = e.detail.value;
    if(!account) return this.setData({
      accountNull: true
    })
    this.setData({
      accountName: account,
      accountNull: false
    });
    userNameCheck(account).then(res=>{
      if(res.code == 0){
        if(res.data.authStatus=='0') return app.modalBox('','该账号尚未认证不能用此方法找回密码',false)
        wx.setStorageSync('mainAccountId', res.data.accountId);
        this.setData({
          accountStatus:true
        })
      } else {
        this.setData({
          accountNull: true,
          accountValidate: res.msg
        })
      }
    })
  },
  // 滑块状态
  sliderStatus(e){
    this.setData({
      sliderStatus: e.detail
    })
  },
  // 账号及滑块校验
  sliderBtn(){
    if(this.data.accountStatus&&this.data.sliderStatus) {
      this.setData({
        step: 1
      })
    };
    wx.setStorageSync('step', 1)
  },
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
  // 提交认证操作
  submitOperate: throttle(function () {     
    if(this.data.step == 1) return this.authSubmit()
    if(this.data.step == 2) return this.resetSubmit()
  }, 2000),
  // 重置密码提交
  resetSubmit(){
    let list = this.data.resetList;
    let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/;
    if(list[1].value!=list[2].value) return app.toastBox('两次密码输入不一致！', 'none', 1500);
    list.forEach((item, index) => {
      if(item.value==""||!reg.test(item.value)){
        item.validate = true
      } else {
        item.validate = false
      }
    });    
    this.setData({
      resetList: list
    })
    console.log(list[1].validate,list[2].validate);
    if(list[0].validate||list[1].validate) return;
    let para ={
      accountId: wx.getStorageSync('mainAccountId')? wx.getStorageSync('mainAccountId'):null,
      password: hexMD5(this.data.resetList[1].value),
      transactionNo: wx.getStorageSync('transactionNo')//交易号
    }
    updatePwdByAuth(para).then(res=>{
      if(res.code ==0){
        wx.removeStorageSync('step');
        wx.removeStorageSync('transactionNo');
        wx.removeStorageSync('mainAccountId');
        this.setData({
          step: 3
        })
      } else {
        app.modalBox('',res.msg,false)
      }
    })
  },
  // 密码修改成功去登录页面
  loginAgain(){
    app.toGoalUrl('/personal/pages/wxLogin/wxLogin')
  },
  //实名认证提交按钮
  authSubmit(){
    let nameRule = /^(?:[\u4E00-\u9FFF]{1,8}·\u4E00-\u9FFF]{1,8})|(?:[\u4E00-\u9FFF]{2,5})$/
    let cardRule = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    let phoneRule = /^1[3-9]\d{9}$/
    let optionList = this.data.optionList
    // 实名认证表单校验
    optionList.forEach((item, index) => {
      if (index < 2 && item.value.trim() == "") {
        item.validate = true
      } else if (index == 0 && !(nameRule.test(item.value))) {
        item.validate = true
      } else if (index == 1 && !(cardRule.test(item.value))) {
        item.validate = true
      } else if (index == 2 && !(phoneRule.test(item.value))) {
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
  },
  // 检查个人身份信息
  checkPerAuth() {    
    let optionList = this.data.optionList
    let data = {
      idCard: optionList[1].value,//optionList[1].value,
      autClient: 2,
      idCardName: optionList[0].value,
      mobile: optionList[2].value,
      accountId: wx.getStorageSync('mainAccountId'),
      returnUrl:  'wx://pages/redirect/redirect?root=find'
    }
    authByOnlyPerson(data).then(res => {
      if (res.code == 0) {
        // 进行下一步，调用认证接口
        wx.setStorageSync('reloadUrl', res.data.url);
        wx.setStorageSync('transactionNo', res.data.transactionNo);
        wx.navigateTo({
          url: `/pagesFace/pages/webview/webview?root=user`
        })
      } else {
        wx.showToast({
          title: res.msg,
          duration:2000,
          icon: 'none'
        })
      }
    })
  },
  // 重新认证
  authAgain(){
    this.setData({
      authStatus: 1
    })
  },
  // 认证回调后获取认证状态
  getAuthStatus(){
    getAuthPersonStatus(wx.getStorageSync('transactionNo')).then(res=>{
      if(res.code==0){
        let status = res.data.status
        this.setData({
          authStatus: Number(status),
          transactionNo: wx.getStorageSync('transactionNo')
        })
        if(status==4){
          this.setData({
            auditFailReason: res.data.auditFailReason
          })
        } 
        if(status==2){
          let list = this.data.resetList
          wx.setStorageSync('step',2)
          list[0].value = res.data.username;
          this.setData({
            step:2,
            resetList: list
          })
        } 
      }
      console.log(res);
    })
  },
   /**
   * 生命周期函数--监听页面显示
   */
  onShow() {   
    // 设置页面步骤 
    this.setData({
      step: wx.getStorageSync('step') ? wx.getStorageSync('step') : 0
    })
    if(wx.getStorageSync('transactionNo')){
      this.getAuthStatus()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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