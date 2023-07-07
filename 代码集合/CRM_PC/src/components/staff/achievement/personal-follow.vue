<template>
    <div>
        <basic-container>
            <div class="title"><span @click="dialogVisible=true">{{staffInfo.userName}}</span>的客户跟进</div>
            <div class="time">
                <span >跟进时间：</span>
                <el-radio-group v-model="searchForm.timeType" @change="timeTypeChange">
                    <el-radio :label="1">上月</el-radio>
                    <el-radio :label="2">本周</el-radio>
                    <el-radio :label="3">本月</el-radio>
                </el-radio-group>
                <el-date-picker style="margin-left:20px"
                    :clearable="false"
                    v-model="searchForm.customTime"
                    :unlink-panels="true"
                    @change="showTime"
                    format="yyyy-MM-dd HH:mm"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </div>
            <el-form  :model="searchForm" ref="searchForm" inline  style="margin:10px 0 20px 0">
                <div>
                    <el-form-item label="关键字：" >
                        <el-input v-model.trim="searchForm.keyWord" @keyup.enter.native="getAllList()" placeholder="请输入客户名称关键字或完整线索编号/手机号" style="width:300px"></el-input>
                    </el-form-item>
                    <el-form-item label="线索类型：" >
                        <el-select v-model="searchForm.clueType" placeholder="全部">
                            <el-option v-for="(item,index) in typeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>                    
                    <el-button type="primary" @click="getAllList()">搜索</el-button>
                    <el-button @click="reset()">重置</el-button>
                </div>
            </el-form>  
            <avue-crud ref="crud"
                v-loading="showLoading"
                :data="tableData"           
                :option="perFollowOption"
                :page.sync="page"      
                @sort-change="changeSort"
                @size-change="sizeChange" 
                @current-change="currentChange"
            >
                <template slot="authName" slot-scope="scope">
                    <span>{{ scope.row.clueType==1 ? scope.row.contactName : scope.row.authName}} </span>
                </template>
                <template slot="clueType" slot-scope="scope">
                    <span>{{ scope.row.clueType == 1?"个人":"单位"}} </span>
                </template>
                <template slot="fraction" slot-scope="scope">
                    <span v-if="scope.row.fraction!==0">{{scope.row.fraction}}</span>
                </template>
                <template slot="orgAddress" slot-scope="scope">
                    <span>{{ scope.row.orgAddress | filterAddress }} </span>
                </template>                
                <template slot="clueAttributionEmpName" slot-scope="scope">
                    <el-tooltip effect="dark" :content="'工号：'+empNo+'、 部门：'+deptName" placement="bottom-start">
                        <span @mouseover="showUserInfo(scope.row.clueAttributionEmpId)">{{ scope.row.clueAttributionEmpName }}</span>
                    </el-tooltip>
                </template>
                <template slot="clueSalesmanEmpName" slot-scope="scope">
                <el-tooltip effect="dark" :content="'工号：'+empNo+'、 部门：'+deptName" placement="bottom-start">
                    <span @mouseover="showUserInfo(scope.row.clueSalesmanEmpId)">{{ scope.row.clueSalesmanEmpName }}</span>
                </el-tooltip>
                </template>
                <template slot="createTime" slot-scope="scope">
                    <span>{{ scope.row.createTime|filterTime(this_)}} </span>
                </template>
                <template slot="followTypeId" slot-scope="scope">
                    <div v-if="scope.row.followTypeId == (env == 'development' ? 109 : env == 'test' ? 58 : 58)">
                      <el-tooltip effect="dark" :content="scope.row.locationName+'-'+scope.row.locationDetail" placement="bottom-start">
                        <span class="blue-sty">{{ scope.row.followTypeId | followWay(this_)}} </span>
                      </el-tooltip>
                    </div>
                    <div v-else>
                        <span>{{ scope.row.followTypeId | followWay(this_)}} </span>
                    </div>
                </template>
                <template slot="menu" slot-scope="scope">
                    <el-button type="text" @click="permissions.sys_clue_account_detail ? showDetail(scope.row): $notAuthorized()">查看</el-button>
                    <el-button type="text" @click="permissions.sys_achievements_createFollow ? createVist(scope.row) : $notAuthorized()">回访</el-button>               
                </template>      
            </avue-crud>  
            <!-- 姓名切换 -->
            <el-dialog :visible.sync="dialogVisible" width="24%">
                <div>
                    <span>姓名：</span>
                    <el-cascader v-model="staffInfo.number" ref="cascader" :show-all-levels='false' filterable :options="serviceList" :props="{ value: 'customerNo', label: 'label'}" ></el-cascader>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="changeStaff">确 定</el-button>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
            <!-- 回访 -->
            <el-dialog :visible.sync="visitVisible" title="客户回访" width="700px">
                <return-visit :key="+new Date()" v-if="visitVisible" :visible.sync="visitVisible" :userInfo="userInfo" @getAllList="getAllList" />
            </el-dialog>
        </basic-container>
    </div>
