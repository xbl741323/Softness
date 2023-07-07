<template>
  <div class="signing">
    <span class="signing-spa">签约信息</span>
    <div class="signing-info">
      <p><span>客户编号：</span>{{signingInfo.clueAccount.number}}({{signingInfo.clueAccount.clueType | clueType}})</p>
      <p><span>合同编号：</span><a class="contract" @click="checkContract()">{{signingInfo.contractNo}}</a></p>
      <p><span>客户名称：</span>{{signingInfo.customerName}}</p>
      <p><span>合同金额(元)：</span>{{signingInfo.contractSum | totalAmount}}</p>
      <p><span>线索编号：</span>{{signingInfo.clueAccount.clueNo}}</p>
      <p><span>客户联系人：</span>{{signingInfo.clueAccount.contactName}} {{signingInfo.clueAccount.contactMobilephone}}</p>
      <p><span>客户归属：</span>
        <el-tooltip effect="dark" :content="'工号：'+signingInfo.cusEmpNo +'   部门：'+ signingInfo.cusEmpDept" placement="top">
          <span class="empName">{{signingInfo.cusEmpName}}</span>
        </el-tooltip> 
      </p>
      <p><span>客户签约人：</span>{{signingInfo.contract.signName}} {{signingInfo.contract.signMobilephone}}</p>
      <p><span>线索归属：</span>
        <el-tooltip effect="dark" :content="'工号：'+signingInfo.cluEmpNo +'   部门：'+ signingInfo.cluEmpDept" placement="top">
          <span class="empName">{{signingInfo.cluEmpName}}</span>
        </el-tooltip>
      </p>
      <p><span>签约时间：</span>{{signingInfo.signTime}}</p>
      <p><span>业务员：</span>
        <el-tooltip effect="dark" :content="'工号：'+signingInfo.saleEmpNo +'   部门：'+ signingInfo.saleEmpDept" placement="top">
          <span class="empName">{{signingInfo.saleEmpName}}</span>
        </el-tooltip> 
      </p>
      <p><span>合同附件：</span>
      <a class="contract-file" 
        v-if="fileType.indexOf(signingInfo.contract.attachmentName.substring(signingInfo.contract.attachmentName.lastIndexOf('.'),signingInfo.contract.attachmentName.length).toLowerCase()) >=0" 
        :href="IMG_CDN_URL+signingInfo.contract.attachmentUrl" 
        target="_blank"
      >{{ signingInfo.contract.attachmentName }}</a>
      </p>

    </div>
    <p class="note">合同备注：<span class="empName">{{signingInfo.contract.contractNote ? signingInfo.contract.contractNote : '暂无备注'}}</span></p>
  </div>
</template>

<script>
import orderData from './order-data'
import { saveDetal } from "@/util/clearDetail"
export default {
  props:{
    signingInfo:{
      type: Object,
      required: true
    }
  },
  data(){
    return{
      fileType: ['.pdf','.jpg','.png','.tiff','.psd','.jpeg','.bmp'],
      IMG_CDN_URL: process.env.VUE_APP_IMAGE_BASEURL,
    }
  },
  filters:{
    totalAmount(value){
      return orderData.totalAmount(value);
    },
    clueType(value){
      return orderData.clueType(value);
    }
  },
  methods:{
    checkContract(){
      if(this.$route.query.source == 'personal'){
        this.$router.push({
          path:'/mycontracts-detail',
          query:{
            id: this.signingInfo.contractId
          }
        });
      }else{
        this.$router.push({
          path:'/contracts-detail',
          query:{
            id: this.signingInfo.contractId
          }
        });
      }
        var path 
        if(this.$route.query.source == 'personal'){
            path ="/mycontracts-detail"
        }else{
            path ="/mycontracts-detail"
        }
        let query= {
             id: this.signingInfo.contractId
        }
        saveDetal(`${this.$route.path}`,path,query)
    }
  }
}
</script>

<style scoped>
.signing-spa{
  padding-left: 5px;
  border-left: #3e84df 3px solid;
}
.signing-info{
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: repeat(2,1fr);
}
.signing-info span{
  color: #b4b7bb;
}
.empName{
  color: #2c3e50 !important;
}
.contract{
  color: #3e84df;
  cursor: pointer;
}
.note{
  color: #b4b7bb;
}
.contract-file{
  color: #3e84df;
  cursor: pointer;
}
</style>