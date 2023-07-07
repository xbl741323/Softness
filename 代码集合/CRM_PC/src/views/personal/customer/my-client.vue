<!-- 排查完成 -->
<template>
  <basic-container>
    <div class="client">
      <div class="client-type">
        <span class="client-name-sty">客户类型：</span>
        <el-radio-group v-model="clueType" @change="changeTab()">
          <el-radio-button border :label="1" class="client-btn-sty">{{ $t("message.unit") }}</el-radio-button>
          <el-radio-button border :label="0" class="client-type-sty">{{ $t("message.solo") }}</el-radio-button>
        </el-radio-group>
      </div>
      <el-form :model="filters" ref="filters" inline @keyup.enter.native="getFirstAllList()" class="client-form-sty">
        <el-form-item :label="$t('label.keywords')" prop="keyWords">
          <el-input
            :class="[clueType==1?'input-sty':'solo-input-sty']"
            v-model.trim="filters.keyWords"
            :placeholder="clueType==1?'请输入联系人姓名/单位名称关键字或完整线索编号/手机号/信用代码':'客户姓名/单位名称关键字或手机号/绑定线索编号/客户编号'">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('label.area')" prop="area">
          <el-cascader :options="areaTree" v-model="filters.area" :props="{value: 'id',label: 'areaName'}"/>
        </el-form-item>
        <el-form-item :label="$t('label.clientBelong')" prop="clientBelong">
          <el-input v-model.trim="filters.clientBelong" placeholder="请输入员工姓名/工号"></el-input>
        </el-form-item>
        <el-form-item :label="$t('label.salesman')" prop="salesman">
          <el-input v-model.trim="filters.salesman" placeholder="请输入员工姓名/工号"></el-input>
        </el-form-item>
        <el-button type="primary" @click="getFirstAllList()">{{ $t("button.search") }}</el-button>
        <el-button @click="resetForm()">{{ $t("button.reset") }}</el-button>
        <div class="senior-check">
          <el-checkbox v-model="senior">高级搜索</el-checkbox>
        </div>
        <div v-if="senior" class="senior-contain">
          <el-form-item label="客户状态" prop="clientStatus">
            <el-select v-model="filters.clientStatus">
              <el-option label="全部" value=""></el-option>
              <el-option label="正常" :value="0"></el-option>
              <el-option label="公海" :value="2"></el-option>
              <el-option label="失效" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('label.unitType')" prop="unitType">
            <el-select v-model="filters.unitType">
              <el-option v-for="item in unitTypeList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('label.industry')" prop="industry">
            <el-select v-model="filters.industry" multiple :multiple-limit="3">
              <el-option v-for="item in industryTypeList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="最近签约时间：" prop="publishTime">
            <el-date-picker
              v-model="filters.createTime"
              :unlink-panels="true"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div class="distri-btn" v-if="!userInfo.isPartner">
        <el-button type="primary" @click="permissions.bt_allot_clue_attr_my?distrBelong(0):$notAuthorized()" :disabled="clueList.length ==0">{{ $t("button.distriClientBelong") }}</el-button>
        <el-button type="primary" @click="permissions.bt_allot_clue_salesman_my?distrBelong(1):$notAuthorized()" :disabled="clueList.length ==0">{{ $t("button.distriSalesMan") }}</el-button>
      </div>
      <div v-show="clueType==1">
        <avue-crud
			  class="batch-choose"
        v-if="clueType==1"
        ref="crud"
        :option="option"
        :table-loading="tableLoading"
        :page.sync="page"
        :data="dataList"
        @selection-change="selectionChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @on-load="getList">
				<template slot="userNo" slot-scope="scope">
          <div class="clue-no-contain">
            <span id="handle-style" @click="handleDetail(scope.row)">{{ scope.row.userNo }}</span>
            <span :class="['auth-status',scope.row.clueStatusId == 1?'fail-status':'']" v-if="scope.row.clueStatusId!=0">{{ scope.row.clueStatusId|filterClueStatus }}</span>
          </div>
        </template>
         <template slot="clueNo" slot-scope="scope">
          <span id="handle-style" @click="handleDetail(scope.row)">{{ scope.row.clueNo }}</span>
        </template>
        <template slot="companyName" slot-scope="scope">
          <div class="certify-contain">
            <span class="companyName-sty" @click="handleDetail(scope.row)">{{ scope.row.companyName }}</span>
          </div>
        </template>
        <template slot="organization" slot-scope="scope">
          <div class="certify-contain">
            <span>{{ scope.row.organization }}</span>
            <el-tooltip effect="dark" :content="scope.row.certifiedLabel == 2?'高级认证':'初级认证'" placement="right" v-if="(scope.row.certifiedLabel&&scope.row.certifiedLabel!=0)">
              <img class="certify_img_sty" :src="scope.row.certifiedLabel==2? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
            </el-tooltip>
          </div>
        </template>
        <template slot="customerBelong" slot-scope="scope">
          <div class="disbale_content">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right">
            <span @mouseenter="showUserInfo(scope.row.clueUserEmpId)">{{scope.row.clueUserEmpName}}</span>
          </el-tooltip>
          <img v-if="scope.row.customerLockFlag!==null&&scope.row.customerLockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
          </div>
        </template>
        <template slot="salesman" slot-scope="scope">
          <div class="disbale_content">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right" :disabled="userInfo.isPartner">
            <span @mouseenter="showUserInfo(scope.row.clueSalesmanEmpId)" :class="[(scope.row.clueStatusId == 2||scope.row.clueStatusId == 3)?'gray-color':'']">{{ scope.row.clueSalesmanEmpName }}</span>
          </el-tooltip>
          <img v-if="scope.row.saleBelongLockFlag!==null&&scope.row.saleBelongLockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
          </div>
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
          <el-button type="text" size="small" @click="handleDetail(scope.row)">{{ $t("button.check") }}</el-button>
          <el-button type="text" size="small" v-if="scope.row.clueStatusId==0" @click="followOperate(scope.row)">跟进</el-button>
        </template>
      </avue-crud>
      </div>
      <!-- 表格内容区-个人 -->
      <div v-show="clueType==0">
        <avue-crud
			  class="batch-choose"
        v-if="clueType==0"
        ref="crud"
        :option="soloOption"
        :page.sync="page"
        :table-loading="tableLoading"
        :data="dataList"
        @selection-change="selectionChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @on-load="getList">
				<template slot="userNo" slot-scope="scope">
          <div class="clue-no-contain">
            <span id="handle-style" @click="handleDetail(scope.row)">{{ scope.row.userNo }}</span>
            <span :class="['auth-status',scope.row.clueStatusId == 1?'fail-status':'']" v-if="scope.row.clueStatusId!=0">{{ scope.row.clueStatusId|filterClueStatus }}</span>
          </div>
        </template>
         <template slot="clueNo" slot-scope="scope">
          <span id="handle-style" @click="handleDetail(scope.row)">{{ scope.row.clueNo }}</span>
        </template>
        <template slot="contactName" slot-scope="scope">
          <div class="certify-contain">
            <span id="handle-style" @click="handleDetail(scope.row)">{{ scope.row.contactName }}</span>
            <el-tooltip effect="dark" content="高级认证" placement="right" v-if="scope.row.isAutoConversion">
              <img class="certify_img_sty" :src="require('@/assets/images/new-client/certified_unit.png')" alt="">
            </el-tooltip>
          </div>
        </template>
        <template slot="customerBelong" slot-scope="scope">
          <div class="disbale_content">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right">
            <span @mouseenter="showUserInfo(scope.row.clueUserEmpId)">{{scope.row.clueUserEmpName}}</span>
          </el-tooltip>
          <img v-if="scope.row.customerLockFlag!==null&&scope.row.customerLockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
          </div>
        </template>
        <template slot="salesman" slot-scope="scope">
          <div class="disbale_content">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right" :disabled="userInfo.isPartner">
            <span @mouseenter="showUserInfo(scope.row.clueSalesmanEmpId)" :class="[(scope.row.clueStatusId == 2||scope.row.clueStatusId == 3)?'gray-color':'']">{{ scope.row.clueSalesmanEmpName }}</span>
          </el-tooltip>
          <img v-if="scope.row.saleBelongLockFlag!==null&&scope.row.saleBelongLockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
          </div>
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
          <el-button type="text" size="small" @click="handleDetail(scope.row)">{{ $t("button.check") }}</el-button>
          <el-button type="text" size="small" v-if="scope.row.clueStatusId==0" @click="followOperate(scope.row)">跟进</el-button>
        </template>
      </avue-crud>
      </div>
      <!-- 跟进操作 -->
      <follow ref="follow" @refresh="refresh"></follow>
      <!-- 分配操作 -->
      <allot ref="allot" @refresh="refresh"></allot>
    </div>
  </basic-container>
