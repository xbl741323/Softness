<template>
  <div class="operate_records">
    <h3 class="basic-title-record">{{ $t("message.operateRecords") }}</h3>
    <div class="records_table">
      <div class="tab_title">{{ classTitle }}</div>
      <el-table :data="recordsList" border>
        <el-table-column prop="opTime" :label="$t('message.operateTime')" align="center"></el-table-column>
        <el-table-column :label="$t('message.operateMan')" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="'工号：'+scope.row.opUserNumber+' '+'部门：'+scope.row.opDeptName" placement="top">
              <span v-if="scope.row.opUserName!==null">{{ scope.row.opUserName }}</span>
           </el-tooltip>            
          </template>
        </el-table-column>
        <el-table-column prop="opOptionName" :label="$t('message.operateContent')" align="center"></el-table-column>
      </el-table>
    </div>
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="20"
      :total="total"
      class="pag-sty">
    </el-pagination>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange";
import { getClassLog } from "@/api/project/wtClass";
export default {
  data() {
    return {
      classTitle: "",
      classId: "",
      total: 0,
      pageSize: 20,
      currentPage: 1,
      recordsList: [],
    };
  },
  created() {
    if (this.$route.query.classId) {
      this.classId = this.$route.query.classId;
    }
    if (this.$route.query.classTitle) {
      this.classTitle = this.$route.query.classTitle;
    }
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
    // 获取日志列表数据
    getList() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        classId: this.classId,
      };
      getClassLog(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.recordsList = res.data.data.records;
          this.total = res.data.data.total;
        }
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
.basic-title-record {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  font-size: 16px;
}
.pag-sty {
  width: 90%;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>