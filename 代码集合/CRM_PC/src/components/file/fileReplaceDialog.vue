<template>
  <div>
    <!-- 上传弹框 -->
    <el-dialog :visible.sync="uploadDialog" width="45%" title="替换文件" :close-on-click-modal="false" :before-close="closeResourceDialog" @close="closeResourceDialog">
      <div class="upload">
        <div style="display:flex;align-items:center;">
          <span>选择文件：</span>
          <el-upload
            class="upload-demo"
            action
            ref="upload"
            :file-list="fileList"
            :limit="1"
            :accept="acceptList"
            :before-upload="beforeAvatarUpload"
            :on-exceed="handleExceed"
            :on-change="OnChange"
            :show-file-list='false'
            :disabled="JSON.stringify(fileObj) != '{}'"
          >
            <el-button size="small" type="primary" :disabled="JSON.stringify(fileObj) != '{}'">{{$t('label.addFiles')}}</el-button>
          </el-upload>
        </div>
        <div class="file-replace-box">
          <div>
            <p v-if="JSON.stringify(cellData) != '{}'">旧文章标题：{{cellData.fileName}}</p>
          </div>
          <p class="new-file">
            <span class="new-name">新文件名称：</span>
            <edit-box :row="fileObj" @saveKeywords="childSave" @deleteRow=deleteRow  v-if="JSON.stringify(fileObj) != '{}'"></edit-box>
          </p>
        </div>
        <div style="margin-left:180px;margin-top:40px;">
          <el-button @click="handleReplace()" type="primary" :disabled="JSON.stringify(fileObj) == '{}'" style="width:70px;">{{$t('button.confirm')}}</el-button>
          <el-button @click="closeResourceDialog()" style="margin-left:50px;width:70px;">{{$t('button.cancel')}}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OSSUploader from '@/util/ossUpload';
import EditBox from '@/components/file/editBox'

export default {
  components:{
    EditBox
  },
  props:{
    uploadDialog:{
      type:Boolean,
      required: true
    },
    cellData:{
      type: Object,
      required: true
    },
    source:{
      type:Boolean,
      required: true
    },
    isspecial:{
      type: String,
      required:false
    },
    whichUrl:{
      type:Number  
    },
    isMy: {
      type: Boolean
    }
      
  },
  data(){
    return{
      currentPage:0,
      pageSize:20,
      total:0,
      labelPosition: "right",
      acceptList: ".wps,.doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx",
      ossUrl: process.env.VUE_APP_OSS_URL,
      fileObj: {},
      sourceFile:1,
      libraryList:[],
      fileKeywords:'',
      replacedId:[],
      selectedId:'',
      tempData:{},
      tempraoryList:[],
      fileList:[],
      param: new FormData(),
      length:'',
      fileLength:'',
    }
  },
  // created(){
  //   if(this.cellData){
  //     for(let i= 0;i<this.cellData.length;i++){
  //       this.replacedId.push(this.cellData[i].id);
  //     }
  //   }
  //   this.length = this.cellData.length;
  // },
  methods:{
    closeResourceDialog(){
      this.$emit('closeDialog',false);
    },
    childSave(val){
      if (this.fileObj.name != val.name) {
        this.$message({
          type:'success',
          message:'修改成功！'
        })
      }
      let raw = this.fileObj.raw
      this.fileObj = val;
      this.fileObj.raw = raw
    },
    deleteRow(row){
      this.$alert('确认删除'+row.name+'吗？','删除',{
        type:'warning',
      }).then(()=>{
        this.fileObj = {}
        this.fileList = [];
      })
    },
    handleRemove(file, fileList) {
      let index = this.fileList.indexOf(file);
      this.fileList.splice(index, 1);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 5MB!",
          type: "warning",
          offset: 300
        });
      }
      return isLt2M;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    OnChange(file, fileList) {
      if (file.size/1024/1024 <= 5) {
        this.fileObj = file
        this.fileList = fileList
      }
    },

    handleReplace() {
      this.$emit('handleReplace', this.fileObj)
      this.closeResourceDialog()
    },
  },
}
</script>

<style scoped>
.dialogBtn {
  margin-top: 40px;
  text-align: center;
}
.confirmBtn {
  margin-top: 40px;
  text-align: center;
}
.table {
  margin-top: 10px;
}

/* 去除table表头的全选框 */
.el-table /deep/.disabledSelection .cell .el-checkbox__inner{ 
    display: none;
    position: relative;
}
.el-table /deep/.disabledSelection .cell:before{
    content: '选择';
    position: absolute;
}
.file-replace-box{
  line-height: 30px;
}
.new-file{
  display: flex;
  align-items: center;
}
</style>