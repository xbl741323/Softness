<template>
  <div class="refund">
    <member-head></member-head>
    <div class="refund-main">
      <div class="breadcrumb">
        <a class="grey" @click="jump('/member/order')">我的订单</a> >
        <a class="grey" @click="orderDetail(orderInfo)">订单详情 > </a>
        <a>退款详情</a>
      </div>
      <!-- 进度条 -->
      <div class="refund-process">
        <div
          class="commit"
          v-if="!$route.query.refundId && refundDetail.refundStatus != 4"
        >
          <div class="first">
            <span class="processindex">01</span>
            <span class="processdes">申请退款</span>
          </div>
          <div class="second">
            <span class="processnewindex">02</span
            ><span class="processnewdes">&nbsp;等待审核</span>
          </div>
          <div class="third">
            <span class="processnewindex">03</span
            ><span class="processnewdes">&nbsp;退款完毕</span>
          </div>
        </div>
        <div
          class="wait"
          v-else-if="
            [-2, -1, 1, 2, 3].includes(refundDetail.refundStatus) &&
            $route.query.refundId &&
            refundDetail.refundStatus != 4
          "
        >
          <div class="first">
            <span class="processnewindex">01</span>
            <span class="processnewdes">申请退款</span>
          </div>
          <div class="second">
            <span class="processindex">02</span
            ><span class="processdes">&nbsp;等待审核</span>
          </div>
          <div class="third">
            <span class="processnewindex">03</span
            ><span class="processnewdes">&nbsp;退款完毕</span>
          </div>
        </div>
        <div class="complete" v-else-if="refundDetail.refundStatus == 4">
          <div class="first">
            <span class="processnewindex">01</span>
            <span class="processnewdes">申请退款</span>
          </div>
          <div class="second">
            <span class="processnewindex">02</span
            ><span class="processnewdes">&nbsp;等待审核</span>
          </div>
          <div class="third">
            <span class="processindex">03</span
            ><span class="processdes">&nbsp;退款完毕</span>
          </div>
        </div>
      </div>
      <div class="refund-detail">
        <div class="left">
          <!-- 01申请退款 -->
          <template v-if="!$route.query.refundId">
            <div class="flex">
              <div class="productname">退款产品：</div>
              <div class="product-img mtop" @click="toProductDetail(orderInfo)">
                <img
                  :src="imgUrl + orderInfo.url"
                  v-if="filterType(orderInfo)"
                />
                <video
                  class="project_img"
                  :src="imgUrl + orderInfo.url"
                  v-if="!filterType(orderInfo)"
                />
                <div class="right-bar">
                  <p class="product-name">{{ orderInfo.spuName }}</p>
                  <p class="order-type" v-if="orderInfo.categoryName">
                    订单类型：{{ orderInfo.categoryName }}
                  </p>
                  <p class="order-spec">{{ orderInfo.spec }}</p>
                </div>
                <div class="order-Anum" v-if="orderInfo.buyNum">
                  <p>￥{{ onePrice }}</p>
                  <p class="order-buyNum">x{{ orderInfo.buyNum }}</p>
                </div>
              </div>
            </div>
            <el-form :model="refundForm" :rules="rules" ref="refundForm">
              <el-form-item label="退款数量：" required>
                <div class="flex">
                  <el-form-item class="mr">
                    <el-input-number
                      v-model="refundForm.refundCount"
                      :disabled="![2, 3, 4].includes(orderInfo.orderStatus)"
                      controls-position="right"
                      :min="1"
                      :max="maxNum"
                      @change="handlePriceChange"
                    ></el-input-number>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item label="退款金额：" required prop="earlyMoney">
                <div class="flex">
                  <el-input-number
                    v-model="refundForm.earlyMoney"
                    class="inputMoney"
                    :disabled="![2, 3, 4].includes(orderInfo.orderStatus)"
                    :controls="false"
                    :min="1"
                    :max="maxPrice"
                    @change="handleMoney(refundForm.earlyMoney)"
                  ></el-input-number>
                </div>
                <p style="color: #999999; font-size: 12px; margin-top: 8px" v-if="[2, 3, 4].includes(orderInfo.orderStatus)">
                  最多￥{{ refundForm.refundCount * paidMoney }}，可修改
                </p>
              </el-form-item>
              <el-form-item label="退款原因：" prop="refundReason">
                <el-select
                  v-model="refundForm.refundReason"
                  placeholder="请选择"
                  class="inputMoney"
                >
                  <el-option
                    v-for="item in selectArray"
                    :key="item.dropdownKey"
                    :label="item.dropdownValue"
                    :value="item.dropdownKey"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="退款说明：" class="questionleft">
                <el-input
                  type="textarea"
                  v-model="refundForm.questionDescription"
                  class="textarea"
                  :rows="4"
                  maxlength="200"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-button
                type="primary"
                class="sumit-btn"
                :loading="showLoading"
                @click="submitForm('refundForm')"
                >提交</el-button
              >
            </el-form>
          </template>
          <!-- 02等待审核 -->
          <!-- 等待中 -->
          <template
            v-if="
              $route.query.refundId &&
              [1, 2, 3].includes(refundDetail.refundStatus)
            "
          >
            <div class="wait-detail">
              <div class="detail-tip">
                <img
                  width="24"
                  height="24"
                  src="~assets/images/order/time_icon@2x.png"
                /><span class="wait-tip">请等待平台处理</span>
              </div>
              <p class="waitmsg">您已成功发起退款申请， 请耐心等待平台处理。</p>
              <div class="waitbord"></div>
              <div class="waitreason mbt">
                <span class="circle"></span
                ><span class="cirmsg"
                  >如果平台拒绝，您可以修改退款申请后再次发起退款申请，平台会重新处理</span
                >
              </div>
              <div
                v-if="'1,2'.includes(refundDetail.refundStatus)"
                :class="[orderInfo.thirdOrderNo ? 'cancel-btn ccc' : 'cancel-btn']"
                @click="
                  orderInfo.thirdOrderNo ? '' : (cancelDialog = true), (refundId = refundDetail.tmRefundId )
                "
              >
                撤销申请
              </div>
            </div>
          </template>
          <!-- 拒绝 -->
          <template
            v-if="$route.query.refundId && refundDetail.refundStatus == -2"
          >
            <div class="wait-detail">
              <div class="detail-tip">
                <span class="nowait-tip">平台已拒绝</span>
              </div>
              <p class="waitmsg">拒绝时间：{{ refundDetail.endTime }}</p>
              <p class="waitmsg">拒绝原因：{{ refundDetail.refuseReason }}</p>
              <div class="waitbord"></div>
              <div class="waitreason">
                <span class="circle"></span
                ><span class="cirmsg"
                  >您可以修改退款申请后再次发起退款申请，平台会重新处理</span
                >
              </div>
              <div :class="[orderInfo.thirdOrderNo ? 'cancel-btn ccc' : 'again-btn']" @click="orderInfo.thirdOrderNo ? '' : tryAgain()">重新申请退款</div>
            </div>
          </template>
          <!-- 撤销退款 -->
          <template
            v-if="$route.query.refundId && refundDetail.refundStatus == -1"
          >
            <div class="wait-detail">
              <div class="detail-tip">
                <span class="wait-tip">退款已撤销</span>
              </div>
              <p class="waitmsg">操作时间：{{ refundDetail.endTime }}</p>
              <div class="waitbord"></div>
              <div class="waitreason mbt">
                <span class="circle"></span
                ><span class="cirmsg"
                  >您可以修改退款申请后再次发起退款申请，平台会重新处理</span
                >
              </div>
              <div :class="[orderInfo.thirdOrderNo ? 'cancel-btn ccc' : 'again-btn']" @click="orderInfo.thirdOrderNo ? '' : tryAgain()">重新申请退款</div>
            </div>
          </template>
          <!-- 03 退款完毕 -->
          <!-- 成功 -->
          <div
            class="wait-detail"
            v-if="refundDetail.tmRefundId && refundDetail.refundStatus == 4"
          >
            <div class="detail-tip">
              <img
                width="24"
                height="24"
                src="~assets/images/order/success@2x.png"
              /><span class="wait-tip">退款完成</span>
            </div>
            <p class="waittime">退款成功，您可以继续下单</p>
            <div class="waitbord"></div>
            <refund-table :orderInfo="refundDetail" :payList="refundList" />
          </div>
        </div>
        <div class="right">
          <p class="right-detail">订单详情</p>
          <div class="border"></div>
          <div class="product-img" @click="toProductDetail(orderInfo)">
            <img :src="imgUrl + orderInfo.url" v-if="filterType(orderInfo)" />
            <video
              class="project_img"
              :src="imgUrl + orderInfo.url"
              v-if="!filterType(orderInfo)"
            />
            <div class="right-bar">
              <p class="product-name">{{ orderInfo.spuName }}</p>
              <p class="order-type" v-if="orderInfo.categoryName">
                订单类型：{{ orderInfo.categoryName }}
              </p>
              <p class="order-spec">{{ orderInfo.spec }}</p>
            </div>
            <div class="order-Anum" v-if="orderInfo.buyNum">
              <p>￥{{ onePrice }}</p>
              <p class="order-buyNum">x{{ orderInfo.buyNum }}</p>
            </div>
          </div>
          <div class="border"></div>
          <!-- 订单信息 -->
          <div class="order-info">
            <p>
              <span class="info-label">订单编号：</span
              ><span class="info-msg">{{ orderInfo.orderNo }}</span>
            </p>
            <p class="mtinfo">
              <span class="info-label">下单时间：</span
              ><span class="info-msg">{{ orderInfo.orderTime }}</span>
            </p>
            <p class="mtinfo">
              <span class="info-label">支付金额：</span
              ><span class="info-msg">￥{{ payment }}</span>
            </p>
          </div>
          <!-- 退款信息 -->
          <template
            v-if="
              refundDetail.tmRefundId &&
              [-1,-2, 1, 2, 3,4].includes(refundDetail.refundStatus)
            "
          >
            <div class="border"></div>
            <div class="order-info">
              <p>
                <span class="info-label">退款编号：</span
                ><span class="info-msg">{{ refundDetail.tmRefundNo }}</span>
              </p>
              <p class="mtinfo">
                <span class="info-label">退款金额：</span
                ><span class="info-msg">￥{{ refundDetail.refundAmount }}</span>
              </p>
              <p class="mtinfo">
                <span class="info-label">退款原因：</span
                ><span class="info-msg">{{
                  reasonList[refundDetail.refundReason - 1]
                }}</span>
              </p>
              <p class="mtinfo">
                <span class="info-label">退款说明：</span
                ><span class="info-msg">{{
                  refundDetail.refundDescription
                }}</span>
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- 撤销退款申请 -->
    <el-dialog
      :visible.sync="cancelDialog"
      width="0"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    ></el-dialog>
    <div v-if="cancelDialog" class="del-box">
      <p class="del-title">撤销退款申请</p>
      <img
        v-if="mouseOver"
        @mouseover="mouseOver = false"
        src="~/assets/images/order/guanbi_icon_dark@2x.png"
      />
      <img
        v-else
        @mouseleave="mouseOver = true"
        src="~/assets/images/order/guanbi_icon@2x.png"
        @click="cancelDialog = false"
      />
      <p class="cancel-content">
        您将撤销本次申请，如果问题未解决，您还可以再次发起。
      </p>
      <p class="cancel-tip">确定继续吗?</p>
      <p></p>
      <div class="del-btn">
        <div class="cancel-del-btn" @click="makeSureRefund">确定</div>
        <div
          class="cancel-del-btn confirm-del-btn"
          @click="cancelDialog = false"
        >
          取消
        </div>
      </div>
    </div>
    <!-- 订阅消息 -->
    <focusTip></focusTip>
  </div>
