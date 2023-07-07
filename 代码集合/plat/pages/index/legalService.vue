<template>
    <div class="frame">        
        <div class="banner flex">
            <div class="banner-slogan">专注法律 为人民服务
                <span class="ask-now" @click="showQia()"><img src="~@/assets/images/service/flzixun_icon@2x.png" alt=""></span>
            </div>
            <div>专业律师实时<span>1对1</span> 沟通，为客户争取合法权益</div>
            <div class="flex" >
                <p v-for="(item,index) in bannerList" :key="index">{{item}}</p>
            </div>
        </div>  
        <div class="servise">
           <div class="servise-list">
                <p>专业领域</p>
                <p>各大业务领域，超百项法律服务</p>
                <div>
                    <div class="item" v-for="(item,index) in serviceList" :key="index" @click="toDetail(item,index)">
                        <div v-if='!filterType(item)' class="video-box">
                            <video  :src="cdnPath+item.imageUrl"></video>
        
                        </div>
                        <img v-if='filterType(item)' :src='cdnPath+item.imageUrl'>
                        <p class="item-title">{{item.spuTitle}}</p>
                        <p class="item-desc">{{item.spuSlogan}}</p>
                        <div style="color: #fd651c;">
                            <template v-if="item.isOnline==true">
                                    <span v-if="item.spuMaxAmount==item.spuMinAmount" class="pricesize"><span class="pricemark">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                                    <span v-else class="pricesize"><span class="pricemark">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
                            </template>
                            <template v-if="item.isOnline==false">
                                    <span>面议</span>
                            </template>
                        </div>
                    </div>
                </div>
           </div>
        </div>   
        <div class="content">
            <div>
                <p>法律问题在线咨询</p>
                <p class="describle">解决问题，一步到位</p>
                <div class="flex" style="justify-content: space-between;width:100%">
                    <div v-for="(item,index) in problemList" :key="index" class="problem-item flex-column">
                        <img :src="require(`@/assets/images/service/fl_0${index+1}@2x.png`)"  />
                        <p>{{item.title}}</p>
                        <p>{{item.desc}}</p>
                        <div @click="showQia()">立即咨询</div>
                    </div>

                </div>
            </div>
            <div>
                <p>为什么选择我们</p>
                <img class="why-img" src="~assets/images/service/sida_youshi@2x.png" >
            </div>
            <div>
                <p>我们的优势</p>
                <div class="flex" style="justify-content: space-between;width:100%;margin-top:20px">
                    <div class="advantage" v-for="(items,index) in advantageList" :key="index">
                        <img :src="require(`@/assets/images/service/ys_0${index+1}@2x.png`)" >
                        <span>{{`0${index+1}`}}</span>
                        <div></div>
                        <div>{{items.title}}</div>
                        <p v-for="(item,index1) in items.descList" :key="index1">{{item}}</p>
                    </div>
                </div>
            </div>
            <div>
                <p>因为有我们</p>
                <p class="describle">所有的顾虑 这里都有答案</p>
                <img src="~assets/images/service/td_pic@2x.png" width="100%" height="480px">
            </div>
            <div>
                <p>服务流程</p>
                <p class="describle">快速响应，高效对接</p>
                <img src="~assets/images/service/fwlc@2x.png" width="100%" height="506px">
            </div>
        </div> 
        <div class="form flex">
            <div>
                <p>售后承诺<span>AFTER SALES COMMITMENT</span></p>
                <p>严守客户资料，内部实行严谨的保密制度，对服务过程中的 任何客户资料都作为主要机密处理，承诺不泄露客户隐私。</p>
            </div>
            <div >               
                <p>预约律师咨询</p>               
                <el-input v-model.trim="phoneNo" placeholder="请输入您的手机号码"></el-input>   
                <div @click="doSubmit">立即提交</div>
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
import { getLegal } from "@/api/service";
import {getConsult} from "@/api/home";
import tools from '@/utils/priceDeal' 
export default {
    head () {
        return {
            title:'企业法律服务-在线法律咨询，专业律师团队',
            meta: [
                { name:'keywords', content:'法律服务 法律咨询'},
                {  hid: 'description', name: 'description', content:'在线法律咨询，一对一免费咨询，为中小企业提供专业法律服务；成熟的线上服务体系，百亿估值平台保障、专业律师团队、办案经验丰富，为企业发展屏蔽法律风险！' }
            ]
        }
    },
    data(){
        return{
            cdnPath:process.env.CDN_BASE_URL,
            bannerList:["公司事务","劳动纠纷","合同纠纷","债务纠纷"],
            serviceList:[],
            problemList:[
                {title:"在线法律咨询",desc:"资深法律顾问在线解答"},
                {title:"找律师",desc:"24小时1对1专业服务"},
                {title:"律师函",desc:"向对方提出严正警告，促成纠纷解决"},
                {title:"打官司",desc:"为您解决各种法律纠纷"},
                ],
            advantageList:[
                {title:"擅长疑难案件",descList:["擅长办理重大疑难案件","胜诉经验丰富","累计为当事人挽回百亿损失"]},
                {title:"法律服务标准化",descList:["品牌化/专业化/标准化","实现可视化法律服务"]},
                {title:"团队协作高效化",descList:["团队协作高效化","为国内众多企业及个人","提供了优质高效的法律服务"]},
                {title:"办案经验丰富",descList:["办案经验丰富","团队知名度不断提高"]},
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
        showQia() {
            window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no')
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
        getData(){
              let param={
                categoryId:10,
                generateAttributeList:[],
                pageNo:1,
                pageSize:6,
            }
            getProductList(param).then(res => {
               let data = res.data.data.records
                if(data.length>0){
                    this.serviceList = data.slice(0, 6)
                    this.serviceList.forEach(item => {
                        this.$set(item, 'isHover', false)
                    });
                }
            })
        }
    },
    mounted(){
        this.getData()
    }
}
</script>

<style lang="stylus" scoped>
@import '~/assets/css/product/legal'
</style>