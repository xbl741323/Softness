<!-- oss普通上传+分片上传demo item -->
<template>
  <div class="contain-item">
    <div class="upload-item">
      <span class="over-sty">{{ file.name }}</span>
    </div>
    <div class="upload-item">
      <el-button type="text" v-if="(uploadStatus == 0 || uploadStatus == 1 || (uploadStatus == 3&&uploadCount == 0))&&(uploadCount == 0)" @click="confirmTip(file)" class="right-sty">取消上传</el-button>
      <el-button type="text" v-if="uploadStatus == 3&&uploadCount == 0" @click="resetUpload()" v-preventReClick class="right-sty">继续上传</el-button>
      <el-progress
        v-if="progress > 0 && progress < 100 && uploadStatus != 3&& uploadCount == 0"
        :show-text="false"
        class="progress-sty"
        type="circle"
        :percentage="progress"
        :width="20"
        :stroke-width="2">
      </el-progress>
      <span v-if="uploadStatus == 2 || uploadCount >=1" class="right-sty">上传成功</span>
      <i v-if="uploadStatus == 2 || uploadCount >=1" class="el-icon-success success-sty"></i>
      <span v-if="uploadStatus == 3&&uploadCount == 0" class="right-sty">上传异常</span>
      <i v-if="uploadStatus == 3&&uploadCount == 0" class="el-icon-warning warning-sty"></i>
    </div>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange";
