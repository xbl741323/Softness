<template>
<!-- 排查完成 -->
  <basic-container>
  <div class="achievement-frame">
    <el-radio-group v-model="type" @change="getList()" class="status-list">
      <el-radio-button
        v-for="item in achievementTypeList"
        :key="item.value"
        :label="item.value"
        :class="item.value >0 ? 'radio-button' : ''"
      >{{item.label}}(
        <span v-if="item.value == 1">{{achievementTypeNum.onsale}}</span>
        <span v-if="item.value == 2">{{achievementTypeNum.offisale}}</span>
        <span v-if="item.value == 3">{{achievementTypeNum.dealing}}</span>
        <span v-if="item.value == 4">{{achievementTypeNum.done}}</span>
        <span v-if="item.value == 5">{{achievementTypeNum.delete}}</span>
        <span v-if="item.value === null">{{achievementTypeNum.total}}</span>
      )</el-radio-button>
    </el-radio-group>
    <el-form :model="achievementForm" inline @submit.native.prevent >
      <el-form-item label="关键字：" prop="keyWords">
        <el-input placeholder="请输入产品名称关键字" v-model="achievementForm.keyWords" @keyup-enter-native="getList" ></el-input>
      </el-form-item>
      <el-form-item label="技术类型：" prop="technologyType" @change="getList()">
        <el-select v-model="achievementForm.technologyType" >
          <el-option
            v-for="item in technologyType"
            :key="item.dropdownKey"
            :label="item.dropdownValue"
            :value="item.dropdownKey"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行业类型：" prop="industry">
        <el-select v-model="achievementForm.industry" multiple :multiple-limit='3' @change="getList()">
          <el-option
            v-for="item in industry"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在地：" prop="address">
        <el-cascader :options="areaTree" v-model="achievementForm.address" :props="{value: 'id',label: 'areaName'}" />
      </el-form-item>
      <el-button type="primary" native-type="submit" @click="page.currentPage = 1,getList()" >搜索</el-button>
      <el-button type="warning" native-type="submit" @click="reset()">重置</el-button>
      <el-button icon="el-icon-plus" type="primary" @click="addOrEditAchievement(0)">添加技术成果</el-button>
    </el-form>
    <div class="batch-operate">
      批量操作：
      <el-button type="primary" size="mini" :disabled="ids.length == 0" @click="batchDelAchievement()">批量删除</el-button>
    </div>
    <avue-crud
      ref="crud"
      class="batch-choose"
      :option="tableOption"
      :data="achievementListData"
      @on-load="getList"
      :page.sync="page"
      @selection-change="selectionChange"
      @size-change="sizeChange"
      @current-change="currentChange">
    <template slot="collectionNumber" slot-scope="scope">
      <span>{{scope.row.scanNumber|viewFilter}}</span>
      <span>/</span>
      <span>{{scope.row.collectionNumber|viewFilter}}</span>
    </template>
    <template slot="achievementNo" slot-scope="scope">
      <span class="achievement-no" @click="toDetail(scope.row)">{{scope.row.achievementNo}}</span>
    </template>
    <template slot="achievementName" slot-scope="scope">
      <span class="achievement-no" @click="toDetail(scope.row)">{{scope.row.achievementName}}</span>
    </template>
    <template slot="sourceUser" slot-scope="scope">
      <span>{{scope.row.sourceUser | sourceType}}</span>
    </template>
    <template slot="statusTxt" slot-scope="scope">
      <span :class="scope.row.status == 3 || scope.row.status == 4 ? 'trading': ''">{{scope.row.statusTxt}}</span>
    </template>
    <template slot="sourceEmployeesName" slot-scope="scope">
      <el-tooltip effect="dark" :content="'工号：'+scope.row.userVO.number+' 部门：'+scope.row.userVO.deptName" placement="top">
        <span>{{scope.row.userVO.name}}</span>
      </el-tooltip>
    </template>
    <template slot="priceType" slot-scope="scope">
      <span>{{scope.row.priceType | priceType(scope.row.tradePrice)}}</span>
    </template>
    <template slot="menu" slot-scope="scope">
      <el-button type="text" @click="toDetail(scope.row)">查看</el-button>
      <el-button type="text" v-if="scope.row.status == 1 || scope.row.status == 2" @click="toDetail(scope.row,1)">编辑</el-button>
      <el-button type="text" v-if="scope.row.status == 2" @click="onSale(scope.row)">上架</el-button>
      <el-button type="text" v-if="scope.row.status == 1" @click="offSale(scope.row)">下架</el-button>
      <el-button type="text" v-if="scope.row.status == 1 || scope.row.status == 2" @click="delAchievement(scope.row)" class="off-sale">删除</el-button>
    </template>
    </avue-crud>
  </div>
  </basic-container>
</template>

<script>
import {receivePrice} from '@/util/price.js';
import achievementData from './achievementJs/index.js'
import {achievementTableOption} from '@/const/crud/achievement/index'
import { getAchievementList, getTotalStatistic,onlydelAchievement } from '@/api/achievement/index'
import { getIndustryList} from '@/api/achievement/create'
import { getArea } from '@/api/clue/clue'
import { saveDetal } from "@/util/clearDetail";
import { mapGetters } from 'vuex';

