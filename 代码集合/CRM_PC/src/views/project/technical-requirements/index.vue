<template>
<!-- 排查完成 -->
  <basic-container>
  <div class="requirement-frame">
      <el-radio-group v-model="type" @change="getList()" class="status-list">
      <el-radio-button 
        v-for="item in requirementTypeList"
        :key="item.value"
        :label="item.value"
        :class="item.value >0 ? 'radio-button' : ''"
      >{{item.label}}(
        <span v-if="item.value == 1">{{requirementTypeNum.onsale}}</span>
        <span v-if="item.value == 2">{{requirementTypeNum.offisale}}</span>
        <span v-if="item.value == 3">{{requirementTypeNum.dealing}}</span>
        <span v-if="item.value == 4">{{requirementTypeNum.done}}</span>
        <span v-if="item.value == 5">{{requirementTypeNum.delete}}</span>
        <span v-if="item.value === null">{{requirementTypeNum.total}}</span>
      )</el-radio-button>
    </el-radio-group>
    <el-form :model="requirementForm" inline @submit.native.prevent >
      <el-form-item label="关键字：" prop="keyWords">
        <el-input placeholder="请输入产品名称关键字" v-model="requirementForm.keyWords" @keyup-enter-native="getList" ></el-input>
      </el-form-item>
      <el-form-item label="需求类型：" prop="requirementType" @change="getList()">
        <el-select v-model="requirementForm.requirementType" >
          <el-option
            v-for="item in requirementType"
            :key="item.dropdownKey"
            :label="item.dropdownValue"
            :value="item.dropdownKey"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行业类型：" prop="industry">
        <el-select v-model="requirementForm.industry" multiple :multiple-limit='3' style="width:180px" @change="getList()">
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
        <el-cascader :options="areaTree" v-model="requirementForm.address" style="width:190px"  :props="{value: 'id',label: 'areaName'}" />
      </el-form-item>
      <el-button type="primary" native-type="submit" @click="page.currentPage = 1,getList()" >搜索</el-button>
      <el-button type="warning" native-type="submit" @click="reset()">重置</el-button>
      <el-button icon="el-icon-plus" type="primary" @click="addOrEditAchievement(0)">添加技术需求</el-button> 
    </el-form>    
     <div class="batch-operate">
      批量操作：
      <el-button type="primary" size="mini" :disabled="ids.length == 0" @click="batchDelRequirement()">批量删除</el-button>
    </div>
    <!-- 列表 -->
    <avue-crud
      ref="crud"
      class="batch-choose"
      :option="tableOption"
      :data="requirementListData"
      @on-load="getList"
      :page.sync="page"
      @selection-change="selectionChange"
      @current-change="currentChange">
    <template slot="collectionNumber" slot-scope="scope">
      <span>{{ scope.row.scanNumber|viewFilter }}</span>
      <span>/</span>
      <span>{{ scope.row.collectionNumber|viewFilter }}</span>
    </template>
    <template slot="requirementNo" slot-scope="scope">
      <span class="achievement-no" @click="toDetail(scope.row)">{{scope.row.requirementNo}}</span>
    </template>
     <template slot="requirementName" slot-scope="scope">
      <span class="achievement-no" @click="toDetail(scope.row)">{{scope.row.requirementName}}</span>
    </template>
    <template slot="sourceUser" slot-scope="scope">
      <span>{{scope.row.sourceUser | sourceType}}</span>
    </template>
    <template slot="userName" slot-scope="scope">
      <el-tooltip effect="dark" :content="'工号：'+scope.row.userVO.number+' 部门：'+scope.row.userVO.deptName" placement="top">
        <span>{{scope.row.userName}}</span>
      </el-tooltip>
    </template>
    <template slot="tradePriceMin" slot-scope="scope">
      <span>{{scope.row.tradePriceMin | tradePrice(scope.row.tradePriceMax,scope.row.priceType)}}</span>
    </template>
    <template slot="menu" slot-scope="scope">
      <el-button type="text" @click="toDetail(scope.row)">查看</el-button>
      <el-button type="text" v-if="scope.row.status == 1 || scope.row.status == 2" @click="toDetail(scope.row,1)">编辑</el-button>
      <el-button type="text" v-if="scope.row.status == 2" @click="onSale(scope.row)">上架</el-button>
      <el-button type="text" v-if="scope.row.status == 1" @click="offSale(scope.row)">下架</el-button>
      <el-button type="text" v-if="scope.row.status == 1 || scope.row.status == 2" @click="delRequirement(scope.row)" class="off-sale">删除</el-button> 
    </template> 
    </avue-crud> 
  </div>
  </basic-container>
</template>

