<template>
  <div class="aaa">
    <div class="contracts">
      <!-- <div class="avue-header top-fixed">
        <a class="avue-logo" href="/#/wel/index"
          ><span class="avue-logo_title">卧涛管理中心 </span></a
        >
        <detail-head></detail-head>
      </div> -->
      <div class="details">
        <div class="top-detail">
          <div class="processnumber">
            <img
              src="../../assets/images/process/liucheng_icon.png"
              class="taskNo"
            />
            <span class="sty">流程编号：{{ $route.query.taskNo }}</span
            >&nbsp;&nbsp;
            <span class="text_sty">
              <span v-show="data.taskStatus == 0" class="circleBluec"></span>
              <span v-show="data.taskStatus == 1" class="successc"
                ><b>✔</b></span
              >
              <span v-show="data.taskStatus == 2" class="circleRedc"></span>
              <span>{{ data.taskStatus | filterStatus }} </span>
            </span>
          </div>
          <table class="table">
            <tr>
              <th v-if="auditType != 2">合同编号</th>
              <th v-if="auditType == 2">补充协议编号</th>
              <th>客户名称</th>
              <th>地区</th>
              <th>合同金额</th>
              <th>创建时间</th>
              <th v-if="auditType != 2">合同附件</th>
              <th v-if="auditType == 2">补充协议合附件</th>
            </tr>
            <tr>
              <td>
                <span v-if="auditType != 2">{{ data.contractNo }}</span>
                <span v-if="auditType == 2">{{ data.contractNo }}</span>
              </td>
              <td>
                <div>{{ data.authName }}</div>
              </td>
              <td>
                <span class="left-space">{{
                  data.orgAddress | filterArea
                }}</span>
              </td>
              <td>
                <span class="left-space">{{ data.totalAmount | amount }}</span>
              </td>
              <td>{{ $moment(data.createTime).format("YYYY-MM-DD") }}</td>
              <td>
                <el-tooltip
                  v-if="data.contractName && auditType != 2"
                  effect="dark"
                  :content="data.contractName"
                  placement="bottom-start"
                >
                  <span class="cell-blue" @click="download(data.signUrl)">
                    {{ data.contractName | filename }}
                  </span>
                </el-tooltip>
                <el-tooltip
                  v-if="data.contractName && auditType == 2"
                  effect="dark"
                  :content="data.contractName"
                  placement="bottom-start"
                >
                  <span class="cell-blue" @click="download(data.signUrl)">
                    {{ data.contractName | filename }}
                  </span>
                </el-tooltip>
              </td>
            </tr>
            <tr>
              <th>线索编号</th>
              <th>联系人</th>
              <th>签约人</th>
              <th>业务员</th>
              <th>签约时间</th>
              <th>主合同附件</th>
            </tr>
            <tr>
              <td>{{ data.clueNo }}</td>
              <td>{{ data.contactName }} {{ data.mobile }}</td>
              <td>{{ data.signName }} {{ data.signMobile }}</td>
              <td>
                <el-tooltip
                  v-if="data.clueSalesmanEmpName && data.clueSalesmanEmpId != 0"
                  effect="dark"
                  :content="'工号：' + cEmpNo + '   部门：' + cDeptName"
                  placement="bottom-start"
                >
                  <span @mouseover="showUserInfo(data.clueSalesmanEmpId)">{{
                    data.clueSalesmanEmpName
                  }}</span>
                </el-tooltip>
                <span v-else>{{ data.clueSalesmanEmpName }}</span>
              </td>
              <td>{{ $moment(data.signTime).format("YYYY-MM-DD") }}</td>
              <td>
                <el-tooltip
                  v-if="data.mainContractName && auditType == 2"
                  effect="dark"
                  :content="data.mainContractName"
                  placement="bottom-start"
                >
                  <span
                    class="cell-blue"
                    @click="download(data.mainContractSignUrl)"
                  >
                    {{ data.mainContractName | filename }}
                  </span>
                </el-tooltip>
              </td>
            </tr>
            <tr>
              <th v-if="auditType == 2">主合同编号</th>
              <th>合同备注</th>
            </tr>
            <tr>
              <td v-if="auditType == 2">{{ data.mainContractNo }}</td>
              <td>{{ data.remark }}</td>
            </tr>
          </table>
        </div>
        <!-- 订单信息 -->
        <!-- :class="{ tabottom: data.contractStatus != 2 }" -->
        <div class="bottom-detail tabottom">
          <elseInfo
            :orderData="orderData"
            :data="data"
            :contractStatus="data.taskStatus"
            v-if="orderData.length > 0"
          ></elseInfo>
        </div>
        <!-- 审核记录 -->
        <div class="process-record" v-if="data.taskStatus != 0">
          <div class="list-header">
            <p class="rectangle"></p>
            <b class="text">审核记录</b>
          </div>
          <div class="record-top">
            <el-timeline>
              <el-timeline-item
                v-for="(processitem, index) in listData"
                :key="index"
                :color="index == 0 ? '#ff6600' : ''"
                placement="top"
                hide-timestamp
              >
                <p style="font-weight:bold">
                  {{ processitem.auditState | contractsStatus }}
                </p>
                <el-tooltip
                  v-if="processitem.createBy"
                  effect="dark"
                  :content="'工号：' + cEmpNo + '  部门：' + cDeptName"
                  placement="right"
                >
                  <span @mouseover="showUserInfo(processitem.createBy)"
                    >操作人：{{
                      processitem.createByName
                        ? processitem.createByName
                        : "暂无"
                    }}
                  </span>
                </el-tooltip>
                <p>
                  {{ processitem.auditState == null ? "备注：" : "审批意见：" }}
                  {{
                    processitem.auditReason || processitem.title
                      ? processitem.auditReason || processitem.title
                      : "暂无"
                  }}
                </p>
                <p>
                  {{ processitem.createTime }}
                </p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <!-- 审批 -->
        <div class="examine" v-if="data.taskStatus == 0">
          <div class="list-header">
            <p class="rectangle"></p>
            <b class="text">审批</b>
          </div>
          <div class="examine-content">
            <p>审批意见：</p>
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model.trim="textarea"
              maxlength="100"
              show-word-limit
              clearable
              rows="4"
            >
            </el-input>
            <div class="button">
              <!-- 审核通过 -->

              <el-button
                type="success"
                size="medium"
                v-preventReClick
                @click="
                  permissions.sys_contract_audit || permissions.sys_my_process_audit
                    ? passed()
                    : $notAuthorized()
                "
                >{{ $t("button.auditingPassed") }}</el-button
              >

              <!-- 审核不通过 -->
              <el-button
                type="danger"
                size="medium"
                class="unpassed"
                v-preventReClick
                @click="
                  permissions.sys_contract_audit || permissions.sys_my_process_audit
                    ? unpassed()
                    : $notAuthorized()
                "
                >{{ $t("button.auditingUnPassed") }}</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import detailHead from "@/page/index/top/index";
