<template>
  <el-dialog top="5vh" :visible.sync="openVisble" v-if="openVisble" :before-close="handleCancle" title="支付凭证" width="640px" :close-on-click-modal="false">
    <div class="pay-voucher">
      <el-alert title="提示：对公转账打款请打款到下方指定账户。" type="warning" show-icon :closable="false"></el-alert>
      <div class="pay-tab-sty">支付凭证信息</div>
      <el-form :model="payForm" ref="payForm" v-if="openVisble" label-width="100px" class="form-sty" :rules="rules">
        <el-form-item label="订单编号：" class="pay-input-sty">
          <span>{{ payForm.orderNo }}</span>
        </el-form-item>
        <el-form-item label="应付金额：" class="pay-amount-sty">
          <span>￥{{ payForm.payAmount }}</span>
        </el-form-item>
       <div v-if="(categoryId == 3)">
        <el-form-item label="收款人户名：">
          <el-input v-model="enFanInfo.payeeAccountName" disabled></el-input>
        </el-form-item>
        <el-form-item label="银行卡号：">
          <el-input v-model="enFanInfo.bankCardNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="开户行：">
          <el-input v-model="enFanInfo.backName" disabled></el-input>
        </el-form-item>
       </div>
       <div v-else>
        <el-form-item label="收款人户名：">
          <el-input v-model="wotaoInfo.payeeAccountName" disabled></el-input>
        </el-form-item>
        <el-form-item label="银行卡号：">
          <el-input v-model="wotaoInfo.bankCardNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="开户行：">
          <el-input v-model="wotaoInfo.backName" disabled></el-input>
        </el-form-item>
       </div>
        <el-form-item label="备注：">
          <el-input v-model="payForm.remarks" disabled></el-input>
        </el-form-item>
        <el-form-item label="支付凭证：" prop="payVoucherUrl">
          <div>请上传银行转账凭证截图或电商已付款订单截图，格式为png、jpg、pdf等常用文件及图片格式，不超过5M。</div>
          <pay-vouncher-upload @getImgList="getImgList" ref="upload"></pay-vouncher-upload>
        </el-form-item>
        <div class="btn-contain">
          <el-button size="medium" class="btn-right-sty" type="primary" v-preventReClick @click="submitPay()">确定</el-button>
          <el-button size="medium" @click="handleCancle()">取消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import payVouncherUpload from "@/components/upload/pay-vouncher-upload"
import { launchTransferAudit } from '@/api/order/index'
import * as CodeMsg from "@/api/common/CodeChange"
export default {
  components:{
    payVouncherUpload
  },
  props:{
    portType:{
      type:String,
      require:false,
    }
  },
  data() {
    return {
      openVisble: false,
      categoryId: '',
      // 恩凡收款账户信息-用于专利产品
      enFanInfo: {
        payeeAccountName: "上海恩凡知识产权代理有限公司",
        bankCardNo: "454681983746",
        backName: "中国银行股份有限公司上海市航华支行",
      },
      // 卧涛收款账户信息-用于项目申报和其他产品
      wotaoInfo: {
        payeeAccountName: "卧涛科技有限公司",
        bankCardNo: "12086401040008150",
        backName: "中国农业银行合肥市新政务区支行",
      },
      payForm: {
        paymentId:'',
        orderPort:'',
        addressId: null,
        orderNo: "",
        payAmount: 0,
        remarks: "",
        payVoucherUrl: "",
      },
      rules: {
        payVoucherUrl: [{ required: true, message: '请上传支付凭证', trigger: "change" }],
      },
    };
  },
  mounted(){
    console.log(this.portType,'------23');
  },
  methods: {
    // 获取对公转账凭证
    getImgList(val){
      if(val.length>0){
        this.payForm.payVoucherUrl = val[0].response.data
        this.$refs['payForm'].validate((valid)=>{})
      }else{
        this.payForm.payVoucherUrl = ''
      }
    },
    // 点击取消按钮
    handleCancle() {
      this.openVisble = false;
      this.payForm = {
        paymentId:'',
        orderPort:'',
        orderNo: "",
        payAmount: 0,
        remarks: "",
        payVoucherUrl: "",
      }
    },
    // 提交上传凭证
    submitPay(){
      this.$refs['payForm'].validate((valid)=>{
        if(valid){
         // 调用上传接口
         this.launchOperate()
        }
      })
    },
    // 上传对公转账审核
    launchOperate(){
      let params = {
        orderPort: this.payForm.orderPort,
        paymentId: this.payForm.paymentId,
        voucherUrl: this.payForm.payVoucherUrl,
        addressId: this.payForm.addressId
      }
      launchTransferAudit(params,this.portType).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message:'操作成功！',
            offset: 300
          })
          this.openVisble = false
          this.$emit("refresh")
        }else{
          this.$message({
            type: 'warning',
            message: res.data.msg,
            offset: 300
          })
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