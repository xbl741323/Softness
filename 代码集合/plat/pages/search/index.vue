<template>
    <div class="search-container">
        <client-only>
        <div class="tab-box">
            <div v-for="(item,index) in tabs" :key="index" :class="['tab-item',tabIndex==index ? 'tab-choosed' : '']">
                <div @click="clickTab(index)">&nbsp;{{item.title}}</div>
            </div>
        </div>
        <div class="result">搜索结果：{{searchTxt}}</div> 
        <div class="filter-box">
            <policys v-if="tabIndex==0" ref="policy" :choose="tabIndex" />
            <service v-if="tabIndex==1" ref="service" :choose="tabIndex" />
            <tech v-if="tabIndex==2" ref="tech" :choose="tabIndex" />
        </div>       
       </client-only>
        
    </div>
</template>

<script>
import policys from '@/components/search/policy'
import service from '@/components/search/service'
import tech from '@/components/search/tech'
export default {
    components:{
        policys,
        service,
        tech
    },
    head () {
        return {
        title:'全国科技项目申报通知文件快速查询-卧涛网',
            meta: [
                { name: 'keywords', content:'项目申报通知、项目政策公告'},
                { hid: 'description', name: 'description', content:'卧涛网平台汇集全国各地市科技项目申报通知、项目政策公告，及时更新，快速查询。落地企业项目申报最后一公里。' }
            ]
        }
    },
    data(){
        return{
            tabs:[{
                title: '资讯广场',
                count: 0,
                type: 0,
            },{
                title: '服务产品',
                count: 0,
                type: 1,
            },{
                title: '技术转移',
                count: 0,
                type: 2,
            }],
            tabIndex: null,
            currentPage:1,
            contentList:[],
            keywords:'', 
        }
    },
    computed:{
        // 获取关键字
        searchTxt(){
            if(this.$store.state.searchTxt) return this.$store.state.searchTxt;           
            if(this.$route.query.keywords) return this.$route.query.keywords
        },
    },
    methods:{
        // 切换顶部tab
        clickTab(index){
            this.tabIndex = index;
            this.$store.commit('sType',index);
            this.$router.push({
                path: "/search",
                query:{
                    keywords: this.searchTxt,
                    type: index
                }
            })  
        }
    },
    created() {
        this.tabIndex = this.$route.query.type ? this.$route.query.type : 0
    },
    watch:{
        searchTxt(val){
            let type = this.$route.query.type;
            if(type == 0) return this.$refs.policy.getList()
            if(type == 1) return this.$refs.service.getData()
            if(type == 2) return this.$refs.tech.getList()

        }
    }
}
</script>

<style lang="stylus" scoped>
@import './search'
</style>