<template>
  <div class="box">
    <div class="head-box">
         <div class="headBox_title">退款详情</div>
         <mt-button @click="$router.back(-1)" icon="back"></mt-button>
    </div>
    <div class="content">
        <div class="content_head">
            <!-- 退款完成图标 -->
            <div class="content_success">
                <img class="content_img" v-if="refundDetail.taskStatus==1" src="@/assets/images/refund/duihao_icon.png">
                <div :class="[ refundDetail.taskStatus !=0 ? 'content_title':'wait_head' ]">{{refundDetail.taskStatus | filterStatus}}</div>
            </div>
            <!-- 退款完成 -->
            <template v-if="refundDetail.taskStatus==1">
                <div class="content_time">退款金额：￥{{refundDetail.refundAmount/100}}</div>
                <div class="content_reason">退款成功时间：{{refundDetail.completeTime}}</div>
                <div class="content_where">钱款去向：{{refundDetail.whereMoney.pay==0?'支付宝原路返回支付宝账户':''}}{{refundDetail.whereMoney.pay==2?'微信原路返回微信账户':''}}<i v-if="refundDetail.whereMoney.pay==0 && (refundDetail.whereMoney.trans==1 || refundDetail.whereMoney.pay==2 )">&nbsp;&nbsp;</i>{{refundDetail.whereMoney.trans==1?'对公转账原路返回对公转账银行账户':''}}</div>
            </template>
            <!-- 退款关闭 -->
            <template v-if="refundDetail.taskStatus==5">
                <div class="content_time">完结时间：{{refundDetail.completeTime}}</div>
                <div class="content_tip">您已撤销本次退款申请,交易将正常进行,如问题未解决,您可以重新发起申请。</div>
            </template>
            <!-- 退款拒绝 -->
            <template v-if="refundDetail.taskStatus==2">
                <div class="content_time">拒绝时间：{{refundDetail.completeTime}}</div>
                <div class="content_reason">拒绝原因：{{refundDetail.rejectReason}}</div>
                <div class="content_tip">您可以修改退款申请后再次发起退款申请，平台会重新处理</div>
            </template>
            <!-- 退款中 -->
            <template v-if="refundDetail.taskStatus==0">
                <div class="block"> 
                    <el-timeline >
                        <el-timeline-item color=#04D081>
                            <div class="wait_title">请等待平台处理</div>
                            <div class="wait_content">您已成功发起退款申请，请耐心等待平台处理。如果平台拒绝，您可以修改退款申请后再次发起退款申请。</div>
                            <div class="wait_time">{{refundDetail.gmtModifed}}</div>
                        </el-timeline-item>
                        <el-timeline-item>
                            <div class="wait_slogon">退款申请已经提交</div>
                            <div class="wait_Subtime">{{refundDetail.gmtCreate}}</div>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </template>
        </div>
        <!-- 退款信息 -->
        <div class="content_info">
            <div class="info_title">退款信息</div>
            <div class="info_sum">
                <div class="info_img" v-if="orderInfo.orderType == 1"><img :src="imgUrl + orderInfo.orderDetailVO.coverUrl" /></div>
                <div class="info_img" v-if="orderInfo.orderType ==0">
                    <img v-if="orderInfo.orderDetailVO.productSubType ==1" src="~/assets/images/order/pic_zl@2x.png" />
                    <img v-if="orderInfo.orderDetailVO.productSubType ==2" src="~/assets/images/order/pic_sb@2x.png" />
                    <img v-if="orderInfo.orderDetailVO.productSubType ==3" src="~/assets/images/order/pic_bq@2x.png" />
                    <img v-if="orderInfo.orderDetailVO.productSubType ==4" src="~/assets/images/order/pic_qt@2x.png" />
                </div>
                <div class="infoSum_title"><div class="infoSum_head" v-if="orderInfo.orderDetailVO && orderInfo.orderDetailVO.productName.length>=0">{{orderInfo.orderDetailVO.productName}}</div><div class="info_type">类型:{{orderInfo.orderType | orderType}}</div></div>
                <div class="info_price" v-if="orderInfo.orderDetailVO && orderInfo.orderDetailVO.nowFee>=0">￥{{orderInfo.orderDetailVO.nowFee/100}}<div v-if="orderInfo.orderDetailVO && orderInfo.orderDetailVO.productCount>=0" class="number">x{{payMessageList[0].count}}</div></div>
            </div>
            <div class="info_detail">
                <div class="flex"><div>退款原因</div><div class="end">{{refundDetail.refundReasonText}}</div></div>
                <div v-for="(item,index) of payMessageList" :key="index" :class="[ index!=0 ? 'padd-top':'flex' ]">
                    <div v-if="index==0">退款类型</div>
                    <div>{{filterPriceType(item.policyFeeType)}}<span>￥{{item.payAmount/100}}&nbsp;</span>
                       <span v-if="refundDetail.taskStatus==0 || refundDetail.taskStatus==1" class="filterSucess">{{refundDetail.taskStatus | filterSucess}}</span>
                    </div>
                </div>
                <div class="flex"><div>申请时间</div><div class="end">{{refundDetail.gmtCreate}}</div></div>
                <div class="flex align"><div>退款编号</div><div class="copy" :data-clipboard-text="refundNo" @click="copy()">复制</div><div class="end">{{refundNo}}</div></div>     
            </div>
        </div>
    </div>
    <!-- 底部按钮 -->
    <div v-if="refundDetail.taskStatus==0" class="bottom">
        <div class="connect" @click="showMeiqia">联系客服</div>
        <div class="bottom_cancel"  v-if="refundDetail.realStep<5" @click="refundDialog=true, taskNo =refundDetail.taskNo ">撤销申请</div>
    </div>
    <div v-if="refundDetail.taskStatus==2 || refundDetail.taskStatus==5" class="bottom">
        <div class="connect" @click="showMeiqia">联系客服</div>
        <div class="bottom_cancel" v-if="showAaginBtn==true" @click="tryAgain">重新申请退款</div>
    </div>
    <!-- 撤销申请弹窗 -->
    <mt-popup v-model="refundDialog">
        <div class="refund-dialog">
            <p class="title">撤销退款申请</p> 
            <p class="cancel_content">您将撤销本次申请，</p>
            <p class="cancel_content">如果问题未解决，您还可以再次发起。</p>
            <p class="cancel_content">确定撤销吗？</p>
            <div class="heng"></div>
            <div class="btns">
                <div class="cancel" @click="refundDialog=false">再想想</div>
                <div class="makesure" @click="makeSureRefund">撤销申请</div>
            </div>
        </div>
    </mt-popup>
   </div> 
