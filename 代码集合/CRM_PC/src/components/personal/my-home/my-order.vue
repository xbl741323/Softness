<!-- 排查完成 -->
<template>
    <div :class="['my-order',num==1?'complete-sty':'']">
      <div class="my-order-lang">
        <div class="tool-title">
          <img :src="require('@/assets/images/my-home/wodedingdan@2x.png')" alt="" />
          <span>我的订单</span>
        </div>
        <!-- tab切换 -->
        <div class="dept-tab" id="depart-rank">
          <el-tabs v-model="activeName" class="rank-tab-change" @tab-click="handleClick">
            <el-tab-pane label="产品订单" name="1"></el-tab-pane>
            <el-tab-pane label="课程订单" name="3"></el-tab-pane>
            <el-tab-pane label="会员订单" name="4"></el-tab-pane>
            <el-tab-pane label="待生效订单" name="2"></el-tab-pane>
          </el-tabs>
        </div>
        <span class="order-title order-pointer-sty" @click="toMore">更多</span>
      </div>
      <!-- 列表 -->
      <avue-crud v-if="dataList.length>0"
        class="clue-avue"
        ref="crud"
        :option="option"
        :data="dataList">
        <template slot="orderNo" slot-scope="scope">
          <span id="handle-style" @click="toDetail(scope.row)">{{ scope.row.orderNo }}</span>
        </template> 
        <template slot="orderTime" slot-scope="scope">
          <span>{{ activeName==1?scope.row.orderTime : scope.row.createTime }}</span>
        </template>        
        <template slot="orderStatus" slot-scope="scope">
          <div v-if="activeName=='4'">
            <span v-if="scope.row.orderStatus==0">待付款</span>
            <span v-else>
                <span v-show="scope.row.validStart!=null">
                    <span v-if="currentDate < scope.row.validStart">待生效</span>
                    <span v-else-if="currentDate < scope.row.validEnd">已生效</span>
                    <span v-else>已到期</span>
                </span>
            </span>
          </div>
          <div v-else>
            <span v-if="activeName == '1'|| activeName == '2'">{{ scope.row.orderStatus | orderStatus }}</span>
            <span v-else>{{ scope.row.orderStatus | orderStatusCourse }}</span>
          </div>
        </template>
      </avue-crud>
      <div class="no-order-data" v-else>暂无数据</div>
    </div>
</template>


<script>
import { clearDetail } from "@/util/clearDetail"
import { getMyProductList } from "@/api/admin/user"
import courseOrderData from '@/components/course/order-data.js'
import options from "@/const/crud/my-home/my-order.js"
import orderData from '@/components/order/order-data.js'
import { getInitOrder } from "@/api/order/index"

