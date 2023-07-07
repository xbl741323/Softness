<template>
        <div class="frame" v-loading="loading">
            <div class="backgroundImg" v-show="searchMark !=0">
                <banner :typeId='3'></banner>
            </div>
            <div class="search-box"  v-show="searchMark !=0">
                <div class="search_frame" :v-model="searchForm">
                    <input type="text" class="search_input" placeholder='请输入关键字' v-model="searchForm.content" @keydown.enter="search()" />
                    <div class="project_search" @click="search()"> <img src="~/assets/images/home/icon_search_home.png"/></div>
                </div>
                <div class="hot_project" >
                    <p v-show="this.searchList.length>0" style="color: #36A6FE;position: relative;top: 8px;">{{$t('txt.hotSearch')}}：</p>
                    <div v-for="(item,index) in searchList" :key="index" class="btn" :class="[{searchStyle:searchId == item}]" @click="getSearchId(item)">
                        {{item}}
                    </div>
                </div>
            </div>
            <!-- 地区 -->
            <div class="address">
                <div class="line"></div>
                <div class="centralized">
                    <div class="provinces" >
                        <p class="areaname">{{$t('txt.area')}}</p>
                        <div class="list">
                           <city @areaChange="childArea" />
                        </div>
                    </div>
                </div>
                <!-- 级别 -->
                <div class="centralized hei">
                    <p class="name" >级别</p>
                    <div class="classification">
                        <div class="btn" v-for="items in levelList" :key="items.value" :class="[{activeSty:levelId== items.value}]" >
                            <span  @click="getLevel(items)">{{items.label}}</span>
                        </div>
                    </div>
                </div>
                <!-- 归口 -->
                <div class="centralized hei" v-for="item in areaList.selection" :key="item.id">
                    <p class="name" >{{item.categoryName}}</p>
                    <div class="classification">
                        <div class="btn" v-for="items in item.options" :key="items.id" :class="[{activeSty:putUnder == items.id}]" >
                            <span  @click="getAttribution(items)">{{items.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 项目列表 -->
            <div class="project_list" :class="{newSty:announceList.length==0}">
                <!-- 排序 -->
                <div class="sorting">
                    <div class="new-hot"></div>
                    <div style="margin-left:68.5%;line-height:30px;">
                        <span class="hotestSort" @click="hotSort('hot')" :class="[{activeSort:newsId.indexOf('hot')>-1}]" >综合排序</span>
                        <span class="newestSort" @click="newSort('new')" :class="[{activeSort:newsId.indexOf('new')>-1}]" >发布时间</span>
                    </div>
                </div>
                <div  v-show="announceList.length==0" style="height:210px;width:210px;text-align:center;margin:0 auto;color:#BFBFBF;">
                    <img style="width:100%;height:100%;" src="~assets/images/zhengce/tongzhi_img_nodata@2x.png" />
                    {{$t('txt.noContentTxt')}}
                </div>
                <div class="grid_list" v-show="announceList.length>0"> 
                    <div class="row" v-for="(item,index) in announceList" :key="index" @click="goDetail(item.id)" >
                        <!-- <img class="project_img" :src='imgPath+item.imageUrl' v-if="item.imageUrl&&item.imageUrl !=''&&item.imageUrl !=null" /> -->
                        <img class="project_img" :src='imgPath+item.imageUrl' v-if="!fileType(item.imageUrl)" />
                        <img class="project_img" :src='imgPath+item.mediaUrl' v-if="fileType(item.imageUrl)" />
                        <div class="consult" style="padding-left: 22px;padding-right: 27px;">
                          <span class="consult_title" v-html="item.spuTitle"></span>
                        </div>
                        <p class="project_introdution" v-html="item.spuSlogan"></p>
                        <div class="deposit">
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
            <!-- 分页 -->
            <div style="position:relative;padding:20px 0;">
                <client-only>
                    <el-pagination
                        style="position:absolute;left: 50%; top: 50%; transform: translate(-50%,-50%)"
                        background
                        layout="prev, pager, next"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        :current-page="currentPage"
                        :page-size="pagesize"
                        :total="total">
                    </el-pagination>
                </client-only>
            </div>
        </div>
</template>

<script>
import city from '@/components/search/city.vue'
import { getAreaList } from '@/api/announcement'
import { getProductList ,getSecondProductList} from '@/api/productdetails'
import { getHotSearch,banner} from '@/api/home'
import Banner from '@/components/policy/banner'
import tools from '@/utils/priceDeal' 
export default {
    props:['searchMark','content'],
    components:{
        Banner,
        city
    },
    head () {
        return {
            title: '全国各类科技项目申报条件咨询了解-卧涛网',
            meta: [
                { name: 'keywords', content: '高新技术企业,科技项目申报,专利申请,商标注册,财税咨询,版权登记,卧涛网' },
                {  hid: 'description', name: 'description', content: '卧涛网，专业的科技项目申报服务平台。为企业提供科技项目申报政策解读及认定代理、财税咨询、知识产权申请等多项企业服务。' }
            ] 
        }
    },
    data(){
        return{
            newActiveId:"",
            nowLocationId:"",
            newAreaList:[],
            imgPath:process.env.CDN_BASE_URL,
            searchForm:{
                content:''
            },
            scrollList:[],
            isContent:false,
            isHotSpot:false,
            isNewest:false,
            isTitle:true,
            show:true,
            putUnder:'归口',
            activeId:null,
            newsId:['hot'],
            titleId:['title'],
            pagesize:10,
            currentPage:1,
            total:0,
            attributionId:[],
            announceList:[],
            cityId:0,
            rightList:[],
            attributionList:[],
            areaList:[],
            cityList:[],
            citysList:[],
            listLength:0,
            numberList:[],
            classList:[],
            policySearchParams:[],
            levelId: null,
            generateAttributeList: [{
                    attributeId:1,
                    attributeValueList: []
                },{
                    attributeId:2,
                    attributeValueList: []
                },{
                    attributeId:3,
                    attributeValueList: []
                }
            ],
            param:{},
            activeIndex:0,
            searchList:[],
            searchId:'',
            curr:false,
            active:[],
            activeId:null,
            loading:false,
            hasProvinces: [],
            showProvince: true,
            callInterface: false,
            provinceNo: null,
            keepChildOpen: false,
            provinceInfo:{},//临时存储当前省份信息
            cityNo: 'unlimit',
            levelList: [{
                label: '全部',
                value: null
            },{
                label: '国家级',
                value: 1
            },{
                label: '省级',
                value: 2
            },{
                label: '市级',
                value: 3
            },{
                label: '区级',
                value: 4
            }],
           }
    },
     filters:{
        filterViewprice(val){
           return tools.filterViewprice(val)
        }
    },
    created(){
        if(this.$route.query.search){
            this.searchForm.content = this.$route.query.search;
            this.search();
        }else{
            this.$router.push({
                query: {
                    search: ''
                }
            })
        }
        if(this.$route.params){
            this.param = this.$route.params;
        }else{

        }
    },
    methods:{
        fileType(el){
            let suffix = el.substring(el.lastIndexOf("."),el.length).toLowerCase();
            if('mov,m4v,mp4,avi,dat,mkv,flv,vob,wmv,asf,asx,rm,rmvb'.match(suffix)){
                return true;
            }else{
                return false
            }
        },
        // 筛选地区
        childArea(data){
            let arr = [data]
            this.generateAttributeList[0].attributeValueList =  arr
            this.currentPage = 1
            this.getList()
        },
        getLevel(val){
            this.levelId = val.value
            this.generateAttributeList[2].attributeValueList =  [val.value]
            this.currentPage = 1
            this.getList()
        },
        // 传coverUrl判断进行返回（用于订单列表和订单详情跳转到提交订单页面进行显示判断）
       checkUrl(coverUrl) {
          let urlInfo = {
            urlType: "",
            url: ""
           }
       if ((coverUrl && coverUrl.split('.')[coverUrl.split('.').length - 1] == 'mp4' ||
           coverUrl.split('.')[coverUrl.split('.').length - 1] == 'avi' ||
           coverUrl.split('.')[coverUrl.split('.').length - 1] == 'mov')) {
           urlInfo.urlType = 1
           urlInfo.url = coverUrl
      } else {
          urlInfo.urlType = 0
          urlInfo.url = coverUrl
         }
        return urlInfo;
      },
        // 判断是图片还是视频
        filterType(item){
            if(item.imageUrl.match(/(jpeg|png|jpg|gif)/)){
                return true
            }else{
                return false
            }
        },
        provinceLeave(provinceInfo){
            this.keepChildOpen = false;
            setTimeout(()=>{
                if(!this.keepChildOpen){
                    this.getTab(this.provinceNo,provinceInfo);
                }
            },100);
        },
        keepChildList(){
            this.keepChildOpen = true;
            this.remove();
        },
        leaveChildList(){
            if(this.showProvince){
                this.remove();
            }
            if(this.cityList.length>0 && this.cityList.includes('unlimit')){
                this.keepChildOpen = false;
                this.getTab(this.provinceNo,this.provinceInfo); 
            }
        },
        showQia() {
            window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no')
        },
        getSearchId(data){
            this.searchId = data;
            this.searchForm.content = data;
            this.search(1);
        },
        getHotWords(){
            getHotSearch(4).then(res=>{
                this.searchList = res.data.data;
            });
        },
        goDetail(id){
         const path = this.$router.resolve({
           path:'/productdetails/details',
           query:{
             spuId:id
           }
         })
         window.open(path.href)
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.curr = true;
            this.getList();
        },
        handleSizeChange(val){

        },
        search(data){
            this.showProvince = true;
            if(this.searchForm.content.length>0){
                if(data==1){

                }else{
                    this.searchId = '';
                }
                this.newsId = ['hot'];
                this.isNewest = false;
                this.getList()
                this.$router.push({
                    query:{
                        search: this.searchForm.content
                    }
                })
            }
        },
         //获取列表信息
        getList(){
            // type   类型0-通知公告，1-政策汇编，2-卧涛问答
            if(this.content != undefined || this.content ==''){
                if(this.content || this.content.length == 0 ){
                    this.searchForm.content = this.content;
                    this.show = false;
                    if(this.curr){
                        
                    }else{
                        this.currentPage = 1;
                    }
                }
            }
            this.loading = true;
            let para={
                categoryIdList: [1],
                keyword:this.searchForm.content,
                sort:this.newsId[0]=='new'?'latest':this.newsId[0]=='hot'?'hottest':'latest',
                spuArea: this.generateAttributeList[0].attributeValueList.toString(),
                spuKinds: this.putUnder == '归口' ? '' : String(this.putUnder),
                spuLevel: this.levelId!=null?this.levelId:'全部',
                pageNo: this.currentPage,
                pageSize: 10,
            }
            getSecondProductList(para).then(res=>{
                this.loading = false
                if(res.data.code==0){
                    this.announceList = res.data.data.records
                    this.total = res.data.data.total
                }
            }).catch(err=>{
                return err;
            })
        },
        // 筛选地区
        filterArea(val) {
            let areaList = this.newAreaList
            let filterList = []
            let r = areaList.filter(item => {
              return item.value == val
            })
            if (r.length > 0) {
              r[0].children.forEach(item => {
                filterList.push(item.value)
              })
            }
            return filterList
          },
        fixFilterVal(){
            if(sessionStorage.getItem("locationNo")&&sessionStorage.getItem("locationNo")!='undefined'){
                this.nowLocationId = sessionStorage.getItem("locationNo")
            }
            let r = []
            if(this.nowLocationId == 100000||this.nowLocationId == ''){
                if(Number(this.newActiveId) == 0){
                    
                }else{
                    r.push({
                    attributeId:1,
                    attributeValueList: this.active.length == 0? [...new Set(["100001"].concat(this.filterArea(this.newActiveId)))]:[...new Set(this.active)]
                    })
                }
            }else{
                r.push({
                attributeId:1,
                attributeValueList: this.active.length == 0? [...new Set(["100001"].concat(this.filterArea(this.nowLocationId)))] : [...new Set(this.active)]
                })
            }
            return r
        },
        //省份单选
        getTab(provinceValue,provinceData,data){
            // this.callInterface = true
            this.remove();
            this.keepChildOpen = true
            this.provinceInfo = provinceData
            this.newActiveId = provinceValue
            this.activeId = provinceValue;
            this.currentPage = 1;
            this.cityList = [];
            this.cityList.push('unlimit');
            this.active = []
            if(provinceData){
                if(this.provinceNo && provinceData && provinceValue ==this.provinceNo){
                    this.areaList.area.forEach(element => {
                        if(element.value == this.provinceNo){
                            this.getCityList(element);
                        }
                    });
                }else if(this.provinceNo == null && !provinceValue){
                    this.getCityList({
                        children: [],
                        label: '全部',
                        value: null,
                        id: null,
                        parentNo: null
                    });
                }else{
                    this.getCityList(provinceData);
                };
            }
            if(this.callInterface){
                this.provinceNo = provinceValue;
                this.callInterface = false;
            }
            this.getList();
        },
         //获取搜索条件
        getArea(val){
            getAreaList(4).then(res=>{
                if(res.data.code==1000){
                    this.newAreaList = res.data.data.area
                    this.areaList = res.data.data
                    this.attributionId = [];
                    this.policySearchParams= [];
                    for(var i=0;i<this.areaList.selection.length;i++){
                        var a ={//归口添加全部
                            name: "全部",
                            classSetNumber: this.areaList.selection[i].categoryName,
                            id: this.areaList.selection[i].categoryName,
                        };
                        this.attributionId.push(a.classSetNumber);
                        this.areaList.selection[i].options.unshift(a);
                    };
                    let arr = []
                    if(val!='undefined'){
                        arr = val.split(',')
                        this.generateAttributeList[0].attributeValueList = [arr[1]]
                    }
                    this.areaList.selection.splice(1, 3)
                    this.getList();
                }
            })
        },
        //分类数据
        getAttribution(item){
            this.putUnder = item.id
            this.getList();
        },
         //默认排序
        defaultSort(data){
            if(this.newsId.indexOf(data)==-1){
                this.newsId=[];
                this.newsId.push(data);
                this.isNewest = false;
                this.isHotSpot = false;
            }else{
                if(this.newsId.length>1){
                    this.newsId.splice(this.newsId.indexOf(data),1);
                }
            }
            this.getList();

        },
         //最新排序
        newSort(data){
            if(this.newsId.indexOf(data)==-1){
                this.newsId=[];
                this.newsId.push(data);
                this.isNewest = !this.isNewest;
                this.isHotSpot=false;
            }else{
                if(this.newsId.length>1){
                    this.newsId.splice(this.newsId.indexOf(data),1);
                }
            }
            this.getList();

        },
        //热度排序
        hotSort(data){
            if(this.newsId.indexOf(data)==-1){
                this.newsId=[];
                this.newsId.push(data);
                this.isNewest =false;
                this.isHotSpot = !this.isHotSpot;
            }else{
                if(this.newsId.length>1){
                    this.newsId.splice(this.newsId.indexOf(data),1);
                }
            }
            this.getList();
        },
        //标题排序
        titleSort(data){
            if(this.titleId.indexOf(data)==-1){
                this.titleId.push(data);
                this.isTitle =true;
            }else{
                if(this.titleId.length>1){
                    this.titleId.splice(this.titleId.indexOf(data),1);
                    this.isTitle = false;
                }
            }
            this.getList();
        },
        //内容排序
        contentSort(data){
            if(this.titleId.indexOf(data)==-1){
                this.titleId.push(data);
                this.isContent =true;
            }else{
                if(this.titleId.length>1){
                    this.titleId.splice(this.titleId.indexOf(data),1);
                    this.isContent =false;
                }
            }
            this.getList();
        },
        getCityList(list){
            let unlimited = {
                label: '全部',
                parentNo: list.value,
                value: 'unlimit'
            }
            if(list.children.length>0 && list.children[0].value !== 'unlimit'){//当前定位地区不在后台设置地区时 添加市级全部选项 3-30
                list.children.unshift(unlimited);
            }
            this.citysList = list;
            this.listLength = list.children.length;
        },
        remove(){
            this.listLength=0;
            if(this.cityList.length > 0){
                this.listLength =1;
            }
        },
    },
    mounted(){
        if(this.$store.state.searchTxt){
            this.content = this.$store.state.searchTxt;
        };
        setInterval(()=>{
            if(this.activeIndex < this.scrollList.length-1){
                this.activeIndex +=1;
            }else{
                this.activeIndex = 0;
            }
        },2000);
        this.getArea(sessionStorage.getItem('locationNo'));
        this.getHotWords();
    },
    computed:{
        top(){
            return -this.activeIndex*56+'px';
        },
        transition(){
            return this.activeIndex == 0 ? 'none' : 'top 0.5s';
        },
        searchTxt(){
            return this.$store.state.searchTxt;
        },
        location(){
            return  this.$store.state.Set_LocationNo;
        },
    },
    watch:{
        'searchForm.content'(val){
            if(val==''){
                this.$router.push({
                    query: {
                        search: ''
                    }
                });
                this.searchId ='';
                this.show = true;
                this.getList();
            }
        },
        searchTxt(val){
            this.getList();
        },
        location(val){
            this.listLength=0;
            this.getArea(val);
            this.getList();
        }
    }
}
</script>

<style lang="stylus" scoped>
.zixun {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    display:none;
    z-index:999;
}
.row:hover{
    border: 2px solid #FF782E !important;
}


.frame{
    width:100%;
    margin:0 auto;
    font-size:14px;
    background:#EFF2F3;
    font-family: Microsoft YaHei UI;
    .backgroundImg{
        height:440px;
    }
    .search-box{
        width:1200px;
        height:160px;
        background:#FFF;
        box-shadow: 0px 0px 20px rgba(52, 76, 125, 0.16);
        border-radius:6px;
        margin:0 auto;
        margin-bottom:20px;
        .roll_box{
            width:1083px;
            height:56px;
            margin:0 auto;
            border-bottom:1px solid #CECECE;
            overflow:hidden;
            .scroll-content{
                width:1083px;
                padding-left:0;
                color:#A8A8A8;
                position:relative;
                transition: top 0.5s;
                list-style-type:none;
            }
            li{
                text-align:center;
                line-height:56px;
                display:grid;
                grid-template-columns:33% 33% 33%;
                grid-column-gap: 10px;
                .txt-content{
                    overflow: hidden;
                    white-space:nowrap; 
                    text-overflow:ellipsis;
                }
            }
        }
        .search_frame{
            width:931px;
            margin:0 auto;
            margin-top:30px;
            padding:0 25px;
            padding-top:30px;
            display:flex;
            .project_search{
                width:158px;
                height:40px;
                border-radius:25px;
                border: 1px solid #36A6FE;
                background:#36A6FE;
                line-height:40px;
                text-align:center;
                color:#FFF;
                font-size:16px;
                margin-left:-158px;
                 padding-top: 2px;
                cursor:pointer;
                display: flex;
                cursor: pointer;
                justify-content: center;
            }
            .project_search img{
               width: 36px;
               height: 36px;
            }
            .search_input{
                width:100%;
                height:40px;
                border-radius:25px;
                border:1px solid #36A6FE;
                outline:one;
                padding-left:15px;
                padding-right:158px;
                font-size:14px;
                overflow: hidden;
                white-space:nowrap; 
                text-overflow:ellipsis;
            }
            input:focus{
                outline:0;
                padding-left:15px;
            }
        }
        .hot_project{
            display:flex;
            width: 900px;
            padding:0 12px;
            margin:18px auto;
            color:#666666
            .btn{
                 border: 1px solid #36A6FE;
                border-radius: 40px;
                font-size: 12px;
                height: 20px;
                padding: 15px 10px;
                text-align: center;
                line-height: 1px;
                margin-left: 10px;
                color: #36A6FE;
                cursor: pointer;
            }
            .btn:hover{
                color:#36A6FE;
            }
            .searchStyle{
                background:#36A6FE;
                color:#FFF;
            }
            .searchStyle:hover{
                color: #FFF;
            }
        }
    }
    .address{
        width:1200px;
        margin:0 auto;
        margin-bottom:14px;
        background:#FFF;
        .attribution{
            padding:0;
            // border-bottom:1px solid #D6D6D6;
        }
        .attribution li{
            list-style:none;
            cursor pointer;
        }
        .only-show-city{
            min-height:50px;
            line-height:40px;
            display:flex;
            flex-flow:row wrap;
            border-bottom:1px solid #D6D6D6;
            .area{
                color:#333333;
                font-size:14px;
                font-weight:bold;
                width:150px;
                padding-right: 10px;
                text-align: right;
                border-right:1px solid #EEE;
            }
            .city-name{
                width: 1050px;
                display: flex;
                flex-flow:row wrap;
            }
            .city-name p{
                color:#656565;
                margin:0 15px;
                cursor:pointer;
            }
        }
        .hei {
            height: 50px !important;
            line-height: 50px !important;
        }
        .centralized{
            display:flex;
            flex-flow:row wrap;
            border-bottom:1px solid #D6D6D6;
            .name{
                color:#333333;
                font-size:14px;
                font-weight:bold;
                width:150px;
                padding-right: 10px;
                text-align: right;
                border-right:1px solid #EEE;
            }
            .classification{
                display:flex;
                // margin-left:20px;
                .btn{
                    color:#656565;
                    cursor:pointer;
                }
                .btn span{
                    padding:5px 15px;
                }
                .btn:hover{
                    color:#36A6FE;
                }
            }
        }
        li:hover{
            color:#36A6FE;
        }
        .city-box{
            width:1051px;
            min-height:100px;
            margin-top:-12px;
            margin-left:149px;
            padding-top: 12px;
            border-left:1px solid #eee;
            background: #F2F2F2
            .city-list{
                float:left;
                margin:10px 10px;
            }
            .city-list{
                cursor:pointer;
            }
            .city-list span{
                padding:6px 12px;
                font-size:14px;
                color:#656565;
                background:#fff;
                border: 1px solid #E9E9E9;
                border-radius: 4px;
            }
        }
        .has-province{
            margin-top: -51px !important;
            background:#FFF;
        }
        .provinces{
            line-height:50px;
            display:flex; 
            .areaname{
                color:#333333;
                font-size:14px;
                font-weight:bold;
                width:150px;
                padding-right:10px;
                text-align: right;
                margin-right:15px;
                border-right:1px solid #eee;
            }
            .list{
                max-width:1042px;
                margin-left: -25px;
                display:flex;
                flex-flow:row wrap;
                .activeTab{
                    background: #F2F2F2
                }               
            }
            .list div:first-child span{
                background: none
            }
            .areaListSty{
                font-size:14px;
                padding:5px 15px;
                width:100px;
                height:28px;
                color:#656565;
                cursor:pointer;
            }
            .areaListSty:hover{
                color:#36A6FE !important;
            }
        }
        .provinces li{
            list-style:none;
            display:inline-block;
            margin-left:30px;
            font-size:14px;
            color:#656565;
            cursor:pointer;
        }
        
        .city{
            background:#F5F8FA;
            cursor:pointer;
            font-size:14px;
            padding:0 8px;
            line-height:30px;
        }
        .activeStyle{
            color:#FFF !important;
            background:#36A6FE !important;
        }
        .activeSty{
            color:#36A6FE !important;
        }
        .activeTab{
            color:#36A6FE !important;
        }
    }
    .project_list{
        width:1200px;
        background:#FFF;
        min-height:300px !important
        margin:0 auto;
        .sorting{
            padding-top:20px;
            margin-left:14px;
            width:1200px;
            display:flex;
            .new-hot{
                width:200px;
            }
            .defaultSort{
                color:#8A8A8A;
                cursor:pointer;
            }
            .newestSort{
                margin-left: 15px;
                color:#8A8A8A;
                cursor:pointer;
            }
            .hotestSort{
                color:#8A8A8A;
                cursor:pointer;
            }
            .activeSort{
                color:#36A6FE !important;
            }
            .inactiveSort{
                color:none !important;
            }
        }
        .grid_list{
            margin: 20px 0;
            padding-bottom:30px;
            // display:grid;
            // margin-left:14px;
            // grid-template-columns: 218px 218px 218px 218px 218px;
            // grid-column-gap: 20px;
            // grid-row-gap:32px;
            display: flex;
            flex-wrap: wrap;
            .row{
                position: relative;
                width:240px;
                height:260px;
                border: 1.5px solid #f0eff385;
                cursor:pointer;
                .project_img{
                    width: 187px;
                    height: 134px;
                    margin: 12px 22px 0px 22px;
                }
                .consult{
                    width:100%;
                    font-size:12px;
                }
                .consult .first:nth-child(1){
                    padding:4px 15px;
                    border-radius: 2px;
                    background: #FD4A1C;
                    color: #FFFFFF;
                    position: absolute;
                    top: 20px;
                    left: 30px;
                }
                

                .consult .first:nth-child(2){
                    padding:4px 15px;
                    margin-right:10px;
                    margin-top:-4px;
                    float:right;
                    // background:rgba(253, 101, 28, 0.08)
                    // color:#FD651C;
                    border-radius: 2px;
                    background: #36A6FE;
                    color: #FFFFFF;
                }
                .consult_title{
                    font-size:14px;
                    margin-top: 7px;
                    color: #333333;
                    font-weight: 700;
                    clamp-2(100%)

                    }
                .project_title{
                    margin:12px 12px 4px 12px;
                    color:#474747;
                    text-overflow:ellipsis;
                    overflow:hidden;
                    display:-webkit-box;
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:2;
                }
                .project_introdution{
                    margin:4px 22px 8px;
                    // margin: 5px 12px;
                    color:#999999;
                    font-size:12px;
                    cursor pointer
                    clamp-1(80%)
                }
                .specialdescription{
                    -webkit-line-clamp:1;
                } 
                // .description{
                //         width 206p
                //     }
                .deposit{
                    font-size: 18px;
                    font-family: Source Han Sans CN, Source Han Sans CN-Regular;
                    font-weight: 400;
                    color:#FD4A1C;
                    position: absolute;
                    left: 22px;
                    bottom:8px;
                }
                // .deposit span{
                //     font-size:20px;
                //     color:#FD4A1C;
                //     margin: 0px 0px 3px 0px;
                //     font-weight: 700;
                //     font-family: Microsoft YaHei, Microsoft YaHei-Bold;
                // }
            }
            .row .first{
                    display: none;
                      }
            .row:hover .first{
                display: block;
            }
            // .row:nth-last-child(1){
            //     border-bottom:none;
            // }
        //    .row:nth-last-child(2){
        //         border-bottom:none;
        //     }
        //     .row:nth-last-child(3){
        //         border-bottom:none;
        //     }
            // .row:nth-last-child(4){
            //     border-bottom:none;
            // }
        }
    }
.STY {
    background-image: url('~assets/images/industry/gouxuan_icon@2x.png') !important;
    background-size: 16px 16px !important;
    border:none !important;
  }

  .noSty {
    background: #ffffff !important;
    border: 1px solid #707070 !important;
    border-radius: 2px !important;
  }

  .titleSearch {
    width: 16px;
    height: 16px;
    background-image: url('~assets/images/industry/gouxuan_icon@2x.png');
    background-size: 16px 16px;
    cursor: pointer;
  }

  .contentSearch {
    width: 16px;
    height: 16px;
    background: #ffffff;
    cursor: pointer;
    margin-left:25px;
    border: 1px solid #707070;
    border-radius: 2px;
  }
}
.protit{
    overflow: hidden; 
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.huaxian{
    font-size: 12px;
    text-decoration:  line-through;
    text-align: left;
    color: #c5c5c5;
    }
.earn{
    font-size: 12px;
    color:#FD4A1C;
    }
.pricesize{
    font-size 18px
}
.pricemark{
    font-size 12px
}
   
</style>