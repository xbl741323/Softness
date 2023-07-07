<template>
  <div class="column_list">
    <div class="friendly_sty"> <el-form ref="form" :model="form" :inline="true">
        <el-form-item prop="keyWords">
          <el-input style="width: 300px;" v-model="form.keyWords" placeholder="请输入名称进行搜索"></el-input>
        </el-form-item>
        <template>
          <el-button type="primary" @click="getList()">搜索</el-button>
          <el-button  @click="resetForm()">重置</el-button>
          <span class="button_poa">
            <el-button :disabled="page.total >= 50" type="primary" @click="interLinkage()">创建链接</el-button>
            <el-tooltip class="item" effect="dark" content="最多添加50条链接" placement="top">
              <div class="prompt_sty">?</div>
            </el-tooltip>
          </span>
        </template>
      </el-form>
      <avue-crud ref="crud" :data="dataList" :option="tableOption" @size-change="sizeChange"
        @current-change="currentChange" :page.sync="page" v-loading="tableLoading">
        <template v-slot:menuHeader>
          <div class="menuHeader_sty">
            <span>操作</span><span class="common-link" @click="deleteBatchTmFriendLink()">清空</span>
          </div>
        </template>
        <template slot="linkUrl" slot-scope="scope">
          <span class="common-link" @click="openNewLink(scope.row.linkUrl)">{{ scope.row.linkUrl }}</span>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" @click="handldEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleRemover(scope.row)">删除</el-button>
        </template>
      </avue-crud>
      <el-dialog :close-on-click-modal="false"  :title="upDateOrAddState ? '新建链接' : '编辑链接'"
        :visible.sync="addUpdateDialogVisible" width="40%" :before-close="handleClose">
        <el-form ref="addUpdateForm" label-position="right" :rules="rules" label-width="90px" :model="formLabelAlign">
          <el-form-item prop="sort">
            <template #label>
              <span>序号:</span>
            </template>
            <el-input v-model.number="formLabelAlign.sort" type='number' :maxlength="8" placeholder="请输入数字"></el-input>
            <span class="annotation_sty">序号决定在客户端的排序，数字越小越靠前</span>
          </el-form-item>
          <el-form-item prop="linkName">
            <template #label>
              <span>链接名称:</span>
            </template>
            <el-input v-model="formLabelAlign.linkName" show-word-limit maxlength="30" placeholder="请输入链接名称"></el-input>
          </el-form-item>
          <el-form-item prop="linkUrl">
            <template #label>
              <span>链接地址:</span>
            </template>
            <el-input v-model="formLabelAlign.linkUrl" placeholder="请输入链接地址"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUpdateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTmFriendLink()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { tableOption } from "@/const/crud/substation/friendly-link";
