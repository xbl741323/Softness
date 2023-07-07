<template>
  <div class="order_personal">
    <div class="order_status">
      <div
        v-for="item in statusList"
        :key="item.value"
        class="statusitem"
        @click="handleTabclick(item)"
        :class="
          statusValue == item.value
            ? 'status-label active-label'
            : 'status-label'
        "
      >
        <el-badge :value="item.value == 0 ? statisticsList : ''">
          <img :src="item.img" width="28px" height="28px" />
        </el-badge>
        <span class="wordstep">{{ item.label }}</span>
      </div>
    </div>
    <!-- 订单表头 -->
    <div class="order-tr" v-if="statusValue != 99">
      <p v-for="item in titleList" :key="item.value">{{ item.label }}</p>
    </div>
    <div v-if="showOrder">
      <!-- 我的订单 -->
      <template>
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
            <p>{{ item.createTime }}</p>
            <p>订单号：{{ item.orderNo }}</p>
            <img
              class="orderNo"
              src="~assets/images/order/copy_icon@2x.png"
              alt="复制"
              :data-clipboard-text="item.orderNo"
              @click="copy()"
            />
          </div>
          <div class="order-info">
            <div class="product-info product-order">
              <div class="product-img">
                <img :src="imgUrl + item.fileImageUrl" class="file-imgurl"/>
                <div class="right-bar" @click="orderDetail(item)">
                  <p class="product-name">{{ item.fileName }}</p>
                </div>
                <img :src="iconUrl[item.fileType]" alt="" class="icon-position">
              </div>
              <div>
                <p class="fee">
                  ￥{{ item.price|filterAmount }}
                </p>
              </div>
              <p class="gover-fee fee-other">1</p>
            </div>
            <!-- 金额 -->
            <div class="pay-info">
              <div class="general">
                <p class="amount-pay amount-price">
                  <span v-if="item.price">￥</span>
                  {{ item.price|filterAmount }}
                </p>
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
                </div>
              </div>
              <!-- 操作 -->
              <div class="general ingeneral">
                <div class="make-pay">
                  <p
                    :class="
                      item.waitingAudit
                        ? 'pay-order pay-order-cancel'
                        : 'pay-order'
                    "
                    v-if="item.orderStatus == 0"
                    @click="toPay(item)"
                  >
                    去付款
                  </p>
                  <p
                    class="cancel-order"
                    v-if="item.orderStatus == 0"
                    @click="updateStatus(item, 2, '取消')"
                  >
                    取消订单
                  </p>
                  <p
                    class="delte-order"
                    v-if="item.orderStatus == 2"
                    @click="updateStatus(item, 3, '删除')"
                  >
                    删除订单
                  </p>
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
import orderData from "./fileOrder-data";
import { fileOrderList, getMyWaitPayCount, cancelFileOrder, deleteFileOrder } from '~/api/fileorder'
import ClipboardJS from "clipboard";
import Encrypt from "~/plugins/Encrypt";

export default {
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
      statusValue: 0,
      titleList: orderData.titleList,
      userInfo: {},
      detailInfo: {},
      ordersList: [],
      statisticsList: null,
      imgUrl: process.env.CDN_BASE_URL,
      property_URL: process.env.PROPERTY_URL,
      pageSize: 10,
      currentPage: 1,
      total: 10,
      delDialog: false,
      essAuthDialog: false,
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
      iconUrl: {
        doc: require('@/assets/images/zhengce/icon_word.png'),
        docx: require('@/assets/images/zhengce/icon_word.png'),
        ppt: require('@/assets/images/zhengce/icon_ppt.png'),
        pptx: require('@/assets/images/zhengce/icon_ppt.png'),
        pdf: require('@/assets/images/zhengce/icon_pdf.png'),
        xls: require('@/assets/images/zhengce/icon_excel.png'),
        xlsx: require('@/assets/images/zhengce/icon_excel.png'),
      },
      signDialog: false,
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
    filterAmount(val) {
      return Number(val).toFixed(2)
    }
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
        this.getOrderList(0);
        this.getStatistics();
      } else {
        this.$router.push({ path: "/login" });
      }
    }
  },
  methods: {
    handleTabclick(item) {
      this.statusValue = item.value;
      this.currentPage = 1;
      this.getOrderList(item.orderStatus);
      if (item.value == null) {
        this.$router.push({
          path: "/member/order",
        });
        sessionStorage.setItem('orderType', 1)
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
            this.getOrderList(this.orderStatus);
            this.getStatistics();
          } else {
          }
        });
      }
    },
    getStatistics() {
      getMyWaitPayCount({ accountId: this.userInfo.accountId }).then(
        (res) => {
          if (res.data.code == 0) {
            this.statisticsList = res.data.data == 0 ? null : res.data.data;
          }
        }
      );
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
    toPay(row) {
      this.$router.push({
        path: '/policy/files/file-order',
        query: {
          orderId: row.id,
          id: row.fileId,
        }
      })
    },
    orderDetail(row) {
      this.clearOrderNo();
      this.$router.push({
        path: "/order/fileOrder-detail",
        query: {
          id: row.id,
        },
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
      let param = {
        accountId: this.userInfo.accountId,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderStatus: status,
      };
      fileOrderList(param).then((res) => {
        this.ordersList = [];
        if (res.data.code == 0) {
          this.showOrder = true;
          this.orderStatus = status
          let list = res.data.data.records;
          this.ordersList = list;
          this.total = res.data.data.total;
        } else if (res.data.code == 10002) {
          this.$router.push({
            path: "/login",
          });
        }
      });
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