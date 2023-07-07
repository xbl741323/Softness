<template>
  <div class="order-records">
    <div class="order-filter-item">
      <span class="order-name-sty">订单类型：</span>
      <el-radio-group v-model="filters.orderType" >
        <el-radio-button
          v-for="(item, index) in typeList"
          :key="index"
          border
          :label="item.value"
          :class="['order-btn-sty', index > 0 ? 'order-border-sty' : '']">{{ item.title }}</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="filters.orderType==0" class="marl">
      <product-order></product-order>
    </div>
    <div v-if="filters.orderType==1" class="marl">
      <course-order></course-order>
    </div>
    <div v-if="filters.orderType==2" class="marl">
      <member-order></member-order>
    </div>
  </div>
</template>

<script>
import { tableOption } from "@/const/crud/user/order-records";
import productOrder from "@/components/user/orderRecords/product-order";
import courseOrder from "@/components/user/orderRecords/course-order";
import memberOrder from "@/components/user/orderRecords/member-order";
export default {
  //personal-个人中心 list-订单管理
  props: ["source"],
  components:{
    productOrder,
    courseOrder,
    memberOrder
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      dataList: [],
      tableLoading: false,
      option: tableOption,
      page: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [10, 20, 30, 50, 100],
      },
      isOnline: false, // 是否是线上交易知产 true:是 false:否
      typeList: [
        {
          title: "产品订单",
          value: 0,
        },
        {
          title: "课程订单",
          value: 1,
        },
        {
          title: "会员订单",
          value: 2,
        },
      ],
      tatusList: [],
      filters: {
        orderType: 0,
        orderStatus: null,
        keyWords: "",
        createTime: null,
      },
    };
  },
  filters: {
    priceFilter(value) {
      return value == null ? "待定" : (value / 100).toFixed(2);
    },
    voucherFilter(value) {
      return value == 0 ? "审核中" : value == 2 ? "未通过" : "";
    },
    statusFilter(value) {
      return value == 1
        ? "待分配"
        : value == 0
        ? "待开始"
        : value == 2
        ? "进行中"
        : value == 3
        ? "已暂停"
        : value == 4
        ? "已完成"
        : value == 5
        ? "已关闭"
        : value == 6
        ? "待付款"
        : value == 7
        ? "已取消"
        : value == 8
        ? "已删除"
        : "";
    },
  },
  methods: {

  },
};
</script>

<style scoped>
.order-records {
  padding: 0 30px;
}
.order-filter-item {
  margin: 0 0 15px 0;
}
.order-name-sty {
  font-size: 14px;
  color:#606266;
}
.order-btn-sty {
  margin: 0 20px 0 0;
}
.order-border-sty {
  border-left: 1px solid #dcdfe6;
}
.order-input-sty {
  width: 300px;
}
#handle-style {
  color: rgb(64, 158, 255) !important;
  cursor: pointer;
}
.disbale_content {
  display: flex;
  justify-content: center;
}
.disable_img_sty {
  width: 20px;
  height: 20px;
  margin-left: 3px;
}
.red-txt {
  color: red;
}
.circle-blue {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 6px;
}
.circleYellow {
  background: #ff9900;
}
.success {
  font-weight: bolder;
  font-size: 12px;
  float: left;
  color: green;
  margin-top: 2px;
  margin-right: 6px;
}
.transfer-status {
  font-size: 12px;
  color: #999;
  margin: -5px 0;
}
.order-status-sty{
  display: flex;
  justify-content: center;
  align-items: center;
}
.marl {
  margin-left:-30px;
}
</style>