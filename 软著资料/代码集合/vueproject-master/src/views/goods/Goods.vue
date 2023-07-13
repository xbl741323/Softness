<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">配方管理模块</el-breadcrumb-item>
      <el-breadcrumb-item>配方数据管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
       <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.formulaName" placeholder="请输入配方数据编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input size="small" v-model="formInline.formulaName" placeholder="请输入配方数据名称"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-select size="small" v-model="formInline.formulaStatus" placeholder="请选择配方数据类型">
          <el-option></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column sortable prop="formulaNo" label="配方数据编号">
      </el-table-column>
      <el-table-column sortable prop="formulaName" label="配方数据名称">
      </el-table-column>
      <el-table-column sortable prop="formulaType" label="配方数据类型">
      </el-table-column>
      <el-table-column sortable prop="formulaStatus" label="配方数据状态" >
      </el-table-column>
      <el-table-column sortable prop="createime" label="创建时间">
      </el-table-column>
      <el-table-column sortable prop="creator" label="创建人">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
      <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="140px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="配方数据编号" prop="formulaNo">
          <el-input size="small" v-model="editForm.formulaNo" auto-complete="off" placeholder="请输入配方数据编号"></el-input>
        </el-form-item>
        <el-form-item label="配方数据名称" prop="formulaName">
          <el-input size="small" v-model="editForm.formulaName" auto-complete="off" placeholder="请输入配方数据名称"></el-input>
        </el-form-item>
        <el-form-item label="配方数据类型" prop="formulaType">
          <el-select size="small" v-model="editForm.formulaType" auto-complete="off" placeholder="请选择配方数据类型">
            <el-option label="塑料配方" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配方数据状态" prop="formulaStatus">
          <el-select size="small" v-model="editForm.formulaStatus" auto-complete="off" placeholder="请选择配方数据状态">
            <el-option label="有效状态" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deptList, deptSave, deptDelete } from '../../api/userMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '',
      editForm: {
        formulaNo: '',
        formulaName: '',
        formulaType:'',
        status:'',
        formulaStatus: '',
        token: localStorage.getItem('logintoken')
      },
      // rules表单验证
      rules: {
        formulaNo: [
          { required: true, message: '请输入配方数据编号', trigger: 'blur' }
        ],
        formulaName: [
          { required: true, message: '请输入配方数据名称', trigger: 'blur' }
        ],
        formulaType: [
          { required: true, message: '请选择配方数据类型', trigger: 'blur' }
        ],
        formulaStatus: [
          { required: true, message: '请选择配方数据状态', trigger: 'blur' }
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
        varLable: '',
        varName: '',
        token: localStorage.getItem('logintoken')
      },
      seletedata: {
        ids: '',
        token: localStorage.getItem('logintoken')
      },
      userparm: [], 
      listData: [], 
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    }
  },
  // 注册组件
  components: {
    Pagination
  },
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */
  created() {
    this.getdata(this.formInline)
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    getdata(parameter) {
      this.loading = true
      // 模拟数据开始
      let res = {
        code: 0,
        msg: null,
        count: 5,
        data: [
          {
            creator: 'xxx',
            createime: '2022-12-23',
            formulaNo: 'VSxxxxxxxx',
            formulaName: 'XX塑料配方',
            formulaType: '塑料配方',
            formulaStatus: '有效状态',
          },
          {
            creator: 'xxx',
            createime: '2022-10-05',
            formulaNo: 'VSxxxxxxxx',
            formulaName: 'XX塑料配方',
            formulaType: '塑料配方',
            formulaStatus: '有效状态',
          },
          {
            creator: 'xxx',
            createime: '2021-11-13',
            formulaNo: 'VSxxxxxxxx',
            formulaName: 'XX塑料配方',
            formulaType: '塑料配方',
            formulaStatus: '有效状态',
          },
          {
            creator: 'xxx',
            createime: '2020-08-21',
            formulaNo: 'VSxxxxxxxx',
            formulaName: 'XX橡胶配方',
            formulaType: '橡胶配方',
            formulaStatus: '失效状态',
          },
          {
            creator: 'xxx',
            createime: '2022-02-23',
            formulaNo: 'VSxxxxxxxx',
            formulaName: 'XX橡胶配方',
            formulaType: '橡胶配方',
            formulaStatus: '有效状态',
          }
        ]
      }
      this.loading = false
      this.listData = res.data
      this.pageparm.currentPage = this.formInline.page
      this.pageparm.pageSize = this.formInline.limit
      this.pageparm.total = res.count
      // 模拟数据结束

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      // deptList(parameter)
      //   .then(res => {
      //     this.loading = false
      //     if (res.success == false) {
      //       this.$message({
      //         type: 'info',
      //         message: res.msg
      //       })
      //     } else {
      //       this.listData = res.data
      //       // 分页赋值
      //       this.pageparm.currentPage = this.formInline.page
      //       this.pageparm.pageSize = this.formInline.limit
      //       this.pageparm.total = res.count
      //     }
      //   })
      //   .catch(err => {
      //     this.loading = false
      //     this.$message.error('菜单加载失败，请稍后再试！')
      //   })
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline)
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '编辑配方数据'
        this.editForm.formulaNo = row.formulaNo
        this.editForm.formulaName = row.formulaName
        this.editForm.formulaStatus = row.formulaStatus
        this.editForm.formulaType = row.formulaType
      } else {
        this.title = '添加配方数据'
        this.editForm.formulaNo = ''
        this.editForm.formulaName = ''
        this.editForm.formulaStatus = ''
        this.editForm.formulaType =''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          deptSave(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                })
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('保存失败，请稍后再试！')
            })
        } else {
          return false
        }
      })
    },
    // 删除
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deptDelete(row.deptId)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '已删除!'
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false
    }
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>

 
 