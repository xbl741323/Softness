<template>
  <div class="order-records">
    <div class="order-filter-item">
      <span class="order-name-sty">订单状态：</span>
      <el-radio-group v-model="filters.orderStatus" @change="changeTab()">
        <el-radio-button
          v-for="(item, index) in tatusList"
          :key="index"
          border
          :label="item.orderStatus"
          :class="['order-btn-sty', index > 0 ? 'order-border-sty' : '']">
          <span v-if="item.orderStatus == 0" class="circle-blue"></span>
          <span v-if="item.orderStatus == 4" class="success"><b>✔</b></span>
          <span
            v-if="item.orderStatus == 2"
            class="circle-blue circleYellow"></span>
          <span>{{ item.label }}</span>
          <span v-if="
              item.orderStatus == 0 ||
              item.orderStatus == 2 ||
              item.orderStatus == 6 ||
              item.orderStatus == 9
            ">（{{ item.count }}）</span>
        </el-radio-button>
      </el-radio-group>
    </div>
    <el-form :model="filters" inline @keyup.enter.native="getAllList()">
      <el-form-item label="关键字：">
        <el-input
          class="order-input-sty"
          v-model.trim="filters.keyWords"
          placeholder="产品名称关键字/订单编号"></el-input>
      </el-form-item>
      <el-form-item label="订单类型：">
          <el-select v-model="filters.orderType" placeholder="请选择" @change="changeTab()">
            <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item.title"
                :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
          v-model="filters.createTime"
          :unlink-panels="true"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getList()" class="mar">搜索</el-button>
      <el-button @click="reset('filters')" class="mar">重置</el-button>
    </el-form>
    <avue-crud
      ref="crud"
      :table-loading="tableLoading"
      :page.sync="page"
      :data="dataList"
      :option="option"
      @on-load="getList">
      <template slot="menu" slot-scope="scope">
        <el-button
          type="text"
          size="small"
          icon="el-icon-view"
          @click="handleDetail(scope.row)">{{ $t("button.check") }}</el-button>
      </template>
      <template slot="orderNumber" slot-scope="scope">
        <span id="handle-style" @click="handleDetail(scope.row)">{{scope.row.orderNo}}</span>
      </template>
      <template slot="productName" slot-scope="scope">
        <span>{{ scope.row.orderDetail.productName }}</span>
      </template>
      <template slot="productNum" slot-scope="scope">
        <span>{{ scope.row.orderDetail.productCount }}</span>
      </template>
      <template slot="orderTotalPrice" slot-scope="scope">
        <span>{{ scope.row.totalAmount | priceFilter }}</span>
      </template>
      <template slot="orderStatus" slot-scope="scope">
        <span v-if="scope.row.autStatus==0&&scope.row.orderStatus!=6">待认证</span>
        <div v-else class="order-status-sty">
          <span v-if="scope.row.orderStatus == 0" class="circle-blue"></span>
          <span v-if="scope.row.orderStatus == 4" class="success"><b>✔</b></span>
          <span
            v-if="scope.row.orderStatus == 2"
            class="circle-blue circleYellow"></span>
          <span :class="scope.row.orderStatus == 6 ? 'red-txt' : ''">{{scope.row.orderStatus | statusFilter }}</span>
        </div>
        <p v-if="(scope.row.vouCherStatus == 0 && scope.row.orderStatus == 6) || (scope.row.vouCherStatus == 2 && scope.row.orderStatus == 6)" class="transfer-status">
          对公转账{{ scope.row.vouCherStatus | voucherFilter }}
        </p>
      </template>
      <template slot="engnier" slot-scope="scope">
        <div v-if="scope.row.taskEmps&&scope.row.taskEmps!==null&&scope.row.taskEmps.length>0">
          <div class="disbale_content" v-for="(item,index) in scope.row.taskEmps.slice(0,2)" :key="index">
          <el-tooltip effect="dark" :content="$t('label.jobNumber') +'：' +item.no +' ' +$t('message.emp') +item.deptName" placement="right">
            <span>{{ item.name }}</span>
          </el-tooltip>
          <img v-if="item.lockFlag !== null && item.lockFlag == '9'"
            class="disable_img_sty"
            :src="baseUrl + 'img/disable.png'"
            alt=""/>
          </div>
          <div v-if="scope.row.taskEmps.length>2">...</div>
        </div>
        <div v-else>待分配</div>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getUserOrder, getOrderCount } from "@/api/admin/user";
