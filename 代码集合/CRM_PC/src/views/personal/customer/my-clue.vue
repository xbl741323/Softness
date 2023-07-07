<!-- 排查完成 -->
<template>
  <basic-container>
     <div class="client-type">
        <span class="client-name-sty">线索类型：</span>
        <el-radio-group v-model="clueType" @change="changeTab()">
          <el-radio-button v-if="permissions.bt_page_clue_my"  border :label="1" class="client-btn-sty">{{ $t("message.unit") }}</el-radio-button>
          <el-radio-button v-if="permissions.bt_page_clue_my"  border :label="0" class="client-type-sty">{{ $t("message.solo") }}</el-radio-button>
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
        <el-button type="success" @click="permissions.bt_add_clue_my ? addClue() : $notAuthorized()">创建线索</el-button>
        <!-- 高级搜索 -->
        <div class="senior-check">
          <el-checkbox v-model="senior">{{$t("message.hignSearch")}}</el-checkbox>
        </div>
        <div v-if="senior">
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
         <!-- 合作机构按钮 -->
      <div v-if="userInfo.isPartner" class="distri-btn">
        <el-button type="success" @click="permissions.bt_add_clue_my ? addClue() : $notAuthorized()">创建线索</el-button>
      </div>
       <!-- 内部员工按钮 -->
      <div v-if="!userInfo.isPartner" class="distri-btn betw-sty">
        <div>
         <el-button type="primary" @click="permissions.bt_allot_clue_attr_my ? distrBelong(0) : $notAuthorized()" :disabled="clueList.length == 0">
          <span>分配线索归属</span>
          <el-popover placement="right" trigger="hover" width="400">
           <p>批量分配线索归属时</p>
           <p>1.所选线索归属全部不是我的时，无权分配线索归属；</p>
           <p>2.仅部分线索归属是我的时，点击分配线索归属后，仅能将这部分线索分配归属成功，其余线索不会改变归属</p>
           <span slot="reference"><i class="el-icon-question left-icon-sty"></i></span>
          </el-popover>
         </el-button>
         <el-button type="primary" @click="permissions.bt_allot_clue_salesman_my ? distrBelong(1) : $notAuthorized()" :disabled="clueList.length ==0">分配业务员</el-button>
         <!-- <el-button type="primary" @click="permissions.bt_receive_clue_my ? batchReceive() : $notAuthorized()" :disabled="receiveSeaIdList.length ==0">领取</el-button> -->
         <el-button type="primary" @click="permissions.bt_enter_contract_my_flag ? validateContract() : $notAuthorized()" :disabled="clueList.length ==1?false:true">录入合同</el-button>
         <el-button type="primary" @click="permissions.bt_initiate_authentication ? judgeStatus() : $notAuthorized()" :disabled=" clueList.length != 1 ">发起认证</el-button>
         <el-button type="primary" @click="permissions.bt_add_order ? validateOrder() : $notAuthorized()" :disabled="clueList.length ==1?false:true">发起订单</el-button>
        </div>
        <el-button type="primary" @click="permissions.bt_receive_clue_my ? showBatchReceive() : $notAuthorized()">一键领取</el-button>
      </div>
      </el-form>
      <!-- 单位线索列表 -->
      <div v-show="clueType == 1">
        <avue-crud ref="crudTable"
        v-if="clueType == 1"
        class="batch-choose"
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
          <el-tooltip effect="dark" :content="tooltipContent" placement="right" :disabled="userInfo.isPartner">
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
        <!-- <template slot="menu" slot-scope="scope">
          <el-button type="text" @click="checkDetail(scope.row)">查看</el-button>
          <el-button type="text" v-if="scope.row.clueStatusId==0" @click="fllowClue(scope.row)" v-preventReClick>跟进</el-button>
          <el-button type="text" v-if="scope.row.clueStatusId != 2 && scope.row.clueStatusId != 3" @click="initOrder(scope.row, 1)">发起订单</el-button>
          <el-button type="text" v-if="(scope.row.clueStatusId==0)&&(userInfo.id == scope.row.clueSalesmanEmpId)" @click="entering(scope.row)" v-preventReClick>录入合同</el-button>
          <el-button type="text" v-if="scope.row.clueStatusId==2||scope.row.clueStatusId==3" size="small" @click="batchReceive(false,scope.row)">领取</el-button>
          <el-button type="text" v-if="scope.row.clueStatusId==1" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template> -->
      </avue-crud>
      </div>
      <!-- 个人 -->
      <div v-show="clueType == 0">
        <avue-crud ref="crudTable"
        v-if="clueType == 0"
        class="batch-choose"
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
          <el-tooltip effect="dark" :content="tooltipContent" placement="right" :disabled="userInfo.isPartner">
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
        <!-- <template slot="menu" slot-scope="scope">
          <el-button type="text" @click="checkDetail(scope.row)">查看</el-button>
          <el-button type="text" v-if="scope.row.clueStatusId==0" @click="fllowClue(scope.row)" v-preventReClick>跟进</el-button>
          <el-button type="text" v-if="scope.row.clueStatusId != 2 && scope.row.clueStatusId != 3" @click="initOrder(scope.row, 0)">发起订单</el-button>
          <el-button type="text" v-if="(scope.row.clueStatusId==0)&&(userInfo.id == scope.row.clueSalesmanEmpId)" @click="entering(scope.row)" v-preventReClick>录入合同</el-button>
          <el-button type="text" v-if="scope.row.clueStatusId==2||scope.row.clueStatusId==3" size="small" @click="batchReceive(false,scope.row)">领取</el-button>
          <el-button type="text" v-if="scope.row.clueStatusId==1" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template> -->
      </avue-crud>
      </div>
      <!-- 跟进操作 -->
      <follow ref="follow" @refresh="refresh"></follow>
      <!-- 分配操作 -->
      <allot-tip ref="allot" @refresh="refresh"></allot-tip>
      <!-- 创建线索dialog -->
      <el-dialog :visible.sync="addClueDialog" :title="dialogTitle" width="690px" :close-on-click-modal="false" top="5vh">
        <operate-clue v-if="dialogBox == 'create'" @close-clue="closeClueOperateDialog" :createType="1" @closeClueOperate="closeClueOperateDialog"></operate-clue>
        <div v-if="dialogBox == 'launch'">
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
      <!-- 显示我的公海列表 -->
      <personal-seas ref="personal-seas" @refresh="getAllList" :clueType='clueType'></personal-seas>
  </basic-container>
