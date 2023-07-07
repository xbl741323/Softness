<template>
  <div class="frame">
    <div class="customer_title">{{$route.query.customerName}} 的文件</div>
    <el-form :inline="true" :model="fileForm" @submit.native.prevent>
      <el-form-item
        label="文件类型"
        prop="fileType">
        <el-select
          v-model="fileForm.fileType" @change="changeFileType">
          <el-option
            v-for="(item, index) in fileTypeList"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字" prop="keyword">
        <el-input
          :class="[fileForm.fileType==1?'long-wid':'short-wid']"
          v-model="fileForm.keyword"
          :placeholder="fileForm.fileType==1?'请输入文件名/任务名/专利名称关键字/精确任务编号/申请号':'请输入文件名/关联名称/关联编号'"
          @keyup.enter.native="getAllList()"
        />
      </el-form-item>
      <el-form-item label="更新人" prop="updateBy">
        <el-input
          style="width:320px"
          v-model="fileForm.updateBy"
          placeholder="请输入更新人姓名"
          @keyup.enter.native="getAllList()"
        />
      </el-form-item>
      <el-form-item label="下证日：" @keyup.enter.native="getAllList()" v-if="fileForm.fileType==1">
        <el-date-picker
          style="width:360px"
          v-model="fileForm.passTime"
          :unlink-panels="true"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-button size="small" type="primary" @click="getAllList()">搜索</el-button>
      <el-button size="small" type="warning" @click="reSet()">重置</el-button>
    </el-form>
    <div class="batch-handle">
      <el-button size="medium" type="success" :disabled="this.selectedNum==0" v-if="permissions.bt_customer_file_download" @click="batchDownLoad(selectList)">批量下载</el-button>
    </div>
    <avue-crud
      ref="crud"
      class="batch-choose"
      :page.sync="page"
      :data="tableData"
      :option="tableOption"
      @size-change="sizeChange"
      @selection-change="selectionChange"
      @on-load="getList"
      @current-change="currentChange"
      @cell-mouse-enter="showLoadIcon"
      @cell-mouse-leave="leaveLoadIcon"
    >
        <!-- 文件名称 -->
        <template slot="fileName" slot-scope="scope">
          <div :class="[(taskId===scope.row.taskId||taskId===0)&&scope.row.isShow?'download_files':'']">
            <span class="titslot" v-if="scope.row.fileName" >
              <span>{{scope.row.fileName}}</span>&nbsp;&nbsp;
            </span>
            <span v-else>-</span>
            <el-tooltip effect="dark" content="下载" placement="bottom-start">
              <span v-if="permissions.bt_customer_file_download && (taskId===scope.row.taskId||taskId===0) &&scope.row.isShow" @click="downLoad(scope.row)" class="download_file">
                <i class="el-icon-download download_icon"></i>
              </span>
            </el-tooltip>
          </div>
        </template>
        <!-- 申请号 -->
        <template slot="patentApplicationNo" slot-scope="scope">
          <span>{{scope.row.patentApplicationNo || '-'}}</span>
        </template>
        <!-- 专利名称 -->
        <template slot="patentName" slot-scope="scope">
          <span>{{scope.row.patentName || '-'}}</span>
        </template>
        <!-- 申请日 -->
        <template slot="applyTime" slot-scope="scope">
          <span>{{scope.row.applyTime || '-'}}</span>
        </template>
        <!-- 下证日 -->
        <template slot="passTime" slot-scope="scope">
          <span>{{scope.row.passTime || '-'}}</span>
        </template>
        <!-- 专利类型 -->
        <template slot="patentType" slot-scope="scope">
          <span>{{scope.row.patentType | filterPatentType}}</span>
        </template>
        <!-- 更新时间 -->
        <template slot="updateTime" slot-scope="scope">
          <span>{{scope.row.updateTime || '-'}}</span>
        </template>
        <!-- 更新人 -->
        <template slot="updateByName" slot-scope="scope">
          <el-tooltip effect="dark" :content="tooltipContent" placement="top-start" v-if="scope.row.updateBy">
            <span @mouseover="showUserInfo(scope.row.updateBy)">
              {{ scope.row.updateByName }}
            </span>
          </el-tooltip>
          <span v-else>-</span>
        </template>
        <!-- 大小 -->
        <template slot="fileSize" slot-scope="scope">
          <span>{{scope.row.fileSize || '-'}}</span>
        </template>
        <!-- 关联编号 -->
        <template slot="sourceNo" slot-scope="scope">
          <el-tooltip effect="dark" placement="top" v-if="scope.row.sourceNo">
            <div slot="content">
              <span>来源：{{ scope.row.sourceType | filterSourceType}}</span><br/>
              <span>关联编号：{{scope.row.sourceNo || '-'}}</span> 
              <i class="el-icon-document-copy copy-sty" v-if="scope.row.sourceNo" @click="copyText(scope.row.sourceNo)"></i><br/>
              <span>关联名称：{{scope.row.sourceName || '-'}}</span>
            </div>
            <span>{{scope.row.sourceNo}}</span>
          </el-tooltip>
          <span v-else>-</span>
        </template>
        <!-- 文件类型 -->
        <template slot="fileType" slot-scope="scope">
          <span>{{scope.row.fileType | filterFileType(scope.row.materialType) }}</span>
        </template>
    </avue-crud>
  </div>
