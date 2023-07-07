<template>
  <!-- 卧涛课堂封面图片专属上传 -->
  <div class="class-upload">
    <el-form-item
      prop="productImgFile">
      <el-upload
        ref="upload"
        :headers="headers"
        action="wtcrm/file/upload"
        list-type="picture-card"
        accept=".jpg,.jpeg,.png,.gif"
        :disabled="imgList.length >= 1 ? true :disabled == true ?true: false"
        :limit="1"
        :before-upload="checkFile"
        :on-progress="uploadVideoProcess"
        :on-success="handleVideoSuccess"
        :file-list="imgList">
        <el-button
          v-if="!disabled"
          slot="default"
          :disabled="imgList.length >= 1 ? true : false"
          size="small"
          type="primary">点击上传</el-button>
          <el-button
          v-if="disabled"
          slot="default"
          :disabled="disabled"
          size="small"
          type="primary">点击上传</el-button>
        <div slot="file" slot-scope="{ file }">
          <div v-if="file.response && file.response.data" class="file_contain">
            <img
              v-if="
                file.response.data.split('.')[
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
                ] == 'gif'
              "
              class="el-upload-list__item-thumbnail"
              style="height: 148px"
              :src="imgUrl + file.response.data"
              alt=""/>
            <span class="el-upload-list__item-actions">
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemoveImg(file)">
                <i class="el-icon-delete"></i>
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handlePreview(file)">
                <i class="el-icon-view"></i>
              </span>
            </span>
            <span class="card_img_edit" @click="editImg(file)" v-if="!disabled"> 替换 </span>
          </div>
        </div>
      </el-upload>
      <p>{{imageDesc}}</p>
    </el-form-item>
    <!-- 预览 -->
    <div class="demo-image__preview image_fix_sty">
      <el-image 
      ref="preview"
      v-show="preUrl!==''"
      style="width: 100px; height: 100px"
      :src="preUrl" 
      :preview-src-list="srcList">
    </el-image>
   </div>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange"
import { uploadMedia } from "@/api/project/project";
import store from "@/store";
export default {
  props: {
    status: {
      required: false,
    },
    disabled: {
      default: false,
      required: false,
    },
    imageDesc: {
      default: "",
      required: false,
    },
  },
  data() {
    return {
      preUrl: "",
      srcList: [],
      imgUrl: process.env.VUE_APP_IMAGE_BASEURL,
      checkd: "",
      videoUploadPercent: 0,
      videoFlag: false,
      imgList: [],
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
    };
  },
  methods: {
    handlePreview(file) {
      this.preUrl = this.imgUrl + file.response.data;
      this.srcList = [this.preUrl, this.preUrl];
      this.$refs.preview.showViewer = true;
    },
    editImg(val) {
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
            that.imgList.forEach((item) => {
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
    handleRemoveImg(file) {
      console.log(file);
      console.log(this.info);
      if (this.status === 0) {
        this.$message({
          type: "warning",
          message: "置顶状态下不能删除封面图片！",
          offset: 300,
        });
      } else {
        this.imgList.forEach((item, index) => {
          if (item.response.data == file.response.data) {
            this.imgList.splice(index, 1);
            if ((this.checkd = item.response.data && this.imgList.length > 0)) {
              this.checkd = this.imgList[0].response.data;
            } else {
              this.checkd = "";
            }
          }
        });
      }
    },
    handleVideoSuccess(res, file, fileList) {
      this.imgList = fileList;
      this.checkd = this.imgList[0].response.data;
      this.videoFlag = false;
    },
    uploadVideoProcess(event, file, fileList) {
      if (file.size / 1024 > 10 * 1024) {
        this.videoFlag = true;
        this.videoUploadPercent = file.percentage.toFixed(0);
      }
    },
    checkFile(file) {
      if (file.type.indexOf("image") != -1) {
        if (file.size / 1024 > 4 * 1024) {
          this.$message({
            type: "warning",
            message: "上传的图片不得超过4M！",
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
  },
};
</script>

<style scoped>
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
}
.image_fix_sty {
  position: absolute;
  top: 0;
}
</style>
<style>
.class-upload .el-upload-list--picture-card .el-upload-list__item {
  overflow: visible;
  border: none;
  margin-bottom: 0;
}
.class-upload .el-upload-list--picture-card .el-upload-list__item-thumbnail {
  border: 1px solid #dcdfe6;
}
.class-upload .el-upload-list--picture-card .el-upload-list__item-actions {
  height: 100% !important;
}
.class-upload .el-image__preview {
  display: none;
}
</style>