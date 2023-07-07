<template>
  <div>
    <div class="order_container">
      <div class="order_box">
        <div class="order_title">
          <div class="font_title">商品信息</div>
          <div class="font_tip">不支持无理由退换，文档支付完成后在“个人中心-我的订单-全部订单”中查看</div>
        </div>
        <div class="order_content">
          <div class="table">
            <div class="doc_name">文档名称</div>
            <div>价格</div>
          </div>
          <div class="table_sty">
            <div>
              <div class="item">
                <img :src="cdnPath+fileInfo.fileImageUrl" alt class="img_sty">
                <span class="item_title">{{fileInfo.fileName}}</span>
                <img v-if="fileTypeArr.indexOf(fileInfo.fileType)>-1" :src="iconUrl[fileInfo.fileType]" alt class="icon_type">
              </div>
            </div>
            <div>
              <span>￥</span>
              <span class="item_title">{{fileInfo.amount}}</span>
            </div>
          </div>
          <div class="pay_type">
            <span class="choose_type">选择支付方式</span>
            <el-radio v-model="payType" :label="0">
              <img src="~assets/images/zhengce/icon_zfb.png" alt>
              <span class="txt">支付宝支付</span>
            </el-radio>
            <el-radio v-model="payType" :label="1">
              <img src="~assets/images/zhengce/icon_wechat.png" alt>
              <span class="txt">微信支付</span>
            </el-radio>
          </div>
          <div class="pay_box">
            <div class="pay_amount">
              <div class="num_box">
                <span class="num">本次应付金额：</span>
                <span class="money">￥{{fileInfo.amount}}</span>
              </div>
              <div class="num_check">
                <el-checkbox v-model="read" class="agreement"><span>我已阅读并同意<a class="underline" href="/agreement/xmjy" target="block">《卧涛交易服务协议》</a></span></el-checkbox>
              </div>
              <div class="red_txt" v-if="!hasRead&&!read">请阅读并勾选《卧涛交易服务协议》</div>
            </div>
          </div>
          <div class="pay_btn">
            <div class="pay_button" @click="toPay()">立即支付</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import { getDocDetail, saveFileOrder, wapPayAli, wapPayWx } from '@/api/announcement'
import { getDetailInfoById } from '~/api/fileorder'
import * as CodeMsg from "@/api/CodeChange"
import  orderData from '@/pages/member/order/productOrder/order-data'
import policyData from '@/pages/index/policy/policy_data'
export default {
  components: {

  },
  head() {
    return {
      title: '卧涛文档订单结算',
      meta: [
        { name: 'keywords', content: '卧涛文档订单结算' },
        {
          hid: 'description',
          name: 'description',
          content:'卧涛文档订单结算'
        }
      ]
    }
  },
  data () {
    return {
      payType: 0,//支付方式 0-支付宝 1-微信
      read: false,
      hasRead: true,
      orderId: null,
      fileInfo: {},
      orderDetail: {},
      cdnPath: process.env.CDN_BASE_URL,
      userId: null,
      payInfo: {},
      fileId: null,
      totalAmount: 0,
      iconUrl: policyData.iconUrl,
      fileTypeArr: policyData.fileTypeArr,
    }
  },

  created () {
    if (this.$route.query.id) {
      this.fileId = this.$route.query.id
    }
    if (this.$route.query.orderId) {
      this.orderId = this.$route.query.orderId
      this.getOrderDetail()
    }
    this.$nextTick(()=>{
      if(localStorage.getItem('userInfo')){
        this.userId = JSON.parse(localStorage.getItem('userInfo')).userId
      }
    })
  },

  mounted () {
    this.getDocDetail()
  },

  methods: {
    getOrderDetail() {
      getDetailInfoById(this.orderId).then((res) => {
        if (res.data.code == 0) {
          this.orderDetail = res.data.data;
        }
      });
    },
    getDocDetail(){
      getDocDetail(this.fileId).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          res.data.data.amount = res.data.data.amount.toFixed(2)
          this.fileInfo = res.data.data
          this.totalAmount = this.fileInfo.amount
        }
      })
    },
    async toPay(){
      if(localStorage.getItem('userInfo')) {
        if(this.read&&this.hasRead) {
          if(orderData.throttle(3000)){
            if (this.orderId) {
              this.payType == 0 ?  this.toAliPay(this.orderId):  this.toWxPay(this.orderId, this.orderDetail.orderNo, this.orderDetail.price)
            } else {
              this.toBuy()
            }
          }
          return false
        }
        this.hasRead = false
      }else{
        location.href = "/login";
        sessionStorage.setItem('collectLink',this.$route.path + '?' + qs.stringify(this.$route.query))
      }
    },
    toBuy(){
      let params = {
        userId: this.userId,
        fileId: this.fileId,
        price: this.fileInfo.amount,
      }
      try {
        if(sessionStorage.getItem('docInfo')){
          let data = JSON.parse(sessionStorage.getItem('docInfo'))
          params.inviteCode = data.fileId == this.fileId ? data.link : null
        }
      } catch (error) {
        console.log(error);
      };
      saveFileOrder(params).then(res=>{
        if(res.data.code != CodeMsg.CODE_0){
          if(res.data.code == 10002){
            this.$router.push({
              path: "/login",
            });
            return false
          }
          this.$message({
            type:'warning',
            message: res.data.msg,
            offset: 300,
            duration: 1500
          })
          return false
        }
        this.payInfo = res.data.data
        this.payType == 0 ?  this.toAliPay(this.payInfo.id):  this.toWxPay(this.payInfo.id)
      }).catch(error => {
        console.log(error)
      })
    },
    // 微信支付
    toWxPay(id, orderNo, price){
      wapPayWx(id).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          let codeObj = JSON.parse(res.data.data);
          this.$router.push({
            name: "index-order-wechat",
            query: {
              id: this.fileId,
              orderId: this.payInfo.id,
              codeUrl: codeObj.code_url,
              orderNo: orderNo ? orderNo : this.payInfo.orderNo,
              totalAmount: price ? price :this.totalAmount
            }
          }) 
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg,
            offset: 300,
            duration: 1500
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 支付宝支付
    toAliPay(id){
      wapPayAli(id).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          this.$router.push({
            name: "index-order-pay",
            query:{
              zfbData: res.data.data
            }
          })
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg,
            offset: 300,
            duration: 1500
          })
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }

}
</script>

