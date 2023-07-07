<template>
<!-- 排查完成 -->
  <div>
    <el-form :model="supplementForm" inline>
      <el-form-item>
        <el-radio-group size="medium" v-model="supplementForm.contractSupplementaryStatus" @change="getSupplementList()">
            <el-radio-button :label=null>全部</el-radio-button>
            <el-radio-button class="radio-sty radio-sty-left" v-for="(item,index) in supplementStatusList" :key="index" :label="item.type">
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
        <el-button class="entry-supplement" type="primary" @click="entryAgreement()">录入补充协议</el-button>                 
        <el-button class="entry-supplement" type="primary" v-if="source == 'list'" @click="permissions.sys_contract_supplement_export ? exportData() : $notAuthorized()">数据导出</el-button>                 
      </el-form-item>
      <div>
        <el-form-item label="关键字">
          <el-input class="key-input" v-model="supplementForm.keywords" placeholder="客户名称/订单信息关键字/合同编号/订单编号/补充协议编号" />
        </el-form-item>
        <!-- 订单类型 -->
        <el-form-item label="订单类型：">
          <el-select v-model="supplementForm.orderType">
            <el-option v-for="(item,index) in selectList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务员：" v-if="source == 'list'">
          <el-input v-model="supplementForm.clueSalesmanEmpName"  placeholder=""/>
        </el-form-item>
        <el-form-item label="地区：" v-if="source == 'list'">
          <el-cascader
            :options="areaOptions"
            v-model.trim="supplementForm.orgAddress"
            :props="{value: 'id',label: 'areaName'}"
            placeholder="请选择地区"></el-cascader>
        </el-form-item>
        <!-- 创建时间 -->
        <el-form-item label="创建时间：" prop="createTime" width="80px">
          <el-date-picker
            style="width: 300px"
            v-model="supplementForm.createTime"
            type="datetimerange"
            range-separator="~"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-button size="small" type="primary" @click="getSupplementList()">搜索</el-button>
        <el-button size="small" type="warning" @click="resetForm()">重置</el-button>
      </div>
    </el-form>
      <avue-crud
        ref="crud"
        :data="supplementList"
        :option="supplementOption"
        :page.sync="page"
        @size-change="pageSizeChange"
        @current-change="currentChange"
      >
        <template slot="contractSupplementaryStatus" slot-scope="{row}">
          <span v-show="row.contractSupplementaryStatus == 0" class="circleBluec"></span>
          <span v-show="row.contractSupplementaryStatus == 1" class="successc"><b>✔</b></span>
          <span>{{ row.contractSupplementaryStatus | contractSupplementaryStatus }} </span>
        </template>
        <template slot="orgAddress" slot-scope="{row}">
          <p>{{row.orgAddress | filterArea}}</p>
        </template>
        <template slot="clueSalesmanEmpId" slot-scope="{row}">
          <el-tooltip effect="dark" :content="'工号：'+ empNo +' 部门：'+ deptName" placement="top">
            <span @mouseover="showUserInfo(row.clueSalesmanEmpId)">{{row.clueSalesmanEmpName}}</span>
          </el-tooltip>
        </template>
        <template slot="menu" slot-scope="{row}">
          <el-button type="text" @click="showDetail(row)">查看</el-button>
          <el-popconfirm
            :key="'b'+ Date.now()"
            confirm-button-text='确定'
            cancel-button-text='取消'
            icon="el-icon-info"
            icon-color="red"
            @confirm="permissions.sys_contract_supplement_del || source == 'personal' ? deleteContract(row) : $notAuthorized()"
            title="确定删除该条补充协议吗？"
          >
            <el-button type="text" slot="reference" class="del-supplement" v-if="row.contractSupplementaryStatus == -1 || row.contractSupplementaryStatus == 2 ">删除</el-button>
          </el-popconfirm>
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
</template>

