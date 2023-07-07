<template>
    <div class="process">
        <p class="title">服务流程</p>
        <div class="imgsty">
            <img :src="processImg" />
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            processImg:'/img/project/img_liucheng_details@2x.png'
        }
    }
}
</script>

<style scoped>
.process{
    margin-top:20px;
}
    .title{
        margin-left:50px;
        margin-bottom:23px;
        font-size:20px;
        font-weight:bold;
        color:#373D40;
    }
    .imgsty{
        width:849px;
        height:252px;
        margin:0 auto;
    }
    .imgsty img{
        width:100%;
        height:100%;
    }

</style>