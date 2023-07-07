<template>
    <div class="frame">
        <div class="financing">
            <div class="financing-txt"> </div>
            <div class="financing-box">
                <div class="financing-txt-top">奥灿官方旗舰店</div>
                <div class="financing-txt-botton">卧涛自营</div>
            </div>
        </div>
        <div class="nav">
        <div class="nav_box">
          <div class="xunlu" v-for="(item,index) in navList" :key="index" @click="toDetail(item)">{{item.title}}</div>
          <div class="last">更多服务
            <div class="last_a" v-for="item in lastList" :key="item.title" @click="toDetail(item)">{{item.title}}</div>
          </div>
        </div>
      </div>
        <div class="banner">
            <div class="biaoqian"></div>
            <p>融资策划 • 上市辅导 • 精英团队 • 专业规范</p>
        </div>
        <div style="width:100%;background: #f2f4f5; padding-bottom:30px">
            <div class="content">
                <div class="banner-list">
                    <div v-for="(item,index) in bannerList" :key="index" class="flex-column">
                        <img :src="require(`@/assets/images/service/${item.imgurl}.png`)" >
                        <div class="banner-bottom-title">{{item.title}}</div>
                        <p>{{item.desc}}</p>                    
                    </div>
                </div>
                <div>
                    <p class="title">专业服务</p>
                    <div class="commodity">
                        <div class="commodity-box" v-for="(item,index) in rzList" :key="index">
                            <img :src="imgPath + item.imageUrl" alt="">
                            <p class="commodity-txt">{{item.spuTitle}}</p>
                            <p class="commodity-wordage">{{item.spuSlogan}}</p>
                            <div class="commodity-details" @click="toDetail(item,index)"><p>了解详情</p><div><img src="~assets/images/financing/into_icon@2x.png" alt=""></div></div>
                        </div>
                    </div>
                    <div class="center-handle">
                        <div class="handle-text">
                            <h3>免费提交需求</h3>
                            <p>线下+线下全流程服务</p>
                        </div>
                        <div class="handle-input">
                            <input class="input-box" type="number" placeholder="输入您的手机号" v-model="centerPhone" />
                            <button @click="doSubmit(0)">立即获取</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="entrepreneur ">
            <div class="entrepreneur-top">
                <div class="title_2"> <p>企业家为什么<span>选择股权融资？</span></p></div>
                <div class="entrepreneur-box">
                 <div>
                     <div>
                        <img src="~assets/images/financing/no-money@2x.png" alt="">
                     </div>
                     <p class="txt">不用还钱，</p>
                     <p>无还债压力</p>
                 </div>
                 <div>
                     <div>
                         <img src="~assets/images/financing/no-lixi@2x.png" alt="">
                     </div>
                     <p>不付利息，</p>
                     <p>还能产生收益</p>
                 </div>
                 <div>
                     <div>
                         <img src="~assets/images/financing/chuqian@2x.png" alt="">
                     </div>
                     <p>投资人出钱、</p>
                     <p>出资源、出智慧</p>
                 </div>
                 <div>
                     <div>
                        <img src="~assets/images/financing/guifan@2x.png" alt="">
                     </div>
                     <p>规范治理，</p>
                     <p> 长远发展甚至成功上市</p>
                 </div>
                </div>
            </div>
            <div class="entrepreneur-botton">
                <div class="title_2"> <p>企业挂牌上市<span>有哪些好处？</span></p></div>
                <div class="entrepreneur-box">
                  <div class="entrepreneur-list">
                   <img src="~assets/images/financing/chengben_pic@2x.png" alt="">
                   <div>
                       <p><span>01</span> 降低融资成本</p>
                       <p>通过挂牌，充分展示企业的竞争优势，实现企业品牌增资。</p>
                   </div>
                 </div>
                  <div class="entrepreneur-list">
                    <img src="~assets/images/financing/youhua_pic@2x.png" alt="">
                    <div>
                       <p><span>02</span> 优化资产配置</p>
                       <p>通过挂牌，企业的整体价值得到提升，进而实现股东的财务增值。</p>
                   </div>
                 </div>
                  <div class="entrepreneur-list">
                    <img src="~assets/images/financing/pinpai_pic@2x.png" alt="">
                    <div>
                       <p><span>03</span> 增强品牌价值</p>
                       <p>通过挂牌，企业股权得以流通，企业价值得以重估实现企业增值。</p>
                   </div>
                 </div>
                  <div class="entrepreneur-list">
                  <img src="~assets/images/financing/jizhi_pic@2x.png" alt="">
                    <div>
                       <p><span>04</span> 明确退出机制</p>
                       <p>通过挂牌，吸投资者促成企业融资，实现企业用于发展的资本增值。</p>
                   </div>
                 </div>
                </div>
            </div>
        </div>
        <div class="content">
            <div style="padding-bottom: 30px">
                <p class="title">为什么选择奥灿</p>
                <div class="tuandui-content">
                    <div class="tuandui-left">
                      <p class="tuandui-txt">多元团队，一站式服务</p>
                       <div>
                           <div><span>01</span><span>财税团队</span><span>FINANCE AND TAXATION TEAM</span></div>
                           <div><span>02</span><span>融资专家</span><span>FINANCING EXPERT</span></div>
                           <div><span>03</span><span>上市辅导团队</span><span>Microsoft YaHei</span></div>
                        </div> 
                    </div>
                    <div class="tuandui-right"></div>
                </div>
               <div class="ditu-box flex">
                <div class="ditu-content">
                    <div class="por">   
                        <div><p>ADVANTAGE</p>
                        <p>高达32%的续约及客户转介率 </p><p>证明了 <span>奥灿的实力与诚意</span></p></div>
                       <div class="por-list">
                        <div class="list"><div><span class="txt">1</span><span class="num">站</span></div><p class="num">式服务省时、省心</p></div>
                        <div class="list"><div><span class="txt">10</span><span class="num">年</span></div><p class="num">经年耕耘，专心于一</p></div>
                        <div class="list"><div><span class="txt">100</span><span class="num">个</span></div><p class="num">高级工程师，6年以上经验</p></div>
                        <div class="list"><div><span class="txt">32</span><span class="num">%</span></div><p class="num">源自老客户续约或推荐</p></div></div>
                       </div>
                    </div>
                </div>
            </div>        
        </div>
        <div class="zhengshu">
            <div class="content">
                <div>
                    <p class="title_1">抛弃套路理论，我们以方案落地唯一交付标准</p>              
                    <div class="flex content-por" >
                    </div>
                </div>
            </div>
        </div>
        <div class="flex map-box"></div>
        <div class="big-bg">
        <div class="flex content-por">
            <div class="content-left">
                <div><div class="incentive"></div></div>
                <div><h5>聚焦人才激励</h5></div>
                <div><p>我们相信唯有专注方能专业。我们始终聚焦人才激励领域，以企业经营人才这一高价值资源的视角，从全周期角度出发，以多元激励工具组合，对不同阶段的各类群体进行有效激励，形成全面激励体系。</p></div>
                </div>
          <div class="content-right">
                <div><div class="delivery"></div></div>
                <div><h5>唯落地为交付</h5></div>
                <div><p>我们不是理论派，我们坚持数据说话而非空谈方案，我们坚持活动沟通这种粗活累活，我们承诺项目经理负责+总监兜底双重保障，我们承诺无瑕疵交付，因为我们相信：唯有落地实施才是衡量咨询价值的黄金标准。</p></div>
                </div>
           </div>
            <div class="big-data">
                <span>互联网+大数据</span><span>服务覆盖全国 <span>400+</span> 城市</span>
                <p>让资源无缝对接 让项目快速落地</p>
            </div>
        </div>
        <div class="bottom-form flex">
            <div>
                <p>您的需求我们来服务</p>
                <img src="~assets/images/service/san_icon@2x.png" width="100%" >
            </div>
            <div >               
                <p>请填写下方的表单，咨询顾问将在24小时之内与您取得联系，他将为您提供个性化的解决方案，并将相关资料发送到你邮箱。</p>               
                <el-input v-model.trim="phoneNo" type="number" placeholder="请输入您的手机号码"></el-input>   
                <div @click="doSubmit(1)">立即提交</div>
            </div>
        </div>   
        <el-dialog width="600px" :visible.sync="centerDialogVisible">
            <img  src="~/assets/images/last/tj_pic@2x.png" class="ttt"/>
            <p class="first">亲爱的用户：</p>
            <p class="two">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您的需求已经提交，我们将尽快安排专属人员为您服务，请您保持手机畅通。</p>
        </el-dialog>
    </div>
