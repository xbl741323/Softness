<template>
  <div class="receive_frame">
    <div>
      <el-form :model="receiveFeeForm" ref="receiveFeeForm" >
        <el-form-item label="合同/订单信息：">
          <div class="order_radio" >
            <el-radio v-model="online" :label="true" @change="changeOnline()">系统合同号</el-radio>
            <el-radio v-model="online" :label="false" @change="changeOffline()">非系统合同号/无合同/第三方返佣</el-radio>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="!online">
      <!-- 线下合同 -->
      <el-form :model="offlineForm" ref="offlineForm" :rules="offlineRules" inline>
        <el-form-item label="合同编号" prop="contractNo" >
          <el-input v-model="offlineForm.contractNo" placeholder="非系统合同号请输入合同编号，其他回款请简单备注" style="width:700px" />
        </el-form-item>
        <el-form-item prop="agencyFee" :rules="offlineRules.agencyFee">
          <el-checkbox v-model="offlineForm.agencyFeeStatus"  class="fee-label">代理费：</el-checkbox>
          <el-input type="number" max="999" v-model="offlineForm.agencyFee" :disabled="!offlineForm.agencyFeeStatus" class="orders_number" />
        </el-form-item>

        <el-form-item prop="thirdPartyFee" :rules="offlineRules.thirdPartyFee">
          <el-checkbox v-model="offlineForm.thirdPartyFeeStatus" class="fee-label">第三方费用：</el-checkbox>
          <el-input type="number" max="999" v-model="offlineForm.thirdPartyFee" :disabled="!offlineForm.thirdPartyFeeStatus" class="orders_number" />
        </el-form-item>

        <el-form-item prop="governmentFee" :rules="offlineRules.governmentFee">
          <el-checkbox v-model="offlineForm.governmentFeeStatus" class="fee-label">官费：</el-checkbox>
          <el-input type="number" max="999" v-model="offlineForm.governmentFee" :disabled="!offlineForm.governmentFeeStatus" class="orders_number" />
        </el-form-item>
      </el-form>
    </div>
    <div v-else>
      <el-button type="primary" @click="receiveOrderDialog = true">添加订单</el-button>
      <!-- 线上合同 -->
      <el-form :model="form" ref="form" :rules="rules">
        <p>可最多添加20个订单，已添加{{form.orderList.length}}个</p>
        <el-table :data="form.orderList" border class="order-table" max-height="400">
          <el-table-column label="合同编号-订单编号"  width="100" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              {{scope.row.contractNo}}-{{scope.row.orderNo}}
            </template>
          </el-table-column>
          <el-table-column label="产品名称" prop="productName" align="center" width="120">
          </el-table-column>
          <el-table-column label="认领费用明细" prop="agencyFee">
            <template slot-scope="scope" >
              <!-- 代理费 -->
              <div class="fee_detail" v-if="scope.row.orderDetail.tailAgent != 0">
                <div>
                  <el-form-item :prop="'orderList.' + scope.$index +'.agencyFee'" :rules="rules.agencyFee">
                    <el-checkbox v-model="scope.row.agencyFeeStatus" @change="hasSelected(scope.row)" class="fee-label">代理费：</el-checkbox>
                    <el-input type="number" max="999" v-model="scope.row.agencyFee" :disabled="!scope.row.agencyFeeStatus" class="orders_number" />
                  </el-form-item>
                </div>
                <!-- <div v-if="scope.row.agencyFeeStatus && online" class="final_fee"> 
                  <span >尾款：</span>
                  <div class="final-pay">
                    <el-radio-group v-model="scope.row.tailAgentStatus" @change="changeFinalPay(scope.row)">
                      <el-radio label="0" :disabled="(online && (scope.row.orderDetail && scope.row.orderDetail.tailAgent != null))">无</el-radio>
                      <el-radio label="1" :disabled="(online && (scope.row.orderDetail && scope.row.orderDetail.tailAgent != null))">待定</el-radio>
                      <el-radio label="2" :disabled="(online && (scope.row.orderDetail && scope.row.orderDetail.tailAgent != null))">未结清</el-radio>
                    </el-radio-group>
                  </div>
                  <el-form-item :prop="'orderList.' + scope.$index +'.tailAgent'" v-if="scope.row.tailAgentStatus == 2" :rules="rules.tailAgent">
                    <el-input type="number" 
                      v-if="scope.row.tailAgentStatus == 2" 
                      v-model="scope.row.tailAgent" 
                      :disabled="(online && (scope.row.orderDetail && scope.row.orderDetail.tailAgent != null))"
                      class="uncleared" 
                    />
                    <span v-if="scope.row.tailAgentStatus == 2" >元</span>
                  </el-form-item>
                </div> -->
              </div>
              
               <!-- 第三方费用 -->
              <div class="fee_detail" v-if="scope.row.orderDetail.tailThird != 0">
                <div>
                  <el-form-item :prop="'orderList.' + scope.$index +'.thirdPartyFee'" :rules="rules.thirdPartyFee">
                    <el-checkbox v-model="scope.row.thirdPartyFeeStatus" @change="hasSelected(scope.row)" class="fee-label">第三方费用：</el-checkbox>
                    <el-input type="number" max="999" v-model="scope.row.thirdPartyFee" :disabled="!scope.row.thirdPartyFeeStatus" class="orders_number" />
                  </el-form-item>
                </div>
                <!-- <div v-if="scope.row.thirdPartyFeeStatus && online" class="final_fee"> 
                  <span>尾款：</span>
                  <div class="final-pay">
                    <el-radio-group v-model="scope.row.tailThirdStatus" @change="changeFinalPay(scope.row)">
                      <el-radio label="0" :disabled="(online && (scope.row.orderDetail && scope.row.orderDetail.tailThird != null))">无</el-radio>
                      <el-radio label="1" :disabled="(online && (scope.row.orderDetail && scope.row.orderDetail.tailThird != null))">待定</el-radio>
                      <el-radio label="2" :disabled="(online && (scope.row.orderDetail && scope.row.orderDetail.tailThird != null))">未结清</el-radio>
                    </el-radio-group>
                  </div>
                  <el-form-item :prop="'orderList.' + scope.$index +'.tailThird'" :rules="rules.tailThird" v-if="scope.row.tailThirdStatus == 2">
                    <el-input type="number" 
                      v-if="scope.row.tailThirdStatus == 2" 
                      v-model="scope.row.tailThird" 
                      :disabled="(online && (scope.row.orderDetail && scope.row.orderDetail.tailThird != null))"
                      class="uncleared" 
                    />
                    <span v-if="scope.row.tailThirdStatus == 2" >元</span>
                  </el-form-item>
                </div> -->
              </div>

               <!-- 官费 -->
              <div class="fee_detail" v-if="scope.row.orderDetail.tailGovernment != 0">
                <div>
                  <el-form-item :prop="'orderList.' + scope.$index +'.governmentFee'" :rules="rules.governmentFee">
                    <el-checkbox v-model="scope.row.governmentFeeStatus" @change="hasSelected(scope.row)" class="fee-label">官费：</el-checkbox>
                    <el-input type="number" max="999" v-model="scope.row.governmentFee" :disabled="!scope.row.governmentFeeStatus" class="orders_number" />
                  </el-form-item>
                </div>
                <!-- <div v-if="scope.row.governmentFeeStatus && online" class="final_fee"> 
                  <span >尾款：</span>
                  <div class="final-pay">
                    <el-radio-group v-model="scope.row.tailGovernmentStatus" @change="changeFinalPay(scope.row)">  
                      <el-radio label="0" :disabled="(online && (scope.row.orderDetail && scope.row.orderDetail.tailGovernment != null))">无</el-radio>
                      <el-radio label="1" :disabled="(online && (scope.row.orderDetail && scope.row.orderDetail.tailGovernment != null))">待定</el-radio>
                      <el-radio label="2" :disabled="(online && (scope.row.orderDetail && scope.row.orderDetail.tailGovernment != null))">未结清</el-radio>
                    </el-radio-group>
                  </div>
                  <el-form-item :prop="'orderList.' + scope.$index +'.tailGovernment'" :rules="rules.tailGovernment" v-if="scope.row.tailGovernmentStatus == 2">
                    <el-input type="number" 
                      v-if="scope.row.tailGovernmentStatus == 2" 
                      v-model="scope.row.tailGovernment" 
                      :disabled="(online && (scope.row.orderDetail && scope.row.orderDetail.tailGovernment != null))"
                      class="uncleared" 
                    />
                    <span v-if="scope.row.tailGovernmentStatus == 2" >元</span>
                  </el-form-item>
                </div> -->
              </div>

            </template>
          </el-table-column>
          
          <el-table-column label="尾款状态" width="300" align="center">
            <template slot-scope="scope" >
              <el-form-item :prop="'orderList.' + scope.$index +'.payAll'" :rules="rules.payAll">
                <el-radio-group v-model="scope.row.payAll" >
                  <el-radio :label="1">已结清</el-radio>
                  <el-radio :label="0">未结清</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="90" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteProduct(scope.row)" v-if="form.orderList.length > 1">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>

    <p>合计认领：
      <a class="total">{{(orderSum/100)}}元<i class="el-icon-check" v-if="orderSum == receiveAmount"></i></a>
      <a v-if="orderSum > receiveAmount" class="negative">+{{((orderSum-receiveAmount)/100)}}元</a>
      <a v-if="orderSum < receiveAmount" class="negative">{{(orderSum-receiveAmount)/100}}元</a>
    </p>
    <!-- <p v-if="insufficient == 0">合计认领：{{this.orderSum}}元<i class="el-icon-check"></i></p>
    <p v-else-if="insufficient > 0">合计认领：{{this.orderSum}}元 <span class="difference">- {{insufficient}}元</span></p>
    <p v-else>合计认领：{{this.orderSum}}元 <span class="difference">+ {{redundant}}元</span></p> -->
    
    <div class="commit-receviable">
      <el-button type="warning" @click="lastStep()">上一步</el-button>
      <el-button type="primary" @click="confirmReceive()" :disabled="!orderSumStatus" v-preventReClick>确定领取</el-button>
    </div>

    <el-dialog title="添加订单" :visible.sync="receiveOrderDialog" :append-to-body="true" :close-on-click-modal="false">
      <order-select v-if="receiveOrderDialog" :clueId="clueId" :existingProducts="form.orderList" @list="getOrders" @closeDialog="closeDialog" :multipleNum="5" />
    </el-dialog>
  </div>
