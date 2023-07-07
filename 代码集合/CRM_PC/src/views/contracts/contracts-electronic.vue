<template>
<!-- 排查完成 -->
  <basic-container>
    <div v-if="permissions.sys_contract_electronic_detail || permissions.sys_contract_electronic_edit">
      <el-form
        :model="contractsForm"
        ref="contractsForm"
        class="search"
        inline
        label-width="90"
        @keyup.enter.native="(hasTapBtn = true), getContractsList()">
        <el-form-item prop="contractStatus">
          <el-radio-group
            size="medium"
            v-model="contractsForm.contractStatus"
            @change="getContractsList">
            <!-- 合同状态 -->
            <el-radio-button
              class="radio-sty"
              :class="{ 'radio-sty-left': index }"
              v-for="(item, index) in conStatusList"
              :key="index"
              :label="item.label">
              <span v-show="index == 1" class="success"><b>✔</b></span>
              <span>{{ item.value }}</span>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-button type="info" plain size="medium" disabled>发起合同</el-button>
        <div>
          <div>
            <el-form-item label="关键字：" prop="keyWords">
              <el-input
                placeholder="客户名称/订单信息关键字/合同编号/订单编号"
                class="contract-keyword"
                v-model.trim="contractsForm.keyWords"
              ></el-input>
            </el-form-item>
            <el-form-item label="业务员" prop="saleNo">
              <el-input placeholder="请输入业务员姓名或工号"
                style="width:200px;"
                v-model.trim="contractsForm.saleNo"></el-input>
            </el-form-item>
            <el-form-item label="地区：" prop="region">
              <el-cascader
                :options="areaOptions"
                v-model.trim="contractsForm.region"
                :props="{value: 'id',label: 'areaName'}"
                placeholder="请选择地区"></el-cascader>
            </el-form-item>
            <el-form-item label="订单类型：">
              <el-select v-model="contractsForm.productType">
                <el-option label="全部" :value="null"></el-option>
                <el-option v-for="(item,index) in selectList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
             <!-- 签约时间 -->
              <el-form-item label="签约时间：" prop="signTime" width="80px">
                <el-date-picker
                  style="width: 280px"
                  v-model="contractsForm.signTime"
                  type="daterange"
                  format="yyyy-MM-dd HH:mm"
                  :default-time="['00:00:00', '23:59:59']"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <!-- 搜索与重置 -->
            <div class="mar">
              <el-button
              size="small"
              type="primary"
              @click="(hasTapBtn = true), getContractsList()">{{ $t("button.search") }}</el-button>
              <el-button
                size="small"
                type="warning"
                @click="(hasTapBtn = true), reset()">{{ $t("button.reset") }}</el-button>
              <el-button size="small" type="primary" @click="hasTapBtn = true, getExport()" v-if="permissions.sys_contract_export">数据导出</el-button>
            </div>
          </div>
        </div>
      </el-form>
      <!-- 我的合同列表 -->
      <avue-crud
        ref="crud"
        class="batch-choose"
        :data="tableData"
        :option="electronicOption"
        :page.sync="page"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template slot="contractNo" slot-scope="scope">
          <span @click="showDetail(scope.row)" class="cell-blue">{{scope.row.contractNo}}</span>
          <span class="has-supplement" v-if="scope.row.hasSupplementary">补</span>
        </template>
        <!-- 订单编号 -->
        <template slot="orderNo" slot-scope="scope">
          <div class="contract-order">
            {{ scope.row.orderNo }}
          </div>
        </template>
         <!-- 地区 -->
        <template slot="orgAddress" slot-scope="scope">
          <span>{{ scope.row.orgAddress | filterArea}} </span>
        </template>
        <!-- 业务员 -->
        <template slot="clueSalesmanEmpName" slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+ cEmpNo +'   部门：'+ cDeptName" placement="right" v-if="scope.row.clueSalesmanEmpId!=0">
            <span @mouseover="showUserInfo(scope.row.clueSalesmanEmpId)">
              {{scope.row.clueSalesmanEmpName}}
            </span>
          </el-tooltip>
          <span v-else>{{scope.row.clueSalesmanEmpName}}</span>
        </template>
        <!-- 合同金额 -->
        <template slot="totalAmount" slot-scope="scope">
          <span>{{ scope.row.totalAmount | amount}} </span>
        </template>
        <!-- 合同状态 -->
        <template slot="contractStatus" slot-scope="scope">
          <span v-show="scope.row.contractStatus == 0" class="circleBluec"></span>
          <span v-show="scope.row.contractStatus == 2" class="successc"><b>✔</b></span>
          <span>{{ scope.row.contractStatus | contractsStatus }} </span>
        </template>
        <!-- 操作 -->
        <template slot="menu" slot-scope="scope">
          <el-button type="text" @click="showDetail(scope.row)">{{$t("button.check")}}</el-button>
          <el-button type="text" v-if="scope.row.contractStatus == 2 && permissions.sys_contract_electronic_detail" @click="download(scope.row)">预览合同</el-button>
        </template>
      </avue-crud>
      <el-dialog 
          title="数据导出中，请稍后..."
          :visible.sync="exportDialog"
          width="450px"
          top="350px"
          :close-on-click-modal= "false">
          <el-progress :text-inside="true" :stroke-width="24" :percentage="percent" status="success"></el-progress>
        </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import orderData from '@/components/member/order-data'
