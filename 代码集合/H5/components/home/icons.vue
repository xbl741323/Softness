<template>
  <div class="icons">
    <div :class="['icon',index==3 || index==7?'':'mr']" v-for="(item, index) in iconList" :key="index" @click="toUrl(item,index)">
        <div class='icon-img'>
            <img class="icon-img-content" :src='item.imgUrl' />
        </div>
        <p class="icon-desc">{{item.desc}}</p>
    </div>
  </div>
</template>
<script>
import datas from '@/assets/js/static-data'
export default {
  data(){
    return {
      iconList: datas.datalist.homeIcons
    };
  },
  methods:{  
      toUrl(item,index){
          if(item.id==99){
            this.$router.push({
               path: item.path,
               query:{
                  tabindex: 0,
                  id: 1,
               }
            })
          }else{
            this.$router.push({
               path: item.path,
               query:{
                  tabindex: index,
                  id: Number(item.id),
               }
            })
          }

      }
  }
}
</script>
<style  scoped>
.icons{
    width :100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: #fff;
    padding: 0 0.7466666666666667rem 1.4rem 0.7466666666666667rem;
    border-radius: 40px 40px 0px 0px;
    margin-top: 170px;
    z-index: 2;
}
.icon{
    margin-top :0.6666666666666666rem;
    text-align: center;
}
     
.icon-img{
    width: 1.06666667rem;
    height: 1.06666667rem;
    margin: auto;
}     
.icon-img-content{
    width :100%;
    height: 100%;
}
.icon-desc{
    color :#333;
    /* font-weight: 550; */
    font-family: Source Han Sans CN, Source Han Sans CN-Bold;
    font-size :var(--size-14);  
    margin-top: .21rem;
}
/* .mr{ */
   /* margin-right: 0.8266666666666667rem; */
/* } */
</style>
