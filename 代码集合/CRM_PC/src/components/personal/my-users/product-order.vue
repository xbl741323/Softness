<template>
<!-- 排查完成 -->
  <div class="order-records">
    <div class="order-type">
      <span class="order-name-sty">订单类型：</span>
      <span class="order-type-btn">产品订单</span>
    </div>
    <div class="order-filter-item">
      <span class="order-name-sty">订单状态：</span>
      <el-radio-group v-model="filters.orderStatus" @change="changeTab()">
        <el-radio-button
          v-for="(item, index) in statusList"
          :key="index"
          border
          :label="item.value"
          :class="['order-btn-sty', index > 0 ? 'order-border-sty' : '']">
          <span v-if="item.value == 0" class="circle-red"></span>
          <span v-if="item.value == 1" class="circle-red circlePurple"></span>
          <span v-if="item.value == -1" class="circle-red circlePurple"></span>
          <span v-if="item.value == 2" class="circle-blue"></span>
          <span v-if="item.value == 3" class="circle-blue circleYellow"></span>
          <span v-if="item.value == 4" class="success"><b>✔</b></span>
          <span>{{ item.label }}</span>
          <span v-if="item.value!=null && item.value < 4">
            <span v-show="item.value==0&&infoList.waitPayCount!=null">（{{ infoList.waitPayCount }}）</span>
            <span v-show="item.value==-1&&infoList.waitSignElectronCount!=null">（{{ infoList.waitSignElectronCount }}）</span>
            <span v-show="item.value==1&&infoList.waitSignPaperCount!=null">（{{ infoList.waitSignPaperCount }}）</span>
            <span v-show="item.value==2&&infoList.waitStartCount!=null">（{{ infoList.waitStartCount }}）</span>
            <span v-show="item.value==3&&infoList.inUseCount!=null">（{{ infoList.inUseCount }}）</span>
          </span>
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="order-filter-item">
      <span class="order-name-sty">尾款状态：</span>
      <el-radio-group v-model="filters.tailStatus" @change="changeTab()">
        <el-radio-button
          v-for="(item, index) in tatusList"
          :key="index"
          border
          :label="item.value"
          :class="['order-btn-sty', index > 0 ? 'order-border-sty' : '']">
          <span v-if="item.value == 0" class="circle-blue circleYellow"></span>
          <span v-if="item.value == 1" class="circle-red"></span>
          <span v-if="item.value == 2" class="success"><b>✔</b></span>
          <span>{{ item.label }}</span>
        </el-radio-button>
      </el-radio-group>
    </div>
    <el-form :model="filters" inline @keyup.enter.native="getAllList()">
      <el-form-item label="关键字：">
        <el-input
          class="order-input-sty"
          v-model.trim="filters.keyWords"
          placeholder="产品名称关键字/订单编号/线索编号"></el-input>
      </el-form-item>
      <el-form-item label="产品类型：">
          <el-select v-model="filters.orderType" placeholder="请选择" @change="changeTab()">
          <el-option :value=null label="全部"></el-option>
          <el-option v-for="(item,index) in optionList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
          v-model="filters.createTime"
          :unlink-panels="true"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
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
        <el-button type="text" size="small" icon="el-icon-view" @click="handleDetail(scope.row)">{{ $t("button.check") }}</el-button>
      </template>
      <!-- 订单编号 -->
      <template slot="orderNo" slot-scope="scope">
        <span id="handle-style" @click="handleDetail(scope.row)">{{scope.row.orderNo}}</span>
      </template>
      <!-- 线索编号 -->
      <template slot="clueNo" slot-scope="scope">
        <span>{{scope.row.clueNo}}</span>
      </template>
      <!-- 订单总价 -->
      <template slot="totalAmount" slot-scope="scope">
        <span>{{ scope.row.totalAmount | priceFilter }}</span>
      </template>
      <!-- 尾款状态 -->
      <template slot="tailStatus" slot-scope="scope">
        <div class="order-status-sty">
          <span v-if="scope.row.tailStatus == 0" class="circle-blue circleYellow"></span>
          <span v-if="scope.row.tailStatus == 1" class="circle-red"></span>
          <span v-if="scope.row.tailStatus == 2" class="success"><b>✔</b></span>
          <span>{{ scope.row.tailStatus | tailStatusFilter }}</span>
        </div>
      </template>
      <!-- 订单状态 -->
      <template slot="orderStatus" slot-scope="scope">
        <div class="order-status-sty">
          <span v-if="scope.row.orderStatus== 0" class="circle-red"></span>
          <span v-if="scope.row.orderStatus == 1" class="circle-red circlePurple"></span>
          <span v-if="scope.row.orderStatus == 2" class="circle-blue"></span>
          <span v-if="scope.row.orderStatus == 3" class="circle-blue circleYellow"></span>
          <span v-if="scope.row.orderStatus == 4" class="success"><b>✔</b></span>
          <span v-if="scope.row.orderStatus != 1">{{scope.row.orderStatus | orderStatusFilter }}</span>
          <span v-if="scope.row.orderStatus == 1">{{scope.row.contractType == 1 ? '待签约-电子' : '待签约-纸质'}}</span>
        </div>
      </template>
      <!-- 签约人 -->
      <template slot="signName" slot-scope="scope">
        <div>
          <span v-if="scope.row.signName == null">/</span>
          <span v-else>{{scope.row.signName}}</span>
        </div>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import orderData from '@/components/order/order-data.js'
