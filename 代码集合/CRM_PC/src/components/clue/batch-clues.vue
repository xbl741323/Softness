<template>
  <div class="batch">
    <div v-if="show">
      <h4>注意：</h4>
      <div>
        <article>1.请先下载按钮右侧的“批量创建线索模板”，然后使用模板进行数据上传，否则数据会上传失败；</article>
        <article>2.部门内客户数据查重：单位客户的单位名称及手机号不可重复，个人用户的手机号不可重复，否则数据会上传失败；</article>
        <article>3.分配业务员非必填项，如果填写了业务员且该业务员的线索客户中已有相同数据，则会上传失败。</article>
      </div>
      <div class="fileupload">
        <h4 :class="[this.file.length>0 ? 'hasfile' : 'uploadfile']">上传文件：</h4>
        <file-upload class="uploadbtn" :limit=1 :acceptType="'.xlsx'" :multipleFile=false @fileList="getFileList" />
      </div>
      <div class="batch-clue">
        <el-button type="primary" @click="openFullScreen" :disabled="file.length == 0" v-preventReClick>确认</el-button>
        <el-button type="warning" @click="cancle()">取消</el-button>
      </div>
    </div>
    <div class="fialure-info" v-else>
      <p>{{failuresNumber}}条数据创建失败，请下载报错文件查看具体原因</p>
      <p class="failure-file" @click="download()">批量创建线索模板(报错文件).xlsx</p>
      <div class="batch-clue">
        <el-button type="primary" @click="download()">下载报错文件</el-button>
        <el-button type="warning" @click="cancle()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { batchInput } from '@/api/clue/clue'
import * as CodeMsg from "@/api/common/CodeChange"
import fileUpload from '@/components/file/file-upload'
export default {
  components:{
    fileUpload
  },
  data(){
    return{
      fullscreenLoading: false,
      file: [],
      failureDialog: false,
      failuresNumber: 0,
      show: true,
      filePathUrl:process.env.NODE_ENV == "production"?"//static.wotao.com/":"//static-tst.wotao.com/",
      filePath:''
    }
  },
  methods:{
    download(){
      let a = document.createElement("a");
      a.href = this.filePathUrl+this.filePath;
      a.click();
    },
    getFileList(val){
      this.file = val;
    },
    cancle(){
      this.$emit('closeBatchDialog',false);
      this.show = true;
    },
    openFullScreen() {
      let param = new FormData();
      param.append('file',this.file[0].raw,this.file[0].name);
      const loading = this.$loading({
        lock: true,
        text: 'Loading文件上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      batchInput(param).then(res=>{
        this.show = false;
        loading.close();
        if(res.data.code == CodeMsg.CODE_1){
          this.failuresNumber = res.data.msg;
          this.failureDialog = true;
          this.filePath = res.data.data;
          this.$emit('failure','失败信息提示');
        }else{
          this.$message({
            type:'success',
            message:'批量创建线索成功！'
          });
          this.$emit('closeBatchDialog',false);
        }
      })
    }
  }
}
</script>

<style scoped>
.batch-clue{
  text-align: center;
}
.fileupload{
  display: flex;
}
.uploadbtn{
  margin-top: 15px;
}
.hasfile{
  margin-top: 42px;
}
.fialure-info{
  text-align: center;
}
.failure-file{
  cursor: pointer;
  color: #36A6FE;
}
</style>