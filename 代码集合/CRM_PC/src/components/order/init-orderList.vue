<template>
  <div class="init-order-list">
    <div class="order-filter-item">
      <span class="order-name-sty">链接状态：</span>
      <el-radio-group v-model="initForm.orderStatus" @change="getInitOrderList()">
        <el-radio-button v-for="(item, index) in initOrderStatusList" :key="index" border :label="item.value"
          :class="['order-btn-sty', index > 0 ? 'order-border-sty' : '']">
          <span v-if="item.value == -1" class="circle-blue circleYellow"></span>
          <span v-if="item.value == -2" class="circle-red"></span>
          <span>{{ item.label }}</span>
          <span v-if="item.value == -2">({{ statistics.draftCount }})</span>
          <span v-if="item.value == -1">({{ statistics.ineffectiveCount }})</span>
          <span v-if="item.value == -4">({{ statistics.waitAuditCount }})</span>
          <span v-if="item.value == -5">({{ statistics.notPassCount }})</span>
        </el-radio-button>
      </el-radio-group>
    </div>
    <el-form :model="initForm" inline @keyup.enter.native="getInitOrderList()">
      <el-form-item label="关键字：">
        <el-input class="key-input" placeholder="请输入产品名称/线索名称关键字或线索编号" v-model="initForm.keyWords" />
      </el-form-item>
      <el-form-item label="订单归属：">
        <el-input v-model.trim="initForm.belongName" placeholder="输入员工姓名/工号" />
      </el-form-item>
      <el-form-item label="支付方式：">
        <el-select v-model="initForm.payTypeFlag">
          <el-option v-for="item in initPayType" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getInitOrderList()">搜 索</el-button>
      <el-button type="warning" @click="resetInitForm()">重 置</el-button>
      <div class="high-sty">
        <el-checkbox v-model="senior">高级搜索</el-checkbox>
      </div>
      <div v-if="senior">
        <el-form-item label="线索归属：">
          <el-input v-model.trim="initForm.clueAttributionEmpName" placeholder="输入员工姓名/工号" />
        </el-form-item>
        <el-form-item label="业务员：">
          <el-input v-model.trim="initForm.clueSalesmanEmpName" placeholder="输入员工姓名/工号" />
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-date-picker v-model="initForm.createTime" :unlink-panels="true" type="datetimerange" range-separator="-"
            value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" start-placeholder="开始日期"
            end-placeholder="结束日期" class="order-time">
          </el-date-picker>
        </el-form-item>
      </div>
    </el-form>
    <avue-crud class="table-init-order" :option="initOrderOption" :data="initOrderList" :page.sync="page"
      @on-load="getInitOrderList" @size-change="sizeChange" @current-change="currentChange">
      <template slot="belongName" slot-scope="{ row }">
        <el-tooltip effect="dark" :content="'工号：' + empNo + ' 部门：' + deptName" placement="top">
          <span @mouseover="showUserInfo(row.belongId)">{{ row.belongName }}</span>
        </el-tooltip>
      </template>
      <template slot="clueAttributionEmpName" slot-scope="{ row }">
        <el-tooltip effect="dark" :content="'工号：' + empNo + ' 部门：' + deptName" placement="top">
          <span @mouseover="showUserInfo(row.clueAttributionEmpId)">{{ row.clueAttributionEmpName }}</span>
        </el-tooltip>
      </template>
      <template slot="clueSalesmanEmpName" slot-scope="{ row }">
        <el-tooltip effect="dark" :content="'工号：' + empNo + ' 部门：' + deptName" placement="top">
          <span @mouseover="showUserInfo(row.clueSalesmanEmpId)">{{ row.clueSalesmanEmpName }}</span>
        </el-tooltip>
      </template>
      <template slot="tailStatus" slot-scope="{ row }">
        <p>{{ row.tailStatus | tailStatus }}</p>
      </template>
      <!-- 尾款状态（0：待定；1：待付款；2：已结清；3：无）', -->
      <template slot="totalAmount" slot-scope="{ row }">
        <p>{{ row.tailStatus == 0 ? '待定' : row.totalAmount }}</p>
      </template>
      <template slot="orderStatus" slot-scope="{ row }">
        <div class="order-status-sty">
          <span v-if="row.orderStatus == -4" class="circle-blue circleYellow"></span>
          <span v-if="row.orderStatus == -5" class="circle-red"></span>
          <span>{{ row.orderStatus | orderStatus }}</span>
        </div>
      </template>
      <template slot="menu" slot-scope="{row}">
        <el-button type="text"
          v-if="(permissions.bt_order_detail_init && !pathBool) || (permissions.bt_order_detail_init_my && pathBool)"
          @click="handleDetail(row)">查看</el-button>
        <el-button type="text"
          v-if="(row.orderStatus == -2 && ((permissions.bt_amend_order_init && !pathBool) || (permissions.bt_order_amend_init_my && pathBool)))"
          @click="update(row)">修改</el-button>
        <el-popconfirm :key="'a' + Date.now()" confirm-button-text='确定' cancel-button-text='取消'
          @confirm="(permissions.bt_delete_order_init && !pathBool) || (permissions.bt_delete_order_init_my && pathBool) ? operate(row, 'del') : $notAuthorized()"
          icon="el-icon-info" icon-color="red" title="确定删除该条订单吗？">
          <el-button class="close-del-btn" slot="reference" type="text"
            v-if="(row.orderStatus == -3 || row.orderStatus == -2 || row.orderStatus == -5) && ((permissions.bt_delete_order_init && !pathBool) || (permissions.bt_delete_order_init_my && pathBool))">删除</el-button>
        </el-popconfirm>
      </template>
    </avue-crud>
    <!-- 编辑订单 -->
    <el-dialog :visible.sync="editOrderDialog" title="修改订单信息" top="5vh" :close-on-click-modal="false" width="820px">
      <edit-init-order v-if="editOrderDialog" :pathBool="pathBool" :productData='hasSelectedProducts' :orderId="orderId"
        :operate="false" @closeDialog="closeDialog"></edit-init-order>
    </el-dialog>
  </div>
