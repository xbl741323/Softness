<template>
<div>
    <div class="radius-box"></div>
    <div class="selectservice">
        <div class="select-title">
                <span class="big">精选服务</span>
                <span class="small">帮您高效搞定需求</span>
        </div>
        <div class="content">
            <div :class="['item',index==0 || index==2?'mr':'']" v-for="(item,index) in serviceList" :key="index" :style="{background:`url(${item.img}) no-repeat center/contain`}" @click="godetail(item)">
                <p class="bigtitle">{{item.title}}</p>
                <p class="smalltitle">{{item.des}}</p>
                <p class="btn">立即办理</p>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
  data(){
    return {
       serviceList:[
        {title:'高新技术企业认定',des:'资金补助、减税、招投...',img:require('@/assets/images/wotao/gaoqi_bg@2x.png'), spuId: 7020},
        {title:'发明专利申请',des:'全程根据，专业高效',img:require('@/assets/images/wotao/shangbiao_bg@2x.png'), spuId: 1},
        {title:'公司注册',des:'专业顾问团队、咨询指导',img:require('@/assets/images/wotao/shangbiao_bg@2x.png'), spuId: 301},
        {title:'科技成果评价',des:'权威科技成果评价机构',img:require('@/assets/images/wotao/gaoqi_bg@2x.png'), spuId: 7069}
       ]
    };
  },
  methods:{  
     godetail(item){
        this.$router.push({
            path: "/productdetails/details",
            query: {spuId:item.spuId}
        })
     }
  },
  mounted(){
  }
}
</script>
<style scoped>
 .selectservice{
     padding:  0 0.32rem;
 }
 
.radius-box{
    width: 100%;
    height: 1.2rem;
    border-radius: 40px 40px 0px 0px;
    background: var(--bg-home-color);
    margin-top: -40px;
}
.select-title{
    margin-bottom : var(--size-12);
    margin: -.426666667rem 0 var(--size-12) var(--size-12); 
}
.select-title img{
    width:  16px;
    height:  16px;
    position: relative;
    top: -2px;
}
.big{
    font-size: 18px;
    color: #333333;
    font-weight: 700;
    position: relative;
    right: 12px;
}
.small{
    font-size: 12px;
    color: #999999;
    position: relative;
    color: #3C97FE;
    /* right: var(--size-14); */
}
.content{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    border-radius: var(--size-20);
    background: linear-gradient(0deg,#ffffff 50%, #d2e6ff);
    box-shadow: 0px 3px 20px 0px rgba(209,226,255,0.50); 
    padding: .32rem 0;
}
 .item{
    width: 4.2666666667rem;
    height: 2.3466666667rem;
    margin-bottom: .24rem;
    padding: .24rem 0 0 .24rem;
}
.item:nth-child(3){
    margin-bottom: 0;
}
.item:nth-child(4){
    margin-bottom: 0;
}
 .bigtitle{
    font-weight: 700;
    font-size: var(--size-14);
    display: inline-block;
    color: #005497;
    font-family: Source Han Sans CN, Source Han Sans CN-Bold;
}
.item:nth-child(2) .bigtitle{
    color: #8e5704;
}
.item:nth-child(3) .bigtitle{
    color: #8e5704;
}
.smalltitle{
    color: #005497;
    font-size: var(--size-12);
}
.item:nth-child(2) .smalltitle{
    color: #8E5704;
}
.item:nth-child(3) .smalltitle{
    color: #8e5704;
}
.mr{
 margin-right: -.32rem;
}
.btn{
    width: 1.706666667rem;
    height: var(--size-24);
    background: var(--color-blue);
    border-radius: var(--size-12);
    font-size: 12px;
    color: var(--color-white);
    text-align: center;
    margin-top: var(--size-12);
    line-height: 24px;
}
</style>
