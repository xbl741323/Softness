<!--排查完成-->
<template>
  <div class="order-detail-page">
    <!-- 订单信息 -->
    <div class="order-detail-theme">
      <span class="order-no"><img src="../../../../public/images/订单.png" class="img" />单号：{{ orderInfo.orderNo }}</span>
      <span class="order_status" :class="{ 'wait': orderInfo.orderStatus == 1 }">
        <span class="status">订单状态：</span>
        <span :class="[
          orderInfo.orderStatus == 0 ? 'tostart' :
            orderInfo.orderStatus == 2 ? 'blue-circle in-service' :
              orderInfo.orderStatus == 3 ? 'blue-circle circleRed' :
                orderInfo.orderStatus == 4 ? 'success_detail' :
                  ''
        ]"><b v-if="orderInfo.orderStatus == 4">✔</b></span>
        <span>{{ orderInfo.orderStatus | orderStatus }}</span>
      </span>
      <span class="order-noo" style="margin-left:15px">
        <img class="person" src="@/assets/images/my-home/wodexiansuo@2x.png" width="22px" height="20px"
          v-if="orderInfo.belongName" />
        <el-tooltip effect="dark" :content="'工号：' + empNo + ' 部门：' + deptName" placement="top" v-if="orderInfo.belongName">
          <span @mouseover="showUserInfo(orderInfo.belongId)">&nbsp;{{ orderInfo.belongName }}</span>
        </el-tooltip>
        <img src="/img/disable.png" v-if="orderInfo.userBelongLockFlag && orderInfo.userBelongLockFlag == 9"
          class="dispicture" alt="" />
      </span>
      <span class="belong" v-if="orderInfo.clueAttributionEmpName && orderInfo.clueSalesmanEmpName"></span>
      <span class="order-noo" style="margin-left:15px">
        <img class="person" src="../../../../public/images/clueman.png" width="22px" height="20px"
          v-if="orderInfo.clueAttributionEmpName" />
        <el-tooltip effect="dark" :content="'工号：' + empNo + ' 部门：' + deptName" placement="top"
          v-if="orderInfo.clueAttributionEmpName">
          <span
            @mouseover="showUserInfo(orderInfo.clueAttributionEmpId)">&nbsp;{{ orderInfo.clueAttributionEmpName }}</span>
        </el-tooltip>
        <img src="/img/disable.png" v-if="orderInfo.userBelongLockFlag && orderInfo.userBelongLockFlag == 9"
          class="dispicture" alt="" />
      </span>
      <span class="belong" v-if="orderInfo.clueAttributionEmpName && orderInfo.clueSalesmanEmpName"></span>
      <span class="order-noo">
        &nbsp;<img class="persontwo" src="../../../../public/images/salesman.png" width="24px" height="22px"
          v-if="orderInfo.clueSalesmanEmpName" />
        <el-tooltip effect="dark" :content="'工号：' + empNo + ' 部门：' + deptName" placement="top"
          v-if="orderInfo.clueSalesmanEmpName">
          <span @mouseover="showUserInfo(orderInfo.clueSalesmanEmpId)">&nbsp;{{ orderInfo.clueSalesmanEmpName }}</span>
        </el-tooltip>
        <img src="/img/disable.png" v-if="orderInfo.salesmanLockFlag && orderInfo.salesmanLockFlag == 9" class="dispicture"
          alt="" />
      </span>
      <div class="gmt">
        <span class="user">{{ orderInfo.userNo }} </span>
        <span class="user" v-if="orderInfo.clueType == 2">{{ orderInfo.accountNo }}</span>
        <span class="user">{{ orderInfo.clueNo }}</span>
      </div>
      <div class="order-info" v-if="orderInfo">
        <!-- 头部订单信息 -->
        <div v-for="item in infoList" :key="item.value">
          <p class="info-name">{{ item.label }}</p>
          <p v-if="item.key != 'contractFileName' && item.key != 'orderSource' && item.key != 'thirdOrderNo'">{{ item.key |
            transfer(vue_this) }}</p>
          <!-- 0227修改 -->
          <p v-if="item.key == 'orderSource' && orderInfo.orderSource == 2">
            <span>{{ item.key | transfer(vue_this) }}</span>
            <span>-{{ orderInfo.orderChannel | filterOrderChannel }}</span>
          </p>
          <p v-if="item.key == 'orderSource' && orderInfo.orderSource != 2">{{ orderInfo.orderPort | orderPort }}</p>
          <!-- 20230227新增电商订单编号整合下单来源和端口 -->
          <p v-if="item.key == 'thirdOrderNo'">{{ orderInfo.thirdOrderNo ? orderInfo.thirdOrderNo : '/' }}</p>
          <p class="contract-url" v-if="item.key == 'contractFileName'" @click="viewContract()">{{ orderInfo[item.key] }}
          </p>
        </div>
      </div>
      <div class="time-address">
        <div v-if="!userInfo.isPartner">
          <p class="info-name">创建时间</p>
          <p>{{ orderInfo.createTime }}</p>
        </div>
        <div>
          <p class="info-name">收货地址
            <i v-if="source == 'personal' && !userInfo.isPartner" @click="showDialog" class="el-icon-edit edit"></i>
          </p>
          <p v-if="receiveAddress && receiveAddress.receiverName">
            {{ receiveAddress.receiverName }}&nbsp;&nbsp;{{ receiveAddress.mobilePhoneNumber }}&nbsp;&nbsp;{{ receiveAddress.areaNo
              | areaNo }}&nbsp;&nbsp;{{ receiveAddress.detailAddress }}</p>
        </div>
      </div>
      <p class="info-note" v-if="source == 'personal'">订单备注<i v-if="!userInfo.isPartner" class="el-icon-edit edit"
          @click="source == 'personal' ? editNote() : $notAuthorized()"></i></p>
      <p class="info-desc">{{ orderInfo.remark || '暂无备注' }}</p>
    </div>
    <el-tabs type="border-card" class="order-detail-theme tabs" v-model="tabName">
      <el-tab-pane name="0" label="任务信息">
        <order-task-information v-if="tabName == 0" :taskInfo="orderInfo.tmOrderTaskVoList"
          :autStatus="orderInfo.autStatus" :orderStatus="orderInfo.orderStatus" />
      </el-tab-pane>
      <el-tab-pane name="2" label="费用信息">
        <onlinecostproperty-information :portType="portType" routerType :orderInfo="orderInfo"
          v-if="tabName == 2 && orderInfo.orderType == 0" :payMessageList="orderInfo.payMessageList" />
        <onlinecostproject-information :routerType="source" :portType="portType" :orderInfo="orderInfo"
          v-if="tabName == 2" :orderFeeVoList="orderInfo.orderFeeVoList" :tailStatus="orderInfo.tailStatus"
          :waitingPay="waitingPay" :auditStatus="auditStatus" />
      </el-tab-pane>
      <el-tab-pane name="3" label="操作记录">
        <order-operate-records :orderId="orderInfo.id" v-if="tabName == 3" ref="record" />
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="noteDialog" title="编辑备注" :close-on-click-modal="false" width="500px">
      <el-input type="textarea" v-model="note" rows="5" maxlength="100" show-word-limit />
      <div class="edit-note">
        <el-button type="primary" @click="submit()" v-preventReClick>确 定</el-button>
        <el-button @click="noteDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑收件地址" v-if="addressDialog" :visible.sync='addressDialog' :close-on-click-modal="false" center
      :before-close="handlecancel" width="597px">
      <el-form :model="areaForm" ref="areaForm" :rules="areaRules" label-width="110px" class="add_area">
        <el-form-item label="选择地区：" prop="areaNo">
          <el-cascader v-model="areaForm.areaNo" :options="areaList" :props="{ value: 'id', label: 'areaName' }"
            placeholder="请选择地区"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="detailAddress">
          <el-input placeholder="请输入详细地址信息，如道路、楼栋、单元号、门牌号等" maxlength="100" v-model="areaForm.detailAddress" />
        </el-form-item>
        <el-form-item label="收件人姓名：" prop="receiverName">
          <el-input v-model="areaForm.receiverName" maxlength="50" />
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobilePhoneNumber">
          <el-input v-model="areaForm.mobilePhoneNumber" />
        </el-form-item>
        <div style="text-align: center">
          <el-button type="primary" @click="submitArea()">确定</el-button>
          <el-button @click="handlecancel()">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 退款记录 -->
    <el-dialog title="退款记录" :visible.sync="refundDialog" width="500px">
      <div v-for="(item, index) in refundRecords" :key="index">
        <h3 class="refund-title" v-if="refundRecords.length > 1">退款{{ index + 1 }}</h3>
        <p>退款状态：{{ item.refundState | refundStateTransfer }}</p>
        <p>退款编号：{{ item.refundNo }}</p>
        <div v-if="item.refundState != 0">
          <p>支付方式：{{ item.payType | payTypeTransfer }}</p>
          <p>支付时间：{{ item.updateTime }}</p>
          <p v-if="item.payType != 1">{{ item.payType | payTypeTransfer }}流水号：{{ item.certificate }}</p>
          <p v-if="item.payType == 1" class="refund-success" @click="preview(item.certificate)">查看转账凭证</p>
        </div>
      </div>
    </el-dialog>
    <!-- 预览退款记录凭证 -->
    <div class="demo-image__preview image_fix_sty">
      <el-image ref="preview" style="width: 0px; height: 0px" :src="preUrl" :preview-src-list="srcList">
      </el-image>
    </div>
  </div>