</template>

<script>
import { pageClueFollowByOperateEmpId } from "@/api/staff/achievement";
import { perFollowOption } from "@/const/crud/staff/follow";
import { mapGetters } from "vuex";
import { getDeptService} from "@/api/admin/user";
import returnVisit from "@/components/staff/achievement/return-visit";
import {filterArea } from "@/util/new-client/filter"
import { getfollowTypy,getClueContactByClueTypeAndId } from '@/api/clue/clue'
export default {
    components:{
        returnVisit,
    },
    data(){
        return{
            env: process.env.NODE_ENV,
            this_:this,
            followClueTypeList: [],
            showLoading:false,
            staffInfo:{},
            tableData:[], 
            serviceList: [],
            baseUrl: process.env.BASE_URL,
            dialogVisible:false,
            visitVisible:false,
            perFollowOption:perFollowOption,
            nondesensitize:{},
            page: {         
                currentPage: 1,
                total:0,
                layout: "total, sizes, prev, pager, next, jumper", 
                background: true ,
                pageSizes: [ 5, 8, 10, 20, 30, 40, 50, 100 ],//选择每页显示条数
                pageSize:20
            }, 
            signTime:"",
            typeOptions:[{value:null,label:"全部"},{value:2,label:"单位"},{value:1,label:"个人"}],
            searchForm:{
                keyWord:"",
                clueType:null,
                customTime:[],//自定义时间
                timeType:3,
                startTime:"",
                endTime:"",
                sortType: 'DESC',
            },
            paramsForm:{
                keyWord:"",
                clueType:null,
                customTime:[],//自定义时间
                timeType:3,
                startTime:"",
                endTime:"",
            },
            userInfo:{}    
        }
    },
    filters:{
        filterTime(val,this_){
            return this_.$moment(val).format("YYYY-MM-DD HH:mm")
        },
        transFee(value){
            return value=== null ?  '待定' : (value/100).toFixed(2);
        },        
        filterAddress(val){
            return filterArea(val);
        },
        followWay(val,this_){
            let followObj = this_.followClueTypeList.filter( item =>{
                return item.id == val;
            })
            return followObj.length>0?followObj[0].name:"未知";
        }
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods:{
        showDetail(row){
            console.log(this.permissions.sys_achievements_createFollow);
            if(!this.permissions.sys_achievements_createFollow) return this.messageBox()
            let path = "/new-clue-detail"
            let query = {
                type:1,//无需加密基本信息
                id: row.clueId,//row.clueId,
                clueType: row.clueType-1,
                clueNo:row.clueNo,
                loginEmpNo:row.clueSalesmanEmpId, //业务员编号
                sourceType: true,//业绩统计跳转至详情,
            }
            this.$router.push({ path: path, query: query})
        },
        timeTypeChange(){
            this.searchForm.customTime=[];
            this.searchForm.startTime = "";
            this.searchForm.endTime = "";
            this.paramsForm=Object.assign({},this.searchForm);
            this.getAllList()
        },
        showTime(val){
            if(val!==null){
                this.searchForm.customTime=val;
                this.searchForm.timeType=4;
                this.searchForm.startTime = this.$moment(val[0]).format("YYYY-MM-DD HH:mm:ss");
                this.searchForm.endTime = this.$moment(val[1]).format( "YYYY-MM-DD HH:mm:ss" ); 
                this.paramsForm=Object.assign({},this.searchForm);
                this.getAllList()
            }else{
                this.searchForm.timeType = 3;
                this.signTime = null;
                this.searchForm.startTime = ""
                this.searchForm.endTime = ""
                this.paramsForm = Object.assign({}, this.searchForm);
                this.getAllList();
            }
            
        },   
        changeSort(e){
            this.searchForm.sortType = e.order == 'ascending'?'ASC':'DESC';
            this.getAllList()
        },
        sizeChange(val){
            this.page.currentPage = 1
            this.page.pageSize = val
            this.getAllList(1)
        },
        currentChange(val){
            this.page.currentPage = val
            this.getAllList(1)
        }, 
        changeStaff(){
            this.staffInfo={
                number:this.$refs.cascader.getCheckedNodes()[0].value,
                name:this.$refs.cascader.getCheckedNodes()[0].label,
                userName:this.$refs.cascader.getCheckedNodes()[0].label,
                userId: this.$refs.cascader.getCheckedNodes()[0].data.value-0
            }
            console.log(this.$refs.cascader.getCheckedNodes()[0],"11")
            this.getAllList();
            this.dialogVisible = false;
        },
        getService() {
            getDeptService().then((res) => {
                this.serviceList = res.data.data;
            });
            const followClueTypeId = '15ea644a8fa2470b933e303dbc7fe19e';//跟进方式下拉框数据id
            getfollowTypy(followClueTypeId).then(res=>{
                this.followClueTypeList = res.data.data[0].options;
            });
        },
        getAllList(type){
            this.showLoading = true;
            delete this.searchForm.customTime;
            let params={
                operateEmpId: this.staffInfo.userId,
                pageNo: this.page.currentPage,
                pageSize: this.page.pageSize             
            }
            if(!type){
                this.paramsForm=Object.assign({},this.searchForm);
            }
            pageClueFollowByOperateEmpId(Object.assign(this.paramsForm,params)).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                    this.showLoading=false;
                    this.tableData=res.data.data.records;
                    this.page.total=res.data.data.total;
                    if(this.tableData.length == 0 && this.page.currentPage > 1){
                        this.page.currentPage = 1;
                        this.getAllList();
                    };
                }
            })
            if(this.$route.query.source){//需要缓存
                let urlQuery={
                    staffInfo: JSON.stringify(this.staffInfo),
                    searchForm:JSON.stringify(Object.assign(this.paramsForm,params)) ,
                }                
                sessionStorage.setItem(`personal-follow`, JSON.stringify(urlQuery));
            }       
        },
        reset(){
            this.searchForm.keyWord="";
            this.searchForm.clueType=null;
            this.getAllList();
        },        
        messageBox(){
            this.$offsetMessage({ 
                message: '无权限操作！', 
                type: 'warning'
            });
        },
        createVist(row){
            if(!this.permissions.sys_achievements_createFollow) return this.messageBox()
            let para = {
                clueType: row.clueType,
                clueId: row.clueId,
            }
            getClueContactByClueTypeAndId(para).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                    let data = res.data.data
                    this.userInfo={
                        orgName: data.authName,
                        contactName:data.contactName,
                        mobile:data.mobile,
                        jobName:row.jobName,
                        clueNo:row.clueNo,
                        userId:row.id,
                        clueId:row.clueId,
                        clueType: row.clueType,
                        number:this.staffInfo.number,
                        numbers:[row.clBelongNo,row.saleBelongNo],
                    }
                    this.visitVisible=true; 
                }
            })
           
        }           
    },
    created(){      
        if(sessionStorage.getItem(`staff-new-clue-detail`)){
            let path = "/new-clue-detail"
            let query = JSON.parse(sessionStorage.getItem(`staff-new-clue-detail`))
            this.$router.push({ path: path, query: query})
        }
    },
    mounted(){        
        this.staffInfo=JSON.parse(this.$route.query.staffInfo);
        console.log(this.staffInfo,'------------')
        this.searchForm.timeType=JSON.parse(this.$route.query.searchForm).timeType;
        if(JSON.parse(this.$route.query.searchForm).customTime && JSON.parse(this.$route.query.searchForm).customTime.length>0){
            this.searchForm.customTime=JSON.parse(this.$route.query.searchForm).customTime;//自定义时间回显
            // console.log(JSON.parse(this.$route.query.searchForm),111)
            this.searchForm.startTime=this.$moment(this.searchForm.customTime[0]).format("YYYY-MM-DD HH:mm:ss");
            this.searchForm.endTime=this.$moment(this.searchForm.customTime[1]).format("YYYY-MM-DD HH:mm:ss");  
        }       
        this.getService();
        this.getAllList();
    },
}
</script>


<style scoped>
.title{
    font-size:18px;
    padding:10px 0 20px 0;
}
.title span{
    color: #36A6FE;
    cursor: pointer;
    margin-right:20px;
    text-decoration:underline;
    font-weight: 500; 
}
.text{
  overflow: hidden;
  white-space: nowrap;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.orderMsg{
  display: flex;
  flex-direction: column;
}
.time{
    display: flex;
    align-items: center;
    font-size:14px;
    margin:10px 0  20px 0
}
.blue-sty{
    color: #36a6fe;
}
</style>