import { getEmpList,getAreaTree } from "@/api/clue/clue";
import { getEmpInfo } from "@/api/project/wtClass"
import { filterArea } from "@/util/new-client/filter"
import { saveDetal } from "@/util/clearDetail";
import {
  getEleContracts,
  downloadLog,
  dataEleExport,
  dataEleProgress
} from "@/api/contracts/contracts";
import { electronicOption } from "@/const/crud/contracts/electronic";
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      cEmpNo:'',
      cDeptName:'',
      hasTapBtn: false,
      areaOptions: [],
      senior: false,
      page: {
        currentPage: 1,
        total: 0,
        layout: "total, sizes, prev, pager, next, jumper",
        background: true,
        pageSizes: [5, 8, 10, 20, 30, 40, 50, 100], //选择每页显示条数
        pageSize: 20,
      },
      empList: [],
      imgUrl:
        process.env.NODE_ENV == "production"
          ? "//static.wotao.com/"
          : "//static-tst.wotao.com/",
      electronicOption: electronicOption,
      tableData: [],
      conStatusList: [
        {
          label: null,
          value: "全部",
        },
        {
          label: 2,
          value: "已签约",
        }
      ],
      contractsForm: {
        region:null,
        keyWords: null,
        saleNo:null,
        productType: null,
        contractSource: "",
        contractStatus: null,
        cuBelongNo: [],
        signTime: [],
        orderTime: [],
        clBelongNo: [],
        saleBelongNo: [],
      },

      cuBelongNo: [],
      saleBelongNo: [],
      selectList: orderData.proTypeData,
      sourceList: [
        {
          label: 1,
          value: "前台下单",
        },
        {
          label: 0,
          value: "后台发起",
        },
      ],
      exportDialog: false,
      percent: 0
    };
  },
  filters: {
    contractsStatus(val) {
      if (val === 0) {
        return "待签约";
      } else if (val == 2) {
        return "已签约";
      } 
    },
    categoryId(val) {
      if (val === 1) {
        return "项目申报";
      } else if (val == 0) {
        return "知识产权";
      }
    },
    filterArea(val){ 
      return filterArea(val)
    },
    amount(val){
      if(!isNaN(Number(val)) && val!=null){
        return Number(val).toFixed(2)
      }
    },
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  
  created() {
    if(sessionStorage.getItem(`${this.$route.path}`)){
      let keepParams = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
      if(keepParams.detail.path !== ""){
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query
        });
        return;
      }
      this.contractsForm.contractStatus = keepParams.contractStatus
      this.contractsForm.keyWords = keepParams.keyWords
      this.contractsForm.saleNo = keepParams.saleNo
      this.contractsForm.region = keepParams.region
      this.contractsForm.productType = keepParams.productType
      this.contractsForm.signTime = keepParams.signTime
    }
  },
  mounted() {
    if (!this.permissions.sys_contract_electronic_detail && !this.permissions.sys_contract_electronic_edit) this.$notAuthorized()
    this.getData();
    this.getAreaTree();
    this.getContractsList();
  },
  methods: {
    getExport(){
      this.exportDialog = true
      this.dataExport()
      let progress = null
      let timer = setInterval(() => {
        progress = this.getProgress()
        if(progress == 100){
          clearInterval(timer)
          this.exportDialog = false
        }
      }, 3000)
    },
    // 获取进度
    getProgress(){
      let progress = null
      dataEleProgress().then((res) => {
        progress = res.data.data
      });
      if(progress == 1.0 || progress=='1.0' || progress == null){
        this.percent = 100
      }else{
        this.percent = Number(progress) * 100
      }
      return this.percent
    },
      // 数据导出
      dataExport(){
       var params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        keywords: this.contractsForm.keyWords,
        // contractStatus: this.contractsForm.contractStatus,
        categoryId: this.contractsForm.productType,
        startSignTime:this.contractsForm.signTime.length == 0? null: this.$moment(this.contractsForm.signTime[0]).format("YYYY-MM-DD HH:mm:ss"),
        endSignTime:this.contractsForm.signTime.length == 0? null: this.$moment(this.contractsForm.signTime[1]).format("YYYY-MM-DD HH:mm:ss"),
        clueSalesmanEmp:this.contractsForm.saleNo,
        orgAddress:this.contractsForm.region == null ? null :this.contractsForm.region.toString()
      };
        dataEleExport(params).then(response => {
            let url = window.URL.createObjectURL(new Blob([response.data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            let num = '';
            for(let i = 0; i < 10; i++){
                num += Math.ceil(Math.random() * 10);
            }
            link.setAttribute('download', '电子合同数据_' + num + '.xlsx');
            document.body.appendChild(link)
            link.click()
          })
      },
    // 获取员工信息
    showUserInfo(id){
      getEmpInfo(id).then(res=>{
        if(res.data.code == 0){
          this.cEmpNo = res.data.data.number
          this.cDeptName = res.data.data.deptName
        }
      })
    },
    getAreaTree(){
        getAreaTree().then(res=>{
          let areaTree = res.data.data;        
          this.areaOptions=areaTree 
      }).catch(err=>{
        return err;
      });
    },
    getData() {
      getEmpList(true).then((res) => {
        this.empList = res.data.data;
      });
    },
    getContractsList() {
      var params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        keywords: this.contractsForm.keyWords,
        // contractStatus: this.contractsForm.contractStatus,
        categoryId: this.contractsForm.productType,
        startSignTime:this.contractsForm.signTime.length == 0? null: this.$moment(this.contractsForm.signTime[0]).format("YYYY-MM-DD HH:mm:ss"),
        endSignTime:this.contractsForm.signTime.length == 0? null: this.$moment(this.contractsForm.signTime[1]).format("YYYY-MM-DD HH:mm:ss"),
        clueSalesmanEmp:this.contractsForm.saleNo,
        orgAddress:this.contractsForm.region == null ? null :this.contractsForm.region.toString()
      };
      
      // 需要缓存的参数
      let keepParams = {
          contractStatus: this.contractsForm.contractStatus,
          keyWords: this.contractsForm.keyWords,
          saleNo: this.contractsForm.saleNo,
          region: this.contractsForm.region,
          productType: this.contractsForm.productType,
          signTime: this.contractsForm.signTime,
          detail: {path: "",query: {}}
      }
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams))
      getEleContracts(params).then((res) => {
        this.hasTapBtn = false;
        this.tableData = res.data.data.records;
        this.page.total = res.data.data.total;
        if (this.tableData.length == 0 && this.page.currentPage > 1) {
          this.page.currentPage = 1;
          this.getContractsList();
        }
      });
    },
    //合同下载
    download(row) {
      downloadLog(row.id).then((res) => {});
      window.open(row.signUrl, "_blank");
    },
    //重置
    reset() {
      this.$refs["contractsForm"].resetFields();
      this.contractsForm.productType = null;
      this.contractsForm.region = null;
      this.contractsForm.keyWords = null;
      this.contractsForm.saleNo = null;
      this.contractsForm.contractStatus = null;
      this.contractsForm.orderTime = [];
      this.contractsForm.signTime = [];
      this.contractsForm.cuBelongNo = [];
      this.contractsForm.clBelongNo = [];
      this.contractsForm.saleBelongNo = [];
      this.cuBelongNo = [];
      this.clBelongNo = [];
      this.saleBelongNo = [];
      this.getContractsList();
    },
    showDetail(row) {
        let path = "/contracts-detail"
        let query = {
            id: row.id,
            entrance:'electronic'
          }
        saveDetal(`${this.$route.path}`, path, query);
        this.$router.push({ path: path, query: query });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getContractsList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getContractsList();
    },
  },
};
</script>

