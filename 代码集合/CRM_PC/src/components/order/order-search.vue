<template>
    <el-dialog :visible.sync="showDialog" title="查询案例" width="70%" :close-on-click-modal="false" :before-close="handleClose">
        <div class="order_search">
            <div class="order_condition">
                产品类型：
                <div v-for="(item, index) in orderTypeList" :key="index">
                    <div class="orderType_item" :class="[orderType == index ? 'blueBg' : '']" @click="changeType(item)">{{item.name}}</div>
                </div>
            </div>
            <!-- 产品订单 -->
            <div v-if="orderType == 0">
                <div class="order_condition">
                    <div>
                        关键字：
                        <el-input placeholder="请输入主体名称/产品名称/订单编号/主体ID" style="width: 300px" v-model="form.keyWord"></el-input>
                    </div>
                    <div>
                        线索归属：
                        <el-input placeholder="请输入员工姓名/工号" style="width: 150px" v-model="form.clueBelongNo"></el-input>
                    </div>
                    <div>
                        业务员：
                        <el-input placeholder="请输入员工姓名/工号" style="width: 150px" v-model="form.salesBelonging"></el-input>
                    </div>
                    <div>
                        订单归属：
                        <el-input placeholder="请输入员工姓名/工号" style="width: 150px" v-model="form.belongName"></el-input>
                    </div>
                    <el-button @click="reset">重置</el-button>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                </div>
                <avue-crud v-if="isShow" :option="productOption" :data="tableData" :page.sync="page" @size-change="sizeChange" @current-change="currentChange" v-loading="loading">
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
            </div>
            
            <!-- 课程/会员订单 -->
            <div v-if="orderType == 1 || orderType == 2">
                <div class="order_condition">
                    <div>
                        关键字：
                        <el-input :placeholder="orderType == 1 ? '请输入主体名称/课程名称/订单编号/主体ID/手机号' : '请输入主体名称/会员产品名称/订单编号/主体ID/手机号'" style="width: 340px" v-model="form.keyWord"></el-input>
                    </div>
                    <div>
                        订单归属：
                        <el-input placeholder="请输入员工姓名/工号" style="width: 150px" v-model="form.belongName"></el-input>
                    </div>
                    <el-button @click="reset">重置</el-button>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                </div>
                <!-- 课程列表 -->
                <avue-crud v-if="isShow && orderType == 1" :option="courseOption" :data="tableData" :page.sync="page" @size-change="sizeChange" @current-change="currentChange" v-loading="loading">

                    <!-- 专业类型 -->
                    <template slot="professionIds" slot-scope="scope">
                        <span>{{filterProfession(scope.row.professionIds).join(",")}}</span>
                    </template>

                    <!-- 主体名称 -->
                    <template slot="authName" slot-scope="scope">
                        <span v-if="scope.row.authName!=null">
                            <el-tooltip effect="dark" placement="top" :content="scope.row.authName">
                                <span class="userStyle">{{scope.row.authName}}</span>
                            </el-tooltip>
                        </span>
                        <span v-else class="spanStyle">未填写</span>
                        <span class="vip" v-show="scope.row.vipFlag">VIP</span>
                    </template>

                    <!-- 订单金额 -->
                    <template slot="orderAmount" slot-scope="scope">
                        <span>{{scope.row.orderAmount | payAmount}}</span>
                    </template>

                    <!-- 订单状态 -->
                    <template slot="orderStatus" slot-scope="scope">
                        <span>{{scope.row.orderStatus | filterOrderStatus}}</span>
                    </template>

                    <!-- 课程期限 -->
                    <template slot="updateTime">
                        <span>永久</span>
                    </template>

                    <!-- 订单归属 -->
                    <template slot="belongName" slot-scope="scope">
                        <el-tooltip effect="dark"  placement="right" :content="'工号：'+ number + ' '+ '部门：'+ deptName" v-if="number!=''">
                        <span @mouseenter="showUserInfo(scope.row.belongNo)">{{scope.row.belongName}}</span>
                        </el-tooltip>
                        <span v-else @mouseenter="showUserInfo(scope.row.belongNo)">{{scope.row.belongName}}</span>
                    </template>
                </avue-crud>

                <!-- 课程会员列表 -->
                <avue-crud v-if="isShow && orderType == 2" :option="memberOption" :data="tableData" :page.sync="page" @size-change="sizeChange" @current-change="currentChange" v-loading="loading">

                    <!-- 主体名称 -->
                    <template slot="authName" slot-scope="scope">
                        <span v-if="scope.row.authName!=null">{{scope.row.authName}}</span>
                        <span v-else class="spanStyle">未填写</span>
                    </template>

                    <!-- 订单金额 -->
                    <template slot="orderAmount" slot-scope="scope">
                        <span>{{scope.row.orderAmount | payAmount}}</span>
                    </template>

                    <!-- 订单状态 -->
                    <template slot="validStart" slot-scope="scope">
                        <span v-if="scope.row.orderStatus==0">待付款</span>
                        <span v-else>
                            <span v-show="scope.row.validStart!=null">
                                <span v-if="currentDate < scope.row.validStart">待生效</span>
                                <span v-else-if="currentDate < scope.row.validEnd">已生效</span>
                                <span v-else>已到期</span>
                            </span>
                        </span>
                    </template>

                    <!-- 有效期限 -->
                    <template slot="validEnd" slot-scope="scope" >
                        <span v-if="scope.row.orderStatus==0">/</span>
                        <span v-else>
                            <span v-show="scope.row.validStart!=null">{{scope.row.validStart}}&nbsp;起</span><br>
                            <span v-show="scope.row.validEnd!=null">{{scope.row.validEnd}}&nbsp;止</span>
                        </span>
                    </template>

                    <!-- 订单归属 -->
                    <template slot="belongName" slot-scope="scope">
                        <el-tooltip effect="dark"  placement="right" :content="'工号：'+ number + ' '+ '部门：'+ deptName" v-if="number!=''">
                        <span @mouseenter="showUserInfo(scope.row.belongNo)">{{scope.row.belongName}}</span>
                        </el-tooltip>
                        <span v-else @mouseenter="showUserInfo(scope.row.belongNo)">{{scope.row.belongName}}</span>
                    </template>
                </avue-crud>
            </div>
        </div>
    </el-dialog>
    
