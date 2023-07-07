<template>
  <div class="role-index">
    <basic-container>
      <avue-crud
        ref="crud"
        :option="tableOption"
        :data="list"
        :page.sync="page"
        v-model="form"
        :table-loading="listLoading"
        :before-open="handleOpenBefore"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-update="update"
        @row-save="create"
        @search-reset="reset"
        @on-load="getList">
        <template slot="userCount" slot-scope="scope">
          <span @click="showCount(scope.row)" id="count-style">{{ scope.row.number }}</span>
        </template>
        <template slot="isPartner" slot-scope="{row}">
          <span>{{row.isPartner ? '合作机构角色' : '内部角色'}}</span>
        </template>
        <template slot="keySearch">
           <el-input placeholder="请输入角色名称关键词搜索"  @keyup.enter.native="searchChange" v-model.trim="filters.keyWords"></el-input>
        </template>
        <template slot="isPartnerSearch">
          <el-select v-model="filters.isPartner">
            <el-option
              v-for="item in roleType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template slot="searchMenu">
          <el-button
            v-if="roleManager_btn_add"
            class="filter-item"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreate">添加
          </el-button>
        </template>
        <template slot="roleName" slot-scope="scope">
          <span id="count-style" @click="handleUpdate(scope.row,scope.index)">{{ scope.row.roleName }}</span>
        </template>
        <template
          slot="menu"
          slot-scope="scope">
          <el-button
            v-if="roleManager_btn_perm"
            type="text"
            size="small"
            icon="el-icon-plus"
            @click="handlePermission(scope.row,scope.index)">添加权限
          </el-button>
          <!-- <el-button
            v-if="roleManager_btn_edit"
            type="text"
            size="small"
            icon="el-icon-plus"
            @click="handleDataPlus(scope.row,scope.index)">数据权限
          </el-button> -->
          <el-button
            v-if="roleManager_btn_del"
            type="text"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(scope.row,scope.index)">删除
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
    <el-dialog
      :visible.sync="dialogPermissionVisible"
      :close-on-click-modal="false"
      :title="plusTitle">
      <div class="dialog-main-tree">
        <p class="permissionTitle">步骤一：添加菜单权限</p>
        <el-tree
          ref="menuTree"
          :data="treeData"
          :default-checked-keys="checkedKeys"
          :check-strictly="false"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @check="updatePermession(roleId)"
          class="filter-tree"
          node-key="id"
          highlight-current
          show-checkbox/>
      </div>
      <p class="permissionTitle">步骤二：添加数据权限</p>
      <add-permission @refresh="refresh" ref="permission"></add-permission>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="confirmSave(roleId)">保 存
        </el-button>
        <!-- <el-button
	        type="default"
          size="small"
          @click="cancal()">取消</el-button> -->
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogViewVisible"
      :close-on-click-modal="false"
      :title="viewTitle">
      <div class="dialog-main-tree">
      <el-tree
        ref="menuTree"
        :data="treeData"
        :default-checked-keys="checkedKeys"
        :check-strictly="false"
        :props="defaultProps"      
        :filter-node-method="filterNode"
        class="filter-tree"
        node-key="id"
        highlight-current
        show-checkbox/>
      </div>
    </el-dialog>
    <!-- 修改使用人数 -->
    <role-operate @refresh="refresh" ref="role"></role-operate>
    <!-- <add-permission @refresh="refresh" ref="permission"></add-permission> -->
  </div>
</template>

<script>
import { addObj, delObj, fetchRoleTree, permissionUpd, putObj,getNewRoleList, roleUpdate } from '@/api/admin/role'
import { tableOption } from '@/const/crud/admin/role'
import { fetchTree } from '@/api/admin/dept'
import { fetchMenuTree } from '@/api/admin/menu'
import { mapGetters } from 'vuex'
import roleOperate from "@/components/role/role-operate"
import addPermission from "@/components/role/add-permission"

