<!-- 集团公海 -->
<!-- 排查完成 -->
<template>
  <basic-container>
    <div class="client">
      <!-- 筛选区 -->
      <div class="client-type">
        <span class="client-name-sty">客户类型：</span>
        <el-radio-group v-model="clueType" @change="changeTab()">
          <el-radio-button border :label="1" class="client-btn-sty">单位</el-radio-button>
          <el-radio-button border :label="0" class="client-type-sty">个人</el-radio-button>
        </el-radio-group>
      </div>
      <el-form :model="filters" ref="filters" inline @keyup.enter.native="getFirstAllList()" class="client-form-sty">
        <el-form-item :label="$t('label.keywords')" prop="keyWords">
          <el-input
            class="input-sty"
            v-model.trim="filters.keyWords"
            :placeholder="clueType==1?'请输入单位名称关键字/联系人手机号/线索编号':'请输入客户名称单位名称关键字/手机号/客户编号'">
          </el-input>
        </el-form-item>
         <el-form-item label="单位类型：" prop="unitType">
            <el-select v-model="filters.unitType">
              <el-option v-for="item in unitTypeList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        <el-form-item label="地区：" prop="area">
          <el-cascader :options="areaTree" v-model="filters.area" :props="{value: 'id',label: 'areaName'}"/>
        </el-form-item>
          <el-form-item label="行业：" prop="industry">
            <el-select v-model="filters.industry" multiple :multiple-limit="3">
              <el-option v-for="item in industryTypeList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        <el-button type="primary" @click="getFirstAllList()">{{ $t("button.search") }}</el-button>
        <el-button @click="resetForm()">{{ $t("button.reset") }}</el-button>
      </el-form>
      <div class="distri-btn">
        <el-button type="primary" @click="batchReceive(true)" :disabled="clueList.length ==0">批量领取</el-button>
      </div>
      <!-- 表格内容区-单位 -->
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
          <span id="handle-style" @click="handleDetail(scope.row)">{{ scope.row.userNo }}</span>
        </template>
        <template slot="companyName" slot-scope="scope">
          <div class="certify-contain">
            <span class="companyName-sty" @click="handleDetail(scope.row)">{{ scope.row.companyName }}</span>
            <el-tooltip effect="dark" :content="scope.row.certifiedLabel == 2?'高级认证':'初级认证'" placement="right" v-if="(scope.row.certifiedLabel&&scope.row.certifiedLabel!=0)">
              <img class="certify_img_sty" :src="scope.row.certifiedLabel==2? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
            </el-tooltip>
          </div>
        </template>
        <template slot="contactMobilephone" slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
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
          <el-button type="text" size="small" icon="el-icon-view" @click="handleDetail(scope.row)">查看</el-button>
          <el-button type="text" size="small" icon="el-icon-edit" @click="batchReceive(false,scope.row)">领取</el-button>
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
        :data="dataList"
        :table-loading="tableLoading"
        @selection-change="selectionChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @on-load="getList">
        <template slot="userNo" slot-scope="scope">
          <span id="handle-style" @click="handleDetail(scope.row)">{{ scope.row.userNo }}</span>
        </template>
        <template slot="contactName" slot-scope="scope">
          <div class="certify-contain">
            <span id="handle-style" @click="handleDetail(scope.row)">{{ scope.row.contactName }}</span>
            <el-tooltip effect="dark" content="高级认证" placement="right" v-if="scope.row.isAutoConversion">
              <img class="certify_img_sty" :src="require('@/assets/images/new-client/certified_unit.png')" alt="">
            </el-tooltip>
          </div>
        </template>
        <template slot="contactMobilephone" slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
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
          <el-button type="text" size="small" icon="el-icon-view" @click="handleDetail(scope.row)">查看</el-button>
          <el-button type="text" size="small" icon="el-icon-edit" @click="batchReceive(false,scope.row)">领取</el-button>
        </template>
       </avue-crud>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { getClassifyList } from "@/api/siteSettings/classify";
