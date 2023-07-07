<template>
    <div 
    v-loading="loading"
    element-loading-text="正在加载，请稍等 . . ."
    >
        <!-- 侧边导航  v-if="$route.path !='/order/publicTransfer'"-->
        <div class="left_navigate" >
            <div style="width:50px;background:#525051FF;color:#FFF;">
                <div 
                v-for="item in rightList" 
                :key="item.id"
                class="left-box"
                @click="getListId(item)"
                :class="{listSty:clickBox == item.id}">
                    <div style="padding:9px;cursor:pointer;font-size:14px;">
                        <p style="text-align:center;">{{item.value}}</p>
                    </div>
                    <div style="border:1px solid #FFF"></div>
                </div>
                <div class="top">
                    <p @click="top()">回到顶部</p>
                </div>
            </div>
        </div>
        <index v-if="($route.path=='/' || $route.path =='/search' || $route.path =='/search/') && $route.path != '/midd' && $route.path !='/order/publicTransfer' " :searchData='serach' />
        <deputy v-else-if="$route.path != '/midd'&& $route.path !='/order/publicTransfer' && $route.path !='/order/initorder-auth' && $route.path !='/order/order-initInfo' && $route.path !='/order/initorder-login'" @content="getContent" style="" />
        <nuxt />
        <foot v-if=" $route.path != '/midd' && $route.path !='/order/publicTransfer' && $route.path !='/maintain' "/>

        
        <!-- 认证提示 -->
        <el-dialog :visible.sync="authDialog" width="0px" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" ></el-dialog>
        <div v-if="authDialog" class="auth-dialog">
        <img class="close-img" v-if="mouseOver" @mouseover="mouseOver = false" src="~/assets/images/xiangmu/guanbi_icon@2x.png" @click="closeAuthDialog()"/>
        <img class="close-img" v-else @mouseleave="mouseOver = true" src="~/assets/images/xiangmu/guanbi_icon_bright@2x.png" @click="closeAuthDialog()"/>
        <img v-if="userInfo.accountType == 1" class="auth-img" src="~/assets/images/order/danwei_pic@2x.png" />
        <img v-else class="auth-img" src="~/assets/images/order/geren_pic@2x.png" />
        <div class="auth-prompt">
            <p class="auth-title">亲爱的客官,</p>
            <p class="auth-content"  v-if="userInfo.accountType == 1">付款交易前请完成身份认证哦！身份认证审核需要1-2个工作日，审核通过后即可进行付款交易。</p>
            <p class="auth-content"  v-if="userInfo.accountType == 0">付款交易前请完成身份认证哦！自动审核通过后即可进行付款交易。</p>
        </div>
        <div class="auth-btn" @click="toAuth()">立即认证</div>
        </div>
    </div>
