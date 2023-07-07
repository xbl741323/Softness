<template>
  <div class="member-bg">
    <!-- 订单状态 -->
    <div class="order-status">
      <span>订单状态：</span>
      <el-radio-group  v-model="orderForm.timeStatus" @change="page.currentPage = 1, getVipOrder()">
        <el-radio-button 
          class="radio-sty-member"
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="page.currentPage = 1,getVipOrder()" >搜索</el-button>
        <el-button type="warning" @click="reset()">重置</el-button>
        <el-button type="primary" @click="getExport()" v-if="permissions.sys_courseOrder_export  && source == 'list'">数据导出</el-button>
      </el-form-item>
    </el-form>

    <avue-crud
    ref="crud"
    :table-loading="tableLoading"
    :data="dataList"
    :option="$route.path == '/wt-course/course-order'? option : perOption"
    :page.sync="page"
    @on-load="getVipOrder"
    class="pad"
    >
        <!-- 订单编号 -->
        <template slot="orderNo" slot-scope="scope">
            <span class="clickable" @click="seeDetail(scope.row)" v-if="(permissions.bt_order_detail_courses_vip&&!routeBool)||(permissions.bt_order_detail_courses_vip_my&&routeBool)">{{scope.row.orderNo }}</span>
            <span  v-else>{{scope.row.orderNo }}</span>
        </template>

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
                @click="seeDetail(scope.row)" v-if="(permissions.bt_order_detail_courses_vip&&!routeBool)||(permissions.bt_order_detail_courses_vip_my&&routeBool)">查看</el-button>
        </template>
    </avue-crud>
    <el-dialog 
      title="数据导出中，请稍后..."
      :visible.sync="exportDialog"
      width="450px"
      top="350px"
      :close-on-click-modal= "false">
      <el-progress :text-inside="true" :stroke-width="24" :percentage="percent" status="success"></el-progress>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import orderData from '@/components/member/order-data.js'
