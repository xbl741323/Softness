<template>
  <div class="aaa">
    <div class="contracts">
      <div class="details">
        <div class="top-detail">
          <div class="processnumber">
            <img
              src="../../assets/images/process/liucheng_icon.png"
              style="width: 24px; height: 24px; position: relative; top: 5px"
            />
            <span style="margin-left: 8px; font-weight: 600"
              >流程编号：{{ $route.query.taskNo }}</span
            >
            <el-button
              v-if="
                snapshotInformation.taskCommitEmpId &&
                currentUserId == snapshotInformation.taskCommitEmpId &&
                snapshotInformation.taskStatus == 0
              "
              type="primary"
              size="medium"
              class="ceshi"
              @click="doCancel"
              >撤销退款申请</el-button
            >
          </div>
          <table class="table" style="margin-bottom: 30px">
            <tr>
              <th>流程状态</th>
              <th>退款金额</th>
              <th>费用类型</th>
              <th>退款原因</th>
              <th>发起人</th>
              <th>发起时间</th>
            </tr>
            <tr>
              <td>
                <span
                  v-show="snapshotInformation.taskStatus == 0"
                  class="circleBluec"
                ></span>
                <span
                  v-show="snapshotInformation.taskStatus == 1"
                  class="successc"
                  ><b>✔</b></span
                >
                <span
                  v-show="snapshotInformation.taskStatus == 2"
                  class="circleRedc"
                ></span>
                <span
                  >{{ snapshotInformation.taskStatus | remarkStatus }}
                </span>
              </td>
              <td>{{ snapshotInformation.refundAmount | filterPrice }}</td>
              <td>{{ snapshotInformation.amountType | filterAmount }}</td>
              <td>{{ snapshotInformation.refundReasonContent }}</td>
              <td>
                <el-tooltip effect="dark" :content="'工号：'+ snapshotInformation.taskCommitNo +'   部门：' + snapshotInformation.taskCommitDeptName"
                  placement="right">
                  <span>{{ snapshotInformation.creatorName }}</span>
                </el-tooltip>
              </td>
              <td>
                {{ snapshotInformation.gmtCreate }}
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

        <!-- 客户信息 -->
        <div class="list-header">
          <p class="rectangle"></p>
          <b class="text">客户信息</b>
        </div>
        <el-table
          :data="kefuArray"
          :header-cell-style="{ background: '#FAFAFA',color:'#000000D9' }"
          border
          style="margin-bottom: 30px"
        >
          <el-table-column prop="clueNo" label="线索编号" width="180">
          </el-table-column>
          <el-table-column prop="clueType" label="线索类型" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.clueType | filterType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orgName" label="客户名称"> </el-table-column>
          <el-table-column prop="contactName" label="联系人"> </el-table-column>
          <el-table-column prop="contactMobilephone" label="联系方式">
          </el-table-column>
          <el-table-column prop="clueBelongName" label="线索归属">
            <template slot-scope="scope">
              <el-tooltip
                effect="dark"
                :content="
                  '工号：' +
                  scope.row.clueBelongNo +
                  '   部门：' +
                  scope.row.clueBelongDeptName
                "
                placement="right"
              >
                <span>{{ scope.row.clueBelongName }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="salesmanName" label="业务员">
             <template slot-scope="scope">
                <el-tooltip
                    effect="dark"
                    :content="
                    '工号：' +
                    scope.row.salesmanNo +
                    '   部门：' +
                    scope.row.salesmanDeptName
                    "
                    placement="right"
                >
                    <span>{{ scope.row.salesmanName }}</span>
                </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 订单信息 -->
        <template v-if="orderArray.length > 0">
          <div class="list-header">
            <p class="rectangle"></p>
            <b class="text">订单信息</b>
          </div>
          <el-table
            :data="orderArray"
            :header-cell-style="{ background: '#FAFAFA',color:'#000000D9' }"
            border
            style="margin-bottom: 30px"
          >
            <el-table-column prop="orderNo" label="订单编号" width="180">
            </el-table-column>
            <el-table-column prop="productName" label="产品名称" width="180">
            </el-table-column>
            <el-table-column prop="finishTime" label="交付时间">
            </el-table-column>
            <el-table-column prop="productCount" label="数量">
            </el-table-column>
            <el-table-column prop="agencyFee" label="代理费总价">
              <template slot-scope="scope">
                <span>{{ scope.row.agencyFee | filterPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="thirdPartyFee" label="第三方费用总价">
              <template slot-scope="scope">
                <span>{{ scope.row.thirdPartyFee | filterPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="governmentFee" label="官费总价">
              <template slot-scope="scope">
                <span>{{ scope.row.governmentFee | filterPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="订单总价">
              <template slot-scope="scope">
                <span>{{ scope.row.totalAmount | filterPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="订单生成日期">
            </el-table-column>
          </el-table>
        </template>
        <!-- 回款信息 -->
        <div class="list-header">
          <p class="rectangle"></p>
          <b class="text">回款信息</b>
        </div>
        <el-table
          :data="refundArray"
          :header-cell-style="{ background: '#FAFAFA',color:'#000000D9' }"
          border
          style="margin-bottom: 30px"
        >
          <el-table-column prop="receiveNo" label="回款编号" width="180">
          </el-table-column>
          <el-table-column prop="contractNo" label="合同编号" width="180">
          </el-table-column>
          <el-table-column prop="receiveAmount" label="回款金额">
            <template slot-scope="scope">
              <span>{{ scope.row.receiveAmount | filterPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payerName" label="付款方名称">
          </el-table-column>
          <el-table-column prop="amountType" label="费用类型">
            <template slot-scope="scope">
              <span>{{ scope.row.amountType | filterAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="receiveDirectionName" label="回款去向">
          </el-table-column>
          <el-table-column prop="claimName" label="认领人">
            <template slot-scope="scope">
              <el-tooltip
                effect="dark"
                :content="
                  '工号：' +
                  scope.row.claimNo +
                  '   部门：' +
                  scope.row.claimDeptName
                "
                placement="right"
              >
                <span>{{ scope.row.claimName }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="receiveTime" label="回款时间">
          </el-table-column>
        </el-table>
        <!-- 审批操作 -->
        <div
          class="examine"
          v-if="
            snapshotInformation.taskCurrentEmpId &&
            currentUserId == snapshotInformation.taskCurrentEmpId &&
            snapshotInformation.taskStatus == 0
          "
        >
          <div class="list-header">
            <p class="rectangle"></p>
            <b class="text">审批</b>
          </div>
          <div class="examine-content">
            <p>审批意见：</p>
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="textarea"
              maxlength="100"
              show-word-limit
              clearable
              rows="4"
            >
            </el-input>
            <div class="button">
              <el-button
                type="success"
                size="medium"
                v-preventReClick
                @click="handleOn"
                >{{ $t("button.auditingPassed") }}</el-button
              >
              <el-button
                type="danger"
                size="medium"
                class="unpassed"
                v-preventReClick
                @click="handleOff"
                >{{ $t("button.auditingUnPassed") }}</el-button
              >
            </div>
          </div>
        </div>
        <!-- 验证码操作 -->
        <el-dialog
          title="身份验证"
          :visible.sync="centerDialogVisible"
          :close-on-click-modal="false"
          center
          width="420px"
          height="380px"
        >
          <div style="display: flex">
            <el-input v-model="code" placeholder="请输入验证码"></el-input>
            <el-button
              class="achievecode"
              :class="{ ccc: codeDisabled == true }"
              :disabled="codeDisabled"
              @click="getCode"
              >{{ btnCode }}</el-button
            >
          </div>
          <div style="margin-top: 15px; color: #333333a1">
            请输入尾号为{{ showMobile }}的手机号收到的验证码
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              @click="handleSubmit"
              :disabled="!code"
              v-preventReClick
              >确 定</el-button
            >
            <el-button @click="centerDialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
        <!-- 审核记录 -->
        <div class="process-record" v-if="recordData.length > 0">
          <div class="list-header">
            <p class="rectangle"></p>
            <b class="text">审核记录</b>
          </div>
          <div class="record-top">
            <el-timeline v-if="recordData.length > 0">
              <el-timeline-item
                v-for="(element, index) in recordData"
                :key="index"
                :color="index == 0 ? '#ff6600' : ''"
                placement="top"
                hide-timestamp
              >
                <p>
                  {{ element.auditStatus | cancleStatus }}
                </p>
                <el-tooltip
                  v-if="element.operatorNo"
                  effect="dark"
                  :content="
                    '工号：' +
                    element.operatorNo +
                    '  部门：' +
                    element.operatorDept
                  "
                  placement="right"
                >
                  <span>
                    操作人：{{
                      element.operatorName ? element.operatorName : "暂无"
                    }}
                  </span>
                </el-tooltip>
                <el-tooltip
                  v-else
                  effect="dark"
                  content="暂无"
                  placement="right"
                >
                  <span>
                    操作人：{{
                      element.operatorName ? element.operatorName : "暂无"
                    }}
                  </span>
                </el-tooltip>
                <p v-if="element.auditStatus != 0 && element.auditStatus != 5">
                  审批意见：
                  {{ element.auditNote ? element.auditNote : "暂无" }}
                </p>
                <p>
                  {{ element.gmtCreate }}
                </p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getpersonrefundDetail,
  refundRevoke,
  myaudit,
  permissSendCode,
  myauditFail,
  getMobile,
} from "@/api/processmanage/refund";
import * as CodeMsg from "@/api/common/CodeChange"
export default {
  components: {},
  data() {
    return {
      encodeTaskNo: null,
      num: 60,
      btnCode: "获取验证码",
      codeDisabled: false,
      code: null,
      centerDialogVisible: false,
      snapshotInformation: {},
      kefuArray: [],
      orderArray: [],
      refundArray: [],
      recordData: [],
      textarea: "",
      currentUserId: null,
      showMobile: null,
    };
  },
  filters: {
    filterPrice(val) {
      if (val) {
        return (val / 100).toFixed(2);
      } else {
        return "待定";
      }
    },
    remarkStatus(val) {
      if (val == "0") {
        return "待审核";
      } else if (val == "1") {
        return "已通过";
      } else if (val == "2") {
        return "未通过";
      } else {
        return "已撤销";
      }
    },
    filterAmount(val) {
      if (val == "0") {
        return "代理费";
      } else if (val == "1") {
        return "第三方费用";
      } else if (val == "2") {
        return "官费";
      }
    },
    filterType(val) {
      if (val == 0) {
        return "个人";
      } else {
        return "单位";
      }
    },
    cancleStatus(val) {
      if (val == "0") {
        return "提交审核";
      } else if (val == "1") {
        return "审核通过";
      } else if (val == "2") {
        return "审核不通过";
      } else {
        return "撤销申请";
      }
    },
    fiterReason(val) {
      if (val == "0") {
        return "客户取消订单";
      } else if (val == "1") {
        return "我司服务未完成";
      } else if (val == "2") {
        return "客户付款金额错误";
      } else if (val == "3") {
        return "客户付款方式错误";
      } else if (val == "4") {
        return "退款原因";
      } else {
        return "其他";
      }
    },
  },
  mounted() {
    this.getDetail();
  },

  methods: {
    getDetail() {
      getpersonrefundDetail(this.$route.query.taskNo).then((res) => {
        let data = res.data.data;
        this.currentUserId = data.currentUserId;
        if (data.order) {
          // 业务员
          data.clue.salesmanName = data.order.salesmanName;
          data.clue.salesmanNo = data.order.salesmanNo;
          data.clue.salesmanDeptName = data.order.salesmanDeptName;
          // 归属人
          data.clue.clueBelongName = data.order.clueBelongName;
          data.clue.clueBelongNo = data.order.clueBelongNo;
          data.clue.clueBelongDeptName = data.order.clueBelongDeptName;
        } else {
          data.clue.salesmanName = data.clue.salesmanEmpName;
          data.clue.salesmanNo = data.clue.salesmanEmpNo;
          data.clue.salesmanDeptName = data.clue.salesmanDeptName;
        //   data.clue.clueBelongName = data.clue.customerBelongEmpName;
        //   data.clue.clueBelongNo = data.clue.customerBelongEmpNo;
        //   data.clue.clueBelongDeptName = data.clue.customerBelongDeptName;
          data.clue.clueBelongName = data.clue.customerEmpName || data.clue.customerBelongEmpName 
          data.clue.clueBelongNo = data.clue.customerEmpNo || data.clue.customerBelongEmpNo 
          data.clue.clueBelongDeptName = data.clue.customerDeptName || data.clue.customerBelongDeptName
        }
        this.snapshotInformation = data.refund;
        this.recordData = data.refundProcess;
        // 客户信息
        this.kefuArray = [data.clue];
        // 订单信息
        if (data.order) {
          this.orderArray = [data.order];
        }
        // 回款信息
        this.refundArray = [data.receive];
      });
    },
    handleOn() {
      this.centerDialogVisible = true;
      let param = {
        taskCurrentEmpId: this.snapshotInformation.taskCurrentEmpId,
      };
      getMobile(param).then((res) => {
        this.showMobile = res.data.data;
      });
    },
    getCode() {
      let param = {
        taskCurrentEmpId: this.snapshotInformation.taskCurrentEmpId,
        taskNo: this.$route.query.taskNo,
      };
      permissSendCode(param).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            message: "发送成功，5分钟内有效！",
            type: "success",
          });
          this.encodeTaskNo = res.data.data;
          this.timer();
        } else if (res.data.code == 1001) {
        } else {
          this.$message({
            message: "发送失败，请稍后再试！",
            type: "error",
          });
        }
      });
    },
    timer() {
      if (this.num > 0) {
        this.codeDisabled = true;
        this.btnCode = this.num + "s后重试";
        this.num--;
        setTimeout(() => {
          this.timer();
        }, 1000);
      } else {
        this.btnCode = "获取验证码";
        this.num = 60;
        this.codeDisabled = false;
      }
    },
    //审核通过
    handleSubmit() {
      let param = {
        auditNote: this.textarea,
        code: this.code,
        taskCurrentEmpId: this.snapshotInformation.taskCurrentEmpId,
        taskNo: this.$route.query.taskNo,
        encodeTaskNo: this.encodeTaskNo,
      };
      myaudit(param).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: "审核通过!",
          });
          this.getDetail();
          this.centerDialogVisible = false;
        } else if (res.data.code == 1) {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
        }
      });
    },
    handleOff() {
      let param = {
        auditNote: this.textarea,
        code: this.code,
        taskCurrentEmpId: this.snapshotInformation.taskCurrentEmpId,
        taskNo: this.$route.query.taskNo,
      };
      myauditFail(param).then((res) => {
        this.getDetail();
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: "审核不通过!",
          });
        }
      });
    },
    // 撤销退款申请
    doCancel() {
      let param = {
        taskNo: this.$route.query.taskNo,
      };
      this.$confirm("确定撤销退款申请？撤销后仍可再次发起退款申请", "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
      }).then(() => {
        refundRevoke(param).then((res) => {
          this.getDetail();
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: "success",
              message: "已成功撤销!",
            });
          } else {
            this.$message({
              type: "warning",
              message: "撤销失败!",
            });
          }
        });
      });
    },
  },
};
</script>
<style scoped>
.aaa {
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 20px 100px 20px 30px;
}
.aaa >>> .el-table th > .cell {
  text-align: center;
}

