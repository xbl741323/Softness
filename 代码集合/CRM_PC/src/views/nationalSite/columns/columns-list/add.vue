<template>
  <div class="column-add">
    <el-row>
      <el-card class="box-card">
        <el-form
          ref="form"
          :label-position="labelPosition"
          :rules="rules"
          :model="form"
          label-width="200px">
          <h3 class="form-title">{{ $t("title.basicParameter") }}</h3>
          <!-- 基本参数 -->
          <el-form-item label="文章标题：" prop="title">
            <el-input
              v-model.trim="form.title"
              :placeholder="$t('input.noMorethan70')"
              maxlength="70"
              show-word-limit/>
          </el-form-item>
          <el-form-item label="显示状态：" prop="showStatus">
            <el-radio-group v-model="form.showStatus">
              <el-radio :label="0" v-if="navType !== 0">{{ $t("status.toped") }}</el-radio>
              <el-radio :label="1">{{ $t("status.show") }}</el-radio>
              <el-radio :label="2">{{ $t("status.noShow") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('label.webTitle')" prop="metaTitle">
            <el-input
              v-model.trim="form.metaTitle"
              :placeholder="$t('input.noMorethan70')"
              maxlength="70"
              show-word-limit/>
          </el-form-item>
          <el-form-item :label="$t('label.metaKeyword')" prop="metaKeyword">
            <el-input
              v-model.trim="form.metaKeyword"
              :placeholder="$t('input.noMorethan100')"
              maxlength="100"
              show-word-limit/>
          </el-form-item>
          <el-form-item :label="$t('label.metaDescription')" prop="metaDescription">
            <el-input
              type="text"
              v-model.trim="form.metaDescription"
              :placeholder="$t('input.noMorethan200')"
              maxlength="200"
              show-word-limit/>
          </el-form-item>
          <!-- 上传图片 -->
          <img-upload v-if="navType == 2 || navType == 3" ref="upload"></img-upload>
          <el-form-item
            v-if="navType !== 0"
            :label="$t('label.formSort')"
            prop="sort">
            <el-input v-model.trim="form.sort" maxlength="6" show-word-limit />
          </el-form-item>
          <h3 class="form-title" style="margin-top: 50px">
            {{ $t("title.detailInfo") }}
          </h3>
          <!-- 详细内容 -->
          <el-form-item :label="$t('label.detailContent')">
            <span class="must"></span>
            <tinymce-editor
              v-model="editorContent"
              @getEditorValue="getChildEditor"
              @limit="wordLimit"></tinymce-editor>
            <span class="content-warning" v-if="contentNeed">{{ $t("input.detailContent") }}</span>
          </el-form-item>
          <div class="notice-file" style="margin-top: 30px">
            <!-- 添加附件 -->
            <el-form-item :label="$t('label.adjunct')">
              <el-upload
                :disabled="this.fileList.length >= 10"
                class="upload-demo"
                action="wtcrm/file/upload"
                :headers="headers"
                :file-list="fileList"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="10"
                :before-upload="beforeAvatarUpload"
                :on-exceed="handleExceed"
                :on-change="changeFile">
                <el-button slot="trigger" size="small" type="primary">添加附件</el-button>
              </el-upload>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </el-row>
    <div class="column-btn">
      <el-button
        class="size-btn"
        type="success"
        @click="publishNotice('form')"
        v-preventReClick>发布</el-button>
      <el-button
        class="size-btn"
        type="primary"
        @click="previewNotice('form')"
        v-preventReClick>预览</el-button>
      <el-button class="size-btn" type="warning" @click="cancel()">取消</el-button>
      <!-- <el-button
        class="size-btn"
        @click="draft('form')"
        type="primary"
        v-preventReClick>
        存为草稿
      </el-button> -->
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { addNav, checkTitle } from "@/api/js-wotao-b/columns-list";
import imgUpload from "@/components/nationalSite/columns/img-upload";
import tinymceEditor from "./tinymceEditor";
import detailHead from "@/page/index/top/index";
import * as CodeMsg from "@/api/common/CodeChange";
import PolicyFileUpload from "@/components/file/policyFileUpload";
import { clearDetail } from "@/util/clearDetail";
export default {
  components: {
    tinymceEditor,
    PolicyFileUpload,
    detailHead,
    imgUpload,
  },
  data() {
    var recheck = (rule, value, callback) => {
      checkTitle({ title: value ,substationId: this.$route.query.substationId})
        .then((res) => {
          if (res.data.code === CodeMsg.CODE_2000) {
            return callback(new Error(this.$t("input.titleExisted")));
          } else {
            callback();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    return {
      navName: "",
      columnId: "",
      navType: "",
      substationId: "",
      params: {},
      imgList: [],
      uploadDialog: false, //添加附件
      editorContent: "",
      fileList: [],
      checkFlieRepet: false,
      repeatName: "",
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      rules: {
        title: [
          {
            required: true,
            message: this.$t("input.pleaseInputAticleTitle"),
            trigger: "blur",
          },
          { validator: recheck, trigger: "blur" },
        ],
        sort: [
          {
            required: true,
            message: this.$t("input.pleaseInputSort"),
            trigger: "blur",
          },
          {
            min: 1,
            max: 6,
            message: "请输入正整数",
            pattern: /^[+]{0,1}(\d+)$/,
            trigger: "blur",
          },
        ],
        showStatus: [
          {
            required: true,
            message: this.$t("input.pleaseChooseShowStatus"),
            trigger: "blur",
          },
        ],
        metaTitle: [
          {
            required: true,
            message: this.$t("input.pleaseInputWebTitle"),
            rigger: "blur",
          },
        ],
        metaKeyword: [
          {
            required: true,
            message: this.$t("input.pleaseInputMetaKeywords"),
            trigger: "blur",
          },
        ],
        metaDescription: [
          { required: true, message: "请输入meta描述", trigger: "blur" },
        ],
      },
      labelPosition: "right",
      form: {
        title: "",
        showStatus: 1,
        metaTitle: "",
        metaKeyword: "",
        metaDescription: "",
        createTime: "",
        sort: "1",
      },
      contentNeed: false,
      limit: true,
    };
  },
  methods: {
    toList() {
      clearDetail("/substation/index");
      this.$router.push("/substation/index");
    },
    closeReplace(val) {
      this.uploadDialog = val;
    },
    draft(formName) {
      this.$refs[formName].validateField("title", (valid) => {
        if (!valid) {
          this.savaParams(1);
          addNav(this.params).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "存为草稿成功！",
                offset: 300,
                duration: 1500
              });
              this.toList()
              // this.$router.push({
              //   path: this.$router.$avueRouter.getPath({
              //     name: "草稿箱",
              //     src: "/nationalSite/draft-list/index",
              //   }),
              // });
            }
          });
        } else {
          this.$message({
            type: "warning",
            message: this.$t("alert.checkForm"),
            offset: 300,
            duration: 1500,
          });
        }
      });
    },
    getChildEditor(data) {
      this.editorContent = data;
    },
    wordLimit(val) {
      this.limit = val;
    },
    addNavEassay() {
      if(this.limit){
        this.savaParams(0);
        addNav(this.params).then((res) => {
          if (res.data.code == CodeMsg.CODE_1000) {
            this.$message({
              type: "success",
              message: "添加成功！",
              offset: 300,
              duration: 1500
            });
            sessionStorage.setItem("addEassay", true)
            this.toList();
          }
        });
      }else{
        this.$message({
          type: "warning",
          message: '详情内容字数超出上限！',
          offset: 300,
          duration: 1500,
        });
      }
    },
    finalAdd() {
      if (this.navType == 2 || this.navType == 3) {
        if (this.$refs.upload.imgList.length > 0) {
          this.addNavEassay();
        } else {
          this.$message({
            type: "warning",
            message: "请上传图片封面！",
            offset: 300,
            duration: 1500
          });
        }
      } else if (this.navType == 0 && this.form.showStatus == 1) {
        this.$confirm("该栏目只能显示一条文章，是否显示该文章？", {
          type: "warning",
          cancelButtonClass: "btn-custom-cancel",
        }).then(() => {
          this.addNavEassay();
        });
      } else {
        this.addNavEassay();
      }
    },
    publishNotice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.editorContent.trim() !== "") {
          this.finalAdd();
        } else {
          if (this.editorContent == "" || this.editorContent == "<p><br></p>") {
            this.contentNeed = true;
          }
          this.$message({
            type: "warning",
            message: this.$t("alert.checkForm"),
            offset: 300,
            duration: 1500,
          });
        }
      });
    },
    savaParams(val) {
      this.params = {
        title: this.form.title,
        showStatus: this.form.showStatus,
        metaTitle: this.form.metaTitle,
        metaKeyword: this.form.metaKeyword,
        metaDescription: this.form.metaDescription,
        content: this.editorContent,
        columnId: this.columnId,
        isDraft: val,
        substationId: Number(this.substationId),
      };
      if (this.navType == 0) {
        this.params.isTwnr = 1;
      }
      if (this.fileList.length > 0) {
        let fileList = [];
        this.fileList.forEach((item) => {
          fileList.push({
            name: item.name,
            url: item.response.data,
          });
        });
        this.params.files = fileList;
      }
      if (this.navType !== 0) {
        this.params.sort = this.form.sort;
      }
      if (this.navType == 2 || this.navType == 3) {
        if (this.$refs.upload.imgList.length > 0) {
          this.params.coverUrl = this.$refs.upload.imgList[0].response.data;
        }
      }
    },
    previewNotice(formName) {
      let routeData = this.$router.resolve({
        path: "/preview-nav-qg",
        query: {
          navName: this.navName,
          title: this.form.title,
          content: this.editorContent,
        },
      });
      window.open(routeData.href);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, {
        cancelButtonClass: "btn-custom-cancel",
      });
    },
    changeFile(file, fileList) {
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 20MB!",
          type: "warning",
          offset: 300,
          duration: 1500
        });
      }
      return isLt2M;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    // 取消
    cancel(){
      sessionStorage.setItem("addEassay", true)
      this.toList()
    }
  },
  watch: {
    editorContent(val) {
      if (val !== "") {
        this.contentNeed = false;
      } else {
        this.contentNeed = true;
      }
    },
  },
  created() {
    this.navName = this.$route.query.navName;
    this.columnId = this.$route.query.columnId;
    this.navType = this.$route.query.type;
    this.substationId = this.$route.query.substationId;
  },
};
</script>
<style scoped>
.column-add {
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  /* padding: 20px 100px 50px 30px; */
}
.form-title {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  font-size: 16px;
}
.must:before {
  content: "*";
  color: #f56c6c;
  margin-left: -91px;
}
.content-warning {
  color: #f56c6c;
  font-size: 12px;
}
.deleteBtn {
  margin-left: 10px;
  color: chocolate;
  cursor: pointer;
}
.spaecial-height {
  height: 300px;
}
.column-btn {
  text-align: center;
  margin: 30px 0;
}
.size-btn {
  padding: 10px 20px;
  margin-left: 20px;
}
</style>