<script>
import orderData from '@/components/member/order-data'
import { supplementOption } from '@/const/crud/contracts/supplement'
import { getPersonalSupplement, getListSupplement, getMysupplementStatus, getAllsupplementStatus, removePaperContract, exportExcel } from "@/api/supplement/index";
import { mapGetters } from "vuex";
import { filterArea } from "@/util/new-client/filter";
import { saveDetal } from "@/util/clearDetail";
import { getAreaTree, dataExportProgress } from "@/api/clue/clue";
export default {
  props:{
    source:{// 列表来源
      type: String
    }
  },
  data(){
    return {
      exportDialog: false,
      percent: 0,
      supplementForm: {
        contractSupplementaryStatus: null
      },
      selectList: orderData.orderTypeData,
      supplementList: [],
      supplementStatusList: [],
      areaOptions:[],
      supplementOption: supplementOption,
      page: {         
        currentPage: 1,
        total:0,
        layout: "total, sizes, prev, pager, next, jumper", 
        background: true ,
        pageSizes: [ 5, 8, 10, 20, 30, 40, 50, 100 ],//选择每页显示条数
        pageSize:20
      },
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters:{
    filterArea(val){ 
      return filterArea(val)
    },
    contractSupplementaryStatus(val){
      return val == -1 ? '草稿' : val == 0 ? '待审核' : val == 1 ? '已通过' : val == 2 ? '未通过' : '';
    }
  },
  mounted(){
    this.getSupplementList();
    this.getAreaTree();
  },
  methods:{
    exportData(){
      this.exportDialog = true
      this.export()
      let progress = null
      let timer = setInterval(() => {
        progress = this.getProgress()
        if(progress == 100){
          clearInterval(timer)
          this.exportDialog = false
        }
      }, 500)
    },
    // 获取进度
    getProgress(){
      let progress = null
      dataExportProgress().then((res) => {
        progress = res.data.data
      });
      if(progress == 1.0 || progress=='1.0' || progress == null){
        this.percent = 100
      }else{
        this.percent = Number(progress) * 100
      }
      return this.percent
    },
    export(){
      let param = {
        keywords: this.supplementForm.keywords,
        contractSupplementaryStatus: this.supplementForm.contractSupplementaryStatus,
        clueSalesmanEmpName: this.supplementForm.clueSalesmanEmpName,
      }
      if(this.supplementForm.orgAddress){
        param.orgAddress = this.supplementForm.orgAddress.join(',');
      }
      if(this.supplementForm.createTime){
        param.startTime = this.supplementForm.createTime[0];
        param.endTime = this.supplementForm.createTime[1];
      }
      if(this.supplementForm.orderType == 2){
        param.categoryIdList = [2,3,4,5,6]
      }else if(this.supplementForm.orderType != null){
        param.categoryIdList = [this.supplementForm.orderType]
      };
      exportExcel(param).then(res=>{
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let num = '';
        for(let i = 0; i < 10; i++){
          num += Math.ceil(Math.random() * 10);
        }
        link.setAttribute('download', '补充协议数据_' + num + '.xlsx');
        document.body.appendChild(link)
        link.click()
      })
    },
    getAreaTree(){
      getAreaTree().then(res=>{
        let areaTree = res.data.data;
        this.areaOptions = areaTree 
      }).catch(err=>{
        return err;
      });
    },
    deleteContract(row){
      removePaperContract({contractId: row.id}, this.source).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message:'补充协议删除成功！',
            duration: 1000
          })
          this.getSupplementList();
        }
      })
    },
    showDetail(row) {
      if( row.contractSupplementaryStatus == -1 ){
        var path = "/entry-supplementContract"
        var query = {
          id: row.id,
          source: this.source
        };
        saveDetal(`${this.$route.path}`, path, query);
        this.$router.push({ path: path, query: query });
      }else if(this.permissions.sys_contract_supplement_detail || this.source  == 'personal' ){
        var path = "/contracts-detail"
        var query = {
          id: row.id,
          entrance:'supplement',
          source: this.source
        };
        saveDetal(`${this.$route.path}`, path, query);
        this.$router.push({ path: path, query: query });
      }else{
        this.$notAuthorized();
      };
    },
    getSupplementList(){
      let param = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        keywords: this.supplementForm.keywords,
        contractSupplementaryStatus: this.supplementForm.contractSupplementaryStatus,
        clueSalesmanEmpName: this.supplementForm.clueSalesmanEmpName,
      }
      if(this.supplementForm.orgAddress){
        param.orgAddress = this.supplementForm.orgAddress.join(',');
      }
      if(this.supplementForm.createTime){
        param.startTime = this.supplementForm.createTime[0];
        param.endTime = this.supplementForm.createTime[1];
      }
      if(this.supplementForm.orderType == 2){
        param.categoryIdList = [2,3,4,5,6]
      }else if(this.supplementForm.orderType != null){
        param.categoryIdList = [this.supplementForm.orderType]
      };
      // 需要缓存的参数
      let keepParams = {
        contractSupplementaryStatus: this.supplementForm.contractSupplementaryStatus,
        keyWords: this.supplementForm.keyWords,
        orderType: this.supplementForm.orderType,
        createTime: this.supplementForm.createTime,
        activeName: 'third',
        detail: {path: "",query: {}}
      }
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams))
      if(this.source == 'personal'){
        getPersonalSupplement(param).then( res =>{
          if(res.data.code == CodeMsg.CODE_0){
            this.supplementList = res.data.data.records;
            this.page.total = res.data.data.total;
          }
        });
        getMysupplementStatus().then( res =>{
          if(res.data.code == CodeMsg.CODE_0){
            this.supplementStatusList = res.data.data;
          }
        })
      };
      if(this.source == 'list' && this.permissions.sys_contract_supplement_detail){
        getListSupplement(param).then( res =>{
          if(res.data.code == CodeMsg.CODE_0){
            this.supplementList = res.data.data.records;
            this.page.total = res.data.data.total;
          }
        });
        getAllsupplementStatus().then( res =>{
          if(res.data.code == CodeMsg.CODE_0){
            this.supplementStatusList = res.data.data;
          }
        })
      }else if(this.source == 'list'){
        this.$notAuthorized();
      }
    },
    entryAgreement(){
      this.$router.push({
        path:'/entry-supplementContract',
        query:{
          source: this.source
        }
      })
    },
    resetForm(){
      this.supplementForm = {};
      this.page.pageSize = 20;
      this.page.currentPage = 1;
      this.getSupplementList();
    },
    pageSizeChange(val){
      this.apge.pageSize = val;
      this.getSupplementList();
    },
    currentChange(val){
      this.page.currentPage = val;
      this.getSupplementList();
    },
  }
}
</script>

<style scoped> 
.key-input{
  width: 350px;
}
.entry-supplement{
  margin-left: 20px;
}
.radio-sty {  
  margin-left: 20px;
}
.radio-sty-left {   
  border-left: 1px solid #dcdfe6;
}
.del-supplement{
  margin-left: 10px;
  color: #f53d3d;
}
</style>