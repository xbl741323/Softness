<template>
  <basic-container>
    <div class="add-plate">
      <el-button icon="el-icon-plus" type="primary" @click="addVideo()">新建板块</el-button>
      <span>栏目名称限制在2-8个字</span>
    </div>
    <!-- 列表区域 -->
    <avue-crud class="batch-choose" ref="crud" :page.sync="page" :data="dataList" :option="option" :table-loading="tableLoading"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
      <template slot="classIds" slot-scope="scope">
        <span class="relate-class" @click="showRelateClass(scope.row)">{{scope.row.classIds|listFillter}}</span>  
      </template>
      <template slot="createByName" slot-scope="scope">
         <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
            <span @mouseenter="showUserInfo(scope.row)">{{scope.row.createByName}}</span>
         </el-tooltip>
      </template>
      <template slot="status" slot-scope="scope">
        <span>{{scope.row.status|statusFilter}}</span>  
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </avue-crud>
    <!-- 板块新建/编辑 -->
    <el-dialog v-if="videoVisible" :before-close="closePlate" :title="operateType==0?'新建板块':'编辑板块'" :visible.sync="videoVisible" :close-on-click-modal="false" width="25%" center>
       <el-form :model="platForm" ref="platForm" :rules="videoRules">
         <el-form-item label-width="100px" label="栏目名称：" prop="platTitle">
           <el-input v-model.trim="platForm.platTitle" placeholder="2-8个字" maxlength="8" class="sort-width"></el-input>
         </el-form-item>
         <el-form-item label-width="100px" label="关联课程：" prop="realteClassIds">
           <div class="relate-class-contain">
             <span v-if="platForm.realteClassIds.length>0">{{platForm.realteClassIds.length}}</span>
             <el-button size="small" type="text" @click="showSelectClass()">添加</el-button>
           </div>
         </el-form-item>
          <el-form-item label-width="100px" label="序号：" prop="sort">
           <el-input type="number" v-model.trim="platForm.sort" placeholder="请填写" class="sort-width"></el-input>
         </el-form-item>
          <el-form-item label-width="100px" label="显示状态：" prop="showStatus">
           <el-radio-group v-model="platForm.showStatus">
             <el-radio :label="1">显示</el-radio>
             <el-radio :label="0">不显示</el-radio>
           </el-radio-group>
         </el-form-item>
       </el-form>
       <div class="video-btn">
         <el-button size="medium" type="primary" class="confirm-btn" @click="savePlate()">确定</el-button>
         <el-button size="medium" @click="closePlate()">取消</el-button>
       </div>
    </el-dialog>
    <!-- 选择课程 -->
    <select-class ref="class" @selectClass="selectClass" :pageform="0"></select-class>
    <!-- 显示关联课程 -->
    <relate-class ref="relateClass" @updateIds="updateIds" @closeRelate="closeRelate"></relate-class>
  </basic-container>
</template>

<script>
import { 
  getPlateList,
  addPlate,
  updatePlate,
  deletePlate,
  getEmpInfo
 } from "@/api/project/wtClass";
