<template>
  <div class="course-bg">
    <!-- 订单状态 -->
    <div class="order-status">
      <span>订单状态：</span>
      <el-radio-group  v-model="orderForm.orderStatus" @change="page.currentPage = 1, getCourseList()">
          <el-radio-button :label="null">全部</el-radio-button>
          <el-radio-button label="0,1" class="radio-sty radio-sty-left">
              <span class="red-circle"></span>待付款
              <span v-if="unpaidAmount!=null">({{unpaidAmount}})</span>
          </el-radio-button>
          <el-radio-button :label="2" class="radio-sty radio-sty-left">
              <b  class="newsuccess">✔</b>已付款
              <span v-if="paidAmount!=null">({{paidAmount}})</span>
          </el-radio-button>
          <el-radio-button :label="4" class="radio-sty radio-sty-left">已取消</el-radio-button>
          <el-radio-button :label="1" class="radio-sty radio-sty-left">已删除</el-radio-button>
      </el-radio-group>
    </div>

     <el-form  inline :model="orderForm" label-width="100px" @keyup.enter.native="getAllList()">
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
      <el-button type="primary" @click="getExport()" v-if="permissions.sys_courseOrder_export && source == 'list'" >数据导出</el-button>
    </el-form>
    <el-dialog 
      title="数据导出中，请稍后..."
      :visible.sync="exportDialog"
      width="450px"
      top="350px"
      :close-on-click-modal= "false">
      <el-progress :text-inside="true" :stroke-width="24" :percentage="percent" status="success"></el-progress>
    </el-dialog>

    <avue-crud 
    ref="crud"
    :table-loading="tableLoading"
    :data="dataList"
    :option="$route.path == '/wt-course/course-order'? option : perOption"
    :page.sync="page"
    @on-load="getCourseList"
    v-if="dataList"
    class="pad"
    >
        <!-- 订单编号 -->
        <template slot="orderNo" slot-scope="scope">
            <span class="clickable" @click="seeDetail(scope.row)" v-if="(permissions.bt_order_detail_courses&&!routeBool)||(permissions.bt_order_detail_courses_my&&routeBool)">{{scope.row.orderNo }}</span>
            <span  v-else>{{scope.row.orderNo }}</span>
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
        <!-- 操作 -->ref=""
        <template slot="menu" slot-scope="scope">
            <span>
                <el-button type="text"  v-if="(permissions.bt_order_detail_courses&&!routeBool)||(permissions.bt_order_detail_courses_my&&routeBool)"  icon="el-icon-view" @click="seeDetail(scope.row)">查看</el-button>
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
import { tableOption,tablePersonalOption } from "@/const/crud/course/course-order";
import { getEmpInfo, dataExport, dataExportProgress} from "@/api/course/index";
import { getPersonalCourse, getPersonalStatistics } from '@/api/order/index'
import { saveDetal } from "@/util/clearDetail";
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
            routeBool: this.$route.path.includes("/personal-order"),
            tableLoading: false,
            orderForm: {
                orderStatus:null,
                keyWord:'',
                belongName:'',
                createTime:''
            },
            orderStatusList: [],
            option: tableOption,
            perOption: tablePersonalOption,
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
            exportDialog: false,
            percent: 0
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
    created(){
        if(sessionStorage.getItem(`${this.$route.path}`)){          
            let obj = JSON.parse(sessionStorage.getItem(`${this.$route.path}`));
            if(obj.detail.path!==''){
                this.$router.push({
                    path: obj.detail.path,
                    query: obj.detail.query
                })
            }
            if(obj["formDatas1"]){
                this.page.currentPage = obj["formDatas1"].pageNo;
                this.page.pageSize = obj["formDatas1"].pageSize;
                this.orderForm.orderStatus = obj["formDatas1"].orderStatusNew;
                this.orderForm.keyWord = obj["formDatas1"].keyWord;
                this.orderForm.belongName = obj["formDatas1"].belongName;
                this.orderForm.createTime = obj["formDatas1"].createTime;
                  
            }
        }
    },
    mounted () {
        this.getDropList()
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
                orderStatusList: this.orderForm.orderStatus=="0,1" ? this.orderForm.orderStatus.split(','):null,
                deleted: this.orderForm.orderStatus == 1 ? this.orderForm.orderStatus : null,
                pageNo: this.page.currentPage,
                pageSize: this.page.pageSize, 
                orderStatus: this.orderForm.orderStatus == 2 || this.orderForm.orderStatus == 4 ? this.orderForm.orderStatus : null,
                keyWord: this.orderForm.keyWord,
                startTime :this.orderForm.createTime ? this.$moment(this.orderForm.createTime[0]).format('YYYY-MM-DD HH:mm:ss'): '',
                endTime : this.orderForm.createTime ? this.$moment(this.orderForm.createTime[1]).format('YYYY-MM-DD HH:mm:ss'): '',
                belongName : this.orderForm.belongName,
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
                link.setAttribute('download', '课程订单数据_' + num + '.xlsx');
                document.body.appendChild(link)
                link.click()
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
            }
            // 需要缓存的参数
            let keepParams = {
                activeName: "first",
                createTime: this.orderForm.createTime,
                orderStatusNew: this.orderForm.orderStatus,
            }             
            let obj = JSON.parse(sessionStorage.getItem(`${this.$route.path}`));
            obj["formDatas1"] = Object.assign({}, param, keepParams)
            sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(obj));
            if(this.source == 'personal'){
                param.belongId = this.userInfo.id;
                getPersonalStatistics({belongId: this.userInfo.id}).then(res=>{
                    this.paidAmount = res.data.data.inServiceCount;    
                    this.unpaidAmount = res.data.data.waitPayCount;    
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
            }else{
                orderData.getOrderStatus().then(res=>{//订单列表数据
                    let sum = 0;
                    res.data.forEach((item,index)=>{
                        if(item.orderStatus == 0 || item.orderStatus == 1){
                            sum += item.amount;
                        }
                        if(item.orderStatus == 2){
                            this.paidAmount = item.amount;
                        }
                    })
                    this.unpaidAmount = sum;    
                    this.orderStatusList = res.data;
                })
                orderData.getCourseList(param).then(res=>{//订单列表数据
                    if(res.code == 0){
                        this.tableLoading = false;
                        res.data.records.forEach((item,index)=>{
                            if(this.orderForm.orderStatus == 1){
                                this.$set(item,'orderStatus',3)
                            }
                        })
                        this.dataList = res.data.records;
                        this.page.total = res.data.total;
                    }
                })
            };
        },

        // 查看订单详情
        seeDetail(row) {
            let path = "/wt-course-detail";
            let query = {
                id: row.id,
                isVip: row.vipFlag,
                source: this.source == 'personal' ? 'personal' : 'list'
            }
            saveDetal(`${this.$route.path}`, path, query);
            this.$router.push({
                path: path,
                query: query
            })
        },

        // 专业分类匹配
        filterProfession(row){
            let arr = [];
            this.professionList.forEach((item,index)=>{
                if (!row) return false
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
    margin:0px 0 16px 30px;
    padding-top: 15px;
    font-size: 14px;
    color: #606266;
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
.pad{
    padding:20px;
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