</template>

<script>
import { getClassifyList } from "@/api/siteSettings/classify";
import { getArea } from "@/api/clue/clue";
import { receive,getPartnerList } from '@/api/new-client/my-clue'
import { getClientList } from "@/api/new-client/my-client"
import { clientOption, soloOption } from "@/const/crud/personal/client";
import * as CodeMsg from "@/api/common/CodeChange";
import { saveDetal } from "@/util/clearDetail";
import { mapState, mapGetters } from "vuex";
import follow from "@/components/new-client/common/follow";
import allot from "@/components/new-client/common/allot";
import { filterArea, filterIndustry, filterUnitType, filterClueLabel } from "@/util/new-client/filter"
export default {
  components: {
    follow,
    allot,
  },
  data() {
    return {
      clickStatus: false,
      baseUrl: process.env.BASE_URL,
      tableLoading: false,
      clueIdList: [],
      clueList: [],
      unitTypeList: [],
      industryTypeList: [],
      areaTree: [],
      soloOption: soloOption,
      option: clientOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序,
        pageSizes: [5, 8, 10, 20, 30, 50, 100],
      },
      senior: false,
      clueType: 1,
      filters: {
        keyWords: "",
        clientStatus: "", // 客户状态
        area: [],
        clientBelong: "",
        salesman: "",
        unitType: "",
        industry: [],
        createTime: null,
      },
      dataList: [],
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
      this.senior = keepParams.senior;
      this.page.currentPage = keepParams.params.pageNo;
      this.page.pageSize = keepParams.params.pageSize;
      this.filters.keyWords = keepParams.params.key;
      this.filters.area = keepParams.area
      this.filters.salesman = keepParams.params.clueSalesmanEmp;
      this.filters.clientBelong = keepParams.params.clueUserEmp;
      this.filters.unitType = keepParams.params.orgType;
      this.filters.industry = keepParams.industry;
      this.filters.createTime = keepParams.createTime;
      this.filters.clientStatus = keepParams.clientStatus;
    }
  },
  methods: {
    // 领取提示
    batchReceive(val,row){
      this.$confirm(this.$t("message.seaConfirmOne"),{
          type:'warning',
          cancelButtonClass: 'btn-custom-cancel',
        }).then(()=>{
          val == true? this.receiveOperate(this.clueIdList) : this.receiveOperate(this.clueType == 1?[row.clueCompanyId]:[row.cluePersonId])
        })
    },
    // 领取操作
    receiveOperate(receiveList){
      let params = {
        clueIdList: receiveList
      }
      receive(params,this.clueType).then(res=>{
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
    // 跟进操作
    followOperate(row) {
      this.$nextTick(() => {
        this.$refs.follow.followClueDialog = true;
        this.$refs.follow.followInfo = row;
        this.$refs.follow.followTitle = "客户跟进"
        this.$refs.follow.clueType = Number(this.clueType+1)
        this.$refs.follow.publicTime = row.publicTime;
        this.$refs.follow.followClueTypeList = this.category[9].optionList
      });
    },
    // 刷新列表
    refresh() {
      this.getList();
    },
    selectionChange(val) {
      this.clueList = val;
      this.clueIdList = []
      val.forEach(item=>{
        this.clueIdList.push(this.clueType == 1?Number(item.clueCompanyId):(item.cluePersonId))
      })
    },
    // 0-分配客户归属 1-分配业务员
    distrBelong(val) {
      this.$nextTick(() => {
        this.$refs.allot.clueList = this.clueList
        this.$refs.allot.clueType = this.clueType
        this.$refs.allot.isPerson = true
        this.$refs.allot.distrBelong(val,val==0?"分配客户归属":"分配业务员");
      });
    },
    changeTab() {
      this.page.currentPage = 1
      this.clueList = [];
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
    currentChange(current) {
      this.page.currentPage = current;
      this.getList();
    },
    handleDetail(row) {
      if(this.permissions.bt_get_transaction_my){
      let path = "/new-client-detail";
      let query = {
        type: 0,
        id: this.clueType == 1? row.clueCompanyId : row.cluePersonId,
        clueType: this.clueType
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
    getList() {
      this.tableLoading = true;
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        clueStatusIdList: this.clickStatus == true ? this.filters.clientStatus === ''?null: this.filters.clientStatus == 2? [2,3] : [this.filters.clientStatus]: null, // 线索状态 0-正常 1-失效 2-公海
        key:this.clickStatus == true ? this.filters.keyWords : "",
        orgAddress: this.clickStatus == true ? this.filters.area?this.filters.area.join(',') : "" : "",
        clueSalesmanEmp: this.clickStatus == true ? this.filters.salesman : "",
        clueUserEmp:this.clickStatus == true ? this.filters.clientBelong : "",
        orgType: this.clickStatus == true ? this.filters.unitType : "",
        industry: this.clickStatus == true ? this.filters.industry?this.filters.industry.join(',') : "" : "",
        signStartTime: this.clickStatus == true ? this.filters.createTime == null ? "" : this.$moment(this.filters.createTime[0]).format("YYYY-MM-DD HH:mm:ss") : "",
        signEndTime: this.clickStatus == true ? this.filters.createTime == null ? "" : this.$moment(this.filters.createTime[1]).format("YYYY-MM-DD HH:mm:ss") : "",
      };
      // 需要缓存的参数
      let keepParams = {
        clickStatus: this.clickStatus,
        clientStatus: this.filters.clientStatus,
        params: params,
        senior: this.senior,
        area: this.filters.area,
        industry: this.filters.industry,
        createTime: this.filters.createTime,
        detail: { path: "", query: {} },
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getClientList(params,this.clueType).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.page.total = res.data.data.total;
          this.dataList = res.data.data.records;
          this.tableLoading = false;
        }
      });
    },
    // 获取下拉框数据
    getDropList() {
      getClassifyList().then(res=>{
        if(res.data.code == CodeMsg.CODE_1000){
          let r = res.data.data
          this.industryTypeList = r[4].optionList;
          this.unitTypeList = r[5].optionList;
        }
      })
      getArea().then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.areaTree = res.data.data;
          }
        })
    },
    resetForm() {
      this.filters.keyWords = "";
      this.filters.clientStatus = "";
      this.filters.area = [];
      this.filters.clientBelong = "";
      this.filters.salesman = "";
      this.filters.unitType = "";
      this.filters.industry = [];
      this.filters.createTime = null;
      this.getAllList();
    },
  },
  mounted() {
    this.getDropList();
  },
};
</script>
<style scoped>
.client {
  padding-bottom: 60px;
}
.client-name-sty {
  font-size: 14px;
}
.client-btn-sty {
  margin: 0 20px 0 5px;
}
.client-type-sty {
  border-left: 1px solid #ccc;
}
.client-form-sty {
  margin: 15px 0;
}
.input-sty {
  width: 420px;
}
.solo-input-sty {
  width: 360px;
}
#handle-style {
  color: rgb(64, 158, 255) !important;
  cursor: pointer;
}
.distri-sty {
  display: flex;
  justify-content: flex-end;
  align-items: center;
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
.distri-btn{
  margin: -5px 0 10px 0;
}
.senior-check{
  margin-bottom: 10px;
}
.senior-contain{
  margin-bottom: -20px;
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
  right: -4px;
  margin-left: 5px;
}
.fail-status{
  background: rgb(144, 139, 138) !important;
}
.gray-color{
  color: rgb(180, 179, 179) !important;
}
.companyName-sty{
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #36a6fe;
  cursor: pointer;
}
.clue-no-contain{
  position: relative;
  display: flex;
  justify-content: center;
}
</style>
