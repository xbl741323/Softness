<template>
  <div class="notice">
      <div class="notice-cont">
          <headers :type="0" />
          <national-area v-if="areaNos==100000" />
          <area-slider v-else />
          <notice-list :type="0" :list="list" />
      </div>
  </div>
</template>
<script>
import Headers from './noticeComponents/head'
import areaSlider from './noticeComponents/areaSlider'
import nationalArea from './noticeComponents/nationalArea'
import noticeList from './noticeComponents/noticeList'
import {getPolicyList} from '~/api/home'
export default {
    components: {
        Headers,
        areaSlider,
        noticeList,
        nationalArea
    },
    data(){
        return {
            areaNo:null,
            list:[],
            param:{},
        };
    },
    computed:{
            areaNos(){
                return this.$store.state.areaNo;
            }
    },
    methods:{  
        getList(){
            if(this.areaNos==100000){
                this.param ={
                    size:4,
                    areaNo: 100001
                }
            } else {
                this.param ={
                    size:4,
                    areaNo: this.areaNos
                }
            }            
            getPolicyList(this.param).then(res=>{
                this.list = res.data.TZList;
            }).catch(err=>{
                console.log(err)
            }); 
        }
    },
    mounted(){
        this.getList()
    },
}
</script>
<style scoped>
    .notice{
        width: 100%;
        background: #fff;
    }
    .notice-cont{        
        margin: 0 .426666666rem
    }
</style>
