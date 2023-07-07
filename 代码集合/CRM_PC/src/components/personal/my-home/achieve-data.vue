<!-- 排查完成 -->
<template>
  <div class="achieve-data">
    <div class="achieve-header">
      <div class="tool-title">
        <span>业绩数据</span>
      </div>
      <div class="achieve-top">
        <div class="achieve-sty-one">
          <el-form :model="filtersDepart">
            <el-form-item>
              <avue-input-tree
                class="dept-select"
                v-model="filtersDepart.depart"
                :node-click="getNodeData"
                :dic="treeData"
                @change="showData"
                :props="defaultProps"
                placeholder="请选择所属部门"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="achieve-filters">
          <el-form :model="filters" >
            <el-form-item>
              <el-radio-group
                v-model="filters.dateRange"
                @change="chooseRadio()"
              >
                <el-radio
                  v-for="(item, index) in dataList"
                  :key="index"
                  class="date-radio-sty"
                  :label="item.label"
                >
                  {{ item.value }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-form :model="filters" >
            <el-form-item>
              <el-date-picker
                v-model="filters.createTime"
                :unlink-panels="true"
                @change="selectDate"
                type="datetimerange"
                style="width: 200px;"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div v-loading="loading" style="margin: 0 10px;">
      <div
        class="achieve-list"
        v-for="(achieve, achiveIndex) in achieveList"
        :key="achiveIndex"
      >
        <div class="achieve-list-item" v-for="(item, index) in achieve" :key="index">
          <img :src="item.imgUrl" alt="" />
          <span class="show-title">{{ item.title }}</span>
          <div class="achieve-desc">
            <count-to v-if="item.count !== 0 && item.count !== null" :start-val="0" :end-val="item.title ? item.count : type == 3 ? item.list[0].count : item.list[1].count"
              :decimals="achiveIndex == 0 && index == 0 ? 2 : 0"
              :duration="3000"
              class="card-panel-num"
            />
            <span class="show-null-sty" v-if="item.title && (item.count == 0 || item.count == null)">暂无数据</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import { performanceStatistics } from "@/api/personal/myhome";
import { deptRoleList } from "@/api/admin/role";
export default {
  props:['treeData'],
  components: {
    CountTo,
  },
  data() {
    return {
      loading: false,
      type: 3,
      filtersDepart: {
        depart: "",
      },
      filters: {
        depart: "",
        dateRange: 3,
        createTime: null,
      },
      rolesOptions: [],
      // treeData: [],
      defaultProps: {
        label: "name",
        value: "id",
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
      achieveList: [
        [
          {
            imgUrl: require("@/assets/images/my-home/huikuanjine@2x.png"),
            title: "回款金额（元）",
            count: 0,
          },
          {
            imgUrl: require("@/assets/images/my-home/xinzenghetong@2x.png"),
            title: "新增合同（份）",
            count: 0,
          },
        ],
        [
          {
            imgUrl: require("@/assets/images/my-home/xinzengxiansuo@2x.png"),
            title: "创建线索（人）",
            count: 0,
          },
          {
            imgUrl: require("@/assets/images/my-home/kehugenjin@2x.png"),
            title: "客户跟进（次）",
            count: 0,
          },
        ],
      ],
    };
  },
  methods: {
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
      if (
        this.filtersDepart.depart == "" ||
        this.filtersDepart.depart == "undefined" ||
        this.filtersDepart.depart == null
      ) {
      } else {
        this.getList();
      }
    },
    getList() {
      this.loading = true;
      let params = {
        deptId: this.filtersDepart.depart,
        timeType: this.filters.dateRange,
      };
      if (this.filters.createTime !== null) {
        params.startTime = this.$moment(this.filters.createTime[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        params.endTime = this.$moment(this.filters.createTime[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      performanceStatistics(params).then((res) => {
        if(res.data.code == CodeMsg.CODE_0){
          this.loading = false;
          let data = res.data.data;
          this.achieveList[0][0].count = data.receiveCount;
          this.achieveList[0][1].count = data.contractCount;
          this.achieveList[1][0].count = data.clueCount;
          this.achieveList[1][1].count = data.followCount;
        }        
      });
    },
    getNodeData(val) {
      deptRoleList().then((response) => {
        this.rolesOptions = response.data.data;
      });
    },
  },
};
</script>

<style scoped>
.dept-select{
  width: 100px !important;
}
.select_sty {
  margin-bottom: 10px;
}
.achieve-data {
  background: #fff;
  border-radius: 10px;
}
.achieve-top{
  display: flex;
  align-items: baseline;
  margin-left: 15px;
}
.achieve-data-lang {
  border-bottom: 1px solid #e4e7ed;
}
.tool-title {
  display: flex;
  align-items: center;
  color: #333333;
  font-size: 22px;
  font-weight: 700;
  margin: 10px 0 0 15px;
}
.tool-title img {
  width: 26px;
  height: 26px;
  margin-right: 1px;
}
.show-title {
  font-size: 12px !important;
  margin-left: 5px;
}
.achieve-header {
  align-items: center;
}
.achieve-title {
  margin: 15px 0 15px 45px;
  margin-left: 3%;
}
.achieve-list {
  justify-content: center;
  align-items: center;
}
.achieve-list-item {
  position: relative;
  width: 96.6%;
  height: 88px;
  border-radius: 5px;
  margin-bottom: 4px;
  display: grid;
  grid-template-columns: repeat(2,1fr);
  align-items: center;
  background: #f0f3f9;
  color: #555555;
}
.achieve-list-item img {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
}
.achieve-list-item span {
  font-size: 16px;
}
.achieve-desc {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.3s;
  font-size: 20px !important;
}
.achieve-desc > span:nth-of-type(1) {
  font-size: 16px;
  margin-bottom: 10px;
}
.achieve-desc > span:nth-of-type(2) {
  font-size: 20px;
}
.achieve-desc:hover {
  color: #409eff;
}
.achieve-desc:hover .show-null-sty {
  color: #409eff;
}
.achieve-filters {
  margin: 10px 10px 0 0;
}
.date-radio-sty {
  flex: 1;
}
.achieve-sty-one {
  margin: 24px 22px 0 0;
}
.achieve-sty-two:nth-of-type(2) {
  flex: 1.2 !important;
}
.card-panel-num {
  font-size: 36px !important;
  font-weight: 550;
  color: #409eff;
}
.show-null-sty {
  transition: 0.3s;
  font-size: 16px !important;
  font-weight: bold;
  color: #2c3e50;
}
</style>
<style>
.achieve-data .el-input__suffix-inner .el-icon-circle-close {
  display: none !important;
}
.achieve-data .el-tabs__nav-wrap::after {
  display: none;
}
</style>