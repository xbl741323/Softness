<!-- 排查完成-回款明细 -->
<template>
  <basic-container>
    <div class="receivable-list-sty" v-if="permissions.sys_receive_claim || permissions.sys_receive_edit">
      <div class="receiva-status">
        <span class="receive-status">领取状态：</span>
        <el-radio-group v-model="filters.receiveStatus" @change="getAllList()" size="medium">
          <el-radio-button class="radio-sty" :class="[index !=0?'radio-sty-left':'']"
            v-for="(item,index) in reveiveStatusList"
            :key="index"
            :label="item.val">
            <span v-if="item.val==0">{{item.title}}({{item.count}})</span>
            <span v-else>{{item.title}}</span>
          </el-radio-button>
        </el-radio-group>
      </div>
      <el-form @keyup.enter.native="getAllList()" :model="filters" inline label-width="90px">
        <el-form-item label="关键字：">
          <el-input v-model="filters.keyWords" placeholder="请输入付款方名称/客户名称/回款去向关键字/回款编号" class="receive-keywords" />
        </el-form-item>
        <el-form-item label="领取人：">
          <el-cascader ref="claimNo" filterable :before-filter="beforeFilter" :show-all-levels='false' clearable :options="empList" v-model="filters.claimNo" :props="{value: 'customerId',label: 'label'}" >
            <template slot-scope="{data}">
              <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                <div slot="content">{{data.customerNo}}</div>
                <span>{{data.label}}</span>
              </el-tooltip>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="回款时间：">
          <el-date-picker
            v-model="filters.receiveTime"
            type="daterange"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="receive-time">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="getAllList()">搜索</el-button>
        <el-button type="warning" @click="resetList()">重置</el-button>
        <el-button type="primary" @click="permissions.sys_receive_edit ? getList('export') : $notAuthorized()">导出</el-button>
      </el-form>
      <div class="receive-contain"> 
        <!-- 录入回款区域 -->
        <div class="receive-btn">
          <el-button class="entry" type="success" icon="el-icon-plus" @click="permissions.sys_receive_edit ? entryFee('post') : $notAuthorized()">录入回款</el-button>
          <el-button class="batch_entry" type="success" icon="el-icon-plus" @click="permissions.sys_receive_edit ? batchEntryFee('post') : $notAuthorized()">批量录入回款</el-button>
          <a class="clue-templete" :href="downloadUrl+'assets/crm/cdn/temple/批量录入回款模板.xlsx'" v-if="permissions.sys_receive_edit">批量录入回款模板.xlsx</a>
        </div>
        <!-- 统计区域 -->
        <div class="receive-count">
          共计{{page.total}}条，  总计回款：<span class="red-sty">{{receiveCountInfo.receiveAmount}}元</span>（代理费：<span class="red-sty">{{receiveCountInfo.agencyFee}}元</span>&nbsp;第三方费用：<span class="red-sty">{{receiveCountInfo.thirdPartyFee}}元</span>&nbsp;官费：<span class="red-sty">{{receiveCountInfo.governmentFee}}元</span>）
        </div>
      </div>
      <avue-crud
        :option="receivTableOption"
        :data="feeListData"
        :page.sync="page"
        @size-change="sizeChange"
        @current-change="currentChange">
        <template slot="receiveAmount" slot-scope="scope">
          <span>{{scope.row.receiveAmount }}</span>
        </template>
        <template slot="tradeNo" slot-scope="scope">
          <div v-if="scope.row.trReceivePaymentList!=null&&scope.row.trReceivePaymentList.length>0">
            <div v-for="(item,index) in scope.row.trReceivePaymentList" :key="index" class="over-sty">
              <el-tooltip effect="dark" :content="item.tradeNo" placement="top">
                 <span>{{item.tradeNo}}</span>
              </el-tooltip>
            </div>
          </div>
          <div v-else>/</div>
        </template>
        <template slot="contractNo" slot-scope="scope">
          <div v-if="scope.row.trReceivePaymentList!=null&&scope.row.trReceivePaymentList.length>0">
            <div v-for="(item,index) in scope.row.trReceivePaymentList" :key="index" class="over-sty">
              <el-tooltip effect="dark" :content="item.contractNo" placement="top">
                 <span>{{item.contractNo}}</span>
              </el-tooltip>
            </div>
          </div>
          <div v-else>/</div>
        </template>
        <template slot="orderNo" slot-scope="scope">
          <div v-if="scope.row.trReceivePaymentList!=null&&scope.row.trReceivePaymentList.length>0">
            <div v-for="(item,index) in scope.row.trReceivePaymentList" :key="index" class="over-sty">
              <el-tooltip effect="dark" :content="item.orderNo" placement="top">
                 <span>{{item.orderNo}}</span>
              </el-tooltip>
            </div>
          </div>
          <div v-else>/</div>
        </template>
        <template slot="agencyFee" slot-scope="scope">
          <div v-if="scope.row.trReceivePaymentList!=null&&scope.row.trReceivePaymentList.length>0">
            <div v-for="(item,index) in scope.row.trReceivePaymentList" :key="index">
              {{item.agencyFee}}
            </div>
          </div>
          <div v-else>/</div>
        </template>
        <template slot="thirdFee" slot-scope="scope">
          <div v-if="scope.row.trReceivePaymentList!=null&&scope.row.trReceivePaymentList.length>0">
            <div v-for="(item,index) in scope.row.trReceivePaymentList" :key="index">
              {{item.thirdPartyFee}}
            </div>
          </div>
          <div v-else>/</div>
        </template>
        <template slot="officialFee" slot-scope="scope">
          <div v-if="scope.row.trReceivePaymentList!=null&&scope.row.trReceivePaymentList.length>0">
            <div v-for="(item,index) in scope.row.trReceivePaymentList" :key="index">
              {{item.governmentFee}}
            </div>
          </div>
          <div v-else>/</div>
        </template>
        <template slot="receiveStatus" slot-scope="scope">
          <span :class="[scope.row.receiveStatus == 0?'red-sty':'']">{{scope.row.receiveStatus|filterReceiveStatus }}</span>
        </template>
        <template slot="claimName" slot-scope="scope">
          <div v-if="Number(scope.row.claimName)!=0">
            <el-tooltip effect="dark" :content="'工号：'+ scope.row.claimNo +'   部门：'+ scope.row.claimDeptName" placement="top">
              <span :class="[scope.row.receiveStatus==0?'claim-sty':'']">{{scope.row.claimName}}</span>
            </el-tooltip>
          </div>
          <div class="claim-sty" v-else-if="scope.row.receiveStatus==0">待认领</div>      
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" v-if="scope.row.receiveStatus == 0" @click="permissions.sys_receive_edit ? entryFee('put',scope.row) : $notAuthorized()">编辑</el-button>
          <el-button type="text" v-if="scope.row.receiveStatus == 0" @click="permissions.sys_receive_claim ? receiveFee(scope.row) : $notAuthorized()">认领回款</el-button>
          <el-button type="text" slot="reference" v-if="scope.row.receiveStatus == 1" @click="permissions.sys_receive_cancel ? cancelConfirm(scope.row) : $notAuthorized()">撤销认领</el-button>
          <el-button type="text" slot="reference" class="del-sty" v-if="scope.row.receiveStatus != 1" @click="permissions.sys_receive_edit ? delReceiveConfirm(scope.row.id) : $notAuthorized()">删除</el-button>
          <el-button type="text" slot="reference" v-if="scope.row.operateCount>1" @click="showClaimRecord(scope.row)">认领记录</el-button>

        </template>
      </avue-crud>

      <!-- 数据导出 -->
      <el-dialog title="数据导出中，请稍后..." :visible.sync="exportDialog" width="450px" top="350px" :close-on-click-modal= "false">
        <el-progress :text-inside="true" :stroke-width="24" :percentage="percent" status="success"></el-progress>
      </el-dialog>

      <!-- 录入回款 -->
      <el-dialog :visible.sync="entryFeeDialog" :close-on-click-modal='false' :before-close="closeDialog" :title="commitType =='post' ? '录入回款': '编辑回款'" width="1000px">
        <entry-receive v-if="entryFeeDialog" @closeFeeDialog="closeFeeDialog" :commitType="commitType" :receiveInfo="receiveInfo" />
      </el-dialog>

      <!-- 批量录入回款 -->
      <el-dialog
      v-loading="loading"
      element-loading-text="上传中，请稍等！"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :close-on-click-modal="false"
      :visible.sync="batchEntryFeeDialog" title="批量录入回款" v-if="batchEntryFeeDialog">
        <p><span style="font-weight:550">注意</span>：1.请先下载按钮右侧的“批量录入回款模板”，然后使用模板进行数据上传，否则数据会上传失败；</p>
        <p style="margin-left:40px">2.回款时间格式："20210820" ，请按此格式填写具体时间</p>
        <file-upload class="upload_fee" :limit=1 :acceptType="'.xlsx'" :multipleFile=false @fileList="getFileList" />
        <div class="batch_btn">
          <el-button type="primary" @click="checkUpload()" v-preventReClick>确定</el-button>
          <el-button type="warning" @click="cancelBatchEntry()">取消</el-button>
        </div>
      </el-dialog>
      
      <!-- 失败信息提示 -->
      <el-dialog :visible.sync="errorDialog" title="失败信息提示">
        <p>{{errorMsg.failCount}}条回款录入失败，其余回款已录入，请下载报错文件查看具体原因</p>
        <a :href="downloadUrl+errorMsg.failFileUrl" class="error_file">批量录入回款（报错文件）.excel</a>
        <div class="batch_btn">
          <el-button type="primary" @click="downloadErrorFile(downloadUrl+errorMsg.failFileUrl)" v-preventReClick>下载报错文件</el-button>
          <el-button type="warning" @click="cancelViewError()">取消</el-button>
        </div>
      </el-dialog>

      <!-- 认领第一步 -->
      <el-dialog :visible.sync="receiveFeeDialog" :close-on-click-modal='false' title="认领回款" width="1100px">
        <get-receivable :feeInfo="feeInfo" @nextStep="nextStep" :clueId="clueId" :customerName="customerName" @cancel="cancel" v-if="receiveFeeDialog" />
      </el-dialog>

      <!-- 认领第二步 -->
      <el-dialog :visible.sync="confirmOrderDialog" :close-on-click-modal='false' title="认领回款" width="1100px">
        <confirm-receivable-order :clueType="clueType" :clueId='clueId' :feeInfo="feeInfo" :customerName="customerName" :receiveAmount="receiveAmount" @closeConfirmDialog="closeConfirmDialog" @lastStep="lastStep" @cancel="cancel" v-if="confirmOrderDialog" />
      </el-dialog>  

      <!-- 认领记录 -->
      <el-dialog
        title="认领记录"
        :visible.sync="claimRecordVisible"
        width="32%"
        center>
          <el-table :data="tableData" border style="width: 100%" align="center">
            <el-table-column prop="createTime" label="操作时间" width="200" align="center"></el-table-column>
            <el-table-column prop="type" label="操作类型" width="180" align="center">
              <template slot-scope="scope">
                 {{scope.row.type | claimType}}
              </template>
            </el-table-column>
            <el-table-column prop="claimName" label="操作人"  align="center">
              <template slot-scope="scope">
                 <span v-if="scope.row.type==1">{{scope.row.claimName}}</span>
                 <span v-else>{{scope.row.cancelName}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="btn-sty">
            <el-button @click="claimRecordVisible = false">关闭</el-button>
          </div>
      </el-dialog>

    </div>
  </basic-container>
</template>

<script>
import receiveData from './js/receivable.js'
import dropList from '@/util/department.js'
import { receivTableOption } from '@/const/crud/receivable/list.js'
import EntryReceive from '@/components/receive/entry-receive'
import GetReceivable from '@/components/receive/get-receivable'
import confirmReceivableOrder from '@/components/receive/confirm-receivable-order'
import refundApply from '@/components/refund/refund-apply.vue'
import RefundDetail from '@/components/refund/refund-detail.vue'
import invoicingApply from '@/components/invoicing/invoicing-apply.vue'
import orderInvoicingDetail from '@/components/invoicing/order-invoicing-detail.vue' 
import FileUpload from '@/components/file/file-upload.vue'
import { uploadBatchFile, deleteReceive,getExportProgress, getClaimRecord } from '@/api/receive/receive-api.js'
import * as CodeMsg from "@/api/common/CodeChange"
import { mapGetters } from "vuex"
import { getReceiveList, getReceiveStatistics, cancelReceive, getReceiveDetailStatistics } from "@/api/receive/receive"
export default {
  computed: {
    ...mapGetters(['permissions'])
  },
  components:{
    EntryReceive,
    GetReceivable,
    confirmReceivableOrder,
    refundApply,
    RefundDetail,
    invoicingApply,
    orderInvoicingDetail,
    FileUpload
  },
  data(){
    return {
      loading: false,
      filters: {
        receiveStatus: null, // 领取状态 0-未领取，1-已领取
        keyWords:'', // 关键字
        claimNo:'', // 领取人id
        receiveTime: null // 回款时间
      },
      receiveCountInfo:{
        receiveAmount:0,
        agencyFee:0,
        thirdPartyFee:0,
        governmentFee:0,
      }, // 回款统计对象
      downloadUrl: process.env.VUE_APP_IMAGE_BASEURL,
      reveiveStatusList: [
        {
          title:'全部',
          val: null,
        },
        {
          title:'待认领',
          val:0,
          count: 0
        },
        {
          title:'已认领',
          val:1,
        }
      ],
      empList: [],
      page:{
        total: 0,
        pageSize: 20,
        currentPage: 1,
        pageSizes: [3, 5, 10, 20, 50]
      },
      receivTableOption: receivTableOption,
      feeListData: [],
      entryFeeDialog: false,
      batchEntryFeeDialog: false,
      errorDialog: false,
      receiveFeeDialog: false, // 认领回款第一步
      confirmOrderDialog: false, // 认领回款第二步
      commitType: 'post',
      receiveInfo: {},
      feeInfo: {},
      clueId: 0,//初始化一个线索id
      receiveAmount: 0,//回款金额
      customerName:'',
      clueType:'',
      filesList:[],
      errorMsg: {},
      exportDialog: false,
      percent: 0,
      claimRecordVisible: false,
      tableData: []
    }
  },
  filters:{
    receiveAmount(val,receiveStatus,contractNo){
      return receiveData.receiveAmount(val,receiveStatus,contractNo);
    },
    amountType(val){
      return receiveData.offlineAmountType(val);
    },
    refundAmount(val){
      return receiveData.refundAmount(val);
    },
    filterReceiveStatus(val){
      return val == 0? '待认领' : val == 1? '已认领':''
    },
    claimType(val){
      return val == 1? '认领' : val == 2? '撤销认领':''
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created(){
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      this.filters.receiveStatus = keepParams.params.receiveStatus;
      this.page.currentPage = keepParams.params.pageNo;
      this.page.pageSize = keepParams.params.pageSize;
      this.filters.keyWords = keepParams.params.keyWords;
      this.filters.receiveTime = keepParams.receiveTime;
      this.filters.claimNo = keepParams.claimNo;
    }
  },
  mounted(){
    this.getDropData();
    this.setDefaultTime();
    this.getList();
  },
  methods:{
    // 显示认领记录
    showClaimRecord(row){
      getClaimRecord({receiveId: row.id}).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          this.tableData = res.data.data
        }
      })
      this.claimRecordVisible = true
    },
    setDefaultTime(){
      let startTime = this.$moment(new Date()).startOf('month').format("YYYY-MM-DD")
      let endTime = this.$moment(new Date()).endOf('month').format("YYYY-MM-DD")
      this.filters.receiveTime = [startTime,endTime]
    },
    delReceiveConfirm(id){
      this.$confirm('确定删除该回款么？',{
          type:'warning',
          cancelButtonClass: 'btn-custom-cancel',
        }).then(()=>{
          this.delReceive(id)
      })
    },
    // 删除回款明细
    delReceive(id){
      deleteReceive({id: id}).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message:'删除成功！',
            offset:300
          })
          this.getList();
        }
      })
    },
    // 撤销回款操作
    cancelConfirm(row){
      this.$confirm('确定撤销该回款么？',{
          type:'warning',
          cancelButtonClass: 'btn-custom-cancel',
        }).then(()=>{
          this.calcelOperate(row)
      })
    },
    // 撤销回款操作
    calcelOperate(row){
      let params = new FormData()
      params.append('receiveId',row.id)
      cancelReceive(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
           this.$message({
            type:'success',
            message:'撤销成功！',
            offset:300
           })
           this.getList()
        }
      })
    },
    // 获取员工数据
    getDropData(){
      dropList.getDropList(true).then(res=>{
       this.empList = res;
    });
    },
    // 显示工号
    async beforeFilter() {
      await dropList.getDropList(true).then(res=>{
        this.empList = res;
      });
      this.$loop(this.empList[0], this.empList[0])
      return false
    },
    // 取消失败信息提示
    cancelViewError(){
      this.errorMsg = {},
      this.errorDialog = false;
    },
    downloadErrorFile(fileUrl){
      window.open(fileUrl,'_self');
    },
    checkUpload(){
      if(this.filesList.length == 0){
        this.$message({
          type:'warning',
          message: '请上传文件！'
        })
      }else{
        this.comfirmBatchEntry()
      }
    },
    comfirmBatchEntry(){
      this.loading = true;
      let param = new FormData();
      param.append('file',this.filesList[0].raw);
      uploadBatchFile(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message:'批量录入回款成功！',
            offset:300
          })
          this.getAllList()
        }else if(res.data.code ==CodeMsg.CODE_1){
          this.errorMsg = res.data.data;
          this.batchEntryFeeDialog = false;
          this.errorDialog = true;
        }
        this.loading = false;
        this.batchEntryFeeDialog = false;
      })
    },
    // 取消批量录入
    cancelBatchEntry(){
      this.batchEntryFeeDialog = false;
      this.filesList = [];
    },
    getFileList(row){
      this.filesList = row; 
      console.log(row);
    },
    cancel(val){
      this.receiveFeeDialog = val;
      this.confirmOrderDialog = val;
      this.getList();
    },
    lastStep(row){
      this.confirmOrderDialog = false;
      this.feeInfo = row.feeInfo;
      this.receiveFeeDialog = true;
    },
    closeConfirmDialog(val){
      this.confirmOrderDialog = val;
      this.getList();
    },
    nextStep(val){
      if(val){
        this.receiveFeeDialog = false;
        this.clueId = val.clueId;
        this.feeId = val.id;
        this.feeInfo = val.feeInfo;
        this.customerName = val.customerName;
        this.receiveAmount = val.receiveAmount;
        this.clueType = Number(val.clueType)
        this.confirmOrderDialog = true;
      }
    },
    receiveFee(row){
      this.customerName = null;
      this.receiveFeeDialog = true;
      this.feeInfo = row;
    },
    getAllList(){
      this.page.currentPage = 1, 
      this.getList()
    },
    // 重置
    resetList(){
      this.filters.keyWords = ''
      this.filters.claimNo = ''
      this.setDefaultTime()
      this.getList();
    },
    // 关闭录入回款弹窗
    closeDialog(done){ 
      this.entryFeeDialog = false;
      this.getList();
      done()
    },
    closeFeeDialog(val){
      this.entryFeeDialog = val;
      this.getList();
    },
    entryFee(commitType,row){
      this.entryFeeDialog = true;
      this.commitType = commitType
      this.receiveInfo = row;
    },
    batchEntryFee(){
      this.filesList = []
      this.batchEntryFeeDialog = true;
    },
    // 获取回款明细列表
    getList(operate){
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        receiveStatus: this.filters.receiveStatus, // 领取状态 0-未领取，1-已领取
        keyWords: this.filters.keyWords,
        claimId: Number(this.filters.claimNo)!=0? this.filters.claimNo[this.filters.claimNo.length-1] : '', // 领取人
        startReceiveTime:this.filters.receiveTime == null ? "" : this.$moment(this.filters.receiveTime[0]).format("YYYY-MM-DD")+' '+'00:00:00',// 开始时间
        endReceiveTime:this.filters.receiveTime == null ? "" : this.$moment(this.filters.receiveTime[1]).format("YYYY-MM-DD")+' '+'23:59:59', // 结束时间
      }
      // 需要缓存的参数
      let keepParams = {
        params: params,
        receiveTime: this.filters.receiveTime,
        claimNo: this.filters.claimNo
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getReceiveList(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          if(operate){
            getExportProgress(params).then(res => {
              this.exportData(res)
            })
          }else{
            this.feeListData = res.data.data.records;
            this.page.total = res.data.data.total;
          };
        }
      });
      this.getStatistics(params);
      this.getStatisticsCount()
    },
    // 获取回款明细待认领数量统计数据
    getStatisticsCount(){
      getReceiveDetailStatistics().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          let r = res.data.data
          this.reveiveStatusList[1].count = r[0].count
        }
      })
    },
    // 获取回款明细统计数据
    getStatistics(params){
      getReceiveStatistics(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0&&res.data.data!=null){
          this.receiveCountInfo = res.data.data
        }else{
          this.receiveCountInfo = {
            receiveAmount:0,
            agencyFee:0,
            thirdPartyFee:0,
            governmentFee:0,
          }
        }
      })
    },
    exportData(res){
      let url = window.URL.createObjectURL(new Blob([res.data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      let num = '';
      for(let i = 0; i < 10; i++){
        num += Math.ceil(Math.random() * 10);
      }
      link.setAttribute('download', '回款明细数据_' + num + '.xlsx');
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
.receivable-list-sty{
  padding: 10px;
  background: #FFF;
  height: 100%;
  font-size: 14px;
}
.receiva-status{
  margin: 10px 0;
}
.claim-list{
  margin: 0;
  color: #999;
}
.receive-keywords{
  width: 340px;
}
.radio-sty {  
  margin-left: 12px;
}
.radio-sty-left {   
  border-left: 1px solid #dcdfe6;
}
.receive-time{
  width: 270px;
}
.entry{
  margin: 10px 0;
}
.receive-status{
  margin-left: 8px;
}
.refund_amount{
  background: #ffcc9970;
  border-color: #ffcc99;
  color: #ff6600;
  z-index: 999;
  padding: 3px;
  border-radius: 5px;
  margin-left: 2px;
}
.batch_entry{
  margin: 0 10px;
}
.upload_fee{
  margin-left: 40px;
}
.batch_btn{
  margin: 10px 0;
  text-align: center;
}
.error_file{
  color: #3960e2;
}
.clue-templete{
  color: #3960e2;
  font-size: 12px;
}
.receive-contain{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.receive-btn{
  flex: 1;
}
.receive-count{
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-top: 15px;
}
.red-sty{
  color: red;
}
.claim-sty{
  color: rgb(180, 179, 179) !important;
}
.del-sty{
  color: red;
  margin-left:10px;
}
.over-sty{
  width: 90px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn-sty {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
}
</style>