<template>
  <div>
    <!-- <el-dialog
      :visible.sync="countDialog"
      :close-on-click-modal="false"> -->
      <div>
        <!-- <el-button class="role-sty-permission " icon="el-icon-plus" type="primary" @click="showAdd">数据权限</el-button> -->

        <el-table :data="dataList" border v-if="isPartner == 1">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="数据名称" prop="menuName"></el-table-column>
          <el-table-column label="数据权限">
            <template>
              <span>本合作商权限</span>
            </template>
          </el-table-column>
        </el-table>

        <avue-crud
          v-if="isPartner == 0"
          ref="crud"
          :option="option"
          :data="dataList"
          :page.sync="page"
          v-model="form"
          @size-change="sizeChange"
          @current-change="currentChange"
          >
          <template slot="dsType" slot-scope="scope">
             <span>{{ scope.row.dsType|typeFilter }}</span>
          </template>
          <template slot="dsCheckType" slot-scope="scope">
             <span>{{ scope.row.dsCheckType|typeFilter}}</span>
          </template>。
          <template slot="menu" slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-edit"
              @click="showEdit(scope.row)">
              编辑
            </el-button>
            <!-- <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">
              删除
            </el-button> -->
          </template>
        </avue-crud>
      </div>
    <!-- </el-dialog> -->
    <!-- 添加操作 -->
    <el-dialog
      :visible.sync="addDialog"
      :close-on-click-modal="false"
      :before-close="handleClose"
      append-to-body
      :title="operateTitle"
      width="26%">
      <el-form class="form-sty" :model="addForm" ref="addForm" :rules="rules" label-width="100px">
        <el-form-item label="数据名称：" prop="dataName">
           <el-select v-model="addForm.dataName" class="data-form-sty" v-if="showStatus==0">
             <el-option v-for="(item,index) in nameList" :key="index" :label="item.menuName" :value="item.id"></el-option>
           </el-select>
           <span v-if="showStatus==1">{{ editInfo.menuName }}</span>
        </el-form-item>
        <el-form-item label="数据权限" prop="dsType" ref="dsType">
          <el-checkbox v-model="zzCheck">
            <span>组织部门：</span>
            <el-select v-model="addForm.dsType" class="data-form-sty" :disabled="!zzCheck">
              <el-option label="全部" value="0"></el-option>
              <el-option label="自定义" value="1"></el-option>
              <el-option label="本级及子级" value="2"></el-option>
              <el-option label="本级" value="3"></el-option>
            </el-select>
          </el-checkbox>
          <div v-if="addForm.dsType == 1 && zzCheck">
            <el-tree
              ref="scopeTree"
              :data="dsScopeData"
              :check-strictly="false"
              :props="defaultProps"
              :default-checked-keys="checkedDsScope"
              node-key="id"
              show-checkbox
              highlight-current/>
          </div>
          <!-- <el-select v-model="addForm.dsType" class="data-form-sty">
            <el-option label="全部" value="0"></el-option>
            <el-option label="自定义" value="1"></el-option>
            <el-option label="本级及子级" value="2"></el-option>
            <el-option label="本级" value="3"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item prop="dsCheckType" ref="dsCheckType">
          <el-checkbox v-model="ccCheck">
            <span>查重部门：</span>
            <el-select v-model="addForm.dsCheckType" class="data-form-sty" :disabled="!ccCheck">
              <el-option label="全部" value="0"></el-option>
              <el-option label="自定义" value="1"></el-option>
              <el-option label="本级" value="3"></el-option>
            </el-select>
          </el-checkbox>
          <div v-if="addForm.dsCheckType == 1 && ccCheck">
            <el-tree
              ref="ccScopeTree"
              :data="dsCheckScopeData"
              :check-strictly="false"
              :props="ccDefaultProps"
              :default-checked-keys="ccCheckedDsScope"
              node-key="id"
              show-checkbox
              highlight-current/>
          </div>
        </el-form-item>
      </el-form>
          <div class="role-btn-sty">
           <el-button
            class="confirm-sty"
            type="primary"
            @click="addOperate"
            v-if="showStatus==0"
            >{{ $t("button.confirm") }}</el-button>
             <el-button
            class="confirm-sty"
            type="primary"
            @click="editOperate"
            v-if="showStatus==1"
            >{{ $t("button.confirm") }}</el-button>
          <el-button type="primary" @click="handleClose">
            {{$t("button.cancel")}}</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { tableOption } from "@/const/crud/role/permission";