var key = 'avue-column';
export default {
  data(){
    return {
      achievementTypeList: achievementData.achievementType,
      type: null,
      achievementForm: {},
      page:{
        total: 0,
        pageSize: 20,
        currentPage: 1
      },
      achievementListData: [],
      tableOption: achievementTableOption,
      achievementTypeNum: {},
      maturity:[],
      technologyType: [],
      industry: [],
      tradeType: [],
      areaTree: [],
      ids: [],
      nos:[],
      idList: [],
    }
  },
  filters:{
    viewFilter(val){
      if(val/10000>=1){
        return (val/10000).toFixed(2)+'万'
      }else{
        return val
      }
  },
    sourceType(value){
      return achievementData.sourceType(value);
    },
    priceType(type,value){
      if(type == 0){
        return receivePrice(value,2);
      }else{
        return '面议';
      }
        }
  },
  watch: {
    'tableOption.column': {//深度监听tableOption下的column数组
      handler(newName, oldName) {
        localStorage.setItem(key, JSON.stringify(this.tableOption.column));
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created(){
   if(sessionStorage.getItem(`${this.$route.path}`)){
        let keepParams =JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
        if(keepParams.detail.path!==''){
            this.$router.push({
            path: keepParams.detail.path,
            query: keepParams.detail.query
            })
           return
        }
      this.achievementForm = keepParams.params
      this.page = keepParams.page
      if(this.achievementForm.status == undefined){
        this.type = null;
       }else{
           this.type = this.achievementForm.status
       }
    }

  },
  mounted(){
    let typeList = ['technologyType'];//下拉框参数
    let that = this;
    typeList.forEach((item, index) => {
      achievementData.getDropList({type:item}).then(res=>{
        this.technologyType = res.data;
      });

    });
  },
  methods:{
    reset(){
      this.achievementForm = {},
      this.page.currentPage = 1;
      this.type = null;
      this.getList();
    },
    addOrEditAchievement(status){//status 0-新增 1-编辑
    saveDetal(`${this.$route.path}`,"/achievement-create",{editStatus: status})
    this.$router.push({
        path: "/achievement-create",
         query: {
          editStatus: status
        },
      })
    },
    onSale(row){
      let param = new FormData();
      param.append('id', row.id);
      param.append('no', row.achievementNo);
      achievementData.onSaleProduct(param).then(res=>{
        this.getList();
      })
    },
    offSale(row){
      let param = {
        id: row.id,
        no:row.achievementNo
      }
      achievementData.offSaleProduct(param).then(res=>{
        this.getList();
      })
    },
    delAchievement(row){
        this.idList = [row.id];
        var param = {
          ids: this.idList.join(','),
          nos: row.achievementNo
        }
         onlydelAchievement(param).then(res=>{
           this.ids = []
           this.getList();
      })
    },
    batchDelAchievement(){
        var param = {
          ids: this.ids.join(','),
          nos: this.nos.join(',')
        }
      achievementData.batchDelProduct(param,this.ids.length).then(res=>{
          this.ids = []
        this.getList();
      })
    },
    toDetail(row,status){
      saveDetal(`${this.$route.path}`,"/achievement-detail",{  achievementId: row.id,status:status})
      this.$router.push({
        path: "/achievement-detail",
         query: {
          achievementId: row.id,
          status:status
        },
      })
    },
    getList(){
      let param ={
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        achievementName: this.achievementForm.keyWords,
        technologyType: this.achievementForm.technologyType,
        status: this.type
      }
      if(this.achievementForm.keyWords){
          param.achievementName = this.achievementForm.keyWords.trim();
      };
      if(this.achievementForm.industry){
        param.industry = this.achievementForm.industry.join(',');
      }else{
        param.industry = '';
      }
      if(this.achievementForm.address){
        param.area = this.achievementForm.address.join(',');
      }
      //保存页面信息
      this.achievementForm.status = this.type
      let keepParams = {
         params:this.achievementForm,
         page:this.page,
         detail:{
          path:'',
          query:{}
         }
       }
      sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
      getAchievementList(param).then(res=>{
        this.achievementListData = res.data.data.records;
        this.page.total = res.data.data.total;
      });
      getTotalStatistic().then(res=>{//列表数据统计
        this.achievementTypeNum = res.data.data;
      });
      getIndustryList('industrytype').then(res=>{
        this.industry=res.data.data[0].options
      });
      getArea().then(res=>{//地区
        let areaTree = res.data.data;
        for(var i = 0; i <areaTree.length; i++){
            let newList=[];
            for(var j = 0; j <areaTree[i].children.length; j++){
            newList.push({
                areaName:areaTree[i].children[j].areaName,
                id:areaTree[i].children[j].id,
                nodeNumber:areaTree[i].children[j].nodeNumber,
                parentId:areaTree[i].children[j].parentId
            })
            }
        areaTree[i].children=newList;
        }
        this.areaTree=areaTree
      }).catch(err=>{
        return false;
      });
    },
    selectionChange(row){
      this.ids = [];
      this.nos = [];
      if(row.length > 0){
        row.forEach(element => {
          this.ids.push(element.id);
          this.nos.push(element.achievementNo)
        });
      }else{
        this.ids = [];
        this.nos = []
      }
    },
    sizeChange(val){

    },
    currentChange(val){
      this.page.currentPage = val;
      this.getList();
    }
  }
}
</script>

<style scoped>
.achievement-frame{
  height: 100%;
  background: #FFF;
}
.radio-button{
  margin-left: 10px;
  border-left: 1px solid #DCDFE6;
}
.batch-operate{
  margin: 0px 0 15px 0;
  font-size: 14px;
}
.achievement-no{
  color: #409EFF;
  cursor: pointer;
}
.off-sale{
  color: red;
}
.trading{
  color: #999999;
}
.status-list{
  margin:20px 0;
}
</style>
