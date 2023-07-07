// personal/components/my-user/user-follow/user-follow.js
import {
  getUserDownload,
  getUserFollow
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
    keyWord:"",
    createTime: null,
    endTime: null,
    date: "",
    showStartTime: false,
    showEndTime: false,
    dataList: [],
    reachStatus: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //设置原始数据
    setOriginalData() {
      this.setData({
        createTime: null,
        endTime: null,
      })
    },
    changeKeyword(e) {
      let keyWord = this.data.keyWord
      keyWord = e.detail.value.trim()
      this.setData({
        keyWord: keyWord
      })
    },
    // 清除关键词
    clearKeyword() {
      let keyWord = this.data.keyWord
      keyWord = ""
      this.setData({
        keyWord: keyWord,
      })
      // this.getUserFollow()
    },
    // 时间格式操作
    formatDate(date) {
      date = new Date(date);
      let year = date.getFullYear()
      let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let day = String(date.getDate()).length == 1 ? '0' + date.getDate() : date.getDate()
      let hours = String(date.getHours()).length == 1 ? '0' + date.getHours() : date.getHours()
      let minutes = String(date.getMinutes()).length == 1 ? '0' + date.getMinutes() : date.getMinutes()
      return `${year}-${month}-${day} ${hours}:${minutes}`;
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
      let createTime = this.data.createTime
      createTime = this.formatDate(date)
      this.setData({
        createTime: createTime,
      })
      this.closeStartTime()
    },
    onConfirmEnd(e) {
      let date = e.detail
      let endTime = this.data.endTime
      endTime = this.formatDate(date)
      this.setData({
        endTime: endTime,
      })
      this.closeEndTime()
    },
    // 获取用户收藏列表
    getUserFollow(){
      let params = {
        userId: this.data.userId,
        spuTitle: this.data.keyWord,
        startCreateTime: this.data.createTime == null ? "" : this.data.createTime,
        endCreateTime: this.data.endTime == null ? "" : this.data.endTime,
        pageNo: this.data.page.pageNo,
        pageSize: this.data.page.pageSize
      }
      if(this.data.createTime!=null&&this.data.endTime!=null&&this.data.createTime >= this.data.endTime){
        wx.showToast({
          title: "起始操作时间需早于结束操作时间",
          icon: 'none',
          duration: 1500
        })
        return false
      }
      getUserFollow(params).then(res => {
        if(res.code == CodeMsg.CODE_0){
          let r = res.data
          let dataList = this.data.dataList
          let reachStatus = this.data.reachStatus
          this.setData({
            dataList: reachStatus == true ? dataList.concat(r.records) : r.records,
            reachStatus: false,
            total: r.total
          })
        }
      })
    },
    // 触底加载
    getReachList() {
      let dataList = this.data.dataList
      let total = this.data.total
      let page = this.data.page
      if (dataList.length < total) {
        page.pageNo = page.pageNo + 1
        this.setData({
          reachStatus: true,
          page: page
        })
        this.getUserFollow()
      }
    },
    // 重置
    resetBtn() {
      this.setData({
        keyWord: "",
        createTime: null,
        endTime: null,
        currentDate: new Date().getTime(),
      })
      this.getUserFollow();
      this.selectComponent('#item').toggle();
    },
    //确定
    okBtn() {
      this.getUserFollow();
      this.selectComponent('#item').toggle();
    },
  },
})