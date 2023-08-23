<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>产品信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input @keyup.enter.native="getAllList()"  size="small" v-model.trim="formInline.profuctName" placeholder="请输入产品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="success" icon="el-icon-plus" @click="handleEdit(true)">添加产品</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="id" label="ID" align="center" width="100px">
      </el-table-column>
      <el-table-column prop="no" label="产品编号" align="center">
      </el-table-column>
      <el-table-column prop="name" label="产品名称" align="center">
      </el-table-column>
       <el-table-column sortable prop="createTime" label="创建时间" align="center" :formatter="dateFormat">
      </el-table-column>
      <el-table-column align="center" label="操作" width="320px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-view" @click="previewImage(scope.row)">预览</el-button>
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(false, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
      <el-dialog v-if="editFormVisible" :close-on-click-modal="false" :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog()">
      <el-form label-width="100px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="产品编号" prop="profuctNo">
          <el-input size="small" v-model.trim="editForm.profuctNo" auto-complete="off" placeholder="请输入产品编号"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" prop="profuctName">
          <el-input size="small" v-model.trim="editForm.profuctName" auto-complete="off" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="产品图片" prop="productUrl">
        <el-upload
         :limit='1'
         class="upload-demo"
         accept=".jpg,.jpeg,.png,.gif"
         action="https://www.xzycshouce.com/api/file/upload"
         :before-upload="beforeUpload"
         :on-preview="handlePreview"
         :on-remove="handleRemove"
         :on-success="handleSuccess"
         :file-list="fileList"
         list-type="picture">
         <el-button size="small" :disabled='fileList.length>0' type="primary">点击上传</el-button>
         <div slot="tip" class="el-upload__tip">只能上传图片文件，且不超过10M</div>
       </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" class="right-sty" @click="closeDialog()">取消</el-button>
        <el-button size="medium" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 查看预览图 -->
    <el-image ref="locationImage" v-show="false" :src="previewImg"  :preview-src-list="[previewImg]"></el-image>
  </div>
</template>

<script>
import { productList, setProduct, delProduct } from "../../api/admin";
import { throttle } from "../../utils/util";
import Pagination from "../../components/Pagination";
export default {
  data() {
    return {
      baseUrl: "https://www.xzycshouce.com/api/file/picture/",
      previewImg: "",
      operateStatus: true, // true-添加 false-编辑
      fileList: [],
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "",
      editForm: {
        id: "",
        profuctNo: "",
        profuctName: "",
        productUrl: "",
        status: "",
        token: localStorage.getItem("logintoken"),
      },
      // rules表单验证
      rules: {
        profuctNo: [
          { required: true, message: "请输入产品编号", trigger: "blur" },
        ],
        profuctName: [
          { required: true, message: "请输入产品名称", trigger: "blur" },
        ],
        productUrl: [
          { required: true, message: "请上传产品图片", trigger: "blur" },
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
        varLable: "",
        varName: "",
        token: localStorage.getItem("logintoken"),
      },
      seletedata: {
        ids: "",
        token: localStorage.getItem("logintoken"),
      },
      userparm: [],
      listData: [],
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
    };
  },
  // 注册组件
  components: {
    Pagination,
  },
  mounted() {
    this.getList();
  },
  methods: {
    previewImage(row) {
      this.previewImg = this.baseUrl + row.descUrl;
      this.$refs["locationImage"].clickHandler();
    },
    dateFormat(row) {
      let result = this.$moment(row.createTime).format("YYYY-MM-DD HH:mm:ss");
      return result;
    },
    beforeUpload(file) {
      if (file.size / 1024 / 1024 > 1) {
        this.$message({
          type: "warning",
          message: "图片大小不能超过10MB!",
        });
        return false;
      }
    },
    handleSuccess(res, file) {
      this.editForm.productUrl = res.data;
    },
    handleRemove(file, fileList) {
      this.fileList = [];
    },
    handlePreview(file) {},
    // 添加/编辑产品信息
    setProInfo() {
      let params = {
        name: this.editForm.profuctName,
        no: this.editForm.profuctNo,
        descUrl: this.editForm.productUrl,
      };
      if (!this.operateStatus) {
        params.id = this.editForm.id;
      }
      setProduct(this.operateStatus, params).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: this.operateStatus ? "添加成功！" : "修改成功！",
          });
          this.editFormVisible = false;
          this.editForm.profuctName = "";
          this.editForm.profuctNo = "";
          this.editForm.productUrl = "";
          this.getList();
        }
      });
    },
    getAllList() {
      this.pageparm.currentPage = 1;
      this.getList();
    },
    // 获取产品列表
    getList() {
      let params = {
        pageNum: this.pageparm.currentPage,
        pageSize: this.pageparm.pageSize,
        key: this.formInline.profuctName,
      };
      productList(params).then((res) => {
        if (res.code == 0) {
          this.listData = res.data.records;
          this.pageparm.total = res.data.totalRow;
        }
      });
    },
    // 分页change事件
    callFather(parm) {
      this.pageparm.currentPage = parm.currentPage;
      this.pageparm.pageSize = parm.pageSize;
      this.getList();
    },
    // 搜索事件
    search() {
      this.getList();
    },
    //显示编辑界面
    handleEdit(status, row) {
      this.operateStatus = status;
      this.editFormVisible = true;
      this.fileList = [];
      if (!status) {
        this.title = "编辑产品信息";
        this.editForm.id = row.id;
        this.editForm.profuctNo = row.no;
        this.editForm.profuctName = row.name;
        this.editForm.productUrl = row.descUrl;
        this.fileList.push({
          url: `${this.baseUrl}${row.descUrl}`,
        });
      } else {
        this.title = "添加产品信息";
        this.editForm.id = "";
        this.editForm.profuctNo = "";
        this.editForm.profuctName = "";
        this.editForm.productUrl = "";
      }
    },
    // 编辑、增加页面保存方法 + 防重复提交
    submitForm: throttle(function (editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          this.setProInfo();
        }
      });
    }, 2000),
    // 删除
    deleteUser(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delProduct(row.id).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getAllList();
          } else {
            this.$message({
              type: "warning",
              message: res.msg,
            });
          }
        });
      });
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.$refs["editForm"].clearValidate();
      this.editFormVisible = false;
      this.fileList = [];
    },
  },
};
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: -20px;
}
.right-sty {
  margin-right: 100px;
}
</style>

 
 