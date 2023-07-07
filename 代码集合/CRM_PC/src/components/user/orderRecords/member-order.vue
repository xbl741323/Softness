<template>
  <div class="member-bg">
    <!-- 订单状态 -->
    <div class="order-status">
      <span>订单状态：</span>
      <el-radio-group  v-model="orderForm.timeStatus" @change="page.currentPage = 1, getVipOrder()" class="marl">
        <el-radio-button 
          class="radio-sty"
          :class="{'radio-sty-left': (item.value >=0 &&  item.value !==null)}"
          v-for="item in timeStatusList"
          :key="item.value"
          :label="item.value"
          size="mini"
        >
          <span v-show="item.label=='全部'"></span>
          <span v-show="item.label=='待付款'" class="red-circle"></span>
          <span v-show="item.label=='已生效'" class="blue-circle"></span>
          <span v-show="item.label=='待生效'" class="blue-circle to-be-effective"></span>
          <span v-show="item.label=='已到期'"></span>
          <span>{{item.label}}</span>
          <span  v-show="item.label=='待付款'&&unpaidNum!=null">({{unpaidNum}})</span>

        </el-radio-button>
      </el-radio-group>
    </div>

     <el-form  inline :model="orderForm" label-width="100px" @keyup.enter.native="getAllList()">
      <el-form-item label="关键字：">
        <el-input v-model="orderForm.keyWord" placeholder="请输入主体名称/会员产品名称关键字/订单编号/主体ID/手机号" class="wid1"/>
      </el-form-item>
      <el-form-item label="订单归属：">
        <el-input v-model="orderForm.belongName" placeholder="请输入订单归属"></el-input>
      </el-form-item>
      <el-form-item label="创建时间：" class="marle">
        <el-date-picker
          v-model="orderForm.createTime"
          :unlink-panels="true"
          type="datetimerange"
          range-separator="-"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="page.currentPage = 1,getVipOrder()" >搜索</el-button>
        <el-button type="warning" @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>

    <avue-crud
    ref="crud"
    :table-loading="tableLoading"
    :data="dataList"
    :option="option"
    :page.sync="page"
    @on-load="getVipOrder"
    class="pad"
    >
        <!-- 订单编号 -->
        <template slot="orderNo" slot-scope="scope">
            <span class="clickable" @click="seeDetail(scope.row)" v-if="scope.row.orderNo">{{scope.row.orderNo }}</span>
        </template>

        <!-- 主体名称 -->
        <template slot="userName" slot-scope="scope">
            <span v-if="scope.row.userName!=null">{{scope.row.userName}}</span>
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

        <!-- 下单来源 -->
        <template slot="orderSource" slot-scope="scope">
            <span>{{scope.row.orderSource | wherePlat}}</span>
        </template>

        <!-- 操作 -->
        <template slot="menu" slot-scope="scope">
            <el-button
                type="text"
                size="small"
                icon="el-icon-view"
                @click="seeDetail(scope.row)" v-if="scope.row.orderNo!=null">查看</el-button>
        </template>
    </avue-crud>
  </div>
</template>

