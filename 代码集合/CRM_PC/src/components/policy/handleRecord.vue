<template>
  <div class="handle_record">
    <h3 style="text-align: center">{{title}}</h3>
    <avue-crud
        ref="crud"
        :page.sync="page"
        :data="tableData"
        :option="tableOption"
        @current-change="currentChange"
        @size-change="sizeChange"
        @on-load="getList">          
    </avue-crud>
  </div>
</template>

<script>
import { tableOption } from "@/const/crud/policy/record";
import { recordList ,industryRecordList} from "@/api/policy/policy";
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
        size: this.page.pageSize,
        start: this.page.currentPage,
        industryNo: this.$route.query.number,
      }; 
      industryRecordList(params).then(res => {
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