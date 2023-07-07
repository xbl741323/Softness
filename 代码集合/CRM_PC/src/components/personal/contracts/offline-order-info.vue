<template>
  <div class="order_contain">
    <div class="list-header">
      <p class="rectangle"></p>
      <b class="text">订单信息</b>
    </div>
    <!-- 审核通过状态订单详情 -->
    <div class="table" v-if="data.contractStatus == 1">
      <!-- 头：列名   -->
      <el-row type="flex" align="middle" class="thead">
        <el-col :span="3"><span>订单编号</span></el-col>
        <el-col :span="3"><span>产品名称</span></el-col>
        <el-col :span="3"><span>交付时间</span></el-col>
        <el-col :span="2"><span>数量</span></el-col>
        <el-col :span="2"><span>代理费总价</span></el-col>
        <el-col :span="3"><span>第三方总价</span></el-col>
        <el-col :span="2"><span>官费总价</span></el-col>
        <el-col :span="3"><span>订单总价</span></el-col>
        <el-col :span="3"><span>备注</span></el-col>
        <el-col :span="3"><span>订单生成日期</span></el-col>
      </el-row>
      <!-- 订单列表 -->
      <div v-for="(item, index) in orderData" :key="index" class="list">
        <!-- <div>{{orderData}}</div> -->
        <el-row type="flex" align="middle">
          <el-col :span="3"
            ><span>{{ item.orderNo }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{ item.orderDetail.productName }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{ item.finishTime }}</span></el-col
          >
          <el-col :span="2"
            ><span>{{ item.orderDetail.productCount }}</span></el-col
          >
          <el-col :span="2"
            ><span>{{
              item.orderDetail.agencyFee == null
                ? "待定"
                : item.orderDetail.agencyFee / 100
            }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{
              item.orderDetail.thirdPartyFee == null
                ? "待定"
                : item.orderDetail.thirdPartyFee / 100
            }}</span></el-col
          >
          <el-col :span="2"
            ><span>{{
              item.orderDetail.governmentFee == null
                ? "待定"
                : item.orderDetail.governmentFee / 100
            }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{
              item.orderDetail.agencyFee == null ||
              item.orderDetail.thirdPartyFee == null ||
              item.orderDetail.governmentFee == null
                ? "待定"
                : item.totalAmount / 100
            }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{ item.orderNote }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{ item.gmtCreate }}</span></el-col
          >
        </el-row>
        <!-- <el-row v-if="item.orderNote" type="flex" align="middle" class="order">
          <el-col :span="24"
            ><span>备注：{{ item.orderNote }}</span></el-col
          >
        </el-row> -->
      </div>
      <!-- 尾：合计   -->
      <div class="count">
        <el-row type="flex" align="middle">
          <el-col :span="3"><span>合计：</span></el-col>
          <el-col :span="8"></el-col>
          <el-col :span="2"
            ><span>{{
              data.agentTotalUncertain ? "待定" : data.agentTotal / 100
            }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{
              data.thirdTotalUncertain ? "待定" : data.thirdTotal / 100
            }}</span></el-col
          >
          <el-col :span="2"
            ><span>{{
              data.govTotalUncertain ? "待定" : data.govTotal / 100
            }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{
              data.contractSumUncertain
                ? "待定"
                : (data.agentTotal + data.thirdTotal + data.govTotal) / 100
            }}</span></el-col
          >
          <el-col :span="6"></el-col>
          <!-- <el-col :span="3"></el-col> -->
        </el-row>
      </div>
    </div>
    <!-- 其他状态订单详情 -->
    <div class="table" v-else>
      <el-row type="flex" align="middle" class="thead">
        <el-col :span="4"><span>订单编号</span></el-col>
        <el-col :span="4"><span>产品名称</span></el-col>
        <el-col :span="4"><span>交付时间</span></el-col>
        <el-col :span="3"><span>数量</span></el-col>
        <el-col :span="3"><span>代理费总价</span></el-col>
        <el-col :span="3"><span>第三方费用总价</span></el-col>
        <el-col :span="3"><span>官费总价</span></el-col>
        <el-col :span="4"><span>订单总价</span></el-col>
        <el-col :span="3"><span>备注</span></el-col>
        <el-col :span="4"><span>订单生成日期</span></el-col>
      </el-row>
      <!-- 订单列表 -->
      <div v-for="(item, index) in orderData" :key="index" class="list">
        <el-row type="flex" align="middle">
          <!-- 订单编号 -->
          <el-col :span="4"
            ><span>{{ item.orderNo }}</span></el-col
          >
          <!-- 产品名称 -->
          <el-col :span="4"
            ><span>{{ item.orderDetail.productName }}</span></el-col
          >
          <!-- 交付时间 -->
          <el-col :span="4"
            ><span>{{ item.finishTime }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{ item.orderDetail.productCount }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{
              item.orderDetail.agencyFee == null
                ? "待定"
                : item.orderDetail.agencyFee / 100
            }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{
              item.orderDetail.thirdPartyFee == null
                ? "待定"
                : item.orderDetail.thirdPartyFee / 100
            }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{
              item.orderDetail.governmentFee == null
                ? "待定"
                : item.orderDetail.governmentFee / 100
            }}</span></el-col
          >
          <el-col :span="4"
            ><span>{{
              item.orderDetail.agencyFee == null ||
              item.orderDetail.thirdPartyFee == null ||
              item.orderDetail.governmentFee == null
                ? "待定"
                : item.totalAmount / 100
            }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{ item.orderNote }}</span></el-col
          >
          <el-col :span="4"
            ><span>{{ item.gmtCreate }}</span></el-col
          >
        </el-row>
        <el-row v-if="item.orderNote" type="flex" align="middle" class="order">
          <el-col :span="24"
            ><span>备注：{{ item.orderNote }}</span></el-col
          >
        </el-row>
      </div>
      <!-- 尾：合计   -->
      <div class="count">
        <el-row type="flex" align="middle">
          <el-col :span="4"><span>合计：</span></el-col>
          <el-col :span="4"></el-col>
          <el-col :span="4"></el-col>
          <el-col :span="3"></el-col>
          <!-- 代理费总价 -->
          <el-col :span="3"
            ><span>{{
              data.agentTotalUncertain ? "待定" : data.agentTotal / 100
            }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{
              data.thirdTotalUncertain ? "待定" : data.thirdTotal / 100
            }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{
              data.govTotalUncertain ? "待定" : data.govTotal / 100
            }}</span></el-col
          >
          <el-col :span="4"
            ><span>{{
              data.contractSumUncertain
                ? "待定"
                : (data.agentTotal + data.thirdTotal + data.govTotal) / 100
            }}</span></el-col
          >
          <el-col :span="3"></el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { orderOption } from "@/const/crud/personal/order";

