<template>
    <div class="technology">
      <div style="width:1200px;margin:32px auto 25px auto;position:relative">
        <span class="tia"  @click="toList(1)" >技术转移</span>
        <span class="tib"  @click="toList(1)">/ 为企业发展保驾护航</span>
        <span class="morezhichuan" @click="toList(1)">
              更多&nbsp;
                <img
                    src="~assets/images/home/icon_right_arrow.png"
                    alt=""
                    width="14"
                    height="14"
                  />
         </span>
      </div>
      <div class="flex content">
            <!-- 技术成果 -->
            <div class="box">
                <div class="flex title">
                    <div><span class="scrollnava"></span><span style="color: #36A6FE;cursor: pointer;" @click="toList(1)">技术成果</span></div>
                     <span class="moreword" @click="toList(1)">
                        更多&nbsp;
                            <img
                                src="~assets/images/home/icon_right_arrow.png"
                                alt=""
                                width="14"
                                height="14"
                            />
                    </span>
                </div> 
                <div class="flex list">
                    <div @click="toDetail(item.id,1)" class="item" v-for="(item,index) in achivmentList" :key="index">
                        <img class="item-img" v-if="item.url.match(/icon/)" :src="cdnUrl + item.url" alt /> 
                        <img class="item-img" v-else :src="ygUrl + item.url" alt />
                        <div class="flex achievement-desc" >
                            <!-- <p class="text achievement-name">{{item.achievementName}}</p> -->
                            <div class="text achievement-type">类型：{{item.technologyTypeTxt}}</div>
                            <div class="text achievement-price" >{{ item.priceType|receivePrice(item.tradePrice) }}</div>                
                        </div>                         
                    </div>
                    
                </div>               
            </div>
            <!-- 技术需求 -->
            <div class="box">
                <div class="flex title">
                    <div><span class="scrollnav"></span><span style="color: #36A6FE;cursor: pointer;" @click="toList()">技术需求</span></div>
                    <span class="moreword" @click="toList()">
                        更多&nbsp;
                            <img
                                src="~assets/images/home/icon_right_arrow.png"
                                alt=""
                                width="14"
                                height="14"
                            />
                    </span>
                </div> 
                <div class="flex list">
                    <div @click="toDetail(item.id)" v-for="(item,index) in requirementList" :key="index" class="item" style="padding:16px">
                        <p class="text requirement-name">{{item.requirementName}}</p>
                        <p class="text achievement-type" style="margin:6px 0 14px 0">类型：{{item.requirementTypeTxt}}</p>
                        <p class="text achievement-price" >预算：{{ item.priceType|receivePrice(item.tradePriceMin,item.tradePriceMax) }}</p>
                        <!-- <div class="requirement-btn">点击详情</div> -->
                        <div class="requirement-btn" @click.stop="showQia">立即咨询</div>
                    </div>
                </div>               
            </div>
      </div>
       <!-- <div class="top" @click="toList(1)">    
            <span class="top-bold">技术转移 领军品牌</span>
            <span style="opacity: 0.95;">卓越的城市技术转移服务平台</span>
        </div> -->
    </div>
</template>

<script>
import { getResultList, getNeedList } from "@/api/home";
import { receivePrice } from "@/utils/price"

export default {
    data(){
        return {
            achivmentList:[],
            requirementList:[],
            cdnUrl: process.env.CDN_BASE_URL,
            ygUrl:"//static.yagu.cn/",
            basicUrl:process.env.SHOP_URL,
        }
    },
    filters:{
        receivePrice(type,min,max){
            if(type==1){
                return "面议"
            }else{
                if(min && max){
                    return receivePrice(min,2)+"万"+"-"+receivePrice(max,2)+"万"
                }else if(min){
                    return receivePrice(min,2)+"万"
                }else{
                    return receivePrice(max,2)+"万"
                }
            }
        },
    },
    methods:{
        showQia() {
                window.open(
                    "https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2",
                    "",
                    "height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no"
                );
        },
        getData(){
            let params = {
                pageNo: 1,
                pageSize: 6,
                orderBy: 1,
            };
            getResultList(params).then((res) => {
                if(res.data.code==0){
                    this.achivmentList = res.data.data.records;
                    this.achivmentList.forEach((item,i)=>{
                    let url='';
                    item.coverUrls.forEach(elem=>{
                        if(elem.isCover==1)  url=elem.picture
                    })
                        this.achivmentList[i].url=url
                    })
                }                
            });
            getNeedList(Object.assign(params,{industry:''})).then((res) => {
                if(res.data.code==0){
                    this.requirementList = res.data.data.records;
                }                
            });            
        },
        //查看更多
        toList(type){
            if(type==1){
                window.open(this.basicUrl+'/result',"_self")
            }else{
                window.open(this.basicUrl+'/need',"_self")
            }
        },
        //详情
        toDetail(id,type) {
            let href=""
            if(type==1){
                href=this.basicUrl+"/result/detail?id=" + id 
            }else{
                 href=this.basicUrl+"/need/detail?id=" + id 
            }
            window.open(href, "_blank");
        },
   },
   mounted(){
       this.getData()
   }
}
</script>

