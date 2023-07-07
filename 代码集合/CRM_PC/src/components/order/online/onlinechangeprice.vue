<!--排查完成-->
<template>
  <div>
    <div class="edit-order-frame">
        <div class="spu-title">
          <h3>订单：{{attrForm.spuTitle}}</h3>
        </div>
        <el-form :model="attrForm" ref="attrForm" :rules="attrRules" inline>
          <el-form-item label="产品数量：">
            <el-input-number :disabled="((attrForm.orderStatus != 0&&attrForm.orderStatus != 1)&&attrForm.orderStatus != 1) || attrForm.depositTransfer || attrForm.finalTransfer || attrForm.dueTransfer" :min="1" :max="99" v-model="attrForm.buyNum" />
          </el-form-item>
          <el-form-item label="规格属性：">
            <span>{{attrForm.spec}}</span>
          </el-form-item>
          <p>支付方式及费用：</p>
          <template>
            <el-radio :disabled='(attrForm.orderStatus != 0&&attrForm.orderStatus != 1) || attrForm.depositTransfer || attrForm.finalTransfer || attrForm.dueTransfer||(attrForm.payStatus===0&&attrForm.orderStatus==2&&attrForm.payTimesType==2)' @change="getRadio(1)"  v-model="attrForm.payTimesType" :label="1">方式1：定金+尾款</el-radio>
            <div style="display: flex;">
              <p class="spa-title">定金 </p>
              <el-form-item style="display:flex;margin-right:5px;" prop="depositTypeAgencyFee">
                <el-checkbox label="代理费： " :disabled='(attrForm.orderStatus != 0&&attrForm.orderStatus != 1) || attrForm.payTimesType != 1 || attrForm.depositTransfer' v-model="attrForm.checkDepositAgent" @change="reset(attrForm,'depositTypeAgencyFee','checkDepositAgent', 0)"></el-checkbox>
                <el-input style="width:100px" :disabled='(!attrForm.checkDepositAgent || (attrForm.orderStatus != 0&&attrForm.orderStatus != 1) || attrForm.depositTransfer)' v-model.number="attrForm.depositTypeAgencyFee" />
              </el-form-item>
              <el-form-item style="display:flex;margin-right:5px;" prop="depositTypeThirdPartyFee">
                <el-checkbox label="第三方费用：" :disabled='(attrForm.orderStatus != 0&&attrForm.orderStatus != 1) || attrForm.payTimesType != 1 || attrForm.depositTransfer' v-model="attrForm.checkDepositThird" @change="reset(attrForm,'depositTypeThirdPartyFee','checkDepositThird', 0)"></el-checkbox>
                <el-input style="width:100px" :disabled='(!attrForm.checkDepositThird || (attrForm.orderStatus != 0&&attrForm.orderStatus != 1) || attrForm.depositTransfer)' v-model.number="attrForm.depositTypeThirdPartyFee"/>
              </el-form-item>
              <el-form-item style="display:flex;margin-right:5px" prop="depositTypeOfficialFee">
                <el-checkbox label="官费：" :disabled='(attrForm.orderStatus != 0&&attrForm.orderStatus != 1) || attrForm.payTimesType != 1 || attrForm.depositTransfer' v-model="attrForm.checkDepositGovernment" @change="reset(attrForm,'depositTypeOfficialFee','checkDepositGovernment', 0)"></el-checkbox>
                <el-input style="width:100px" :disabled='(!attrForm.checkDepositGovernment || (attrForm.orderStatus != 0&&attrForm.orderStatus != 1) || attrForm.depositTransfer)' v-model.number="attrForm.depositTypeOfficialFee" />
              </el-form-item>
            </div>
            <div style="display: flex;">
              <p class="spa-title">尾款 </p> 
              <el-form-item style="display:flex;margin-right:5px;" prop="finalTypeAgencyFee">
                <el-checkbox label="代理费：" :disabled='attrForm.tailStatus == 2 || attrForm.payTimesType != 1 || attrForm.finalTransfer' v-model="attrForm.checkFinalAgent" @change="reset(attrForm,'finalTypeAgencyFee','checkFinalAgent', 1)"></el-checkbox>
                <el-input style="width:100px" :disabled='!attrForm.checkFinalAgent || attrForm.finalTransfer' v-model.number="attrForm.finalTypeAgencyFee" />
              </el-form-item>
              <el-form-item style="display:flex;margin-right:5px;" prop="finalTypeThirdPartyFee">
                <el-checkbox label="第三方费用：" :disabled='attrForm.tailStatus == 2 || attrForm.payTimesType != 1 || attrForm.finalTransfer' v-model="attrForm.checkFinalThird" @change="reset(attrForm,'finalTypeThirdPartyFee','checkFinalThird', 1)"></el-checkbox>
                <el-input style="width:100px" :disabled='!attrForm.checkFinalThird || attrForm.finalTransfer' v-model.number="attrForm.finalTypeThirdPartyFee"/>
              </el-form-item>
              <el-form-item style="display:flex;margin-right:5px">
                <el-checkbox label="尾款待定" :disabled='attrForm.tailStatus == 2 || attrForm.payTimesType != 1 || attrForm.finalTransfer' v-model="attrForm.checkUndetermined" @change="resetFinal( attrForm, ['finalTypeThirdPartyFee','finalTypeAgencyFee','checkFinalThird','checkFinalAgent'])"></el-checkbox>
              </el-form-item>
            </div>
            <el-radio :disabled='(attrForm.orderStatus != 0&&attrForm.orderStatus != 1) || attrForm.depositTransfer || attrForm.finalTransfer || attrForm.dueTransfer||(attrForm.payStatus===0&&attrForm.orderStatus==2&&attrForm.payTimesType==2)' @change="getRadio(2)" v-model="attrForm.payTimesType" :label="2">方式2：一口价</el-radio>
            <div style="display: flex;">
              <p class="spa-title">一口价 </p>
              <el-form-item style="display:flex;margin-right:5px;" prop="dueTypeAgencyFee">
                <el-checkbox label="代理费：" :disabled='(attrForm.payStatus===0&&attrForm.orderStatus==2&&attrForm.payTimesType==2)?false:(attrForm.orderStatus != 0&&attrForm.orderStatus != 1) || attrForm.payTimesType != 2 || attrForm.dueTransfer' v-model="attrForm.checkFixedAgent" @change="reset(attrForm,'dueTypeAgencyFee','checkFixedAgent', 2)"></el-checkbox>
                <el-input style="width:100px" :disabled='(!attrForm.checkFixedAgent && (attrForm.orderStatus != 0&&attrForm.orderStatus != 1)) || attrForm.payTimesType != 2 || attrForm.dueTransfer' v-model.number="attrForm.dueTypeAgencyFee" />
              </el-form-item>
              <el-form-item style="display:flex;margin-right:5px;" prop="dueTypeThirdPartyFee">
                <el-checkbox label="第三方费用：" :disabled='(attrForm.payStatus===0&&attrForm.orderStatus==2&&attrForm.payTimesType==2)?false:(attrForm.orderStatus != 0&&attrForm.orderStatus != 1) || attrForm.payTimesType != 2 || attrForm.dueTransfer' v-model="attrForm.checkFixedThird" @change="reset(attrForm,'dueTypeThirdPartyFee','checkFixedThird', 2)"></el-checkbox>
                <el-input style="width:100px" :disabled='(!attrForm.checkFixedThird && (attrForm.orderStatus != 0&&attrForm.orderStatus != 1)) || attrForm.payTimesType != 2 || attrForm.dueTransfer' v-model.number="attrForm.dueTypeThirdPartyFee"/>
              </el-form-item>
              <el-form-item style="display:flex;margin-right:5px" prop="dueTypeOfficialFee">
                <el-checkbox label="官费：" :disabled='(attrForm.payStatus===0&&attrForm.orderStatus==2&&attrForm.payTimesType==2)?false:(attrForm.orderStatus != 0&&attrForm.orderStatus != 1) || attrForm.payTimesType != 2 || attrForm.dueTransfer' v-model="attrForm.checkFixedGovernment" @change="reset(attrForm,'dueTypeOfficialFee','checkFixedGovernment', 2)"></el-checkbox>
                <el-input style="width:100px" :disabled='(!attrForm.checkFixedGovernment && (attrForm.orderStatus != 0&&attrForm.orderStatus != 1)) || attrForm.payTimesType != 2 || attrForm.dueTransfer' v-model.number="attrForm.dueTypeOfficialFee" />
              </el-form-item>
            </div>
          </template>
        </el-form>
        <div>
            <p>订单原价：<span>{{isWaiting ? '待定' : originalAmount * attrForm.buyNum}}</span></p>
            <p>订单现价：<span>{{this.attrForm.checkUndetermined ? '待定' : currentAmount}}</span></p>
        </div>
      </div>
    <div class="order-edit-btn">
      <el-button type="primary" @click="submit()">确 定</el-button>
      <el-button type="warning" @click="closeDialog()">取 消</el-button>
    </div>
    <!-- 审核 -->
    <el-dialog :visible.sync="auditDialog" :close-on-click-modal="false" :modal="false" :model="auditDialog" :modal-append-to-body="false" title="提交审核" width="550px">
      <p>订单发生了改价,需要先审核,请先选择审核人。审核通过后,方可发送给客户。</p>
      <el-form :model="auditForm" ref="auditForm" :rules="auditRules" label-width="110px">
        <el-form-item label="改价审核人：" prop="auditor">
          <el-select v-model="auditForm.auditor">
            <el-option 
              v-for="item in auditorList"
              :key="item.userId"
              :value="item.userId"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="改价备注：">
          <el-input type="textarea" :rows="3" maxlength="100" show-word-limit v-model="auditForm.remark" />
        </el-form-item>
      </el-form>
      <div class="audit-initorder">
        <el-button size="mini" type="primary" @click="confirmAudit()">提交审核</el-button>
        <el-button size="mini" @click="cancelAudit()">取消提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { saveChangePrice, needAudit, getAuditor } from "@/api/order/index";
