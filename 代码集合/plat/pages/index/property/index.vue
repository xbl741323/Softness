<template>
    <div class="index_property">
        <!-- banner -->
        <div class="banner_img" v-if="searchMark !=0">
            <banner :typeId="6"></banner>
        </div>
        <!-- 专利服务 -->
        <div class="index_patent">
            <div class="patent_tit" >
                <span class="service_tit">专利服务</span>
                <span>知识产权关于企业发展</span>
            </div>
            <div class="patent_con">
                <div class="patent_title" v-for="(item, index) in patentList" :key="index">
                    <div @click="goDetail(item)">
                        <img :src='imgPath+item.coverUrl' alt="">
                        <span class="title_name">{{item.name}}</span>
                        <span class="title_slogan">{{item.slogan}}</span>
                    </div>
                    <i></i>
                    <div class="button" @click="showQia()">立即咨询</div>
                </div>
            </div>
            <div class="bottom" v-if="patentAll.length>8&&patentList.length<=8">
                <p @click="viewMore(0)" class="more">更多服务</p>
                <p @click="viewMore(0)" class="arrow"></p>
            </div>
             <div class="bottom" v-if="patentList.length>8">
                <p @click="viewMore(0)" class="more more-down">收起</p>
                <p @click="viewMore(0)" class="arrow-down"></p>
            </div>
        </div>

        <div class="trademark_copyright">
            <!-- 商标服务 -->
            <div class="index_trademark">
                <div class="trademark_tit" >
                    <span class="service_tit">商标服务</span>
                    <span>知识产权关于企业发展</span>
                </div>
                <div class="trademark_con">
                    <div class="trademark_title" v-for="(item, index) in tradeList" :key="index">
                        <div class="bg-imgs">
                            <img class="bg-cont" src='~assets/images/zhichan/bg02_shangbiao@2x.png' alt="">
                        </div>
                        <img class="ico-img" :src='imgPath+item.coverUrl' alt="" @click="goDetail(item)">
                        <div class="txt-show">
                            <div @click="goDetail(item)">
                                <div class="txt-box">{{item.name}}</div>
                                <p class="title_slogan">{{item.slogan}}</p>
                            </div>
                            <button class="button" @click="showQia()">立即咨询 ></button>
                        </div>
                    </div>
                </div>
               <div class="bottom" v-if="tradeAll.length>6&&tradeList.length<=6">
                    <p @click="viewMore(1)" class="more">更多服务</p>
                    <p @click="viewMore(1)" class="arrow"></p>
                </div>
                <div class="bottom" v-if="tradeList.length>6">
                    <p @click="viewMore(1)" class="more more-down">收起</p>
                    <p @click="viewMore(1)" class="arrow-down"></p>
                </div>
            </div>

            <!-- 版权服务 -->
            <div class="index_copyright">
                <div class="copyright_tit" >
                    <span class="service_tit">版权服务</span>
                    <span>知识产权关于企业发展</span>
                </div>
                <div class="copyright_con">
                    <div class="copyright_title" v-for="(item, index) in copyList" :key="index" >
                        <img :src='imgPath+item.coverUrl' alt="" @click="goDetail(item)">
                        <div @click="goDetail(item)" class="txt-show">
                            <div class="title_name">{{item.name}}</div>
                            <div class="title_slogan">{{item.slogan}}</div>
                        </div>
                        <button class="button"  @click="showQia()">立即咨询</button>
                    </div>
                     <div class="bottom" v-if="copyAll.length>4&&copyList.length<=4">
                        <p @click="viewMore(2)" class="more">更多服务</p>
                        <p @click="viewMore(2)" class="arrow"></p>
                    </div>
                    <div class="bottom bottom_one" v-if="copyList.length>4">
                        <p @click="viewMore(2)" class="more more-down">收起</p>
                        <p @click="viewMore(2)" class="arrow-down"></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 我们的团队 -->
        <div class="index_team">
            <div class="team_title">
                <h1>我们的团队</h1>
                <h3>专业专利工程师为您保驾护航</h3>
            </div>
            <div class="team_main">
                <div v-for="(item, index) in team" :key="index" class="img_item">
                    <img :src="require('@/assets/images/zhichan/' + item.url)" alt="" v-if="item.url">
                    <div v-else class="team_info" :style="'background:' + item.bg">
                        <div class="title_name">{{ item.name }}</div>
                        <div class="title_slogan">{{ item.slogan }}</div>
                        <div class="title_english">{{ item.english}}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 服务流程 -->
        <div class="index_service">
            <div class="team_title">
                <h1>服务流程</h1>
                <h3>全程保密安全</h3>
            </div>
            <div class="service_main">
                <div class="box" :class="{lastbox: i === service.length - 1}" v-for="(d, i) in service" :key="i">
                    <div class="service_top">
                        <div class="service_img">
                            <span v-html="d.name">
                               <!-- {{ d.name }} -->
                            </span>
                        </div>
                        <div class="service_info" v-html="d.info">
                            <!-- {{ d.info }} -->
                        </div>
                    </div>
                        <i class="service_line" v-if="i !== service.length - 1"></i>
                </div>
            </div>
        </div>

        <!-- 我们的优势 -->
        <div class="Advantage_box">
            <div class="index_Advantage">
                <div class="team_title">
                    <h1>我们的优势</h1>
                    <h3>大品牌 品质保证</h3>
                </div>
                <div class="Advantage_main">
                    <div class="box3">
                        <div class="Advantage_item">
                            <img src="@/assets/images/zhichan/img01_youshi@2x.png" alt="">
                            <div>商标免费起名</div>
                            <i class="blue"></i>
                        </div>
                        <div class="Advantage_item">
                            <img src="@/assets/images/zhichan/img02_youshi@2x.png" alt="">
                            <div>商标免费查询</div>
                            <i class="orange"></i>
                        </div>
                        <div class="Advantage_item">
                            <img src="@/assets/images/zhichan/img01_youshi@2x.png" alt="">
                            <div>7*24小时随时咨询</div>
                            <i class="blue"></i>
                        </div>
                    </div>
                    <div class="box4">
                        <div class="Advantage_item">
                            <img src="@/assets/images/zhichan/img02_youshi@2x.png" alt="">
                            <div>专业客服一对一服务</div>
                            <i class="orange"></i>
                        </div>
                        <div class="Advantage_item">
                            <img src="@/assets/images/zhichan/img01_youshi@2x.png" alt="">
                            <div>注册进度实时查询</div>
                            <i class="blue"></i>
                        </div>
                        <div class="Advantage_item">
                            <img src="@/assets/images/zhichan/img02_youshi@2x.png" alt="">
                            <div>所有服务明码标价</div>
                            <i class="orange"></i>
                        </div>
                        <div class="Advantage_item">
                            <img src="@/assets/images/zhichan/img01_youshi@2x.png" alt="">
                            <div>担保成功全额退款</div>
                            <i class="blue"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { getPropertyList } from '@/api/property'