<style lang="stylus" scoped>
.order_container {
  background: #eff2f3;
  width: 100%;
  display: flex;
  min-height: 800px;
  .order_box {
    margin: 25px auto;
    margin-bottom: 18px;
    width: 1190px;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    .order_title {
      display: flex;
      justify-content: space-between;
      margin: 24px 30px 0 30px;
      .font_title {
        font-size: 16px;
        font-weight: 700;
      }
      .font_tip {
        font-size: 14px;
        color: #a8a8a8;
      }
    }
    .order_content {
      margin: 24px 30px 0 30px;
      width: 95%;
      height: 600px;
      .table {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        text-align: center; 
        border: 1px solid #d7ebfb;
        border-bottom: 0;
        line-height: 41px;
        background: #f3fbfe;
        font-size: 16px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        color: #666666;
        .doc_name {
          margin-left: -150px;
        }
      }
      .table_sty {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        text-align: center; 
        border: 1px solid #d7ebfb;
        line-height: 182px;
        background: #f3fbfe;
        font-size: 16px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        color: #666666;
        .item {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 100%;
          margin-left: 37px;
          position: relative;
          .icon_type {
            position: absolute;
            left: 76px;
            top: 139px;
            width: 20px;
            height: 20px;
          }
        }
        .img_sty {
          width: 96px; 
          height: 135px;
          margin-right: 19px;
          border: 1px solid #eaebef;
          border-radius: 5px;
        }
        .item_title {
          font-size: 14px;
          font-weight: 700;
          color: #666666;
        }
      }
      .pay_type {
        font-size: 16px;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: 700;
        text-align: left;
        color: #333333;
        height: 103px;
        line-height: 103px;
        border-bottom: 1px solid #eaebef;
        img {
          width: 24px;
          height: 24px;
          vertical-align: middle;
        }
        .choose_type {
          font-size: 16px;
          font-weight: 700;
          color: #333333;
          margin-right: 26px;
          font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        }
        .txt {
          font-size: 14px;
          font-weight: 400;
          color: #999999;
        }
      }
      .pay_box {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        .pay_amount {
          width: 416px;
          height: 87px;
          background: #ffffff;
          border: 1px solid #36a6fe;
          border-radius: 5px;
          font-family: Microsoft YaHei, Microsoft YaHei-Bold;
          color: #333333;
          margin-top: 40px;
          .underline {
            text-decoration: none;
            color: #409EFF;
          }
          .num_box {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 315px;
            margin: 15px auto;
            .num {
              font-weight: 700;
              font-size: 16px;
              display: inline-block;
            }
            .money {
              font-size: 12px;
              font-weight: 700;
              color: #FB0400;
              display: inline-block;
            }
          }
          .num_check {
            width: 100%;
            text-align: right;
            padding-right: 23px;
          }
          .red_txt {
            color: red;
            font-size: 12px;
            margin: 18px 0;
            float: right;
          }
        }
      }
      .pay_btn {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        cursor: pointer;
        .pay_button {
          width: 202px;
          height: 48px;
          line-height: 48px;
          background: #36a6fe;
          border-radius: 5px;
          font-size: 18px;
          font-family: Microsoft YaHei, Microsoft YaHei-Bold;
          font-weight: 700;
          text-align: center;
          color: #ffffff;
          margin: 30px 0 0 0;
        }
      }
    }
  }
}
</style>