<template>
<!-- 排查完成 -->
  <div>
    <!-- 文件替换 -->
    <el-dialog :visible.sync='replaceDialog' title="添加附件" width="450px" :close-on-click-modal="false" @close="closeResourceDialog()">
      <span>请选择附件的来源：</span>
      <template>
        <el-radio-group v-model="sourceFile">
          <el-radio :label="0">文件库</el-radio>
          <el-radio :label="1">本地文件</el-radio>
        </el-radio-group>
      </template>
      <div style="margin-top: 40px; text-align: center;">
        <el-button size="mini" type="primary" @click='next()'>下一步</el-button>
        <el-button size="mini" type="warning" @click="closeResourceDialog()">{{$t('button.cancel')}}</el-button>
      </div>
    </el-dialog>
    <!-- 文件库附件 -->
    <el-dialog :visible.sync='libraryDialog' title="上传附件" :close-on-click-modal="false" :before-close="closeFileDialog">
      <span>请选择文件</span>
      <el-input placeholder="请输入目标文件编号或文件名称关键字" style="width:260px;margin:0 20px" v-model="fileKeywords" />
      <el-button @click="next()">搜索</el-button>
      <div class="mt">
        <el-tag
          class="mr"
          v-for="(item, index) in tagsList"
          :key="item.id"
          type=""
          :disable-transitions="true">
          {{item.name}}
          <i class="el-icon-close" @click="deleteRow(index)"></i>
        </el-tag>
      </div>
      <el-table ref="multipleTable" border :row-key="rowKey" :data="libraryList" class="table" @selection-change="handleSelectionChange" :header-cell-class-name="cellClass" >
        <el-table-column type="selection" :reserve-selection="true" :selectable="radioBox"></el-table-column>
        <el-table-column label="文件编号" prop="number"></el-table-column>
        <el-table-column label="文件名称" prop="name"></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, total"
        @current-change="replaceCurrentChange"
        :page-size="10"
        :total='total'
      ></el-pagination>
      <div style="display: flex;justify-content: center;text-align: center;margin-top: 15px;"> 
        <!-- class="policyFileBtn" -->
        <el-button size="mini" type="primary" @click='lastStep()'>上一步</el-button>
        <el-button size="mini" type="primary" @click="toReplace()">{{$t('button.confirm')}}</el-button>
        <el-button size="mini" type="warning" @click="closeFileDialog">{{$t('button.cancel')}}</el-button>
      </div>
    </el-dialog>
    <!-- 上传弹框 -->
    <el-dialog :visible.sync="uploadDialog" width="45%" title="上传附件" :close-on-click-modal="false" @close="cancleUpload">
      <div class="upload">
        <div style="display:flex;align-items:center;">
          <span>选择文件：</span>
          <el-upload
            :disabled="length + fileList.length>=5"
            class="upload-demo"
            action
            ref="upload"
            :file-list="fileList"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="5 - length"
            :accept="acceptList"
            :before-upload="beforeAvatarUpload"
            :on-exceed="handleExceed"
            :on-change="OnChange"
            :auto-upload="false"
            :show-file-list='false'
          >
            <el-button size="small" :disabled="length + fileList.length>=5" type="primary">{{$t('label.addFiles')}}</el-button>
            <span class="warning">上限5条，仅支持wps、doc、docx、xls、xlsx、pdf 、ppt、pptx格式的文件，文件不超过5M；</span>
          </el-upload>
        </div>
        <!-- 文件上传表格 -->
        <div class="file-replace-box">
          <div><!-- 文件列表替换 -->
            <el-table :data="this.tempraoryList" border class="table" :header-cell-style="{'text-align':'center'}">
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column label="文件名称" prop="name" align="center" >
                <template slot-scope="scope">
                  <edit-box :row="scope.row" @saveKeywords="childSave" :showDelete="false"></edit-box>
                </template>
              </el-table-column>
              <el-table-column label='操作' width="150" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" @click="deleteRowFile(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="display: flex;justify-content: center;text-align: center;margin-top: 15px;">
          <el-button size="mini" type="primary" @click='cancleUpload()'>上一步</el-button>
          <el-button @click="beforeUploadFiles()" :disabled="this.fileList.length == 0" type="primary" style="width:70px;margin-left:50px;">{{$t('button.confirm')}}</el-button>
          <el-button @click="cancleUpload()" style="margin-left:50px;width:70px;">{{$t('button.cancel')}}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getLibraryList,checkFiles} from "@/api/policy/list";
