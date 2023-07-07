<template>
  <div class="aaa">
    <div class="details">
      <div class="top-detail">
        <div class="processnumber">
         <img src="../../assets/images/process/liucheng_icon.png" style="width:24px;height:24px;position: relative;top: 5px;"  />
        <span style="margin-left: 8px;font-weight: 600;">流程编号：{{$route.query.taskNo}}</span>
        </div>
        <table class="table">
          <tr>
            <th>合同编号</th>
            <th>客户名称</th>
            <th>客户联系人</th>
            <th>客户签约人</th>
            <th>签约时间</th>
            <th>发起时间</th>
          </tr>
          <tr>
            <td>
              <span v-if="otherdata.contractNo">{{ otherdata.contractNo }}</span
              ><span v-else>{{ otherdata.prefix + "序号待定" }}</span>
            </td>
            <td>
                <template v-if="otherdata.customerName.length<=12">
                    <div>{{ otherdata.customerName }}</div>
                </template>
                <template v-else-if="otherdata.customerName.length>=13 && otherdata.customerName.length<=24">
                    <div>{{ otherdata.customerName.substring(0,12) }}</div>
                    <div>{{ otherdata.customerName.substring(12) }}</div>
                </template>
                <template v-else>
                    <div>{{ otherdata.customerName.substring(0,12) }}</div>
                    <div>{{ otherdata.customerName.substring(12,24) }}</div>
                    <div>{{ otherdata.customerName.substring(24) }}</div>
                </template>
            </td>
            <td>
              <span class="left-space">{{ data.contactName }}</span
              ><span>{{ data.contactMobilephone }}</span>
            </td>
            <td>
              <span class="left-space">{{ otherdata.signName }}</span
              ><span>{{ otherdata.signMobilephone }}</span>
            </td>
            <td>
              {{ $moment(otherdata.signTime).format("YYYY-MM-DD HH:mm") }}
            </td>
            <td>
              {{ $moment(otherdata.commitTime).format("YYYY-MM-DD HH:mm") }}
            </td>
          </tr>
          <tr>
            <th>线索编号</th>
            <th>合同金额(元)</th>
            <th>客户归属</th>
            <th>线索归属</th>
            <th>业务员</th>
            <th>合同附件</th>
          </tr>
          <tr>
            <td>{{ otherdata.clueNo }}</td>
            <td>
              {{
                otherdata.contractSum == null
                  ? "待定"
                  : otherdata.contractSum / 100
              }}
            </td>
            <td>
              <el-tooltip
                v-if="otherdata.cuBelongName"
                effect="dark"
                :content="
                  '工号：' +
                  otherdata.cuBelongNo +
                  '   部门：' +
                  otherdata.cuBelongDeptName
                "
                placement="bottom-start"
                ><span>{{
                  otherdata.cuBelongName == null ||
                  otherdata.cuBelongName == "null"
                    ? ""
                    : otherdata.cuBelongName
                }}</span></el-tooltip
              >
              <el-tooltip
                v-if="data.taskStatus == 0"
                effect="dark"
                content="正在流程中"
                placement="bottom-start"
              >
                <span
                  ><img class="circle" src="@/assets/iconfonts/circle.svg"
                /></span>
              </el-tooltip>
            </td>
            <td>
              <el-tooltip
                v-if="otherdata.clBelongName"
                effect="dark"
                :content="
                  '工号：' +
                  otherdata.clBelongNo +
                  '   部门：' +
                  otherdata.clBelongDeptName
                "
                placement="bottom-start"
              >
                <span>{{ otherdata.clBelongName }}</span>
              </el-tooltip>
            </td>
            <td>
              <el-tooltip
                v-if="otherdata.saleBelongName"
                effect="dark"
                :content="
                  '工号：' +
                  otherdata.saleBelongNo +
                  '   部门：' +
                  otherdata.saleBelongDeptName
                "
                placement="bottom-start"
              >
                <span>{{ otherdata.saleBelongName }}</span>
              </el-tooltip>
            </td>
            <td>
              <el-tooltip
                v-if="otherdata.attachmentName"
                effect="dark"
                :content="otherdata.attachmentName"
                placement="bottom-start"
              >
                <span
                  class="cell-blue"
                  @click="download(otherdata.attachmentUrl)"
                  >{{ otherdata.attachmentName | attachmentName }}</span
                >
              </el-tooltip>
            </td>
          </tr>
          <tr>
            <th>审核状态</th>
            <th>合同备注</th>
          </tr>
          <tr>
            <td>
              <span v-show="data.taskStatus == 0" class="circleBluec"></span>
              <span v-show="data.taskStatus == 1" class="successc"
                ><b>✔</b></span
              >
              <span v-show="data.taskStatus == 2" class="circleRedc"></span>
              <span>{{ data.taskStatus | remarkStatus }} </span>
            </td>
            <td>{{ otherdata.contractNote }}</td>
          </tr>
        </table>
      </div>
      <!-- 订单信息 -->
      <div
        class="bottom-detail"
        :class="{ tabottom: data.contractStatus != 2 }"
      >
        <elseInfo
          :orderData="orderData"
          :data="data"
          :contractStatus="$route.query.contractStatus"
        ></elseInfo>
      </div>
      <!-- 审核记录 -->
      <div class="process-record">
        <div class="list-header">
          <p class="rectangle"></p>
          <b class="text">审核记录</b>
        </div>
        <div class="record-top">
          <el-timeline v-if="listData.length > 0">
            <el-timeline-item
              v-for="(processitem, index) in listData"
              :key="index"
              :color="index == 0 ? '#ff6600' : ''"
              placement="top"
              hide-timestamp
            >
              <p>
                {{ processitem.contractStatus | filterstatus }}
              </p>
              <el-tooltip
                v-if="processitem.operNo"
                effect="dark"
                :content="
                  '工号：' +
                  processitem.operNo +
                  '  部门：' +
                  processitem.operDeptName
                "
                placement="right"
              >
                <span>
                  操作人：{{
                    processitem.operName ? processitem.operName : "暂无"
                  }}
                </span>
              </el-tooltip>
              <el-tooltip v-else effect="dark" content="暂无" placement="right">
                <span>
                  操作人：{{
                    processitem.operName ? processitem.operName : "暂无"
                  }}
                </span>
              </el-tooltip>
              <p>
              {{ processitem.contractStatus==2?'备注：':'审批意见：'}} {{
                  processitem.auditNote || processitem.approveNote ? processitem.auditNote || processitem.approveNote : "暂无"
                }}
              </p>
              <p>
                {{ processitem.gmtCreate }}
              </p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <!-- 审批 -->
      <div
        class="examine"
        v-if="otherdata.contractStatus == 2 && data.showApprovalButton"
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
            <el-button type="success" size="medium"  v-preventReClick  @click="passed">{{
              $t("button.auditingPassed")
            }}</el-button>
            <el-button
              type="danger"
              size="medium"
              class="unpassed"
               v-preventReClick
              @click="unpassed"
              >{{ $t("button.auditingUnPassed") }}</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import detailHead from "@/page/index/top/index";
