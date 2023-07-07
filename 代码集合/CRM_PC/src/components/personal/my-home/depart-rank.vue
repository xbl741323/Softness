<!-- 排查完成 -->
<template>
  <div id="depart-rank" >
    <div class="tool-title">
      <span>部门排行榜</span>
    </div>
   <div class="right-filter-limit">
    <div class="dept-tab">
      <el-tabs v-model="activeName" class="rank-tab-change" @tab-click="handleClick">
        <el-tab-pane label="回款金额" name="1"></el-tab-pane>
        <el-tab-pane label="新增合同" name="2"></el-tab-pane>
        <el-tab-pane label="创建线索" name="5"></el-tab-pane>
        <el-tab-pane label="客户跟进" name="4"></el-tab-pane>
      </el-tabs>
      <p :class="['more',activeName=='3'?'active-more':'']" @click="toMore">
        <span v-if="activeName!=='3'">更多</span>
      </p>
    </div>
   </div>
    <div class="rank-filters">
      <el-form :model="filters" inline>
        <div class="rank-filters-content">
          <div>
            <el-form-item>
              <avue-input-tree
                v-model="filters.depart"
                :node-click="getNodeData"
                @change="showData"
                :dic="treeData"
                :props="defaultProps"
                placeholder="请选择所属部门"/>
            </el-form-item>
          </div>
          <div class="choose-time">
            <el-form-item>
              <el-radio-group
                v-model="filters.dateRange"
                @change="chooseRadio()">
                <el-radio v-for="(item, index) in dataList" :key="index" class="date-radio-sty" :label="item.label">
                  {{ item.value }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item>
              <el-date-picker
                v-model="filters.createTime"
                :unlink-panels="true"
                @change="selectDate"
                type="datetimerange"
                style="width: 220px;"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div v-if="hideCount <= 0" class="show-null-sty" v-loading="loading">暂无数据</div>
    <div v-else class="depart-limit-sty" v-loading="loading">
      <depart-limit v-if="!loading" ref="child" @toPersonal="toPersonal"></depart-limit>
    </div>
  </div>
</template>

<script>
import { topTenReceiveStatistic,topTenContractStatistics,topTenClueStatistics,topTenClueFollowStatistics } from "@/api/personal/myhome";
import { deptRoleList } from "@/api/admin/role";
import departLimit from "./depart-limit";
import { mapGetters } from 'vuex';
export default {
  props:['treeData'],
  components: {
    departLimit,
  },
  data() {
    return {
      cTitle: "回款金额（元）",
      loading: false,
      hideCount: 0,
      rolesOptions: [],
      defaultProps: {
        label: "name",
        value: "id",
      },
      activeName: "1",
      filters: {
        depart: "",
        dateRange: 3,
        createTime: [],
      },
      serviceInfo: {
        nameList: [],
        dataList: [{ value: 0 }],
        colorList: [],
        valueList: [],
      },
      dataList: [
        {
          label: 1,
          value: "上月",
        },
        {
          label: 2,
          value: "本周",
        },
        {
          label: 3,
          value: "本月",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    toPersonal(info) {
      let path = "";
      if (this.activeName == 2 && this.permissions.sys_contract_statistics) {
        path = "/personal-new-contracts";
      } else if (this.activeName == 4 && this.permissions.sys_clue_follow_statistics && this.permissions.sys_clue_follow_statistics || this.activeName == 4 && this.permissions.sys_clue_follow_statistics && this.permissions.sys_achievements_createFollow) {
        path = "/personal-follow";
      }else if (this.activeName == 1 && this.permissions.sys_receive_statistics) {
        path = "/personal-payment";
      }else if (this.activeName == 5 && this.permissions.sys_clue_statistics) {
        path = "/personal-create-clue";
      } else {
        this.$offsetMessage({ 
          message: '无权限操作！', 
          type: 'warning'
        });
      }
      if(this.activeName != 3){
        this.$router.push({
        path: path,
        query: {
          staffInfo: JSON.stringify(info),
          searchForm: JSON.stringify(this.serviceInfo.searchForm),
        },
      });
      }
    },
    toMore() {
      let type = this.activeName;
      let permissions = type == 5 ? this.permissions.sys_clue_statistics : type == 2 ? this.permissions.sys_contract_statistics : type == 1 ? this.permissions.sys_receive_statistics : this.permissions.sys_clue_follow_statistics
      if(!permissions) return this.$offsetMessage({ 
        message: '无权限操作！', 
        type: 'warning'
      });
      if (type == 2 || type == 4 || type == 1 || type == 5) {
        let urlQuery = {
          tabName: this.activeName,
        };
        urlQuery["formDatas" + this.activeName] = {};
        urlQuery["formDatas" + this.activeName].deptId = this.filters.depart;
        urlQuery["formDatas" + this.activeName].timeType =
          this.filters.dateRange;
        urlQuery["formDatas" + this.activeName].customTime =
          this.filters.createTime;
        sessionStorage.setItem(`staff-achievements`, JSON.stringify(urlQuery));
        this.$router.push({
          path: "/staff/achievements",
          query: {
            myhome: true,
          },
        });
      }
    },
    widthAuto() {
      var elementResizeDetectorMaker = require("element-resize-detector");
      // 创建实例，无参数
      var erd = elementResizeDetectorMaker();
      // 创建实例带参数
      var erdUltraFast = elementResizeDetectorMaker({
        strategy: "scroll",
        callOnAdd: true,
        debug: true,
      });
      //监听id为test的元素 大小变化
      erd.listenTo(document.getElementById("depart-rank"), function (element) {
        var width = element.offsetWidth;
        var height = element.offsetHeight;
      });
    },
    selectDate() {
      if (this.filters.createTime !== null) {
        this.filters.dateRange = 4;
      } else {
        this.filters.dateRange = 2;
      }
      this.getList();
    },
    chooseRadio() {
      if (this.filters.dateRange !== 4) {
        this.filters.createTime = null;
      }
      this.getList();
    },
    showData() {
      console.log(this.filters.depart, "this.filters.depart");
      if (
        this.filters.depart == "" ||
        this.filters.depart == "undefined" ||
        this.filters.depart == null
      ) {
      } else {
        this.getList();
      }
    },
    getList() {
      this.loading = true;
      let params = {
        deptId: this.filters.depart,
        timeType: this.filters.dateRange,
      };
      let type = Number(this.activeName);
      if (this.filters.createTime !== null) {
        params.startTime = this.$moment(this.filters.createTime[0]).format("YYYY-MM-DD HH:mm:ss");
        params.endTime = this.$moment(this.filters.createTime[1]).format("YYYY-MM-DD HH:mm:ss");
      };
      if(type==1){
        params = JSON.parse(JSON.stringify(params).replace(/startTime/g,'startLocalDateTime').replace(/endTime/g,'endLocalDateTime'))
      }      
      let url = type == 1 ? topTenReceiveStatistic : type == 2 ? topTenContractStatistics : type == 5 ? topTenClueStatistics : topTenClueFollowStatistics
      url(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          // 接口返回type做判断防止数据被覆盖
          let result = res.data.data;
          if (result.length > 0) {
            this.hideCount = 0;
            this.serviceInfo.nameList = [];
            this.serviceInfo.dataList = [];
            this.serviceInfo.colorList = [];
            this.serviceInfo.valueList = [];
            this.serviceInfo.searchForm = {
              timeType: this.filters.dateRange,
              customTime: this.filters.createTime,
            };
            result.forEach((item) => {
              item.num= type == 1 ? item.totalFeeSum : type == 2 ? item.contractCount : type == 5 ? item.clueCount : item.followCount
              this.serviceInfo.nameList.push({
                value: item.userName,
                textStyle: {
                  fontWeight: item.boldFlag == true ? "bold" : "normal",
                  color: "#2c3e50",
                  fontSize: 14,
                },
              });
              this.serviceInfo.valueList.push(item);
              this.serviceInfo.colorList.push("#409eff");
              this.serviceInfo.dataList.push({
                xid: "12",
                value: item.num,
                label: {
                  fontWeight: item.boldFlag == true ? "bold" : "normal",
                },
              });
              this.hideCount += item.num;
            });
          }else if(result.length==0){
            this.hideCount = 0;
          }
          this.$nextTick(() => {
            this.refreshChild();
          });
          this.loading = false;
        }
      });
    },
    refreshChild() {
      if (this.$refs.child) {
        this.$refs.child.title = this.cTitle;
        this.$refs.child.showCount = this.hideCount;
        this.$refs.child.serviceInfo = this.serviceInfo;
        this.$refs.child.refreshData();
      }
    },
    getNodeData(val) {
      deptRoleList().then((response) => {
        this.rolesOptions = response.data.data;
      });
    },
    handleClick() {
      switch (this.activeName) {
        case "1":
          this.cTitle = "回款金额（元）";
          break;
        case "2":
          this.cTitle = "新增合同（份）";
          break;
        case "3":
          this.cTitle = "新增线索（条）";
          break;
        case "4":
          this.cTitle = "客户跟进（次）";
          break;
        case "5":
          this.cTitle = "创建线索（条）";
          break;
      }
      this.getList();
    },
  },
};
</script>

<style scoped>
#depart-rank {
  background: #fff;
  height: 554px;
  border-radius: 10px;
}
.right-filter-limit{
  margin-top: 14px;
  display: flex;
  align-items: center;
}
.tool-title {
  flex: 1.6;
  margin: 10px 0 0 15px;
  display: flex;
  align-items: center;
  color: #333333;
  font-size: 22px;
  font-weight: 700;
}
.tool-title img {
  width: 26px;
  height: 26px;
  margin-right: 1px;
}
.choose-time{
  margin: 0 10px;
}
.rank-title {
  margin: 15px 0 15px 45px;
  margin-left: 2%;
}
.rank-filters {
  margin: 10px 10px 10px 2%;
  z-index: 100;
  position: relative;
}
.date-radio-sty {
  width: 22%;
}
.rank-filters-content {
  display: flex;
  justify-content: flex-start;
}
.rank-tab-change {
  margin: 0 2% -10px 2%;
}
.depart-limit-sty {
  width: 100%;
  height: 440px;
  display: flex;
  flex: 1;
  margin-top: -30px;
}
.show-null-sty {
  height: 365px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: bold;
  color: #502c2c;
}
.dept-tab {
  flex: 6;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.active-more{
  height: 19px;
}
.more {
  width: 60px;
  font-size: 14px;
  cursor: pointer;
  color: #409eff;
}
</style>
<style>
#depart-rank .el-tabs__nav-wrap::after {
  display: none;
}
#depart-rank .el-input__suffix-inner .el-icon-circle-close {
  display: none !important;
}
</style>