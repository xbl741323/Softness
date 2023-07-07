<template>
    <div class="pay-voucher">
      <el-form :model="refundForm" ref="refundForm" label-width="100px" class="form-sty" :rules="rules" >
          <p>该笔订单对应的电商订单金额是否已提现？</p>
          <el-radio-group v-model="cashFlag" class="mb-16" :rules="rules.cashFlag">
              <el-radio :label="1">是（须走审核流程）</el-radio>
              <el-radio :label="2">否（无须走审核流程）</el-radio>
          </el-radio-group>
          <div v-if="cashFlag == 1">
            <el-form-item label="退款产品：" class="pay-amount-sty">
                <span>{{ refundForm.spuName }}</span>
            </el-form-item>
            <el-form-item label="退款数量：" prop="buyNum">
                <el-input v-model="refundForm.buyNum"></el-input>
            </el-form-item>
            <el-form-item label="退款金额：" prop="paidAmount">
              <div class="flex-div">
                <el-input v-model="refundForm.paidAmount" class="amount-input">
                    <template slot="prepend">￥</template>
                </el-input>
                <p>（最多￥{{maxAmount}}可修改）</p>
              </div>
            </el-form-item>
            <el-form-item label="退款原因：" prop="reason">
                <el-select v-model="refundForm.reason" placeholder="请选择退款原因">
                    <el-option v-for="item in reasonList" :key="item.val" :label="item.title" :value="item.val"></el-option>
                </el-select>    
            </el-form-item>
          </div>
          <el-form-item label="退款截图：" prop="payVoucherUrl">
              <pay-vouncher-upload @getImgList="getImgList" ref="upload" :types="'launch-refund'"></pay-vouncher-upload>
              <div class="warn-txt">请上传对应电商订单退款截图，格式为pdf或者图片格式（JPG/PNG等），大小不超过4M。</div>
          </el-form-item>
          <el-form-item label="退款说明：">
              <el-input type="textarea" v-model="refundForm.remarks" maxlength="200" show-word-limit></el-input>
          </el-form-item>
          <div class="btn-contain">
              <el-button size="medium" class="btn-right-sty" type="primary" v-preventReClick @click="submitRefund()">提交退款</el-button>
              <el-button size="medium" @click="handleCancle()">取消</el-button>
          </div>
      </el-form>
    </div>
</template>
  
  <script>

    import payVouncherUpload from "@/components/upload/pay-vouncher-upload"
    import orderData from "@/components/order/order-data.js";
    import { insertRefund } from '@/api/processmanage/refund'
    export default {
        components:{
          payVouncherUpload
        },
        props:{
          form:{
            type: Object,
            require: false,
          }
        },
        data() {
          var checkNum = (rule,value,callback) => {
            console.log(this.maxNum);
            if (value > this.maxNum) {
              callback(new Error('退款数量不可超出购买数量！'))
            } else {
              callback();
            }

          };
          var checkAmount = (rule,value,callback) => {
            if (value > this.maxAmount) {
              callback(new Error('退款金额不可超出支付金额！'))
            } else {
              callback();
            }

          };
          return {
              reasonList: orderData.refundReasonList,
              cashFlag: 1,
              refundForm: {
                  remarks: "",
                  payVoucherUrl: "",
              },
              maxNum: null,
              maxAmount: null,
              oldData: {},
              rules: {
                  buyNum: [
                    { required: true, message: '请填写退款数量', trigger: "blur" },
                    { pattern: /^[1-9]\d*$/, message: '请输入正整数',trigger:'blur'},
                    { message: "", validator: checkNum, trigger: "blur"},
                  ],
                  paidAmount: [
                    { required: true, message: '请填写退款金额', trigger: "blur" },
                    { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '最多十位整数,小数点取两位',trigger:'blur'},
                    { message: "", validator: checkAmount, trigger: "blur"},
                  ],
                  cashFlag: [{ required: true, message: '请选择是否选项', trigger: "change" }],
                  reason: [{ required: true, message: '请选择退款原因', trigger: "change" }],
                  payVoucherUrl: [{ required: true, message: '请上传支付凭证', trigger: "change" }],
              },
          };
        },
        mounted(){    
          this.refundForm = this.form;
          this.maxNum = this.form.buyNum;
          this.maxAmount = this.form.paidAmount; 
        },
        methods: {
        // 获取退款截图url
        getImgList(val){
            if(val.length>0){
              this.refundForm.payVoucherUrl = val[0].response.data
            }else{
              this.refundForm.payVoucherUrl = ''
            }
        },
        // 点击取消按钮
        handleCancle() {
            this.refundForm = this.oldData;
            this.maxAmount = this.maxNum = null;
            this.$emit("closeBox");
        },
        // 提交退款按钮
        submitRefund(){
            this.$refs['refundForm'].validate((valid)=>{
              if(valid){
              // 调用上传接口
                this.launchRefund()
              }
            })
        },
        // 发起退款接口
        launchRefund(){
            let params = {
              userNo: this.refundForm.userNo,
              accountName: this.refundForm.contactName,
              accountId: this.refundForm.accountId,
              customerName: this.refundForm.subjectName,
              orderId: this.refundForm.id,
              accountMobile: this.refundForm.contactMobile,
              userId: this.refundForm.userId,
              cashFlag: this.cashFlag,
              spuName: this.refundForm.spuName,
              refundNum: this.refundForm.buyNum,
              refundAmount: this.refundForm.paidAmount,
              refundReason: this.cashFlag == 1 ? this.refundForm.reason : 9,
              refundPicUrl: this.refundForm.payVoucherUrl,
              description: this.refundForm.remarks,
            }
            insertRefund(params).then(res=>{
              if(res.data.code == CodeMsg.CODE_0){
                let info = this.cashFlag == 1 ? '提交退款成功，请等待审核！' : '退款成功！'
                this.$offsetMessage({
                    message: info,
                    type: 'success',
                });
                  this.$emit("closeBox");
                  this.$emit("refresh");
              }else{
                  this.$offsetMessage({
                      message: res.data.msg,
                      type: 'warning',
                  });
              }
            })
        },
        },
    };
  </script>
  
  <style scoped>
  .pay-voucher {
    margin-top: -20px;
    padding-right: 20px;
  }
  .flex-div{
    display: flex;
    align-items: center;
  }
  .amount-input{
    max-width: 300px;
  }
  .flex-div p{
    margin: 0
  }
  .warn-txt{
    font-size: 14px;
    color: #E6A23C;
  }
  .mb-16{
    margin-bottom: 16px;
  }
  .have-to{
    margin-left: -100px;
  }
  .pay-tab-sty {
    width: 130px;
    height: 30px;
    text-align: center;
    color: #409eff;
    border-bottom: 2px solid #409eff;
    margin-top: 20px;
  }
  .form-sty {
    margin-top: 10px;
  }
  .btn-contain {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 10px;
  }
  .btn-right-sty {
    margin-right: 120px;
  }
  .pay-input-sty{
    margin-bottom: 5px;
  }
  .pay-amount-sty{
    margin-bottom: 10px;
  }
  </style>