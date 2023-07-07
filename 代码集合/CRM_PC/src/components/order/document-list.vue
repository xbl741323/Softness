<template>
    <div class="order-project">
        <div v-if="authority">
            <!-- 订单状态 -->
            <div class="order-filter-item">
                <span class="order-name-sty">订单状态：</span>
                <el-radio-group v-model="orderStatus" @change="getList()">
                    <el-radio-button v-for="(item, index) in statusList" :key="index" border :label="item.value"
                    :class="['order-btn-sty', index > 0 ? 'order-border-sty' : '']">
                    <span v-if="item.value == 3" class="circle-red"></span>
                    <span v-if="item.value == 0" class="circle-blue"></span>
                    <span v-if="item.value == 1" class="success"><b>✔</b></span>
                    <span>{{ item.label }}</span>
                    <span v-if="index == 1 && waitPay > 0">
                        <span>({{waitPay}})</span>
                    </span>
                    </el-radio-button>
                </el-radio-group>
            </div>
            <el-form @keyup.enter.native="(hasTapBtn = true), getList()" ref="filterForm" inline :model="filterForm">
                <el-form-item label="关键字：" prop="keyWords">
                    <el-input v-model="filterForm.keyWords" placeholder="请输入文件名称或订单编号" class="order-keywords" />
                </el-form-item>
                <el-form-item label="订单归属：" prop="belongName">
                    <el-input v-model="filterForm.belongName" placeholder="请输入员工姓名/工号" />
                </el-form-item>
                <el-form-item label="手机号：" prop="phone">
                    <el-input v-model="filterForm.phone" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                    <el-date-picker v-model="filterForm.createTime" :unlink-panels="true" type="datetimerange" range-separator="-"
                    value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" start-placeholder="开始日期"
                    end-placeholder="结束日期" class="order-time">
                    </el-date-picker>
                </el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="(page.currentPage = 1), getList()">搜索</el-button>
                <el-button type="warning" @click="resetForm()">重置</el-button>
            </el-form>
            <div class="order-list-sty">
                <avue-crud 
                ref="multipleTable" 
                :option="tableOption" 
                :data="listData"
                :page.sync="page" 
                @size-change="sizeChange" 
                @current-change="currentChange" 
                v-loading="loading"
                @selection-change="selectionChange">
                    <template slot="orderNo" slot-scope="scope">
                        <span style="cursor: pointer;color: #409EFF;" @click="showDetail(scope.row)">
                            {{ scope.row.orderNo }}
                        </span>
                    </template>
                    <template slot="price" slot-scope="scope">                
                        <span>{{ scope.row.price.toFixed(2) }} </span>
                    </template>
                    <template slot="userName" slot-scope="scope">                
                        <span>{{ scope.row.userName ? scope.row.userName:"未认证" }} </span>
                    </template>
                    <template slot="orderStatus" slot-scope="scope">                
                        <span>{{ scope.row.orderStatus | orderStatusChange }} </span>
                    </template>
                    <template slot="orderSource" slot-scope="scope">                
                        <span>{{ scope.row.orderSource | orderSourceChange }} </span>
                    </template>
                    <template slot="belongName" slot-scope="scope">
                        <el-tooltip v-if="scope.row.belongId != 0" effect="dark" :content="tooltipContent" placement="top">
                            <span @mouseover="showUserInfo(scope.row.belongId)">
                                <img src="/img/disable.png" class="emp_disabled" v-if="scope.row.userBelongLockFlag == 9" alt="" />
                                {{ scope.row.belongName }}
                            </span>
                        </el-tooltip>
                        <span v-else>
                            <img src="/img/disable.png" class="emp_disabled" v-if="scope.row.userBelongLockFlag == 9" alt="" />
                            {{ scope.row.belongName }}
                        </span>
                    </template>
                    <template slot="menu" slot-scope="scope">
                        <el-button type="text" icon="el-icon-view" @click="showDetail(scope.row)">{{ $t("button.godetail") }}</el-button>
                    </template>
                </avue-crud>
            </div>
        </div>
        <div v-else class="no-authority">
            <img :src="require('@/assets/images/common/no-authority.svg')" alt="">
            <p>抱歉！暂无权限查看此列表</p>
        </div>
    </div>
