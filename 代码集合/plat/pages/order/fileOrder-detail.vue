<template>
  <div class="my-order">
    <member-head></member-head>
    <div class="my-order-frame">
      <div class="breadcrumb">
        <a @click="jump('/member/order')" class="breadcrumb-first">我的订单</a>
        >
        <a>订单详情</a>
      </div>
      <div class="order-box">
        <div class="order-head">
          <div class="order-info-left">
            <div class="order">
              <p :class="orderDetail.orderStatus == 2 ? 'gray-color' : ''">订单号：{{ orderDetail.orderNo }}</p>
              <img
                src="~assets/images/order/copy_icon@2x.png"
                class="orderNo"
                :data-clipboard-text="orderDetail.orderNo"
                @click="copy()"
              />
            </div>
            <template>
              <p :class="orderDetail.orderStatus == 1 ? 'blue-color order-status' : orderDetail.orderStatus == 2 ? 'gray-color order-status' : 'order-status'">
                {{ orderDetail.orderStatus | orderStatus }}
              </p>
              <p
                class="pay-order"
                v-if="orderDetail.orderStatus == 0"
                @click="toPay()"
              >
                去付款
              </p>
              <p
                v-if="orderDetail.orderStatus == 0"
                class="cancel-order"
                @click="updateStatus(orderDetail, 6, '取消')"
              >
                取消订单
              </p>
              <p
                class="delte-order"
                v-if="orderDetail.orderStatus == 2"
                @click="updateStatus(orderDetail, 7, '删除')"
              >
                删除订单
              </p>
            </template>
          </div>
          <!-- 进度条 -->
          <div class="progress">
            <div class="steps">
              <div class="step-status">
                <img
                  src="~assets/images/order/tijiao_icon@2x.png"
                  v-if="orderDetail.createTime && orderDetail.orderStatus != 2"
                />
                <img
                  src="~assets/images/order/tijiao_icon_cancel@2x.png"
                  v-else
                />
                <p>提交订单</p>
                <p class="mytime">{{ orderDetail.createTime }}</p>
              </div>
              <div
                :class="orderDetail.createTime && orderDetail.orderStatus != 2 ? 'line active-line' : 'line'"
              ></div>
              <div class="step-status">
                <img
                  src="~assets/images/order/tijiao_icon@2x.png"
                  v-if="payTime && orderDetail.orderStatus != 2"
                />
                <img
                  src="~assets/images/order/wait_icon_light@2x.png"
                  v-else-if="orderDetail.createTime && orderDetail.orderStatus != 2"
                />
                <img src="~assets/images/order/wait_icon@2x.png" v-else />
                <p v-if="payTime">支付订单</p>
                <p v-else-if="orderDetail.createTime">待支付</p>
                <p class="mytime">{{ payTime }}</p>
              </div>
              <div
                :class="payTime ? 'line active-line' : 'line'"
              ></div>
              <div class="step-status">
                <img
                  src="~assets/images/order/tijiao_icon@2x.png"
                  v-if="updateTime&&payTime"
                />
                <img src="~assets/images/order/wait_icon@2x.png" v-else />
                <p>已完成</p>
                <p class="mytime">{{ payTime ? updateTime : null }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 项目申报 -->
        <div class="order-info">
          <div class="price price-project">
            <div class="user-class" @click="toFile(orderDetail)">
              <img :src="imgUrl + userInfo.diyLogoUrl" alt="" v-if="userInfo.diyLogoUrl">
              <img src="~assets/images/member/morentouxiang.png" alt="" v-else>
              <span class="username-class">{{orderDetail.userName}}</span>
            </div>
            <div class="product" @click="toFile(orderDetail)">
              <img
                  :src="imgUrl + orderDetail.fileImageUrl"
                  @click="toFile(orderDetail)"
                  class="file-img"
              />
              <img :src="iconUrl[orderDetail.fileType]" alt="" class="icon-position">
              <p class="order-name">{{ orderDetail.fileName }}</p>
            </div>
            <div class="num-class">
              <p class="price-title">数量</p>
              <p class="project-price">1</p>
            </div>
            <div class="num-class">
              <p class="price-title">{{orderDetail.orderStatus == 1 ? '已支付' : '应支付金额：'}}</p>
              <p class="amount">￥{{ orderDetail.price|filterAmount }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 任务/付款信息 -->
    <div class="task-pay-info">
      <span class="tab-span">付款信息</span>
      <div class="info-table">
        <el-table
          :data="payList"
          border
          :header-cell-style="cell"
        >
          <el-table-column
            label="付款时间"
            prop="payTime"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.createTime">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="buyNum" align="center">
            <template>
              <span>1</span>
            </template>
          </el-table-column>
          <el-table-column
            label="费用单价"
            prop="onePrice"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.price">￥{{ scope.row.price|filterAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.price">￥{{ scope.row.price|filterAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="支付方式" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.payChannel != null">{{ scope.row.payChannel|filterPayChannel }}</span>
            </template>
          </el-table-column>
          <el-table-column label="支付流水号" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.tradeNo">{{ scope.row.tradeNo }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog
      :visible.sync="commonDialog"
      width="0"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    ></el-dialog
    ><!-- 遮罩层 -->
    <!-- 取消/删除订单弹框 -->
    <div v-if="delDialog" class="del-box">
      <p class="del-title">{{ title }}订单</p>
      <img
        v-if="mouseOver"
        @mouseover="mouseOver = false"
        src="~/assets/images/order/guanbi_icon_dark@2x.png"
      />
      <img
        v-else
        @mouseleave="mouseOver = true"
        src="~/assets/images/order/guanbi_icon@2x.png"
        @click="(delDialog = false), (commonDialog = false)"
      />
      <p class="del-content">订单{{ title }}后无法恢复，是否确认{{ title }}?</p>
      <div class="del-btn">
        <div
          class="cancel-del-btn"
          @click="(delDialog = false), (commonDialog = false)"
        >
          再想想
        </div>
        <div
          class="cancel-del-btn confirm-del-btn"
          @click="updateOrderStatus(orderInfo, delStatus, title)"
        >
          提交
        </div>
      </div>
    </div>
    <!-- 订阅消息 -->
    <focusTip></focusTip>
  </div>
</template>

<script>
import memberHead from "~/components/member/head";
import {
  updateOrder,
  getTaskProcessList,
} from "~/api/order";
import { getDetailInfoById, cancelFileOrder, deleteFileOrder } from '~/api/fileorder'
import orderData from "~/pages/member/order/productOrder/order-data";
import ClipboardJS from "clipboard";
import focusTip from "@/components/order/focus-tip";
import signPrompt from "@/pages/member/order/sign-prompt";
import { sign } from "~/mixins/signing-mixin";

export default {
  mixins: [sign],
  components: {
    memberHead,
    focusTip,
    signPrompt,
  },
  head() {
    return {
      title: "订单详情",
      meta: [
        { name: "keywords", content: "订单详情" },
        {
          hid: "description",
          name: "description",
          content: "订单详情",
        },
      ],
    };
  },
  data() {
    return {
      orderId: "",
      orderDetail: {},
      imgUrl: process.env.CDN_BASE_URL,
      delDialog: false,
      signDialog: false,
      essAuthDialog: false,
      commonDialog: false,
      progressDialog: false,
      updateTime: "",
      payTime: "",
      mouseOver: true,
      delStatus: "",
      orderInfo: {},
      title: "",
      tab: 2,
      payList: [],
      receiveAddress: {},
      timeData: {},
      progressList: [],
      taskName: "",
      tag: "任务信息",
      toStart: true, //待开始
      orderCount: 0,
      imgType: ".jpg,.png,.jpeg,.gif",
      videoType: ".mp4,.avi,.mov",
      property_URL: process.env.PROPERTY_URL,
      AuthenticationDialog: false,
      userInfo: {},
      refuseReason: "",
      signType: "",
      signInfo: {},
      iconUrl: {
        doc: require('@/assets/images/zhengce/icon_word.png'),
        docx: require('@/assets/images/zhengce/icon_word.png'),
        ppt: require('@/assets/images/zhengce/icon_ppt.png'),
        pptx: require('@/assets/images/zhengce/icon_ppt.png'),
        pdf: require('@/assets/images/zhengce/icon_pdf.png'),
        xls: require('@/assets/images/zhengce/icon_excel.png'),
        xlsx: require('@/assets/images/zhengce/icon_excel.png'),
      },
    };
  },
  filters: {
    orderStatus(val) {
      switch(val) {
        case 0: 
            return '待付款'
        case 1: 
            return '已完成'
        case 2: 
            return '已取消'
        case 3: 
            return '已删除'
      }
    },
    orderType(val) {
      return orderData.orderType(val);
    },
    costType(val) {
      return orderData.costType(val);
    },
    payType(val) {
      return orderData.payType(val);
    },
    filterPayChannel(val) {
      switch(Number(val)) {
        case 0:
          return '支付宝'
        case 1:
          return '对公转账'
        case 2:
          return '微信'
      }
    },
    filterAmount(val) {
      return Number(val).toFixed(2)
    }
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (this.userInfo) {
      this.orderId = this.$route.query.id;
      this.getDetail();
    } else {
      this.$router.push({ path: "/login" });
    }
  },
  methods: {
    filterType(item) {
      if (item.url.match(/(jpeg|png|jpg|gif)/)) {
        return true;
      } else {
        return false;
      }
    },
    toFile(row) {
      window.open("/policy/files/" + row.fileId);
    },
    progress(row, toStart) {
      if (toStart) {
        this.taskName = row.spuName;
        this.progressDialog = true;
        this.commonDialog = true;
      } else {
        getTaskProcessList({ taskId: row.id }).then((res) => {
          this.progressList = res.data.data;
          this.taskName = row.spuName;
          this.progressDialog = true;
          this.commonDialog = true;
        });
      }
    },
    cell() {
      return {
        background: "#F3FBFE",
      };
    },
    jump(route) {
      this.$router.push({
        path: route,
      });
    },
    toPay() {
      this.$router.push({
        path: '/policy/files/file-order',
        query: {
          orderId: this.orderDetail.id,
          id: this.orderDetail.fileId,
        }
      })
    },
    getDetail() {
      getDetailInfoById(this.orderId).then((res) => {
        if (res.data.data.orderStatus == 8) {
          this.$router.push({
            path: "/member/order",
          });
        } else {
          this.orderDetail = res.data.data;
          this.payTime = this.orderDetail.tmFileOrderPayment.payTime
          this.updateTime = this.orderDetail.tmFileOrderPayment.updateTime
          this.payList = this.orderDetail.orderStatus == 0 || this.orderDetail.orderStatus == 2 ? [] : [this.orderDetail.tmFileOrderPayment];
        }
      });
    },
    copy() {
      new ClipboardJS(".orderNo");
      this.$message({
        type: "success",
        message: "复制成功",
        offset: 80,
        duration: 1000,
      });
    },
    updateStatus(row, status, title) {
      this.title = title;
      this.orderInfo = row;
      this.delStatus = status;
      this.delDialog = true;
      this.commonDialog = true;
    },
    updateOrderStatus(row, status, title) {
      if (status == 2) {
        cancelFileOrder(row.id).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: title + "订单成功！",
              offset: 80,
              duration: 2000,
            });
            this.delDialog = false;
            this.commonDialog = false
            this.getOrderList(this.orderStatus);
            this.getStatistics();
          } else {
          }
        });
      } else {
        deleteFileOrder(row.id).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "订单删除成功！",
              offset: 80,
              duration: 2000,
            });
            this.delDialog = false;
            this.commonDialog = false
            this.getOrderList(this.orderStatus);
            this.getStatistics();
          } else {
          }
        });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
@import './file-order.stylus';
</style>