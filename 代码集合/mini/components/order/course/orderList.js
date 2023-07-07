// components/order/class/order.js
const app = getApp();
import {
  pageCourseOrder,
  cancleCourseOrder,
  deleteCourseOrder
} from "../../../utils/api/order"
import{ innerPageTmFileOrder,documentCancelOrder,documentDeleteOrder } from "../../../utils/api/orders"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderType: {
      type: Number,
      value: null
    },
    page: {
      type: Object,
      value: {}
    },
    counts: {
      type: Object,
      value: {}
    },
    fileChecked:  {
      type: Number,
      value: null
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: app.globalData.navHeight * 2 + 10,
    navs: [{
      title: '全部',
      idx: null
    }, {
      title: '待付款',
      idx: 0
    }, {
      title: '已完成',
      idx: 2
    }],
    imageUrl: app.globalData.imageURL,
    checked: null,
    pageNo: 1,
    pageSize: 10,
    list: [],
    loading: true,
    total: 0,
    iconUrl: {
      pdf: '../../../image/file/icon_pdf.png',
      doc: '../../../image/file/icon-word.png',
      docx: '../../../image/file/icon-word.png',
      xls: '../../../image/file/icon_xls.png',
      xlsx: '../../../image/file/icon_xls.png',
      ppt: '../../../image/file/icon_ppt.png',
      pptx: '../../../image/file/icon_ppt.png',
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转课程详情
    toCourseDetail(e) {
      let item = e.currentTarget.dataset.item
      let id = this.data.orderType == 1 ? item.courseId : item.id;
      let url = this.data.orderType == 1 ? `/classRoom/pages/detail/course/course?id=${id}`: `/personal/pages/orderFile/orderDetail/detail?id=${id}` 
      wx.navigateTo({
        url: url,
      })
    },
    chooseNav(e) {
      let idx = e.currentTarget.dataset.idx;
      this.setData({
        checked: idx
      });
      this.triggerEvent('childIndex', true);
      this.updateList();
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 500,
      });
    },
    // 列表去支付
    buyNow(e) {
      let item = e.currentTarget.dataset.item
      if(this.data.orderType == 1) return wx.navigateTo({
        url: '/classRoom/pages/order/order?id=' + item.courseId + '&no=' + item.orderNo + '&orderId=' + item.id + '&orderAmount=' + item.orderAmount,
      });
      let para ={
        id: item.fileId,
        orderId: item.id,
        from: 'list'
      };
      let data = JSON.stringify(para);
      wx.navigateTo({
        url: `/personal/pages/orderFile/payDetail/payDetail?data=${data}`,
      });
    },    
    // 删除订单
    deleteOrder(e) {
      let ids = e.currentTarget.dataset.id
      let that = this;
      wx.showModal({
        title: '确定删除此订单？',
        cancelColor: '#36A6FE',
        confirmColor: '#999999',
        confirmText: '确定',
        cancelText: '再想想',
        success(res) {
          if (res.confirm) {
            if(that.data.orderType == 1) return deleteCourseOrder({ id: ids}).then(res => {
              that.nextRes(res)
            });
            documentDeleteOrder(ids).then(res => {
              that.nextRes(res)
            });
          } else if (res.cancel) {

            that.triggerEvent('close-dialog', true)
          }
        },
      })
    },
    // 取消订单
    cancleOrder(e) {
      let ids = e.currentTarget.dataset.id
      let that = this;
      wx.showModal({
        title: '确定取消此订单？',
        cancelColor: '#36A6FE',
        confirmColor: '#999999',
        confirmText: '确定',
        cancelText: '再想想',
        success(res) {
          if (res.confirm) {
            if(that.data.orderType == 1) return cancleCourseOrder({id: ids}).then(res => {
              that.nextRes(res)
            });
            documentCancelOrder(ids).then(res => {
              that.nextRes(res)
            });
          } else if (res.cancel) {
            that.triggerEvent('close-dialog', true)
          }
        },
      })
    },
    // 接口后操作
    nextRes(res) {
      if (res.code == 0) {
        wx.showToast({
          title: '操作成功！',
          duration: 1500,
        });
        this.updateList();
      } else {
        wx.showToast({
          title: res.msg,
          icon: none,
          duration: 1500,
        });
      }
    },
    // 更新页面数据
    updateList() {
      let current = 'page.current';
      this.setData({
        [current]: 1,
        list: [],
        orderStatus: this.data.checked
      });
      this.getList();
    },
    // 显示loading效果
    showLoading(flag, list) {
      if (flag) {
        wx.showLoading({
          title: '加载中！',
        })
      } else {
        wx.hideLoading({
          success: (res) => {
            this.setData({
              loading: list.length > 0 ? true : false
            })
          },
        })
      }
    },
    // 获取列表数据
    getList() {
      this.showLoading(true)
      let para = {
        pageNo: this.data.page.current,
        pageSize: this.data.pageSize,
        orderStatus: this.data.orderType == 2 && this.data.checked == 2 ? 1 : this.data.checked,
      }
      let url = this.data.orderType == 1 ? pageCourseOrder : innerPageTmFileOrder
      url(para).then(res => {
        if (res.code == 0) {
          this.setData({
            list: [...this.data.list, ...res.data.records],
          });
          let para = {};
          para.total = res.data.total;
          para.current = this.data.page.current;
          // para.index = this.data.checked;
          let methods = this.data.orderType == 1 ? 'changeClass': 'changeDocument'
          this.triggerEvent(methods, para);
          this.showLoading(false, this.data.list);
        }
      })
    }
  },
  lifetimes: {
    attached: function () {
      // this.setData({
      //   checked: this.data.fileChecked,
      // })
      this.getList()
    }
  }
})