.aaa >>> .el-table .cell {
  text-align: center;
}
.ceshi {
  position: relative;
  left: 15px;
  top: -4px;
}
.ccc {
  color: #d1d1d1 !important;
}
.bottom-detail .el-tabs--border-card {
  background: #fff;
  border: 0;
  border-top: 0.1px solid #dcdfe6;
  box-shadow: 0 0 0 #fff;
}
.record-top >>> .el-timeline-item__tail {
  position: absolute;
  left: 4px;
  height: 115%;
  border-left: 2px solid #e4e7ed;
}
</style>
<style scoped>
.cell-blue {
  color: #36a6fe;
  cursor: pointer;
}
.contracts {
  /* height: 100%; */
  margin-bottom: 0;
  background: #f6f7fa;
}
.record-top {
  margin-top: 10px;
}
.circleBluec {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  position: relative;
  background: #36a6fe;
  top: -2px;
  margin-right: 4px;
}
.circleRedc {
  width: 6px;
  height: 6px;
  position: relative;
  display: inline-block;
  border-radius: 50%;
  margin-right: 4px;
  top: -2px;
  background: red;
}
.successc {
  font-weight: bolder;
  font-size: 12px;
  color: green;
  margin-right: 4px;
}
.details {
  min-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
}
.table {
  margin-left: 20px;
  width: 100%;
}
.top-detail {
  /* margin-top: 20px; */
  background: #fff;
  padding-bottom: 15px;
}
.processnumber {
  font-weight: 300;
  margin-top: 10px;
  font-size: 20px;
  margin-left: -12px;
}
.top-detail tr {
  height: 30px;
  font-size: 14px;
  text-align: left;
}
.top-detail td {
  font-size: 14px;
  color: #333;
  width: 200px;
}
.top-detail th {
  padding-top: 25px;
}
.topBtn {
  padding: 25px;
}
.circle {
  position: relative;
  top: 2px;
  margin-left: 5px;
  width: 14px;
}
.delete {
  margin-left: 30px;
}
.cell-blue {
  display: inline-block;
  color: #36a6fe;
  cursor: pointer;
  max-width: 140px;
}
.tabottom {
  margin-bottom: 50px;
}
.bottom-detail {
  margin-top: 16px;
  background: #fff;
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
.process-record {
  background: #fff;
  margin-bottom: 30px;
}
.examine {
  margin-top: 16px;
  background: #fff;
  margin-bottom: 80px;
}
.examine-content {
  width: 800px;
  margin: 0 auto;
  font-size: 14px;
}
.button {
  margin: 30px;
  text-align: center;
}
.unpassed {
  margin-left: 50px;
}
.showBottom {
  margin-bottom: 200px;
}
.achievecode:hover {
  background: #ffffff;
  color: #606266;
  border-color: #dcdfe6;
}
</style>
