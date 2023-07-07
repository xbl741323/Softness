<template>
    <div class="child-content">   
        <div class="filter-line">
            <div class="filter-label">类型</div>    
            <product :list="products" :active="type" @typeChange="childType" />        
        </div>
        <div class="filter-line" >
            <div class="sort-content">
                 <span  v-for="(item,index) in sortlist" :key="index" :class="[sort==item.type ? 'active-sty text-sty':'text-sty']" @click="chooseItem(item,'sort')">{{item.title}}</span>
            </div>
        </div>    
        <div class="search-box" v-loading="loading"> 
            <div class="search-right">
                <div class="search-right-header">共找到<span style=" color:red">{{count|filterCount}}</span>条结果</div>
                <div v-if="count>0" class="tab-content">                    
                    <div v-for="(item,index) in contentList" :key="index" class="content" :class="{'top':(index+1)%12==1&&index!=0}">                        
                        <div @click="goDetail(item.id,type)"  class="tab-items">
                            <span class="bluecircle"></span>
                            <span>【{{type | tech}}】</span>
                            <span class="tab-title" v-html="item.title"></span>                            
                        </div>
                    </div>
                </div>  
                <div v-else class="err-tips">
                        <p v-if="nodata==2">暂无匹配数据，请换个搜索条件试试吧</p>
                        <p v-if="nodata==1">暂无数据，请稍后重试</p>
                </div>             
            </div>
        </div>
        <div class="page-style">
            <el-pagination  v-show="this.count>50"                     
                :page-size="50"
                background
                :pager-count="11"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                layout="prev, pager, next"
                :total="count">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {esYgAchievement, esYgRequirement} from "@/api/announcement";
import transfers from './filter'
import product from './product'
export default {
    props:{
        choose:{
            type: String,
            default: null,
            required: true
        }
    },
    components:{
        product
    },
    filters:{
        filterCount(val){
            return val > 9999 ? '9999+' : val
        }
    },
    data(){
        return{
            products:[{
                title: '技术成果',
                type: 99
            },{
                title: '技术需求',
                type: 100
            }],
            loading: true,
            nodata:3,
            count:0, 
            currentPage: 1,            
            contentList:[],
            type: 99,
            shopUrl:process.env.SHOP_URL,     
            keywords:'',
            sortlist: transfers.most,
            sort: 'hottest',//排序
        }
    },
    methods:{
        chooseItem(item, type){
            if(type == 'sort'){
               this.sort = item.type
            }
            this.currentPage = 1
            this.getList()
        },
        // 筛选条件查询
        childType(data){
            this.type = data;
            this.getList()
        },
        // 查询结果
        getList(){    
            let params = {
                keywords: this.searchTxt,
                sort: this.sort,
                pageNo: this.currentPage,
                pageSize: 50
            }
            let num1 = 0
            let num2 = 0
            if(this.type == 99)  {
                esYgAchievement(params).then(res=>{
                    this.loading = false;
                    if(res.data.code == 0){                               
                        this.count = res.data.data.data.total
                        num1 = res.data.data.data.total
                        this.contentList = res.data.data.data.records 
                        if(this.count==0){
                            this.nodata=2
                        }                
                    }else{
                        this.nodata = 1
                    }                             
                })          
            } else{
                esYgRequirement(params).then(res=>{
                    this.loading = false;
                    if(res.data.code == 0){ 
                        this.count = res.data.data.data.total
                        num2 = res.data.data.data.total
                        this.contentList = res.data.data.data.records    
                        if(this.count==0){
                            this.nodata=2
                        }
                    }else{
                        this.nodata = 1
                    }                               
                })       
            }                    
        },
       //查看文章详情
        goDetail(num, type){ 
            if(type == 99){
                window.open(this.shopUrl+"/result/detail?id=" + num);
            } else {
                window.open(this.shopUrl+"/need/detail?id=" + num);
            } 
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.getList()
        },
    },    
    filters:{
        policyType(val){
            return transfers.searchType(val)
        },
        tech(val){
            return transfers.tech(val)
        },
    },
    mounted(){
        if(this.choose == 2) return this.getList();                  
    }, 
    computed:{
        searchTxt(){
            if(this.$store.state.searchTxt) return this.$store.state.searchTxt;           
            if(this.$route.query.keywords) return this.$route.query.keywords
        },
    },
    watch:{
        currentPage(val){
            this.currentPage =val;
            this.getList();
        },
        searchTxt(val){
            this.currentPage = 1;
            this.getList();
        },  
	}  
}
</script>
<style lang="stylus" scoped>
    @import './search-child'
</style>