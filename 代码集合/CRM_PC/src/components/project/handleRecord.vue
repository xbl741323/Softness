<template>
<!-- 排查完成 -->
  <div>
    <h3 style="text-align: center">{{title}}</h3>
    <avue-crud
        style="margin:0px;"
        ref="crud"
        :page.sync="page"
        :data="tableData"
        :option="tableOption"
        @current-change="currentChange"
        @size-change="sizeChange"
        @on-load="getList">      
          <template slot="createUser" slot-scope="scope">
                <el-tooltip effect="dark" :content=" '工号：' + scope.row.createUser.split('(')[1].split(')')[0] + '   部门：' +  scope.row.operateDeptName" placement="right">
                      <span>{{scope.row.createUser}}</span>
               </el-tooltip>    
          </template>
    </avue-crud>
  </div>
</template>

<script>
import { tableOption } from "@/const/crud/policy/record";
import { recordList } from "@/api/project/project";
export default {
  props:["type","title","number"],
  data() {
    return {        
      tableOption: tableOption,
      tableData: [],
      page: {
        total: 0, // 总页数
        layout: "total,prev,pager,next, jumper",
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
    };
  },
  methods: { 
    getList() {     
       let params = {
        type:this.type,
        size: this.page.pageSize,
        start: this.page.currentPage,
        number: this.$route.query.number,
      }; 
      recordList(params).then(res => {
        this.tableData = res.data.data.records;
        this.page.total = res.data.data.total;
      });
    },
    currentChange(val){
      this.page.currentPage = val
    },
    sizeChange(val){
      this.page.pageSize = val
    }
  },
};
</script>

<style scoped>
.my_publish {
  padding: 10px 10px;
  width: 1200px;
  margin: 0px auto;
}
</style>