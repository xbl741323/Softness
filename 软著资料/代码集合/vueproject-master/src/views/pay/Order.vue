<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">数据采集与监测模块</el-breadcrumb-item>
      <el-breadcrumb-item>光伏发电参数管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.pvPowerNo" placeholder="请输入光伏发电参数编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input size="small" v-model="formInline.pvPowerName" placeholder="请输入光伏发电参数名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select size="small" v-model="formInline.pvPowerType" placeholder="请选择光伏发电参数类型"></el-select>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="index" width="60">
      </el-table-column>
      <el-table-column sortable prop="pvPowerNo" label="光伏发电参数编号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="pvPowerName" label="光伏发电参数名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="pvPowerType" label="光伏发电参数类型" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="pvPowerStatus" label="光伏发电参数状态" show-overflow-tooltip>
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
        <el-form-item label="光伏发电参数编号" prop="pvPowerNo">
          <el-input size="small" v-model="addForm.pvPowerNo" auto-complete="off" placeholder="请输入光伏发电参数编号"></el-input>
        </el-form-item>
        <el-form-item label="光伏发电参数名称" prop="pvPowerName">
          <el-input size="small" v-model="addForm.pvPowerName" auto-complete="off" placeholder="请输入光伏发电参数名称"></el-input>
        </el-form-item>
        <el-form-item label="光伏发电参数类型" prop="pvPowerType">
          <el-select size="small" v-model="addForm.pvPowerType" auto-complete="off" placeholder="请选择光伏发电参数类型">
            <el-option label="光伏阵列数据" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="光伏发电参数状态" prop="pvPowerStatus">
          <el-select size="small" v-model="addForm.pvPowerStatus" auto-complete="off" placeholder="请选择光伏发电参数状态">
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
       pvPowerNo:'',
       pvPowerName:'',
       pvPowerType:'',
       address:'',
       pvPowerGender:'',
       age:'',
       pvPowerStatus:''
      },
      rules: {
        pvPowerNo: [
          { required: true, message: '请输入光伏发电参数编号', trigger: 'blur' }
        ],
        pvPowerName: [
          { required: true, message: '请输入光伏发电参数名称', trigger: 'blur' }
        ],
        pvPowerType: [
          { required: true, message: '请选择光伏发电参数类型', trigger: 'blur' }
        ],
        pvPowerStatus: [
          { required: true, message: '请选择光伏发电参数状态', trigger: 'blur' }
        ],
      },
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '预览',
      editForm: {
        id: '',
        pvPowerName: '',
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
            pvPowerNo:'VCxxxxxx',
            pvPowerName:'xxx光伏阵列数据',
            pvPowerType:'光伏阵列数据',
            pvPowerStatus:"有效",
            createTime: "2020-08-12"
          },
          {
            pvPowerNo:'VCxxxxxx',
            pvPowerName:'xxx光伏阵列数据',
            pvPowerType:'光伏阵列数据',
            pvPowerStatus:"有效",
            createTime: "2022-10-24"
          },
          {
            pvPowerNo:'VCxxxxxx',
            pvPowerName:'xxx光伏阵列数据',
            pvPowerType:'光伏阵列数据',
            pvPowerStatus:"有效",
            createTime: "2022-01-12"
          },
          {
            pvPowerNo:'VCxxxxxx',
            pvPowerName:'xxx辐照度数据',
            pvPowerType:'辐照度数据',
            pvPowerStatus:"已失效",
            createTime: "2022-05-17"
          },
          {
            pvPowerNo:'VCxxxxxx',
            pvPowerName:'xxx辐照度数据',
            pvPowerType:'辐照度数据',
            pvPowerStatus:"已失效",
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
        this.title='编辑光伏发电参数数据'
        this.addForm.pvPowerNo = row.pvPowerNo
        this.addForm.pvPowerName = row.pvPowerName
        this.addForm.pvPowerType = row.pvPowerType
        this.addForm.pvPowerStatus = row.pvPowerStatus
      }else{
        this.title='添加光伏发电参数数据'
        this.addForm.pvPowerNo = ''
        this.addForm.pvPowerName = ''
        this.addForm.pvPowerType = ''
        this.addForm.pvPowerStatus = ''
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
    closeDialog(formpvPowerName) {
      this.editFormVisible = false
      this.$refs[formpvPowerName].resetFields()
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

 
 

 