import Banner from '@/components/policy/banner'
export default {
    props:['searchMark'],
    components:{
        Banner
    },
    head(){
        return {
            title: "申请专利、注册商标、版权登记-找知产代理就上卧涛网！",    
            meta: [
                { charset: "utf-8" },
                {
                    name: "keywords",
                    content:
                    "申请专利,注册商标,版权登记"
                },
                {
                hid: "description",
                name: "description",
                content:
                    "卧涛网提供注册商标、申请专利、版权/著作权登记等一站式知识产权服务，资深审查专家团队，专业顾问一对一在线服务。找知产代理就上卧涛网，全国免费咨询热线：400-0507-580！"
                }
            ],
        }
    },
    data(){
        return{
            imgPath:process.env.CDN_BASE_URL,
            team: [
                {
                    url: 'hade01_team@2x.png'
                },
                {
                    url: 'hade02_team@2x.png'
                },
                {
                    url: 'hade03_team@2x.png'
                },
                {
                    url: '',
                    bg: '#C9C9C9',
                    name: '全员持证上岗',
                    slogan: '成员均获得专利工程师证书',
                    english: 'RELATED CERTIFICATES'
                },
                {
                    url: 'hade04_team@2x.png'
                },
                {
                    url: '',
                    bg: '#fff',
                    name: '专业知产团队',
                    slogan: '高效率，高通过率',
                    english: 'PROFESSIONAL TEAM'
                },
                {
                    url: 'hade05_team@2x.png'
                },
                {
                    url: 'hade06_team@2x.png'
                },
                {
                    url: 'hade07_team@2x.png'
                },
                {
                    url: 'hade08_team@2x.png'
                },
                {
                    url: '',
                    bg: '#fff',
                    name: '行业品牌',
                    slogan: '行业标准化服务领导者',
                    english: 'INDUSTRY BRAND'
                },
                {
                    url: 'hade09_team@2x.png'
                }
            ],
            service: [
                {
                    name: '咨询<br/>专属顾问',
                    info: '案件评估分析<br/>确定最佳保护方案'
                },
                {
                    name: '签订<br/>保密协议',
                    info: '专业三级保密<br/>技术交给我们您放心'
                },
                {
                    name: '签订<br/>代理协议',
                    info: '签订代理协议<br/>顾问撰写全套<br/>专利申请文件'
                },
                {
                    name: '递交<br/>专利局',
                    info: '向专利局递交<br/>专利申请文件'
                },
                {
                    name: '获取<br/>通知书',
                    info: '获取专利<br/>受理通知书'
                },
                {
                    name: '获取<br/>专利证书',
                    info: '获得专利证书'
                },
            ],
            patentLimited:[],
            patentAll:[],
            patentList:[],
            tradeLimited:[],
            tradeAll:[],
            tradeList:[],
            copyLimited:[],
            copyAll:[],
            copyList:[],
            bannerUrl:'',
        }
    },
    methods:{
        goDetail(item){
             window.open('/'+item.id+item.type);            
        },
        viewMore(val){
            if(val == 0){ //点击专利显示更多
                if(this.patentList.length>8){
                    this.patentList = this.patentLimited
                } else{
                    this.patentList = this.patentAll;
                }                
            } else if(val == 1){//点击商标显示更多
                if(this.tradeList.length>6){
                    this.tradeList = this.tradeLimited
                } else{
                    this.tradeList = this.tradeAll;
                }
            } else {//点击版权显示更多
                if(this.copyList.length>4){
                    this.copyList = this.copyLimited
                } else{
                    this.copyList = this.copyAll;
                }
            }           
        },
        getData(){
            getPropertyList().then(res=>{
                this.patentLimited = res.data.data[1].children.slice(0,8);//截取专利前8个数据
                this.patentAll = res.data.data[1].children;//获取专利全部数据
                this.patentList = this.patentLimited;//默认显示前8个数据
                this.tradeLimited = res.data.data[2].children.slice(0,6);
                this.tradeAll = res.data.data[2].children;
                this.tradeList = this.tradeLimited;
                this.copyLimited = res.data.data[3].children.slice(0,4);
                this.copyAll = res.data.data[3].children;
                this.copyList = this.copyLimited;
            }).catch(err=>{
                return err;
            });
        },
        showQia() {
            window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no')
        },
    },
    mounted(){
        this.getData()
    }
}
</script>

