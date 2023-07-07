<template>
  <div class="contracts">
    <div class="top-detail">
      <div class="contract-no">
        <img src="../../../public/images/订单.png" class="img" />
        <p>合同编号:{{ data.contractNo || data.prefix + "序号待定" }}</p>
        <!-- <div class="edit-contract-btn" @click="editContract()">编辑</div> -->
          <el-tooltip
              v-if="data.contractStatus == 3"
              effect="dark"
              :content="data.lastContractProcess.approveNote"
              placement="top"
              class="top-status"
            >
              <span>
                <span class="circleRedc"></span>
                {{ data.contractStatus | contractsStatus }}
                <span>（未通过原因：<span>***********</span>）</span>
                </span>
            </el-tooltip>
            <div v-else class="top-status">
              <span
                v-show="data.contractStatus == 2"
                class="circleBluec"
              ></span>
              <span v-show="data.contractStatus == 1" class="successc"
                ><b>✔</b></span
              >
              <span>{{ data.contractStatus | contractsStatus }} </span>
            </div>
      </div>
      <table class="table">
        <!-- <tr>
          <th>客户名称</th>
          <th>地区</th>
          <th>联系人</th>
          <th>签约人</th>
          <th>签约时间</th>
          <th>创建时间</th>
        </tr> -->
         <tr>
          <th>主体ID</th>
          <th>客户名称</th>
          <th>地区</th>
          <th>合同金额</th>
          <th>创建时间</th>
          <th>合同附件</th>
        </tr>
        <tr>
          <!-- 主体ID -->
          <td>{{ data.userNo }}</td>
          <!-- 客户名称 -->
          <td>{{ data.customerName }}</td>
          <td>地区</td>
          <!-- 合同金额 -->
          <td>
            {{ data.contractSumUncertain ? "待定" : data.contractSum/100}}
          </td>
          <!-- 创建时间 -->
          <td>{{ data.gmtCreate }}</td>
           <!-- 合同附件 -->
          <td>
            <el-tooltip
              v-if="data.attachmentName"
              effect="dark"
              :content="data.attachmentName"
              placement="bottom-start"
            >
              <span class="cell-blue" @click="download(data.attachmentUrl)">{{
                data.attachmentName | attachmentName
              }}</span>
            </el-tooltip>
          </td>
        </tr>
        <tr>
          <!-- <th>主体ID</th>
          <th>合同金额</th>
          <th>客户归属</th>
          <th>订单归属</th>
          <th>业务员</th>
          <th>合同附件</th> -->
           <th>线索编号</th>
          <th>联系人</th>
          <th>签约人</th>
          <th>业务员</th>
          <th>签约时间</th> 
        </tr>
        <tr>
          <!-- <td>{{ data.userNo }}</td> -->
           <td>{{data.clueNo}}</td>
           <!-- 客户联系人 -->
          <td>
            <span class="left-space">{{ data.userName }}</span
            ><span>{{ data.userPhone }}</span>
          </td>
          <!-- 签约联系人 -->
          <td>
            <span class="left-space">{{ data.signName }}</span
            ><span>{{ data.signMobilephone }}</span>
          </td>
          <!-- 客户归属 -->
         <!--  <td>
            <el-tooltip
              v-if="data.cuBelongName"
              effect="dark"
              :content="
                '工号：' + data.cuBelongNo + '   部门：' + data.cuBelongDeptName
              "
              placement="bottom-start"
              ><span>{{ data.cuBelongName }}</span></el-tooltip
            >
            <el-tooltip v-if="data.contractStatus==2" effect="dark" content="正在流程中" placement="bottom-start">
                <span><img  class="circle"  src="@/assets/iconfonts/circle.svg"></span>
              </el-tooltip> 
          </td>-->
          <!-- <td>
             线索归属
            <el-tooltip
              v-if="data.clBelongName"
              effect="dark"
              :content="
                '工号：' + data.clBelongNo + '   部门：' + data.clBelongDeptName
              "
              placement="bottom-start"
            >
              <span>{{ data.clBelongName }}</span>
            </el-tooltip>
          </td> -->
          <!-- 业务员 -->
          <td>
            <el-tooltip
              v-if="data.saleBelongName"
              effect="dark"
              :content="
                '工号：' +
                data.saleBelongNo +
                '   部门：' +
                data.saleBelongDeptName
              "
              placement="bottom-start"
            >
              <span>{{ data.saleBelongName }}</span>
            </el-tooltip>
          </td>
        <!-- 签约时间 -->
          <td>{{ data.signTime }}</td>
        </tr>
        <!-- 合同备注 -->
        <tr>
          
          <th>
            <p class="info-note">
              合同备注<i class="el-icon-edit edit" @click="editNote()"></i>
            </p>
          </th>
        </tr>
        <tr>
           
          <td>{{ data.contractNote }}</td>
        </tr>
      </table>
    </div>
    <div class="bottom-detail">
      <el-tabs type="border-card" v-model="value">
        <el-tab-pane name="1" label="订单信息">
          <!-- <orderInfo :orderData="orderData" :data="data"></orderInfo> -->
          <online-order-info :orderData="orderData" :data="data" />
        </el-tab-pane>
        <el-tab-pane name="2" label="操作记录">
          <div class="list-header">
            <p class="rectangle"></p>
            <b class="text">操作记录</b>
          </div>
          <div>
            <avue-crud
              :data="tableData"
              :option="auditingOption"
              @on-load="getOperateRecords"
              :page.sync="page"
              @size-change="sizeChange"
              @current-change="currentChange"
            >
              <template slot="operName" slot-scope="scope">
                <el-tooltip
                  effect="dark"
                  :content="
                    '工号：' +
                    scope.row.operNo +
                    '   部门：' +
                    scope.row.operDeptName
                  "
                  placement="bottom-start"
                >
                  <span>{{ scope.row.operName }}</span>
                </el-tooltip>
              </template>
            </avue-crud>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :visible.sync="noteDialog"
      title="编辑备注"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-input
        type="textarea"
        v-model="note"
        rows="5"
        maxlength="100"
        show-word-limit
      />
      <div class="edit-note">
        <el-button type="primary" @click="submit()" v-preventReClick
          >确 定</el-button
        >
        <el-button @click="noteDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import detailHead from "@/page/index/top/index";