</template>

<script>
import { getProductList } from '@/api/productdetails'
import {getConsult} from "@/api/home";
import { getFinancing } from "@/api/service";
import tools from '@/utils/priceDeal' 
export default {
    head () {
        return {
            title:'奥灿-专注融资上市辅导',
            meta: [
                { name:'keywords', content:'融资 上市 挂牌'},
                {  hid: 'description', name: 'description', content:'奥灿协助企业做好上市前的准备，扩充融资渠道管家式融资指导，助力企业发展，提高挂牌上市成功率。专业团队全程参与，海量投资机构资源。' }
            ]
        }
    },
    data(){
        return{
            imgPath:process.env.CDN_BASE_URL,
            cdnPath:process.env.CDN_BASE_URL,
            bannerList:[
                {imgurl:"td_icon@2x",title:"专业团队",desc:"拥有丰富的执业经验、 专业的技能。"},
                {imgurl:"fw_icon@2x",title:"优质服务",desc:"秉承质量理念， 提供管家式贴身监督服务。"},
                {imgurl:"gl_icon@2x",title:"精细管理",desc:"针对性为项目方针把脉， 定制专属解决方案。"},
                {imgurl:"bz_icon@2x",title:"安全可靠",desc:"品牌保障，后顾无忧。"},
            ],
            ssList:[],
            rzList:[],
            phoneNo:'',
            centerPhone:'',
            identification:"",
            reg:/^1[3-9]\d{9}$/,  
            centerDialogVisible: false,
            navList:[{id:10,title:"奥灿首页"},{id:1,title:"融资服务"},{id:2,title:"上市辅导"},{id:3,title:"股权设计"},{id:4,title:"战略定位"}],
            lastList:[{id:5,title:"商业计划书"},{id:6,title:"新四板挂牌"}],
        }
        
    },
    filters:{
        filterViewprice(val){
            return tools.filterViewprice(val)
        }
    },
    methods:{
      
       // 判断是图片还是视频
    //    filterType(item){
    //             if(item.imageUrl.match(/(jpeg|png|jpg|gif)/)){
    //                 return true
    //             }else{
    //                 return false
    //             }
    //     },
    //     enter(index,type){
    //         if(type){//type:1-产品列表
    //             this.ssList.forEach((item,i)=>{
    //                 item.isHover=index==i?true:false;                
    //             })
    //             console.log(this.ssList);
    //         }else{
    //             this.rzList.forEach((item,i)=>{
    //                 this.rzList[i].isHover=index==i?true:false;                
    //             })
    //             console.log(this.rzList);
    //         }

    //     },
    //     leave(type){
    //         if(type){
    //             this.ssList.forEach(item=>{
    //                 item.isHover=false;
    //             })
    //         }else{
    //             this.rzList.forEach(item=>{
    //                 item.isHover=false;
    //             })       
    //                console.log(this.rzList);
    //         }
    //     },
        doSubmit(val){
            let phone = '';
            if( val==1 ){
                phone = this.phoneNo
            } else {
                phone = this.centerPhone
            }
            if(!this.reg.test( phone )){
                this.$message({
                    message:"请输入一个正确的手机号码",
                    type: 'error',
                    showClose: true,
                    offset:200,
                });
            } else {
                let param = {
                phoneNumber:phone,
                origin:'0',
                identification:this.identification
                }
                getConsult(param).then(res=>{
                    if(res.data.code==0){
                        this.centerDialogVisible =true;
                    }else{
                        this.$message({
                            message:res.data.msg,
                            type: 'warning',
                            showClose: true,
                            offset:200,
                        }); 
                    }
                    this.phoneNo = '';
                    this.centerPhone = '';
                })                
            }                
        },
        toDetail(item,index){
            // if(index == 0 && !item.id ){ //区别上市第一条
            //     window.open('/project/' + item.number + 2);

            // } else {            
            // const newPath = this.$router.resolve({
            //         path: "/common-service/detail",
            //         query: {
            //          type: '2'+item.id,// 1:gs工商 2:rz融资 3:fl法律 4:cs财税 
            //         },
            //     });
            //     window.open(newPath.href);
            // }
            if (item.id==10) {
            this.$router.push({
                path:"/financingListing"
            })
            }
          else{
            const path = this.$router.resolve({
            path:'/productdetails/details',
            query:{
            spuId:item.id
            }
        })
             window.open(path.href)
    }
       
        },
        getData(){
             let param={
                categoryId:9,
                generateAttributeList:[],
                pageNo:1,
                pageSize:6,
            }
            getProductList(param).then(res => {
                let data = res.data.data.records
                if(data.length>0){
                   data.forEach(item => {
                        this.$set(item, 'isHover', false);
                    });
                }
                this.rzList = data.slice(0, 6)
            })
        }
    },    
    mounted(){
        this.getData()
    }
}
</script>


