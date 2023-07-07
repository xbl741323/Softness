<template>
  <div class="signing">
    <span class="signing-spa">签约信息</span>
    <div class="signing-info">
      <p><span>线索编号：</span>
        {{signingInfo.clueNo}}
      </p>
      <p><span>合同编号：</span>
        {{signingInfo.contractNo}}
      </p>
      <p :class="listType == 'personal' ? '' : 'task-order-no'" @click="checkTaskPermissions(listType, orderPermissions, 'permissionsOfOrderDetail') && listType != 'personal' && !currentAccountInfo.isPartner ? goOrderDetail(signingInfo.id) : (listType != 'personal' && !currentAccountInfo.isPartner ? $notAuthorized() : '')"><span>订单编号：</span>
        {{signingInfo.orderNo}}
      </p>
      <p v-if="signingInfo.attachmentName!=null"><span>合同附件：</span>
        <a style="color: #409EFF"
          v-if="fileType.indexOf(signingInfo.attachmentName.substring(signingInfo.attachmentName.lastIndexOf('.'),signingInfo.attachmentName.length).toLowerCase()) >=0" 
          :href="IMG_CDN_URL+signingInfo.attachmentUrl" 
          target="_blank">{{ signingInfo.attachmentName }}</a>
        <a style="color: #409EFF" v-else :href="signingInfo.attachmentUrl" target="_blank">{{ signingInfo.attachmentName }}</a>
      </p>
      <p v-else><span>合同附件：</span>暂无附件</p>
      <!-- 客户归属修改 -->
      <p><span>订单归属：</span>
        <el-tooltip effect="dark" :content="tooltipContent" :disabled="hidden" placement="top" v-if="Number(signingInfo.belongId)!=0">
          <span class="empName" @mouseover="showUserInfo(signingInfo.belongId)">{{signingInfo.belongName}}</span>
        </el-tooltip> 
        <span class="empName" v-else>{{signingInfo.belongName}}</span>
      </p>
      <p>
        <span>客户联系人：</span>
        {{signingInfo.contactName}} {{signingInfo.contactMobile}}
      </p>
      <p><span>线索归属：</span>
       <el-tooltip effect="dark" :content="tooltipContent" :disabled="hidden" placement="top" v-if="Number(signingInfo.clueAttributionEmpId)!=0">
          <span class="empName" @mouseover="showUserInfo(signingInfo.clueAttributionEmpId)">{{signingInfo.clueAttributionEmpName}}</span>
        </el-tooltip>
        <span class="empName" v-else>{{signingInfo.clueAttributionEmpName}}</span>
      </p>
      <p>
        <span>客户签约人：</span>
        {{signingInfo.signName}} {{signingInfo.signMobile}}
      </p>
      <p><span>业务员：</span>
        <el-tooltip effect="dark" :content="tooltipContent" :disabled="hidden" placement="top" v-if="Number(signingInfo.clueSalesmanEmpId)!=0">
          <span class="empName"  @mouseover="showUserInfo(signingInfo.clueSalesmanEmpId)">{{signingInfo.clueSalesmanEmpName}}</span>
        </el-tooltip> 
        <span class="empName" v-else>{{signingInfo.clueSalesmanEmpName}}</span>
      </p>
      <p><span>签约时间：</span>
      {{signingInfo.contractTime}}
      </p>
    </div>
  </div>
</template>

<script>
import { getSignInfo } from "@/api/task/index.js"
import { saveDetal } from "@/util/clearDetail"
import { mapGetters } from 'vuex';
import taskData from './js/task'
export default {
  props:{
    taskId:{
      type:Number,
      required:true
    },
    listType:{
      type: String,
      required:false,
      default: ''
    },
    apiInfo:{
      type: Object,
      required: true,
      default: ()=>{}
    }
  },
  data(){
    return{
      fileType: ['.pdf','.jpg','.png','.tiff','.psd','.jpeg','.bmp'],
      IMG_CDN_URL: process.env.VUE_APP_IMAGE_BASEURL,
      signingInfo:{},
      cEmpNo:"",
      cDeptName:"",
      orderPermissions: {}
    }
  },
  filters:{
    totalAmount(value){
      return value == null ? '待定' : (value/100).toFixed(2);
    },
    clueType(value){
      return value == 0 ? '个人' : value == 1 ? '单位' : '';
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted(){
    console.log(2121);
    this.getInfo()
  },
  methods:{
    getInfo(){
      let params ={
        id:this.taskId,
      }
      if(this.listType =='personal'){
        params.listType="personal"
      }
      getSignInfo(params, this.apiInfo).then(res=>{
        this.signingInfo = res.data.data
        if(this.listType != 'personal'){//获取当前类型订单权限
          [this.orderPermissions] = taskData.permissionsOfOrder.filter(item => item.type.indexOf(this.signingInfo.categoryId) > -1);
        }
      })
    },
    goOrderDetail(orderId){
      let path ="/orderonline-detail"
      let query = {
        orderId,
        source: 'list',
        noButton:'really',
        portType: this.signingInfo.categoryId
      }
      saveDetal(`${this.$route.path}`,path,query)
      this.$router.push({path,query})
    }
  }
}
</script>

<style scoped>
.signing{
    margin-top: 5px;
    color: #666666b5;
    font-size: 14px;
}
.signing-spa{
  color: #2c3e50;
  font-weight: 600;
  padding-left: 6px;
  border-left: #3e84df 3px solid;
}
.signing-info{
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: repeat(2,1fr);
  margin: 10px 0 0 10px;
  font-size: 14px;
}
.signing-info span{
  color: #2c3e50;
}
.empName{
  color: #666666b5 !important;
}
.task-order-no{
  color: #409EFF;
  cursor: pointer;
}
</style>