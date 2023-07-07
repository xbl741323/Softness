<!-- 客户管理-线索客户 -->
<!-- 排查完成 -->
<template>
  <basic-container>
    <div>
     <div class="client-type">
        <span class="client-name-sty">线索类型：</span>
        <el-radio-group v-model="clueType" @change="changeTab()">
          <el-radio-button border :label="1" class="client-btn-sty">{{ $t("message.unit") }}</el-radio-button>
          <el-radio-button border :label="0" class="client-type-sty">{{ $t("message.solo") }}</el-radio-button>
        </el-radio-group>
      </div>
      <el-form @keyup.enter.native="getFirstAllList()" :model="filters" ref="filters" class="search" inline label-width="90">
        <el-form-item label="关键字：" prop="keyWords">
          <el-input :placeholder="clueType==1?'单位名称关键字或完整线索编号/手机号/信用代码':'请输入联系人姓名/单位名称关键字或完整ID/手机号'" class="keyword" v-model.trim="filters.keyWords"></el-input>
        </el-form-item>
        <el-form-item label="地区：" prop="orgAddress">
          <el-cascader :options="areaTree" v-model="filters.orgAddress" :props="{value: 'id',label: 'areaName'}"/>
        </el-form-item>
        <el-form-item label="客户归属：" prop="customerBelong">
          <el-input v-model.trim="filters.customerBelong" placeholder="请输入员工姓名/工号"></el-input>
        </el-form-item>
        <el-form-item label="线索归属：" prop="clueBelonging">
          <el-input v-model.trim="filters.clueBelonging" placeholder="请输入员工姓名/工号"></el-input>
        </el-form-item>
        <el-form-item label="业务员：" prop="salesman">
          <el-input v-model.trim="filters.salesman" placeholder="请输入员工姓名/工号"></el-input>
        </el-form-item>
        <el-button size="small" type="primary" @click="getFirstAllList()">搜索</el-button>
        <el-button size="small" @click="resetForm()">重置</el-button>
        <!-- 高级搜索 -->
        <div class="senior-check">
          <el-checkbox v-model="senior">{{$t("message.hignSearch")}}</el-checkbox>
        </div>
        <div v-if="senior" class="senior-contain">
          <el-form-item label="线索状态" prop="clueStatus">
            <el-select v-model="filters.clueStatus">
              <el-option label="全部" value=""></el-option>
              <el-option label="正常" :value="0"></el-option>
              <el-option v-if="!userInfo.isPartner" label="公海" :value="2"></el-option>
              <el-option label="失效" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="线索标签：" prop="clueLabel">
           <el-select v-model="filters.clueLabel" >
            <el-option v-for="item in clueLabelList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="单位类型：" prop="orgTypeId">
            <el-select v-model="filters.orgTypeId">
              <el-option @change="getOrgTypeName(item)" v-for="item in unitTypeList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="行业：" prop="industryTypeList">
            <el-select v-model="filters.orgIndustryNo" multiple :multiple-limit="3">
              <el-option v-for="item in industryTypeList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="线索提供方：" v-if="!userInfo.isPartner">
            <el-select v-model="filters.customerOwner">
              <el-option label="全部" value=""/>
              <el-option v-for="(item,index) in customerOwnerList" :key="index" :label="item.partnerName" :value="item.partnerId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="创建人：" prop="createMan">
          <el-input v-model.trim="filters.createMan" placeholder="请输入员工姓名/工号"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="createTime">
              <el-date-picker
                v-model="filters.createTime"
                :unlink-panels="true"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          <el-form-item label="最近跟进时间：" prop="createTime">
              <el-date-picker
                v-model="filters.followTime"
                :unlink-panels="true"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
        </div>
      <div class="distri-btn" v-if="!userInfo.isPartner">
        <el-button class="distributionBtn" type="primary" @click="permissions.bt_allot_clue_attr ? distrBelong(0) : $notAuthorized()" :disabled="clueList.length == 0">分配线索归属</el-button>
        <el-button class="distributionBtn" type="primary" @click="permissions.bt_allot_clue_salesman ? distrBelong(1) : $notAuthorized()" :disabled="clueList.length == 0">分配业务员</el-button>
        <!-- <el-button type="primary" @click="permissions.bt_initiate_authentication ? judgeStatus() : $notAuthorized()" :disabled="clueList.length != 1">发起认证</el-button> -->
      </div>
      </el-form>
      <!-- 单位线索列表 -->
      <div v-show="clueType == 1">
        <avue-crud ref="crudTable"
        v-if="clueType == 1"
        class="batch-choose clue_table"
        :data="dataList"
        :table-loading="tableLoading"
        :option="tableOption"
        :page.sync="page"
         @sort-change="changeSort"
         @selection-change="selectionChange"
         @size-change="sizeChange"
         @current-change="currentChange"
         @on-load="getList">
        <template slot="clueNo" slot-scope="scope">
          <div class="clue-no-contain">
            <span class="orgName" @click="checkDetail(scope.row)">{{scope.row.clueNo}}</span>
            <span :class="['auth-status',scope.row.clueStatusId == 1?'fail-status':'']" v-if="scope.row.clueStatusId!=0&&scope.row.clueStatusId!=4">{{ scope.row.clueStatusId|filterClueStatus }}</span>
            <span :class="['auth-status','green-sty']" v-if="!userInfo.isPartner&&scope.row.clueStatusId==4">机构</span>
          </div>
        </template>
        <template slot="companyName" slot-scope="scope">
          <div class="certify-contain">
            <span class="companyName-sty" @click="checkDetail(scope.row)">{{scope.row.companyName}}</span>
          </div>
        </template>
        <template slot="clueBelong" slot-scope="scope">
          <div class="disbale_content">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right">
            <span @mouseenter="showUserInfo(scope.row.clueAttributionEmpId)" :class="[(scope.row.clueStatusId == 2||scope.row.clueStatusId == 3)?'gray-color':'']">{{scope.row.clueAttributionEmpName}}</span>
          </el-tooltip>
          <img v-if="scope.row.customerLockFlag!==null&&scope.row.customerLockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
          </div>
        </template>
        <template slot="salesman" slot-scope="scope">
          <div class="disbale_content">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right">
            <span @mouseenter="showUserInfo(scope.row.clueSalesmanEmpId)" :class="[(scope.row.clueStatusId == 2||scope.row.clueStatusId == 3)?'gray-color':'']">{{scope.row.clueSalesmanEmpName}}</span>
          </el-tooltip>
          <img v-if="scope.row.lockFlag!==null&&scope.row.lockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
          </div>
        </template>
        <template slot="customerBelong" slot-scope="scope">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right" v-if="scope.row.clueUserEmpId!==null">
            <span @mouseenter="showUserInfo(scope.row.clueUserEmpId)">{{scope.row.clueUserEmpName}}</span>
          </el-tooltip>
          <span v-else>暂无数据</span>
        </template>
         <template slot="createMan" slot-scope="scope">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right">
            <span @mouseenter="showUserInfo(scope.row.createBy)">{{scope.row.createByName}}</span>
          </el-tooltip>
        </template>
        <template slot="organization" slot-scope="scope">
          <!-- 认证标签 certifiedLabel 0：未认证；1：初级认证；2：高级认证 -->
          <div class="certify-contain">
            <span v-if="scope.row.organization!=null">{{scope.row.organization}}</span>
            <el-tooltip effect="dark" :content="scope.row.certifiedLabel == 2?'高级认证':'初级认证'" placement="right" v-if="(scope.row.certifiedLabel&&scope.row.certifiedLabel!=0)">
              <img class="certify_img_sty" :src="scope.row.certifiedLabel==2? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
            </el-tooltip>
          </div>
        </template>
        <template slot="clueGradeId" slot-scope="scope">
          <span>{{scope.row.clueGradeId | filterClueLabel}}</span>
        </template>
        <template slot="orgType" slot-scope="scope">
          <span>{{scope.row.orgType | filterUnitType}}</span>
        </template>
        <template slot="industry" slot-scope="scope">
          <span>{{scope.row.industry | filterIndustry}}</span>
        </template>
        <template slot="orgAddress" slot-scope="scope">
          <span>{{scope.row.orgAddress | filterArea}}</span>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" @click="checkDetail(scope.row)">查看</el-button>
          <el-button type="text" v-if="scope.row.clueStatusId==1" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </avue-crud>
      </div>
      <!-- 个人 -->
      <div v-show="clueType == 0">
        <avue-crud ref="crudTable"
        v-if="clueType == 0"
        class="batch-choose clue_table"
        :data="dataList"
        :table-loading="tableLoading"
        :option="personTableOption"
        :page.sync="page"
         @sort-change="changeSort"
         @selection-change="selectionChange"
         @size-change="sizeChange"
         @current-change="currentChange"
         @on-load="getList">
        <template slot="clueNo" slot-scope="scope">
          <div class="clue-no-contain">
            <span class="orgName" @click="checkDetail(scope.row)">{{scope.row.clueNo}}</span>
            <span :class="['auth-status',scope.row.clueStatusId == 1?'fail-status':'']" v-if="scope.row.clueStatusId!=0&&scope.row.clueStatusId!=4">{{ scope.row.clueStatusId|filterClueStatus }}</span>
            <span :class="['auth-status','green-sty']" v-if="!userInfo.isPartner&&scope.row.clueStatusId==4">机构</span>
          </div>
        </template>
        <template slot="contactName" slot-scope="scope">
          <div class="certify-contain">
            <span class="solo_Name" @click="checkDetail(scope.row)">{{scope.row.contactName}}</span>
            <el-tooltip effect="dark" :content="scope.row.certifiedLabel == 1 ? '初级认证':'高级认证'" placement="right" v-if="scope.row.isAutoConversion">
              <img class="certify_img_sty" :src="scope.row.certifiedLabel == 2 ? require('@/assets/images/new-client/certified_unit.png') : require('@/assets/images/new-client/certified_unit_low.png')" alt="">
            </el-tooltip>
          </div>
        </template>
        <template slot="companyName" slot-scope="scope">
          <span>{{scope.row.companyName|filterNull}}</span>
        </template>
        <template slot="clueBelong" slot-scope="scope">
          <div class="disbale_content">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right">
            <span @mouseenter="showUserInfo(scope.row.clueAttributionEmpId)" :class="[(scope.row.clueStatusId == 2||scope.row.clueStatusId == 3)?'gray-color':'']">{{scope.row.clueAttributionEmpName}}</span>
          </el-tooltip>
          <img v-if="scope.row.customerLockFlag!==null&&scope.row.customerLockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
          </div>
        </template>
        <template slot="salesman" slot-scope="scope">
          <div class="disbale_content">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right">
            <span @mouseenter="showUserInfo(scope.row.clueSalesmanEmpId)" :class="[(scope.row.clueStatusId == 2||scope.row.clueStatusId == 3)?'gray-color':'']">{{scope.row.clueSalesmanEmpName}}</span>
          </el-tooltip>
          <img v-if="scope.row.lockFlag!==null&&scope.row.lockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
          </div>
        </template>
        <template slot="customerBelong" slot-scope="scope">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right" v-if="scope.row.clueUserEmpId!==null">
            <span @mouseenter="showUserInfo(scope.row.clueUserEmpId)">{{scope.row.clueUserEmpName}}</span>
          </el-tooltip>
          <span v-else>暂无数据</span>
        </template>
         <template slot="createMan" slot-scope="scope">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right">
            <span @mouseenter="showUserInfo(scope.row.createBy)">{{scope.row.createByName}}</span>
          </el-tooltip>
        </template>
        <template slot="creditCode" slot-scope="scope">
          <div :class="['already_border_sty',scope.row.isRedButten == 1&&scope.row.pwdcreditCode==null?'border_sty_red':'']">
          <span :class="[scope.row.isRed == 1?'is_red_sty':'']" v-if="scope.row.pwdcreditCode!==null">{{scope.row.pwdcreditCode}}</span>
          </div>
        </template>
        <template slot="clueGradeId" slot-scope="scope">
          <span>{{scope.row.clueGradeId | filterClueLabel}}</span>
        </template>
        <template slot="orgType" slot-scope="scope">
          <span>{{scope.row.orgType | filterUnitType}}</span>
        </template>
        <template slot="industry" slot-scope="scope">
          <span>{{scope.row.industry | filterIndustry}}</span>
        </template>
        <template slot="orgAddress" slot-scope="scope">
          <span>{{scope.row.orgAddress | filterArea}}</span>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" @click="checkDetail(scope.row)">查看</el-button>
          <el-button type="text" v-if="scope.row.clueStatusId==1" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </avue-crud>
      </div>
    <!-- 分配操作 -->
      <allot-tip ref="allot" @refresh="refresh"></allot-tip>
      <el-dialog :visible.sync="addClueDialog" title="发起认证" width="500px" :close-on-click-modal="false" top="30vh">
        <div>
          <el-radio-group v-model="lauchType">
            <el-radio :label="1" v-if="clueType == 1">后台自主认证</el-radio>
            <el-radio :label="2">电商认证</el-radio>
          </el-radio-group>
          <div slot="footer" class="dialog-footer-btn">
            <el-button type="primary" @click="launchApprove()">确 定</el-button>
            <el-button @click="addClueDialog = false">取 消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import { getClassifyList } from "@/api/siteSettings/classify";
