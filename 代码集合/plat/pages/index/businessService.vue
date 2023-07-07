<template>
    <div class="frame">
        <div class="banner flex">
            <p>让天下企业没有工商服务困扰
                <span class="ask-now" @click="showQia()"><img src="~@/assets/images/service/zixun_icon@2x.png" alt=""></span>
            </p>
            <p>互联网+工商服务,线上结合线下</p>
            <p>把工商服务链接到您的手心里</p>
        </div>
        <div class="content">
            <p>工商服务</p>
            <p class="desc">1000多项企业服务助力企业发展，已为千万企业提供满意的服务</p>                        
            <div class="flex" style="justify-content:space-between">
                <!-- serviceList初始数据时记得push个isHover：false,用于鼠标悬停时查看更多的图标显示 -->
                <div class="item" v-for="(item,index) in serviceList" :key="index" @mouseover="enter(index,1)"  @mouseout="leave(1)" @click="toDetail(item,index)">
                    <div v-if='!filterType(item)' class="video-box">
                        <video :src="cdnPath+item.imageUrl"></video>
                    </div>
                    <img v-if='filterType(item)'  :src='cdnPath+item.imageUrl'>
                    <p class="gs-list-title">{{item.spuTitle}}</p>
                    <p class="gs-list-desc">{{item.spuSlogan}}</p>
                    <div class="flex" style="color: #fd651c;">
                        <!-- <span>了解详情</span>             -->
                        <template v-if="item.isOnline==true">
                                <span v-if="item.spuMaxAmount==item.spuMinAmount" class="pricesize"><span class="pricemark">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                                <span v-else class="pricesize"><span class="pricemark">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
                        </template>
                        <template v-if="item.isOnline==false">
                                <span>面议</span>
                        </template>
                        <img v-if="item.isHover" src="~assets/images/service/dianji_icon@2x.png" >
                        <img v-else src="~assets/images/service/dianji_icon_1@2x.png" >
                    </div>
                </div>   
            </div>                    
        </div>
        <div class="form-banner flex">
            <p>工商服务</p>
            <p>立即获得经济、高质量的解决方案</p>
            <div class="flex">
                <el-input v-model.trim="phoneNo" placeholder="请输入您的手机号码"></el-input>   
                <div class="form-btn" @click="doSubmit">提交需求</div>
            </div>
            <p>售前咨询，下单快速响应，所有客户信息严格保密保密免遭外泄骚扰！所有客户信息严格保密免遭外泄骚扰！</p>
        </div>
        <div class="why-wt">
            <div class="content">
                <p>为什么选择<span style="color:#3388ff">卧涛</span></p>
                <img style="width: 948px;height: 373px;margin:44px 0 40px 40px" src="~assets/images/service/lbx_pic@2x.png" >                
            </div>
        </div>
        <!-- style="border-top:1px solid rgba(206,206,206,.2);border-bottom:1px solid rgba(206,206,206,.2);" -->
        <div >
            <div class="content">
                <p>创业或经营过程中，<span style="color:#3388ff">你是否也有以下疑问?</span></p>
                <img style="width: 1214px;height: 522px;margin:44px 0 26px 0px" src="~assets/images/service/ren_bg@2x.png" >                           
            </div>
        </div>
        <div class="content">
            <p>资深顾问为您提供专业咨询服务</p>
            <p class="desc">专业顾问团队，经验丰富，细致周密，诚信服务</p>
             <div class="flex" >
                <div class="team-item" :style="{margin:(index==1?'0 20px':'')}" v-for="(item,index) in teamList" :key="index" @mouseover="enter(index)"  @mouseout="leave()">
                    <img :src="require(`@/assets/images/service/${item.imgurl}`)" >
                    <p><span>{{item.name}}</span><span>{{item.job}}</span></p>
                    <p>{{item.desc}}</p>
                    <div class="flex" @click="showQia()">
                        <span>联系咨询</span>            
                        <img v-if="item.isHover" src="~assets/images/service/dianji_icon@2x.png" >
                        <img v-else src="~assets/images/service/dianji_icon_1@2x.png" >
                    </div>
                </div>   
            </div> 
        </div>
        <div class="brand">  
            <table></table>                     
            <div class="content">
                <p><span style="color:#3388FF">大品牌</span>，值得信赖</p>
                <p class="desc" style="margin-bottom:14px">卧涛与众多企业保持良好的合作关系，全心全意为企业发展助力</p>
                <img style="width: 1148px;" src="~assets/images/service/pinpai@2x.png" >                           
            </div>
        </div>
        <div class="foot"> 
            <table></table> 
            <div class="content">
                <p>从创业到上市</p>
                <p class="desc">为中小微企业提供<span style="color:#FD651C;font-size:18px;font-weight:700">全生命周期服务</span></p>
                <div class="flex" style="justify-content:space-around;padding:0 20px">
                    <div class="foot-list flex" v-for="(item,index) in footList" :key="index">
                        <img :src="require(`@/assets/images/service/${item.imgurl}.png`)">
                        <div>
                            <p>{{item.title}}</p>
                            <p>{{item.desc}}</p>
                        </div>
                    </div>
                </div>
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
import { getIndustry } from "@/api/service";
import {getConsult} from "@/api/home";
import tools from '@/utils/priceDeal' 
export default{
    head () {
        return {
            title:'工商服务找卓昭-工商注册、公司变更，费用透明，快速注册',
            meta: [
                { name:'keywords', content:'工商注册 工商变更 企业注册'},
                {  hid: 'description', name: 'description', content:'全国各类公司注册、注销、工商变更、个体户注册等工商服务找卓昭，全国线下服务网点，无需本人到场，熟知政策专业代理代办，费用透明，3天快速注册！' }
            ]
        }
    },
    data(){
        return{
            cdnPath:process.env.CDN_BASE_URL,
            serviceList:[],
            teamList:[
                {isHover:false,imgurl:"wy_1@2x.png",name:"王莹",job:"金牌创业经理",desc:"专精各类工商注册、财务等业务，连续两年荣获“受欢迎服务明星奖”"},
                {isHover:false,imgurl:"sl_2@2x.png",name:"石路",job:"资深工商专家",desc:"九年企服经验，精通内外资企业全生命周期服务，擅长处理各项疑难业务。"},
                {isHover:false,imgurl:"zj_3@2x.png",name:"张俊",job:"首席创业导师",desc:"专注企业服务十年，深谙全国工商税务政策，已为上千家企业量身定制创业方案。"},
            ],
            footList:[
                {imgurl:"zx_icon@2x",title:"免费专业咨询",desc:"随时随地 线上咨询"},
                {imgurl:"bz_icon_3@2x",title:"安全无忧",desc:"信息安全 全程护航"},
                {imgurl:"bz_icon_1@2x",title:"售后保障",desc:"及时解决 及时反馈"},
            ],
            phoneNo:"",
            identification:"",
            centerDialogVisible: false,
            reg:/^1[3-9]\d{9}$/,            
        } 
    },
     filters:{
        filterViewprice(val){
            return tools.filterViewprice(val)
        }
    },
    methods:{
       // 判断是图片还是视频
      filterType(item){
                if(item.imageUrl.match(/(jpeg|png|jpg|gif)/)){
                    return true
                }else{
                    return false
                }
        },
        enter(index,type){
            if(type){//type:1-产品列表
                this.serviceList.forEach((item,i)=>{
                    item.isHover=index==i?true:false;                
                })
            }else{
                this.teamList.forEach((item,i)=>{
                    this.teamList[i].isHover=index==i?true:false;                
                })
            }

        },
        leave(type){
            if(type){
                this.serviceList.forEach(item=>{
                    item.isHover=false;
                })
            }else{
                this.teamList.forEach(item=>{
                    item.isHover=false;
                })
            }
        },
        toDetail(item,index){
           const path = this.$router.resolve({
           path:'/productdetails/details',
           query:{
             spuId:item.id
           }
         })
         window.open(path.href)
        },
        showQia() {
            window.open(
                "https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2",
                "",
                "height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no"
            );
        },
        getData(){
             let param={
                categoryId:7,
                generateAttributeList:[],
                pageNo:1,
                pageSize:4,
            }
            getProductList(param).then(res => {
                let data = res.data.data.records
                if(data.length>0){
                    this.serviceList = data.slice(0, 4)
                    this.serviceList.forEach(item => {
                        this.$set(item, 'isHover', false);
                    });
                }
            })
        },
        doSubmit(){
            if(!this.reg.test(this.phoneNo)){
                this.$message({
                    message:"请输入一个正确的手机号码",
                    type: 'error',
                    showClose: true,
                    offset:200,
                });
            } else {
                let param = {
                phoneNumber:this.phoneNo,
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
                })                
            }                
        }
    },
    mounted(){
        this.getData();
        if(localStorage.getItem("identification")){
            this.identification = localStorage.getItem("identification")
         }
    }
}
</script>

<style lang="stylus" scoped>
@import '~/assets/css/product/business'

</style>