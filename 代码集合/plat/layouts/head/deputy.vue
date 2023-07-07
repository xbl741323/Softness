<template>
    <div class="frame">
        <div class="box">
            <div :class="['head-content',info==null?'spacebetween':'']">
                <img class="imgSty" @click="goHome()" src="~assets/images/zhengce/logo_nav@2x.png" />
                <div class="choose">
                    <client-only>
                        <div class="location"><i class="iconfont" style="color:red">&#xe627;</i>{{location}}</div>
                        <el-popover
                            placement="bottom"
                            trigger="manual"
                            v-model="visible"
                        >
                            <div class="province">
                                <div class="province-box">
                                    <newarea class="province-flex" :placeholder="'请选择省份城市'" v-model="areaArr"
                                        @change="(v) => changeAddress(v)" @changeLocation="getLocal">                                                    
                                    </newarea>
                                </div>
                            </div>
                            <p class="change-city"  slot="reference" @click="showDialog()">[{{$t('txt.switch')}}]</p>
                        </el-popover>
                    </client-only>
                </div>
                <p class="pSty">{{$t('txt.serviceHotline')}}：<span class="spanSty">{{$t('txt.tel')}}</span></p>
                <div class="divSty">
                    <img class="imgSty1" src="~assets/images/home/icon_serch_home@2x.png" @click="search()"/>
                    <input class="search_input" v-model="searchContent" :placeholder="searchList[0]"  @keydown.enter="search()"/>
                </div>
                <client-only>
                    <div class="divStyle">
                        <div v-show="userType == 2">
                            <div v-if="authStatus == 1" :class="[certifiedType == 1 ? 'attestation-low' : '', 'goauthor hasgoauthor']">
                                <span class="authword" v-if="certifiedType == 1">初级认证</span>
                                <span class="authword" v-if="certifiedType == 2">高级认证</span>
                            </div>
                            <div class="notauthor"  @click="goauthentication" v-else>
                                <span class="authword">{{$t('txt.unCertified')}}</span>
                            </div>
                        </div>
                        <div class="company-name" v-if="!judgeNull(companyName)">{{companyName}}</div>
                        &nbsp;{{$t('txt.howdoyoudo')}}，
                        <p v-if="info == null">
                            <nuxt-link to="/login" rel="nofollow">
                                <span class="spanStyle">{{$t('txt.login')}}</span>
                            </nuxt-link>
                            丨
                            <nuxt-link to='/register' rel="nofollow">
                                <span class="spanStyle">{{$t('txt.register')}}</span>
                            </nuxt-link>
                        </p>
                        <div class="user-info" v-else>
                            <p @click="toMember()" class="name">{{ info.username}} </p>
                            <div v-show="userType == 0 || userType == 1">
                                <div class="goauthor hasgoauthor" v-if="authStatus == 1">
                                    <span class="authword">{{$t('txt.certified')}}</span>
                                </div>
                                <div class="goauthor"  @click="goauthentication" v-else>
                                    <span class="authword">{{$t('txt.notCertified')}}</span>
                                </div>
                            </div>
                            <span @click="logOut()">| {{$t('txt.signOut')}}</span>
                        </div>
                    </div>
                </client-only>
                <!-- <p class="pStyle" @click="showQia()">{{$t('txt.wtCooperation')}}丨{{$t('txt.feedback')}}</p> -->
            </div>
        </div>
    </div>
</template>