import * as CodeMsg from "@/api/common/CodeChange";
import {
  getTmFriendLinkPage,
  addTmFriendLink,
  updateTmFriendLink,
  removerByIdTmFriendLink,
  deleteBatchTmFriendLink,
  getTmFriendLinkCheckName
} from "@/api/substation/index";
export default {
  props: {
    substationId: {
      type: Number,
      required: true,
    },
    substationName: {
      type: String,
      required: true,
    },
  },
  data() {
    var recheck = (rule, value, callback) => {
      const data = {
        linkName: value,
        substationId: this.substationId,
      };
      if (!this.upDateOrAddState) {
        data.id = this.formLabelAlign.id;
      }
      getTmFriendLinkCheckName(data).then((res) => {
        if (res.data.code != CodeMsg.CODE_0) {
          return callback(new Error(this.$t("input.nameExisted")));
        } else {
          callback();
        }
      }).catch((err) => { });
    };
    return {
      upDateOrAddState: false,
      formLabelAlign: {
        sort: "",
        linkName: "",
        linkUrl: "",
      },
      addUpdateDialogVisible: false,
      tableLoading: false,
      dataList: [],
      tableOption: tableOption,
      page: {
        currentPage: 1,
        total: 0,
        layout: "total, sizes, prev, pager, next, jumper",
        background: true,
        pageSizes: [5, 8, 10, 20, 30, 40, 50, 100], //选择每页显示条数
        pageSize: 10,
      },
      form: {
        keyWords: "",
      },
      rules: {
        sort: [{ required: true, message: "请输入序号", trigger: "blur" }],
        linkName: [
          { required: true, message: "请输入链接名称", trigger: "blur" },
          { validator: recheck, trigger: "blur" },
          { max: 30, message: '名称长度不能超过30个字符', trigger: 'blur' }
        ],
        linkUrl: [
          { required: true, message: "请输入链接地址", trigger: "blur" },
          {
            pattern: /^(https?|ftp):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/,
            message: "请输入正确的链接地址",
            trigger: "blur",
          },
        ],
      },
    };

  },
  created() {
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepData = JSON.parse(sessionStorage.getItem('FriendLinkData'));
      this.form.keyWords = keepData.keyword;
      this.page.currentPage = keepData.pageNo;
      this.page.pageSize = keepData.pageSize;
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 分站id批量删除分站友情链接
    async deleteBatchTmFriendLink() {
      let res = await deleteBatchTmFriendLink({
        substationId: this.substationId,
      });
      if (res.data.code == CodeMsg.CODE_0) {
        this.getList();
        this.$message({
          type: "success",
          message: "批量删除成功",
          duration: 2000
        });
      } else {
        this.$message({
          type: "error",
          message: res.data.msg,
        });
      }
    },
    // 修改分站友情链接
    handldEdit(row) {
      this.upDateOrAddState = false
      this.formLabelAlign = Object.assign({}, row);
      this.addUpdateDialogVisible = true;
    },
    // 通过id删除分站友情链接
    async handleRemover(row) {
      let res = await removerByIdTmFriendLink({ id: row.id });
      if (res.data.code == CodeMsg.CODE_0) {
        this.getList();
        this.$message({
          type: "success",
          message: "删除成功",
          duration: 2000
        });
      } else {
        this.$message({
          type: "error",
          message: res.data.msg,
        });
      }
    },
    getFirstAllList() { },
    //分站友情链接 后台-分页查询
    async getList() {
      this.tableLoading = true;
      let keepData = {
        substationId: this.substationId,
        keyword: this.form.keyWords, //关键字
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      sessionStorage.setItem('FriendLinkData', JSON.stringify(keepData));
      let res = await getTmFriendLinkPage(keepData);
      if (res.data.code == CodeMsg.CODE_0) {
        this.dataList = res.data.data.records;
        this.page.total = res.data.data.total;
        this.tableLoading = false;
      }
    },
    resetForm() {
      this.form.keyWords = ''
      this.page.currentPage = 1
      this.form.pageSize = 20
      this.getList()
    },
    // 新增分站友情链接
    async addTmFriendLink() {
      const valid = await this.$refs.addUpdateForm.validate();
      if (!valid) {
        return;
      }
      const data = {
        sort: this.formLabelAlign.sort,
        linkName: this.formLabelAlign.linkName,
        linkUrl: this.formLabelAlign.linkUrl,
        substationId: this.substationId,
      };
      if (!this.upDateOrAddState) {
        data.id = this.formLabelAlign.id;
      }
      const res = await (this.upDateOrAddState ? addTmFriendLink(data) : updateTmFriendLink(data));
      if (res.data.code === CodeMsg.CODE_0) {
        this.getList();
        this.$message({
          type: "success",
          message: this.upDateOrAddState ? "新增友情链接成功" : "编辑友情链接成功",
          duration: 2000
        });
      } else {
        this.$message({
          type: "error",
          message: res.data.msg,
        });
      }
      this.addUpdateDialogVisible = false;
      this.upDateOrAddState = false;
    },
    openNewLink(linkUrl) {
      window.open(linkUrl, '_blank');
    },
    interLinkage() {
      this.$nextTick(() => {
        this.$refs.addUpdateForm.resetFields() // 重置表单
      })
      // this.formLabelAlign = {
      //   sort: "",
      //   linkName: "",
      //   linkUrl: "",
      // }
      this.upDateOrAddState = true
      this.addUpdateDialogVisible = true;
    },
    handleClose() {
      this.addUpdateDialogVisible = false;
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getList();
    },
  },
};
</script>

<style scoped>
.column_list {
  margin-top: 15px;
  width: 98%;
}
.friendly_sty{
  margin-left: 15px;
}
.button_poa {
  position: absolute;
  right: 20px;
}

.el-form {
  position: relative;
}

.menuHeader_sty {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  font-size: 12px;
}

.common-link {
  cursor: pointer;
  color: #409eff !important;
  /* 蓝色 */
}

.annotation_sty {
  color: #333 !important;
  font-size: 9px !important;
}

.prompt_sty {
  margin-left: 10px;
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  color: #fff;
  background-color: rgb(216, 233, 120);
  line-height: 14px;
  text-align: center;
}
</style>
