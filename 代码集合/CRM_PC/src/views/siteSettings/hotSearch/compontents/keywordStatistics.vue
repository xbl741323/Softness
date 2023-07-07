<template>
    <div class="frame">
        <div style="border-bottom:1px solid #36A6FE"></div>
        <div class="formBox">
            <el-form :model="statisticsForm" :inline='true' @submit.native.prevent> 
                <el-form-item :label="this.$t('label.keywords')">
                    <el-input v-model.trim="statisticsForm.keyword" :placeholder="this.$t('input.vocabularyKeywords')"  @keyup.enter.native="getStatistics()"></el-input>
                </el-form-item>
                <el-form-item :label="this.$t('label.location')+'：'">
                    <el-select v-model="statisticsForm.type" @keyup.enter.native="getStatistics()">
                        <el-option 
                        v-for="item in selectList" 
                        :key="item.label"
                        :value="item.label"
                        :label='item.value'
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="getStatistics()">{{this.$t('button.search')}}</el-button>
                <el-button @click="reset()">重置</el-button>
            </el-form>
            <p>说明:本表格用于统计用户搜索行为（含移动端），每个位置下取搜索次数前20的有效词汇（有效词汇：汉字字数在2-12位之间）。</p>
        </div>
        <avue-crud
            ref="crud"
            :data="list"
            :option="tableOption"
            @on-load="getStatistics"
        ></avue-crud>
    </div>
</template>

<script>
import { tableOption} from "@/const/crud/siteSettings/keywordStatistics";
import { getStatisticsList } from '@/api/siteSettings/hotSearch'
export default {
    data(){
        return{
            tableOption:tableOption,
            list:[],
            statisticsForm:{
                keyword: '',
                type: null
            },
            selectList:[
                {
                    label:0,
                    value:'通知公告'
                },
                {
                    label:1,
                    value:'政策汇编'
                },
                {
                    label:2,
                    value:'疑难解答'
                },
                {
                    label:3,
                    value:'文件下载'
                },
                {
                    label:4,
                    value:'项目申报'
                },
                {
                    label:5,
                    value:'全站搜索'
                },
                {
                    label: 8,
                    value: '技术成果'
                },
                {
                    label: 7,
                    value: '技术需求'
                },
                {
                    label: 6,
                    value: '知识产权'
                },
            ]
        }
    },
    created(){
        if(sessionStorage.getItem(`${this.$route.path}`)){
            this.statisticsForm = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
        }
    },
    methods:{
        reset(){
            this.statisticsForm = {
                keyword: '',
                type: null
            }
            this.getStatistics();
        },
        getStatistics(){
            let param ={
                type: this.statisticsForm.type,
                keyword: this.statisticsForm.keyword
            }
            sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(param));
            getStatisticsList(param).then(res=>{
                this.list = res.data.data;
            })
        }
    }
}
</script>

<style scoped>
.frame{
    background:#FFF;
    font-size:14px;
}
.formBox{
    margin-top:10px;
}
</style>