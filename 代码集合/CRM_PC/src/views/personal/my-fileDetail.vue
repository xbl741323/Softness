<template>
  <div class="file_contain">
    <div class="frame" v-if="showFileDetail">
    <span class="span-title">基本信息</span>
    <table class="table">
      <tr>
        <td class="label">
          <span class="red-text" v-if="type == 1">*</span>
          文件名称
        </td>
        <td class="td-file" >
          <div class="edit-box">
            <div v-if="type == 0">{{fileDetail.fileName}}</div>
            <el-input v-model="form.fileName" maxlength="20" style="width: 500px" v-else> </el-input>
            <div class="red-text" v-if="form.fileName == ''">请填写文件名称</div>
            <!-- <el-tooltip effect="light" :content="fileDetail.fileName" placement="left-bottom" :open-delay="500" v-else>
              <edit-box :row="fileDetail" :permissions="permissions.bt_edit_doc_my ? true : false" @saveKeywords='childSave' style="margin:0" :width="700"></edit-box>
            </el-tooltip> -->
          </div>
          <div class="button-group">
            <div class="download"  @click="cellReplaceFile()" v-if="type == 1">替换</div>
            <div class="download" @click="preview">预览</div>
          </div>
        </td>
      </tr>
      <tr>
        <td class="label">
          <span class="red-text" v-if="type == 1">*</span>
          显示状态
        </td>
        <td class="value">
          <el-radio-group v-model="fileDetail.state" disabled v-if="type == 0">
            <el-radio :label="0" v-if="fileDetail.state == 0">置顶</el-radio>
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="2">不显示</el-radio>
          </el-radio-group>
          <el-radio-group v-model="form.state" v-else>
            <el-radio :label="0" v-if="fileDetail.state == 0" disabled>置顶</el-radio>
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="2">不显示</el-radio>
          </el-radio-group>
        </td>
      </tr>
      <tr>
        <td class="label">
          <span class="red-text" v-if="type == 1">*</span>
          级别
        </td>
        <td class="value">
          <div v-if="type == 0">{{fileDetail.level | levelFilter}}</div>
          <el-select v-model="form.level" placeholder="请选择级别" @change="levelChange" v-else>
            <el-option
              v-for="item in levelList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td class="label">
          <span class="red-text" v-if="type == 1">*</span>
          地区
        </td>
        <td class="value">
          <div v-if="type == 0">{{fileDetail.areaName}}</div>
          <el-cascader ref="cas" 
            :options="areaOptions" 
            v-model="form.region"
            show-all-levels
            :placeholder="casDisable==false?'请选择地区':'全国'" 
            :props="{ value: 'no', label: 'name'}" 
            :disabled="casDisable || !form.level"
            style="width: 180px;"
            v-else>
          </el-cascader>
          <div class="red-text" v-if="form.level != 1 && !form.region && type == 1">请选择地区</div>
        </td>
      </tr>
      <tr>
        <td class="label">
          <span class="red-text" v-if="type == 1">*</span>
          类型
        </td>
        <td class="value">
          <el-radio-group v-model="fileDetail.isPay" disabled v-if="type == 0">
            <el-radio :label="0" >免费</el-radio>
            <el-radio :label="1">付费</el-radio>
          </el-radio-group>
          <el-radio-group v-model="form.isPay" v-else>
            <el-radio :label="0" >免费</el-radio>
            <el-radio :label="1">付费</el-radio>
          </el-radio-group>
        </td>
      </tr>
      <tr>
        <td class="label">
          <span class="red-text" v-if="type == 1">*</span>
          价格
        </td>
        <td class="value">
          <div v-if="type == 0">{{filterAmount(fileDetail.amount)}}</div>
          <div v-else>
            <div v-if="form.isPay == 0">/</div>
            <div v-else>
              <el-input v-model="form.amount" style="width: 100px" @blur="textAmount"></el-input>
              <div class="red-text" v-if="showText">{{textMsg}}</div>
            </div>
            
          </div>
        </td>
      </tr>
      <tr>
        <td class="label">下载次数</td>
        <td class="value">{{fileDetail.downloadTimes}}</td>
      </tr>
      <tr>
        <td class="label">操作人</td>
        <td class="value">
          <span>{{fileDetail.operatorByName}}</span>
        </td>
      </tr>
      <tr>
        <td class="label">操作时间</td>
        <td class="value">{{fileDetail.operatorTime}}</td>
      </tr>
    </table>
    <div class="related-articles">
      <span class="span-title">关联文章(不包括草稿和已删除文章)</span>
      <el-form class="search" :model="articleForm" label-width="90px" inline>
        <el-form-item label="关键字：" prop="title">
          <el-input placeholder="请输入文章标题关键字" v-model="articleForm.title" class="input-class" />
        </el-form-item>
        <el-form-item label="发布人：" prop="createUserName" >
          <el-input placeholder="请输入发布人姓名" v-model="articleForm.name" style="width:140px" />
        </el-form-item>
        <el-form-item label="显示状态：" prop="state">
         <el-select v-model="articleForm.state" style="width:90px">
           <el-option v-for="item in showList" 
           :key="item.value"
           :label="item.label"
           :value="item.value">
           </el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="发布时间：" prop="time">
          <el-date-picker
            v-model="articleForm.time"
            type="datetimerange"
            style="width:270px"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm"
            :default-time="['12:00:00']">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="getReleateArticle()">搜索</el-button>
          <el-button size="mini" type="warning" @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>

      <span class="batch">批量操作：</span>
      <!-- <el-button :disabled="this.selectedNum==0" @click="permissions.bt_edit_doc_my ? cellReplaceFile(selectList) : $notAuthorized()">替换</el-button> -->
      <el-button type="danger" :disabled="this.selectedNum==0 || type != 1" @click="deleteFileRelate(selectList)">删除关联</el-button>
      <el-table :data="articleList" border @selection-change="handleSelectionChange" :header-cell-style="{'text-align':'center'}" class="table">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="文章编号" align="center">
          <template slot-scope="scope">
            <p class="href" @click="toEdit(scope.row)">{{scope.row.number}}</p>
          </template>
        </el-table-column>
        <el-table-column label="标题" width="300" show-overflow-tooltip>
          <template slot-scope="scope">
            <p class="href" @click="toEdit(scope.row)">{{scope.row.articleTitle}}</p>
          </template>
        </el-table-column>
        <el-table-column label="文章板块" prop="policyType" align="center"></el-table-column >
        <el-table-column label="发布人" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="'工号：'+scope.row.employeeNumber+'   部门：'+scope.row.deptName" placement="right">
              <span>{{scope.row.createUserName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="显示状态" prop="showStatusEnum" align="center"></el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" :disabled="type != 1" @click="view(scope.row)">浏览</el-button>
            <!-- <el-button type="text" @click="permissions.bt_edit_doc_my ? cellReplaceFile([scope.row]) : $notAuthorized()">替换</el-button> -->
            <el-button type="text" @click="deleteFileRelate([scope.row])" :disabled="type != 1">删除关联</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next,total"
        @current-change="articleCurrentChange"
        :page-size="20"
        :total='total'>
      </el-pagination>
      <div class="button-edit" v-if="type == 1">
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" @click="edit" :disabled="(form.isPay == 1 && (form.amount == '' || showText)) || form.fileName == '' || (form.level != 1 && !form.region) || form.level == ''">确定</el-button>
      </div>
      <!-- 文件替换 -->
      <file-replace-dialog :uploadDialog="replaceDialog" @closeDialog='closeReplace()' :cellData='cellReplaceData' :source="source" :isMy="true" @handleReplace="handleReplace" v-if="replaceDialog"></file-replace-dialog>
    </div>
  </div>
   </div>
</template>

<script>
import OSSUploader from '@/util/ossUpload';
import { releateArticle,deleteRelate,docDetailMy, editDocMy } from '@/api/policy/detail'
import { getNewArea, fileDownload } from "@/api/policy/list";
import EditBox from '@/components/file/editBox.vue';//名称编辑框
import FileReplaceDialog from '@/components/file/fileReplaceDialog'//文件替换框
import { mapGetters } from 'vuex';
export default {
  components:{
    EditBox,
    FileReplaceDialog
  },
  data(){
    return{
      source:true,//文件详情替换
      options:null,
      fileName:'',
      suffix:'',
      total:0,
      type: 0,
      areaOptions: [],
      provinceOptions: [],//省级
      cityOptions: [],//市级
      districtOptions: [],//区级
      ossUrl: process.env.VUE_APP_OSS_URL,
      webUrl: process.env.VUE_APP_WEB_URL,
      showText: false,
      textMsg: false,
      form: {
        level: null,
        region: [],
        fileName: null,
        state: null,
        isPay: null,
        amount: null,
      },
      newFile: {},
      levelList: [{
          label: '国家级',
          value: '1'
      },{
          label: '省级',
          value: '2'
      },{
          label: '市级',
          value: '3'
      },{
          label: '区级',
          value: '4'
      }],
      regionList: [],
      currentPage:1,
      casDisable: false,
      id:'',
      fileDetail:{},
      articleForm:{},
      articleList:[],
      showList:[
        {
          label:'全部',
          value: null
        },
        {
          label:'置顶',
          value: 0
        },
        {
          label:'显示',
          value: 1
        },
        {
          label:'不显示',
          value: 2
        },
      ],
      cellReplaceData:{},
      replaceDialog:false,
      selectedNum:0,
      selectList:[],
      showFileDetail: false
    }
  },
  directives:{
    focus:{
        inserted:function(el){
            el.focus();
        }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters: {
    levelFilter(val){
      if(val){
        return val == 1 ? '国家级' : val == 2 ? '省级' : val == 3 ? '市级' : val == 4 ? '区级' : ''
      }
    },
  },
  created(){
    this.id = this.$route.query.id;
    this.type = this.$route.query.type
    this.getNewArea()
    this.getReleateArticle()
  },
  methods:{
    filterAmount(val) {
      return val.toFixed(2)
    },
    textAmount() {
      this.showText = false
      const priceRegex = /^([1-9]\d*|0)(\.\d{1,2})?$/;
      if (this.form.amount == 0) {
        this.showText = true
        this.textMsg = '请输入价格'
      } else if (!priceRegex.test(this.form.amount)) {
        this.showText = true
        this.textMsg = '请输入正确的价格（正整数或最多保留两位小数）'
      }
    },
    preview() {
      if (this.fileDetail.state == -1) {
        this.$message({
          type: "warning",
          message: "文档处理中请稍后重试！"
        })
        this.getDetail()
      } else {
        window.open(this.webUrl + 'policy/files/' + this.id)
      }
    },
    levelChange(e){
      switch (Number(e)){
        case 1:
          this.casDisable = true
          this.form.region = null
          this.areaOptions = []
          break
        case 2:
          this.casDisable = false
          this.form.region = null
          this.areaOptions = this.getTreeData(JSON.parse(JSON.stringify(this.regionList)), 1)
          break
        case 3:
          this.casDisable = false
          this.form.region = null
          this.areaOptions = this.getTreeData(JSON.parse(JSON.stringify(this.regionList)), 2)
          break
        case 4:
          this.casDisable = false
          this.form.region = null
          this.areaOptions = JSON.parse(JSON.stringify(this.regionList))
          break
      }
    },
    getNewArea(){
      getNewArea().then(res => {
        this.regionList = res.data.data
        this.getDetail();
      }).catch(err => {
        console.log(err);
      });
    },
    getTreeData (data, num) {
      data.forEach(v => {
        if (v.level <= num) {
          if (v.level === num) {
            // children若为空数组，则将children设为undefined
            v.children = undefined
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(v.children, num)
          }
        }
      })
      return data
    },
    getDetail(){
      let para = {
        id: this.id
      }
      docDetailMy(para).then(res=>{
        if(res.data.code == 0){
          this.fileDetail = res.data.data;
          this.levelChange(this.fileDetail.level)
          if (this.type == 1) {
            this.form = {
              level: this.fileDetail.level,
              region: this.fileDetail.areaNo.split(','),
              fileName: this.fileDetail.fileName,
              state: this.fileDetail.state,
              isPay: this.fileDetail.isPay,
              amount: this.fileDetail.amount.toFixed(2),
            }
          }
          this.cellReplaceData = this.fileDetail
          this.$set(this.fileDetail,'options',null);//表格可编辑添加字段
          this.showFileDetail = true;
        }else{
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
    },
    getReleateArticle() {
      let param = {
        start:this.currentPage,
        size:20,
        id:this.id,
      }
      if(this.articleForm.title){
        param.articleTitle = this.articleForm.title;
      }
      if(this.articleForm.fileName){
        param.createUserName = this.articleForm.fileName;
      }
      if(this.articleForm.name){
        param.createUserName = this.articleForm.name;
      }
      if(this.articleForm.state != null){
        param.showStatus = this.articleForm.state;
      }
      if(this.articleForm.time){
        param.startTime = this.$moment(this.articleForm.time[0]).format("YYYY-MM-DD HH:mm:ss");
        param.endTime = this.$moment(this.articleForm.time[1]).format("YYYY-MM-DD HH:mm:ss");
      }
      releateArticle(param).then(res=>{
        if (res.data.code == 0) {
          this.articleList = res.data.data.records;
          this.total = res.data.data.total;
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
    },
    handleReplace(file) {
      this.newFile = file
      let name = file.name.split('.')
      let type = name.pop()
      this.newFile.fileType = type
      this.form.fileName = name.join('.')
      this.cellReplaceData = file
      this.cellReplaceData.fileName = name.join('.')
    },
    toEdit(row){
      let routeData = this.$router.resolve({
        path: "/personal-editnotice",
        query: {
          number: row.number,
          beFrom: 1,
          type: row.type,
          deleted: row.deleted,
        },
      });
      window.open(routeData.href, "_blank");
    },
    view(row){
      window.open(this.webUrl + 'policy/'+row.number+ '?id=' + row.id);
    },
    downLoad(row) {
      this.loadstatus = undefined;
      this.promtMessage = "准备下载中...";
      fileDownload(row.id).then(res => {
        this.loadstatus = res;
        let blob = new Blob([res.data]);
        let objectUrl = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = objectUrl;
        a.download = row.fileName;
        a.click();
      }).catch(err => {
        this.$message({
          type: warning,
          message: err
        });
      });
    },
    edit(){
      if (JSON.stringify(this.newFile) != '{}') {
        let file = this.newFile.raw
        let fileName = this.form.fileName
        this.uploadFile(file, fileName + '.' + this.newFile.fileType)
      } else {
        this.handleEdit()
      }
    },
    handleEdit(url) {
      let params= {
        id: this.id,
        amount: this.form.isPay == 1 ? Number(this.form.amount).toFixed(2) : null,
        areaNo: this.form.level == 1 ? '000000' : this.form.region.toString(),
        fileType: this.fileDetail.fileType,
        isPay: this.form.isPay,
        level: this.form.level,
        state: this.form.state,
        fileName: this.form.fileName,
        isReplacement: JSON.stringify(this.newFile) == '{}' ? false : true,
      }
      if (JSON.stringify(this.newFile) != '{}') {
        params.fileType = this.newFile.fileType
        params.fileSourceUrl = url
      }
      editDocMy(params).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: "success",
            message: "编辑成功！"
          })
          this.handleBack()
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          })
        }
      })
    },
    // 上传
    async uploadFile(file,fileName) {
      if (!file || file.length === 0) {
        return;
      }
      const uploader = await new OSSUploader(true)
      await uploader.upload(file,  this.ossUrl + fileName).then(url => {
        this.handleEdit(url)
      })
    },
    handleBack() {
      this.$router.push('/personal/myPublish')
    },
    closeReplace(val){
      this.replaceDialog = val;
    },
    cellReplaceFile(){
      this.replaceDialog = true
    },
    deleteFileRelate(row){
      this.$confirm('删除关联后，该文章下将删除此文件附件，确定删除关联吗？','删除',{
        type:'warning',
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel"
      }).then(()=>{
        let params = {};
        let ids = []
        for(let i= 0;i<row.length;i++){
          ids.push(row[i].id)
          params.ids = ids
        }
        deleteRelate(params).then(res=>{
          if(res.data.code == 0){
            this.$message({
              type:'success',
              message:'删除关联成功！'
            })
            this.getReleateArticle();
          }else{
            this.$message({
              type:'warning',
              message:'删除关联失败！'
            })
          }
        })
      })
    },
    articleCurrentChange(val){
      this.currentPage = val;
      this.getReleateArticle();
    },
    reset(){
      this.articleForm = {},
      this.getReleateArticle();
    },
    handleSelectionChange(row){
      this.selectList = row;
      if(row.length>0){
        this.selectedNum = row.length;
      }else{
        this.selectedNum =0;
      }
    },
  },
}
</script>

<style scoped>
.file_contain{
  width: 100%;
  background: #ffffff;
  min-height: 850px;
  margin-left: 10px;
  padding: 20px;
}
.frame{ 
  width: 90%;
  margin: 0 auto;
}
.span-title{
  padding-left:10px;
  border-left:3px solid #36A6FE;
}
.table{
  width: 100%;
  margin: 20px;
  color:#666;
  border-collapse:collapse;
  border: 1px solid lightgrey;
}
.label{
  width:15%;
  padding: 5px 5px;
  line-height:30px;
  font-size:14px;
  font-weight: bold;
  text-align:center; 
  border:1px solid lightgrey;
  padding-right:-10px;
}
.value{
  width:85%;
  padding-left:20px;
  line-height: 20px;
  font-size:14px;
  border:1px solid lightgrey;
}
.td-file{
  /* width:100%; */
  height: 70px;
  padding-left:20px;
  line-height: 20px;
  font-size:14px;
  display: grid;
  grid-template-columns: 88% 12%;
  /* border-top:1px solid lightgrey; */
  border-right:1px solid lightgrey;
}
.search{
  margin-top:10px;
}
.batch{
  margin-left:20px;
}
.download{
  text-align: center;
  border: 1px solid #eee;
  padding: 5px 15px;
  cursor: pointer;
}
.download:hover{
  color:#36A6FE;
}
.edit-box{
  margin: auto 0;
  display: flex;
  flex-direction: column;
}
.href{
  color:#36A6FE;
  cursor: pointer;
}
.input-class{
  width:170px;
}
.button-group{
  display: flex;
  justify-content: center;
  align-items: center;
}
.button-group :first-child{
  margin-right: 5px;
}
.button-edit{
  text-align: center;
}
.red-text{
  color: #F56C6C;
  margin-right: 4px;
}
</style>