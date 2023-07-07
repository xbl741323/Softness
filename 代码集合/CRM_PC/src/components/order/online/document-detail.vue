<template>
    <div class="detail-page" v-loading="loading">
        <div class="order-detail-card" v-if="detailData">
            <div class="detail-head">
                <img src="../../../../public/images/订单.png" class="img" />
                <span class="order-no">单号：{{ detailData.orderNo }}</span>
                <span :class="[ detailData.orderStatus == 0 ? 'tostart' : detailData.orderStatus == 2 ? 'blue-circle in-service' : detailData.orderStatus == 3 ? 'blue-circle circleRed' :  detailData.orderStatus == 4 ? 'success_detail' :'']">
                    <b v-if="detailData.orderStatus == 4">✔</b>
                </span>
                <span>{{detailData.orderStatus | orderStatusChange}}</span>
            </div>
            <div class="top-head-tips">
                <span class="user">{{ detailData.userNo }} </span>
                <span class="user">{{ detailData.accountNo }}</span>
            </div>
            <div class="top-info detail-grid-5">
                <div class="top-info-item">
                    <h3>主体名称</h3>
                    <p>{{ detailData.userName?detailData.userName:'未认证' }}</p>
                </div>
                <div class="top-info-item">
                    <h3>联系方式</h3>
                    <p>{{ detailData.accountMobile }}</p>
                </div>
                <div class="top-info-item">
                    <h3>下单来源</h3>
                    <p>{{ detailData.orderSource | orderSourceChange }}</p>
                </div>
                <div class="top-info-item">
                    <h3>创建时间</h3>
                    <p>{{ detailData.createTime }}</p>
                </div>
                <div class="top-info-item">
                    <h3>文件名称</h3>
                    <p>{{ detailData.fileName }}</p>
                </div>
                <div class="top-info-item">
                    <h3>文件价格</h3>
                    <p>￥{{ detailData.price.toFixed(2) }}</p>
                </div>
                <div class="top-info-item">
                    <h3>订单金额</h3>
                    <p>￥{{ detailData.price.toFixed(2) }}</p>
                </div>
            </div>
        </div>
        <el-tabs type="border-card" class="order-detail-card mg-20 min-height-460" v-model="tabName">            
            <el-tab-pane name="2" label="费用信息">
                <div class="tab-title">费用信息</div>
                <el-table :data="tableData" border show-summary :summary-method="getSummaries">
                    <el-table-column prop="payTime" label="支付时间"></el-table-column>  
                    <el-table-column prop="payChannel" label="支付方式">
                        <template slot-scope="scope">
                            {{ scope.row.payChannel | channelChange }}
                        </template>
                    </el-table-column>  
                    <el-table-column prop="price" label="支付金额">
                        <template slot-scope="scope">
                            {{scope.row.price.toFixed(2)}}
                        </template>
                    </el-table-column>  
                    <el-table-column prop="feeType" label="费用类型">
                        <template>
                            文件单价
                        </template>
                    </el-table-column>  
                    <el-table-column prop="payStatus" label="支付状态">
                        <template slot-scope="scope">
                            {{ scope.row.payStatus | payStatusChange }}                        
                        </template>
                    </el-table-column>  
                    
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="3" label="操作记录">
                <order-operate-records :source="'document'" :orderId="detailData.id" v-if="tabName == 3" ref="record" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import orderData from "@/components/order/order-data";
import { getDetailInfoById } from "@/api/order/document";
import OrderOperateRecords from '@/components/order/online/onlineoperate-records';
  import {mapGetters} from 'vuex'
export default {
    components: {
        OrderOperateRecords,
    },
    data() {
        return {
            detailData: null,
            orderStatus: 1,
            tableData:  [],
            tabName: '2',
            loading: false,
        }
    },
    methods: {
        // 获取详情信息
        getDetail(){
            this.loading = true;
            getDetailInfoById(this.$route.query.id,this.$route.query.source).then(res => {
                if(res.data.code == 0){
                    this.detailData = res.data.data;
                    this.tableData = [res.data.data.tmFileOrderPayment];
                }
            });
            this.loading = false;
        },
        //计算总价
        getSummaries(param){
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                };
                if(index == 2){
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                    sums[2] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                        return (prev + curr).toFixed(2);
                        } else {
                        return prev;
                        }
                    }, 0);
                    sums[index] += ' 元';
                    } else {
                    sums[index] = 'N/A';
                    }
                };
            });
            return sums;
        }
    },
    filters: {
        orderStatusChange(val){
            return orderData.documentOrderStatusFilter(val)
        },
        channelChange(val){
            return orderData.documentPayChannel(val)
        },
        payStatusChange(val){
            return orderData.documentPayStatus(val)
        },
        orderSourceChange(val){
            if (val == "pc") {
                return "卧涛网"
            } else if (val == "applet") {
                return "小程序"
            } else{
                return '未知'
            };
        }
    },
    mounted(){
        this.getDetail();
        console.log(this.userInfo);
    },
    computed: {
      ...mapGetters(['userInfo']),
    },
}
</script>
<style scoped>
    @import url("../order.css");
</style>