<template>
  <div class="result-frame">
    <el-form :model="resultForm" inline @keyup.enter.native="pageNo = 1; getResult()">
      <el-form-item label="关键字：">
        <el-input v-model="resultForm.keyWords" placeholder="请输入关键字">
          <el-button slot="append" icon="el-icon-search" @click="pageNo = 1; getResult()"></el-button>
        </el-input>
      </el-form-item>
      <el-button type="primary" @click="addResult">新建结果值名称</el-button>
    </el-form>

    <el-table :data="resultData" border>
      <el-table-column label="结果值名称" prop="name"></el-table-column>
      <el-table-column label="名称描述" prop="des"></el-table-column>
      <el-table-column label="结果值名称ID" prop="resultNo"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button size="mini" type="text" @click="editResult(row)">编辑</el-button>
          <el-button size="mini" type="text" class="del-result" @click="delResult(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  <!-- 新增/编辑结果值 -->
    <el-dialog :visible.sync="resultDialog" :title="title" width="500px" :close-on-click-modal="false">
      <el-form :model="form" ref="form" :rules="rules" label-width="120px">
        <el-form-item label="结果值名称：" prop="name">
          <el-input  placeholder="请输入结果值名称(限10个字)" maxlength="10" v-model.trim="form.name" />
        </el-form-item>
        <el-form-item label="名称描述：">
          <el-input type="textarea" maxlength="20" :rows="5" show-word-limit v-model="form.des" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="cancel()">取消</el-button>
        <el-button size="mini" type="primary" @click="operateResult">确定</el-button>
      </div>
    </el-dialog>

    <div class="paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        background
        :page-sizes="[5, 10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { result, del, addOrEditResult } from '@/api/salary/result'
export default {
  data(){
    return {
      resultDialog: false,
      operate: 1,//1-新增 0-编辑
      form: {
        name:''
      },
      resultForm: {},
      resultData: [],
      rules: {
        name: [{required: true, message:'请输入结果值名称', trigger:'blur'}]
      },
      title:'',
      pageSize: 20,
      pageNo: 1,
      total: 0,
    }
  },
  created(){
    let sessionData = JSON.parse(sessionStorage.getItem(`${this.$route.path}`));
    if(sessionData){
      this.resultForm.keyWords = sessionData.name;
      this.pageSize = sessionData.pageSize;
      this.pageNo = sessionData.pageNo;
    }
    this.getResult();
  },
  methods:{
    delResult(row){
      this.$confirm('是否确定删除该结果值?','删除提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(()=>{
        del({id: row.id}).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.$message({
              type:'success',
              message: res.data.msg
            })
          }else{
            this.$message({
              type:'warning',
              message: res.data.msg
            })
          }
          this.getResult();
        })
      })
    },
    cancel(){
      this.form = {};
      this.$refs.form.clearValidate();
      this.resultDialog = false;
    },
    operateResult(){
      let param = {
        name: this.form.name,
        des: this.form.des,
        id: this.form.id || ''
      }
      this.$refs.form.validate(valid=>{
        if(valid){
          addOrEditResult(param, this.operate).then(res=>{
            this.$message({
              type:'success',
              message: res.data.msg
            })
            this.resultDialog = false;
            this.getResult();
          })
        }else{
          return false;
        }
      })
    },
    addResult(){
      this.title = '新建结果值名称';
      this.operate = 1;
      this.form = {};
      this.resultDialog = true;
      this.$refs.form.clearValidate();
    },
    editResult(row){
      this.title = '编辑结果值名称';
      this.operate = 0;
      this.form = JSON.parse(JSON.stringify(row));
      this.resultDialog = true;
    },
    getResult(){
      let param = {
        name: this.resultForm.keyWords,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(param));
      result(param).then(res=>{
        this.resultData = res.data.data.records;
        this.total = res.data.data.total
      })
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.getResult();
    },
    handleCurrentChange(val){
      this.pageNo = val;
      this.getResult();
    },
  }
}
</script>

<style scoped>
.result-frame{
  background: #FFFFFF;
  min-height: 100%;
  padding: 20px;
}
.del-result{
  color: red;
}
</style>