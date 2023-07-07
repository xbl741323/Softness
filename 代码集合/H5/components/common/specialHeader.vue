<template>
    <div :class="[shadow ? 'shadow': '',gray ? 'gray-bg': '','head-box']">
     <mt-button @click="goBack" icon="back"></mt-button>
     <span class="navtitle" v-if="title.indexOf('(待认证)')>-1">{{title.substring(0,title.indexOf('(待认证)'))}}<span class="col">(待认证)</span></span> 
     <span class="navtitle" v-else>{{title}}</span>
    </div>
</template>

<script>
export default {
    props: ['title','shadow','gray'],
    data(){
        return{
        }
    },
    methods:{
        goBack(){
            this.$router.back(-1)
        }
    }
}
</script>

<style scoped>
.head-box{
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 999;
    background: #f4f4f4;
    text-align: center;
}
.mint-button--normal{
    background-color: #f4f4f4;
    box-shadow: none;
    float: left;
}
.mint-button::after{
   background-color: #fff;
}
.navtitle{
    position: relative;
    top: 0.24rem;
    left: -0.24rem;
}
.col{
    color: #ff6d27;
    font-size: 0.32rem;
    margin-left: 0.08rem;
}
</style>