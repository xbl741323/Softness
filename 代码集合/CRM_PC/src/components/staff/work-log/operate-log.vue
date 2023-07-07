<template>
  <div class="operate-log">
    <div class="operate_log_info">
      <el-form :model="logInfo" ref="logInfo" :rules="rules">
        <el-form-item :label="logInfo.journalTime" prop="textarea">
          <el-input
            :autosize="sizeInfo"
            maxlength="500"
            show-word-limit
            :disabled="source == false?true :disabled == true?true:false"
            type="textarea"
            placeholder="工作内容"
            v-model="logInfo.textarea">
          </el-input>
        </el-form-item>
        <!-- 上传图片 -->
        <div class="log_upload_img">
          <img-upload ref="upload" :disabled='disabled'></img-upload>
          <div class="btn_multi_sty">
						<div v-if="source">
              <el-button v-if="operateStatus == 2" type="primary" size="medium" class="operate_publish_sty" v-preventReClick @click="publishLog()">发布</el-button>
						  <el-button v-if="operateStatus == 0&&!editStatus" type="primary" size="medium" class="special-sty" @click="changeStatus()">编辑</el-button>
						  <el-button v-if="operateStatus == 1||editStatus" type="primary" size="medium" class="operate_publish_sty" v-preventReClick @click="editLog()">提交</el-button>
            </div>
            <el-button v-if="operateStatus == 1||editStatus" size="medium" v-preventReClick @click="cancel()">取消</el-button>
					</div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addLog, editLog } from "@/api/work-log/index";
import * as CodeMsg from "@/api/common/CodeChange";
import imgUpload from "@/components/upload/log-upload";
export default {
  components: {
    imgUpload,
  },
  props: {
    source: { // true:我的日志 false:日志管理
      default: false,
      required: false,
    }, 
    operateStatus: { // 0:查看 1::编辑 2:发布
      default: 0,
      required: false,
    },
  },
  data() {
    return {
      disabled: true,
      pictureUrl: [],
      editStatus: false,
      sizeInfo: {
        minRows: 10,
        maxRows: 20,
      },
      rules: {
        textarea: [{ required: true, message: "请填写", trigger: "blur" }],
      },
      logInfo: {
        textarea: "",
        journalTime: "",
        id: "",
        isEffective: "",
      },
    };
  },
  methods: {
    changeStatus() {
      this.editStatus = true;
      this.disabled = false
    },
    cancel() {
      this.$emit("close-log");
    },
    // 发布日志
    publishLog() {
      this.$refs.logInfo.validate((valid) => {
        if (valid) {
          this.pictureUrl = [];
          this.$refs.upload.imgList.forEach((item) => {
            this.pictureUrl.push(item.response.data);
          });
          let params = {
            content: this.logInfo.textarea,
            journalTime: this.logInfo.journalTime,
            pictures: this.pictureUrl,
          };
          addLog(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "发布成功！",
                offset: 300,
              });
              this.$emit("close-log");
            } else {
              this.$message({
                type: "warning",
                message: res.data.msg
              })
            }
          });
        }
      });
    },
    // 编辑日志
    editLog() {
      this.$refs.logInfo.validate((valid) => {
        if (valid) {
          this.pictureUrl = [];
          this.$refs.upload.imgList.forEach((item) => {
            this.pictureUrl.push(item.response.data);
          });
          let params = {
            id: this.logInfo.id,
            content: this.logInfo.textarea,
            journalTime: this.logInfo.journalTime,
            pictures: this.pictureUrl,
            isEffective: this.logInfo.isEffective,
          };
          if (this.logInfo.id) {
              editLog(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "操作成功！",
                offset: 300,
              });
            }
            this.$emit("close-log");
          });
          }else{
                 addLog(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "发布成功！",
                offset: 300,
              });
              this.$emit("close-log");
            }
          });
          }
      
        }
      });
    },
  },
};
</script>

<style scoped>
.operate_log_info {
  background: #ffffff;
  padding: 0px 40px 20px 0px;
  border-radius: 5px;
  margin-bottom: 10px;
  margin-top: -20px;
}
.operate_log_info > div:nth-of-type(1) {
  color: #36a6fe;
  font-weight: bold;
  padding: 0 0 15px 0;
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 10px;
}
.log_upload_img {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
.btn_multi_sty {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
.operate_publish_sty {
  margin-right: 40px;
}
.special-sty{
  margin-right: 0px !important;
}
</style>