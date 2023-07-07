<template>
  <el-dialog title="查看营业执照" :visible.sync="openVisble" v-if="openVisble" top="5vh" center :width="'700px'"
    :before-close="handleClose" :close-on-click-modal="false">
    <div class="contain">
      <div class="preview-contain">
        <iframe v-if="fileType == 'pdf'" :src="fileUrl + '#toolbar=0'" height="600px;" width="426px"></iframe>
        <img v-else :src="fileUrl" alt="" />
      </div>
      <div class="btn-contain" v-if="filterTaskAuthority()">
        <span v-if="fileType == 'pdf'" class="pointer-sty" @click="download(licenseInfo)">点击下载</span>
        <a v-else :href="fileUrl" class="pointer-sty">点击下载</a>
      </div>
      <div class="btn-contain">
        <span class="right-small-sty">更新于{{ licenseInfo.createTime }}</span>
        <span class="right-small-sty">来源：{{ licenseInfo.sourceType | filterSourceType }}-{{
          licenseInfo.createByName
        }}</span>
        <span>关联编号：{{ licenseInfo.sourceNo }}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      imgUrl: process.env.VUE_APP_IMAGE_BASEURL,
      openVisble: false,
      licenseInfo: {}
    };
  },
  filters: {
    filterSourceType(val) {
      return val == 2 ? "工程师" : val == 1 ? "初级认证" : "未知";
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
    fileUrl() {
      return this.licenseInfo.fileUrl;
    },
    fileType() {
      let arr = this.licenseInfo.fileUrl.split(".");
      let fileType = arr[arr.length - 1];
      return fileType;
    }
  },
  methods: {
    filterTaskAuthority() {
      let listType = this.$route.query.listType;
      if (listType == "personal") {
        return this.permissions.bt_download_my_license;
      } else {
        return true;
      }
    },
    getBlob(url) {
      // url:是文件在oss上的地址
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob"; // 请求类型是blob类型
        xhr.crossOrigin = "*"; // 解决跨域问题
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          }
        };
        xhr.send();
      });
    },
    saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        const link = document.createElement("a");
        const body = document.querySelector("body");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename; //修改文件名
        link.style.display = "none";
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }
    },
    // 下载文件
    download(file) {
      this.getBlob(file.fileUrl).then(res => {
        this.saveAs(res, file.fileName);
      });
    },
    handleClose() {
      this.openVisble = false;
    }
  }
};
</script>

<style scoped>
.contain {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
}

.preview-contain {
  min-width: 426px;
}

.btn-contain {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pointer-sty {
  color: #409eff;
  cursor: pointer;
  font-size: 16px;
  text-decoration: none;
}

.right-small-sty {
  margin-right: 20px;
}

.big-sty {
  font-size: 50px;
  cursor: pointer;
}

.preview-contain img {
  width: 100%;
  height: 100%;
}
</style>
