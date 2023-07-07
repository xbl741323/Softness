<template>
  <basic-container>
    <div class="marg">
      <el-form class="form-indus" inline :model="filters" ref="filters" label-width="90px" @submit.native.prevent>
            <div class="indus-flex-sty">
              <div>
                <el-form-item label="关键字：" prop="keywords" label-width="70px" style="margin-right:-10px;">
              <el-input v-model.trim="filters.keywords" placeholder="请输入标题关键字" @keyup.enter.native="getFirstAllList()"></el-input>
            </el-form-item>
            <el-form-item label="服务分类：" prop="cate" style="margin-left:10px;">
              <el-select v-model="filters.cate" :placeholder="$t('input.choose')">
                <el-option
                  v-for="(item, index) in cateList"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="显示状态："
              prop="showStatus">
              <el-select
                :placeholder="$t('input.choose')"
                v-model="filters.showStatus">
                <el-option
                  v-for="(item, index) in showStatusData"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间：" prop="publishTime">
            <el-date-picker
              v-model="filters.publishTime"
              :unlink-panels="true"
              style="width:310px;"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            </el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="getFirstAllList()">{{$t('button.search')}}</el-button>
            <el-button icon="el-icon-refresh-left" @click="resetForm('filters')">{{$t('button.reset')}}</el-button>
              </div>
            </div>
      </el-form>
      <!-- 批量设置显示状态  -->
      <el-dialog
        width="40%"
        title="批量设置显示状态"
        :visible.sync="statusDialog"
        :close-on-click-modal="false">
        <el-form :model="batchForm" label-width="140px" ref="batchForm" :rules="rules">
          <p style="margin-left: 25px">
            已选择
            <span style="color: #ff0000">{{this.batchList.length}}</span>篇文章
          </p>
          <el-form-item label="设置显示状态：" prop="showStatus">
            <el-radio-group v-model="batchForm.showStatus">
              <el-radio :label="0">置顶</el-radio>
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="2">不显示</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="batchStatus('batchForm')">确 认</el-button>
          <el-button @click="statusDialog = false">取 消</el-button>
        </div>
      </el-dialog>
      <div>
        <div class="batch-handle-indu">
          <el-button icon="el-icon-view" type="primary" :disabled="this.batchList.length==0" @click="permissions.sys_mation_edit ? statusDialog = true : $notAuthorized()">显示状态</el-button>
          <el-button icon="el-icon-delete" type="danger" @click="permissions.sys_mation_del ? deleteBatch() : $notAuthorized()" :disabled="this.batchList.length==0">批量删除</el-button>
          <el-button icon="el-icon-plus" type="success" @click="permissions.sys_mation_edit ? addArticle() : $notAuthorized()">{{$t('button.addArticle')}}</el-button>
        </div>
        <avue-crud
          class="batch-choose"
          ref="crud"
          :table-loading="tableLoading"
          :page.sync="page"
          :data="tableData"
          :option="tableOption"
          @selection-change="selectionChange"
          @on-load="getList">
          <template slot="pageViews" slot-scope="scope">
            <span>{{ scope.row.pageViews|viewFilter }}</span>
            <span>/</span>
            <span>{{ scope.row.collects|viewFilter }}</span>
          </template>
          <template slot="industryNo" slot-scope="scope">
            <span
              @click="permissions.sys_mation_edit ? handleEdit(scope.row, 0) : $notAuthorized()"
              style="color:#409EFF;cursor:pointer;"
            >{{ scope.row.industryNo }}</span>
          </template>
          <template slot="title" slot-scope="scope">
            <span
              @click="permissions.sys_mation_edit ? handleEdit(scope.row, 0) : $notAuthorized()"
              style="color:#409EFF;cursor:pointer;"
            >{{ scope.row.title }}</span>
          </template>
          <template slot="categoryId" slot-scope="scope">
            <span>{{ scope.row.categoryId  | filterCate}}</span>
          </template>
          <template slot="createByName" slot-scope="scope">
            <span>{{ scope.row.createByName+'（'+scope.row.createByNo+'）' }}</span>
          </template>
          <template slot="state" slot-scope="scope">
            <span v-if="scope.row.deleted == 1">{{$t('status.deleted')}}</span>
            <div v-else>
              <el-select
                v-model="scope.row.state"
                @change="changeStatus(scope.row,scope.index)"
                :disabled="scope.row.deleted==1 || !permissions.sys_mation_edit">
                <el-option :label="$t('status.show')" :value="1"></el-option>
                <el-option :label="$t('status.noShow')" :value="2"></el-option>
                <el-option :label="$t('status.toped')" :value="0"></el-option>
              </el-select>
            </div>
          </template>
          <template slot="menu" slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-view" v-if="scope.row.auditState!=3" @click="handleCheck(scope.row, scope.index)">{{ $t("button.view") }}</el-button>
              <el-button type="text" size="small" icon="el-icon-edit" v-if="scope.row.auditState>0" @click="permissions.sys_mation_edit ? handleEdit(scope.row, 1) : $notAuthorized()">编辑</el-button>
              <el-button type="text" size="small" icon="el-icon-link" @click="permissions.sys_mation_detail ? getCodeLink(scope.row) : $notAuthorized()" v-if="scope.row.auditState == 2&&scope.row.state<2" :data-clipboard-text="scope.row.title+'：'+link" class="link">推广</el-button>
              <el-button type="text" size="small" icon="el-icon-delete"  @click="permissions.sys_mation_del ? handleDelete(scope.row, scope.index) : $notAuthorized()">{{ $t("button.delete") }}</el-button>
          </template>
        </avue-crud>
      </div>
      <share-dialog :dialogShow="dialogShow" :dialogForm="dialogForm" :type="1" @shareClose="shareClose" v-if="dialogShow"></share-dialog>
    </div>
  </basic-container>
