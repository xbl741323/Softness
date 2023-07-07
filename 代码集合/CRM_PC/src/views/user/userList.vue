<template>
<!-- 排查完成 -->
  <basic-container>
  <div class="user_list" v-if="permissions.sys_user_detail || permissions.sys_user_edit || permissions.sys_user_status_edit">
    <div class="filters_form">
      <el-form :model="filters" :inline="true" ref="filters" @keyup.enter.native="getList()">        
        <el-form-item label="账号类型：">
            <el-radio-group v-model="filters.account" size="small" @change="chooseAccountType">
                <el-radio-button class="right-dis" :label="0">单位</el-radio-button>
                <el-radio-button class="right-dis" :label="1">个人</el-radio-button>
                <el-radio-button class="right-dis" :label="2">未认证</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <div class="flex">
          <div>
            <el-form-item label="关  键  字：">
              <el-input class="wid" v-model.trim="filters.keyword" placeholder="主体ID/登录ID/用户名/手机号或联系人/单位名称关键字" />
            </el-form-item>            
            <el-form-item label="地区" v-if="filters.account!=2">
              <el-cascader size="small" :options="areaOptions" v-model="filters.diyOrgAddress"  :props="{value: 'id',label: 'areaName'}"></el-cascader>
            </el-form-item>
            <el-form-item label="客服：">
                <el-input v-model="filters.customerServerName" placeholder="请输入员工姓名/工号" />
            </el-form-item> 
            <el-form-item label="推广归属：">
                <el-input v-model="filters.promoteAttributionName" placeholder="请输入员工姓名/工号" />
            </el-form-item> 
            <el-form-item label="业务员：" v-if="filters.account!=2">
                <el-input v-model="filters.clueSalesmanInfo" placeholder="请输入员工姓名/工号" />
            </el-form-item> 
          </div>
          <div>
            <el-button type="primary" @click="getList">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </div>
        </div>        
      </el-form>
      <div class="gjss">
        <el-checkbox v-model="isSelect">
          高级搜索
        </el-checkbox>
        <el-form v-if="isSelect" style="margin-top: 5px;">
          <el-form-item label="账号状态：">
            <el-select v-model="filters.isDisabled">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="启用" value="0"></el-option>
              <el-option label="禁用" value="1"></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="认证方式：" v-if="filters.account == 0" style="margin-left: 20px">
            <el-select v-model="filters.certifiedType">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="初级认证" value="1"></el-option>
              <el-option label="高级认证" value="2"></el-option>
            </el-select>
          </el-form-item> 
        </el-form>
      </div>
      <div class="batch-handle">
        <el-button size="small" @click="permissions.sys_user_edit ? handledistribution(0,{},1) : $notAuthorized()" type="primary" :disabled="batchList.length==0">分配客服</el-button>
      </div>
    </div>
    <!-- 单位 -->
    <div v-show="filters.account == 0" class="unit">          
      <el-table ref="crud" :data="userList" row-key="accountNo"  :tree-props="{children: 'accounts'}"  border v-loading="tableLoading" class="batch-choose tabSty" @selection-change="selectionChange">
        <el-table-column type="selection"  :selectable="selectAble" align="center"></el-table-column>
        <!-- 主体ID -->
        <el-table-column prop="userNo" label="主体ID" width="120" align="center"> 
          <template slot-scope="scope">
            <span class="cur" @click="handleView(scope.row)">{{scope.row.userNo}}</span>
          </template> 
        </el-table-column>
        <!-- 用户名 -->
        <el-table-column prop="username" label="用户名" width="130" align="center" show-overflow-tooltip> 
          <template slot-scope="scope">
            <span class="cur" @click="handleView(scope.row)">{{scope.row.username}}</span>
          </template> 
        </el-table-column>
        <!-- 线索编号-->
        <el-table-column prop="clueNo" label="线索编号" width="180" align="center" show-overflow-tooltip> 
          <template slot-scope="scope">
            <span>{{scope.row.clueNo}}</span>
          </template> 
        </el-table-column>
        <!-- 单位名称 -->
        <el-table-column prop="companyName" label="单位名称" width="200" align="center" show-overflow-tooltip> 
          <template slot-scope="scope">
            <div class="company">
              <span class="cur" @click="handleView(scope.row)">{{scope.row.companyName}}</span>
             <div v-if="scope.row.userNo">
              <img :src="require('@/assets/images/new-client/certified_unit.png')" alt="" style="width: 20px;height: 20px; margin-left: 3px" v-if="(scope.row.transactionNo)">
              <img :src="require('@/assets/images/new-client/certified_unit_low.png')" alt="" style="width: 20px;height: 20px; margin-left: 3px" v-else>
             </div>
            </div>
          </template> 
        </el-table-column>
        <!-- 登录ID -->
        <el-table-column prop="accountNo" label="登录ID" align="center" show-overflow-tooltip> </el-table-column>
        <!-- 联系人 -->
        <el-table-column prop="personName" label="联系人" align="center" show-overflow-tooltip> </el-table-column>
        <!-- 手机号 -->
        <el-table-column prop="mobile" label="手机号" width="120" align="center" show-overflow-tooltip></el-table-column>
        <!-- 地区 -->
        <el-table-column prop="diyOrgAddress" label="地区" width="160" align="center" show-overflow-tooltip> 
          <template slot-scope="scope">
            <span>{{scope.row.diyOrgAddress | filterArea}}</span>
         </template>
        </el-table-column>
        <!-- 客服 -->
        <el-table-column prop="customerServerName" label="客服" align="center"> 
          <template slot-scope="scope">
            <div class="disbale_content" v-if="scope.row.customerServerId!=0">
            <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
              <span @mouseenter="showUserInfo(scope.row.customerServerId)">{{scope.row.customerServerName}}</span>
            </el-tooltip>
            </div>
            <div v-else>
              <span>{{scope.row.customerServerName}}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 推广归属 -->
        <el-table-column prop="promoteAttributionName" label="推广归属" align="center" > 
          <template slot-scope="scope">
            <div class="disbale_content" v-if="scope.row.promoteAttributionId!=0">
            <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
              <span @mouseenter="showUserInfo(scope.row.promoteAttributionId)">{{scope.row.promoteAttributionName}}</span>
            </el-tooltip>
            </div>
            <div v-else>
              <span>{{scope.row.promoteAttributionName}}</span>
            </div>
          </template>   
        </el-table-column>
        <!-- 业务员 -->
        <el-table-column prop="clueSalesmanEmpName" label="业务员" align="center"> 
          <template slot-scope="scope">
            <div class="disbale_content" v-if="scope.row.clueSalesmanEmpId!=0">
            <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
              <span @mouseenter="showUserInfo(scope.row.clueSalesmanEmpId)">{{scope.row.clueSalesmanEmpName}}</span>
            </el-tooltip>
            </div>
            <div v-else>
              <span>{{scope.row.clueSalesmanEmpName}}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 注册时间 -->
        <el-table-column prop="regCreateTime" label="注册时间" width="150" align="center"></el-table-column>
        <!-- 操作 -->
        <el-table-column  label="操作" align="center"> 
          <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.accounts" @click="handleView(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="textAli">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="page.currentPage"
          :page-sizes="page.pageSizes"
          :page-size.sync="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
      </div>
    </div>
    <!-- 个人 -->
    <div v-show="filters.account == 1">
      <avue-crud v-if="filters.account =='1'" :table-loading="tableLoading" class="batch-choose" ref="crud" :page.sync="page" :data="userList" :option="personOptions" @on-load="getList" @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange">      
         <template slot="username" slot-scope="scope">
            <span class="cur" @click="handleView(scope.row)">{{scope.row.username}}</span>
        </template> 
        <template slot="userNo" slot-scope="scope">
            <span class="cur" @click="handleView(scope.row)">{{scope.row.userNo}}</span>
        </template> 
        <template slot="diyOrgAddress" slot-scope="scope">
               <span>{{scope.row.diyOrgAddress | filterArea}}</span>
         </template>
         <template slot="customerServerName" slot-scope="scope">
          <div class="disbale_content" v-if="scope.row.customerServerId!=0">
          <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
            <span @mouseenter="showUserInfo(scope.row.customerServerId)">{{scope.row.customerServerName}}</span>
          </el-tooltip>
          </div>
          <div v-else>
            <span>{{scope.row.customerServerName}}</span>
          </div>
        </template>
        <template slot="promoteAttributionName" slot-scope="scope">
          <div class="disbale_content" v-if="scope.row.promoteAttributionId!=0">
          <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
            <span @mouseenter="showUserInfo(scope.row.promoteAttributionId)">{{scope.row.promoteAttributionName}}</span>
          </el-tooltip>
          </div>
          <div v-else>
            <span>{{scope.row.promoteAttributionName}}</span>
          </div>
        </template>       
        <!-- 业务员 -->
        <template slot="clueSalesmanEmpName" slot-scope="scope">
          <div class="disbale_content" v-if="scope.row.clueSalesmanEmpId!=0">
          <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
            <span @mouseenter="showUserInfo(scope.row.clueSalesmanEmpId)">{{scope.row.clueSalesmanEmpName}}</span>
          </el-tooltip>
          </div>
          <div v-else>
            <span>{{scope.row.clueSalesmanEmpName}}</span>
          </div>
        </template>
        <template slot="menu" slot-scope="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
        </template>
      </avue-crud>   
    </div>
    <!-- 未认证 -->
    <div v-show="filters.account == 2">
      <avue-crud v-if="filters.account ==2" :table-loading="tableLoading" class="batch-choose" ref="crud" :page.sync="page" :data="userList" :option="unknowOptions" @on-load="getList" @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange">   
        <template slot="username" slot-scope="scope">
            <span class="cur" @click="handleView(scope.row)">{{scope.row.username}}</span>
        </template> 
        <template slot="userNo" slot-scope="scope">
            <span class="cur" @click="handleView(scope.row)">{{scope.row.userNo}}</span>
        </template> 
        <template slot="accountNo" slot-scope="scope">
            <span class="cur" @click="handleView(scope.row)">{{scope.row.accountNo}}</span>
        </template> 
         <template slot="clueNo" slot-scope="scope">
            <span>{{scope.row.clueNo}}</span>
        </template> 
         <template slot="diyOrgAddress" slot-scope="scope">
               <span>{{scope.row.diyOrgAddress | filterArea}}</span>
         </template>
         <template slot="customerServerName" slot-scope="scope">
          <div class="disbale_content" v-if="scope.row.customerServerId!=0">
          <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
            <span @mouseenter="showUserInfo(scope.row.customerServerId)">{{scope.row.customerServerName}}</span>
          </el-tooltip>
          </div>
          <div v-else>
            <span>{{scope.row.customerServerName}}</span>
          </div>
        </template>
        <template slot="promoteAttributionName" slot-scope="scope">
          <div class="disbale_content" v-if="scope.row.promoteAttributionId!=0">
          <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
            <span @mouseenter="showUserInfo(scope.row.promoteAttributionId)">{{scope.row.promoteAttributionName}}</span>
          </el-tooltip>
          </div>
          <div v-else>
            <span>{{scope.row.promoteAttributionName}}</span>
          </div>
        </template>                            
          <template slot="menu" slot-scope="scope">
             <el-button  type="text" size="small" @click="handleView(scope.row)">查看</el-button>
          </template>
      </avue-crud>   
    </div>
    <!-- 用户分配 -->
    <el-dialog  :title="dialogTitle"  :visible.sync="dialogVisible" :close-on-click-modal="false" width="23%" :before-close="handlebeforeDialogClose">
      <el-form :model="userForm" ref="userForm" :rules="rules" label-width="140px">
        <el-form-item label="请选择客服：" prop="customerServerName" v-if="(which == 0&&allotType == 1)||(which == 1)">
          <el-select v-model="userForm.customerServerName" placeholder="请选择">
            <el-option  v-for="item in customerList" :key="item.userId" :label="item.name" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>    
      </el-form>
      <div class="allot-btn-contain">
        <el-button type="primary" @click="makeSure('userForm')">确定</el-button>
        <el-button class="ml" @click="handleCancel('userForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
  </basic-container>
</template>

<script>
import { getEmpInfo } from "@/api/project/wtClass";
import { companyOptions } from "@/const/crud/restructureUserList/company"
import { personOptions } from "@/const/crud/restructureUserList/person"
import { unknowOptions } from "@/const/crud/restructureUserList/unknow"
import { getUserList,Enabledisable,distribution} from "@/api/restructureuser/index"
import { getArea,getCustomerList } from "@/api/clue/clue"
import { filterArea, filterIndustry } from "@/util/new-client/filter"
import { mapGetters } from 'vuex';
import { saveDetal } from "@/util/clearDetail";
import { accountDisabled } from "@/api/user/user"
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      which:"",
      allotType:"",
      cEmpNo:"",
      cDeptName:"",
      userData:{},
      areaOptions:[], //地区
      batchList: [], //多选数组
      userList: [],
      shows:false,
      filters:{
         account:0, 
         keyword:"",
         diyOrgAddress:[],
         customerServerName:"",
         promoteAttributionName:"",
         clueSalesmanInfo: "",
         isDisabled:null,
         certifiedType: null,
      },
      tableLoading:false,
      arrayList:[],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 20, 
        pageSizes: [5, 10, 20, 30, 40, 50, 100]
      },
      companyOptions,
      personOptions,
      unknowOptions,
      empList: [],//推广
      customerList:[],//客服
      rules:{
        customerServerName:[{required:false,message:'',trigger:'blur'}],
        promoteAttributionName:[{required:false,message:'',trigger:'blur'}]
      },
      dialogTitle:'分配客服',
      dialogVisible: false,
      userForm:{
        customerServerName:null,
        promoteAttributionName:null
      },
      accountList:[],
      isSelect: false,
    }
  },
  filters: {
    filterIndustry(val){
      return filterIndustry(val)
    },
    filterArea(val){ 
      return filterArea(val)
    }
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
    this.filters.account = keepParams.account
    this.filters.keyword = keepParams.keyword
    this.filters.diyOrgAddress = keepParams.diyOrgAddress
    this.filters.customerServerName = keepParams.customerServerName
    this.filters.clueSalesmanInfo = keepParams.clueSalesmanInfo
    this.filters.promoteAttributionName = keepParams.promoteAttributionName,
    this.filters.isDisabled = keepParams.isDisabled
    }
  },
  mounted() {
    if (!this.permissions.sys_user_detail && !this.permissions.sys_user_edit && !this.permissions.sys_user_status_edit) {
      this.$notAuthorized()
    }
    if(this.filters.account == 0){
      this.getList()
    }
    this.getDictionaries()
  },
  methods: {
     // 获取员工信息
    showUserInfo(id){
      getEmpInfo(id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.cEmpNo = res.data.data.number
          this.cDeptName = res.data.data.deptName
        }
      })
    },
    //账号类型  
    chooseAccountType() {
      this.batchList = []
      this.getList()
    },
    //列表
    getList() {
        this.tableLoading = true
        let param = {
            keyword: this.filters.keyword,
            diyOrgAddress: this.filters.diyOrgAddress.length > 0 ? this.filters.diyOrgAddress.join(","):'',
            customerServerName: this.filters.customerServerName,
            promoteAttributionName: this.filters.promoteAttributionName,
            clueSalesmanInfo: this.filters.clueSalesmanInfo,
            isDisabled: this.filters.isDisabled,
            certifiedType: Number(this.filters.certifiedType),
            pageNo: this.page.currentPage,
            pageSize: this.page.pageSize
        }
        // 需要缓存的参数
        let keepParams = {
          account: this.filters.account,
          keyword: this.filters.keyword,
          diyOrgAddress: this.filters.diyOrgAddress,
          customerServerName: this.filters.customerServerName,
          promoteAttributionName: this.filters.promoteAttributionName,
          clueSalesmanInfo: this.filters.clueSalesmanInfo,
          isDisabled: this.filters.isDisabled,
          detail: {path: "",query: {}}
        }
        sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams))
        getUserList(this.filters.account,param).then(res=> {
            if(res.data.code==0){
                this.userList = res.data.data.records
                this.page.total = res.data.data.total
                this.tableLoading = false
            }
        })
    },
    resetForm() {
      this.filters.keyword = ""
      this.filters.diyOrgAddress = []
      this.filters.customerServerName = ""
      this.filters.promoteAttributionName = ""
      this.filters.isDisabled = null
      this.filters.certifiedType = null
      this.filters.clueSalesmanInfo = ""
      this.batchList = []
      this.getList()
    },
    //字典项
    getDictionaries(){
        //地区
        getArea().then(res=> {
          this.areaOptions = res.data.data
        })
        //客服
        getCustomerList().then((res) => {
          this.customerList = res.data.data
        })
    },
    currentChange(val) {
      this.page.currentPage = val
      this.batchList = []
      this.getList()
    },
    sizeChange(val){
      this.page.pageSize = val
      this.getList()
    },
    selectionChange(val) {
      this.batchList = []
      val.forEach(item=>{
        this.batchList.push(item.userId)
      })
    },
    //关闭分配弹框
    handlebeforeDialogClose(done){
       done()
       this.batchList = []
       if(this.filters.account == 0){
         this.$refs.crud.clearSelection();
       }else{
         this.$refs.crud.toggleSelection();
       }
    },
    //分配
    handledistribution(which,row,allotType) {
      this.which = which
      if(allotType){
        this.allotType = allotType
      }
      if(which==1){
        this.batchList = []
        this.batchList.push(row.userId)
      }
      this.dialogVisible = true
    },
    makeSure(formName){
      this.$refs[formName].validate(valid=>{
         if(valid){
            let param = {
              userIds:this.batchList,
              customerServerId:this.userForm.customerServerName,  //客服
              promoteAttributionId:this.userForm.promoteAttributionName!=null?this.userForm.promoteAttributionName[this.userForm.promoteAttributionName.length-1]:null //推广
            }
           distribution(param).then(res=>{
               if(res.data.code==0){
                  this.$message({
                    type:'success',
                    message:'分配成功',
                    offset:300,
                    duration: 1500
                  })   
                  this.batchList = []
                  this.dialogVisible = false
                 if(this.filters.account == 0){
                   this.$refs.crud.clearSelection()
                 }else{
                    this.$refs.crud.toggleSelection()
                 }
                  this.getList()
               }
           })
         }else{

         }
      })
    },
    //取消分配
    handleCancel(formName){
       this.$refs[formName].resetFields()
       this.dialogVisible = false
    },
    //查看
    handleView(row) {
      let path = '/user-detail'
      let query = {
        transactionNo:row.transactionNo,
        userId: row.userId,
        isDisabled:row.isDisabled,
        type:this.filters.account,
        source:'list',
      }
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });  
    },
    //启用禁用用户
    handleEnabledisable(row) {
      let title = ''
      let ask = ''
      if(row.isDisabled == 0){
        title = '用户禁用'
        ask = '确定禁用该用户吗？'
      }else{
        title = '用户启用'
        ask = '确定启用该用户吗？'
      }
       this.$confirm(ask, title, {
        type: 'warning',
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel"
      }).then(()=>{
        Enabledisable({userId:row.userId,isDisabled:row.isDisabled==0?1:0}).then(res=>{
            if(res.data.code==0){
                this.$message({
                  type:'success',
                  message:'状态更新成功',
                  offset:300,
                  duration: 2000
                })   
                this.getList()
            }
        })
      }).catch(error => {
        console.log(error)
      })
    },
    selectAble(row){
      if(row.userId){
        return true;
      }else{
        return false;
      };
    },
    // 禁用用户accountId
    accountDisabled(row){
      let title = ''
      let ask = ''
      if(row.isDisabled == 0){
        title = '用户禁用'
        ask = '确定禁用该用户吗？'
      }else{
        title = '用户启用'
        ask = '确定启用该用户吗？'
      }
       this.$confirm(ask, title, {
        type: 'warning',
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel"
      }).then(()=>{
          let params = {
          accountId: row.accountId, 
          isDisabled: row.isDisabled == 0 ? 1 : 0
        }
        accountDisabled(params).then(res =>{
          if(res.data.code == CodeMsg.CODE_0){
              this.$message({
                type:'success',
                message: res.data.msg,
                duration: 2000
              });
            this.getList()
          }
        }).catch(error =>{
          console.log(error)
        })
      }).catch(err=>{
        return err;
      });
      
    }
  }
}
</script>