<script>
import { logOut,getUserInfo} from "@/api/login"
import { getLocation,getHotSearch} from '@/api/home'
import newarea from '@/components/search/newarea.vue'
export default {
    components:{
        newarea
    },
    data(){
        return{
            info:null,
            searchList:[],
            searchContent:'',
            location:'',
            provinceList:[],
            identification:'',
            userType:null,
            authStatus:null,
            certifiedType: null,
            companyName:"",
            areaArr: [],
            visible: false
        }
    },
    filters:{
        changeInfo(value) {
        if (value) {
            var reg = /^(\d{3})\d*(\d{4})$/;
            var str = value.replace(reg, "$1****$2");
            return str;
        }
        },
    },
    methods:{
        showDialog(){
            this.visible = !this.visible
        },
        getLocal(value){
            this.location = value.city
            this.visible = false
        },
        changeAddress(value) {
            //地址选择
            if(value.city!=''){
                let areaNo = value.area.join(',')
                let city = ''
                if(value.city.lastIndexOf('市') > -1){
                    city = value.city.substr(0, value.city.lastIndexOf('市'))
                }else{
                    city = value.city
                }
                this.changeProvince(city, areaNo)
                this.visible = false
            }
        },
        goauthentication(){
           window.open('/member/authentication','_self')
        },
        toMember(){
            getUserInfo().then(res=>{
                if(res.data.code !== 10002){
                    this.$router.push({
                        path:'/member'
                    })
                }else{
                    location.href = "/login";
                }
            })
        },
        logOut(){
            logOut().then(res=>{
                localStorage.removeItem('userInfo');
                sessionStorage.clear();
                location.href='/'
            })
        },
        showQia() {
            window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no')
        },
        changebackground(){
            document.querySelector('.choose').style.background = '#5D5D5D';
        },
        clearbackground(){
            document.querySelector('.choose').style.background = '';
        },
        toLogin(){
            this.$router.push({
                path: "/login"
            });
        },
        toRegister(){
            this.$router.push({
                path: "/register"
            });
        },
        changeProvince(name,data){
            this.location = name;
            this.$store.commit('Set_LocationNo',data);
            sessionStorage.setItem('locationName',name);
            sessionStorage.setItem('locationNo',data);
        },
        goHome(){
            window.open('/','_self');
        },
        search(){
            if(this.$route.path =='/search'){
                if(this.searchContent==""){     
                    this.$store.commit('searchTxt',this.searchList[0])              
                }else{
                    this.$store.commit('searchTxt',this.searchContent);
                }
                    this.searchId = '';           
            }else{
                if(this.searchContent==""){
                    this.$store.commit('searchTxt',this.searchList[0])
                    this.$router.push({
                        path: "/search",
                        query:{keywords:this.searchList[0]}
                    })
                    this.$emit('content',this.searchList[0])

                }else{
                    this.$store.commit('searchTxt',this.searchContent);               
                    this.$router.push({
                        path: "/search",
                        query:{keywords:this.searchContent}
                    })
                    this.$emit('content',this.searchContent)
                }
            }
        },
        getData() {
            //热门搜索下拉框
            getHotSearch(5).then(res=>{
                this.searchList = res.data.data;
            })
            this.location = sessionStorage.getItem("locationName")
            getLocation(this.identification).then(res=>{
                if(!res || !res.data){
                    this.location = '合肥'
                    this.$store.commit('Set_LocationNo','340000,340100');
                    sessionStorage.setItem('locationNo','340000,340100');
                }else{
                    if(res.data.code==1000){
                        if(res.data.data.areaName== '局域网'){
                            this.location = '合肥';
                            this.$store.commit('Set_LocationNo','340000,340100');
                            sessionStorage.setItem('locationNo','340000,340100');
                            sessionStorage.setItem('locationName','合肥');
                        }else{
                            this.location = res.data.data.areaName;
                            sessionStorage.setItem('locationNo',res.data.data.areaNo);
                            this.$store.commit('Set_LocationNo',res.data.data.areaNo);
                            if(res.data.data.identification){//定位返回信息
                                localStorage.setItem('identification',res.data.data.identification)
                            }
                        }
                    }else{
                        this.location = '合肥'
                        this.$store.commit('Set_LocationNo','340000,340100');
                        sessionStorage.setItem('locationNo','340000,340100');
                        sessionStorage.setItem('locationName','合肥');

                    }
                }
            }).catch(err=>{
                return err;
            });
        },
        getInfo(){
            getUserInfo().then(res=>{
                if(res.data.code == 0){
                    let userObj = res.data.data;
                    this.info = userObj;
                    this.authStatus = this.info.authStatus;
                    this.certifiedType = this.info.certifiedType
                    this.userType = this.info.userType;
                    if(this.userType == 2){
                        this.companyName = this.info.companyName
                    }
                }
            })
        },
        judgeNull(str){
            if(str == null || str == '' || str == undefined){
                return true;
            }
            return false;
        }
    },
    mounted(){
        //定位
        // if(localStorage.getItem('identification')){
        //     this.identification = localStorage.getItem('identification');
        // }
        this.getInfo()
        this.getData();
    }
}
</script>

