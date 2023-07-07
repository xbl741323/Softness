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
              <el-radio label="0" v-if="navType !== 0">{{$t("status.toped")}}</el-radio>
              <el-radio label="1">{{ $t("status.show") }}</el-radio>
              <el-radio label="2">{{ $t("status.noShow") }}</el-radio>
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
          <el-form-item
            :label="$t('label.metaDescription')"
            prop="metaDescription">
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
            v-if="navType == 1 || navType == 2 || navType == 3"
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
              @limit="wordLimit"
              ref="editor"></tinymce-editor>
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
          <el-form-item label="发布人：">
            <span>{{ publishInfo.publishMan }}</span>
          </el-form-item>
          <el-form-item label="发布时间：">
            <span>{{ publishInfo.publishTime }}</span>
          </el-form-item>
          <el-form-item v-if="publishInfo.updateTime !== null" label="修改时间：">
            <span>{{ publishInfo.updateTime }}</span>
          </el-form-item>
          <el-form-item label="浏览量：">
            <span>{{ publishInfo.pageViews }}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
    <div class="column-btn">
      <el-button
        class="size-btn"
        type="success"
        @click="saveNotice('form', false)"
        v-if="beForm == 0"
        v-preventReClick>发布</el-button>
      <el-button
        class="size-btn"
        type="primary"
        @click="saveNotice('form', true)">保存</el-button>
      <el-button
        class="size-btn"
        type="primary"
        @click="previewNotice()"
        v-preventReClick>预览</el-button>
      <el-button class="size-btn" type="warning" @click="cancel()">取消</el-button>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import {
  addNav,
  editNav,
  getNewNavDetail,
  checkTitle,
} from "@/api/js-wotao-b/columns-list";
import imgUpload from "@/components/nationalSite/columns/img-upload";
import tinymceEditor from "@/views/nationalSite/columns/columns-list/tinymceEditor";
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
      checkTitle({ title: value, number: this.number ,substationId: this.$route.query.substationId})
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
      beForm: "",
      navName: "",
      columnId: "",
      navType: "",
      params: {},
      imgList: [],
      substationId: null,
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
      publishInfo: {
        publishMan: null,
        publishTime: null,
        updateTime: null,
        pageViews: 0,
      },
      form: {
        title: "",
        showStatus: 1,
        metaTitle: "",
        metaKeyword: "",
        metaDescription: "",
        createTime: "",
        sort: "1",
        isDraft: "",
      },
      contentNeed: false,
      limit: true,
    };
  },
  methods: {
    toList() {
      if (this.beForm == 1) {
        clearDetail("/substation/index");
        this.$router.push("/substation/index");
      } else if (this.beForm == 0) {
        clearDetail("/nationalSite/draft-list/index");
        this.$router.push({
          path: "/nationalSite/draft-list/index",
          query: {
            substationId: this.substationId
          }
        });
      }
    },
    closeReplace(val) {
      this.uploadDialog = val;
    },
    getChildEditor(data) {
      this.editorContent = data;
    },
    wordLimit(val) {
      this.limit = val;
    },
    editNavEssay(status) {
      if (status) {
        if(this.limit){
          this.savaParams(status);
          editNav(this.params).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "保存成功！",
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
      } else {
        if(this.limit){
          this.savaParams(status);
          addNav(this.params).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "发布成功！",
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
      }
    },
    finalAdd(status) {
      if (this.navType == 2 || this.navType == 3) {
        if (this.$refs.upload.imgList.length > 0) {
          this.editNavEssay(status);
        } else {
          this.$message({
            type: "warning",
            message: "请上传图片封面！",
            offset: 300,
            duration: 1500
          });
        }
      } else if (
        this.navType == 0 &&
        this.form.showStatus == "1" &&
        this.form.isDraft == 0
      ) {
        this.$confirm("该栏目只能显示一条文章，是否显示该文章？", {
          type: "warning",
          cancelButtonClass: "btn-custom-cancel",
        }).then(() => {
          this.editNavEssay(status);
        });
      } else {
        this.editNavEssay(status);
      }
    },
    saveNotice(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.editorContent.trim() !== "") {
          this.finalAdd(status);
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
    savaParams(status) {
      this.params = {
        number: this.number,
        bjlx: 0, // 0编辑 1快速修改
        title: this.form.title,
        showStatus: this.form.showStatus,
        metaTitle: this.form.metaTitle,
        metaKeyword: this.form.metaKeyword,
        metaDescription: this.form.metaDescription,
        content: this.editorContent,
        columnId: this.columnId,
        substationId: this.substationId
      };
      if (status) {
        this.params.bjlx = 0; // 0编辑 1快速修改
        this.params.isDraft = this.form.isDraft; //1草稿 0非草稿
      } else {
        this.params.isDraft = 0; //1草稿 0非草稿
      }
      if (
        this.navType == 0 &&
        this.form.showStatus == "1" &&
        this.form.isDraft == 0
      ) {
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
        this.params.substationId = this.substationId
    },
    previewNotice() {
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
    getDetail() {
      getNewNavDetail(this.number, this.substationId).then((res) => {
        let info = res.data.data;
        this.form.isDraft = info.isDraft;
        this.form.title = info.title;
        this.form.showStatus = info.showStatus;
        this.form.metaTitle = info.metaTitle;
        this.form.metaKeyword = info.metaKeyword;
        this.form.metaDescription = info.metaDescription;
        this.form.sort = info.sort;
        this.editorContent = info.content;
        this.publishInfo.publishMan = info.createUser;
        this.publishInfo.publishTime = info.createTime;
        this.publishInfo.updateTime = info.lastModifiedDate;
        this.publishInfo.pageViews = info.pageViews;
        if (info.files.length > 0) {
          this.fileList = [];
          info.files.forEach((item) => {
            this.fileList.push({
              name: item.name,
              response: {
                data: item.url,
              },
            });
          });
        }
        if (this.$refs.upload) {
          this.$refs.upload.imgList =
            info.coverUrl == null
              ? []
              : [{ response: { data: info.coverUrl } }];
        }
      });
    },
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
    this.beForm = this.$route.query.form;
    this.navName = this.$route.query.navName;
    this.columnId = this.$route.query.columnId;
    this.navType = this.$route.query.type;
    this.number = this.$route.query.number;
    this.substationId = this.$route.query.substationId
  },
  mounted() {
    this.getDetail();
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



