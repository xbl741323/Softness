// personal/components/my-user/maintenance-records/maintenance-records.js
import {
  getUserFollowUp,
  getUserEdit
} from "../../../../utils/api/user"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Component({
  lifetimes: {
    attached: function () {
      this.setOriginalData()
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    userId: {
      type: Number
    },
    userType: {
      type: Number
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentDate: new Date().getTime(),
    minDate: new Date(2000, 1, 1).getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      if (type === 'hour') {
        return `${value}时`;
      }
      if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },
    total: 0,
    page: {
      pageNo: 1,
      pageSize: 20,
    },
    filters: {
      keyWord: "",
      createTime: null,
      endTime: null,
    },
    date: "",
    showStartTime: false,
    showEndTime: false,
    keyWord: "",
    followUpList: [],
    editList: [],
    reachStatus: false,
    activeStatus: 0,
    loginName: ""//当前登录人姓名
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //设置原始数据
    setOriginalData() {
      let filters = this.data.filters
      this.setData({
        filters: filters,
      })
    },
    changeKeyword(e) {
      this.setData({
        keyWord: e.detail.value.trim()
      })
    },
    // 清除关键词
    clearKeyword() {
      let keyWord = this.data.keyWord
      keyWord = ""
      this.setData({
        keyWord: keyWord,
      })
      this.getDiff()
    },
    // 时间格式操作
    formatDate(date) {
      date = new Date(date);
      let year = date.getFullYear()
      let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let day = String(date.getDate()).length == 1 ? '0' + date.getDate() : date.getDate()
      let hours = String(date.getHours()).length == 1 ? '0' + date.getHours() : date.getHours()
      let minutes = String(date.getMinutes()).length == 1 ? '0' + date.getMinutes() : date.getMinutes()
      return `${year}-${month}-${day} ${hours}:${minutes}:00`;
    },
    // 展示时间弹窗
    bindStartShow() {
      this.setData({
        showStartTime: true
      })
    },
    bindEndShow() {
      this.setData({
        showEndTime: true
      })
    },
    // 关闭时间弹窗
    closeStartTime() {
      this.setData({
        showStartTime: false
      })
    },
    closeEndTime() {
      this.setData({
        showEndTime: false
      })
    },
    onConfirmStart(e) {
      let date = e.detail
      let filters = this.data.filters
      filters.createTime = this.formatDate(date)
      this.setData({
        filters: filters
      })
      this.closeStartTime()
    },
    onConfirmEnd(e) {
      let date = e.detail
      let filters = this.data.filters
      filters.endTime = this.formatDate(date)
      this.setData({
        filters: filters
      })
      this.closeEndTime()
    },
    // 显示用户跟进列表
    showFollowUp(){
      this.setData({
        activeStatus: 0
      })
      this.getUserFollowUp()
    },
    // 显示用户编辑列表
    showEdit(){
      this.setData({
        activeStatus: 1
      })
      this.getUserEdit()
    },
    // 获取用户跟进列表
    getUserFollowUp(){
      let params = {
        userId: this.data.userId,
        keyWord: this.data.keyWord,
        startTime: this.data.filters.createTime == null ? '' : this.data.filters.createTime,
        endTime: this.data.filters.endTime == null ? '' : this.data.filters.endTime,
        current: this.data.page.pageNo,
        size: this.data.page.pageSize
      }
      if(this.data.filters.createTime!=null&&this.data.filters.endTime!=null&&this.data.filters.createTime >= this.data.filters.endTime){
        wx.showToast({
          title: "起始操作时间需早于结束操作时间",
          icon: 'none',
          duration: 1500
        })
        return false
      }
      getUserFollowUp(params).then(res => {
        if(res.code == CodeMsg.CODE_0){
          let r = res.data
          let followUpList = this.data.followUpList
          let reachStatus = this.data.reachStatus
          this.setData({
            followUpList: reachStatus == true ? followUpList.concat(r.records) : r.records,
            reachStatus: false,
            total: r.total
          })
        }
      })
    },
    getDiff(){
      let userData = wx.getStorageSync('userInfo')
      this.setData({
        loginName: userData.name
      })
      if(this.data.activeStatus == 0){
        this.getUserFollowUp()
      }else{
        this.getUserEdit()
      }
    },
    // 获取用户编辑列表
    getUserEdit(){
      let params = {
        type: 6,
        keyId: this.data.userId,
        keywords: this.data.keyWord,
        startCreateTime: this.data.filters.createTime,
        endCreateTime: this.data.filters.endTime,
        pageNo: this.data.page.pageNo,
        pageSize: this.data.page.pageSize
      }
      if(this.data.filters.createTime!=null&&this.data.filters.endTime!=null&&this.data.filters.createTime >= this.data.filters.endTime){
        wx.showToast({
          title: "起始操作时间需早于结束操作时间",
          icon: 'none',
          duration: 1500
        })
        return false
      }
      getUserEdit(params).then(res => {
        if(res.code == CodeMsg.CODE_0){
          let r = res.data
          let editList = this.data.editList
          let reachStatus = this.data.reachStatus
          this.setData({
            editList: reachStatus == true ? editList.concat(r.records) : r.records,
            reachStatus: false,
            total: r.total
          })
        }
      })
    },
    // 触底加载
    getReachList() {
      let followUpList = this.data.followUpList
      let editList = this.data.editList
      let total = this.data.total
      let page = this.data.page
      if (this.data.activeStatus == 0 && followUpList.length < total) {
        page.pageNo = page.pageNo + 1
        this.setData({
          reachStatus: true,
          page: page
        })
        this.getUserFollowUp()
      }
      if (this.data.activeStatus == 1 && editList.length < total) {
        page.pageNo = page.pageNo + 1
        this.setData({
          reachStatus: true,
          page: page
        })
        this.getUserEdit()
      }
    },
    // 重置
    resetBtn() {
      let filters = this.data.filters
      filters.createTime = null,
      filters.endTime = null
      this.setData({
        keyWord: "",
        filters: filters,
        currentDate: new Date().getTime(),
      })
      if(this.data.activeStatus == 0){
        this.getUserFollowUp()
      }else{
        this.getUserEdit()
      }
      this.selectComponent('#item').toggle();
    },
    //确定
    okBtn() {
      if(this.data.activeStatus == 0){
        this.getUserFollowUp()
      }else{
        this.getUserEdit()
      }
      this.selectComponent('#item').toggle();
    },
    // 跳转跟进页面
    follow(e){
      let userId = this.data.userId
      let userType= this.data.userType
      let data = e.currentTarget.dataset.item
      data = JSON.stringify(data)
      wx.navigateTo({
        url: `/personal/pages/my-user/follow/follow?userId=${userId}&userType=${userType}&data=${data}`,
      })
    }
  },
})