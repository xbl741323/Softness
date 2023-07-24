<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">影像数据采集和输入模块</el-breadcrumb-item>
      <el-breadcrumb-item>影像数据管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.imageNo" placeholder="请输入影像数据编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input size="small" v-model="formInline.imageName" placeholder="请输入影像数据名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select size="small" v-model="formInline.imageType" placeholder="请选择影像数据类型"></el-select>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="index" width="60">
      </el-table-column>
      <el-table-column sortable prop="imageNo" label="影像数据编号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="imageName" label="影像数据名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="imageType" label="影像数据类型" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="imageStatus" label="影像数据状态" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
      <el-dialog :title="title" :visible.sync="addVisiable" width="30%" @click="closeDialog">
      <el-form label-width="160px" :model="addForm" :rules="rules" ref="editForm">
        <el-form-item label="影像数据编号" prop="imageNo">
          <el-input size="small" v-model="addForm.imageNo" auto-complete="off" placeholder="请输入影像数据编号"></el-input>
        </el-form-item>
        <el-form-item label="影像数据名称" prop="imageName">
          <el-input size="small" v-model="addForm.imageName" auto-complete="off" placeholder="请输入影像数据名称"></el-input>
        </el-form-item>
        <el-form-item label="影像数据类型" prop="imageType">
          <el-select size="small" v-model="addForm.imageType" auto-complete="off" placeholder="请选择影像数据类型">
            <el-option label="可见光影像" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="影像数据状态" prop="imageStatus">
          <el-select size="small" v-model="addForm.imageStatus" auto-complete="off" placeholder="请选择影像数据状态">
            <el-option label="有效" value="1"></el-option>
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
import { OrderList, OrderRefund, OrderDelete } from '../../api/payMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      title:'',
      addVisiable: false,
       addForm:{
       imageNo:'',
       imageName:'',
       imageType:'',
       address:'',
       imageGender:'',
       age:'',
       imageStatus:''
      },
      rules: {
        imageNo: [
          { required: true, message: '请输入影像数据编号', trigger: 'blur' }
        ],
        imageName: [
          { required: true, message: '请输入影像数据名称', trigger: 'blur' }
        ],
        imageType: [
          { required: true, message: '请选择影像数据类型', trigger: 'blur' }
        ],
        imageStatus: [
          { required: true, message: '请选择影像数据状态', trigger: 'blur' }
        ],
      },
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '预览',
      editForm: {
        id: '',
        imageName: '',
        payType: 1,
        partner: '',
        subMchId: '',
        appid: '',
        notifyUrl: '',
        signType: '',
        partnerKey: '',
        sellerUserId: '',
        certPath: '',
        certPassword: '',
        rsaKey: '',
        token: localStorage.getItem('logintoken')
      },
      formInline: {
        page: 1,
        limit: 10,
        machineNo: '',
        orderNo: '',
        transId: '',
        payType: 0,
        orderStatus: 0,
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
            imageNo:'VCxxxxxx',
            imageName:'xxx可见光影像',
            imageType:'可见光影像',
            imageStatus:"有效",
            createTime: "2020-08-12"
          },
          {
            imageNo:'VCxxxxxx',
            imageName:'xxx可见光影像',
            imageType:'可见光影像',
            imageStatus:"有效",
            createTime: "2022-10-24"
          },
          {
            imageNo:'VCxxxxxx',
            imageName:'xxx可见光影像',
            imageType:'可见光影像',
            imageStatus:"有效",
            createTime: "2022-01-12"
          },
          {
            imageNo:'VCxxxxxx',
            imageName:'xxx热红外影像',
            imageType:'热红外影像',
            imageStatus:"已失效",
            createTime: "2022-05-17"
          },
          {
            imageNo:'VCxxxxxx',
            imageName:'xxx热红外影像',
            imageType:'热红外影像',
            imageStatus:"已失效",
            createTime: "2021-09-12"
          },
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

      // OrderList(parameter)
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
    handleEdit: function(row) {
      this.addVisiable = true
      if(row!=null){
        this.title='编辑影像数据'
        this.addForm.imageNo = row.imageNo
        this.addForm.imageName = row.imageName
        this.addForm.imageType = row.imageType
        this.addForm.imageStatus = row.imageStatus
      }else{
        this.title='添加影像数据'
        this.addForm.imageNo = ''
        this.addForm.imageName = ''
        this.addForm.imageType = ''
        this.addForm.imageStatus = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          ConfigSave(this.editForm)
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
          ConfigDelete(row.deptId)
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
            message: '已失效删除'
          })
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog(formimageName) {
      this.editFormVisible = false
      this.$refs[formimageName].resetFields()
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

 
 

 