<!-- （专利申请号&专利申请结果）模板导入 -->
<template>
  <el-dialog
    v-loading="loading"
    element-loading-text="上传中，请稍等！"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" :visible.sync="openVisble" v-if="openVisble" center :title="!importFailStatus?'':'部分导入失败 '" :width="!importFailStatus?'800px':'400px'" :close-on-click-modal="false">
    <div class="import-contain" v-if="!importFailStatus">
      <div>注意：</div>
      <div class="import-text" v-for="(item,index) in (demoType==0?patentNoTextArr:patentResultTextArr)" :key="index">{{item}}</div>
      <div class="file-contain">
       <el-upload
        :class="[fileList.length>=1?'hide-import-upload':'']"
        action
        ref="upload"
        accept=".xlsx"
        :limit="1"
        :file-list="fileList"
        :on-remove="handleRemove"
        :on-change="handleChange"
        :auto-upload="false">
        <el-button type="primary" icon="el-icon-upload">选择本地文件</el-button>
       </el-upload>
        <span>文件大小不超过5M</span>
        <span @click="downloadDemo()">{{demoType==0?patentNoTitle:patentResultTitle}}</span>
      </div>
    </div>
    <div class="fail-contain"  v-if="importFailStatus">
      <div>请点击下载返回表格，查看失败原因</div>
      <a :href="downloadUrl+failResultUrl" v-if="demoType == 0">批量导入专利申请号返回表.xlsx</a>
      <a :href="downloadUrl+failResultUrl" v-if="demoType == 1">批量导入专利申请结果返回表.xlsx</a>
    </div>
    <div class="btn-contain">
      <el-button v-if="!importFailStatus" type="primary" class="btn-right-sty" v-preventReClick @click="submitOperate()">确定</el-button>
      <el-button v-if="!importFailStatus" type="warning" @click="handleClose()">取消</el-button>
      <el-button v-if="importFailStatus" type="primary" @click="handleClose()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { downloadPatentDemo, batchImportPatentDemo } from "@/api/task/new-task";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  data() {
    return {
      fileStatus: false, // 大小是否超过5M
      failResultUrl:'', // 部分导入失败返回的文件名称
      downloadUrl: process.env.VUE_APP_IMAGE_BASEURL,
      importFailStatus: false, // 是否导入部分失败
      demoType: 0, // 模板类型 0-专利申请号 1-专利申请结果
      patentNoTitle: "批量导入专利申请号模板.xlsx",
      patentResultTitle: "批量导入专利申请结果模板.xlsx",
      loading: false,
      fileList: [],
      openVisble: false,
      patentNoTextArr: [
        "1.请先下载按钮右侧的“批量导入专利申请号模板”，然后使用模板填写完整后进行数据上传，否则数据会上传失败",
        "2.在模板中填写正确的任务编号，否则会导致上传错误。",
        "3.在模板中填写的交付物名称不能超过30字，否则会自动截取前30字。",
        "4.仅限专利申请工作流的任务导入时使用（待开始>专利检索>专利撰写>专利申请>专利审查>完成（通过、不通过）)，上传成功后，任务状态自动更新为专利申请，已完成、专利审查和退款中的任务状态不变。",
      ],
      patentResultTextArr: [
        "1.请先下载按钮右侧的“批量导入专利结果模板”，然后使用模板进行数据上传，否则数据会上传失败",
        "2.在模板中填写正确的任务编号和申请号，否则会导致上传错误。",
        "3.在模板中选择正确的授权结果，上传成功后将无法更改。",
        "4.仅限专利申请工作流的任务导入时使用（待开始>专利检索>专利撰写>专利申请>专利审查>完成（通过、不通过）)。",
      ],
    };
  },
  methods: {
    // 下载模板
    downloadDemo() {
      downloadPatentDemo(this.demoType).then((res) => {
        let fileName = this.demoType == 0 ? this.patentNoTitle : this.patentResultTitle;
        let blob = new Blob([res.data]);
        let objectUrl = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = objectUrl;
        a.download = fileName;
        a.click();
      });
    },
    submitOperate() {
      if (this.fileList.length > 0&&!this.fileStatus) {
        this.finalUpload();
      } else {
        this.$message({
          type: "warning",
          message: this.fileList.length == 0? "请上传文件！": this.fileStatus?"文件大小不能超过5M！":""
        });
      }
    },
    // 上传模板
    finalUpload() {
      this.loading = true;
      let formData = new FormData();
      formData.append("file", this.fileList[0].raw);
      batchImportPatentDemo(formData, this.demoType).then((res) => {
        let r = res.data
        if (r.code == CodeMsg.CODE_0&&r.data.isSuccess) {
          this.$message({
            type: "success",
            message: `${r.data.importCount}条数据全部导入成功，状态已更新！`,
            offset: 300,
          });
          this.loading = false;
          this.handleClose();
          this.$emit("refresh");
        }else if(r.code == CodeMsg.CODE_0&&!r.data.isSuccess){
          this.loading = false;
          this.failResultUrl = r.data.fileUrl
          this.importFailStatus = true
        } else {
          this.loading = false;
          this.$message({
            type: "warning",
            message: res.data.msg,
            offset: 300,
          });
        }
      });
    },
    handleRemove(file, fileList) {
      this.fileList = [];
    },
    handleChange(file, fileList) {
      this.fileStatus = false
      if (file.size / 1024 > 5 * 1024) {
        this.fileStatus = true
        this.$message({
          type: "warning",
          message: "文件大小不能超过5M！"
        });
      }
      this.fileList = fileList;
    },
    handleClose() {
      this.openVisble = false;
      this.importFailStatus = false
    },
  },
};
</script>

<style scoped>
.import-contain {
  margin-top: -30px;
  color: #333333;
}
.import-contain > div:nth-of-type(1) {
  font-weight: bold;
  margin-bottom: 2px;
}
.import-text {
  font-size: 14px;
  margin-bottom: 4px;
}
.file-contain {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-left: 20px;
}
.file-contain > span:nth-of-type(1) {
  font-size: 14px;
  margin: 0 40px 0 20px;
}
.file-contain > span:nth-of-type(2) {
  font-size: 14px;
  color: #3960e2;
  cursor: pointer;
}
.btn-contain {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
.btn-right-sty {
  margin-right: 50px;
}
.fail-contain{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -10px;
}
.fail-contain > div:nth-of-type(1) {
  font-size: 14px;
  color: #D9001B;
  margin-bottom: 20px;
}
.fail-contain > a:nth-of-type(1) {
  font-size: 14px;
  color: #3960e2;
  cursor: pointer;
}
</style>
<!-- 控制上传文件按钮隐藏 -->
<style>
.hide-import-upload .el-upload {
  display: none !important;
}
</style>