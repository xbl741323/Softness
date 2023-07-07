<!-- 排查完成 -->
<template>
  <div class="order-project"
    v-if="
      (filterState(portType, orderList.exportList, 'listJurisdiction') && !routeBool) || (permissions.bt_check_product_list_my && routeBool)">
    <div class="order-filter-item">
      <span class="order-name-sty">订单状态：</span>
      <el-radio-group v-model="orderForm.orderStatus" @change="getOrderList()">
        <el-radio-button v-for="(item, index) in statusList" :key="index" border :label="item.value"
          :class="['order-btn-sty', index > 0 ? 'order-border-sty' : '']">
          <span v-if="item.value == 0" class="circle-red"></span>
          <span v-if="item.value == 1" class="circle-red circlePurple"></span>
          <span v-if="item.value == 2" class="circle-blue"></span>
          <span v-if="item.value == 3" class="circle-blue circleYellow"></span>
          <span v-if="item.value == 4" class="success"><b>✔</b></span>
          <span>{{ item.label }}</span>
          <span v-if="item.value != null && item.value < 4">
            <span v-show="item.value == 0 && infoList.waitPayCount != null">({{ infoList.waitPayCount }})</span>
            <span v-show="item.value == 1 && infoList.waitSignPaperCount != null">({{ infoList.waitSignPaperCount
            }})</span>
            <span v-show="
              item.value == -1 && infoList.waitSignElectronCount != null
            ">({{ infoList.waitSignElectronCount }})</span>
            <span v-show="item.value == 2 && infoList.waitStartCount != null">({{ infoList.waitStartCount }})</span>
            <span v-show="item.value == 3 && infoList.inUseCount != null">({{ infoList.inUseCount }})</span>
          </span>
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="order-filter-item" v-if="orderType == 2">
      <span class="order-name-sty">知产类型:</span>
      <el-radio-group v-model="orderForm.productSubType"
        @change="(page.currentPage = 1), (hasTapBtn = true), getOrderList()">
        <el-radio-button class="radio-complex-sty" :class="{ 'radio-sty-left': index > 0 }"
          v-for="(item, index) in filterpropertyList" :key="index" :label="item.value" size="mini">{{ item.label
          }}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="order-filter-item" v-if="orderSource == 1">
      <span class="order-name-sty">尾款状态：</span>
      <el-radio-group v-model="orderForm.tailStatus" @change="getOrderList()">
        <el-radio-button v-for="(item, index) in tatusList" :key="index" border :label="item.value"
          :class="['order-btn-sty', index > 0 ? 'order-border-sty'
           : '']">
          <span v-if="item.value == 0" class="circle-blue circleYellow"></span>
          <span v-if="item.value == 1" class="circle-red"></span>
          <span v-if="item.value == 2" class="success"><b>✔</b></span>
          <span>{{ item.label }}</span>
        </el-radio-button>
      </el-radio-group>
    </div>
    <el-form @keyup.enter.native="(hasTapBtn = true), getAllList()" inline :model="orderForm">
      <el-form-item label="关键字：">
        <el-input v-model="orderForm.keyWords" placeholder="请输入用户名称/产品名称关键字/订单编号/电商订单编号" class="order-keywords" />
      </el-form-item>
      <el-form-item label="线索归属：">
        <el-input v-model="orderForm.clueBelongNo" placeholder="请输入员工姓名/工号" />
      </el-form-item>
      <el-form-item label="业务员：">
        <el-input v-model="orderForm.salesBelonging" placeholder="请输入员工姓名/工号" />
      </el-form-item>
      <el-form-item label="订单归属：">
        <el-input v-model="orderForm.belongName" placeholder="请输入员工姓名/工号" />
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker v-model="orderForm.createTime" :unlink-panels="true" type="datetimerange" range-separator="-"
          value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" start-placeholder="开始日期"
          end-placeholder="结束日期" class="order-time">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="线索归属方" aria-placeholder>
        <el-select v-model="orderForm.isDisabled">
          <el-option v-for="item in OptionList" :key="item.value" :label="item.partnerName" :value="item.partnerId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search"
        @click="(page.currentPage = 1), (hasTapBtn = true), getOrderList()">搜索</el-button>
      <el-button type="warning" @click="(hasTapBtn = true), resetOrder()">重置</el-button>
      <el-button type="primary"
        @click="filterState(portType, orderList.exportList, 'export'), (hasTapBtn = true), getExport()" v-if="
          filterState(portType, orderList.exportList, 'export') ||
          (routeBool && permissions.bt_tmOrder_export_product_my)
        ">数据导出</el-button>
      <!-- v-if="permissions.sys_tmOrder_export" -->
      <el-button v-if="(routeBool && !userInfo.isPartner && permissions.bt_open_task)" type="primary" class="botton_sty"
        :disabled="BoolBotton" @click="(hasTapBtn = true), openTaskFn()">开启任务
        <el-tooltip class="item" effect="dark" content="用于一次性付款的订单在付款前先开启任务，但需要走审核流程，请谨慎操作！" placement="top">
          <div class="tooltip_sty">?</div>
        </el-tooltip>
      </el-button>
    </el-form>
    <!-- 线上订单 -->
    <div v-show="orderSource == 1" class="order-list-sty">
      <avue-crud ref="multipleTable" v-if="orderSource == 1" :option="onlinetableOption" :data="orderListData"
        :page.sync="page" @size-change="sizeChange" @current-change="currentChange" v-loading="loading"
        @selection-change="selectionChange">
        <template slot="orderNo" slot-scope="scope">
          <el-tooltip class="item"  effect="dark" :content="'电商订单编号：'+scope.row.thirdOrderNo" placement="top" v-if="scope.row.thirdOrderNo">
            <span class="clickable" @click="toOnlineView(scope.row)">{{ scope.row.orderNo }}</span>
          </el-tooltip>   
          <div v-else>
            <span v-if="filterState(portType, orderList.exportList, 'detail') || (permissions.bt_sys_order_detail_product_my && routeBool)" class="clickable" @click="toOnlineView(scope.row)">{{ scope.row.orderNo }}</span>
            <span v-else>{{ scope.row.orderNo }}</span>
          </div>       
        </template>
        <!-- 订单归属 -->
        <template slot="belongName" slot-scope="scope">
          <el-tooltip v-if="scope.row.belongId != 0" effect="dark" :content="tooltipContent" placement="top">
            <span @mouseover="showUserInfo(scope.row.belongId)"><img src="/img/disable.png" class="emp_disabled"
                v-if="scope.row.userBelongLockFlag == 9" alt="" />{{ scope.row.belongName }}</span>
          </el-tooltip>
          <span v-else>
            <img src="/img/disable.png" class="emp_disabled" v-if="scope.row.userBelongLockFlag == 9" alt="" />{{
              scope.row.belongName }}</span>
        </template>
        <!-- 线索归属 -->
        <template slot="clueAttributionEmpName" slot-scope="scope">
          <el-tooltip effect="dark" :content="tooltipContent" placement="top">
            <span @mouseover="showUserInfo(scope.row.clueAttributionEmpId)"><img src="/img/disable.png"
                class="emp_disabled" v-if="scope.row.userBelongLockFlag == 9" alt="" />{{ scope.row.clueAttributionEmpName
                }}</span>
          </el-tooltip>
        </template>
        <!-- 业务员 -->
        <template slot="clueSalesmanEmpName" slot-scope="scope">
          <el-tooltip effect="dark" :content="tooltipContent" placement="top">
            <span @mouseover="showUserInfo(scope.row.clueSalesmanEmpId)"><img src="/img/disable.png" class="emp_disabled"
                v-if="scope.row.salesLockFlag == 9" alt="" />{{ scope.row.clueSalesmanEmpName }}</span>
          </el-tooltip>
        </template>
        <!-- 用户名称 -->
        <template slot="customerName" slot-scope="scope">
          <span v-show="scope.row.autStatus == 1" class="success-sty"><b>✔</b></span>
          <span v-if="scope.row.customerName">{{
            scope.row.customerName
          }}</span>
          <span v-else>待认证</span>
        </template>
        <!-- 订单状态 -->
        <template slot="orderStatus" slot-scope="scope">
          <span :class="{ waitAllot: scope.row.orderStatus == 1 }">
            <span :class="[
              scope.row.orderStatus == 0
                ? 'tostart'
                : scope.row.orderStatus == 2
                  ? 'blue-circle in-service'
                  : scope.row.orderStatus == 3
                    ? 'blue-circle circleRed'
                    : scope.row.orderStatus == 4
                      ? 'newsuccess'
                      : scope.row.orderStatus == 6
                        ? 'blue-circle circleRed'
                        : '',
            ]"><b v-if="scope.row.orderStatus == 4">✔</b></span>
            <span v-if="scope.row.orderStatus != 1">{{
              scope.row.orderStatus | orderStatus
            }}</span>
            <span v-if="scope.row.orderStatus == 1">{{
              scope.row.contractType == 1 ? "待签约-电子" : "待签约-纸质"
            }}</span>
          </span>
          <p class="price-status" v-if="
            scope.row.tmOrderPayment &&
            scope.row.tmOrderPayment.payType &&
            scope.row.tmOrderPayment.payType != null
          ">
            {{ scope.row.tmOrderPayment.payStatus | payStatus }}
          </p>
          <el-tooltip :disabled="!scope.row.handleMessage" class="item" effect="dark" :content="scope.row.handleMessage"
            placement="top-start">
            <p class="price-status">
              {{ scope.row.changePriceStatus | changePriceStatus }}
            </p>
          </el-tooltip>
          <p class="price-status">
            {{ scope.row.refundStatus | refundStatus }}
          </p>
          <p class="price-status" v-if="!scope.row.tmOrderPayment">
            {{
              scope.row.orderStatus == 2 || scope.row.orderStatus == 3
              ? "全款待付"
              : ""
            }}
          </p>
        </template>
        <!-- 0227修改 -->
        <template slot-scope="{row}" slot="orderPort">
          <div v-if="(row.orderSource && row.orderSource == 2 && row.orderPort != null)">
            <span>{{ row.orderSource | filterOrderSource }}</span>
            <span>{{ row.orderChannel | filterOrderChannel }}</span>
          </div>
          <span v-if="row.orderSource && row.orderSource == 1 && row.orderPort != null">{{ row.orderPort | orderPort }}</span>
        </template>
        <!-- 尾款状态 -->
        <template slot="tailStatus" slot-scope="scope">

          <div v-if="scope.row.orderStatus == 6">无</div>
          <div class="order-status-sty" v-else>
            <span v-if="scope.row.tailStatus == 0" class="circle-blue circleYellow"></span>
            <span v-if="scope.row.tailStatus == 1" class="circle-red"></span>
            <span v-if="scope.row.tailStatus == 2" class="success"><b>✔</b></span>
            <span>{{ scope.row.tailStatus | tailStatusFilter }}</span>
          </div>
        </template>
        <template slot="totalAmount" slot-scope="scope"><span>{{
          scope.row.tailStatus == 0 ? "待定" : scope.row.totalAmount || "待定"
        }}</span></template>
        <template slot="orderDetail.productName" slot-scope="scope"><span>{{ scope.row.orderDetail.productName}}</span></template>
        <template slot="orderDetail.productCount" slot-scope="scope"><span>{{ scope.row.orderDetail.productCount}}</span></template>
        <template slot="platformSource" slot-scope="scope"><span>{{scope.row.platformSource | whereplatSource}}</span></template>
        <template slot="menu" slot-scope="scope">
          <el-button v-if="
            (filterState(portType, orderList.exportList, 'detail') && !routeBool) ||
            (permissions.bt_sys_order_detail_product_my && routeBool)
          " type="text" @click="toOnlineView(scope.row)">查看</el-button>
          <el-button type="text" class="mt" v-if="
            ((scope.row.orderStatus == 0 ||
              scope.row.orderStatus == 1 ||
              (scope.row.orderStatus == 3 && !scope.row.tmOrderPayment) ||
              ((scope.row.tailStatus == 0 || scope.row.tailStatus == 1) &&
                (scope.row.orderStatus == 2 || scope.row.orderStatus == 3) &&
                ((scope.row.tmOrderPayment &&
                  scope.row.tmOrderPayment.payStatus != 1) ||
                  !scope.row.tmOrderPayment)) ||
              (scope.row.orderStatus == 2 &&
                scope.row.tailStatus == 3 &&
                scope.row.payStatus === 0)) &&
              scope.row.changePriceStatus != 1 &&
              ((filterState(portType, orderList.exportList, 'change') && !routeBool) ||
                (permissions.bt_change_price_product_my && routeBool))) && !userInfo.isPartner
          " @click="EditPrice(scope.row.id, scope.row)">改价</el-button>
          <!-- 支付凭证按钮显示判断 -->
          <!-- 一次性付款型 -->
          <el-button type="text" @click="showPayVoucher(scope.row)" v-if="
            ((scope.row.changePriceStatus != 1 &&
              scope.row.orderStatus != 1 &&
              scope.row.orderStatus != 6 &&
              ((scope.row.orderStatus == 0 && scope.row.tailStatus == 3) ||
                (scope.row.orderStatus == 2 &&
                  !scope.row.tmOrderPayment &&
                  scope.row.tailStatus == 3)) &&
              ((scope.row.tmOrderPayment &&
                scope.row.tmOrderPayment.payStatus != 1 &&
                !scope.row.tmOrderPayment) ||
                !scope.row.tmOrderPayment)) ||
              (scope.row.orderStatus == 3 && !scope.row.tmOrderPayment)) &&
            ((filterState(portType, orderList.exportList, 'payment') && !routeBool) ||
              (permissions.bt_payment_document_product_my && routeBool)) && ![1,2,3].includes(scope.row.refundStatus)
          ">支付凭证</el-button>
          <!-- 定金尾款型 -->
          <el-button type="text" @click="showPayVoucher(scope.row)" v-if="
            scope.row.changePriceStatus != 1 &&
            scope.row.orderStatus != 1 &&
            scope.row.orderStatus != 6 &&
            scope.row.tailStatus != 3 &&
            ((scope.row.orderStatus == 0 && !scope.row.tmOrderPayment) ||
              (scope.row.orderStatus == 0 &&
                scope.row.tmOrderPayment &&
                scope.row.tmOrderPayment.payStatus != 1) ||
              (scope.row.tailStatus == 1 && !scope.row.tmOrderPayment) ||
              (scope.row.tailStatus == 1 &&
                scope.row.tmOrderPayment &&
                scope.row.tmOrderPayment.payStatus != 1)) &&
            ((filterState(portType, orderList.exportList, 'payment') && !routeBool) ||
              (permissions.bt_payment_document_product_my && routeBool)) && ![1,2,3].includes(scope.row.refundStatus)
          ">支付凭证</el-button>
          <el-button v-if="scope.row.tmOrderPayment&&scope.row.tmOrderPayment.payStatus != 1 && [2,3,4].includes(scope.row.orderStatus) && ![1,2,3,4].includes(scope.row.refundStatus) && [2,3].includes(scope.row.orderChannel) && scope.row.orderSource == 2" type="text" @click="showRefund(scope.row)">退款</el-button>
        </template>
      </avue-crud>
    </div>
    <!-- 订单改价 -->
    <el-dialog title="订单改价" :visible.sync="changepriceDialog" width="1100px" :close-on-click-modal="false">
      <onlinechangeprice v-if="changepriceDialog" :portType="portType" :priceObject="priceObject"
        :finalPriceTypeNum="finalPriceTypeNum" :hasFinalprice="hasFinalprice" :source="source"
        @closeChangePriceDialog="closeChangePriceDialog" @handlerefresh="handlerefresh"></onlinechangeprice>
    </el-dialog>
    <!-- 数据导出进度条 -->
    <el-dialog title="数据导出中，请稍后..." :visible.sync="exportDialog" width="450px" top="350px" :close-on-click-modal="false">
      <el-progress :text-inside="true" :stroke-width="24" :percentage="percent" status="success"></el-progress>
    </el-dialog>
    <!-- 支付凭证弹窗 -->
    <pay-voucher :portType="portType" @refresh="getOrderList" ref="payVoucher"></pay-voucher>
    <el-dialog top="5vh" :visible.sync="refundBox" :before-close="handleCancle" title="退款确认" width="640px" :close-on-click-modal="false">
      <launch-refund ref="refundBox" v-if="refundBox" :form="refundForm" @closeBox="handleCancle" @refresh="handlerefresh"></launch-refund>
    </el-dialog>
    <!-- 开启任务弹窗 -->
    <el-dialog center title="订单未付款，如需提前开启任务，将进行人工审核" :close-on-click-modal="false" :visible.sync="dialogTask" width="50%"
      :before-close="handleClose">
      <span class="red_sty">*</span><span class="common_bot">审核人:</span>
      <el-select v-model="approveForm.audit" @change="selectAudit" placeholder="请选择审核人">
        <el-option v-for="item in optionsList" :key="item.userId" :label="item.name"
          :value="item.userId"></el-option></el-select><br />
      <div class="popup_sty">
        <div class="common_bot_sty">备注:</div>
        <el-input type="textarea" placeholder="请输入内容" v-model.trim="textarea" maxlength="100" show-word-limit clearable
          rows="4"></el-input>
      </div>
      <span slot="footer" class="dialog-footer"><el-button @click="cancelPopup()">取 消</el-button><el-button type="primary"
          @click="submitTask()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAuditor } from "@/api/order";