</template>

<script>
import { getAreaList, editAddress, downloadLog, getRefundRecord } from "@/api/order/index.js";
import detailHead from "@/page/index/top/index";
import OrderTaskInformation from '@/components/order/online/onlinetask-information.vue';
import orderData from '@/components/order/order-data.js';
import OrderOperateRecords from '@/components/order/online/onlineoperate-records.vue';
import * as CodeMsg from "@/api/common/CodeChange";
import OnlinecostprojectInformation from './onlinecostproject-information.vue';
import OnlinecostpropertyInformation from './onlinecostproperty-information.vue';
import * as filterData from "@/util/new-client/filter.js";
import { priceMixin } from '../mixin.js';
import { mapGetters } from 'vuex';
import { i } from 'mathjs';
export default {
  mixins: [priceMixin],
  components: {
    detailHead,
    OrderTaskInformation,
    OrderOperateRecords,
    OnlinecostprojectInformation,
    OnlinecostpropertyInformation
  },
  data() {
    return {
      userInfo: JSON.parse(sessionStorage.getItem('pigx-userInfo')).content,
      portType: null,
      auditStatus: false, // 对公转账审核中
      vue_this: this,
      receiveAddress: {},
      orderId: '',
      tabName: 0,
      orderInfo: {},
      source: this.$route.query.source,//跳转来源
      noteDialog: false,
      refundDialog: false,
      note: '',
      addressDialog: false,
      areaList: [],
      areaForm: {},
      refundRecords: [],
      showViewer: false,
      imgUrl: process.env.VUE_APP_IMAGE_BASEURL,
      srcList: [],
      preUrl: '',
      areaRules: {
        areaNo: [{ required: true, message: '请选择地区', trigger: 'change' }],
        detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        receiverName: [{ required: true, message: '请输入收件人姓名', trigger: 'blur' }],
        mobilePhoneNumber: [{ required: true, pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }]
      },
      imgBaseUrl: '',
      waitingPay: false
    }
  },
  computed: {
    infoList() {
      const list = orderData.infoList;
      list.forEach((item, index) => {
        if (this.userInfo.isPartner && item.key == 'contractFileName') {
          list.splice(index, 1);
          list.push({ value: 15, key: 'createTime', label: '创建时间', showStatus: true })
        }
      });
      return list.filter(item => {
        return item.showStatus || this.orderInfo.orderStatus >= 6;//待开始、进行中、已完成...显示所有信息
      })
    },
    ...mapGetters(['permissions'])
  },
  filters: {
    filterOrderPort(val) {
      return val == 'PC' ? 'WEB' : val == 'APPLET' ? '小程序' : '';
    },

    orderPort(val) {
      return orderData.orderPort(val);
    },
    transfer(arg, vue_this) {
      if (arg == 'orderSource') {
        return vue_this.orderInfo[arg] == 1 ? '自主下单' : '后台发起';
      } else {
        return arg == 'contactName' ? vue_this.orderInfo[arg] + '-' + vue_this.orderInfo['contactMobile'] : (arg == 'signName' ? vue_this.orderInfo[arg] + '-' + vue_this.orderInfo['signMobile'] : vue_this.orderInfo[arg]);
      }
    },
    filterOrderChannel(val) {
      return val == 1 ? 'wotao' : val == 2 ? '京东' : '淘宝';
    },
    orderStatus(value) {
      return orderData.onlinetransformOrderStatus(value);
    },
    refundAmount(value) {
      return orderData.refundAmount(value);
    },
    whereplatSource(value) {
      return orderData.wherePlat(value)
    },
    fiterpaytailStatus(value) {
      return orderData.paytailStatus(value)
    },
    payTypeTransfer(value) {
      return orderData.payType(value)
    },
    refundStateTransfer(value) {
      return orderData.refundState(value)
    },
    areaNo(value) {
      console.log(value);
      return filterData.filterArea(value)
    }
  },
  created() {
    this.orderId = this.$route.query.orderId;
    this.source = this.$route.query.source;
    this.portType = this.filterPortType(this.$route.query.portType);
    if (JSON.parse(sessionStorage.getItem('pigx-tag')).content.value.match('order')) {
      sessionStorage.setItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value, JSON.stringify({
        page: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).page,
        screening: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).screening,//表单筛选信息
        ID: JSON.parse(sessionStorage.getItem('pigx-tag')).content.label,//页面标识
        orderSource: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).orderSource,
        orderType: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).orderType,
        detail: { query: this.$route.query, path: this.$route.path }
      })
      );//保存页面信息
    }
  },
  mounted() {
    this.switch();
    this.getDetail();
    getAreaList().then(res => {
      this.areaList = res.data.data;
    }).catch(err => {
      return err;
    });
  },
  methods: {
    filterPortType(val) {
      let orderType = { 1: 'xm', 2: 'zc', 3: 'zc', 4: 'zc', 5: 'zc', 6: 'zc', 7: 'gscs', 10: 'flfw', 11: 'rjkf', 9: 'rzss' }
      return orderType[val]
    },
    viewContract() {
      if (this.orderInfo.contractType == 1) {
        window.open(this.orderInfo.contractFileUrl);
      } else {
        window.open(process.env.VUE_APP_IMAGE_BASEURL + this.orderInfo.contractFileUrl);
      };
    },
    refresh() {
      this.getDetail();
    },
    submit() {
      if (this.orderInfo.orderNote == this.note) {
        this.noteDialog = false;
        this.$message({
          message: '修改备注成功！',
          type: 'success'
        });
        this.getDetail();
      } else {

        let param = {
          id: this.orderInfo.id,
          remark: this.note,
          // orderNo: this.orderInfo.orderNo
        }
        let successMsg = '修改备注成功！';
        orderData.updateNote(param, successMsg).then(res => {
          this.noteDialog = false;
          this.getDetail();
          if (this.tabName == 3) {
            this.$refs.record.getOrderOperate()
          }
        });
      }
    },
    //点击预览退款记录
    preview(img) {
      this.preUrl = this.imgUrl + img;
      this.srcList = [
        this.preUrl,
        this.preUrl,
      ]
      this.$refs.preview.showViewer = true
    },
    //点击预览合同
    clickContract() {
      downloadLog(this.orderInfo.id).then(res => { });
      let previewFileUrl = this.imgBaseUrl + this.orderInfo.attachmentUrl;
      window.open(previewFileUrl, "_blank");
    },
    //点击查看退款金额
    clickRefund() {

    },
    cancel() {
      this.noteDialog = false;
    },
    handlecancel() {
      this.addressDialog = false
    },
    editNote() {
      this.note = this.orderInfo.orderNote;
      this.noteDialog = true;
    },
    getDetail() {
      let param = {
        orderId: this.orderId,
        pwd: this.source == 'personal' ? false : true
      }
      orderData.getOnlineOrderDetail(param, this.portType, this.source == 'personal').then(res => {
        this.orderInfo = res.data
        this.orderInfo.orderFeeVoList.forEach(item => {
          if (item.payStatus == 0) {
            this.waitingPay = true;
          }
          if (item.payStatus == 1) {
            this.auditStatus = true
          }
        });
        // res.data.orderAddress.areaNo = res.data.orderAddress.areaNo.split(',').map(Number)
        this.receiveAddress = res.data.orderAddress;
        let tabName = JSON.parse(JSON.stringify(this.tabName));
        this.tabName = '0';
        this.$nextTick(() => {
          this.tabName = tabName;
        })
      })
    },
    filterPrice(val, num) {
      if (val) {
        return (val / 100).toFixed(2)
      } else {
        return '无'
      }
    },
    showDialog() {
      this.addressDialog = true
      if (JSON.parse(JSON.stringify(this.receiveAddress))) {
        let receiveAddress = JSON.parse(JSON.stringify(this.receiveAddress))
        this.areaForm = receiveAddress
      }
    },
    cancel() {
      this.addressDialog = false;
    },
    //获取退款信息
    refundRecord() {
      this.refundDialog = true;
      getRefundRecord(this.orderInfo.refundId).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          let list = res.data.data.refundMessageList;
          let deptCodes = list.map((value) => value.payType)
          const deptCodeSet = new Set(deptCodes)
          //判断paytype是否一致 不一致
          if (deptCodeSet.size === deptCodes.length) {
            this.refundRecords = list;
          } else {
            // 一致
            // 对公转账只取第一项
            if (deptCodes[0] == 1) {
              this.refundRecords = list.slice(0, 1);
            } else {
              // 支付宝判断流水号是否一致
              for (var i = 0; i < list.length; i++) {
                if (list[0].certificate == list[i].certificate) {
                  this.refundRecords = list.slice(0, 1);
                } else {
                  this.refundRecords = list;
                }
              }
            }
          }
        }
      });
    },
    submitArea() {
      let param = {
        id: this.receiveAddress.id,
        orderId: this.receiveAddress.orderId,
        areaNo: this.areaForm.areaNo.join(','),
        detailAddress: this.areaForm.detailAddress,
        receiverName: this.areaForm.receiverName,
        mobilePhoneNumber: this.areaForm.mobilePhoneNumber,
        isDefault: this.receiveAddress.isDefault
      }
      this.$refs.areaForm.validate(valid => {
        if (valid) {
          editAddress(param).then(res => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: 'success',
                message: '收件地址修改成功！',
                offset: 300
              })
              this.areaForm = {};
              this.addressDialog = false;
              this.getDetail();
            }
          })
        } else {
          return false;
        };
      })
    },
    switch() {
      if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
    },
  }
}
</script>