</template>

<script>
import { getClassifyList } from "@/api/siteSettings/classify";
import { getArea } from "@/api/clue/clue";
import { receiveForMy, getClueList,delClue,validateCreateOrder,getMyCreateCompanyAuthVo,getPartnerList } from "@/api/new-client/my-clue"
import { tableOption, personTableOption } from "@/const/crud/personal/person-clue";
import * as CodeMsg from "@/api/common/CodeChange";
import { mapState, mapGetters } from "vuex";
import { saveDetal } from "@/util/clearDetail";
import follow from '@/components/new-client/common/follow';
import allotTip from "@/components/new-client/common/allot";
import operateClue from '@/components/new-client/common/operate-clue';
import personalSeas from "@/components/new-client/personal-seas/index"
import { filterArea, filterIndustry, filterUnitType, filterClueLabel } from "@/util/new-client/filter"
export default {
  components: {
    follow,
    allotTip,
    operateClue,
    personalSeas
  },
  data() {
    return {
      sortField:"createTime",
      sortType:"desc",
      isAllotClueStatus: false,
      clickStatus: false,
      addClueDialog: false,
      dialogBox: null,
      lauchType: null,
      clueType: 1,
      dialogTitle: '',
      baseUrl: process.env.BASE_URL,
      receiveSeaIdList:[], // 公海领取id集合
      clueIdList: [],
      clueList: [], // 被选中的线索
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
      area: (state) => state.category.area,
      userInfo: (state) => state.user.userInfo,
      ...mapGetters(["permissions"]),
    }),
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
      this.clueType = keepParams.clueType;
    }
  },
  methods: {
    // 展示我的公海列表
    showBatchReceive(){
      this.$nextTick(()=>{
        this.$refs['personal-seas'].openVisble = true
      })
    },
    // 录入合同校验
    validateContract(){
     let row = this.clueList[0]
     if((row.clueStatusId==0)&&(this.userInfo.id == row.clueSalesmanEmpId)){
       this.entering(row)
     }else{
       this.$message({
         type:'warning',
         message:"不符合录入合同条件！",
         offset:300
       })
     }
    },
    // 发起订单校验-公海线索不能发起订单
    validateOrder(){
     let row = this.clueList[0]
     if(row.clueStatusId != 2 && row.clueStatusId != 3){
      this.validateProOrder(row)
     }else{
       this.$message({
         type:'warning',
         message:"不符合发起订单条件！",
         offset:300
       })
     }
    },
    // 检查发起订单是否符合条件
    validateProOrder(row){
      let params = this.clueType == 1 ?{
        companyName:row.companyName,
        organization:row.organization
      }:{
        mobile:row.mobile,
        personName:row.contactName
      }
      validateCreateOrder(params,this.clueType).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.initOrder(row, this.clueType)
        }else{
          this.$alert(`${res.data.msg}`, '', {
           confirmButtonText: '确定',
           center: true,
          });
        }
      })
    },
    //排序
    changeSort(e){
      this.sortField = e.prop;
      this.sortType = e.order == 'descending'?'desc':'asc'
      this.getAllList();
    },
    initOrder(row, clueType){
      this.$router.push({
        path:'/init-order',
        query:{
          id: row.clueCompanyId || row.cluePersonId,
          clueType: clueType,//1-单位 0-个人
        }
      })
    },
    judgeStatus(){
      let row = this.clueList[0];
      let para = {
        clueId: this.clueType == 0 ? row.cluePersonId : row.clueCompanyId,
        clueType: this.clueType + 1,
      }
      // if(this.clueType == 0 && row.certifiedLabel) return this.$offsetMessage.warning('该线索用户已完成'+row.certifiedLabel == 1?'初级':'高级'+'认证！');
      getMyCreateCompanyAuthVo(para).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          // let warnTxt = row.certifiedLabel == 1 ? '该客户信用代码已完成初级认证！' : row.certifiedLabel== 2 ?'该客户信用代码已完成高级认证！':'该客户暂不可选，具体情况咨询管理人员！';
          // if(!row.organization || row.certifiedLabel!=0) return this.$offsetMessage.warning(warnTxt);
          this.openDialog()
        } else {
          this.$offsetMessage.warning(res.data.msg)
        }
      })    
    },
    openDialog(){
        this.dialogTitle = '认证类型';
        this.dialogBox = 'launch';
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
    // 跳转录入合同页面
    entering(row){
      let path = "/entering-contract";
      let query = {
        clueId: this.clueType == 1? row.clueCompanyId : row.cluePersonId,
        clueType: this.clueType,
        source: 'personal',
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    // 领取提示
    batchReceive(){
      this.$confirm('仅支持领取流入到公海的线索，公海的线索，领取后，不改变该线索的线索归属和业务员，确定领取？',{
          type:'warning',
          cancelButtonClass: 'btn-custom-cancel',
        }).then(()=>{
          this.receiveOperate(this.receiveSeaIdList);
        })
    },
    // 领取操作
    receiveOperate(receiveList){
      let params = {
        clueIdList: receiveList
      }
      receiveForMy(params,this.clueType).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$notify({
            title: this.$t("text.success"),
            message: this.$t("message.receiveSuccess"),
            type: "success",
            duration: 2000,
          });
          this.getAllList()
        }else{
          this.$notify({
            title: "提示",
            message: res.data.msg,
            type: "warning",
            duration: 2000,
          });
        }
      })
    },
    closeClueOperateDialog(){
      this.addClueDialog = false
      this.getAllList()
    },
    // 弹出跟进弹窗
    fllowClue(row){
      this.$nextTick(()=>{
        this.$refs.follow.followClueDialog = true
        this.$refs.follow.followInfo = row
        this.$refs.follow.followTitle = "线索跟进"
        this.$refs.follow.clueType = Number(this.clueType+1)
        this.$refs.follow.publicTime = row.publicTime;
        this.$refs.follow.followClueTypeList = this.category[9].optionList
      })
    },
    // 弹出创建线索弹窗
    addClue(){
      this.dialogTitle = '创建线索';
      this.dialogBox = 'create';
      this.addClueDialog = true
    },
    // 刷新列表
    refresh() {
      this.getList();
    },
    // 0-分配线索归属 1-分配业务员
    distrBelong(val) {
      val == 0 ? this.previewCheckAllot(val) : this.distrFinalBelong(val)
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
        this.checkAllotPower(val)
      }
    },
    // 分配线索归属时判断是否有分配权限
    checkAllotPower(val){
      let result = this.clueList.some(item=>{
          return item.clueAttributionEmpId != this.userInfo.id
        })
        if(result){
           this.$message({
            type:"warning",
            message:"部分线索分配没有权限！",
            offset: 300
          })
        }else{
        this.distrFinalBelong(val)
      }
    },
    // 最终分配操作
    distrFinalBelong(val){
      this.$nextTick(() => {
      this.$refs.allot.clueList = this.clueList
      this.$refs.allot.clueType = this.clueType
      this.$refs.allot.isPerson = true
      this.$refs.allot.distrBelong(val,val==0?"分配线索归属":"分配业务员");
      })
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
      this.clueIdList = []
      this.receiveSeaIdList = []
      val.forEach(item=>{
        this.clueIdList.push(this.clueType == 1?Number(item.clueCompanyId):(item.cluePersonId))
        if(item.clueStatusId == 2||item.clueStatusId == 3){
        this.receiveSeaIdList.push(this.clueType == 1?Number(item.clueCompanyId):(item.cluePersonId))
        }
      })
    },
    resetForm() {
      this.filters.keyWords = "";
      this.filters.customerBelong = "";
      this.filters.clueBelonging = "";
      this.filters.salesman = "";
      this.filters.clueLabel = "";
      this.filters.orgTypeId = "";
      this.filters.orgIndustryNo = [];
      this.filters.createMan = "";
      this.filters.orgAddress = [];
      this.filters.clueStatus = "";
      this.filters.createTime = null;
      this.filters.followTime = null;
      this.filters.customerOwner = ""
      this.getList();
    },
    checkDetail(row) {
      if(this.permissions.bt_get_clue_my){
      let path = "/new-clue-detail";
      let query = {
        type: 0,
        id: this.clueType == 1? row.clueCompanyId : row.cluePersonId,
        clueType: this.clueType,
        isPerson: 'personal',
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
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
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
        clueType: this.clueType,
        clickStatus: this.clickStatus,
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
          let r = res.data.data.records
          r.forEach(item=>{
            item.noDisabled = false
            if((item.clueAttributionEmpId == this.userInfo.id)||(item.clueSalesmanEmpId == this.userInfo.id)){
              item.noDisabled = true
            }
          })
          this.dataList = r;
          this.page.total = res.data.data.total;
          this.tableLoading = false;
        }
      });
    },
    getDropList() {
      getClassifyList().then(res=>{
        if(res.data.code == CodeMsg.CODE_1000){
          let r = res.data.data
          this.category = r
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
.client-name-sty {
  font-size: 14px;
}
.client-btn-sty {
  margin: 0 20px 0 5px;
}
.client-type-sty {
  border-left: 1px solid #dcdfe6;
}
.dialog-footer-btn{
  margin: 30px auto;
  text-align: center
}
.ownclue {
  padding: 0;
  font-size: 12px;
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
  margin: 15px 0;
}
.orgName {
  width: 100%;
  display: inline-block;
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
.left-icon-sty{
  margin-left: 4px;
}
.senior-check{
  margin-bottom: 10px;
}
.distri-btn{
  margin-bottom: -5px;
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
.gray-color{
  color: rgb(180, 179, 179) !important;
}
.green-sty{
  background: green !important;;
}
.betw-sty{
  display: flex;
  justify-content: space-between;
}
</style>
