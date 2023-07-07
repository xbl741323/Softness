<template>
  <div class="operate_records">
   <div class="left_span">
      <span></span>
      <span>{{ $t("message.sysLog") }}</span>
    </div>
      <avue-crud
        ref="crud"
        :page.sync="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        :permission="permissionList"
        @on-load="getList"
        @search-reset="reset"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-del="handleDel"
      >
        <template slot="requestParam" slot-scope="scope">
          {{scope.row.requestParam}}
        </template>
        <template slot="responseParam" slot-scope="scope">
          {{scope.row.responseParam}}
        </template>
      </avue-crud>
  </div>
</template>
<script>
import { delObj, fetchList } from "@/api/admin/log";
import { tableOption } from "@/const/crud/admin/sys-log";
import { mapGetters } from "vuex";
export default {
  props: ["userName"],
  data() {
    return {
      filters: {
        keyWords: "",
        publishTime: [],
      },
      tableData: [],
      searchForm: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableLoading: true,
      tableOption: tableOption,
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        delBtn: this.vaildData(this.permissions.sys_log_del, false),
      };
    },
  },
  methods: {
     reset(){
      this.page.currentPage = 1
      this.searchForm = {}
      this.getList(this.page)
    },
    getList(page, params) {
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize,
            createBy:this.userName
          },
          params,
          this.searchForm
        )
      ).then((response) => {
        this.tableData = response.data.data.records;
        this.page.total = response.data.data.total;
        this.tableLoading = false;
         
      });
    },
    handleDel: function (row) {
      this.$confirm(this.$t("label.logDeleteConfirm") + row.id + this.$t("label.logDelete"), this.$t("title.notice"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        type: "warning",
      })
        .then(function () {
          return delObj(row.id);
        })
        .then(() => {
          this.getList(this.page);
          this.$message.success(this.$t("message.deleteSuccess"));
        });
    },
    searchChange(form, done) {
      this.searchForm = form;
      this.page.currentPage = 1;
      this.getList(this.page, form);
      done();
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    currentChange(current) {
      this.page.currentPage = current;
    },
    refreshChange() {
      this.getList(this.page);
    },
  },
};
</script>
<style scoped>
.left_span {
  width: 100px;
  height: 25px;
  display: flex;
  margin: 40px 0 25px 0px;
}
.left_span > span:nth-of-type(1) {
  display: inline-block;
  width: 10px;
  height: 25px;
  background: #108ee9;
}
.left_span > span:nth-of-type(2) {
  display: flex;
  width: 80px;
  height: 25px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #666666;
  font-weight: bold;
}
</style>