</template>

<script>
import {getRefundDetail,getOrderDetail,isApply,cancelRefund} from "~/api/refund"
import ClipboardJS from 'clipboard'
import orderData from '@/pages/order/order-data'
export default {
    head() {
        return {
        title: '退款详情',
        meta: [
            { name: 'keywords', content: '退款详情' },
            {
            hid: 'description',
            name: 'description',
            content:'退款详情'
            }
        ]
        }
    },
    props:{
      refundNo:{
        type: String,
        require: true
      },
      id:{
        type: String,
        require: true
      },
      orderNo:{
        type: String,
        require: true
      }
    },
    data () {
        return {
            taskNo:null,
            refundDetail:{},  
            orderInfo:{},     
            imgUrl: process.env.CDN_BASE_URL,
            payMessageList:[],
            refundDialog:false,
            showAaginBtn:true
        }
    },
    filters: {
        filterStatus(value){    
            if(value==5){
                return '退款关闭'
            }else if(value ==2){
                return '平台已拒绝'
            }else if(value==1){
                return '退款成功'
            }else if(value ==0){
                return '退款进度'
            }
        },
        filterSucess(value){
            if(value == 0){
                return '退款中'
            }else if(value == 1){
                return '退款完成'
            }else if(value == 2){
                return '退款拒绝'
            }else if(value == 5){
                return '退款关闭'
            }
        },
        orderType(val){
         return orderData.orderType(val);
        }
    },
    mounted () {
        if(this.$route.query.taskNo){
          this.getRefundObj()
        }
        this.getOrderObj()
       //重新申请判断条件
        if(this.$route.query.orderNo){
            isApply({orderNo:this.$route.query.orderNo}).then(res=>{
                if(res.code==0){
                    if(res.data.taskStatus==2 || res.data.taskStatus==5 ){
                        this.showAaginBtn = true
                    }else{
                        this.showAaginBtn = false
                    }
                }
            })
        }
    },
    methods: {
       getRefundObj(){
          getRefundDetail({refundNo:this.$route.query.taskNo}).then(res=>{
              if(res.code==0){
                this.refundDetail = res.data
                if(res.data.payMessageList && res.data.payMessageList.length>0){
                    let arr = []
                    res.data.payMessageList.forEach(element => {
                        if(element.refundStatus != null){
                            arr.push(element)
                        }
                    });
                    this.payMessageList =arr
                }
              }
            })
       },
       getOrderObj(){
          getOrderDetail({id: this.id}).then(res=>{
                if(res.code==0){
                    this.orderInfo = res.data
                }
           })
       },
       copy(){
            new ClipboardJS('.copy')
            this.$toast('复制成功')
        },
        // 重新申请退款
       tryAgain(){
            let routerUrl = this.$router.resolve({
                path: '/refund/refund-apply',
                query:{
                    id:this.orderInfo.id
                }
            })
            window.open(routerUrl.href,'_self')
        },
        showMeiqia() {
            var _53 = $53.createApi(); /*开发者文档1.1 创建SDK资源对象*/
            _53.push("cmd", "mtalk");
            /*开发者文档1.7 主动发起(手机端)*/ _53.query();
        },
        // 撤销申请
        makeSureRefund(){
            cancelRefund({refundNo:this.taskNo}).then(res=>{
                if(res.code==0){
                    this.$toast('撤销成功')
                    this.refundDialog = false
                    this.getOrderObj()
                    this.getRefundObj()
                }else{
                    this.$toast(res.msg)
                    this.refundDialog = false
                }
            })
        },
        filterPriceType(value){
            if(this.orderInfo && this.orderInfo.orderType == 1){
                if(value == 0){
                    return '服务费-定金'
                }else if(value ==1){
                    return '服务费-尾款'
                }else if(value ==2){
                    return '官费'
                }
            }else if(this.orderInfo && this.orderInfo.orderType == 0){
                if(value==2){
                    return '官费'
                }else{
                    return '服务费'
                }
            }else{
                return ''
            }
        }
    },
}
</script>
<style lang="stylus" scoped>
@import '~assets/css/refund/refundDetail.styl'
</style>