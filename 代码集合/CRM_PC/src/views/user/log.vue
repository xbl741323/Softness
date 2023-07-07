<template>
<!-- 排查完成 -->
  <basic-container>
    <div class="filters_form">
      <el-form
        :model="filters"
        :inline="true"
        ref="filters"
        @keyup.enter.native="getFirstAllList()">
        <div style="display: flex;">
          <div>
            <el-form-item label="关键字：" prop="keyWords">
              <el-input
                style="width: 300px"
                v-model.trim="filters.keyWords"
                placeholder="请输入用户ID或数据标题关键字"
              ></el-input>
            </el-form-item>
            <el-form-item label="日志类型：" prop="logType">
              <el-select v-model="filters.logType">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in logTypeList"
                  :key="item.id"
                  :label="item.dropdownValue"
                  :value="item.dropdownKey">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生成时间：" prop="publishTime">
              <el-date-picker
                v-model="filters.publishTime"
                @change="showTime"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div>
            <el-button type="primary" @click="getFirstAllList()">搜索</el-button>
            <el-button @click="resetForm('filters')">重置</el-button>
          </div>
        </div>
      </el-form>
    </div>
    <avue-crud
      ref="crud"
      :page.sync="page"
      :data="logList"
      :option="tableOption"
      @on-load="getList">
      <template slot="title" slot-scope="scope">
        <div v-if="scope.row.logType == 'key5'">
          <span>原号码：{{ scope.row.encryptedOldPhone }}</span>
          <span class="new-phone">新号码：{{ scope.row.encryptedNewPhone }}</span>
        </div>
        <div v-else>{{ scope.row.title }}</div>
      </template>
      <template slot="terminalType" slot-scope="scope">
        <span>{{ scope.row.terminalType | terminalType }}</span>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { tableOption } from "@/const/crud/user/log";
import { getLogList, getDropdownAccountType } from "@/api/admin/user";
export default {
  data() {
    return {
      clickStatus:false,
      tableOption: tableOption,
      filters: {
        keyWords: "",
        logType: "",
        publishTime: [],
      },
      logTypeList: [],
      logList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        pageSizes: [5, 8, 10, 20, 30, 40, 50, 100], //选择每页显示条数
        isAsc: false, // 是否倒序
      },
    };
  },
  filters: {
    terminalType(val) {
      if (val == 1) {
        return "PC端";
      } else if (val == 2) {
        return "移动端";
      } else if (val == 3) {
        return "小程序";
      } else if (val == 4) {
        return "APP";
      } else {
        return "";
      }
    },
  },
  methods: {
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getFirstAllList(){
      this.clickStatus = true
      this.page.currentPage = 1;
      this.getList();
    },
    resetForm(formName) {
      this.clickStatus = false
      this.$refs[formName].resetFields();
      this.filters.keyWords = "";
      this.filters.logType = "";
      this.filters.publishTime = [];
      this.getAllList();
    },
    getList() {
      var pageObj = {
        current: this.page.currentPage,
        size: this.page.pageSize,
      };
      var logObj = {
        keywords: this.clickStatus == true?(this.filters.keyWords):"",
        logType: this.clickStatus == true?(this.filters.logType):"",
        encrypted: 1,
        gmtCreateStart:
        this.clickStatus == true?
         (this.filters.publishTime != null &&
          this.filters.publishTime[0] != null
            ? this.$moment(this.filters.publishTime[0]).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : null
         ):null,
        gmtCreateend:
        this.clickStatus == true?
         ( this.filters.publishTime != null &&
          this.filters.publishTime[1] != null
            ? this.$moment(this.filters.publishTime[1]).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : null):null,
      };
      // 需要缓存的参数
      let keepParams = {
        clickStatus:this.clickStatus,
        pageObj: pageObj,
        logObj: logObj,
        createTime: this.filters.publishTime,
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      this.params = {
        page: JSON.stringify(pageObj),
        accountLog: JSON.stringify(logObj),
      };
      getLogList(this.params)
        .then((res) => {
          this.logList = res.data.data.records;
          this.page.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showTime(val) {},
    getDropData() {
      getDropdownAccountType(0)
        .then((res) => {
          this.logTypeList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      this.filters.keyWords = keepParams.logObj.keywords;
      this.filters.logType = keepParams.logObj.logType;
      this.filters.publishTime = keepParams.createTime;
      this.clickStatus = keepParams.clickStatus
      this.page.currentPage = keepParams.pageObj.current;
      this.page.size = keepParams.pageObj.size;
    }
  },
  mounted() {
    this.getDropData();
  },
};
</script>

<style scoped>
.radio_item:nth-of-type(1) {
  border-left: none;
}
.radio_item {
  margin-right: 10px;
  margin-top: 10px;
  border-left: 1px solid #dcdfe6;
  border-radius: 0px 0px 0px 0px;
}
.new-phone {
  margin-left: 20px;
}
</style>

