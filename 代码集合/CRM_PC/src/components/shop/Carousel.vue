<template>
    <div class="banner">
        <div class="item" v-if="list && list.length>0">
            <img src="../../assets/images/shop/left_arrow@2x.png" class="pre" @click="pre" />
            <img src="../../assets/images/shop/right_arrow@2x.png" class="next" @click="next" />
            <img  v-if="list[currentIndex].picture.match(/images/)" :src="yagu+list[currentIndex].picture" :style="{width:width+'px',height:height+'px'}" class="bannerimg" @click="jump(list[currentIndex].linkUrl)">
            <img v-else :src="cdnPath+list[currentIndex].picture" :style="{width:width+'px',height:height+'px'}" class="bannerimg" @click="jump(list[currentIndex].linkUrl)">
        </div>
        <div class="page" v-if="list && list.length > 1">
            <div style="display:flex;align-items: center;margin-left: 5px;" :class="{another:isTop==1}">
                <div v-for="(item,index) in list" :key="index" @mouseover="gotoPage(index)" :class="{'current':currentIndex == index}" style="width:95px;height:60px;margin-right:10px">
                    <img  v-if="item.type == 1" :src="yaguPath+item.picture" style="width:100%;height:100%" />
                    <img  v-else-if="item.picture.match(/icon/)" :src="cdnPath+item.picture" style="width:100%;height:100%" />
                    <img  v-else :src="yagu+item.picture" style="width:100%;height:100%" />
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
			cdnPath: process.env.VUE_APP_IMAGE_BASEURL,
            yaguPath:"//static-tst.wotao.com/",
            yagu:process.env.VUE_APP_YAGU_IMAGE_BASEURL,
            currentIndex: 0
        }
    },
    methods: {
        pre(){
            if(this.currentIndex == 0 &&this.list) {   
                this.currentIndex =  this.list.length - 1; 
            }else{
              this.currentIndex = this.currentIndex - 1;
            }
        },
        next(){
            if(this.list){
                if(this.currentIndex == this.list.length - 1) {
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
        // getBanner(){
        //     // 0-通知公告，1-政策汇编，2-疑难解答，3.项目申报，4-首页，5-关于卧涛
		// 	banner(this.typeId).then(res=>{
        //         this.list = res.data.data
		// 	});
        // },
    },
}
</script>

<style lang="scss" scoped>
    .banner {
        width:620px;
        height:360px;
        cursor:pointer;
    }
    .item:hover{
        .pre{
          display: inline-block;
        }
        .next{
          display: inline-block;
        }
    }
    .item{
        position: relative;
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
</style>