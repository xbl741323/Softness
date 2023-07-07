<template>
    <el-dialog :visible.sync="showDialog" :close-on-click-modal="false" :before-close="orderClose" title="客户订单查看" width="70%" append-to-body class="client-order">
        <avue-crud
            :option="productOption"
            :data="tableData"
            :page.sync="page"
            @size-change="sizeChange"
            @current-change="currentChange"
            v-loading="loading">
            <!-- 订单状态 -->
            <template slot="orderStatus" slot-scope="scope">
                <span :class="{'waitAllot': scope.row.orderStatus == 1}">
                    <span :class="[ scope.row.orderStatus == 0 ? 'tostart' :  scope.row.orderStatus == 2 ? 'blue-circle in-service' :  scope.row.orderStatus == 3 ? 'blue-circle circleRed' : scope.row.orderStatus == 4 ? 'newsuccess' : scope.row.orderStatus == 6 ? 'blue-circle circleRed' :'' ]"><b v-if="scope.row.orderStatus == 4">✔</b></span>
                    <span v-if="scope.row.orderStatus != 1">{{scope.row.orderStatus | orderStatus }}</span>
                    <span v-if="scope.row.orderStatus == 1">{{scope.row.contractType == 1 ? '待签约-电子' : '待签约-纸质'}}</span>
                </span>
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
        </avue-crud>
    </el-dialog>
</template>

<script>
import { getProductListByClue } from "@/api/admin/user";
import orderData from '@/components/order/order-data';
import { productOption } from '@/const/crud/personal/client-order';
export default {
    props: {
        clueId: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            showDialog: true,
            productOption: productOption,
            tableData: [],
            loading: false,
            page: {
                pageSize: 10,
                currentPage: 1,
                pages: [5, 10, 20, 50]
            },
        }
    },
    filters: {
        orderStatus(value){
            return orderData.onlinetransformOrderStatus(value);
        },
        tailStatusFilter(value){
            return value == 0 ? "待定" : value == 1 ? "待付款"  : value == 2 ? "已结清" : "无";
        },
    },
    created() {
        this.showOrder()
    },
    methods: {
        showOrder() {
            this.loading = true
            let params = {
                pageNo: this.page.currentPage,
                pageSize: this.page.pageSize,
                clueId: this.clueId,
            }
            getProductListByClue(params).then((res) => {
                if (res.data.code == 0) {
                    this.loading = false
                    this.tableData = res.data.data.records
                    this.page.total = res.data.data.total
                }
            });
        },
        orderClose() {
            this.$emit('close')
        },
        sizeChange(val){
            this.page.pageSize = val
            this.page.currentPage = 1
            this.showOrder()
        },
        currentChange(val){
            this.page.currentPage = val
            this.showOrder()
        },
    },
}
</script>

<style lang="scss" scoped>
.waitAllot{
    color: #FF6600;
}
.tostart{
    width: 6px;
    height: 6px;
    display: inline-block;
    border-radius: 50%;
    background: #36a6fe;
    margin-right: 7px;
}
.blue-circle{
    width: 6px;
    height: 6px;
    display: inline-block;
    border-radius: 50%;
    background: #36A6FE;
    margin-right: 7px;
}
.newsuccess{
    font-weight: bolder;
    font-size: 12px;
    display: inline-block;
    color: #027502;
    margin-right: 6px;
}
.circleRed{
    background: #ff0000;
}
.in-service{
    background: #f3ab03;
}
.order-status-sty{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>