</template>

<script>
import memberHead from "~/components/member/head";
import RefundTable from "~/components/refund/refund-table.vue";
import orderData from "~/pages/member/order/productOrder/order-data";
import {
  getOrderDetail,
  getRefundReason,
  applyRefund,
  getRefundDetail,
  cancelRefund,
  isApply,
} from "~/api/order";
import focusTip from "@/components/order/focus-tip";
import { logOut } from '~/api/login';
export default {
  components: {
    memberHead,
    focusTip,
    RefundTable,
  },
  head() {
    return {
      title: "退款详情",
      meta: [
        { name: "keywords", content: "退款详情" },
        {
          hid: "description",
          name: "description",
          content: "退款详情",
        },
      ],
    };
  },
  data() {
    return {
      orderInfo: {},
      refundDetail: {},
      imgUrl: process.env.CDN_BASE_URL,
      imgType: ".jpg,.png,.jpeg,.gif",
      videoType: ".mp4,.avi,.mov",
      property_URL: process.env.PC_URL,
      refundForm: {
        earlyType: false, // 项目
        earlyMoney: 0,
        tailType: false,
        tailMoney: undefined,
        officialfeeType: false,
        officialfee: undefined,
        refundCount: 1,
        refundReason: null,
        questionDescription: null,
        serverType: false, //  知产
        serverMoney: undefined,
        serverOffType: false,
        serverOffMoney: undefined,
      },
      refundList: [],
      rules: {
        refundReason: [
          { required: true, message: "请选择退款原因", trigger: "change" },
        ],
        earlyMoney: [
          { required: true, message: "请填写退款金额", trigger: "blur" },
        ],
      },
      selectArray: [],
      reasonList: [
        "下错单了",
        "付款金额错误",
        "付款方式错误",
        "服务终止",
        "其他",
      ],
      checkearlyMoney: null,
      checktailMoney: null,
      checkofficialfee: null,
      checkserverMoney: null,
      checkserverOffMoney: null,
      maxNum: 1,
      cancelDialog: false,
      mouseOver: true,
      showLoading: false,
      showAaginBtn: true,
      maxPrice: 0,
      paidMoney: 0,
      onePrice: 0,
      payment: 0,
      lastTime:new Date()
    };
  },
  filters: {
    orderType(val) {
      return orderData.orderType(val);
    },
  },
  mounted() {
    // 退款详情
    if (this.$route.query.refundId) {
      getRefundDetail({ refundId: this.$route.query.refundId }).then((res) => {
        if (res.data.code == 0) {
          this.refundDetail = res.data.data;
          let list = [];
          if (this.refundDetail.depositRefundServiceFee) {
            list.push({
              gmtModified: this.refundDetail.endTime,
              policyFeeType: 2,
              count: this.refundDetail.refundNum,
              payAmount: parseFloat(this.refundDetail.depositRefundServiceFee),
            });
          }
          if (this.refundDetail.tailRefundServiceFee) {
            list.push({
              gmtModified: this.refundDetail.endTime,
              policyFeeType: 3,
              count: this.refundDetail.refundNum,
              payAmount: parseFloat(this.refundDetail.tailRefundServiceFee),
            });
          }
          if (
            this.refundDetail.depositRefundGovFee ||
            this.refundDetail.tailRefundGovFee
          ) {
            list.push({
              gmtModified: this.refundDetail.endTime,
              policyFeeType: 1,
              count: this.refundDetail.refundNum,
              payAmount: 
              parseFloat(this.refundDetail.depositRefundGovFee) > 0 ? parseFloat(this.refundDetail.depositRefundGovFee) : 0
              +
              parseFloat(this.refundDetail.tailRefundGovFee) > 0 ? parseFloat(this.refundDetail.tailRefundGovFee) : 0,
            });
          }
          if(!this.refundDetail.depositRefundGovFee && !this.refundDetail.tailRefundGovFee && !this.refundDetail.depositRefundServiceFee) {
            list.push({
              gmtModified: this.refundDetail.endTime,
              policyFeeType: 4,
              count: this.refundDetail.refundNum,
              payAmount: parseFloat(this.refundDetail.refundAmount),
            });
          }
          this.refundList = list;
        }
      });
    }
    // 订单详情
    getOrderDetail({ id: this.$route.query.id }).then((res) => {
      if (res.data.code == 0) {
        let data = res.data.data;
        this.orderInfo = data;
        this.refundForm.refundCount = data.buyNum;
        this.maxNum = data.buyNum;
        this.onePrice = this.orderInfo.totalAmount / this.orderInfo.buyNum;
        this.orderInfo.orderFeeVoList.forEach((item) => {
          if (item.payStatus == 2) {
            this.payment += item.price * item.buyNum;
            this.refundForm.earlyMoney += item.price * item.buyNum;
            this.maxPrice += item.price * item.buyNum;
          }
        });
        this.paidMoney = this.payment / data.buyNum;
        this.$set(this.orderInfo, "dueDepositPrice", 0);
        this.$set(this.orderInfo, "depositPrice", 0);
        this.$set(this.orderInfo, "finalPrice", 0);
        try {
          this.orderInfo.orderFeeVoList.forEach((item) => {
            if (item.payType == 1) {
              //定金
              this.$set(this.orderInfo, "hasDeposit", true);
              if (item.costType == 3) {
                //定金官费
                this.$set(this.orderInfo, "hasOffical", true);
                this.$set(this.orderInfo, "officalPrice", item.price); //官费单价
                this.$set(this.orderInfo, "officalTime", item.payTime);
              } else {
                this.orderInfo.depositPrice += item.price;
                this.$set(this.orderInfo, "depositPayTime", item.payTime);
              }
              //payStatus 支付状态：0待付款 1支付中 2支付成功  3支付失败  payChannel支付渠道(0-支付宝，1-对公转账 2-微信)
              if (item.payStatus == 1 && item.payChannel == 1) {
                this.$set(this.orderInfo, "waitingAudit", true);
              } else if (item.payStatus == 3 && item.payChannel == 1) {
                this.$set(this.orderInfo, "transferFailure", true);
              }
              if (item.tradeNo) {
                this.$set(this.orderInfo, "tradeNo", item.tradeNo);
              }
            }
            if (item.payType == 3) {
              //一口价
              this.$set(this.orderInfo, "isDue", true);
              if (item.costType == 3) {
                //定金官费
                this.$set(this.orderInfo, "hasOffical", true);
                this.$set(this.orderInfo, "officalPrice", item.price); //官费单价
                this.$set(this.orderInfo, "officalTime", item.payTime);
              } else {
                this.orderInfo.dueDepositPrice += item.price;
                this.$set(this.orderInfo, "dueDepositPayTime", item.payTime);
              }
              if (item.payStatus == 1 && item.payChannel == 1) {
                this.$set(this.orderInfo, "waitingAudit", true);
              } else if (item.payStatus == 3 && item.payChannel == 1) {
                this.$set(this.orderInfo, "transferFailure", true);
              }
              if (item.tradeNo) {
                this.$set(this.orderInfo, "tradeNo", item.tradeNo);
              }
            }
            if (item.payType == 2) {
              //尾款
              if (this.orderInfo.tailStatus == 0) {
                this.$set(this.orderInfo, "hasOffical", false);
              } else {
                this.orderInfo.finalPrice += item.price;
                this.$set(this.orderInfo, "finalPayTime", item.payTime);
              }
              if (item.payStatus == 1 && item.payChannel == 1) {
                this.$set(this.orderInfo, "waitingAudit", true);
              } else if (item.payStatus == 3 && item.payChannel == 1) {
                this.$set(this.orderInfo, "transferFailure", true);
              }
            }
          });
        } catch (error) {}
      }
    });
    getRefundReason({ type: 1 }).then((res) => {
      this.selectArray = res.data.data;
    });
    // 是否显示重新申请按钮
    // if(this.$route.query.orderNo){
    //     isApply({orderNo:this.$route.query.orderNo}).then(res=>{
    //         if(res.data.code==0){
    //             if(res.data.data.taskStatus==2){
    //                 this.showAaginBtn = true
    //             }else{
    //                 this.showAaginBtn = false
    //             }
    //         }
    //     })
    // }
  },
  methods: {
    //退款金额只保留小数点后两位
    handleMoney(num) {
      try {
        // if (num.toString().split(".")[1].split("").length > 2) {
          // let a = num.toString().split(".")[1].split("").slice(0, 2).join("");
          // let b = [num.toString().split(".")[0], ".", a].join("");
          let b = num.toString().split(".")[0]
          this.$nextTick(() => {
            this.refundForm.earlyMoney = parseFloat(b);
          });
        // }
      } catch (error) {}
    },
    handlePriceChange() {
      let number = this.refundForm.refundCount;
      this.maxPrice = number * this.paidMoney;
      this.refundForm.earlyMoney = number * this.paidMoney; 
      if (this.maxPrice < this.refundForm.earlyMoney) {
        this.refundForm.earlyMoney = this.maxPrice;
      }
    },
    jump(route) {
      this.$router.push({
        path: route,
      });
    },
    filterType(item) {
      if (item.url && item.url.match(/(jpeg|png|jpg|gif)/)) {
        return true;
      } else {
        return false;
      }
    },
    clearOrderNo() {
      if (this.$route.query.orderNo) {
        this.$router.push({
          path: this.$route.path,
          query: { orderNo: "" },
        });
      }
    },
    // 订单详情
    orderDetail(row) {
      this.clearOrderNo();
      this.$router.push({
        path: "/order/my-order",
        query: {
          id: row.id,
        },
      });
    },
    // 产品详情
    toProductDetail(orderInfo) {
      window.open(
        this.property_URL + "/productdetails/details?spuId=" + orderInfo.spuId
      );
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            refundNum: this.refundForm.refundCount,
            orderId: this.orderInfo.id,
            refundReason: this.refundForm.refundReason,
            description: this.refundForm.questionDescription,
            refundAmount: this.refundForm.earlyMoney,
            cashFlag: 1,
          };
          this.throttle(()=>{
            applyRefund(param).then((res) => {
              this.showLoading = false;
              if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: "提交成功",
                  offset: 300,
                });
                getOrderDetail({ id: this.$route.query.id }).then((res) => {
                  if (res.data.code == 0) {
                    let routerUrl = this.$router.resolve({
                      path: "/refund/refund-apply",
                      query: {
                        id: this.$route.query.id,
                        refundId: res.data.data.refundId,
                      },
                    });
                    window.open(routerUrl.href, "_self");
                  }
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg,
                  offset: 300,
                });
              }
            });
          })
        } else {
          return false;
        }
      });
    },
    throttle(fun){
      let now = new Date()
      if (now - this.lastTime > 7000){
          fun()
          this.lastTime = now
        }
    },
    // 撤销申请
    makeSureRefund() {
      cancelRefund({ refundId: this.$route.query.refundId }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            type: "success",
            message: "操作成功",
            offset: 300,
          });
          this.cancelDialog = false;
          getOrderDetail({ id: this.$route.query.id }).then((res) => {
            if (res.data.code == 0) {
              let routerUrl = this.$router.resolve({
                path: "/refund/refund-apply",
                query: {
                  id: this.$route.query.id,
                  refundId: res.data.data.refundId,
                },
              });
              window.open(routerUrl.href, "_self");
            }
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
            offset: 300,
          });
          this.cancelDialog = false;
        }
      });
    },
    // 重新申请退款
    tryAgain() {
      let routerUrl = this.$router.resolve({
        path: "/refund/refund-apply",
        query: {
          id: this.orderInfo.id,
        },
      });
      window.open(routerUrl.href, "_self");
    },
    showQia() {
      window.open(
        "https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2",
        "",
        "height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no"
      );
    },
  },
};
</script>

<style lang="stylus" scoped>
@import './refund.stylus';
</style>