<template>
<!-- 排查完成 -->
  <div class="contracts" v-if="showContractDetail">
    <div class="details">
      <div class="top-detail">
        <div class="contract-no">
          <img src="../../../public/images/订单.png" class="img" />
          <p v-if="entrance != 'supplement'">合同编号:{{ data.contractNo }}</p>
          <p v-if="entrance == 'supplement'">合同编号:{{ data.contractSupplementaryNo }}</p>
          <div class="contract-status" v-if="entrance == 'paper' || entrance == 'supplement'">
            <span v-show="data.taskStatus == null || data.taskStatus == -1" class="circleBluec circleOrange"></span>
            <span v-show="data.taskStatus == 0" class="circleBluec"></span>
            <span v-show="data.taskStatus == 1" class="successc"><b>✔</b></span>
            <span v-show="data.taskStatus == 2" class="circleRedc"></span>
            <span>{{ data.taskStatus | contractsStatus }} </span>
            <span v-show="data.taskStatus == 2">{{data.auditReason}}</span>
          </div>
          <div class="contract-status" v-else>
            <span v-show="data.contractStatus == 0" class="circleBluec"></span>
            <span v-show="data.contractStatus == 2" class="successc"><b>✔</b></span>
            <span>{{ data.contractStatus | elecontractsStatus }} </span>
          </div>
         <div class="btns"  v-if="entrance == 'paper'&&data.taskStatus == 2">
            <!-- 编辑合同 -->
            <el-button
              type="primary"
              @click="permissions.sys_contract_paper_detail || isPersonal ? updateContracts(data) : $notAuthorized()"
              class="cont-btn">{{ $t("button.updateContracts") }}</el-button>
            <!-- 删除合同 -->
            <el-button
              type="primary"
              class="delete cont-btn"
              @click="permissions.sys_contract_paper_del || isPersonal ? del(data) : $notAuthorized()"
              >{{ $t("button.deleteContracts") }}</el-button>
         </div>
         <div class="btns"  v-if="entrance == 'supplement'&&data.taskStatus == 2">
            <!-- 编辑合同 -->
            <el-button
              type="primary"
              @click="permissions.sys_contract_supplement_edit || isPersonal ? updateSupplementContracts(data) : $notAuthorized()"
              class="cont-btn">修改协议</el-button>
            <!-- 删除合同 -->
            <el-button
              type="primary"
              class="delete cont-btn"
              @click="permissions.sys_contract_supplement_del || isPersonal ? delSupplement(data) : $notAuthorized()"
              >删除协议</el-button>
         </div>
        </div>
        <table class="table">
          <tr>
            <th v-if="entrance != 'supplement'">主体ID</th>
            <th>客户名称</th>
            <th>地区</th>
            <th>合同金额</th>
            <th v-if="entrance == 'paper' || entrance == 'supplement'">创建时间</th>
            <th v-if="entrance == 'supplement'">补充协议附件</th>
            <th v-if="entrance == 'supplement'">实际签署时间</th>
            <th v-if="entrance != 'supplement'">合同附件</th>
          </tr>
          <tr>
           <!-- 主体ID -->
            <td v-if="entrance != 'supplement'">{{ data.userNo }}</td>
            <td>{{ data.authName }}</td>
            <td>{{ data.orgAddress | filterArea }}</td>
            <td>{{ data.totalAmount | amount}}</td>
            <td v-if="entrance == 'paper' || entrance == 'supplement'">{{ data.createTime!=null ? this.$moment(data.createTime).format("YYYY-MM-DD") : data.createTime}}</td>
            <td v-if="entrance=='supplement'">
              <!-- 补充协议合同 -->
              <el-tooltip
                effect="dark"
                :content="data.contractSupplementaryName">
                <span class="cell-blue" @click="entrance == 'supplement' && permissions.sys_contract_paper_edit || isPersonal ? open(data.signUrl) : $notAuthorized()">
                  {{data.contractSupplementaryName | attachmentName}}</span>
              </el-tooltip>
            </td>
            <td v-if="entrance == 'supplement'">{{data.signTime}}</td>
           <!-- 合同附件 -->
            <td v-if="entrance != 'supplement'">
              <el-tooltip
                v-if="entrance=='paper'"
                effect="dark"
                :content="data.contractName">
                <span class="cell-blue" @click="entrance == 'paper' && permissions.sys_contract_paper_edit || isPersonal ? download(data.signUrl) : $notAuthorized() || entrance == 'electronic' && permissions.sys_contract_electronic_edit || isPersonal ? download(data.signUrl) : $notAuthorized()">
                  {{data.contractName | attachmentName}}</span>
              </el-tooltip>
              <el-tooltip
                v-else
                effect="dark"
                :content="data.contractName+'.pdf'">
                <span class="cell-blue" @click="download(data.signUrl)">
                  {{data.contractName+'.pdf' | attachmentName}}</span>
              </el-tooltip>
            </td>
          </tr>
          <tr>
            <th>线索编号</th>
            <th v-if="entrance == 'paper' || entrance == 'supplement'">联系人</th>
            <th>签约人</th>
            <th>业务员</th>
            <th v-if="entrance == 'supplement'">主合同附件</th>
            <th v-if="entrance == 'electronic'">下单时间</th>
            <th v-if="entrance != 'supplement'">签约时间</th>
            <th v-if="entrance == 'supplement'">主合同编号</th>
          </tr>
          <tr>
            <td>{{data.clueNo}}</td>
            <td  v-if="entrance == 'paper' || entrance == 'supplement'">
              <span class="left-space">{{ data.contactName }}</span>
              <span>{{ data.mobile || data.contactMobile }}</span>
            </td>
            <td>
              <span class="left-space">{{ data.signName }}</span>
              <span>{{ data.signMobile }}</span>
            </td>
            <td>
              <!-- 业务员 -->
              <el-tooltip
                v-if="data.clueSalesmanEmpId!=0"
                effect="dark"
                :content="'工号：' + cEmpNo +' 部门：' + cDeptName"
                placement="bottom-start">
                <span  @mouseover="showUserInfo(data.clueSalesmanEmpId)">{{ data.clueSalesmanEmpName }}</span>
              </el-tooltip>
              <span v-else>{{ data.clueSalesmanEmpName }}</span>
            </td>
            <td v-if="entrance == 'supplement'">
              <el-tooltip
                effect="dark"
                :content="data.contractName">
                <span class="cell-blue" @click="entrance == 'supplement' && permissions.sys_contract_paper_edit || isPersonal ? open(data.contractSignUrl) : $notAuthorized()">
                  {{data.contractName | attachmentName}}</span>
              </el-tooltip>
            </td>
            <td  v-if="entrance == 'electronic'">{{ data.orderTime!=null ? this.$moment(data.orderTime).format("YYYY-MM-DD") : data.createTime}}</td>
            <td v-if="entrance != 'supplement'">{{ data.signTime!=null ? this.$moment(data.signTime).format("YYYY-MM-DD") : data.signTime }}</td>
            <td v-if="entrance == 'supplement'">{{ data.contractNo }}</td>
          </tr>
          <tr>
            <th>
              <p class="info-note">
                合同备注<i class="el-icon-edit edit" @click="entrance == 'paper' && permissions.sys_contract_paper_edit || isPersonal ? editNote() : $notAuthorized() || entrance == 'electronic' && permissions.sys_contract_electronic_edit || isPersonal ? editNote() : $notAuthorized()"></i>
              </p>
            </th>
          </tr>
          <tr>
            <td>{{ data.remark }}</td>
          </tr>
        </table>
      </div>
      <div class="bottom-detail tabottom">
        <el-tabs type="border-card" v-model="value" v-if="entrance == 'paper' || entrance == 'supplement'">
          <el-tab-pane name="1" label="订单信息">
            <orderInfo :orderData="orderData" :data="data" v-if="orderData.length>0"></orderInfo>
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
                <template slot="createByName" slot-scope="scope">
                  <el-tooltip
                    effect="dark"
                    :content="'工号：' + cEmpNo +' 部门：' + cDeptName"
                    placement="bottom-start"
                  >
                    <span  @mouseover="showUserInfo(Number(scope.row.createBy))">{{ scope.row.createByName }}</span>
                  </el-tooltip>
                </template>
              </avue-crud>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div v-else-if="entrance == 'electronic'">
          <orderInfo  :orderData="orderData" :data="data" v-if="orderData.length>0"></orderInfo>
        </div>
      </div>
    </div>

    <!-- 编辑备注弹窗  -->
    <el-dialog :visible.sync="noteDialog" title="编辑备注" :close-on-click-modal="false" width="500px">
      <el-input type="textarea" v-model="note" rows="5" maxlength="100" show-word-limit/>
      <div class="edit-note">
        <el-button type="primary" @click="submit()" v-preventReClick>确 定</el-button>
        <el-button @click="noteDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import detailHead from "@/page/index/top/index";