<style scoped>
.user {
  margin-right: 10px;
  border-radius: 3px;
  color: #027502;
  padding: 3px 5px;
  border: 1px solid #c4f5c4;
}

.belong {
  display: inline-block;
  width: 42px;
  height: 1.8px;
  background: #999;
  position: relative;
  top: -4px;
  left: 5px;
}

.cell-blue {
  color: #36a6fe;
  cursor: pointer;
}

.cell-blue i {
  font-size: 16px;
}

.cell-blue img {
  margin-left: 6px;
  width: 14px;
  height: 14px;
}

.refund-success {
  color: #36a6fe;
  cursor: pointer;
}

.order-detail-page {
  font-size: 14px;
  height: 100%;
  margin: 10px;
}

.order-detail-theme {
  min-width: 960px;
  background-color: #FFF;
  margin: 0 auto;
  padding: 20px;
}

.order-info {
  margin-top: 10px;
  margin-left: 22px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 20px;
}

.refund-title {
  margin: 0 0 10px 0
}

.info-name {
  font-size: 14px;
  font-weight: bold;
  color: #2c3e50;
  position: relative;
}

.info-note {
  font-size: 14px;
  font-weight: bold;
  margin-left: 22px;
}

.info-data {
  color: #666;
}

.info-desc {
  color: #666;
  margin-left: 22px;
}

