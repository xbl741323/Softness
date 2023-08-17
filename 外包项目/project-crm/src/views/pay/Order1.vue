<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">库存管理模块</el-breadcrumb-item>
      <el-breadcrumb-item>库存信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.inventoryNo" placeholder="请输入库存信息编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input size="small" v-model="formInline.inventoryName" placeholder="请输入库存信息名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select size="small" v-model="formInline.inventoryType" placeholder="请选择库存信息类型"></el-select>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="index" width="60">
      </el-table-column>
      <el-table-column sortable prop="inventoryNo" label="库存信息编号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="inventoryName" label="库存信息名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="inventoryType" label="库存信息类型" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="inventoryStatus" label="库存信息状态" show-overflow-tooltip>
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
      <el-form label-width="140px" :model="addForm" :rules="rules" ref="editForm">
        <el-form-item label="库存信息编号" prop="inventoryNo">
          <el-input size="small" v-model="addForm.inventoryNo" auto-complete="off" placeholder="请输入库存信息编号"></el-input>
        </el-form-item>
        <el-form-item label="库存信息名称" prop="inventoryName">
          <el-input size="small" v-model="addForm.inventoryName" auto-complete="off" placeholder="请输入库存信息名称"></el-input>
        </el-form-item>
        <el-form-item label="库存信息类型" prop="inventoryType">
          <el-select size="small" v-model="addForm.inventoryType" auto-complete="off" placeholder="请选择库存信息类型">
            <el-option label="原材料库存" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存信息状态" prop="inventoryStatus">
          <el-select size="small" v-model="addForm.inventoryStatus" auto-complete="off" placeholder="请选择库存信息状态">
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
import { OrderList, OrderRefund, OrderDelete } from '../../api/payMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      title:'',
      addVisiable: false,
       addForm:{
       inventoryNo:'',
       inventoryName:'',
       inventoryType:'',
       address:'',
       inventoryGender:'',
       age:'',
       inventoryStatus:''
      },
      rules: {
        inventoryNo: [
          { required: true, message: '请输入库存信息编号', trigger: 'blur' }
        ],
        inventoryName: [
          { required: true, message: '请输入库存信息名称', trigger: 'blur' }
        ],
        inventoryType: [
          { required: true, message: '请选择库存信息类型', trigger: 'blur' }
        ],
        inventoryStatus: [
          { required: true, message: '请选择库存信息状态', trigger: 'blur' }
        ],
      },
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '预览',
      editForm: {
        id: '',
        inventoryName: '',
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
            inventoryNo:'VDxxxxxx',
            inventoryName:'xxx原材料库存',
            inventoryType:'原材料库存',
            inventoryStatus:"有效状态",
            createTime: "2020-08-12"
          },
          {
            inventoryNo:'VDxxxxxx',
            inventoryName:'xxx原材料库存',
            inventoryType:'原材料库存',
            inventoryStatus:"有效状态",
            createTime: "2022-10-24"
          },
          {
            inventoryNo:'VDxxxxxx',
            inventoryName:'xxx原材料库存',
            inventoryType:'原材料库存',
            inventoryStatus:"有效状态",
            createTime: "2022-01-12"
          },
          {
            inventoryNo:'VDxxxxxx',
            inventoryName:'xxx成品库存',
            inventoryType:'成品库存',
            inventoryStatus:"失效状态",
            createTime: "2022-05-17"
          },
          {
            inventoryNo:'VDxxxxxx',
            inventoryName:'xxx成品库存',
            inventoryType:'成品库存',
            inventoryStatus:"有效状态",
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
        this.title='编辑库存信息'
        this.addForm.inventoryNo = row.inventoryNo
        this.addForm.inventoryName = row.inventoryName
        this.addForm.inventoryType = row.inventoryType
        this.addForm.inventoryStatus = row.inventoryStatus
      }else{
        this.title='添加库存信息'
        this.addForm.inventoryNo = ''
        this.addForm.inventoryName = ''
        this.addForm.inventoryType = ''
        this.addForm.inventoryStatus = ''
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
              this.$message.error('支付配置信息保存失败，请稍后再试！')
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
              this.$message.error('支付配置信息删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '失效状态删除'
          })
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog(forminventoryName) {
      this.editFormVisible = false
      this.$refs[forminventoryName].resetFields()
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

 
 

 