</template>

<script>
import { tableOption, tablesOption} from "@/const/crud/documentLibrary/customer-files-detail";
import * as CodeMsg from "@/api/common/CodeChange"
import fileData from "@/components/task/js/task"
import { pageCustomerFile } from "@/api/task/index";
import { mapGetters } from "vuex";
import { mixin } from "@/mixins/userInfo";
import JSZip from "jszip";
import FileSaver from "file-saver";
let that;
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
  mixins: [mixin],
  data() {
    return {
      promtMessage: "",
      isResouceShow: 0,
      selectedNum: "",
      selectList: [],
      tableData: [],
      tableOption: tableOption,
      tablesOption: tablesOption,
      fileTypeList: fileData.fileTypeList,
      fileTypes: fileData.fileTypes,
      materialTypes: fileData.materialTypes,
      fileForm: {
        fileType: null,
        keyword:"",
        updateBy: "",
        passTime:null,
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 15, // 每页显示多少条
        pageSizes:[5,10,15,20,30,50,100]
      },
      taskId: null,
    };
  },
  beforeCreate(){
    that = this
  },
  created(){
    if(sessionStorage.getItem(`/task/files-library/customer-files/indexspecial`)){
      let data = JSON.parse(sessionStorage.getItem('/task/files-library/customer-files/indexspecial'))
      this.fileForm.updateBy = data.updateBy,
      this.fileForm.fileType = data.fileType,
      this.fileForm.passTime = data.passTime,
      this.fileForm.keyword = data.keyword
      this.page.currentPage = data.currentPage
      this.pageSize = data.pageSize
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters: {
    filterFileType(fileType, materialType){
      const materialTypes = that.materialTypes
      if (materialType && materialType != 6) {
        let name = materialTypes[materialType] ? materialTypes[materialType] : '-'
        if(that.fileForm.fileType){
          return name;
        }else{
          return name!== '-' && name.indexOf('材')>-1 ? '材料' : name;
        }
      } else {
        return (fileType === 1) ? '营业执照' : ((fileType >= 2 && fileType <= 7) ? '证书' : ((fileType === 8) ? '材料' : '-'));
      }
    },
    filterPatentType(val){
      return val == 0 ? '发明' : val == 1 ? '实用' : val == 2 ? '外观' : '-'
    },
    filterSourceType(val){
      return val == 1 ? '初级认证' : val == 2 ? '任务' : '-'
    },
  },
  methods: {
    showLoadIcon(row, column, cell, event){
      if(column.property == 'fileName'){
        this.$nextTick(()=>{
          if(row.taskId){
            this.taskId = row.taskId
          }else{
            this.taskId = 0
          }
          this.$set(this.tableData[row.$index], 'isShow', true)
        })
      }
    },
    leaveLoadIcon(row, column, cell, event){
      if(column.property == 'fileName'){
        this.$nextTick(()=>{
          this.taskId = null
          this.$set(this.tableData[row.$index], 'isShow', false)
        })
      }
    },
    getAllList(){
      this.page.currentPage = 1
      this.getList()
    },
    // 文件类型选择改变
    changeFileType(val){
      this.$nextTick(()=>{
        this.$refs.crud.refreshTable()
      })
      this.getAllList()
    },
    // 复制关联编号
    copyText(content){
      const ele = document.createElement("input");
      ele.setAttribute("value", content);
      document.body.appendChild(ele);
      ele.select();
      document.execCommand("copy");
      document.body.removeChild(ele);
      this.$message({
        type: "success",
        message: "关联编号复制成功",
      });
    },
   //下载文件
    downLoad(row) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", row.fileUrl, true);
      xhr.responseType = "blob";
      xhr.onload = function() {
        if (xhr.status === 200) {
          // 获取响应中的Blob对象
          const blob = xhr.response;
          // 创建一个隐藏的 <a> 元素
          const link = document.createElement("a");
          link.style.display = "none";
          // 创建一个包含文件名的Blob对象
          const blobWithFileName = new Blob([blob], {
            type: "application/octet-stream"
          });
          const blobUrl = window.URL.createObjectURL(blobWithFileName);
          // 设置下载文件的URL和文件名
          link.href = blobUrl;
          link.download = row.fileName;
          // 将 <a> 元素添加到页面中
          document.body.appendChild(link);
          // 触发点击事件，开始下载
          link.click();
          // 清理 <a> 元素和URL对象
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        }
      };
      xhr.send();
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
        let fileList = []
        selectList.forEach((item)=>{
          if(item.fileUrl){
            fileList.push({
              name: item.fileName,
              url: item.fileUrl
            })
          }
        })
        this.downloadZip(fileList);
      })
    },
    // 点击下载
    downloadZip(fileList) {
      var blogTitle = `${recordDate()}`; // 下载后压缩包的命名
      var zip = new JSZip();
      var promises = [];
      let cache = {};
      let arrImg = [];
      for (let i = 0; i < fileList.length; i++) {
        arrImg.push({
          path: fileList[i].url, // 文件链接
          name: fileList[i].name // 文件名称
        });
      }
      for (let item of arrImg) {
        // item.path为文件链接地址
        const promise = this.getImgArrayBuffer(item.path).then((data) => {
          // 下载文件, 并存成ArrayBuffer对象(blob)
          zip.file(item.name, data, { binary: true }); // 逐个添加文件
          cache[item.name] = data;
        });
        promises.push(promise);
      }
      Promise.all(promises).then(() => {
        zip.generateAsync({ type: "blob" }).then((content) => {
          // 生成二进制流
          FileSaver.saveAs(content, blogTitle); // 利用file-saver保存文件  自定义文件名
        });
      }).catch((res) => {
        this.$message({
          type:'warning',
          message: '文件批量下载失败'
        })
      });
    },
    //文件以流的形式获取（参数url为文件链接地址）
    getImgArrayBuffer(url) {
      return new Promise((resolve, reject) => {
        //通过请求获取文件blob格式
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.responseType = "blob";
        xmlhttp.onload = function () {
          if (this.status == 200) {
            resolve(this.response);
          } else {
            reject(this.status);
          }
        };
        xmlhttp.send();
      });
    },
    // 列表
    getList() {
      if(this.fileForm.fileType == 1){
        this.tableOption = {...tablesOption}
      }else{
        this.tableOption = {...tableOption}
      }
       let param = {
          customerId: this.$route.query.customerId,
          username: this.fileForm.updateBy.trim(),
          fileType: this.fileForm.fileType == null ? 0 : this.fileForm.fileType,
          startTime: this.fileForm.passTime ? this.$moment(this.fileForm.passTime[0]).format( "YYYY-MM-DD HH:mm") : '',
          endTime: this.fileForm.passTime ? this.$moment(this.fileForm.passTime[1]).format( "YYYY-MM-DD HH:mm") : '',
          keyword: this.fileForm.keyword.trim(),
          pageNo: this.page.currentPage,
          pageSize: this.page.pageSize,
        }
      pageCustomerFile(param).then(res => {
          if(res.data.code == CodeMsg.CODE_0){
            this.tableData = res.data.data.records;
            let arr = []
            this.tableData.map(item =>{
              arr.push(Object.assign(item, {isShow:false}))
            })
            this.tableData = arr
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
        let keepParams = {
          updateBy: this.fileForm.updateBy,
          fileType: this.fileForm.fileType,
          passTime: this.fileForm.passTime,
          keyword: this.fileForm.keyword,
          currentPage: this.page.currentPage,
          pageSize: this.pageSize
        }
        sessionStorage.setItem('/task/files-library/customer-files/indexspecial', JSON.stringify(keepParams))
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
    //重置
    reSet() {
      this.fileForm.fileType = null;
      this.fileForm.keyword = "";
      this.fileForm.updateBy = "";
      this.fileForm.passTime = null;
      this.$nextTick(()=>{
        this.$refs.crud.refreshTable();
      })
      this.tableOption = {...tableOption}
      this.getAllList();
    },
  },
};
</script>

<style scoped>
.titslot:hover{
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
.customer_title {
  margin: 6px 0 8px 0;
  font-size: 14px;
  font-weight: 700;
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
.long-wid {
  width: 350px;
}
.short-wid {
  width: 320px;
}
.download_file {
  display: inline-block;
  width: 21px;
  height: 40px;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}
.download_files {
  color: #36a6fe;
  cursor: pointer;
}
.download_icon {
  margin-top: 15px;
}
</style>


