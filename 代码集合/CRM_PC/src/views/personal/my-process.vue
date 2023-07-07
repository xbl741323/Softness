<!-- 排查完成 -->
<template>
  <basic-container>
    <el-form v-if="chooseForm.processState" ref="chooseForm" label-width="90">
      <el-form-item label="流程类型：" prop="processState">
        <el-radio-group v-model="chooseForm.processState" size="medium" @change="changeTab">
          <el-radio-button label="refund">退款审批</el-radio-button>
          <el-badge v-if="refundPending > 0" :value="refundPending" class="item my-process"></el-badge>
          <el-radio-button v-if="contractPending > 0" class="radio-sty-left marginl-20" label="contract">合同审批
          </el-radio-button>
          <el-radio-button v-if="changemoneyPending > 0" class="radio-sty-left marginl-20" label="changemoney">
            改价审批
          </el-radio-button>
          <el-radio-button v-if="invoicePending > 0" class="radio-sty-left marginl-20" label="invoice">开票审批
          </el-radio-button>
          <el-badge v-if="invoicePending > 0" :value="invoicePending" class="item my-process-other"></el-badge>
          <el-radio-button v-if="transferPending > 0" class="radio-sty-left marginl-20" label="transfer">对公转账审批
          </el-radio-button>
          <el-badge v-if="transferPendingWaitAudit > 0" :value="transferPendingWaitAudit" class="item my-process-other"></el-badge>
          <el-radio-button   v-if="permissions.bt_salary_audit_my_flag" class="radio-sty-left marginl-20" label="salary">薪酬审批</el-radio-button>
          <el-radio-button class="radio-sty-left marginl-20" label="approval">初级认证/授权审批</el-radio-button>
          <el-radio-button class="radio-sty-left marginl-20" label="taskval">开启任务审批</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!-- 改价审批 -->
    <changePrice v-if="chooseForm.processState == 'changemoney'" :changeType="changeType" :refundFrom="my"
                 class="child-sty"></changePrice>
    <!-- 退款审批 -->
    <refund v-if="chooseForm.processState == 'refund'" ref="refundChild" :refundFrom="my"></refund>
    <!-- 合同审批 -->
    <contract v-if="chooseForm.processState == 'contract'" :refundFrom="my" class="child-sty"></contract>
    <!-- 发票审批 -->
    <invoice v-if="chooseForm.processState == 'invoice'" :refundFrom="my" class="child-sty"></invoice>
    <!-- 对公转账审批 -->
    <transfer v-if="chooseForm.processState == 'transfer'" :refundFrom="my" class="child-sty"></transfer>
    <!-- 薪酬审批 -->
    <salaryList v-if="chooseForm.processState == 'salary'" :refundFrom="my" class="child-sty"></salaryList>
    <!-- 初级认证/授权审批 -->
    <approval v-if="chooseForm.processState == 'approval'" :refundFrom="my" class="child-sty"></approval>
    <!-- 开启任务审批-->
    <taskval v-if="chooseForm.processState == 'taskval'" :refundFrom="my" class="child-sty"></taskval>
    <div v-if="!chooseForm.processState" class="no-data">
      <el-empty description="暂无数据"></el-empty>
    </div>
  </basic-container>
</template>

<script>
import {statisticsMyRefund} from "@/api/processmanage/refund";
import {getContractStatus, myPayOfflineStatistics, getByMyStatus} from "@/api/personal/myprocess";
import {countStateOfMy} from "@/api/processmanage/invoicing";
import refund from "@/components/refund/refundList";
import contract from "@/views/process-manage/index";
import changePrice from "@/components/process-manage/changePrice";
import invoice from "@/views/process-manage/invoicing";
import transfer from "@/views/process-manage/transfer";
import approval from "@/views/process-manage/approval"
import taskval from "@/views/process-manage/taskval.vue"
import salaryList from "@/components/process-manage/salaryList";
import { mapGetters } from 'vuex';
import * as CodeMsg from "@/api/common/CodeChange";

export default {
  components: {
    changePrice,
    refund,
    contract,
    invoice,
    transfer,
    salaryList,
    approval,
    taskval
  },
  data() {
    return {
      chooseForm: {
        processState: "",
      },
      stateList: [
        {status: null, count: 0, lable: "全部"},
        {status: 0, count: 0, lable: "待审核"},
        {status: 2, count: 0, lable: "未通过"},
        {status: 1, count: 0, lable: "已通过"}
      ],
      my: "mine",
      refundPending: 0,
      contractPending: 0,
      invoicePending: 0,
      transferPending: 0,
      transferPendingWaitAudit: 0,
      changemoneyPending: 0,
      changeType: 1,
      approvalPending: 0,
      taskvalPending: 0
    };
  },
  mounted() {
    this.getCountList()
  },
  methods: {
    changeTab(e) {
      sessionStorage.setItem('tabStare', e);
    },
    getCountList() {
      if(this.authority) {
        statisticsMyRefund().then((res) => {
          this.refundPending = res.data.data.waitMeHandleCount
        })
      };
      getByMyStatus().then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.changemoneyPending = Number(res.data.data.waitAuditCount + res.data.data.notPassCount)
        }
      });
      getContractStatus('mine').then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          let sum = 0;
          res.data.data.forEach(item => {
            return sum += item.typeNum
          });
          this.contractPending = sum
        }
      });
      countStateOfMy().then((res) => {
        let stateList = res.data.data;
        let sum = 0;
        stateList.forEach(item => {
          return sum += item.count;
        });
        this.invoicePending = sum
      });
      myPayOfflineStatistics().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.stateList[1].count = res.data.data.waitAudit;
          this.stateList[2].count = res.data.data.auditFail;
          this.stateList[3].count = res.data.data.auditPass;
          this.transferPendingWaitAudit = res.data.data.waitAudit;
          let sum = 0;
          this.stateList.forEach(item => {
            return sum += item.count
          });
          this.transferPending = sum;
        }
      });
    }
  },
  watch: {
    chooseBtn(val) {
    }
  },
  computed: {
    chooseBtn() {
      if (sessionStorage.getItem('tabStare')) {
        let tabStare = sessionStorage.getItem('tabStare')
        this.chooseForm.processState = tabStare
      } else {
        this.chooseForm.processState =
          this.refundPending > 0
            ? "refund"
            : this.contractPending > 0
              ? "contract"
              : this.invoicePending > 0
                ? "invoice"
                : this.transferPending > 0
                  ? "transfer"
                  : this.changemoneyPending > 0
                    ? "approval" : this.taskvalPending > 0
                      ? "taskval" :
                      "salary";
      }
    },
    ...mapGetters(['permissions']),
    authority(){
      if(this.refundFrom){
        return this.permissions.bt_refund_detail_my || this.permissions.bt_refund_audit_my;
      } else {
        return this.permissions.bt_refund_detail || this.permissions.bt_refund_audit;
      }
    }
  }
};
</script>
<style>
.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}

.my-process .el-badge__content {
  margin: -20px 0 0 -30px;
}

.my-process-other .el-badge__content {
  margin: -20px 0 0 -12px;
}

.last-radio .el-radio-button__inner {
  border-radius: 0 4px 4px 0 !important;
}

.marginl-20 {
  margin-left: 15px;
}

.child-sty {
  margin: -20px;
  padding: 0;
}

.no-data {
  width: 600px;
  margin: auto;
  min-height: 720px;
  text-align: center;
}

.no-data img {
  margin-top: 300px;
}
</style>
