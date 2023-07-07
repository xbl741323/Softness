<template>
  <div class="filingCabinet">
    <div class="upload_sty" v-if="filterTaskAuthority()">
      <div>
        <el-button class="btn-sty" type="primary" @click="handleFile()"
          ><i class="el-icon-upload i-right-sty"></i
          >{{ filterTaskType() ? "上传案件材料" : "上传项目材料" }}</el-button
        >
        <input
          ref="file"
          type="file"
          :accept="accept"
          multiple
          class="file-upload"
          @change="handleChange($event)"
        />
      </div>
      <span
        >支持格式：压缩文件（zip、rar）、PDF(pdf/pdfx)、文档（doc、docx）、表格（xls、xlsx）、dwg、
        图片(jpg、jpeg、png)</span
      >
    </div>
    <el-dialog
      title="文件上传"
      :visible.sync="openVisble"
      v-if="openVisble"
      center
      :width="'600px'"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="contain-item bottom-sty">
        <div class="upload-item" v-if="!uploadFinishStatus">
          正在上传 ({{ unWaitCount }}/{{ this.fileList.length }})
        </div>
        <div class="upload-item" v-if="uploadFinishStatus">
          上传完毕 ({{ unWaitCount }}/{{ this.fileList.length }})
        </div>
        <div
          class="upload-item"
          v-if="!uploadFinishStatus && fileList.length > 0"
          @click="confirmTip()"
        >
          全部取消
        </div>
      </div>
      <div v-for="file in fileList" :key="file.uid">
        <upload-item
          :taskType="filterTaskType()"
          ref="upload"
          @getReturnInfo="submitUpload"
          @getUploadStatus="getUploadStatus"
          @deleteFile="deleteFile"
          :file="file"
        ></upload-item>
      </div>
      <!-- 按钮区域 -->
      <div class="btn-contain"></div>
    </el-dialog>
    <div class="bottom_list_sty">
      <table class="table_sty">
        <thead class="thead_sty">
          <tr>
            <th>文件名称</th>
            <th>上传时间</th>
            <th>上传人</th>
            <th>大小</th>
            <th>类别</th>
          </tr>
        </thead>
        <tbody class="file_list_sty">
          <tr
            v-for="file in fileDataList"
            :key="file.id"
            @mouseover="onMouseover(file)"
            @mouseout="onMouseout(file)"
            :class="mouseData.id == file.id ? 'mouseData_sty' : ''"
          >
            <td>
              <edit-box
                :listType="listType"
                :row="file"
                @saveKeywords="getList()"
                :showDelete="false"
              ></edit-box>
            </td>
            <td>{{ file.createTime }}</td>
            <td>{{ file.createByName }}</td>
            <td>{{ file.fileSize }}</td>
            <td>{{ file.materialType | filterFileMaterialType }}</td>
          </tr>
        </tbody>
      </table>
      <div class="paging" v-if="fileDataList.length">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <div class="noData" v-if="!fileDataList.length">
        <div><img src="@/assets/images/task/nodata.svg" alt="" /></div>
        <span>暂无数据</span>
      </div>
    </div>
  </div>