<script>
import {receivePrice} from '@/util/price.js';
import {getIndustryList,getType} from '@/api/achievement/create';
import achievementData from './requirements.js'
import {getAreaData,onSaleProduct,offSaleProduct,batchDelProduct} from './requirements.js';
import {getTotalStatistic,getRequirementList,onlydelRequirement} from '@/api/requirement/index';
import {requirementTableOption} from '@/const/crud/requirement/index'
import { saveDetal } from "@/util/clearDetail";
import { mapGetters } from 'vuex';
var key = 'avue-column';
export default {
  data(){
    return {
        requirementTypeList: achievementData.achievementType,
        type: null,
        requirementListData:[],
        requirementForm: {
            keyWords:'',
            requirementType:'',
            industry:'',
            address:''
        },
        page:{
            total: 0,
            pageSize: 20,
            currentPage: 1
        },
        achievementListData: [],
        tableOption: requirementTableOption,
        requirementTypeNum: {},
        requirementType: [],
        industry: [],
        areaTree: [],
        ids: [],
        nos:[]
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
      return value == 0 ? '用户发布' : '后台';
    },
    tradePrice(min,max,type){
        if(type==1){
            return "面议"
        }else{
            if(min!=null && max!=null){
                return receivePrice(min,2)+"~"+receivePrice(max,2);
            }
            if(min!=null){
                return receivePrice(min,2) 
            }
            if(max!=null){
                return receivePrice(max,2) 
            }
        }      
    }
  },
  watch: {
    // 'tableOption.column': {//深度监听tableOption下的column数组
    //   handler(newName, oldName) {
    //     localStorage.setItem(key, JSON.stringify(this.tableOption.column));
    //   },
    //   deep: true,
    //   immediate: true
    // }
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
      this.requirementForm = keepParams.params
      this.page = keepParams.page
      if(this.requirementForm.status == undefined){
        this.type = null;
       }else{
           this.type = this.requirementForm.status
       }
    }

  },
  mounted(){
    this.getDropdownData();
    this.getList()
  },
methods:{
    //下拉框选项数据
    getDropdownData(){
        //需求类型
        let requirementType = new FormData();   
            requirementType.append("type","requirementType");
            getType(requirementType).then(res=>{
                console.log(res,"sss")
                this.requirementType=res.data.data
            }).catch(err=>{
                return err;
            });
        //行业
        getIndustryList('industrytype').then(res=>{                
            this.industry=res.data.data[0].options
        }).catch(err=>{
            return err;
        });
        //地区
        getAreaData().then(res=>{
            this.areaTree=res
        })
    },
    reset(){
      this.requirementForm = {},
      this.page.currentPage = 1;
      this.type = null;
      this.getList();
    },
    addOrEditAchievement(status){//status 0-新增 1-编辑
        saveDetal(`${this.$route.path}`,"/requirement-create",{editStatus: status})
        this.$router.push({
            path: "/requirement-create",
            query: {
            editStatus: status
            },
        })
    },
    onSale(row){
      let param = new FormData();
      param.append('id', row.id);
      param.append('no', row.requirementNo);
      onSaleProduct(param).then(res=>{
        this.getList();
      })
    },
    offSale(row){
      let param = {
        id: row.id,
        no:row.requirementNo
      }
      offSaleProduct(param).then(res=>{
        this.getList();
      })
    },
    delRequirement(row){
        var param = {
          ids: row.id,
          nos:row.requirementNo
        }
        onlydelRequirement(param).then(res=>{   
            this.getList();
        })
    },
    batchDelRequirement(){
        var param = {
          ids: this.ids.join(','),
          nos:this.nos.join(',')
        }
        batchDelProduct(param,this.ids.length).then(res=>{
            this.getList();
        })
    },
    toDetail(row,status){
      saveDetal(`${this.$route.path}`,"/requirement-detail",{ requirementId: row.id,status:status})  
      this.$router.push({
         path:"/requirement-detail",
         query: {
            requirementId: row.id,
            status:status
        },
      })
    },
    getList(){
        getTotalStatistic().then(res=>{//列表数据统计
            this.requirementTypeNum = res.data.data;
        });
        let param ={
            pageNo: this.page.currentPage,
            pageSize: this.page.pageSize,
            requirementType: this.requirementForm.requirementType,
            status: this.type
        }
        if(this.requirementForm.keyWords){
            param.requirementName = this.requirementForm.keyWords.trim();
        };
        param.industry = this.requirementForm.industry?this.requirementForm.industry.join(','):'';
        param.area = this.requirementForm.address?this.requirementForm.address.join(','):'';     
        
        //保存页面信息
        this.requirementForm.status = this.type
        let keepParams = {   
            params:this.requirementForm,
            page:this.page,  
            detail:{
            path:'',
            query:{}
            }
        } 
        sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
        getRequirementList(param).then(res=>{
            this.requirementListData = res.data.data.records;
            console.log(this.requirementListData,"datas")
            this.page.total = res.data.data.total;
        });
    },
    selectionChange(row){
        this.ids = [];
        this.nos = [];
        if(row.length > 0){
            row.forEach(element => {
                this.ids.push(element.id);
                this.nos.push(element.requirementNo)
            });
        }
    },
    currentChange(val){
      this.page.currentPage = val;
      this.getList();
    }
  }
}
</script>

<style scoped>
.requirement-frame{
  background: #FFF;
}
.radio-button{
  margin-left: 10px;
  border-left: 1px solid #DCDFE6;
}
.status-list{
  margin:20px 0;
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

</style>