<style lang="stylus" scoped>
.spacebetween{
     justify-content: space-between; 
}
.frame{
    width:100%;
    background:#3D3E3E;
    font-size:14px;
    height:46px;
    .box{
        width:100%;
        position:fixed;
        z-index:2;
        background:#3D3E3E;
        .head-content{
            height:46px;
            line-height:46px;
            width:1200px;
            margin:0 auto;
            display:flex;
            justify-content: space-between;
            .choose{
                display:flex;
                margin-right: 15px;
                .location{
                    color:#FFF;
                    max-width: 75px;
                    text-overflow:ellipsis;
                    overflow:hidden;
                    display:-webkit-box;
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:1;
                }
            }
        }
    }
.search{
    width:100px;
    height:30px;
    margin:auto 0;
    line-height:30px;
    border-radius:20px;
    border: 1px solid #5D5D5D;
    background-color:#5D5D5D;
    color:#FFF;
    margin-left:-100px;
    padding-left:30px;
    display:flex;
    cursor:pointer;
}
.user-info{
    display:flex;
    cursor:pointer;
    .username{
        width:60px;
        margin-right: 5px;
        color:#36A6FE;
        text-overflow:ellipsis;
        overflow:hidden;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:1;
    }
    .name {
        width:60px;
        text-overflow:ellipsis;
        overflow:hidden;
        white-space: nowrap;
        color:#36A6FE;
    }
}
.search_input{
    color:#FFF;
    width:314px;
    height:30px;
    margin:auto 0;
    border-radius:20px;
    background:#5D5D5D;
    border:1px solid #5D5D5D;
    outline:one;
    padding-left:30px;
    padding-right:100px;
    font-size:16px;
    overflow: hidden;
}
input:focus{
    outline:0;
    padding-left:15px;
}
}
.change-city{
    color:#AFAFAFFF;
    font-size:12px;
    padding:0 0 0 10px;
    cursor:pointer;
    position: relative;
    top: 1px;
}
.province{
    width:300px;
}
.province-box{
    // display: grid;
    // grid-template-columns: 20% 20% 20% 20% 20%;
    // text-align: center;
    // line-height:30px;
    height: 100px;
    margin: 10px 0 0 10px;
}
.province-name{
    min-width: 60px;
    padding:2px 5x;
    cursor:pointer;
    text-overflow:ellipsis;
    overflow:hidden;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:1;
}
.province-name:hover{
    color:#FFF;
    background:#36A6FE;
}
.goauthor{
    display: inline-block;
    border: 1px solid #36a6fe;
    border-radius: 5px;
    font-size: 12px;
    height: 24px;
    width: 66px;
    position: relative;
    top: 42%;
    transform: translateY(-50%);
    margin-right: 6px;
    font-size: 12px;
    color: #36a6fe;
    padding-left:5px;
    text-align: center;
}
.authword{
    position: absolute;
    top: -11px;
    left: 0px;
    font-size:12px;
    display:inline-block;
    padding-left:9px;
}
.hasgoauthor{
    color: #ffffff;
    background: #2A65EF;
    border-radius: 12px;
    border: 1px solid #2A65EF;
}
.notauthor {
    display: inline-block;
    border: 1px solid  #c6c7c8;
    background:  #c6c7c8;
    border-radius: 12px;
    font-size: 12px;
    height: 24px;
    width: 56px;
    position: relative;
    top: 42%;
    transform: translateY(-50%);
    margin-right: 6px;
    font-size: 12px;
    color: #c6c7c8;
    padding-left:5px;
    text-align: center;
    color: #6B6B6B;
}
.imgSty {
    height:40px;
    color:#FFF;
    margin:auto 0;
    cursor:pointer;
}
.pSty {
    color:#FFF;
    line-height:46px;
}
.divSty {
    display:flex;
    position:relative;
}
.spanSty {
   color:#FD651C;
   font-size:18px;
   font-weight:500;
   position:relative;
   top:1px;
}
.imgSty1 {
   width:20px;
   height:20px;
   position:absolute;
   top:13px;
   left:5px;
}
.divStyle {
    color:#FFF;
    padding-left:30px;
    line-height:46px;
    display:flex;
}
.spanStyle {
  color:#36A6FE;
  cursor:pointer;
  text-decoration: none;
}
.pStyle {
    color:#FFF;
    padding-left:30px;
    cursor:pointer;
    line-height:46px;
}
.company-name {
    width:130px;
    height: 46px;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space: nowrap;
    color:#fff;
    font-family:Microsoft YaHei UI;
}
.attestation-low{
    background: #e2860f;
    border: 1px solid #e2860f;
}
</style>