import orderInfo from "@/components/personal/contracts/order-info";
import { auditingOption } from "@/const/crud/personal/auditing";
import { getSupplementDetail, removePaperContract } from "@/api/supplement/index";
import * as CodeMsg from "@/api/common/CodeChange";
import { mapGetters } from "vuex";
import { filterArea } from "@/util/new-client/filter"
import {
  getPaperContractsDetail,
  getContractsDetail,
  getOrder,
  paperRecords,
  deleteContract,
  downloadLog,
  updateContractNote,
} from "@/api/contracts/contracts";
import { getEmpInfo } from "@/api/project/wtClass"
export default {
  components: {
    detailHead,
    orderInfo,
  },
  data() {
    return {
      orderData: [],
      isShow: true,
      textarea: "",
      value: "1",
      tableData: [],
      data: "",
      imgBaseUrl: "",
      previewFileUrl: "",
      attachmentName: "",
      auditingOption: auditingOption,
      productType: "",
      page: {
        total: 0,
        pageSize: 20,
        currentPage: 1,
        pageSizes: [3, 5, 10, 20, 50],
      },
      showContractDetail: false,
      noteDialog: false,
      note: "",
      entrance:"",
      cEmpNo:"",
      cDeptName:"",
      isPersonal: this.$route.query.source == 'personal',
      source: ''
    };
  },
  filters: {
    contractsStatus(val) {
     if(val==null||val==-1){
        return "草稿"
      }else if(val==0){
        return "待审核"
      }else if(val==1){
        return "已通过"
      }else if(val==2){
        return "未通过"
      }
    },
    elecontractsStatus(val){
      if(val==0){
        return "待签约"
      }else if(val==2){
        return "已签约"
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
    amount(val){
       return val == 0 ? '待定' : Number(val).toFixed(2)
    },
    filterArea(val){ 
      return filterArea(val)
    },
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    if(this.$route.query.source){
      this.source = this.$route.query.source;
    }
    this.entrance = this.$route.query.entrance;
    sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(this.$route.query));
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
    open(url){
      if(url.match('fadada')){
        window.open(url,'_blank');
      }else{
        window.open(this.imgBaseUrl+url,'_blank');
      };
    },
    // 获取员工信息
    showUserInfo(id){
      getEmpInfo(id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.cEmpNo = res.data.data.number
          this.cDeptName = res.data.data.deptName
        }
      })
    },
    // 修改合同备注
    submit() {
      if (this.data.remark == this.note) {
        this.noteDialog = false;
        this.$message({
          message: "修改备注成功！",
          type: "success",
          duration: 2000
        });
        this.getData();
      } else {
        let param = {
          id: this.$route.query.id,
          remark: this.note,
        };
        updateContractNote(this.$route.query.entrance, param).then((res) => {
          this.noteDialog = false;
          this.$message({
            type: "success",
            message: "修改备注成功！",
            duration: 2000
          });
          this.getData();
        });
      }
    },
    cancel() {
      this.noteDialog = false;
    },
    // 编辑备注
    editNote() {
      this.note = this.data.remark;
      this.noteDialog = true;
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getOperateRecords();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getOperateRecords();
    },
    switch() {
      if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
    },
    //获取纸质合同详情
    getData() {
      let id = this.$route.query.id;
      if(this.entrance == 'paper'){
        getPaperContractsDetail(Number(id)).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.showContractDetail = true;
        } else if (res.data.code == 1001) {
          setTimeout(() => {
            history.go(-1);
          }, 500);
        }
        this.data = res.data.data;
        this.getOrder(res.data.data.orderIdList)
       });
      }else if(this.entrance == 'electronic'){
        getContractsDetail(Number(id)).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.showContractDetail = true;
        } else if (res.data.code == 1001) {
          setTimeout(() => { 
            history.go(-1);
          }, 500);
        }
        this.data = res.data.data;
        this.getOrder([res.data.data.orderId])
       });
      }else if(this.entrance == 'supplement' && (this.permissions.sys_contract_supplement_detail || this.source == 'personal')){//补充协议详情
        getSupplementDetail({id:this.$route.query.id}, this.source).then(res=>{
          if (res.data.code == CodeMsg.CODE_0) {
            this.showContractDetail = true;
          } else if (res.data.code == 1001) {
            setTimeout(() => {
              history.go(-1);
            }, 500);
          }
          this.data = res.data.data;
          this.$set(this.data,'taskStatus',this.data.contractSupplementaryStatus);
          this.getOrder(res.data.data.contractSupplementaryOrderIdList);
        })
      }else{
        this.$notAuthorized();
      };
    },
    // 根据订单id查订单列表
    getOrder(arr){
      getOrder(arr).then(res=>{
        if(res.data.code == 0){
          this.orderData = JSON.parse(JSON.stringify(res.data.data))
        }
      })
    },
    // 操作记录
    getOperateRecords() {
      let param = {
        keyId: Number(this.$route.query.id),
        type: 8,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
     paperRecords(param).then((res) => {
        this.tableData = res.data.data.records;
        this.page.total = res.data.data.total;
      });
    },
    //合同下载
    download(url) {
      downloadLog(this.$route.query.id).then((res) => {});
      this.previewFileUrl = this.imgBaseUrl + url;
      if(this.entrance == 'electronic'){
        window.open(url, "_blank");
      }else if(this.entrance == 'paper'){
        window.open(this.previewFileUrl, "_blank");
      }
    },
    //修改合同
    updateContracts(row) {
      this.$router.push({
        path: "/entering-contract",
        query: {
          updateContract:1,
          id: row.id, 
          entrance:'paper',
          source: this.$route.query.source,
        }
      })
    },
    //补充协议编辑
    updateSupplementContracts(row){
      this.$router.push({
        path: "/entry-supplementContract",
        query: {
          id: row.id, 
          entrance:'supplement',
          source: this.$route.query.source,
        }
      })
    },
    // 删除合同
    del(row) {
      this.$confirm('此操作将删除该合同, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: "btn-custom-cancel",
        type: 'warning'
      }).then(() => {
        deleteContract(row.id).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 2000
            });
            setTimeout( ()=>{
              this.$router.push("/contracts/contracts-manage")
            },1000)
          }
        })         
      })
    },
    // 删除补充协议
    del(row) {
      this.$confirm('此操作将删除该补充协议, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: "btn-custom-cancel",
        type: 'warning'
      }).then(() => {
        removePaperContract({contractId:row.id},this.$route.query.source).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 2000
            });
            setTimeout( ()=>{
              history.go(-1);
            },1000)
          }
        })         
      })
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
.cell-blue {
  color: #36a6fe;
  cursor: pointer;
}
.contracts {
  height: 100%;
  margin-bottom: 0;
  background: #f6f7fa;
}
.btns {
  position:absolute;
  top:5px;
  right:25px;
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
.circleOrange {
  background: orange;
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
  position: relative;
}
.contract-no img {
  margin-top: 15px;
  margin-left: 20px;
  width: 24px;
  height: 24px;
}
.contract-status {
  font-size: 14px;
  line-height: 24px;
  margin: auto 10px;
  padding: 0 10px;
  border-radius: 2px;
  cursor: pointer;
  font-weight: 400;
}
.details {
  min-width: 1200px;
  margin: 0 10px;
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
.cont-btn {
  height:35px;
  margin-top:10px;
}
.circle {
  position: relative;
  top: 2px;
  margin-left: 5px;
  width: 14px;
}
.delete {
  margin-left: 30px;
  margin-top:10px;
}
.cell-blue {
  display: inline-block;
  color: #36a6fe;
  cursor: pointer;
  max-width: 140px;
}
.tabottom {
  margin-bottom: 200px;
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
.examine {
  margin-top: 16px;
  /* margin-bottom:200px; */
  background: #fff;
  /* padding:20px; */
  /* margin-bottom:60px */
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