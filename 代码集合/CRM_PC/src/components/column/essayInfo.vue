<template>
  <div class="essay-info">
    <div class="left_span">
      <span></span>
      <span>{{ $t('title.basicParameter') }}</span>
    </div>
    <el-form :model="essayInfo" ref="essayInfo" :rules="rules">
      <table style="margin-left:0px;">
        <tr style="flex:1;">
          <th>
            <span style="color:red;margin-right:2px;">*</span>
            {{ $t('label.articleTitle') }}
          </th>
          <th>
            <span style="color:red;margin-right:2px;">*</span>
            显示状态：
          </th>
          <th>
            <span style="color:red;margin-right:2px;">*</span>
            网页标题：
          </th>
          <th>
            <span style="color:red;margin-right:2px;">*</span>
            {{ $t('label.metaKeyword') }}
          </th>
          <th style="height:80px;">
            <span style="color:red;margin-right:2px;">*</span>
            {{ $t('label.metaDescription') }}
          </th>
         <th v-if="sortShow == 1">
            <span style="color:red;margin-right:2px;">*</span>
            序号：
          </th>
        </tr>
        <tr style="flex:6;">
          <td>
            <el-form-item prop="title">
              <el-input
                size="mini"
                v-model="essayInfo.title"
                style="width:1000px;margin-top:15px;"
                :placeholder="$t('input.noMorethan70')"
                maxlength="70"
                show-word-limit
              ></el-input>
            </el-form-item>
          </td>
          <td class="center-status-sty">
            <el-form-item prop="showStatus">
              <el-radio-group v-model="essayInfo.showStatus">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="2">不显示</el-radio>
              </el-radio-group>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="metaTitle">
              <el-input
                size="mini"
                v-model="essayInfo.metaTitle"
                style="width:1000px;margin-top:15px;"
                :placeholder="$t('input.noMorethan70')"
                maxlength="70"
                show-word-limit
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item prop="metaKeyword">
              <el-input
                size="mini"
                v-model="essayInfo.metaKeyword"
                style="width:1000px;margin-top:15px;"
                :placeholder="$t('input.noMorethan100')"
                maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
          </td>
          <td style="height:80px;">
            <el-form-item prop="metaDescription">
              <el-input
                type="textarea"
                v-model.trim="essayInfo.metaDescription"
                onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                style="width:1000px;margin-top:15px;"
                :placeholder="$t('input.noMorethan200')"
                maxlength="200" show-word-limit
              ></el-input>
            </el-form-item>
          </td>
          <td v-if="sortShow == 1">
            <el-form-item prop="sort">
              <el-input
                @change="essayInfo.sort = oninput(essayInfo.sort)"
                @keyup.native="essayInfo.sort = oninput(essayInfo.sort)"
                type="number"
                style="margin-top:15px;"
                size="mini"
                v-model.trim="essayInfo.sort"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
      </table>
    </el-form>
    <div class="content_splice">
      <div class="content_title">{{ $t('label.detailContent') }}</div>
      <div style="padding-top:21px;width:127%;">
        <tinymce-editor v-model="msg" @getEditorValue="onClick" :disabled="disabled"  @limit='limitNum' ref="editor"></tinymce-editor>
      </div>
    </div>
    <el-form v-if="articleInfo.createUser">
      <table style="margin-left:0px;border-top:none;">
        <tr style="flex:1;">
          <th>{{ $t('label.publishMan') }}</th>
          <th>{{ $t('label.publishTime') }}</th>
          <th>{{ $t('label.updateTime') }}：</th>
        </tr>
        <tr style="flex:6;">
          <td>
            <span v-if="articleInfo.createUser">
            <el-tooltip effect="dark" :content="'工号：'+articleInfo.employeeNumber+'   部门：'+articleInfo.deptName" placement="right">
                 <span>{{ articleInfo.createUser }}</span>
           </el-tooltip>
            
            </span>
          </td>
          <td>
            <span v-if="articleInfo.createTime">{{ articleInfo.createTime }}</span>
          </td>
          <td>
            <span v-if="articleInfo.editTime">{{ articleInfo.editTime }}</span>
          </td>
        </tr>
      </table>
    </el-form>
    <div class="bottom_btn">
      <el-button
        type="primary"
        style="margin-right:30px;width:60px;"
        @click="saveArticle"
        v-preventReClick
        v-if="type == 0"
      >{{ $t('button.save') }}</el-button>
      <el-button
        type="primary"
        style="margin-right:30px;width:60px;"
        @click="editEssay"
        v-preventReClick
        v-if="type == 1"
      >{{ $t('button.modify') }}</el-button>
      <el-button
        type="warning"
        style="margin-right:30px;width:60px;"
        @click="preview"
      >{{ $t('button.preview') }}</el-button>
      <el-button style="width:60px;" @click="toList">{{ $t('button.cancel') }}</el-button>
    </div>
  </div>
