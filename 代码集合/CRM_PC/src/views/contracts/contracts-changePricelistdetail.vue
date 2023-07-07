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
            <span class="sty">流程编号：{{ $route.query.flowNo }}</span
            >&nbsp;&nbsp;
            <span class="text_sty">
              <span
                v-show="data.auditInfo.flowStatus == 1"
                class="circleBluec"
              ></span>
              <span v-show="data.auditInfo.flowStatus == 2" class="successc">
                <b>✔</b></span
              >
              <span
                v-show="data.auditInfo.flowStatus == 3"
                class="circleRedc"
              ></span>
              <span>{{ data.auditInfo.flowStatus | filterStatus }} </span>
            </span>
          </div>
          <table class="table">
            <tr>
              <th v-if="auditType != 2">订单编号</th>
              <th v-if="auditType == 2">补充协议编号</th>
              <th>订单类型</th>
              <th>客户名称</th>
              <th>合同附件</th>
              <th>下单时间</th>
            </tr>
            <tr>
              <td>
                <span v-if="auditType != 2">{{ data.auditInfo.orderNo }}</span>
                <span v-if="auditType == 2">{{ data.auditInfo.orderNo }}</span>
              </td>
              <td>
                <div>{{ data.auditInfo.orderType | filterorderType }} </div>
              </td>
              <td>
                <div>{{ data.orderInfo.subjectName | filtersData }}</div>
              </td>
              <td>
                <div v-if="data.contractAllVoList&&data.contractAllVoList.length>0">
                  <span v-for="(item,index) in data.contractAllVoList" :key="index">
                    <a class="contract-sty" :href="item.contractType==1?item.signDownloadUrl:IMG_CDN_URL+item.signDownloadUrl" target="_blank">{{item.contractName}}</a>
                    <span v-if="data.contractAllVoList.length>1&&index<data.contractAllVoList.length-1">,</span>
                  </span>
                </div>
                <div v-else>
                  暂无数据
                </div>
              </td>
              <td v-if="data.orderInfo.orderTime">
                {{ $moment(data.orderInfo.orderTime).format("YYYY-MM-DD") }}
              </td>
              <td v-else>
                暂无数据
              </td>
            </tr>
            <tr>
              <th>线索编号</th>
              <th>客户联系人</th>
              <th>客户签约人</th>
              <th>业务员</th>
              <th>创建时间</th>
              <th v-if="auditType == 2">主合同编号</th>
            </tr>
            <tr>
              <td>{{ data.orderInfo.clueNo | filtersData }}</td>
              <td>
                {{ data.orderInfo.contactName | filtersData }}
                {{ data.orderInfo.contactMobile }}
              </td>
              <td>
                {{ data.orderInfo.signName | filtersData }}
                {{ data.orderInfo.signMobile }}
              </td>
              <td>
                <el-tooltip
                  v-if="
                    data.orderInfo.clueSalesmanEmpName &&
                      data.orderInfo.clueSalesmanEmpId != 0
                  "
                  effect="dark"
                  :content="'工号：' + cEmpNo + '   部门：' + cDeptName"
                  placement="bottom-start"
                >
                  <span @mouseover="showUserInfo(data.orderInfo.createBy)">{{
                    data.orderInfo.clueSalesmanEmpName
                  }}</span>
                </el-tooltip>
                <span v-else>{{
                  data.orderInfo.clueSalesmanEmpName | filtersData
                }}</span>
              </td>
              <td>
                {{ $moment(data.auditInfo.createTime).format("YYYY-MM-DD") }}
              </td>
              <td v-if="auditType == 2">{{ data.auditInfo.mainContractNo }}</td>
            </tr>  
            <tr>
              <th>订单备注</th>
            </tr>
            <tr>
              <td>{{ data.orderInfo.remark | filtersData }}</td>
            </tr>
          </table>
        </div>
        <!-- 订单信息 -->
        <!-- :class="{ tabottom: data.contractStatus != 2 }" -->
        <div class="bottom-detail tabottom">
          <changeInfo
            ref="info"
            :orderData="orderData"
            :data="data"
            :contractStatus="data.auditInfo.flowStatus"
          ></changeInfo>
          <!--     -->
        </div>
        <!-- 审核记录 -->
        <div class="process-record" v-if="data.auditInfo.flowStatus != 0">
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
                <!-- <p style="font-weight:bold">
                  {{ processitem.auditReason | contractsStatus }}
                </p> -->
                <p>{{ processitem.title }}</p>
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
                <p >
                  {{ processitem.auditReason == null ? "备注：" : "审批意见：" }}
                  {{
                    processitem.auditReason ? processitem.auditReason  : processitem.remark || "暂无"
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
       
        <!-- -->
        <div class="examine"  v-if="data.auditInfo.flowStatus == 1 && userId==data.auditInfo.handleByNo ||permissions.sys_change_price_audit ==data.auditInfo.flowStatus == 1">
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
                  permissions.sys_change_price_audit || isPersonal
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
                  permissions.sys_change_price_audit || isPersonal
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
import { getOrder, auditLog } from "@/api/contracts/contracts";
import {
  getchangePriceDetail,
  auditPaperContract
} from "@/api/personal/myprocess";
import { mapGetters } from "vuex";

export default {
  components: {
    detailHead,
    elseInfo,
    changeInfo
  },
  data() {
    return {
      fileType: ['.pdf','.jpg','.png','.tiff','.psd','.jpeg','.bmp'],
      IMG_CDN_URL: process.env.VUE_APP_IMAGE_BASEURL,
      userId:null,
      orderData: {},
      changePriceData: [],
      isShow: true,
      textarea: "",
      listData: [],
      data: {
        auditInfo: {},
        orderInfo: {
          spuName: null
        },
        productInfo: {}
      },
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
      auditType: "",
      changeType: null
    };
  },
  filters: {
    amount(val) {
      return val == 0 ? "待定" : Number(val).toFixed(2);
    },
    filterStatus(val) {
      if (val == 1) {
        return "待审核";
      } else if (val == 2) {
        return "已通过";
      } else if (val == 3) {
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
    filtersData(val) {
      if (val) {
        return val;
      } else {
        return "暂无数据";
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
    filterArea(val) {
      return filterArea(val);
    },
    // (value="订单类型（1：产品；2：课程；3：课堂会员）"
    filterorderType(val) {
      if (val == 1) {
        return "产品";
      } else if (val == 2) {
        return "课程";
      } else if (val == 3) {
        return "课堂会员";
      }
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  mounted() {
    this.getData();
    this.auditType = this.$route.query.auditType;
  },
  created() {
    this.userId= JSON.parse(sessionStorage.getItem('pigx-userInfo')).content.number
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
        type: 5
      };
      // 审核记录
      auditLog(params).then(res => {
        if (res.data.code == 0 && res.data && res.data.data) {
          var data = [];
          Object.values(res.data.data).forEach(item => {
            data.push(...item);
          });
          this.listData = data
        }
      });
      // 合同审核详情
      getchangePriceDetail(this.$route.query.id, this.isPersonal).then(res => {
        if (res.data.code == 0) {
          this.orderData = res.data.data;
          this.$refs["info"].getfrontlist(this.orderData);
          this.data = res.data.data;
          if (res.data.data.orderIdList) {
            let arr = res.data.data.orderIdList;
            arr.length > 0 && this.getOrder(arr);
          }
        }
      });
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
        flowStatus: 2, //合同审核状态 1 审核通过 2 审核不通过
        handleMessage: this.textarea,
        auditType: this.auditType
      };
      auditPaperContract(params, this.isPersonal).then(res => {
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
    },
    //审核不通过
    unpassed() {
      if (this.textarea.length > 0) {
        let params = {
          id: Number(this.$route.query.id),
          flowStatus: 3, //合同审核状态 2 审核通过 3 审核不通过
          handleMessage: this.textarea,
          auditType: this.auditType
        };
        this.$confirm("审核不通过，流程将驳回到改价发起人", "提醒", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel"
        }).then(() => {
          auditPaperContract(params,this.isPersonal).then(res => {
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
          message: "未填写审批意见"
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

.contract-sty{
  color: #409EFF;
  cursor: pointer;
}
</style>
