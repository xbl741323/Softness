<template>
  <div class="order_main" v-if="orderData">
    <div class="list-header">
      <p class="rectangle"></p>
      <b class="text">订单信息</b>
    </div>
    <!-- 审核通过状态订单详情 -->
    <div class="table" style="text-align:center">
      <!-- 头：列名   -->
      <el-row type="flex" align="middle" class="thead">
        <el-col :span="3"><span>产品名称</span></el-col>
        <el-col :span="3"><span>规格属性</span></el-col>
        <el-col :span="3"><span>类别</span></el-col>
        <el-col :span="3"><span>数量</span></el-col>
        <el-col :span="3"><span>支付方式</span></el-col>
        <el-col :span="3"><span>代理费单价</span></el-col>
        <el-col :span="3"><span>第三方费用单价</span></el-col>
        <el-col :span="3"><span>官费单价</span></el-col>
        <el-col :span="3"><span>订单总价</span></el-col>
      </el-row>
      <!-- 订单列表 -->
      <div class="list">
        <el-row type="flex" align="middle">
          <el-col :span="3"
            ><span v-if="orderData">{{
              orderData.orderInfo.spuName
            }}</span></el-col
          >
          <el-col :span="3"
            ><span>{{ orderData.orderInfo.spec }}</span></el-col
          >
          <el-col :span="21">
            <template>
              <el-row type="flex" align="middle">
                <el-col :span="3">标准商品 </el-col>
                <el-col :span="4">{{ orderData.orderInfo.buyNum }} </el-col>
                <el-col :span="3">
                  {{
                    frontlist[0].payTypeId == 3 ? "一次性付款" : "定金尾款"
                  }}</el-col
                >
                <template>
                  <template v-if="frontlist[0].payTypeId !== 3">
                    <el-col :span="4">
                      <template>
                        <p
                          class="txt-sty"
                          v-if="fixPayTypePrice(2, 1) == '待定'"
                        >
                          总价：待定
                        </p>
                        <p class="txt-sty" v-else>总价：{{ fixPrice(1) }}</p>
                        <p>定金：{{ fixPayTypePrice(1, 1) }}</p>
                        <p>尾款：{{ fixPayTypePrice(2, 1) }}</p>
                      </template>
                    </el-col>
                    <el-col :span="3">
                      <template>
                        <p
                          class="txt-sty"
                          v-if="fixPayTypePrice(2, 2) == '待定'"
                        >
                          总价：待定
                        </p>
                        <p class="txt-sty" v-else>总价：{{ fixPrice(2) }}</p>
                        <p>定金：{{ fixPayTypePrice(1, 2) }}</p>
                        <p>尾款：{{ fixPayTypePrice(2, 2) }}</p>
                      </template></el-col
                    >
                    <el-col :span="4">
                      <template>
                        <p
                          class="txt-sty"
                          v-if="fixPayTypePrice(2, 3) == '待定'"
                        >
                          总价：待定
                        </p>
                        <p class="txt-sty" v-else>总价：{{ fixPrice(3) }}</p>
                        <p>定金：{{ fixPayTypePrice(1, 3) }}</p>
                        <p>尾款：{{ fixPayTypePrice(2, 3) }}</p>
                      </template>
                    </el-col>
                  </template>
                  <template v-else>
                    <el-col :span="4">{{ fixPrice(1) }} </el-col>
                    <el-col :span="3">{{ fixPrice(2) }} </el-col>
                    <el-col :span="4">{{ fixPrice(3) }} </el-col>
                  </template>
                </template>
                <el-col
                  :span="3"
                  v-if="
                    fixPayTypePrice(2, 1) == '待定' ||
                      fixPayTypePrice(2, 2) == '待定'
                  "
                  >待定</el-col
                >
                <el-col :span="3" v-else>{{
                  getsummoenty(frontlist, 1)
                }}</el-col>
              </el-row>
              <el-row type="flex" align="middle">
                <el-col :span="3">改价后 </el-col>
                <el-col :span="4">{{ orderData.priceInfo.buyNum }} </el-col>
                <el-col :span="3">
                  {{ queenList[0].payTypeId == 3 ? "一次性付款" : "定金尾款" }}
                </el-col>
                <template
                  v-if="queenList[0].payTypeId !== 3 && queenList !== null"
                >
                  <el-col :span="4">
                    <template>
                      <p
                        class="txt-sty"
                        v-if="fixPayTypePriceQueen(2, 1) == '待定'"
                      >
                        总价：待定
                      </p>
                      <p class="txt-sty" v-else>总价：{{ fixPriceQueen(1) }}</p>
                      <p>定金：{{ fixPayTypePriceQueen(1, 1) }}</p>
                      <p>尾款：{{ fixPayTypePriceQueen(2, 1) }}</p>
                    </template>
                  </el-col>
                  <el-col :span="3">
                    <template>
                      <p
                        class="txt-sty"
                        v-if="fixPayTypePriceQueen(2, 2) == '待定'"
                      >
                        总价：待定
                      </p>
                      <p v-else class="txt-sty">总价：{{ fixPriceQueen(2) }}</p>
                      <p>定金：{{ fixPayTypePriceQueen(1, 2) }}</p>
                      <p>尾款：{{ fixPayTypePriceQueen(2, 2) }}</p>
                    </template></el-col
                  >
                  <el-col :span="4">
                    <template>
                      <p
                        class="txt-sty"
                        v-if="fixPayTypePriceQueen(2, 3) == '待定'"
                      >
                        总价：待定
                      </p>
                      <p v-else class="txt-sty">总价：{{ fixPriceQueen(3) }}</p>
                      <p>定金：{{ fixPayTypePriceQueen(1, 3) }}</p>
                      <p>尾款：{{ fixPayTypePriceQueen(2, 3) }}</p>
                    </template>
                  </el-col>
                </template>
                <template v-else>
                  <el-col :span="4">{{ fixPriceQueen(1) }} </el-col>
                  <el-col :span="3">{{ fixPriceQueen(2) }} </el-col>
                  <el-col :span="4">{{ fixPriceQueen(3) }} </el-col>
                </template>
                <el-col
                  :span="3"
                  v-if="
                    fixPayTypePriceQueen(1, 2) == '待定' ||
                      fixPayTypePriceQueen(2, 2) == '待定'
                  "
                  >待定
                </el-col>
                <el-col v-else :span="3"
                  >{{ getsummoenty(queenList, 2) }}
                </el-col>
              </el-row>
            </template>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { orderOption } from "@/const/crud/personal/order";
