<template>
  <div class="aaa" v-if="data.taskInfo ||data.orderInfo">
    <div class="contracts">
      <div class="details">
        <div class="top-detail">
          <div class="processnumber">
            <img src="../../assets/images/process/liucheng_icon.png" class="taskNo" />
            <span class="sty"
            >流程编号 ({{ data.taskInfo.flowNo}})</span
            >&nbsp;&nbsp;
            <span class="text_sty">
              <span v-show="data.taskInfo.flowStatus == 0" class="circleBluec"></span>
              <span v-show="data.taskInfo.flowStatus == 1" class="successc"><b>✔</b></span>
              <span v-show="data.taskInfo.flowStatus == 2" class="circleRedc"></span>
              <span>{{ data.taskInfo.flowStatus | filterStatus }} </span>
            </span>
          </div>
          <table class="table">
            <tr>
              <th>客户名称</th>
              <th>线索编号</th>
              <th>客户签约人</th>
              <th>业务员</th>
              <th>创建时间</th>
            </tr>
            <tr>
              <td>{{ data.orderInfo.subjectName }}</td>
              <td>{{  data.orderInfo.clueNo }}</td>
              <td>{{  data.orderInfo.signName }}{{  data.orderInfo.signMobile }}</td>
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
                  <span @mouseover="showUserInfo(data.orderInfo.clueSalesmanEmpId)">{{
                    data.orderInfo.clueSalesmanEmpName
                  }}</span>
                </el-tooltip>
                <span v-else>{{
                  data.orderInfo.clueSalesmanEmpName 
                }}</span>
              </td>
              <td>{{  data.taskInfo.createTime }}</td>
            </tr>
            <tr>
              <th>备注</th>
            </tr>
            <tr>
              <td>{{ data.taskInfo.remark }}</td>
            </tr>
          </table>
          <div class="list-header">
              <p class="rectangle"></p>
              <b class="text">订单信息</b>
            </div>
          <div class="process-record">
           <div class="user-data">
              <div class="user-list thead">
                <div class="orderNo_sty">订单编号</div>
                <div class="product">产品名称</div>
                <div>规格属性</div>
                <div>数量</div>
                <div>支付方式</div>
                <div class="user-one"> 代理费单价</div>
                <div>第三方费用单价</div>
                <div>官费单价</div>
                <div>付款状态</div>
                <div>订单总价</div>
                <div>下单时间</div>
              </div>
              <div class="user-list">
                <div class="orderNo_sty">{{ data.orderInfo.orderNo }}</div>
                <el-tooltip v-if="mouseoverState" class="item" effect="dark" :content="data.orderInfo.spuName" placement="top">
                  <div class="product" ref="customer" @mouseover="customerName()" >
                    <span ref="customerChild" class="product_child">{{ data.orderInfo.spuName }}</span>
                  </div>
                </el-tooltip>
                <div v-else ref="customer" class="product"><span ref="customerChild" class="product_child">{{ data.orderInfo.spuName }}</span></div>
                <div>{{ data.orderInfo.spec }}</div>
                <div>{{ data.orderInfo.buyNum }}</div>
                <div>{{  orderFeeInfo[0].payType | filterPayType }}</div>
                <div class="user-one"> {{ filterPrice(1,orderFeeInfo) }}</div>
                <div>{{filterPrice(2,orderFeeInfo) }}</div>
                <div>{{filterPrice(3,orderFeeInfo) }}</div>
                <div>{{ data.orderInfo.orderStatus |filterOrderStatus }}</div>
                <div>{{ data.orderInfo.totalAmount }}</div>
                <div>{{ data.orderInfo.orderTime }}</div>
              </div>
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
          ></elseInfo>
        </div>
        <!-- 审核记录 -->
        <div class="process-record">
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
                <span @mouseover="showUserInfo( processitem.createByName? processitem.createBy :null)"
                  >操作人：{{
                      processitem.createByName || "暂无"
                    }}
                  </span>
                </el-tooltip  >
                <span v-else 
                  >操作人：{{
                      processitem.createByName || "暂无"
                    }}
                  </span>
                <p>
                  {{ processitem.auditState == null ? "备注：" : "审批意见：" }}
                  {{( processitem.auditReason ||  processitem.remark ) ?( processitem.auditReason ||  processitem.remark ) : "暂无"   }}
                </p>
                <p>
                  {{ processitem.createTime }}
                </p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <!-- 审批 -->
        <div class="examine" v-if="isPersonal&&data.taskInfo.flowStatus == 0&&userId!=data.taskInfo.createBy ||!isPersonal&&data.taskInfo.flowStatus == 0&&permissions.sys_taskOpen_audit">
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
                  permissions.sys_taskOpen_audit || isPersonal
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
                  permissions.sys_taskOpen_audit || isPersonal
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

