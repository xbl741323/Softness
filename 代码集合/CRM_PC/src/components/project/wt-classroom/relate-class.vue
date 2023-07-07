<template>
  <el-dialog :title="courseTitle+'-关联课程'" v-if="relateVisble" :visible.sync="relateVisble" :before-close="closePlate" :close-on-click-modal="false">
    <!-- 筛选区域 -->
    <div class="common-service">
      <div class="operate-btn">
        <!-- <el-button type="danger" :disabled="batchList.length != 0?false:true" @click="deleteBatch()">批量取消关联</el-button> -->
        <el-button type="primary" @click="addRelateClass()">添加关联</el-button>
      </div>
    <!-- 列表区域 -->
    <avue-crud
      class="batch-choose"
      ref="crud"
      :page.sync="page"
      :data="dataList"
      :option="option"
      :table-loading="tableLoading"
      @selection-change="selectionChange"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
      <template slot="themeType" slot-scope="scope">
        <div v-for="(item,index) in scope.row.listSubject" :key="index">
          {{item.subjectName}}
        </div>
      </template>
     </avue-crud>
      <div class="batch-operate">
        <span class="handle-txt-select" v-if="this.batchList.length != 0">已选择<b>{{batchList.length}}</b>条课程数据</span>
      </div>
     <div class="plate-btn">
      <el-button size="medium" type="primary" class="confirm-btn" @click="submitSelect()">确定</el-button>
      <el-button size="medium" @click="closePlate">取消</el-button>
     </div>
     <!-- 显示添加关联课程弹窗 -->
     <select-class ref="class" @selectClass="selectClass" :pageform="1"></select-class>
    </div>
  </el-dialog>
</template>

<script>
import { getPlateRelate, addRelateClass, batchDelRelateClass } from "@/api/project/wtClass";
import * as CodeMsg from "@/api/common/CodeChange";
import { tableOption } from "@/const/crud/wt-classroom/relate-class";
import selectClass from "@/components/project/wt-classroom/select-class";
export default {
  components: { selectClass },
  data() {
    return {
      courseTitle:"",
      courseIds:[],
      originalCourseIds:[],
      plateId:"",
      relateVisble: false,
      optionList: [],
      batchList: [],
      senior: false,
      tableLoading: false,
      dataList: [],
      option: tableOption,
      filters: {
        keyWords: "",
        showStatus: "1",
        publishTime: null,
        themeType: "",
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
    };
  },
  methods: {
    addRelateClass(){
      this.$refs['class'].plateVisble = true
      this.$refs['class'].originalCourseIds = this.originalCourseIds
    },
     selectClass(val){
      if(val.length>50){
        this.$message({
          type:"warning",
          message:"最多添加50个课程！",
          offset:300
        })
      }else{
        console.log(this.originalCourseIds,"this.originalCourseIds")
        console.log(this.courseIds,"this.courseIds")
      var cList = this.originalCourseIds.slice(0)
      this.courseIds = []
      val.forEach(pItem=>{
        var flag = true
        cList.forEach(item=>{
          if((item == pItem.id)){
             flag = false
          }
        })
        if(flag){
          this.courseIds.push(pItem.id)
        }
      })
      this.saveRelateData()
      }
    },
    // 添加关联课程
    saveRelateData(){
      let params = {
        plateId: this.plateId,
        courseIds: this.courseIds
      }
      addRelateClass(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:"success",
            message:"添加成功！",
            offset: 300
          })
          this.$refs['class'].plateVisble = false
          this.$refs['class'].closePlate()
          this.getAllList()
          this.$emit('updateIds')
        }
      })
    },
    // 批量取消关联
    deleteBatch() {
      this.$confirm(`已选择${this.batchList.length}篇课程，确定取消关联吗？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(() => {
        this.delRelate(this.batchList)
      })
    },
    // 单个取消关联
     deleteRelate(row) {
      this.$confirm("是否确认取消关联？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(() => {
        this.delRelate([row.id])
      });
    },
    delRelate(idList){
      let params = {
        plateId:this.plateId,
        courseIds:idList
      }
      batchDelRelateClass(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:"success",
            message:"取消成功！",
            offset: 300
          })
          this.batchList = []
          this.getAllList()
          this.$emit('updateIds')
        }
      })
    },
    submitSelect(){
      this.relateVisble = false
    },
    closePlate(){
      this.relateVisble = false
      this.batchList = []
      this.filters.keyWords = ""
      this.filters.themeType = ""
      this.$emit('closeRelate')
    },
    selectionChange(val) {
      this.batchList = [];
      val.forEach((item) => {
        this.batchList.push(item.id);
      });
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    // 获取关联课程
    getList() {
      let params = {
        plateId: this.plateId,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      }
      getPlateRelate(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          let r = res.data.data
          this.dataList = r.records
          this.page.total = r.total
        }
      })
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
  },
};
</script>
<style scoped>
#handle-style {
  color: rgb(64, 158, 255) !important;
  cursor: pointer;
}
.senior-box {
  margin-bottom: 10px;
}
.batch-operate {
  margin-top: 10px;
}
.handle-txt-select {
  margin-right: 10px;
  font-size: 14px;
}
.wt-index-batch {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}
.wt-index-batch-confirm {
  margin-right: 40px;
}
.plate-btn{
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
.confirm-btn{
  margin-right: 100px;
}
.operate-btn{
  margin-bottom: 15px;
}
</style>