</template>
<script>
import { tableOption } from "@/const/crud/policy/industry";
import * as CodeMsg from "@/api/common/CodeChange";
import { industryList,batchShowStatus,batchDelete,deleteIndustry,listChangeStatus } from "@/api/policy/industry";
import { getListPolicy,getNewArea} from "@/api/policy/list"
import { getEmpList } from '@/api/clue/clue';
import { saveDetal } from "@/util/clearDetail"
import { getWxYaoCode } from "@/api/personal/myhome";
import { mapGetters } from 'vuex';
import * as productData from '@/views/project/project-data';
import shareDialog from "@/components/shareDialog/index.vue";
export default {
  components: {
    shareDialog
  },
  data() {
    return {
      clickStatus:false,
      tableLoading:false,
      linkType:10,
      policyDelete:false,
      statusInfo:{
        filterStatus:"",
      },
      detailType:"",
      dialogShow: false,
      dialogForm: {},
      empList:[],
      princeInfo: {},
      princeRadio: null,
      princeCopyChild:[],
      princeChild: [],
      skiBaseUrl: "",
      fastAreaOptions: [],
      belongData: [],
      classSet:[],
      filters: {
        publishMan:"",
        keywords:"",
        publishTime: [],
        showStatus:null,
        processStatus: null,
        cate: null
      },
      cateList: productData.orderTypeDatas,
      showStatusData: productData.showData,
      processStatusData: productData.processStatusData,
      optionList:[],
      selectDrop:[],
      batchForm: {},
      statusDialog: false,
      tableData: [],
      newAreaOptions: [],
      tableOption: tableOption,
      batchList: [],
      batchVal: [],
      publisManId:"",
      page: {
        total: 0, // 总页数
        layout: "total,prev,pager,next, jumper",
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      rules: {
        showStatus: [
          { required: true, message: "请选择显示状态", trigger: "change" },
        ]
      },
      code:'',
      link:''
    };
  },
  filters:{
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
    filterCate(val){
      if(val){
        return val == 1 ? '项目申报' : val == 2 ? '知识产权' : val == 7 ? '工商财税' : val == 9 ? '融资上市' : val == 10 ? '法律服务':val == 11 ? '软件开发':''
      }
    },
    filterStatus(val){
      if(val){
        return val == 0 ? '待审核' : val == 1 ? '草稿' : val == 2 ? '已通过' : val == 3 ? '未通过':''
      }
    },
  
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created(){
    if(!this.permissions.sys_mation_detail && !this.permissions.sys_mation_edit && !this.permissions.sys_mation_del) this.$notAuthorized()
    if(sessionStorage.getItem(`${this.$route.path}`)){
      let keepParams  = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
      if(keepParams.detail.path!==""){
        this.$router.push({
          path:keepParams.detail.path,
          query:keepParams.detail.query,
        })
        return;
      }
      this.filters.keywords = keepParams.params.title
      this.filters.showStatus = keepParams.params.showStatus
      this.page.currentPage = keepParams.params.start
      this.page.pageSize = keepParams.params.size
      this.filters.publishTime = keepParams.publishTime
      // this.filters.publishMan = keepParams.publishMan
      // this.publisManId = keepParams.params.createUserName
      this.clickStatus = keepParams.clickStatus
      this.filters.processStatus = keepParams.params.auditState
      if(keepParams.params.policyStatus){
      this.statusInfo.filterStatus = keepParams.params.policyStatus
      }
    }
  },
  methods: {
    shareClose() {
      this.dialogShow = false
    },
    getCodeLink(row){
      this.dialogShow = true
      this.dialogForm = row
    },
    // 多选框取消选择
    toggleSelection(val) {
      this.$refs.crud.toggleSelection(val);
    },
    // 批量改变状态
    batchStatus(formName) {
      let param = {
        state: this.batchForm.showStatus,
        industryNos: this.batchList,
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          batchShowStatus(param)
            .then((res) => {
              if (res.data.code == CodeMsg.CODE_1000) {
                this.$message({
                  type: "success",
                  message: "设置成功！",
                });
                this.toggleSelection(this.batchVal);
                this.batchForm = {};
                this.statusDialog = false;
                this.getAllList();
              } else if(res.data.code != CodeMsg.CODE_1000) {
                this.$message({
                  type: "warning",
                  message: res.data.msg,
                  offset: 300,
                });
              }
            }).catch((err) => {
              console.log(err);
            });
        } else {
        }
      });
    },
    // 批量删除
    deleteBatch() {
      this.$confirm(`已选择${this.batchList.length}篇文章，确定删除吗?`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(() => {
        let param = {
          industryNos: this.batchList,
        };
        if(this.policyDelete){
           this.$message({
            type:"warning",
            message:"待审核状态的行业资讯不能删除！"
          })
        }else{
          batchDelete(param)
          .then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "删除成功！",
                duration: 2000
              });
              this.toggleSelection(this.batchVal);
              this.batchForm = {};
              this.getAllList();
            } else if(res.data.code != CodeMsg.CODE_1000) {
              this.$message({
                type: "warning",
                message: "操作失败联系工作人员!",
                offset: 300,
              });
            }
          }).catch((err) => {
            console.log(err);
          });
        }}).catch(() => {});
    },
    changePublish(val){
      this.$nextTick(()=>{
       this.publisManId = this.$refs['client'].getCheckedNodes()[0].data.customerName;
      })
    },
    chooseType(val){
      this.statusInfo.filterStatus = val
      this.getAllList()
    },
    areaReset(){
      this.princeInfo = {}
      this.princeChild = [];
      this.princeCopyChild = [];
      this.getAllList();
    },
    showPrinceChild() {
      this.getAllList()
    },
    showProvince(val) {
      this.princeChild = [];
      this.princeCopyChild = []
      if (val.label == "全国") {
         this.princeInfo = {}
         this.princeCopyChild.push(val.children[0].value)
         this.getAllList();
      } else {
        val.children.forEach((item) => {
          this.princeCopyChild.push(item.value);
        });
        this.princeInfo = val;
        this.getAllList();
      }
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
    changeStatus(value) {
      let para = {
        id: value.id,
        state: value.state,
        industryNo:value.industryNo,
        isDraft: value.isDraft
      };
      this.$confirm(this.$t("alert.editStatus"), this.$t("title.notice"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
         listChangeStatus(para).then((res) => {
           if(res.data.code == CodeMsg.CODE_1000){
             this.$message({
              type: "success",
              message: this.$t("alert.sucessEdit"),
              offset: 300,
            });
             this.getList();
           }else{
             this.getList();
           }
          })
        }).catch(() => {
           this.getList();
        });
    },
    selectionChange(val) {
      this.batchList = [];
      this.batchVal = []
      this.batchVal = val;
      this.policyDelete = false
      for (let i = 0; i < this.batchVal.length; i++) {
        this.batchList.push(this.batchVal[i].industryNo);
        if(this.batchVal[i].policyStatus == 0){
          this.policyDelete = true
        }
      }
    },
    addArticle() {
      let path = "/add-industry"
      let query = {type: 1,source: 'person'}
      saveDetal(`${this.$route.path}`,path,query)
      this.$router.push({ path: path, query: query})
    },
    getList() {
      this.tableLoading = true;
      this.optionList = []
      this.selectDrop.forEach((item) => {
        if(Array.isArray(item) == true){
           this.optionList.push(item);
        }else{
           this.optionList.push([item]);
        }
      });
      let params = {
        categoryId: this.filters.cate,
        title: this.clickStatus==true?(this.filters.keywords):"",
        state: this.filters.showStatus,
        size: this.page.pageSize,
        start: this.page.currentPage,
        auditState: this.filters.processStatus,
        startTime: this.clickStatus==true?(this.filters.publishTime[0] != null ? this.$moment(this.filters.publishTime[0]).format( "YYYY-MM-DD HH:mm:ss"): ""):"",
        endTime: this.clickStatus==true?(this.filters.publishTime[1] != null? this.$moment(this.filters.publishTime[1]).format("YYYY-MM-DD HH:mm:ss"): ""):"",
      };
      // 需要缓存的参数
      let keepParams = {
        clickStatus:this.clickStatus,
        params:params,
        publishTime:this.filters.publishTime,
        publishMan:this.filters.publishMan,
        detail:{path:"",query:{}},
      }
      sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
      industryList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.tableData = res.data.data.records;
          this.page.total = res.data.data.total;
          this.tableLoading = false;
        }
      });
    },
    resetForm(formName) {
      this.clickStatus = false
      this.$refs[formName].resetFields();
      this.filters.keywords = ""
      this.filters.publishMan = ""
      this.filters.showStatus = null
      this.filters.publishTime = [];
      this.filters.processStatus = null
      this.filters.cate = null
      this.statusInfo.filterStatus = ""
      this.publisManId = ""
      sessionStorage.removeItem("clue-belong")
      this.getAllList();
    },
    handleEdit(row, num) {
      this.detailType = num
      let path = "/edit-industry"
      let query = {
        type: 1,
        operateType:this.detailType,//1编辑 0查看详情,
        number:row.industryNo,
        source: 'person'
      }
      saveDetal(`${this.$route.path}`,path,query)
      this.$router.push({ path: path, query: query})
    },
    handleCheck(row, index) {
      this.skiBaseUrl = "http://web-test.wotao.com/";
      if (process.env.NODE_ENV == "production") {
        this.skiBaseUrl = "https://wotao.com/";
      } else if (process.env.NODE_ENV == "development") {
        this.skiBaseUrl = "http://localhost:3333/";
      }
      window.open(this.skiBaseUrl + "policy/" + row.industryNo + this.linkType + 1);
    },
    handleDelete(row, index) {
      this.$confirm('是否确认删除"' + row.title + '"的行业资讯?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      }).then(()=>{
        deleteIndustry(row.industryNo).then(res=>{
          if(res.data.code == CodeMsg.CODE_1000){
            this.$message({
            type: "success",
            message: "删除成功！",
            offset: 300,
            duration: 2000
          });
          this.getAllList()
          }
        })
      })
    },
    // 获取动态下拉框数据（搜索、快速修改）
    getDropdown() {
        getWxYaoCode().then(res=>{
          this.code = res.data.data
        });
        getListPolicy(10).then((res) => {
          // this.areaOptions = res.data.data.area;
          this.belongData = res.data.data.selection;
        }).catch((err) => {
          console.log(err);
        });
        getEmpList(true).then(res=>{//员工
          this.empList = res.data.data;
        }).catch(err=>{
          return false;
        })
        getNewArea().then(res => {
          this.newAreaOptions = res.data.data
        }).catch(err => {
            console.log(err);
        });
    }
  },
  mounted() {
    this.getDropdown();
  }
};
</script>