</template>
<script>
import orderData from "@/components/order/order-data";
import { tableOption } from "@/const/crud/order/document";
import { pageTmFileOrder, getWaitPayCount } from "@/api/order/document";
import { saveDetal } from "@/util/clearDetail";
import { mapGetters } from 'vuex';
export default {
    props: {
        isMine:{
            type: Boolean,
            value: false
        }
    },
    data() {
        return {
            orderStatus: null,
            statusList: orderData.documentOrderStatus,
            hasTapBtn: false,
            tableOption: tableOption,
            filterForm: {
                keyWords: '',
                belongName: '',
                phone: '',
                createTime: ''
            },            
            page: {
                pageSize: 20,
                currentPage: 1,
                pages: [5, 10, 20, 50],
            },
            listData: [],
            loading: false,
            // isMine: false,
            waitPay: 0
        }
    },
    filters: {
        orderStatusChange(val){
            return orderData.documentOrderStatusFilter(val)
        },
        orderSourceChange(val){
            if (val == "pc") {
                return "卧涛网"
            } else if (val == "applet") {
                return "小程序"
            } else{
                return '未知'
            };
        },
        channelChange(val){
            return orderData.documentPayChannel(val)
        },
        payStatusChange(val){
            return orderData.documentPayStatus(val)
        },
    },
    methods: {
        //列表数据
        getList(){
            this.loading = true;  
            console.log(this.filterForm.createTime,'---');
            let params = {
                orderStatus: this.orderStatus,
                keyWord: this.filterForm.keyWords,
                accountMobile: this.filterForm.phone,
                belongName: this.filterForm.belongName,
                startTime: this.filterForm.createTime == '' ? "" : this.$moment(this.filterForm.createTime[0]).format("YYYY-MM-DD HH:mm:ss"),
                endTime: this.filterForm.createTime == '' ? "" : this.$moment(this.filterForm.createTime[1]).format("YYYY-MM-DD HH:mm:ss"),
                pageNo: this.page.currentPage,
                pageSize: this.page.pageSize,
            }
            let keepParams = {
                params: params,
                createTime: this.filterForm.createTime,
                detail: { path: "", query: {} },
            };
            sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
            pageTmFileOrder(params,this.isMine).then(res=>{
                this.loading = false;
                if(res.data.code == 0){
                    this.listData = res.data.data.records;
                    this.page.total = res.data.data.total;
                } else {
                    this.$offsetMessage.warning('接口报错，请联系管理员！')
                }
            });
        },
        //待付款统计
        getWaitCount(){
            getWaitPayCount(this.isMine).then(res=>{
                if(res.data.code == 0){
                    this.waitPay = res.data.data;                    
                }
            })
        },
        // 重置表单
        resetForm(){
            this.orderStatus = null; 
            this.filterForm.keyWords = '';
            this.filterForm.phone = '';
            this.filterForm.belongName = '';
            this.filterForm.createTime = '';
            this.page.currentPage = 1;
            this.getList();

        },
        // 查看详情
        showDetail(row) {
            if(!this.detailAuthority) return this.$notAuthorized();
            let path = '/document-order-detail';
            let query = {
                id: row.id,
                time: Date.now(),
                source: this.isMine ? 'mine' : null
            }
            saveDetal(`${this.$route.path}`, path, query);//存储详情路由，点击顶部tab切换回来后跳转详情
            this.$router.push({ path: path, query: query });
        },
        sizeChange(val) {
            this.page.pageSize = val;
            this.getList();
        },
        selectionChange(){},
        currentChange(val) {
            console.log(val);
            this.page.currentPage = val;
            this.getList();
        },
    },
    computed: {
        ...mapGetters(['permissions']), 
        authority(){
            if(this.isMine){
                return this.permissions.bt_order_document_list_my;
            } else {
                return this.permissions.bt_order_document_list;
            }
        },
        detailAuthority(){
            if(this.isMine){
                return this.permissions.bt_order_document_detail_my;
            } else {
                return this.permissions.bt_order_document_detail;
            }
        }
    },
    mounted(){
        this.getWaitCount();
        this.getList();
    },
    created(){
        if (sessionStorage.getItem(`${this.$route.path}`)) {
            let keepParams = JSON.parse(sessionStorage.getItem(`${this.$route.path}`));
            if (keepParams.detail.path !== "") {
                this.$router.push({
                    path: keepParams.detail.path,
                    query: keepParams.detail.query,
                });
                return;
            };
            this.orderStatus = keepParams.params.orderStatus;
            this.filterForm.keyWords = keepParams.params.keyWord;
            this.filterForm.phone = keepParams.params.accountMobile;
            this.filterForm.belongName = keepParams.params.belongName;        
            this.filterForm.createTime = keepParams.createTime;        
            this.page.currentPage = keepParams.params.pageNo;
            this.page.pageSize = keepParams.params.pageSize;
        };
    },
}
</script>
<style scoped>
    @import url("./order.css");
</style>