import { getArea } from "@/api/clue/clue";
import { delClue,getCreateCompanyAuthVo,getPartnerList } from "@/api/new-client/my-clue"
import { tableOption, personTableOption } from "@/const/crud/personal/org-clue";
import { getClueList } from "@/api/new-client/clue"
import * as CodeMsg from "@/api/common/CodeChange";
import { mapGetters, mapState } from "vuex";
import { saveDetal } from "@/util/clearDetail";
import allotTip from "@/components/new-client/common/allot";
import { filterArea, filterIndustry, filterUnitType, filterClueLabel } from "@/util/new-client/filter"
export default {
  components: {
    allotTip,
  },
  data() {
    return {
      sortField:"createTime",
      sortType:"desc",
      clickStatus: false,
      clueType: 1,
      baseUrl: process.env.BASE_URL,
      clueList: [], //被选中的线索
      addClueDialog: false,
      lauchType: null,
      filters: {
        keyWords: "",
        orgAddress: [],
        customerBelong: "",
        clueBelonging: "",
        salesman: "",
        clueLabel: "",
        orgTypeId: "",
        orgIndustryNo: [],
        createMan: "",
        createTime: null,
        followTime: null,
        clueStatus: "",
        customerOwner: "" // 线索提供方
      },
      dataList: [],
      customerOwnerList:[],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
        pageSizes: [5, 8, 10, 20, 30, 50, 100],
      },
      personTableOption: personTableOption,
      tableOption: tableOption,
      tableLoading: false,
      option: {},
      senior: false, //高级搜索
      clueLabelList: [],
      unitTypeList: [],
      industryTypeList: [],
      areaTree: [],
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
      area: (state) => state.category.area,
      userInfo: (state) => state.user.userInfo,
    }),
    ...mapGetters(['permissions'])
  },
  filters: {
    filterNull(val){
      return Number(val) == 0? "暂无数据":val
    },
    filterClueStatus(val){
      return val == 0?"正常":val == 1?"失效":val == 2||val == 3?"公海":val == 4?"机构":''
    },
    filterClueLabel(val){
      return filterClueLabel(val)
    },
    filterUnitType(val){
      return filterUnitType(val)
    },
    filterIndustry(val){
      return filterIndustry(val)
    },
    filterArea(val){
      return filterArea(val)
    },
  },
  created() {
    if (sessionStorage.getItem(`${this.$route.path}`)) {
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
      this.clickStatus = keepParams.clickStatus
      this.clueType = keepParams.clueType
      this.senior = keepParams.senior
      this.page.currentPage = keepParams.params.pageNo;
      this.page.pageSize = keepParams.params.pageSize;
      this.filters.keyWords = keepParams.params.key;
      this.filters.clueLabel = keepParams.params.clueGradeId;
      this.filters.orgTypeId = keepParams.params.orgType;
      this.filters.orgIndustryNo = keepParams.orgIndustryNo;
      this.filters.clueBelonging = keepParams.params.clueAttributionEmp;
      this.filters.customerBelong = keepParams.params.clueUserEmp;
      this.filters.salesman = keepParams.params.clueSalesmanEmp;
      this.filters.createMan = keepParams.params.createBy;
      this.filters.orgAddress = keepParams.orgAddress;
      this.filters.createTime = keepParams.createTime;
      this.filters.followTime = keepParams.followTime;
      this.filters.clueStatus = keepParams.clueStatus;
      this.filters.customerOwner = keepParams.params.partnerId;
      this.sortField = keepParams.params.sortField;
      this.sortType = keepParams.params.sortType;
    }
  },
  methods: {
    judgeStatus(){
      let row = this.clueList[0];
      if(this.clueType == 0 && row.isAutoConversion) return this.$offsetMessage.warning('该线索用户已完成高级认证！');
      if(this.clueType == 1) return getCreateCompanyAuthVo(row.clueCompanyId).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          let warnTxt = row.certifiedLabel == 1 ? '该客户信用代码已完成初级认证！' : row.certifiedLabel== 2 ?'该客户信用代码已完成高级认证！':'该客户暂不可选，具体情况咨询管理人员！';
          if(!row.organization||row.certifiedLabel!=0) return this.$offsetMessage.warning(warnTxt);
          this.openDialog()
        } else {
          this.$offsetMessage.warning(res.data.msg)
        }
      })  
      this.openDialog() 
    },
    openDialog(){
        this.lauchType = this.clueType == 1 ? 1:2;
        this.addClueDialog = true;
    },
    //发起认证按钮判断
    launchApprove(){
      let row = this.clueList[0];
      this.$router.push({
        path:'/launch-approve',
        query:{
          id: this.clueType == 1 ? row.clueCompanyId : row.cluePersonId,
          lauchType: this.lauchType,
          clueType: this.clueType,//1-单位 0-个人
        }
      })

    },
    //排序
    changeSort(e){
      this.sortField = e.prop;
      this.sortType = e.order == 'descending'?'desc':'asc'
      this.getAllList();
    },
    // 刷新列表
    refresh() {
      this.getAllList();
    },
    // 0-分配线索归属 1-分配业务员
    distrBelong(val) {
      val == 0? this.previewCheckAllot(val):this.finalAllotOperate(val)
    },
    // 最终分配操作
    finalAllotOperate(val){
      this.$nextTick(() => {
        this.$refs.allot.clueList = this.clueList
        this.$refs.allot.clueType = this.clueType
        this.$refs.allot.isPerson = false
        this.$refs.allot.distrBelong(val,val==0?"分配线索归属":"分配业务员");
      });
    },
    previewCheckAllot(val){
      let result = this.clueList.filter(item=>{
        return item.clueStatusId == 4
      })
      if(result.length>0){
        this.$message({
          type:'warning',
          message:'合作机构线索不能分配线索归属！',
          offset:300
        })
      }else{
        this.finalAllotOperate(val)
      }
    },
    changeTab() {
      this.page.currentPage = 1;
      this.clueList = [];
    },
    //删除失效线索
    handleDelete(row) {
      this.$confirm("确认删除该条线索吗？", "提示", {
        type: "warning",
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
      }).then(() => {
        this.confirmDelete(row)
      });
    },
    // 确认删除
    confirmDelete(row){
      let params = {
        id: this.clueType == 1? row.clueCompanyId : row.cluePersonId,
      }
      delClue(params,this.clueType).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:"success",
            message:"删除成功！",
            offset: 300
          })
          this.getAllList();
        }
      })
    },
    selectionChange(val) {
      this.clueList = val;
    },
    resetForm() {
      this.filters.keyWords = "";
      this.filters.orgAddress = [];
      this.filters.customerBelong = "";
      this.filters.clueBelonging = "";
      this.filters.salesman = "";
      this.filters.clueLabel = "";
      this.filters.orgTypeId = "";
      this.filters.orgIndustryNo = [];
      this.filters.createMan = "";
      this.filters.clueStatus = "";
      this.filters.createTime = null;
      this.filters.followTime = null;
      this.filters.customerOwner = ""
      this.getAllList();
    },
    checkDetail(row) {
      if(this.permissions.bt_get_clue){
      let path = "/new-clue-detail";
      let query = {
        type: 1,
        id: this.clueType == 1? row.clueCompanyId : row.cluePersonId,
        clueType:this.clueType
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
     }else{
      this.$notAuthorized()
     }
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
    currentChange(val) {
      this.page.currentPage = val;
    },
    //获取列表数据
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getFirstAllList() {
      this.clickStatus = true;
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      this.tableLoading = true;
      let params = {
        pageSize: this.page.pageSize,
        pageNo: this.page.currentPage,
        key: this.filters.keyWords, // 关键词
        clueStatusIdList: this.clickStatus == true ? this.filters.clueStatus === ''?null: this.filters.clueStatus == 2? [2,3] : [this.filters.clueStatus]: null, // 线索状态 0-正常 1-失效 2-公海
        clueGradeId: this.clickStatus == true ? this.filters.clueLabel : "", // 线索级别标签ID
        orgType: this.clickStatus == true ? this.filters.orgTypeId : "", // 单位类型
        industry: this.clickStatus == true ? this.filters.orgIndustryNo.length>0? this.filters.orgIndustryNo.join(',') :"" : "", // 行业
        clueAttributionEmp: this.clickStatus == true ? this.filters.clueBelonging : "", // 线索归属
        clueUserEmp: this.clickStatus == true ? this.filters.customerBelong : "", // 客户归属
        clueSalesmanEmp: this.clickStatus == true ? this.filters.salesman : "", // 业务员
        createBy: this.clickStatus == true ? this.filters.createMan : "", // 创建人
        orgAddress: this.clickStatus == true ? this.filters.orgAddress.length>0 ? this.filters.orgAddress.join(',') : "" : "", // 所属区域
        createStartTime: this.clickStatus == true ? this.filters.createTime == null ? "" : this.$moment(this.filters.createTime[0]).format("YYYY-MM-DD HH:mm:ss") : "",
        createEndTime: this.clickStatus == true ? this.filters.createTime == null ? "" : this.$moment(this.filters.createTime[1]).format("YYYY-MM-DD HH:mm:ss") : "",
        followStartTime: this.clickStatus == true ? this.filters.followTime == null ? "" : this.$moment(this.filters.followTime[0]).format("YYYY-MM-DD HH:mm:ss") : "",
        followEndTime: this.clickStatus == true ? this.filters.followTime == null ? "" : this.$moment(this.filters.followTime[1]).format("YYYY-MM-DD HH:mm:ss") : "",
        sortField: this.sortField,
        sortType: this.sortType,
        partnerId: this.clickStatus == true ? this.filters.customerOwner :"" // 线索提供方
      };
      // 需要缓存的参数
      let keepParams = {
        clickStatus: this.clickStatus,
        clueType: this.clueType,
        clueStatus: this.filters.clueStatus,
        params: params,
        senior: this.senior,
        orgIndustryNo:this.filters.orgIndustryNo,
        orgAddress:this.filters.orgAddress,
        createTime: this.filters.createTime,
        followTime: this.filters.followTime,
        detail: { path: "", query: {} },
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getClueList(params,this.clueType).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.dataList = res.data.data.records;
          this.page.total = res.data.data.total;
          this.tableLoading = false;
        }
      });
    },
    getDropList() {
      getClassifyList().then(res=>{
        if(res.data.code == CodeMsg.CODE_1000){
          let r = res.data.data
          this.unitTypeList = r[5].optionList;
          this.industryTypeList = r[4].optionList;
          this.clueLabelList = r[8].optionList;
        }
      })
      getArea().then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.areaTree = res.data.data;
          }
      })
      getPartnerList().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.customerOwnerList = res.data.data;
        }
      })
    },
  },
  mounted() {
    this.getDropList();
  },
};
</script>

