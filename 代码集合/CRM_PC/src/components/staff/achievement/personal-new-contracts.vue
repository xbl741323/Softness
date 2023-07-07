<template>
    <div>
        <basic-container>
            <div class="title"><span @click="dialogVisible=true">{{staffInfo.userName}}</span>的关联新增合同</div>
            <div class="time">
                <span >签约时间：</span>
                <el-radio-group v-model="searchForm.timeType" @change="timeTypeChange">
                    <el-radio :label="1">上月</el-radio>
                    <el-radio :label="2">本周</el-radio>
                    <el-radio :label="3">本月</el-radio>
                </el-radio-group>
                <el-date-picker style="margin-left:20px"
                    :clearable="false"
                    v-model="signTime"
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
                        <el-input v-model.trim="searchForm.keyWord" @keyup.enter.native="getAllList()"  placeholder="客户名称/订单信息关键字/合同编号" style="width:220px"></el-input>
                    </el-form-item>
                    <el-form-item label="订单类型：" >
                        <el-select v-model="searchForm.categoryId" placeholder="全部">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>                    
                    <el-button type="primary" @click="getAllList()">搜索</el-button>
                    <el-button @click="reset()">重置</el-button>
                </div>
            </el-form>  
            <avue-crud ref="crud"
                v-loading="showLoading"
                :data="tableData"           
                :option="perContractsOption"
                :page.sync="page"      
                @size-change="sizeChange" 
                @current-change="currentChange"
            >
                <template slot="categoryId" slot-scope="scope">
                    <span>{{ scope.row.categoryId==1?"项目申报":"知识产权"}} </span>
                </template>
                <template slot="totalAmount" slot-scope="scope">
                    <span>{{ scope.row.totalAmount==0?'待定': scope.row.totalAmount}} </span>
                </template>
            <template slot="clueSalesmanEmpName" slot-scope="scope">
                <el-tooltip effect="dark" :content="'工号：'+ empNo+'部门：'+ deptName" placement="bottom-start">
                    <p class="tooltip-info" @mouseover="showUserInfo(scope.row.clueSalesmanEmpId)">{{scope.row.clueSalesmanEmpName}}</p>
                </el-tooltip>
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
        </basic-container>
    </div>
</template>

<script>
import { pageStatisticsContract } from "@/api/staff/achievement";
import { perContractsOption } from "@/const/crud/staff/contract";
import { getDeptService} from "@/api/admin/user";
import orderData from '@/components/member/order-data'
export default {
    data(){
        return{
            staffInfo:{},
            tableData:[],
            showLoading:false, 
            serviceList: [],
            baseUrl: process.env.BASE_URL,
            dialogVisible:false,
            perContractsOption:perContractsOption,
            page: {         
                currentPage: 1,
                total:0,
                layout: "total, sizes, prev, pager, next, jumper", 
                background: true ,
                pageSizes: [ 5, 8, 10, 20, 30, 40, 50, 100 ],//选择每页显示条数
                pageSize:20
            }, 
            signTime:"",
            typeOptions: orderData.orderTypeData,
            searchForm:{//表单信息
                keyWord:"",
                categoryId:null,
                timeType:3,
                startSignTime:"",
                endSignTime:"",
            },
            paramsForm:{//搜索信息
                keyWord:"",
                categoryId:null,
                timeType:3,
                startSignTime:"",
                endSignTime:"",
            },  
        }
    },
    filters:{
        transFee(value){
            return value=== null ?  '待定' : (value/100).toFixed(2);
        }
    },
    methods:{
        timeTypeChange(){
            this.signTime=[];
            this.searchForm.startSignTime = "";
            this.searchForm.endSignTime = "";
            this.paramsForm=Object.assign({},this.searchForm);
            this.getAllList();
        },
        showTime(val){
            if(val!==null){
            this.signTime=val;
            this.searchForm.timeType=4;
            this.searchForm.startSignTime = this.$moment(val[0]).format("YYYY-MM-DD HH:mm:ss");
            this.searchForm.endSignTime = this.$moment(val[1]).format( "YYYY-MM-DD HH:mm:ss" ); 
            this.paramsForm=Object.assign({},this.searchForm);
            this.getAllList();
            }else{
            this.searchForm.timeType = 3;
            this.signTime = null;
            this.searchForm.startTime = ""
            this.searchForm.endTime = ""
            this.paramsForm = Object.assign({}, this.searchForm);
            this.getAllList();
            }
            
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
        },
        getAllList(type){ 
            this.showLoading=true;          
            let params={
                clueSalesmanEmpId:this.staffInfo.userId,
                pageNo:this.page.currentPage,
                pageSize:this.page.pageSize
            }
            if(!type){//type  需要带表单信息查询
                this.paramsForm=Object.assign({},this.searchForm);
            }
            pageStatisticsContract(Object.assign(this.paramsForm,params)).then(res=>{
                this.showLoading=false;          
                this.tableData=res.data.data.records;
                this.page.total=res.data.data.total;
                if(this.tableData.length == 0 && this.page.currentPage > 1){
                    this.page.currentPage = 1;
                    this.getAllList();
                };
            });
            if(this.$route.query.source){//需要缓存
                let urlQuery={
                    staffInfo: JSON.stringify(this.staffInfo),
                    searchForm:JSON.stringify(Object.assign(this.paramsForm,params)) ,
                }                
                sessionStorage.setItem(`personal-new-contracts`, JSON.stringify(urlQuery));
            }
        },
        reset(){
            this.searchForm.keyWord="";
            this.searchForm.categoryId=null;
            this.getAllList();
        }       
    },

    mounted(){
        this.staffInfo=JSON.parse(this.$route.query.staffInfo);
        console.log(this.staffInfo)
        this.searchForm.timeType=JSON.parse(this.$route.query.searchForm).timeType;
        if(JSON.parse(this.$route.query.searchForm).customTime&&JSON.parse(this.$route.query.searchForm).customTime.length>0){
            this.signTime=JSON.parse(this.$route.query.searchForm).customTime;//自定义时间回显
            this.searchForm.startSignTime = this.$moment(this.signTime[0]).format("YYYY-MM-DD HH:mm:ss");
            this.searchForm.endSignTime = this.$moment(this.signTime[1]).format( "YYYY-MM-DD HH:mm:ss" );    
        }       
        this.getService();
        this.getAllList();
    }
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
</style>