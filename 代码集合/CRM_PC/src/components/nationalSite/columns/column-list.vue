<template>
  <div class="column-list">
    <el-form
      :inline="true"
      :model="filters"
      ref="filters"
      label-width="90px"
      @keyup.enter.native="getFirstAllList()">
      <el-form-item label="关键字：" prop="keyWords">
        <el-input placeholder="请输入文章标题关键字" v-model.trim="filters.keyWords"></el-input>
      </el-form-item>
      <el-form-item label="显示状态：" prop="showStatus">
        <el-select v-model="filters.showStatus">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="置顶" :value="0" v-if="columnInfo.type!==0"></el-option>
            <el-option label="显示" :value="1"></el-option>
            <el-option label="不显示" :value="2"></el-option>
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
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getFirstAllList()">搜索</el-button>
      <el-button type="warning" @click="resetForm('filters')">重置</el-button>
      <el-button type="success" @click="addEassy()">新建文章</el-button>
      <div>
        <el-form-item label="批量操作：">
          <el-button type="danger" :disabled="selectionList.length>0?false:true" icon="el-icon-delete" @click="mutilDelete">删除</el-button>
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
        @on-load="columnInfo.id ? getList() : ''">
        <template slot="number" slot-scope="scope">
          <span @click="handleEdit(scope.row)" id="handle-style">{{ scope.row.number }}</span>
        </template>
        <template slot="title" slot-scope="scope">
          <span @click="handleEdit(scope.row)" id="handle-style">{{ scope.row.title }}</span>
        </template>
        <template slot="createUser" slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+scope.row.userId+'   部门：'+scope.row.deptName" placement="right">
          <span>{{ scope.row.createUser }}</span>
          </el-tooltip>
        </template>
        <template slot="area" slot-scope="scope">
          {{ scope.row.areaName }}{{ scope.row.provincialName }}
        </template>
        <template slot="pageViews" slot-scope="scope">
          {{ scope.row.pageViews|viewFilter }}
        </template>
        <template slot="showStatus" slot-scope="scope">
          <el-select v-model="scope.row.showStatus" @change="changeStatus(scope.row)">
            <el-option label="置顶" value="0" v-if="columnInfo.type!==0"></el-option>
            <el-option label="显示" value="1"></el-option>
            <el-option label="不显示" value="2"></el-option>
          </el-select>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button type="text" icon="el-icon-edit" @click="handleFastEdit(scope.row)">快速修改</el-button>
          <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="handlDelete(scope.row)">删除</el-button>
        </template>
      </avue-crud>
      <!-- dialog快速修改 -->
      <el-dialog
        title="快速修改"
        :visible.sync="fastVisible"
        width="30%"
        :center="true"
        :before-close="handleClose">
          <el-form :model="fastForm" ref="fastForm" label-width="110px" :rules="fastRules">
            <el-form-item label="文章标题：" prop="title">
              <el-input v-model="fastForm.title" maxlength="70" placeholder="请填写" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="显示状态：" prop="showStatus">
              <el-radio-group v-model="fastForm.showStatus">
                <el-radio label="0" v-if="columnInfo.type!==0">置顶</el-radio>
                <el-radio label="1">显示</el-radio>
                <el-radio label="2">不显示</el-radio>
              </el-radio-group>
            </el-form-item>
            <img-upload v-if="columnInfo.type == 2||columnInfo.type == 3" ref="upload"></img-upload>
            <el-form-item label="网页标题：" prop="metaTitle">
              <el-input v-model="fastForm.metaTitle" placeholder="请填写" maxlength="70" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="meta关键字：" prop="metaKeyword">
              <el-input v-model="fastForm.metaKeyword" placeholder="请填写" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="meta描述：" prop="metaDescription">
              <el-input type="textarea" v-model="fastForm.metaDescription" placeholder="请填写" maxlength="200" show-word-limit></el-input>
            </el-form-item>
            <el-form-item v-if="columnInfo.type!== 0" label="序号：" prop="sort">
              <el-input 
              @change="fastForm.sort = oninput(fastForm.sort)"
              @keyup.native="fastForm.sort = oninput(fastForm.sort)"
              type="number" 
              v-model.trim="fastForm.sort" 
              placeholder="请填写"></el-input>
            </el-form-item>
          </el-form>
          <div class="fast-edit">
            <el-button type="primary" class="fast-save-sty" v-preventReClick @click="fastEdit('fastForm')">保存</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import imgUpload from "@/components/nationalSite/columns/img-upload";
