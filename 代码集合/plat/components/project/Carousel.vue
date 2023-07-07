<template>
    <div class="banner">
        <div class="item" v-if="dataList && dataList.length>0">
            <img src="~/assets/images/shop/left_arrow@2x.png" class="pre" @click.stop="pre" />
            <img src="~/assets/images/shop/right_arrow@2x.png" class="next" @click.stop="next" />
            <img 
                v-if="dataList[currentIndex].url.split('.')[dataList[currentIndex].url.split('.').length-1]=='jpeg'||
                dataList[currentIndex].url.split('.')[dataList[currentIndex].url.split('.').length-1]=='png'||
                dataList[currentIndex].url.split('.')[dataList[currentIndex].url.split('.').length-1]=='jpg'||
                dataList[currentIndex].url.split('.')[dataList[currentIndex].url.split('.').length-1]=='gif'"
            :src="cdnPath+dataList[currentIndex].url" :style="{width:width+'px',height:height+'px'}" class="bannerimg">
            <video 
                v-else-if="dataList[currentIndex].spUrl&&(dataList[currentIndex].spUrl!==''&&dataList[currentIndex].spUrl!==null)"
                :poster="cdnPath + dataList[currentIndex].spUrl"
                :src="cdnPath+dataList[currentIndex].url" :style="{width:width+'px',height:height+'px'}" class="bannerimg"  controls="controls"/>
            <video  v-else :src="cdnPath+dataList[currentIndex].url" :style="{width:width+'px',height:height+'px'}" class="bannerimg" controls="controls"/>
        </div>
        <!-- 缩略图 -->
        <div class="page" v-if="this.dataList && this.dataList.length >=1">
          <div class="flexcenter" :class="{another:isTop==1}">
                <div v-for="(item,index) in dataList.slice(0,5)" :key="index" @mouseover="gotoPage(index)" :class="{'current':currentIndex == index}" class="coverimg">
                    <img 
                       v-if="item.url.split('.')[item.url.split('.').length-1]=='jpeg'||
                        item.url.split('.')[item.url.split('.').length-1]=='png'||
                        item.url.split('.')[item.url.split('.').length-1]=='jpg'||
                        item.url.split('.')[item.url.split('.').length-1]=='gif'"
                    :src="cdnPath+item.url" style="width:100%;height:100%" />
                    <video 
                        v-else-if="item.spUrl&&(item.spUrl!==''&&item.spUrl!==null)"
                        :poster="cdnPath+item.spUrl"
                        :src="cdnPath+item.url" style="width:100%;height:100%"/>
                    <video v-else :src="cdnPath+item.url" style="width:100%;height:100%"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>


export default {
    props:['list','width','height',"isTop"],
    data(){
        return{
            cdnPath:process.env.CDN_BASE_URL,
            dataList:[],
            currentIndex: 0,
        }
    },
    methods: {
        pre(){
            if(this.currentIndex == 0 &&this.dataList) {   
                this.currentIndex =  this.dataList.length - 1; 
            }else{
              this.currentIndex = this.currentIndex - 1;
            }
        },
        next(){
            if(this.dataList){
                if(this.currentIndex == this.dataList.length - 1) {
                    this.currentIndex =0
                }else {
                    this.currentIndex = this.currentIndex + 1;
                }
            }
        },
        gotoPage(index) {
            this.currentIndex = index;
        },
        //链接跳转
        jump(linkUrl){
            // if(linkUrl){
            //     window.open(linkUrl);
            // }else{
            //     return false;
            // }
        },
    },
    mounted(){
        this.dataList = this.list;
    }
}
</script>

<style lang="stylus" scoped>
    .banner {
        cursor:pointer;
    }
    .item:hover{
        .pre{
          display: inline-block;
          z-index:999;
        }
        .next{
          display: inline-block;
          z-index:999;
        }
    }
    .item{
        position: relative;
        width 100%
        height 100%
    }
    .pre{
       width: 50px;
       height: 50px;
       position: absolute;
       top: 40%;
       left: 20px;
       display: none;
    }
    .next{
       width: 50px;
       height: 50px;
       position: absolute;
       top: 40%;
       right: 20px;
       display: none;
    }
    .page {
       margin-top: 8px;
    }
    .current {
        border: 3px solid #36A6FE;
    }
    .another{
      position: relative;
      top: -75px;
    }
    .coverimg{
        width:70px;
        height:49px;
        margin-right:10px
    }
    .flexcenter{
        display: flex;
        align-items: center;
    }
    
</style>