import { getEmpInfo } from "@/api/project/wtClass";
import elseInfo from "@/components/personal/contracts/else-info";
import changeInfo from "@/components/personal/contracts/change-info";
import * as CodeMsg from "@/api/common/CodeChange";
import { auditingOption } from "@/const/crud/personal/auditing";
import { filterArea } from "@/util/new-client/filter";
import {
  getprocessDetail,
  getOrder,
  auditPaperContractAuditOfMy,
  // auditPaperContract,
  auditLog
} from "@/api/contracts/contracts";
import { mapGetters } from "vuex";
export default {
  components: {
    detailHead,
    elseInfo,
    changeInfo
  },
  data() {
    return {
      orderData: [],
      changePriceData: [],
      isShow: true,
      textarea: "",
      listData: [],
      data: "",
      imgBaseUrl:
        process.env.NODE_ENV === "production"
          ? "//static.wotao.com/"
          : "//static-tst.wotao.com/",
      previewFileUrl: "",
      auditingOption: auditingOption,
      productType: "",
      otherdata: {},

      cEmpNo: "",
      cDeptName: "",
      isPersonal: this.$route.query.source == "personal",
      auditType: ""
    };
  },
  filters: {
    amount(val) {
      return val == 0 ? "待定" : Number(val).toFixed(2);
    },
    filterStatus(val) {
      if (val == 0) {
        return "待审核";
      } else if (val == 1) {
        return "已通过";
      } else if (val == 2) {
        return "未通过";
      }
    },
    remarkStatus(val) {
      if (val != null) {
        if (val == 0) {
          return "待审核";
        } else if (val == 1) {
          return "审核通过";
        } else {
          return "审核不通过";
        }
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
        return "提交审核";
      } else if (val == 1) {
        return "审核通过";
      } else if (val == 2) {
        return "审核不通过";
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
    filterArea(val) {
      return filterArea(val);
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  mounted() {
    if (JSON.parse(sessionStorage.getItem("pigx-userInfo"))) {
      this.userId = JSON.parse(
        sessionStorage.getItem("pigx-userInfo")
      ).content.id;
    }
    this.getData();
    this.auditType = this.$route.query.auditType;
    //引入pdf插件
    const oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = "@pdfjs/build/pdf.js";
    document.body.appendChild(oScript);
  },

  methods: {
    // 获取员工信息
    showUserInfo(id) {
      getEmpInfo(id).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.cEmpNo = res.data.data.number;
          this.cDeptName = res.data.data.deptName;
        }
      });
    },
    //初始化
    getData() {
      let params = {
        taskId: Number(this.$route.query.id),
        taskNo: this.$route.query.taskNo,
        type: 1
      };
      // 审核记录
      auditLog(params).then(res => {
        if (res.data.code == 0) {
          var data = [];
          Object.values(res.data.data).forEach(item => {
            data.push(...item);
          });
          this.listData = data;
        }
      });
      getprocessDetail({ taskId: this.$route.query.id }, this.isPersonal).then(
        res => {
          if (res.data.code == 0) {
            this.data = res.data.data;
            let arr = res.data.data.orderIdList;
            arr.length > 0 && this.getOrder(arr);
          }
        }
      );
    },
    //合同下载
    download(url) {
      this.previewFileUrl = this.imgBaseUrl + url;
      window.open(this.previewFileUrl, "_blank");
    },
    // 获取订单列表
    getOrder(arr) {
      getOrder(arr).then(res => {
        if (res.data.code == 0) {
          this.orderData = res.data.data;
        }
      });
    },
    //审核通过
    passed() {
      let params = {
        taskId: Number(this.$route.query.id),
        taskStatus: 1, //合同审核状态 1 审核通过 2 审核不通过
        auditReason: this.textarea || '审核通过',
        auditType: this.auditType
      };
      // if(this.isPersonal){
        auditPaperContractAuditOfMy(params,this.isPersonal).then(res => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: "success",
              message: "审核通过!",
              duration: 2000
            });
            setTimeout(() => {
              this.$router.back(-1);
            }, 2500);
          } else {
            this.$message({
              type: "warning",
              message: res.data.msg,
              duration: 2000
            });
          }
        });
      // }else{
      //   auditPaperContract(params).then(res => {
      //     if (res.data.code == CodeMsg.CODE_0) {
      //       this.$message({
      //         type: "success",
      //         message: "审核通过!",
      //         duration: 2000
      //       });
      //       setTimeout(() => {
      //         this.$router.back(-1);
      //       }, 2500);
      //     } else {
      //       this.$message({
      //         type: "warning",
      //         message: res.data.msg,
      //         duration: 2000
      //       });
      //     }
      //   });
      // }
    },
    //审核不通过
    unpassed() {
      let params = {
        taskId: Number(this.$route.query.id),
        taskStatus: 2, //合同审核状态 1 审核通过 2 审核不通过
        auditReason: this.textarea,
        auditType: this.auditType
      };
      this.$confirm("审核不通过，流程将驳回到合同发起人", "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel"
      }).then(() => {
        // if(this.isPersonal){
          auditPaperContractAuditOfMy(params,this.isPersonal).then(res => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "流程已驳回!",
                duration: 2000
              });
              setTimeout(() => {
                this.$router.back(-1);
              }, 2500);
            } else {
              this.$message({
                type: "warning",
                message: res.data.msg,
                duration: 2000
              });
            }
          });
        // }else{
        //   auditPaperContract(params).then(res => {
        //     if (res.data.code == CodeMsg.CODE_0) {
        //       this.$message({
        //         type: "success",
        //         message: "流程已驳回!",
        //         duration: 2000
        //       });
        //       setTimeout(() => {
        //         this.$router.back(-1);
        //       }, 2500);
        //     } else {
        //       this.$message({
        //         type: "warning",
        //         message: res.data.msg,
        //         duration: 2000
        //       });
        //     }
        //   });
        // }
        
      });
    }
  }
};
</script>
<style scoped>
.aaa {
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
.sty {
  margin-left: 8px;
  font-weight: 600;
}
.taskNo {
  width: 24px;
  height: 24px;
  position: relative;
  top: 5px;
}
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
  width: 6px;
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
  width: 1000px;
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
.text_sty {
  font-size: 16px;
  font-family: "Microsoft YaHei";
  font-weight: bold;
}
</style>
