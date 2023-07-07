<template>
    <div>
        <div class="button" v-if="financeSuccess">
          <el-button v-if="isYou && showFirstHandle" type="success" @click="handleAudit(1)">同意退款</el-button>
          <el-button type="success" v-if="isYou && refundInfo.remainingAmount>0 || isYou && unKnow" @click="confirmRefundStatus()">继续处理退款</el-button>
          <el-button v-if="isYou && showSecondHandle" type="success" @click="handleAudit(1)">已同意，请处理退款</el-button>
          <el-button v-if="isYou && showFirstHandle || isYou && showSecondHandle" type="warning" @click="handleAudit(2)">拒绝退款</el-button>
        </div>
        <!-- 选择订单关联的任务弹框 -->
        <el-dialog title="选择订单关联的任务" :visible.sync="handleTaskBox">
            <p>根据退款信息，请选择{{handlers.refundNum}}个关联任务</p>
            <el-table border :data="handlers.taskData" @selection-change="handleSelectionChange" :row-key="(row)=>{return row.taskId}">
                    <el-table-column type="selection" width="40" :selectable="selectAble" :reserve-selection="true"></el-table-column>
                    <el-table-column label="任务编号" prop="taskNo" show-overflow-tooltip ></el-table-column>
                    <el-table-column label="工程师" >
                        <template slot-scope="scope">
                            <div v-for="(item,index) in scope.row.trTaskEngineerList" :key="index">
                                <el-tooltip effect="dark" :content="'工号：' +item.engineerNo +'   部门：' +item.dept " placement="right">
                                    <span>{{ item.engineerName }}</span>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="产品名称" prop="spuName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="交付物名称" prop="deliveryName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="任务进度" prop="stepName"></el-table-column>
                </el-table>                
                <div class="dialog-bt">
                    <el-button type="primary" @click="chooseTask" class="margin-r50">确 定</el-button>
                    <el-button @click="handleTaskBox=false">取 消</el-button>
                </div>
        </el-dialog>
        <el-dialog :title="dialogTitle" :visible.sync="handleBox" :close-on-click-modal="false" center width="60%" @close='offDialog'>
            <!-- 我的退款步骤1-业务审核（退款中） 2-工程师审核(退款中) 3-财务审核(退款中) 4-财务同意(退款中-不可撤销) 5-全部退款(退款成功) -->
            <!-- 业务处理退款金额部分 -->
            <!-- handlers.refundStep ==1 && auditStatus==1 && !nextStep -->
            <div v-if="handlers.refundStep ==1 && auditStatus==1" class="share-fee">
                <p class="confirm-amount-title" v-if="handlers.hasTask">
                    <span class="note-txt">*</span>根据任务拆分退款金额
                </p>            
                <el-button v-if="handlers.hasTask" type="primary" @click="handleTaskBox=true" class="choose-task">选择关联任务</el-button>
                <el-form v-if="showTaskAmoutInput" :model="shareForm" ref="shareForm" :rules="rules" class="demo-form-inline" size="mini" :inline="true">
                    <p class="note-fee">
                        <span v-if="handlers.feeInfo.costType1payType1 || handlers.feeInfo.costType1payType3">{{handlers.feeInfo.costType1payType1?'代理费（定金）：':'代理费：'}}{{handlers.feeInfo.costType1payType1?handlers.feeInfo.costType1payType1:handlers.feeInfo.costType1payType3}}</span>
                        <span v-if="handlers.feeInfo.costType2payType1||handlers.feeInfo.costType2payType3">{{handlers.feeInfo.costType2payType1?'第三方费用（定金）：':'第三方费用：'}}{{handlers.feeInfo.costType2payType1?handlers.feeInfo.costType2payType1:handlers.feeInfo.costType2payType3}}</span>
                        <span v-if="handlers.feeInfo.governmentFee">官费：{{handlers.feeInfo.governmentFee}}</span>                        
                        <span v-if="handlers.feeInfo.costType1payType2">代理费（尾款）：{{handlers.feeInfo.costType1payType2}}</span>
                        <span v-if="handlers.feeInfo.costType2payType2">第三方费用（尾款）：{{handlers.feeInfo.costType2payType2}}</span>
                    </p>
                    <el-table :data="shareForm.taskAmountList" border :span-method="objectSpanMethod" :row-style="{ height: '80px' }" :cell-style="{ padding: '0px' }" :cell-class-name="'table-row'">
                        <el-table-column prop="taskNo" label="任务编号"></el-table-column>
                        <el-table-column prop="spuName" label="任务名称"></el-table-column>
                        <el-table-column prop="refundAmount" label="申请退款"></el-table-column>
                        <el-table-column :key="Math.random()" v-if="shareForm.taskAmountList[0].costType1payType1!=null" prop="costType1payType1" label="代理费(定金)单价">
                            <template slot-scope="scope">
                                <el-form-item :prop="'taskAmountList.'+scope.$index+'.costType1payType1'" 
                                :rules="rules.feeCheck">
                                    <el-input :disabled="scope.row.allIn" v-model="scope.row.costType1payType1" type="number" @blur="validScore(scope.row)" @input.native="changeInputP1($event,  scope.row.costType1payType1)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :key="Math.random()" v-if="shareForm.taskAmountList[0].costType1payType3!=null" prop="costType1payType3" label="代理费">
                            <template slot-scope="scope">
                                <el-form-item :prop="'taskAmountList.'+scope.$index+'.costType1payType3'" 
                                :rules="rules.feeCheck">
                                    <el-input :disabled="scope.row.allIn" v-model="scope.row.costType1payType3" type="number" @blur="validScore(scope.row)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :key="Math.random()" v-if="shareForm.taskAmountList[0].costType2payType1!=null" prop="costType2payType1" label="第三方(定金)单价">
                            <template slot-scope="scope">
                                <el-form-item :prop="'taskAmountList.'+scope.$index+'.costType2payType1'" 
                                :rules="rules.feeCheck">
                                    <el-input :disabled="scope.row.allIn" v-model="scope.row.costType2payType1" type="number" @blur="validScore(scope.row)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :key="Math.random()" v-if="shareForm.taskAmountList[0].costType2payType3!=null" prop="costType2payType3" label="第三方单价">
                            <template slot-scope="scope">
                                <el-form-item :prop="'taskAmountList.'+scope.$index+'.costType2payType3'" 
                                :rules="rules.feeCheck">
                                    <el-input :disabled="scope.row.allIn" v-model="scope.row.costType2payType3" type="number" @blur="validScore(scope.row)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :key="Math.random()" v-if="shareForm.taskAmountList[0].governmentFee!=null" prop="governmentFee" label="官费单价">
                            <template slot-scope="scope">
                                <el-form-item :prop="'taskAmountList.'+scope.$index+'.governmentFee'" 
                                :rules="rules.feeCheck">
                                    <el-input :disabled="scope.row.allIn" v-model="scope.row.governmentFee" type="number" @blur="validScore(scope.row)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :key="Math.random()" v-if="shareForm.taskAmountList[0].costType1payType2!=null" prop="costType1payType2" label="代理费(尾款)单价">
                            <template slot-scope="scope">
                                <el-form-item :prop="'taskAmountList.'+scope.$index+'.costType1payType2'" 
                                :rules="rules.feeCheck">
                                    <el-input :disabled="scope.row.allIn" v-model="scope.row.costType1payType2" type="number" @blur="validScore(scope.row)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :key="Math.random()" v-if="shareForm.taskAmountList[0].costType2payType2!=null" prop="costType2payType2" label="第三方(尾款)单价">
                            <template slot-scope="scope">
                                <el-form-item :prop="'taskAmountList.'+scope.$index+'.costType2payType2'" 
                                :rules="rules.feeCheck">
                                    <el-input :disabled="scope.row.allIn" v-model="scope.row.costType2payType2" type="number" @blur="validScore(scope.row)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column> 
                        <el-table-column label="审批工程师"  prop="trTaskEngineerList">
                            <template slot-scope="scope">
                                <el-select v-model="shareForm.taskAmountList[scope.$index].engineerId">
                                    <el-option v-for="item in scope.row.trTaskEngineerList" :key="item.engineerId" :label="item.engineerName" :value="item.engineerId"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="refundTaskAmount" label="是否全退">
                            <template slot-scope="scope">
                                {{scope.row.refundTaskAmount == scope.row.allInFee?'是':'否'}}
                                <!-- {{allInStatus(scope.$index)}} -->
                            </template>
                        </el-table-column>
                    </el-table>               
                    <div class="flex-justify">
                        <p>拆分退款金额总和等于退款申请金额</p>
                        <p v-if="residueAmount>=0">还需输入 {{residueAmount}} ，才能等于申请退款金额</p>
                        <p v-else class="warning-txt">金额已超出用户所填金额，超出{{-residueAmount}}</p>
                    </div>
                    <el-form-item label="部门负责人：" prop="region">
                        <el-select v-model="shareForm.region"  @change="selectHeadChanged" placeholder="请选择部门负责人">
                            <el-option v-for="item in headData" :key="item.userId" :label="item.name" :value="item.userId"></el-option>                        
                        </el-select>
                    </el-form-item>
                </el-form>                 
            </div>
            <!-- 业务处理 -->
            <!-- taskData.length > 0 && handlers.refundNum < taskData.length && nextStep && handlers.refundStep ==1 -->           
            <!-- 非财务普通处理退款 -->
            <!-- v-if="handlers.refundStep != 4" -->
            <div class="info-dispaly" v-if="handlers.refundStatus != 3">
                <el-form :model="dialogForm" :rules="rules" ref="dialogForm" class="demo-ruleForm" label-position="top" size="mini">
                    <el-form-item label="请输入拒绝原因" prop="refuseRemark" v-if="handlers.refundStep == 1 && auditStatus == 2">
                        <p class="title-desc">该原因将自动反馈至用户，请注意规范用语谨慎填写。</p>
                        <el-input type="textarea" :rows="3" v-model="dialogForm.refuseRemark" maxlength="50" show-word-limit></el-input>
                    </el-form-item>
                    <h3  v-if="handlers.refundStep == 4 && auditStatus == 1 && handlers.refundStatus != 3" class="finance-agree">下一步将进入退款处理，确定同意？</h3>
                    <div class="engineer-agree-note" v-if="handlers.refundStep==2 && auditStatus == 1">   
                        <p class="confirm-amount-title">
                            <span class="note-txt">*</span>任务进度预处理
                        </p>                   
                        <p>退款成功后将默认按以下方式处理，这里指的全额退款和部分退款指订单中单个任务情况；(如有疑问请联系工作人员)：<br />
                            1.任务全额退款：任务进度状态可选择已完成、已完成（通过）、已完成（未通过）、关闭，工程师审批后，任务进度不能操作，工程师审批前可以操作；  <br />
                            2.任务部分退款：任务进度状态可选择继续、已完成、已完成（通过）、已完成（未通过）、关闭，选择已完成、已完成（通过）、已完成（未通过）、关闭,工程师审批后，任务进度不能操作，工程师审批前可以操作；选择继续，任务进度不变，任务进度可操作；<br />
                        </p>
                    </div>
                    <el-table :data="dialogForm.engineerTaskList" border class="task-table" v-if="handlers.refundStep ==2 && auditStatus == 1 && dialogForm.engineerTaskList">
                        <el-table-column label="任务编号" prop="taskNo" show-overflow-tooltip ></el-table-column>
                        <el-table-column label="工程师">
                            <template slot-scope="scope" prop="trTaskEngineerList">
                            <div v-for="(item,index) in scope.row.trTaskEngineerList" :key="index">
                                <el-tooltip effect="dark" :content="'工号：' +item.engineerNo +'   部门：' +item.dept " placement="right">
                                    <span>{{ item.engineerName }}</span>
                                </el-tooltip>
                            </div>
                        </template>
                        </el-table-column>
                        <el-table-column label="产品名称" prop="spuName" show-overflow-tooltip></el-table-column>
                        <el-table-column label="交付物名称" prop="deliveryName" show-overflow-tooltip></el-table-column>
                        <el-table-column label="任务进度" width="80" prop="stepName"></el-table-column>
                        <el-table-column label="是否全退" width="80" prop="refundAll">
                            <template slot-scope="scope">
                                {{scope.row.refundAll == 1 ? '是':'否'}}
                            </template>
                        </el-table-column>
                        <el-table-column label="进度预处理" width="170" prop="preFinishLabel">
                            <template slot-scope="scope">
                                <p v-if="scope.row.unable">/</p>
                                <el-form-item v-else :prop="'engineerTaskList.'+scope.$index+'.preFinishLabel'" :rules="rules.preFinishLabel">
                                    <el-select v-model="scope.row.preFinishLabel">
                                        <el-option v-for="item in scope.row.engineerDealList" :disabled="item.disabled" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-form-item label="审批备注：" prop="remark" v-if="showApprove">
                        <el-input type="textarea" :rows="3" v-model="dialogForm.remark" maxlength="50" show-word-limit></el-input>
                    </el-form-item>
                </el-form>   
                <div class="dialog-bt">
                    <!-- <el-button type="primary" v-if="taskData.length > 0 && handlers.refundNum < taskData.length && !nextStep" @click="next()" class="margin-r50">下一步</el-button> -->
                    <el-button type="primary" @click="submitRefund" class="margin-r50">确 定</el-button>
                    <el-button @click="offDialog">取 消</el-button>
                </div>
            </div>
            <!-- 财务处理退款 -->
            <div class="refund-form" v-if="handlers.refundStep == 5 && handlers.refundStatus==3">
                <el-form :model="dialogForm" :rules="rules" ref="dialogForm" class="demo-ruleForm" label-width="100px" size="mini">
                    <div v-if="auditStatus==1" class="financial-handle">                        
                        <div v-for="(item,index) in payChannel.channels" :key="index">
                            <!-- <div v-if="item.refundState==0 || item.refundState==2"> -->
                            <p v-if="payChannel.channels.length>1" class="confirm-amount-title bottom-border">退款金额{{index+1}}</p>  
                            <el-form-item label="付款方式：">
                                <p>{{item.payChannel || item.payChannel == 0 ? item.payChannel : item  | refundWays}}</p>
                            </el-form-item>
                            <el-form-item label="剩余可退：" v-if="residueMoney || refundInfo.remainingAmount">
                                <p v-if="refundInfo.remainingAmount">￥{{Number(refundInfo.remainingAmount)}}</p>
                                <p v-else>￥{{Number(residueMoney)}}</p>
                            </el-form-item>
                            <el-form-item label="退款金额：" v-else>
                                <p>￥{{item.payChannel || item.payChannel == 0 ? Number(item.refundAmounts) : payChannel.refundAll}}</p>
                            </el-form-item>
                            <el-form-item label="退款方式：">
                                <p>{{item.payChannel ? item.payChannel : item | handleRefundWays }}</p>
                                <p class="warn-note">可使用银行卡或支付宝向对方银行卡转账，需上传转账凭证</p>
                            </el-form-item>                                   
                            <el-form-item label="退款凭证：" v-if="item == 1 || item.payChannel == 1">
                                <span class="must-red">* </span>
                                <el-button class="reset-site" v-if="showImg" type="text" @click="openAvatar(index)">上传凭证</el-button>
                                <span class="note-txt" v-if="noteVoucher">请上传退款凭证</span>
                            </el-form-item>                        
                            <div v-if="item == 1 || item.payChannel == 1">
                                <up-img :ref="`avatar${index}`" :url="voucherUrl" :imgParent.sync="voucherFile" :shows="showImg"  @on-change="changeImage"></up-img>
                            </div>                             
                        </div>                                                               
                        <!-- <el-form-item label="退款凭证：">
                            <span class="must-red">* </span>
                            <el-button class="reset-site" v-if="showImg" type="text" @click="openAvatar(index)">上传凭证</el-button>
                            <span class="note-txt" v-if="noteVoucher">请上传退款凭证</span>
                        </el-form-item>  
                        <div>
                            <up-img ref="avatar" :url="voucherUrl" :imgParent.sync="voucherFile" :shows="showImg"  @on-change="changeImage"></up-img>
                        </div>      -->
                        <el-form-item label="审批备注：" prop="remark">
                            <el-input type="textarea" :rows="3" v-model="dialogForm.remark" maxlength="50" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="身份验证："  prop="code">
                            <div style="display:flex">
                                <el-input class="identity" v-model="dialogForm.code" :disabled="inputAble"></el-input>
                                <el-button :disabled="codeDisabled" :class="{ ccc: codeDisabled == true }" @click="getCode">{{btnCode}}</el-button>
                            </div>
                            <div style="color: #888">
                                请输入尾号为{{ showMobile }}的手机号收到的验证码
                            </div>
                        </el-form-item>
                    </div>
                    <el-form-item label="审批备注：" prop="remark" v-else>
                        <el-input type="textarea" :rows="3" v-model="dialogForm.remark" maxlength="50" show-word-limit></el-input>
                    </el-form-item>
                </el-form>
                <div class="dialog-bt">
                    <el-button type="primary" @click="checkForm()" class="margin-r50" :disabled="submitAbled">确 定</el-button>
                    <el-button @click="offDialog">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { refundAudit, startRefund, getFinancePhone, sendFinanceSms,refundAuditByEngineer, getRefundStatus, refundAuditByFinance, refundAuditBySaleMan,startRefundOfMy,getRefundBill, getTasks, listRefundTask } from "@/api/processmanage/refund";
