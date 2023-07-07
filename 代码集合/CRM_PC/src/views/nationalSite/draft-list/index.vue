<template>
  <basic-container>
    <div class="column-list">
      <el-form :inline="true" :model="filters" ref="filters" @submit.native.prevent>
        <el-form-item label="关键字：" prop="keyWords">
          <el-input
            @keyup.enter.native="getAllList()"
            placeholder="请输入文章标题关键字"
            v-model.trim="filters.keyWords"></el-input>
        </el-form-item>
        <el-form-item label="所属导航：" prop="navType">
          <el-select v-model="filters.navType">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="(item, index) in siderList"
              :key="index"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间：" prop="publishTime">
          <el-date-picker
            v-model="filters.publishTime"
            :unlink-panels="true"
            format="yyyy-MM-dd HH:mm"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="getAllList()">搜索</el-button>
        <el-button type="warning" @click="resetForm('filters')">重置</el-button>
        <div>
          <el-form-item label="批量操作：">
            <el-button
              type="danger"
              :disabled="selectionList.length > 0 ? false : true"
              icon="el-icon-delete"
              @click="mutilDelete">删除</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 列表区域 -->
      <div>
        <avue-crud
          class="batch-choose"
          ref="crud"
          :page.sync="page"
          :data="dataList"
          :option="tableOption"
          :table-loading="tableLoading"
          @selection-change="selectionChange"
          @on-load="getList">
          <template slot="number" slot-scope="scope">
            <span @click="handleEdit(scope.row)" id="handle-style">{{ scope.row.number }}</span>
          </template>
          <template id="handle-style" slot="title" slot-scope="scope">
            <span @click="handleEdit(scope.row)" id="handle-style">{{ scope.row.title }}</span>
          </template>
          <template slot="createUser" slot-scope="scope">
            <el-tooltip effect="dark" :content="'工号：' + scope.row.userId + '   部门：' + scope.row.deptName" placement="right">
              <span>{{ scope.row.createUser }}</span>
            </el-tooltip>
          </template>
          <template slot="area" slot-scope="scope">
            {{ scope.row.areaName }}{{ scope.row.provincialName }}
          </template>
          <template slot="showStatus" slot-scope="scope">
            <el-select v-model="scope.row.showStatus" @change="changeStatus(scope.row)">
              <el-option label="置顶" value="0" v-if="scope.row.type !== 0"></el-option>
              <el-option label="显示" value="1"></el-option>
              <el-option label="不显示" value="2"></el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleFastEdit(scope.row)">快速修改</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="handlDelete(scope.row)">删除</el-button>
          </template>
        </avue-crud>
        <!-- dialog快速修改 -->
        <el-dialog
          title="快速修改"
          :visible.sync="fastVisible"
          width="30%"
          :center="true"
          :before-close="handleClose">
          <el-form
            :model="fastForm"
            ref="fastForm"
            label-width="110px"
            :rules="fastRules">
            <el-form-item label="文章标题：" prop="title">
              <el-input
                v-model="fastForm.title"
                maxlength="70"
                placeholder="请填写"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="显示状态：" prop="showStatus">
              <el-radio-group v-model="fastForm.showStatus">
                <el-radio label="0" v-if="columnInfo.type !== '0'">置顶</el-radio>
                <el-radio label="1">显示</el-radio>
                <el-radio label="2">不显示</el-radio>
              </el-radio-group>
            </el-form-item>
            <img-upload v-if="columnInfo.type == 2 || columnInfo.type == 3" ref="upload"></img-upload>
            <el-form-item label="网页标题：" prop="metaTitle">
              <el-input
                v-model="fastForm.metaTitle"
                placeholder="请填写"
                maxlength="70"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="meta关键字：" prop="metaKeyword">
              <el-input
                v-model="fastForm.metaKeyword"
                placeholder="请填写"
                maxlength="100"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="meta描述：" prop="metaDescription">
              <el-input
                type="textarea"
                v-model="fastForm.metaDescription"
                placeholder="请填写"
                maxlength="200"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item
              v-if="columnInfo.type !== '0'"
              label="序号："
              prop="sort">
              <el-input
                @change="fastForm.sort = oninput(fastForm.sort)"
                @keyup.native="fastForm.sort = oninput(fastForm.sort)"
                type="number"
                v-model.trim="fastForm.sort"
                placeholder="请填写"></el-input>
            </el-form-item>
          </el-form>
          <div class="fast-edit">
            <el-button
              type="success"
              class="fast-save-sty"
              v-preventReClick
              @click="publishNav('fastForm', false)">发布</el-button>
            <el-button
              type="primary"
              class="fast-save-sty"
              v-preventReClick
              @click="publishNav('fastForm', true)">保存</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </basic-container>