<style>
.filter_punt {
  margin: 5px 0px 15px 0px;
}
.filter_province {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  margin-left: 8px;
}
.province_parent_indu {
  margin-left: -4px;
  display: flex;
  align-items: center;
}
.industry_province_child {
  margin-left: 38px;
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
.area-sty{
  font-size:14px;
  color:#606266;
}
.senior-sty-indu{
  margin-left: 2px;
}
.batch-handle-indu{
  margin: 10px 2px 12px 2px;
}
.circleBlue{
  width:6px;
  height:6px;
  float:left;
  border-radius: 50%;
  background: #36A6FE;
  margin-top:4px;
  margin-right:7px;
}
.success{
    font-weight:bolder;
    font-size:12px;
    float:left;
    color:green;
    margin-top:2px;
    margin-right:6px;
}
.circleRed{
  background: red;
}
.radio-sty-left {   
  border-left: 1px solid #dcdfe6;
}
.radio-sty {  
  margin-left: 20px;
}
.filter-Status{
  margin: 0 0 -10px -22px;
}
.form-indus{
  margin-bottom: -10px;
}
.industry-over-sty-flex{
  display: block;
  width: 107px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.industry-class-sty{
  width: 250px;
}
.indus-flex-sty{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.audit-status{
  display: inline-block;
  width: 5px;
  height: 5px;
  margin-right: 4px;
  background:#fff;
  border-radius: 10px;
}
.audit-status-blue{
  background:#36A6FE;
  border-radius: 10px;
}
.audit-status-orange{
  background:orange;
  border-radius: 10px;
}
.audit-status-red{
  background:red;
  border-radius: 10px;
}
.audit-status-font-green{
  color:green;
  font-weight: bold;
  margin-right: 2px;
}
.policy-status-sty{
  display: flex;
  justify-content: center;
  align-items: center;
}
.marg {
  margin-left: -20px;
}
</style>