import Vue from 'vue'
export default {
  props:{
    portType:{
      type:String,
      value:'1'
    },
    priceObject:{//价格数据
      type: Object,
    },
    source:{
      type:String,
      require:false
    }
  },
  data(){
    var depositAgency = (rule, value, callback)=>{
      let pattern = /^[1-9]\d*$/;
      if(this.attrForm.checkDepositAgent){
        if(pattern.test(value)){
          callback();
        }else{
          callback(new Error('请填写正整数金额!'));
        };
      }else{
        callback()
      };
    };
    var depositThird = (rule, value, callback)=>{
      let pattern = /^[1-9]\d*$/;
      if(this.attrForm.checkDepositThird){
        if(pattern.test(value)){
          callback();
        }else{
          callback(new Error('请填写正整数金额!'));
        };
      }else{
        callback()
      };
    };
    var depositOfficial = (rule, value, callback)=>{
      let pattern = /^[1-9]\d*$/;
      if(this.attrForm.checkDepositGovernment){
        if(pattern.test(value)){
          callback();
        }else{
          callback(new Error('请填写正整数金额!'));
        };
      }else{
        callback()
      };
    };
    var finalAgency = (rule, value, callback)=>{
      let pattern = /^[1-9]\d*$/;
      if(this.attrForm.checkFinalAgent){
        if(pattern.test(value)){
          callback();
        }else{
          callback(new Error('请填写正整数金额!'));
        };
      }else{
        callback()
      };
    };
    var finalThird = (rule, value, callback)=>{
      let pattern = /^[1-9]\d*$/;
      if(this.attrForm.checkFinalThird){
        if(pattern.test(value)){
          callback();
        }else{
          callback(new Error('请填写正整数金额!'));
        };
      }else{
        callback()
      };
    };
    var fixedAgency = (rule, value, callback)=>{
      let pattern = /^[1-9]\d*$/;
      if(this.attrForm.checkFixedAgent){
        if(pattern.test(value)){
          callback();
        }else{
          callback(new Error('请填写正整数金额!'));
        };
      }else{
        callback()
      };
    };
    var fixedThird = (rule, value, callback)=>{
      let pattern = /^[1-9]\d*$/;
      if(this.attrForm.checkFixedThird){
        if(pattern.test(value)){
          callback();
        }else{
          callback(new Error('请填写正整数金额!'));
        };
      }else{
        callback()
      };
    };
    var fixedOfficial = (rule, value, callback)=>{
      let pattern = /^[1-9]\d*$/;
      if(this.attrForm.checkFixedGovernment){
        if(pattern.test(value)){
          callback();
        }else{
          callback(new Error('请填写正整数金额!'));
        };
      }else{
        callback()
      };
    };
    return {
        attrForm: {},
        priceParam: {},
        attrRules: {
          depositTypeAgencyFee: [{required: true, validator:depositAgency, trigger:'blur'}],
          depositTypeThirdPartyFee: [{required: true, validator:depositThird, trigger:'blur'}],
          depositTypeOfficialFee: [{required: true, validator:depositOfficial, trigger:'blur'}],
          finalTypeAgencyFee: [{required: true, validator:finalAgency, trigger:'blur'}],
          finalTypeThirdPartyFee: [{required: true, validator:finalThird, trigger:'blur'}],
          dueTypeAgencyFee: [{required: true, validator:fixedAgency, trigger:'blur'}],
          dueTypeThirdPartyFee: [{required: true, validator:fixedThird, trigger:'blur'}],
          dueTypeOfficialFee: [{required: true, validator:fixedOfficial, trigger:'blur'}],
        },
        originalAmount: 0,
        isWaiting: false,
        auditForm: {},
        auditRules: {
          auditor: [{required: true, message:'请选择审核人'}]
        },
        auditDialog: false,
        auditorList: [],
        totalAmount: 0
    }
  },
  created(){
    this.attrForm = JSON.parse(JSON.stringify(this.priceObject));
    this.dataProcessing();
  },
  computed:{
    currentAmount(){
        // if(this.attrForm.checkUndetermined){
        //     return '待定';
        // }else{
            return (Number(this.attrForm.depositTypeAgencyFee || 0)+ Number(this.attrForm.depositTypeThirdPartyFee  || 0)+ Number(this.attrForm.depositTypeOfficialFee || 0)+
            Number(this.attrForm.finalTypeAgencyFee || 0)+ Number(this.attrForm.finalTypeThirdPartyFee || 0)+ Number(this.attrForm.dueTypeAgencyFee || 0)+
            Number(this.attrForm.dueTypeThirdPartyFee || 0)+ Number(this.attrForm.dueTypeOfficialFee || 0))*this.attrForm.buyNum || '待定';
        // };
    }
  },
  methods:{
    confirmAudit(){
      this.$refs.auditForm.validate(valid =>{
        if(valid){
          this.auditorList.forEach(el => {
            if(this.auditForm.auditor == el.userId){
              this.priceParam.orderStatus = this.attrForm.orderStatus;
              this.priceParam.subjectName = this.attrForm.subjectName;
              this.priceParam.handleBy = el.userId;
              this.priceParam.handleByNo = el.number;
              this.priceParam.handleByName = el.name;
              this.priceParam.changePriceRemark = this.auditForm.remark;
            }
          });
          this.confirmCreateOrder('提交审核成功!');
        }
      })
    },
    cancelAudit(){
      this.auditDialog = false;
      this.auditForm = {};
    },
    getRadio(type){
        let num = this.attrForm.buyNum;
        this.attrForm = JSON.parse(JSON.stringify(this.priceObject));
        this.$set(this.attrForm,'payTimesType', type);
        this.$set(this.attrForm,'buyNum', num);
        this.$set(this.attrForm,'checkDepositAgent',type == 1 ? true : false);
        this.$set(this.attrForm,'checkDepositThird', false);
        this.$set(this.attrForm,'checkDepositGovernment', false);
        this.$set(this.attrForm,'checkFinalAgent', type == 1 ? true : false);
        this.$set(this.attrForm,'checkFinalThird', false);
        this.$set(this.attrForm,'checkUndetermined', false);
        this.$set(this.attrForm,'checkFixedAgent', type == 2 ? true : false);
        this.$set(this.attrForm,'checkFixedThird', false);
        this.$set(this.attrForm,'checkFixedGovernment', false);
    },
    reset(row, val, checkName, type){// type: 0-定金 1-尾款 2-一口价
      let depositObj = {
        checkDepositAgent: row.checkDepositAgent || false,
        checkDepositThird: row.checkDepositThird || false,
        checkDepositGovernment: row.checkDepositGovernment || false
      };
      let finalObj = {
        checkFinalAgent: row.checkFinalAgent || false,
        checkFinalThird: row.checkFinalThird || false,
        checkUndetermined: row.checkUndetermined || false
      };
      let fixedObj = {
        checkFixedAgent: row.checkFixedAgent || false,
        checkFixedThird: row.checkFixedThird || false,
        checkFixedGovernment: row.checkFixedGovernment || false
      };
      if(
        (type == 0 && Object.values(depositObj).join(',').match(/true/g) == null) || 
        (type == 1 && Object.values(finalObj).join(',').match(/true/g) == null) || 
        (type == 2 && Object.values(fixedObj).join(',').match(/true/g) == null)
      ){
        this.$set(row, checkName, true);
        this.$message({
          type: 'warning',
          message: '最少勾选一项价格！'
        })
      }else{
        this.$set(row,val,null);
        Vue.delete(row,val);
        if(row.checkFinalThird || row.checkFinalAgent){
          this.$set(row,'checkUndetermined',false);
          Vue.delete(row,'finalTypePendingFee');
        };
      };
    },
    resetFinal(row,val){
        this.$set(row,'finalTypePendingFee',0);
        this.$set(row,val[0],null);
        this.$set(row,val[1],null);
        this.$set(row,val[2],false);
        this.$set(row,val[3],false);
        Vue.delete(row,val[0]);
        Vue.delete(row,val[1]);
    },
    dataProcessing(){
        //tailStatus 尾款状态（0：待定；1：待付款；2：已结清；3：无）
        this.originalAmount = 0;//原总价
        this.attrForm.payTypeVoList.forEach( el => {
            if(el.payTypeId == 1){//支付类型(1:定金；2:尾款；3:一口价)
                this.$set(this.attrForm,'payTimesType', 1);
                if(el.payStatus == 1){//支付状态：0待付款 1支付中 2支付成功  3支付失败
                  this.$set(this.attrForm,'depositTransfer', true);
                }
                el.payCostList.forEach( fee => {
                    this.originalAmount += fee.costAmount;
                    if(fee.costTypeId == 1){// 费用类型（1:代理费;2:第三方费用;3:官费;4:待定）
                        if(fee.costAmount){
                            this.$set(this.attrForm,'depositTypeAgencyFee', fee.costAmount);
                            this.$set(this.attrForm,'checkDepositAgent', true);
                        }
                    }else if(fee.costTypeId == 2){
                        if(fee.costAmount){
                            this.$set(this.attrForm, 'checkDepositThird', true);
                            this.$set(this.attrForm, 'depositTypeThirdPartyFee', fee.costAmount);
                        }
                    }else if(fee.costTypeId == 3){
                        if(fee.costAmount){
                            this.$set(this.attrForm, 'checkDepositGovernment', true);
                            this.$set(this.attrForm, 'depositTypeOfficialFee', fee.costAmount);
                        }
                    }else{
                    };
                });
            };
            if(el.payTypeId == 2){//支付类型(1:定金；2:尾款；3:一口价)
                this.$set(this.attrForm,'payTimesType', 1);
                if(el.payStatus == 1){//支付状态：0待付款 1支付中 2支付成功  3支付失败
                  this.$set(this.attrForm,'finalTransfer', true);
                }
                el.payCostList.forEach( fee => {
                    this.originalAmount += fee.costAmount;
                    if(fee.costTypeId == 1){// 费用类型（1:代理费;2:第三方费用;3:官费;4:待定）
                        if(fee.costAmount){
                            this.$set(this.attrForm,'finalTypeAgencyFee', fee.costAmount);
                            this.$set(this.attrForm,'checkFinalAgent', true);
                        }
                    }else if(fee.costTypeId == 2){
                        if(fee.costAmount){
                            this.$set(this.attrForm, 'checkFinalThird', true);
                            this.$set(this.attrForm, 'finalTypeThirdPartyFee', fee.costAmount);
                        }
                    }else if(fee.costTypeId == 4){
                        this.$set(this.attrForm, 'checkUndetermined', true);
                        this.isWaiting = true;
                    }else{
                    };
                });
            };
            if(el.payTypeId == 3){//支付类型(1:定金；2:尾款；3:一口价)
                this.$set(this.attrForm,'payTimesType', 2);
                if(el.payStatus == 1){//支付状态：0待付款 1支付中 2支付成功  3支付失败
                  this.$set(this.attrForm,'dueTransfer', true);
                }
                el.payCostList.forEach( fee => {
                    this.originalAmount += fee.costAmount;
                    if(fee.costTypeId == 1){// 费用类型（1:代理费;2:第三方费用;3:官费;4:待定）
                        if(fee.costAmount){
                            this.$set(this.attrForm,'dueTypeAgencyFee', fee.costAmount);
                            this.$set(this.attrForm,'checkFixedAgent', true);
                        }
                    }else if(fee.costTypeId == 2){
                        if(fee.costAmount){
                            this.$set(this.attrForm, 'checkFixedThird', true);
                            this.$set(this.attrForm, 'dueTypeThirdPartyFee', fee.costAmount);
                        }
                    }else if(fee.costTypeId == 3){
                        if(fee.costAmount){
                            this.$set(this.attrForm, 'checkFixedGovernment', true);
                            this.$set(this.attrForm, 'dueTypeOfficialFee', fee.costAmount);
                        }
                    }else{
                    };
                })
            };
        });
    },
    submit(){
      this.$refs.attrForm.validate(valid=>{
        if(valid){
          this.priceParam = {
            subjectName: this.attrForm.subjectName,
            orderStatus: this.attrForm.orderStatus,
            buyNum: this.attrForm.buyNum,
            currentPrice: this.currentAmount,
            originalPrice: this.attrForm.originalPrice,
            goodsSkuId: this.attrForm.goodsSkuId,
            orderNo: this.attrForm.orderNo,
            id: this.attrForm.id,
            payTypeVoList:[]
          }
          if(this.attrForm.payTimesType == 2){
            this.priceParam.payTypeVoList.push({
              payCostList:[
                {costAmount: this.attrForm.dueTypeAgencyFee || 0, costTypeId: 1},
                {costAmount: this.attrForm.dueTypeThirdPartyFee || 0, costTypeId: 2},
                {costAmount: this.attrForm.dueTypeOfficialFee || 0, costTypeId: 3},
              ],
              payTypeId:3,
              payTypeAmount: (this.attrForm.dueTypeAgencyFee || 0)+ (this.attrForm.dueTypeThirdPartyFee || 0) +(this.attrForm.dueTypeOfficialFee || 0)
            })
          };
          if(this.attrForm.payTimesType == 1){
            this.priceParam.payTypeVoList.push({
                payCostList:[
                  {costAmount: this.attrForm.depositTypeAgencyFee || 0, costTypeId: 1},
                  {costAmount: this.attrForm.depositTypeThirdPartyFee || 0, costTypeId: 2},
                  {costAmount: this.attrForm.depositTypeOfficialFee || 0, costTypeId: 3},
                ],payTypeId: 1,
                payTypeAmount: (this.attrForm.depositTypeAgencyFee || 0) +(this.attrForm.depositTypeThirdPartyFee || 0) + (this.attrForm.depositTypeOfficialFee || 0)
              },Object.assign(!this.attrForm.checkUndetermined ? 
              {
                payCostList:[
                  {costAmount: this.attrForm.finalTypeAgencyFee || 0, costTypeId: 1},
                  {costAmount: this.attrForm.finalTypeThirdPartyFee || 0, costTypeId: 2},
                ],
                payTypeId:2,
                payTypeAmount: (this.attrForm.finalTypeAgencyFee || 0) + (this.attrForm.finalTypeThirdPartyFee || 0)
              } : {
                payCostList:[
                  {costAmount: 0, costTypeId: 1},
                  {costAmount: 0, costTypeId: 2},
                  {costAmount: 0, costTypeId: 4},
                ],
                payTypeId:2,
                payTypeAmount: 0
              }
            ))
            
            this.priceParam.payTypeVoList.forEach(el => {
              this.totalAmount += el.payTypeAmount;
            });
            this.priceParam.totalAmount = this.totalAmount;
          }
          needAudit({tmOrderVoList:[this.priceParam]}).then(res=>{
            if(res.data.code == CodeMsg.CODE_0){
              if(res.data.data){
                getAuditor().then(res=>{
                  if(res.data.code == CodeMsg.CODE_0){
                    this.auditorList = res.data.data;
                    this.auditDialog = true;
                  }
                })
              }else{
                this.confirmCreateOrder('订单改价成功!');
              }
            }else{
              this.$message.warning(res.data.msg)
            }
          })
        }else{
          return false;
        };
      })
    },
    confirmCreateOrder(operate){
      saveChangePrice(this.priceParam,this.portType,this.source).then(res=>{
        if(res.data.code == 0){
          this.$message({
            type:'success',
            message: operate
          })
          this.$emit('closeChangePriceDialog',false); 
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        };
      })
    },
    closeDialog(){
      this.$emit('closeChangePriceDialog',false);
    },
  }
}
</script>
<style scoped>
.edit-order-frame{
  height: 450px;
  overflow: auto;
}
.spa-title{
  width: 90px !important;
  font-size: 14px;
  font-weight: 550;
  margin: 5px;
  margin-left: 25px;
}
.remark{
  min-width: 600px;
}
.sub-line{
  width: 100%;
  border-bottom: 1px solid #eeeeee;
}
.order-edit-btn{
  padding-top: 20px;
  text-align: center;
  border-top: 1px solid #eeeeee;
}
.spu-title{
  display: inline-flex;
}
.spu-title img{
  width: 30px;
  height: 30px;
  margin: auto 0;
  margin-left: 10px;
  cursor: pointer;
}
.radio-block{
  display: block;
  padding: 10px 0;
}
.sign-prompt{
  color: #f8ac1d;
}
.tag{
  font-size: 12px;
  color: #FFFFFF;
  border-radius: 4px;
  padding: 3px 5px;
  background: #36a6fe;
}
.warning-text{
  color: red;
  font-size: 12px;
}
.audit-initorder{
  text-align: center;
}
</style>