import { saleManApproval, financeApproval, sendRefundSmsCode, financeApprovalRefuse,listRefundDeptHead,offlineNotify,dealRefund, getRefundFinanceMobile, listEngineerTasks, listMyTasks, engineerApproval, deptHeadApproval} from "@/api/processmanage/refund";
import { uploadMedia } from "@/api/project/project";
import { mapState,mapGetters } from "vuex";
import upImg from './upVoucher';
import refundData from './refund'
export default {
    components: { upImg },
    props:{
        handlers:{
            type: Object,
            default:{},
        },
        refundInfo:{
            type: Object,
            default:{},
        },
        // froms:{
        //     type: String,
        //     default: null,
        // },
        feeInfo:{
            type:Array,
            default:[],
        },
        taskInfo:{
            type: Array,
            default:[],
        }
    },
    data(){        
        var checkFee = (rule, value, callback) => {
            // 只能输入数字（正数和负数，小数整数）
            // let reg =/^([-+]?[0-9]+[\d]*(.[0-9]{1,})?)$/
            // let res = reg.test(value);
            let fee = this.handlers.feeInfo;
            let props = rule.field;
            let index = props.lastIndexOf(".")
            let str = props.substring(index+1,props.length);
            let val = null;
            switch (str) {
                case 'costType1payType1':
                val = fee.costType1payType1;
                break;
                case 'costType1payType3':
                val = fee.costType1payType3;
                break;
                case 'costType2payType1':
                val = fee.costType2payType1;
                break;
                case 'costType2payType3':
                val = fee.costType2payType3;
                break;
                case 'governmentFee':
                val = fee.governmentFee;
                break;
                case 'costType1payType2':
                val = fee.costType1payType2;
                break;
                case 'costType2payType2':
                val = fee.costType2payType2;
                break;
            }
            if(value>val){
                callback(new Error("输入金额超出用户实付金额"))
            }else{
                callback();
            }            
        }
        return{
            refundInfoList: refundData.refundInfoList,
            handleTaskBox: false,
            props: { multiple: true },
            dialogForm:{
                remark:'',
                code:'',
                refuseRemark:'',
                engineerTaskList:[],                
            },
            shareForm:{
                listRefundBill:[],
                taskAmountList:[],
            },
            chooseHead:{},
            handleBox:false,
            num:0,
            btnCode: "获取验证码",
            inputAble:true,
            noteVoucher:false, 
            codeDisabled: true,
            unKnow: false,
            fail: false,
            showMobile: null,
            voucherUrl:'',
            voucherFile:null,        
            auditStatus:null,
            residueMoney:null,
            lastHandle:null,
            outRequestNo: null,
            finance:1,
            param:{},
            secondParam:{},
            listRefundBill:[],
            maxAgent: 200,
            rules:{
                refuseRemark: [
                    { required: true, message: '请输入拒绝原因', trigger: 'blur' }
                ],
                remark: [
                    { required: true, message: '请输入审批备注', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ],
                region: [
                    { required: true, message: '请选择部门负责人', trigger: 'change' }
                ],
                preFinishLabel: [
                    { required: true, message: '请选择进度', trigger: 'change' }
                ],
                feeCheck:[
                    { required: true, message: '请填写价格', trigger: "blur"},
                    { message :"",validator:checkFee,trigger: "blur"},
                    { pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入正整数',trigger:'blur'},
                ],
                amountRules: [
                    { required: true, message: '请填写价格', trigger: "blur"},
                    { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '最多十位整数,小数点取两位',trigger:'blur'},
                ]
            },
            payChannel:{
                channels:null,
                refundAll:null
            },
            fianceFee:[],
            // taskData: refundData.mockTask,
            headData: null,
            nextStep:false,
            idList:[],
            orderArray: [],
            taskAmountList:[],
            engineerTaskList:[],
            showTaskAmoutInput:false,
            engineerHandlers:[],//工程师处理人id
            engineerDealList: refundData.engineerDealList
        }
    },
    filters: {
        refundWays(val){
            if (val == 0) {
                return "支付宝"
            } else if (val == 1) {
                return "对公转账"
            } else{
              return '微信支付'
            };
        },
        handleRefundWays(val){
           if (val == 1) {
                return "对公转账到银行卡（若为电商退款，请上传对应电商退款成功截图）"
            } else{
              return '原路返回'
            };
        },
        feeTypeTransfer(val){
            if (val == 0) {
                return "服务费（定金）部分"
            } else if (val == 1) {
                return "服务费（尾款）部分"
            } else{
              return '官费'
            };
        },
        taskStatus(val){
            return refundData.taskStatus(val);
        }
    },
    mounted(){       
        console.log(this.handlers,'handlershandlershandlers');   
    },
    methods:{
        changeInputP1(e,val){
            console.log(e, val);
            e.target.value = e.target.value.replace(/^0+(\d)|[^\d]+/g,'');
            val = e.target.value
        },
        // 合并退款金额单元格
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 2) {
                if (rowIndex % this.handlers.refundNum === 0) {
                    return {
                        rowspan: this.handlers.refundNum,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },
        selectHeadChanged(val){
            console.log(val);
            this.chooseHead = this.headData.filter(item=>{
                return item.userId == val
            })
            console.log(this.chooseHead);
        },
        // 业务员选择任务确定
        chooseTask(){
            if(this.taskAmountList.length != this.handlers.refundNum) return this.$offsetMessage.warning('选择数量与退款数量不一致');
            this.shareForm.taskAmountList = this.taskAmountList;
            console.log(this.handlers.feeInfo,'-------list')
            let fee = this.handlers.feeInfo;
            let allIn = this.handlers.allInRefund?true:this.handlers.depart-allIn?true:false;
            this.shareForm.taskAmountList.forEach(element => {                
                this.$set(element,'engineerId',element.trTaskEngineerList[0].engineerId)
                if(fee.costType1payType1){this.$set(element,'costType1payType1',allIn?fee.costType1payType1:0)};
                if(fee.costType1payType3){this.$set(element,'costType1payType3',allIn?fee.costType1payType3:0)};
                if(fee.costType2payType1){this.$set(element,'costType2payType1',allIn?fee.costType2payType1:0)};
                if(fee.costType2payType3){this.$set(element,'costType2payType3',allIn?fee.costType2payType3:0)};
                if(fee.governmentFee){this.$set(element,'governmentFee',allIn?fee.governmentFee:0)};
                if(fee.costType1payType2){this.$set(element,'costType1payType2',allIn?fee.costType1payType2:0)};
                if(fee.costType2payType2){this.$set(element,'costType2payType2',allIn?fee.costType2payType2:0)};
                this.$set(element,'refundAmount',this.handlers.refundAmount);
                this.$set(element,'allInFee',Object.values(fee).reduce((n,m) => n + m));
                this.$set(element,'refundTaskAmount',allIn?this.handlers.totalAmount/this.handlers.buyNum:0);
                // 全退或部分全退不可修改价格
                this.$set(element,'allIn',allIn);
            });
            console.log(this.shareForm.taskAmountList);
            this.handleTaskBox=false;
            this.showTaskAmoutInput=true
        },
        // 行内计算   
        validScore(row){
            row.refundTaskAmount = Number(row.costType1payType1 || 0) + Number(row.costType1payType3 || 0) + Number(row.costType2payType1 || 0) + Number(row.costType2payType3 || 0) + Number(row.governmentFee || 0) + Number(row.costType1payType2 || 0) + Number(row.costType2payType2 || 0)
            console.log(row.refundTaskAmount,row.allInFee,'行内计算');
        },
        //继续退款获取退款状态
        confirmRefundStatus(){
            if(!this.authority) return this.$notAuthorized();//无权操作
            if(this.fail) return  this.handleAudit(1);
            getRefundStatus(this.handlers.refundId).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                    this.$offsetMessage({
                        message: res.data.msg,
                        type: 'success',
                    });
                    this.$parent.getDetail();        
                } else if (res.data.code == CodeMsg.CODE_2) {
                    this.handleBox = true;
                } else {
                    this.$offsetMessage({
                        message: res.data.msg,
                        type: 'warning',
                    });
                    this.$parent.getDetail();        
                };        
            })
        },
        next(){
            this.$refs.dialogForm.validate(valid=>{
                if(valid){
                    this.nextStep = true
                }else{
                    return false;
                };
            });
        },
        handleSelectionChange(val){
            this.idList = [];
            this.taskAmountList = [];
            val.forEach(item => {
                this.idList.push(item.id);
                this.taskAmountList.push(item);
            });
            if(val.length == this.handlers.refundNum){
                this.handlers.taskData.forEach(element => {
                    if(this.idList.includes(element.id)){
                        element.able = true;
                    }else{
                        element.able = false;
                    };
                });
            }else{
                this.handlers.taskData.forEach(element => {
                    this.$set(element,'able',true);
                });
            };   
            // let list = Array.from(new Set(this.taskAmountList))    
        },
        selectAble(row){
            if(row.able){
                return true;
            }else{
                return false;
            };
        },
        //全选下拉框
        selectAll(){
            if (this.dialogForm.engineer.length < this.refundInfoList.length) {
                this.dialogForm.engineer = [];
                this.refundInfoList.map((item) => {
                    this.dialogForm.engineer.push(item.value)
                });
                this.dialogForm.engineer.unshift('all')
            } else {
                this.dialogForm.engineer = [];
            }
        },
        //下拉框改变出发事件
        changeSelect(val) {
            this.engineerHandlers = val
            if(val.length > 0){
                let param = {
                    handlerNo: val,
                    refundId: this.handlers.refundId
                }
                listRefundTask(param).then(res=>{
                    let list = res.data.data;
                    list.forEach(item => {
                        if(item.taskStatus != 3 && item.taskStatus != 4){
                            if(this.refundInfo.fullRefund){
                                this.$set(item,'radio',1);
                            }else{
                                this.$set(item,'radio',0);
                            };
                        };
                    });
                    this.dialogForm.engineerTaskList = list;
                })
            }else{
                this.dialogForm.engineerTaskList = [];
            };
        },
        //下拉框移除选中项
        removeTag(val) {
            if (val === 'all') {
                this.dialogForm.engineer = []
            }
        },
        //操作同意或拒绝退款
        handleAudit(val){
            if(!this.authority) return this.$notAuthorized();
            this.auditStatus = val;
            this.handleBox = true;       
            // 部门负责人处理退款
            if(this.handlers.refundStep == 1 && val == 1 && !this.headData){      
                console.log(val);          
                listRefundDeptHead().then(res=>{
                    if(res.data.code == CodeMsg.CODE_0){
                        this.headData = res.data.data
                    }
                })
            }
            // refundStep 5 财务第二步操作，需获取手机号
            if(this.handlers.refundStep == 5 && val == 1){
                //获取财务手机号
                if(!this.showMobile){ //-2:未通过;-1:已撤销;1:待审核;2:审核中;3:审核通过;4:已完成
                    this.getPhone();          
                }
                //过滤出订单支付方式
                let arr = this.feeInfo;
                console.log(arr);
                // let pays = refundData.uniqueArr(arr,'payTypeId');
                // 以payTypeId为依据分割数据
                let channels = Object.values(arr.reduce((acc,{payChannel,payTypeId,refundAmount})=>(acc[payTypeId] ? (acc[payTypeId].refundAmount = (Array.isArray(acc[payTypeId].refundAmount) ? acc[payTypeId].refundAmount : [acc[payTypeId].refundAmount]).concat(refundAmount)) : (acc[payTypeId]={payChannel,payTypeId,refundAmount}) ,acc),{}));
                // 计算单项退款总额
                    console.log(channels,'i10000');
                channels.forEach(item=>{
                    this.$set(item,'refundAmounts',null);
                    item.refundAmounts = item.refundAmount.length >1 ? item.refundAmount.reduce((p,c) => p + c) : item.refundAmount;
                })
                    console.log(channels,'iiiiiii');
                // 混和支付导出各支付方式
                if(channels.length == 1 || !channels.every(item => item.payChannel == channels[0].payChannel)) return this.payChannel.channels = channels;                 
                // 统一支付过滤只留一条数据(一口价数据需特殊处理)
                this.payChannel.refundAll = channels.reduce((p,c) => p.refundAmounts + c.refundAmounts);
                this.payChannel.channels = Array.from(new Set(channels.map(item => item.payChannel)));     
                console.log(this.payChannel);
            }
            // 工程师处理获取任务列表过滤对应处理状态
            if(this.handlers.refundStep == 2 && val == 1 && this.dialogForm.engineerTaskList.length == 0){
                    listEngineerTasks(this.handlers.id,this.froms).then(res=>{
                        if(res.data.code == CodeMsg.CODE_0){
                            let data = res.data.data;
                            data.forEach(item=>{
                                let list = this.engineerDealList;
                                if(item.refundAll && !list.some(item => item.label == '继续')){
                                    let para = {label:'继续', value:'继续', disabled: false};
                                    list.splice(4, 0, para);                                
                                }
                                // 任务已完成不可进行进度预处理
                                if(item.taskStatus == 2){
                                    this.$set(item,'unable',true);
                                    item.preFinishLabel = item.finishLabel;
                                }
                                // A:仅可选完成；B:可选通过、不通过；C:可选完成、通过、不通过
                                if(item.finishType == 'A'){
                                    list[1].disabled = list[2].disabled = true
                                } else if (item.finishType == 'B'){
                                    list[0].disabled = true
                                } else {

                                }
                                this.$set(item,'engineerDealList',list);
                                this.$set(item,'taskId',item.id);
                            });
                            this.dialogForm.engineerTaskList = data;
                        } else {
                            this.$offsetMessage.error(res.data.msg);
                        }

                        
                    })
            };
        },
        offDialog(){
            this.handleBox = false
            this.resetForm('dialogForm')
        },
        //获取手机尾号
        getPhone(){
            getRefundFinanceMobile(this.handlers.id).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                    this.showMobile = res.data.data.substring(res.data.data.length-4)
                } else {
                    this.$offsetMessage.error('系统问题，未获取到手机尾号！');
                }
            })
        },
        //检查必填凭证判断页面来源
        checkForm(){
            this.secondParam = {
                approvalStatus: this.auditStatus,
                // id: this.handlers.tmRefundApprovalList[0].id,
                approvalRole: this.handlers.refundStep,
                orderId: this.handlers.orderId,
                tmRefundId: this.handlers.id,
                approvalRemark:this.dialogForm.remark,
            }    
            if(this.auditStatus==1){
                this.secondParam.code = this.dialogForm.code;
                this.secondParam.voucherUrl = this.voucherFile;
            }       
            if(this.auditStatus==2){
                this.secondParam.refuseReason = this.dialogForm.refuseRemark
            }
            this.financeSubmit();
        },
        
        //生产随机字符
        randomString(len) {
            len = len || 8;
            /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            var maxLen = $chars.length;
            var str = '';
            for (var i = 0; i < len; i++) {
                str += $chars.charAt(Math.floor(Math.random() * maxLen));
            }
            return str;
        },
        //我的退款财务第二步提交凭证退款
        myFinanceSubmit(){
            this.$refs['dialogForm'].validate((valid) => {
                if(valid){
                    startRefundOfMy(this.secondParam).then(res=>{
                        this.financeCallback(res)
                    });
                }
            });          
        },
        //流程管理财务第二步提交审批
        financeSubmit(){
            let api = this.handlers.refundStatus == 3 && this.auditStatus == 2 ? financeApprovalRefuse : dealRefund;
            let param = new FormData();
            param.append('voucherUrl', this.voucherFile);
            param.append('remark', this.dialogForm.remark);
            let para = {
                refundId: this.handlers.id,
                code: this.dialogForm.code,
            };
            let refuses = {
                tmRefundId: this.handlers.id,
                approvalRemark: this.dialogForm.remark
            };
            this.$refs['dialogForm'].validate((valid) => {
                if(valid){
                    if(this.auditStatus == 2) return financeApprovalRefuse(refuses).then(res=>{
                        this.financeCallback(res)
                    });
                    dealRefund(param,para).then(res=>{
                        this.financeCallback(res)
                    });
                }
            });
        },
        // 财务处理退款回调处理
        financeCallback(res){
            let data = res.data.data
            if(res.data.code == CodeMsg.CODE_0){
                this.handleBox = false;
                if(data.remainingAmount){
                    this.residueMoney = data.remainingAmount
                }; 
                if(data.startRefundState == 0){
                    this.$offsetMessage({
                        message: '退款操作成功！',
                        type: 'success',
                    });
                    this.finance = 2;
                } else if(data.startRefundState == 1 && data.error){
                    this.lastHandle = 1;
                    this.$offsetMessage.error('部分退款失败，原因：'+ data.error[0].msg);
                    this.handleBox = true;
                } else if(data.startRefundState == 2 && data.error){
                    this.$offsetMessage.error('退款失败，原因：'+ data.error[0].msg);
                } else if(data.startRefundState == 3){
                    this.$offsetMessage.warning('退款结果待返回，请稍后重试!');                    
                } else {
                    this.$offsetMessage({
                        message: '退款操作成功！',
                        type: 'success',
                    });
                    // this.$offsetMessage.error('退款失败，请联系管理员或稍后重试！');                    
                }                        
                this.$parent.getDetail();
                this.resetForm('dialogForm');
            } else {
                this.$offsetMessage.error(res.data.msg);
            }
        },
        // 业务员处理退款
        saleSubmit(){
            console.log(this.shareForm,'=====');
            // 需要拆分任务且同意状态
            if(this.handlers.hasTask && this.auditStatus==1){                
                let feeArray = Object.keys(this.handlers.feeInfo)
                let form = this.shareForm.taskAmountList;    
                let all = 0
                form.forEach(n=>{
                    all += Number(n.refundTaskAmount)||0
                })
                // let all = form.reduce((n,m) => n.refundTaskAmount ||0 + m.refundTaskAmount||0)
                // 判断金额相加是否等于用户申请金额
                if(all != this.handlers.refundAmount) return this.$offsetMessage.error('所有金额相加不等于用户申请退款金额');     
                form.forEach(item=>{
                    // 获取工程师姓名、no
                    let engineer = item.trTaskEngineerList.find(e=>{
                        return e.engineerId == item.engineerId
                    })
                    this.$set(item,'engineerName',engineer.engineerName);
                    this.$set(item,'engineerNo',engineer.engineerNo);
                    // 设置后台所需feelist
                    this.$set(item,'ttRefundFeeList',[])
                    feeArray.forEach(n=>{
                        if(item.hasOwnProperty(n)){
                            item.ttRefundFeeList.push({[n]:item[n]})
                        }                    
                    })  
                    // 设置每个fee item所需值             
                    item.ttRefundFeeList.forEach(j=>{
                        Object.keys(j).forEach((item2) => {
                            if(item2 == 'governmentFee'){
                                let fee = this.handlers.ttOrderFeeVoList;
                                console.log(fee);
                                j.costAmount = j[item2];
                                j.costTypeId = '3';
                                j.payTypeId = fee.find(i=>{return i.costType == 3}).payType
                            } else {
                                j.costAmount = j[item2];
                                j.costTypeId = item2.charAt(8)
                                j.payTypeId = item2.charAt(item2.length - 1)   
                            }                                            
                        });
                        let paymentId = this.handlers.payments.filter( i => i.payType == Number(j.payTypeId))[0].paymentId
                        this.$set(j,'paymentId',paymentId)
                    });
                    console.log(item.ttRefundFeeList,'item.ttRefundFeeList')
                    this.$set(item,'taskId',item.id)
                    // 单个任务是否全退
                    let refundAll = item.refundTaskAmount == item.allInFee ? 1 : 2;
                    this.$set(item,'refundAll',refundAll)
                })
                this.shareForm.taskAmountList = form;     
                let chooseHead = this.chooseHead[0];
                let para = {
                    deptHeadId: chooseHead.userId,
                    deptHeadName: chooseHead.name,
                    deptHeadNo: chooseHead.number,
                    trRefundTaskVoList: this.shareForm.taskAmountList
                }
                this.param = Object.assign(this.param,para)           
            }
            this.$refs.dialogForm.validate(valid=>{
                if(!valid) return false  
                console.log(this.param,'saleManApproval-trRefundTaskVoList');
                saleManApproval(this.param, this.froms).then(res=>{
                    this.callbackHandle(res)
                })
            })
        },
        //前三步操作退款区分身份发送请求
        submitRefund(){
            console.log(this.shareForm.taskAmountList);
            this.$refs.dialogForm.validate(valid=>{
                if(!valid) return   
                this.param = {
                    approvalStatus: this.auditStatus,
                    id: this.handlers.tmRefundApprovalList[0].id,
                    approvalRole: this.handlers.refundStep,
                    orderId: this.handlers.orderId,
                    tmRefundId: this.handlers.id,
                    approvalRemark:this.dialogForm.remark,
                    // rejectReason:this.dialogForm.refuseRemark?this.dialogForm.refuseRemark:null,
                }
                if(this.auditStatus==2){
                    this.param.refuseReason = this.dialogForm.refuseRemark
                }
                switch(this.handlers.refundStep){
                    case 1: this.saleSubmit() // 业务员操作
                    break
                    case 2: this.engineerHandle() // 工程师操作
                    break
                    case 3: this.deptHeadHandle() // 部门负责人操作
                    break
                    case 4: this.financeHandle() //财务操作
                    break
                }                
            })
        },        
        //普通操作
        otherHandle(){
            this.$refs['dialogForm'].validate((valid) => {
                this.param.tasks=[];
                this.dialogForm.engineerTaskList.forEach(item => {
                    if(item.taskStatus !=3 && item.taskStatus != 4){
                        this.param.tasks.push({
                            handler: item.engineerNo,
                            taskId: item.taskId,
                            taskStatus: item.radio
                        })
                    }
                });
                if(valid){
                    refundAudit(this.param).then(res=>{
                        this.callbackHandle(res);
                    });
                }
            });  
        },
        //我的流程业务退款
        salesHandle(){
            if(this.nextStep && this.handlers.refundNum != this.idList.length){
                this.$offsetMessage.warning('请选择'+this.handlers.refundNum+'个关联任务')
            }else{
                this.$refs['dialogForm'].validate((valid) => {
                    if(valid){
                        refundAuditBySaleMan(this.param).then(res=>{
                            this.callbackHandle(res);
                        });
                    };
                });   
            };      
        },
        //审批操作流程工程师退款
        engineerHandle(){
            this.$refs['dialogForm'].validate((valid) => {
                if(valid){
                    this.dialogForm.engineerTaskList.forEach(item=>{
                        // 获取工程师姓名、no
                        this.$set(item,'engineerName',item.trTaskEngineerList[0].engineerName);
                        this.$set(item,'engineerNo',item.trTaskEngineerList[0].engineerNo);
                        this.$set(item,'engineerId',item.trTaskEngineerList[0].engineerId);
                    })  
                    this.param.id = this.froms ? this.dialogForm.engineerTaskList[0].approvalId : this.param.id;
                    this.$set(this.param,'trRefundTaskVoList', this.dialogForm.engineerTaskList)  
                    console.log(this.param);  
                    engineerApproval(this.param, this.froms).then(res=>{
                        this.callbackHandle(res);
                    });       
                }
            });            
        },
        //审批操作流程部门负责人退款
        deptHeadHandle(){
            deptHeadApproval(this.param, this.froms).then(res=>{
                this.callbackHandle(res);
            });
        },
        //审批流程财务退款
        financeHandle(){
            // if(this.handlers.refundStatus==3) return this.checkForm();           
            this.$refs['dialogForm'].validate((valid) => {
                if(valid){
                    financeApproval(this.param, this.froms).then(res=>{
                        this.callbackHandle(res);
                    });
                }
            });            
        },
        //操作后回调处理
        callbackHandle(res){
            if(res.data.code == CodeMsg.CODE_0){
                this.handleBox = false;
                if(this.handlers.refundStep == 4 && this.auditStatus == 1) return this.remindFinancial();
                this.$parent.getDetail();
                this.$offsetMessage({
                    message: '操作成功！',
                    type: 'success',
                });
                this.resetForm('dialogForm');                            
            } else {
                this.handleBox = false;
                this.$offsetMessage.error('操作失败，'+res.data.msg);
                this.$parent.getDetail();
            }
        },
        //校验业务所填金额
        checkMoney(){
            let bill = this.shareForm.listRefundBill;
            bill.forEach(item=>{
                item.sum = 0;
                item.listAmountType.forEach(e=>{
                    e.refundAmount = e.money*100
                    item.sum += e.money
                })
            })
            this.param.listRefundBill = bill;
            if(this.froms!=null){
                this.salesHandle()
            } else {
                this.otherHandle()
            }
        },
        //提交操作
        remindFinancial(){
            this.$confirm('操作成功，是否现在进行退款处理？', '提醒', {
                confirmButtonText: '去处理',
                cancelButtonText: '稍后',
                cancelButtonClass: 'btn-custom-cancel',
            }).then(() => {
                this.$parent.getDetail('follow');      
            }).catch(() => {
                this.$parent.getDetail();      
                this.$offsetMessage({
                    type: 'info',
                    message: '稍后处理',
                });          
            });
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();        
        },
        //倒计时
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
        //获取验证码
        getCode(){
            sendRefundSmsCode(this.handlers.id).then((res) =>{
                if(res.data.code == CodeMsg.CODE_0){
                    this.inputAble = false;
                    this.$offsetMessage({
                        message: "发送成功，5分钟内有效！",
                        type: "success",
                    });
                    this.num = 60;
                    this.timer();
                } else {
                    this.$offsetMessage({
                        message: res.data.msg + "，请稍后重试!",
                        type: "warning",
                    });
                }
            })            
        },
        //上传图片
        openAvatar(index){
            // this.$refs['avatar'].uploadHeadImg()
            this.$refs[`avatar${index}`][0].uploadHeadImg()
        },
        //图片转化url
        changeImage(imgs) {
            let imgFile = this.base64ImgtoFile(imgs);  
            if((imgFile.size/1024)<=2000){
                this.voucherUrl = imgs;
                let formData = new FormData();
                formData.append("file", imgFile);
                //图片上传至服务器
                uploadMedia(formData).then((res) =>{
                    if(res.data.code == CodeMsg.CODE_0){
                        this.voucherFile = res.data.data;
                        this.noteVoucher = false;
                    }
                })
            }else{
                this.$offsetMessage({
                    type:'warning',
                    message:"照片大小超过2M，请重新选择！",
                })
            }
        }, 
        //base64转文件
        base64ImgtoFile(dataurl, filename = "file") {
            let arr = dataurl.split(",");
            let mime = arr[0].match(/:(.*?);/)[1];
            let suffix = mime.split("/")[1];
            let bstr = atob(arr[1]);
            let n = bstr.length;
            let u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], `${filename}.${suffix}`, { type: mime });
        },   
        
    },
    computed:{        
        ...mapGetters(['permissions']),    
        ...mapState({
            userInfo: state => state.user.userInfo,
        }),
        authority(){
            if(this.$route.query.from){
                return this.permissions.bt_refund_audit_my;
            } else {
                return this.permissions.bt_refund_audit;
            }
        },
        residueAmount(){
            let list = this.shareForm.taskAmountList;
            if(list.length==0) return this.handlers.refundAmount
            let all = 0
            list.forEach(row=>{
                all += Number(row.costType1payType1 || 0) + Number(row.costType1payType3 || 0) + Number(row.costType2payType1 || 0) + Number(row.costType2payType3 || 0) + Number(row.governmentFee || 0) + Number(row.costType1payType2 || 0) + Number(row.costType2payType2 || 0)
            });
            let residue = Number(this.handlers.refundAmount || 0) - Number(all || 0);
            console.log(residue,'``````````````````````````');
            return residue;
        },
        allInStatus(){
            return (index) => {
                console.log(Number(this.shareForm.taskAmountList[index].agentFee) + Number(this.shareForm.taskAmountList[index].thirdFee)+Number(this.shareForm.taskAmountList[index].governFee) === Number(270));
                Number(this.shareForm.taskAmountList[index].agentFee) + Number(this.shareForm.taskAmountList[index].thirdFee)+Number(this.shareForm.taskAmountList[index].governFee)
                this.$forceUpdate()
            } 
        },
        showImg(){
            return this.voucherFile == null
        },
        submitAbled(){
            return this.dialogForm.remark == '' && this.dialogForm.code == '' && this.voucherFile == null
        },
        showFirstHandle(){
            if(!this.unKnow && !this.fail){
                return  this.handlers.refundStatus!=3
            } else {
                return false
            }
        },
        showSecondHandle(){
            return this.handlers.refundStep == 5 && this.refundInfo.refundStatus == 3 && !this.unKnow && !this.fail
        },
        showFinanceHandle(){
            return this.handlers.refundStep == 6
        },
        dialogTitle(){
            if(this.handlers.refundStep == 4 || this.lastHandle || this.handlers.refundStep == 5){
               return this.auditStatus == 1? "退款处理":"拒绝退款，下一步业务员处理"
            } else if(this.handlers.refundStep == 1){
                return this.auditStatus == 1? "同意退款，下一步工程师处理（或下一步财务处理）":"拒绝退款，退款原因将会反馈至用户并结束退款流程"
            } else if(this.handlers.refundStep == 2){
                return this.auditStatus == 1? "同意退款，等待关联工程师全部同意后，下一步财务处理":"拒绝退款，下一步业务员处理"
            } else if(this.handlers.refundStep == 3){
                return this.auditStatus == 1? "同意退款":"拒绝退款，下一步业务员处理"
            }
        },
        showApprove(){
            if(this.handlers.refundStep == 4){
                return this.auditStatus != 1
            } else {
                return true
            }
        },
        financeSuccess(){
            this.finance == 1
            return this.refundInfo.refundStatus == 1 || this.refundInfo.refundStatus == 2 || this.refundInfo.refundStatus == 3
        },
        froms(){
            return this.$route.query.from
        },
        isYou(){
            console.log(this.froms,'-------------froms');
            if (this.$route.query.from == null) {
                return true 
            } else {
                if(this.handlers.tmRefundApprovalList.findIndex(e=>e.handleBy === this.userInfo.id)>=0){
                    return true 
                }else{
                    return false
                };        
            }
        },
    },
    watch:{
        'dialogForm.remark':{
            handler(val){
                if(val !=''){
                    if(this.refundInfo.refundModel !=0 && this.voucherFile){
                        this.codeDisabled = false
                    }; 
                    this.codeDisabled = false
                }
            }
        }
    }
}
</script>