import * as CodeMsg from "@/api/common/CodeChange"
import { tableOption } from "@/const/crud/user/order-records";
export default {
  //personal-个人中心 list-订单管理
  props: ["source"],
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      dataList: [],
      tableLoading: false,
      option: tableOption,
      page: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [10, 20, 30, 50, 100],
      },
      isOnline: false, // 是否是线上交易知产 true:是 false:否
      typeList: [
        {
          title: "全部",
          value: null,
        },
        {
          title: "项目申报",
          value: 1,
        },
        {
          title: "知识产权",
          value: 0,
        },
      ],
      tatusList: [],
      filters: {
        orderType: null,
        orderStatus: null,
        keyWords: "",
        createTime: null,
      },
    };
  },
  filters: {
    priceFilter(value) {
      return value == null ? "待定" : (value / 100).toFixed(2);
    },
    voucherFilter(value) {
      return value == 0 ? "审核中" : value == 2 ? "未通过" : "";
    },
    statusFilter(value) {
      return value == 1
        ? "待分配"
        : value == 0
        ? "待开始"
        : value == 2
        ? "进行中"
        : value == 3
        ? "已暂停"
        : value == 4
        ? "已完成"
        : value == 5
        ? "已关闭"
        : value == 6
        ? "待付款"
        : value == 7
        ? "已取消"
        : value == 8
        ? "已删除"
        : "";
    },
  },
  methods: {
    getCount() {
      let params = {
        accountId: this.$route.query.id,
        orderType: this.filters.orderType,
        orderSource: 1,
      };
      getOrderCount(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.tatusList = res.data.data.status;
        }
      });
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      this.tableLoading = true;
      let params = {
        accountId: this.$route.query.id,
        keyWords: this.filters.keyWords,
        gmtCreateStart:
          this.filters.createTime == null
            ? ""
            : this.$moment(this.filters.createTime[0]).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
        gmtCreateEnd:
          this.filters.createTime == null
            ? ""
            : this.$moment(this.filters.createTime[1]).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
        orderType: this.filters.orderType,
        orderStatus: this.filters.orderStatus,
        current: this.page.currentPage,
        size: this.page.pageSize,
      };
      getUserOrder(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.dataList = res.data.data.records;
          this.page.total = res.data.data.total;
          this.getCount();
          this.tableLoading = false;
        }
      });
    },
    reset(filterName) {
      this.filters.keyWords = "";
      this.filters.createTime = null;
      this.getAllList();
    },
    changeTab() {
      this.getList();
    },
    handleDetail(row) {
      // 线上知产订单
      if (row.orderSource == 1) {
        this.$router.push({
          path: "/orderonline-detail",
          query: {
            orderId: row.id,
            source: this.source,
          },
        });
        sessionStorage.setItem("whichdetail", 1);
      } else {
        this.$router.push({
          path: "/order-detail",
          query: {
            orderId: row.id,
            source: this.source,
          },
        });
        sessionStorage.setItem("whichdetail", 0);
      }
    },
  },
};
</script>

<style scoped>
.order-records {
  padding: 0 30px;
}
.order-filter-item {
  margin: 0 0 15px 0;
}
.order-name-sty {
  font-size: 14px;
  color:#606266;
}
.order-btn-sty {
  margin: 0 20px 0 0;
}
.order-border-sty {
  border-left: 1px solid #dcdfe6;
}
.order-input-sty {
  width: 300px;
}
#handle-style {
  color: rgb(64, 158, 255) !important;
  cursor: pointer;
}
.disbale_content {
  display: flex;
  justify-content: center;
}
.disable_img_sty {
  width: 20px;
  height: 20px;
  margin-left: 3px;
}
.red-txt {
  color: red;
}
.circle-blue {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 6px;
}
.circleYellow {
  background: #ff9900;
}
.success {
  font-weight: bolder;
  font-size: 12px;
  float: left;
  color: green;
  margin-top: 2px;
  margin-right: 6px;
}
.transfer-status {
  font-size: 12px;
  color: #999;
  margin: -5px 0;
}
.order-status-sty{
  display: flex;
  justify-content: center;
  align-items: center;
}
.mar {
    margin:2px 5px 20px 5px;
}
</style>