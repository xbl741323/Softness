<template>
  <div>
    <div class="file-line" v-if="row.options == null">
      <div class="file-name">
        <span class="common_edit_table">{{ row.fileName }}</span>
        <div v-show="show">
          <el-tooltip
            class="item"
            effect="dark"
            content="下载"
            placement="top-end"
          >
            <i
              class="el-icon-download"
              v-if="filterTaskAuthority(4)"
              @click="downloadFileFun(row)"
            ></i> </el-tooltip
          ><el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top-end"
          >
            <i
              class="el-icon-delete"
              v-if="filterTaskAuthority(3)"
              @click="deleteFileById(row)"
            ></i> </el-tooltip
          ><el-tooltip
            class="item"
            effect="dark"
            content="重命名"
            placement="top-end"
          >
            <i
              class="el-icon-edit"
              v-if="filterTaskAuthority(2)"
              @click="editContent(row)"
            ></i>
          </el-tooltip>
        </div>
      </div>
      <i
        class="el-icon-close icon-edit"
        @click="deleteRow"
        v-if="showDelete"
      ></i>
    </div>
    <input
      type="text"
      class="common_edit_box"
      v-model="fileName"
      v-focus
      v-if="row.options == 1"
      @blur="cancle(row)"
    />
    <span class="common_suffix" v-if="row.options == 1">{{
      row.fileName.split(".")[row.fileName.split(".").length - 1]
    }}</span>
    <el-button
      icon="el-icon-check"
      v-if="row.options == 1"
      :disabled="this.fileName.length < 1"
      @click="saveKeyWords(row)"
    ></el-button>
    <el-button
      icon="el-icon-close"
      v-if="row.options == 1"
      @click="cancle(row)"
    ></el-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { deleteFileById, updateFileName } from "@/api/task/index.js";
