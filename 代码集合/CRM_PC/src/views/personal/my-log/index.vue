<!-- 排查完成 -->
<template>
  <div class="my_log">
    <!-- 个人信息/日志信息 -->
    <div class="head_info">
      <div class="info_left">
        <div class="img_and_btn">
          <img :src="empInfo.avatar" alt="" />
          <el-button type="primary" @click="permissions.bt_add_journal_my ? showPublish() : $notAuthorized()" :disabled="doneStatus">填写今日日志</el-button>
        </div>
        <div class="wel_sty">
          <span>欢迎您，{{ empInfo.name }}</span>
          <span :class="[doneStatus == true?'green_font_sty':'red_font_sty']">
            <i v-if="doneStatus == true" class="el-icon-circle-check"></i>
            <i v-else class="el-icon-circle-close"></i>
          </span>
          <span>{{ `${doneStatus ?'今天日志已完成':'今日日志未完成'}` }}</span>
        </div>
        <div class="desc_sty">追求卓越，与众不同，让你的每一天都尽情的发光发热吧！</div>
        <div class="done_info">
          <span>本月完成日志</span>
          <span>{{ journalCount }}</span>
          <span>篇</span>
        </div>
      </div>
      <div class="info_right">
        <span class="operate_desc">点击日历日期可进行日志操作</span>
        <el-calendar v-model="currentDate" ref="calender">
          <div slot="dateCell" slot-scope="{date,data}" @click="showLog(data)">
           <div :class="data.isSelected ? 'is-selected' : ''" @click="showLog(data)">
            <span :class="[filterWeek(date)==true?'gray_bg_sty':'']" @click="showLog(data)">{{ data.day.split('-').slice(2).join('-') }}</span>
            <span v-if="filterWeek(date)==false" @click="showLog(data)" :class="['oracle_sty',filterCalender(data) == 0?'green_color_sty':filterCalender(data) == 1?'orange_color_sty':filterCalender(data) == 2?'red_color_sty':filterCalender(data) == 3?'gray_color_sty':'']"></span>
            <span v-if="filterWeek(date)==true&&filterCalender(data) != 3" @click="showLog(data)" :class="['oracle_sty',filterCalender(data) == 0?'green_color_sty':filterCalender(data) == 1?'orange_color_sty':filterCalender(data) == 2?'red_color_sty':filterCalender(data) == 3?'green_color_sty':'']"></span>
           </div>
          </div>
        </el-calendar>
      </div>
    </div>
    <!-- 列表 -->
    <div class="log_List">
      <div>日志汇总</div>
      <div>
        <el-form :model="filters" ref="filters" inline>
          <el-form-item label="关键字：" prop="keyWords">
            <el-input @keyup.enter.native="getAllList()" v-model.trim="filters.keyWords" placeholder="请输入工作内容关键字"></el-input>
          </el-form-item>
          <el-form-item label="日志时间：" prop="logTime">
            <el-date-picker
              v-model="filters.logTime"
              :unlink-panels="true"
              format="yyyy-MM-dd HH:mm"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="getAllList()">搜索</el-button>
          <el-button @click="reset()">重置</el-button>
        </el-form>
        <avue-crud ref="crud" :page.sync="page" :data="dataList" :option="option" :table-loading="tableLoading"
          @size-change="sizeChange"
          @on-load="getList">
          <template slot="menu" slot-scope="scope">
            <el-button @click="permissions.bt_get_journal_my ? showDetail(scope.row) : $notAuthorized()" type="text" size="small" icon="el-icon-view">{{ $t("button.check") }}</el-button>
            <el-button v-if="scope.row.isEdit == 0" @click="permissions.bt_edit_journal_my ? showEdit(scope.row) : $notAuthorized()" type="text" size="small" icon="el-icon-edit">{{ $t("button.edit") }}</el-button>
          </template>
        </avue-crud>
      </div>
    </div>
    <!-- 查看/编辑dialog -->
    <el-dialog :title="logTitle" :visible.sync="logDialog" :close-on-click-modal="false">
      <operate-log :operateStatus='operateStatus' :source="source" v-if="logDialog" ref="workLog" @close-log='closeLog()'></operate-log>
    </el-dialog>
  </div>
</template>

