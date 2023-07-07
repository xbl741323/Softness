<template>
  <div class="handle_record">
    <h3 style="text-align: center">{{$route.query.navName}}</h3>
    <avue-crud
        ref="crud"
        :page.sync="page"
        :data="tableData"
        :option="tableOption"
        @current-change="currentChange"
        @size-change="sizeChange"
        @on-load="getList">
        <template slot="createUser" slot-scope="scope">
          <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ scope.row.number + ' '+ $t('message.emp') + scope.row.deptName" placement="right">
              <span>{{ scope.row.createUser }}</span>
          </el-tooltip>
          </template>          
    </avue-crud>
  </div>
</template>

<script>
import { tableOption } from "@/const/crud/js-wotao-b/record";
import { getRecords } from "@/api/js-wotao-b/columns-list"
export default {
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
        size: this.page.pageSize,
        start: this.page.currentPage,
        number: this.$route.query.number,
      }; 
      getRecords(params).then(res => {
        this.tableData = res.data.data.list;
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
.handle_record {
  width: 95%;
}
</style>