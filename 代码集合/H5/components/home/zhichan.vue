<template>
  <div class="zhichan">
    <div class="navtitle">
      <div style="display:flex">
         <div class="bigtitle">
            <img src="~@/assets/images/home/jianbian_bg@2x.png" width="15" height="15" />
             <span style="font-weight: bold;color: #333333;font-size: 0.4266666666666667rem;margin-left: -8px;">知识产权</span>
        </div>
        <span class="smalltitle">为企业提供常规知识产权服务</span>
      </div>
      <span class="moretitle" @click="goList">
        <span>更多</span><img :src="imgUrl" alt="" />
      </span>
    </div>
    <div class="content">
      <div class="left" @click="goList(1)">
        <p class="one">专利服务</p>
        <p class="oneone">守护自主创新</p>
        <div class="detail"></div>
      </div>
      <div class="right">
        <div class="shangbiao" @click="goList(2)">
          <p class="two">商标服务</p>
          <p class=twotwo>开启品牌之路</p>
           <div class="detail"></div>
        </div>
        <div class="banquan" @click="goList(3)">
          <p class="three">版权服务</p>
          <p class="threethree">保护作品版权</p>
           <div class="detail"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgUrl: require("~/assets/images/technology/pointer.png"),
    };
  },
  methods: {
      goList(number){
          this.$router.push('/zhichan')
          if(number){
            sessionStorage.setItem('number',number)
          }
          
      }
  },
  mounted() {}
};
</script>
<style lang="stylus" scoped>
.zhichan{
    width 100%
    height 7.333333333333333rem
    padding: 0.3466666667rem 0.4rem;
    background-color #ffffff
    margin-bottom 0.16rem
    .navtitle{
        display flex
        justify-content space-between
        align-items center
        .bigtitle{
            width 2.1333333333rem
            height 0.5066666667rem
            display flex
        }
        .smalltitle{
            display inline-block
            margin-top 2px
            color: #233558;
            font-size 0.32rem
            opacity: 0.5;
            font-weight: 400;
            margin-left 0.1rem
            position: relative;
            top: 1px;
            left: -0.16rem;
        }
        .moretitle{
            color: #233558;
            font-size 0.32rem
            font-weight: 400;
            display flex
            justify-content center
            align-items center
            img{
             width: 0.1333333333333333rem;
             height: 0.1778666666666667rem;
             margin-left: 0.1066666666666667rem;
            }
            span{
              opacity 0.5
            }
        }
    }

    .content{
        display flex
        margin-top 0.3466666666666667rem
        .left{
            width 4.4533333333rem
            height 5.6533333333rem
            background url('~@/assets/images/home/zhuanli_bg.png') no-repeat center/cover
            .one{
                font-weight bold
                font-size 0.4rem
                color #333333
                margin-top 0.72rem
                margin-left 0.4rem
            }
            .oneone{
                font-size 0.32rem
                color #333333
                opacity 0.5
                margin-top 0.16rem
                margin-left 0.4rem
            }
            .detail{
                width 1.6rem
                height 0.8rem
                background url('~@/assets/images/home/But_xiangqing@2x.png') no-repeat center/contain
                margin-top 0.5333333333333333rem
                margin-left 0.4rem
            }
        }
        .right{
            margin-left 0.2933333333333333rem
            .shangbiao {
                width 4.4533333333rem
                height 2.6666666667rem
                background url('~@/assets/images/home/shangbiao_bg.png') no-repeat center/cover
                margin-bottom 0.2933333333333333rem
             .two{
                font-weight bold
                font-size 0.4rem
                color #333333
                padding-top 0.3733333333333333rem
                padding-left 0.3733333333333333rem
             }
             .twotwo{
                font-size 0.32rem
                color #333333
                opacity 0.5
                margin-top 0.16rem
                margin-left 0.3733333333333333rem
              }
               .detail{
                width 1.6rem
                height 0.8rem
                background url('~@/assets/images/home/But_xiangqing@2x.png') no-repeat center/contain
                margin-top 0.1333333333333333rem
                margin-left 0.4rem
             }
            }
            .banquan{
                width 4.4533333333rem
                height 2.6666666667rem
                background url('~@/assets/images/home/banquan_bg.png') no-repeat center/cover
            .three{
                font-weight bold
                font-size 0.4rem
                color #333333
                padding-top 0.3733333333333333rem
                padding-left 0.3733333333333333rem
             }
             .threethree{
                font-size 0.32rem
                color #333333
                opacity 0.5
                margin-top 0.16rem
                margin-left 0.3733333333333333rem
              }
             .detail{
                width 1.6rem
                height 0.8rem
                background url('~@/assets/images/home/But_xiangqing@2x.png') no-repeat center/contain
                margin-top 0.1333333333333333rem
                margin-left 0.4rem
             }
            }
        }
    }
}
</style>
