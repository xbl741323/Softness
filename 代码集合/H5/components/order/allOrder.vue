<template>
    <div class="order-frame">
        <div class="tab-order">
            <ul>
                <li :class="['tab-item',orderStatus == item.orderStatus ?'choosed-tab':'']" v-for="(item, index) in tabList" :key="index" @click="chooseType(item,index)">
                    <h3 class="tab-block">{{ item.label }}</h3>
                    <div v-if="orderStatus == item.orderStatus" class="bottom-line"></div>
                </li>
            </ul>
        </div>
        <div class="order-list" v-if="showOrder">
             <!-- 我的订单 -->
            <ul v-if="orderStatus!=99">
                <li class="list-item" v-for="(item, index) in ordersList" :key="index" >
                    <div class="time" @click="closeStatus = true; checkOrder(item,feeInfo[index])">
                        <p>下单时间：{{item.createTime}}</p>
                        <div class="obligation">{{item.orderStatus | orderStatus}}</div>
                    </div>
                        <div class="list-body" @click="closeStatus = true;checkOrder(item,feeInfo[index])">
                        <div class="pro-img">
                            <img :src="imgUrl + item.url" />
                        </div>
                        <div class="item-info mt">
                            <h3>{{item.spuName}}</h3>
                            <p>{{item.spec}}</p>
                            <p>类型：{{item.categoryName}}</p>
                        </div>
                        <div class="price-num mt" v-if="!item.refundStatus">
                            <p class="single-price"><span>￥{{item.totalAmount/item.buyNum}}</span></p>
                            <p class="count">x{{item.buyNum}}</p>
                            <p class="service-progress" v-if="item.refundStatus !== null">{{checkRefundStataus[item.refundStatus]}}</p>
                        </div>
                        <!-- 退款状态 -->
                        <p class="refund-status" v-if="item.refundStatus">退款￥{{item.refundAmount}}</p>
                    </div>  
                    <div class="actual-pay padding-b10">
                        <p class="price-desc">{{item.orderStatus ==1?'已付：':''}}服务费<span v-if="!feeInfo[index].isDue">(定金)</span>￥{{feeInfo[index].isDue?feeInfo[index].dueDeposit * item.buyNum:feeInfo[index].deposit * item.buyNum}} </p>
                        <!-- <p class="price-desc" v-if="item.orderType == 0">
                            服务费￥
                            <span v-if="item.feeType == 2">{{item.orderDetailVO.governmentReduceFee*item.orderDetailVO.productCount/100}}</span>
                            <span v-else>{{item.orderDetailVO.nowFee*item.orderDetailVO.productCount/100}}</span>
                        </p> -->
                        <p class="price-desc" v-if="feeInfo[index].hasOffical">官费￥{{feeInfo[index].offical * item.buyNum}} </p>                        
                    </div>
                    <div class="actual-pay">
                        <p>{{item.tailStatus == 1 && item.orderStatus == 2 ? '应付尾款': item.orderStatus == 1 ? '已付' : '应付款'}}</p>
                        <span v-if="item.orderType == 1 && item.orderStatus == 2">￥{{Number(feeInfo[index].tailPrice)}}</span>
                        <span v-else-if="feeInfo[index].isDue">￥{{item.totalAmount}}</span>
                        <span v-else>￥{{feeInfo[index].depositShould}}</span>
                    </div>
                    <div class="list-handle">
                        <div class="transfer-txt" v-if="!item.refundStatus">
                            <div v-if="feeInfo[index].dueChannel == 1 || feeInfo[index].depositChannel==1 || feeInfo[index].tailChannel ==1">
                            <p v-if="feeInfo[index].payStatus == 1">对公转账审核中{{item.orderStatus ==0?'(定金)':'(尾款)'}}</p>
                            <p v-if="feeInfo[index].payStatus == 3" @click="authResult(feeInfo[index])">对公转账审核未通过
                                <img class="warning-img" src="~/assets/images/order/wenhao_icon@2x.png">
                            </p>
                            </div>
                        </div>
                        <div class="handle-btn">
                            <span class="bt-cancle" v-if="item.orderStatus == 0 && feeInfo[index].payType != 2 && feeInfo[index].payStatus != 1" @click="updateStatus(item, 6, '取消')">取消订单</span>
                            <span class="bt-cancle" v-if="item.orderStatus == 6" @click="updateStatus(item, 7, '删除')">删除订单</span>
                            <span class="bt-pay bt-pay" v-if="item.orderStatus==2 && item.tailStatus == 1" @click="item.voucher && item.voucher.status == 0 ? '' : toPay(item,true,feeInfo[index])">付尾款</span>
                            <span class="bt-pay" v-if="item.orderStatus==1" @click="goSigncontract(item)">去签约({{item.contractType == 1 ? '电子' : '纸质' }})</span>
                            <span class="bt-pay" :class="(item.voucher && item.voucher.status == 0) || feeInfo[index].payStatus == 1 ? 'bt-pay pay-order-cancel' : 'bt-pay'" v-if="item.orderStatus == 0" @click="(item.voucher && item.voucher.status == 0) || feeInfo[index].payStatus == 1 ? '' : (closeStatus = true, toPay(item,'',feeInfo[index]))">立即支付</span>
                        </div>
                    </div>
                </li>
            </ul>
            <!-- 退款售后 -->
            <ul v-else>
                <li class="list-item" v-for="(item, index) in ordersList" :key="index" >
                    <div class="time">
                        <p>订单编号:{{item.orderNo}}</p>
                        <div class="refundobligation">{{item.refundStatus | refundStatus}}</div>
                    </div>
                    <div class="list-body" v-if="item.orderDetailVO">
                        <div class="pro-img">
                            <img v-if="item.orderDetailVO.productSubType ==1" src="~/assets/images/order/pic_zl@2x.png">
                            <img v-if="item.orderDetailVO.productSubType ==2" src="~/assets/images/order/pic_sb@2x.png">
                            <img v-if="item.orderDetailVO.productSubType ==3" src="~/assets/images/order/pic_bq@2x.png">
                            <img v-if="item.orderDetailVO.productSubType ==4" src="~/assets/images/order/pic_qt@2x.png">
                            <img v-if="item.orderType == 1" :src="imgUrl + item.orderDetailVO.coverUrl" />
                        </div>
                        <div class="item-info-refund">
                            <h3>{{item.orderDetailVO.productName}}</h3>
                            <p class="type">类型:{{item.orderType | orderType}}
                               <span class="refund-money" v-if="item.refundAmount>=0">退款￥{{item.refundAmount/100}}</span>  
                            </p>
                        </div>
                    </div>  
                    <div class="list-handle">
                        <div class="handle-btn">
                            <span class="bt-pay cancelrefund" v-if="item.refundStatus==0&&item.realStep<5" @click="refundDialog=true,taskNo = item.taskNo">撤销申请</span>
                            <span class="bt-pay" @click="goRefundDetail(item)">查看详情</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 无数据 -->
        <div v-if="ordersList.length == 0 && showOrder" class="empty">
            <div class="empty-img">
                <img src="~/assets/images/order/collect_fail@2x.png"/>
                <p>暂无数据</p>
            </div>
        </div>
        <div v-if="!showOrder " class="empty-box"></div>
        <div class="page_limit" v-if="showOrder && ordersList.length > 0">
            <el-pagination :page-size="pageSize"  background :pager-count="5"
               @current-change="handleCurrentChange" :current-page.sync="currentPage"
                layout="prev, pager, next,total" :total="total"
            ></el-pagination>
        </div>
        <!-- 遮罩层 -->
        <el-dialog :visible.sync="commonDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
        <div v-if="delDialog" class="del-box">
            <p class="del-title">{{title}}订单</p>
            <img src="~/assets/images/order/close_icon@2x.png" @click="delDialog = false,commonDialog = false, getStatistics()" />
            <p class="del-content">订单{{title}}后无法恢复，是否确认{{title}}?</p>
            <div class="del-btn">
                <div class="cancel-del-btn" @click="delDialog = false,commonDialog = false,getStatistics()">再想想</div>
                <div class="cancel-del-btn confirm-del-btn" @click="updateOrderStatus(orderInfo,delStatus,title)">提交</div>
            </div>
        </div>
        <div v-if="authDialog" class="auth-box">
            <img src="~/assets/images/order/close_icon@2x.png" @click="authDialog = false,commonDialog = false" />
                <p style=" margin:20px 0;font-size: 16px;font-weight:550;color: #333333;">审核不通过原因：{{refuseReason}}</p>
                <p style="font-size: 14px;color: #666666; padding-bottom: 35px">对公转账审核不通过，您可以点击“立即支付”按钮， 再次提交正确的转账凭证，或选择其他方式付款。</p>
        </div>
        <!-- 撤销申请 -->
        <mt-popup v-model="refundDialog">
            <div class="refund-dialog">
                <p class="title">撤销退款申请</p> 
                <p class="content">您将撤销本次申请，</p>
                <p class="content">如果问题未解决，您还可以再次发起。</p>
                <p class="content">确定撤销吗？</p>
                <div class="heng"></div>
                <div class="btns">
                    <div class="cancel" @click="refundDialog=false">再想想</div>
                    <div class="makesure" @click="makeSureRefund">撤销申请</div>
                </div>
            </div>
        </mt-popup>

        <!--授权提醒-->
        <el-dialog :visible.sync="essAuthDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
        <div v-if="essAuthDialog" class="dialog">
            <div>签约提示</div>
            <div style="margin: 5px;">由于您首次使用签约功能，需要完成签约授权，请先去授权再来签约吧~</div>
            <div>
                <el-button @click="essAuthDialog = false">取消</el-button>
                <el-button type="primary" @click="toAuth">去认证</el-button>
            </div>
        </div>

        <!-- 签约方式选择 -->
        <el-dialog :visible.sync="signDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
        <div v-if="signDialog" class="dialog">
            <div>选择签约方式</div>
            <div>
                <el-radio v-model="signType" :label="1">电子合同</el-radio>
                <span @click="signType = 1">线上签约，安全高效省心</span>
            </div>
            <div style="margin-bottom: 10px">
                <el-radio v-model="signType" :label="2">纸质合同</el-radio>
                <span @click="signType = 2">面签，扫描，邮寄等流程</span>
            </div>
            <el-button @click="signDialog = false">取消</el-button>
            <el-button type="primary" @click="handleSign">确认</el-button>
        </div>
    </div>