import {
  getNavList,
  changeNavStatus,
  editNav,
  deleteNav,
  multiDeleteNav,
  getNewNavDetail,
  checkTitle,
} from "@/api/js-wotao-b/columns-list";
import * as CodeMsg from "@/api/common/CodeChange";
import { tableOption } from "@/const/crud/js-wotao-b/column-list";
import { saveDetal } from "@/util/clearDetail";
export default {
  components: {
    imgUpload,
  },
  props: ["columnInfo","substationId"],
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
      clickStatus: false,
      page: {
        total: 0,
        layout: "total,prev,pager,next, jumper",
        currentPage: 1,
        pageSize: 20,
      },
      params: {},
      selectionList: [],
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
      },
    };
  },
  filters: {
    viewFilter(val) {
      if (val / 10000 >= 1) {
        return (val / 10000).toFixed(2) + "万";
      } else {
        return val;
      }
    },
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
          multiDeleteNav({ numbers: this.selectionList, substationId: this.substationId }).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "删除成功！",
                offset: 300,
                duration: 1500
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
      this.$confirm(
        this.columnInfo.type == 0 && val.showStatus == "1"
          ? "该栏目只能显示一条文章，是否显示该文章？"
          : "确认修改？",
        {
          type: "warning",
          cancelButtonClass: "btn-custom-cancel",
        }
      )
        .then(() => {
          let params = {
            number: val.number,
            showStatus: val.showStatus,
            substationId: this.substationId,
          };
          if (this.columnInfo.type == 0 && val.showStatus == "1") {
            params.isTwnr = 1;
          }
          changeNavStatus(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "修改成功！",
                offset: 300,
                duration: 1500
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
    editNavEssay() {
      this.savaParams();
      editNav(this.params).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: "保存成功！",
            offset: 300,
            duration: 1500
          });
          this.fastVisible = false;
          this.getAllList();
        }
      });
    },
    finalAdd() {
      if (this.columnInfo.type == 2 || this.columnInfo.type == 3) {
        if (this.$refs.upload.imgList.length > 0) {
          this.editNavEssay();
        } else {
          this.$message({
            type: "warning",
            message: "请上传图片封面！",
            offset: 300,
            duration: 1500
          });
        }
      } else if (this.columnInfo.type == 0 && this.fastForm.showStatus == "1") {
        this.$confirm("该栏目只能显示一条文章，是否显示该文章？", {
          type: "warning",
          cancelButtonClass: "btn-custom-cancel",
        }).then(() => {
          this.editNavEssay();
        });
      } else {
        this.editNavEssay();
      }
    },
    fastEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.finalAdd();
        }
      });
    },
    savaParams() {
      this.params = {
        number: this.fastForm.number,
        bjlx: 1, // 0编辑 1快速修改
        title: this.fastForm.title,
        showStatus: this.fastForm.showStatus,
        metaTitle: this.fastForm.metaTitle,
        metaKeyword: this.fastForm.metaKeyword,
        metaDescription: this.fastForm.metaDescription,
        columnId: this.columnInfo.id,
        isDraft: this.fastForm.isDraft, //1草稿 0非草稿
        substationId: this.substationId,
      };
      if (this.columnInfo.type == 0) {
        this.params.isTwnr = 1;
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
    addEassy() {
      let path = "/add-nav-qg";
      let query = {
        navName: this.columnInfo.name,
        type: this.columnInfo.type,
        columnId: this.columnInfo.id,
        substationId: this.substationId
      };
      sessionStorage.setItem("nationalSite",JSON.stringify(this.columnInfo))
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
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
      this.fastVisible = true;
      sessionStorage.setItem("nationalSite",JSON.stringify(this.columnInfo))
      getNewNavDetail(row.number, this.substationId).then((res) => {
        let info = res.data.data;
        this.fastForm.number = info.number;
        this.fastForm.title = info.title;
        this.fastForm.showStatus = info.showStatus;
        this.fastForm.metaTitle = info.metaTitle;
        this.fastForm.metaKeyword = info.metaKeyword;
        this.fastForm.metaDescription = info.metaDescription;
        this.fastForm.sort = info.sort;
        this.fastForm.isDraft = info.isDraft;
        if (this.columnInfo.type == 2 || this.columnInfo.type == 3) {
          this.$refs.upload.imgList =
            info.coverUrl == null
              ? []
              : [{ response: { data: info.coverUrl } }];
        }
      });
    },
    handleEdit(row) {
      sessionStorage.setItem("nationalSite",JSON.stringify(this.columnInfo))
      let path = "/edit-nav-qg";
      let query = {
        number: row.number,
        navName: this.columnInfo.name,
        type: this.columnInfo.type,
        columnId: this.columnInfo.id,
        form: 1,
        substationId: this.substationId
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    handlDelete(row) {
      sessionStorage.setItem("nationalSite",JSON.stringify(this.columnInfo))
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
                duration: 1500
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
    getFirstAllList() {
      this.clickStatus = true;
      this.getAllList();
    },
    getList() {
      let params = {
        title:  this.clickStatus == true?(this.filters.keyWords):"", // 已缓存
        showStatus: this.clickStatus == true?(this.filters.showStatus):null, // 已缓存
        start: this.page.currentPage, // 已缓存
        size: this.page.pageSize, // 已缓存
        isDraft: 0,
        columnId: this.columnInfo.id,
        startDateStr:this.clickStatus == true?
         (this.filters.publishTime!=null
            ? this.$moment(this.filters.publishTime[0]).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : ""
         ):"",
        endDateStr:this.clickStatus == true?
         (this.filters.publishTime!=null
            ? this.$moment(this.filters.publishTime[1]).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : ""
         ):"",
         substationId: this.substationId
      };
      // 需要缓存的参数
      let keepParams = {
        clickStatus:this.clickStatus,
        params: params,
        publishTime: this.filters.publishTime,
        detail: { path: "", query: {} },
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getNavList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.dataList = res.data.data.list;
          this.page.total = res.data.data.total;
          sessionStorage.removeItem("nationalSite")
        }
      });
    },
    alltOption() {
      this.tableOption.column = [];
      let columnList = [
        {
          label: "文章编号",
          prop: "number",
          slot: true,
          width: 130,
          overHidden: true,
        },
        { label: "标题", prop: "title", slot: true, overHidden: true },
        { label: "发布人", prop: "createUser", slot: true, overHidden: true },
        {
          label: "发布时间",
          prop: "createTime",
          type: "datetime",
          format: "yyyy-MM-dd HH:mm",
          valueFormat: "yyyy-MM-dd HH:mm",
          overHidden: true,
        },
        {
          label: "显示状态",
          prop: "showStatus",
          slot: true,
          width: 100,
          overHidden: true,
        },
        {
          label: "浏览量",
          prop: "pageViews",
          slot: true,
          width: 100,
          overHidden: true,
        },
      ];
      if (this.columnInfo.type !== 0) {
        columnList.unshift({ label: "序号", prop: "sort", width: 50 });
      }
      columnList.forEach((item) => {
        this.tableOption.column.push(item);
      });
    },
    // 搜索重置
    resetForm(formName) {
      this.clickStatus = false;
      this.$refs[formName].resetFields();
      this.filters.keyWords = "";
      this.filters.showStatus = null;
      this.filters.publishTime = null;
      this.getAllList();
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
      if (this.columnInfo.type == 0 && keepParams.params.showStatus == 0) {
        this.filters.showStatus = null;
      } else {
        this.filters.showStatus = keepParams.params.showStatus;
      }
      this.page.currentPage = keepParams.params.start;
      this.page.pageSize = keepParams.params.size;
      this.filters.publishTime = keepParams.publishTime;
      this.clickStatus = keepParams.clickStatus;
    }
    if(this.filters.showStatus==undefined){
      this.filters.showStatus = null;
    }
  },
  mounted() {
    this.alltOption();
  },
};
</script>

<style scoped>
.column-list {
  margin-top: 15px;
  width: 98%;
}
.filter_punt_sty {
  margin: 5px 0px 10px 0px;
}
.filter_punt_sty span {
  font-size: 14px;
  color: #606266;
  width: 78px;
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
  width: 78px;
  text-align: right;
  display: inline-block;
}
.js_province_child {
  margin-left: 78px;
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