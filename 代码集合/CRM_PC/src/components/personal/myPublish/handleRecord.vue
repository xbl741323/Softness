<template>
  <div>
    <h3 style="text-align: center">{{title}}</h3>
    <avue-crud
        style="margin:0px;"
        ref="crud"
        :page.sync="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
    >          
    </avue-crud>
  </div>
</template>

<script>
import { tableOption } from "@/const/crud/policy/record";
import { recordList } from "@/api/personal/policy";
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
        this.tableData = res.data.data.list;
        this.page.total = res.data.data.total;
      });
    },
  },
  mounted() {
    // this.getList();
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