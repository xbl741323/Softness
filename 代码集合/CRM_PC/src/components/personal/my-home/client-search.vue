<template>
  <div class="client-search">
    <!-- 展示dialog -->
    <el-dialog :visible.sync="showDialog" :close-on-click-modal="false" :before-close="handleClose" title="客户查询" width="80%">
      <el-form @keyup.enter.native="search()" class="search-home" :model="form" inline>
      <el-form-item label="客户快捷查询：">
        <el-select v-model="form.clueType" class="short-select-sty" @change="changeTab">
          <el-option v-if="permissions.bt_page_clue_company_global" label="单位" :value="1"></el-option>
          <el-option v-if="permissions.bt_page_clue_person_global" label="个人" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区：">
        <el-cascader
          ref="area"
          placeholder="请选择地区"
          :options="areaList"
          :props="{ value: 'id', label: 'areaName' }"
          clearable
          @change="changeArea"
          style="width: 200px">
        </el-cascader>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-input v-model.trim="form.keyWords" :placeholder="form.clueType == 1?'单位名称关键字/联系人姓名/手机号/完整线索编号':'客户姓名/手机号/所在单位名称关键字/完整线索编号'" class="search-home-input"></el-input>
      </el-form-item>
      <el-button type="primary" class="search-home-btn" @click="search">查询</el-button>
    </el-form>
    <!-- 单位列表 -->
    <div v-show="form.clueType == 1">
        <avue-crud
        v-if="showStatus"
        ref="crud"
        :option="tableOption"
        :data="dataList"
        :page.sync="page"
        v-model="searchInfo"
        @size-change="sizeChange"
        @current-change="currentChange"
        v-loading="loading">
        <template slot="clueNo" slot-scope="scope">
          <span>{{ scope.row.clueNo }}</span>
        </template>
        <template slot="clueType" slot-scope="scope">
          <span>{{ scope.row.clueType|typeFilter }}</span>
        </template>
        <template slot="clueStatusId" slot-scope="scope">
          <span>{{scope.row.clueStatusId|filterClueStatus}}</span>
          <span v-if="scope.row.clueStatusId == 2">({{scope.row.clueAttributionEmpDeptId|filterDept}})</span>
        </template>
        <template slot="orgAddress" slot-scope="scope">
          <span>{{scope.row.orgAddress | filterArea}}</span>
        </template>
        <template slot="clueUserEmpName" slot-scope="scope">
          <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
            <span @mouseenter="showUserInfo(scope.row.clueUserEmpId)">{{scope.row.clueUserEmpName}}</span>
          </el-tooltip>
        </template>
        <template slot="clueAttributionEmpName" slot-scope="scope">
          <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
            <span @mouseenter="showUserInfo(scope.row.clueAttributionEmpId)">{{scope.row.clueAttributionEmpName}}</span>
          </el-tooltip>
        </template>
        <template slot="clueSalesmanEmpName" slot-scope="scope">
          <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
            <span @mouseenter="showUserInfo(scope.row.clueSalesmanEmpId)">{{scope.row.clueSalesmanEmpName}}</span>
          </el-tooltip>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" @click="orderDialog = true, clueId = scope.row.clueCompanyId" v-if="scope.row.orderCount > 0">查看订单</el-button>
        </template>
      </avue-crud>
      </div>
      <!-- 个人列表 -->
      <div v-show="form.clueType == 0">
        <avue-crud
        v-if="showStatus"
        ref="crud"
        :option="soloOption"
        :data="dataList"
        :page.sync="page1"
        v-model="searchInfo"
        @size-change="sizeChange1"
        @current-change="currentChange1"
        v-loading="loading">
        <template slot="clueNo" slot-scope="scope">
          <span>{{ scope.row.clueNo }}</span>
        </template>
        <template slot="clueType" slot-scope="scope">
          <span>{{ scope.row.clueType|typeFilter }}</span>
        </template>
        <template slot="clueStatusId" slot-scope="scope">
          <span>{{scope.row.clueStatusId|filterClueStatus}}</span>
          <span v-if="scope.row.clueStatusId == 2">({{scope.row.clueAttributionEmpDeptId|filterDept}})</span>
        </template>
        <template slot="orgAddress" slot-scope="scope">
          <span>{{scope.row.orgAddress | filterArea}}</span>
        </template>
         <template slot="clueUserEmpName" slot-scope="scope">
          <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
            <span @mouseenter="showUserInfo(scope.row.clueUserEmpId)">{{scope.row.clueUserEmpName}}</span>
          </el-tooltip>
        </template>
        <template slot="clueAttributionEmpName" slot-scope="scope">
          <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
            <span @mouseenter="showUserInfo(scope.row.clueAttributionEmpId)">{{scope.row.clueAttributionEmpName}}</span>
          </el-tooltip>
        </template>
        <template slot="clueSalesmanEmpName" slot-scope="scope">
          <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
            <span @mouseenter="showUserInfo(scope.row.clueSalesmanEmpId)">{{scope.row.clueSalesmanEmpName}}</span>
          </el-tooltip>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" @click="orderDialog = true, clueId = Number(scope.row.cluePersonId)" v-if="scope.row.orderCount > 0">查看订单</el-button>
        </template>
      </avue-crud>
      </div>
      <client-order v-if="orderDialog" @close="closeOrder" :clueId="clueId"></client-order>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getEmpInfo } from "@/api/project/wtClass";