<style scoped>
.title-desc{
    font-size: 12px;
    color: #999;
    margin: -14px 0 0 0
}
.user-pay-info{
    margin-bottom: 14px;
}
.user-pay-info span:nth-child(2){
    margin-left: 138px;
}
.user-refund{
    line-height: 28px;
}
.fee-line{
    margin-bottom: 30px;
}
.engineer-agree-note p{
    font-size: 12px;
    color: #666;
}
.info-dispaly{
    margin-bottom: 30px;
}
.identity{
    max-width: 230px;
    margin-right: 10px;
}
.ccc {
  color: #d1d1d1 !important;
}
.dialog-bt{
    text-align: center;
}
.warn-note{
    color: coral;
    font-size: 14px;
}
.margin-r50{
    margin-right: 50px;
}
.refund-form p{
    margin:0
}
.finance-agree{
    margin-bottom: 50px;
    text-align: center;
}
.note-txt{
    color: red;
    margin-left: 10px;
    font-size: 12px;
}
.amount-title{
    font-size: 14px;
    color: #333;
}
.confirm-amount-title{
    font-weight: 600;
    margin-top: 0;
}
.bottom-border{
    border-bottom: 1px solid #eee;
}
.financial-handle .confirm-amount-title{
    margin: 0 0 14px 14px;
}
.confirm-amount-title span{
    margin-left: -4px;
}
.amount-note{
    margin: 0;
    padding: 10px;
    border-right: 1px solid #DCDFE6;
    border-left: 1px solid #DCDFE6;
}
.share-fee{
    margin-bottom: 20px;
}
.table-head,.fee-item-box{
    display: grid;
    grid-template-columns: 33.33333% 33.33333% 33.33333%;
}
.table-head p, .fee-item{
    border-top: 1px solid #DCDFE6;
    border-left: 1px solid #DCDFE6; 
}
.table-head p{
    text-align: center;
    border-top: 1px solid #DCDFE6;
    border-left: 1px solid #DCDFE6;
    padding: 6px 0;
    font-weight: 600;
    margin: 0;
}
.table-head p:last-child, .fee-item:last-child{
    border-right: 1px solid #DCDFE6;
}
.fee-item-box, .fee-table:last-child{
    border-bottom: 1px solid #DCDFE6;
}
.fee-item{
    text-align: center;
    margin:0;
    padding: 14px 0;
    line-height: 30px;
}
.task-table{
    margin: 15px 0;
}
</style>