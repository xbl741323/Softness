<template>
  <div class="qa-frame">
    <el-form :model="form" inline>
      <el-form-item label="关键字：">
        <el-input v-model="form.keyWord" placeholder="请输入关键字" />
      </el-form-item>
      <el-form-item label="提问时间：">
        <el-date-picker
          v-model="form.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="form.status">
          <el-option 
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-button size="mini" @click="reset()">重置</el-button>
      <el-button size="mini" type="primary" @click="getList()">搜索</el-button>
    </el-form>

    <el-table :data="qaData" border>
      <el-table-column label="用户ID"></el-table-column>
      <el-table-column label="账户名"></el-table-column>
      <el-table-column label="问题标题"></el-table-column>
      <el-table-column label="问题内容"></el-table-column>
      <el-table-column label="回复量(条)"></el-table-column>
      <el-table-column label="状态"></el-table-column>
      <el-table-column label="提问时间"></el-table-column>
      <el-table-column label="提问端口"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text">查看</el-button>
          <el-button type="text">回复</el-button>
          <el-button type="text" @click="del(row)">删除</el-button>
        </template>
      </el-table-column> 
    </el-table>
    
    <div class="paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
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
export default {
  data(){
    return {
      currentPage: 1,
      pageSize: 20,
      total: 0,
      statusList: [],
      qaData: [],
      form: {}
    }
  },
  mounted(){

  },
  methods:{
    reset(){
      this.form = {

      };
      this.getList();
    },
    getList(){

    },
    del(row){
      this.$confirm('确认删除'+row.title+'标题吗？删除后客户端同步删除。','删除',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{

      })
    },
    handleSizeChange(val){

    },
    handleCurrentChange(val){

    },
  }
}
</script>

<style scoped>
  .qa-frame{
    background: #FFFFFF;
    height: 100%;
    padding: 20px;
  }
</style>