<template>
    <div class="child-cont">
        <ul class="full-width to-top">
            <li v-for="(item,index) in list" :key="index" @click="toDetail(item,index)">
                <div class="list-item">
                    <div class="item-img">
                        <img :src="filePathUrl+item.imageUrl" alt="">
                    </div>
                    <div class="item-right">
                        <h3 class="product-title" v-html="item.spuTitle"></h3>
                        <span class="product-span" v-html="item.spuSlogan"></span>
                        <p v-if="item.spuMinAmount" class="item-price bright-fee">
                            <span>￥</span>
                            <span class="big-price">{{item.spuMinAmount}}</span>
                            <span class="min-price">/起</span>
                        </p>
                        <p v-else class="item-price bright-fee">面议</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props:["list"],
    data() {
        return {
            filePathUrl:process.env.CDN_BASE_URL,
            isZC: process.env.PROPERTY_URL,
        };
    },
    filters:{
    },
    methods: {
        toDetail(item,index){
            this.$router.push({
                path: "/productdetails/details",
                query: {spuId:item.id}
            })
        }
    },
};
</script>

<style lang="stylus" scoped>
@import './search-child'
</style>