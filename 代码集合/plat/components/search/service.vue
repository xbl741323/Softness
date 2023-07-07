<template>
    <div class="child-content">
        <div class="filter-line">
            <div class="filter-label">地区</div>
            <city @areaChange="childArea" />
        </div>
        <div class="filter-line">
            <div class="filter-label">级别</div>
            <div class="filter-value">
                <p v-for="(item, index) in level" :key="index" :class="[rank==item.value ? 'active':'']" @click="chooseItem(item,'level')">{{item.label}}</p> 
            </div>
        </div>
        <div class="filter-line">
            <div class="filter-label">企业服务</div>    
            <product :list="products" @typeChange="childType" />        
        </div>
        <div class="filter-line" v-if="type==2">
            <div class="filter-label">类型</div>    
            <div class="filter-value">
                <p v-for="(item, index) in cate" :key="index" :class="[cateId==item.value ? 'active':'']" @click="chooseItem(item,'cate')">{{item.label}}</p> 
            </div>        
        </div>
        <div class="filter-line" v-if="type==1">
            <div class="filter-label">归口</div>   
            <div class="filter-value">
                <p v-for="(item, index) in putUnder" :key="index" :class="[putunder==item.id ? 'active':'']" @click="chooseItem(item,'putunder')">{{item.name}}</p> 
            </div>
        </div>
        <div class="search-res">共找到<span style=" color:red">{{count|filterCount}}</span>条结果</div>
        <div class="pro-list" v-if="count>0" v-loading="loading">
            <div class="list-content" v-for="(item,index) in services" :key="index" @click="toDetail(item)">
                <div class="item-img">
                <img :src='imgPath+item.imageUrl' v-if="!fileType(item.imageUrl)" />
                <img :src='imgPath+item.mediaUrl' v-if="fileType(item.imageUrl)" />
                    <!-- <img :src="imgPath+item.imageUrl" alt=""> -->
                </div>
                <h3 class="product-title pro-title" v-html="item.spuTitle"></h3>
                <p class="product-slogan"  v-html="item.spuSlogan"></p>
                <p v-if="item.spuMinAmount" class="item-price bright-fee">
                    <span>￥</span>
                    <span class="big-price">{{item.spuMinAmount}}</span>
                    <span class="min-price">/起</span>
                </p>
                <p v-else class="item-price bright-fee">面议</p>
            </div>
        </div>
        <div v-else class="err-tips">
            <p v-if="count===0">暂无匹配数据，请换个搜索条件试试吧</p>
            <p v-if="count==='nodata'">暂无数据，请稍后重试</p>
        </div>   
        <div class="page-style" v-if="count>10">
            <el-pagination                     
                :page-size="10"
                版权ckground
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
import * as CodeMsg from "@/api/CodeChange"
import { universalSearch } from "@/api/find";
import city from './city.vue'
import product from './product.vue'
import searchs from './filter'
export default {
    props:{
        choose:{
            type: String,
            default: null,
            required: true
        }
    },
    components:{
        city,
        product
    },
    filters:{
        filterCount(val){
            return val == 'nodata' ? 0 : val > 9999 ? '9999+' : val
        }
    },
    data(){
        return{
            imgPath:process.env.CDN_BASE_URL,            
            loading: true,
            type: 0,//类型
            sort: 'latest',//排序
            addr: '',//地区
            putunder: null,//归口
            rank: null,//级别
            cateId: null,//类型
            nodata:3,
            count:null, 
            currentPage: 1,            
            contentList:[],
            products: searchs.products,
            cate: searchs.cate,
            services:[],
            generateAttributeList: [
                {
                    attributeId: 1,
                }
            ],
            level: searchs.level,
            putUnder: searchs.putUnder,
            most: searchs.most,
            address: []
        }
    },
    methods:{
        fileType(el){
            let suffix = el.substring(el.lastIndexOf("."),el.length).toLowerCase();
            if('mov,m4v,mp4,avi,dat,mkv,flv,vob,wmv,asf,asx,rm,rmvb'.match(suffix)){
                return true;
            }else{
                return false
            }
        },
        changeAddress(value) {
            //地址选择
            // console.log(value,'地址选择');
        },
        // 排序筛选
        childSort(data){
            this.sort = data;
            this.getData()
        },
        // 筛选类型
        childType(data){
            this.type = data;
            if(this.type == 1){
                this.cateId = null
            }
            if(this.type == 2){
                this.putunder = null
            }
            this.currentPage = 1
            this.getData()
        },
         // 排序
        chooseItem(item, type){
            switch (type) {
                case 'level': // 级别
                    this.rank = item.value
                    break;
                case 'cate': // 类别
                    this.cateId = item.value
                    break;
                case 'putunder': // 归口
                    this.putunder = item.id
                    break;
                case 'sort': // 排序
                    this.sort = item.type
                    break;
            }
            this.currentPage = 1
            this.getData()
        },
        // 筛选地区
        childArea(data){
            this.addr = data
            this.currentPage = 1
            this.getData()
        },
        //点击跳转产品详情
        toDetail(item){
            const path = this.$router.resolve({
                path:'/productdetails/details',
                query:{
                    spuId: item.id
                }
            })
            window.open(path.href)
        },
        // 获取搜索数据
        getData(){
            let category = []
            let cate = []
            if(this.type == 2){
                cate = this.cateId == null ? [3,4,5,6] : [this.cateId]
                this.rank = null
            }else if(this.type == 0){
                category = []
            }else{
                category.push(this.type)
            }
            let params = {
                keyword: this.searchTxt,// 关键字
                categoryIdList: category.concat(cate),//产品分类ID
                spuArea: this.addr,//地区
                spuLevel: this.rank!=null?this.rank:'全部',//级别
                spuKinds: this.type == 2 ? '': this.putunder,//归口
                pageNo: this.currentPage,
                pageSize: 10,
            };
            universalSearch(params).then(res=>{
                this.loading = false
                if(res.data.code == CodeMsg.CODE_0) {
                    let list = res.data.data.records
                    this.count = res.data.data.total
                    if(this.count == 0){
                      this.services = list
                      return false
                    }
                    this.turnPrice(res.data.data.records)
                } else {
                    return this.count = 'nodata'
                }
            });
            // this.$parent.getList();
        },
        //转化价格显示
        turnPrice(data){
            data.forEach(item => {
                if(item.spuMinAmount>=100000){
                    item.spuMinAmount = parseInt(item.spuMinAmount/10000)+'万'
                };
                if(item.spuMaxAmount>=100000){
                    item.spuMaxAmount = parseInt(item.spuMaxAmount/10000)+'万'
                }
                // item.imageUrl = ''
                // if(item.imagesList.length>0){
                //     item.imageUrl = item.imagesList.find(i=>i.imageUrl!='').imageUrl
                // }else{
                //     item.imageUrl = ''
                // }
            });
            this.services = data;
        },
        // 翻页查询
        handleCurrentChange(val){
            this.currentPage = val;
            this.getData()
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
    watch:{
        searchTxt(val){
            this.currentPage = 1
            this.getData();
        },  
        location(val) {
            this.addr = val.split(',')[1]
            this.currentPage = 1
            this.getData();
        }
	} ,
    mounted(){
        if(sessionStorage.getItem("locationNo")!='undefined'){
            let areaNo = sessionStorage.getItem("locationNo")
            this.addr = areaNo.split(',')[1]
        }
        if(this.choose == 1) return this.getData();              
    },   
}
</script>
<style lang="stylus" scoped>
    @import './search-child'
</style>
<style scoped>
  .change-city >>> .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .change-city >>> .el-icon-arrow-down {
    font-size: 12px;
  }
  .change-city >>> .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .search-res {
    font-size: 14px;
    border-bottom: 2px solid #eee;
    padding: 25px 10px 10px 10px;
  }
</style>