<script>
import orderData from '@/components/member/order-data.js'
import { tableOption } from "@/const/crud/member/member-order";
import { getEmpInfo,getUnpaidCount } from "@/api/member/index";
export default {
    data () {
        return {
            tableLoading: false,
            orderForm: {
                timeStatus:null,
                keyWord:'',
                belongName:'',
                createTime:''
            },
            empList: [],
            timeStatusList: orderData.timeStatus,
            option: tableOption,
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 20, // 每页显示多少条
            },
            dataList:[],
            currentDate:'',
            dateValue:null,
            number:"",
            deptName:"",
            unpaidNum:null,
        }
    },
    filters:{
        payAmount(value){
            return orderData.payAmount(value);
        },
        payType(value){
            return orderData.payType(value);
        },
        wherePlat(value){
            return orderData.wherePlat(value);
        }
    },
    created () {
        this.getCurrentDate();
    },
    mounted () {
        this.getWaitPayCount();
    },
    methods: {
        //获取订单列表
        getVipOrder() {
            this.tableLoading = true;
            var param ={
                accountId: this.$route.query.id,
                pageNo: this.page.currentPage,
                pageSize: this.page.pageSize, 
                timeStatus: this.orderForm.timeStatus==4?null:this.orderForm.timeStatus,
                keyWord: this.orderForm.keyWord,
                startTime :this.orderForm.createTime ? this.$moment(this.orderForm.createTime[0]).format('YYYY-MM-DD HH:mm:ss'): '',
                endTime : this.orderForm.createTime ? this.$moment(this.orderForm.createTime[1]).format('YYYY-MM-DD HH:mm:ss'): '',
                belongName : this.orderForm.belongName,
                orderStatus:this.orderForm.timeStatus==4 ? 0 : null
            }
            orderData.getOrderList(param).then(res=>{//订单列表数据
                this.tableLoading = false;
                this.dataList = res.data.records;
                this.page.total = res.data.total;
            })
        },

        // 获取待付款数目
        getWaitPayCount(){
            getUnpaidCount(this.$route.query.id).then(res=>{
                if(res.data.code==0){
                    this.unpaidNum = res.data.data
                }else {
                    this.$message({
                        message: res.data.msg,
                        type: 'warning',
                        offset:300
                        });
                    }
            })
        },
        // 获取员工信息
        showUserInfo(id){
            if(id=='自主'){
                this.number = "";
                this.deptName = "";
                return false;
            }
            getEmpInfo(id).then(res=>{
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

        // 查看订单详情
        seeDetail(row) {
            this.$router.push({
                path: '/wt-member-detail',
                query:{
                    id: row.id,
                    source:this.$route.query.source
                }
            })
        },

        // 重置
        reset(){
            this.orderForm = {
                timeStatus:null,
                keyWord:'',
                belongName:'',
                createTime:''
            };
            this.getVipOrder();
        },

        // 获取当前日期
        getCurrentDate(){
            let yy = new Date().getFullYear();
            let mm = new Date().getMonth()+1 < 10 ? '0'+ (new Date().getMonth()+1) : new Date().getMonth()+1;
            let dd = new Date().getDate() < 10 ? '0'+ new Date().getDate() : new Date().getDate();
            this.currentDate = yy+'-'+mm+'-'+dd;
        },

        getAllList() {
            this.page.currentPage = 1;
            this.getVipOrder();
        },

        sizeChange(val){
            this.page.pageSize = val;
            this.getVipOrder();
        },
        
        currentChange(val){
            this.page.currentPage = val;
            this.getVipOrder();
        },
        
    },
}
</script>

<style scoped>
.member-bg {
    background-color: #fff;
    height: 100%;
}
.order-status {
    margin:-12px 0 16px 0px;
    padding-top:15px;
    padding-left: 30px;
    font-size: 14px;
    color: #606266;
}
.radio-sty {  
  margin-left: 12px;
}
.radio-sty-left {   
  border-left: 1px solid #dcdfe6;
}
.blue-circle {
  width:6px;
  height:6px;
  display: inline-block;
  border-radius: 50%;
  background: #36A6FE;
  margin-right:7px;
}
.to-be-effective {
  background: #f3ab03 !important;
}
.wid {
    width:320px;
}
.wid1 {
    width:390px;
}
.clickable{
  color: #36A6FE;
  cursor: pointer;
}
.pad{
    padding:20px;
}
.spanStyle {
    color:#D3D3D3;
}
.red-circle{
    width: 6px;
    height: 6px;
    display: inline-block;
    border-radius: 50%;
    background: #fe3636;
    margin-right: 7px
}
.marl {
    margin-left: -12px;
}
.marle {
    margin-left: 15px;
}
</style>