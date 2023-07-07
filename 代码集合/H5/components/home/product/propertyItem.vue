<template>
    <div>
        <div class="element" v-for="(ele,index) in list" :key="index" @click="godetail(ele,type)">
            <div v-if="type==1" class="img-box">
                <img class="productImg" v-if="ele.type==1" :src="require('@/assets/images/wotao/zhuanli@2x.png')" alt />
                <img class="productImg" v-if="ele.type==2" :src="require('@/assets/images/wotao/shangbiao@2x.png')" alt />
                <img class="productImg" v-if="ele.type==3" :src="require('@/assets/images/wotao/banquan@2x.png')" alt />
                <img class="productImg" v-if="ele.type==4" :src="require('@/assets/images/wotao/qita@2x.png')" alt />
            </div>
            <div v-if="type==2" class="img-box">
                <img class="productImg" v-if="!ele.spUrl" :src="imgPath+ele.url" alt />
                <img class="productImg" v-else :src="imgPath+ele.spUrl" alt />
            </div>
            <div class="des">
                <div class="producttitle">{{ele.name}}</div>
                <div class="productinfo">{{ele.slogan}}</div>
                <div class="price">
                    <span v-if="ele.nowFee">￥{{ele.nowFee/100}}<span class="small">/起</span></span>
                    <span v-else>面议</span>
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
        godetail(ele,flag){
         if(flag==1){
           window.open("/zhichan/" + ele.id + ele.type, "_self");
         }else if(flag==2){
             let whichType
             if(this.activeIndex==2){
                whichType = 1
             }else if(this.activeIndex==3){
                 whichType = 4
             }else if(this.activeIndex==4){
                  whichType = 2
             }else if(this.activeIndex==5){
                  whichType = 3
             }else if(this.activeIndex==6){
                 whichType = 6
             }
           const newPath = this.$router.resolve({
                path:'/common-service/detail',
                query:{
                    type:String(whichType)+ele.id
                }
            })
            window.open(newPath.href, "_self")
         }else{
            const newPath = this.$router.resolve({
                path: "/project/" + ele.number + 2,
                query: {
                    sort: 2
                }
            })
            window.open(newPath.href, "_self")
         }
    },
    }
}
</script>
<style scoped lang="stylus">
    @import '~assets/css/home/product'
</style>