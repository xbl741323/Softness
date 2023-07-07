<template>
  <div class="capture_frame">
    <el-form :model="captureForm" ref="captureForm" class="capture_form" inline @keyup.enter.native="getCaptureList()">
      <el-form-item label="地区：" prop="region">
        <el-cascader
          :options="areaOptions"
          v-model="captureForm.region"
          :props="{value: 'id',label: 'areaName'}"
          placeholder="请选择地区"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="归口：" prop="attribute">
        <el-select v-model="captureForm.attribute" placeholder="请选择归口">
          <el-option 
            v-for="item in attributionList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间：" prop="createTime">
        <el-date-picker
          v-model="captureForm.createTime"
          :unlink-panels="true"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="关键字：" prop="keyWords">
        <el-input class="key" v-model.trim="captureForm.keyWords" placeholder="请输入标题关键字"/>
        <el-button type="primary" @click="getCaptureList()">搜索</el-button>
        <el-button type="warning" @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="batch">
      <span class="del_btn" v-if="selectedList.length != 0">已选择<b class="number">{{selectedList.length}}</b>项</span>
      <el-button :disabled="selectedList.length == 0" size="mini" type="warning" @click="del(selectedIds)">批量删除</el-button>
    </div>
    <avue-crud
      class="batch-choose capture_table"
      :option="tableOption"
      :data="captureData"
      :page.sync="page"
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="selectionChange"
    >
      <template slot="title" slot-scope="scope">
        <p class="view" @click="preview(scope.row.id)" >{{scope.row.title}}</p>
      </template>
      <template slot="url" slot-scope="scope">
        <a class="view" :href="scope.row.url">{{scope.row.url}}</a>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" @click="view(scope.row.url)">浏览</el-button>
        <el-button type="text" @click="edit(scope.row.id)">编辑发布</el-button>
        <el-button type="text" class="used" v-if="scope.row.isUser == 0">已用</el-button>
        <el-button type="text" @click="del([scope.row.id])">删除</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { captureTableOption } from '@/const/crud/capture-data/index.js'
import { getCaptureData, deleteData } from '@/api/capture-data/index'
import * as CodeMsg from "@/api/common/CodeChange"
import { getDropPolicy } from "@/api/policy/list";
import { getAreaTree } from '@/api/clue/clue'
import { Message } from 'element-ui'
export default {
  data(){
    return {
      tableOption:captureTableOption,
      page: {
        pageSize: 20,
        currentPage: 1,
        pages: [3, 5, 10, 20, 50]
      },
      captureForm:{},
      selectedList:[],
      selectedIds:[],
      captureData:[],
      areaOptions:[],
      attributionList:[]
    }
  },
  created(){
    if(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value) && JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).detail && JSON.stringify(JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).detail.query).length>2){
      this.$router.push({
        path: '/capture-edit',
        query:JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).detail.query
      })
    }else{
      if(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value) && (JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).ID != JSON.parse(sessionStorage.getItem('pigx-tag')).content.label)){
        this.captureForm = JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).screening;
        this.page = JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).page;
      }else{
        if(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)){
          this.captureForm = JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).screening;
          this.page = JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).page;	
        };
      };
      this.getCaptureList();
    };
  },
  // mounted(){
  //   this.getCaptureList()
  // },
  methods:{
    view(url){
      window.open(url);
    },
    edit(id){
      this.$router.push({
        path:'/capture-edit',
        query:{
          number: id
        }
      })
    },
    getCaptureList(){
      let param = {
        size: this.page.pageSize,
        start: this.page.currentPage,
        title: this.captureForm.keyWords,
        gk: this.captureForm.attribute,
        areaNos: this.captureForm.region
      }
      if(this.captureForm.createTime){
        param.createTimeStart = this.captureForm.createTime[0];
        param.createTimeEnd = this.captureForm.createTime[1];
      };
      sessionStorage.setItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value,JSON.stringify({
          page: this.page,
          screening: this.captureForm,//表单筛选信息
          ID: JSON.parse(sessionStorage.getItem('pigx-tag')).content.label,//页面标识
          detail:{query:{}}
        })
      );//保存页面信息
      getCaptureData(param).then(res=>{
        this.captureData = res.data.data.list;
        this.page.total = res.data.data.total;
      }).catch(err=>{
        return false;
      });
      getDropPolicy(0).then((res) => {
        this.attributionList = res.data.data.factors[0].optionList;
      }).catch((err) => {
        console.log(err);
      });
      getAreaTree().then(res=>{
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
        this.areaOptions=areaTree 
      }).catch(err=>{
        return err;
      });
    },
    del(ids){
      let param = {
        ids: ids,
        userId: JSON.parse(sessionStorage.getItem('pigx-userInfo')).content.id
      };
      this.$confirm('已选择'+ids.length+'条数据，确定删除吗？','删除',{
        type: 'warning',
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel"
      }).then(()=>{
        deleteData(param).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.$message({
              type: 'success',
              message: '信息删除成功！'
            });
          };
          this.getCaptureList();
        })
      }).catch(()=>{

      });
    },
    preview(id){
      this.$router.push({
        path:'/capture-detail',
        query:{
          id: id
        }
      })
    },
    reset(){
      this.captureForm ={};
      this.getCaptureList();
    },
    sizeChange(val){
      this.page.pageSize = val;
      this.getCaptureList();
    },
    currentChange(val){
      this.page.currentPage = val;
      this.getCaptureList();
    },
    selectionChange(row){
      this.selectedIds = [];
      this.selectedList = row;
      if(row.length > 0){
        this.selectedList.forEach(item => {
          this.selectedIds.push(item.id);
        });
      }else{
        this.selectedIds = [];
      };
    }
  }
}
</script>

<style scoped>
.capture_frame{
  height: 100%;
  padding: 10px;
  background: #FFFFFF;
}
.capture_form{
  margin-bottom:10px;
}
.number{
  color: #4477e4;
}
.del_btn{
  margin-right:10px;
}
.key{
  width: 300px;
  margin-right: 20px;
}
.batch{
  margin-bottom: 10px;
}
.view{
  color: #4477e4;
  cursor: pointer;
}
.used{
  color: red;
}
</style>