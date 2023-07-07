<template>
<!-- 排查完成 -->
    <basic-container>
      <div v-if="permissions.sys_contract_paper_detail || permissions.sys_contract_paper_edit || permissions.sys_contract_paper_del">
      <el-form :model="contractsForm" ref="contractsForm" class="search" inline label-width="90" @keyup.enter.native="hasTapBtn = true, getContractsList()">
          <el-form-item prop="contractStatus">
            <el-radio-group size="medium" v-model="contractsForm.contractStatus" @change="chooseType">
                <el-radio-button :label=null>全部</el-radio-button>
                <el-radio-button class="radio-sty radio-sty-left" v-for="(item,index) in conStatusList" :key="index" :label="item.type">
                    <span v-show="item.type==-1" class="circleBlue circleOrange"></span>
                    <span v-show="item.type==0" class="circleBlue"></span>
                    <span v-show="item.type==1" class="success"><b>✔</b></span>
                    <span v-show="item.type==2" class="circleBlue circleRed"></span>
                    <span v-if="item.type==1">{{item.typeName}}</span>
                    <span v-else>
                      {{item.typeName}}({{item.typeNum}})
                    </span>
                </el-radio-button>
            </el-radio-group>                  
          </el-form-item>
          <el-button  type="primary" size="medium" icon="el-icon-plus" @click="permissions.sys_contract_paper_edit ? enteringConstract() : $notAuthorized()">录入合同</el-button>
          <div>  
            <el-form-item :label="$t('label.keywords')" prop="keyWords" >
              <el-input placeholder="客户名称/订单信息关键字/合同编号/订单编号/合同备注" class="contract-keyword" v-model.trim="contractsForm.keyWords"></el-input>
            </el-form-item>           
            <el-form-item label="业务员" prop="saleNo">
              <el-input v-model.trim="contractsForm.saleNo" placeholder="请输入业务员姓名或工号"></el-input>
            </el-form-item> 
          <el-form-item label="地区：" prop="region">
            <el-cascader
              :options="areaOptions"
              v-model="contractsForm.region"
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
          <el-form-item label="签约时间" prop="signTime">
            <el-date-picker style="width:350px" v-model="contractsForm.signTime"  type="datetimerange"  range-separator="~"
           format="yyyy-MM-dd HH:mm" :default-time="['00:00:00', '23:59:59']" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-button size="small" type="primary" @click="hasTapBtn = true, getContractsList()">搜索</el-button>
          <el-button size="small" type="warning" @click="hasTapBtn = true, reset()">重置</el-button>
          <el-button size="small" type="primary" @click="hasTapBtn = true, getExport()" v-if="permissions.sys_paper_contract_export">数据导出</el-button>
          </div>                 
        </el-form>
      <!-- 合同列表 -->
      <avue-crud ref="crud"
          class="batch-choose"
          :data="tableData"           
          :option="contractsOption"
          :page.sync="page"    
          @size-change="sizeChange"
          @current-change="currentChange"
          >
          <!-- 合同编号 -->
          <template slot="contractNo" slot-scope="scope">
            <span class="cell-blue" @click="showDetail(scope.row, scope.index)">{{scope.row.contractNo}}</span>
            <span class="has-supplement" v-if="scope.row.hasSupplementary">补</span>
          </template>
          <!-- 订单编号 -->
          <template slot="orderNo" slot-scope="scope">
            <span v-if="scope.row.orderNo!=null && Array.isArray(scope.row.orderNo)">
              <span v-for="(item,index) in scope.row.orderNo" :key="index">{{item}}<br></span>
            </span>
            <span v-else>{{scope.row.orderNo}}</span>
          </template>
          <!-- 订单信息 -->
          <template slot="orderInfo" slot-scope="scope">
            <span v-if="scope.row.orderInfo!=null && Array.isArray(scope.row.orderInfo)">
              <span v-for="(item,index) in scope.row.orderInfo" :key="index">{{item}}<br></span>
            </span>
            <span v-else>{{scope.row.orderInfo}}</span>
          </template>
          <!-- 合同金额 -->
          <template slot="totalAmount" slot-scope="scope">
            <span>{{scope.row.totalAmount | amount}}</span>
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
          <!-- 审核状态 -->
          <template slot="taskStatus" slot-scope="scope">
              <span v-show=" scope.row.taskStatus==null || scope.row.taskStatus == -1" class="circleBluec circleOrange"></span>
              <span v-show=" scope.row.taskStatus==0" class="circleBluec"></span>
              <span v-show=" scope.row.taskStatus==1" class="successc"><b>✔</b></span>
              <span v-show=" scope.row.taskStatus==2" class="circleRedc"></span>
              <span  >{{ scope.row.taskStatus | contractsStatus }} </span>
          </template>
          <template slot="menu" slot-scope="scope">
            <el-button type="text" @click="showDetail(scope.row)">{{$t('button.check')}}</el-button>      
            <el-button type="text" v-if="scope.row.taskStatus == 2" @click="permissions.sys_contract_paper_edit ? preview(scope.row) : $notAuthorized()">预览合同</el-button>      
            <el-button type="text" v-if="scope.row.taskStatus == null || scope.row.taskStatus == -1 || scope.row.taskStatus == 2" @click="permissions.sys_contract_paper_del ? del(scope.row) : $notAuthorized()">{{$t('button.delete')}}</el-button>                         
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
  import { filterArea } from "@/util/new-client/filter"
  import { getEmpInfo } from "@/api/project/wtClass"
  import { getEmpList,getAreaTree} from '@/api/clue/clue'
  import orderData from '@/components/member/order-data'
  import { getContractsStatus,
          getPaperContracts,
          deleteContract,
          dataExportPaper,
          dataExportPaperProgress
  } from '@/api/contracts/contracts'
  import { contractsOption } from '@/const/crud/contracts/contracts-manage'
  import { mapGetters } from "vuex";
  import { saveDetal } from "@/util/clearDetail";
  export default {   
    data() {
      return {
        hasTapBtn: false,
        page: {         
          currentPage: 1,
          total:0,
          layout: "total, sizes, prev, pager, next, jumper", 
          background: true ,
          pageSizes: [ 5, 8, 10, 20, 30, 40, 50, 100 ],//选择每页显示条数
          pageSize:20
        },
        empList: [],
        imgUrl:process.env.NODE_ENV == "production"?"//static.wotao.com/":"//static-tst.wotao.com/",          
        contractsOption:contractsOption,
        tableData:[],
        senior:false,
        conStatusList:[],
        areaOptions:[],
        contractsForm:{
          region:null,
          keyWords:null,
          productType:null,
          contractStatus:null,
          saleNo:null,
          cuBelongNo:[],
          clBelongNo:[],
          saleBelongNo:[],  
          signTime:[]         
        },
        cuBelongNo:[],
        clBelongNo:[],
        saleBelongNo:[],
        selectList:orderData.proTypeData,
        sourceList:[
          {
            label: 1,
            value: '前台下单'
          },
          {
            label: 0,
            value: '后台发起'
          },
        ],
        senior: false,
        cEmpNo:"",
        cDeptName:"",
        exportDialog: false,
        percent: 0
      }
    },
    computed: {
      ...mapGetters(['permissions','category'])
    },
    filters: {
      contractsStatus(val){
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
      amount(val){
         return val == 0 ? '待定' : Number(val).toFixed(2)
      },
      filterArea(val){ 
        return filterArea(val)
      },
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
    mounted(){
      console.log(this.permissions);
      if (!this.permissions.sys_contract_paper_detail && !this.permissions.sys_contract_paper_del && !this.permissions.sys_contract_paper_edit) this.$notAuthorized()
      this.getAreaTree();
      this.getData();
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
        dataExportPaperProgress().then((res) => {
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
          taskStatus: this.contractsForm.contractStatus,//审核状态
          keywords: this.contractsForm.keyWords,//关键字
          clueSalesmanEmp: this.contractsForm.saleNo,//业务员
          orgAddress: this.contractsForm.region == null ? null : this.contractsForm.region.toString(),//地区
          categoryId: this.contractsForm.productType,//订单类型
          startSignTime: this.contractsForm.signTime.length==0 ?null: this.$moment(this.contractsForm.signTime[0]).format("YYYY-MM-DD HH:mm:ss"),
          endSignTime: this.contractsForm.signTime.length==0 ?null: this.$moment(this.contractsForm.signTime[1]).format("YYYY-MM-DD HH:mm:ss"),
          pageNo: this.page.currentPage,
          pageSize: this.page.pageSize,
        }
        dataExportPaper(params).then(response => {
            let url = window.URL.createObjectURL(new Blob([response.data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            let num = '';
            for(let i = 0; i < 10; i++){
                num += Math.ceil(Math.random() * 10);
            }
            link.setAttribute('download', '纸质合同数据_' + num + '.xlsx');
            document.body.appendChild(link)
            link.click()
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
      // 字符串|符号处理
      filterStr(str){
        return str.replace('|',',')
      },
      // 录入合同
      enteringConstract(){
          let path = '/entering-contract'
          let query = {
            source: this.$store.state.common.source
          }
          saveDetal(`${this.$route.path}`, path, query);
          this.$router.push({ path: path, query: query }); 
      },
      // 初始化
      getData(){
        getEmpList(true).then(res=>{
          this.empList = res.data.data
        }) 
        // 获取审核状态列表
        getContractsStatus().then(res=>{ 
          this.conStatusList = res.data.data
        })  
      }, 
      // 获取纸质合同列表
      getContractsList(){
        var params = { 
          taskStatus: this.contractsForm.contractStatus,//审核状态
          keywords: this.contractsForm.keyWords,//关键字
          clueSalesmanEmp: this.contractsForm.saleNo,//业务员
          orgAddress: this.contractsForm.region == null ? null : this.contractsForm.region.toString(),//地区
          categoryId: this.contractsForm.productType,//订单类型
          startSignTime: this.contractsForm.signTime.length==0 ?null: this.$moment(this.contractsForm.signTime[0]).format("YYYY-MM-DD HH:mm:ss"),
          endSignTime: this.contractsForm.signTime.length==0 ?null: this.$moment(this.contractsForm.signTime[1]).format("YYYY-MM-DD HH:mm:ss"),
          pageNo: this.page.currentPage,
          pageSize: this.page.pageSize,
        }
        
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
        
        getPaperContracts(params).then(res => {
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
            if(this.tableData.length == 0 && this.page.currentPage > 1){
              this.page.currentPage = 1;
              this.getContractsList();
            };
          }
        })       
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
      //tab栏切换
      chooseType(){
        this.getContractsList()
      },
      //合同预览
      preview(row){
        // previewContract(row.signUrl).then(res=>{});
        window.open(this.imgUrl+row.signUrl, "_blank");
      },
      // 跳转合同详情
      showDetail(row){
        if(row.taskStatus == null||row.taskStatus==-1){
          let path = "/entering-contract"
          let query =  {
              source: 'list',
              id: row.id, 
              entrance:'paper'
            }
          saveDetal(`${this.$route.path}`, path, query);
          this.$router.push({ path: path, query: query });
        }else{
          let path = "/contracts-detail"
          let query = {
              source: 'list',
              id: row.id, 
              entrance:'paper'
            }
          saveDetal(`${this.$route.path}`, path, query);
          this.$router.push({ path: path, query: query });
        } 
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
                  this.getContractsList();
                  this.getData();
                },1000)
                }
              })         
          })
      },
      //重置
      reset() {
        this.$refs['contractsForm'].resetFields();
        this.contractsForm.region = null;
        this.contractsForm.productType = null;
        this.contractsForm.keyWords = null
        this.contractsForm.contractStatus = null
        this.contractsForm.saleNo = null
        this.contractsForm.signTime = []
        this.contractsForm.cuBelongNo = []
        this.contractsForm.clBelongNo = []
        this.contractsForm.saleBelongNo = []
        this.cuBelongNo=[];
        this.clBelongNo=[];
        this.saleBelongNo=[];
        this.getContractsList()
      },
      sizeChange(val){
        this.page.currentPage = 1
        this.page.pageSize = val
        this.getContractsList()
      },
      currentChange(val){
        this.page.currentPage = val
        this.getContractsList()
      },
    }
  }
</script>

<style scoped>
.text{
  overflow: hidden;
  white-space: nowrap;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
}

.orderMsg{
  display: flex;
  flex-direction: column;
}
.senior{
    margin: 10px 0px;
}
.search{
    margin: 25px 0px;
}
.radio-sty {  
  margin-left: 20px;
}
.radio-sty-left {   
  border-left: 1px solid #dcdfe6;
}
.cell-blue{
    color: #36A6FE;
    cursor: pointer;
}
.list-btn{
  padding: 8px 20px;
  margin: 0 5px;
  border: 1px solid #eee;
  border-radius: 5px;
  cursor: pointer;
}
.activebtn{
  background: #36A6FE;
  border-radius: 5px;
  border: 0;
  color: #fff;
}
.circleBlue{
  width:6px;
  height:6px;
  float:left;
  border-radius: 50%;
  background: #36A6FE;
  margin-top:4px;
  margin-right:7px;
}
.circleBluec{
  width:6px;
  height:6px;
  display:inline-block;
  border-radius: 50%;
  background: #36A6FE;
  margin-right:7px
}
.circleRed{
  background: red;
}
.circleOrange{
  background:orange;
}
.circleRedc{
  width:6px;
  height:6px;
  display:inline-block;
  border-radius: 50%;
  margin-right:7px;
  background: red;
}
.success{
    font-weight:bolder;
    font-size:12px;
    float:left;
    color:green;
    margin-top:2px;
    margin-right:6px;
}
.successc{
    font-weight:bolder;
    font-size:12px;
    color:green;
    margin-right:6px;
}
.pagination{
  float: right;
}
.contract-keyword{
  width: 350px
}
.contract-order{
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