</template>
<script>
import Index from "./head/index";
import Foot from "./footer/index";
import Deputy from './head/deputy'
import { getUserInfo, getInviteUserIdByCode } from '~/api/login';
export default {
    components: {
        Index,
        Foot,
        Deputy
    },
    data(){
        return{
            userInfo:{},
            mouseOver: true,//鼠标是否悬浮
            serach:'',
            clickBox:'',
            sUserAgent:{},
            shopUrl:process.env.SHOP_URL,
            rightList:[
                {
                id:1,
                    value:this.$t('txt.announcements'),
                    path: 'index-policy-announcement'
                },
                {
                    id:2,
                    value:this.$t('txt.popularProject'),
                    path:'index-project'
                },
                {
                    id:3,
                    value:this.$t('txt.troubleshooting'),
                    path:'index-policy-troubleshooting'
                },
                // {
                //     id:4,
                //     value:this.$t('txt.policyAssembly'),
                //     path:'index-policy-assembly'
                // },
                
                // {
                //     id:5,
                //     value:'发布成果',
                //     path:'/release'
                // },
                // {
                //     id:6,
                //     value:'发布需求',
                //     path:'/publish'
                // },
                {
                    id:7,
                    value:'反馈'
                },
            ],
        }
    },
    computed:{
        loading(){
            return this.$store.state.loading;
        },
        authDialog(){
            return this.$store.state.authDialog || false;
        }
    },
    created(){
        
    },
    mounted(){
        try {//获取员工推广码
            if(this.$route.query.link){
                sessionStorage.setItem('link',this.$route.query.link);
                getInviteUserIdByCode({code:this.$route.query.link}).then(res=>{
                    if(this.$route.path == '/order/order-initInfo'){
                        if(JSON.parse(sessionStorage.getItem('orderCode'))){
                            let codeList = JSON.parse(sessionStorage.getItem('orderCode')) || [];
                            let idList = codeList.filter( item =>{
                                return item.staffId == res.data.code
                            })
                            if( idList.length > 0){
                                codeList.push({
                                    code: this.$route.query.link,
                                    staffId: res.data.data,
                                    orderId: this.$route.query.id
                                })
                                sessionStorage.setItem('orderCode', JSON.stringify(codeList));
                            }else{
                                sessionStorage.removeItem('orderCode');
                                sessionStorage.setItem('orderCode',JSON.stringify([{ code: this.$route.query.link, staffId: res.data.data, orderId: this.$route.query.id }]));
                            }
                        }else{
                            sessionStorage.setItem('orderCode', JSON.stringify([{code: this.$route.query.link, staffId: res.data.data, orderId: this.$route.query.id }]));
                        };
                    }else if(this.$route.path == '/productdetails/details'){
                        if(sessionStorage.getItem('spuCode')){
                            let codeList = JSON.parse(sessionStorage.getItem('spuCode')) || [];
                            let idList = codeList.filter( item =>{
                                return item.staffId == res.data.code
                            })
                            if( idList.length > 0){
                                codeList.push({
                                    code: this.$route.query.link,
                                    staffId: res.data.data,
                                    spuId: this.$route.query.spuId
                                })
                                sessionStorage.setItem('spuCode', JSON.stringify(codeList));
                            }else{
                                sessionStorage.removeItem('spuCode');
                                sessionStorage.setItem('spuCode', JSON.stringify([{ code: this.$route.query.link, staffId: res.data.data, spuId: this.$route.query.spuId }]))
                            }
                        }else{
                            sessionStorage.setItem('spuCode', JSON.stringify([{ code: this.$route.query.link, staffId: res.data.data, spuId: this.$route.query.spuId }]))
                        };
                    }
                })
            }
        } catch (error) {
            console.log(error);
        };
        getUserInfo().then(res=>{//页面刷新重新获取用户信息
            if(res.data.code == 10002){
                //清除用户信息
                this.$store.state.userInfo = {};
                localStorage.removeItem('userInfo');
                if(this.$route.matched[0].path == '/member'){
                    location.href = "/login";
                }
            }else{
                //刷新用户信息
                this.userInfo = res.data.data;
                this.$store.state.userInfo = res.data.data;
                localStorage.setItem('userInfo', JSON.stringify(res.data.data));
            };
        })
		window.addEventListener("scroll", this.handleScroll,true);
    },
    methods:{
        closeAuthDialog(){
            this.$store.state.authDialog = false;
        },
        toAuth(){
            this.$store.state.authDialog = false;
            this.$router.push({
                path: '/member/authentication',
            });
        },
        getContent(val){
            this.serach = val;
        },
        top(){
            scrollTo(0,0);
        },
         handleScroll() {
			//改变元素#searchBar的top值
			var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            var offsetTop = document.querySelector(".left_navigate").offsetTop;
			if (scrollTop <= 600 ) {
				offsetTop = 600 - Number(scrollTop);
                document.querySelector(".left_navigate").style.top = offsetTop+'px';
			} else {
				document.querySelector(".left_navigate").style.top = '60px';
			}
        },
        getListId(data){
            this.clickBox = data.id;
            if(data.path == undefined){
                window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no')
            }else{
                if(data.id==5||data.id==6){
                    getUserInfo().then(res=>{//页面刷新重新获取用户信息
                        if(res.data.code == 10002){
                            //清除用户信息
                            this.$store.state.userInfo = {};
                            localStorage.removeItem('userInfo');
                            location.href = "/login";
                        }else{
                            //刷新用户信息
                            this.$store.state.userInfo = res.data.data;
                            window.open(this.shopUrl+data.path,'_self');    

                        }
                    })
                } else {
                   this.$router.push({
                        name:data.path
                    })
                }                
            }
        },
    },
    destroyed() {
		//离开该页面需要移除这个监听的事件
		window.removeEventListener("scroll", this.handleScroll,true);
	}
};
</script>
<style >
.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.btn-custom-cancel {
  float: right !important;
  margin-left: 10px !important;
}
</style>
<style lang="stylus" scoped>
.left_navigate{
    position:fixed;
    top:600px;
    margin-left:150px;
    z-index:9999;
}
.left-box:hover{
    background:#36A6FE;
}
.top{
    padding:9px;
    cursor:pointer;
    font-size:14px;
    background:#36A6FE;
}
@media screen and (max-width:1760px) {
    .left_navigate{
        margin-left: 0px;
    }
}
@media screen and (max-width:1317px) {
    .left_navigate{
        display:none;
    }
}
.listSty{
    background:#36A6FEFF;
}
.auth-dialog{
    position: fixed
    width: 457px
    height: 440px
    border-radius: 10px
    background: #FFFFFF
    border 1px solid #CCCCCC
    top: 300px
    left: 40%
    z-index: 9999
    color: #333333
}
.auth-img{
    width 457px
    height 216px
    margin-left: -1px
    margin-top -12px
}
.auth-prompt{
    width 373px;
    margin 27px 42px
}
.auth-title{
    font-size: 18px;
    font-weight: 550;
    margin-top: 20px
}
.auth-content{
    font-size:14px
    color: #333333
    line-height: 25px
    margin-top: 10px
}
.auth-btn{
    width: 200px
    height: 40px
    line-height: 40px
    font-size: 16px
    font-weight: 550
    text-align: center
    margin 0 auto
    background: #1589E5
    border-radius: 20px
    color: #FFFFFF
    margin-top: 40px
    cursor: pointer
}
.close-img{
    position: absolute
    right 10px
    top 10px
    width 20px
    height 20px
    cursor:pointer
}
</style>