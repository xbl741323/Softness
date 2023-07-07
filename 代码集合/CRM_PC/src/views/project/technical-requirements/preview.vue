<template>
<!-- 排查完成 -->
  <div class="main">
    <div class="title">需求详情</div>
    <div class="frame">
        <div class="top">
            <div>
                <div style="font-size:16px;font-weight:bolder">需求 | {{demandInfo.requirementName}}</div>
                <div class="budget">预算：{{budget}}</div>
            </div> 
            <div style="display:flex;margin-top:30px">
              <div class="contactImg"  >
                <img src="../../../assets/images/shop/zixun_icon@2x.png" class="button-img"  /> 
                <span  class="button-title" style="color: #FFFFFF;">立即咨询</span>
              </div>
              <div class="contactImg collection" >
                  <img src="../../../assets/images/shop/icon_Collection@2x.png" class="button-img" /> 
                  <span  class="button-title">加入收藏</span>                  
              </div>
            </div>       
                       
        </div>
        <div class="content">
          <span>需求编号：{{ demandInfo.requirementNo }}</span>
          <span>需求类型：{{ demandInfo.requirementTypeTxt }}</span>
          <span style="margin-right: 80px;">所属行业:
            {{demandInfo.industryTxt}}                      
          </span> 
        </div> 
        <div style="padding:14px 30px;border-bottom:0.5px solid #E9E9E9">
          <span class="requirement-title" > 技术详情 </span>
        </div> 
        <div class='requirement-desc'>
          需求描述
          <div v-html="demandInfo.requirementDesc"></div>
        </div>          
    </div>
    <!-- 交易安全保障 -->
    <div class="footer">
       <transcurity/>
    </div>
  </div>
</template>

<script>
import transcurity from "@/components/shop/index"; 

export default {
  components:{
    transcurity
  },
  head () {
      return {
          title: '技术需求详情',
          meta: [
              { name:'keywords', content: '高新技术企业，科技项目申报，专利申请，商标注册，财税咨询，版权登记，卧涛网' },
              { hid: 'description', name: 'description', content: '卧涛网，专业的科技项目申报服务平台。为企业提供科技项目申报政策解读及认定代理、财税咨询、知识产权申请等多项企业服务。' }
          ]
      }
  },
  data() {
    return {
        budget:'',
        demandInfo: {},     
    };
  },
  filters: {
    judgeDate(value) {
      return value == 0 ? "不限" : value;
    },
    price(value) {
      if (value) {
        return value / 1000000;
      }
    },
    turn(value) {
      if (value == "" || value == null) {
        return "不祥";
      } else {
        return value.toString();
      }
    },
  },
  methods: {   
    getData() {
        this.demandInfo=JSON.parse(sessionStorage.getItem('demandInfo'))
        console.log(this.demandInfo,"this.demandInfo")
        if(this.demandInfo.priceType){
            this.budget='面议'
        }else{
            if(!this.demandInfo.tradePriceMax){
              this.budget=this.demandInfo.tradePriceMin+"万元"
            }else if(!this.demandInfo.tradePriceMin ){
              this.budget=this.demandInfo.tradePriceMax+"万元"
            }else{
              this.budget=this.demandInfo.tradePriceMin+'~'+this.demandInfo.tradePriceMax+"万元"
            } 
        }              
    }
  },
  mounted() {
    this.getData();    
  }
};
</script>

<style  scoped>
.contactImg{
   width: 226px;
   height: 50px;
   background: linear-gradient(123deg, #75C2FF 0%, #3D7EFF 100%);
   border-radius: 8px;
   margin-right: 35px;
   display:flex;
   justify-content:center;
   align-items: center;
}
.collection{   
   background: #ECF3FF;
}
.main {
  min-height: 654px; 
  background:#EFF2F3; 
  color:#333; 
  font-size:16px
}
.title{
    width: 1200px;
    margin: 0 auto;
    padding:20px 30px 20px;
    font-weight:700
}
.top{
    width:100%;
    padding:30px ;
}
.frame {
    width: 1200px;
    background:#fff;  
    margin: 0 auto;
    border-radius:6px;
} 
.budget{
    color:#FD651C;
    font-size:18px;
    margin:10px 0;
    font-weight:bold;
}
.button-title{
    color: #4284FF;
    font-size: 18px;
    display: inline-block;
    position: relative;
    
}
.button-img{
    width:16px;
    height:14px;
    margin-right:6px;
}
.content{
    background:#F3F8FF;
    width:100%;
    height:86px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left:30px ;
}
.footer{
    border-radius:6px;
    margin: 10px auto;
    width: 1200px;
    background:#fff; 
    padding-bottom:16px;
}
.requirement-title{
    padding-left:8px ;
    color: #36A6FE;
    font-size:16px;
    border-left:4px solid #36A6FE
}
.requirement-desc{
  padding:30px;
  min-height:220px;
}

</style>