import {getTaskOpenInfo,changeTaskOpenCheck} from "@/api/personal/taskval"
import detailHead from "@/page/index/top/index";
import { getEmpInfo } from "@/api/project/wtClass";
import elseInfo from "@/components/personal/contracts/else-info";
import changeInfo from "@/components/personal/contracts/change-info";
import * as CodeMsg from "@/api/common/CodeChange";
import { auditingOption } from "@/const/crud/personal/auditing";
import { filterArea } from "@/util/new-client/filter";
import { getOrder, auditLog } from "@/api/contracts/contracts";
import { mapGetters } from "vuex";
export default {
  components: {
    detailHead,
    elseInfo,
    changeInfo,
  },
  data() {
    return {
      mouseoverState:true,
      userId:null,
      orderFeeInfo:[],
      tableData: [],
      userInfo: {},
      creditObj: {},
      taskId: null,
      orderData: [],
      changePriceData: [],
      isShow: true,
      textarea: "",
      listData: [],
      data: [],
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
      isPersonal:null,
      auditType: "",
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
    filterPayType(val) {
      if (val == 1) {
        return "定金";
      } else if (val == 2) {
        return "尾款";
      } else if (val == 3) {
        return "一口价";
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
    filterOrderStatus(val) {
      if (val === -5) {
        return "未通过";
      } else if (val == -4) {
        return "待审核";
      } else if (val == -3) {
        return "已失效";
      } else if (val == -2) {
        return "草稿";
      } else if (val == -1) {
        return "待生效";
      } else if (val == 0) {
        return "待付款";
      } else if (val == 1) {
        return "待签约";
      } else if (val == 2) {
        return "待开始";
      } else if (val == 3) {
        return "进行中";
      } else if (val == 4) {
        return "已完成";
      }else if (val == 5) {
        return "已关闭";
      }else if (val == 6) {
        return "已取消";
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
    },
    filterPayStatus(val){
      if(val){
        if (val == 0) {
          return "待审核";
        } else if (val == 1) {
          return "审核通过";
        } else {
          return "审核不通过";
        }
      }
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    this.userId= JSON.parse(sessionStorage.getItem('pigx-userInfo')).content.number
    this.userInfo = JSON.parse(sessionStorage.getItem("pigx-userInfo")).content;
    console.log(this.userInfo);
  },
  mounted() {
    if (JSON.parse(sessionStorage.getItem("pigx-userInfo"))) {
      this.userId = JSON.parse(sessionStorage.getItem("pigx-userInfo")).content.id;
    }
    if (this.$route.query.source==1) {
      this.auditType =true
      this.isPersonal =true
    }else if(this.$route.query.source==2){
      this.auditType =false
      this.isPersonal =false
    }
    this.taskId = this.$route.query.id; 
    this.getData();
  },
  methods: {
    customerName(){
      let customer = this.$refs.customer.offsetWidth
      let customerChild = this.$refs.customerChild.offsetWidth
      if(customerChild>customer){
        this.mouseoverState=true
      }else{
        this.mouseoverState=false
      }
    },
  filterPrice  (val, list){
    let r1 = list.filter((item=>{
      return item.costType == val
    }))
    if (r1&&r1[0]) {return r1[0].price}
      return '-'
  },
   
    // 获取员工信息
    showUserInfo(id) {
      console.log(id);
       if (id) {
          getEmpInfo(id).then((res) => {    
          if (res.data.code == CodeMsg.CODE_0) {
            this.cEmpNo = res.data.data.number;
            this.cDeptName = res.data.data.deptName;
          }
        });
      }
    },
    //初始化
    getData() {
      let params = {
        taskId: Number(this.$route.query.id),
        type: 8,
      };
      // 审核记录
      auditLog(params).then((res) => {
        if (res.data.code == 0) {
          var data = [];
          Object.values(res.data.data).forEach((item) => {
            data.push(...item);
          });
          this.listData = data;
        }
      });
    getTaskOpenInfo(this.$route.query.taskNo, this.isPersonal).then((res) => {
        if (res.data.code == 0) {
          this.data = res.data.data;
          this.tableData =[ res.data.data.orderInfo];
          this.orderFeeInfo = res.data.data.orderFeeInfo;
          //   arr.length > 0 && this.getOrder(arr);
        }
      }).then(res=>{
        this.$nextTick(()=>{
       this.customerName()
      }) 
      })
    },
    //审核通过    
    passed() {
      let params = {
        id: this.data.taskInfo.id,
        orderId:this.data.taskInfo.orderId,
        flowStatus: 1, //合同审核状态 1 审核通过 2 审核不通过
        auditReason: this.textarea,
        //   auditType: this.auditType
      };
      console.log( this.isPersonal);
      this.$confirm('审核通过后，该笔未付款的订单将先生成任务，确定审核通过','提醒',
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            cancelButtonClass: "btn-custom-cancel",
          }).then(()=>{
            changeTaskOpenCheck(params,  this.isPersonal).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "审核通过!",
                duration: 2000,
              });
              setTimeout(() => {
                this.$router.back(-1);
              }, 2500);
            } else {
              this.$message({
                type: "warning",
                message: res.data.msg,
                duration: 2000,
              });
            }
          }
        );
      })
    },
    //审核不通过
    unpassed() {
      if (this.textarea) {
        let params = {
          id: this.data.taskInfo.id,
          orderId:this.data.taskInfo.orderId,
          flowStatus: 2, //合同审核状态 1 审核通过 2 审核不通过
          auditReason: this.textarea,
          //   auditType: this.auditType
        };
        this.$confirm( `确定审核不通过？`, "提醒",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            cancelButtonClass: "btn-custom-cancel",
          }
        ).then(() => {
            changeTaskOpenCheck(params,  this.isPersonal).then(
              (res) => {
                if (res.data.code == CodeMsg.CODE_0) {
                  this.$message({
                    type: "success",
                    message: "流程已驳回!",
                    duration: 2000,
                  });
                  setTimeout(() => {
                    this.$router.back(-1);
                  }, 2500);
                } else {
                  this.$message({
                    type: "warning",
                    message: res.data.msg,
                    duration: 2000,
                  });
                }
              }
            );
        });
      } else {
        this.$message({
          type: "warning",
          message: "请填写内容!",
          duration: 2000,
        });
      }
    },
  },
};
</script>
<style scoped>
.orderNo_sty{
  min-width: 200px !important;
}
.table {
  margin-left: 20px;
  width: 100%;
}
/* .table>tr th ,td{
  text-align: center;
} */
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

.text_sty {
  font-size: 16px;
  font-family: "Microsoft YaHei";
  font-weight: bold;
}
.thead {
  font-size: 12px;
  font-weight: bold;
  background: #fafafa;
}

.user-list {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.user-list > div {
  text-align: center;
  height: 50px;
  line-height: 50px;
  flex: 11;
  font-size: 14px;
}
.user-one {
  width: 280px !important;
}
.product{
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-tow {
  width: 250px !important;
}

.approve-left > div,
.approve-right > div {
  margin-top: 20px;
  margin-left: 180px;
}

.item > div:nth-child(1) {
  margin-right: 20px;
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
</style>