.edit {
  color: #409eff;
  cursor: pointer;
  margin-left: 3px;
}

.tabs {
  margin-top: 20px;
}

.circleBlue {
  width: 6px;
  height: 6px;
  float: left;
  border-radius: 50%;
  background: #36A6FE;
  margin-top: 2px;
  margin-right: 7px;
}

.wait {
  color: #ccca4d;
}

.order-no {
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
  margin-left: 20px;
  position: relative;
  color: #2c3e50;
  line-height: 24px;
}

.order-noo {
  font-size: 14.5px;
  font-weight: bold;
  position: relative;
  color: #2c3e50;
  line-height: 24px;
}

.edit-note {
  text-align: right;
  margin-top: 10px;
}

.img {
  position: absolute;
  top: -3px;
  left: -25px;
  margin-right: 3px;
}

.blue-circle {
  width: 7px;
  height: 7px;
  display: inline-block;
  border-radius: 50%;
  background: #36A6FE;
  margin-right: 3px;
}

.success_detail {
  font-weight: bolder;
  font-size: 12px;
  display: inline-block;
  color: #027502;
  margin-right: 6px;
}

.circleRed {
  background: #ff0000;
}

.in-service {
  background: #f3ab03;
}

.tostart {
  width: 7px;
  height: 7px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 3px;
}

.order_status {
  margin: 0 15px;
  font-size: 16px;
  font-weight: bold;
}

.status {
  font-size: 16px;
  font-weight: 550;
}

.person {
  position: relative;
  top: 3.5px;
  object-fit: contain;
}

.persontwo {
  position: relative;
  top: 5.5px;
  object-fit: contain;
}

.gmt {
  position: relative;
  top: 10px;
  left: 22px;
  color: #666;
}

.dispicture {
  width: 24px;
  height: 24px;
  position: relative;
  top: 7px;
  margin-left: 3px;
}

.tailstatus {
  display: inline-block;
  width: 60px;
  height: 22px;
  border: 1px solid #999;
  border-radius: 4px;
  position: absolute;
  left: 35px;
  font-size: 12px;
  text-align: center;
}

.contract-url {
  color: #36A6FE;
  cursor: pointer;
}

.time-address {
  display: grid;
  grid-template-columns: 20% 80%;
  padding: 20px;
}</style>
