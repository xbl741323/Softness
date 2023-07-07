<!-- 排查完成 -->
<template>
  <basic-container style="margin-left: -10px">
    <div>
      <el-form
        :inline="true"
        :model="filters"
        ref="filters"
        @submit.native.prevent
      >
        <div style="display: flex">
          <div>
            <el-form-item :label="$t('label.keywords')" prop="keywords">
              <el-input
                style="width: 300px"
                v-model="filters.keywords"
                :placeholder="$t('input.keywords')"
                @keyup.enter.native="getFirstAllList()"
              ></el-input>
            </el-form-item>
            <!-- 地区 -->
            <el-form-item :label="$t('label.area')" prop="area">
              <el-cascader 
                ref="cascader"
                :options="areaOptions"
                :props="{ value: 'no', label: 'name',checkStrictly: true  }"
                v-model="filters.area"
                clearable
                collapse-tags
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <!-- 级别 -->
             <el-form-item
              :label="$t('label.level')"
              prop="level">
              <el-select
                :placeholder="$t('input.choose')"
                v-model="filters.level">
                <el-option
                  v-for="(item, index) in levelData"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('label.showStatus')" prop="showStatus">
              <el-select v-model="filters.showStatus">
                <el-option :label="$t('status.all')" :value="null"></el-option>
                <el-option :label="$t('status.show')" :value="1"></el-option>
                <el-option :label="$t('status.noShow')" :value="2"></el-option>
                <el-option :label="$t('message.draft')" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布时间：" prop="publishTime">
            <el-date-picker
              v-model="filters.publishTime"
              :unlink-panels="true"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          </div>
          <div  class="wid">
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="getFirstAllList()"
              >{{ $t("button.search") }}</el-button
            >
            <el-button
              icon="el-icon-refresh-left"
              @click="resetForm('filters')"
              >{{ $t("button.reset") }}</el-button
            >
            <el-button icon="el-icon-plus" type="success" @click="addArticle">{{
              $t("button.addArticle")
            }}</el-button>
          </div>
        </div>
        <div v-if="seniorStatus" style="margin-bottom: 10px; margin-top: -10px">
          <el-checkbox v-model="senior">{{
            $t("message.hignSearch")
          }}</el-checkbox>
        </div>
        <div v-if="senior">
          <el-form-item
            v-for="(item, index) in belongData"
            :label="item.categoryName"
            :key="index"
            prop="policyType">
            <el-select
              v-model="arr[index]"
              @change="addPolicyParam"
              value-key="id"
              :multiple='item.choice == 1?true:false'>
              <el-option
                v-for="(option, index) in item.optionList"
                :label="option.name"
                :key="index"
                :value="option.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div>
        <div class="batch-handle">
        <span class="handle-txt" v-if="this.delList.length != 0">已选择<b>{{delList.length}}</b>项</span><span class="handle-txt">批量操作：</span>
          <el-button
            type="danger"
            icon="el-icon-delete"
            :disabled="this.delList.length == 0"
            @click="deleteBatch"
            >{{ $t("button.delete") }}</el-button
          >
        </div>
        <avue-crud
          class="batch-choose"
          ref="crud"
          :page.sync="page"
          :table-loading="tableLoading"
          :data="tableData"
          :option="tableOption"
          @selection-change="selectionChange"
          @current-change="currentChange"
          @on-load="getList">
          <template slot="pageViews" slot-scope="scope">
            <span>{{ scope.row.pageViews|viewFilter }}</span>
            <span>/</span>
            <span>{{ scope.row.collects|viewFilter }}</span>
          </template>
          <template slot="number" slot-scope="scope">
            <span
              @click="handleDetail(scope.row, scope.index)"
              style="color: #409eff; cursor: pointer"
              >{{ scope.row.number }}</span
            >
          </template>
          <template slot="title" slot-scope="scope">
            <span
              @click="handleDetail(scope.row, scope.index)"
              style="color: #409eff; cursor: pointer"
              >{{ scope.row.title }}</span
            >
          </template>
          <template slot="createUserName" slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+scope.row.employeeNumber+'   部门：'+scope.row.deptName" placement="right">
                 <span>{{ scope.row.createUserName }}</span>
           </el-tooltip>
          </template>
          <!-- 级别 -->
          <template slot="level" slot-scope="scope">
            <span v-if="scope.row.level">{{ scope.row.level | levelFilter}}</span>
          </template>
          <!-- 地区 -->
          <template slot="area" slot-scope="scope">
            <span v-if="scope.row.options">{{ scope.row.options | areaFilter}}</span>
          </template> 
          <!-- 问题类型 -->
          <template slot="questionType" slot-scope="scope">
            <span v-if="scope.row.options">{{scope.row.options | questionFilter}}</span>
          </template>
          <template slot="showStatus" slot-scope="scope">
            <el-select
              v-model="scope.row.showStatus"
              @change="changeStatus(scope.row, scope.index)"
              :disabled="scope.row.deleted == 1"
            >
              <el-option :label="$t('status.show')" :value="1"></el-option>
              <el-option :label="$t('status.noShow')" :value="2"></el-option>
              <el-option
                :label="$t('status.toped')"
                disabled
                :value="0"
              ></el-option>
            </el-select>
          </template>
          <template
            v-for="item in classSet"
            :slot="item.prop"
            slot-scope="scope"
          >
            <span :key="item.prop">{{
              scope.row.options | classifyFilter(item)
            }}</span>
          </template>
          <template slot="showStatusEnum" slot-scope="scope">
            <span v-if="scope.row.isDraft == 0">{{
              scope.row.showStatusEnum
            }}</span>
            <span v-if="scope.row.isDraft == 1">{{
              scope.row.isDraft | drafFilter
            }}</span>
          </template>
          <template slot="menu" slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-view"
              @click="handleCheck(scope.row, scope.index)"
              >{{ $t("button.view") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-edit"
              @click="handleEdit(scope.row, scope.index)"
              >{{ $t("button.edit") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(scope.row, scope.index)"
              >{{ $t("button.delete") }}</el-button
            >
          </template>
        </avue-crud>
      </div>
    </div>
  </basic-container>
</template>

<script>
import {
  deleteNutice,
  getMyPolicyList,
  batchDelete,
  listChangeStatus,
} from "@/api/personal/problem";
import * as productData from '@/views/project/project-data';
import { getNewArea } from "@/api/policy/list";
import { tableOption } from "@/const/crud/personal/trouble";
import * as CodeMsg from "@/api/common/CodeChange";
import { saveDetal } from "@/util/clearDetail"
import { mapState } from "vuex";
export default {
  data() {
    return {
      clickStatus:false,
      tableLoading:false,
      seniorStatus:true,
      princeInfo: {},
      princeRadio: null,
      princeCopyChild: [],
      princeChild: [],
      belongData: [],
      skiBaseUrl: "",
      editData: {},
      delList: [],
      arr: [],
      optionList:[],
      classSet: [],
      areaOptions: [],
      filters: {
        keywords: "",
        publishMan: "",
        showStatus: null,
        policyType: null,
        publishTime:[],
        level: null,
        area: [],
      },
      levelData: productData.levelData,
      senior: false,
      tableData: [],
      belongList: [],
      optionsIds: [],
      tableOption: tableOption,
      page: {
        total: 0, // 总页数
        layout: "total,prev,pager,next, jumper",
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
    };
  },
  computed: {
    ...mapState({
      troubleSelection: (state) => state.category.troubleSelection,
      notices: (state) => state.category.notices,
    }),
  },
  filters: {
    viewFilter(val){
      if(val/10000>=1){
        return (val/10000).toFixed(2)+'万'
      }else{
        return val
      }
    },
    classifyFilter(list, obj) {
      let result = "";
      list.forEach((item) => {
        if (item.categoryId == obj.prop) {
          result = item.optionNames.toString();
        }
      });
      return result;
    },
     levelFilter(val){
      if(val){
        return val == 1 ? '国家级' : val == 2 ? '省级' : val == 3 ? '市级' : val == 4 ? '区级' : ''
      }
    },
    areaFilter(val){
      let result = ''
      if(val.length > 0){
        val.forEach(item => {
          if(item.categoryId == 1){
            result = item.optionNames.toString()
          }
        })
        return result
      }
      
    },
    questionFilter(val){
      let result = ''
      if(val.length > 0){
        val.forEach(item => {
          if(item.categoryId == 3){
            result = item.optionNames.toString()
          }
        })
        return result
      }
    },
    drafFilter(val) {
      return val == 1 ? this.$t("message.draft") : "";
    },
  },
  created(){
    if(sessionStorage.getItem(`${this.$route.path}+trouble`)){
      let keepParams  = JSON.parse(sessionStorage.getItem(`${this.$route.path}+trouble`))
      if(sessionStorage.getItem(`${this.$route.path}`)){
      let keepParams2  = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
       if(keepParams2.detail.path!==""){
        this.$router.push({
          path:keepParams2.detail.path,
          query:keepParams2.detail.query,
        })
        return;
      }
      }
      this.filters.keywords = keepParams.params.title
      this.filters.showStatus = keepParams.params.showStatus
      this.page.currentPage = keepParams.params.start
      this.page.pageSize = keepParams.params.size
      this.filters.publishTime = keepParams.publishTime
      this.senior = keepParams.senior
      this.clickStatus = keepParams.clickStatus
      this.filters.area = keepParams.area
      this.filters.level = keepParams.level
      this.selectDrop = keepParams.selectDrop
      this.arr = keepParams.arr
      this.belongData = keepParams.belongData
    }
  },
  methods: {
    addPolicyParam(obj) {},
    changeStatus(value) {
      let para = {
        id: value.id,
        showStatus: value.showStatus
      };
      this.$confirm(this.$t("alert.editStatus"), this.$t("title.notice"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      }).then(() => {
          listChangeStatus(para).then(res => {
              this.getList();
              this.$message({
                type: "success",
                message: this.$t("alert.sucessEdit"),
                offset: 300
              });
            })
            .catch(err => {
              console.log(err);
              this.getList();
            });
        }).catch(() => {
          this.getList();
        })},
    deleteBatch() {
      this.$confirm(
        this.$t("message.choosed") +
          `${this.delList.length}` +
          this.$t("message.essayConfirmDelete"),
        {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        }
      )
        .then(() => {
          let param = {
            showStatus: 3,
            numbers: this.delList,
          };
          batchDelete(param)
            .then((res) => {
              if (res.data.code == CodeMsg.CODE_1000) {
                this.$message({
                  type: "success",
                  message: this.$t("alert.sucessDelete"),
                });
                this.getAllList();
              } else {
                this.$message({
                  type: "warning",
                  message: this.$t("alert.ContactStaffHandleFail"),
                  offset: 300,
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getFirstAllList() {
      this.clickStatus = true
      this.page.currentPage = 1;
      this.getList();
    },
    selectionChange(val) {
      this.delList = [];
      val.forEach((item) => {
        this.delList.push(item.number);
      });
    },
    addArticle() {
      let path = "/personal-addtrouble"
      let query = {
        type: 2,
        beFrom: 1,
      }
      saveDetal(`${this.$route.path}`,path,query)
      this.$router.push({ path: path, query: query})
    },
    resetForm(formName) {
      this.clickStatus = false
      this.$refs[formName].resetFields();
      this.filters.keywords = ""
      this.filters.publishMan = ""
      this.filters.showStatus = null
      this.arr = [];
      this.optionsIds = [];
      this.filters.publishTime = []
      this.filters.area = []
      this.filters.level = null
      this.getAllList();
    },
    getList() {
      this.tableLoading = true;
      this.optionList = []
      this.arr.forEach((item) => {
        if(Array.isArray(item) == true){
           this.optionList.push(item);
        }else{
           this.optionList.push([item]);
        }
      });
      let params = {
        title: this.clickStatus==true?(this.filters.keywords):"",
        createUserName: this.filters.publishMan,
        showStatus: this.clickStatus==true?(this.filters.showStatus):null,
        areaNo: '',
        level: this.filters.level == null ? null : this.filters.level,
        type: 2,
        size: this.page.pageSize,
        start: this.page.currentPage,
        selection: this.clickStatus==true?(this.optionList):[],
        startTime:
          this.clickStatus==true?(
            this.filters.publishTime[0] != null
            ? this.$moment(this.filters.publishTime[0]).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : ""
          ):"",
        endTime:
          this.clickStatus==true?(
            this.filters.publishTime[1] != null
            ? this.$moment(this.filters.publishTime[1]).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : ""):"",
      };
      if(this.filters.area){
        params.areaNo = this.filters.area.toString()
      }
      // 需要缓存的参数
      let keepParams = {
        clickStatus:this.clickStatus,
        params:params,
        publishTime:this.filters.publishTime,
        senior:this.senior,
        arr:this.arr,
        belongData:this.belongData,
        area: this.filters.area,
        level: this.filters.level,
      }
      sessionStorage.setItem(`${this.$route.path}+trouble`,JSON.stringify(keepParams))
      // 需要缓存的参数
      let keepParams2 = {
        detail:{path:"",query:{}}
      }
      sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams2))
      getMyPolicyList(params).then((res) => {
        this.classSet = [];
        this.tableData = [];
        this.tableData = res.data.data.resultList.list;
        this.page.total = res.data.data.resultList.total;
        this.classSet = res.data.data.category;
        let otherOptions = [
          {label: '文章编号',prop: 'number',overHidden: true,width: 140,slot:true,}, 
          {label: '标题',prop: 'title',width:300,overHidden: true,slot:true,}, 
          {label: '发布人', prop: 'createUserName',overHidden:true,slot:true},
          {label: '发布时间', prop: 'createTime',type: 'datetime',width:130,format: 'yyyy-MM-dd HH:mm',valueFormat: 'yyyy-MM-dd HH:mm:ss'},
          {label: '显示状态', prop: 'showStatus',slot:true},
          {label: '浏览量/收藏量', prop:'pageViews',slot:true,width: 100,overHidden: true},
          {label: '问题类型', prop:'questionType',slot:true,overHidden: true},
          {label: '级别', prop:'level',slot:true,overHidden: true},
          {label: '地区', prop:'area',slot:true,overHidden: true},
          ]
        this.tableOption.column = otherOptions;
        this.tableLoading = false
      });
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.getList();
    },
    handleCheck(row, index) {
      this.skiBaseUrl = "http://web-test.wotao.com/";
      if (process.env.NODE_ENV == "production") {
        this.skiBaseUrl = "https://wotao.com/";
      } else if (process.env.NODE_ENV == "development") {
        this.skiBaseUrl = "http://localhost:3333/";
      }
      window.open(this.skiBaseUrl + "policy/trouble/" + row.number + "1");
    },
    handleDetail(row, index) {
      let path = "/personal-editnotice"
      let query = {
        number: row.number,
        beFrom: 1,
        type: row.type,
      }
      saveDetal(`${this.$route.path}`,path,query)
      this.$router.push({ path: path, query: query})
    },
    handleEdit(row, index) {
      let path = "/personal-editnotice"
      let query = {
        number: row.number,
        beFrom: 1,
        type: row.type,
        deleted: row.deleted,
      }
      saveDetal(`${this.$route.path}`,path,query)
      this.$router.push({ path: path, query: query})
    },
     getDropdown() {
      this.belongData = this.troubleSelection;
      if(this.belongData.length == 0){
        this.seniorStatus = false
      }
      getNewArea().then(res => {
        this.areaOptions = res.data.data
      }).catch((error) => {
        console.log(error)
      })
    },
    handleDelete(row, index) {
      this.$confirm(
        this.$t("message.deleteConfirm") +
          row.number +
          this.$t("message.isEssay"),
        this.$t("message.warningTxt"),
        {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        }
      ).then(() => {
        deleteNutice(row.number).then((res) => {
          if (res.data.code == CodeMsg.CODE_1000) {
            this.getAllList();
            this.$message({
              type: "success",
              message: this.$t("alert.sucessDelete"),
              offset: 300,
            });
          }
        });
      });
    },
  },
  mounted() {
    this.getDropdown();
  },
};
</script>

<style scoped>
.filter_punt {
  margin: 5px 0px 15px 0px;
}
.filter_province {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  margin-left: 8px;
}
.province_parent {
  margin-left: -8px;
  display: flex;
  align-items: center;
}
.trouble_province_child {
  /* background: #ccc; */
  margin-left: 34px;
}
.radio_item:nth-of-type(1) {
  border-left: none;
}
.radio_item {
  margin-right: 10px;
  margin-top: 10px;
  border-left: 1px solid #dcdfe6;
  border-radius: 0px 0px 0px 0px;
}
.wid {
  width: 30%;
}
</style>