<template>
  <div>
    <el-upload
      class="upload-demo"
      action
      ref="upload"
      :file-list="fileList"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :accept= "acceptFileType"
      :multiple="multipleStatus"
      :limit="uploadFilesNumber"
      :before-upload="beforeAvatarUpload"
      :on-exceed="handleExceed"
      :on-change="OnChange"
      :auto-upload="false"
    >
    <el-button type="primary" size="mini" v-if="this.fileList.length != uploadFilesNumber" >点击上传</el-button>
    <span class="warning-txt" v-if="this.uploadFilesNumber > 1">最多可添加{{this.uploadFilesNumber}}个附件</span>
    <div slot="tip" class="el-upload__tip"  v-if="this.fileList.length != uploadFilesNumber">仅限pdf、jpg及png等图片格式的文件</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  props:{
    followFileList:{//接受回显的
      type: Array,
      required: false
    },
    limit:{ //文件上传数量限制
      type: Number,
      required: false
    },
    acceptType: {//允许上传文件类型
      type: String,
      required: false
    },
    multipleFile: {//是否允许多选
      type: Boolean,
      required: true
    },
    wordLimit: {//字数限制
      type: Number,
      required: false
    },
    contractFile:{//合同回显文件与status配合使用、待后期优化
      type: Array,
      required: false
    },
    status:{//合同状态
      type: Boolean,
      required: false
    }
  },
  data(){
    return {
      fileList: [],
      uploadFilesNumber: 5,
      acceptFileType: '*.*',
      multipleStatus: true,
      fileNameLimmit: 32
    }
  },
  created(){
    this.multipleStatus = this.multipleFile;
    if(this.wordLimit){
      this.fileNameLimmit = this.wordLimit;
    }
    if(this.acceptType){
      this.acceptFileType = this.acceptType;
    }
    if(this.limit){
      this.uploadFilesNumber = this.limit
    }
    if(this.followFileList){
      this.fileList = this.followFileList;
    }
    if(this.contractFile && this.status){
      this.fileList = this.contractFile;
    }
  },
  methods:{
    handlePreview(file) {

    },
    handleRemove(file, fileList) {
      let index = this.fileList.indexOf(file);
      this.fileList.splice(index, 1);
      this.$emit('fileList',this.fileList);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 20MB!",
          type: "warning",
          offset: 300
        });
      }
      return isLt2M;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, {
        cancelButtonClass: "btn-custom-cancel"
      });
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择${this.uploadFilesNumber}个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    OnChange(file, fileList) {
      let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name);
      if (existFile) {
        this.$message.error(file.name + "已经存在!");
        fileList.pop();
      }
      this.fileList = fileList;
      let names = [];
      for (let i = 0; i < this.fileList.length; i++) {
        names.push({ name: fileList[i].name });
        if(this.fileList[i].size){
          var isLt2M = this.fileList[i].size / 1024 / 1024 < 20
          if (!isLt2M) {
            this.$message({
              message: "上传文件大小不能超过 20MB!",
              type: "warning",
              offset: 300
            });
            this.fileList.splice(this.fileList.indexOf(this.fileList[i]),1);
          }
        }
        if(this.acceptType && this.acceptFileType.indexOf(this.fileList[i].name.substring(this.fileList[i].name.lastIndexOf("."),this.fileList[i].name.length).toLowerCase())==-1){
          this.$message({
            message: "请上传"+this.acceptFileType+"类型文件!",
            type: "warning",
            offset: 300
          });
          this.fileList.splice(this.fileList.indexOf(this.fileList[i]),1);
        }
        if(this.fileList.length>0 && this.fileList[i].name.substring(0,this.fileList[i].name.lastIndexOf(".")).length> this.fileNameLimmit){
          this.$message({
            message: '文件名不能超过'+this.fileNameLimmit+'字',
            type: "warning",
            offset: 300
          });
          this.fileList.splice(this.fileList.indexOf(this.fileList[i]),1);
        }
      }
      this.fileName = this.unique(names);

      this.$emit('fileList',this.fileList);//上传的文件数组返回给父组件
    },
    unique(names) {
      const res = new Map();
      return names.filter(
        names => !res.has(names.name) && res.set(names.name, 1)
      );
    }
  }
}
</script>

<style scoped>
.warning-txt{
  color: red;
  margin-left: 5px; 
}
.upload-demo >>> .el-upload-list__item:first-child {
  margin: -18px 0 0 10px ;
}
.upload-demo >>> .el-icon-document{
    display: none;
}
.upload-demo >>> .el-icon-close{
    display: inline-block;
    opacity: 1;
}
.upload-demo >>> .el-upload-list__item-name{
  color: #0099ff;
}
.upload-demo >>>.el-icon-close:before{
    content: "删除";
    color: red;
}
</style>