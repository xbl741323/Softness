// personal/components/my-process/refund/list/index.js
var handles = require('../../../../../utils/common/handles');
import { refundProcessStatus, feeType} from '../../../../../utils/refund/refund';
import { getEmpOption } from '../../../../../utils/api/category';
import { pageMyTmRefundVo } from '../../../../../utils/api/refund';
Component({
  /**
   * 组件的属性列表
   */
  options:{
    multipleSlots: true
  },
  properties: {
    empList:{
      type: Array
    },
    parentWord: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusData: refundProcessStatus(),
    feeType: feeType(),
    chooseFee: null,
    refundStatus: null,
    empInfo: {
      name: "待处理人",
      userId: ""
    },
    keyWord: "",
    reachStatus: false,
    show: true,
    value: [0],
    pageNo:1,
    pageSize:20,
    refundList:[],
    noMore: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选择流程状态
    changeProcess(e){
      console.log(e);
      this.setData({
        refundStatus: e.detail,
        refundList:[]
      });
      this.getList();
    },
    // 选择费用类型
    changefeeType(e){
      this.setData({
        chooseFee: e.detail,
        refundList:[]
      });
      this.getList();
    },
    allot() {
      console.log(this.data.empList);
      this.setData({
        show: false,
      });
    },
      // 选择员工后关闭选择框
    confirm() {
      this.setData({
        show: true,
        pageNo: 1,
        reachStatus: false,
        keyWord: '',
      })
      let empList = this.data.empList
      let index = this.data.value[0]
      if (empList.length > 0) {
        this.setData({
          empInfo: empList[index],
          pageNo: 1,
        })
      }
      console.log(this.data.empInfo);
      this.getList();
      this.getEmpList();
    },
    // 关闭选择框
    close() {
      this.setData({
        show: true,
        keyWord: ""
      })
    },
    // 搜索框事件
    changeSearch(e) {
      this.setData({
        keyWord: e.detail.value.trim()
      })
      this.getEmpList();
    },
      // 滚动切换员工
    changePicker(e) {
      this.setData({
        value: e.detail.value
      })
    },
    // 根据姓名获取员工
    getEmpList() {
      let params = {
        name: this.data.keyWord
      }
      getEmpOption(params).then(res => {
        if (res.code == 0) {
          this.setData({
            empList: res.data,
          })
        }
      })
    },
    // 获取退款列表
    getList(info){      
      this.setData({
        noMore: false,
      });
      let users = wx.getStorageSync('userInfo')
      let para = {
        costTypeId: this.data.chooseFee,
        handleBy: this.data.empInfo.userId,
        keyWord: this.data.parentWord,
        refundStatus: this.data.refundStatus,
        pageNo: info ? info.refundPage : this.data.pageNo,
        pageSize: this.data.pageSize,
      }
      if(this.data.refundStatus == 88){
        para.handleBy = users.id;
        para.refundStatus = null;
        para.refundStatusList = [1, 2, 3]
      }
      if(this.data.refundStatus == 99){
        para.handleByOther = users.id;
        para.refundStatus = null;
        para.refundStatusList = [1, 2, 3]
      }
      if(para.pageNo == 1){
        this.setData({
          refundList: []
        })
      };
      pageMyTmRefundVo(para).then(res=>{
        if(res.code == 0){
          let data = res.data.records;
          data.forEach(item=>{
            if(item.ttRefundFeeList && item.ttRefundFeeList.length > 1){
              item.feeTypes = handles.doubleUniqueArr(item.ttRefundFeeList,'costTypeId','payTypeId');
            } else {
              item.feeTypes = item.ttRefundFeeList;
            }; 
            if(item.tmRefundApprovalList && item.tmRefundApprovalList.length > 1){
              item.approvals = handles.uniqueArr(item.tmRefundApprovalList,'handleByNo');
            } else {
              item.approvals = item.tmRefundApprovalList;
            }
          });
          this.setData({
            refundList: [...this.data.refundList, ...data],
          });
          let page = info ? info.refundPage : this.data.pageNo;
          if(res.data.total != 0 && page*this.data.pageSize >= res.data.total){
            this.triggerEvent('noMore', true);
            this.setData({
              noMore: true,
            })
          }
        }
      });      
    },
  },
  lifetimes: {
    attached: function () {
      this.getList()
    }
  }
})