<style lang="stylus" scoped>
.nav{
    width: 1200px;
    height: 46px;
    margin: 0 auto;   
}
.nav_box{
   display: flex     
}
.title{
    font-size: 36px;
    font-weight: 700;
    width:100%;
    text-align: center;
    margin: 30px 0 18px 0;
    color:#333
}
.xunlu{
    width: 205px;
    height: 46px;
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: center;
    color: #333333;
    line-height:46px;
    letter-spacing: 0.96px;
    cursor:pointer
}
.xunlu:first-child{
    background-color #2A65EF
    border-radius: 5px 5px 0px 0px
    color:#FFF
    
}
.xunlu:hover{
    background: #2a65ef;
    border-radius: 5px 5px 0px 0px;
    color: #fff;
}
.last{
    width: 205px;
    height: 46px;
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: center;
    color: #333333;
    line-height:46px;
    letter-spacing: 0.96px;
    cursor:pointer;
    z-index: 9999;
}
.last:hover{
    background: #2a65ef;
    border-radius: 5px 5px 0px 0px;
    color: #fff;
    .last_a{
        display:block;
        width: 205px;
        height: 46px;
        font-size: 16px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: center;
        color: #666666;
        line-height:46px;
        letter-spacing: 0.96px;
        cursor:pointer
        background-color: #FFFFFF
        border-top: 1px solid #fff;
        z-index: 9999;
    }
}
.last_a{
    display:none;
}
 .title_2{
    >p{
        font-size: 30px;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: 700;
        text-align: center;
        color: #333333;
        line-height: 45px;
        >span{
        font-size: 38px;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: 700;
        text-align: center;
        color: #FD651C;
        line-height: 45px;
        }
    }    
}
fontZ{ 
    font-size 20px 
}
.financing{
    position relative
    width :100%;
    height :120px;
    background-image: url('~assets/images/financing/daohangtiao@2x.png')
    background-size: 100% 100%;
    .financing-txt{
        position absolute   
        left :20%;
        top:25%;
        width: 128px;
        height: 61px;
        background-image: url('~assets/images/financing/xunlu_logo@2x.png')
        z-index :10;
        background-size: 100% 100%;
    }
    .financing-box{
        position absolute   
        left :28%;
        top:23%;
        .financing-txt-top{
            width: 140px;
            height: 26px;
            font-size: 20px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: center;
            color: #333333;
            line-height: 30px;
            margin-bottom :8px
        }
        .financing-txt-botton{
            width: 80px;
            height: 31px;
            border-radius: 16px;
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: center;
            color: #ffffff;
            line-height: 30px;
            background: #fb322f;
        }
    }
}

