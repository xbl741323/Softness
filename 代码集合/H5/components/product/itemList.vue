<template>
    <div class="item-wrap">
        <div class="element" v-for="(ele,index) in list" :key="index" @click="godetail(ele)">                
            <template>
                    <img class="productImg" :src='imgPath+ele.imageUrl' v-if="ele.imageUrl&&(ele.imageUrl.split('.')[1]=='jpeg' || ele.imageUrl.split('.')[1]=='png' ||ele.imageUrl.split('.')[1]=='jpg' ||ele.imageUrl.split('.')[1]=='gif')" />
                    <video class="productImg" :src='imgPath+ele.imageUrl' v-if="ele.imageUrl &&(ele.imageUrl.split('.')[1]=='mp4' || ele.imageUrl.split('.')[1]=='avi' ||ele.imageUrl.split('.')[1]=='mov')" />
            </template>
            <div class="des">
                <div class="producttitle">{{ele.spuTitle}}</div>
                <div class="productinfo">{{ele.spuSlogan}}</div>
                <div class="price" v-if="categoryId!=1 && hot|| !hot">
                    <template v-if="ele.isOnline">
                        <div v-if="ele.spuMinAmount==ele.spuMaxAmount"><span class="maxproject">￥{{ele.spuMinAmount | filterPrice}}</span></div>
                        <div v-if="ele.spuMinAmount!=ele.spuMaxAmount">
                            <span class="maxproject" v-if="ele.spuMinAmount/1!=0">￥{{ele.spuMinAmount | filterPrice}}</span>
                            <span class="maxproject" v-else>￥{{ele.spuMaxAmount | filterPrice}}</span>
                            <span class="since-txt" v-if="ele.spuMinAmount/1!=0">起</span>
                        </div>
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
    props:{
        list:{
            type: Array,
            default: []
        },
        categoryId:{
            type: Number,
            default: null
        },
        hot:{
            type: Boolean,
            default:false
        }
    },
    data(){
        return {
            imgPath: process.env.CDN_BASE_URL,
        }
    },
    filters:{
        filterPrice(val){
            if((val/1).toString().length<=5){
                return (val/1)
            }else{
                return (((val/1)/10000)+'万')
            }
        }
    },
    methods:{
        godetail(item) {
            this.$router.push({
                path: "/productdetails/details",
                query: {spuId:item.id}
            })
        },
    },
    mounted(){
        setTimeout(()=>{
            console.log(this.list);
        },500)
    }
}
</script>
<style lang="stylus" scoped>
    @import './product.styl'
</style>