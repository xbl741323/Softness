<template>
    <div class="frame">
        <div class="banner flex">
            <p>
                卧涛<span>财税规划</span>平台
                <span class="ask-now" @click="showQia()"><img src="~@/assets/images/service/zixun_icon@2x.png" alt=""></span>
            </p>
            <p>服务上万家企业合理合法优化税务管理成本</p>
            <div class="flex">
                <div v-for="(item,index) in bannerList" :key="index" style="margin:0 20px" class="flex">
                    <img :src="require(`@/assets/images/service/${item.imgurl}.png`)" >
                    <div>
                        <p>{{item.title}}</p>
                        <p>{{item.desc}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="second-block">
            <div class="content">
                <div class="form flex">
                    <img src="~assets/images/service/fangan_icon@2x.png" >
                    <div>
                        <p>免费领取</p>
                        <p>新税务规划方案</p>
                    </div>
                    <el-input v-model.trim="phoneNo" placeholder="请输入您的手机号码"></el-input>   
                    <div @click="doSubmit(0)">立即获取</div>
                </div>
                <div class="flex" style="justify-content:space-between">
                    <div class="bgleft"> </div>
                    <!--taxList初始数据时记得push个isHover：false,用于鼠标悬停时查看更多的图标显示 -->
                    <div  @click="toDetail(item,index)" v-for="(item,index) in taxList" :key="index"  @mouseover="enter(index)"  @mouseout="leave()" class="tax-list">
                        <div v-if='!filterType(item)' class="video-box">
                            <video :src="cdnPath+item.imageUrl"></video>
                        </div>
                        <div class="item-img-box" v-if='filterType(item)'><img :src='cdnPath+item.imageUrl'></div>
                        <p class="list-title">{{item.spuTitle}}</p>
                        <p class="list-desc">{{item.spuSlogan}}</p>
                        <div class="flex" style="color: #fd651c;">
                            <!-- <span>查看更多</span>             -->
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
                <div class="btn">
                    <p>全行业覆盖，<span>助您轻松享受政策红利</span>      </p>
                    <div class="flex" style="flex-wrap:wrap" >
                        <div class="btn-list" v-for="(item,index) in btnList" :key="index" >{{item}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="center-banner">
            <div class="tax-easy">
                <p class="easy-title">财税规划找卧涛<span>，财税管理就是如此简单!</span>  </p>
                <div class="easy-list">
                    <div class="easy-item" v-for="(item,index) in easyList" :key="index" >
                    <span><img src="~assets/images/service/green_yuan@2x.png" class="easy-check-img"></span>
                    <p>{{item.title}}</p>      
                    </div>            
                </div>
                <p class="know-more">我想了解更多,请点击立即咨询</p>
                <div class="ask-now" @click="showQia()">立即咨询</div>
            </div>
        </div>
        <div class="content" style="padding:38px 0">
            <p>我们的团队</p>
            <p class="desc">专业专利工程师为您保驾护航</p>
            <img src="~assets/images/service/td_pic_1@2x.png" class="team-img">
        </div>
        <div class="zhengshu">
            <div class="content">
                <p>因为<span>专业</span>，所以实至名归</p>
                <div class="flex" style="flex-wrap:wrap;margin-top:26px">
                    <img :src="require(`@/assets/images/service/jz_0${item}@2x.png`)"  v-for="(item) in 6" :key="item">
                </div>
            </div>
        </div>
        <div class="content" style="padding:38px 0">
            <p>关于财税规划，<span>是否还有以下问题?</span></p>
            <img src="~assets/images/service/ren_bg_1@2x.png" class="problem-img">
            <div class="center-submit">
                <h3>
                    让您
                    <span class="yellow-h3">省时/省力/省成本/方便/快捷，</span>
                    让您
                    <span class="yellow-h3">快人一步</span>
                </h3>
                <p class="free-txt">免费领取税务规划方案</p>
                <p class="jion-txt">已有<b>1895</b>人参加</p>
                <input class="center-input" type="number" v-model="centerPhone" placeholder="请输入您的手机号">
                <div class="center-click" @click="doSubmit(1)">点击提交
                    <span><img src="~assets/images/service/dianji_icon.png" class="click-ico" alt="点击提交"></span>
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
        <el-dialog width="600px" :visible.sync="centerDialogVisible">
            <img  src="~/assets/images/last/tj_pic@2x.png" class="ttt"/>
            <p class="first">亲爱的用户：</p>
            <p class="two">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您的需求已经提交，我们将尽快安排专属人员为您服务，请您保持手机畅通。</p>
        </el-dialog>
    </div>
</template>

<script>
import { getProductList } from '@/api/productdetails'
import { getTax } from "@/api/service";
import {getConsult} from "@/api/home";
import tools from '@/utils/priceDeal' 
export default {
    head () {
        return {
            title:'财税服务-企业财税管理专家',
            meta: [
                { name:'keywords', content:'财税服务 财税筹划'},
                {  hid: 'description', name: 'description', content:'为企业提供全生命周期的财税管理服务。税务筹划及风险管理等业务功能，助力企业成长。企业合理避税一直是每个企业都要面对的问题，如何合理避税是每家企业都需要的。' }
            ]
        }
    },
    filters:{
        filterViewprice(val){
            return tools.filterViewprice(val)
        }
    },
    data() {
        return{
            cdnPath:process.env.CDN_BASE_URL,
            bannerList:[
                {imgurl:"kuai_1@2x",title:"极速响应 ",desc:"第一时间响应您的需求"},
                {imgurl:"zhuan_2@2x",title:"专属服务",desc:"服务顾问一对一服务"},
                {imgurl:"zhuan_3@2x",title:"全程掌控 ",desc:"服务进度系统化掌控"},
                {imgurl:"bao_4@2x",title:"售后保障 ",desc:"服务问题及时解决与反馈"},
            ],
            phoneNo:"",
            centerPhone:'',
            identification:"",
            centerDialogVisible: false,
            reg:/^1[3-9]\d{9}$/,  
            taxList:[],
            easyList:[
                { title:"资深企服一对一服务，打造专属顾问团队", id:1},
                { title:"完整标准流程，可及时了解实时反馈进度", id:2},
                { title:"量身定制方案，奖励持续，月度兑现", id:3},
                { title:"解决税务事情太繁琐、税务处理不规范", id:4},
                { title:"资深财务顾问坐镇，严格专业风险把控", id:5},
                { title:"价格透明，拒绝恶意竞争及乱收费现象", id:6}
            ],
            btnList:["软件行业","电商行业","广告行业","通信行业","物流行业","建筑设计行业","建筑施工行业","人力资源行业","教育培训行业","资产管理行业","环保行业","直播行业","房地产开发行业","生产制造行业","更多行业"],
            
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
        enter(index){
            this.taxList.forEach((item,i)=>{
                item.isHover=index==i?true:false;                
            })

        },
        showQia() {
            window.open(
                "https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2",
                "",
                "height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no"
            );
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
        leave(){
            this.taxList.forEach(item=>{
                item.isHover=false;
            })
        },
        getData(){
               let param={
                    categoryId:8,
                    generateAttributeList:[],
                    pageNo:1,
                    pageSize:4,
               }
            getProductList(param).then(res => {
                let data = res.data.data.records
                if(data.length>0){
                    this.taxList = data.slice(0, 3)
                    this.taxList.forEach(item => {
                        this.$set(item, 'isHover', false)
                    });
                }
            })
        },
        doSubmit(val){
            let phone = '';
            if(val==0){
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
        }
    },
    mounted(){
        this.getData()
    }
}
</script>
 

<style lang="stylus" scoped>
@import '~/assets/css/product/fiscal'
</style>