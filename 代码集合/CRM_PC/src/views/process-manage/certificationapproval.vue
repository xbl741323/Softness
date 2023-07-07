<template>
  <basic-container>
    <div class="certification" v-if="permissions.sys_auth_detail || permissions.sys_auth_audit || this.$route.path.includes('personal')">
      <el-form :model="processlistForm" ref="processlistForm" class="search" inline label-width="90" @keyup.enter.native="handleSearch">
          <div>
            <el-form-item label="认证类型：">
                <el-radio-group size="medium" v-model="processlistForm.type" @change="getprocessList()">
                    <el-radio-button class="state-right" label="1">单位认证
                    </el-radio-button> 
                    <el-radio-button class="state-right radio-sty-left" label="0">个人认证</el-radio-button>
                </el-radio-group>
            </el-form-item>
         </div>
         <div>
            <el-form-item label="流程状态：">
                <el-radio-group @change="getprocessList()" size="medium" v-model="processlistForm.auditStatus">
                    <el-radio-button class="state-right" :class="{ 'radio-sty-left': index != 0 }" v-for="(item, index) in stateList" :key="index" :label="item.auditStatus">
                        <span v-show="item.auditStatus ==3 && processlistForm.type == 1" class="circleBlue"></span>
                        <span v-show="item.auditStatus ==2" class="success"><b>✔</b></span>
                        <span v-show="item.auditStatus ==4" class="circleBlue circleRed"></span>
                        <span>{{ item.label }}</span>
                        <span v-if="status1&&status1>0&&item.auditStatus ==1">({{status1}})</span>
                        <span v-if="status2&&status2>0&&item.auditStatus ==2">({{status2}})</span>
                        <span v-if="status3&&status3>0&&item.auditStatus ==3">({{status3}})</span>
                        <span v-if="status4&&status4>0&&item.auditStatus ==4">({{status4}})</span>
                        <span v-if="status5&&status5>0&&item.auditStatus ==5">({{status5}})</span>
                    </el-radio-button>
                </el-radio-group>
            </el-form-item>
         </div>
         <div>
            <el-form-item label="关键字：">
                <el-input v-model.trim="processlistForm.keyword" style="width: 280px" :placeholder="processlistForm.type == 1?'流程编号/主体ID、授权人手机号或单位名称/授权人姓名关键字':'请输入流程编号/主体ID或用户姓名关键字'" class="keyword"></el-input>
            </el-form-item>
            <el-form-item label="认证方式：" v-if="processlistForm.type == 1">
                <el-select v-model="processlistForm.verifyType">
                    <el-option label="全部" :value="null"></el-option>
                    <el-option label="对公打款" value="1"></el-option>
                    <el-option label="纸质审核" value="2"></el-option>
                    <el-option label="法人身份（授权）认证" value="3"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="认证来源：">
                <el-select v-model="processlistForm.authSource">
                    <el-option label="全部" :value="null"></el-option>
                    <el-option label="PC端" value="1"></el-option>
                    <el-option label="移动端" value="3"></el-option>
                    <el-option label="小程序" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-button size="small" type="primary" @click="handleSearch()">搜索</el-button>
            <el-button size="small" type="warning" @click="reset('processlistForm')" >重置</el-button>
         </div>
      </el-form>
      <!-- 单位列表 -->
      <div v-show="processlistForm.type == 1">
        <avue-crud v-if="processlistForm.type == 1"  class="batch-choose" :data="tableData" :option="companyOption" :page.sync="page" @on-load="getprocessList" @size-change="sizeChange" @current-change="currentChange">
            <template slot="mobile" slot-scope="scope">
              <span> {{ scope.row.personName }}</span>
              <span> {{ scope.row.mobile }}</span>
            </template>
            <template slot="legalMobile" slot-scope="scope">
              <div v-if="scope.row.personName == scope.row.legalName">
                <span> {{ scope.row.legalName }}</span>
                <span> {{ scope.row.legalMobile ? scope.row.legalMobile : scope.row.mobile }}</span>
              </div>
              <div v-else>
                <span> {{ scope.row.legalName }}</span>
              </div>
            </template>
            <template slot="verifyType" slot-scope="scope">
              <span> {{ scope.row.verifyType | filterVerifyType }}</span>
            </template>
            <template slot="autClient" slot-scope="scope">
              <span> {{ scope.row.autClient | filterAutClient }}</span>
            </template>
            <template slot="status" slot-scope="scope">
              <span v-show="scope.row.status == 2" class="successc"><b>✔</b></span>
              <span v-show="scope.row.status == 3" class="circleBluec"></span>
              <span v-show="scope.row.status == 4" class="circleRedc"></span>
              <el-tooltip class="item" effect="dark" :content="scope.row.auditFailReason"   placement="top" v-if="scope.row.status == 4">
                <span>{{ scope.row.status | filterStatus }} </span>
              </el-tooltip>
              <span v-else>{{ scope.row.status | filterStatus }} </span>
            </template>
        </avue-crud>
      </div>
      <!-- 个人列表 -->
      <div v-show="processlistForm.type == 0">
        <avue-crud v-if="processlistForm.type == 0"  class="batch-choose" :data="tableData" :option="personOption" :page.sync="page" @on-load="getprocessList" @size-change="sizeChange" @current-change="currentChange">
            <template slot="flowNo" slot-scope="scope">
              <span style="cursor: pointer;color: #409EFF;" > {{ scope.row.flowNo }}</span>
            </template>
            <template slot="autClient" slot-scope="scope">
              <span> {{ scope.row.autClient | filterAutClient }}</span>
            </template>
            <template slot="status" slot-scope="scope">
              <span v-show="scope.row.status == 2" class="successc"><b>✔</b></span>
              <span v-show="scope.row.status == 3" class="circleBluec"></span>
              <span v-show="scope.row.status == 4" class="circleRedc"></span>
              <el-tooltip class="item" effect="dark" :content="scope.row.auditFailReason"   placement="top" v-if="scope.row.status == 4">
                <span>{{ scope.row.status | filterStatus }} </span>
              </el-tooltip>
              <span v-else>{{ scope.row.status | filterStatus }} </span>
            </template>
        </avue-crud>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { getList,authCrecord,authPrecord,getPersonList } from "@/api/processmanage/approval";