.title_1{
    font-size: 36px;
    font-weight: 700;
    width:100%;
    text-align: center;
    margin: 30px 0 72px 0;
    color:#FFFFFF
}
.entrepreneur{
    background-image url('~assets/images/financing/wotao_bg@2x.png')
    background-size:100% 100%;
    height  959px
    width 100%
    padding  40px 356px 0 356px
    .entrepreneur-top{
        .entrepreneur-box{
            margin 30px 0 40px 0
            display flex
            justify-content: space-between
            align-items: center
           >div{
                width: 282px;
                height: 290px;
                background: #ffffff;
                border-radius: 8px;
                padding-top 48px
           }
           >div{
                >div:nth-child(1){
                    >img{
                        width: 118px;
                        height: 118px;
                    }        
                text-align: center
                }
                >p{
                    font-size: 22px;
                    font-family: Source Han Sans CN, Source Han Sans CN-Regular;
                    font-weight: 400;
                    text-align: center;
                    color: #333333;
                    line-height: 33px;
                }
                    
            }
        }
    }
  
}
.commodity {
    display flex
    flex-wrap:  wrap
    justify-content:  space-between
    .commodity-box:hover{
        width: 384px;
        height: 464px;
        border: 2px solid #2a65ef;
    }
    .commodity-box{
      position relative
      padding  20px
      width: 384px;
      height: 464px;
      background: #ffffff;
      margin-bottom 20px
     .commodity-txt{
        font-size: 20px;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: 700;
        text-align: center;
        color: #333333;
        margin  8px 0
     }
      >img{
          width: 344px;
          height: 243px;
          margin-bottom 8px
      }
      .commodity-wordage{
        font-size: 16px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: #333333;
        line-height: 24px;
      }
      .commodity-details{
        vertail-aligen:baseline 
        position absolute
        bottom 20px
        width: 344px;
        height: 34px;
        background: #2a65ef;
        border-radius: 8px;
        display flex
        justify-content:  center
        align-items:  center
        >p{
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: center;
            color: #ffffff;
            line-height:  34px
        }
        >div{
              width: 14px;
              height: 14px;
            >img{
              width: 14px;
              height: 14px;
              margin-left 8px
            }
        }
      }
    }
}
  .entrepreneur-botton{
        .entrepreneur-box{
            display flex
            flex-wrap: wrap
            margin-top 30px
            justify-content:  space-between
            align-items: center
            .entrepreneur-list{
                width: 585px;
                height: 168px;
                background: #ffffff;
                text-align: center
                display: inline-block
                display flex
                justify-content: center
                margin-bottom 20px
                padding  20px
                >img{
                    width: 180px;
                    height: 128px;
                    margin-right 20px
                }
                >div{
                    >P:first-child{                  
                        font-size: 24px;
                        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
                        font-weight: 700;
                        text-align: center;
                        color: #333333;
                        margin-bottom 17px
                        >span{
                            width: 49px;
                            height: 52px;
                            font-size: 40px;
                            font-family: Microsoft YaHei, Microsoft YaHei-Bold;
                            font-weight: 700;
                            text-align: left;
                            color: #fd651c;
                        }
                    }
                    >p:last-child{
                            font-size: 16px;
                            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                            font-weight: 400;
                            text-align: left;
                            color: #666666;
                            line-height: 24px;
                    }
                }
            }
          
        }
       
    }
 