export default {
  props: ["data", "contractStatus"],
  data() {
    return {
      payType: null,
      frontlist: [{ payTypeId: null }],
      queenList: [{ payTypeId: null }],
      isPassed: true,
      orgSum: 0,
      agentSum: 0,
      otherSum: 0,
      orderOption: orderOption,
      agentTotal: 0,
      thirdTotal: 0,
      govTotal: 0,
      total: 0,
      orderData: {
        priceInfo: { buyNum: null },
        orderInfo: { spuName: null }
      }
    };
  },
  filters: {
    filterPrice(val) {
      return Number(val).toFixed(2);
    }
  },
  methods: {
    // 定金尾款价格返回
    fixPrice(type) {
      let arr1 = [];
      let arr2 = [];
      if (
        this.frontlist &&
        this.frontlist[0] &&
        this.frontlist[0].skuPayCostList
      ) {
        arr1 = this.frontlist[0].skuPayCostList;
      }
      if (
        this.frontlist &&
        this.frontlist[1] &&
        this.frontlist[1].skuPayCostList
      ) {
        arr2 = this.frontlist[1].skuPayCostList;
      }
      let r1;
      if (arr1) {
        r1 = arr1.filter(item => {
          return item.costTypeId == type;
        });
      }
      let r2;
      if (arr2) {
        r2 = arr2.filter(item => {
          return item.costTypeId == type;
        });
      }
      let rmb1;
      if (r1 && r1[0] && r1[0].costAmount) {
        rmb1 = r1[0].costAmount;
      } else {
        rmb1 = 0;
      }

      let rmb2;
      if (r2 && r2[0] && r2[0].costAmount) {
        rmb2 = r2[0].costAmount;
      } else {
        rmb2 = 0;
      }

      let price = rmb2 + rmb1;

      return price;
    },
    // 1585233264795324416
    fixPayTypePrice(type, costType) {
      let r;
      if (this.frontlist) {
        r = this.frontlist.filter(item => {
          return item.payTypeId == type;
        });
      }
      let arr1 = [];
      if (r && r[0] && r[0].skuPayCostList) {
        arr1 = r[0].skuPayCostList;
      }
      let r4 = arr1.filter(item => {
        return item.costTypeId == 4;
      });
      if (r4.length > 0) {
        return "待定";
      } else {
        let r2;
        if (arr1) {
          r2 = arr1.filter(item => {
            return item.costTypeId == costType;
          });
        }
        if (r2 && r2[0] && r2[0].costAmount) {
          return r2[0].costAmount;
        } else {
          return 0;
        }
      }
    },
    //改价后的定金尾款价格返回
    fixPriceQueen(type) {
      let arr1 = this.queenList[0].payCostList;
      let arr2 = [];
      if (this.queenList[1]) {
        arr2 = this.queenList[1].payCostList;
      }

      let r1;
      if (arr1) {
        r1 = arr1.filter(item => {
          return item.costTypeId == type;
        });
      }

      let r2;
      if (arr2) {
        r2 = arr2.filter(item => {
          return item.costTypeId == type;
        });
      }
      let rmb1;
      if (r1 && r1[0] && r1[0].costAmount) {
        rmb1 = r1[0].costAmount;
      } else {
        rmb1 = 0;
      }

      let rmb2;
      if (r2 && r2[0] && r2[0].costAmount) {
        rmb2 = r2[0].costAmount;
      } else {
        rmb2 = 0;
      }

      let price = rmb2 + rmb1;

      return price;
    },
    fixPayTypePriceQueen(type, costType) {
      let r = this.queenList.filter(item => {
        return item.payTypeId == type;
      });
      let arr1 = [];
      if (r[0]) {
        arr1 = r[0].payCostList;
      }
      let r2 = arr1.filter(item => {
        return item.costTypeId == costType;
      });
      let r4 = arr1.filter(item => {
        return item.costTypeId == 4;
      });
      if (r4.length > 0) {
        return "待定";
      } else {
        if (r2[0]) {
          return r2[0].costAmount;
        } else {
          return 0;
        }
      }
    },

    getfrontlist(orderData) {
      this.orderData = orderData;
      // let list = orderData.productInfo.skuPayTypeList;
      // this.frontlist = { ...list };
      if (
        orderData &&
        orderData.productInfo &&
        orderData.productInfo.skuPayTypeList
      ) {
        this.frontlist = orderData.productInfo.skuPayTypeList;
      }
      if (
        orderData &&
        orderData.priceInfo &&
        orderData.priceInfo.payTypeVoList
      ) {
        this.queenList = orderData.priceInfo.payTypeVoList;
      }
    },

    // 总价
    getsummoenty(list, type) {
      if (type == 1 && list) {
        let sum = 0;
        list.forEach(item => {
          if (item && item.skuPayCostList) {
            item.skuPayCostList.forEach(val => {
              sum += val.costAmount;
            });
          }
        });
        return sum * this.orderData.orderInfo.buyNum;
      } else if (type == 2 && list) {
        let num = 0;
        list.forEach(item => {
          if (item.payCostList) {
            item.payCostList.forEach(val => {
              num += val.costAmount;
            });
          }
        });

        return num * this.orderData.priceInfo.buyNum;
      }
    },
    // 改价后
    filterMoney(list, type, contType) {
      console.log(list, "listlistlist");
    },

    addRedStar(h, { column }) {
      // 给表头加标识
      return [
        h("span", { style: "color: red" }, "*"),
        h("span", " " + column.label)
      ];
    }
  },

  mounted() {
    this.getfrontlist();
  }
};
</script>
<style scoped>
.count {
  font-size: 14px !important;
  font-weight: bold !important;
  margin-top: 8px;
  background: #fafafa;
}
.change {
  background: #fafafa;
}
.red {
  color: red;
}
.list-header {
  display: flex;
  margin: 0 0;
}
.rectangle {
  width: 5px;
  height: 15px;
  background: #0aa1ed;
  border-radius: 3px;
  padding: 0;
}
.text {
  font-size: 14px;
  padding: 10px 10px;
  margin: 3px 0;
}
.table {
  padding-bottom: 50px;
}
.thead {
  font-size: 12px;
  font-weight: bold;
  background: #fafafa;
}
.list {
  border: 1px solid #eee;
  margin-top: 8px;
  font-size: 12px;
  color: #606266;
}
.order {
  font-size: 10px !important;
  color: #bbb;
}
</style>
<style>
.order_main .batch-choose .avue-crud__pagination {
  margin: 0 0;
  padding: 0 0;
}
.order_main .table .el-row {
  min-height: 45px;
  border-bottom: 1px solid #f5f7fa;
}
.order_main .table .el-col {
  margin: 0 0;
  padding: 8px 0px 8px 15px;
}
.order_main .table .el-col span {
  overflow: hidden;
}
.txt-sty {
  height: 20px;
}
</style>
