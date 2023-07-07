<!-- 排查完成 -->
<template>
  <basic-container>
    <div>
      <el-tabs v-model="activeName"  @tab-click="handleClick">
        <el-tab-pane label="纸质合同" name="first">
          <el-form
            :model="contractsForm"
            ref="contractsForm"
            class="search"
            inline
            label-width="90"
            @keyup.enter.native="(hasTapBtn = true), getContractsList()"
          >
            <el-form-item prop="contractStatus">
              <el-radio-group size="medium" v-model="contractsForm.contractStatus" @change="getContractsList()">
                <el-radio-button :label=null>全部</el-radio-button>
                <el-radio-button class="radio-sty radio-sty-left" v-for="(item,index) in conStatusList" :key="index" :label="item.type">
                    <span v-show="item.type==-1" class="circleBlue circleOrange"></span>
                    <span v-show="item.type==0" class="circleBlue"></span>
                    <span v-show="item.type==1" class="success"><b>✔</b></span>
                    <span v-show="item.type==2" class="circleBlue circleRed"></span>
                    <span v-if="item.type==1">{{item.typeName}}</span>
                    <span v-else>{{item.typeName}}({{item.typeNum}})</span>
                </el-radio-button>
              </el-radio-group>  
            </el-form-item>
            <el-button
              size="medium"
              type="primary"
              icon="el-icon-plus"
              @click="enteringConstract()"
              >录入合同</el-button
            >
            <div>
              <el-form-item :label="$t('label.keywords')" prop="keyWords">
                <el-input
                  placeholder="客户名称/订单信息关键字/合同编号/订单编号/合同备注"
                  class="contract-keyword"
                  v-model.trim="contractsForm.keyWords"
                ></el-input>
              </el-form-item>
              <el-form-item label="订单类型：">
                <el-select v-model="contractsForm.productType">
                  <el-option label="全部" :value="null"></el-option>
                  <el-option v-for="(item,index) in selectList" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <!-- 签约时间 -->
              <el-form-item
                :label="$t('label.signTime')"
                prop="signTime"
                width="50px"
              >
                <el-date-picker
                  style="width: 340px"
                  v-model="contractsForm.signTime"
                  type="datetimerange"
                  range-separator="~"
                  format="yyyy-MM-dd HH:mm"
                  :default-time="['00:00:00', '23:59:59']"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-button
                size="small"
                type="primary"
                @click="(hasTapBtn = true), getContractsList()"
                >搜索</el-button
              >
              <el-button
                size="small"
                type="warning"
                @click="(hasTapBtn = true), reset()"
                >重置</el-button
              >
            </div>
          </el-form>
          <!-- 纸质合同列表 -->
          <avue-crud  
            ref="crud"
            class="batch-choose pad"
            :data="tableData"
            :option="contractsOption"
            :page.sync="page"
            @size-change="sizeChange"
            @current-change="currentChange"
          >
          <!-- 合同编号 -->
            <template slot="contractNo" slot-scope="scope">
              <span @click="showDetail(scope.row,)" class="cell-blue">{{scope.row.contractNo}}</span>
              <span class="has-supplement" v-if="scope.row.hasSupplementary">补</span>
            </template>
            <!-- 订单编号 -->
            <template slot="orderNo" slot-scope="scope">
              <div class="contract-order" v-if="scope.row.orderNo!=null && Array.isArray(scope.row.orderNo)">
                <span  v-for="(item,index) in scope.row.orderNo" :key="index">{{item}}<br></span>
              </div>
              <div  class="contract-order" v-else>{{scope.row.orderNo}}</div>
            </template>
             <!-- 订单信息 -->
            <template slot="orderInfo" slot-scope="scope">
              <div class="contract-order" v-if="scope.row.orderInfo!=null && Array.isArray(scope.row.orderInfo)">
                <span  v-for="(item,index) in scope.row.orderInfo" :key="index">{{item}}<br></span>
              </div>
              <div  class="contract-order" v-else>{{scope.row.orderInfo}}</div>
            </template>
            <!-- 地区 -->
            <template slot="orgAddress" slot-scope="scope">
              <span>{{ scope.row.orgAddress | filterArea}} </span>
            </template>
            <!-- 合同金额 -->
            <template slot="totalAmount" slot-scope="scope">
              <span>{{scope.row.totalAmount | amount}}</span>
            </template>
            <!-- 审核状态 -->
            <template slot="taskStatus" slot-scope="scope">
              <span v-show=" scope.row.taskStatus==null || scope.row.taskStatus == -1" class="circleBluec circleOrange"></span>
              <span v-show=" scope.row.taskStatus==0" class="circleBluec"></span>
              <span v-show=" scope.row.taskStatus==1" class="successc"><b>✔</b></span>
              <span v-show=" scope.row.taskStatus==2" class="circleRedc"></span>
              <span>{{ scope.row.taskStatus | contractsStatus }} </span>
            </template>
            <!-- 操作 -->
            <template slot="menu" slot-scope="scope">
            <el-button type="text" @click="showDetail(scope.row)">{{$t('button.check')}}</el-button>      
            <el-button type="text" v-if="scope.row.taskStatus == 2" @click="download(scope.row)">预览合同</el-button>      
            <el-button type="text" v-if="(scope.row.taskStatus == null || scope.row.taskStatus == -1 || scope.row.taskStatus == 2) " @click="del(scope.row)">{{$t('button.delete')}}</el-button>                         
            </template>
          </avue-crud>
        </el-tab-pane>
        <!-- 电子合同列表 -->
        <el-tab-pane label="电子合同" name="second">
          <div class="pad">
            <el-form
              :model="elecontractsForm"
              ref="elecontractsForm"
              class="search"
              inline
              label-width="90"
              @keyup.enter.native="(hasTapBtn = true), eleContractsList()"
            >
              <el-form-item prop="contractStatus">
                <el-radio-group
                  size="medium"
                  v-model="elecontractsForm.contractStatus"
                  @change="eleContractsList()">
                  <el-radio-button
                    class="radio-sty"
                    :class="{ 'radio-sty-left': index }"
                    v-for="(item, index) in eleStatusList"
                    :key="index"
                    :label="item.label">
                    <!-- 合同状态-->
                    <span v-show="index == 1" class="success"><b>✔</b></span>
                    <span>{{item.value}}</span>
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
                      v-model.trim="elecontractsForm.keyWords"
                    ></el-input>
                  </el-form-item>
                  <!-- 订单类型 -->
                  <el-form-item label="订单类型：">
                    <el-select v-model="elecontractsForm.productType">
                      <el-option label="全部" :value="null"></el-option>
                      <el-option v-for="(item,index) in selectList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- 签约时间 -->
                  <el-form-item label="签约时间：" prop="signTime" width="80px">
                    <el-date-picker
                      style="width: 300px"
                      v-model="elecontractsForm.signTime"
                      type="datetimerange"
                      range-separator="~"
                      format="yyyy-MM-dd HH:mm"
                      :default-time="['00:00:00', '23:59:59']"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    ></el-date-picker>
                  </el-form-item>
                  <el-button
                    size="small"
                    type="primary"
                    @click="(hasTapBtn = true), eleContractsList()"
                    >搜索</el-button
                  >
                  <el-button
                    size="small"
                    type="warning"
                    @click="(hasTapBtn = true), reset()"
                    >重置</el-button
                  >
                </div>
              </div>
            </el-form>
            <!-- 电子合同列表 -->
            <avue-crud
              ref="crud"
              class="batch-choose"
              :data="electricData"
              :option="electronicOption"
              :page.sync="elepage"
              @size-change="elesizeChange"
              @current-change="elecurrentChange"
            >
            <!-- 合同编号 -->
              <template slot="contractNo" slot-scope="scope">
                <span @click="showEcoDetail(scope.row)" class="cell-blue">{{scope.row.contractNo}}</span>
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
              <!-- 合同金额 -->
              <template slot="totalAmount" slot-scope="scope">
                <span>{{ scope.row.totalAmount | amount}} </span>
              </template>
              <!-- 审核状态 -->
              <template slot="contractStatus" slot-scope="scope">
                <span v-show="scope.row.contractStatus == 0" class="circleBluec"></span>
                <span v-show="scope.row.contractStatus == 2" class="successc"><b>✔</b></span>
                <span>{{ scope.row.contractStatus | elecontractsStatus }} </span>
              </template>
              <template slot="menu" slot-scope="scope">
                <el-button type="text" @click="showEcoDetail(scope.row)">{{
                  $t("button.check")
                }}</el-button>
                <el-button
                  type="text"
                  v-if="scope.row.contractStatus == 2"
                  @click="download(scope.row)"
                  >预览合同</el-button>
                <!-- <el-button type="text"
                  v-if="(scope.row.loginEmpNo == scope.row.saleBelongNo && scope.row.contractStatus == 2) || scope.row.contractStatus == 0 " 
                  @click="del(scope.row)" >删除</el-button > -->
              </template>
            </avue-crud>
          </div>
        </el-tab-pane>
        <el-tab-pane label="补充协议" name="third">
          <supplement-contracts ref="supplement" :source="'personal'" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </basic-container>