<style scoped>
.redClue {
  margin-left: 30%;
  display: flex;
}
.greenClue {
  margin-left: 30%;
  display: flex;
}
.allot-btn-contain {
  margin-top: 25px;
  display: flex;
  justify-content: center;
}
.circleGreen {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: green;
  margin-top: 8px;
  margin-right: 7px;
}
.circleRed {
  background: red;
}
.deal-user{
  color: green !important;
}
.filters_form {
  margin-bottom: 10px;
  margin-left: 3px;
}
.radio_item:nth-of-type(1) {
  border-left: none;
}
.radio_item {
  margin-right: 10px;
  border-left: 1px solid #dcdfe6;
  border-radius: 0px 0px 0px 0px;
}
.right-dis:nth-of-type(1) {
  border-left: none;
}
.right-dis {
  margin-right: 20px;
  border-left: 1px solid #dcdfe6;
}
.btn_sty {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.clue_sty {
  color: green;
}
.no_clue_sty {
  color: #000000;
}
.cirg {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: green;
  position: relative;
  top: -1px;
  left: -2px;
}
.com_user_sty {
  color: #409eff;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
}
.certified_unit_sty {
  width: 17px;
  height: 19px;
  margin-right: 3px;
}
.certified_sty {
  width: 15px;
  height: 19px;
  margin-right: 3px;
}
.center_user_sty{
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.black_status{
  color: black;
}
.black_status_bold{
  font-weight: bold;
  color: black;
}
.green_status{
  color: green;
}
.green_status_bold{
  font-weight: bold;
  color: green;
}
.disbale_content{
  display: flex;
  justify-content: center;
}
.disable_img_sty{
  width:20px;
  height:20px;
  margin-left: 3px;
}
.flex{
    display: flex;
}
.cur{
    color:#36a6fe;
    cursor: pointer;
}
.wid {
  width:320px;
}
.tabSty {
  width: 100%;
  margin-bottom: 20px;
}
.textAli{
  text-align:right;
}
.ml {
  margin-left:60px;
}
.columnSty {
  color: #000000;
}
.unit >>> .el-table th.el-table__cell>.cell{
  color:#000000;
}
.company{
  display: flex;
  justify-content: center;
}
.gjss :deep() .el-form{
  display: flex;
}
</style>