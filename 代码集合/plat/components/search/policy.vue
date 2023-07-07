<template>
    <div class="child-content">
        <div class="filter-line">
            <div class="filter-label">地区</div>
            <city @areaChange="childArea" />
        </div>
        <div class="filter-line" >
            <div class="sort-content">
                 <span  v-for="(item,index) in sortlist" :key="index" :class="[sort==item.type ? 'active-sty text-sty':'text-sty']" @click="chooseItem(item,'sort')">{{item.title}}</span>
            </div>
        </div>
        <div class="search-box" v-loading="loading"> 
            <!-- 右侧面板区域 -->
            <div class="search-right">
                <!-- 面板头部 -->
                <div class="search-right-header">共找到<span style=" color:red">{{count|filterCount}}</span>条结果</div>
                <!-- 面板列表内容 -->
                <div v-if="count>0" class="tab-content">                    
                    <div  v-for="(item,index) in contentList" :key="index" class="content" :class="{'top':(index+1)%12==1&&index!=0}">                        
                        <div @click="goDetail(item)"  class="tab-items">
                            <span>【{{item.classification | policyType}}】</span>
                            <span class="tab-title" v-html="item.title"></span>                            
                            <span v-if="item.createTime"  class="time">{{item.createTime}}</span>
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
import areas from './area'
import city from './city.vue'
import transfers from './filter'
import { downloadFile,pagePolicyGlobal} from '@/api/announcement'
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
        areas,
        product,
        city
    },
    filters:{
        policyType(val){
            return val == 1 ? '通知公告': val == 2 ? '行业资讯' : val == 3 ? '卧涛问答' : '卧涛文档'
        },
        filterCount(val){
            return val > 9999 ? '9999+' : val
        }
    },
    data(){
        return{
            loading: true,
            nodata:3,
            count:0, 
            currentPage: 1,            
            contentList:[],
            isZC: process.env.PROPERTY_URL,
            shopUrl:process.env.SHOP_URL,     
            filePathUrl:process.env.baseUrl,
            sortlist: transfers.most,
            sort: 'hottest',//排序
            addr: ''
        }
    },
    methods:{
         // 筛选地区
        childArea(data){
            this.addr = data
            this.currentPage = 1
            this.getList();
        },
        chooseItem(item, type){
            if(type == 'sort'){
               this.sort = item.type
            }
            this.currentPage = 1
            this.getList();
        },
        // 获取搜索数据
        getList(){
            let params={
                areaNo: this.addr,//地区编号
                keywords: this.searchTxt,//关键字
                sort: this.sort,//排序
                level: '全部',
                pageNo: this.currentPage,
                pageSize: 50
            };               
            pagePolicyGlobal(params).then(res=>{
                this.loading = false;
                if(res.data.code == 0){                               
                    this.count = res.data.data.data.total;
                    this.contentList = res.data.data.data.data;
                    if(this.count == 0){
                        this.nodata = 2
                    }                   
                }else{
                    this.nodata = 1
                }                              
          })                                 
        },
        //查看文章详情
        goDetail(item){ 
            if(item.classification==1){
                window.open('/policy/' + item.number + '01?id=' + item.id, '_self')
            }else if(item.classification==2){
                window.open('/policy/' + item.industryNo + '101?id=' + item.id, '_self')
            }else if(item.classification==3){
                window.open('/policy/questionDetail?id='+ item.id, '_self')
            }else if(item.classification==4){
                window.open("/policy/files/"+item.id, '_self')
            }else{
                console.log('路由未名');
            }
        },
        // 翻页查询
        handleCurrentChange(val){
            this.currentPage = val;
            this.getList()
        },
        //文章下载
        download(item){
            downloadFile(0).then(res=>{
                if(res.data.code != 10002){
                    let a = document.createElement("a");
                    a.href = this.filePathUrl+'/file/download?id='+item.search_id+'&name='+item.title;
                    a.click();
                }
            })
        },
    },    
    computed:{
        searchTxt(){
            if(this.$store.state.searchTxt) return this.$store.state.searchTxt;           
            if(this.$route.query.keywords) return this.$route.query.keywords
        },
        location() {
            return this.$store.state.Set_LocationNo
        }
    },
    mounted(){
        if(sessionStorage.getItem('locationNo')){
            let data = sessionStorage.getItem('locationNo')
            this.addr = data.split(',')[1]
            this.getList()
        }
        if(this.choose == 0) return this.getList();                  
    },      
    watch:{
        // 监听翻页
        currentPage(val){
            this.currentPage =val;
            this.getList();
        },
        searchTxt(val){
            this.getList();
        },  
        location(val) {
            this.addr = val.split(',')[1]
            this.currentPage = 1
            this.getList();
        }
	}  
}
</script>
<style lang="stylus" scoped>
    @import './search-child'
</style>