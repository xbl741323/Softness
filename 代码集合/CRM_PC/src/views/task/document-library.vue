<template>
  <div class="frame"
    v-loading="loading"
    :element-loading-text="promtMessage"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-form :inline="true" :model="fileForm" @submit.native.prevent>
      <el-form-item :label="$t('label.keywords')" prop="keyWords">
        <el-input
          style="width:320px"
          v-model="fileForm.keyWords"
          placeholder="请输入文件名称/客户名称关键字或文件编号/员工姓名"
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
              clearable
              :before-filter="beforeFilter"
              v-model="fileForm.uploader"
              @change="roleChange"
              :props="{ value: 'customerId', label: 'label' }"
            >
              <template slot-scope="{data}">
                <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                  <div slot="content">{{data.customerNo}}</div>
                  <span>{{data.label}}</span>
                </el-tooltip>
              </template>
            </el-cascader>
      </el-form-item>
      <el-form-item label="上传时间："  @keyup.enter.native="getList()">
            <el-date-picker
              style="width:360px"
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
      <el-button size="medium" type="success" :disabled="this.selectedNum==0" @click="batchDownLoad(selectList)">批量下载</el-button>
    </div>
    <avue-crud
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
       <template slot="taskNum" slot-scope="scope">
        <span style="color: #409EFF;">{{scope.row.taskNum}}</span>
      </template>
       <template slot="createUserName" slot-scope="scope">
           <el-tooltip effect="dark" :content="scope.row.userTip" placement="right">
                 <span>{{ scope.row.createUser }}</span>
           </el-tooltip>
          </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" size="small" icon="el-icon-download" @click="downLoad(scope.row)">{{$t('button.download')}}</el-button>
        <el-button  type="text" size="small" icon="el-icon-delete" v-if="scope.row.taskNum == 0" @click="deleteFile(scope.row)">{{$t('button.delete')}}</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { tableOption} from "@/const/crud/documentLibrary/index.js";
import { getEmpList } from "@/api/clue/clue";
import { getLibrary,deleteLibrary,singleDown,piliangDown } from "@/api/task/index.js";
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
  },
  data() {
    return {
      loadstatus:'',
      promtMessage: "",
      loading:false,
      isResouceShow: 0,
      selectedNum: "",
      selectList: [],
      tableData: [],
      tableOption: tableOption,
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
  created(){
     if(sessionStorage.getItem(`${this.$route.path}`)){
        let keepParams =JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
        this.fileForm = keepParams.params
        this.page = keepParams.page
    }
  },
  mounted(){
      // 组织架构
    getEmpList(true).then((res) => {
        let data = res.data.data;
        this.roleList = data;
      });
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
  methods: {
    //显示工号
    async beforeFilter() {
      await getEmpList(true).then((res) => {
        if(res.data.code == 0) {
          this.roleList = res.data.data;
        }
      });
      this.$loop(this.roleList[0], this.roleList[0])
      return false
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
    //删除文件
    deleteFile(row) {
      this.$confirm(
       "删除后文件库中不再显示！",
        "删除文件",
        {
          type: "warning",
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel"
        }
      ).then(() => {
          let param ={
            fileId:row.id,
            fileNo:row.number
          }
          deleteLibrary(param).then(res => {
            this.getList();
            this.$message({
              type: "success",
              message: this.$t("alert.sucessDelete")
            });
          }).catch(err => {
            console.log(err);
          });
        }).catch(() => {
          console.log("cancel");
        });
    },
    // 列表
    getList() {
       let param = {
          customerId:this.uploaderNO,
          beginTime:this.fileForm.uploadTime?this.$moment(this.fileForm.uploadTime[0]).format( "YYYY-MM-DD HH:mm"):'',
          endTime:this.fileForm.uploadTime?this.$moment(this.fileForm.uploadTime[1]).format( "YYYY-MM-DD HH:mm"):'',
          keyword:this.fileForm.keyWords.trim(),
          pageNo:this.page.currentPage,
          pageSize:this.page.pageSize,
        }
      let keepParams = {   
         params:this.fileForm,
         page:this.page,  
         detail:{
          path:'',
          query:{}
         }
       } 
      //保存页面信息
      sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
      getLibrary(param).then(res => {
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