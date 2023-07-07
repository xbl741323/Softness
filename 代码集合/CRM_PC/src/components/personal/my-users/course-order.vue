<template>
<!-- 排查完成 -->
  <div class="course-bg">
    <!-- 订单状态 -->
    <div class="order-status">
      <span>订单状态：</span>
      <el-radio-group  v-model="orderForm.orderStatus" @change="page.currentPage = 1, getCourseList()">
          <el-radio-button :label="null">全部</el-radio-button>
          <el-radio-button label="0,1" class="radio-sty radio-sty-left">
              <span class="red-circle"></span>待付款
              <span v-if="unpaidAmount!=null">({{unpaidAmount}})</span>
              <span v-else>(0)</span>
          </el-radio-button>
          <el-radio-button :label="2" class="radio-sty radio-sty-left">
              <b  class="newsuccess">✔</b>已付款
              <span v-if="paidAmount!=null">({{paidAmount}})</span>
          </el-radio-button>
          <el-radio-button :label="4" class="radio-sty radio-sty-left">已取消</el-radio-button>
          <el-radio-button :label="1" class="radio-sty radio-sty-left">已删除</el-radio-button>
      </el-radio-group>
    </div>

     <el-form  inline :model="orderForm" label-width="100px" @keyup.enter.native="getAllList()" class="mar-sty">
      <el-form-item label="关键字：">
        <el-input v-model="orderForm.keyWord" placeholder="请输入主体名称/课程名称关键字/订单编号/主体ID/手机号" class="wid1"/>
      </el-form-item>
      <el-form-item label="订单归属：">
        <el-input v-model="orderForm.belongName" placeholder="请输入订单归属" class="wid"/>
      </el-form-item>
      <el-form-item label="创建时间：">
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
      <el-button type="primary" icon="el-icon-search" @click="page.currentPage = 1, getCourseList()">搜索</el-button>
      <el-button type="warning" @click="reset()">重置</el-button>
    </el-form>
    <avue-crud 
    ref="crud"
    :table-loading="tableLoading"
    :data="dataList"
    :option="option"
    :page.sync="page"
    @on-load="getCourseList"
    v-if="dataList"
    class="pad"
    >
        <!-- 订单编号 -->
        <template slot="orderNo" slot-scope="scope">
            <span class="clickable" @click="seeDetail(scope.row)" v-if="scope.row">{{scope.row.orderNo }}</span>
        </template>

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


        <!-- 下单来源 -->
        <template slot="orderSource" slot-scope="scope">
            <span>{{scope.row.orderSource | wherePlat}}</span>
        </template>

        <!-- 操作 -->
        <template slot="menu" slot-scope="scope">
            <span>
                <el-button type="text"  icon="el-icon-view" @click="seeDetail(scope.row)">查看</el-button>
            </span>
        </template>
    </avue-crud>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as CodeMsg from "@/api/common/CodeChange";
import { getOptionList } from "@/api/project/wtClass";
import orderData from '@/components/course/order-data.js'
import { tableOption} from "@/const/crud/user/course-order";
import { getEmpInfo} from "@/api/course/index";
import { getPersonalCourse, getPersonalStatistics } from '@/api/order/index'