<script>
import { getMyLogList, getStateList,getLogCount } from "@/api/work-log/index";
import { getNewEmpDetail } from "@/api/admin/user";
import operateLog from "@/components/staff/work-log/operate-log";
import { tableOption } from "@/const/crud/work-log/my-log";
import * as CodeMsg from "@/api/common/CodeChange";
import { mapState, mapGetters } from "vuex";
export default {
  components: {
    operateLog,
  },
  data() {
    return {
      empInfo: {
        avatar: "",
        name: "",
      },
      source: true,
      doneStatus: true, // true 今日已完成 false 今日尚未完成
      jourStateList: [],
      journalCount: 0,
      pictureUrl: [],
      operateStatus: null,
      logTitle: "",
      logDialog: false,
      sizeInfo: {
        minRows: 2,
        maxRows: 20,
      },
      rules: {
        textarea: [{ required: true, message: "请填写", trigger: "blur" }],
      },
      focusStatus: false,
      tableLoading: false,
      dataList: [],
      logInfo: {
        textarea: "",
      },
      filters: {
        keyWords: "",
        logTime: null,
      },
      option: tableOption,
      page: {
        total: 1,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
      },
      currentDate: new Date(),
      baseImgUrl: process.env.VUE_APP_IMAGE_BASEURL,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
    ...mapGetters(['permissions'])
  },
  watch: {
     currentDate:{
      handler(newVal, oldVal){
        console.log(newVal,'newVal')
        this.getStateData(this.$moment(newVal).format("YYYY-MM"),false);
        this.getCandlerCount(this.$moment(newVal).format("YYYY-MM"));
      },
      immediate: false
    },
  },
  created(){
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      this.page.currentPage = keepParams.params.current;
      this.page.pageSize = keepParams.params.size;
      this.filters.keyWords = keepParams.params.content;
      this.filters.logTime = keepParams.logTime;
      this.currentDate = keepParams.currentDate
    }
  },
  methods: {
    filterWeek(date) {
      if (date.getDay() === 6 || date.getDay() === 0) {
        return true;
      } else {
        return false;
      }
    },
    // 日历状态判断
    filterCalender(val) {
      if (val.type == "current-month") {
        let result = [];
        result = this.jourStateList.filter(function (item, index) {
          return item.journalTime == val.day;
        });
        if (result.length > 0) {
          return result[0].isEffective; // 需要加判断 0：正常 1：过期 （2：漏填 3：双休 4：节假日）
        }
      }
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
    closeLog() {
      this.logDialog = false;
      // this.currentDate = new Date()
      this.getList();
    },
    showLog(val) {
      let result = [];
      result = this.jourStateList.filter(function (item, index) {
        return item.journalTime == val.day;
      });
      if (result.length > 0) {
        this.logTitle = "查看日志";
        this.logDialog = true;
        this.fixLog(result)
      }
    },
    fixLog(result){
      if(result[0].isEdit == 0){
        if (result[0].isEffective == 0) {
          this.source = true;
          this.comOperate("查看日志", 0, result[0], true, false);
        } else if (result[0].isEffective == 1) {
          this.source = false;
          this.comOperate("查看日志", 0, result[0], true, false);
        } else if (result[0].isEffective == 2) {
          // 漏填操作待添加
          this.source = true;
          this.comOperate("发布日志", 1, result[0], false, true);
        } else if (result[0].isEffective == 3) {
          // 双休操作
          this.source = true;
          this.comOperate("查看日志", 1, result[0], false, false);
        }
      }else{
        this.source = false;
        this.comOperate("查看日志", 0, result[0], true, false);
      }
    },
    showPublish() {
      this.source = true;
      this.logTitle = "工作日志";
      this.logDialog = true;
      this.operateStatus = 2;
      this.$nextTick(() => {
        if (this.$refs.workLog) {
          this.$refs.workLog.disabled = false;
          this.$refs.workLog.logInfo.textarea = `今日工作：\n\n\n\n明日计划：\n\n\n\n心得体会：`;
          this.$refs.workLog.logInfo.journalTime = this.$moment(
            new Date()
          ).format("YYYY-MM-DD");
        }
      });
    },
    showDetail(row) {
      if (row.isEdit == 0) {
        this.source = true;
        this.comOperate("查看日志", 0, row, true);
      } else if (row.isEdit == 1) {
        this.source = false;
        this.comOperate("查看日志", 0, row, true);
      }
    },
    showEdit(row) {
      this.source = true;
      this.comOperate("编辑日志", 1, row, false);
    },
    comOperate(title, status, row, disabled, isContent) {
      this.logTitle = title;
      this.logDialog = true;
      this.operateStatus = status;
      this.$nextTick(() => {
        if (this.$refs.workLog) {
          this.$refs.workLog.logInfo.id = row.id;
          this.$refs.workLog.logInfo.textarea = isContent == true? `今日工作：\n\n\n\n明日计划：\n\n\n\n心得体会：` : row.content == null?`今日工作：\n\n\n\n明日计划：\n\n\n\n心得体会：`:row.content;
          this.$refs.workLog.logInfo.journalTime = row.journalTime;
          this.$refs.workLog.logInfo.isEffective = row.isEffective;
          this.$refs.workLog.$refs.upload.imgList = [];
          this.$refs.workLog.disabled = disabled;
          if (row.pictures != null && row.pictures[0] != "") {
            row.pictures.forEach((item) => {
              if (item !== "") {
                this.$refs.workLog.$refs.upload.imgList.push({
                  response: { data: item.trim() },
                });
              }
            });
          }
        }
      });
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      let params = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        content: this.filters.keyWords,
        startDate:
          this.filters.logTime == null
            ? ""
            : this.$moment(this.filters.logTime[0]).format(
                "YYYY-MM-DD"
              ),
        endDate:
          this.filters.logTime == null
            ? ""
            : this.$moment(this.filters.logTime[1]).format(
                "YYYY-MM-DD"
              ),
      };
      // 需要缓存的参数
      let keepParams = {
        params: params,
        logTime: this.filters.logTime,
        currentDate: this.currentDate
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getMyLogList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.dataList = res.data.data.records;
          this.page.total = res.data.data.total;
          this.getCandlerCount(this.$moment(new Date()).format("YYYY-MM"));
          this.getStateData(this.$moment(this.currentDate).format("YYYY-MM"),true);
        }
      });
    },
    // 获取日志状态列表
    getStateData(cTime,status) {
      let params = {
        time: cTime,
      };
      if(sessionStorage.getItem(`${this.$route.path}`)){
        let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
       keepParams.currentDate = this.currentDate
       sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      }
      getStateList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.jourStateList = res.data.data;
          let result = [];
          let that = this
          result = this.jourStateList.filter(function (item, index) {
            return item.journalTime == that.$moment(new Date()).format("YYYY-MM-DD");
          });
          if(status&&result.length>0){
            this.doneStatus = Boolean(result[0].id) // 已填写后按钮不可点击判断
          }
        }
      });
    },
    // 获取本月已完成日志数
    getCandlerCount(date) {
      let params = {
        yearMonth: date
      }
      getLogCount(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.journalCount = res.data.data;
        }
      });
    },
    getUserData() {
      getNewEmpDetail().then((res) => {
        let info = res.data.data;
        this.empInfo.name = info.name;
        if (info.avatar !== null && info.avatar !== "") {
          this.empInfo.avatar = this.baseImgUrl + info.avatar;
        } else {
          this.empInfo.avatar = require('@/assets/images/task/head.png')
        }
      });
    },
    reset() {
      this.filters.keyWords = ""
      this.filters.logTime = null;
      this.getAllList();
    },
  },
  mounted() {
    this.getUserData();
  },
};
</script>