import { getArea } from "@/api/clue/clue";
import { receive } from '@/api/new-client/my-clue'
import { getEmpInfo } from "@/api/project/wtClass";
import { getSeaList } from "@/api/seas/group"
import { clientOption, soloOption } from "@/const/crud/seas-customers/group-seas";
import { saveDetal } from "@/util/clearDetail";
import * as CodeMsg from "@/api/common/CodeChange";
import { mapState, mapGetters } from "vuex";
import { filterArea, filterIndustry, filterUnitType, filterClueLabel } from "@/util/new-client/filter"
export default {
  data() {
    return {
      clickStatus: false,
      baseUrl: process.env.BASE_URL,
      cEmpNo:"",
      cDeptName:"",
      clueList: [],
      tableLoading: false,
      unitTypeList: [],
      industryTypeList: [],
      areaTree: [],
      soloOption: soloOption,
      option: clientOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
        pageSizes: [5, 8, 10, 20, 30, 50, 100],
      },
      senior: false,
      clueType: 1,
      filters: {
        keyWords: "",
        clientStatus: "", // 客户状态
        area: [],
        unitType: "",
        industry: [],
      },
      dataList: [],
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
      area: (state) => state.category.area,
      ...mapGetters(["permissions"]),
    }),
  },
  filters: {
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
      this.clueType = keepParams.clueType
      this.senior = keepParams.senior;
      this.page.currentPage = keepParams.params.pageNo;
      this.page.pageSize = keepParams.params.pageSize;
      this.filters.keyWords = keepParams.params.key;
      this.filters.area = keepParams.area
      this.filters.unitType = keepParams.params.orgType;
      this.filters.industry = keepParams.industry;
      this.filters.clientStatus = keepParams.params.clueStatusId;
    }
  },
  methods: {
    // 领取提示
    batchReceive(val,row){
      if(this.permissions.bt_receive_group_clue){
      this.$confirm(this.$t("message.seaConfirmOne"),{
          type:'warning',
          cancelButtonClass: 'btn-custom-cancel',
        }).then(()=>{
          val == true? this.receiveOperate(this.clueList) : this.receiveOperate(this.clueType == 1?[row.clueCompanyId]:[row.cluePersonId])
        })
      }else{
        this.$notAuthorized()
      }
    },
    // 领取操作
    receiveOperate(receiveList){
      let params = {
        clueIdList: receiveList
      }
      receive(params,this.clueType,1).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$notify({
            title: this.$t("text.success"),
            message: this.$t("message.receiveSuccess"),
            type: "success",
            duration: 2000,
          });
          this.$refs.crud.toggleSelection()
          this.getList()
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
    // 刷新列表
    refresh() {
      this.getList();
    },
    // 获取员工信息
    showUserInfo(id){
      getEmpInfo(id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.cEmpNo = res.data.data.number
          this.cDeptName = this.userInfo.isPartner?  res.data.data.partnerDeptName : res.data.data.deptName
        }
      })
    },
    selectionChange(val) {
      this.clueList = []
      val.forEach(item=>{
        this.clueList.push(this.clueType == 1?Number(item.clueCompanyId):(item.cluePersonId))
      })
    },
    changeTab() {
      this.page.currentPage = 1;
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
      if(this.permissions.bt_get_group_seas){
      let path = "/new-client-detail";
      let query = {
        type: 1,
        id: this.clueType == 1? row.clueCompanyId : row.cluePersonId,
        clueType: this.clueType,
        source: true
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
        key:this.clickStatus == true ? this.filters.keyWords : "",
        orgAddress: this.clickStatus == true ? this.filters.area.length>0?this.filters.area.join(',') : "" : "",
        orgType: this.clickStatus == true ? this.filters.unitType : "",
        industry: this.clickStatus == true ? this.filters.industry.length>0?this.filters.industry.join(',') : "" : "",
      };
      // 需要缓存的参数
      let keepParams = {
        clickStatus: this.clickStatus,
        clueType: this.clueType,
        params: params,
        senior: this.senior,
        area: this.filters.area,
        industry: this.filters.industry,
        detail: { path: "", query: {} },
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getSeaList(params,this.clueType).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.dataList = res.data.data.records;
          this.page.total = res.data.data.total;
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
      this.filters.unitType = "";
      this.filters.industry = [];
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
  border-left: 1px solid #dcdfe6;
}
.client-form-sty {
  margin: 15px 0 0 0;
}
.btn-sty {
  margin-bottom: 10px;
}
.input-sty {
  width: 310px;
}
.pag-sty {
  float: right;
  margin-top: 20px;
}
.dialog-btn-sty {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.clue-dialog-sty {
  width: 130%;
}
.btn-left-sty {
  padding: 10px 30px;
}
.btn-right-sty {
  padding: 10px 30px;
  margin-left: 50px;
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
.distri-btn{
  margin: -5px 0 10px 0;
}
.senior-check{
  margin-bottom: 10px;
}
.senior-contain{
  margin-bottom: -20px;
}
.companyName-sty{
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #36a6fe;
  cursor: pointer;
}
</style>