</template>
<script>
import * as CodeMsg from "@/api/common/CodeChange";
import uploadItem from "./upload/upload-file-management";
import {
  upDataSaveFileRepository,
  getPageTmCustomerResource
} from "@/api/task/index.js";
import EditBox from "./upload/editBox";
import { mapGetters } from "vuex";
export default {
  components: {
    uploadItem,
    EditBox
  },
  props: {
    taskId: {
      type: Number,
      required: true
    },
    taskNo: {
      type: String,
      required: true
    },
    orderSpuName: {
      type: String,
      required: true
    },
    userId: {
      // type:Number,
      required: true
    },
    clueType: {
      type: Number,
      default: null
    },
    listType: {
      type: String,
      default: null
    },
    clueId: {
      type: Number,
      default: null
    },
    categoryId: {
      // type: Number,
      default: null
    },
    orderType: {
      // type: Number,
      default: null
    }
  },
  data() {
    return {
      mouseData: { id: null },
      fileManagement: null,
      accept: ".zip,.rar,.pdf,.pdfx,.doc,.docx,.xls,.xlsx,.dwg,.jpg,.jpeg,.png",
      total: 0,
      currentPage: 1,
      pageSize: 10,
      openVisble: false,
      fileList: [],
      uploadFinishStatus: false, // true-全部上传完成
      unWaitCount: 0, // 上传中和上传完毕的数量总和
      templateForm: {},
      templateFile: [],
      templateStatus: false,
      fileDataList: []
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  filters: {
    filterFileMaterialType(val) {
      const materialTypeMap = {
        1: "案件材料",
        2: "受理通知书",
        3: "受理缴费文件",
        4: "授权通知书",
        5: "授权缴费文件",
        6: "证书",
        7: "中间文件",
        8: "项目文件"
      };
      if (val) {
        return materialTypeMap[val];
      } else {
        return materialTypeMap[1];
      }
    }
  },
  mounted() {
    this.getPageTmCustomerResource();
  },
  methods: {
    filterFileSize(size) {
      let unit;
      if (size > 1024 * 1024) {
        // 文件大小大于1M
        size = size / (1024 * 1024);
        unit = "M";
      } else {
        // 文件大小小于等于1M
        size = size / 1024;
        unit = "KB";
      }

      return size.toFixed(2) + unit;
    },

    getList() {
      this.getPageTmCustomerResource();
    },
    onMouseover(val) {
      this.mouseData = val;
      this.$emit("mouseenter", val);
    },
    onMouseout(val) {
      this.mouseData = { id: null };
      this.$emit("mouseleave", val);
    },
    filterTaskAuthority() {
      if (this.listType == "personal") {
        return this.permissions.bt_save_my_file_repository;
      } else {
        return this.filterTaskType()
          ? this.permissions.bt_save_intellectual_file_repository
          : this.permissions.bt_save_project_file_repository;
      }
    },

    // 分页获取文件柜记录
    getPageTmCustomerResource() {
      let data = {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        taskId: this.taskId
      };
      getPageTmCustomerResource(data).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.fileDataList = res.data.data.records;
          this.total = res.data.data.total;
        }
      });
    },
    // 提交
    submitUpload(info, file) {
      let fileUrl = info.res.requestUrls[0];
      // 文件柜内容上传
      let data = {
        sourceNo: this.taskNo,
        sourceName: this.orderSpuName,
        sourceType: 2,
        materialType: this.filterTaskType() ? 1 : 8,
        taskId: this.taskId,
        clueId: this.clueId,
        fileUrl: fileUrl.includes("?") ? fileUrl.split("?")[0] : fileUrl,
        clueType: this.clueType,
        fileName: file.name,
        fileSize: this.filterFileSize(file.size)
      };
      upDataSaveFileRepository(
        data,
        this.listType == "personal",
        this.taskType
      ).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          if (this.$refs["upload"] && this.$refs["upload"].length > 0) {
            this.$refs["upload"].forEach(item => {
              item.upDataState();
            });
          }
          this.getPageTmCustomerResource();
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPageTmCustomerResource();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPageTmCustomerResource();
    },
    // uploadStatus赋值
    getUploadStatus(uploadStatus, uploadCount, file) {
      this.fileManagement = file;
      this.fileList.forEach(item => {
        if (item.uid == file.uid) {
          item.uploadStatus = uploadStatus;
          item.uploadCount = uploadCount;
        }
      });
      this.setAllStatus();
    },
    // 设置状态值
    setAllStatus() {
      let r1 = this.fileList.filter(item => {
        return item.uploadStatus === 0 && item.uploadCount === 0;
      });
      let r2 = this.fileList.filter(item => {
        return item.uploadStatus === 2 || item.uploadCount >= 1;
      });
      this.uploadFinishStatus =
        r2.length == this.fileList.length ? true : false;
      this.unWaitCount = this.fileList.length - r1.length;
    },
    // 取消上传，删除文件
    deleteFile(file) {
      this.fileList.forEach((item, index) => {
        if (item.uid == file.uid) {
          this.fileList.splice(index, 1);
        }
      });
      this.setAllStatus();
      if (!this.fileList.length) {
        this.openVisble = false;
      }
    },
    handleClose() {
      this.stopMultiUpload();
      this.resetVal();
      this.handleRemoveAll();
    },
    // 重置参数
    resetVal() {
      this.fileList = [];
      this.waitAllStatus = true;
      this.uploadFinishStatus = false;
      this.unWaitCount = 0;
    },
    // 取消提示
    confirmTip() {
      this.stopMultiUpload();
      this.$confirm(
        "确定取消上传？已经上传的部分将保留在文件柜中。",
        "取消上传",
        {
          type: "warning",
          cancelButtonClass: "btn-custom-cancel"
        }
      )
        .then(() => {
          this.handleRemoveAll();
        })
        .catch(() => {
          this.startMultiUpload();
        });
    },
    // 暂停上传-并清空所有待上传和上传中文件，关闭弹窗
    handleRemoveAll() {
      this.stopMultiUpload();
      this.resetVal();
      this.openVisble = false;
    },
    // 批量暂停上传
    stopMultiUpload() {
      if (this.$refs["upload"] && this.$refs["upload"].length > 0) {
        this.$refs["upload"].forEach(item => {
          if (item.uploadStatus === 0 || item.uploadStatus === 1) {
            item.pauseStatus = true;
            item.stop();
          }
        });
      }
    },
    // 批量续传
    startMultiUpload() {
      if (this.$refs["upload"] && this.$refs["upload"].length > 0) {
        this.$refs["upload"].forEach(item => {
          if (
            (item.uploadStatus === 0 || item.uploadStatus === 1) &&
            item.uploadCount == 0
          ) {
            item.pauseStatus = false;
            item.resume();
          }
        });
      }
    },
    // 触发点击事件
    handleFile() {
      this.$refs.file.click();
    },
    // 上传文件
    handleChange(e) {
      let r = e.target.files;
      if (r.length > 5) {
        this.$message({
          type: "warning",
          message: `当前限制选择 5 个文件，本次选择了 ${r.length} 个文件`
        });
        return;
      }
      const fileSizeLimit = 500 * 1024 * 1024; // 限制文件大小为 500MB
      const acceptedFormats = new Set(
        this.accept.split(",").map(ext => ext.replace(".", "").trim())
      );
      const tooLargeFiles = [];
      const invalidFormatFiles = [];
      for (const file of r) {
        if (file.size > fileSizeLimit) {
          tooLargeFiles.push(file);
        } else {
          const fileExtension = file.name
            .split(".")
            .pop()
            .toLowerCase();
          if (!acceptedFormats.has(fileExtension)) {
            invalidFormatFiles.push(file);
          }
        }
      }
      if (tooLargeFiles.length > 0) {
        const message = `以下文件超过了 ${fileSizeLimit /
          1024 /
          1024}MB 的大小限制：\n${tooLargeFiles.map(file => file.name)}`;
        this.$message.warning(message);
        return;
      }
      if (invalidFormatFiles.length > 0) {
        const message = `以下文件类型不支持：\t${invalidFormatFiles.map(
          file => "\n" + file.name
        )}`;
        this.$message.warning(message);
        return;
      }
      this.openVisble = true;
      r.forEach((item, index) => {
        item.uid = this.$moment().valueOf() + String(index);
        item.uploadStatus = 0; // uploadStatus 上传状态 0-待上传 1-上传中 2-上传完成 3-上传异常
        item.uploadCount = 0; // 已上传数量-用于控制网络问题引起的重复提交
        this.fileList.push(item);
      });
      this.$refs.file.value = ""; // 解决重复文件不会再次触发change事件的问题
    },
    filterTaskType() {
      //  true 知产 false 項目
      return (
        this.orderType == 2 || [3, 4, 5, 6].includes(Number(this.categoryId))
      );
    }
  }
};
</script>