<style scoped>
.text {
  overflow: hidden;
  white-space: nowrap;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.mar {
  margin-bottom:10px;
}
.spuName {
  display: flex;
  flex-direction: column;
}
.senior {
  margin: 10px 0px;
}
.radio-sty {
  margin-left: 20px;
}
.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}
.cell-blue {
  color: #36a6fe;
  cursor: pointer;
}
.list-btn {
  padding: 8px 20px;
  margin: 0 5px;
  border: 1px solid #eee;
  border-radius: 5px;
  cursor: pointer;
}
.activebtn {
  background: #36a6fe;
  border-radius: 5px;
  border: 0;
  color: #fff;
}
.circleBlue {
  width: 6px;
  height: 6px;
  float: left;
  border-radius: 50%;
  background: #36a6fe;
  margin-top: 4px;
  margin-right: 7px;
}
.circleBluec {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 7px;
}
.circleRed {
  background: red;
}
.circleRedc {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  margin-right: 7px;
  background: red;
}
.success {
  font-weight: bolder;
  font-size: 12px;
  float: left;
  color: green;
  margin-top: 2px;
  margin-right: 6px;
}
.successc {
  font-weight: bolder;
  font-size: 12px;
  color: green;
  margin-right: 6px;
}
::v-deep .el-range__close-icon {
  display: none;
}
.avue-crud__pagination {
  position: relative;
  text-align: center;
}
.contract-keyword {
  width: 370px;
}
.contract-order {
  margin: 0;
  max-height: 70px;
}
::v-deep i.el-input__icon.el-icon-date {
  position: absolute;
  right: 0;
}
.has-supplement{
  margin-left: 5px;
  padding: 0 2px;
  border-radius: 50%;
  background: #36a6fe;
  color: #FFFFFF;
}
</style>