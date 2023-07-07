<template>
  <div class="wrap">
      <!-- 提交退款 -->
      <template v-if="!$route.query.taskNo" >
        <mt-header :title="'提交退款'" class="header" /> 
        <div class="apply-content">
            <div class="content">
                <div class="product-title">退款商品</div>
                <div v-if="orderDetail.orderDetailVO" class="info">
                        <div v-if="orderDetail.orderType == 0">
                            <img v-if="orderDetail.orderDetailVO.productSubType ==1" src="~/assets/images/order/pic_zl@2x.png" />
                            <img v-if="orderDetail.orderDetailVO.productSubType ==2" src="~/assets/images/order/pic_sb@2x.png" />
                            <img v-if="orderDetail.orderDetailVO.productSubType ==3" src="~/assets/images/order/pic_bq@2x.png" />
                            <img v-if="orderDetail.orderDetailVO.productSubType ==4" src="~/assets/images/order/pic_qt@2x.png" />
                        </div>
                        <div v-if="orderDetail.orderType == 1">
                        <img :src="imgUrl + orderDetail.orderDetailVO.coverUrl" />
                        </div>
                        <div class="mt">
                            <p class="product-name">{{orderDetail.orderDetailVO.productName}}</p>
                            <p class="product-type">类型：{{orderDetail.orderType | orderType}}</p>
                        </div>
                        <div v-if="orderDetail.orderDetailVO" class="mt">
                            <div v-if="orderDetail.orderType == 0">
                                <p v-if="orderDetail.orderDetailVO.feeType == 2" class="price" >￥{{orderDetail.orderDetailVO.governmentFee/100}}</p>
                                <p class="price" v-else>￥{{orderDetail.orderDetailVO.feeType == 2 ? 0 : orderDetail.orderDetailVO.nowFee/100}}</p>
                            </div>
                            <p v-if="orderDetail.orderType == 1" class="price">{{orderDetail.orderDetailVO.nowFee/100}}</p>
                            <p class="product-num">x {{orderDetail.orderDetailVO.productCount}}</p>
                        </div>
                </div>
            </div>
            <div class="refund-choice">
                <div class="numflex" v-if="maxNum>1">
                    <p>退款数量<span class="tip">*</span></p>
                    <div class="numcontent">
                        <img class="numimg" @click="handleNumberChange('min')" :src="require('@/assets/images/wotao/jian_icon@2x.png')" />
                        <p class="numword">{{refundForm.refundCount}}</p> 
                        <img class="numimg" @click="handleNumberChange('add')" :src="require('@/assets/images/wotao/jia_icon@2x.png')" />
                    </div>
                </div>
                <p>退款选择<span class="tip">*</span></p>
                <el-form :model="refundForm" :rules="rules" ref="refundForm">
                    <!-- 项目申报 -->
                    <template v-if="orderDetail.orderType == 1">
                        <div class="early" v-if="orderDetail.orderDetailVO && '0,2,4,9'.match(orderDetail.orderStatus)">
                            <div class="flex">
                                <img class="choice" src="@/assets/images/refund/check.png" v-if="refundForm.earlyType == true" @click="handleEarly">
                                <span class="circle" v-if="refundForm.earlyType == false" @click="handleEarly"></span>
                                <span class="ml">服务费-定金</span>  
                            </div>
                            <el-form-item prop="earlyMoney">
                              <el-input-number v-model="refundForm.earlyMoney" :disabled="refundForm.earlyType!=true || orderDetail.orderStatus==9"  :controls="false"></el-input-number>  
                            </el-form-item>
                        </div>
                        <div class="early" v-if="orderDetail.orderDetailVO && orderDetail.orderDetailVO.tailStatus==1">
                            <div class="flex">
                                <img class="choice" src="@/assets/images/refund/check.png" v-if="refundForm.tailType == true" @click="handleTail">
                                <span class="circle" v-if="refundForm.tailType == false" @click="handleTail"></span>
                                <span class="ml">服务费-尾款</span>  
                            </div>
                             <el-form-item prop="tailMoney">
                               <el-input-number v-model="refundForm.tailMoney"  :disabled="refundForm.tailType!=true || orderDetail.orderStatus==9" :controls="false"></el-input-number>
                             </el-form-item>
                        </div>
                        <div class="early" v-if="orderDetail.orderDetailVO && '0,2,4,9'.match(orderDetail.orderStatus) && orderDetail.orderDetailVO.governmentReduceFee">
                            <div class="flex">
                                <img class="choice" src="@/assets/images/refund/check.png" v-if="refundForm.officialfeeType == true" @click="handleoffices">
                                <span class="circle" v-if="refundForm.officialfeeType == false" @click="handleoffices"></span>
                                <span class="ml">官费</span>  
                            </div>
                            <el-form-item prop="officialfee">
                                <el-input-number v-model="refundForm.officialfee"  :disabled="refundForm.officialfeeType!=true || orderDetail.orderStatus==9" :controls="false"></el-input-number>
                            </el-form-item>
                        </div>
                    </template>
                    <!-- 知识产权 -->
                    <template v-if="orderDetail.orderType == 0">
                        <div class="early" v-if="orderDetail.orderDetailVO && orderDetail.orderDetailVO.feeType!=2">
                            <div class="flex">
                                <img class="choice" src="@/assets/images/refund/check.png" v-if="refundForm.serverType == true" @click="handleserverType">
                                <span class="circle" v-if="refundForm.serverType == false" @click="handleserverType"></span>
                                <span class="ml">服务费</span>  
                            </div>
                            <el-form-item prop="serverMoney">
                                 <el-input-number v-model="refundForm.serverMoney" :disabled="refundForm.serverType!=true || orderDetail.orderStatus==9"  :controls="false"></el-input-number>
                            </el-form-item>
                        </div>
                        <div class="early" v-if="orderDetail.orderDetailVO && orderDetail.orderDetailVO.governmentReduceFee">
                            <div class="flex">
                                <img class="choice" src="@/assets/images/refund/check.png" v-if="refundForm.serverOffType == true" @click="handleserverOffType">
                                <span class="circle" v-if="refundForm.serverOffType == false" @click="handleserverOffType"></span>
                                <span class="ml">官费</span>  
                            </div>
                            <el-form-item prop="serverOffMoney">
                                 <el-input-number v-model="refundForm.serverOffMoney"  :disabled="refundForm.serverOffType!=true || orderDetail.orderStatus==9" :controls="false"></el-input-number>
                            </el-form-item>
                        </div>
                    </template>
                </el-form>
            </div>
            <div class="refund-choice">
                <p>退款原因<span class="tip">*</span>
                    <span v-if="!filterReason" class="fl" @click="popupVisible=true">请选择<i class="el-icon-arrow-right" /></span>
                    <span v-else class="fl" @click="popupVisible=true">{{filterReason}}</span>
                </p>
            </div>
            <div class="refund-choice">
                <p class="mb">退款说明</p>
                <el-input type="textarea" v-model="refundForm.questionDescription" placeholder="请详细填写申请说明" class="textarea" :rows="4" maxlength="200" show-word-limit></el-input>
            </div>
        </div>
        <div class="submit">
            <div class="btn" @click="submitForm('refundForm')">提交</div>
        </div>
        <mt-popup v-model="popupVisible" position="bottom">
            <div class="reasondialog">
                <p class="title"><span class="text">退款原因</span><i class="el-icon-close icon" @click="popupVisible=false" /></p>
                <div class="result">
                    <div class="reasonitem" v-for="(item,index) in selectArray" :key="item.dropdownKey" @click="handleReason(index)">{{item.dropdownValue}}
                    <img class="choice" v-if="item.checked==true" src="@/assets/images/refund/check.png">
                    <img class="choice" v-else src="@/assets/images/refund/nocheck.png">
                    </div> 
                </div>
                <div class="btn" @click="popupVisible=false">确定</div>
            </div>
        </mt-popup>
      </template>
      <!-- 退款详情 -->
      <template v-if="$route.query.taskNo">
         <refundDetail :refundNo="$route.query.taskNo" :id="$route.query.id" :orderNo="$route.query.orderNo"/>
      </template>
  </div>