<style scoped>
.upload_sty {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.upload_sty span {
  margin-left: 14px;
  color: #333333;
  font-size: 12px;
}
.fileName_flex {
  display: flex;
  justify-content: space-between;
}
.fileName_flex_input {
  display: flex;
  justify-content: space-between;
}
.fileName_flex_input div:nth-child(2) {
  margin-left: 30px;
}
.fileName_flex div:nth-child(2) i {
  margin-right: 10px;
  color: #409eff;
}
.filingCabinet {
  margin-top: 5px;
  color: #666666b5;
  font-size: 14px;
}
.btn-contain {
  padding-bottom: 30px;
}
.right-sty {
  margin-right: 100px;
}
.contain-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload-item:nth-of-type(1) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload-item:nth-of-type(2) {
  color: #409eff;
  cursor: pointer;
}
.bottom-sty {
  margin-bottom: 10px;
}
.file_list_sty {
  width: 100%;
}
.table_sty {
  width: 100%;
}
.thead_sty tr th,
.file_list_sty tr td {
  text-align: left;
  color: #333333;
  font-size: 13px;
  padding: 8px; /* 内边距 */
}
.thead_sty tr th {
  border-top: 1px solid #f2f2f2;
  padding: 15px;
  line-height: 25px;
}
.file_list_sty tr td:nth-child(1) {
  width: 35%;
}
.file_list_sty tr:nth-child(1) {
  border-top: 1px solid #f2f2f2;
}
.file_list_sty tr td:not(:first-child) {
  width: 16.25%;
}
.file_list_sty tr {
  border-bottom: 1px solid #f2f2f2;
}
.noData {
  padding-top: 180px;
  background-color: #fff;
  font-size: 14px;
  height: 200px;
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
}
.noData div img {
  width: 78.5px;
  height: 50px;
}
.file-upload {
  display: none;
}
.i-right-sty {
  margin-right: 4px;
}
.btn-sty {
  margin-bottom: 8px;
}
.mouseData_sty {
  background-color: #f2f2f2;
}
</style>
