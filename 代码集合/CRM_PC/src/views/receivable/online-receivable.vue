<!-- 排查完成-支付记录 -->
<template>
  <div class="online-receive-frame" v-if="permissions.sys_online_receive_detail || source == 'personal'">
    <el-form :model="filters" @keyup.enter.native="getAllList()" inline label-width="90px">
      <div>
        <el-form-item label="订单类型：">
        <el-radio-group size="medium" v-model="filters.orderClass" @change="changeOrderStatus()">
          <el-radio-button :class="[index!=0?'radio-item':'']" v-for="(item,index) in orderTypeList" :label="item.val" :key="index">
            <span>{{item.title}}</span>
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      </div>
       <div>
        <el-form-item label="领取状态：">
        <el-radio-group size="medium" v-model="filters.receiveStatus" @change="changeReceiveStatus()">
          <el-radio-button :class="[index!=0?'radio-item':'']" v-for="(item,index) in receiveStatusList" :label="item.val" :key="index">
            <span v-if="index == 0">全部</span>
            <div v-else>
              <span>{{item.title}}</span>
              <span v-if="item.val == 0">({{waitCount}})</span>
            </div>
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      </div>
      <el-form-item label="关键字：">
        <el-input :placeholder="setPlaceDec()" v-model="filters.keyWords" class="key-input-complex" style="width: 340px;"/>
      </el-form-item>
      <el-form-item label="订单归属：">
        <el-cascader :before-filter="beforeFilter" ref="orderBelongNo" filterable :show-all-levels='false' clearable :options="empList" v-model="filters.orderBelongNo" :props="empProps">
          <template slot-scope="{data}">
            <el-tooltip effect="dark" placement="right" v-if="data.customerNo">
              <div slot="content">{{data.customerNo}}</div>
              <span>{{data.label}}</span>
            </el-tooltip>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item label="业务员：" v-if="filters.orderClass == 1">
        <el-cascader :before-filter="beforeFilter" ref="saleBelongNo" filterable :show-all-levels='false' clearable :options="empList" v-model="filters.saleBelongNo" :props="empProps">
          <template slot-scope="{data}">
            <el-tooltip effect="dark" placement="right" v-if="data.customerNo">
              <div slot="content">{{data.customerNo}}</div>
              <span>{{data.label}}</span>
            </el-tooltip>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item label="支付时间：">
        <el-date-picker class="date-sty" v-model="filters.receiveTime" type="datetimerange" value-format="yyyy-MM-dd" format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getAllList()">搜索</el-button>
      <el-button type="warning" @click="resetList()">重置</el-button>
      <el-button type="primary" @click="permissions.sys_online_receive_export ? getList('export') : $notAuthorized()">导出</el-button>
      <div class="receive-senior">
        <el-checkbox v-model="senior">{{$t("message.hignSearch")}}</el-checkbox>
      </div>
      <div v-if="senior">
        <el-form-item label="支付方式：" v-if="filters.orderClass == 1">
          <el-select v-model="filters.payWay">
            <el-option v-for="(item,index) in payWayList" :key="index" :label="item.title" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式：" v-if="filters.orderClass != 1">
          <el-select v-model="filters.payWay">
            <el-option v-for="(item,index) in classWayList" :key="index" :label="item.title" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款类型：" v-if="filters.orderClass == 1">
          <el-select v-model="filters.payType">
            <el-option v-for="(item,index) in payTypeList" :key="index" :label="item.title" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付去向：" v-if="filters.orderClass == 1">
          <el-select v-model="filters.payDirection" class="direction-sty">
            <el-option v-for="(item,index) in payDirectionList" :key="index" :label="item.title" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div v-show="filters.orderClass == 1">
      <avue-crud ref="crud"
      v-if="filters.orderClass == 1"
      :data="tableData"
      :option="productOption"
      :page.sync="page"
      @size-change="sizeChange"
      @current-change="currentChange">
      <template slot="refundAmount" slot-scope="scope">
        <div v-if="scope.row.ttRefundFeeList!=null">
          <div v-for="(item,index) in scope.row.ttRefundFeeList" :key="index">
           <span>{{item.costTypeId|filterCostType}}</span>
           <span>{{item.costAmount}}</span>
          </div>
        </div>
        <span v-else>/</span>
      </template>
      <template slot="amountType" slot-scope="scope">
        <div v-for="(item,index) in scope.row.ttOrderFeeList" :key="index+'1'">
           <span v-if="item.costType==1&&item.price!=0">{{item.costType|filterCostType}}</span>
           <span v-if="item.costType==1&&item.price!=0">{{item.price}}</span>
        </div>
        <div v-for="(item,index) in scope.row.ttOrderFeeList" :key="index+'2'">
           <span v-if="item.costType==2&&item.price!=0">{{item.costType|filterCostType}}</span>
           <span v-if="item.costType==2&&item.price!=0">{{item.price}}</span>
        </div>
        <div v-for="(item,index) in scope.row.ttOrderFeeList" :key="index+'3'">
           <span v-if="item.costType==3&&item.price!=0">{{item.costType|filterCostType}}</span>
           <span v-if="item.costType==3&&item.price!=0">{{item.price}}</span>
        </div>
      </template>
      <template slot="payType" slot-scope="scope">
        <span>{{scope.row.payType | filterPayType}}</span>
      </template>
      <template slot="payWay" slot-scope="scope">
        <span>{{scope.row.payChannel | filterPayChannel}}</span>
      </template>
      <template slot="receiveStatus" slot-scope="scope">
        <span :class="[scope.row.claimStatus == 0?'red-sty':'']">{{scope.row.claimStatus | filterReceiveStatus}}</span>
      </template>
      <template slot="orderBelongName" slot-scope="scope">
        <el-tooltip effect="dark" :content="'工号：'+ cEmpNo +'   部门：'+ cDeptName" placement="top">
          <span @mouseover="showUserInfo(scope.row.belongId)">{{scope.row.belongName}}</span>
        </el-tooltip>
      </template>
      <template slot="saleBelongName" slot-scope="scope">
        <el-tooltip effect="dark" :content="'工号：'+ cEmpNo +'   部门：'+ cDeptName" placement="top">
          <span @mouseover="showUserInfo(scope.row.clueSalesmanEmpId)">{{scope.row.clueSalesmanEmpName}}</span>
        </el-tooltip>
      </template>
      <template slot="payDirection" slot-scope="scope">
        <span>{{scope.row.categoryId|filterDirection}}</span>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" @click="viewCredentials(scope.row)">查看</el-button>
      </template>
    </avue-crud>
    </div>

    <div v-show="filters.orderClass != 1">
      <avue-crud ref="crud"
      v-if="filters.orderClass != 1"
      :data="tableData"
      :option="classOption"
      :page.sync="page"
      @size-change="sizeChange"
      @current-change="currentChange">
      <template slot="spuName" slot-scope="scope">
        <span v-if="filters.orderClass == 2">卧涛课堂会员</span>
        <span v-if="filters.orderClass == 3">{{scope.row.productName}}</span>
      </template>
      <template slot="payWay" slot-scope="scope">
        <span>{{scope.row.payChannel | filterPayChannel}}</span>
      </template>
      <template slot="receiveStatus" slot-scope="scope">
        <span :class="[scope.row.claimStatus == 0?'red-sty':'']">{{scope.row.claimStatus | filterReceiveStatus}}</span>
      </template>
      <template slot="orderBelongName" slot-scope="scope">
        <el-tooltip effect="dark" :content="'工号：'+ cEmpNo +'   部门：'+ cDeptName" placement="top">
          <span @mouseover="showUserInfo(scope.row.belongId)">{{scope.row.belongName}}</span>
        </el-tooltip>
      </template>
      <template slot="payDirection">
        <span>卧涛科技有限公司</span>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" @click="viewCredentials(scope.row)">查看</el-button>
      </template>
    </avue-crud>
    </div>

    <!-- 查看凭证 -->
    <el-dialog title="付款记录" :visible.sync="viewDialog" :close-on-click-modal="false" width="450px">
      <p>付款方名称：{{filters.orderClass == 1?payInfo.subjectName:payInfo.userName}}</p>
      <p>支付方式：{{payInfo.payChannel | filterPayChannel}}</p>
      <p>支付时间：{{payInfo.payTime}}</p>
      <p v-if="payInfo.payChannel == 0">支付宝流水号：{{payInfo.tradeNo}}</p>
      <p v-if="payInfo.payChannel == 2">微信流水号：{{payInfo.tradeNo}}</p>
      <p v-if="payInfo.payChannel == 1" class="refund-success" @click="preview(payInfo.tradeNo)">查看转账凭证</p>
    </el-dialog>

    <!-- 导出进度条 -->
   <el-dialog
      title="数据导出中，请稍后..."
      :visible.sync="exportDialog"
      width="450px"
      top="350px"
      :close-on-click-modal= "false">
      <el-progress :text-inside="true" :stroke-width="24" :percentage="percent" status="success"></el-progress>
    </el-dialog>

    <!-- 图片预览 -->
    <div class="demo-image__preview image_fix_sty">
     <el-image
       ref="preview"
       style="width: 0px; height: 0px"
       :src="preUrl"
       :preview-src-list="srcList">
     </el-image>
    </div>
  </div>