import orderInfo from "@/components/personal/contracts/order-info";
import { auditingOption } from "@/const/crud/personal/auditing";
import {
  getOnLionContract,
  contractsDelete,
  downloadLog,
  operateRecords,
  updateNote, 
} from "@/api/personal/mycontracts";
import { approveRecords, } from "@/api/contracts/contracts";
import { getUUID } from "@/api/personal/mycontracts";
import { clearDetail } from "@/util/clearDetail";
import OnlineOrderInfo from "../../components/personal/contracts/online-order-info.vue";
export default {
  components: {
    detailHead,
    orderInfo,
    OnlineOrderInfo,
  },
  filters: {
    contractsStatus(val) {
      if (val === null) {
        return "全部";
      } else if (val === "2") {
        return "待审核";
      } else if (val === "1") {
        return "已通过";
      } else if (val === "3") {
        return "未通过";
      } else if (val === "0") {
        return "草稿";
      }
    },
    // attachmentName(val) {
    //   if (val) {
    //     if (val.slice(0, val.lastIndexOf(".")).length < 9) {
    //       return val;
    //     } else {
    //       return val.slice(0, 8) + "..." + ".pdf";
    //     }
    //   } else {
    //     return "-";
    //   }
    // },

  },
  data() {
    return {
      value: "1",
      tableData: [],
      auditingOption: auditingOption,
      data: "",
      imgBaseUrl: "",
      previewFileUrl: "",
      orderData: [],
      noteDialog: false,
      note: "",
      page: {
        total: 0,
        pageSize: 20,
        currentPage: 1,
        pageSizes: [3, 5, 10, 20, 50],
      },
    };
  },
  created() {
    sessionStorage.setItem(
      JSON.parse(sessionStorage.getItem("pigx-tag")).content.value,
      JSON.stringify({
        page: JSON.parse(
          sessionStorage.getItem(
            JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
          )
        ).page,
        screening: JSON.parse(
          sessionStorage.getItem(
            JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
          )
        ).screening, //表单筛选信息
        ID: JSON.parse(sessionStorage.getItem("pigx-tag")).content.label, //页面标识
        detail: { query: this.$route.query, path: this.$route.path },
      })
    ); //保存页面信息
  },
  mounted() {
    this.getData();
    this.switch();
  },
  methods: {
    submit() {
      if (this.data.contractNote == this.note) {
        this.noteDialog = false;
        this.$message({
          message: "修改备注成功！",
          type: "success",
        });
        this.getData();
      } else {
        let param = {
          id: this.data.id,
          contractNote: this.note,
          contractNo: this.data.contractNo,
        };
        let successMsg = "修改备注成功！";
        updateNote(param).then((res) => {
          this.noteDialog = false;
          this.$message({
            type: "success",
            message: successMsg,
          });
          this.getData();
        });
      }
    },
    cancel() {
      this.noteDialog = false;
    },
    editNote() {
      this.note = this.data.contractNote;
      this.noteDialog = true;
    },
    sizeChange(val) {},
    currentChange(val) {},
    switch() {
      if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
    },
    getData() {
      let id = this.$route.query.id;
      getOnLionContract({ contractId: id }).then((res) => {
        this.data = res.data.data;
        this.orderData = res.data.data.orders;
      });
    },
    getOperateRecords() {
      let param = {
        contractId: this.$route.query.id,
        current: this.page.currentPage,
        size: this.page.pageSize,
      };
      operateRecords(param).then((res) => {
        this.tableData = res.data.data.records;
        this.page.total = res.data.data.total;
      });
    },
    //合同下载
    download(url) {
      downloadLog(this.$route.query.id).then((res) => {});
      this.previewFileUrl = this.imgBaseUrl + url;
      window.open(this.previewFileUrl, "_blank");
    },
    //修改合同
    editContract() {
      console.log("1111");
      this.$router.push({
        path: "/online-entering-contract",
        query: {
          // uuid: res.data.data,
          // clueId:this.data.clueId,
          constractSource: 1,
          contractStatus: this.data.contractStatus,
          id: this.data.id,
          update: 1,
          source: this.$route.query.source,
        },
      });
    },
    // 删除合同
    delContracts() {
      this.$confirm("此操作将删除该合同, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: this.data.id,
            contractStatus: this.data.contractStatus,
            no: this.data.contractNo
              ? this.data.contractNo
              : this.data.prefix + "序号待定",
          };
          contractsDelete(params).then((res) => {
            console.log(res, "sjelu");
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              clearDetail("/personal/my-contracts");
              setTimeout(() => {
                this.$router.push("/personal/my-contracts");
              }, 500);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style>
.bottom-detail .el-tabs--border-card {
  background: #fff;
  border: 0;
  border-top: 0.1px solid #dcdfe6;
  box-shadow: 0 0 0 #fff;
}
</style>
<style scoped>
.contracts {
  background: #f6f7fa;
  min-width: 1200px;
  margin: 0 10px;
  border-radius: 5px;
}
.details {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.table {
  margin-left: 20px;
  width: 100%;
}
.table td,
th {
  max-width: 200px;
  word-wrap: break-word;
  word-break: break-all;
}
.top-detail {
  background: #fff;
  padding-bottom: 15px;
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.bottom-detail {
  margin-top: 16px;
  margin-bottom: 200px;
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
.examine {
  margin-top: 16px;
  margin-bottom: 200px;
  background: #fff;
  padding: 20px;
  padding-bottom: 60px;
}
.examine-content {
  width: 800px;
  margin: 0 auto;
  font-size: 14px;
}
.button {
  margin-top: 30px;
  text-align: center;
}
.unpassed {
  margin-left: 50px;
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
.contract-no {
  display: flex;
  font-size: 16px;
  line-height: 24px;
  font-weight: 550;
}
.top-status{
  margin-top: 15px;
  margin-left: 20px;
}
.contract-no img {
  margin-top: 15px;
  margin-left: 20px;
  width: 24px;
  height: 24px;
}
.edit-contract-btn {
  font-size: 14px;
  border: 1px solid #36a6fe;
  line-height: 24px;
  margin: auto 10px;
  padding: 0 10px;
  border-radius: 2px;
  color: #36a6fe;
  cursor: pointer;
  font-weight: 400;
}
.edit {
  color: #409eff;
  cursor: pointer;
  margin-left: 3px;
}
.edit-note {
  text-align: right;
  margin-top: 10px;
}
</style>