<template>
  <div class="order_personal">
    <div class="order_status">
      <span
        v-for="item in statusList"
        :key="item.value"
        @click="
          (statusValue = item.value),
            (currentPage = 1),
            getOrderList(item.orderStatus)
        "
        :class="
          statusValue == item.value
            ? 'status-label active-label'
            : 'status-label'
        "
      >
        <el-badge
          :value="
            item.value == 0
              ? statisticsList.waitPayCount
                ? statisticsList.waitPayCount
                : ''
              : item.value == 2
              ? statisticsList.waitStartCount + statisticsList.inUseCount || ''
              : item.value == 99
              ? statisticsList.inRefundCount
                ? statisticsList.inRefundCount
                : ''
              : item.value == 1
              ? (statisticsList.waitSignElectronCount || '') +
                (statisticsList.waitSignPaperCount || '')
              : ''
          "
        >
          {{ item.label }}
        </el-badge>
      </span>
    </div>
    <!-- 订单表头 -->
    <div class="order-tr" v-if="statusValue != 99">
      <p v-for="item in titleList" :key="item.value">{{ item.label }}</p>
    </div>
    <!-- 退款售后表头 -->
    <div class="refund-tr" v-else>
      <p v-for="item in refundaftersales" :key="item.value">{{ item.label }}</p>
    </div>
    <div v-if="showOrder">
      <!-- 我的订单 -->
      <template v-if="statusValue != 99">
        <div
          v-for="item in ordersList"
          :key="item.id"
          :class="
            $route.query.orderNo == item.orderNo
              ? 'order-table selected'
              : 'order-table'
          "
        >
          <div class="order-no">
            <p>{{ item.orderTime }}</p>
            <p>订单号：{{ item.orderNo }}</p>
            <img
              class="orderNo"
              src="~assets/images/order/copy_icon@2x.png"
              alt="复制"
              :data-clipboard-text="item.orderNo"
              @click="copy()"
            />
            <span
              v-if="
                item.contractType == 2 &&
                item.orderStatus == 1 &&
                item.contractStatus != 2
              "
              class="sign-prompt"
              ><i class="el-icon-warning warning-txt"></i> 温馨提示:
              待业务经理上传纸质合同</span
            >
            <span
              v-if="
                item.contractType == 2 &&
                item.orderStatus == 1 &&
                item.contractStatus == 2
              "
              class="sign-prompt"
              ><i class="el-icon-warning warning-txt"></i> 温馨提示:
              合同正在审核中，有问题请联系业务经理</span
            >
          </div>
          <div class="order-info">
            <div class="product-info product-order">
              <!-- <div class="product-img" v-if="item.orderType == 0"> -->
              <!-- 1-专利，2-商标，3-版权，4-其他 -->
              <!-- <img v-if="item.orderDetailVO.productSubType ==1" src="~/assets/images/order/pic_zl@2x.png" alt="" @click="toProductDetail(item)">
                  <img v-if="item.orderDetailVO.productSubType ==2" src="~/assets/images/order/pic_sb@2x.png" alt="" @click="toProductDetail(item)">
                  <img v-if="item.orderDetailVO.productSubType ==3" src="~/assets/images/order/pic_bq@2x.png" alt="" @click="toProductDetail(item)">
                  <img v-if="item.orderDetailVO.productSubType ==4" src="~/assets/images/order/pic_qt@2x.png" alt="" @click="toProductDetail(item)">
                  <div class="right-bar" @click="orderDetail(item)">
                      <p class="product-name">{{item.spuName}}</p>
                      <p class="order-type">订单类型：{{item.categoryName}}</p>
                  </div>
              </div> -->
              <div class="product-img">
                <img :src="imgUrl + item.url" v-if="filterType(item)" />
                <video
                  class="project_img"
                  :src="imgUrl + item.url"
                  v-if="!filterType(item)"
                />
                <div class="right-bar" @click="orderDetail(item)">
                  <p class="product-name">{{ item.spuName }}</p>
                  <p class="spec">{{ item.spec }}</p>
                  <p class="order-type">订单类型：{{ item.categoryName }}</p>
                </div>
              </div>
              <div v-if="item.isDue">
                <p class="fee" v-if="item.hasOffical">
                  ￥{{ item.dueDepositPrice }}
                </p>
                <p class="fee" v-else>￥{{ item.dueDepositPrice }}</p>
              </div>
              <div class="project-price" v-if="!item.isDue">
                <p class="earnest-money">
                  定金：￥{{ item.depositPrice || "0.00" }}
                </p>
                <div
                  :class="[
                    item.tailStatus == 0 || item.tailStatus == 1
                      ? 'outstanding'
                      : '',
                  ]"
                >
                  <p>尾款：￥{{ item.finalPrice || "待定" }}</p>
                </div>
              </div>
              <p class="fee count">{{ item.buyNum }}</p>
              <!-- 代理/第三方 有费减 -->
              <p class="gover-fee fee-name" v-if="item.hasOffical">官费</p>
              <p class="gover-fee fee-other" v-if="item.hasOffical">
                ￥{{ item.officalPrice }}
              </p>
              <p class="gover-fee fee-other" v-if="item.hasOffical">
                {{ item.buyNum }}
              </p>
            </div>
            <!-- 金额 -->
            <div class="pay-info">
              <div class="general">
                <!-- "尾款状态 0-待定 1-待付款 2-已结清 3-无 -->
                <div class="amount-pay amount-price">
                  <p>
                    {{
                      ((item.isDue && item.orderStatus != 0 && item.orderStatus != 1) ||
                      ((item.orderStatus == 3 || item.orderStatus == 2) &&
                        (item.tailStatus == 3 || item.tailStatus == 2)) ||
                      orderStatus == 4) && !(item.orderStatus == 2 && item.payStatus == 0)
                        ? "已付"
                        : "应付"
                    }}
                  </p>
                  <p
                    v-if="
                      item.orderStatus == 3 &&
                      (item.tailStatus == 0 || item.tailStatus == 1)
                    "
                  >
                    <span v-if="item.finalPrice">￥</span>
                    {{ item.finalPrice * item.buyNum || "待定" }}
                  </p>
                  <p v-else-if="item.orderStatus == 0 && !item.isDue">
                    ￥{{
                      (item.depositPrice + (item.officalPrice || 0)) *
                      item.buyNum
                    }}
                  </p>
                  <p v-else-if="item.orderStatus == 1 && !item.isDue">
                    ￥{{
                      (item.depositPrice + (item.officalPrice || 0)) *
                      item.buyNum
                    }}
                  </p>
                  <p
                    v-else-if="
                      (item.orderStatus == 2 || item.orderStatus == 3) &&
                      item.tailStatus != 2 &&
                      !item.isDue
                    "
                  >
                    <span v-if="item.finalPrice">￥</span
                    >{{ item.finalPrice * item.buyNum || "待定" }}
                  </p>
                  <p
                    v-else-if="
                      (item.orderStatus == 2 || item.orderStatus == 3) &&
                      item.tailStatus == 2 &&
                      !item.isDue
                    "
                  >
                    ￥{{
                      ((item.finalPrice || 0) +
                        (item.depositPrice || 0) +
                        (item.officalPrice || 0)) *
                      item.buyNum
                    }}
                  </p>
                  <p v-else-if="item.orderStatus == 4 && !item.isDue">
                    ￥{{
                      ((item.finalPrice || 0) +
                        (item.depositPrice || 0) +
                        (item.officalPrice || 0)) *
                      item.buyNum
                    }}
                  </p>
                  <p v-else>
                    ￥{{
                      ((item.officalPrice || 0) + (item.dueDepositPrice || 0)) *
                        item.buyNum || "待定"
                    }}
                  </p>
                </div>
              </div>
              <!-- 状态 -->
              <div class="general">
                <div class="amount-pay">
                  <p
                    :class="
                      item.orderStatus == 3
                        ? 'order-status server-order'
                        : item.orderStatus == 6
                        ? 'order-status cancel'
                        : 'order-status'
                    "
                  >
                    {{ item.orderStatus | orderStatus }}
                  </p>
                  <p
                    class="order-detail"
                    style="font-size: 12px"
                    @click="orderDetail(item)"
                  >
                    订单详情
                  </p>
                  <!-- voucherStatus  0-对公待审核 1-对公通过 2-对公未通过-->
                  <p class="fontbig" v-if="item.transferFailure">
                    对公转账未通过{{
                      item.tailStatus == 1 && item.orderStatus != 0
                        ? "(尾款)"
                        : item.tailStatus == 3
                        ? ""
                        : "(定金)"
                    }}
                    <el-tooltip placement="bottom" effect="light">
                      <div slot="content" style="width: 350px">
                        <p
                          style="
                            font-size: 16px;
                            font-weight: 550;
                            color: #333333;
                          "
                        >
                          审核不通过原因：{{ refuseReason }}
                        </p>
                        <p style="font-size: 14px; color: #666666">
                          对公转账审核不通过，您可以点击“付款”按钮,
                          再次提交正确的转账凭证，或选择其他方式付款。
                        </p>
                      </div>
                      <img
                        @mouseover="getReason(item)"
                        src="~/assets/images/order/wenhao_icon@2x.png"
                      />
                    </el-tooltip>
                  </p>
                  <p class="fontbig" v-if="item.waitingAudit">
                    对公转账审核中{{
                      item.tailStatus == 1 && item.orderStatus != 0
                        ? "(尾款)"
                        : item.tailStatus == 3
                        ? ""
                        : "(定金)"
                    }}
                  </p>
                  <p class="order-refund-detail" v-if="item.refundStatus">
                    {{ item.refundStatus | refundStatus }}
                  </p>
                </div>
              </div>
              <!-- 操作 -->
              <div class="general ingeneral">
                <div class="make-pay">
                  <!-- contractStatus 合同状态（1-未签约/未提交审核/审核失败  2-已提交审核  3-已签约/已审核通过 4-签约失败/审核不通过） -->
                  <!-- contractType 1-电子签约 2-纸质签约 -->
                  <p
                    v-if="
                      item.orderStatus == 1 &&
                      item.contractScope == 3 &&
                      (item.contractType == 1 ||
                        (item.contractType == 2 && item.contractStatus != 2) && item.refundStatus != 4) && item.refundStatus != 4
                    "
                    :class="[[1, 2, 3].includes(item.refundStatus) || item.waitingAudit || item.thirdOrderNo ? 'pay-order-cancel torecom' : 'torecom']"
                    @click="[1, 2, 3].includes(item.refundStatus) || item.waitingAudit || item.thirdOrderNo ? '' : signPrompt(item), detailInfo = item"
                  >
                    更换签约方式
                  </p>
                  <p
                    v-if="item.orderStatus == 1 && item.contractType == 1 && item.refundStatus != 4"
                    @click="[1, 2, 3].includes(item.refundStatus) || item.waitingAudit || item.thirdOrderNo ? '' : (userInfo.authorizedType == 2 && userInfo.autType == 2) || (userInfo.autType == 1 && userInfo.certifiedType == 2) ? essAuth(item, userInfo) : AuthenticationDialog = true"
                    :class="[[1, 2, 3].includes(item.refundStatus) || item.waitingAudit || item.thirdOrderNo ? 'pay-order-cancel torecom' : 'torecom']"
                  >
                    去签约
                  </p>
                  <!-- <p v-if="item.orderStatus == 1 && (item.contractType == 1 || (item.contractScope == 3 && item.contractType == 1 || item.contractType == 2 && item.contractStatus !=2))" class="torecom" 
                  @click="item.contractScope == 3 && (item.contractType == 1 || item.contractType == 2 && item.contractStatus !=2) ? signPrompt(item) : item.contractType == 1 ?  goSigncontract(item) : ''">
                  {{item.contractScope == 3 ? '更换签约方式' :'去签约'}}</p> -->
                  <p
                    :class="
                      item.waitingAudit || item.thirdOrderNo
                        ? 'pay-order pay-order-cancel'
                        : 'pay-order'
                    "
                    v-if="item.orderStatus == 0 || ('2,3,4'.includes(item.orderStatus) && item.payStatus == 0)"
                    @click="item.waitingAudit || item.thirdOrderNo ? '' : toPay(item)"
                  >
                    去付款
                  </p>
                  <p
                    class="cancel-order"
                    v-if="(item.orderStatus == 0 && !item.waitingAudit) || item.orderStatus == 1"
                    @click="updateStatus(item, 6, '取消')"
                  >
                    取消订单
                  </p>
                  <p
                    class="delte-order"
                    v-if="item.orderStatus == 6"
                    @click="updateStatus(item, 7, '删除')"
                  >
                    删除订单
                  </p>
                  <p
                    :class="
                      [1, 2, 3].includes(item.refundStatus) || item.waitingAudit || item.thirdOrderNo
                        ? 'pay-order pay-order-cancel'
                        : 'pay-order'
                    "
                    v-if="'2,3'.match(item.orderStatus) && item.tailStatus == 1"
                    @click="
                      [1, 2, 3].includes(item.refundStatus) || item.waitingAudit || item.thirdOrderNo
                        ? ''
                        : toPay(item, true)
                    "
                  >
                    付尾款
                  </p>
                  <p
                    v-if="
                      ('2,3,4'.includes(item.orderStatus) &&
                        !item.refundStatus) && !('2,3,4'.includes(item.orderStatus) && item.payStatus == 0) ||
                      [-1, -2].includes(item.refundStatus)
                    "
                    :class="[item.waitingAudit || item.thirdOrderNo ? 'ccc cur' : 'cur']"
                    @click="item.waitingAudit || item.thirdOrderNo ? '' : goRefundDetail(item, 0)"
                  >
                    申请退款
                  </p>
                  <p
                    v-if="'1,2,3,4'.includes(item.refundStatus)"
                    class="cur"
                    @click="goRefundDetail(item, 1)"
                  >
                    退款详情
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- 退款售后 -->
      <template v-else>
        <div
          v-for="(item, index) in ordersList"
          :key="index"
          :class="
            $route.query.orderNo == item.orderId
              ? 'order-table selected'
              : 'order-table'
          "
        >
          <div class="order-no">
            <div style="display: flex; justify-content: space-between; width: 100%">
              <div style="display: flex">
                <p>{{ item.createTime }}</p>
                <p>退款编号：{{ item.tmRefundNo }}</p>
                <img
                  class="orderNo"
                  src="~assets/images/order/copy_icon@2x.png"
                  alt="复制"
                  :data-clipboard-text="item.tmRefundNo"
                  @click="copy()"
                />
              </div>
              <p style="float: right">订单编号：{{item.orderNo}}</p>
            </div>
          </div>
          <div class="order-info">
            <!-- 退款信息 -->
            <div class="refund-info">
              <div class="product-info" v-if="item">
                <div class="product-img">
                  <img :src="imgUrl + item.picUrl" />
                  <div
                    class="right-bar"
                    style="text-align: left"
                    @click="orderDetail(item,1)"
                  >
                    <p class="product-name">{{ item.spuName }}</p>
                    <p class="order-type">
                      订单类型：{{ item.categoryId | orderType }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="refund-fee">
                <span>{{ item.serviceFee ? "服务费" : "" }}</span>
                <span>{{ item.govFee ? "官费" : "" }}</span>
              </div>
              <div class="refund-num">{{ item.refundNum }}</div>
              <div class="refund-price">￥{{ item.refundAmount }}</div>
              <div class="refund-status">
                {{ item.refundStatus | refundStatus }}
              </div>
              <div class="refund-operation">
                <div
                  :class="[item.thirdOrderNo ? 'ccc refund-cancel' : 'efund-cancel']"
                  v-if="'1,2'.includes(item.refundStatus)"
                  @click="item.thirdOrderNo ? '' : (refundDialog = true), (refundId = item.tmRefundId)"
                >
                  撤销申请
                </div>
                <div class="refund-detail cur" @click="goRefundDetail(item, 2)">
                  退款详情
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!-- 暂无数据 -->
    <div v-if="ordersList.length == 0 && showOrder" class="empty-img">
      <img src="~/assets/images/xiangmu/collect_fail@2x.png" />
      <p>暂无数据</p>
    </div>
    <div v-if="!showOrder" class="empty-box"></div>
    <el-dialog
      :visible.sync="delDialog"
      width="0"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    ></el-dialog>
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
        @click="(delDialog = false), getStatistics()"
      />
      <p class="del-content">订单{{ title }}后无法恢复，是否确认{{ title }}?</p>
      <div class="del-btn">
        <div
          class="cancel-del-btn"
          @click="(delDialog = false), getStatistics()"
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
    <!-- 撤销退款申请 -->
    <el-dialog
      :visible.sync="refundDialog"
      width="0"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    ></el-dialog>
    <div v-if="refundDialog" class="del-box">
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
        @click="refundDialog = false"
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
          @click="refundDialog = false"
        >
          取消
        </div>
      </div>
    </div>
    <!--认证提醒-->
    <el-dialog
      :visible.sync="AuthenticationDialog"
      width="0"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    ></el-dialog>
    <div v-if="AuthenticationDialog" class="del-box">
      <p class="del-title">认证提醒</p>
      <img
        v-if="mouseOver"
        @mouseover="mouseOver = false"
        src="~/assets/images/order/guanbi_icon_dark@2x.png"
      />
      <img
        v-else
        @mouseleave="mouseOver = true"
        src="~/assets/images/order/guanbi_icon@2x.png"
        @click="AuthenticationDialog = false"
      />
      <p class="cancel-content">由于您的身份未认证，暂时无法进行签约操作</p>
      <p class="cancel-tip">为了给您提供更好的服务，请尽快完成认证</p>
      <p></p>
      <div class="del-btn">
        <div
          class="cancel-del-btn confirm-del-btn"
          @click="AuthenticationDialog = false"
        >
          放弃认证
        </div>
        <div class="cancel-del-btn" @click="goAuthentication">去认证</div>
      </div>
    </div>

    <!--授权提醒-->
    <el-dialog
      :visible.sync="essAuthDialog"
      width="0"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    ></el-dialog>
    <div v-if="essAuthDialog" class="del-box">
      <p class="del-title">签约提示</p>
      <img
        v-if="mouseOver"
        @mouseover="mouseOver = false"
        src="~/assets/images/order/guanbi_icon_dark@2x.png"
      />
      <img
        v-else
        @mouseleave="mouseOver = true"
        src="~/assets/images/order/guanbi_icon@2x.png"
        @click="essAuthDialog = false"
      />
      <p class="ess-content">
        由于您首次使用签约功能，需要完成签约授权，请先去授权再来签约吧~
      </p>
      <!-- <p class="cancel-tip">为了给您提供更好的服务，请尽快完成认证</p> -->
      <p></p>
      <div class="del-btn">
        <div
          class="cancel-del-btn confirm-del-btn"
          @click="essAuthDialog = false"
        >
          取消
        </div>
        <div class="cancel-del-btn" @click="toAuth">去认证</div>
      </div>
    </div>

    <!-- 签约选择-->
    <el-dialog
      :visible.sync="signDialog"
      width="0"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    ></el-dialog>
    <div v-if="signDialog" class="del-box">
      <p class="sign-title">选择签约方式</p>
      <i class="el-icon-close close" @click="signDialog = false" />
      <!-- <img v-if="mouseOver" @mouseover="mouseOver = false" src="~/assets/images/order/guanbi_icon_dark@2x.png" />
      <img v-else @mouseleave="mouseOver = true" src="~/assets/images/order/guanbi_icon@2x.png" @click="signDialog = false" /> -->
      <div class="change-contract">
        <el-radio v-model="signType" :label="1">电子合同</el-radio>
        <span>线上签约，安全高效省心</span>
      </div>
      <div class="change-contract">
        <el-radio v-model="signType" :label="2">纸质合同</el-radio>
        <span>面签，扫描，邮寄等流程</span>
      </div>
      <div class="sign-btn" @click="signType == 1 && (userInfo.authorizedType != 2 && userInfo.autType == 2) || (userInfo.autType == 1 && userInfo.certifiedType != 2) ? (AuthenticationDialog = true, signDialog = false) : changeSign()">确认</div>
    </div>

    <!-- 签约提示 -->
    <sign-prompt
      v-if="signPromptDialog || currentSignPromptDialog"
      :order="currentOrder"
      @closePromptDialog="closePromptDialog"
      @changeSignWay="changeSignWay"
    />

    <div class="pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import orderData from "./order-data";
import {
  orderList,
  updateOrder,
  getOnlineOrdersStatistics,
  getRefundList,
  cancelRefund,
  isApply,
  signSelf,
  changeContractType,
  getTaskByTaskNo,
  getEssAuthStatus,
} from "~/api/order";
import ClipboardJS from "clipboard";
import Encrypt from "~/plugins/Encrypt";
import signPrompt from "@/pages/member/order/sign-prompt";
import { sign } from "~/mixins/signing-mixin";

export default {
  components: {
    signPrompt,
  },
  mixins: [sign],
  head() {
    return {
      title: "我的订单",
      meta: [
        { name: "keywords", content: "我的订单" },
        {
          hid: "description",
          name: "description",
          content: "我的订单",
        },
      ],
    };
  },
  data() {
    return {
      statusList: orderData.statusList,
      refundaftersales: orderData.refundaftersales,
      statusValue: null,
      titleList: orderData.titleList,
      detailInfo: {},
      userInfo: {},
      ordersList: [],
      statisticsList: {},
      imgUrl: process.env.CDN_BASE_URL,
      property_URL: process.env.PROPERTY_URL,
      pageSize: 10,
      currentPage: 1,
      total: 10,
      delDialog: false,
      showOrder: false,
      mouseOver: true,
      delStatus: "",
      orderInfo: {},
      title: "",
      orderStatus: "",
      imgType: ".jpg,.png,.jpeg,.gif",
      videoType: ".mp4,.avi,.mov",
      refundDialog: false,
      AuthenticationDialog: false,
      signDialog: false,
      essAuthDialog: false,
      refundId: null,
      signInfo: {},
      signType: 1,
      refuseReason: "",
    };
  },
  filters: {
    orderType(val) {
      return orderData.orderType(val);
    },
    orderStatus(val) {
      return orderData.orderStatus(val);
    },
    refundStatus(val) {
      return orderData.refundStatus(val);
    },
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },
  mounted() {
    if (process.client) {
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener("popstate", this.goBack, false);
      }
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (this.userInfo) {
        this.getOrderList();
        this.getStatistics();
      } else {
        this.$router.push({ path: "/login" });
      }
    }
    if (this.$route.query.statusValue) {
      this.statusValue = this.$route.query.statusValue
      this.getOrderList(this.$route.query.statusValue);
    }
  },
  methods: {
    changeSignWay() {
      this.goSigncontract(this.currentOrder);
    },
    closePromptDialog() {
      this.signPromptDialog = false;
      this.currentSignPromptDialog = false;
    },
    filterType(item) {
      if (item.url && item.url.match(/(jpeg|png|jpg|gif)/)) {
        return true;
      } else {
        return false;
      }
    },
    getReason(val) {
      let tradeNo = ''
      val.orderPaymentVoList.forEach(item => {
        if (item.payStatus == 3) {
          tradeNo = item.orderFeeList[0].tradeNo
        }
      })
      getTaskByTaskNo({ tradeNo: tradeNo }).then((res) => {
        this.refuseReason = res.data.data.auditMessage;
      });
    },
    changeSign() {
      if (this.detailInfo.contractType == this.signType) {
        this.signPromptDialog = false;
        this.currentSignPromptDialog = false;
        this.signDialog = false;
        return
      }
      let param = {
        id: this.signInfo.id,
        contractType: this.signType,
      };
      changeContractType(param).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            type: "success",
            message: "修改签约方式成功！",
            offset: 100,
          });
          this.signDialog = false;
          this.getStatistics();
          this.getOrderList(1);
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          })
          this.signDialog = false;
        }
      });
    },
    // getEssAuthStatus() {
    //   getEssAuthStatus().then((res) => {
    //     if (res.data.code == 0) {
    //       if ("0,1,4".match(JSON.parse(res.data.data.status))) {
    //         this.signDialog = false;
    //         this.essAuthDialog = true;
    //       } else if (res.data.data.status == 3) {
    //         this.signDialog = false;
    //         window.open(res.data.data.authUrl, "_self");
    //       } else {
    //         let param = {
    //           orderId: this.signInfo.id,
    //           returnUrl: process.env.PC_URL + "/member/order",
    //         };
    //         signSelf(param).then((res) => {
    //           if (res.data.code == 0) {
    //             window.open(res.data.data, "_self");
    //           } else {
    //             this.$message({
    //               type: "warning",
    //               message: res.data.msg,
    //               offset: 100,
    //             });
    //           }
    //         });
    //       }
    //     }
    //   });
    // },
    goSigncontract(row) {
        this.signInfo = row;
      if (this.userInfo.status != 2 && this.userInfo.status != 5) {
          this.signPromptDialog = false;
          this.currentSignPromptDialog = false;
          this.signDialog = true;
      } else {
        if (row.contractScope == 3) {
          this.signType = row.contractType;
          this.signPromptDialog = false;
          this.currentSignPromptDialog = false;
          this.signDialog = true;
        } else if (row.contractScope == 1) {
          this.essAuth(row, this.userInfo);
        } else if (row.contractScope == 2) {
          let param = {
            id: row.id,
            contractType: 2,
          };
          changeContractType(param).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "合同正在审核中，有问题请联系业务经理",
                offset: 100,
              });
              this.getOrderList();
              this.getStatistics();
            } else {
              this.$message({
                type: "error",
                message: res.data.msg,
                offset: 100,
              });
            }
          });
        } else {
        }
      }
    },
    goAuthentication() {
      this.AuthenticationDialog = false;
      this.$router.push({ path: "/member/authentication" });
    },
    toAuth() {
      this.essAuthDialog = false;
      if (this.userInfo.userType == 1) {
        this.$router.push("/member/authentication/authentication-personal");
      } else {
        this.$router.push("/member/authentication/authentication-unit");
      }
    },
    clearOrderNo() {
      // history.pushState(null, null, document.URL);
      if (this.$route.query.orderNo) {
        this.$router.push({
          path: this.$route.path,
          query: { orderNo: "" },
        });
      }
    },
    goBack() {
      history.pushState(null, null, document.URL);
      this.$router.push("/member");
    },
    getStatistics() {
      getOnlineOrdersStatistics({ accountId: this.userInfo.accountId }).then(
        (res) => {
          if (res.data.code == 0) {
            this.statisticsList = res.data.data;
          }
        }
      );
    },
    toPay(row, tailstatusPayFlag) {
      if (
        tailstatusPayFlag &&
        this.userInfo.status != 2 &&
        this.userInfo.status != 5 && this.userInfo.certifiedType != 1 && this.userInfo.certifiedType != 2
      ) {
        this.AuthenticationDialog = true;
      } else {
        this.clearOrderNo();
        /* 加密 */
        var encrypt = Encrypt.encrypt(JSON.stringify(row), "Y2FsdGVkX184Asts"); //密钥自定义 加密解密时保持一致即可
        this.$router.push({
          path: "/order/order-pay",
          query: {
            source: "pay-detail",
            orderNo: row.orderNo,
            tailstatusPayFlag: tailstatusPayFlag,
            data: encrypt,
            orderType: row.orderType,
          },
        });
      }
    },
    orderDetail(row,i) {
      if (i == 1) {
        this.clearOrderNo();
        this.$router.push({
          path: "/order/my-order",
          query: {
            id: row.orderId,
          },
        });
      } else {
        this.clearOrderNo();
        this.$router.push({
          path: "/order/my-order",
          query: {
            id: row.id,
            paymentId: row.orderPaymentVoList[0].orderFeeList[0].paymentId,
          },
        });
      }
    },
    updateStatus(row, status, title) {
      this.clearOrderNo();
      this.title = title;
      this.orderInfo = row;
      this.delStatus = status;
      this.delDialog = true;
    },
    updateOrderStatus(row, status, title) {
      let param = {
        id: row.id,
        orderStatus: status,
        // accountId: this.userInfo.accountId,
        // orderNo: row.orderNo,
        // productName: row.orderDetailVO.productName
      };
      if (status == 6 || status == 7) {
        updateOrder(param).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: title + "订单成功！",
              offset: 80,
              duration: 2000,
            });
            this.delDialog = false;
            this.getOrderList(this.orderStatus);
            this.getStatistics();
          } else {
          }
        });
      } else {
        updateOrder(param).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "订单状态修改成功！",
              offset: 80,
              duration: 2000,
            });
            this.getOrderList();
            this.getStatistics();
          } else {
          }
        });
      }
    },
    copy() {
      new ClipboardJS(".orderNo");
      this.$message({
        type: "success",
        message: "复制成功",
        offset: 80,
        duration: 1000,
      });
      this.clearOrderNo();
    },
    toProductDetail(item) {
      this.clearOrderNo();
      window.open(
        this.property_URL +
          "/" +
          item.orderDetailVO.productId +
          item.orderDetailVO.productSubType
      );
    },
    getOrderList(status) {
      this.orderStatus = status;
      // 退款售后
      if (status == 99) {
        this.ordersList = [];
        let para = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
        };
        getRefundList(para).then((res) => {
          if (res.data.code == 0) {
            this.showOrder = true;
            this.ordersList = res.data.data.records;
            this.total = res.data.data.total;
          } else if (res.data.code == 10002) {
            this.$router.push({
              path: "/login",
            });
          }
        });
      } else {
        let param = {
          accountId: this.userInfo.accountId,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
        };
        if (status == 3) {
          param.orderStatusList = [2, 3];
        } else {
          param.orderStatus = status;
        }
        orderList(param).then((res) => {
          this.ordersList = [];
          if (res.data.code == 0) {
            this.showOrder = true;
            let list = res.data.data.records;
            // this.ordersList = res.data.data.records;
            try {
              list.forEach((ele) => {
                ele.orderPaymentVoList.forEach((item) => {
                  if (item.payType == 1) {
                    //定金
                    this.$set(ele, "hasDeposit", true);
                    this.$set(ele, "depositPrice", 0);
                    item.orderFeeList.forEach((fee) => {
                      if (fee.costType == 3) {
                        //定金官费
                        this.$set(ele, "hasOffical", true);
                        this.$set(ele, "officalPrice", fee.price); //官费单价
                      } else {
                        ele.depositPrice += fee.price;
                      }
                      //payStatus 支付状态：0待付款 1支付中 2支付成功  3支付失败  payChannel支付渠道(0-支付宝，1-对公转账 2-微信)
                      if (fee.payStatus == 1 && fee.payChannel == 1) {
                        this.$set(ele, "waitingAudit", true);
                      } else if (fee.payStatus == 3 && fee.payChannel == 1) {
                        this.$set(ele, "transferFailure", true);
                      }
                      if (fee.tradeNo) {
                        this.$set(ele, "tradeNo", fee.tradeNo);
                      }
                    });
                  }
                  if (item.payType == 3) {
                    //一口价
                    this.$set(ele, "isDue", true);
                    this.$set(ele, "dueDepositPrice", 0);
                    item.orderFeeList.forEach((fee) => {
                      if (fee.costType == 3) {
                        //定金官费
                        this.$set(ele, "hasOffical", true);
                        this.$set(ele, "officalPrice", fee.price); //官费单价
                      } else {
                        ele.dueDepositPrice += fee.price;
                      }
                      if (fee.payStatus == 1 && fee.payChannel == 1) {
                        this.$set(ele, "waitingAudit", true);
                      } else if (fee.payStatus == 3 && fee.payChannel == 1) {
                        this.$set(ele, "transferFailure", true);
                      }
                      if (fee.tradeNo) {
                        this.$set(ele, "tradeNo", fee.tradeNo);
                      }
                    });
                  }
                  if (item.payType == 2) {
                    //尾款
                    if (ele.tailStatus == 0) {
                      // this.$set(ele,'hasOffical',false);
                    } else {
                      this.$set(ele, "finalPrice", 0);
                      if (item.orderFeeList) {
                        item.orderFeeList.forEach((fee) => {
                          ele.finalPrice += fee.price;
                        });
                      }
                    }
                    if (item.payStatus == 1) {
                      this.$set(ele, "waitingAudit", true);
                    } else if (item.payStatus == 3) {
                      this.$set(ele, "transferFailure", true);
                    }
                  }
                });
              });
            } catch (error) {}
            this.ordersList = list;
            this.total = res.data.data.total;
          } else if (res.data.code == 10002) {
            this.$router.push({
              path: "/login",
            });
          }
        });
      }
    },
    // 撤销申请
    makeSureRefund() {
      cancelRefund({ refundId: this.refundId }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            type: "success",
            message: "操作成功",
            offset: 300,
          });
          this.refundDialog = false;
          this.getOrderList(99);
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
            offset: 300,
          });
          this.refundDialog = false;
        }
      });
    },
    goRefundDetail(item, check) {
      let routerUrl;
      if (check == 0) {
        routerUrl = this.$router.resolve({
          path: "/refund/refund-apply",
          query: {
            id: item.id,
            orderNo: item.orderNo,
          },
        });
        window.open(routerUrl.href, "_blank");
      } else if (check == 1) {
        // 退款详情
        routerUrl = this.$router.resolve({
          path: "/refund/refund-apply",
          query: {
            id: item.id,
            orderNo: item.orderNo,
            refundId: item.refundId,
            refundStatus: item.refundStatus,
          },
        });
        window.open(routerUrl.href, "_blank");
      } else {
        // 退款详情
        routerUrl = this.$router.resolve({
          path: "/refund/refund-apply",
          query: {
            id: item.orderId,
            orderNo: item.orderNo,
            refundId: item.tmRefundId,
            refundStatus: item.refundStatus,
          },
        });
        window.open(routerUrl.href, "_blank");
      }
    },
    handleSizeChange(val) {
      this.clearOrderNo();
      this.pageSize = val;
      this.getOrderList(this.orderStatus);
    },
    handleCurrentChange(val) {
      this.clearOrderNo();
      this.currentPage = val;
      this.getOrderList(this.orderStatus);
    },
  },
};
</script>

<style lang="stylus" scoped>
@import './index.stylus';
</style>