</template>

<script>
import OrderSelect from './order-select'
import receiveData from '@/views/receivable/js/receivable.js'
export default {
  components:{
    OrderSelect
  },
  props:{
    clueId:{
      type: Number,
      required: true
    },
    receiveAmount:{//回款金额
      type: Number,
      required: true
    },
    customerName:{//客户名称
      type: String
    },
    feeId:{//回款id
      type: Number,
      required: true
    },
    receiveNo:{
      type: String
    }
  },
  data(){
    var agencyFeeValidator = (rule, value, callback)=>{
      let index = rule.field.match(/.(\d)./)[1];//匹配当前是第几条数据
      let pattern = /^(?!0\d|[0.]+$)\d+(\.\d{1,2})?$/;//两位小数正数
      if(this.form.orderList[index].agencyFeeStatus && this.form.orderList[index].orderDetail.tailAgent != null){
        if(value){
          if(pattern.test(value)){
            if(value*100 > this.form.orderList[index].orderDetail.agencyFee){
              callback(new Error('认领金额不能超过尾款！'));
            }else if(value*100 == this.form.orderList[index].orderDetail.agencyFee){
              this.form.orderList[index].tailAgentStatus = '0';
              callback();
            }else{
              this.form.orderList[index].tailAgentStatus = '1';
              callback();
            };
          }else{
            callback(new Error('请输入正确的代理费，非零正数小数点保留两位'));
          };
        }else{
          callback(new Error('请输入正确的代理费，非零正数小数点保留两位'));
        };
      }else if(this.form.orderList[index].agencyFeeStatus && this.form.orderList[index].orderDetail.tailAgent == null){
         if(!pattern.test(value)){
            callback(new Error('请输入正确的代理费，非零正数小数点保留两位'));
          }else{
            callback();
          };
      }else{
        callback();
      };
    };
    var thirdPartyFeeValidator = (rule, value, callback)=>{
      let index = rule.field.match(/.(\d)./)[1];
      var pattern = /^(?!0\d|[0.]+$)\d+(\.\d{1,2})?$/;
      if(this.form.orderList[index].thirdPartyFeeStatus && this.form.orderList[index].orderDetail.tailThird != null){
        if(value){
          if(pattern.test(value)){
            if(value*100 > this.form.orderList[index].orderDetail.thirdPartyFee){
              callback(new Error('认领金额不能超过尾款！'));
            }else if(value*100 == this.form.orderList[index].orderDetail.thirdPartyFee){
              this.form.orderList[index].tailThirdStatus = '0';
               callback();
            }else{
              this.form.orderList[index].tailThirdStatus = '1';
               callback();
            };
          }else{
            callback(new Error('请输入正确的第三方费用，非零正数小数点保留两位'));
          };
        }else{
          callback(new Error('请输入正确的第三方费用，非零正数小数点保留两位'));
        };
      }else if(this.form.orderList[index].thirdPartyFeeStatus && this.form.orderList[index].orderDetail.tailThird == null){
        if(!pattern.test(value)){
          callback(new Error('请输入正确的第三方费用，非零正数小数点保留两位'));
        }else{
          callback();
        };
      }else{
        callback();
      };
    };
    var governmentFeeValidator = (rule, value, callback)=>{
      let index = rule.field.match(/.(\d)./)[1];
      let pattern = /^(?!0\d|[0.]+$)\d+(\.\d{1,2})?$/;
      if(this.form.orderList[index].governmentFeeStatus && this.form.orderList[index].orderDetail.tailGovernment != null){
        if(value){
          if(pattern.test(value)){
            if(value*100 > this.form.orderList[index].orderDetail.governmentFee){
              callback(new Error('认领金额不能超过尾款！'));
            }else if(value*100 == this.form.orderList[index].orderDetail.governmentFee){
              this.form.orderList[index].tailGovernmentStatus = '0';
               callback();
            }else{
              this.form.orderList[index].tailGovernmentStatus = '1';
              callback();
            };
          }else{
            callback(new Error('请输入正确的官费，非零正数小数点保留两位'));
          };
        }else{
          callback(new Error('请输入正确的官费，非零正数小数点保留两位'));
        };
      }else if(this.form.orderList[index].governmentFeeStatus && this.form.orderList[index].orderDetail.tailGovernment == null){
        if(!pattern.test(value)){
          callback(new Error('请输入正确的官费，非零正数小数点保留两位'));
        }else{
          callback();
        };
      }else{
        callback();
      };
    };
    var tailAgentValidator = (rule, value, callback)=>{
      let index = rule.field.match(/.(\d)./)[1];
      let pattern = /^(?!0\d|[0.]+$)\d+(\.\d{1,2})?$/;
      if(this.form.orderList[index].tailAgentStatus == '2'){
        if(value){
          if(pattern.test(value)){
              callback();
          }else{
            callback(new Error('金额须为非零正数,最多两位小数'));
          };
        }else{
          callback(new Error('金额须为非零正数,最多两位小数'));
        };
      }else{
        callback();
      };
    };
    var tailThirdValidator = (rule, value, callback)=>{
      let index = rule.field.match(/.(\d)./)[1];
      let pattern = /^(?!0\d|[0.]+$)\d+(\.\d{1,2})?$/;
      if(this.form.orderList[index].tailThirdStatus == '2'){
        if(value){
          if(pattern.test(value)){
             callback();
          }else{
            callback(new Error('金额须为非零正数,最多两位小数'));
          };
        }else{
          callback(new Error('金额须为非零正数,最多两位小数'));
        };
      }else{
        callback();
      };
    };
    var tailGovernmentValidator = (rule, value, callback)=>{
      let index = rule.field.match(/.(\d)./)[1];
      let pattern = /^(?!0\d|[0.]+$)\d+(\.\d{1,2})?$/;
      if(this.form.orderList[index].tailGovernmentStatus == '2'){
        if(value){
          if(pattern.test(value)){
             callback();
          }else{
            callback(new Error('金额须为非零正数,最多两位小数'));
          };
        }else{
          callback(new Error('金额须为非零正数,最多两位小数'));
        };
      }else{
        callback();
      };
    };
    var offlineAgencyFeeValidator = (rule, value, callback)=>{
      let pattern = /^(?!0\d|[0.]+$)\d+(\.\d{1,2})?$/;//两位小数正数
      if(this.offlineForm.agencyFeeStatus){
        if(value){
          if(pattern.test(value)){
            callback();
          }else{
            callback(new Error('请输入正确的代理费，非零正数小数点保留两位'));
          };
        }else{
          callback(new Error('请输入正确的代理费，非零正数小数点保留两位'));
        };
      }else{
        callback();
      };
    };
    var offlineThirdPartyFeeValidator  = (rule, value, callback)=>{
      let pattern = /^(?!0\d|[0.]+$)\d+(\.\d{1,2})?$/;//两位小数正数
      if(this.offlineForm.thirdPartyFeeStatus){
        if(value){
          if(pattern.test(value)){
            callback();
          }else{
            callback(new Error('请输入正确的代理费，非零正数小数点保留两位'));
          };
        }else{
          callback(new Error('请输入正确的代理费，非零正数小数点保留两位'));
        };
      }else{
        callback();
      };
    };
    var offlineGovernmentFeeValidator = (rule, value, callback)=>{
      let pattern = /^(?!0\d|[0.]+$)\d+(\.\d{1,2})?$/;//两位小数正数
      if(this.offlineForm.governmentFeeStatus){
        if(value){
          if(pattern.test(value)){
            callback();
          }else{
            callback(new Error('请输入正确的代理费，非零正数小数点保留两位'));
          };
        }else{
          callback(new Error('请输入正确的代理费，非零正数小数点保留两位'));
        };
      }else{
        callback();
      };
    };
    var contractNoValidate = (rule, value, callback)=>{
      if(value){
        let num = value.replace(/\D/g, '').length;;
        if(value && num>8){
          callback(new Error('请检查线下合同编号不要与线上合同编号冲突！'))
        }else{
          callback();
        }
      }else{
        callback(new Error('请输入线下合同编号！'))
      };
    };
    return {
      orderSumStatus: false,
      receiveFeeForm: {},
      receiveOrderDialog: false,
      form: {
        orderList: []
      },
      offlineForm:{
        agencyFee:'',
        thirdPartyFee:'',
        governmentFee:''
      },
      online: true,
      orderSum: 0,
      rules:{
        agencyFee:[{required: true, validator: agencyFeeValidator,trigger:'blur'}],
        payAll:[{required:true,message:'请选择尾款状态',trigger: 'blur'}],
        thirdPartyFee: [{required: true, validator: thirdPartyFeeValidator, trigger:'blur'}],
        governmentFee: [{required: true, validator: governmentFeeValidator, trigger:'blur'}],
        tailAgent: [{required: true, validator: tailAgentValidator, trigger:'blur'}],
        tailThird: [{required: true, validator: tailThirdValidator, trigger:'blur'}],
        tailGovernment: [{required: true, validator: tailGovernmentValidator, trigger:'blur'}],
      },
      offlineRules:{
        agencyFee:[{required: true, validator: offlineAgencyFeeValidator,trigger:'blur'}],
        thirdPartyFee: [{required: true, validator: offlineThirdPartyFeeValidator, trigger:'blur'}],
        governmentFee: [{required: true, validator: offlineGovernmentFeeValidator, trigger:'blur'}],
        contractNo:[{required: true, validator:contractNoValidate,trigger:'blur'}]
      }
    }
  },
  watch:{
    'offlineForm':{
      handler:function(newName, oldName){
        this.orderSum = 0;
        this.orderSum += this.offlineForm.agencyFee*100;
        this.orderSum += this.offlineForm.thirdPartyFee*100;
        this.orderSum += this.offlineForm.governmentFee*100;
        if(this.orderSum == this.receiveAmount){
          // this.$emit('orderSum',true);
          // this.$emit('orderList',[this.offlineForm]);
          this.orderSumStatus = true
        }else{
          // this.$emit('orderSum', false);
          this.orderSumStatus = false;
        };
      },
      deep: true,
      immediate: true
    },
    'form.orderList': {//深度监听tableOption下的column数组
      handler:function(newName, oldName) {
        if(this.online){
          this.orderSum = 0;
          this.form.orderList.forEach(item => {
            if(item.agencyFee*100 == item.orderDetail.tailAgent){
              item.tailAgentStatus = '0';
              item.tailAgent = 0;
            }else if(item.agencyFee*100 < item.orderDetail.tailAgent){
              item.tailAgentStatus = '2';
              item.tailAgent = (item.orderDetail.tailAgent-item.agencyFee*100)/100;
            }else if(item.orderDetail.tailAgent){
              item.tailAgent = (item.orderDetail.tailAgent-item.agencyFee*100)/100;
            };
            if(item.thirdPartyFee*100 == item.orderDetail.tailThird){
              item.tailThirdStatus = '0';
              item.tailThird = 0;
            }else if(item.thirdPartyFee*100 < item.orderDetail.tailThird){
              item.tailThirdStatus = '2';
              item.tailThird = (item.orderDetail.tailThird-item.thirdPartyFee*100)/100;
            }else if(item.orderDetail.tailThird){
              item.tailThird = (item.orderDetail.tailThird-item.thirdPartyFee*100)/100;
            };
            if(item.governmentFee*100 == item.orderDetail.tailGovernment){
              item.tailGovernmentStatus = '0';
              item.tailGovernment = 0;
            }else if(item.governmentFee*100 < item.orderDetail.tailGovernment){
              item.tailGovernmentStatus = '2';
              item.tailGovernment = (item.orderDetail.tailGovernment-item.governmentFee*100)/100;
            }else if(item.orderDetail.tailGovernment){
              item.tailGovernment = (item.orderDetail.tailGovernment-item.governmentFee*100)/100;
            };
            if(item.agencyFee){
              this.orderSum += item.agencyFee*100
            };
            if(item.thirdPartyFee){
              this.orderSum += item.thirdPartyFee*100
            };
            if(item.governmentFee){
              this.orderSum += item.governmentFee*100
            };
          });
          if(this.orderSum == this.receiveAmount){
            // this.$emit('orderSum',true);
            // this.$emit('orderList',this.form.orderList);
            this.orderSumStatus = true;
          }else{
            // this.$emit('orderSum',false);
            this.orderSumStatus = false;
          }
        }else{

        };
      },
      deep: true,
      immediate: true
    }
  },
  mounted(){

  },
  methods:{
    changeOffline(){
      this.form.orderList = [];
      this.orderSum = 0;
      this.orderSumStatus = false;
    },
    changeOnline(){
      this.offlineForm = {
        agencyFee:'',
        thirdPartyFee:'',
        governmentFee:''
      },
      this.orderSum = 0;
      this.orderSumStatus = false;
    },
    lastStep(){
      this.$emit('lastStep')
    },
    confirmReceive(){
      if(this.online){
        this.form.orderList.forEach(item => {
          if(item.tailAgentStatus == '0'){
            item.tailAgent = 0;
          };
          if(item.tailThirdStatus == '0'){
            item.tailThird = 0;
          };
          if(item.tailGovernmentStatus == '0'){
            item.tailGovernment = 0;
          };
          item.receiveNo = this.receiveNo
        });
        this.$refs.form.validate((valid)=>{
          if(valid){
            receiveData.claim({list:this.form.orderList}).then(res=>{
              if(res){
                // this.commitSuccess = true;
                this.$emit('commitSuccess', true);
              }
            });
          }else{
            return false;
          };
        })
      }else{
        this.$refs.offlineForm.validate((valid)=>{
          if(valid){
            this.$set(this.offlineForm,'id',this.feeId);
            this.$set(this.offlineForm,'clueId',this.clueId);
            this.$set(this.offlineForm,'customerName',this.customerName);
            this.$set(this.offlineForm,'tailAgent', '');
            this.$set(this.offlineForm,'tailThird', '');
            this.$set(this.offlineForm,'tailGovernment', '');
            this.$set(this.offlineForm,'receiveNo', this.receiveNo);
            receiveData.claim({list:[this.offlineForm]}).then(res=>{
              if(res){
                // this.commitSuccess = true;
                this.$emit('commitSuccess', true);
              }
            });
          }else{
            return false;
          };
        })
      };
    },
    selectOffline(){
      this.form.orderList.push({
        tailAgentStatus: 1,
        tailThirdStatus: 1,
        tailGovernmentStatus: 1,
        id: this.feeId,
        clueId: this.clueId,
        customerName: this.customerName
      })
    },
    closeDialog(val){
      this.receiveOrderDialog = val;
    },
    deleteProduct(row){
      this.form.orderList.forEach((item, index)=> {
        if(row.orderNo == item.orderNo){
          this.form.orderList.splice(index,1);
        }else{

        };
      });
    },
    getOrders(row){
      this.form.orderList.push(...row);
      this.form.orderList.forEach(item => {
        this.$set(item,'tailAgentStatus','1');
        this.$set(item,'tailThirdStatus','1');
        this.$set(item,'tailGovernmentStatus','1');
        this.$set(item,'id',this.feeId);
        this.$set(item,'clueId',this.clueId);
        this.$set(item,'customerName',this.customerName);
        this.$set(item,'orderContractForm',item.orderDetail);
      });
      this.receiveOrderDialog = false;
    },
    hasSelected(row){
      if(row.agencyFeeStatus == false){
        row.agencyFee = null;
        row.tailAgent = null;
        this.$set(row,'tailAgentStatus', '1');
        this.$refs.form.clearValidate();
      };
      if(row.thirdPartyFeeStatus == false){
        row.thirdPartyFee = null;
        row.tailThird = null;
        this.$set(row,'tailThirdStatus', '1');
        this.$refs.form.clearValidate();
      };
      if(row.governmentFeeStatus == false){
        row.governmentFee = null;
        row.tailGovernment = null;
        this.$set(row,'tailGovernmentStatus', '1');
        this.$refs.form.clearValidate();
      };
    },
    changeFinalPay(row){
      if(row.tailAgentStatus != 2){
        this.$set(row,'tailAgent',null);
      }else{

      };
      if(row.tailThirdStatus != 2){
        this.$set(row,'tailThird',null);
      }else{

      };
      if(row.tailGovernmentStatus != 2){
        this.$set(row,'tailGovernment',null);
      }else{

      };
    },
  }
}
</script>

<style scoped>
.receive_frame{
  width: 1070px;
}
.order_radio{
  width: 100%;
  float: left;
}
.orders_number{
  width: 170px;
}
.fee_detail{
  display: flex;
  /* height: 35px; */
  line-height: 35px;
}
.final_fee{
  margin-left: 15px;
  display: flex;
}
.fee-label{
  width: 110px;
}
.uncleared{
  width: 153px;
  margin-left: 5px;
}
.final-pay{
  margin-top: 0;
}
.negative{
  font-size: 12px;
  color: #FF9900;
}
.total{
  font-size: 16px;
  font-weight: 550;
  margin-right: 10px;
}
.commit-receviable{
  text-align: center;
}
</style>