</template>

<script>
import { getOrderDetail,getRefundReason,applyRefund } from '~/api/refund'
import mtHeader from '~/components/common/mtHeader'
import refundDetail from '~/components/refund/refundDetail'
import orderData from '@/pages/order/order-data'
export default {
  layout: 'empty',
  head () {
    return {
      title: '退款',    
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  },
  components: {
      mtHeader,
      refundDetail
  },
  data () {
    const propcheckEarly = (rule,value,callback)=>{
        if(this.refundForm.earlyType==true){
            if(value>0 && value<=this.checkearlyMoney){
               callback()
            }else{
                callback('请输入正确的退款金额')
            }
        }else{
           callback()
        }
    }
    const propcheckTail = (rule,value,callback)=>{
         if(this.refundForm.tailType==true){
            if(value>0 && value<=this.checktailMoney){
               callback()
            }else{
                callback('请输入正确的退款金额')
            }
        }else{
           callback()
        }
    }
    const propcheckOfficalfees =  (rule,value,callback)=>{
         if(this.refundForm.officialfeeType==true){
            if(value>0 && value<=this.checkofficialfee){
               callback()
            }else{
                callback('请输入正确的退款金额')
            }
        }else{
           callback()
        }
    }
    const propchecksermoney =  (rule,value,callback)=>{
         if(this.refundForm.serverType==true){
            if(value>0 && value<=this.checkserverMoney){
               callback()
            }else{
                callback('请输入正确的退款金额')
            }
        }else{
           callback()
        }
    }
    const propcheckseroffmoney =  (rule,value,callback)=>{
         if(this.refundForm.serverOffType==true){
            if(value>0 && value<=this.checkserverOffMoney){
               callback()
            }else{
                callback('请输入正确的退款金额')
            }
        }else{
           callback()
        }
    }
    return {
        imgUrl: process.env.CDN_BASE_URL,
        orderDetail:{},
        refundForm:{
            earlyType:false,          // 项目
            earlyMoney:undefined,
            tailType:false,
            tailMoney:undefined,
            officialfeeType:false,   
            officialfee:undefined,
            refundCount:1,
            refundReason:null,
            questionDescription:null,   
            serverType:false,         // 知产
            serverMoney:undefined,
            serverOffType:false,
            serverOffMoney:undefined
        },
        rules:{
           earlyMoney:[{validator:propcheckEarly, trigger: 'change'}],
           tailMoney:[{ validator:propcheckTail, trigger: 'change'}],
           officialfee:[{ validator:propcheckOfficalfees, trigger: 'change'}],
           serverMoney:[{ validator:propchecksermoney, trigger: 'change'}],
           serverOffMoney:[{ validator:propcheckseroffmoney, trigger: 'change'}]
      },
        popupVisible:false,
        selectArray:[],
        checkearlyMoney:null,    // 校验
        checktailMoney:null,
        checkofficialfee:null,
        checkserverMoney:null,
        checkserverOffMoney:null,
        maxNum:1
    }
  },
  filters:{   
    orderType(val){
      return orderData.orderType(val);
    }
  },
  computed:{
      filterReason (){
         let reasonText 
         if(this.selectArray.length>0 && this.popupVisible== false){
             this.selectArray.forEach(item=>{
                   if(item.checked==true){
                       reasonText = item.dropdownValue
                   }
            })
         }
         return reasonText
      }
  },
  mounted () {
      // 订单详情
       getOrderDetail({id: this.$route.query.id}).then(res=>{
          let data = res.data
          this.orderDetail = data
          // 待签约
          if(data.orderStatus==9){
              // 项目 
             if(data.orderType==1){
                this.refundForm.earlyType = true
                if(data.orderDetailVO.governmentReduceFee){
                   this.refundForm.officialfeeType = true
                }
             }else{ //知产
                if(data.orderDetailVO.feeType!=2){
                    this.refundForm.serverType = true
                }
                if(data.orderDetailVO.governmentReduceFee){
                    this.refundForm.serverOffType = true
                }
             }
          }
          this.refundForm.refundCount = data.orderDetailVO.productCount
          this.maxNum =  data.orderDetailVO.productCount
          if(data.orderType==1){
            this.refundForm.earlyMoney = data.orderDetailVO.earnestMoney*data.orderDetailVO.productCount/100
            this.refundForm.tailMoney = data.orderDetailVO.tailAmountSingle*data.orderDetailVO.productCount/100
            this.checkearlyMoney = data.orderDetailVO.earnestMoney*data.orderDetailVO.productCount/100
            this.checktailMoney = data.orderDetailVO.tailAmountSingle*data.orderDetailVO.productCount/100
            if(data.orderDetailVO.governmentReduceFee){
                this.refundForm.officialfee = Number(data.orderDetailVO.governmentReduceFee)*data.orderDetailVO.productCount/100
                this.checkofficialfee = Number(data.orderDetailVO.governmentReduceFee)*data.orderDetailVO.productCount/100
            }
          }else if(data.orderType==0){
             // 仅官费
             if(data.orderDetailVO.feeType==2){
                 this.refundForm.serverOffMoney = Number(data.orderDetailVO.governmentFee)*data.orderDetailVO.productCount/100
                 this.checkserverOffMoney = Number(data.orderDetailVO.governmentFee)*data.orderDetailVO.productCount/100
             }else{
                 this.refundForm.serverOffMoney = Number(data.orderDetailVO.governmentReduceFee)*data.orderDetailVO.productCount/100
                 this.checkserverOffMoney = Number(data.orderDetailVO.governmentReduceFee)*data.orderDetailVO.productCount/100
                 this.refundForm.serverMoney = Number(data.orderDetailVO.nowFee)*data.orderDetailVO.productCount/100
                 this.checkserverMoney = Number(data.orderDetailVO.nowFee)*data.orderDetailVO.productCount/100
             }
          }
      })
       getRefundReason({type:1}).then(res=>{
            res.data.forEach(element => {
                element.checked = false
            });
            this.selectArray = res.data
      })
  },
  methods: {
      handleEarly(){
           // 待签约
          if(this.orderDetail.orderStatus==9){
             return false
          }
          if(this.refundForm.earlyType==true){
              this.refundForm.earlyType = false
          }else{
              this.refundForm.earlyType = true
          }
      },
      handleTail(){
          // 待签约
          if(this.orderDetail.orderStatus==9){
             return false
          }
          if(this.refundForm.tailType==true){
              this.refundForm.tailType = false
          }else{
              this.refundForm.tailType = true
          }
      },
      handleoffices(){
            // 待签约
          if(this.orderDetail.orderStatus==9){
             return false
          } 
         if(this.refundForm.officialfeeType==true){
              this.refundForm.officialfeeType = false
          }else{
              this.refundForm.officialfeeType = true
          }
      },
      handleserverType(){
          // 待签约
          if(this.orderDetail.orderStatus==9){
             return false
          }
         if(this.refundForm.serverType==true){
              this.refundForm.serverType = false
          }else{
              this.refundForm.serverType = true
          }
      },
      handleserverOffType(){
             // 待签约
          if(this.orderDetail.orderStatus==9){
             return false
          }
          if(this.refundForm.serverOffType==true){
              this.refundForm.serverOffType = false
          }else{
              this.refundForm.serverOffType = true
          }
      },
      handleReason(which){
          this.selectArray.forEach((item,index)=>{
             if(index== which){
                 if(item.checked==true){
                     item.checked = false
                 }else{
                     item.checked =true
                 }
             }else{
                 item.checked = false
             }
          })
      },
      handleNumberChange(type){
        // 待签约
        if(this.orderDetail.orderStatus==9){
           return false
        }
        if(type=='add'){
            if(this.refundForm.refundCount == this.maxNum){
                return
            }else{
                this.refundForm.refundCount++
            }
        }else{
            if(this.refundForm.refundCount == 1){
                return
            }else{
                this.refundForm.refundCount--
            }
        }   
        let data = this.orderDetail
        let number = this.refundForm.refundCount  
        if(this.orderDetail.orderType==1){
            this.refundForm.earlyMoney = data.orderDetailVO.earnestMoney*number/100
            this.refundForm.tailMoney = data.orderDetailVO.tailAmountSingle*number/100
            this.checkearlyMoney = data.orderDetailVO.earnestMoney*number/100
            this.checktailMoney = data.orderDetailVO.tailAmountSingle*number/100
            if(data.orderDetailVO.governmentReduceFee){
                this.refundForm.officialfee = Number(data.orderDetailVO.governmentReduceFee)*number/100
                this.checkofficialfee = Number(data.orderDetailVO.governmentReduceFee)*number/100
            }
        }else{
            // 仅官费
            if(data.orderDetailVO.feeType==2){
                this.refundForm.serverOffMoney = Number(data.orderDetailVO.governmentFee)*number/100
                this.checkserverOffMoney = Number(data.orderDetailVO.governmentFee)*number/100
            }else{
                this.refundForm.serverOffMoney = Number(data.orderDetailVO.governmentReduceFee)*number/100
                this.checkserverOffMoney = Number(data.orderDetailVO.governmentReduceFee)*number/100
                this.refundForm.serverMoney = Number(data.orderDetailVO.nowFee)*number/100
                this.checkserverMoney = Number(data.orderDetailVO.nowFee)*number/100
            }
        }
      },
      submitForm(formName){
         this.$refs[formName].validate(valid=>{
          if(valid){
                if(this.refundForm.earlyType == false && this.refundForm.tailType == false && this.refundForm.officialfeeType == false && this.refundForm.serverType == false && this.refundForm.serverOffType == false){
                    this.$toast('请选择退款类型')
                    return
                }
                if(!this.selectArray.some(item=>item.checked== true)){
                    this.$toast('请选择退款原因')
                    return
                }
                  // 支付方式
                if(this.orderDetail.orderType==1){
                    var earPay 
                    var tailpay
                    this.orderDetail.payMessageList.forEach(item=>{
                        if(item.policyFeeType==0){
                            earPay = item.payType
                        }
                        if(item.policyFeeType==1){
                            tailpay = item.payType
                        }
                    })
                }else{
                    var onepay = this.orderDetail.payMessageList[0].payType
                }
                let refundMessages = []      
                // 项目  
                if(this.refundForm.earlyType==true){
                    refundMessages.push({
                        policyFeeType:0,refundAmount:this.refundForm.earlyMoney*100,payType:earPay
                    })
                }
                if(this.refundForm.tailType==true){
                    refundMessages.push({
                        policyFeeType:1,refundAmount:this.refundForm.tailMoney*100,payType:tailpay
                    })
                }
                if(this.refundForm.officialfeeType==true){
                    refundMessages.push({
                        policyFeeType:2,refundAmount:this.refundForm.officialfee*100,payType:earPay
                    })
                }
                // 知产
                if(this.refundForm.serverType==true){
                    refundMessages.push({
                        policyFeeType:3,refundAmount:this.refundForm.serverMoney*100,payType:onepay
                    })
                }
                if(this.refundForm.serverOffType==true){
                    refundMessages.push({
                        policyFeeType:3,refundAmount:this.refundForm.serverOffMoney*100,payType:onepay
                    })
                }
                let selectKey
                this.selectArray.forEach(item=>{
                    if(item.checked== true){
                        selectKey = item.dropdownKey
                    }
                })
                let param = {
                    refundCount:this.refundForm.refundCount,
                    orderId:this.orderDetail.id,
                    userNo:JSON.parse(localStorage.getItem('userInfo')).userNo,
                    refundMessages:refundMessages,
                    refundReason:selectKey,
                    questionDescription:this.refundForm.questionDescription,
                    username:JSON.parse(localStorage.getItem('userInfo')).userName,
                }
                applyRefund(param).then(res=>{
                    if(res.code==0){
                        this.$toast('提交成功')
                        this.$router.push({
                            path:'/member/order',
                            query:{
                            status: 99
                            }
                        })
                    }else{
                        this.$toast(res.msg)
                    }   
                })
            }else{
                return false
            }
        })
      }
  }
}

</script>
<style lang='stylus' scoped>
@import '~assets/css/refund/apply.styl'
</style>