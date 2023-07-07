<template>
  <div class="sys-log">
      <avue-crud
        ref="crud"
        :page.sync="page"
        :search.sync="search"
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
import { tableOption } from "@/const/crud/admin/log";
import { mapGetters } from "vuex";

export default {
  name: "Log",
  data() {
    return {
      filters: {
        keyWords: "",
        publishTime: [],
      },
      search: {},
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
  created() {
    if(JSON.parse(sessionStorage.getItem("clue-belong"))){
      this.search = JSON.parse(sessionStorage.getItem("clue-belong"))
      this.searchForm = JSON.parse(sessionStorage.getItem("clue-belong"))
    }
  },
  methods: {
    reset(){
      this.page.currentPage = 1
      this.searchForm = {}
      this.search = {}
      this.getList(this.page)
    },
    getList(page, params) {
      sessionStorage.setItem("clue-belong",JSON.stringify(this.search))
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize,
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

