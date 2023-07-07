<template>
  <div class="frame"
   v-loading="loading"
    :element-loading-text="promtMessage"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-form :inline="true" :model="fileForm" @submit.native.prevent v-if="this.page.total>=20">
      <el-form-item :label="$t('label.keywords')">
        <el-input
          style="width:260px"
          v-model="fileForm.keyWords"
          placeholder="请输入文件名称或文件编号"
          @keyup.enter.native="getList()"
        />
      </el-form-item>
      <el-form-item
        :label="$t('label.uploader')+'：'"
        @keyup.enter.native="getList()"
      >
          <el-cascader
              style="width: 110px"
              :show-all-levels="false"
              :key="isResouceShow"
              filterable
              ref="roleDom"
              :options="roleList"
              v-model="fileForm.uploader"
              @change="roleChange"
              :props="{ value: 'customerId', label: 'label' }"
            />
      </el-form-item>
      <el-form-item label="添加时间："  @keyup.enter.native="getList()">
            <el-date-picker
              style="width:270px"
              v-model="fileForm.uploadTime"
              :unlink-panels="true"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
      </el-form-item>
      <el-button size="small" type="primary" @click="getList()">搜索</el-button>
      <el-button size="small" type="warning" @click="reSet()">重置</el-button>
    </el-form>
    <div class="batch-handle">
      <el-button size="medium" type="primary" v-if="showEdit=='true' || showEdit==true" @click="uploadDialog = true">添加文件</el-button>
      <el-button size="medium" type="success" v-if="showEdit=='true' || showEdit==true" :disabled="this.selectedNum==0" @click="batchDownLoad(selectList)">批量下载</el-button>
    </div>
    <!-- 添加文件弹框组件 -->
     <task-file  :taskId="taskId" :customerId="customerId" v-if="uploadDialog"  @closeDialog='closeReplace' @doRefresh='handledoRefresh'></task-file>
    <avue-crud
      v-if="showEdit=='true' || showEdit==true "
      ref="crud"
      class="batch-choose"
      :page.sync="page"
      :data="tableData"
      :option="tableOption"
      @size-change="sizeChange"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @on-load="getList"
    >
     <template slot="number" slot-scope="scope">
        <span class="titslot" @click="downLoad(scope.row)">{{scope.row.number}}</span>
      </template>
      <template slot="name" slot-scope="scope">
        <span class="titslot" @click="downLoad(scope.row)">{{scope.row.name}}</span>
      </template>
       <template slot="createUserName" slot-scope="scope">
          <!-- <el-tooltip effect="dark" :content="'工号：'+scope.row.employeeNumber+'   部门：'+scope.row.deptName" placement="right">
                 <span>{{ scope.row.createUserName }}</span>
           </el-tooltip> -->
             <el-tooltip effect="dark" :content="scope.row.userTip" placement="right">
                 <span>{{ scope.row.createUser }}</span>
           </el-tooltip>
          </template>
       <template slot="menu" slot-scope="scope">
                <el-button type="text" size="small" icon="el-icon-download" @click="downLoad(scope.row)">{{$t('button.download')}}</el-button>
                <el-button  type="text" size="small" icon="el-icon-delete"  @click="deleteFile(scope.row)">移除</el-button>
      </template>
    </avue-crud>
    <avue-crud
        v-else
        ref="crud"
        class="batch-choose"
        :page.sync="page"
        :data="tableData"
        :option="notableOption"
        @size-change="sizeChange"
        @selection-change="selectionChange"
        @current-change="currentChange"
        @on-load="getList"
        >
        <template slot="createUserName" slot-scope="scope">
            <!-- <el-tooltip effect="dark" :content="'工号：'+scope.row.employeeNumber+'   部门：'+scope.row.deptName" placement="right">
                    <span>{{ scope.row.createUserName }}</span>
            </el-tooltip> -->
              <el-tooltip effect="dark" :content="scope.row.userTip" placement="right">
                 <span>{{ scope.row.createUser }}</span>
           </el-tooltip>
            </template>
        </avue-crud>
  </div>
