<template>
    <div :class="[{'question-color': type==2},'el-tab-box']">
        <el-tabs v-if="type==1" v-model="activePolicy" @tab-click="handleClick">
            <el-tab-pane v-for="(item,index) in policyList" :key="index" :label="item.optionsName" :name="item.optionsName">
                <notice-list :type="type" :list="item.policyVOS" />
            </el-tab-pane>
        </el-tabs>
        <el-tabs v-if="type==2" v-model="activeTrouble" @tab-click="handleClick">
            <el-tab-pane v-for="(item,index) in troubleList" :key="index" :label="item.optionsName" :name="item.optionsName">
                <notice-list :type="type" :list="item.policyVOS" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import noticeList from './noticeList'
import industry from './areaSlider'
import {getPolicyClassList,getTroubleClassList} from '~/api/home'
export default {
  props: ["type"],
  data(){
    return {
        activePolicy: '',
        activeTrouble:'',
        policyList: [],
        troubleList: [],
    }
  },
  methods:{
    handleClick(tab, event) {
        // console.log(tab, event);
    },
    getList(){
        getPolicyClassList(4).then(res=>{
            this.policyList =  res.data;
            this.activePolicy = this.policyList[0].optionsName
        }).catch(err=>{
            console.log(err)
        });   
        getTroubleClassList(4).then(res=>{      
            this.troubleList =  res.data;
            this.activeTrouble = this.troubleList[0].optionsName
        }).catch(err=>{
            console.log(err)
        })   
    }
  },
  components:{
    noticeList,
    industry
  },
  mounted(){
      this.getList()
  },
}
</script>

<style>
.el-tab-box{
    width: 100%;
    position: relative;
}
.el-tab-box .el-tabs__nav{
    width: 100%;
}
.el-tab-box .el-tabs__item{
    width: 50%;
    padding: 0 !important;
    text-align: center;
    height: 1.44rem;
    line-height: 1.44rem;
}
.el-tab-box .el-tabs__header{
    margin: 0 !important;
}
.el-tab-box .el-tabs__item.is-active{
    font-weight: 600;
}
.question-color .el-tabs__active-bar{
    background-color: #FD651C !important;
}
.question-color .el-tabs__item.is-active{
    color: #FD651C !important;
}
</style>