</template>

<script>
import supplementContracts from "@/components/contracts/supplement-contracts";
import { getEmpList } from "@/api/clue/clue";
import { filterArea } from "@/util/new-client/filter"
import { saveDetal } from "@/util/clearDetail";
import {
  getMyPaperContracts,
  getMyEleContracts,
  getMyContractsStatus,
  downloadLog,
} from "@/api/personal/mycontracts";
import { deleteContract} from '@/api/contracts/contracts'
import { contractsOption } from "@/const/crud/personal/contracts";
import { electronicOption } from "@/const/crud/contracts/my-electronic";
import orderData from '@/components/member/order-data'

export default {
  components:{
    supplementContracts
  },
  data() {
    return {
      loginEmpNo:null,//当前登录人id
      loginEmpName:null,//当前登录人id
      hasTapBtn: false,
      activeName: "first",
      page: {
        currentPage: 1,
        total: 0,
        layout: "total, sizes, prev, pager, next, jumper",
        background: true,
        pageSizes: [5, 8, 10, 20, 30, 40, 50, 100], //选择每页显示条数
        pageSize: 20,
      },
      elepage: {
        currentPage: 1,
        total: 0,
        layout: "total, sizes, prev, pager, next, jumper",
        background: true,
        pageSizes: [5, 8, 10, 20, 30, 40, 50, 100], //选择每页显示条数
        pageSize: 20,
      },
      imgUrl:
        process.env.NODE_ENV == "production"
          ? "//static.wotao.com/"
          : "//static-tst.wotao.com/",
      empList: [],
      contractsOption: contractsOption,
      electronicOption: electronicOption,
      tableData: [],
      electricData: [],
      conStatusList: [],
      eleStatusList: [
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
        keyWords: "",
        productType: null,
        contractSource: "",
        contractStatus: null,
        signTime: [],
      },
      elecontractsForm: {
        keyWords: "",
        productType: null,
        contractSource: "",
        contractStatus: null,
        signTime: [],
      },
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
    };
  },
  computed: {},
  filters: {
    contractsStatus(val){
      if(val==-1||val==null){
        return "草稿"
      }else if(val==0){
        return "待审核"
      }else if(val==1){
        return "已通过"
      }else if(val==2){
        return "未通过"
      }
    },
    elecontractsStatus(val) {
      if (val === 0) {
        return "待签约";
      } else if (val == 2) {
        return "已签约";
      } 
    },
   orderType(val) {
      if (val === 1) {
        return "项目申报";
      } else if (val == 0) {
        return "知识产权";
      }
    },
    categoryId(val) {
      if (val === 1) {
        return "项目申报";
      } else if (val == 0) {
        return "知识产权";
      }
    },
    contractSource(val) {
      if (val === 1) {
        return "前台下单";
      } else if (val == 0) {
        return "后台发起";
      }
    },
    amount(val){
      if(!isNaN(Number(val)) && val!=null){
        return Number(val).toFixed(2)
      }
    },
    filterArea(val){ 
      return filterArea(val)
    }
  },
  created() {
    if(sessionStorage.getItem(`${this.$route.path}`)){
      let keepParams = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
      if(keepParams.detail.path !== "" && (keepParams.detail.path != '/entry-supplementContract' || sessionStorage.getItem('/entry-supplementContract'))){
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query
        });
        return;
      }
      this.activeName = keepParams.activeName
      if(keepParams.activeName == 'first'){
        this.contractsForm.contractStatus = keepParams.contractStatus
        this.contractsForm.keyWords = keepParams.keyWords
        this.contractsForm.productType = keepParams.productType
        this.contractsForm.signTime = keepParams.signTime
      }else{
        this.elecontractsForm.contractStatus = keepParams.contractStatus
        this.elecontractsForm.keyWords = keepParams.keyWords
        this.elecontractsForm.productType = keepParams.productType
        this.elecontractsForm.signTime = keepParams.signTime
      }
     
    }
  },
  mounted() {
    this.loginEmpNo = JSON.parse(sessionStorage.getItem('pigx-userInfo')).content.id
    this.loginEmpName = JSON.parse(sessionStorage.getItem('pigx-userInfo')).content.name
    this.getData();
    this.getContractsList();
    this.eleContractsList();
    
  },
  methods: {
    // 字符串|符号处理
    filterStr(str){
      return str.replace('|',',')
    },
    handleClick(tab, event) {
      if(tab.index == 0){
        this.getContractsList();
      }else if(tab.index == 1){
        this.eleContractsList();
      }else if(tab.index == 2){
        this.$refs.supplement.getSupplementList();
      }
    },
    enteringConstract(row) {
      let path =  '/entering-contract'
      let query = {
        source: 'personal'
      }
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query});
    },
    getData() {
      getEmpList(true).then((res) => {
        this.empList = res.data.data;
      });
      getMyContractsStatus().then((res) => {
        this.conStatusList = res.data.data;
      });
    },
    //获取纸质合同列表
    getContractsList() { 
      var params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        keywords: this.contractsForm.keyWords,
        taskStatus:this.contractsForm.contractStatus,
        categoryId: this.contractsForm.productType,
        startSignTime: this.contractsForm.signTime.length == 0 ? null: this.$moment(this.contractsForm.signTime[0]).format("YYYY-MM-DD HH:mm:ss"),
        endSignTime: this.contractsForm.signTime.length == 0 ? null: this.$moment(this.contractsForm.signTime[1]).format("YYYY-MM-DD HH:mm:ss"),
      };
      // 需要缓存的参数
      let keepParams = {
        contractStatus: this.contractsForm.contractStatus,
        keyWords: this.contractsForm.keyWords,
        productType: this.contractsForm.productType,
        signTime: this.contractsForm.signTime,
        activeName: this.activeName,
        detail: {path: "",query: {}}
      }
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams))
      getMyPaperContracts(params).then((res) => {
        if(res.data.code == 0){
          this.hasTapBtn = false;
          res.data.data.records.forEach(item => {
            if(item.orderNo != null && item.orderNo.includes('|')){
              this.$set(item,'orderNo',item.orderNo.split('|'))
              this.$set(item,'orderInfo',item.orderInfo.split('|'))
            }
          })
          this.tableData = res.data.data.records;
          this.page.total = res.data.data.total;
          if (this.tableData.length == 0 && this.page.currentPage > 1) {
            this.page.currentPage = 1;
            this.getContractsList();
          }
        }
      });
    },
    // 获取电子合同列表
    eleContractsList() {
      var params = {
        pageNo: this.elepage.currentPage,
        pageSize: this.elepage.pageSize,
        keywords: this.elecontractsForm.keyWords,
        categoryId: this.elecontractsForm.productType,
        startSignTime: this.elecontractsForm.signTime.length == 0? null: this.$moment(this.elecontractsForm.signTime[0]).format("YYYY-MM-DD HH:mm:ss"),
        endSignTime: this.elecontractsForm.signTime.length == 0? null: this.$moment(this.elecontractsForm.signTime[1]).format("YYYY-MM-DD HH:mm:ss"),
      };
      // 需要缓存的参数
      let keepParams = {
        contractStatus: this.elecontractsForm.contractStatus,
        keyWords: this.elecontractsForm.keyWords,
        productType: this.elecontractsForm.productType,
        signTime: this.elecontractsForm.signTime,
        activeName: this.activeName,
        detail: {path: "",query: {}}
      }
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams))
      getMyEleContracts(params).then((res) => {
        if(res.data.code == 0){
          this.hasTapBtn = false;
          this.electricData = res.data.data.records;
          this.elepage.total = res.data.data.total;
          if (this.electricData.length == 0 && this.elepage.currentPage > 1) {
            this.elepage.currentPage = 1;
            this.eleContractsList();
          }
        }
      });
    },
    //合同下载
    download(row) {
      downloadLog(row.id).then((res) => {});
      if(this.activeName=='first'){
        window.open(this.imgUrl + row.signUrl, "_blank");
      }else if(this.activeName == 'second'){
        window.open(row.signUrl, "_blank");
      }
    },
    //重置
    reset() {
      if(this.activeName=='first'){
        this.contractsForm.contractSource = null;
        this.contractsForm.productType = null;
        this.contractsForm.keyWords = null;
        this.contractsForm.contractStatus = null;
        this.contractsForm.signTime = [];
        this.getContractsList();
      }else if(this.activeName=='second'){
        this.elecontractsForm.contractSource = null;
        this.elecontractsForm.productType = null;
        this.elecontractsForm.keyWords = null;
        this.elecontractsForm.contractStatus = null;
        this.elecontractsForm.signTime = [];
        this.eleContractsList();
      }
    },
    // 纸质合同详情
    showDetail(row) {
      if(row.taskStatus == null||row.taskStatus==-1){
        let path = "/entering-contract"
        let query = {
            id: row.id, 
            entrance:'paper',
            source: 'personal'
          }
        saveDetal(`${this.$route.path}`, path, query);
        this.$router.push({ path: path, query: query });
      }else{
        let path = "/contracts-detail"
        let query = {
            id: row.id, 
            entrance:'paper',
            source: 'personal'
        }
        saveDetal(`${this.$route.path}`, path, query);
        this.$router.push({ path: path, query: query });
      }
    },
    // 电子合同详情
    showEcoDetail(row) {
      let path = "/contracts-detail"
      let query = {
        id: row.id, 
        entrance:'electronic',
        source: 'personal'
      }
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
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
            if(res.data.code == 0){
              this.$message({
              type: 'success',
              message: '删除成功!'
              });
              setTimeout( ()=>{
                this.getContractsList();
                this.getData();
              },1000)
              }
            })         
        })
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getContractsList();
    },

    elesizeChange(val) {
      this.elepage.currentPage = 1;
      this.elepage.pageSize = val;
      this.eleContractsList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getContractsList();
    },
    elecurrentChange(val) {
      this.elepage.currentPage = val;
      this.eleContractsList();
    },
  },
};
</script>

<style scoped>
.wat {
  width: 1080px;
  z-index: 1000;
  font-family: "微软雅黑";
  color: rgba(0, 0, 0, 0.1);
  font-size: 100px;
  margin: 0 auto;
}
.pad {
  padding-right:5px ;
}
.watword {
  text-align: center;
  transform: rotate(-40deg);
}
.text {
  overflow: hidden;
  white-space: nowrap;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.spuName {
  display: flex;
  flex-direction: column;
}
.orangeName {
  color: #e6a23c;
}
.senior {
  margin: 10px 0px;
}
.search {
  margin: 25px 0px;
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
.circleOrange {
  background-color: orange;
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
.pagination {
  float: right;
}
.contract-keyword {
  width: 350px;
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