.tuandui-content{
    display flex
    .tuandui-left{
        text-align: center
        padding-top 160px
        background-image url('~assets/images/financing/tuandui_pic@2x.png')
        background-size:100% 100%;
        width: 458px;
        height: 488px;
        .tuandui-txt{
            font-size: 30px;
            font-family: Microsoft YaHei, Microsoft YaHei-Bold;
            font-weight: 700;
            text-align: left;
            color: #2a65ef;
            line-height: 45px;
            letter-spacing: 1.38px;
            margin 0 0 48px  73px
        }
        >div{
            font-family: Microsoft YaHei, Microsoft YaHei-Bold;
            font-weight: 700;
            text-align: left;
            color: #FD651C;
            letter-spacing: 1.2px;
            margin-left 56px
            >div{
                margin-bottom 15px
                >span:nth-child(2){
                    color #333333
                    font-size 20px
                }
                >span:nth-child(1){
                    font-size 20px
                }
                >span:nth-child(3){
                    font-size: 14px;
                    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                    font-weight: 400;
                    text-align: left;
                    color: #999999;
                    letter-spacing: 0.14px;
                }
            }
        }
    }
    .tuandui-right{
        background-image url('~assets/images/financing/pic_Choose the right@2x.png')
        background-size:100% 100%;
        flex: 1
        height: 488px;
    }
}
.ditu-box{
    margin  46px 0 40px 0
    .ditu-content{
        position relative
        background-image url('~assets/images/financing/ditu_pic@2x.png')
        background-size:100% 100%;
        width: 768px;
        height: 632px;
        text-align: center
    }
    .por{
        position absolute
        left -25%
        bottom: 137px
        >div:nth-child(1){
            margin-bottom 70px
            >p:nth-child(1){
                opacity: 0.1;
                font-size: 38px;
                font-family: Source Han Sans CN, Source Han Sans CN-Bold;
                font-weight: 700;
                text-align: center;
                color: #2a65ef;
                line-height: 40px;
                letter-spacing: 0.76px;
            }
            >p:nth-child(2){
                font-size: 34px;
                font-family: Source Han Sans CN, Source Han Sans CN-Bold;
                font-weight: 700;
                text-align: center;
                color: #333333;
                line-height: 57px;
                letter-spacing: 0.68px;
            }
            >p:nth-child(3){
                font-size: 34px;
                font-family: Source Han Sans CN, Source Han Sans CN-Bold;
                font-weight: 700;
                text-align: center;
                color: #333333;
                line-height: 57px;
                letter-spacing: 0.68px;
                >span{
                    font-size: 42px;
                    font-family: Source Han Sans CN, Source Han Sans CN-Bold;
                    font-weight: 700;
                    text-align: center;
                    color: #fd651c;
                }
            }
        }
    }
    .por-list{
        display flex
        justify-content: space-between
         .list{
            width: 282px;
            height: 173px;
            background-color #DEEBF9
            border-radius: 15px;
            margin-right 21px
            text-align: center
            padding-top: 41px
           .txt{
                font-size: 40px;
                font-family: DINPro, DINPro-Medium;
                font-weight: 500;
                text-align: center;
                color: #fd651c;
                line-height: 40px;
                letter-spacing: 0.8px;
           }
           .num{
                font-size: 22px;
                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                font-weight: 400;
                text-align: center;
                color: #333333;
                line-height: 40px;
                letter-spacing: 0.44px;
           }
        }
        .list:last-child{
            margin-right 0
        }
    }
} 
.frame{
    width:100%;
    min-width:1200px; 
    .first{
        font-weight: bold;
        font-size: 16px;
        color: #000000;
        padding: 0  30px;
    }
    .two{
        font-size: 16px;
        color: #000000;
        padding: 15px 30px 40px 30px;
        line-height: 27px;
        font-weight: 400;
    }
    .ttt{
        width: 283px;
        height: 146px;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
    }
    .banner{
        position relative;
        width: 100%;
        min-width:1200px;
        height: 440px;
        background-image: url('~assets/images/financing/banner@2x.png');
        background-size:100% 100%;
        flex-direction: column;
        >p:first-child{
            font-size: 46px;
            font-weight: 700;
            color: #ffff;
            letter-spacing: 1px;
        }
        >p:nth-child(2){
            padding:6px 0;
            position absolute
            left :21%;
            top:45%;
            font-size: 24px;
            font-weight: 400;
            color: #ffffff;
            letter-spacing: 2px;
        }
        .biaoqian{
            position absolute
            left :21%;
            top:32%;
            width: 331px;
            height: 45px;
            background-image: url('~assets/images/financing/biaoqian@2x.png');
            background-size:100% 100%;
        }
    }
    .zhengshu{    
        width: 100%;
        height 473px
        padding:38px 0;
        background-image: url('~assets/images/financing/wotao2_bg.png');
        background-size:100% 100%;
        img{
            width: 285px;
            height: 192px;
            margin:12px;
            -webkit-transition: opacity .3s ease;
            transition: opacity .3s ease;
        }
        img:hover{
            opacity: .7;
        }
           
    }
    .big-bg{
        position relative
        width: 100%;
        height: 488px;
        background-image: url('~assets/images/financing/wotao3_bg@2x.png');
        background-size:100% 100%;
        position: relative
        .big-data{
            position: absolute
            left: 25%;
            top: 72%;
            transform: translate(-20%, -50%);
            width: 710px
            >span:nth-child(1){
            width: 422px;
            height: 80px;
            font-size: 60px;
            font-family: PangMenZhengDao, PangMenZhengDao-Regular;
            font-weight: 400;
            text-align: center;
            color: #2a65ef;
            line-height: 45px;
            letter-spacing: 3.6px;
            }
            >span:nth-child(2){
            font-size: 20px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: center;
            color: #333333;
            line-height: 45px;
            >span:nth-child(1){
            font-size: 40px;
            font-family: DINPro, DINPro-Medium;
            font-weight: 500;
            text-align: center;
            color: #fd651c;
            line-height: 40px;
            letter-spacing: 0.8px;
            }
            }
            >p{
            font-size: 20px;
            font-family: Microsoft YaHei, Microsoft YaHei-Bold;
            font-weight: 700;
            text-align: left;
            color: #333333;
            line-height: 45px;
            }
        }
        .content-por{
            position absolute
            left :19%
            top: -60%
        }
        .content-left{
            display flex
            flex-direction: column
            align-items: center
            width: 580px;
            height: 356px;
            background: #ffffff;
            border: 0.5px solid #bfbfbf;
            border-radius: 15px;
            box-shadow: 0px 0px 12px 0px rgba(0,0,0,0.10); 
            margin-right :30px
            padding 60px 45px 0 45px 
            >div:nth-child(2) {
                margin  20px 0
                >h5{
                     font-size: 24px;
                    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
                    font-weight: 700;
                    text-align: center;
                    color: #333333;
                    line-height: 40px;
                    letter-spacing: 0.48px;
                }
            }
            >div:nth-child(3){
                >p{
                font-size: 16px;
                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                font-weight: 400;
                text-align: left;
                color: #333333;
                line-height: 24px;
                letter-spacing: 0.32px;
                }
            }
            .incentive{
                background-image url('~assets/images/financing/icon_incentive@2x.png')
                background-size:100% 100%;
                width: 80px;
                height: 80px;
            }
            }
            .content-right{
            display flex
            flex-direction: column
            align-items: center
            width: 580px;
            height: 356px;
            background: #ffffff;
            border: 0.5px solid #bfbfbf;
            border-radius: 15px;
            box-shadow: 0px 0px 12px 0px rgba(0,0,0,0.10); 
            padding 60px 45px 0 45px 
            >div:nth-child(2) {
                margin  20px 0
                >h5{
                    font-size: 24px;
                    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
                    font-weight: 700;
                    text-align: center;
                    color: #333333;
                    line-height: 40px;
                    letter-spacing: 0.48px;
                } 
            }
               >div:nth-child(3){
                >p{
                font-size: 16px;
                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                font-weight: 400;
                text-align: left;
                color: #333333;
                line-height: 24px;
                letter-spacing: 0.32px;
                }
            }
            .delivery{
                background-image url('~assets/images/financing/icon_delivery@2x.png')
                background-size:100% 100%;
                width: 72px;
                height: 72px;
            }
        }
    }
    map-box{
        background-image url('~assets/images/financing/ditu_pic@2x.png')
        background-size:100% 100%;
        height 632px
        width 100%
    }

    .bottom-form{
        width:100%;
        height: 472px;
        background-image:url('~assets/images/service/big_bg@2x.png');
        background-size:100% 100%;
        color:#333;
        >div:first-child{
            width:412px;
            margin-right:96px;
            font-size:16px;
            p:first-child{
                width:100%;
                text-align: center;
                font-size: 30px;
                font-weight: 700;
                margin-bottom:6px;
            }
            img{
                width: 412px;
                height: 283px;
                margin-top:40px;
            }
        }
        >div:last-child{
            width: 584px;
            padding:20px ;            
            background: rgba(7,75,128,.1);
            border-radius: 15px;
            p:first-child{
                width:100%;
                font-size:16px;
                color:#333;
                margin-bottom:26px;
                text-indent:2em
            }
            >>> .el-input__inner {
                border-radius: 10px;
                height: 54px;
                line-height: 54px;
            }
            div:last-child{
                width: 100%;
                height: 54px;
                line-height: 54px;
                margin-top:20px;
                text-align: center;
                color:#fff;
                background: linear-gradient(131deg,#4c71fe,#529df9 );
                border-radius: 10px;
            }
        }
    }
    .content{
        margin:0 auto;
        width:1190px;
        .banner-list{
            width:100%;
            display: flex;
            justify-content: space-around;
            >div{
                width:256px;
                position:relative;
                padding-top:85px;
                margin-bottom:50px;
                img{
                    width: 170px;
                    height: 170px;
                    position:absolute;
                    top:-85px;
                }
                div{
                    font-size:24px;
                    font-weight:700;
                    color:#333;
                    margin:12px 0;
                }
                p{
                    width:178px;
                    font-size: 16px;
                    color:#666;
                    text-align: center;
                    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                }
            }            
        }
        .indexItem{
            height:412px;
            margin-bottom: 20px;
            div:first-child{
                width:284px;
                height:100%;
                background-size:100% 100%;               
            }
            .content-list{
                cursor pointer
                width:453px;
                background: #fff;
                padding:28px 32px; 
                height: 412px;
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size:12px;
                border: 2px solid #fff;
                color:#333;
                webkit-transition: all .5s;
	            transition: all .5s;
                overflow: hidden
                img, .video-box video{
                    width: 282px;
                    height: 200px;
                    webkit-transition: all .5s;
                    transition: all .5s;
                }
                .rz-title{
                    font-size: 20px;
                    font-weight:600;
                    margin-top:60px
                    -webkit-transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
                    -o-transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
                    transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
                }
                .btn{
                    width:158px;
                    height: 34px;
                    line-height: 34px;
                    text-align: center;
                    border-radius: 8px;
                    font-size:14px;
                    cursor pointer
                    margin-top:30px
                    -webkit-transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
                    -o-transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
                    transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
                    img{
                        width: 14px;
                        height: 14px;
                        margin-left 4px
                    }                    
                }
                .before-hover{
                    background: #eff8ff;
                    visibility:visible;
                    opacity: 1;
                    color: #2a65ef;
                }
                .hovered{
                    background: #2a65ef;
                    opacity: 0;
                    visibility: hidden;
                    color: #fff;
                }
            }
            .content-list:hover{
                border: 2px solid #d0e1ee;
                .before-hover{
                    opacity: 0;
                    visibility: hidden;
                    -ms-transform: translateY(10px);
                    transform: translateY(10px);
                }
                .hovered{
                    -ms-transform: translateY(-60px);
                    transform: translateY(-60px);
                    opacity: 1;
                    visibility:visible;
                }
                img, .video-box video{
                    -webkit-transform: scale3d(1.1, 1.1, 1);
                    transform: scale3d(1.1, 1.1, 1);
                }
                .rz-title{
                    color: #2a65ef;
                }
            }
            .bg1{
                background-image:url('~assets/images/service/zhuanli_pic2@2x.png');
            }
            .bg2{
                background-image:url('~assets/images/service/zhuanli_pic1@2x.png');
            }
            div~div{
                margin-right:1px;
                width:453px;
                height:100%;
            }
        }
        .center-handle{
            width: 100%
            height: 113px
            background-image:url('~assets/images/service/xq_pic@2x.png');
            background-size:100% 100%;
            display: flex
            justify-content: center;
            align-items: center;
            position relative
            .handle-text{
                height: 90px         
                top: 50%;
                left: 10px
                position: relative;
                margin-top: -45px;  
                font-family: Microsoft YaHei UI;
                line-height: 24px
                color: #fff
                letter-spacing: 1px;
                -webkit-transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
                -o-transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
                transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
                h3{
                    font-size: 20px;
                }     
                p{
                    font-size: 12px;
                }
            }
            .handle-input{
                margin: 23px 0 0 60px
                width: 567px
                display: flex
                -webkit-transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
                -o-transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
                transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
                .input-box{
                    width: 440px
                    height: 46px
                    border: none
                    background: #fff
                    border-radius: 23px;
                    outline:none   
                    color: #666
                    padding-left: 20px                 
                }
                button{
                    width: 166px;
                    height: 46px;
                    background: #ff9000;
                    border-radius: 23px;
                    border: none
                    color: #fff
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    margin-left -50px
                }
            }
        }
        .center-handle:hover{
            .handle-text{
                -ms-transform: translateX(10px);
                transform: translateX(10px);
                
            }
            .handle-input{
                -ms-transform: translateX(-10px);
                transform: translateX(-10px);
            }
        }
    }
}
.flex{
    display: flex;
    justify-content: center;
    align-items: center
}
.flex-column{
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor pointer
    .banner-bottom-title, p, img{
        webkit-transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
        -o-transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
        transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
    }
}
.flex-column:hover{
    .banner-bottom-title, p{
        color: #2a65ef !important
    }
    img{
        -webkit-transform: scale3d(1.1, 1.1, 1);
        transform: scale3d(1.1, 1.1, 1);
        // -ms-transform: translateY(-10px);
        // transform: translateY(-10px);
    }
} 
</style>