<style scoped>
.clue_table {
  padding: 0;
}
.client-name-sty {
  font-size: 14px;
}
.client-btn-sty {
  margin: 0 20px 0 5px;
}
.client-type-sty {
  border-left: 1px solid #dcdfe6;
}
.clue-templete {
  cursor: pointer;
  margin-left: 10px;
  color: #36a6fe;
}
.list-btn {
  margin: 0 20px 0 5px;
}
.personal-list-btn {
  cursor: pointer;
  border-left: 1px solid #ccc;
}
.activebtn {
  background: #36a6fe;
  border-radius: 5px;
  border: 0;
  color: #fff;
}
.search {
  margin: 15px 0 10px 0;
}
.distributionBtn {
  margin-top: 10px;
}
.orgName {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #36a6fe;
  cursor: pointer;
  text-align: center;
}
.solo_Name {
  color: #36a6fe;
  cursor: pointer;
}
.companyName-sty{
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #36a6fe;
  cursor: pointer;
}
.keyword {
  width: 340px;
}
.is_red_sty {
  color: red !important;
}
.border_sty_red {
  background: red !important;
}
.already_border_sty {
  height: 30px;
  line-height: 30px;
}
.disbale_content {
  display: flex;
  justify-content: center;
}
.certify-contain{
  display: flex;
  justify-content: center;
  align-items: center;
}
.certify_img_sty{
  width: 20px;
  height: 20px;
  margin-left: 3px;
}
.disable_img_sty {
  width: 20px;
  height: 20px;
  margin-left: 3px;
}
.senior-check{
  margin-bottom: 10px;
}
.distri-btn{
  margin: -10px 0 10px 0;
}
.senior-contain{
  margin-bottom: -15px;
}
.clue-no-contain{
  position: relative;
  display: flex;
}
.auth-status{
  position: absolute;
  display: inline-block;
  background: coral;
  height: 20px;
  line-height: 20px;
  border-radius: 5px;
  color: #ffffff;
  padding: 0 5px;
  bottom: 2px;
  right: -8px;
  margin-left: 5px;
}
.fail-status{
  background: rgb(144, 139, 138) !important;
  top: 0 !important;
  left: -4px !important;
  width: 26px !important;
}
.dialog-footer-btn{
  margin: 30px auto;
  text-align: center
}
.gray-color{
  color: rgb(180, 179, 179) !important;
}
.green-sty{
  background: green !important;
}
</style>