import { getEmpList } from "@/api/clue/clue";
import { companyOption } from "@/const/crud/processmanage/company";
import { personOption } from "@/const/crud/processmanage/person";
import { saveDetal } from "@/util/clearDetail";  
import { mapGetters } from 'vuex';

export default {
  props:{
    refundFrom:{//我的流程有值 否则无值
      type: String,
      default:null,
    },
  },
  data() {
    return {
      sponsorList: [],  
      isResouceShow: 0,
      person:[],  
      cStateList: [
        {auditStatus:null,label:'全部'},
        {auditStatus:1,label:'待认证'},
        {auditStatus:3,label:'待审核'},
        {auditStatus:4,label:'未通过'},
        {auditStatus:2,label:'已通过'},
        {auditStatus:5,label:'已作废'},
      ],
      pStateList: [
        {auditStatus:null,label:'全部'},
        {auditStatus:1,label:'待认证'},
        {auditStatus:4,label:'未通过'},
        {auditStatus:2,label:'已通过'},
        {auditStatus:5,label:'已作废'},
      ],
      cCount:{},
      pCount:{},
      page: {
        currentPage: 1,
        total: 0,
        layout: "total, sizes, prev, pager, next, jumper",
        background: true,
        pageSizes: [5, 8, 10, 20, 30, 40, 50, 100], //选择每页显示条数
        pageSize: 20,
      },
      companyOption: companyOption,
      personOption:personOption,
      tableData: [],
      processlistForm: {
        type: 1,
        auditStatus: null,
        verifyType: null,
        authSource: null,
        keyword: "", 
      },
      sponsorNo:''
    };
  },
  filters: {
    filterVerifyType(val){
      if(val==1){
        return '对公打款'
      } else if(val==2){
        return '纸质审核'
      } else if(val==3){
        return '法人身份（授权）认证'
      }
    },
    filterAutClient(value){
      return value == '1' ? 'PC端' : value == '2' ? '小程序' : value == '3' ? '移动端' : ''
    },
    filterStatus(value){
      return value == '1' ? '待认证' : value == '2' ? '已通过' : value == '3' ? '待审核' : value== '4' ? '未通过' :  value== '5' ? '已作废' : ''
    }
  },
  created() {
    if (!this.permissions.sys_auth_detail && !this.permissions.sys_auth_audit && !this.$route.path.includes('personal')) this.$notAuthorized()
    if(sessionStorage.getItem(`${this.$route.path}`)){
        let keepParams =JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
        if(keepParams.detail.path!==''){
            this.$router.push({
              path: keepParams.detail.path,
              query: keepParams.detail.query
            })
           return
        }
      this.processlistForm = keepParams.params
      this.page = keepParams.page
    };
  },
  mounted() {
    this.getData();
  },
  computed:{
    stateList(){
      if(this.processlistForm.type == 0) return this.pStateList;
      if(this.processlistForm.type == 1) return this.cStateList;
    },
    status1() {
      if(this.processlistForm.type == 0) return this.pCount.status1;
      if(this.processlistForm.type == 1) return this.cCount.status1;
    },
    status2() {
      if(this.processlistForm.type == 0) return this.pCount.status2;
      if(this.processlistForm.type == 1) return this.cCount.status2;
    },
    status3() {
      if(this.processlistForm.type == 0) return this.pCount.status3;
      if(this.processlistForm.type == 1) return this.cCount.status3;
    },
    status4() {
      if(this.processlistForm.type == 0) return this.pCount.status4;
      if(this.processlistForm.type == 1) return this.cCount.status4;
    },
    status5() {
      if(this.processlistForm.type == 0) return this.pCount.status5;
      if(this.processlistForm.type == 1) return this.cCount.status5;
    },
    ...mapGetters(['permissions'])
  },
  methods: {
    getData() {
         // 组织架构
      getEmpList(true).then((res) => {
        let data = res.data.data;
        this.sponsorList = data;
        this.pendpersonList = data;
      });
      if(this.refundFrom){
        this.processlistForm.auditStatus = 0;
      }
    },
    //获取列表
    getprocessList() {
      this.getCount()
       if(sessionStorage.getItem(`${this.$route.path}special`)){
           var realform = JSON.parse(sessionStorage.getItem(`${this.$route.path}special`))
        }  
         let params = {
            type: this.processlistForm.type,
            auditStatus: this.processlistForm.auditStatus,
            keyword:realform?realform.keyword:this.processlistForm.keyword,
            verifyType: realform&&realform.verifyType!=null?realform.verifyType:this.processlistForm.verifyType,
            authSource: realform&&realform.authSource!=null?realform.authSource:this.processlistForm.authSource
        };  
      let keepParams = {   
         params:this.processlistForm,
         page:this.page,  
         detail:{
          path:'',
          query:{}
         }
       } 
      //保存页面信息
      sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
      let para = {
          keyword: this.processlistForm.keyword,
          autClient: this.processlistForm.authSource,
          status: this.processlistForm.auditStatus,
          current: this.page.currentPage,
          size: this.page.pageSize
        }
      if(this.processlistForm.type == 0) {
        getPersonList(para).then(res=>{
          this.tableData = res.data.data.records;
          this.page.total = res.data.data.total;
        })
      } else {
        this.$set(para,'verifyType', this.processlistForm.verifyType);
        getList(para).then((res) => {
          this.tableData = res.data.data.records;
          this.page.total = res.data.data.total;
        });     
      }
    },
    //获取状态数量
    getCount(){
      authCrecord().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.cCount = res.data.data
        }
      })
      authPrecord().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.pCount = res.data.data
        }
      })
    },
    //重置
    reset() {
    //   this.$refs[formName].resetFields();
      // this.processlistForm.type = '1';
      this.processlistForm.auditStatus = null
      this.processlistForm.authSource = null
      this.processlistForm.verifyType = null
      this.processlistForm.keyword = null 
      if(sessionStorage.getItem(`${this.$route.path}special`)){
         sessionStorage.removeItem(`${this.$route.path}special`)
      }
      this.getprocessList();
    },
    handleSearch(){
       sessionStorage.setItem(`${this.$route.path}special`,JSON.stringify(this.processlistForm))
       this.getprocessList();
    },
    // 查看详情
    showDetail(row) {
      saveDetal(`${this.$route.path}`,"/certificationapproval-company",{ taskNo: row.taskNo})
      this.$router.push({
        path: "/certificationapproval-company",
        query: {
          taskNo: row.taskNo,
          time: Date.now(),
          source: this.$route.path.includes('personal') ? 'personal' : 'certificationapproval',
        },
      });
    },
    showpersonDetail(row) {
      saveDetal(`${this.$route.path}`,"/certificationapproval-person",{ taskNo: row.taskNo})
      this.$router.push({
        path: "/certificationapproval-person",
        query: {
          taskNo: row.taskNo,
          time: Date.now(),
          source: this.$route.path.includes('personal') ? 'personal' : 'certificationapproval',
        },
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
    },
    currentChange(val) {
      this.page.currentPage = val;
    },
    sponsorChange(val) {
      ++this.isResouceShow;
      this.$nextTick(() => {
        this.sponsorNo = this.$refs["sponsorDom"].getCheckedNodes()[0].data.customerId;
      });
    },
  },
};
</script>

<style scoped>
.redmis{
    display: inline-block;
    width: 20px;
    height: 20px;
    background: red;
    border-radius: 50%;
    line-height: 20px;
    position: absolute;
    top: -8px;
    color: #fff;
}
.text {
  overflow: hidden;
  white-space: nowrap;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.orderMsg {
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
  border-left: 1px solid #dcdfe6 !important;
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
.pagination {
  float: right;
}
.keyword {
  width: 350px;
}
.state-right {
  margin-right: 20px;
}
.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}
.certification >>>.el-table__fixed-right::before, .el-table__fixed::before{
  height: 0 !important;
}
</style>