</template>

<script>
import { getMyProductListGlobal } from "@/api/admin/user";
import { getPersonalCourseGlobal, getPersoanlOrderGlobal } from "@/api/order/index";
import { productOption,courseOption,memberOption } from '@/const/crud/order/order-search';
import { getOptionList } from "@/api/project/wtClass";
import { getEmpInfo } from "@/api/course/index";
import orderData from '@/components/order/order-data.js';
import courseOrderData from '@/components/course/order-data.js';
import { filterPer } from '@/util/filtration_permission.js'
export default {
    data() {
        return {
            orderTypeList: [
                {
                    name: '产品订单',
                    showNum:0,
                    Privilege:{
                    bt_page_prod_order_global:true,
                    }
                },
                {
                    name: '课程订单',
                    showNum:1,
                    Privilege:{
                    bt_page_course_order_global:true,
                   }
                },
                {
                    name: '课堂会员订单',
                    showNum:2,
                    Privilege:{
                    bt_page_vip_order_global:true,
                 }
                },
            ],
            orderType: 0,
            form: {
                keyWord: "",
                clueBelongNo: "",
                salesBelonging: "",
                belongName: "",
            },
            page: {
                pageSize: 10,
                currentPage: 1,
                pages: [5, 10, 20, 50]
            },
            tableData: [],
            loading: false,
            productOption: productOption,
            courseOption: courseOption,
            memberOption: memberOption,
            professionList: [],
            number: "",
            deptName: "",
            isShow: false,
            showDialog: true,
            currentDate: "",
        }
    },
    filters: {
        orderStatus(value){
            return orderData.onlinetransformOrderStatus(value);
        },
        tailStatusFilter(value){
            return value == 0 ? "待定" : value == 1 ? "待付款"  : value == 2 ? "已结清" : "无";
        },
        payAmount(value){
            return courseOrderData.payAmount(value);
        },
        filterOrderStatus(value){
            return courseOrderData.filterOrderStatus(value);
        },
    },
    created() {
        this.getDropList()
        this.getCurrentDate();
    },
    mounted(){
        this.orderTypeList=filterPer(this.orderTypeList)
    },
    methods: {
        // 获取当前日期
        getCurrentDate(){
            let yy = new Date().getFullYear();
            let mm = new Date().getMonth()+1 < 10 ? '0'+ (new Date().getMonth()+1) : new Date().getMonth()+1;
            let dd = new Date().getDate() < 10 ? '0'+ new Date().getDate() : new Date().getDate();
            this.currentDate = yy+'-'+mm+'-'+dd;
        },
        changeType(item) {
            this.orderType = item.showNum
            this.tableData = []
            this.form = {
                keyWord: "",
                clueBelongNo: "",
                salesBelonging: "",
                belongName: "",
            }
            this.page = {
                pageSize: 10,
                currentPage: 1,
                pages: [5, 10, 20, 50]
            }
            this.isShow = false
        },
        handleSearch() {
            this.page.currentPage = 1;
            this.getList()
        },
        getList(){
            this.loading = true
            let params = {
                keyWord: this.form.keyWord,
                pageNo: this.page.currentPage,
                pageSize: this.page.pageSize,
            }
            switch(this.orderType){
                case 0:
                    if(this.form.keyWord || this.form.clueBelongNo || this.form.salesBelonging || this.form.belongName){
                        this.isShow = true
                    } else {
                        return
                    }
                    params.clueAttributionEmpInfo = this.form.clueBelongNo
                    params.clueSalesmanEmpInfo = this.form.salesBelonging
                    params.belongInfo = this.form.belongName
                    return getMyProductListGlobal(params).then((res) => {
                                if (res.data.code == 0) {
                                    this.loading = false
                                    this.tableData = res.data.data.records
                                    this.page.total = res.data.data.total;
                                }
                            });

                case 1:
                    if(this.form.keyWord || this.form.belongName){
                        this.isShow = true
                    } else {
                        return
                    }
                    params.belongName = this.form.belongName
                    return getPersonalCourseGlobal(params).then(res=>{
                                if(res.data.code == 0){
                                    this.loading = false;
                                    this.tableData = res.data.data.records;
                                    this.page.total = res.data.data.total;
                                }
                            })

                case 2:
                    if(this.form.keyWord || this.form.belongName){
                        this.isShow = true
                    } else {
                        return
                    }
                    params.belongName = this.form.belongName
                    return getPersoanlOrderGlobal(params).then(res=>{
                                this.tableLoading = false;
                                if(res.data.code == 0){
                                    this.loading = false;
                                    this.tableData = res.data.data.records;
                                    this.page.total = res.data.data.total;
                                };
                            })

            }
        },
        sizeChange(val){
            this.page.pageSize = val;
            this.page.currentPage = 1;
            this.getList();
        },
        currentChange(val){
            this.page.currentPage = val;
            this.getList();
        },
        // 获取员工信息
        showUserInfo(id){
            if(id == '自主'){
                this.number = "";
                this.deptName = "";
                return false;
            }
            getEmpInfo(id).then(res => {
                if(res.data.code !== 0){
                    return false;
                }
                if(res.data.data == null){
                    this.number = "";
                    this.deptName = "";
                    return false;
                }
                this.number = res.data.data.number;
                this.deptName = res.data.data.deptName;
            })
        },
        // 获取产品分类下拉框数据
        getDropList() {
            getOptionList().then((res) => {
                if (res.data.code == CodeMsg.CODE_0) {
                    this.professionList = res.data.data;
                }
            });
        },
        // 专业分类匹配
        filterProfession(row){
            let arr = [];
            this.professionList.forEach((item,index) => {
                if(row.includes(item.id)){
                    arr.push(item.categoryName)
                }
            })
            return arr;
        },
        handleClose() {
            this.$emit('close')
        },
        reset() {
            this.form = {
                keyWord: "",
                clueBelongNo: "",
                salesBelonging: "",
                belongName: "",
            }
            this.isShow = false
        },
    },
}
</script>

<style lang="scss" scoped>
.order_search{
    .order_condition{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        div{
            margin-right: 8px;
        }
    }
    .orderType_item{
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #DCDFE6;
        cursor: pointer;
    }
    .blueBg{
        background: #409eff;
        color: #fff;
        border: none;
    }
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
    .order-engineerName{
        margin: 0;
    }
    .success_detail{
        background: #027502;
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
    .price-status{
        margin: 0;
    }
    .order-status-sty{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .vip{
        display: inline-block;
        width: 28px;
        height: 15px;
        position: absolute;
        right: 0;
        top: -2px;
        color: #fe3636;
        font-style: italic;
        font-size: 12px;
    }
    .userStyle {
        width: 150px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .spanStyle {
        color:#D3D3D3;
    }
}
</style>