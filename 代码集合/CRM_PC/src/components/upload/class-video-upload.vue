<template>
  <!-- 卧涛课堂视频专属上传 -->
  <div class="video_upload">
    <el-upload
      ref="upload"
      :auto-upload="true"
      :headers="headers"
      action="wtcrm/file/upload"
      list-type="picture-card"
      accept=".mp4,.avi,.mov"
      :disabled="fileList.length > 0 ? true : false"
      :limit="1"
      :before-upload="checkFile"
      :on-change="handleChange"
      :file-list="fileList">
      <el-button slot="default" :disabled="fileList.length > 0 ? true : false" size="small" ref="upbtn" type="primary">点击上传</el-button>
      <div slot="file" slot-scope="{ file }">
        <div class="file_contain">
          <video :src="file.url" controls="controls" class="video-avatar" id="cVideo"></video>
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-delete" @click="handleRemove(file)">
              <i class="el-icon-delete"></i>
            </span>
            <span class="el-upload-list__item-delete" @click="editImg(file)">
              <div class="up-flex-sty">
                <span>替换</span>
              </div>
            </span>
          </span>
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import store from "@/store";
export default {
  data() {
    return {
      cVideoTime: "",
      fileList: [],
      videoFlag: false,
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
    };
  },
  methods: {
    // 替换视频
    editImg(val) {
      let that = this;
      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "video/*");
      input.onchange = function (e) {
        let file = this.files[0]; //选取第一个文件
        let url = URL.createObjectURL(file);
        that.getVideoTime(url);
        that.fileList[0].url = url;
        that.fileList[0].raw = file;
      };
      input.click();
    },
    // 控制视频大小小于100M
    checkFile(file) {
      if (file.size / 1024 > 100 * 1024) {
        this.$message({
          type: "warning",
          message: "上传的视频不得超过100M！",
          offset: 300,
        });
        return false;
      }
    },
    // 时间格式转化 s(秒)-> 00:00:00
    formatSeconds(value) {
      var theTime = parseInt(value); // 秒
      var theTime1 = 0; // 分
      var theTime2 = 0; // 小时
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
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
      console.log(this.cVideoTime, "输出时间");
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
    // 上传视频赋值
    handleChange(file, fileList) {
      this.getVideoTime(file.url);
      this.fileList = fileList;
    },
    // 删除视频清空数组
    handleRemove(file) {
      this.fileList = [];
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
.up-flex-sty {
  font-size: 16px;
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