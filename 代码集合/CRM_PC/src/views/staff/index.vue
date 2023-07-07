<template>
  <div class="staff_index" v-if="permissions.sys_account_detail || permissions.sys_account_edit">
    <basic-container>
      <el-row>
        <el-form :model="searchForm" inline @keyup.enter.native="getList">
          <el-form-item label="关键字：">
            <el-input class="staff-input" placeholder="请输入姓名昵称关键字、工号、手机号" v-model="searchForm.keyword" />
          </el-form-item>
          <el-form-item label="组织部门">
            <el-cascader ref="dept" v-model="searchForm.deptId" :options= treeData :props="{value:'id', label: 'name', checkStrictly: true, emitPath: false}"  @change="getDeptId"/>
          </el-form-item>
          <el-form-item label="公众号：">
            <el-select v-model="searchForm.wx">
              <el-option
                v-for="item in officalStatus"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-button size="mini" type="primary" @click="getList">搜索</el-button>
          <el-button size="mini" @click="reset" >重置</el-button>
          <div class="senior-box">
            <el-checkbox v-model="senior">高级搜索</el-checkbox>
          </div>
          <div v-if="senior">
            <el-form-item label="员工状态：">
              <el-select v-model="searchForm.status" @change="getList">
                <el-option
                  v-for="item in staffStatus"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="账号状态：">
              <el-select v-model="searchForm.lockFlag" @change="getList">
                <el-option
                  v-for="item in accountStatus"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="性别：" @change="getList">
              <el-select v-model="searchForm.sex">
                <el-option
                  v-for="item in sexList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="职位职级：">
              <el-cascader v-model="searchForm.positionRank" :options= positionRankList :props="{value:'id', label: 'rankLevel',children: 'ttPositionRankList',checkStrictly: true}"/>
            </el-form-item>
            <el-form-item label="入职时间：">
              <el-date-picker
                v-model="searchForm.entryTime"
                :unlink-panels="true"
                type="datetimerange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :range-separator="$t('message.to')"
                :start-placeholder="$t('message.startDate')"
                :end-placeholder="$t('message.endDate')">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
        <el-col class="user__main">
          <avue-crud
            ref="crud"
            :option="option"
            v-model="form"
            :page.sync="page"
            :table-loading="listLoading"
            :before-open="handleOpenBefore"
            :data="list"
            :search.sync="search"
            @on-load="getList"
            @search-change="searchChange"
            @refresh-change="refreshChange"
            @size-change="sizeChange"
            @current-change="currentChange"
            @row-update="update"
            @search-reset="reset"
            :before-close="beforeClose"
            @row-save="create">
            <template slot-scope="{ size }" slot="deptIdSearch">
              <avue-input-tree
                v-model="search.deptId"
                :size="size"
                :node-click="getNodeData"
                :dic="treeData"
                :props="defaultProps"
                placeholder="请选择所属部门"/>
            </template>
            <template slot="menuLeft">
              <el-button
                class="filter-item"
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="permissions.sys_account_edit ? $refs.crud.rowAdd() : $notAuthorized()">添加员工</el-button>
            </template>
            <template slot="entryTimeSearch">
              <el-date-picker
                v-model="entryTime"
                :unlink-panels="true"
                type="datetimerange"
                format="yyyy-MM-dd"
                :range-separator="$t('message.to')"
                :start-placeholder="$t('message.startDate')"
                :end-placeholder="$t('message.endDate')">
              </el-date-picker>
            </template>
            <template slot="wx" slot-scope="scope">
              <span v-if="scope.row.wxOpenid !== null">已关注</span>
              <span v-else>未关注</span>
            </template>
            <template slot="number" slot-scope="scope">
              <span
                class="staff_pointer_sty"
                @click="toDetail(scope.row, scope.index)">{{ scope.row.number }}</span>
            </template>
            <template slot="username" slot-scope="scope">
              <span
                class="staff_pointer_sty"
                @click="toDetail(scope.row, scope.index)">{{ scope.row.username }}</span>
            </template>
            <template slot="positionIdHeader">
              <span>职位/职级</span>
            </template>
            <template slot="positionId" slot-scope="scope">
              <span>{{ scope.row.positionName }}-<span v-for="(item, index) in scope.row.positionRankName" :key="index">{{item}};</span></span>
            </template>
            <!-- <template slot="positionRankName" slot-scope="scope">
              <span v-for="(item, index) in scope.row.positionRankName" :key="index">{{item}}、</span>
            </template> -->
            <template slot="stationId" slot-scope="scope">
              <span>{{ scope.row.stationId }}</span>
            </template>
            <template slot="status" slot-scope="scope">
              <span>{{ scope.row.status | status }}</span>
            </template>
            <template slot="empName" slot-scope="scope">
              <span
                class="staff_pointer_sty"
                @click="toDetail(scope.row, scope.index)">
                <el-tooltip effect="dark" :content=" '工号：'+ scope.row.number + ' 部门：' + scope.row.deptName" placement="right">
                  <span>{{ scope.row.name }}</span>
                </el-tooltip>
              </span>
            </template>
            <template slot="empGender" slot-scope="scope">
              <span>{{ scope.row.sex | gnderFilter }}</span>
            </template>
            <template slot="deptId" slot-scope="scope">
              <span>{{ scope.row.deptName }}</span>
            </template>
            <template slot="role" slot-scope="scope">
              <span v-for="(role, index) in scope.row.roleList" :key="index">
                <el-tag
                  style="cursor: pointer;"
                  @click="permissions.sys_role_perm ? handlePermission(role,scope.row) : $notAuthorized()">{{ role.roleName }}
                </el-tag>&nbsp;&nbsp;
              </span>
            </template>
            <template slot="lockFlag" slot-scope="scope">
              <el-tag v-if="scope.row.lockFlag == 0">{{scope.row.lockFlag | lockFilter}}</el-tag>
              <el-tag v-if="scope.row.lockFlag == 9" type="danger">{{scope.row.lockFlag | lockFilter}}</el-tag>
            </template>
            <template slot="menu" slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-view"
                @click="toDetail(scope.row, scope.index)">详情</el-button>
              <!-- <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="permissions.sys_account_edit ? handleUpdate(scope.row, scope.index) : $notAuthorized()">编辑</el-button> -->
              <!-- <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="deletes(scope.row,scope.index)">删除</el-button> -->
              <el-button
                v-if="scope.row.lockFlag == 0"
                type="text"
                size="small"
                icon="el-icon-circle-close"
                @click="permissions.sys_account_edit ? startStatus(scope.row, 9) : $notAuthorized()">禁用</el-button>
              <el-button
                v-if="scope.row.lockFlag == 9"
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="permissions.sys_account_edit ? startStatus(scope.row, 0) : $notAuthorized()">启用</el-button>
            </template>
            <template slot="deptIdForm">
              <avue-input-tree
                v-model="deptId"
                :node-click="getNodeData"
                :dic="treeDeptData"
                :props="defaultProps"
                placeholder="请选择所属部门"/>
            </template>
            <template slot="businessGroupIdForm">
              <avue-select
                v-model="businessGroupId"
                :dic="repeatDeptOptions"
                :props="repeatDeptProps"
                placeholder="请选择查重部门"/>
            </template>
            <template slot="stationIdForm">
              <avue-select
                v-model="stationId"
                :dic="stationOptions"
                :props="stationProps"
                filterable
                placeholder="请选择岗位等级"/>
            </template>
            <template slot="positionIdForm">
              <avue-select
                v-model="positionId"
                @change="getJobNodeData"
                :disabled="!deptId"
                :dic="jobOptions"
                :props="jobProps"
                placeholder="请选择职位"/>
            </template>
            <template slot="positionRankNameForm">
              <el-select v-model="positionRankName" :disabled="!positionId" multiple @click.native.stop="getPositionRank()" @change="changeRank">
              </el-select>
              <!-- <avue-select
                v-model="positionRankId"
                :dic="positionRankOptions"
                :props="rankProps"
                placeholder="请选择职级">
              </avue-select> -->
            </template>
            <template slot="statusForm">
              <avue-select
                v-model="status"
                :dic="statusOptions"
                placeholder="请选择员工状态"/>
            </template>
            <template slot="credentialsTypeForm">
              <avue-select
                v-model="credentialsType"
                :dic="credentialsTypeOptions"
                placeholder="请选择证件类型"/>
            </template>
            <template slot="educationIdForm">
              <avue-input-tree
                v-model="educationId"
                :dic="educationOptions"
                :props="defaultProps"
                placeholder="请选择学历"/>
            </template>
            <template slot="credentialsNumberForm">
              <avue-input v-model="credentialsNumber" placeholder="请输入身份证号码" />
            </template>
            <!-- <template slot="roleForm">
              <avue-select
                v-model="role"
                :dic="rolesOptions"
                :props="roleProps"
                multiple
                placeholder="请选择角色"/>
            </template> -->
            <template slot="entryTimeForm">
              <avue-date v-model="form.entryTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择日期"></avue-date>
            </template>
          </avue-crud>
        </el-col>
      </el-row>
      <!-- 权限 -->
      <el-dialog
        :visible.sync="dialogPermissionVisible"
        :close-on-click-modal="false"
        :title="roleTitle">
        <div class="user_info">查看权限- {{userInfo.name}} ( {{ userInfo.deptName }} )</div>
        <div class="dialog-main-tree">
          <div class="data_jurisdiction">菜单权限</div>
          <el-tree
            ref="menuTree"
            :data="treeDataRole"
            :default-checked-keys="stateData"
            :check-strictly="false"
            :props="defaultProps"
            class="filter-tree"
            node-key="id"
            show-checkbox
            highlight-current/>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="default" size="small" @click="cancal()">取消</el-button>
        </div>
        <div class="border_sty"></div>
        <div class="data_jurisdiction">数据权限</div>
        <table border class="table_sty" >
          <tr>
            <th>序号</th>
            <th>数据名称</th>
            <th>组织部门</th>
            <th>查重部门</th>
          </tr>
          <tr v-for=" (item,index) in dataJurisdiction" :key="item.id">
            <td>{{ index+1 }}</td>
            <td>{{ item.menuName }}</td>
            <td @click="organizationDepartment(item)" :class="item.dsType==1 ? 'organizationDepartment' :''">{{ item.dsType |duplicateChecking() }}</td>
            <td @click="duplicateChecking(item)" :class="item.dsCheckType==1 ? 'organizationDepartment' :''">{{ item.dsCheckType | duplicateChecking()}}</td>
          </tr>
        </table>
      </el-dialog>
    </basic-container>

    <!-- 职级选择 -->
    <el-dialog :visible.sync="positionRankDialog" :close-on-click-modal="false" :before-close="cancelSetRank" title="选择职级" width="800px">
      <div class="dialog-box">
        <div v-for="item in filterPositionList" :key="item.positionRankId" class="rank-check">
          <p v-if="item.list.length > 0">{{item.name}}</p>
          <el-radio-group v-model="item.rankId" class="radio-group-rank">
            <el-radio v-for="el in item.list" :key="el.positionRankId" :label="el.positionRankId" @click.native.prevent="changeRadio($event,item,el.positionRankId)">{{el.rankLevel}}({{el.description}})</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div slot="footer">
        <el-button size="mini" @click="cancelSetRank()">取消</el-button>
        <el-button size="mini" type="primary" @click="setPositionRank(filterPositionList)">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="customState" :visible.sync="customDialog"   width="40%">
      <el-tree
        ref="menuTree"
        :data="customTreeData"
        :default-checked-keys="pitchOnList"
        :check-strictly="false"
        :props="defaultProps"      
        :filter-node-method="filterNode"
        class="filter-tree"
        node-key="id"
        highlight-current
        :default-expand-all="true"
        show-checkbox/>
        <!-- node-key="id"
        ref="menuTree"
        :data="customTreeData"
        :default-checked-keys="pitchOnList"
        :check-strictly="false"
        class="filter-tree"
        highlight-current
        show-checkbox/> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="customDialog = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  delObj,
  fetchList,
  addEmp,
  editEmp,
  getEmpDetail,
  setEmpStatus,
  newsetEmpStatus,
  repeatDeptList,
  listPositionTree,
} from "@/api/admin/user";
import { deptRoleList, getJurisdiction } from "@/api/admin/role";
import { getEducationOptions, getPosition, listPositionRankByPositionId, getDefaultByDeptId } from "@/api/staff/index";
import { fetchNewTree, getStationList } from "@/api/admin/dept";
import { tableOption } from "@/const/crud/admin/user";
import { mapGetters } from "vuex";
import * as CodeMsg from "@/api/common/CodeChange"
import { fetchMenuTree } from "@/api/admin/menu";
import { saveDetal } from "@/util/clearDetail";
import staffData from './staff-data'
import Vue from 'vue'
export default {
  name: "SysUser",
  data() {
    return {
      orderId:null,
      taskOpenState:null,
      customState:'',
      userInfo:{},
      pitchOnList:[],
      customTreeData:[],
      customDialog:false,
      dataJurisdiction:[],
      stateData:[],
      deptPositonId: '',
      positionRankList: [],
      officalStatus: staffData.officalStatus,
      sexList: staffData.sexList,
      accountStatus: staffData.accountStatus,
      staffStatus: staffData.staffStatus,
      senior: false,
      positionRankDialog: false,
      positionList: [],
      rankId: null,
      tab: '0',
      selectedRank: [],
      positionRankName: [],
      roleTitle: "",
      dialogPermissionVisible: false,
      defaultProps: {
        label: "name",
        value: "id",
      },
      entryTime: "",
      treeDataRole: [],
      checkedKeys: [],
      empInfo: {},
      roleIdList: [],
      search: {},
      deptId: "",
      businessGroupId: null,
      positionId: null,
      positionRankIds: null,
      stationId: null,
      status: null,
      credentialsType: null,
      credentialsNumber: null,
      educationId: null,
      searchForm: {},
      treeOption: {
        nodeKey: "id",
        addBtn: false,
        menu: false,
        props: {
          label: "name",
          value: "id",
        },
      },
      treeData: [],
      option: tableOption,
      treeDeptData: [],
      checkedKeys: [],
      roleProps: {
        label: "roleName",
        value: "roleId",
      },
      repeatDeptProps:{
        label: 'businessGroupName',
        value: 'id'
      },
      stationProps:{
        label:'levelAndName',
        value: 'stationId'
      },
      jobProps:{
        label:'positionName',
        value: 'positionId'
      },
      // rankProps:{
      //   label:'rankLevel',
      //   value: 'positionRankId'+'rankLevel'
      // },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        pageSizes: [5, 8, 10, 20, 30, 50, 100],
        isAsc: false, // 是否倒序
      },
      list: [],
      listLoading: true,
      role: [],
      form: {},
      rolesOptions: [],
      repeatDeptOptions: [],
      stationOptions: [],
      jobOptions: [],
      positionRankOptions: [],
      statusOptions: [{
        label: '试用',
        value: '1'
      }, {
        label: '正式',
        value: '2'
      },{
        label:'实习',
        value: '3'
      }],
      credentialsTypeOptions:[
        {
          label: '居民身份证',
          value: '1'
        }
      ],
      educationOptions: []
    };
  },
  filters: {
    duplicateChecking(val){
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
    },
    lockFilter(val) {
      return val == 0 ? "正常" : val == 9 ? "禁用" : "不详";
    },
    gnderFilter(val) {
      return val == 0 ? "女" : val == 1 ? "男" : "不详";
    },
    focusFilter(val) {
      return val == 1 ? "已关注" : val == 0 ? "未关注" : "不详";
    },
    status(val){
      return val == 1 ? '试用' : val == 2 ? '正式' : val == 3 ? '实习' : '/'
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
    filterPositionList(){
      return this.positionList.filter(item => item.list.length > 0);
    },
  },
  watch: {
    role() {
      this.form.role = [45];//默认一个基本角色
    },
    deptId() {
      this.form.deptId = this.deptId;
    },
    businessGroupId() {
      this.form.businessGroupId = this.businessGroupId;
    },
    positionId() {
      this.form.positionId = this.positionId;
    },
    positionRankIds() {
      this.form.positionRankIds = this.positionRankIds;
    },
    positionRankName() {
      this.form.positionRankName = this.positionRankName;
    },
    stationId() {
      this.form.stationId = this.stationId
    },
    status() {
      this.form.status = this.status;
    },
    credentialsType() {
      this.form.credentialsType = this.credentialsType;
    },
    educationId() {
      this.form.educationId = this.educationId;
    },
    credentialsNumber() {
      this.form.credentialsNumber = this.credentialsNumber;
      if(this.form.credentialsNumber.length == 18){
        this.getBirthday(this.form.credentialsNumber);
      };
    },
  },
  created() {
    if (!this.permissions.sys_account_detail && !this.permissions.sys_account_edit) this.$notAuthorized()
    this.searchForm.lockFlag = "0";
    this.search.lockFlag = "0";
    this.credentialsType = '1';
    this.searchForm.status = null;
    this.search.status = null;
    this.sys_account_edit = this.permissions["sys_account_edit"];
    this.sys_account_edit = this.permissions["sys_account_edit"];
    this.sys_user_del = this.permissions["sys_user_del"];
    if (JSON.parse(sessionStorage.getItem(`${this.$route.path}`))) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      if (keepParams.detail.path !== "") {
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query,
        });
        return;
      }
      this.search = keepParams.params;
      this.searchForm = keepParams.params;
      this.entryTime = keepParams.createTime;
    }
    this.getInitPositionTree();
    this.init();

  },
  mounted(){
  },
  methods: {
    changeRadio(el,item,val){
      this.$nextTick(()=>{
        if(el.target.tagName === 'INPUT'){ 
          return;
        }else{
          if(item.rankId == val && item.flag != 1 ){
            this.$set(item,'rankId', null);
            this.$set(item, 'flag', 1);
          }else{
            this.$set(item,'rankId', val);
            this.$set(item, 'flag', 0);
          }
        }
      })
      this.$forceUpdate();
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    organizationDepartment(val){
      if(val.dsType==1){
        this.customState= '自定义部门-组织部门'
        this.customDialog=true,
        this.customTreeData=this.treeData
        let dsScope = val.dsScope.split(",")
        let dsScopelist=[]
        dsScope.forEach(item=>{
          dsScopelist.push(Number(item))
        })
        this.pitchOnList=dsScopelist
      }
    },
    repeatDeptList(){
        repeatDeptList().then(res=>{
          this.businessGroupId = '';
          this.customTreeData = res.data.data.map((item)=>{
            return {name:item.businessGroupName,id:item.id}
          })
        })
      },
    async duplicateChecking(val){
      if(val.dsCheckType==1){
        await this.repeatDeptList()
        this.customState='自定义部门-查重部门'
        this.customDialog=true
        let dsCheckScope = val.dsCheckScope.split(",")
        let dsScopelist=[]
        dsCheckScope.forEach(item=>{
          dsScopelist.push(Number(item))
        })
        this.pitchOnList=dsScopelist
      }
    },
    getDeptId(){
      this.$nextTick(()=>{
        let deptInfo = this.$refs.dept.getCheckedNodes()[0].data;
        this.deptPositonId = deptInfo.id;
        this.getInitPositionTree();
      })
    },
    getInitPositionTree(){
      listPositionTree(this.deptPositonId).then(res=>{
        this.positionRankList = res.data.data;
      })
    },
    getBirthday(userCard){
      let year = userCard.substring(6, 10);
      let month = userCard.substring(10, 12);
      let day = userCard.substring(12, 14);
      this.form.birthday = year+'-'+month+'-'+day;
    },
    beforeClose(done){
      this.repeatDeptOptions = [];
      this.businessGroupId= null,
      this.positionId= null,
      this.positionRankIds= null,
      this.positionRankName= [],
      this.stationId= null,
      this.status= null,
      this.credentialsType= null,
      this.credentialsNumber= null,
      this.educationId= null,
      done()
    },
    cancal() {
      this.dialogPermissionVisible = false;
    },
    handlePermission(role,scope) {
      this.userInfo=scope
      getJurisdiction(role.roleId)
        .then((response) => {
          this.checkedKeys = response.data.data.sysRoleDataVOList;
          this.stateData=response.data.data.menuIdList,
          this.dataJurisdiction=response.data.data.sysRoleDataVOList
          return fetchMenuTree();
        })
        .then((response) => {
          this.treeDataRole = response.data.data;
          // console.log(this.treeDataRole);
          // 解析出所有的太监节点
          this.stateData = this.resolveAllEunuchNodeId(
            this.treeDataRole,
            this.stateData,
            []
          );
          this.dialogPermissionVisible = true;
        });
    },
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i];
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp);
        } else {
          temp.push(idArr.filter((id) => id === item.id));
        }
      }
      return temp;
    },
    toDetail(row, index) {
      let path = "/staff-detail";
      let query = {
        empName: row.username,
        id: row.userId,
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    init() {
      let params = {
        menuFlag: "emp_list",
      };
      fetchNewTree(params).then((response) => {
        this.clearChild(response.data.data);
        this.treeData = response.data.data;
      });
      getStationList().then(res => {
        this.stationOptions = res.data.data
      })
      getEducationOptions().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.educationOptions = res.data.data;
        }
      })
    },
    clearChild(arr){//清除空children
      arr.forEach(el => {
        if(el.children.length == 0){
          Vue.delete(el,'children')
        }else{
          this.clearChild(el.children)
        }
      });
    },
    nodeClick(data) {
      this.page.currentPage = 1;
      this.getList(this.page, { deptId: data.id });
    },
    //获取员工列表
    getList(page, params) {
      if (this.searchForm.entryTime) {
        this.searchForm.beginTime = this.searchForm.entryTime[0] || null;
        this.searchForm.endTime = this.searchForm.entryTime[1] || null;
      }
      if(this.searchForm.positionRank && this.searchForm.positionRank.length >0){
        this.$set(this.searchForm,'positionId',this.searchForm.positionRank[0] || null);
        this.$set(this.searchForm,'positionRankId',this.searchForm.positionRank[1] || null);
      }
      this.listLoading = true;
      if (params && params.keyword) {
        params.keyword = params.keyword.trim();
      }
      // 需要缓存的参数
      let keepParams = {
        params: this.searchForm,
        createTime: this.entryTime,
        detail: { path: "", query: {} },
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      fetchList(
        Object.assign(
          {
            current: this.page.currentPage,
            size: this.page.pageSize,
          },
          params,
          this.searchForm
        )
      ).then((res) => {
        this.list = res.data.data.records;
        this.page.total = res.data.data.total;
        this.listLoading = false;
      });
    },
    changeRank(val){
      this.positionRankIds = [];
      this.selectedRank = [];
      this.positionList.forEach(item => {
        item.list.forEach(el => {
          item.rankId = null;
          if(val.includes(el.rankLevel)){
            item.rankId = el.positionRankId;
            this.positionRankIds.push(el.positionRankId)
            this.selectedRank.push(el);
          }
        });
      });
    },
    cancelSetRank(){
      this.filterPositionList.forEach(item => {
        item.list.forEach(element => {
          if(this.positionRankIds.includes(element.positionRankId)){
            this.$set(item,'rankId',element.positionRankId);
          }
        });
      });
      this.positionRankDialog = false;
    },
    setPositionRank(val){
      let rankInfo = val.filter(item => item.list.length > 0);
      rankInfo.forEach(el => {
        if(el.rankId != null){
          el.list.forEach(element => {
            if(element.positionRankId == el.rankId){
              this.selectedRank.forEach( (el, index) => {
                if(el.category == element.category){
                  this.selectedRank.splice(index, 1);
                }
              });
              this.selectedRank.push(element);
            }
          });
        }else{
          el.list.forEach(element => {
            this.selectedRank.forEach( (el, index) => {
              if(el.positionRankId == element.positionRankId){
                this.selectedRank.splice(index, 1);
              }
            });
          });
        }
      });
      this.positionRankIds = [];
      this.positionRankName = [];
      this.selectedRank.forEach( item => {
        this.positionRankName.push(item.rankLevel);
        this.positionRankIds.push(item.positionRankId);
      });
      if(this.selectedRank.length == 0){
        this.$message.warning('请选择至少一个职级！')
      }else{
        this.positionRankDialog = false;
      }
    },
    getPositionRank(){
      console.log(this.positionRankName);
      if(this.positionId){
        this.positionRankDialog = true;
      }
    },
    getJobNodeData(val){
      this.positionRankName = [];
      this.positionRankIds = null;
      this.selectedRank = [];
      this.positionList.forEach(item => {
        item.rankId = null
      });
      this.positionList = [];
      if(val){
        listPositionRankByPositionId(val).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            let managements = {
              name: '技术类',
              category: '0',
              list: []
            }
            let technicals = {
              name: '管理类',
              category: '2',
              list: []
            }
            let markets = {
              name: '市场类',
              category: '1',
              list: []
            }
            res.data.data.forEach( item => {
              if(item.category == 0){
                managements.list.push(item)
              }
              if(item.category == 1){
                markets.list.push(item)
              }
              if(item.category == 2){
                technicals.list.push(item)
              }
            });
            this.positionList.push(technicals,markets,managements);
          }
        })
      }
      // this.jobOptions.forEach( el => {
      //   if(el.id == val){
      //     this.positionRankOptions = el.ttPositionRankList;
      //   }
      // });
    },
    getNodeData(val) {
      this.positionId = null;
      this.positionRankIds = null;
      this.positionRankName = [];
      getPosition(val.id).then(res=>{
        this.jobOptions = res.data.data
      })
      deptRoleList().then((response) => {
        this.rolesOptions = response.data.data;
      });
      repeatDeptList().then(res=>{
        this.businessGroupId = '';
        this.repeatDeptOptions = res.data.data;
        getDefaultByDeptId(val.id).then(res=>{//获取查重部门
          if(res.data.code == CodeMsg.CODE_0){
            this.businessGroupId = res.data.data.id
          }else{
            this.$message({
              type:'warning',
              message: res.data.msg
            })
          }
        })
        // try {
          // this.repeatDeptOptions.forEach(item => { //查重部门list
          //   if(item.deptId == val.id){ // 当前层
          //     this.businessGroupId = item.id;
          //     throw new Error();
          //   }else{
          //     if( item.deptId == val.parentId ){ //上一层
          //       this.businessGroupId = item.id;
          //     }else{//两层以上
          //       this.treeData.forEach( el => {
          //         this.findChild(el, val.parentId, item.id);
          //       });
          //     };
          //   }
          // });
        // } catch (error) {

        // };
      })
    },
    // findChild(data,parentId,repeatId){
    //   if(data.children &&data.children.length > 0){
    //     data.children.forEach(element => {
    //       if(parentId == element.id){
    //         this.businessGroupId = repeatId
    //       }else{
    //         this.findChild(data.children);
    //       };
    //     });
    //   }
    // },
    searchChange(param, done) {
      this.searchForm = param;
      if (this.searchForm.entryTime !== "") {
        this.searchForm.beginTime = this.searchForm.entryTime[0] || null;
        this.searchForm.endTime = this.searchForm.entryTime[1] || null;
      }
      this.page.currentPage = 1;
      this.getList(this.page, this.searchForm);
      done();
    },
    sizeChange(val) {
      console.log(val,'sizeChange')
      // this.page.pageSize = val;
      // this.getList(this.page);
    },
    reset() {
      this.search = {};
      this.searchForm = {};
      this.search.lockFlag = "0";
      this.searchForm.lockFlag = "0";
      this.entryTime = "";
      this.deptPositonId = '';
      this.getInitPositionTree();
      this.getList(this.page);
    },
    currentChange(current) {
      console.log(current,'currentChange')
      this.page.currentPage = current;
      // this.getList(this.page);
    },
    refreshChange(val) {
      console.log(val,'refreshChange')
      // this.getList(this.page);
    },
    handleOpenBefore(show, type) {
      window.boxType = type;
      this.deptId = "";
      // 查询部门树
      let params = {
        menuFlag: "achievements_list",
      };
      fetchNewTree().then((response) => {
        this.treeDeptData = response.data.data;
      });
      // 查询角色列表
      deptRoleList(params).then((response) => {
        this.rolesOptions = response.data.data;
      });
      if (["edit", "views"].includes(type)) {
        this.role = [];
        for (let i = 0; i < this.form.userVO.roleList.length; i++) {
          this.role[i] = this.form.userVO.roleList[i].roleId;
        }
      } else if (type === "add") {
        this.role = [];
      }
      show();
    },
    handleUpdate(row, index) {
      let path = "/staff-edit";
      let query = {
        empName: row.username,
        id: row.userId,
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    create(row, done, loading) {
      var han = /^[\u4e00-\u9fa5]+$/;
      //新添加的
      if (this.form.password !== this.form.password1) {
        this.$message({
          type: "warning",
          message: "两次密码输入不一致",
        });
        loading();
      } else {
        if (
          this.form.nickname == this.form.empName ||
          this.form.nickname == this.form.username
        ) {
          this.$message({
            type: "warning",
            message: "昵称不能和姓名或用户名重复！",
          });
          loading();
        } else {
          this.form.lockFlag = "0";
          this.form.name = this.form.empName;
          this.form.sex = this.form.empGender;
          this.form.entryTime = this.$moment(this.form.entryTime).format(
            "YYYY-MM-DD"
          );
          let params = this.form;
          addEmp(params).then((res) => {
            if (res.data.data.code == 0) {
              this.getList(this.page);
              this.repeatDeptOptions = [];
              this.businessGroupId = null;
              this.positionRankIds = [];
              this.positionRankName = [];
              this.$notify.success("创建成功!");
              done();
            } else {
              this.$message({
                type: "warning",
                message: res.data.data.msg,
                offset: 300,
              });
              loading();
            }
          });
        }
      }
    },
    update(row, number) {
      this.form.userVO = "";
      let params = {
        //姓名
        name: this.form.empName,
        //用户名
        pigUserName: this.form.pigUserName,
        //性别
        gender: this.form.empGender,
        //手机号
        phone: this.form.phone,
        number: this.form.number,
        //对象
        userDTO: this.form,
      };
      this.setUser(params);
    },
    startStatus(row, val) {
      this.getDetail(row.username);
      val == 0 ? (this.infoConfirm = "启用") : (this.infoConfirm = "禁用");
      this.$confirm("确定" + this.infoConfirm + "该员工？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(() => {
        this.setEmp(row, val);
      });
    },
    setEmp(row, val) {
      let params = {
        userId: row.userId,
        lockFlag: String(val),
        username: row.username,
      };
      if (val == 0) {
        newsetEmpStatus(params).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: "success",
              message: "操作成功！",
            });
            this.getList(this.page);
          }
        });
      } else {
        setEmpStatus(params).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: "success",
              message: "操作成功！",
            });
            this.getList(this.page);
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
            });
          }
        });
      }
    },
    getDetail(name) {
      getEmpDetail(name).then((res) => {
        this.empInfo = res.data.data;
      });
    },
    //编辑员工信息
    setUser(params) {
      editEmp(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: this.$t("alert.sucessEdit"),
          });
          this.getList(this.page);
        }
      });
    },
    deletes(row, index) {
      this.$confirm(
        "此操作将永久删除该用户(用户名:" + row.username + "), 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        delObj(row.userId)
          .then(() => {
            this.list.splice(index, 1);
            this.$notify.success("删除成功");
          })
          .catch(() => {
            this.$notify.error("删除失败");
          });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.radio-group-rank{
  display: grid;
  grid-template-columns: repeat(5,1fr);
  grid-gap:10px;
}
.border_sty{
  width: 100%;
  height: 1px;
  border-top:1px solid #000;
  margin: 30px 0 ;
}
.user_info{
  font-size: 20px;
  color: #000;
}
.organizationDepartment{
  color:rgb(106, 172, 238)
}
.table_sty{
  color: #000;
  width: 100%;
}
.table_sty tr>th:first-child{
  width: 10%;
}
.table_sty tr>td{   
  text-align: center;
}
.data_jurisdiction{
  color: #000;
  margin:10px 0;

}
.staff_index {
  height: 100%;
}
.classify_header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}
.item {
  margin-top: 0px;
  margin-right: 40px;
}
.avue-form__group--flex {
  margin-left: -30px;
}
.staff_pointer_sty{
  color: #409eff;
  cursor: pointer
}
</style>
<style>
.staff_index .el-card {
  border: none;
}
.staff_index .avue-form__menu--center {
  text-align: left;
}
.staff_index .el-card__body {
  padding-bottom: 0px;
}
.rank-check{
  margin: 0;
}
.senior-check{
  display: block;
  margin-bottom: 10px;
}
.senior-box{
  margin-bottom: 10px;
}
.staff-input{
  width: 250px;
}
.dialog-box{
  min-height: 250px;
}
</style>
