<template>
  <div class="operate_records">
    <div class="records_table">
      <div class="tab_title">{{ title }}</div>
      <el-table :data="recordsList" border>
        <el-table-column prop="createTime" :label="$t('message.operateTime')+'：'" align="center"></el-table-column>
        <el-table-column prop="name" :label="$t('message.operateMan')+'：'" align="center"></el-table-column>
        <el-table-column prop="operateTypeEnum" :label="$t('message.operateContent')+'：'" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- <el-pagination
      layout="prev, pager, next, jumper, total"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      :total="total"
      style="float:right;margin-top:20px;margin-right:20px;"
    ></el-pagination> -->
  </div>
</template>

<script>
import { getRecords } from "@/api/siteSettings/column";
export default {
  props: ["number","title"],
  data() {
    return {
      total: 40,
      pageSize: 20,
      currentPage: 1,
      recordsList: []
    };
  },
  methods: {
    getList() {
      getRecords(this.number).then(res => {
        this.recordsList = res.data.data;
      });
    },
    handleCurrentChange() {}
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped>
.operate_records {
  width: 100%;
  background: #fff;
  padding-bottom: 200px;
  padding: 20px 100px 200px 100px;
}
.records_table {
  width: 1000px;
  margin: 0 auto;
}
.records_table .tab_title {
  text-align: center;
  border: 1px solid #ebeef5;
  border-bottom: none;
  height: 40px;
  line-height: 40px;
  font-weight: bold;
  font-size: 14px;
}
</style> 