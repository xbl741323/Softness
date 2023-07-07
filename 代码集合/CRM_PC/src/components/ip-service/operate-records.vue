<template>
<!-- 排查完成 -->
  <div class="operate_records">
    <h3 class="basic-title">{{ $t("message.operateRecords") }}</h3>
    <div class="records_table">
      <div class="tab_title">{{ this.productInfo.name }}123</div>
      <el-table :data="recordsList" border>
        <el-table-column prop="createTime" :label="$t('message.operateTime')" align="center"></el-table-column>
        <el-table-column :label="$t('message.operateMan')" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content=" '工号：' + scope.row.employeeNumber + '   部门：' +  scope.row.deptName" placement="right">
                <span v-if="scope.row.employeeNumber!==null">({{ scope.row.name !=null?scope.row.name:''}}{{ scope.row.employeeNumber }})</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="description" :label="$t('message.operateContent')" align="center"></el-table-column>
      </el-table>
    </div>
    <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
        :page-sizes="[10,20,30,40,50]"
        :page-size="20"
        :total="total"
        class="pag-sty">
    </el-pagination>
  </div>
</template>
<script>
import { getOperateLog } from "@/api/project/ip";
export default {
  props: ["productInfo"],
  data() {
    return {
      total: 0,
      pageSize: 20,
      currentPage: 1,
      recordsList: [],
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    getList() {
      let params = {
        current: this.currentPage,
        size: this.pageSize,
        id: this.productInfo.id,
      };
      getOperateLog(params).then((res) => {
        this.recordsList = res.data.data.records
        this.total = res.data.data.total
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped>
.operate_records {
  width: 100%;
  background: #fff;
  padding-bottom: 200px;
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
.basic-title {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  font-size: 16px;
}
.pag-sty{
  float:right;
  margin-top:20px;
  margin-right:70px;
}
</style>