<style scoped>
.index_property{
    width: 100%;
    min-width: 1200px;
}
.banner_img{
    width: 100%;
}
.banner_img img{
    display: block;
    width: 100%;
    height: 440px;
}
.index_patent, .index_trademark, .index_copyright, .index_team, .index_service, .index_Advantage{
    width: 1200px;
    margin: 0 auto;
}
.trademark_copyright{
    width: 100%;
    background-image: url(~@/assets/images/zhichan/bg_shangbiao@2x.png);
    background-size: 100%;
    padding-bottom: 130px;
}
.patent_tit, .trademark_tit, .copyright_tit{
    width: 1190px;
    height: 64px;
    background-image: url(~@/assets/images/zhichan/img01_zhuanli@2x.png);
    background-size: 100% 100%;
    text-align: left;
    margin: 0 auto;
}
.patent_tit {
    margin-top: 59px;
}
.patent_tit span, .trademark_tit span, .copyright_tit span{
    position: relative;
    left: 30px;
    top: 10px;
    color: #ffffff;
    margin-right: 14px;
}
.trademark_tit{
    margin-bottom: 20px;
    background-image: url(~@/assets/images/zhichan/img01_shangbiao@2x.png);
}
.copyright_tit{
    margin-bottom: 20px;
    background-image: url(~@/assets/images/zhichan/img01_banquan@2x.png);
}
.service_tit{
    font-size: 20px; 
    font-weight: 600;
    line-height: 45px;
}
.patent_con , .copyright_con, .trademark_con{
    width: 100%;
    display: inline-block;
    margin-top: 20px;
    cursor: pointer;
}
.patent_title{
    cursor: pointer;
    width: 23.5%;
    float: left;
    margin-right: 2%;
    height: 250px;
    /* padding: 20px 0 25px; */
    padding-top: 20px;
    text-align: center;
    /* border:1px solid #CECECE; */
    border-radius: 4px;
    margin-bottom: 20px;
    box-sizing: border-box;
    background-image:url(~@/assets/images/zhichan/bg01_zhuanli@2x.png) ;
}
.patent_title:nth-child(4n+4){
    margin-right: 0;
}
.patent_title:hover .title_name {
    color: #36A6FE;
}
.patent_title:hover .button,  .copyright_title:hover .button{
    color: #fff;
    background-color: #36A6FE;
}
.patent_con img{
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
}
.patent_con span{
    display: block;
}
.title_name{
    font-size: 16px;
    color: #373D40;
    font-weight: bold;
    line-height: 30px;
    /* padding: 0 15px; */
}
.title_slogan{
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
    color: #a8a8a8;
    margin-top: 3px;
    padding: 0 7px;
}
.patent_title i{
    display: inline-block;
    width: 222px;
    height: 1px;
    background-color: #CECECE;
    margin: 14px auto 20px;
}
.button{
    outline: none;
    width: 190px;
    height: 36px;
    line-height: 36px;
    background: #FFFFFF;
    border: 1px solid #36A6FE;
    border-radius: 2px;
    margin: 0 auto;
    text-align: center;
    font-size: 16px;
    color: #36A6FE;
    font-weight: bold;
}
.index_trademark {
    padding-top: 40px;
    padding-bottom: 20px;
}
.trademark_title{
    width: 32%;
    float: left;
    margin-right: 2%;
    height: 120px;
    padding: 35px;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    text-align: left;
    position: relative;
}
.trademark_title:nth-child(3n+3){
    margin-right: 0;
}
.bg-imgs{
    position: absolute;
    left: 0;
    top: 0px;
    width: 100%;
    z-index: 0;
}
.bg-cont{
    width: 100%;
}
.txt-show{
    z-index: 1;
}
.txt-box{
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 10px;
    font-size: 16px;
    color: #373D40;
    font-weight: bold;
    line-height: 30px;
}
.trademark_title:hover{
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
.ico-img {
    width: 60px;
    height: 60px;
    z-index: 1;
    margin-right: 25px;
}
.trademark_title .title_slogan {
    display: block;
}
.trademark_title .txt-show button {
    border: none;
    background-color:#FFFDF9;
    color: #a8a8a8;
    font-weight: bold;
    cursor: pointer;
    font-size: 14px;
    text-align: left;
    outline: none
}
.trademark_title:hover .title_name, .trademark_title:hover button{
    color: #36A6FE;
}
.copyright_con{
    background-color: #fff;
    min-height: 301px;
    padding: 30px 10px 0; 
    /* justify-content: flex-start; */
}
.copyright_title{
    background-image: url(~@/assets/images/zhichan/bg03_banquan@2x.png);
    width: 23.5%;
    float: left;
    margin-right: 2%;
    height: 211px;
    padding: 20px 40px;
    box-sizing: border-box;
    text-align: center;
    /* margin-right: 20px; */
    /* margin: 0 11px; */
    margin-bottom: 20px ;
}
.copyright_title:nth-child(4n+4){
    margin-right: 0;
}
.copyright_title .title_slogan {
    margin-bottom: 20px;
}
.copyright_title img{
    width: 60px;
    height: 60px;
}
.copyright_title .button {
    cursor: pointer;
}
.copyright_title:hover .title_name{
    color: #36A6FE;
}
.index_team {
    background-color: #fff;
    padding: 30px 0 80px;
}
.team_title h1{
    font-size: 20px;
    margin: 0 auto;
    font-weight: 600;
    margin-bottom: 10px;
    text-align: center !important;
}
.team_title h3 {
    margin: 0 auto;
    color: #656565;
    font-size: 14px;
    font-weight: 500;
    text-align: center !important;
    margin-bottom: 30px;
}
.team_main {
    display: flex;
    flex-wrap: wrap;
}
.img_item {
    width: 298px;
    height: 160px;
}
.img_item img{
    width: 100%;
    height: 100%;
}
.team_info {
    padding: 20px;
    box-sizing: border-box;
    text-align: left;
    height: 100%;
    position: relative;
}
.team_info .title_name{
    font-size: 20px;
}
.team_info .title_slogan{
    color: #565656;
}
.team_info .title_english{
    color: #373D40;
    position: absolute;
    bottom: 20px;
}
.index_service{
    padding-bottom: 60px;
}
.service_main{
    display: flex;
}
.box {
    width: 280px;
    display: flex;
}
.lastbox{
    width: auto;
}
.service_top{
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
.service_img{
    width: 104px;
    height: 104px;
    background-image: url(~@/assets/images/zhichan/img_liucheng@2x.png);
    background-size: 100%;
    margin: 0 auto;
    color: #fff;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    justify-content: center;
}
.service_line{
    display: inline-block;
    border: 1px dashed #36A6FE;
    transform: rotate(90deg);
    height: 80px;
    margin-left: 40px;
    margin-top: 10px;
}
.service_info{
    color: #5F6365;
    font-size: 16px;
    width: 132px;
    margin-top: 14px;
    font-weight: 400;
}
.Advantage_box{
    padding-top: 30px;
    padding-bottom: 169px;
    background-color: #EFF2F3;
}
.box3{
    width: 696px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    margin-bottom: 30px;
}
.box4{
    width: 944px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
}
.Advantage_item{
    width: 220px;
    height: 130px;
    background-color: #fff;
    position: relative;
    padding: 40px;
    padding-top: 47px;
    box-sizing: border-box;
    border-radius: 4px;
}
.Advantage_item img{
    position: absolute;
    top: 0;
    left: 12px;
    width: 24px;
}
.Advantage_item div{
    color: #5E6568;
    font-size: 20px;
    font-weight: 600;
    white-space: nowrap;
}
.Advantage_item i{
    display: inline-block;
    width: 30px;
    height: 2px;
}
.blue {
    background-color: #36A6FE;
}
.orange {
    background-color: #FB8249;
}
.bottom{
    width: 100%;
    text-align: center;
    padding-bottom: 25px;
    cursor: pointer;
}
.more{
    color: #A8A8A8;
    font-size: 15px;
    padding-bottom: 3px;
}
.more-down{
    margin-bottom: 5px;
}
.arrow{
    position: absolute;
    color: #A8A8A8; 
    display: inline-block;
    content: "";
    width: 8px;
    height: 8px;
    border: solid#666666;
    border-width: 1px 1px 0 0;
    -webkit-transform: translate(0,-50%) rotate(135deg);
    transform: translate(0,-50%) rotate(135deg);
}
.arrow-down{
    position: absolute;
    color: #A8A8A8; 
    display: inline-block;
    content: "";
    width: 8px;
    height: 8px;
    border: solid#666666;
    border-width: 1px 1px 0 0;
    -webkit-transform: translate(0,-50%) rotate(314deg);
    transform: translate(0,-50%) rotate(314deg);
}
.bottom_one{
    display: inline-block;
}
</style>