import { saveDetal } from "@/util/clearDetail";
import { tableOption ,tablePersonalOption} from "@/const/crud/member/member-order";
import { getEmpInfo,getWaitPayCount,dataExport,dataExportProgress } from "@/api/member/index";
import { getPersoanlOrder, getPersonalVipStatistics } from "@/api/order/index";
export default {
    props:{
        source: {
            type: String
        }
    },
    computed: {
        ...mapGetters(['permissions']),
    },
    data () {
        return {
            routeBool: this.$route.path.includes("/personal-order"),
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
            perOption: tablePersonalOption,
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
            exportDialog: false,
            percent: 0
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
        if(sessionStorage.getItem(`${this.$route.path}`)){
            let obj = JSON.parse(sessionStorage.getItem(`${this.$route.path}`));
            if(obj.detail.path!==''){
                this.$router.push({
                    path: obj.detail.path,
                    query: obj.detail.query
                })
            }
            if(obj["formDatas2"]){
                this.page.currentPage = obj["formDatas2"].pageNo;
                this.page.pageSize = obj["formDatas2"].pageSize;
                this.orderForm.timeStatus = obj["formDatas2"].timeStatusNew;
                this.orderForm.keyWord = obj["formDatas2"].keyWord;
                this.orderForm.belongName = obj["formDatas2"].belongName;
                this.orderForm.createTime = obj["formDatas2"].createTime;
            }
        }
        this.getCurrentDate();
    },
    mounted () {

    },
    methods: {
        getExport(){
            this.exportDialog = true
            this.dataExport()
            let progress = null
            let timer = setInterval(() => {
                progress = this.getProgress()
                if(progress == 100){
                clearInterval(timer)
                this.exportDialog = false
                }
            }, 3000)
        },
        // 获取进度
        getProgress(){
            let progress = null
            dataExportProgress().then((res) => {
                progress = res.data.data
            });
            if(progress == 1.0 || progress=='1.0' || progress == null){
                this.percent = 100
            }else{
                this.percent = Number(progress) * 100
            }
            return this.percent
        },
        // 数据导出
        dataExport(){
            var params ={
                pageNo: this.page.currentPage,
                pageSize: this.page.pageSize, 
                timeStatus: this.orderForm.timeStatus==4?null:this.orderForm.timeStatus,
                keyWord: this.orderForm.keyWord,
                startTime :this.orderForm.createTime ? this.$moment(this.orderForm.createTime[0]).format('YYYY-MM-DD HH:mm:ss'): '',
                endTime : this.orderForm.createTime ? this.$moment(this.orderForm.createTime[1]).format('YYYY-MM-DD HH:mm:ss'): '',
                belongName : this.orderForm.belongName,
                orderStatus:this.orderForm.timeStatus==4 ? 0 : null
            }
            dataExport(params).then(response => {
                let url = window.URL.createObjectURL(new Blob([response.data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                let num = '';
                for(let i = 0; i < 10; i++){
                    num += Math.ceil(Math.random() * 10);
                }
                link.setAttribute('download', '会员订单数据_' + num + '.xlsx');
                document.body.appendChild(link)
                link.click()
            })
        },
        //获取订单列表
        getVipOrder() {
            this.tableLoading = true;
            this.userInfo = JSON.parse(sessionStorage.getItem('pigx-userInfo')).content;
            var param ={
                pageNo: this.page.currentPage,
                pageSize: this.page.pageSize, 
                timeStatus: this.orderForm.timeStatus==4?null:this.orderForm.timeStatus,
                keyWord: this.orderForm.keyWord,
                startTime :this.orderForm.createTime ? this.$moment(this.orderForm.createTime[0]).format('YYYY-MM-DD HH:mm:ss'): '',
                endTime : this.orderForm.createTime ? this.$moment(this.orderForm.createTime[1]).format('YYYY-MM-DD HH:mm:ss'): '',
                belongName : this.orderForm.belongName,
                orderStatus:this.orderForm.timeStatus==4 ? 0 : null
            }
            // 需要缓存的参数
            let keepParams = {
                activeName: "second",
                createTime: this.orderForm.createTime,
                timeStatusNew: this.orderForm.timeStatus,
            }             
            let obj = JSON.parse(sessionStorage.getItem(`${this.$route.path}`));    
            obj["formDatas2"] = Object.assign({}, param, keepParams)
            sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(obj));
            if(this.source == 'personal'){
                param.belongId = this.userInfo.id;
                getPersonalVipStatistics({belongId: this.userInfo.id}).then(res=>{
                    if(res.data.code==0){
                        this.unpaidNum = res.data.data.waitPayCount
                    }else {
                        this.$message({
                            message: res.data.msg,
                            type: 'warning',
                            offset:300,
                            duration: 2000
                        });
                    };
                })
                getPersoanlOrder(param).then(res=>{
                    this.tableLoading = false;
                    if(res.data.code == 0){
                        this.dataList = res.data.data.records;
                        this.page.total = res.data.data.total;
                    };
                })

            }else{
                getWaitPayCount().then(res=>{
                    if(res.data.code==0){
                        this.unpaidNum = res.data.data
                    }else {
                        this.$message({
                            message: res.data.msg,
                            type: 'warning',
                            offset:300,
                            duration: 2000
                        });
                    }
                })
                orderData.getOrderList(param).then(res=>{//订单列表数据
                    this.tableLoading = false;
                    this.dataList = res.data.records;
                    this.page.total = res.data.total;
                })
            }
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
            let path = "/wt-member-detail";
            let query = {
                id: row.id,
                source: this.source == 'personal' ? 'personal' : 'list'
            }
            saveDetal(`${this.$route.path}`, path, query);
            this.$router.push({
                path: path,
                query: query
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
    margin:0px 0 16px 0;
    padding-top:15px;
    padding-left: 30px;
    font-size: 14px;
    color: #606266;
}
.radio-sty-member {  
  margin-right: 12px;
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
</style>