<style scoped>
.my_log {
  padding: 0px 0px 0px 10px;
}
.head_info {
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 0px 50px 0px 50px;
  border-radius: 5px;
}
.info_right {
  position: relative;
  width: 335px;
  padding-top: 10px;
}
.info_left {
  margin-top: 30px;
}
.info_left img {
  width: 84px;
  height: 84px;
  border-radius: 100%;
}
.wel_sty {
  margin: 20px 0 15px 0;
  color: #333333;
}
.wel_sty > span:nth-of-type(1) {
  font-weight: bold;
  font-size: 20px;
}
.wel_sty > span:nth-of-type(2) {
  font-size: 16px;
  margin-left: 20px;
  font-weight: bold;
  color: rgb(27, 189, 27);
}
.wel_sty > span:nth-of-type(3) {
  font-size: 14px;
  margin-left: 10px;
}
.desc_sty {
  color: #999999;
  font-size: 14px;
  margin-bottom: 10px;
}
.done_info {
  color: #333333;
  font-size: 16px;
}
.done_info > span:nth-of-type(2) {
  font-size: 26px;
  margin: 0 5px 0 5px;
  font-weight: bold;
  color: #36a6fe;
}
.current_log_info {
  background: #ffffff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  margin-bottom: 10px;
}
.current_log_info > div:nth-of-type(1) {
  color: #36a6fe;
  font-weight: bold;
  padding: 0 0 15px 0;
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 10px;
}
.log_List {
  background: #ffffff;
  padding: 20px;
  border-radius: 5px;
  padding-bottom: 100px;
}
.log_List > div:nth-of-type(1) {
  color: #36a6fe;
  font-weight: bold;
  padding: 0 0 15px 0;
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 20px;
}
.log_upload_img {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.publish_sty {
  height: 40px;
}
.is-selected {
  color: #36a6fe;
  font-weight: bold;
}
.oracle_sty {
  width: 10px;
  height: 10px;
  display: inline-block;
  border-radius: 100%;
  margin: 0 0 4px 5px;
  position: absolute;
  top: 24px;
  left: 8px;
  transform: scale3d(0.5, 0.5, 0.5);
}
.red_font_sty {
  color: rgb(245, 13, 13) !important;
}
.green_font_sty {
  color: rgb(27, 189, 27) !important;
}
.red_color_sty {
  background: rgb(245, 13, 13) !important;
}
.green_color_sty {
  background: rgb(27, 189, 27) !important;
}
.orange_color_sty {
  background: rgb(248, 162, 3) !important;
}
.gray_color_sty {
  background: rgb(168, 163, 153) !important;
}
.gray_bg_sty {
  width: 100% !important;
  height: 100% !important;
  color: #c0c4cc !important;
}
.img_and_btn {
  width: 230px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.operate_desc {
  position: absolute;
  font-size: 12px;
  top: 70px;
  left: 20px;
  color: #999999;
}
</style>
<style>
.my_log .el-calendar-table .el-calendar-day {
  position: relative;
  height: 35px !important;
}
.my_log .el-calendar__body {
  padding-top: 10px !important;
}
</style>