<template>
    <div>
        <search-head  @getList="getList" :tabName="2"></search-head>
        <avue-crud ref="crud"
            :data="tableData"   
            v-loading="showLoading"
            :option="contractsOption"
            :page.sync="page"      
            @sort-change="changeSort"
            @size-change="sizeChange" 
            @current-change="currentChange"
        >
            <template slot="number" slot-scope="scope">
                <span @click="showDetail(scope.row)"  class="cell-blue" >{{ scope.row.number}} </span>
            </template>
            <template slot="userName" slot-scope="scope">
                <span @click="showDetail(scope.row)"  class="cell-blue">{{ scope.row.userName}} </span>
                <!-- <img  class="disable_img_sty" :src="baseUrl + 'img/disable.png'" > -->
            </template>        
            <template slot="menu" slot-scope="scope">
                <el-button type="text" @click="showDetail(scope.row)">查看</el-button>               
            </template>
        </avue-crud> 
    </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange"
import { pageContractStatistics } from "@/api/staff/achievement";
import { contractsOption } from "@/const/crud/staff/contract";
import searchHead from "@/components/staff/achievement/search-head";


export default {   
    components:{
        searchHead,
    },
    data(){
        return{
            page: {         
                currentPage: 1,
                total:0,
                layout: "total, sizes, prev, pager, next, jumper", 
                background: true ,
                pageSizes: [ 5, 8, 10, 20, 30, 40, 50, 100 ],//选择每页显示条数
                pageSize:20,
            },    
            showLoading:false,
            baseUrl: process.env.BASE_URL,
            tableData:[], 
            contractsOption:contractsOption,  
            paramsForm:{
                keyWord:"",
                deptId:"",
                timeType:3,
                startTime:"",
                endTime:"",
            },                     
            sortType:'DESC',
        }        
    },
    methods:{    
        changeSort(e){
            console.log(e);
            this.sortType = e.order == 'ascending'?'ASC':'DESC'
            this.getList(this.paramsForm)
        },            
        getList(searchForm){   
            // this.showLoading=true;
            if (searchForm.timeType == null || searchForm.timeType == "") {
                searchForm.timeType = 4;
            }      
            this.paramsForm=Object.assign({},searchForm)                          
            this.paramsForm.pageNo=this.page.currentPage;
            this.paramsForm.pageSize=this.page.pageSize;
            this.paramsForm.sortType = this.sortType;
            pageContractStatistics(this.paramsForm).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                // this.showLoading=false;      
                    this.tableData=res.data.data.records;
                    this.page.total=res.data.data.total;
                    if(this.tableData.length == 0 && this.page.currentPage > 1){
                        this.page.currentPage = 1;
                        this.getList(this.paramsForm);
                    };
                    let obj=JSON.parse(sessionStorage.getItem(`staff-achievements`));               
                    obj["formDatas2"]=this.paramsForm
                    sessionStorage.setItem(`staff-achievements`, JSON.stringify(obj));     
                } else if (res.data.code == CodeMsg.CODE_2011){
                    this.$message({
                        type:"warning",
                        message: '数据权限受限,无法查看！',
                        offset:300
                    })
                    this.showLoading = false;
                    this.tableData = []
                    this.page.total = 0
                }
            })
        },
        showDetail(row){
            this.$router.push({
                path: "/personal-new-contracts",
                query:{
                    staffInfo: JSON.stringify(row),
                    searchForm:JSON.stringify(this.paramsForm) ,
                    source: 1//需要做缓存
                }
            }) 
        },
        sizeChange(val){
            this.page.currentPage = 1
            this.page.pageSize = val
            this.getList(this.paramsForm)
        },
        currentChange(val){
            this.page.currentPage = val
            this.getList(this.paramsForm)
        },        
    },
    created(){
        if(sessionStorage.getItem(`personal-new-contracts`) && !this.$route.query.myhome){
            let obj=JSON.parse(sessionStorage.getItem(`personal-new-contracts`));            
            this.$router.push({
                path: "/personal-new-contracts",
                query:{
                    staffInfo: JSON.stringify(JSON.parse(obj.staffInfo)),
                    searchForm:JSON.stringify(JSON.parse(obj.searchForm)) ,
                    source:1//需要做缓存
                }
            }) 
        }
            
    },
}
</script>

<style scoped>
.cell-blue{
    color: #36A6FE;
    cursor: pointer;
}
</style>