</template>

<script>
import { tableOption} from "@/const/crud/documentLibrary/another.js";
import { notableOption} from "@/const/crud/documentLibrary/no.js";
import * as CodeMsg from "@/api/common/CodeChange"
import { getEmpList } from "@/api/clue/clue";
import { getTaskLibrary,removeLibrary,singleDown,piliangDown } from "@/api/task/index.js";
import TaskFile from '@/components/file/taskfile';
const recordDate = ()=>{
    let date = new Date();
    let dateYear = date.getFullYear();             //获取年 
    let dateMonth = date.getMonth()+1;               //获取月  
    let dateDate = date.getDate();                 //获取当日
    let dateHours = date.getHours();               //获取小时
    let dateMinutes = date.getMinutes();           //获取分钟
    let dateSeconds = date.getSeconds();           //获取秒
    return dateYear+'年'+dateMonth+'月'+dateDate+'日'+' '+dateHours+'点'+dateMinutes+'分'+dateSeconds+'秒'
}

export default {
  components:{
    TaskFile
  },
  props:{
    showEdit:{
      required: false // 是否允许操作
    },
    taskId:{
      type: Number,
      required: true,
    },
    customerId:{
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loadstatus:'',
      promtMessage: "",
      loading:false,
      uploadDialog: false,//添加文件弹框
      isResouceShow: 0,
      promtMessage: "",
      selectedNum: "",
      selectList: [],
      tableData: [],
      tableOption: tableOption,
      notableOption: notableOption,
      fileForm: {
        keyWords:"",
        uploader:null,
        uploadTime:null
      },
      roleList: [],  
      uploaderNO:'',
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes:[5,8,10,20,30,50,100]
      },
    };
  },
  watch: {
    loadstatus(val) {
      if (val == undefined) {
        this.loading = true;
      } else {
        this.loading = false;
      }
    }
  },
  mounted(){
      // 组织架构
      getEmpList(true).then((res) => {
        let data = res.data.data;
        this.roleList = data;
      });
  },
  methods: {
    handledoRefresh(){
       this.getList();
    },
    // 关闭弹框
    closeReplace(val){
      this.uploadDialog = val;
    },
   //下载文件
    downLoad(row) {
      this.loadstatus = undefined;
      this.promtMessage = "准备下载中...";
     let param = {
        url:row.url,
        name:row.name,
        fileNo:row.number
      }
      singleDown(param).then(res => {
          this.loadstatus = res;
          let objectUrl = window.URL.createObjectURL(new Blob([res.data]));
          var a = document.createElement("a");
          a.href = objectUrl;
          a.download =row.number + row.name;
          a.click();
        }).catch(err => {
          this.$message({
            type: warning,
            message: err
          });
        });
    },
    // 批量下载
    batchDownLoad(selectList){
        this.$confirm(
            "已选择"+this.selectedNum+"个文件，将进行打包下载",
            "批量下载",
            {
                type: "warning",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                cancelButtonClass: "btn-custom-cancel"
            }
        ).then(() => {
            this.loadstatus = undefined;
            this.promtMessage = "准备下载中...";
            let urls = [];
            let names = [];
            let fileNos = [];
            selectList.forEach((item)=>{
                urls.push(item.url)
                names.push(item.number+item.name)
                fileNos.push(item.number)
            })
             let param = {
                urls,
                names,
                fileNos
              }
            piliangDown(param).then(res=>{
                this.loadstatus = res;
                let objectUrl = window.URL.createObjectURL(new Blob([res.data]));
                var a = document.createElement("a");
                a.href = objectUrl;
                a.download = `${recordDate()}.zip`;
                a.click();
                // 清空选中项
                setTimeout(()=>{
                     this.$refs.crud.toggleSelection();
                },500)
            }).catch(err => {
              this.$message({
                type: warning,
                message: err
              });
                // 清空选中项
                setTimeout(()=>{
                     this.$refs.crud.toggleSelection();
                },500)
            });
        })
    },
    //移除文件
    deleteFile(row) {
        const h = this.$createElement;
        this.$confirm(
            h('p', null, [
                h('p', { style: 'textAlign: center' }, '确定移除文件？ '),
                h('p', null, '移除后该文件仅在当前文件柜中删除，不会从文件库中删除，如需彻底删除文件，请去文件库中操作。')
            ]),
            "移除文件",
            {
            type: "warning",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            cancelButtonClass: "btn-custom-cancel"
            }
        ).then(() => {
              let param ={
                fileTaskId:row.fileTaskId,
                fileNo:row.number
              }
              removeLibrary(param).then(res => {
                if(res.data.code==0){
                  this.getList();
                  this.$message({
                    type: "success",
                    message:'已成功移除'
                  });
                }
             
              }).catch(err => {
                console.log(err);
              });
            }).catch(() => {
              console.log("cancel");
            }).catch(() => {
              console.log("cancel");
            })
    },
    getList() {
        let param = {
          taskId:this.taskId,
          customerId:this.uploaderNO,
          beginTime:this.fileForm.uploadTime?this.$moment(this.fileForm.uploadTime[0]).format( "YYYY-MM-DD HH:mm:ss"):'',
          endTime:this.fileForm.uploadTime?this.$moment(this.fileForm.uploadTime[1]).format( "YYYY-MM-DD HH:mm:ss"):'',
          keyword:this.fileForm.keyWords.trim(),
          pageNo:this.page.currentPage,
          pageSize:this.page.pageSize,
        }
      getTaskLibrary(param).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
            this.tableData = res.data.data.records;
            this.page.total = res.data.data.total;
        }else{
          this.$message({
            type:'warning',
            message:res.data.data
          })
        }
        }).catch(err => {
          console.log(err);
        });
    },

    selectionChange(val) {
      this.selectList = val;
      this.selectedNum = val.length;
    },
    currentChange(val) {
        this.page.currentPage = val;
        this.getList();
    },
     sizeChange(val){
      this.page.pageSize = val;
      this.getList();
    },
    // 级联选择
     roleChange(val) {
      ++this.isResouceShow;
      this.$nextTick(() => {
        this.uploaderNO = this.$refs[
          "roleDom"
        ].getCheckedNodes()[0].data.customerId;
      });
    },
     //重置
    reSet() {
      this.fileForm.keyWords = ""
      this.fileForm.uploader = ""
      this.fileForm.uploadTime = null;
      this.uploaderNO = "";
      this.fileForm.uploader = null;
      this.getList();
    },
  },
};
</script>

<style scoped>
.titslot{
    color: #409EFF;
    cursor: pointer;
}
.frame {
  width: 100%;
  padding: 10px 20px;
  background: #fff;
}
.promt {
  position: relative !important;
}
.promt-box {
  position: fixed !important;
  width: 100px;
  height: 50px;
  margin-left: 50%;
  background: gainsboro;
}
.table-list {
  margin-top: 10px;
}
.table {
  margin-top: 10px;
}
.footer {
  width: 500px;
  margin-top: 10px;
  margin: 0 auto;
}
.upload {
  margin: 20px;
}
.title {
  width: 150px;
  margin: 0 auto;
  font-size: 16px;
  text-align: center;
  margin-top: -40px;
}
.box {
  width: 100%;
  overflow: hidden;
}
.related_article {
  font-size: 12px;
  color: #36a6fe;
  cursor: pointer;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.btn {
  float: right;
  margin-top: 10px;
}
.choose-file {
  text-align: center;
  margin: 10px;
}
.batchOperate {
  margin: 10px 0;
}
.dialogBtn {
  margin-top: 40px;
  text-align: center;
}
.file-name {
  color: #36a6fe;
  cursor: pointer;
}
</style>