export default {
  components:{
    roleOperate,
    addPermission
  },
  name: 'TableRole',
  data() {
    return {
      filters:{
        keyWords:"",
        isPartner: null
      },
      countData:[],
      countDialog:false,
      viewTitle:"",
      plusTitle:"",
      searchForm: {},
      tableOption: tableOption,
      dsScopeData: [],
      treeData: [],
      checkedKeys: [],
      checkedDsScope: [],
      defaultProps: {
        label: 'name',
        value: 'id'
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      menuIds: '',
      list: [],
      listLoading: true,
      form: {},
      roleId: undefined,
      roleCode: undefined,
      rolesOptions: undefined,
      dialogPermissionVisible: false,
      dialogViewVisible:false,
      roleManager_btn_add: false,
      roleManager_btn_edit: false,
      roleManager_btn_del: false,
      roleManager_btn_perm: false,
      show: false,
      roleType:[
        {
          label:'全部',
          value: null
        },
        {
          label:'内部角色',
          value: 0
        },
        {
          label:'合作机构角色',
          value: 1
        }
      ],
      isPartner: false
    }
  },
  created() {
    this.roleManager_btn_add = this.permissions['sys_role_add']
    this.roleManager_btn_edit = this.permissions['sys_role_edit']
    this.roleManager_btn_del = this.permissions['sys_role_del']
    this.roleManager_btn_perm = this.permissions['sys_role_perm']
    if(sessionStorage.getItem(`${this.$route.path}`)){
      let keepParams = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
      this.filters.keyWords = keepParams.params.keyword
      this.filters.isPartner = keepParams.params.isPartner
      this.page.currentPage = keepParams.params.current
      this.page.pageSize = keepParams.params.size
    }
  },
  computed: {
    ...mapGetters(['elements', 'permissions'])
  },
  mounted(){
    // this.getList()
  },
  methods: {
    handleDataPlus(row){
      this.$refs.permission.dataList = [];
      this.$refs.permission.countDialog = true;
      this.$refs.permission.roleInfo = row;
      this.$refs.permission.isPartner = row.isPartner;
      // this.$refs.permission.showInfo()
    },
    refresh(){
      this.page.currentPage = 1
      this.getList()
    },
    showCount(row){
      this.$refs.role.countDialog = true
      this.$refs.role.userForm = {};
      this.$refs.role.roleInfo = row
      this.$refs.role.page.total = 0;     
      this.$refs.role.isPartner = row.isPartner;
      this.$refs.role.showInfo()
    },
    getList() {
      this.listLoading = true
      let params = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        keyword:this.filters.keyWords,
        isPartner:this.filters.isPartner,
      }
      let keepParams = {
        params:params
      }
      sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
      getNewRoleList(params).then(response => {
        this.list = response.data.data.records
        this.page.total = response.data.data.total
        this.listLoading = false
      })
    },
    refreshChange() {
      this.page.currentPage = 1
      this.getList()
    },
    searchChange(form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList()
      done()
    },
    sizeChange(pageSize){
      this.page.pageSize = pageSize
      this.getList()
    },
    currentChange(current){
      this.page.currentPage = current
      this.getList()
    },
    handleCreate() {
      this.$refs.crud.rowAdd()
    },
    handleOpenBefore(show) {
      fetchTree().then(response => {
        this.dsScopeData = response.data.data
        if (this.form.dsScope) {
          this.checkedDsScope = (this.form.dsScope).split(',')
        } else {
          this.checkedDsScope = []
        }
      })
      show()
    },
    handleUpdate(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    cancal () {
      this.dialogPermissionVisible = false;
    },
    handleView(row) { //查看权限
      this.viewTitle = `查看权限 - ${row.roleName}`
      fetchRoleTree(row.roleId).then(response => {
        this.checkedKeys = response.data.data
        return fetchMenuTree()
      }).then(response => {
        this.treeData = response.data.data
        this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData, this.checkedKeys, [])
        this.dialogViewVisible = true
        this.roleId = row.roleId
        this.roleCode = row.roleCode
      })
    },
    handlePermission(row) {
      this.isPartner = row.isPartner;
      fetchRoleTree(row.roleId).then(response => {
        this.checkedKeys = response.data.data
        return fetchMenuTree()
      }).then(response => {
        this.treeData = response.data.data
        // 解析出所有的太监节点
        this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData, this.checkedKeys, [])
        this.dialogPermissionVisible = true
        this.plusTitle = `添加权限 - ${row.roleName}`
        this.roleId = row.roleId
        this.roleCode = row.roleCode
        this.$nextTick(()=>{
          this.handleDataPlus(row)
          this.updatePermession(this.roleId);
        })
      })
    },
    /**
       * 解析出所有的太监节点id
       * @param json 待解析的json串
       * @param idArr 原始节点数组
       * @param temp 临时存放节点id的数组
       * @return 太监节点id数组
       */
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          temp.push(idArr.filter(id => id === item.id))
        }
      }
      return temp
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData(data, done) {
      done()
    },
    reset(){
      this.filters.keyWords = "";
      this.filters.isPartner = null;
      this.page.currentPage = 1;
      this.getList()
    },
    handleDelete(row, index) {
      this.$confirm('是否确认删除名称为"' + row.roleName + '"' + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: "btn-custom-cancel",
        type: 'warning'
      }).then(function() {
        return delObj(row.roleId)
      }).then((res) => {
        if(res.data.code == CodeMsg.CODE_0){
          this.page.currentPage = 1
          this.getList()
          this.$notify.success('删除成功')
        }else{
          this.$notify.warning(res.data.msg);
        }
      })
    },
    create(row, done, loading) {
      this.form.dsScope = null
      addObj(this.form).then(() => {
        // this.page.currentPage = 1
        this.getList()
        done()
        this.$notify.success('创建成功')
      }).catch(() => {
        loading()
      })
    },
    update(row, index, done, loading) {
      putObj(this.form).then(() => {
        // this.page.currentPage = 1
        this.getList()
        done()
        this.$notify.success('修改成功')
      }).catch(() => {
        loading()
      })
    },
    updatePermession (roleId) {
      console.log(this.isPartner);
      this.menuIds = ''
      this.menuIds = this.$refs.menuTree.getCheckedKeys().length > 0 ? this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(',')) : '';
      let data =  new FormData()
      data.append('roleId',roleId)
      data.append('menuIds',this.menuIds)
      // permissionUpd(roleId,this.menuIds).then((res) => {
      permissionUpd(data).then((res) => {
        let permisssionIds = this.$refs.permission.dataList.map(item=>item.id);
        let dataIds = res.data.data.map(item => item.id);
        let arr = [];
        if(permisssionIds.length > 0){
          res.data.data.forEach((item) => {
            if(!permisssionIds.includes(item.id)){
              this.$refs.permission.dataList.push(item)
            }
          });
          for (let i = 0; i < this.$refs.permission.dataList.length; i++) {
            if(!dataIds.includes(this.$refs.permission.dataList[i].id)){
              this.$refs.permission.dataList.splice(i, 1);
              i--;
            }
          }
        }else{
          this.$refs.permission.dataList = res.data.data;
        }
        this.$refs.permission.dataList.forEach(item => {
          if(this.isPartner){
            item.dsPartnerType = 2;
          }else{
            item.dsPartnerType = null;
          }
        });
      })
    },
    confirmSave(roleId){
      this.menuIds = this.$refs.menuTree.getCheckedKeys().length > 0 ? this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(',')) : '';
      let param = {
        menuIds: this.menuIds || '',
        roleId: roleId,
        roleDataList: this.$refs.permission.dataList
      }
      roleUpdate(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$refs.permission.countDialog = false;
          this.dialogPermissionVisible = false;
          this.getList();
          this.$message({
            type:'success',
            message: res.data.msg
          })
        }else{
          this.$notify.warning(res.data.msg);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog__wrapper {
  .el-dialog {
    width: 61% !important;
  .dialog-main-tree {
    max-height: 540px;
    overflow-y: auto;
  }
  }
  .el-form-item__label {
    width: 20% !important;
    padding-right: 20px;
  }
  .el-form-item__content {
    margin-left: 20% !important;
  }
  }
  #count-style{
    color: rgb(64, 158, 255) !important;
    cursor: pointer
}
.role-input-sty{
    width: 260px;
    margin-right: 20px;
}
.role-form{
    margin-left: 10px;
}
.permissionTitle{
  font-weight: 550;
  font-size: 14px;
  color: #000000;
}
</style>
<style>
.role-index  .avue-crud__search .el-form-item--small.el-form-item{
  margin-left:-25px;
}
.role-index .el-col-sm-12{
  width: 22%;
}
</style>
