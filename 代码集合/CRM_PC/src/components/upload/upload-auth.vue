<template>
  <div class="container">
    <div class="upload">
      <div class="file-contain">
        <div class="file-video" v-if="authProgress == 100">
          <div id="player-con"></div>
        </div>
        <el-button class="del-btn" v-if="authProgress == 100" @click="deleteVideo()" type="text">删除</el-button>
      </div>
      <input
        v-if="authProgress == 0"
        type="file"
        accept="video/*"
        class="file-upload"
        @change="fileChange($event)"/>
      <div class="upload-type" v-if="authProgress > 0 && operateType == 0">
        <span class="progress">上传进度: <i id="auth-progress">{{ authProgress }}</i>%</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange"
import { uploadMedia } from "@/api/project/project";
import { getVoucher, refreshVoucher } from "@/api/video/upload";
import { delVideoFile } from "@/api/project/wtClass";
export default {
  data() {
    return {
      cutUrl:"",
      imgUrl: process.env.VUE_APP_IMAGE_BASEURL,
      operateType: 0, // 0-创建 1-编辑回显
      player: "",
      cVideoTime: "",
      url: "",
      videoId: "",
      timeout: "",
      partSize: "",
      parallel: "",
      retryCount: "",
      retryDuration: "",
      region: "cn-shanghai",
      userId: "1396763327716234",
      file: null,
      authProgress: 0,
      uploader: null,
    };
  },
  methods: {
    deleteVideo(){
      this.$confirm('确认删除?',{
        type:'warning',
        cancelButtonClass: 'btn-custom-cancel',
      }).then(()=>{
        this.delVideo()
      })
    },
    // 删除video
    delVideo(){
      delVideoFile(this.videoId).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
           this.videoId = ''
           this.url = ''
           this.authProgress = 0
           this.operateType = 0
           this.cVideoTime = ''
           this.$message({
             type:"success",
             message:"删除成功！",
             offset: 300
           })
        }
      })
    },
    getPlayInfo(status) {
      setTimeout(() => {
        this.player = new Aliplayer({
          id: "player-con",
          source: this.url,
          width: "100%",
          height: "100%",
          cover: this.cutUrl==''?'':this.imgUrl + this.cutUrl,
          autoplay: status,
          preload: false,
          isLive: false,
        });
      }, 100);
    },
    // 时间格式转化 s(秒)-> 00:00:00
    formatSeconds(value) {
      var theTime = parseInt(value); // 秒
      var theTime1 = 0; // 分
      var theTime2 = 0; // 小时
      if (theTime >= 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 >= 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
        }
      }
      var result = `${
        parseInt(theTime2) < 10 ? "0" + parseInt(theTime2) : parseInt(theTime2)
      }:${
        parseInt(theTime1) < 10 ? "0" + parseInt(theTime1) : parseInt(theTime1)
      }:${
        parseInt(theTime) < 10 ? "0" + parseInt(theTime) : parseInt(theTime)
      }`;
      this.cVideoTime = result;
    },
    // 获取视频时间
    getVideoTime(url) {
      let that = this;
      var audio = new Audio(url);
      audio.addEventListener("loadedmetadata", function (e) {
        let duration = audio.duration;
        that.formatSeconds(duration);
      });
    },
    getVideoCover(url) {
     let _this = this
     let video = document.createElement("video");
     video.setAttribute('crossOrigin', 'anonymous');//处理跨域
     video.setAttribute('src', url);
     video.setAttribute('width', 400);
     video.setAttribute('height', 240);
     video.muted = true;
     video.autoplay = true;
     video.preload = true;
     video.currentTime = 0.1; // 这里是截取第几帧,因为我的第一帧是黑色的,所以截取了第200帧
     video.addEventListener('loadeddata', function () {
      let canvas = document.createElement("canvas")
      let width = video.width //canvas的尺寸和图片一样
      let height = video.height;
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(video, 0, 0, width, height); //绘制canvas
      canvas.toBlob((blob)=>{
        let file = new window.File([blob], "封面", {type: "image/png"})
        _this.upImgFile(file)
      }); //转换为base64
     })
    },
    // 上传图片
    upImgFile(file){
      this.cutUrl = ""
      let formData = new FormData();
      formData.append("file", file);
      uploadMedia(formData).then(res=>{
        console.log(res,"res")
         if(res.data.code == CodeMsg.CODE_0){
           this.cutUrl = res.data.data
           console.log(this.cutUrl,"cutUrl")
           this.getPlayInfo(false);
         }
      })
    },
    fileChange(e) {
      this.file = e.target.files[0];
      if (!this.file) {
        alert("请先选择需要上传的文件!");
        return;
      }
      // 控制视频大小小于500M
      if (this.file.size / 1024 > 500 * 1024) {
        this.$message({
          type: "warning",
          message: "上传的视频不得超过500M！",
          offset: 300,
        });
        return false;
      } else {
        var userData = '{"Vod":{}}';
        if (this.uploader) {
          this.uploader.stopUpload();
          this.authProgress = 0;
        }
        this.uploader = this.createUploader();
        this.uploader.addFile(this.file, null, null, null, userData);
      }
    },
    authUpload() {
      // 然后调用 startUpload 方法, 开始上传
      if (this.uploader !== null) {
        this.uploader.startUpload();
      }
    },
    createUploader(type) {
      let self = this;
      let uploader = new AliyunUpload.Vod({
        timeout: self.timeout || 60000,
        partSize: self.partSize || 1048576,
        parallel: self.parallel || 5,
        retryCount: self.retryCount || 3,
        retryDuration: self.retryDuration || 2,
        region: self.region,
        userId: self.userId,
        // 添加文件成功-自动上传
        addFileSuccess: function (uploadInfo) {
          self.authUpload();
        },
        // 开始上传
        onUploadstarted: function (uploadInfo) {
          // 如果videoId没值，直接上传
          if (!uploadInfo.videoId) {
            let data = new FormData();
            data.append("title", uploadInfo.file.name);
            data.append("fileName", uploadInfo.file.name);
            getVoucher(data).then((res) => {
              let uploadAuth = res.data.uploadAuth;
              let uploadAddress = res.data.uploadAddress;
              let videoId = res.data.videoId;
              uploader.setUploadAuthAndAddress(
                uploadInfo,
                uploadAuth,
                uploadAddress,
                videoId
              );
            });
          } else {
            // 如果videoId有值，根据videoId刷新上传凭证
            let data = new FormData();
            data.append("videoId", uploadInfo.videoId);
            refreshVoucher(data).then((res) => {
              let uploadAuth = res.data.uploadAuth;
              let uploadAddress = res.data.uploadAddress;
              let videoId = res.data.videoId;
              uploader.setUploadAuthAndAddress(
                uploadInfo,
                uploadAuth,
                uploadAddress,
                videoId
              );
            });
          }
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
          self.videoId = uploadInfo.videoId;
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          self.$message({
            type: "warning",
            message: "文件上传失败！",
            offset: 300,
          });
        },
        // 取消文件上传
        onUploadCanceled: function (uploadInfo, code, message) {
          self.$message({
            type: "warning",
            message: "文件取消上传成功！",
            offset: 300,
          });
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function (uploadInfo, totalSize, progress) {
          console.log(
            "onUploadProgress:file:" +
              uploadInfo.file.name +
              ", fileSize:" +
              totalSize +
              ", percent:" +
              Math.ceil(progress * 100) +
              "%"
          );
          let progressPercent = Math.ceil(progress * 100);
          self.authProgress = progressPercent;
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
          self.$message({
            type: "warning",
            message: "上传超时，请重新上传！",
            offset: 300,
          });
        },
        // 全部文件上传结束
        onUploadEnd: function (uploadInfo) {
          let url = URL.createObjectURL(self.file);
          self.url = url;
          self.getVideoTime(self.url);
          self.getVideoCover(self.url)
          // self.getPlayInfo(false);
        },
      });
      return uploader;
    },
  },
};
</script>

<style scoped>
.file-contain {
  display: flex;
  align-items: center;
}
.file-video {
  width: 200px;
  height: 100px;
}
.del-btn{
  margin-left: 20px;
}
</style>

<style>
.prism-player .prism-big-play-btn {
  position: absolute;
  left: 50% !important;
  top: 50% !important;
  transform: translateY(-50%) translateX(-50%) !important;
  display: block;
}
</style>