</template>

<script>
import { initOrderOption } from '@/const/crud/order/initorder.js'
import { getInitOrder, operateOrder, getInitOrderStatistics, getInitOrderList, getInitOrderListStatistics, getInitCode } from "@/api/order/index";
import EditInitOrder from './edit-initOrder.vue'
import orderData from './order-data'
import VueQr from "vue-qr";
import { mapGetters } from 'vuex';
import { saveDetal } from "@/util/clearDetail";
export default {
  props: {
    portType: {
      type: String,
      value: '1'
    },
    orderType: {},
    //来源 0-我的订单  1- 订单列表
    source: {}
  },
  components: {
    EditInitOrder,
    VueQr
  },
  data() {
    return {
      pathBool: this.$route.path.includes("/personal-order"),
      senior: false,
      page: {
        pageSize: 20,
        currentPage: 1,
        pages: [5, 10, 20, 50],
        total: 0
      },
      initOrderList: [],
      initForm: {
        orderStatus: null
      },
      initOrderOption: initOrderOption,
      initPayType: orderData.initPayType,
      editOrderDialog: false,
      hasSelectedProducts: [],
      initOrderStatusList: orderData.initOrderStatusList,
      statistics: {},
      wxOrderLink: '',
      pcOrderLink: '',
      code: '',
      orderId: ''
    }
  },
  filters: {
    orderStatus(val) {
      return orderData.initOrderStatus(val);
    },
    tailStatus(val) {
      return orderData.tailStatus(val);
    }
  },
  computed: {
    changeOrderType() {
      return this.orderType;
    },
    ...mapGetters(['permissions'])
  },
  watch: {
    changeOrderType(val) {
      if (val >= 1 || val == null) {
        this.page.currentPage = 1;
        this.getInitOrderList();
      }
    },
  },
  created(){
    if(sessionStorage.getItem(`${this.$route.path}`)){
      let keepParams = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
      if(keepParams.detail.path!==''){
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query
        })
        return;
      }
      for(let i in keepParams.params){
        if(keepParams.params[i]){
          this.initForm[i] = keepParams.params[i]
        }
      }
      this.senior = keepParams.page.senior
      this.page.currentPage = keepParams.page.currentPage
      this.page.pageSize = keepParams.page.pageSize
    }
  },
  mounted() {
    
  },
  methods: {
    handleDetail(row) {
      sessionStorage.setItem('whichdetail', 3);
      let path = '/initorder-detail'
      let query = {
        source: this.source,
        id: row.id,
        pathBool: this.pathBool ? 'personal' : "list"
      }
      this.$router.push({
        path: path,
        query: query
      })
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path:path, query: query });
    },
    closeDialog() {
      this.editOrderDialog = false;
      this.getInitOrderList();
    },
    update(row) {
      let obj = JSON.parse(JSON.stringify(row));
      obj.orderId = obj.id;
      obj.id = obj.spuId;
      this.hasSelectedProducts = [obj];
      this.orderId = obj.orderId;
      this.editOrderDialog = true;
    },
    resetInitForm() {
      this.initForm = {
        orderStatus: null
      };
      this.senior = false
      this.$emit("reset",true);
      this.getInitOrderList();
    },
    operate(row, operateName) {
      operateOrder({ orderId: row.id }, operateName, this.pathBool).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: 'success',
            message: res.data.msg,
            duration: 2000
          })
          this.getInitOrderList();
        } else {
          this.$message({
            type: 'warning',
            message: res.data.msg,
            duration: 2000
          })
        };
      })
    },
    getInitOrderList() {
      let personalParam = {
        keyWord: this.initForm.keyWords,
        payTypeFlag: this.initForm.payTypeFlag,
        categoryId: this.orderType,
        orderStatus: this.initForm.orderStatus,
        belongInfo: this.initForm.belongName,
        clueAttributionEmpInfo: this.initForm.clueAttributionEmpName,
        clueSalesmanEmpInfo: this.initForm.clueSalesmanEmpName,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      }
      if (this.initForm.createTime) {
        personalParam.startTime = this.initForm.createTime[0];
        personalParam.endTime = this.initForm.createTime[1];
      };
      let keepParams = {
          params: this.initForm,
          page: {
            currentPage: this.page.currentPage,
            pageSize: this.page.pageSize,
            orderType: this.orderType,
            senior: this.senior,
          },
          detail:{
            path:'',
            query:{}
          }
        }
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams))
      if (this.source == 0) {
        getInitOrder(personalParam).then(res => {
          this.initOrderList = res.data.data.records;
          this.page.total = res.data.data.total;
        })
        let persoanlParams = {
          keyWord: this.initForm.keyWords,
          categoryId: this.orderType,
          belongInfo: this.initForm.belongName,
          clueAttributionEmpInfo: this.initForm.clueAttributionEmpName,
          clueSalesmanEmpInfo: this.initForm.clueSalesmanEmpName,
        }

        if (this.initForm.createTime) {
          persoanlParams.startTime = this.initForm.createTime[0];
          persoanlParams.endTime = this.initForm.createTime[1];
        };
        getInitOrderStatistics(persoanlParams).then(res => {
          this.statistics = res.data.data;
        })
      } else {
        let listParam = {
          keyWord: this.initForm.keyWords,
          payTypeFlag: this.initForm.payTypeFlag,
          categoryId: this.orderType,
          orderStatus: this.initForm.orderStatus,
          belongInfo: this.initForm.belongName,
          clueAttributionEmpInfo: this.initForm.clueAttributionEmpName,
          clueSalesmanEmpInfo: this.initForm.clueSalesmanEmpName,
          pageNo: this.page.currentPage,
          pageSize: this.page.pageSize
        }
        if (this.initForm.createTime) {
          listParam.startTime = this.initForm.createTime[0];
          listParam.endTime = this.initForm.createTime[1];
        };
        getInitOrderList(listParam, this.portType, this.pathBool).then(res => {
          this.initOrderList = res.data.data.records;
          this.page.total = res.data.data.total;
        })
        let listParams = {
          keyWord: this.initForm.keyWords,
          categoryId: this.orderType,
          belongInfo: this.initForm.belongName,
          clueAttributionEmpInfo: this.initForm.clueAttributionEmpName,
          clueSalesmanEmpInfo: this.initForm.clueSalesmanEmpName,
        }
        if (this.initForm.createTime) {
          listParams.startTime = this.initForm.createTime[0];
          listParams.endTime = this.initForm.createTime[1];
        };
        getInitOrderListStatistics(listParams, this.portType).then(res => {
          this.statistics = res.data.data;
        })
      };
    },
    sizeChange(val) { },
    currentChange(val) { },
  }
}
</script>

<style scoped>
.init-order-list {
  margin: 10px;
}

.table-init-order {
  margin-top: 20px;
}

.close-del-btn {
  margin-left: 10px;
  color: red;
}

.key-input {
  width: 300px;
}

.order-btn-sty {
  margin: 0 20px 0 0;
}

.order-border-sty {
  border-left: 1px solid #dcdfe6;
}

.order-filter-item {
  margin: 0 20px 15px 0;
}

.order-name-sty {
  color: #606266;
}

.code-sty {
  padding: 15px;
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  border-radius: 3px;
}

.link-title {
  font-size: 16px;
  font-weight: 550;
}

.link-copy {
  color: #36a6fe;
}

.wx-link {
  width: 300px;
  margin: 0 auto;
  font-size: 12px;
  color: #666666;
  text-align: center;
}

.order-status-sty {
  display: flex;
  justify-content: center;
  align-items: center;
}

.high-sty {
  margin-bottom: 10px;
}
</style>