export default {
  props: ["orderData", "data"],
  data() {
    return {
      isPassed: true,
      orgSum: 0,
      agentSum: 0,
      otherSum: 0,
      orderOption: orderOption,
    };
  },
  methods: {
    //列尾求和
    getSummaries() {
      return [
        "合计",
        "",
        "",
        this.data.agentTotal / 100,
        this.data.thirdTotal / 100,
        this.data.govTotal / 100,
        "",
        (this.data.agentTotal + this.data.thirdTotal + this.data.govTotal) /
          100,
        "",
      ];
    },
    getSum() {
      return [
        "合计",
        "",
        this.data.agentTotal / 100,
        this.data.thirdTotal / 100,
        this.data.govTotal / 100,
        "",
        (this.data.agentTotal + this.data.thirdTotal + this.data.govTotal) /
          100,
        "",
      ];
    },
    addRedStar(h, { column }) {
      // 给表头加标识
      return [
        h("span", { style: "color: red" }, "*"),
        h("span", " " + column.label),
      ];
    },
  },
  mounted() {
    this.getSum();
  },
};
</script>
<style scoped>
.count {
  font-size: 14px !important;
  font-weight: bold !important;
  margin-top: 8px;
  background: #fafafa;
}
.change {
  background: #fafafa;
}
.red {
  color: red;
}
.list-header {
  display: flex;
  margin: 0 0;
}
.rectangle {
  width: 5px;
  height: 15px;
  background: #0aa1ed;
  border-radius: 3px;
  padding: 0;
}
.text {
  font-size: 14px;
  padding: 10px 10px;
  margin: 3px 0;
}
.table {
  padding-bottom: 50px;
}
.thead {
  font-size: 12px;
  font-weight: bold;
  background: #fafafa;
}
.list {
  border: 1px solid #eee;
  margin-top: 8px;
  font-size: 12px;
  color: #606266;
}
.order {
  font-size: 10px !important;
  color: #bbb;
}
</style>
<style >
.order_contain .batch-choose .avue-crud__pagination {
  margin: 0 0;
  padding: 0 0;
}
.order_contain .table .el-row {
  min-height: 45px;
  border-bottom: 1px solid #f5f7fa;
}
.order_contain .table .el-col {
  margin: 0 0;
  padding: 8px 0px 8px 15px;
}
.order_contain .table .el-col span {
  overflow: hidden;
}
</style>