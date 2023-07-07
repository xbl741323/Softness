<template>
    <div>
        <div class="element" v-for="(ele,index) in list" :key="index" @click="godetail(ele)">
            <div class="img-box">
                <template v-if="ele.coverUrls && ele.coverUrls.length>0">
                    <div v-for="(newItem,index) in ele.coverUrls" :key="index*6">
                        <template v-if="newItem.isCover == 1">
                                <img class="productImg" :src='imgPath+newItem.url' v-if="newItem.url && (newItem.url.split('.')[1]=='jpeg' || newItem.url.split('.')[1]=='png' ||newItem.url.split('.')[1]=='jpg' ||newItem.url.split('.')[1]=='gif')" />                    
                                <video 
                                    class="productImg"
                                    v-else-if="newItem.spUrl&&(newItem.spUrl!==''&&newItem.spUrl!==null)" 
                                    :poster="imgPath+newItem.spUrl"
                                    :src="imgPath + newItem.url"></video>
                                <video v-else :src="imgPath + newItem.url"  class="productImg"></video>
                        </template>
                    </div>
                </template>
                <template v-else>
                        <img class="productImg" :src='imgPath+ele.coverUrl' v-if="ele.coverUrl&&(ele.coverUrl.split('.')[1]=='jpeg' || ele.coverUrl.split('.')[1]=='png' ||ele.coverUrl.split('.')[1]=='jpg' ||ele.coverUrl.split('.')[1]=='gif')" />
                        <video class="productImg" :src='imgPath+ele.coverUrl' v-if="ele.coverUrl &&(ele.coverUrl.split('.')[1]=='mp4' || ele.coverUrl.split('.')[1]=='avi' ||ele.coverUrl.split('.')[1]=='mov')" />
                </template>
            </div>
            <div class="des">
                <div class="producttitle">{{ele.title}}</div>
                <div class="productinfo">{{ele.slogan}}</div>
                <div class="price">
                    <template v-if="ele.earnestMoney">
                        <span class="maxproject">￥{{ele.earnestMoney | filterPrice}}</span>  
                    </template> 
                    <template v-else-if="ele.nowFee && ele.previousFee">
                        <span class="maxproject">￥{{ele.nowFee | filterPrice}}<i class="huaxian">{{ele.previousFee | filterPrice}}</i></span>  
                    </template> 
                    <template v-else-if="ele.nowFee || ele.previousFee">
                        <span class="maxproject">￥{{ (ele.nowFee || ele.previousFee) | filterPrice}}</span>
                    </template>
                    <template v-else>
                        <span class="maxproject">面议</span>  
                    </template>
                    </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:["list","type","activeIndex"],
    data(){
        return{
            imgPath: process.env.CDN_BASE_URL,
        }
    },
    methods:{
        godetail(ele){
            const newPath = this.$router.resolve({
                path: "/project/" + ele.number + 2,
                query: {
                    sort: 2
                }
            })
            window.open(newPath.href, "_self")
        },
    }
}
</script>
<style scoped lang="stylus">
    @import '~assets/css/home/product'
</style>