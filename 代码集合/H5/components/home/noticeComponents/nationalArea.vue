<template>
    <div class="national">
        <div class="national-box" @click="toMore">
            <img :src="require('@/assets/images/'+generalImg)" alt="">
            <div class="title">
                <h3>{{$t('home.hotNotice')}}</h3>
                <p>{{$t('home.hoteDesc')}}</p>
            </div>
        </div>            
    </div>    
</template>

<script>
export default {
    data(){
        return {      
            generalImg: 'home/img_tongyong_home@3x.png'  
        };  
    },
    methods:{   
        toMore(){
            this.$router.push('/policy/announcement')
        }
    },
    mounted(){
    },
}
</script>

<style scoped>
.national{
    width: 100%;
    position: relative;
}
.national-box{
    width: 100%;
    margin: .32rem 0;
    height: 1.76rem;
    position: relative;
    display: block;
}
.national-box img{
    width: 100%;
}
.title{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    text-align: center;
    transform:translate(-50%,-50%);
}
.title h3{
    font-size: .426666667rem;
    font-weight: 600;
    color: #fff;
}
.title p{
    font-size: .32rem;
    color: #EFE9FF;
    margin-top: .02rem
}
</style>