import * as CodeMsg from "@/api/common/CodeChange"
import { fetchTree, ccFetchTree } from '@/api/admin/dept'
import { getDataPower,addDataPower,editDataPower,delDataPower,getRoleNameList } from "@/api/admin/role";
export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (
        !(this.addForm.dsType && this.zzCheck) &&
        !(this.addForm.dsCheckType && this.ccCheck)
      ) {
        callback(new Error("请至少填写一项"));
      } else {
        if (this.addForm.dsType == 1 && this.zzCheck) {
          if (!this.$refs.scopeTree.getCheckedKeys().join(",")) {
            if (this.addForm.dsCheckType == 1 && this.ccCheck) {
              if (!this.$refs.ccScopeTree.getCheckedKeys().join(",")) {
                callback(new Error("请至少填写一项"));
              } else {
                callback();
              }
            }
            callback(new Error("请至少填写一项"));
          }
          callback();
        } else if (this.addForm.dsCheckType == 1 && this.ccCheck) {
          if (!this.$refs.ccScopeTree.getCheckedKeys().join(",")) {
            callback(new Error("请至少填写一项"));
          }
          callback();
        } else {
          if (!this.addForm.dsType || !this.addForm.dsCheckType) {
            this.$refs.dsType.clearValidate();
            this.$refs.dsCheckType.clearValidate();
          }
          callback();
        }
      }
    }
    return {
      currentIndex: 0,
      editInfo:{},
      showStatus:0,
      operateTitle:"",
      isResourceShow: 0,
      isPartner: 0,//0-内部角色 1-合作机构
      roleInfo: {},
      addDialog: false,
      countDialog: false,
      zzCheck: false,
      ccCheck: false,
      zzOptionList: [],
      ccOptionList: [],
      option: tableOption,
      form: {},
      dsScopeData: [],
      dsCheckScopeData: [],
      checkedDsScope: [],
      ccCheckedDsScope: [],
      defaultProps: {
        label: 'name',
        value: 'id'
      },
      ccDefaultProps: {
        label: 'businessGroupName',
        value: 'deptId'
      },
      rules:{
        dataName: [
          { required: true, message: "请选择", trigger: "blur", },
        ],
        dsType: [
          { required: true, message: "请选择至少一个部门", trigger: "blur", validator: validateName},
        ],
        dsCheckType: [
          { required: true, message: "请选择至少一个部门", trigger: "blur", validator: validateName},
        ],
      },
      addForm: {
        dataName:"",
        dsType:"",
        dsCheckType: "",
      },
      nameList:[],
      roleBolong: "",
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [5, 10],
      },
    };
  },
  filters: {
    typeFilter(val){
      switch(val){
        case "0":
          return "全部"
        case "1":
          return "自定义"
        case "2":
          return "本级及子级"
        case "3":
          return "本级"
        case "":
          return "无"
      }
    }
  },
  methods: {
    getFetachData() {
      fetchTree().then(response => {
        this.dsScopeData = response.data.data
      })
      ccFetchTree().then(res => {
        this.dsCheckScopeData = res.data.data
      })
    },
    showAdd(){
      this.addDialog = true
      this.operateTitle = "添加数据权限"
      this.showStatus = 0
      this.checkedDsScope = []
      this.ccCheckedDsScope = []
      this.addForm.dataName = ""
      this.addForm.dsType = ""
      this.addForm.dsCheckType = ""
      this.zzCheck = false
      this.ccCheck = false
    },
    showEdit(row){
      this.roleInfo.roleId = row.roleId;
      this.currentIndex = row.$index;
      this.getFetachData()
      this.addDialog = true
      this.operateTitle = "编辑数据权限" 
      this.showStatus = 1
      this.editInfo = row
      this.addForm.dataName = row.id
      this.addForm.dsType = row.dsType
      this.addForm.dsCheckType = row.dsCheckType
      this.checkedDsScope = []
      this.ccCheckedDsScope = []
      if(row.dsType) {
        this.zzCheck = true
      } else {
        this.zzCheck = false
      }
      if(row.dsCheckType) {
        this.ccCheck = true
      } else {
        this.ccCheck = false
      }
      if(this.addForm.dsType == 1 && this.zzCheck){
        this.checkedDsScope = []
        let scopeList = row.dsScope.split(",")
        scopeList.forEach(item=>{
          this.checkedDsScope.push([item])
        })
      }
      if(this.addForm.dsCheckType == 1 && this.ccCheck) {
        this.ccCheckedDsScope = []
        let ccScopeList = row.dsCheckScope.split(",")
        ccScopeList.forEach(item=>{
          this.ccCheckedDsScope.push([item])
        })
      }
    },
    te(val) {
      return this.$t(val);
    },
    showInfo() {
      this.getRoleName();
      this.getAllList();
      this.getFetachData()
      console.log(this.roleInfo,"this.roleInfo")
    },
    getRoleName(){
      let params = {
        roleId:this.roleInfo.roleId
      }
      getRoleNameList(params).then(res=>{
       this.nameList = res.data.data
      })
    },
    //删除操作
    removeRoleEmp(row) {
      let params = {
        id:row.id
      }
      delDataPower(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:"success",
            message:"删除成功！"
          })
          this.getAllList()
          this.getRoleName()
        }
      })
    },
    //编辑数据权限
    editOperate(){
      this.$refs['addForm'].validate(valid=>{
        if(valid){
          let params = {
           roleId:this.roleInfo.roleId,
          //  id:this.editInfo.id,
           dataMenuId:this.addForm.dataName,
           dsType: this.zzCheck ? this.addForm.dsType : '',
           dsCheckType: this.ccCheck ? this.addForm.dsCheckType : '',
          }
          params.dsScope = ""
          if(this.addForm.dsType == 1 && this.zzCheck){
            params.dsScope = this.$refs.scopeTree.getCheckedKeys().join(',')
            if (!this.$refs.scopeTree.getCheckedKeys().join(',')) params.dsType = ''
          }
          params.dsCheckScope = ""
          if(this.addForm.dsCheckType == 1 && this.ccCheck){
            params.dsCheckScope = this.$refs.ccScopeTree.getCheckedKeys().join(',')
            if (!this.$refs.ccScopeTree.getCheckedKeys().join(',')) params.dsCheckType = ''
          }
          console.log(params);
          this.dataList[this.currentIndex] = Object.assign(this.dataList[this.currentIndex],params)
          this.addDialog = false;
        // editDataPower(params).then(res=>{
        //    if(res.data.code == CodeMsg.CODE_0){
        //      this.$message({
        //        type:"success",
        //        message:"编辑成功！"
        //      })
        //      this.checkedDsScope = []
        //      this.ccCheckedDsScope = []
        //      this.ccCheck = false
        //      this.zzCheck = false
        //      this.handleClose();
        //      this.getAllList();
        //      this.getRoleName()
        //      this.getFetachData()
        //    }
        // })
        }
      })
    },
    //添加数据权限
    addOperate() {
      this.$refs['addForm'].validate(valid=>{
        if(valid){
          let params = { 
            roleId:this.roleInfo.roleId,
            dsType:this.addForm.dsType,
            dataMenuId:this.addForm.dataName,
            dsCheckType: this.addForm.dsCheckType
          }
      if(this.addForm.dsType == 1){
        params.dsScope = this.$refs.scopeTree.getCheckedKeys().join(',')
      }
      if(this.addForm.dsCheckType == 1){
        params.dsCheckScope = this.$refs.ccScopeTree.getCheckedKeys().join(',')
      }
      addDataPower(params).then(res=>{
         if(res.data.code == CodeMsg.CODE_0){
           this.$message({
             type:"success",
             message:"添加成功！"
           })
           this.handleClose();
           this.getAllList();
           this.getRoleName()
         }
      })
        }
      })
    },
    handleClose() {
      this.addDialog = false;
      this.addForm.dataName = "";
      this.addForm.dsType = "";
      this.addForm.dsCheckType = "";
      this.getFetachData()
      this.$refs["addForm"].resetFields();
    },
    handleDelete(row) {
      this.$confirm(
        `确定删除？`,
        "提示",
        {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        }
      )
        .then(() => {
          this.removeRoleEmp(row);
        })
        .catch(() => {});
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      let params = {
       roleId:this.roleInfo.roleId
      }
      getDataPower(params).then(res=>{
      this.dataList = res.data.data
    })
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getAllList();
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.getList();
    },
  },
  mounted(){
    this.getFetachData()
  }
};
</script>

<style scoped>
.role-sty-permission {
  margin: -20px 6px 20px 6px;
}
.form-sty {
  margin: -10px 0px 0 40px;
}
.role-btn-sty {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
.confirm-sty {
  margin-right: 40px;
}
.data-form-sty{
  width: 80%;
}
.el-tree-sty{
  margin-left:130px;
}
</style>