import { amendTaskState, sendTaskState } from "@/api/personal/taskval";
import orderData from "@/components/order/order-data.js";
import { getEmpList, dataExport, dataExportProgress } from "@/api/clue/clue";
import { onlinetableOption } from "@/const/crud/order/online-property.js";
import Onlinechangeprice from "./online/onlinechangeprice.vue";
import payVoucher from "./online/pay-voucher";
import launchRefund from "./online/launch-refund";
import * as CodeMsg from "@/api/common/CodeChange";
import {
  getProductList,
  getStatusCount,
  getMyProductList,
  getMyStatusCount,
  getOptionList,
} from "@/api/admin/user";
import { priceMixin } from "./mixin.js";
import { mapGetters } from "vuex";
import orderList from "@/views/order/order-data.js";
export default {
  mixins: [priceMixin],
  props: {
    portType: {
      type: String,
      value: "",
    },
    source: {
      //引用来源 personal-个人中心 list-订单管理
      type: String,
      required: true,
    },
    orderType: {
      // type:String,
      //订单类型 null-全部 2-知产订单 1-项目订单
      required: true,
    },
    orderSource: {
      // type:String,
      // 订单来源  0-线下（线下订单已经没了），1-产品订单，2-课程订单，3-课堂会员订单
      required: false,
    },
    showfilterproperty: {
      // 知产类型筛选项
      type: Boolean,
      required: false,
    },
    showfilterLatestMoney: {
      // 项目尾款状态筛选项
      type: Boolean,
      required: false,
    },
    portType: {
      type: String,
      value: '1'
    }
  },
  components: {
    Onlinechangeprice,
    payVoucher,
    launchRefund
  },
  //  props:{
  //   portType:{
  //     type:String,
  //     value:'1'
  //   }
  // },
  data() {
    return {
      userInfo: JSON.parse(sessionStorage.getItem('pigx-userInfo')).content,
      orderList: null,
      exportState: false,
      OptionList: [],
      refundForm: {},
      routeBool: this.$route.path.includes("/personal-order"),
      auditor: [],
      optionsList: [],
      approveForm: {
        audit: null,
      },
      oldRow: null,
      textarea: null,
      dialogTask: false,
      refundBox: false,
      BoolBotton: true,
      taskData: {},
      statusList: orderData.statusList,
      tatusList: orderData.finalStatusList,
      infoList: {},
      loading: false,
      hasTapBtn: false,
      orderStatusList: [],
      filterpropertyList: orderData.filterpropertyList,
      filterLatestMoneyList: orderData.filterLatestMoneyList,
      payStatusList: orderData.payStatusList,
      isResouceShow: 0, //防止el组件警告
      empList: [],
      onlinetableOption: [],
      orderListData: [],
      orderForm: {
        isDisabled: null,
        keyWords: "",
        orderStatus: null,
        productSubType: 2,
        tailStatus: null,
        autStatus: null,
      },
      page: {
        pageSize: 20,
        currentPage: 1,
        pages: [5, 10, 20, 50],
      },
      orderInfo: {},
      orderNo: null,
      currentUserId: "",
      exportDialog: false,
      percent: 0,
    };
  },
  filters: {
    filterOrderPort(val) {
      return val == "PC" ? "WEB" : val == "APPLET" ? "小程序" : "";
    },
    filterOrderChannel(val) {
      return val == 1 ? 'wotao' : val == 2 ? '京东' : '淘宝';
    },
    filterOrderSource(val) {
      return val == 1 ? '自主下单' : val == 2 ? '后台发起-' : ''
    },
    orderStatus(value) {
      return orderData.onlinetransformOrderStatus(value);
    },
    totalAmount(value) {
      return orderData.totalAmount(value);
    },
    whereplatSource(value) {
      return orderData.wherePlat(value);
    },
    fiterpaytailStatus(value) {
      return orderData.paytailStatus(value);
    },
    tailStatusFilter(value) {
      return value == 0
        ? "待定"
        : value == 1
          ? "待付款"
          : value == 2
            ? "已结清"
            : "无";
    },
    changePriceStatus(val) {
      return orderData.changePriceStatus(val);
    },
    refundStatus(val) {
      return orderData.refundStatus(val);
    },
    orderPort(val) {
      return orderData.orderPort(val);
    },
    payStatus(val) {
      return val == 1
        ? "对公转账审核中"
        : val == 2
          ? "对公转账审核已通过"
          : val == 3
            ? "对公转账审核未通过"
            : "";
    },
  },
  computed: {
    changeOrderType() {
      return this.orderType;
    },
    changeSource() {
      return this.orderSource;
    },
    ...mapGetters(["permissions"]),
  },
  watch: {
    changeOrderType(val) {
      if (val || val == null) {
        this.page.currentPage = 1;
        this.hasTapBtn = true;
        this.getOrderList();
      }
    },
    changeSource(val) {
      if (val == 0 || val == 1) {
        this.orderForm.clueBelongNo = "";
        this.page.currentPage = 1;
        this.hasTapBtn = true;
        this.orderForm.orderStatus = null;
        this.getOrderList();
      }
    },
  },
  created() {
    // if ( !filterState(portType, orderList.exportList, 'listJurisdiction')&&!routeBool  ){
    //   this.$notAuthorized();
    // }
    // 表头字段(订单管理无尾款状态)，
    let newOption = JSON.parse(JSON.stringify(onlinetableOption));
    if (this.showfilterproperty) {
      // newOption.column.splice(10,1)
      // this.onlinetableOption = newOption
      this.onlinetableOption = onlinetableOption;
      if (this.routeBool) {
        this.onlinetableOption.selection = true;
      } else {
        this.onlinetableOption.selection = false;
      }
    } else {
      this.onlinetableOption = onlinetableOption;
      if (this.routeBool) {
        this.onlinetableOption.selection = true;
      } else {
        this.onlinetableOption.selection = false;
      }
    }
    // 详情里跳详情
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      if (
        keepParams.detail.path !== "" &&
        keepParams.detail.path == "/contracts-detail"
      ) {
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query,
        });
        return;
      }
      if (
        keepParams.detail.path !== "" &&
        keepParams.detail.path == "/mycontracts-detail"
      ) {
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query,
        });
        return;
      }
    }
    if (
      sessionStorage.getItem(
        JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
      ) &&
      JSON.parse(
        sessionStorage.getItem(
          JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
        )
      ).detail &&
      JSON.stringify(
        JSON.parse(
          sessionStorage.getItem(
            JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
          )
        ).detail.query
      ).length > 2
    ) {
      if (
        sessionStorage.getItem("whichdetail") &&
        sessionStorage.getItem("whichdetail") == 1
      ) {
        this.$router.push({
          path: "/orderonline-detail",
          query: JSON.parse(
            sessionStorage.getItem(
              JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
            )
          ).detail.query,
        });
      } else if (sessionStorage.getItem("whichdetail") == 3) {
        this.$router.push({
          path: "/initorder-detail",
          query: JSON.parse(
            sessionStorage.getItem(
              JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
            )
          ).detail.query,
        });
      } else {
        this.$router.push({
          path: "/order-detail",
          query: JSON.parse(
            sessionStorage.getItem(
              JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
            )
          ).detail.query,
        });
      }
    } else {
      if (
        sessionStorage.getItem(
          JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
        ) &&
        JSON.parse(
          sessionStorage.getItem(
            JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
          )
        ).ID != JSON.parse(sessionStorage.getItem("pigx-tag")).content.label
      ) {
        this.orderForm = JSON.parse(
          sessionStorage.getItem(
            JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
          )
        ).screening
          ? JSON.parse(
            sessionStorage.getItem(
              JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
            )
          ).screening
          : {};
        this.page = JSON.parse(
          sessionStorage.getItem(
            JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
          )
        ).page;
      } else {
        if (
          sessionStorage.getItem(
            JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
          )
        ) {
          this.orderForm = JSON.parse(
            sessionStorage.getItem(
              JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
            )
          ).screening
            ? JSON.parse(
              sessionStorage.getItem(
                JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
              )
            ).screening
            : {};
          this.page = JSON.parse(
            sessionStorage.getItem(
              JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
            )
          ).page;
          this.$emit("changeSource", "1");
          this.$emit(
            "changeType",
            JSON.parse(
              sessionStorage.getItem(
                JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
              )
            ).orderType
          );
        }
        if (this.orderForm.orderStatus == undefined) {
          this.orderForm.orderStatus = null;
        }
      }
      this.getDropList();
      this.getOrderList();
    }
  },
  mounted() {
    this.currentUserId = this.$store.state.user.userInfo.id;
  },
  methods: {
    cancelPopup() {
      this.dialogTask = false;
      this.approveForm.audit = null;
      this.textarea = null;
    },
    getAuditor() {
      getAuditor().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.optionsList = res.data.data;
        }
      });
    },
    submitTask() {
      let id = this.approveForm.audit;
      if (id) {
        let data = {
          preAuditorId: id,
          preAuditorName: this.auditor[0].name,
          // organization: this.taskData.organization,
          remark: this.textarea,
          flowNo: this.taskData.clueNo,
          orderId: this.taskData.id,
        };
        amendTaskState(data).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.approveForm.audit = null;
            // this.optionsList = res.data.data
            this.$message({
              type: "success",
              message: "发起审批成功",
            });
            this.getOrderList();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
            });
          }
          this.$refs.multipleTable.toggleRowSelection(this.taskData, false);
          this.approveForm.audit = null;
          this.textarea = null;
          this.taskData = null;
          this.auditor = [];
        });
        this.dialogTask = false;
      } else {
        this.$message({ type: "error", message: "请选择待审核人" });
      }
    },
    // 选择审核人
    selectAudit(val) {
      this.chooseAudit = this.optionsList.filter((item) => {
        return item.userId == val;
      });
      this.auditor = this.chooseAudit;
    },
    selectionChange(val) {
      if (val.length != 1) {
        this.BoolBotton = true;
      } else {
        this.taskData = val[0];
        this.BoolBotton = false;
      }
    },
    // 开启任务
    async openTaskFn() {
      if (this.taskData.orderStatus != 0) {
        this.$alert("仅待付款状态订单可以提前开始任务", "", {
          confirmButtonText: "确定",
        });
      } else {
        if (this.taskData.tailStatus != 3) {
          this.$alert("所选订单支付类型无法提前开启任务", "", {
            confirmButtonText: "确定",
          });
        } else if (
          this.taskData.changePriceStatus &&
          this.taskData.changePriceStatus == 1
        ) {
          this.$alert("该订单有待审核的改价流程，无法开启任务！", "", {
            confirmButtonText: "确定",
          });
        } else {
          await this.getAuditor();
          this.dialogTask = true;
        }
      }
      console.log(this.taskData);
      let data = {
        orderId: this.taskData.id,
        changePriceStatus: this.taskData.changePriceStatus,
      };
      sendTaskState(data).then((res) => { });
    },
    handleClose(done) {
      this.approveForm.audit = null;
      this.textarea = null;
      this.auditor = [];
      done();
    },
    // 显示支付凭证弹窗
    showPayVoucher(row) {
      this.$nextTick(() => {
        this.$refs["payVoucher"].openVisble = true;
        this.$refs["payVoucher"].categoryId = row.categoryId;
        this.$refs["payVoucher"].payForm.orderNo = row.orderNo;
        this.$refs["payVoucher"].payForm.payAmount = this.transPayVal(row);
        this.$refs["payVoucher"].payForm.remarks = `订单号：${row.orderNo}`;
        this.$refs["payVoucher"].payForm.orderPort = row.orderPort;
        this.$refs["payVoucher"].payForm.addressId = row.addressId;
        this.$refs["payVoucher"].payForm.paymentId = row.waitPayment.id;
      });
    },
    showRefund(row){
      let copy = Object.assign({}, row);//深拷贝，解决编辑弹框取消编辑，不更改数据源
      this.refundForm = copy;
      this.refundBox = true;
    },
     // 点击取消按钮
    handleCancle() {
        this.refundBox = false;
        this.refundForm = null;
    },
    // 判断获取当前应付金额
    transPayVal(row) {
      // 首先判断定金尾款还是一次性付款类型
      if (row.tailStatus == 3) {
        return row.totalAmount;
      } else {
        // 其次判断定金是否已支付
        return row.waitPayment.payAmount;
      }
    },
    handlerefresh() {
      this.getAllList();
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getOrderList();
    },
    orderAllot(row) {
      this.orderNo = row.orderNo;
      this.orderInfo = row.orderDetail;
      this.orderAllotDialog = true;
    },
    toView(row) {
      this.$router.push({
        path: "/order-detail",
        query: {
          orderId: row.id,
          source: this.source,
        },
      });
      sessionStorage.setItem("whichdetail", 0);
    },
    toOnlineView(row) {
      this.$router.push({
        path: "/orderonline-detail",
        query: {
          orderId: row.id,
          source: this.source,
          portType: row.categoryId,
        },
      });
      sessionStorage.setItem("whichdetail", parseInt(this.orderSource));
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getOrderList();
    },
    currentChange(val) {
      console.log(val);
      this.page.currentPage = val;
      this.getOrderList();
    },
    resetOrder() {
      this.orderForm = {
        orderStatus: null,
        clueBelongNo: "",
        clueBelonging: "",
        userBelongNo: "",
        salesBelonging: "",
        engineerNo: "",
        keyWords: "",
        productSubType: 2,
        tailStatus: null,
        isDisabled: null,
      };
      if (this.source == "personal") {
        this.$emit("changeType", null);
      }
      this.getOrderList();
    },
    getOrderList() {
      this.loading = true;
      sessionStorage.setItem(
        JSON.parse(sessionStorage.getItem("pigx-tag")).content.value,
        JSON.stringify({
          page: this.page,
          screening: this.orderForm, //表单筛选信息
          ID: JSON.parse(sessionStorage.getItem("pigx-tag")).content.label, //页面标识
          orderSource: this.orderSource, // 订单来源
          orderType: this.orderType, // 订单类型
          detail: { query: {} },
        })

      ); //保存页面信息
      let filterObj = {
        belongInfo: this.orderForm.belongName,
        clueAttributionEmpInfo: this.orderForm.clueBelongNo,
        clueSalesmanEmpInfo: this.orderForm.salesBelonging,
        keyWord: this.orderForm.keyWords,
        partnerId: this.orderForm.isDisabled,
        startTime:
          this.orderForm.createTime == null
            ? ""
            : this.$moment(this.orderForm.createTime[0]).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
        endTime:
          this.orderForm.createTime == null
            ? ""
            : this.$moment(this.orderForm.createTime[1]).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
        categoryId:
          this.orderType == 2
            ? this.orderForm.productSubType == 2
              ? null
              : this.orderForm.productSubType
            : this.orderType,
        orderStatus:
          this.orderForm.orderStatus == -1 ? 1 : this.orderForm.orderStatus,
        contractType:
          this.orderForm.orderStatus == -1
            ? 1
            : this.orderForm.orderStatus == 1
              ? 2
              : null,
        tailStatus: this.orderForm.tailStatus,
        pageNo: this.page && this.page.currentPage ? this.page.currentPage : 1,
        pageSize: this.page && this.page.pageSize ? this.page.pageSize : 20,
      };
      if (this.orderType == 2 && this.orderForm.productSubType == 2) {
        filterObj.categoryIds = [3, 4, 5, 6];
      }
      if (this.routeBool) {

        getMyProductList(filterObj).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.orderListData = res.data.data.records;
            this.page.total = res.data.data.total;
            this.loading = false;
          }
        });
      } else {
        getProductList(filterObj, this.portType).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.orderListData = res.data.data.records;
            this.page.total = res.data.data.total;
            this.loading = false;
          }
        });
      }
      //订单状态-统计数据
      let params = {
        // isDisabled: this.orderForm.isDisabled,
        categoryId:
          this.orderType == 2
            ? this.orderForm.productSubType == 2
              ? null
              : this.orderForm.productSubType
            : this.orderType,
        belongInfo: this.orderForm.belongName,
        clueAttributionEmpInfo: this.orderForm.clueBelongNo,
        clueSalesmanEmpInfo: this.orderForm.salesBelonging,
        keyWord: this.orderForm.keyWords,
        tailStatus: this.orderForm.tailStatus,
        startTime:
          this.orderForm.createTime == null
            ? ""
            : this.$moment(this.orderForm.createTime[0]).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
        endTime:
          this.orderForm.createTime == null
            ? ""
            : this.$moment(this.orderForm.createTime[1]).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
      };
      if (this.orderType == 2 && this.orderForm.productSubType == 2) {
        params.categoryIds = [3, 4, 5, 6];
      }
      if (this.source == "personal") {
        getMyStatusCount(params).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.infoList = res.data.data;
          }
        });
      } else {
        getStatusCount(params).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.infoList = res.data.data;
          }
        });
      }
    },
    getDropList() {
      this.orderList = orderList;
      // this.exportState =filterState(this.portType, this.orderList.exportList)
      // this.changePriceState=filterState(this.portType, this.orderList.changePriceList)
      // this.detailState=filterState(this.portType, this.orderList.detailList)
      getOptionList().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.OptionList = res.data.data;
        }
      });
      getEmpList(true)
        .then((res) => {
          //全部员工
          ++this.isResouceShow;
          this.empList = res.data.data;
        })
        .catch((err) => {
          return false;
        });
    },
    getExport() {
      this.exportDialog = true;
      this.dataExport();
      let progress = null;
      let timer = setInterval(() => {
        progress = this.getProgress();
        if (progress == 100) {
          clearInterval(timer);
          this.exportDialog = false;
        }
      }, 500);
    },
    // 获取进度
    getProgress() {
      let progress = null;
      dataExportProgress(this.portType).then((res) => {
        progress = res.data.data;
      });
      if (progress == 1.0 || progress == "1.0" || progress == null) {
        this.percent = 100;
      } else {
        this.percent = Number(progress) * 100;
      }
      return this.percent;
    },
    // 数据导出
    dataExport() {
      let params = {
        isDisabled: this.orderForm.isDisabled,
        belongInfo: this.orderForm.belongName,
        clueAttributionEmpInfo: this.orderForm.clueBelongNo,
        clueSalesmanEmpInfo: this.orderForm.salesBelonging,
        keyWord: this.orderForm.keyWords,
        startTime:
          this.orderForm.createTime == null
            ? ""
            : this.$moment(this.orderForm.createTime[0]).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
        endTime:
          this.orderForm.createTime == null
            ? ""
            : this.$moment(this.orderForm.createTime[1]).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
        categoryId:
          this.orderType == 2
            ? this.orderForm.productSubType == 2
              ? null
              : this.orderForm.productSubType
            : this.orderType,
        orderStatus:
          this.orderForm.orderStatus == -1 ? 1 : this.orderForm.orderStatus,
        contractType:
          this.orderForm.orderStatus == -1
            ? 1
            : this.orderForm.orderStatus == 1
              ? 2
              : null,
        tailStatus: this.orderForm.tailStatus,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      if (this.orderType == 2 && this.orderForm.productSubType == 2) {
        params.categoryIds = [3, 4, 5, 6];
      }
      dataExport(params, this.portType).then((response) => {
        let url = window.URL.createObjectURL(new Blob([response.data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        let num = "";
        for (let i = 0; i < 10; i++) {
          num += Math.ceil(Math.random() * 10);
        }
        link.setAttribute("download", "订单数据_" + num + ".xlsx");
        document.body.appendChild(link);
        link.click();
      });
    },
  },
};
</script>

<style scoped>
.red_sty {
  color: red;
}

.common_bot_sty {
  margin-bottom: 20px;
  width: 56px;
}

.popup_sty {
  margin-top: 20px;
  display: flex;
}

.botton_sty {
  color: #fff;
  margin: 0 10px;
  position: relative;
}

.tooltip_sty {
  line-height: 12px;
  text-align: center;
  position: absolute;
  top: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgb(216, 233, 120);
  font-size: 10px;
}

.common_bot {
  width: 80px;
  margin-bottom: 20px;
}

.order-project {
  font-size: 14px;
  height: 100%;
  background: #fff;
  padding: 10px;
}

.order-status-sty {
  display: flex;
  justify-content: center;
  align-items: center;
}

.success-sty {
  font-weight: bolder;
  font-size: 12px;
  color: green;
  margin-right: 6px;
}

.el-radio.is-bordered+.el-radio.is-bordered {
  margin-left: 0;
}

.order-emplist {
  width: 100px;
}

.order-time {
  width: 330px;
}

.order-filter-item {
  margin: 0 0 15px 0;
}

.order-keywords {
  width: 320px;
}

.radio-complex-sty {
  margin-left: 12px;
}

.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}

.blue-circle {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 7px;
}

.newsuccess {
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

.clickable {
  color: #36a6fe;
  cursor: pointer;
}

.order-status {
  margin: 8px 0 16px 0;
}

.order-type {
  margin: 0 0 16px 20px;
}

.order-name-sty {
  font-size: 14px;
  color: #606266;
}

.waitAllot {
  color: #ff6600;
}

.order-btn-sty {
  margin: 0 20px 0 0;
}

.order-border-sty {
  border-left: 1px solid #dcdfe6;
}

.tostart {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 7px;
}

.mt {
  margin-left: 10px;
}

.price-status {
  margin: 0;
  color: #bbbbbb;
}

.order-list-sty {
  margin-top: 10px;
}
</style>

<style>
.order-project .avue-crud__tip {
  display: none !important;
}
</style>