<style scoped>
.scrollnav{
    display: inline-block;
    width: 4px;
    height: 20px;
    background: #36A6FE;
    opacity: 1;
    border-radius: 4px;
    position: relative;
    top: 3px;
    left: -28px;
}
.scrollnava{
    display: inline-block;
    width: 4px;
    height: 20px;
    background: #36A6FE;
    opacity: 1;
    border-radius: 4px;
    position: relative;
    top: 3px;
    left: -22px;
}
.moreword{
    font-size: 12px;
    color: #999999;
    display: flex;
    align-items: center;
    cursor: pointer;
}
.flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
 }
.text{
    width:100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.technology{
    width:1200px;
    margin:0 auto;
    position:relative ;
    top:-12px
}
.top{
    width:100%;
    height:90px;
    background-image:url("~@/assets/images/last/yyt_pic@2x.png");
    background-size:100% 100%;
    color:#fff;
    font-size:14px;
    line-height:90px;
    letter-spacing:2px;
    cursor: pointer;
}
.top-bold{
    margin:0 2px 0 160px;
    font-size:30px;
    font-weight:600;
}
.content{
    width:100%;
    margin:20px 0 20px 0;
    background:#fff;
    border-radius:5px;   
}
.box{
    width:598px;
    padding:22px;
    border-right:0.5px solid rgb(216 216 216 / 17%);
}
.title{
    font-weight: bold;
    color:#333;
    font-size: 18px;
    border-bottom:0.5px solid rgb(216 216 216 / 17%);
    padding-bottom:10px;
}
.title-right{
    color:#323232;
    font-size:14px;
    font-weight:normal;
    opacity:0.77;
    margin-left:10px;
}
.list{
    flex-wrap: wrap;
}
.item{
    width:175px;
    height:181px;
    border:1px solid rgba(216,216,216,.5);
    border-radius:5px;
    margin-top:14px;
    cursor: pointer;
}
.item:hover{
    border:2px solid #36a6fe;
    transform: scale(1.06)
}
.item:hover .achievement-name,.item:hover .requirement-name{
    color:#36A6FE
}
.item:hover .requirement-btn{
    background:#35A5FE;
    color:#fff
}
.item-img{
    width:100%;
    height:125px;
}
.read-more{
    color:#000;
    font-size:12px;
    font-weight:normal;
    opacity:0.3;
    cursor: pointer;
}
.achievement-desc{
    width:100%;
    padding:5px 8px 0 8px;
    flex-direction:column;
    align-items:flex-start
}
.achievement-name{
    color:#333;
    font-weight:bold;
    font-size:15px;
    letter-spacing:1px;
}
.achievement-type{
    color:#989898;
    font-size:12px;
}
.achievement-price{
    color:#FD651C;
    font-size:12px;
    margin-top: 6px;
}
.requirement-name{
    color:#323232;
    font-weight:bold;
    font-size:14px;
    letter-spacing:1px;
}
.requirement-btn{
    width:92px;
    height:32px;
    border:1px solid rgba(37, 153, 245, .17);
    border-radius: 18px;
    color:#36A6FE;
    font-size:12px;
    line-height: 32px;
    text-align: center;
    margin-top:36px;
    position: relative;
    left:24px
}
.morezhichuan{
  color: #999999;
  font-size: 15px;
  position: absolute;
  top: 18px;
  right: 0;
  cursor: pointer;
}
.tia{
   font-weight: bold;
   font-size: 32px;
   color: #333333;
   cursor: pointer;
}
.tib{
  margin-left:13px;
  color: #333333;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
}
</style>