</template>

<script>
import { getEmpInfo } from "@/api/project/wtClass";
import { getEmpList} from '@/api/clue/clue'
import { productOption, classOption } from '@/const/crud/personal/pay-records'
import { getPayExportProgress} from '@/api/receive/receive-api'
import receiveData from '@/views/receivable/js/receivable.js'
import { getTrTaskOrderByTaskNo } from "@/api/order/index.js"
import { getReceivePayRecords, getUnclaimedCount } from "@/api/receive/receive.js"
import { mapGetters } from "vuex"
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  computed: {
    ...mapGetters(['permissions'])
  },
  props:{
    source:{
      type: String,
      require: true,
      default:'',
    }
  },
  data(){
    var userValidator = (rule, value, callback)=>{
      if(value){
        callback();
      }else{
        callback(new Error('请选择归属人！'));
      };
    };
    var salesValidator = (rule, value, callback)=>{
      if(value){
        callback();
      }else{
        callback(new Error('请选择业务员！'));
      };
    };
    return {
      waitCount: 0,
      cEmpNo: '',
      cDeptName: '',
      empProps:{
        value: 'customerId',
        label: 'label'
      },
      orderTypeList:[
        {
          title:'产品订单',
          val:1
        },
        {
          title:'课堂会员订单',
          val:2
        },
        {
          title:'课程订单',
          val:3
        }
      ],
      receiveStatusList:[
        {
          title:'全部',
          val: null
        },
        {
          title:'待认领',
          val: 0
        },
        {
          title:'已认领',
          val: 1
        },
      ],
      filters: {
        orderClass: 1, // 订单状态 1：产品 2：会员 3：课程
        receiveStatus: null, // 0：未认领 1：已认领
        keyWords:"", // 关键字
        orderBelongNo:"", // 订单归属
        saleBelongNo:"", // 业务员
        receiveTime:null, // 支付时间
        payWay:'', // 支付方式
        payType:'', // 付款类型
        payDirection:'' // 支付去向
      },
      empList: [],
      senior: false,
      productOption: productOption,
      classOption: classOption,
      payDirectionList:[
        {
          title:'全部',
          val:''
        },
        {
          title:'卧涛科技有限公司',
          val:999
        },
        {
          title:'上海恩凡知识产权代理有限公司',
          val:3
        }
      ],
      payTypeList: [ // 付款类型
      {
        title:'全部',
        val:''
       },
      {
        title:'定金',
        val:1
       },
       {
        title:'尾款',
        val:2
       },
       {
        title:'一口价',
        val:3
       }
      ],
      payWayList: [ // 支付方式选项
      {
        title:'全部',
        val:''
       },
       {
        title:'支付宝',
        val:0
       },
       {
        title:'微信',
        val:2
       },
       {
        title:'对公转账',
        val:1
       },
      ],
      classWayList: [ // 会员和课程支付方式选项
       {
        title:'全部',
        val:''
       },
       {
        title:'支付宝',
        val:0
       },
       {
        title:'微信',
        val:2
       }
      ],
      page: {
        currentPage: 1,
        total:0,
        layout: "total, sizes, prev, pager, next, jumper",
        background: true ,
        pageSizes: [ 5, 8, 10, 20, 30, 40, 50, 100 ],//选择每页显示条数
        pageSize:20
      },
      empRules:{
        userBelongNo:[{required: true, validator:userValidator, trriger:'change'}],
        salesmanNo:[{required: true, validator:salesValidator, trriger:'change'}],
      },
      tableData:[],
      viewDialog: false,
      payInfo: {},
      preUrl: '',
      srcList: [],
      receiveId:'',
      empForm: {},
      imgUrl: process.env.VUE_APP_IMAGE_BASEURL,
      salesmanData: {},
      spreadData: {},
      exportDialog: false,
      percent: 0
    }
  },
  filters:{
    filterDirection(val){
      return val == 3?'上海恩凡知识产权代理有限公司':'卧涛科技有限公司'
    },
    receiveAmount(value,receiveStatus,contractNo){
      return receiveData.receiveAmount(value,receiveStatus,contractNo);
    },
    amountType(value){
      return receiveData.amountType(value);
    },
    // 付款类型
    filterPayType(val){
      return val == 1?'定金' : val==2?'尾款' : val==3?'一口价':''
    },
    // 支付方式
    filterPayChannel(val){
      return val == 0?'支付宝' : val==1?'对公转账' : val==2?'微信':''
    },
    // 认领状态
    filterReceiveStatus(val){
      return val == 0?'待认领' : val==1?'已认领' :''
    },
    // 费用类型（1:代理费;2:第三方费用;3:官费;4:待定）
    filterCostType(val){
      return val == 1?'代理费' : val==2?'第三方费用' : val==3?'官费' : val==4?'待定' :''
    },
  },
  created(){
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      this.filters.receiveStatus = keepParams.params.claimStatus;
      this.page.currentPage = keepParams.params.pageNo;
      this.page.pageSize = keepParams.params.pageSize;
      this.filters.keyWords = keepParams.params.keyWord;
      this.filters.receiveTime = keepParams.receiveTime;
      this.filters.orderBelongNo = keepParams.orderBelongNo;
      this.filters.payWay = keepParams.params.payChannel;
      if(this.filters.orderClass == 1){
        this.filters.payType = keepParams.params.payType; // 付款类型(1:定金；2:尾款；3:一口价)
        this.filters.saleBelongNo = keepParams.saleBelongNo;
        this.filters.payDirection = keepParams.params.categoryId
      }
      this.filters.orderClass = keepParams.orderClass;
      this.senior = keepParams.senior
    }
  },
  mounted(){
    this.getDropList();
    this.setDefaultTime();
    this.getList();
  },
  methods:{
    setPlaceDec(){
      let val = this.filters.orderClass
      return val == 1?'订单产品/客户名称/精确支付流水号/订单编号':'订单产品/客户名称/支付流水号/订单编号/客户手机号'
    },
    setDefaultTime(){
      let startTime = this.$moment(new Date()).startOf('month').format("YYYY-MM-DD")
      let endTime = this.$moment(new Date()).endOf('month').format("YYYY-MM-DD")
      this.filters.receiveTime = [startTime,endTime]
    },
    // 获取员工信息
    showUserInfo(val){
      let id = Number(val)
      getEmpInfo(id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.cEmpNo = res.data.data.number
          this.cDeptName = res.data.data.deptName
        }
      })
    },
    //显示工号
    async beforeFilter() {
      getEmpList(true).then(res => {
        this.empList = res.data.data;
      });
      this.$loop(this.empList[0], this.empList[0])
      return false
    },
    getDropList() {
      // 获取员工数据
      getEmpList(true).then((res) => {
        this.empList = res.data.data;
      });
    },
    // 修改订单类型
    changeOrderStatus(){
      if(this.filters.orderClass != 1&&this.filters.payWay == 1){
        this.filters.payWay = ''
      }
      this.getAllList()
    },
    // 修改领取状态
    changeReceiveStatus(){
      this.getAllList()
    },
    getSpread(){
      this.spreadData = this.$refs.spread.getCheckedNodes()[0].data;
    },
    getSalesman(){
      this.salesmanData =  this.$refs.salesman.getCheckedNodes()[0].data;
    },
    getAllList(){
      this.page.currentPage = 1;
      this.getList();
    },
    messageBox(){
      this.$offsetMessage({
        message: '无权限操作！',
        type: 'warning'
      });
    },
    resetList(){
      this.filters.keyWords = ''
      this.filters.orderBelongNo = ''
      this.filters.saleBelongNo = ''
      this.filters.payWay = ''
      this.filters.payType = ''
      this.filters.payDirection = ''
      this.setDefaultTime();
      this.getList();
    },
    preview(tradeNo){
      getTrTaskOrderByTaskNo({tradeNo}).then(res=>{
        this.preUrl = this.imgUrl+ res.data.data.voucherUrl
        this.srcList = [
          this.preUrl,
          this.preUrl
        ]
        this.$refs.preview.showViewer = true;
      })
    },
    viewCredentials(row){
      if(!this.permissions.sys_online_receive_detail) {
        return this.messageBox()
      }else{
        this.payInfo = row;
        this.viewDialog = true;
      }
    },
    getList(operate){
      // 公共参数
      let params = {
        pageNo: this.page.currentPage,
	      pageSize: this.page.pageSize,
        claimStatus: this.filters.receiveStatus, // 认领状态 0：未认领 1：已认领
        keyWord: this.filters.keyWords, // 关键字
        belongId: Number(this.filters.orderBelongNo)!=0? this.filters.orderBelongNo[this.filters.orderBelongNo.length-1] : '', // 订单归属
        startTime:this.filters.receiveTime == null ? "" : this.$moment(this.filters.receiveTime[0]).format("YYYY-MM-DD")+' '+'00:00:00',// 开始时间
        endTime:this.filters.receiveTime == null ? "" : this.$moment(this.filters.receiveTime[1]).format("YYYY-MM-DD")+' '+'23:59:59', // 结束时间
        payChannel:this.filters.payWay, // 支付方式(0-支付宝，1-对公转账 2-微信)
      }
      // 产品订单独有
      if(this.filters.orderClass == 1){
        params.payType = this.filters.payType // 付款类型(1:定金；2:尾款；3:一口价)
        params.clueSalesmanEmpId = Number(this.filters.saleBelongNo)!=0? this.filters.saleBelongNo[this.filters.saleBelongNo.length-1] : '' // 业务员
        params.categoryId = this.filters.payDirection // 支付去向
      }
       // 需要缓存的参数
       let keepParams = {
        params: params,
        receiveTime: this.filters.receiveTime,
        orderBelongNo: this.filters.orderBelongNo,
        saleBelongNo: this.filters.saleBelongNo,
        receiveTime: this.filters.receiveTime,
        orderClass: this.filters.orderClass,
        senior: this.senior,
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getReceivePayRecords(this.filters.orderClass,params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          if(operate == 'export'){
            getPayExportProgress(params, this.filters.orderClass).then(res => {
              this.exportData(res)
            })
        }else{
          this.tableData = res.data.data.records;
          this.tableData.forEach(item=>{
            item.id = item.paymentId
          })
          this.page.total = res.data.data.total;
        }
        }
      })
      this.getWaitCount();
    },
    getWaitCount(){
      getUnclaimedCount(this.filters.orderClass).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.waitCount = res.data.data.waitClaimCount
        }
      })
    },
    // 导出数据
    exportData(res){
      let url = window.URL.createObjectURL(new Blob([res.data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      let num = '';
      for(let i = 0; i < 10; i++){
        num += Math.ceil(Math.random() * 10);
      }
      link.setAttribute('download', '回款明细支付记录数据_' + num + '.xlsx');
      document.body.appendChild(link)
      link.click()
    },
    currentChange(val){
      this.page.currentPage = val;
      this.getList();
    },
    sizeChange(val){
      this.page.pageSize = val;
      this.getList();
    }
  }
}
</script>

<style scoped>
.key-input-complex{
  width: 340px !important;
}
.receive-senior{
  margin-bottom: 10px;
}
.refund-success{
  color: #36a6fe;
  cursor: pointer;
}
.image_fix_sty{
  position: absolute;
  top: 0;
  z-index: 10000;
}
.el-image-viewer__close{
  background: rgb(238, 235, 235) !important;
}
.allot-receive-btn{
  text-align: center;
}
.online-receive-frame{
  margin: 0 10px;
  padding: 25px 40px 25px 25px;
  background: #FFFFFF;
}
.radio-item{
  margin-left: 20px;
  border-left: 1px solid #dcdfe6;
}
.date-sty{
  width:340px
}
.red-sty{
  color: red;
}
.direction-sty{
  width: 220px;
}
</style>