export default {
  props:["num"],
    data(){
        return{
          option: {
            selection: false,
            reserveSelection: false,
            selectClearBtn: false,
            addBtn: false,
            header: false,
            editBtn: false,
            delBtn: false,
            align: 'center',
            menuAlign: 'center',
            menuWidth: 200,
            menu: false,
            border: true,
            column: options.soloOption.column,
          },
          dataList:[],
          baseUrl: process.env.BASE_URL,
          source: 'personal',
          activeName: '1',
          params:{
            orderStatus: null,
            pageNo: 1,
            pageSize: 10,
          },
          currentDate:'',
        }
    },
    filters:{
      orderStatus(value){
        return orderData.initOrderStatus(value);
      },
      orderStatusCourse(value){
        return courseOrderData.filterOrderStatus(value);
      },
  },
    created () {
        this.getCurrentDate();
    },
    methods: {
      toMore(){
          clearDetail("/personal/personal-order")
          this.$router.push({
            path: "/personal/personal-order",
            query: {
              whichSource: this.activeName
            },
          })
      },
      // 获取当前日期
      getCurrentDate(){
          let yy = new Date().getFullYear();
          let mm = new Date().getMonth()+1 < 10 ? '0'+ (new Date().getMonth()+1) : new Date().getMonth()+1;
          let dd = new Date().getDate() < 10 ? '0'+ new Date().getDate() : new Date().getDate();
          this.currentDate = yy+'-'+mm+'-'+dd;
      },
      // 获取产品、带生效订单数据
      getList() {
        let para ={
          categoryId: null,
        }
        para=Object.assign(para,this.params)
        let url = this.activeName == '1' ? getMyProductList : getInitOrder;
        url(para).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.dataList = res.data.data.records;
          }
        });
      },
      // 获取课堂、会员订单数据
      getCourseAndVipOrder(){
        let userInfo = JSON.parse(sessionStorage.getItem('pigx-userInfo')).content;
        let para = {
          belongId: userInfo.id,
        };
        para=Object.assign(para,this.params)
        let url = this.activeName == '3' ? courseOrderData.getCourseList : courseOrderData.getVipOrderList;
        url(para).then(res=>{//订单列表数据
          if(res.code == CodeMsg.CODE_0){
            this.dataList = res.data.records;
          }
        })
      },
      // tab切换
      handleClick(){
        let active = this.activeName;
        this.dataList = [];
        let columns = active == '3' ? options.soloOption.columnCourse : active == '4' ? options.soloOption.columnMember : options.soloOption.column;
        this.option.column = columns;
        if(active =='3'|| active =='4') return this.getCourseAndVipOrder();
        this.getList()
      },
      toDetail(row){
        if(this.activeName == '1') return this.toOnlineView(row);
        if(this.activeName == '3') return this.seeDetail(row);
        this.seeOtherDetail(row);
      },
      // 线上订单详情
      toOnlineView(row){
        this.$router.push({
          path: '/orderonline-detail',
          query:{
            orderId: row.id,
            source: this.source
          }
        })
      },      
      // 查看课程订单详情
      seeDetail(row) {
          this.$router.push({
              path: '/wt-course-detail',
              query:{
                  id: row.id,
                  isVip:row.vipFlag,
                  source:this.source
              }
          })
      },
      // 查看会员和待生效订单详情
      seeOtherDetail(row) {
        let url = this.activeName == '2'?'/initorder-detail':'/wt-member-detail'
          this.$router.push({
              path: url,
              query:{
                  id: row.id,
                  source: this.source
              }
          })
      },
  },
  mounted(){
    this.getList();
  }
}
</script>

<style scoped>
.my-order{
  background: #fff;
  width: 49.1%;
  border-radius: 22px;
  margin: 10px 0 0 10px;
  padding-bottom: 20px;
}
.no-order-data{
  text-align: center;
  font-size: 16px;
  margin-top: 80px;
}
.complete-sty{
  width: 98.8% !important;
}
.tool-title {
  margin: 10px 0 0 15px;
  display: flex;
  align-items: center;
  color: #333333;
  font-size: 22px;
  font-weight: 700;
}
.tool-title img {
  width: 26px;
  height: 26px;
  margin-right: 1px;
}
.order-one{
  flex: 5.9;
  margin-right: 0px;
}
.dept-tab {
  margin-left: 40px;
  flex: 4;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.rank-tab-change {
  margin: 0 2% -10px 2%;
}
.order-two{
  flex: 4.1;
  margin-right: 10px;
}
.order-engineerName{
  margin:0;
}
.my-order-lang{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.order-title{
  margin: 15px 0 15px 45px;
}
.clue-avue{
  width: 97%;
  padding: 0 12px;
}
.disable_img_sty{
  width:20px;
  height:20px;
  margin-left: 3px;
}
.order-pointer-sty{
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  margin-right: 30px;
  color: #409eff;
  text-decoration: underline;
}
.order-pointer-sty:hover{
  color: #409EFF;
}
#handle-style{
  color: rgb(64, 158, 255) !important;
  cursor: pointer
}
.engineer-name-sty{
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}
</style>