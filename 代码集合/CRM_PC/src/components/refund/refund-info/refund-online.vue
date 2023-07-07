<template>
  <div v-if="refundInfo">
    <div class="head-refund">
      <div>
        <p>退款金额</p>
        <span>{{ refundInfo.refundAmount }}</span>
      </div>
      <div>
        <p>退款类型</p>
        <div class="flex-show">
          <div v-if="refundInfo.ttRefundFeeList && refundInfo.ttRefundFeeList.length>0">
            <p v-for="(item,index) in refundInfo.ttRefundFeeList" :key="index" class="light-p">
              <span>{{ item.costTypeId | filterCostType }}</span>
              <span v-if="item.payTypeId == 1">(定金)</span>
              <span v-if="item.payTypeId == 2">(尾款)</span>
              <span v-if="refundInfo.ttRefundFeeList && index != refundInfo.ttRefundFeeList.length-1">,</span>
            </p>
          </div>
          <span v-else>待分配</span>
        </div>        
      </div>
      <div>
        <p>退款原因</p>
        <span>{{ refundInfo.refundReason | refundReason }}</span>
      </div>
      <div>
        <p>待处理人</p>
        <div>
          <p v-if="refundInfo.tmRefundApprovalList.length==0">{{refundInfo.refundStatus == 4 ? '暂无':'待分配'}}</p>
          <div v-else>
            <div v-for="item in refundInfo.tmRefundApprovalList" :key="item.id">            
              <el-tooltip effect="dark" :content="'工号：'+ empNo +' 部门：'+ deptName" placement="top">
                <span @mouseover="showUserInfo(item.handleBy)">{{item.handleByName}}</span>
              </el-tooltip>
            </div>
          </div>         
          <div class="handlers-sty" v-if="refundInfo.handlers && refundInfo.taskStatus != 5">
            <div v-for="(item, index) in refundInfo.handlers" :key="item.id" >
              <el-tooltip effect="dark" :content="'工号：' + item.handlerNo +'   部门：' +item.handlerDeptName " placement="right">
                <span >{{ item.handlerName }} <span v-if="refundInfo.handlers.length > 3 && index == 2">...</span></span>                
              </el-tooltip>
              <img v-if="item.taskCurrentStatus == 9" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" >
            </div>           
          </div>
        </div>
      </div>
      <div>
        <p>发起时间</p>
        <span>{{ refundInfo.createTime }}</span>
      </div>
      <div>
        <p>主体ID</p>
        <span>{{ refundInfo.userNo }}</span>
        <span>{{refundInfo.userType==2?'(单位)':'(个人)'}}</span>
      </div>
      <div>
        <p>用户名称</p>
        <span>{{ refundInfo.customerName }}</span>
      </div>
      <div>
        <p>联系人</p>
        <span>{{refundInfo.accountName}} {{ refundInfo.accountMobile }}</span>
      </div>
      <div>
        <p>线索归属</p>
        <div>
          <el-tooltip effect="dark" :content="'工号：'+ empNo +' 部门：'+ deptName" placement="top">
            <span @mouseover="showUserInfo(refundInfo.clueAttributionEmpId)">{{refundInfo.clueAttributionEmpName}}</span>
          </el-tooltip>
        </div>
      </div>
      <div>
        <p>订单归属</p>
        <div>
          <el-tooltip effect="dark" :content="'工号：'+ empNo +' 部门：'+ deptName" placement="top">
            <span @mouseover="showUserInfo(refundInfo.belongId)">{{refundInfo.belongName}}</span>
          </el-tooltip>
        </div>
      </div>
      <div>
        <p>业务员</p>
        <div>          
          <el-tooltip effect="dark" :content="'工号：'+ empNo +' 部门：'+ deptName" placement="top">
            <span @mouseover="showUserInfo(refundInfo.clueSalesmanEmpId)">{{refundInfo.clueSalesmanEmpName}}</span>
          </el-tooltip>
        </div>
      </div>
      <div>
        <p>退款截图</p>
        <div>    
          <span v-if="refundInfo.refundPicUrl" class="click-big-img" @click="checkRefundSnap">查看退款截图</span>      
          <p v-else>/</p>          
        </div>
      </div>
    </div>
    <div class="refundDesc">
      <p>问题描述(用户选填)</p>
      <span>{{ refundInfo.description }}</span>
    </div>
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
import refundDataJs from '../refund'
export default {
  props:{
    refundInfo: {
      type: Object,
      default:{}
    }
  },
  data(){
    return {
      waitHandles:[],
      imgUrl: process.env.VUE_APP_IMAGE_BASEURL,
      returnTypes:null,
      srcList:[],
      preUrl:'',
    }
  },
  methods:{
    checkRefundSnap(){
      this.preUrl = this.imgUrl + this.refundInfo.refundPicUrl;
      this.srcList = [this.preUrl]
      this.$refs.preview.showViewer = true
    },
  },
  mounted(){
      //待处理人数组去重    
  },
  filters: {
    filterPrice(val) {
      return refundDataJs.filterPrice(val);
    },
    filterCostType(val) {
      return refundDataJs.filterCostType(val);
    },
    remarkStatus(val) {
      return refundDataJs.remarkStatus(val);
    },
    filterAmount(val) {
      return refundDataJs.filterAmount(val);
    },
    filterType(val) {
      return refundDataJs.filterType(val);
    },
    cancleStatus(val) {
      return refundDataJs.cancleStatus(val);
    },
    refundReason(val) {
      return refundDataJs.refundReason(val);
    },
  },
}
</script>

<style scoped>
  @import url('../refund.css');
  
  .handlers-sty{
    cursor: pointer;
    max-height: 60px;
    overflow: hidden;
  }
  .flex-show{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  .light-p{
    font-weight: 400 !important;
    margin: 4px 0;
    font-size: 12px;
  }
  .click-big-img{
    color: #36a6fe;
    cursor: pointer;
  }
</style>