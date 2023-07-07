<template>
  <div class="page">
    <div class="details">
        <div class="top-detail">
          <div class="processnumber">
            <img src="../../assets/images/process/liucheng_icon.png" style="width: 24px; height: 24px; position: relative; top: 5px" />
            <span style="margin-left: 8px; font-weight: 600; font-size:20px">流程编号：{{taskInfo.taskNo}}</span>
            <p>
              <span v-show="taskInfo.taskStatus == 0" class="circleBluec"></span>
              <span v-show="taskInfo.taskStatus == 1" class="successc"><b>✔</b></span>
              <span v-show="taskInfo.taskStatus == 2" class="circleRedc"></span>
              <span v-show="taskInfo.taskStatus == 6"><b class="err">X&nbsp;</b></span>
              <span>{{ taskInfo.taskStatus | filtertaskStatus }}</span>
            </p>
          </div>
        <div><h3>用户ID</h3><h3>用户名称</h3><h3>转账金额</h3><h3>联系人</h3><h3>注册手机号</h3><h3>发起人</h3><h3>发起时间</h3><h3 v-if="taskInfo.taskStatus=='1'">到账时间</h3></div>
        <div class="topinfo-p">
            <p>{{ taskInfo.userNo }}</p>
            <p>{{ taskInfo.userName }}</p>
            <p>{{ transferMoney }}</p>
            <p>{{snapshotInformation.contactName}}</p>
            <p>{{taskInfo.accountMobile}}</p>
            <p v-if="taskInfo.sponsorType=='1'">用户</p>
            <el-tooltip effect="dark" :content="'工号：'+empNo +'部门：'+ deptName" placement="top" v-else>
              <p class="empName" @mouseenter="showUserInfo(taskInfo.createBy)">{{taskInfo.sponsorName}}</p>
            </el-tooltip>
            <p>{{ snapshotInformation.createTime }}</p>
            <p v-if="taskInfo.taskStatus=='1'">{{ currentPriceInfo[0].payTime }}</p>
        </div>
        </div>
        <!-- 订单信息 -->
        <div v-if="orderArray && orderArray.length>0">
          <div class="list-header"><p class="rectangle"></p><b class="text">订单信息</b></div>
          <el-table :data="orderArray" :header-cell-style="{ background: '#FAFAFA',color:'#000000D9' }" border style="margin-bottom: 30px">
            <el-table-column prop="orderNo" label="订单编号" width="180"></el-table-column>
            <el-table-column prop="spuName" label="产品名称" width="180"></el-table-column>
            <el-table-column prop="buyNum" label="数量"></el-table-column>
            <el-table-column prop="agencyFee" label="代理费总价" v-if="feeInfo.agents || feeInfo.payType==3&&feeInfo.fees.agentFee">
              <template>
                <span>{{ feeInfo.payType==3?feeInfo.fees.agentFee:feeInfo.agents }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="thirdPartyFee" label="第三方费用总价" v-if="feeInfo.thirds || feeInfo.payType==3&&feeInfo.fees.thirdFee">
              <template>
                <span>{{ feeInfo.payType==3?feeInfo.fees.thirdFee:feeInfo.thirds }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="governmentFee" label="官费总价" v-if="feeInfo.officials!=0">
              <template>
                <span>{{ feeInfo.officials }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="订单总价">
              <template slot-scope="scope">
                <span>{{ scope.row.totalAmount}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="本次转账支付" v-if="feeInfo.payType != 3">
              <template>
                <div class="project-money">
                  <p v-if="feeInfo.fees.agentFee">
                    代理费：{{ feeInfo.fees.agentFee }}
                    <span>({{ feeInfo.payType==1 ? '定金':'尾款'}})</span>
                  </p>
                  <p v-if="feeInfo.fees.thirdFee">
                    第三方：{{ feeInfo.fees.thirdFee }}
                    <span>({{ feeInfo.payType==1 ? '定金':'尾款'}})</span>
                  </p>
                  <p v-if="feeInfo.fees.officialFee">官费：{{ feeInfo.fees.officialFee }}</p>
                  <b>合计：{{ Number(feeInfo.fees.agentFee || 0) + Number(feeInfo.fees.thirdFee || 0) + Number(feeInfo.fees.officialFee || 0)}}</b>
                </div>                
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="订单创建日期" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <!-- 转账凭证 -->
        <div class="margin-b30">
            <div class="list-header"><p class="rectangle"></p><b class="text">转账凭证</b></div>
            <div v-if="fileType=='pdf'" @click="viewPdf()" class="pdf-box">
              	<img src="@/assets/images/order/pdf.png" alt="">
              	<p v-if="url!=''" style="color:red; cursor:pointer; font-size:14px">点击查看转账凭证</p>
            </div>
            <div v-else class="demo-image__preview">
                <el-image style="width: 300px; height: 200px" :src="url" :preview-src-list="urlList" @click.stop="handleClickItem"></el-image>
                <p v-if="url!=''" style="color:red; margin:0; cursor:pointer; font-size:14px">点击图片可放大查看</p>
            </div>
        </div>
        <!-- 审核记录 -->
        <div class="process-record" v-if="recordData&&recordData.length>0">
          <div class="list-header"><p class="rectangle"></p><b class="text">审核记录</b></div>
          <div class="record-top">
            <el-timeline v-if="recordData.length > 0">
              <el-timeline-item v-for="(element, index) in recordData" :key="index" :color="index == 0 ? '#ff6600' : ''" placement="top" hide-timestamp>
                <p>{{ element.title }}</p>
                <p>操作人：{{element.createByName ? element.createByName : "暂无"}}</p>
                <p v-if="element.auditReason">原因：{{ element.auditReason }}</p>
                <p style="color: #999">{{ element.createTime }}</p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
         <!-- 待审核时显示操作按钮 -->
          <!-- v-if="snapshotInformation.taskStatus==0" -->
        <div class="button" v-if="taskInfo.taskStatus=='0' && (!isPersonal || loginInfo && isPersonal && taskInfo.taskCurrentEmpId == loginInfo.id )">
            <el-button type="success" size="medium" v-preventReClick @click="permissions.sys_transfer_audit || isPersonal ? handleBtn(0) : $notAuthorized()">审核通过</el-button>
            <el-button type="danger" size="medium" class="unpassed"  v-preventReClick @click="permissions.sys_transfer_audit || isPersonal ? handleBtn(1) : $notAuthorized()">审核不通过</el-button>
        </div>
        <el-dialog title="身份验证" :visible.sync="centerDialogVisible" :close-on-click-modal="false" center width="30%" @close='closeDialog'>      
          <el-form :model="dialogForm" :rules="rules" ref="dialogForm" class="demo-ruleForm" label-position="top" size="mini">            
            <el-form-item label="请输入到账时间" prop="toTime" v-if="handleStatus== 0">
              <el-date-picker v-model="dialogForm.toTime" :picker-options="setDateRange" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
			<el-form-item label="请选择回款去向" prop="receiverName" v-if="handleStatus== 0">
				<el-select v-model="dialogForm.receiverName" placeholder="请选择回款去向" style="width:70%">
					<el-option v-for="(option) in optionList" :label="option.constantValue" :key="option.id" :value="option.constantValue"></el-option>
				</el-select>
			</el-form-item>
            <el-form-item label="身份验证" prop="code">
              <div style="display: flex; width:75%">
                <el-input v-model="dialogForm.code" :disabled="inputAble" placeholder="请输入验证码"></el-input>
                <el-button class="achievecode" :class="{ ccc: codeDisabled == true }" :disabled="codeDisabled" @click="getCode">{{ btnCode }}</el-button>
              </div>
              <div style="margin-top: 15px; color: #333333a1">
                请输入尾号为{{ showMobile }}的手机号收到的验证码
              </div>
            </el-form-item>
            <el-form-item label="请输入不通过原因" prop="failedReason" v-if="handleStatus == 1">
              <p class="failed-txt">该原因将自动反馈给用户，请注意规范用语谨慎填写。</p>
              <el-input type="textarea" :rows="4" placeholder="请输入内容" maxlength="50" show-word-limit v-model.trim="dialogForm.failedReason"></el-input>
            </el-form-item>
            <el-form-item label="审批备注" prop="remarks" v-if="handleStatus == 0">
              <el-input type="textarea" :rows="4" placeholder="请输入内容" maxlength="50" show-word-limit v-model.trim="dialogForm.remarks"></el-input>
            </el-form-item>
          </el-form>  
          <span slot="footer" class="dialog-footer">
            <!-- :disabled="!dialogForm.code" -->
            <el-button type="primary" @click="handleSubmit(handleStatus)"  v-preventReClick>确 定</el-button>
            <el-button @click="centerDialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDetailByTaskIdofMy, getTransferCode, auditOfflineSuccess, postTransferFail, Ispermission,constantcatagory,transferAuditLog } from "@/api/processmanage/list";
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            snapshotInformation: {},  
            taskInfo:{},
            recordData: null,
            orderArray: [],
            num:0,
            btnCode: "获取验证码",
            codeDisabled: false,
            code: null,            
            handleStatus:null,
            showMobile:'',
            encodeTaskNo:'',
            centerDialogVisible:false,
            inputAble:true,
            taskNo:'LC20211014001',
            url:'',
            urlList:[],
            loginInfo: null,
			      optionList:[],
            isPersonal: this.$route.query.source == 'personal',
            fileType:null,
            baseUrl:process.env.VUE_APP_IMAGE_BASEURL,   
            dialogForm:{
              code:'',
              failedReason:'',
              remarks:'',
            },
            rules:{
              toTime:[
                { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
              ],
              code:[{ required: true, message: '请输入验证码', trigger: 'blur' }],
              failedReason:[{ required: true, message: '请输入不通过原因', trigger: 'blur' }],
			      receiverName:[{required: true, message: '请选择回款去向', trigger: 'change'}]
            },
            para:{},
            feeInfo:{},
            currentPriceInfo:[],
            setDateRange: {
              disabledDate: time => {
                // 禁用今天之后的日期【当前天可选】
                return time.getTime() > Date.now();
              }
            },
        };
    },
    computed:{
      transferMoney(){
        return this.taskInfo.amount
      },
      ...mapGetters(['permissions'])
    },
    methods: {
        //预览pdf文件
        viewPdf(){
          	window.open( this.url, "_blank");
        },
        getDetail() {          
          console.log(this.loginInfo);
            getDetailByTaskIdofMy(this.$route.query.id).then((res) => {
                let data = res.data.data
                this.snapshotInformation = data.priceInfo.data;    
                this.currentPriceInfo = data.currentPriceInfo;    
                this.filterPrice();
                this.taskInfo = data.taskInfo;    
                if(this.taskInfo.voucherUrl!=null){
                    this.url = this.baseUrl + this.taskInfo.voucherUrl;
                    this.urlList.push(this.baseUrl + this.taskInfo.voucherUrl);
                    this.fileType = this.taskInfo.voucherUrl.substring(this.taskInfo.voucherUrl.length-3);                  
                }
                this.orderArray = [this.snapshotInformation]
                this.showMobile = this.taskInfo.taskCurrentEmpMobile.substring(this.taskInfo.taskCurrentEmpMobile.length-4);                  
            });
            let para = {
                type: 2,
                taskId: this.$route.query.id
            }
            transferAuditLog(para).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                  this.recordData = Object.values(res.data.data).map(item => Object.values(item)[0])
                }
                console.log(this.recordData);
            })
        },
        //过滤价格列表
        filterPrice(){
            let fee = this.snapshotInformation.orderFeeVoList;
            let agents =  fee.filter(idx => idx.costType == 1);
            let num = this.snapshotInformation.buyNum;
            this.feeInfo.agents = agents.length==0 ? 0:agents.length==1?agents[0].price*num:agents.reduce((n,m) => n.price + m.price)*num;//代理费总计
            let thirds =  fee.filter(idx => idx.costType == 2);
            this.feeInfo.thirds = thirds.length==0 ? 0:thirds.length==1?thirds[0].price*num:thirds.reduce((n,m) => n.price + m.price)*num;//第三方费用总计          
            let officials =  fee.filter(idx => idx.costType == 3);
            this.feeInfo.officials = officials.length==0 ? 0 : officials[0].price*num
            let type = this.currentPriceInfo[0].payType;
            this.feeInfo.payType = type;//判断订单支付类型定金或一口价
            this.filterFeeType(this.currentPriceInfo);   
        },
        // 过滤定金尾款费用
        filterFeeType(data){
            let types = {};
            data.forEach(i => {
              if(i.costType==1){ //代理费
                types.agentFee = i.price * i.buyNum
              }
              if(i.costType==2){ //第三方费用
                types.thirdFee = i.price * i.buyNum
              }
              if(i.costType==3){ //官费费用
                types.officialFee = i.price * i.buyNum
              }
            });
            this.feeInfo.fees = types;
            console.log(this.feeInfo);
        },
        handleClickItem(){
            // 获取遮罩层dom
            setTimeout(function(){
              let domImageMask = document.querySelector(".el-image-viewer__wrapper");
              if (!domImageMask) {
                return;
              }
              domImageMask.addEventListener("click", (e) => {
                if(e.target.parentNode.className == 'el-image-viewer__actions__inner') {
                return;  //如果点击底部菜单，不关闭
                }
                // 点击遮罩层时调用关闭按钮的 click 事件
                document.querySelector(".el-image-viewer__close").click();
              });
            },300)
        },
        //操作按钮
        handleBtn(val){     
            if(val == 0){
              constantcatagory().then((res)=>{
                if(res.data.code == CodeMsg.CODE_0){
                  this.optionList = res.data.data[0].constants
                }
              })
            }       
            Ispermission().then((res)=>{
              if(res.data.code == CodeMsg.CODE_0){
                this.dialogForm.code = null;
                this.handleStatus = val;
                this.centerDialogVisible= true;
              }
            });
        },
        closeDialog(){
          this.inputAble = true;
          this.btnCode = "获取验证码";
          this.codeDisabled = false;
          this.num = 0;
          this.resetForm('dialogForm')
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        getCode(){
            let para = {
                dealId: this.taskInfo.taskCurrentEmpId,
                taskNo: this.taskInfo.taskNo,
            }
            getTransferCode(para).then((res) =>{
                if(res.data.code == CodeMsg.CODE_0){
                    this.inputAble = false;
                    this.encodeTaskNo = res.data.data;
                    this.$message({
                        message: "发送成功，5分钟内有效！",
                        type: "success",
                    });
                    this.num = 60;
                    this.timer();
                } else {
                    this.$message({
                        message: res.data.msg + "，请稍后重试!",
                        type: "warning",
                    });
                }
            })            
        },
        timer() {
            if (this.num > 0) {
                this.codeDisabled = true;
                this.btnCode = this.num + "s后重试";
                this.num--;
                setTimeout(() => {
                    this.timer();
                }, 1000);
            } else {
                this.btnCode = "获取验证码";
                this.num = 60;
                this.codeDisabled = false;
            }
        },
        handleSubmit(val){
            this.para = {
                code: this.dialogForm.code,
                taskId: this.$route.query.id
            }
            let handle = val==0 ? true : false;
             handle ? this.transferPass() : this.transferFaild()
        },       
        // 审核通过 
        transferPass(){
          this.$set(this.para, 'payTime', this.$moment(this.dialogForm.toTime).format('YYYY-MM-DD HH:mm:ss'));
          this.$set(this.para, 'auditMessage', this.dialogForm.remarks)
          this.$set(this.para, 'receiveDirectionName', this.dialogForm.receiverName)
          this.$set(this.para, 'taskId', this.taskInfo.taskId)
          auditOfflineSuccess(this.para).then((res)=>{
              if(res.data.code == CodeMsg.CODE_0){
                  this.$message({
                      message: "审核通过！",
                      type: "success",
                  });
                  this.centerDialogVisible = false;
                  this.getDetail();                        
                  this.resetForm('dialogForm')
              } else {
                  this.$message({
                      message: res.data.msg,
                      type: "warning",
                  });
              }
          })
        },
        // 审核不通过
        transferFaild(){
          this.$set(this.para, 'auditMessage', this.dialogForm.failedReason)
          postTransferFail(this.para).then((res)=>{
              if(res.data.code == CodeMsg.CODE_0){
                  this.$message({
                      message: "提交成功！",
                      type: "success",
                  });
                  this.centerDialogVisible = false;
                  this.getDetail();
                  this.resetForm('dialogForm')
              } else if(res.data.code == 1){
                  this.$message({
                      message: "验证码错误，请核实后重试!",
                      type: "warning",
                  });
              }
          })
        },
    },
    filters: {
        filtertaskStatus(val) {
            if (val == "0") {
                return "待审核"
            } else if (val == "1") {
                return "已通过"
            } else if (val == "2") {
                return "未通过"
            } else if(val== '6') {
                return "已作废"
            }
        },
        filterauditStatus(val) {
            if (val == "0") {
                return "提交审核"
            } else if (val == "1") {
                return "审核通过"
            } else if (val == "2") {
                return "审核不通过"
            } else if(val == '6'){
                return "已作废"
            }else if(val =='7'){
                return '修改发票'
            }
        },
        filterPrice(val) {
            if (val) {
                return (val / 100).toFixed(2)
            } else {
                return "暂无"
            }
        },
        filterText(val) {
            if (val == "0") {
                return "备注："
            } else if (val == "1") {
                return "审核意见："
            } else if (val == "2") {
                return "审核意见："
            } else if(val == '6'){
                return "作废原因："
            }else if(val =='7'){
                return '修改发票信息，修改原因：'
            }
        },
    },
    mounted() {
        if (process.env.NODE_ENV === "production") {
            this.fileUrl = "//static.wotao.com/"
        } else {
            this.fileUrl = "//static-tst.wotao.com/"
        };  
        this.loginInfo = JSON.parse(sessionStorage.getItem('pigx-userInfo')).content;
        this.getDetail()
    },
};
</script>
<style scoped>
.page {
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 20px 100px 20px 30px;
}
.details {
  min-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
}
.project-money p{
  margin: 0;
}
.top-detail {
  padding-bottom: 20px;
}
.processnumber {
  margin-top: 10px;
}
.processnumber p{
    margin:0 0 0 20px;
    font-size: 16px;
    color: #666;
}
.pdf-box{
	cursor: pointer;
}
.pdf-box img{
	width: 80px;
}
.pdf-box p{
	margin-top: 10px;
}
.table {
  margin-left: 20px;
  width: 100%;
}
.top-detail div {
  font-size: 14px;
  text-align: left;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
}
.top-detail div:nth-child(2){
  margin-top: 30px;
}
.top-detail div:last-child{
  margin-top: 12px;
}
.topinfo-p p {
  font-size: 14px;
  color: #666;
  flex: 1;
  /* text-align: center; */
  margin: 0;

}
.top-detail h3 {
  flex: 1;
  margin: 0;
}
.list-header {
  display: flex;
  margin: 0 0;
}
.rectangle {
  width: 5px;
  height: 15px;
  background: #0aa1ed;
  border-radius: 3px;
  padding: 0;
}
.text {
  font-size: 14px;
  padding: 10px 10px;
  margin: 3px 0;
}
.margin-b30{
    margin-bottom: 30px;
}
.record-top {
  margin-top: 10px;
}
.record-top >>> .el-timeline-item__tail {
  position: absolute;
  left: 4px;
  height: 115%;
  border-left: 2px solid #e4e7ed;
}
.button {
  margin: 40px 0;
  text-align: center;
}
.ccc {
  color: #d1d1d1 !important;
}
.failed-reason{
    margin-bottom: 30px;
}
.failed-tit{
    color: #333;
    font-weight: 600;
    margin: 0;
}
.failed-tit span{
    color: red !important;
}
.failed-txt{
    color: #999;
    margin: -16px 0 10px 12px !important;
}
.circleBluec {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  position: relative;
  background: #36a6fe;
  top: -2px;
  margin-right: 4px;
}
.circleRedc {
  width: 6px;
  height: 6px;
  position: relative;
  display: inline-block;
  border-radius: 50%;
  margin-right: 4px;
  top: -2px;
  background: red;
}
.successc {
  font-weight: bolder;
  font-size: 12px;
  color: green;
  margin-right: 4px;
}
.err{
    color: red;
    font-size: 16px;
    position: relative;
    top: 1px;
}
</style>
