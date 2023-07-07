<template>
    <div>
        <search-head key="+new Date()"  @getList="getList" :tabName="4"></search-head>
        <avue-crud ref="crud"
            :data="tableData"
            :option="followOption"
            @sort-change="changeSort"
            :page.sync="page"
            @size-change="sizeChange"
            v-loading="showLoading"
            @current-change="currentChange"
        >
            <template slot="userNo" slot-scope="scope">
                <span @click="showDetail(scope.row)"  class="cell-blue" >{{ scope.row.userNo}} </span>
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
import { pageClueFollowStatistics } from "@/api/staff/achievement";
import { followOption } from "@/const/crud/staff/follow";
import searchHead from "@/components/staff/achievement/search-head";
import { mapGetters } from "vuex";
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
                pageSize:20
            },
            showLoading:false,
            baseUrl: process.env.BASE_URL,
            tableData:[],
            followOption:followOption,
            paramsForm:{//paramsForm 查询信息; searchForm:表单信息
                name:"",
                deptId:"",
                timeType:3,
                startTime:"",
                endTime:"",
                sortField: null,
                sortType: 'DESC',
            },
        }
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods:{
        changeSort(e){
            console.log(e);
            this.paramsForm.sortType = e.order == 'ascending'?'ASC':'DESC'
            this.paramsForm.sortField = e.prop
            this.getList(this.paramsForm)
        },
        getList(searchForm){
            this.showLoading=true;
            console.log(searchForm.timeType,"d")
            if (searchForm.timeType == null || searchForm.timeType == "") {
            searchForm.timeType = 4;
            }
            this.paramsForm=Object.assign(searchForm,{});
            this.paramsForm.pageNo=this.page.currentPage;
            this.paramsForm.pageSize=this.page.pageSize;
            pageClueFollowStatistics(this.paramsForm).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                    this.tableData=res.data.data.records;
                    this.page.total=res.data.data.total;
                    if(this.tableData.length == 0 && this.page.currentPage > 1){
                        this.page.currentPage = 1;
                        this.getList(this.paramsForm);
                    };
                    this.showLoading=false;
                    // 缓存路由
                    let obj=JSON.parse(sessionStorage.getItem(`staff-achievements`));
                    obj["formDatas4"]=Object.assign({},searchForm);
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
        sizeChange(val){
            this.page.currentPage = 1
            this.page.pageSize = val
            this.getList(this.paramsForm)
        },
        currentChange(val){
            this.page.currentPage = val
            this.getList(this.paramsForm)
        },
        showDetail(row){
            if(!this.permissions.sys_clue_follow_statistics && !this.permissions.sys_achievements_createFollow) return this.$notAuthorized();
            this.$router.push({
                path: "/personal-follow",
                query:{
                    staffInfo: JSON.stringify(row),
                    searchForm:JSON.stringify(this.paramsForm) ,
                    source:1 //需要缓存
                }
            })
        },
        messageBox(){
            this.$offsetMessage({
                message: '无权限操作！',
                type: 'warning'
            });
        }
    },
    created(){
        if(sessionStorage.getItem(`personal-follow`) && !this.$route.query.myhome){
            let obj=JSON.parse(sessionStorage.getItem(`personal-follow`));
            this.$router.push({
                path: "/personal-follow",
                query:{
                    staffInfo: JSON.stringify(JSON.parse(obj.staffInfo)),
                    searchForm:JSON.stringify(JSON.parse(obj.searchForm)) ,
                    source:1//需要做缓存
                }
            })
        }
    }
}
</script>

<style scoped>
.cell-blue{
    color: #36A6FE;
    cursor: pointer;
}
</style>