import * as CodeMsg from "@/api/common/CodeChange";
import { tableOption } from "@/const/crud/wt-classroom/plate-setting";
import selectClass from "@/components/project/wt-classroom/select-class";
import relateClass from "@/components/project/wt-classroom/relate-class";
export default {
  components:{
    selectClass,
    relateClass
  },
  data() {
    var checkTitle = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error("请填写"));
      } else if (value.length<2) {
        return callback(new Error("栏目名称限制在2-8个字"));
      } else {
        callback();
      }
    };
    return {
      cEmpNo:"",
      cDeptName:"",
      // 添加/编辑
      platForm: {
        id: "",
        platTitle: "",
        realteClassIds:[],
        sort: "",
        showStatus: 1,
      },
      videoRules: {
        platTitle: [{ validator: checkTitle, trigger: "blur" }],
        realteClassIds: [{ required: true, message: "请添加", trigger: "blur" }],
        sort: [{ required: true, message: "请填写", trigger: "blur" }],
        showStatus: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      // 列表
      operateType: 0, // 0-添加 1-编辑
      videoVisible: false,
      tableLoading: false,
      dataList: [],
      option: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
    };
  },
  filters:{
    statusFilter(val){
      return val == 1?"显示":val == 0?"不显示":"不详"
    },
    listFillter(val){
      return val.length
    }
  },
  methods: {
    showUserInfo(row){
      getEmpInfo(row.createBy).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.cEmpNo = res.data.data.number
          this.cDeptName = res.data.data.deptName
        }
      })
    },
    updateIds(){
      this.getAllList()
    },
    updateChidIds(){
      this.$nextTick(()=>{
        this.dataList.forEach(item=>{
        if(item.id == this.$refs['relateClass'].plateId){
           this.$refs['relateClass'].originalCourseIds = item.classIds
        }
      })
      })
    },
    closeRelate(){
      this.getAllList()
    },
    showRelateClass(row){
      this.$refs['relateClass'].relateVisble = true
      this.$refs['relateClass'].plateId = row.id
      this.$refs['relateClass'].originalCourseIds = row.classIds 
      this.$refs['relateClass'].courseTitle = row.plateName
      this.$refs['relateClass'].page.currentPage = 1
      this.$refs['relateClass'].batchList = []
    },
    selectClass(val){
      if(val.length>50){
        this.$message({
          type:"warning",
          message:"最多添加50个课程！",
          offset:300
        })
      }else{
      var cList = this.platForm.realteClassIds.slice(0)
      val.forEach(pItem=>{
        var flag = true
        cList.forEach(item=>{
          if((item == pItem.id)){
             flag = false
          }
        })
        if(flag){
          this.platForm.realteClassIds.push(pItem.id)
        }
      })
      this.$refs['class'].plateVisble = false
      this.$refs['class'].closePlate()
      }
    },
    showSelectClass(){
     this.$refs['class'].plateVisble = true
     this.$refs['class'].page.currentPage = 1
     this.$refs['class'].originalCourseIds = this.platForm.realteClassIds
    },
    // 保存视频
    savePlate() {
      this.$refs["platForm"].validate((val) => {
        if (val) {
          this.operateType == 0? this.addPlateData() : this.updatePlateData()
        }
      });
    },
    // 添加板块
    addPlateData(){
      let params = {
        plateName:this.platForm.platTitle,
        priority:this.platForm.sort,
        classIds:this.platForm.realteClassIds,
        status:this.platForm.showStatus,
      }
      addPlate(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:"success",
            message:"添加成功！",
            offset: 300
          })
          this.videoVisible = false
          this.getAllList()
        }else{
          this.$message({
            type:"warning",
            message:res.data.msg,
            offset: 300
          })
        }
      })
    },
     // 编辑板块
    updatePlateData(){
      let params = {
        id: this.platForm.id,
        plateName:this.platForm.platTitle,
        priority:this.platForm.sort,
        classIds:this.platForm.realteClassIds,
        status:this.platForm.showStatus,
      }
      updatePlate(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:"success",
            message:"修改成功！",
            offset: 300
          })
          this.videoVisible = false
          this.getAllList()
        }else{
          this.$message({
            type:"warning",
            message:res.data.msg,
            offset: 300
          })
        }
      })
    },
    closePlate() {
      this.videoVisible = false;
    },
    resetFormData(){
      this.platForm.id = ""
      this.platForm.platTitle = "";
      this.platForm.realteClassIds = []
      this.platForm.sort = "";
      this.platForm.showStatus = 1;
    },
    // 新建板块
    addVideo() {
      this.operateType = 0;
      this.videoVisible = true;
      this.resetFormData()
    },
    // 编辑板块
    handleEdit(row) {
      this.operateType = 1;
      this.platForm.id = row.id
      this.platForm.platTitle = row.plateName
      this.platForm.sort = row.priority
      this.platForm.realteClassIds = row.classIds
      this.platForm.showStatus = Number(row.status)
      this.videoVisible = true;
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    // 获取板块列表数据
    getList() {
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      }
      getPlateList(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          let r = res.data.data
          this.dataList = r.records
          this.page.total = r.total
          if(this.$refs['relateClass']){
            this.updateChidIds()
          }
        }
      })
    },
    handleDelete(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(() => {
        let params = {
          id: row.id
        } 
        deletePlate(params).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
           this.$message({
            type:"success",
            message:"删除成功！",
            offset: 300
           })
           this.getAllList()
          }
        })
      });
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
    currentChange(val) {
      this.page.currentPage = val;
      // this.getList();
    },
  },
};
</script>
<style scoped>
.video-file-sty {
  margin-top: -40px;
}
.sort-width {
  width: 200px;
}
.video-btn {
  margin-top: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.confirm-btn {
  margin-right: 90px;
}
.video-info {
  display: flex;
  justify-content: flex-start;
  width: 300px;
  height: 100px;
}
.video-info video {
  position: relative;
  width: 200px;
  height: 100px;
  margin-left: 0;
}
.video-info i {
  position: absolute;
  top: 50%;
  left: 84px;
  transform: translateY(-50%);
  padding-top: 2px;
  font-size: 36px;
  color: #ffffff;
  cursor: pointer;
}
.video-preview {
  width: 100%;
}
.video-preview video {
  width: 100%;
}

.add-plate {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.add-plate span {
  font-size: 14px;
  margin-left: 15px;
}

.relate-class-contain{
  display: flex;
  align-items: center;
}

.relate-class-contain span{
  margin-right: 10px;
}
.relate-class{
  color: rgb(64, 158, 255) !important;
  cursor: pointer;
}
</style>