export default {
  props: {
    listType: {
      type: String,
      default: ""
    },
    taskType: {
      //  true 知产 false 項目
      type: Boolean
    },
    row: {
      type: Object
    },
    width: {
      default: 500
    },
    showDelete: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      userInfo: {},
      fileName: "",
      suffix: "",
      show: false
    };
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus();
      }
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    /**
     *项目的
        文件柜上传	bt_save_project_file_repository
        文件柜重命名	bt_update_project_file_name
        文件柜删除	bt_delete_project_file
        文件柜下载	bt_download_project_file_repository

        知产的
        文件柜上传	bt_save_intellectual_file_repository
        文件柜重命名	bt_update_intellectual_file_name
        文件柜删除	bt_delete_intellectual_file
        文件柜下载	bt_download_intellectual_file_repository

       1 bt_save_my_file_repository                 文件柜上传(我的)
       2 bt_update_my_file_name                     文件柜重命名(我的)
       3 bt_delete_my_file                          文件柜删除(我的)
       4 bt_download_my_file_repository             文件柜下载(我的)
     * ** */
    filterTaskAuthority(type) {
      const permissions = this.permissions;
      const isPersonal = this.listType === "personal";
      const task = this.taskType ? "intellectual" : "project";
      const authorityMap = {
        1: ["bt_save_my_file_repository", `bt_save_${task}_file_repository`],
        2: ["bt_update_my_file_name", `bt_update_${task}_file_name`],
        3: ["bt_delete_my_file", `bt_delete_${task}_file`],
        4: [
          "bt_download_my_file_repository",
          `bt_download_${task}_file_repository`
        ]
      };
      return authorityMap[type]
        ? permissions[
            isPersonal ? authorityMap[type][0] : authorityMap[type][1]
          ]
        : false;
    },
    // 下载文件柜文件
    downloadFileFun(row) {
      this.downloadFile(row.fileUrl, row.fileName); // filename:文件名，可自定义
    },
    downloadFile(fileUrl, fileName) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", fileUrl, true);
      xhr.responseType = "blob";
      xhr.onload = function() {
        if (xhr.status === 200) {
          // 获取响应中的Blob对象
          const blob = xhr.response;
          // 创建一个隐藏的 <a> 元素
          const link = document.createElement("a");
          link.style.display = "none";
          // 创建一个包含文件名的Blob对象
          const blobWithFileName = new Blob([blob], {
            type: "application/octet-stream"
          });
          const blobUrl = window.URL.createObjectURL(blobWithFileName);
          // 设置下载文件的URL和文件名
          link.href = blobUrl;
          link.download = fileName;
          // 将 <a> 元素添加到页面中
          document.body.appendChild(link);
          // 触发点击事件，开始下载
          link.click();
          // 清理 <a> 元素和URL对象
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        }
      };
      xhr.send();
    },
    // 删除文件柜文件
    deleteFileById(row) {
      if (
        this.userInfo.id == row.createBy ||
        (!(this.listType === "personal") && this.filterTaskAuthority(3))
      ) {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteFileById(
            row.id,
            this.listType == "personal",
            this.taskType
          ).then(res => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$emit("saveKeywords");
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "不可删除他人上传的文件"
        });
      }
    },
    handleMouseenter(val) {
      if (this.row.id == val.id) {
        this.show = true;
      }
    },
    handleMouseleave(val) {
      if (this.row.id == val.id) {
        this.show = false;
      }
    },
    //鼠标移上显示外框
    showBorder(val) {
      val.options = 2;
    },
    clearBorder(val) {
      val.options = null;
    },
    //保存关键词
    saveKeyWords(row) {
      let data = {
        id: row.id,
        fileName: this.fileName + "." + this.suffix
      };
      updateFileName(data, this.listType == "personal", this.taskType).then(
        res => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.fileShowState = false;
            this.$emit("saveKeywords");
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          }
        }
      );
    },
    cancle(val) {
      //防止失焦在click前触发
      setTimeout(() => {
        val.name = this.transferOption;
        this.fileName = val.fileName
          .split(".")
          .slice(0, -1)
          .join(".");
        val.options = null;
      }, 200);
    },
    editContent(val) {
      if (
        this.userInfo.id == val.createBy ||
        (!(this.listType === "personal") && this.filterTaskAuthority(2))
      ) {
        setTimeout(() => {
          // 给input框赋值
          this.fileName = val.fileName
            .split(".")
            .slice(0, -1)
            .join(".");
          let arr = val.fileName.split(".");
          this.suffix = arr[arr.length - 1];
          this.transferOption = val.fileName;
          this.$set(val, "options", 1);
        }, 300);
      } else {
        this.$message({
          type: "warning",
          message: "不可更改他人文件名"
        });
      }
    },
    deleteRow() {
      this.$emit("deleteRow", this.row);
    }
  },
  mounted() {
    this.$parent.$on("mouseenter", this.handleMouseenter);
    this.$parent.$on("mouseleave", this.handleMouseleave);
    if (this.row) {
      this.fileName = this.row.fileName
        .split(".")
        .slice(0, -1)
        .join(".");
    } else {
    }
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("pigx-userInfo")).content;
  },
  beforeDestroy() {
    this.$parent.$off("mouseenter", this.handleMouseenter);
    this.$parent.$off("mouseleave", this.handleMouseleave);
  }
};
</script>

<style scoped>
.common-btn {
  height: 34px;
}
.common_edit_table {
  line-height: 25px;
  padding: 7px 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.common_edit_box {
  width: 300px;
  line-height: 25px;
  margin-right: 3px;
  border: 1px solid #eee;
  padding: 7px 15px;
}
.common_keyword_sty {
  width: 210px;
  padding: 6px 0;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.common_suffix {
  margin-right: 3px;
}
.name {
  width: 150px;
  padding: 6px 15px;
  line-height: 20px;
  /* padding-right:60px; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
.file-name {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 50px;
}
.file-name div {
  width: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #409eff;
}
.icon-edit {
  margin-left: 10px;
  cursor: pointer;
}
.file-line {
  display: flex;
  align-items: center;
}
</style>
