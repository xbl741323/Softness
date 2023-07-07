<template>
    <div class="banner" @mouseenter="clearSwipper()" @mouseleave="runInv()">
        <div class="item" v-if="dataList.length>0">
            <img :src="cdnPath+dataList[currentIndex].photoUrl" :style="{height:height+'px'}" class="bannerimg" @click="jump(dataList[currentIndex].linkUrl)">
        </div>
         <!-- 小圆点 -->
        <div class="page" v-if="this.dataList.length > 1">
            <ul>
                <li v-for="(item,index) in dataList" :key="index" @click="gotoPage(index)" :class="{'current':currentIndex == index}"><i class="iconfont" >&#xe625;</i></li>
            </ul>
        </div>
        <!-- 推荐 -->
        <div  v-if="showRecomend==true &&NineImage &&NineImage.length>0 " class="woshiya" :class="{'newwoshiya':this.dataList.length > 1?true:false}">
             <div class="homerec" v-for="(t,index) in NineImage.slice(0,5)" :key="index*9" @click="goProject(t.number)">
                    <template v-if="t.coverUrls && t.coverUrls.length>0">
                         <div v-for="(newItem,index) in t.coverUrls" :key="index*6">
                            <template v-if="newItem.isCover == 1">
                                    <img class="showImg" :src='cdnPath+newItem.url' v-if="newItem.url && (newItem.url.split('.')[1]=='jpeg' || newItem.url.split('.')[1]=='png' ||newItem.url.split('.')[1]=='jpg' ||newItem.url.split('.')[1]=='gif')" />                    
                                    <video 
                                    class="showImg"
                                    v-else-if="newItem.spUrl&&(newItem.spUrl!==''&&newItem.spUrl!==null)" 
                                    :poster="cdnPath+newItem.spUrl"
                                    :src="cdnPath + newItem.url"></video>
                                    <video v-else :src="cdnPath + newItem.url"  class="showImg"></video>
                            </template>
                        </div>
                   </template>
                    <template v-else>
                        <img class="showImg" :src='cdnPath+newItem.coverUrl' v-if="newItem.coverUrl&&(newItem.coverUrl.split('.')[1]=='jpeg' || newItem.coverUrl.split('.')[1]=='png' ||newItem.coverUrl.split('.')[1]=='jpg' ||newItem.coverUrl.split('.')[1]=='gif')" />
                        <video class="showImg" :src='cdnPath+newItem.coverUrl' v-if="newItem.coverUrl &&(newItem.coverUrl.split('.')[1]=='mp4' || newItem.coverUrl.split('.')[1]=='avi' ||newItem.coverUrl.split('.')[1]=='mov')" />
                   </template>
             </div>
        </div>
    </div>
</template>

<script>
import { banner } from '@/api/home'
export default {
    props:['typeId','height','showRecomend','NineImage'],
    data(){
        return{
			cdnPath:process.env.CDN_BASE_URL,
            dataList:[],
            currentIndex: 0,   
            timer: null 
        }
    },
    methods: {
        //图片链接跳转
        jump(data){
            if(data){
                window.open(data);
            }
        },
        //清除定时器
        clearSwipper(){
            window.clearInterval(this.timer);
        },
        getBanner(){
            // 0-通知公告，1-政策汇编，2-卧涛问答，3.项目申报，4-首页，5-关于卧涛
			banner(this.typeId).then(res=>{
                this.dataList = res.data.data
			});
        },
        gotoPage(index) {
            this.currentIndex = index;
        },
        //定时器
        runInv(){
            this.timer = setInterval(() => {
                this.gotoPage(this.nextIndex);
            }, 3000);
        },
        goProject(num){
           window.open('/project/'+num+2);
        },
    },
    computed: {
        //上一张
        prevIndex() {
            if(this.currentIndex == 0 &&this.dataList) {
                return this.dataList.length - 1;
            }else{
                return this.currentIndex - 1;
            }
        },
        //下一张
        nextIndex() {
            if(this.dataList){
                if(this.currentIndex == this.dataList.length - 1) {
                    return 0;
                }else {
                    return this.currentIndex + 1;
                }
            }
        },
    },
    mounted(){
        this.getBanner();
        this.runInv();
    }
}
</script>

<style lang="stylus" scoped>
.showImg{
    width: 140px;
    height: 100px;
}
.bannerimg{
    width:100%;
    height:440px;
}
    ul li {
        list-style: none;
        float: left;
        height: 48px;
        line-height: 48px;
        text-align: center;
        cursor: pointer;
        color: rgba(255,255,255,.8);
        /* font-size: 14px; */
    }
    .banner {
        width:100%;
        min-width:1200px;
        height:440px;
        margin: 0 auto;
        cursor:pointer;
        .woshiya{
            margin-top 7.5px
            display:flex;
        }
        .newwoshiya{
            margin-top:40.5px;
        }
    }
    .banner img {
        width: 100%;
        display: block;
    }
    .banner .page {
        height:48px;
        margin-top:-80px;
        position: relative;
        width: 100%;
    }
    .banner .page ul {
        position: absolute;
        left:46%;
        transform: translateX(-50%);
    }
    .current {
        color: #000;
    }
.homerec{
    float: left;
    margin-right: 10px;
    cursor: pointer;
    width: 142px;
    height: 100px;
    border-radius: 5px;
}
.homerec:hover{
    .showImg{
          border: 2px solid #F6AF1E;
    }
}
.homerec:nth-child(5){
     margin-right: 0;
}
</style>