import * as CodeMsg from "@/api/common/CodeChange"
import EditBox from '@/components/file/editBox'

export default {
  components:{
    EditBox
  },
  props:{
    librarySelectList:{//文件库选择的文件列表
      type: Array,
      required: true
    },
    uploadList:{//本地上传文件列表
      type:Array,
      required: true
    },
    listLength:{
      type: Number,
      required: false
    },
    filesTempList: {//草稿文件列表
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data(){
    return{
      currentPage:0,
      pageSize:20,
      total:0,
      libraryDialog: false,
      replaceDialog:true,
      uploadDialog:false,
      sourceFile:0,
      libraryList:[],
      fileKeywords:'',
      replacedId:[],
      selectedList:[],
      tempData:{},
      rowList: [],
      tempraoryList:[],
      tagsList: [],
      fileList:[],
      checkFileList: [],
      allList: [],
      param: new FormData(),
      acceptList: ".doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx,.wps",
      length:'',
      filelength:'',
      disabledIds: [],
    }
  },
  created(){
    if(this.librarySelectList){
      for(let i= 0;i<this.librarySelectList.length;i++){
        this.tagsList = JSON.parse(JSON.stringify(this.librarySelectList));
      }
    }
    this.length = this.uploadList.length + this.librarySelectList.length + this.filesTempList.length;
    this.allList = [...this.uploadList, ...this.librarySelectList, ...this.filesTempList]
  },
  methods:{
    closeFileDialog(){
      this.libraryDialog = false;
      this.$emit('closeDialog',false);
    },
    lastStep(){
      this.libraryDialog = false;
    },
    // getRowKey(row){
    //   return row.id;
    // },
    /* 文件库附件 */
    deleteRowFile(row){
      this.$confirm('确认删除'+row.name+'吗？','删除',{
        type: 'warning',
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel"
      }).then(()=>{
        this.tempraoryList.splice(this.tempraoryList.indexOf(row),1);
        for(let i= 0; i<this.fileList.length;i++){
          if(row.uid == this.fileList[i].uid){
            this.fileList.splice(this.fileList.indexOf(this.fileList[i]),1)
          }
        }
        let index = this.allList.findIndex(item => item.name === row.name)
        this.allList.splice(index, 1)
        let index1 = this.checkFileList.findIndex(item => item.name === row.name)
        this.checkFileList.splice(index1, 1)
      })
    },
    toReplace(){
      this.selectedList = JSON.parse(JSON.stringify(this.tagsList))
      this.$emit('selectedList',this.selectedList);
      this.$emit('closeDialog',false);
    },
    cellClass(row){
      if(row.columnIndex == 0){
        return 'disabledSelection'
      }
    },
    closeResourceDialog(){
      this.$emit('closeDialog',false);
    },
    radioBox(row){
      if(row.able){
        return true;
      }else{
        return false;
      }
    },
    unique(arr){
      let array = [];
      arr.forEach(id => {
        if(array.indexOf(id) === -1){
          array.push(id);
        }
      });
      return array;
    },
    rowKey(row) {
      return row.id
    },
    handleSelectionChange(row){
      //取消勾选判断
      if (this.rowList.length > row.length) {
        let missingItems = this.rowList.filter(item1 =>
          !row.some(item2 => item1.id === item2.id && item1.name === item2.name)
        );
        this.tagsList.splice(this.tagsList.findIndex(item => item.id === missingItems[0].id), 1)
      }
      //勾选判断
      row.forEach((item, index) => {
        if (!this.isIdInArray(item.id, this.tagsList)) {
          this.tagsList.push(item)
        }
      })
      this.disabledBox()
      this.rowList = JSON.parse(JSON.stringify(row))
    },
    disabledBox() {
      //禁用多选选框
      if (this.filesTempList.length + this.uploadList.length + this.tagsList.length >= 5) {
        this.libraryList.forEach(item => {
          if (!this.isIdInArray(item.id, this.tagsList)) {
            this.$set(item, 'able', false)
          }
        })
      } else {
        this.libraryList.forEach(item => {
          this.$set(item, 'able', true)
        })
      }
    },
    deleteRow(index) {
      let i = this.libraryList.findIndex(item => item.id === this.tagsList[index].id)
      if (i >= 0) {
        this.$refs.multipleTable.toggleRowSelection(this.libraryList[i], false);
      } else {
        this.disabledIds.push(this.tagsList[index].id)
        this.$refs.multipleTable.toggleRowSelection(this.tagsList[index], false);
        this.tagsList.splice(index, 1)
      }
      this.disabledBox()
    },
    replaceCurrentChange(val){
        this.currentPage = val;
        this.next();
    },
    next(){//文件库列表
      if(this.sourceFile == 0){
        this.libraryDialog = true;
        let para = {
          size:10,
          start:this.currentPage,
          keyword: this.fileKeywords.trim()
        }
        getLibraryList(para).then(res=>{
          if(res.data.code == CodeMsg.CODE_1000){
            this.libraryList = res.data.data.list;
            this.$nextTick(() => {
              let tagsList = []
              this.libraryList.forEach(item => {
                if (!this.isIdInArray(item.id, this.tagsList) && this.filesTempList.length + this.uploadList.length + this.tagsList.length >= 5) {
                  this.$set(item, 'able', false)
                } else {
                  this.$set(item, 'able', true)
                }
                if (this.isIdInArray(item.id, this.tagsList)) {
                  tagsList.push(item)
                }
              })
              tagsList.forEach(item => {
                this.$refs.multipleTable.toggleRowSelection(item, true);
              })
              if (this.disabledIds.length > 0) {
                this.disabledIds.forEach(item => {
                  let i = this.libraryList.findIndex(val => val.id == item)
                  if (i >= 0) {
                    this.$refs.multipleTable.toggleRowSelection(this.libraryList[i], false);
                  }
                })
              }
            })
            this.total = res.data.data.total;
          }
        }).catch(()=>{
          return false;
        })
      }else{
        this.uploadDialog = true;
      }
    },
    isIdInArray(objectId, objectArray) {
      for (let i = 0; i < objectArray.length; i++) {
        if (objectArray[i].id === objectId) {
          return true;
        }
      }
      return false;
    },
    beforeUploadFiles(){
      if(this.length + this.fileList.length > 5){
        this.$message({
          type: 'warning',
          message:'总文件个数不能超过5个！'
        });
      } else {
        this.uploadFiles()
      }
    },
    /* 本地上传附件 */
    uploadFiles() {
      if(typeof(this.listLength) == 'undefined'){
        this.fileList = this.fileList.slice(0, 5 - this.length)
        if(this.fileList.length <= 5){
          var list= {
            fileNames:[]
          }
          for(let i = 0;i<this.fileList.length; i++){
            list.fileNames.push(this.fileList[i].name);
          }
          checkFiles(list).then(res=>{
            if(res.data.code == CodeMsg.CODE_1000){
              this.uploadDialog = false;
              this.$emit('fileList',this.fileList);
              this.$emit('closeDialog',false);
            }else{
              this.$message({
                type:'warning',
                message:res.data.data
              })
            }
          })
        }else{
          this.$message({
            type: 'warning',
            message:`1本地上传文件不多于 5 个文件，本次选择了 ${this.fileList.length} 个文件，共选择了 ${this.listLength + this.fileList.length} 个文件`
          });
        }
      } else if(this.listLength + this.fileList.length <=10){
        var list= {
          fileNames:[]
        }
        for(let i = 0;i<this.fileList.length; i++){
          list.fileNames.push(this.fileList[i].name);
        }
        checkFiles(list).then(res=>{
          if(res.data.code == CodeMsg.CODE_1000){
            this.uploadDialog = false;
            this.$emit('fileList',this.fileList);
            this.$emit('closeDialog',false);
          }else{
            this.$message({
              type:'warning',
              message:res.data.data
            })
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message:`2本地上传文件不多于 5 个文件，本次选择了 ${this.fileList.length} 个文件，共选择了 ${this.listLength + this.fileList.length} 个文件`
        });
      }
     
    },
    cancleUpload(){
      this.fileList = [];
      this.tempraoryList= [];
      this.uploadDialog = false;
    },
    childSave(val){
      if(typeof val.uid !== 'undefined'){
        this.allList = [...this.allList, ...JSON.parse(JSON.stringify(this.fileList))]
        let uniqueArr = this.allList.reduce((acc, curr) => {
          if (!acc.find(item => item.name === curr.name)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        this.allList = JSON.parse(JSON.stringify(uniqueArr))
        var hasSameFileName = false;//修改的名称是否重复
        let name = val.name.split('.')
        name.pop()
        this.allList.forEach(item => {
          let name1 = item.name.split('.')
          name1.pop()
          if (name.join('') == name1.join('')) {
            hasSameFileName = true
          }
        })
        if(!hasSameFileName){
          for(let i =0; i<this.fileList.length;i++){
            if(val.uid == this.fileList[i].uid){
              this.tempData = val;
              this.tempraoryList.splice(this.tempraoryList.indexOf(this.tempraoryList[i]),1,this.tempData);
              let index = this.allList.findIndex(item => item.name === this.fileList[i].name)
              this.allList[index].name  = val.name
              this.checkFileList[i].name = val.name
              this.fileList[i].name = val.name;//修改上传的文件名
            }
          }
        } else {
          this.$message({
            type:'warning',
            message:'文件名'+val.name+'已存在'
          })
        }
      }
    },
    handleRemove(file, fileList) {
      let index = this.fileList.indexOf(file);
      this.fileList.splice(index, 1);
    },
    beforeAvatarUpload(file) {
      console.log(file);
      // const isLt2M = file.size / 1024 / 1024 < 5;
      // if (!isLt2M) {
      //   this.$message({
      //     message: "上传文件大小不能超过 5MB!",
      //     type: "warning",
      //     offset: 300
      //   });
      //   return false
      // }
      // return true;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, {
        cancelButtonClass: "btn-custom-cancel"
      });
    },
    handleExceed(files) {
      this.$nextTick(()=> {
        return this.$message.warning(
          `当前限制选择 5 个文件，本次选择了 ${
            files.length
          } 个文件，共选择了 ${this.length + this.fileList.length + files.length} 个文件`
        );
      })
    },
    OnChange(file, fileList) {
      if(this.length + fileList.length <= 5 && file.size / 1024 / 1024 < 5){
        let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name);
        let hasSameFileName = false
        this.allList = [...this.allList, ...JSON.parse(JSON.stringify(this.checkFileList))]
        let uniqueArr = this.allList.reduce((acc, curr) => {
          if (!acc.find(item => item.name === curr.name)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        this.allList = JSON.parse(JSON.stringify(uniqueArr))
        let name = file.name.split('.')
        name.pop()
        this.allList.forEach(item => {
          let name1 = item.name.split('.')
          name1.pop()
          if (name.join('') == name1.join('')) {
            hasSameFileName = true
          }
        })
        if (existFile || hasSameFileName) {
          this.$message.error(file.name + "已经存在!");
          fileList.pop();
        }
        this.fileList = fileList;
        this.checkFileList = JSON.parse(JSON.stringify(fileList))
        let names = [];
        for (let i = 0; i < this.fileList.length; i++) {
          names.push({ name: fileList[i].name });
        }
        this.fileName = this.unique(names);
        this.tempraoryList =[];//置空临时数组
        for(let i =0;i< this.fileList.length;i++){
          this.tempraoryList.push(//添加临时文件列表
            {
              name:this.fileList[i].name,
              options:null,
              uid:this.fileList[i].uid
            }
          );
        }
      }
    },
    unique(names) {
      const res = new Map();
      return names.filter(
        names => !res.has(names.name) && res.set(names.name, 1)
      );
    }
  },
  mounted(){

  }
}
</script>

<style scoped>
.table {
  margin-top: 10px;
}
.file-replace-box{
  line-height: 30px;
}
.new-file{
  display:flex;
}
/* 去除table表头的全选框 */
.el-table /deep/.disabledSelection .cell .el-checkbox__inner{ 
    display: none;
    position: relative;
}
.el-table /deep/.disabledSelection .cell:before{
    content: '';
    position: absolute;
}
.mr {
  margin-right: 8px;
  margin-top: 5px;
}
.mt {
  margin-top: 5px;
}
.warning{
  font-size: 12px;
  display: inline-block;
  width: 360px;
  text-align: left;
  vertical-align: middle;
  margin-left: 15px;
  margin-top: -3px;
  line-height: 18px;
}
</style>