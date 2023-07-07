<template>
  <div class="aaa">
    <div class="contracts">
      <div class="details">
        <div class="top-detail">
          <div class="processnumber">
            <img
              src="../../assets/images/process/liucheng_icon.png"
              class="taskNo"
            />
            <span class="sty"
              >流程编号：{{ $route.query.flowNo }} ({{
                $route.query.auditType == 1 ? "初级认证" : "新增授权"
              }})</span
            >&nbsp;&nbsp;
            <span class="text_sty">
              <span v-show="data.flowStatus == 0" class="circleBluec"></span>
              <span v-show="data.flowStatus == 1" class="successc"
                ><b>✔</b></span
              >
              <span v-show="data.flowStatus == 2" class="circleRedc"></span>
              <span>{{ data.flowStatus | filterStatus }} </span>
            </span>
          </div>
          <div class="user-Info" v-if="creditObj">
            <div class="list-header">
              <p class="rectangle"></p>
              <b class="text">用户信息</b>
            </div>
            <div class="user-data" v-if="data.type == 2">
              <div class="user-list thead">
                <div>主体ID</div>
                <div>用户名</div>
                <div class="user-one">主体名称</div>
                <div class="user-tow">信用代码</div>
                <div>客服</div>
                <div>推广归属</div>
                <div>业务员</div>
              </div>
              <div class="user-list">
                <div class="blue-sty">{{ creditObj.userNo }}</div>
                <div>{{ creditObj.username }}</div>
                <div class="user-one">{{ creditObj.companyName }}</div>
                <div class="user-tow por-sty">
                  {{ creditObj.organization }}
                  <img
                    v-if="creditObj.transactionNo"
                    class="img-sty"
                    src="../../assets/images/my-home/gaoji.png"
                    alt=""
                  />
                </div>
                <div>{{ creditObj.customerServerName }}</div>
                <div>{{ creditObj.promoteAttributionName }}</div>
                <div>{{ creditObj.clueSalesmanEmpName }}</div>
              </div>
            </div>
            <div class="user-data" v-else>
              <div class="user-list thead">
                <div>主体ID</div>
                <div>用户名</div>
                <div class="user-one">手机号</div>
                <div>客服</div>
                <div>推广归属</div>
              </div>
              <div class="user-list">
                <div class="blue-sty">{{ creditObj.userNo }}</div>
                <div>{{ creditObj.username }}</div>
                <div class="user-one">{{ creditObj.mobile }}</div>
                <div>{{ creditObj.customerServerName }}</div>
                <div>{{ creditObj.promoteAttributionName }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="approve">
          <div class="list-header">
            <p class="rectangle"></p>
            <b class="text">认证信息</b>
            <p class="remark-sty">
              审核通过后，单位名称、信用代码、授权签约人将同步到用户信息中，请比对合同附件和营业执照中的信息是否与线索信息一致
            </p>
          </div>
          <div class="approve-title">
            <div>线索信息</div>
            <div>认证材料</div>
          </div>
          <div class="approve_con">
            <div class="approve-left">
              <div class="item">
                <div>线索编号</div>
                <div>{{ data.clueNo }}</div>
              </div>
              <div class="item">
                <div>{{ data.clueType == 2 ? "单位名称" : "个人姓名" }}</div>
                <div>
                  {{ data.clueType == 2 ? data.clueName : data.contactName }}
                </div>
              </div>
              <div class="item">
                <div>{{ data.clueType == 2 ? "信用代码" : "身份证号" }}</div>
                <div>{{ data.organization }}</div>
              </div>
              <div class="item">
                <div>授权签约人</div>
                <div>{{ data.contactName }} {{ data.contactMobile }}</div>
              </div>
              <div class="item" v-if="data.clueType == 2">
                <div>法人信息</div>
                <div>{{ data.legalName }} {{ data.legalMobile }}</div>
              </div>
              <div class="item">
                <div>业务员</div>
                <div>{{ data.clueSalesmanEmpName }}</div>
              </div>
            </div>
            <div class="approve-right">
              <div class="item">
                <div>
                  {{ data.authType == 2 ? "电商订单截图" : "合同附件" }}
                </div>
                <div @click="download(data.contractUrl)" class="cell-blue">
                  {{ data.contractName }}
                </div>
              </div>
              <div class="item" v-if="data.clueType == 2">
                <div>营业执照</div>
                <div @click="download(data.licenseUrl)" class="cell-blue">
                  {{ data.licenseName }}
                </div>
              </div>
              <div class="item">
                <div>{{ data.type == 1 ? "认证" : "授权" }}备注</div>
                <div></div>
              </div>
              <div class="remark">{{ data.remark ? data.remark : "暂无" }}</div>
            </div>
          </div>
        </div>
        <!-- 订单信息 -->
        <!-- :class="{ tabottom: data.contractStatus != 2 }" -->
        <div class="bottom-detail tabottom">
          <elseInfo
            :orderData="orderData"
            :data="data"
            :contractStatus="data.taskStatus"
            v-if="orderData.length > 0"
          >
          </elseInfo>
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
                <p style="font-weight: bold">
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
        <div class="examine" v-if="data.flowStatus == 0">
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
                  permissions.sys_certified_authorized || isPersonal
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
                  permissions.sys_certified_authorized || isPersonal
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
  auditLog
} from "@/api/contracts/contracts";
import {
  getClueCompId,
  getByOrganization,
  auditPaperContractAuditOfMy
} from "@/api/personal/approval";
import { mapGetters } from "vuex";
export default {
  components: {
    detailHead,
    elseInfo,
    changeInfo
  },
  data() {
    return {
      userInfo: {},
      creditObj: null,
      userId: null,
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
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("pigx-userInfo")).content;
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
        type: 7
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
      getClueCompId(this.$route.query.id, this.isPersonal).then(res => {
        if (res.data.code == 0) {
          this.data = res.data.data;
          this.getByOrganization();
        }
      });
    },
    getByOrganization() {
      let obj = {};
      if (this.data.type == 1 && !this.data.userId) return;
      if (this.data.type == 1) {
        //1:认证；2：授权
        obj = {
          mobile: this.data.contactMobile,
          userId: this.data.userId
        };
      } else {
        obj = {
          organization: this.data.organization
        };
      }
      getByOrganization(obj, this.data.type).then(res => {
        if (res.data.code == 0) {
          this.creditObj = res.data.data;
        }
      });
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
        id: Number(this.$route.query.id),
        flowStatus: 1, //合同审核状态 1 审核通过 2 审核不通过
        auditOpinion: this.textarea
      };
      // if (this.isPersonal) {
      auditPaperContractAuditOfMy(params, this.data.type, this.isPersonal).then(
        res => {
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
        }
      );
    },
    //审核不通过
    unpassed() {
      if (this.textarea) {
        let params = {
          id: Number(this.$route.query.id),
          flowStatus: 2, //合同审核状态 1 审核通过 2 审核不通过
          auditOpinion: this.textarea
        };
        this.$confirm(
          `审核不通过，流程将驳回到${
            this.data.type == 1 ? "认证" : "授权"
          }发起人`,
          "提醒",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            cancelButtonClass: "btn-custom-cancel"
          }
        ).then(() => {
          auditPaperContractAuditOfMy(
            params,
            this.data.type,
            this.isPersonal
          ).then(res => {
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
        });
      } else {
        this.$message({
          type: "warning",
          message: "请填写内容!",
          duration: 2000
        });
      }
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

.user-data {
  border: 1px solid #f2f2f2;
}

.sty {
  margin-left: 8px;
  font-weight: 600;
}

.remark {
  font-size: 14px;
  color: #888;
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

.blue-sty {
  color: #36a6fe;
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
  /* max-width: 140px; */
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
  align-items: center;
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

.thead {
  font-size: 12px;
  font-weight: bold;
  background: #fafafa;
  border-bottom: 1px solid #f2f2f2;
}

.user-Info {
  margin-top: 50px;
  width: 100%;
  height: 100%;
}

.user-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-list > div {
  text-align: center;
  height: 40px;
  line-height: 40px;
  width: 200px;
}

.user-one {
  width: 280px !important;
}

.user-tow {
  width: 250px !important;
}

.approve {
  height: 400px;
}

.approve-title {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  width: 90%;
  margin: 0 auto;
  background: #f5f5f5;
}

.approve_con {
  display: flex;
  justify-content: space-around;
  border: 1px solid #f5f5f5;
  width: 90%;
  margin: 0 auto;
}

.approve-left > div,
.approve-right > div {
  line-height: 40px;
}

.approve-left {
  width: 40%;
  padding: 20px 0;
  border-right: 1px solid #f5f5f5;
}

.approve-right {
  width: 40%;
  padding: 20px 0;
}

.approve-left,
.approve-right {
  margin: 0 auto;
  /* margin-left: 20px; */
}

.item {
  width: 100%;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.item > div:nth-child(1) {
  margin-right: 10px;
  min-width: 90px;
}

.item > :last-child {
  color: #888;
}

.cell-blue {
  width: 100%;
  color: #36a6fe !important;
  cursor: pointer;
}

.img-sty {
  position: absolute;
  left: 105px;
  top: 16px;
  width: 20px;
  height: 20px;
}

.por-sty {
  position: relative;
}

.remark-sty {
  color: red;
  line-height: 25px;
}
</style>
