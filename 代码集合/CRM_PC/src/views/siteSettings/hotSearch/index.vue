<template>
    <div class="frame">
        <div class="tab">
            <p @click="change(1)" :class="{activeSty:activeId == 1}">关键词设置</p>
            <p @click="change(2)" :class="{activeSty:activeId == 2}">关键词统计</p>
            <p @click="change(3)" :class="{activeSty:activeId == 3}">同义词设置</p>
        </div>
        <set-keyword v-if="this.activeId == 1"></set-keyword>
        <keyword-statistics v-if="this.activeId == 2"></keyword-statistics>
        <synonyms v-if="this.activeId == 3" />
    </div>
</template>

<script>
import SetKeyword from './compontents/setKeyword'
import KeywordStatistics from './compontents/keywordStatistics'
import Synonyms from './compontents/synonyms'
export default {
    components:{
        SetKeyword,
        KeywordStatistics,
        Synonyms
    },
    data(){
        return{
            activeId:1,
        }
    },
    created(){
        if(sessionStorage.getItem('activeId')){
            this.activeId = sessionStorage.getItem('activeId');
        }
    },
    methods:{
        change(data){
            sessionStorage.setItem('activeId',data);
            this.activeId = data;
        }
    }
}
</script>

<style scoped>
.frame{
    padding:10px;
    font-size:14px;
    background:#FFF;
}
.tab{
    display:flex;
    cursor: pointer;
    width:300px;
}
.tab p:nth-child(1){
    padding:8px 15px;
}
.tab p:nth-child(2){
    padding:8px 15px;
}
.tab p:nth-child(3){
    padding:8px 15px;
}
.activeSty{
    color:#FFF;
    padding:8px 15px;
    background:#36A6FE;
}
</style>