import { getGlobalClueList } from "@/api/new-client/clue";
import { tableOption,soloOption } from "@/const/crud/personal/client-search";
import { filterArea, filterDept } from "@/util/new-client/filter"
import { getArea } from "@/api/clue/clue";
import clientOrder from "@/components/personal/my-home/client-order"
export default {
  components: {
    clientOrder
  },
  data() {
    return {
      cEmpNo:"",
      cDeptName:"",
      showStatus: false,
      showDialog: true,
      orderDialog: false,
      loading: false,
      dataList: [],
      form: {
        clueType: 1,
        keyWords: "",
      },
      searchInfo: {},
      tableOption: tableOption,
      soloOption: soloOption,
      options: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [5, 10],
      },
      page1: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [5, 10],
      },
      areaList: [],
      areaPath: "",
      clueId: '',
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  filters: {
    typeFilter(val) {
      return val == 1 ? "单位" : "个人";
    },
    filterClueStatus(val){
      return val == 0?"正常":val == 1?"失效":val == 2?"部门公海":val == 3?"集团公海":val == 4?"合作机构":""
    },
    filterArea(val){ 
      return filterArea(val)
    },
    filterDept(val){ 
      return filterDept(val)
    },
  },
  created() {
    this.getAreaList()
  },
  methods: {
    //获取地区列表
    getAreaList() {
      getArea().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          let list = res.data.data
          list.forEach(item => {
            item.children.unshift({
                areaName: '全部',
                id: 0,
                nodeNumber: 0,
                children:[
                  {
                    areaName: '全部',
                    id: 0,
                    children: null,
                    parentId: 0,
                  }
                ]
              })
          });
          this.areaList = list
        }
      })
    },
    changeArea(){
      this.page = {
        pageSize: 10,
        currentPage: 1,
        pages: [5, 10, 20, 50]
      }
      this.page1 = {
        pageSize: 10,
        currentPage: 1,
        pages: [5, 10, 20, 50]
      }
      this.areaPath = this.$refs.area.getCheckedNodes()[0] ? this.$refs.area.getCheckedNodes()[0].path.join(',') : ''
    },
    changeTab(){
      this.page = {
        pageSize: 10,
        currentPage: 1,
        pages: [5, 10, 20, 50]
      }
      this.page1 = {
        pageSize: 10,
        currentPage: 1,
        pages: [5, 10, 20, 50]
      }
      this.getList()
    },
    closeOrder() {
      this.orderDialog = false
    },
    // 获取员工信息
    showUserInfo(id){
      getEmpInfo(id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.cEmpNo = res.data.data.number
          this.cDeptName = res.data.data.deptName
        }
      })
    },
    getList() {
      this.loading = true
      let params = {
        pageSize: this.form.clueType == 1 ? this.page.pageSize : this.page1.pageSize,
        pageNo: this.form.clueType == 1 ? this.page.currentPage : this.page1.currentPage,
        key: this.form.keyWords.trim(),
        orgAddress: this.areaPath,
        sortField: "createTime",
        sortType: "desc",
      };
      getGlobalClueList(params, this.form.clueType).then((res) => {
        if (res.data.code == 0) {
          this.loading = false
          this.dataList = res.data.data.records;
          if (this.form.clueType == 1) {
            this.page.total = res.data.data.total
          } else {
            this.page1.total = res.data.data.total
          }
        }
      });
    },
    search() {
      this.page = {
        pageSize: 10,
        currentPage: 1,
        pages: [5, 10, 20, 50]
      }
      this.page1 = {
        pageSize: 10,
        currentPage: 1,
        pages: [5, 10, 20, 50]
      }
      if (this.form.keyWords !== "" || this.areaPath !== "") {
        this.page.currentChange = 1;
        this.page1.currentChange = 1;
        this.showStatus = true;
        this.getList();
      } else {
        this.showStatus = false;
      }
    },
    handleClose() {
      this.$emit("close");
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.page.currentPage = 1;
      this.getList();
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.getList();
    },
    sizeChange1(val) {
      this.page.pageSize = val;
      this.page.currentPage = 1;
      this.getList();
    },
    currentChange1(current) {
      this.page.currentPage = current;
      this.getList();
    },
  },
};
</script>

<style scoped>
.client-search {
  background: #fff;
  margin: 10px 0px 10px 10px;
  padding: 15px 0 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.search-home .el-form-item {
  margin-bottom: 50px;
}
.search-home-input {
  width: 400px;
}
.search-home-btn {
  width: 80px;
}
.clickable {
  cursor: pointer;
  color: #36a6fe;
}
.short-select-sty{
  width: 80px !important;
}
</style>