import { OSS } from "./ossUtil";
import { getFileRepositorySts } from "@/api/oss/upload";
export default {
  props: {
    file:{
      require: true
    },
    partNum:{ // 分割分片大小数-上传小文件传2-控制进度条完整显示
      type: Number,
      require: false,
      default: 1
    }
  },
  data() {
    return {
      pauseStatus: false, // 暂停状态
      credentials: null, // STS凭证
      ossClient: null, // oss客户端实例
      ossUrl: "/user-file/", // 服务器存储地址
      bucket: "wotao-com", // bucket名称
      region: "oss-cn-hangzhou", // oss服务区域名称
      partSize: 2 * 1024 * 1024, // 每个分片大小(byte) 2M
      parallel: 999, // 同时上传的分片数
      checkpoints: {}, // 所有分片上传文件的检查点
      progress: 0, // 进度条
      uploadStatus: 0, // 上传状态 0-待上传 1-上传中 2-上传完成 3-上传异常
      uploadCount: 0, // 已上传数量-用于控制网络问题引起的重复提交
      headers: {
        "Content-Disposition": "inline",
      }
    };
  },
  created(){
    console.log('组件创建了！',this.file)
    this.startUpload(this.file);
  },
  methods: {
    // 重新上传
    resetUpload(){
      this.pauseStatus = false
      this.startUpload(this.file);
    },
    confirmTip(file) {
      this.pauseStatus = true
      this.stop();
      this.$confirm(
        "确定取消上传？已经上传的部分将保留在文件柜中。",
        {
          type: "warning",
          cancelButtonClass: "btn-custom-cancel",
        }
      ).then(() => {
        this.deleteFile(file)
      }).catch(()=>{
        if((this.uploadStatus == 0 || this.uploadStatus == 1)&&(this.uploadCount == 0)){
          this.pauseStatus = false
          this.resume()
         }
      })
    },
    // 删除当前文件
    deleteFile(file) {
      this.stop();
      this.$emit("deleteFile", file);
    },

    // 开启上传
    startUpload(file) {
      this.upload(file);
    },

    // 1、获取 STS 凭证，创建 OSS Client
    getCredential() {
      return getFileRepositorySts();
    },

    // 2、创建OSS Client
    initOSSClient() {
      const { accessKeyId, accessKeySecret, securityToken } = this.credentials;
      this.ossClient = new OSS({
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        stsToken: securityToken,
        bucket: this.bucket,
        region: this.region,
        timeout: 60 * 60 * 1000
      });
    },

    // 3、点击上传按钮事件
    async upload(file) {
      await this.getCredential().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.credentials = res.data.data.body.credentials;
        }
      });
      if(!this.pauseStatus){
        this.multipartUpload(file);
      }
    },

    // 4、分片上传
    multipartUpload(file) {
      if (!this.ossClient) {
        this.initOSSClient();
      }
      const fileName = this.ossUrl + file.name;
      this.ossClient.multipartUpload(fileName, file.raw?file.raw:file, {
          parallel: this.parallel,
          partSize: this.partSize/this.partNum,
          progress: (progress, checkpoint) => {
            this.onMultipartUploadProgress(progress, checkpoint)
          },
          headers: this.headers
        }).then((res) => {
          if(this.uploadCount==0){
              this.uploadCount++
              this.$emit("getReturnInfo", res, this.file);
           }
        }).catch((err) => {
          console.log("multipart upload failed === ", err);
          if(!(err&&(err.status == 0))&&(this.uploadStatus!=2)&&(this.uploadCount<=1)){
            this.uploadStatus = 3
          }
        });
    },

    // 5、判断STS Token是否将要过期，过期则重新获取
    async checkToken() {
      const { expiration } = this.credentials;
      const timegap = 1;
      let status = expiration && this.$moment(expiration).subtract(timegap, "minutes").isBefore(this.$moment());
      if (status) {
        console.log(`STS token will expire in ${timegap} minutes，uploading will pause and resume after getting new STS token`);
        this.stop();
        await this.getCredential().then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.credentials = res.data.data.body.credentials;
          }
        });
        await resumeMultipartUpload();
      }
    },

    // 6、断点续传
    async resumeMultipartUpload() {
      Object.values(this.checkpoints).forEach((checkpoint) => {
        const { uploadId, file } = checkpoint;
        this.ossClient.multipartUpload(uploadId, file.raw, {
            parallel: this.parallel,
            partSize: this.partSize/this.partNum,
            progress: (progress, checkpoint) => {
              this.onMultipartUploadProgress(progress, checkpoint)
            },
            headers: this.headers,
            checkpoint,
          }).then((res) => {
            if(this.uploadCount==0){
              this.uploadCount++
              this.$emit("getReturnInfo", res, this.file);
           }
          }).catch((err) => {
            console.log("Resume multipart upload failed === ", err);
            if(!(err&&(err.status == 0))&&(this.uploadStatus!=2)&&(this.uploadCount<=1)){
              this.uploadStatus = 3
            }
          });
      });
    },

    // 7、分片上传进度改变回调
    onMultipartUploadProgress(progress, checkpoint){
      if((this.uploadCount == 0)&&(this.uploadStatus!=2)){
        console.log(progress, "输出上传进度");
        if(checkpoint&&checkpoint.uploadId){
          this.checkpoints[checkpoint.uploadId] = checkpoint;
        }
        this.checkToken();
        this.progress = progress * 100;
        this.uploadStatus = progress == 0 ? 0 : progress == 1 ? 2 : 1;
        this.$emit("getUploadStatus", this.uploadStatus, this.uploadCount, this.file);
      }
    },

    // 8、暂停上传
    stop() {
      if (this.ossClient){
        this.ossClient.cancel();
      }
    },

    // 9、续传
    resume() {
      if (this.ossClient){
        this.resumeMultipartUpload();
      }else{
        this.startUpload(this.file);
      }
    }
  },
};
</script>

<style scoped>
.contain-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.upload-item:nth-of-type(1) {
  flex: 1.4;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload-item:nth-of-type(2) {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #333333;
}
.progress-sty {
  display: inline !important;
  width: 50px !important;
  position: inherit !important;
}
.success-sty {
  color: #67c23a;
  font-size: 16px;
}
.warning-sty{
  color: #E6A23C;
  font-size: 16px;
}
.over-sty {
  width: 320px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.right-sty{
  margin-right: 10px;
  font-size: 14px;
  padding: 0 0;
}
</style>
