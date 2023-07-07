<template>
<!-- 排查完成 -->
  <!-- 图片和视频上传+截取视频封面 -->
  <div class="video_upload">
    <el-upload
      ref="upload"
      :headers="headers"
      action="wtcrm/file/upload"
      list-type="picture-card"
      multiple
      accept=".jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
      :disabled="fileList.length > 5 ? true : false"
      :limit="6"
      :on-exceed="handleMulti"
      :before-upload="checkFile"
      :on-progress="uploadVideoProcess"
      :on-change="handleChange"
      :on-success="handleVideoSuccess"
      :file-list="fileList">
      <el-button
        slot="default"
        :disabled="fileList.length > 5 ? true : false"
        size="small"
        type="primary">点击上传</el-button>
      <div slot="file" slot-scope="{ file }">
        <div v-if="!videoFlag">
          <div v-if="file.response && file.response.data" class="file_contain">
            <div v-if="
                file.response.data.split('.')[
                  file.response.data.split('.').length - 1
                ] == 'mp4' ||
                file.response.data.split('.')[
                  file.response.data.split('.').length - 1
                ] == 'avi' ||
                file.response.data.split('.')[
                  file.response.data.split('.').length - 1
                ] == 'mov'">
              <video
                v-if="file.response.faceUrl && file.response.faceUrl !== ''"
                :src="imgUrl + file.response.data"
                :poster="imgUrl + file.response.faceUrl"
                controls="controls"
                class="video-avatar"></video>
              <video
                v-else
                :src="imgUrl + file.response.data"
                controls="controls"
                class="video-avatar"
                id="upvideo"></video>
            </div>
            <img v-if="file.response.data.split('.')[
                  file.response.data.split('.').length - 1
                ] == 'jpeg' ||
                file.response.data.split('.')[
                  file.response.data.split('.').length - 1
                ] == 'png' ||
                file.response.data.split('.')[
                  file.response.data.split('.').length - 1
                ] == 'jpg' ||
                file.response.data.split('.')[
                  file.response.data.split('.').length - 1
                ] == 'gif'"
              class="el-upload-list__item-thumbnail"
              style="height: 148px"
              :src="imgUrl + file.response.data"
              alt=""/>
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-delete"
                @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
              <span v-if="
                  file.response.data.split('.')[
                    file.response.data.split('.').length - 1
                  ] == 'mp4' ||
                  file.response.data.split('.')[
                    file.response.data.split('.').length - 1
                  ] == 'avi' ||
                  file.response.data.split('.')[
                    file.response.data.split('.').length - 1
                  ] == 'mov'"
                class="el-upload-list__item-delete"
                @click="upFaceimg(file)">
                <div class="up-flex-sty">
                  <span>上传封面</span>
                </div>
              </span>
            </span>
            <span class="card_img_edit" @click="editImg(file)"> 替换 </span>
            <span class="card_img_sty">
              <el-radio
                v-if="file.response && file.response.data"
                @change="changeStatus"
                v-model="checkd"
                :label="file.response.data">设为封面</el-radio>
            </span>
          </div>
        </div>
        <div v-else>
          <el-progress
            type="circle"
            :percentage="videoUploadPercent"></el-progress>
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import store from "@/store";
import * as CodeMsg from "@/api/common/CodeChange"
import { uploadMedia } from "@/api/project/project";
export default {
  data() {
    return {
      cutUrl: "",
      fileList: [],
      checkd: "",
      videoUploadPercent: 0,
      imgUrl:
        process.env.NODE_ENV == "production"
          ? "//static.wotao.com/"
          : "//static-tst.wotao.com/",
      videoFlag: false,
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
    };
  },
  methods: {
    upFaceimg(val) {
      let that = this;
      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.onchange = function () {
        let file = this.files[0]; //选取第一个文件
        let formData = new FormData();
        formData.append("file", file);
        uploadMedia(formData).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            that.fileList.forEach((item) => {
              if (item.response.data == val.response.data) {
                item.response.faceUrl = res.data.data;
                that.$forceUpdate();
              }
            });
          }
        });
      };
      input.click();
    },
    editImg(val) {
      let that = this;
      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "video/*,image/*");
      input.onchange = function () {
        let file = this.files[0]; //选取第一个文件
        let formData = new FormData();
        formData.append("file", file);
        uploadMedia(formData).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            that.fileList.forEach((item) => {
              if (
                item.response.data == val.response.data &&
                that.checkd !== val.response.data
              ) {
                item.response.data = res.data.data;
                that.$forceUpdate();
              } else if (
                item.response.data == val.response.data &&
                that.checkd == val.response.data
              ) {
                item.response.data = res.data.data;
                that.checkd = res.data.data;
                that.$forceUpdate();
              }
            });
          }
        });
      };
      input.click();
    },
    changeStatus() {},
    checkFile(file) {
      if (file.type.indexOf("image") != -1) {
        if (file.size / 1024 > 4 * 1024) {
          this.$message({
            type: "warning",
            message:
              "上传的图片不得超过4M，视频不得超过100M！如多选，只上传符合条件的！",
            offset: 300,
          });
          return false;
        }
      } else if (file.type.indexOf("video") != -1) {
        if (file.size / 1024 > 100 * 1024) {
          this.$message({
            type: "warning",
            message:
              "上传的图片不得超过4M，视频不得超过100M！如多选，只上传符合条件的！",
            offset: 300,
          });
          return false;
        }
      }
    },
    uploadVideoProcess(event, file, fileList) {
      if (file.size / 1024 > 10 * 1024) {
        this.videoFlag = true;
        this.videoUploadPercent = file.percentage.toFixed(0);
      }
    },
    handleVideoSuccess(res, file, fileList) {
      console.log(file,"file")
      console.log(fileList,"fileList")
      this.fileList = fileList;
      this.checkd = this.fileList[0].response.data;
      this.videoFlag = false;
      console.log(file.raw.type.indexOf("video"))
      if (file.raw.type.indexOf("video") != -1) {
        this.getVideoCover(this.imgUrl+file.response.data,file)
      }
    },
    getVideoCover(url,cFile) {
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
        _this.upImgFile(file,cFile)
      }); //转换为base64
     })
    },
    // 上传图片
    upImgFile(file,cFile){
      this.cutUrl = ""
      let formData = new FormData();
      formData.append("file", file);
      uploadMedia(formData).then(res=>{
        console.log(res,"res")
         if(res.data.code == CodeMsg.CODE_0){
           this.cutUrl = res.data.data
           console.log(this.cutUrl,"cutUrl")
           this.fileList.forEach((item)=>{
          if(item.response.data == cFile.response.data){
            item.response.faceUrl = this.cutUrl
          }
        })
        console.log(this.fileList)
         }
      })
    },
    handleMulti() {
      this.$message({
        type: "warning",
        message: "上传的图片总数不能大于6张！",
        offset: 300,
      });
    },
    handleChange(file, fileList) {},
    handleRemove(file) {
      this.fileList.forEach((item, index) => {
        if (item.response.data == file.response.data) {
          this.fileList.splice(index, 1);
          if ((this.checkd = item.response.data && this.fileList.length > 0)) {
            this.checkd = this.fileList[0].response.data;
          } else {
            this.checkd = "";
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.video-avatar {
  width: 148px;
  height: 148px;
  border: 1px solid #dcdfe6;
}
.card_img_edit {
  position: absolute;
  bottom: -30px;
  left: 0;
  z-index: 1000;
  cursor: pointer;
}
.card_img_edit:hover {
  color: rgb(75, 154, 228);
}
.card_img_sty {
  position: absolute;
  bottom: -30px;
  left: 60px;
  z-index: 1000;
  cursor: pointer;
}
.card_img_sty:hover {
  color: rgb(75, 154, 228);
}
</style>
<style>
.video_upload .el-upload-list--picture-card .el-upload-list__item {
  overflow: visible;
  border: none;
  margin-bottom: 40px;
}
.video_upload .el-upload-list--picture-card .el-upload-list__item-thumbnail {
  border: 1px solid #dcdfe6;
}
.video_upload .el-upload-list--picture-card .el-upload-list__item-actions {
  height: 100% !important;
}
</style>