</template>

<script>
import { orderList, updateOrder, getOnlineOrdersStatistics, getTaskByTaskNo, getEssAuthStatus, signSelf, changeContractType,} from '~/api/order'
import { getRefundList,cancelRefund } from '~/api/refund'
import orderData from '@/pages/order/order-data'
import Encrypt from '~/plugins/Encrypt'
import { Toast,Popup } from 'mint-ui'
export default {
    scrollToTop: true,
    data(){
        return{
            orderStatus: null,
            pageSize: 10,
            total: 0,
            currentPage: 1,
            imgUrl: process.env.CDN_BASE_URL,
            tabList:orderData.statusList,
            ordersList:[],
            statisticsList:[],
            userInfo: {},
            feeInfo: [],
            checkRefundStataus: {0: "退款中", 1: "退款完成", 2: "退款拒绝", 5: "退款关闭"},
            refuseReason:'',
            showOrder: false,
            commonDialog: false,
            delDialog: false,
            authDialog: false,
            closeStatus: false,
            imgType:'.jpg,.png,.jpeg,.gif',
            videoType: '.mp4,.avi,.mov',
            taskNo:undefined,
            refundDialog:false,
            signDialog: false,
            signType: 1,
            essAuthDialog: false,
            signInfo: {},
        }
    },
    filters:{
        orderType(val){
            return orderData.orderType(val);
        },
        orderStatus(val){
            return orderData.orderStatus(val);
        },
        refundStatus(val){
            return orderData.refundStatus(val);
        },
        payTxt(val){
            return orderData.payTxt(val);
        }
    },
    beforeDestroy(){
        // if(this.closeStatus){
        //     history.pushState(null, null, document.URL);
        //     window.removeEventListener('popstate', this.goback, false);
        // }else{
        //     window.removeEventListener('popstate', null, false);
        // };
    },
    mounted(){
        // if(window.history && window.history.pushState){
            // history.pushState(null, null, document.URL);
            // window.addEventListener('popstate', null, false);
        // }
        this.filterPrice()
        if(this.$route.query.status){
            this.orderStatus = this.$route.query.status;
            console.log("allOrder页面的路由status===",this.orderStatus)
        };
        if(this.$route.query.currentPage){
            this.currentPage = Number(this.$route.query.currentPage);
        };
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if(this.userInfo){
            this.getStatistics();
            this.getOrderList(this.$route.query.status);
        }else{
            this.$router.push({path:'/login'});
        };
    },
    methods:{
        filterPrice() {
            this.feeInfo = []
            this.ordersList.forEach(item => {
                let item1 = item;
                let list = item1.orderPaymentVoList;
                let para = {};
                list.forEach((i) => {
                    if (i.payType == 1) {
                    //定金
                    para.tradeNoDeposit = i.orderFeeList[0].tradeNo? i.orderFeeList[0].tradeNo: "";
                    if (item1.orderStatus == 0) {
                        para.payType = i.payType;
                        para.payStatus = i.payStatus; //支付状态
                        para.paymentId = i.id;
                    }
                    para.hasDeposit = true;
                    para.depositShould = i.payAmount;
                    para.deposit = 0;
                    if (i.orderFeeList[0].payChannel) {
                        //获取支付方式
                        para.depositChannel = i.orderFeeList[0].payChannel;
                    }
                    i.orderFeeList.forEach((j) => {
                        if (j.costType == 3) {
                        //定金官费
                            para.hasOffical = true;
                            para.offical = j.price; //官费单价
                        } else {
                            para.deposit += j.price;
                        }
                    });
                    }
                    if (i.payType == 3) {
                        //一口价
                        para.tradeNoDue = i.orderFeeList[0].tradeNo? i.orderFeeList[0].tradeNo: "";
                        if (item1.orderStatus == 0) {
                            para.payType = i.payType;
                            para.payStatus = i.payStatus; //支付状态
                        }
                        para.isDue = true;
                        para.dueDeposit = 0;
                        para.paymentId = i.id;
                        if (i.orderFeeList[0].payChannel) {
                            //获取支付方式
                            para.dueChannel = i.orderFeeList[0].payChannel;
                        }
                        i.orderFeeList.forEach((j) => {
                            if (j.costType == 3) {
                                //定金官费
                                para.hasOffical = true;
                                para.offical = j.price; //官费单价
                            } else {
                                para.dueDeposit += j.price;
                            }
                        });
                    }
                    if (i.payType == 2) {
                        //尾款
                        para.Tail =
                            i.orderFeeList && i.orderFeeList[0].tradeNo? i.orderFeeList[0].tradeNo: "";
                        if (item1.orderStatus >= 2 && item1.tailStatus == 1) {
                            para.payType = i.payType;
                            para.payStatus = i.payStatus; //支付状态
                        }
                        para.tailId = i.id;
                        if (i.orderFeeList && i.orderFeeList[0].payChannel) {
                            //获取支付方式
                            para.tailChannel = i.orderFeeList[0].payChannel;
                        }
                        if (item1.orderStatus >= 2 && item1.tailStatus == 1) {
                            para.paymentId = i.id;
                        }
                        if (item1.tailStatus == 0) {
                            para.tailStatus = 'wait';
                        } else {
                            para.tailPrice = i.payAmount/item1.buyNum,
                            para.tailShould = i.payAmount
                        }
                    }
                    // console.log("****",i.id)
                });
                this.feeInfo.push(para)
            })
        },
        handleSign() {
            if (this.signType == 1) {
                getEssAuthStatus().then(res => {
                    if (res.code == 0) {
                        if ('0,4'.match(res.data.status)) {
                            this.signDialog = false
                            this.essAuthDialog = true
                        } else if ('1,3'.match(res.data.status)) {
                            this.signDialog = false;
                        } else {
                            let param = {
                                orderId: this.signInfo.id,
                                returnUrl: process.env.PC_URL+'/member/order'
                            }
                            signSelf(param).then(res=>{
                                if(res.code == 0){
                                    window.open(res.data,'_self');
                                }else{
                                    this.$message({
                                        type:'warning',
                                        message: res.msg,
                                        offset:100
                                    })
                                };
                            })
                        }
                    }
                })
            } else {
                let param = {
                    id: this.signInfo.id,
                    contractType: this.signType
                }
                changeContractType(param).then(res=>{
                    if(res.code == 0){
                        this.$message({
                            type:'success',
                            message:'修改签约方式成功！'
                        })
                        this.signDialog = false;
                        this.getStatistics();
                        this.getOrderList();
                    }
                })
            };
        },
        goSigncontract(row){
            if(this.userInfo.status != 2 && this.userInfo.status != 5){
              this.$store.state.authDialog = true
            }else{
                if (row.contractScope == 3) {
                    this.signInfo = row;
                    this.signType = row.contractType;
                    this.signDialog = true;
                } else if (row.contractScope == 1) {
                    getEssAuthStatus().then(res => {
                        if (res.code == 0) {
                            if ('0,1,4'.match(JSON.parse(res.data.status))) {
                                this.signDialog = false
                                this.essAuthDialog = true
                            } else if (res.data.status == 3) {
                                this.signDialog = false;
                            } else {
                                let param = {
                                    orderId: row.id,
                                    returnUrl: process.env.PC_URL+'/member/order'
                                }
                                signSelf(param).then(res=>{
                                    if(res.code == 0){
                                        window.open(res.data,'_self');
                                    }else{
                                        this.$message({
                                            type:'warning',
                                            message: res.msg,
                                            offset:100
                                        })
                                    };
                                })
                            }
                        }
                    })
                } else if (row.contractScope == 2) {
                    let param = {
                        id: row.id,
                        contractType: 2
                    }
                    changeContractType(param).then(res=>{
                        if(res.code == 0){
                            this.$message({
                                type:'success',
                                message:'后台正在处理您的纸质合同，请耐心等待~'
                            })
                            this.getStatistics();
                            this.getOrderList();
                        }else{
                            this.$message({
                                type:'error',
                                message: res.msg,
                                offset: 100
                            })
                        };
                    })
                }
            }
        },
        toAuth(){
            this.$router.push({
                path:'/member/authentication'
            })
        },
        goback(){
            this.$router.push({
                path:'/member'
            })
        },
        authResult(row){
            getTaskByTaskNo({tradeNo: row.tradeNoDeposit}).then(res => {
                if (res.code == 0) {
                    this.authDialog = true;
                    this.commonDialog = true;
                    this.refuseReason = res.data.auditMessage;
                }
            })
        },
        updateStatus(row, status, title){
            this.title = title;
            this.orderInfo = row;
            this.delStatus = status;
            this.commonDialog = true;
            this.delDialog = true;
        },
        updateOrderStatus(row, status, title){
            let param = {
                id: row.id,
                orderStatus: status,
                // accountId: this.userInfo.userId,
                // orderNo: row.orderNo,
                // productName: row.orderDetailVO.productName
            };
        if(status == 6 || status == 7){
            updateOrder(param).then(res=>{
                if(res.code == 0){
                    this.$message({
                        type:'success',
                        message:title+'订单成功！',
                        offset: 80,
                        duration: 2000
                    })
                    this.delDialog = false;
                    this.commonDialog = false;
                    this.getOrderList();
                    this.getStatistics();
            }else{};
             })
        }else{
            updateOrder(param).then(res=>{
                if(res.code == 0){
                    this.$message({
                        type:'success',
                        message:'订单状态修改成功！',
                        offset: 80,
                        duration: 2000
                    })
                    this.getOrderList();
                }else{};
            })
        };
    },
    toPay(row,tailstatusPayFlag,feeInfo){
      /* 加密 */
      var encrypt = Encrypt.encrypt(JSON.stringify(row),'Y2FsdGVkX184Asts');//密钥自定义 加密解密时保持一致即可
      if(tailstatusPayFlag && (this.userInfo.status != 2 && this.userInfo.status != 5)){
        this.$store.state.authDialog = true;
      }else{
        this.$router.push({
          path: '/order/order-pay',
          query:{
            pageFrom: 0,
            // pathUrl: this.$route.path,
            tailstatusPayFlag: tailstatusPayFlag,//true 尾款
            // fullPath: this.$route.fullPath,
            source: 'pay-list',
            data: encrypt,
            feeInfo: JSON.stringify(feeInfo)
          }
        })
      };
    },
        chooseType(item){
            this.currentPage = 1;
            this.orderStatus = item.orderStatus;
            this.getOrderList(this.orderStatus);
        },
        checkOrder(item,feeInfo){   
            this.$router.push({
                path:'/order/my-order',
                query:{
                    id:item.id,
                    source: 'pay-detail',
                    status:this.orderStatus,
                    currentPage: this.currentPage,
                    feeInfo:JSON.stringify(feeInfo)
                }
            })   
        },
        getStatistics(){
            getOnlineOrdersStatistics({accountId: this.userInfo.userId}).then(res=>{
                if(res.code == 0){
                    this.statisticsList = res.data;
                }
            })
        },
        getOrderList(status){
            // 退款售后
            if(status==99){
                let para = {
                    accountId: this.userInfo.userId,
                    current : this.currentPage,
                    size : this.pageSize
                }
                getRefundList(para).then(res=>{
                     if(res.code == 0){
                        this.showOrder = true;
                        this.ordersList = res.data.records;
                        this.total = res.data.total;
                        this.$router.push({
                            query:{
                                status: status,
                                currentPage: this.currentPage
                            }
                        })
                    }else if(res.code ==10002){
                        this.$router.push({
                            path: '/login'
                        })
                    };
                })
            }else{
                let param = {
                    accountId: this.userInfo.accountId,
                    pageNo : this.currentPage,
                    pageSize : this.pageSize
                }
                if(status == 3){
                    param.orderStatusList = [2,3];
                }else{
                    param.orderStatus = status;
                }
                orderList(param).then(res=>{
                    if(res.code == 0){
                        this.showOrder = true;
                        this.ordersList = res.data.records;
                        this.filterPrice()
                        this.total = res.data.total;
                        this.$router.push({
                            query:{
                                status: status,
                                currentPage: this.currentPage
                            }
                        })
                    }else if(res.code == 10002){
                        this.$router.push({
                            path: '/login'
                        })
                    };
                })
            }
        },
        handleCurrentChange(val){
            scrollTo(0,0);
            this.currentPage = val;
            this.getOrderList(this.orderStatus);
        },
        // 退款详情
        goRefundDetail(item){
           let routerUrl = this.$router.resolve({
                path: '/refund/refund-apply',
                query:{
                    id:item.id,
                    taskNo:item.taskNo,
                    orderNo:item.orderNo
                }
            })
            window.open(routerUrl.href,'_self')
        },
         // 撤销申请
        makeSureRefund(){
            cancelRefund({refundNo:this.taskNo}).then(res=>{
                if(res.code==0){
                    this.$toast('操作成功')
                    this.refundDialog = false
                    this.getOrderList(99)
                }else{
                   this.$toast(res.msg)
                    this.refundDialog = false
                }
            })
       },
    },
}
</script>

<style lang="stylus" scoped>   
@import '~assets/css/order/allOrder.styl'
</style>