</template>

<script>
import {
  addArticle,
  editArticle,
  articleDetail,
  previewColumn
} from "@/api/siteSettings/column";
import tinymceEditor from "./tinymceEditor";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  props: ["id", "type", "essayId", "name","sortShow"],
  components: {
    tinymceEditor
  },
  data() {
    return {
      limit: true, //编辑框字数是否超出 接收子组件传参
      skiBaseUrl: "",
      articleInfo: "",
      msg: "",
      disabled: false,
      essayInfo: {
        title: "",
        metaTitle: "",
        metaKeyword: "",
        metaDescription: "",
        content: "",
        number: "",
        id: "",
        showStatus:1,
        sort:1,
      },
      rules: {
        title: [
          {
            required: true,
            message: this.$t("message.pleaseInput"),
            trigger: "blur"
          }
        ],
        metaTitle: [
          {
            required: true,
            message: this.$t("message.pleaseInput"),
            trigger: "blur"
          }
        ],
        metaDescription: [
          {
            required: true,
            message: this.$t("message.pleaseInput"),
            trigger: "blur"
          }
        ],
        metaKeyword: [
          {
            required: true,
            message: this.$t("message.pleaseInput"),
            trigger: "blur"
          }
        ],
         sort: [
          {
            required: true,
            message: this.$t("message.pleaseInput"),
            trigger: "blur"
          }
        ],
      }
    };
  },
  methods: {
    oninput(value) {
      value = value.replace(/^0*(0\.|[1-9])/, "$1");
      value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
      value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
      value = value
      .replace(".", "$#$")
      .replace(/\./g, "")
      .replace("$#$", ".");
      value = value.replace(/\D|^0/g,'')
      value =
      value.indexOf(".") > 0
        ? value.split(".")[0].substring(0, 5) + "." + value.split(".")[1]
        : value.substring(0, 5);
      return value;
    },
    limitNum(val){
      this.limit = val;
    },
    preview() {
      var newPath = this.$router.resolve({
        path: "/pre-column",
        query: {
          name: this.name,
          content: this.essayInfo.content
        }
      });
      window.open(newPath.href, "_blank");
    },
    getDetail() {
      if (this.essayId !== "" && this.type == 1) {
        articleDetail(this.essayId).then(res => {
          this.articleInfo = res.data.data;
          this.essayInfo.title = this.articleInfo.title;
          this.essayInfo.metaTitle = this.articleInfo.metaTitle;
          this.essayInfo.metaKeyword = this.articleInfo.metaKeyword;
          this.essayInfo.sort = this.articleInfo.sort;
          this.essayInfo.showStatus = this.articleInfo.showStatus;
          this.essayInfo.number = this.articleInfo.number;
          this.essayInfo.id = this.articleInfo.id;
          this.essayInfo.metaDescription = this.articleInfo.metaDescription;
          this.msg = this.articleInfo.content;
          this.essayInfo.content = this.articleInfo.content;
        });
      }
    },
    addEssay(){
       let params = {
                title: this.essayInfo.title,
                metaTitle: this.essayInfo.metaTitle,
                metaKeyword: this.essayInfo.metaKeyword,
                metaDescription: this.essayInfo.metaDescription.replace(/[, ]/g,''),
                content: this.essayInfo.content,
                programId: this.id,
                showStatus: this.essayInfo.showStatus
              };
              if(this.sortShow == 1){
                params.sort = this.essayInfo.sort
              }
              addArticle(params).then(res => {
                if (res.data.code == CodeMsg.CODE_1000) {
                  this.$message({
                    type: "success",
                    message: this.$t("message.addSuccess")
                  });
                  this.toList();
                } else if (res.data.code == CodeMsg.CODE_2000) {
                  this.$message({
                    type: "warning",
                    message: res.data.data
                  });
                }
              });
    },
    editEssay(){
             let params = {
                title: this.essayInfo.title,
                metaTitle: this.essayInfo.metaTitle,
                metaKeyword: this.essayInfo.metaKeyword,
                metaDescription: this.essayInfo.metaDescription.replace(/[, ]/g,''),
                content: this.essayInfo.content,
                showStatus: this.essayInfo.showStatus,
                id: this.essayInfo.id,
                number: this.essayInfo.number
              };
              if(this.sortShow == 1){
                params.sort = this.essayInfo.sort
              }
              editArticle(params).then(res => {
                if (res.data.code == CodeMsg.CODE_1000) {
                  this.$message({
                    type: "success",
                    message: this.$t("button.modifySuccess")
                  });
                  this.toList();
                } else if (res.data.code == CodeMsg.CODE_2000) {
                  this.$message({
                    type: "warning",
                    message: res.data.data
                  });
                }
              });
    },
    saveArticle() {
      this.$refs["essayInfo"].validate(val => {
        if (val) {
          if (this.essayInfo.content !== "" ) {
            if (this.sortShow == 0&&this.essayInfo.showStatus == 1) {
              this.$confirm("图文类栏目只能显示一篇文章，是否确定显示当前文章?", "提示", {
              confirmButtonText: this.$t("button.confirm"),
              cancelButtonText: this.$t("button.cancel"),
              cancelButtonClass: "btn-custom-cancel",
              type: 'warning'
            }).then(() => {
              this.addEssay()
            }).catch(() => {
            });
            } else {
              this.addEssay()
            }
          } else {
            this.$message({
              type: "warning",
              message: this.$t("message.detailContentNotNull")
            });
          }
        }
      });
    },
    onClick(e, editor) {
      this.essayInfo.content = e;
    },
    toList() {
      this.$emit("to-list");
    }
  },
  mounted() {
    this.getDetail();
  }
};
</script>
<style scoped>
.essay-info {
  width: 100%;
  padding-right: 200px;
  background: #fff;
  padding-bottom: 200px;
}
.left_span {
  width: 100px;
  height: 25px;
  display: flex;
  margin: 10px 0 20px 15px;
}
.content_splice {
  display: flex;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  width: 100%;
  height: auto;
}
.content_title {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  width: 260px;
  text-align: right;
  height: auto;
  font-size: 14px;
  font-weight: bold;
}
.left_span > span:nth-of-type(1) {
  display: inline-block;
  width: 10px;
  height: 25px;
  background: #108ee9;
}
.left_span > span:nth-of-type(2) {
  display: flex;
  width: 80px;
  height: 25px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #666666;
  font-weight: bold;
}
table,
th,
td {
  list-style: none;
}
table {
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  display: flex;
}
tr {
  flex: 1;
  display: flex;
  flex-direction: column;
}
th,
td {
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  font-size: 14px;
  height: 100%;
}
th {
  padding-right: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 60px;
  min-width: 160px;
}
td {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 10px;
  height: 60px;
  min-width: 1000px;
}
.bottom_btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}
.center-status-sty{
  padding-top: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>


