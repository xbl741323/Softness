<template>
    <div class="head">
        <div class="box-bg">
            <img v-if="type==1" :src="require('@/assets/images/'+policyBg)" alt="">
            <img v-if="type==2" :src="require('@/assets/images/'+questionBg)" alt="">
        </div>
        <div class="title-box" @click="toMore">
            <h3 v-if="type==1">{{$t('message.policyEdit')}}</h3>
            <h3 v-if="type==2">{{$t('message.questionAnswer')}}</h3>
            <p :class="[{'question-color': type==2}]">{{$t('message.more')}}></p>
        </div>
    </div>
</template>

<script>
export default {
    props: ["type"],
    data(){
        return {
            policyBg: 'home/img01_home@3x.png',
            questionBg: 'home/img02_home@3x.png',        
        };  
    },
    methods:{   
        toMore(){
            if(this.type==1){
                this.$router.push('/policy/assembly')
            }else{
                this.$router.push('/policy/troubleList')
            }
        }
    },
    mounted(){
    },
}
</script>

<style scoped>
.head{
    width: 100%;
    height: 1.76rem;
    position: relative;
    margin-top: .533333333333rem
}
.box-bg{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
}
.box-bg img{
    width: 100%;
}
.title-box{
    margin: 0 .426666666rem;
    display: flex;
    align-items: center;
    height: 1.76rem;
    line-height: 1.76rem;
}
.title-box h3{
    flex: 1;
    margin: .32rem 0;
    font-size: .48rem;
    color: #333;
    font-weight: 600;
    z-index: 3;
}
.title-box p{
    font-size: .32rem;
    color: #36A6FE;
}
.question-color{
    color: #FD651C !important;
}
</style>