export default {
    props:{
        source:{
            type: String,
        }
    },
    computed: {
        ...mapGetters(['permissions']),
    },
    data () {
        return {
            tableLoading: false,
            orderForm: {
                orderStatus:null,
                keyWord:'',
                belongName:'',
                createTime:''
            },
            orderStatusList: [],
            option: tableOption,
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 20, // 每页显示多少条
            },
            dataList:[],
            unpaidAmount:null,
            paidAmount:null,
            number:"",
            deptName:"",
            professionList: [],
            userInfo: {},
        }
    },
    filters:{
        payAmount(value){
            return orderData.payAmount(value);
        },
        filterOrderStatus(value){
            return orderData.filterOrderStatus(value);
        },
        wherePlat(value){
            return orderData.wherePlat(value);
        },
    },
    mounted () {
        this.getDropList()
    },
    methods: {
        // 获取产品分类下拉框数据
        getDropList() {
        getOptionList().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
            this.professionList = res.data.data;
           }
        });
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

        // 获取订单信息
        getCourseList() {
            this.userInfo = JSON.parse(sessionStorage.getItem('pigx-userInfo')).content;
            this.tableLoading = true;
            var param ={
                orderStatusList: this.orderForm.orderStatus=="0,1" ? this.orderForm.orderStatus.split(','):null,
                deleted: this.orderForm.orderStatus == 1 ? this.orderForm.orderStatus : null,
                pageNo: this.page.currentPage,
                pageSize: this.page.pageSize, 
                orderStatus: this.orderForm.orderStatus == 2 || this.orderForm.orderStatus == 4 ? this.orderForm.orderStatus : null,
                keyWord: this.orderForm.keyWord,
                startTime :this.orderForm.createTime ? this.$moment(this.orderForm.createTime[0]).format('YYYY-MM-DD HH:mm:ss'): '',
                endTime : this.orderForm.createTime ? this.$moment(this.orderForm.createTime[1]).format('YYYY-MM-DD HH:mm:ss'): '',
                belongName : this.orderForm.belongName,
                userId: Number(this.$route.query.userId)
            }
                getPersonalStatistics({userId: Number(this.$route.query.userId)}).then(res=>{
                    this.unpaidAmount = res.data.data.waitPayCount  
                    this.orderStatusList = res.data.data;
                })
                getPersonalCourse(param).then(res=>{
                    if(res.data.code == 0){
                        this.tableLoading = false;
                        res.data.data.records.forEach((item,index)=>{
                            if(this.orderForm.orderStatus == 1){
                                this.$set(item,'orderStatus',3)
                            }
                        })
                        this.dataList = res.data.data.records;
                        this.page.total = res.data.data.total;
                    } 
                })
        },

        // 查看订单详情
        seeDetail(row) {
            this.$router.push({
                path: '/wt-course-detail',
                query:{
                    id: row.id,
                    isVip:row.vipFlag,
                    source:this.source == 'list' ? 'list' : 'personal'
                }
            })
        },

        // 专业分类匹配
        filterProfession(row){
            let arr = [];
            this.professionList.forEach((item,index)=>{
                if(row.includes(item.id)){
                    arr.push(item.categoryName)
                }
            })
            return arr;
        },
        // 重置
        reset(){
            this.orderForm = {
                orderStatus:null,
                keyWord:'',
                belongName:'',
                createTime:''
            };
            this.getCourseList();
        },

        getAllList() {
            this.page.currentPage = 1;
            this.getCourseList();
        },

        sizeChange(val){
            this.page.pageSize = val;
            this.getCourseList();
        },
        
        currentChange(val){
            this.page.currentPage = val;
            this.getCourseList();
        },
    },
}
</script>

<style scoped>
.course-bg {
  background-color: #fff;
  height: 100%;
}
.order-status {
  margin: 5px 0px 16px 0px;
  font-size: 14px;
  color: #606266;
}
.mar-sty {
  margin-left: -30px;
}
.radio-sty {  
  margin-left: 12px;
}
.radio-sty-left {   
  border-left: 1px solid #dcdfe6;
}
.red-circle {
  width:6px;
  height:6px;
  display: inline-block;
  border-radius: 50%;
  background: #fe3636;
  margin-right:7px;
}
.to-be-effective {
  background: #f3ab03;
}
.wid {
  width:320px;
}
.wid1 {
  width:360px;
}
.clickable{
  color: #36A6FE;
  cursor: pointer;
}
.newsuccess{
  font-weight:bolder;
  font-size:12px;
  display: inline-block;
  color:#027502;
  margin-right:6px;
}
.vip{
  display: inline-block;
  width:28px;
  height: 15px;
  position: absolute;
  right: 0;
  top: -2px;
  color: #fe3636;
  font-style: italic;
  font-size: 12px;
}
.hide{
  display: none;
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
</style>