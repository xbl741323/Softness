<template>
  <!-- 支付凭证专属上传 -->
  <div class="pay-vouncher-contain">
    <div :class="['pay-vouncher-upload',showStatus ?'pay-vouncher-hidden':'']">
    <el-form-item prop="productImgFile">
      <el-upload 
        ref="upload"
        :headers="headers"
        action="wtcrm/file/upload"
        list-type="picture-card"
        accept=".jpg,.jpeg,.png,.gif,.pdf"
        :disabled="imgList.length >= 1 ? true :disabled == true ?true: false"
        :limit="1"
        :before-upload="checkFile"
        :on-progress="uploadVideoProcess"
        :on-success="handleVideoSuccess"
        :file-list="imgList">
        <el-button v-if="(imgList.length == 0)" size="small" type="primary">{{ types == 'launch-refund'?'上传文件':'上传支付凭证'}}</el-button>
        <div slot="file" slot-scope="{ file }" v-if="(imgList.length > 0&&uploadStatus)">
          <div v-if="file.response && file.response.data" class="file_contain">
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
              :src="imgUrl + file.response.data"
              alt=""/>
            <img v-if="file.response.data.split('.')[file.response.data.split('.').length - 1] == 'pdf'" class="el-upload-list__item-thumbnail" src="@/assets/images/order/pdf.png" alt="" />
            <span class="el-upload-list__item-actions">
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="confirmHandleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
              <span v-if="file.response.data.split('.')[file.response.data.split('.').length - 1] != 'pdf'" class="el-upload-list__item-delete" @click="handlePreview(file)">
                <i class="el-icon-view"></i>
              </span>
            </span>
          </div>
        </div>
      </el-upload>
    </el-form-item>
  </div>
   <!-- 预览 -->
   <div class="demo-image__preview image_fix_sty" v-if="(imgList.length > 0)&&(imgList[0].response.data.split('.')[imgList[0].response.data.split('.').length - 1] != 'pdf')">
      <el-image ref="preview" v-show="preUrl!==''" style="width: 100px; height: 100px" :src="preUrl" :preview-src-list="srcList"></el-image>
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
    types: {
      type: String,
      required: false,
    }
  },
  data() {
    return {
      uploadStatus: false,
      showStatus: false,
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
      if(file.response.data.split('.')[file.response.data.split('.').length - 1] != 'pdf'){
        this.preUrl = this.imgUrl + file.response.data;
        this.srcList = [this.preUrl, this.preUrl];
        this.$refs.preview.showViewer = true;
      }
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
    // 确认删除
    confirmHandleRemove(file){
      this.$confirm('确认删除支付凭证？',{
        type:'warning',
        cancelButtonClass: 'btn-custom-cancel',
      }).then(()=>{
        this.handleRemoveImg(file)
      })
    },
    handleRemoveImg(file) {
      this.imgList.forEach((item, index) => {
        if (item.response.data == file.response.data) {
            this.imgList.splice(index, 1);
            this.showStatus = false
            this.$emit('getImgList',this.imgList)
          }
      });
    },
    handleVideoSuccess(res, file, fileList) {
      this.imgList = fileList;
      this.checkd = this.imgList[0].response.data;
      this.videoFlag = false;
      this.uploadStatus = true;
      this.$emit('getImgList',this.imgList)
    },
    uploadVideoProcess(event, file, fileList) {
      if (file.size / 1024 > 10 * 1024) {
        this.videoFlag = true;
        this.videoUploadPercent = file.percentage.toFixed(0);
      }
    },
    checkFile(file) {
      if (file.size / 1024 > 5 * 1024) {
        this.$message({
          type: "warning",
          message: "上传的支付凭证文件不得超过5M！",
          offset: 300, 
        });
        return false;
      }else{
       this.uploadStatus = false
       this.showStatus = true
      }
    },
  },
};
</script>

<style scoped>
.pay-vouncher-contain {
  margin-top: 5px;
  margin-bottom: -10px;
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
}
.image_fix_sty {
  position: absolute;
  top: 0;
}
</style>
<style>
.pay-vouncher-upload .el-upload--picture-card{
  width: 400px;
  height: 200px;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}
.pay-vouncher-upload .el-upload-list--picture-card .el-upload-list__item {
  overflow: visible;
  border: none;
  margin-bottom: 0;
}
.pay-vouncher-upload .el-upload-list--picture-card .el-upload-list__item-thumbnail {
  width: 400px;
  height: 200px;
  border-radius: 2px;
}
.pay-vouncher-upload .el-upload-list--picture-card .el-upload-list__item-actions {
  width: 400px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
}
.pay-vouncher-hidden .el-upload--picture-card{
  display: none !important;
}
.pay-vouncher-contain .el-image__preview {
  display: none;
}
.pay-vouncher-contain .el-upload-list__item {
  transition: none !important;
}
.pay-vouncher-upload .el-upload-list--picture-card .el-upload-list__item{
  width: 400px;
  height: 200px;
}
</style>