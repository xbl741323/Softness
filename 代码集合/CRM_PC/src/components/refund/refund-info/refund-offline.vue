<template>
  <div>
    <table class="table" style="margin-bottom: 30px">
      <tr>
        <th>退款金额</th>
        <th>费用类型</th>
        <th>退款原因</th>
        <th>待处理</th>
        <th>发起时间</th>
      </tr>
      <tr>
        <td>{{ snapshotInformation.refundAmount | filterPrice }}</td>
        <!-- <td><span v-for="item in snapshotInformation.listAmountType" :key="item.id">{{ item.msg }};</span></td> -->
        <td>{{ snapshotInformation.amountType | filterAmount }}</td>
        <td>{{ snapshotInformation.refundReasonContent }}</td>
        <td>
          <el-tooltip effect="dark" :content=" '工号：' + snapshotInformation.taskCommitNo + ' 部门：' + snapshotInformation.taskCommitDeptName" placement="right">
            <span>{{ snapshotInformation.creatorName }}</span>
          </el-tooltip>
        </td>
        <td>
          {{ snapshotInformation.gmtCreate }}
        </td>
      </tr>
      <tr>
        <th>用户名称</th>
        <th>联系人</th>
        <th>线索归属</th>
        <th>订单归属</th>
        <th>业务员</th>
      </tr>
      <tr>
        <td>{{ customerInfo.clueNo }}</td>
        <td>
          <span>{{ customerInfo.customerName }}</span>
        </td>
        <td>
          <span>{{ customerInfo.contactName}} {{customerInfo.contactMobilephone}}</span>
        </td>
        <td>
          <el-tooltip effect="dark" :content=" '工号：' + customerInfo.clueBelongNo + '   部门：' + customerInfo.clueBelongDeptName" placement="right">
            <span>{{ customerInfo.clueBelongName }}</span>
          </el-tooltip>
        </td>
        <td>
          <el-tooltip effect="dark" :content=" '工号：' + customerInfo.salesmanNo + '   部门：' + customerInfo.salesmanDeptName" placement="right">
            <span>{{ customerInfo.salesmanName }}</span>
          </el-tooltip>
        </td>
      </tr>
      <tr>
        <th>问题描述</th>
      </tr>
      <tr>
        <td>{{ snapshotInformation.questionDescription }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import refundDataJs from '../refund'
export default {  
  props:{
    snapshotInformation:{
      type: Object,
      default:{}
    },
    customerInfo:{
      type: Object
    }
  },
  data(){
    return {

    }
  },
  filters: {
    filterPrice(val) {
      return refundDataJs.filterPrice(val);
    },
    remarkStatus(val) {
      return refundDataJs.remarkStatus(val);
    },
    filterAmount(val) {
      return refundDataJs.filterAmount(val);
    },
    filterType(val) {
      return refundDataJs.filterType(val);
    },
    cancleStatus(val) {
      return refundDataJs.cancleStatus(val);
    },
    fiterReason(val) {
      return refundDataJs.fiterReason(val);
    },
  },
}
</script>