</template>
<script>
import { getBannerNav } from "@/api/js-wotao-b/banner";
import imgUpload from "@/components/nationalSite/columns/img-upload";
import * as CodeMsg from "@/api/common/CodeChange"
import { saveDetal } from "@/util/clearDetail";
import {
  addNav,
  getDraftList,
  changeNavStatus,
  editNav,
  deleteNav,
  multiDeleteNav,
  getNavDetail,
  checkTitle,
} from "@/api/js-wotao-b/columns-list";
import { tableOption } from "@/const/crud/js-wotao-b/draft-list";
export default {
  components: {
    imgUpload,
  },
  data() {
    var recheck = (rule, value, callback) => {
      checkTitle({ title: value, number: this.fastForm.number })
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
      fileList: [],
      siderList: [],
      columnInfo: {},
      page: {
        total: 0,
        layout: "total,prev,pager,next, jumper",
        currentPage: 1,
        pageSize: 20,
      },
      params: {},
      selectionList: [],
      areaOptionId: "",
      tableLoading: false,
      fastVisible: false,
      fastForm: {
        title: "",
        showStatus: "",
        metaTitle: "",
        metaKeyword: "",
        metaDescription: "",
        sort: "",
        isDraft: "",
        content: "",
      },
      fastRules: {
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
          { required: true, message: "请输入mate描述", trigger: "blur" },
        ],
      },
      batchVal: [],
      dataList: [],
      tableOption: tableOption,
      optionList: [
        { name: "置顶", value: "0" },
        { name: "显示", value: "1" },
        { name: "不显示", value: "2" },
      ],
      filters: {
        keyWords: "",
        showStatus: null,
        publishTime: [],
        navType: null,
      },
      substationId: null
    };
  },
  methods: {
    // 多选框取消选择
    toggleSelection(val) {
      this.$refs.crud.toggleSelection(val);
    },
    mutilDelete() {
      this.$confirm("确认删除？", {
        type: "warning",
        cancelButtonClass: "btn-custom-cancel",
      })
        .then(() => {
          multiDeleteNav({ numbers: this.selectionList, substationId: this.substationId}).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "删除成功！",
                offset: 300,
              });
              this.selectionList = [];
              this.toggleSelection(this.batchVal);
              this.getAllList();
            }
          });
        })
        .catch(() => {
          this.selectionList = [];
          this.toggleSelection(this.batchVal);
          this.getAllList();
        });
    },
    changeStatus(val) {
      this.$confirm("确认修改？", {
        type: "warning",
        cancelButtonClass: "btn-custom-cancel",
      })
        .then(() => {
          let params = {
            number: val.number,
            showStatus: val.showStatus,
          };
          changeNavStatus(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "修改成功！",
                offset: 300,
              });
              this.getAllList();
            }
          });
        })
        .catch(() => {
          this.getAllList();
        });
    },
    oninput(value) {
      value = value.replace(/^0*(0\.|[1-9])/, "$1");
      value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
      value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
      value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      value = value.replace(/\D|^0/g, "");
      value =
        value.indexOf(".") > 0
          ? value.split(".")[0].substring(0, 5) + "." + value.split(".")[1]
          : value.substring(0, 5);
      return value;
    },
    addNavEssay(status) {
      this.savaParams(status);
      addNav(this.params).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: "发布成功！",
            offset: 300,
          });
          this.fastVisible = false;
          this.getAllList();
        }
      });
    },
    operateNav(status) {
      if (status) {
        this.savaParams(status);
        editNav(this.params).then((res) => {
          if (res.data.code == CodeMsg.CODE_1000) {
            this.$message({
              type: "success",
              message: "保存成功！",
              offset: 300,
            });
            this.fastVisible = false;
            this.getAllList();
          }
        });
      } else {
        if (this.columnInfo.type == 0 && this.fastForm.showStatus == "1") {
          this.$confirm("该栏目只能显示一条文章，是否显示该文章？", {
            type: "warning",
            cancelButtonClass: "btn-custom-cancel",
          }).then(() => {
            this.addNavEssay();
          });
        } else {
          this.addNavEssay();
        }
      }
    },
    finalEdit(status) {
      if (this.columnInfo.type == 2 || this.columnInfo.type == 3) {
        if (this.$refs.upload.imgList.length > 0) {
          this.operateNav(status);
        } else {
          this.$message({
            type: "warning",
            message: "请上传图片封面！",
            offset: 300,
          });
        }
      } else {
        this.operateNav(status);
      }
    },
    publishNav(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.finalEdit(status);
        }
      });
    },
    savaParams(num) {
      this.params = {
        title: this.fastForm.title,
        showStatus: this.fastForm.showStatus,
        metaTitle: this.fastForm.metaTitle,
        metaKeyword: this.fastForm.metaKeyword,
        metaDescription: this.fastForm.metaDescription,
        content: this.fastForm.content,
        columnId: this.columnInfo.lmId,
        number: this.fastForm.number,
        substationId: this.substationId,
      };
      if (num) {
        this.params.bjlx = 1; // 0编辑 1快速修改
        this.params.isDraft = 1; //1草稿 0非草稿
      } else {
        if (this.columnInfo.type == 0) {
          this.params.isTwnr = 1;
        }
        this.params.isDraft = 0; //1草稿 0非草稿
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
      }
      if (this.columnInfo.type !== 0) {
        this.params.sort = this.fastForm.sort;
      }
      if (this.columnInfo.type == 2 || this.columnInfo.type == 3) {
        if (this.$refs.upload.imgList.length > 0) {
          this.params.coverUrl = this.$refs.upload.imgList[0].response.data;
        }
      }
    },
    handleClose() {
      this.fastVisible = false;
    },
    selectionChange(val) {
      this.batchVal = [];
      this.batchVal = val;
      this.selectionList = [];
      val.forEach((item) => {
        this.selectionList.push(item.number);
      });
    },
    handleFastEdit(row) {
      this.columnInfo = row;
      this.fastVisible = true;
      getNavDetail(row.number).then((res) => {
        let info = res.data.data;
        this.fastForm.number = info.number;
        this.fastForm.title = info.title;
        this.fastForm.showStatus = info.showStatus;
        this.fastForm.metaTitle = info.metaTitle;
        this.fastForm.metaKeyword = info.metaKeyword;
        this.fastForm.metaDescription = info.metaDescription;
        this.fastForm.sort = info.sort;
        this.fastForm.isDraft = info.isDraft;
        this.fastForm.content = info.content;
        if (this.columnInfo.type == 2 || this.columnInfo.type == 3) {
          this.$refs.upload.imgList =
            info.coverUrl == null
              ? []
              : [{ response: { data: info.coverUrl } }];
        }
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
      });
    },
    handleEdit(row) {
      this.columnInfo = row;
      let path = "/edit-nav-b";
      let query = {
        number: row.number,
        navName: this.columnInfo.name,
        type: Number(this.columnInfo.type),
        columnId: this.columnInfo.lmId,
        form: 0,
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    handlDelete(row) {
      this.$confirm("确认删除？", {
        type: "warning",
        cancelButtonClass: "btn-custom-cancel",
      })
        .then(() => {
          deleteNav({number: row.number, substationId: this.substationId}).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "删除成功！",
                offset: 300,
              });
              this.getAllList();
            }
          });
        })
        .catch(() => {
          this.getAllList();
        });
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      let params = {
        title: this.filters.keyWords,
        start: this.page.currentPage,
        size: this.page.pageSize,
        isDraft: 1,
        substationId: this.substationId,
        columnId: this.filters.navType,
        startDateStr:
          this.filters.publishTime[0] != null
            ? this.$moment(this.filters.publishTime[0]).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : "",
        endDateStr:
          this.filters.publishTime[1] != null
            ? this.$moment(this.filters.publishTime[1]).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : "",
      };
      // 需要缓存的参数
      let keepParams = {
        params: params,
        publishTime: this.filters.publishTime,
        detail: { path: "", query: {} },
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getDraftList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.dataList = res.data.data.list;
          this.page.total = res.data.data.total;
        }
      });
    },
    // 搜索重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.filters.keyWords = "";
      this.filters.navType = null;
      this.filters.publishTime = [];
      this.getAllList();
    },
    getNav() {
      getBannerNav(1).then((res) => {
        this.siderList = [];
        res.data.data.forEach((item) => {
          if (
            item.type == 0 ||
            item.type == 1 ||
            item.type == 2 ||
            item.type == 3
          ) {
            this.siderList.push(item);
          }
        });
      });
    },
  },
  created() {
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      if (keepParams.detail.path !== "") {
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query,
        });
        return;
      }
      this.filters.keyWords = keepParams.params.title;
      this.page.currentPage = keepParams.params.start;
      this.page.pageSize = keepParams.params.size;
      this.filters.navType = keepParams.params.columnId;
      this.filters.publishTime = keepParams.publishTime;
    }
    this.substationId = this.$route.query.substationId
  },
  mounted() {
    this.getNav();
  },
};
</script>

<style scoped>
.column-list {
  margin-top: 15px;
}
.filter_punt_sty {
  margin: 5px 0px 10px 0px;
}
.filter_punt_sty span {
  font-size: 14px;
  color: #606266;
  width: 70px;
  text-align: right;
  display: inline-block;
}
.filter_column_province {
  display: flex;
  flex-direction: column;
}
.filter_column_province span {
  font-size: 14px;
  color: #606266;
}
.column_province {
  margin-left: 0px;
  display: flex;
  align-items: center;
}
.column_province span {
  font-size: 14px;
  color: #606266;
  width: 70px;
  text-align: right;
  display: inline-block;
}
.province_child {
  margin-left: 70px;
}
.radio_item:nth-of-type(1) {
  border-left: none;
}
.radio_item {
  margin-right: 10px;
  margin-top: 10px;
  border-left: 1px solid #dcdfe6;
  border-radius: 0px 0px 0px 0px;
}
.fast-edit {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fast-save-sty {
  margin-right: 50px;
}
#handle-style {
  color: rgb(64, 158, 255) !important;
  cursor: pointer;
}
</style>