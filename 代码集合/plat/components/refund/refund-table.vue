<template>
  <div>
    <el-table :data="payList" border :header-cell-style="cell" :span-method="spanMethod">
      <el-table-column
        label="退款时间"
        prop="gmtModified"
        align="center"
      ></el-table-column>
      <el-table-column label="费用类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.policyFeeType | policyFee }}
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.count }}</p></template
        >
      </el-table-column>
      <el-table-column label="退款金额" align="center">
        <template slot-scope="scope"
          >￥{{ scope.row.payAmount }}</template
        >
      </el-table-column>
      <el-table-column label="退款状态" align="center">
        {{ orderInfo.refundStatus | filterStatus }}
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import orderData from "~/pages/member/order/productOrder/order-data";
export default {
  props: {
    payList: {
      type: Array,
      required: true,
    },
    orderInfo: {
      type: Object,
      required: true,
    },
  },
  filters: {
    policyFee(val) {
      switch (val) {
        case 1:
          return "官费";
        case 2:
          return "服务费-定金";
        case 3:
          return "服务费-尾款";
        case 4:
          return "一口价";
        default:
          return "";
      }
    },
    filterStatus(val) {
      return orderData.refundStatus(val);
    },
    filterFee(val) {
      return val.toFixed(2);
    },
  },
  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 2) {
        if (rowIndex == 0) {
          return {
            rowspan: 3,
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      } 
    },
    cell() {
      return {
        background: "#F3FBFE",
      };
    },
  },
};
</script>