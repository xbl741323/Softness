<template>
<!-- 排查完成 -->
  <div class="clue-frame">
    <el-form :model="clueForm" label-width="100px" @submit.native.prevent  @keyup.enter.native="currentPage = 1,($route.query.source == 'list')  ? getAllClues() : getList()">
      <el-form-item label="线索类型：">
        <el-radio-group v-model="clueForm.clueType" @change="currentPage = 1;($route.query.source == 'list') ? getAllClues() : getList()" v-if="this.existingProducts.length>0">
          <el-radio :label="1" :disabled="this.existingProducts[0].clueType == 1">单位</el-radio>
          <el-radio :label="0" :disabled="this.existingProducts[0].clueType == 0">个人</el-radio>
        </el-radio-group>
        <el-radio-group v-model="clueForm.clueType" @change="currentPage =1;($route.query.source == 'list')  ? getAllClues() : getList()" v-else>
          <el-radio :label="1" :disabled="this.selectPersonal">单位</el-radio>
          <el-radio :label="0" :disabled="this.selectOrg">个人</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-input class="product-input" :placeholder="placeholderTxt" v-model.trim="clueForm.keyWords"/>
        <el-button size="mini" type="primary" @click="currentPage = 1,($route.query.source == 'list')  ? getAllClues() : getList()">搜索</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 单位线索列表 -->
    <el-table :data="tableData" max-height="350" border @selection-change="handleSelectionChange" :header-cell-class-name="cellClass" class="table" v-if="clueForm.clueType ==1">
      <el-table-column type="selection" :selectable="selectAble"></el-table-column>
      <el-table-column label="线索编号" prop="clueNo" show-overflow-tooltip width="180" align="center"></el-table-column>
      <el-table-column label="单位名称" prop="companyName" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="联系人" prop="contactName" align="center"></el-table-column>
      <el-table-column label="联系方式" prop="mobile" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="线索归属" prop="clueAttributionEmpName" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.clueAttributionEmpName!='自主'">
            <el-tooltip effect="dark" :content="'工号：'+cEmpNo+' 部门：'+cDeptName" placement="top">
              <span @mouseover="showUserInfo(scope.row.clueAttributionEmpId)">{{scope.row.clueAttributionEmpName}}</span>
            </el-tooltip>
          </div>
          <div v-else>
             <span>{{scope.row.clueAttributionEmpName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="业务员" prop="clueSalesmanEmpName" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.clueSalesmanEmpName!='自主'">
            <el-tooltip effect="dark" :content="'工号：'+cEmpNo+' 部门：'+cDeptName" placement="top">
              <span @mouseover="showUserInfo(scope.row.clueSalesmanEmpId)">{{scope.row.clueSalesmanEmpName}}</span>
            </el-tooltip>
          </div>
          <div v-else>
             <span>{{scope.row.clueSalesmanEmpName}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 个人线索列表 -->
    <el-table :data="tableData" max-height="400" border @selection-change="handleSelectionChange" :header-cell-class-name="cellClass" class="table" v-if="clueForm.clueType == 0">
      <el-table-column type="selection" :selectable="selectAble"></el-table-column>
      <el-table-column label="线索编号" prop="clueNo" show-overflow-tooltip width="180" align="center"></el-table-column>
      <el-table-column label="线索姓名" prop="contactName" align="center"></el-table-column>
      <el-table-column label="单位名称" prop="companyName" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="联系方式" prop="mobile" show-overflow-tooltip  align="center"></el-table-column>
      <el-table-column label="线索归属" prop="clueAttributionEmpName" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.clueAttributionEmpName!='自主'">
            <el-tooltip effect="dark" :content="'工号：'+cEmpNo+' 部门：'+cDeptName" placement="top">
              <span @mouseover="showUserInfo(scope.row.clueAttributionEmpId)">{{scope.row.clueAttributionEmpName}}</span>
            </el-tooltip>
          </div>
          <div v-else>
            <span>{{scope.row.clueAttributionEmpName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="业务员" prop="clueSalesmanEmpName" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.clueSalesmanEmpName!='自主'">
            <el-tooltip effect="dark" :content="'工号：'+cEmpNo+' 部门：'+cDeptName" placement="top">
              <span @mouseover="showUserInfo(scope.row.clueSalesmanEmpId)">{{scope.row.clueSalesmanEmpName}}</span>
            </el-tooltip>
          </div>
          <div v-else>
            <span>{{scope.row.clueSalesmanEmpName}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination">
      <el-pagination
        background
        layout="sizes, prev, pager, next,total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 30, 50]"
        :current-page.sync="currentPage"
        :page-size= "10"
        :total="total">
      </el-pagination>
    </div>
    
    <div class="clue-btn">
      <el-button size="small" type="primary" :disabled="this.existingProducts.length==0" @click="addClue()" v-preventReClick>确定</el-button>
      <el-button size="small" type="warning" @click="cancle()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getPersonalClues, getUnitClues} from '@/api/personal/wtclueaccount'
import { getEmpInfo } from "@/api/project/wtClass"
import { mapState } from "vuex";
export default {
  data(){
    return {
      isPerson: false, // true不加密 false加密
      clueForm: {
        clueType: 1,
      },
      pageSize: 10,
      currentPage:1,
      total:0,
      tableData:[],
      tableLoading:false,
      existingProducts:[],
      selectPersonal: false,
      selectOrg:false,
      placeholderTxt:"请输入联系人姓名/单位名称关键字或完整线索编号/联系人电话",
      cEmpNo:'',
      cDeptName:''
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  mounted(){
    if(this.$route.query.clueId){
      this.isPerson = true
    }
    if(this.$route.query.source == 'list'){//合同列表录入合同
      this.getAllClues();
    }else{
      this.getList();
    };

  },
  methods:{
    addClue(){
      this.existingProducts[0].clueType = this.clueForm.clueType
      this.$emit('clue',this.existingProducts[0]);
      this.$emit('closeDialog',false);
    },
    cancle(){//取消
      this.$emit('closeDialog',false);
    },
    selectAble(row){
      if(row.able){
        return true;
      }else{
        return false;
      }
    },
    cellClass(row){
      if(row.columnIndex == 0){
        return 'productDisabledSelection'
      }
    },
    handleSelectionChange(val){
      this.existingProducts = val;
      if(val.length>0 && val[0].clueType == 0){
        this.selectOrg= true;
      }else if(val.length>0 && val[0].clueType == 1){
        this.selectPersonal = true;
      }else{
        this.selectPersonal = false;
        this.selectOrg = false;
      }
      this.tableData.forEach(element => {
        if(val.length>0 && this.existingProducts[0].clueNo !=element.clueNo){
          element.able = false;
        }else{
          element.able = true;
        }
      });
    },
    handleCurrentChange(val){
      this.currentPage = val;
      if(this.$route.query.source == 'list'){
        this.getAllClues();
      }else{
        this.getList();
      };
    },
    handleSizeChange(val){
      this.pageSize = val;
      if(this.$route.query.source == 'list'){
        this.getAllClues();
      }else{
        this.getList();
      };
    },
    // 来源为personal
    getList() {
      let param = {
        pageNo: this.currentPage,
        pageSize:this.pageSize,
        key:this.clueForm.keyWords,
        clueStatusIdList: ['0','4'],//只显示正常线索
      };
      param.clueSalesmanEmpId = this.userInfo.id
      if(this.clueForm.clueType == 1){
        this.placeholderTxt = "请输入联系人姓名/单位名称关键字或完整线索编号/联系人电话";
        getUnitClues(param,true).then(res=>{
          this.tableData = res.data.data.records;
          this.tableData.forEach(element => {
            this.$set(element,'able',true);
          });
          this.total = res.data.data.total;
          this.tableLoading = false;
        }).catch(()=>{
          this.tableLoading=false;
        });
      }else{
        this.placeholderTxt = "请输入线索姓名/单位名称关键字或完整线索编号/联系人电话";
        getPersonalClues(param,true).then(res=>{
          this.tableData = res.data.data.records;
          this.tableData.forEach(element => {
            this.$set(element,'able',true);
          });
          this.total = res.data.data.total;
          this.tableLoading = false;
        }).catch(()=>{
          this.tableLoading=false;
        });
      }
    },
    // 来源为list-获取线索列表
    getAllClues(){
      let param = {
        pageNo: this.currentPage,
        pageSize:this.pageSize,
        key:this.clueForm.keyWords,
        clueStatusIdList: ['0','4'],//只显示正常线索
      };
      if(this.clueForm.clueType == 1){
        this.placeholderTxt = "请输入联系人姓名/单位名称关键字或完整线索编号/联系人电话";
        getUnitClues(param,false).then(res=>{
          this.tableData = res.data.data.records;
          this.tableData.forEach(element => {
            this.$set(element,'able',true);
          });
          this.total = res.data.data.total;
          this.tableLoading = false;
        }).catch(()=>{
          this.tableLoading=false;
        });
      }else{
        this.placeholderTxt = "请输入线索姓名/单位名称关键字或完整线索编号/联系人电话";
        getPersonalClues(param,false).then(res=>{
          this.tableData = res.data.data.records;
          this.tableData.forEach(element => {
            this.$set(element,'able',true);
          });
          this.total = res.data.data.total;
          this.tableLoading = false;
        }).catch(()=>{
          this.tableLoading=false;
        });
      }
    },
    // 获取员工信息
    showUserInfo(id){
      getEmpInfo(id).then(res=>{
        if(res.data.code == 0){
          this.cEmpNo = res.data.data.number
          this.cDeptName = res.data.data.deptName
        }
      })
    },
  }
}
</script>

<style scoped>
.clue-frame{
  width:800px;
}
.table{
  width: 100%;
}
.pagination{
  text-align: right;
  margin-top: 10px;
}
.product-input{
  width: 400px;
  margin-right: 30px;
}
.clue-btn{
  margin-top: 20px;
  text-align: center;
}
/* 去除table表头的全选框 */
.el-table /deep/.productDisabledSelection .cell .el-checkbox__inner{ 
    display: none;
    position: relative;
}
.el-table /deep/.productDisabledSelection .cell:before{
    content: '';
    position: absolute;
}
</style>