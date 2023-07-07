<template>
    <div class="frame">
        <div class="content">
            <div style="width:1200px;margin:20px auto;position:relative">
                <span class="tia" >品牌优势</span>
                <span class="tib">/ 为企业发展保驾护航</span>
            </div>
            <div class="rolling">
                <client-only>
                    <vue-seamless-scroll :data="swiperList" :class-option="optionLeft" class="seamless-warp2">
                        <ul class="item">
                            <li v-for="item in swiperList" :key="item.id">
                                <img :src="require('@/assets/images/'+item.img)" style="width:211px;height:142px;" />
                            </li>
                        </ul>
                    </vue-seamless-scroll>
                </client-only>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            pathUrl:'@/assets/images/',
            swiperList:[
                {
                    img:'home/zhengshu01_home@2x.png'
                },
                {
                    img:'home/zhengshu02_home@2x.png'
                },
                {
                    img:'home/zhengshu03_home@2x.png'
                },
                {
                    img:'home/zhengshu04_home@2x.png'
                },
                {
                    img:'home/zhengshu05_home@2x.png'
                },
            ],
            imgList:[
                {
                    id:0,
                    img:'home/logo01_home@2x.png'
                },
                {
                    id:1,
                    img:'home/logo02_home@2x.png'
                },
                {
                    id:2,
                    img:'home/logo03_home@2x.png'
                },
                {
                    id:3,
                    img:'home/logo04_home@2x.png'
                },
                {
                    id:4,
                    img:'home/logo05_home@2x.png'
                },
                {
                    id:5,
                    img:'home/logo06_home@2x.png'
                },
                {
                    id:6,
                    img:'home/logo07_home@2x.png'
                },
                {
                    id:7,
                    img:'home/logo08_home@2x.png'
                },
                {
                    id:8,
                    img:'home/logo09_home@2x.png'
                },
                {
                    id:9,
                    img:'home/logo10_home@2x.png'
                },
                {
                    id:10,
                    img:'home/logo11_home@2x.png'
                },
                {
                    id:11,
                    img:'home/logo12_home@2x.png'
                },
            ]
        }
    },
    computed: {
        optionLeft () {
            return {
                    direction: 2,
                    limitMoveNum: 5
                }
        }
    }
}
</script>

<style lang="stylus" scoped>
.frame{
    width:100%;
    min-width:1200px;
    // background:#EFEFEF;
    background: rgb(245 245 245);
    .content{
        width:1200px;
        padding-bottom: 38px;
        margin:0 auto;
        .title{
            margin:0 auto;
            width:260px;
            height:42px;
            background-image:url("~@/assets/images/home/biaoti.png");
            background-size:100% 100%;
            margin-bottom:14px;
            text-align:center;
            line-height:42px;
            font-size:31px;
            color:#323232;
            font-weight:400;           
        }
        .spa{
            border-left:4px solid #36A6FE;
            padding-left:10px;
        }
        .under-line{
            width:1200px;
            margin-top:21px;
            border:1px solid #CECECE;
        }
        .grid{
            width:1200px;
            margin:12px auto;
            display:inline-grid;
            grid-template-columns: 190px 190px 190px 190px 190px 190px ;
            grid-column-gap :10px;
            grid-row-gap : 20px;
            grid-auto-rows:auto;
            .row{
                width:192px;
                height:110px;
                text-align:center;
                .img{
                    width:90px;
                    height:90px;
                    margin:0 auto;
                }
            }
        }
        .rolling{
            margin-top:25px;
            .seamless-warp2 {
                overflow: hidden;
                width: 1200px;
                padding:20px 0;
                background-image:url('~@/assets/images/home/platform_advantage@2x.png');
                .item {
                    width: 1200px;
                    padding:0;
                    list-style-type:none;
                    li {
                        display:inline
                        margin-right:29px;
                    }
                }
            }
        }
    }
}
.tia{
   font-weight: bold;
   font-size: 32px;
   color: #333333;
}
.tib{
  margin-left:13px;
  color: #333333;
  font-size: 16px;
  font-weight: 400;
}
</style>