import { getClueProduct, getMyProductList, getStatusCount, getMyStatusCount} from "@/api/admin/user";
import * as CodeMsg from "@/api/common/CodeChange"
import { mapGetters } from "vuex";
import { tableOption } from "@/const/crud/user/order-records";
export default {
  //personal-个人中心 list-订单管理
  props: ["source",'clueIdList','clueType'],
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
      statusList: orderData.statusList,
      tatusList: orderData.finalStatusList,
      filters: {
        orderType: null,
        orderStatus: null,
        tailStatus:null,
        keyWords: "",
        createTime: null,
      },
      infoList:{},
      optionList: orderData.proTypeData 
    };
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  filters: {
    priceFilter(value) {
      return value == null ? "待定" : value.toFixed(2);
    },
    voucherFilter(value) {
      return value == 0 ? "审核中" : value == 2 ? "未通过" : "";
    },
    tailStatusFilter(value){
      return value == 0 ? "待定" : value == 1 ? "待付款"  : value == 2 ? "已结清" : "无";;
    },
    orderStatusFilter(value){
      return orderData.onlinetransformOrderStatus(value);
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
    // 获取订单状态数目
    getCount() {
      let params = {
        keyWord: this.filters.keyWords,
        tailStatus:this.filters.tailStatus,
        startTime:
          this.filters.createTime == null
            ? ""
            : this.$moment(this.filters.createTime[0]).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
        endTime:
          this.filters.createTime == null
            ? ""
            : this.$moment(this.filters.createTime[1]).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
        categoryId: this.filters.orderType,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        userId: Number(this.$route.query.userId),
        clueIdList: this.clueIdList || null,
        clueType: parseInt(this.clueType)+1
      };
      if(this.source == 'list'){
        getStatusCount(params).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.infoList = res.data.data;
          }
        });
      }else{
        getMyStatusCount(params).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.infoList = res.data.data;
          }
        });
      }
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      this.tableLoading = true;
      let params = {
        keyWord: this.filters.keyWords,
        startTime:
          this.filters.createTime == null
            ? ""
            : this.$moment(this.filters.createTime[0]).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
        endTime:
          this.filters.createTime == null
            ? ""
            : this.$moment(this.filters.createTime[1]).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
        userId: Number(this.$route.query.userId),
        categoryId: this.filters.orderType,
        orderStatus: this.filters.orderStatus == -1 ? 1 : this.filters.orderStatus,
        contractType: this.filters.orderStatus == -1 ? 1 : this.filters.orderStatus == 1 ? 2 : null,
        tailStatus:this.filters.tailStatus,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        clueIdList: this.clueIdList || null,
        clueType: parseInt(this.clueType)+1
      };
      // if(this.source == 'list'){
        getClueProduct(params).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.dataList = res.data.data.records;
            this.page.total = res.data.data.total;
            this.getCount();
            this.tableLoading = false;
          }
        });
      // }else{
      //   getMyProductList(params).then((res) => {
      //     if (res.data.code == CodeMsg.CODE_0) {
      //       this.dataList = res.data.data.records;
      //       this.page.total = res.data.data.total;
      //       this.getCount();
      //       this.tableLoading = false;
      //     }
      //   });
      // }
      
    },
    reset(filterName) {
      this.filters.keyWords = "";
      this.filters.createTime = null;
      this.filters.orderStatus = null;
      this.filters.tailStatus = null;
      this.filters.orderType = null;
      this.getAllList();
    },
    changeTab() {
      this.page.currentPage = 1;
      this.getList();
    },
    // 项目1 知产2（3456）工商财税7 融资上市9 法律服务10 软件开发11
    checkPermissions(id){
      let permissions = this.permissions
      console.log(permissions)
      switch(id){
       case 1:
       return permissions.bt_order_detail_project?true:false
       case 2:
       return permissions.bt_order_detail_property?true:false
       case 3:
       return permissions.bt_order_detail_property?true:false
       case 4:
       return permissions.bt_order_detail_property?true:false
       case 5:
       return permissions.bt_order_detail_property?true:false
       case 6:
       return permissions.bt_order_detail_property?true:false
       case 7:
       return permissions.bt_order_detail_csfw?true:false
       case 9:
       return permissions.bt_order_detail_rzss?true:false
       case 10:
       return permissions.bt_order_detail_flfw?true:false
       case 11:
       return permissions.bt_order_detail_rjkf?true:false
     }
    },
    checkPersonalPermissions(){
      let permissions = this.permissions
      return permissions.bt_sys_order_detail_product_my
    },
    handleDetail(row){
      let power = this.source == 'list'? this.checkPermissions(row.categoryId):this.checkPersonalPermissions();
      let pathParams = {
        orderId: row.id,
        source: this.source,
      }
      if(this.source == 'list'){
        pathParams.portType = row.categoryId
      }
      if(power){
      this.$router.push({
        path: "/orderonline-detail",
        query: pathParams,
      });
      }else{
        this.$message({
          type:'warning',
          message:"权限不足",
          offset:300
        })
      }
    },
  },
  mounted(){
    this.getCount();
  }
};
</script>

<style scoped>
/* .order-records {
  padding: 0 30px;
} */
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
.circle-red {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: red;
  margin-right: 6px;
}
.circlePurple {
  background: #CC00FF;
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
.order-type{
  margin-bottom: 20px;
}
.order-type-btn{
  border-radius: 4px !important;
  background: #409EFF;
  font-size: 12px;
  padding: 8px 10px;
  color: #ffffff;
}
</style>