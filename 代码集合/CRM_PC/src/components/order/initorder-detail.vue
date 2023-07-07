<template>
  <div class="order-detail-page">
    <!-- 订单信息 -->
    <div class="order-detail-theme">
      <span class="order-no"><img src="../../../public/images/订单.png" class="img" />单号：{{ orderInfo.orderNo }}</span>
      <span class="order_status" :class="{ 'wait': orderInfo.orderStatus == 1 }">
        <span class="status">订单状态：</span>
        <span :class="[
          orderInfo.orderStatus == -3 ? 'tostart' :
            orderInfo.orderStatus == -1 ? 'blue-circle in-service' :
              orderInfo.orderStatus == -2 ? 'blue-circle circleRed' :
                orderInfo.orderStatus == 4 ? 'success_detail' :
                  ''
        ]"><b v-if="orderInfo.orderStatus == 4">✔</b></span>
        <span>{{ orderInfo.orderStatus | orderStatus }}</span>
      </span>
      <span class="order-noo" style="margin-left:15px">
        <img class="person" src="@/assets/images/my-home/wodexiansuo@2x.png" width="22px" height="20px"
          v-if="orderInfo.belongName" />
        <el-tooltip effect="dark" :content="'工号：' + empNo + ' 部门：' + deptName" placement="top"
          v-if="orderInfo.belongName">
          <span @mouseover="showUserInfo(orderInfo.belongId)">&nbsp;{{ orderInfo.belongName }}</span>
        </el-tooltip>
        <img src="/img/disable.png" v-if="orderInfo.userBelongLockFlag && orderInfo.userBelongLockFlag == 9"
          class="dispicture" alt="" />
      </span>
      <span class="belong" v-if="orderInfo.clueAttributionEmpName && orderInfo.clueSalesmanEmpName"></span>
      <span class="order-noo" style="margin-left:15px">
        <img class="person" src="../../../public/images/clueman.png" width="22px" height="20px"
          v-if="orderInfo.clueAttributionEmpName" />
        <el-tooltip effect="dark" :content="'工号：' + empNo + ' 部门：' + deptName" placement="top"
          v-if="orderInfo.clueAttributionEmpName">
          <span @mouseover="showUserInfo(orderInfo.clueAttributionEmpId)">&nbsp;{{ orderInfo.clueAttributionEmpName
          }}</span>
        </el-tooltip>
        <img src="/img/disable.png" v-if="orderInfo.userBelongLockFlag && orderInfo.userBelongLockFlag == 9"
          class="dispicture" alt="" />
      </span>
      <span class="belong" v-if="orderInfo.clueAttributionEmpName && orderInfo.clueSalesmanEmpName"></span>
      <span class="order-noo">
        &nbsp;<img class="persontwo" src="../../../public/images/salesman.png" width="24px" height="22px"
          v-if="orderInfo.clueSalesmanEmpName" />
        <el-tooltip effect="dark" :content="'工号：' + empNo + ' 部门：' + deptName" placement="top"
          v-if="orderInfo.clueSalesmanEmpName">
          <span @mouseover="showUserInfo(orderInfo.clueSalesmanEmpId)">&nbsp;{{ orderInfo.clueSalesmanEmpName }}</span>
        </el-tooltip>
        <img src="/img/disable.png" v-if="orderInfo.salesmanLockFlag && orderInfo.salesmanLockFlag == 9"
          class="dispicture" alt="" />
      </span>
      <el-button type="primary" class="detail-btn first" @click="getLink()"
        v-if="((orderInfo.orderStatus == -2)&&((permissions.bt_valid_draft_order && pathBool == 'list') || (permissions.bt_my_valid_draft_order && pathBool == 'personal')))">发起订单</el-button>
      <el-button type="warning" class="detail-btn" @click="update(orderInfo)"
        v-if="((orderInfo.orderStatus == -2) && ((permissions.bt_amend_order_init && pathBool == 'list') || (permissions.bt_order_amend_init_my && pathBool == 'personal')))">修改订单</el-button>
      <!-- <el-popconfirm :key="'t' + Date.now()" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info"
        icon-color="red"
        @confirm="permissions.sys_order_edit || source == 0 ? operate(orderInfo, 'close') : $notAuthorized()"
        title="确定关闭该条订单吗？">
        <el-button slot="reference" class="detail-btn" v-if="orderInfo.orderStatus == -1">关闭</el-button>
      </el-popconfirm> -->
      <el-popconfirm :key="'v' + Date.now()" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info"
        icon-color="red" @confirm="operate(orderInfo, 'del')" title="确定删除该条订单吗？">
        <el-button type="warning" slot="reference" class="detail-btn del-btn"
          v-if="(orderInfo.orderStatus == -3 || orderInfo.orderStatus == -2 || orderInfo.orderStatus == -5) && ((permissions.bt_delete_order_init && pathBool == 'list') || (permissions.bt_delete_order_init_my && pathBool == 'personal'))">删除</el-button>
      </el-popconfirm>
      <div class="gmt">
        <span class="user">{{ orderInfo.clueNo }}</span>
      </div>
      <div class="order-info" v-if="orderInfo">
        <div>
          <p class="info-name">线索名称</p>
          <p>{{ orderInfo.clueType == 1 ? userData.contactName : userData.companyName }}</p>
        </div>
        <div v-if="orderInfo.clueType == 2">
          <p class="info-name">信用代码</p>
          <p>{{ userData.organization }}</p>
        </div>
        <div>
          <p class="info-name">产品名称</p>
          <p>{{ orderInfo.spuName }}</p>
        </div>
        <div>
          <p class="info-name">规格属性</p>
          <p>{{ orderInfo.spec }}</p>
        </div>
        <div>
          <p class="info-name">数量</p>
          <p>{{ orderInfo.buyNum }}</p>
        </div>
        <div>
          <p class="info-name">签约人</p>
          <p>{{ orderInfo.signName }} {{ orderInfo.signMobile }}</p>
        </div>
      </div>
      <div class="time-remark">
        <div>
          <p class="info-name">创建时间</p>
          <p>{{ orderInfo.createTime }}</p>
        </div>
        <div>
          <p class="info-name">订单备注<i v-if="!userInfo.isPartner" class="el-icon-edit edit" @click="editNote()"></i></p>
          <p>{{ orderInfo.remark || '暂无备注' }}</p>
        </div>
      </div>
      <!-- <p class="info-note">收货地址<i v-if="source=='personal'" @click="showDialog" class="el-icon-edit edit"></i></p> -->
      <!-- <p class="info-desc" v-if="receiveAddress && receiveAddress.receiverName">{{receiveAddress.receiverName}}&nbsp;&nbsp;{{receiveAddress.mobilePhoneNumber}}&nbsp;&nbsp;{{receiveAddress.address}}&nbsp;&nbsp;{{receiveAddress.detailAddress}}</p> -->
    </div>
    <el-tabs type="border-card" class="order-detail-theme tabs" v-model="tabName">
      <el-tab-pane name="2" label="费用信息" :key="'c' + Date.now()">
        <init-order-fee v-if="tabName == 2" :orderFeeVoList="orderInfo.orderFeeVoList" :tailStatus="orderInfo.tailStatus"
          :waitingPay="waitingPay" />
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

    <!-- 编辑订单 -->
    <el-dialog :visible.sync="editOrderDialog" title="修改订单信息" top="5vh" :close-on-click-modal="false" width="820px">
      <edit-init-order v-if="editOrderDialog" :pathBool="pathBool == 'personal'" :productData='hasSelectedProducts'
        :operate="false" :orderId="orderId" @closeDialog="closeDialog"></edit-init-order>
    </el-dialog>

    <!-- 审核 -->
    <el-dialog :visible.sync="auditDialog" :close-on-click-modal="false" title="提交审核" width="550px">
      <p>订单发生了改价,需要先审核,请先选择审核人。审核通过后,方可发送给客户。</p>
      <el-form :model="auditForm" ref="auditForm" :rules="auditRules" label-width="110px">
        <el-form-item label="改价审核人：" prop="auditor">
          <el-select v-model="auditForm.auditor">
            <el-option v-for="item in auditorList" :key="item.userId" :value="item.userId" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="改价备注：">
          <el-input type="textarea" :rows="3" maxlength="100" show-word-limit v-model="auditForm.remark" />
        </el-form-item>
      </el-form>
      <div class="audit-initorder">
        <el-button size="mini" type="primary" @click="confirmAudit()">提交审核</el-button>
        <el-button size="mini" @click="cancelAudit()">取消提交</el-button>
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
import { getAreaList, editAddress, operateOrder, downloadLog, getRefundRecord, getIneffectiveById, getInitCode } from "@/api/order/index";
import { getClueDetail } from "@/api/new-client/my-clue";
import detailHead from "@/page/index/top/index";
import OrderTaskInformation from '@/components/order/online/onlinetask-information.vue';
import EditInitOrder from './edit-initOrder.vue'
import orderData from '@/components/order/order-data.js';
import OrderOperateRecords from '@/components/order/online/onlineoperate-records.vue';
import InitOrderFee from '@/components/order/init-orderFee'
import * as CodeMsg from "@/api/common/CodeChange"
import { validDraftOrder, updateRemark, auditOrder, getAuditor } from "@/api/order/index";
import VueQr from "vue-qr";
import { mapGetters } from 'vuex';
export default {
  components: {
    detailHead,
    OrderTaskInformation,
    OrderOperateRecords,
    InitOrderFee,
    EditInitOrder,
    VueQr
  },
  data() {
    return {
      userInfo: JSON.parse(sessionStorage.getItem('pigx-userInfo')).content,
      pathBool: null,
      auditForm: {},
      auditRules: {
        auditor: [{ required: true, message: '请选择审核人' }]
      },
      auditDialog: false,
      auditorList: [],
      param: {},
      vue_this: this,
      receiveAddress: {},
      orderId: '',
      tabName: '2',
      orderInfo: {},
      source: 'personal',//跳转来源
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
      waitingPay: false,
      editOrderDialog: false,
      linkDialog: false,
      hasSelectedProducts: [],
      wxOrderLink: '',
      pcOrderLink: '',
      userData: {},
      code: '',
      source: this.$route.query.source
    }
  },
  computed: {
    infoList() {
      return orderData.infoList.filter(item => {
        return item.showStatus || this.orderInfo.orderStatus >= 6;//待开始、进行中、已完成...显示所有信息
      })
    },
    ...mapGetters(['permissions'])
  },
  filters: {
    transfer(arg, vue_this) {
      if (arg == 'orderSource') {
        return vue_this.orderInfo[arg] == 1 ? '自主下单' : '后台发起';
      } else {
        return vue_this.orderInfo[arg];
      }
    },
    orderStatus(value) {
      return orderData.initOrderStatus(value);
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
  },
  created() {
    this.orderId = JSON.parse(this.$route.query.id);
    this.source = this.$route.query.source;
    this.pathBool = this.$route.query.pathBool;
    sessionStorage.setItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value, JSON.stringify({
      page: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).page,
      screening: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).screening,//表单筛选信息
      ID: JSON.parse(sessionStorage.getItem('pigx-tag')).content.label,//页面标识
      orderSource: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).orderSource,
      orderType: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).orderType,
      detail: { query: this.$route.query, path: this.$route.path }
    })
    );//保存页面信息
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
    cancelAudit() {
      this.auditDialog = false;
      this.auditForm = {};
    },
    getLink() {
      if (this.orderInfo.orderStatus == -1) {
        // 分享码页面不要了
        // this.link();
      } else {
        this.param = {
          id: this.orderInfo.id,
        }
        auditOrder(this.orderInfo.id).then(res => {
          if (res.data.code == 888) {
            getAuditor().then(res => {
              if (res.data.code == CodeMsg.CODE_0) {
                this.auditorList = res.data.data;
                this.auditDialog = true;
              }
            })
          } else if (res.data.code == 0) {
            this.draftCreateOrder('发起订单成功!');
          }
        })
      };
    },
    confirmAudit() {
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          this.auditorList.forEach(el => {
            if (this.auditForm.auditor == el.userId) {
              this.param.orderStatus = -1;
              this.param.handleBy = el.userId;
              this.param.handleByNo = el.number;
              this.param.handleByName = el.name;
              this.param.changePriceRemark = this.auditForm.remark;
            }
          });
          this.draftCreateOrder('提交审核成功!');
        }
      })
    },
    draftCreateOrder(operateText) {
      validDraftOrder(this.param,this.pathBool=='personal').then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: 'success',
            message: operateText,
            offset: 300
          })
          this.editOrderDialog = false;
          this.auditDialog = false;
          this.getDetail();
        }
      })
    },
    link() {
      getInitCode({ userId: this.orderInfo.belongId }).then(res => {
        let orderCodeInfo = {
          orderId: this.orderInfo.id,
          code: res.data.data
        }
        this.wxOrderLink = 'https://www.wotao.com/launch?orderCodeInfo=' + JSON.stringify(orderCodeInfo);
        this.pcOrderLink = process.env.VUE_APP_WEB_URL + 'order/order-initInfo?id=' + orderCodeInfo.orderId + '&link=' + orderCodeInfo.code;
        this.linkDialog = true;
      })
    },
    closeDialog() {
      this.editOrderDialog = false;
      this.getDetail();
    },
    update(row) {
      let obj = JSON.parse(JSON.stringify(row));
      obj.orderId = obj.id;
      obj.id = obj.spuId;
      this.hasSelectedProducts = [obj];
      this.editOrderDialog = true;
    },
    operate(row, operateName) {
      operateOrder({ orderId: row.id }, operateName, this.pathBool == 'personal').then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: 'success',
            message: res.data.msg,
            offset: 300
          })
          if (operateName == 'del') {
            sessionStorage.setItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value, JSON.stringify({
              page: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).page,
              screening: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).screening,//表单筛选信息
              ID: JSON.parse(sessionStorage.getItem('pigx-tag')).content.label,//页面标识
              orderSource: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).orderSource,
              orderType: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).orderType,
              detail: { query: {} }
            })
            );//保存页面信息
            this.$router.push('/personal/personal-order');
          } else {
            this.getDetail()
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.data.msg,
            offset: 300
          })
        };
      })
    },
    refresh() {
      this.getDetail();
    },
    submit() {
      if (this.orderInfo.remark == this.note) {
        this.noteDialog = false;
        this.$message({
          message: '修改备注成功！',
          type: 'success',
          offset: 300
        });
        this.getDetail();
      } else {
        let param = {
          id: this.orderInfo.id,
          remark: this.note,
        }
        updateRemark(param).then(res => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: 'success',
              message: '修改备注成功！',
              offset: 300
            })
            this.getDetail();
            this.noteDialog = false;
          }
        })
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
      this.note = this.orderInfo.remark;
      this.noteDialog = true;
    },
    getDetail() {
      let param = {
        orderId: this.orderId,
        sensitiveFlag: this.source == 0 ? false : true
      }
      getIneffectiveById(param, this.pathBool == 'personal').then(res => {
        this.orderInfo = res.data.data
        if (res.data.data.orderAddress) {
          res.data.data.orderAddress.areaNo = res.data.data.orderAddress.areaNo.split(',').map(Number);
        }
        this.receiveAddress = res.data.data.orderAddress;

        let params = this.orderInfo.clueType == 2 ?
          { clueCompanyId: this.orderInfo.clueId } :
          { cluePersonId: this.orderInfo.clueId }
        getClueDetail(params, this.orderInfo.clueType == 2 ? 1 : 0, this.source == 0 ? true : false).then(res => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.userData = res.data.data
            this.userData.clueType = this.clueType
          }
        })
      });
    },
    showDialog() {
      this.addressDialog = true
      let receiveAddress = JSON.parse(JSON.stringify(this.receiveAddress))
      this.areaForm = receiveAddress
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
  grid-template-columns: repeat(6, 1fr);
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

.detail-btn {
  margin: 0 10px;
}

.del-btn {
  margin-left: 30px;
}

.first {
  margin-left: 50px;
}

.code-sty {
  padding: 15px;
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  border-radius: 3px;
}

.link-title {
  font-size: 16px;
  font-weight: 550;
}

.link-copy {
  color: #36a6fe;
}

.wx-link {
  width: 300px;
  margin: 0 auto;
  font-size: 12px;
  color: #666666;
  text-align: center;
}

.audit-initorder {
  text-align: center;
}

.remark-area {
  width: 300px
}

.time-remark {
  display: grid;
  grid-template-columns: 16.67% 83.33%;
  grid-gap: 10px;
  padding: 20px;
}
</style>
