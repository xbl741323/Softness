<template>
  <el-form :model="followClueForm" ref="followClueForm" :rules="followClueRules" label-width="100px">
    <el-form-item label="跟进方式：" prop="followType">
      <el-select v-model="followClueForm.followType" @change="getFollowTypeName(followClueForm.followType)">
        <el-option v-for="item in followClueTypeList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="任务名称：">
      <span>{{ taskInfo.spuName }}</span>
    </el-form-item>
    <el-form-item label="跟进内容：" prop="followContent">
      <el-input
        v-model="followClueForm.followContent"
        style="width: 400px"
        type="textarea"
        :rows="9"
        maxlength="500"
        show-word-limit
        size="medium"/>
    </el-form-item>
    <el-form-item label="附件：">
      <fileupload ref="upload" @fileList="getFileList" :followFileList="fileList" :multipleFile="true"/>
    </el-form-item>
    <div class="follow-footer">
      <el-button size="small" type="primary" @click="confirmFollow()" v-preventReClick>确认</el-button>
      <el-button size="small" @click="cancle()">取消</el-button>
    </div>
  </el-form>
</template>

<script>
import { upLoadFollowFile } from "@/api/new-client/my-clue";
import * as CodeMsg from "@/api/common/CodeChange";
import fileupload from "@/components/file/file-upload";
import { getfollowTypy } from "@/api/clue/clue";
import { taskCustomerFollow } from "@/api/task/index";
export default {
  components: {
    fileupload,
  },
  props: {
    taskInfo: {
      type: Object,
      required: true,
    },
    operateType: {
      // 0-添加 1-编辑
      type: Number,
      default: 0,
    },
    listType:{//personal-我的 其他值-任务管理
      required: true
    },
    apiInfo:{
      type: Object,
      required: true,
      default: ()=>{}
    }
  },
  data() {
    return {
      followClueForm: {
        id: "",
        followType: "",
        followContent: "",
        clueFollowId: "",
      },
      followClueTypeList: [],
      fileList: [],
      followClueRules: {
        followType: [
          { required: true, message: "请选择跟进方式", trigger: "blur" },
        ],
        followContent: [
          { required: true, message: "请输入跟进内容", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getDropList();
  },
  methods: {
    cancle() {
      this.$emit("closeDialog", false, false);
    },
    getFileList(val) {
      //获取文件上传组件返回的文件数组
      this.fileList = val;
    },
    getFollowTypeName(val) {
      for (let i = 0; i < this.followClueTypeList.length; i++) {
        if (this.followClueTypeList[i].id == val) {
          this.followTypeName = this.followClueTypeList[i].name;
        }
      }
    },
    getDropList() {
      const followClueTypeId = "15ea644a8fa2470b933e303dbc7fe19e"; //跟进方式下拉框数据id
      getfollowTypy(followClueTypeId).then((res) => {
        this.followClueTypeList = res.data.data[0].options;
      });
    },
    // 筛选已编辑文件
    fixEditFile() {
      let r = this.fileList.filter((item) => {
        return item.id && item.id != null;
      });
      return r;
    },
    // 筛选新文件
    fixNewFile() {
      let r = this.fileList.filter((item) => {
        return !item.id;
      });
      return r;
    },
    //确定
    confirmFollow() {
      let params = {
        taskNo: this.taskInfo.taskNo,
        orderTaskId: this.$route.query.id  || this.taskInfo.id,
        spuName: this.taskInfo.spuName,
        followType: this.followClueForm.followType,
        followTypeName: this.followTypeName,
        followContent: this.followClueForm.followContent,
        taskFollowFileList: null,
      };
      if (this.fixNewFile().length > 0) {
        let para = new FormData();
        this.fileList.forEach((item) => {
          if (!item.id) {
            para.append("multipartFiles", item.raw, item.name);
          }
        });
        upLoadFollowFile(para).then((res) => {
          if (res.data.code == 0) {
            params.taskFollowFileList = res.data.data;
            this.submitFollow(params);
          }
        });
      } else {
        this.submitFollow(params);
      }
    },
    // 提交跟进
    submitFollow(params) {
      if (this.operateType == 1) {
        params.clueFollowId = this.followClueForm.clueFollowId;
        params.id = this.followClueForm.id;
      }
      if (this.fixEditFile().length > 0) {
        params.taskFollowFileList =
          this.fixNewFile().length > 0
            ? params.taskFollowFileList.concat(this.fixEditFile())
            : this.fixEditFile();
      }
      this.$refs["followClueForm"].validate((valid) => {
        if (valid) {
          taskCustomerFollow(params, this.operateType, this.listType, this.apiInfo)
            .then((res) => {
              if (res.data.code == CodeMsg.CODE_0) {
                this.$message({
                  type: "success",
                  message: "客户跟进成功！",
                });
                this.$emit("closeDialog", false, true);
              } else {
                this.$message({
                  type: "warning",
                  message: res.data.msg,
                });
              }
            })
            .catch(() => {
              return false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.follow-footer {
  text-align: center;
}
</style>