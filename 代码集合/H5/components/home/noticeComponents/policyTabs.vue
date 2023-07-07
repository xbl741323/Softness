<template>
    <div :class="[{'question-color': type==2},sum==0?'wt-tab2-box':'wt-tab3-box','wt-tab-box']">
        <el-tabs v-model="activePolicy" @tab-click="handleClick">
            <el-tab-pane v-for="(item) in tabList" :key="item.type" :label="item.optionsName" :name="item.optionsName">
                <notice-list @getPolicyList="getPolicyList" :type="item.type" ref="child" />
            </el-tab-pane>
        </el-tabs>        
    </div>
</template>

<script>
import noticeList from './noticeList'
import industry from './areaSlider'
import {getPolicyClassList,getTroubleClassList} from '~/api/home'
export default {
    components:{
        noticeList,
        industry
    },
    props: ["type"],
    data(){
        return {
            activeTrouble:'',
            policyList: [],
            troubleList: [],
            localAreaNo:null,
            sum:null,
            tabList:[
                {          // 通知公告
                    optionsName: this.$t('message.announcements'),
                    type: 0,
                },{ 
                           // 政策汇编
                    optionsName: this.$t('message.policyEdit'),
                    type: 1,
                },{
                           // 卧涛问答
                    optionsName: this.$t('message.questionAnswer'),
                    type: 2,
                },{
                    optionsName: '行业资讯',
                    type: 10,
                }
            ],        
            activePolicy:this.$t('message.announcements'),
        }
    },
    methods:{
        // 控制子组件的显隐
        handleClick(val) {
            console.log(val.index,"输出选择的类型");
            this.$refs.child[val.index].changeValue(val.index)
        },  
        //政策汇编子组件获取列表数据
        getPolicyList(value) { 
            let sum = 0;
            value.forEach((item) => {
                sum += item.polices.length;
            });
            //判断政策汇编有没有数据
            if(sum==0){
                this.sum=sum;
                this.tabList.splice(1,1);
            } else {
            }
        },
    },
    //获取地区编号
    computed: {
        getLocationState() {
            return this.$store.state.areaNo;
        },
    },
    watch: {
    },
    mounted(){   
        console.log("输出获取的城市Tabs",this.getLocationState)
        console.log(sessionStorage.getItem("localAreaNo"),'本地localstorage')
        this.localAreaNo = sessionStorage.getItem("localAreaNo");
    },
}
</script>

<style>
.wt-tab-box{
    width: 100%;
    position: relative;
}
.wt-tab-box .el-tabs__nav{
    width: 100%;
}
.wt-tab-box .el-tabs__item{
    font-size:.42rem !important;
    padding: 0 16px !important;
    text-align: center;
    height: 1.12rem;
    line-height: 1.12rem;
}
.wt-tab3-box .el-tabs__item{
    width: 25% !important;
    /* flex: 1; */
}
.wt-tab2-box .el-tabs__item{
    width: 33.33333333% !important;
    /* flex: 1; */
}
.wt-tab-box .el-tabs__header{
    margin: 0 !important;
}
.wt-tab-box .el-tabs__item.is-active{
    font-weight: 600;
}
.noshow{
    display: none !important;
}
.question-color .el-tabs__active-bar{
    background-color: #FD651C !important;
}
.question-color .el-tabs__item.is-active{
    color: #FD651C !important;
}
</style>