import elseInfo from "@/components/personal/contracts/else-info";
import * as CodeMsg from "@/api/common/CodeChange"
import { auditingOption } from "@/const/crud/personal/auditing";
import {
  persongetprocessDetail,
  newconCheck,
  approveRecords,
} from "@/api/contracts/contracts";
export default {
  components: {
    detailHead,
    elseInfo,
  },
  data() {
    return {
      orderData: [],
      isShow: true,
      textarea: "",
      listData: [],
      data: "",
      imgBaseUrl: "",
      previewFileUrl: "",
      auditingOption: auditingOption,
      productType: "",
      otherdata: {},
    };
  },
  filters: {
    remarkStatus(val) {
      if (val == "0") {
        return "待审核";
      } else if (val == "1") {
        return "已通过";
      } else {
        return "未通过";
      }
    },
    filterstatus(val) {
      if (val == "2") {
        return "提交审核";
      } else if (val == "1") {
        return "审核通过";
      } else {
        return "审核不通过";
      }
    },
    contractsStatus(val) {
      if (val === null) {
        return "全部";
      } else if (val == "2") {
        return "待审核";
      } else if (val == "1") {
        return "已通过";
      } else if (val == "3") {
        return "未通过";
      } else if (val === "0") {
        return "草稿";
      } else if (val == 4) {
        return "已删除";
      }
    },
    filename(val) {
      if (val) {
        let fname = val.slice(val.lastIndexOf("/") + 1);
        if (fname.slice(0, fname.lastIndexOf(".")).length < 9) {
          return fname;
        } else {
          return fname.slice(0, 8) + "..." + ".pdf";
        }
      } else {
        return val;
      }
    },
    attachmentName(val) {
      if (val) {
        if (val.slice(0, val.lastIndexOf(".")).length < 9) {
          return val;
        } else {
          return val.slice(0, 8) + "..." + ".pdf";
        }
      } else {
        return "-";
      }
    },
  },
  mounted() {
    this.getData();
    this.switch();
    //引入pdf插件
    const oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = "@pdfjs/build/pdf.js";
    document.body.appendChild(oScript);
  },

  methods: {
    switch() {
      if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
    },
    //初始化
    getData() {
      approveRecords({ taskId: this.$route.query.taskId }).then((res) => {
        // console.log(res, "shelu");
        this.listData = res.data.data;
      });
      persongetprocessDetail(this.$route.query.taskId).then((res) => {
        this.data = res.data.data;
        this.otherdata = res.data.data.contractHistory;
        this.orderData = res.data.data.orders;
        if (this.orderData[0].orderDetail.productType == "0") {
          //产品类型 0、项目 1、知产
          this.productType = 0;
        } else {
          this.productType = 1;
        }
      });
    },
    //合同下载
    download(url) {
      this.previewFileUrl = this.imgBaseUrl + url;
      window.open(this.previewFileUrl, "_blank");
    },
    //审核通过
    passed() {
      let params = {
        prefix: this.otherdata.prefix,
        signTime: this.$moment(this.otherdata.signTime).format(
          "YYYY-MM-DD HH:mm"
        ),
        id: this.otherdata.contractId,
        clueId: this.otherdata.clueId,
        contractStatus: 1,
        attachmentUrl: this.otherdata.attachmentUrl,
        approveNote: this.textarea,
        empNo: this.otherdata.clBelongNo,
        empName: this.otherdata.clBelongName,
        empDeptName: this.otherdata.clBelongDeptName,
        empDeptId: this.otherdata.clBelongDeptId,
        cluEmpDept: this.otherdata.clBelongDeptName,
        cluEmpNo: this.otherdata.clBelongNo,
        cluEmpName: this.otherdata.clBelongName,
        saleEmpDept: this.otherdata.saleBelongDeptName,
        saleEmpName: this.otherdata.saleBelongName,
        saleEmpNo: this.otherdata.saleBelongNo,
        clueNo: this.otherdata.clueNo,
        productType: this.productType,
        contractSum:this.otherdata.contractSum,
        taskNo:this.$route.query.taskNo
      };
      // if (this.data.contractSumUncertain) {
      // } else {
      //   params.contractSum = this.data.contractSum;
      // }
      // if (this.data.clBelongDeptId) {
      //   params.empDeptId = this.data.clBelongDeptId;
      // }
      newconCheck(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: "审核通过!",
            duration: 2000
          });
          setTimeout(() => {
            this.$router.back(-1);
          }, 2500);
        } else if (res.data.code != 1001) {
          this.$message({
            type: "warning",
            message: res.data.msg,
            duration: 2000
          });
        }
      });
    },
    //审核不通过
    unpassed() {
      let params = {
        id: this.otherdata.contractId,
        clueId: this.otherdata.clueId,
        contractStatus: 3,
        approveNote: this.textarea,
        lastContractProcess: this.data.lastContractProcess,
        productType: this.productType,
        taskNo:this.$route.query.taskNo
      };
      this.$confirm("审核不通过，流程将驳回到合同发起人", "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
      }).then(() => {
        newconCheck(params).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: "success",
              message: "流程已驳回!",
              duration: 2000
            });
            setTimeout(() => {
              this.$router.back(-1);
            }, 2500);
          } else if (res.data.code != 1001) {
            this.$message({
              type: "warning",
              message: res.data.msg,
              duration: 2000
            });
          }
        });
      });
    },
  },
};
</script>
<style scoped>
.aaa{
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 20px 100px 20px 30px;
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
.contracts_contain {
  width: 100%;
  /* height: 100%; */
  min-height: 850px;
  margin-bottom: 0;
  background: #ffffff;
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
}
.table {
  margin-left: 20px;
  width: 100%;
}
.top-detail {
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
  /* margin-bottom:200px; */
  background: #fff;
  /* padding:20px; */
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
</style>