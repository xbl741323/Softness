<template>
    <div class="head">
        <h3 v-if="type==0">{{$t('message.announcements')}}</h3>
        <h3 v-if="type==1">{{$t('message.policyEdit')}}</h3>
        <h3 v-if="type==4">{{$t('message.projectApply')}}</h3>
        <h3 v-if="type==5">{{$t('message.policySquare')}}</h3>
        <!-- <p @click="toMore">{{$t('message.more')}}></p> -->
    </div>
</template>

<script>
export default {
    props: ["type"],
    data(){
        return {
        
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
  .head{
    width: 100%;
    display: flex;
    align-items: center;
    padding-top: .32rem
  }
  .project .head{
      padding-top: 0;
  }
  .head h3{
      flex: 1;
      margin: .32rem 0;
      font-size: .48rem;
      color: #233558;
      font-weight: 600;
  }
  .head p{
      font-size: .32rem;
      color: #999;
  }
</style>
