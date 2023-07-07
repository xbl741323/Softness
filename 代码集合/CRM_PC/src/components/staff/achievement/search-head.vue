<template>
    <div>
        <div class="time">
            <span>{{timeLable}}</span>
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
        <el-form  :model="searchForm" ref="searchForm" inline class="search-form">
            <el-form-item label="姓名：" prop="keyWord">
                <el-input v-model.trim="searchForm.keyWord" @keyup.enter.native="getAllList()"  placeholder="请输入员工姓名关键字" style="width:220px"></el-input>
            </el-form-item>
            <el-form-item label="部门：" prop="deptId">
                <avue-input-tree @change="ccc" v-model="searchForm.deptId" :dic="treeData"  :props="{label: 'name',value: 'id'}" placeholder="请选择所属部门"/>
            </el-form-item>
            <el-button type="primary" @click="getAllList()">搜索</el-button>
            <el-button @click="reset()">重置</el-button>
        </el-form>
    </div>
</template>

<script>
import { fetchNewTree } from "@/api/admin/dept";

export default {
    props:["tabName"],
    data() {
       return{
           searchForm:{
                keyWord:"",
                deptId:"",
                timeType:3,
                customTime:"",//自定义时间 
            }, 
            treeData:[],
            paramsForm:{
                keyWord:"",
                deptId:"",
                timeType:3,
                startTime:"",
                endTime:"",
                customTime:"",//自定义时间 
            },    
            timeLable:"签约时间：",
                       
       } 
    },
    methods:{
        ccc(){
            console.log(this.searchForm,this.paramsForm,111)
        },
        timeTypeChange(val){
            this.searchForm.customTime=[];
            this.paramsForm.startTime = "";
            this.paramsForm.endTime = "";
            this.paramsForm.timeType = val;
            this.paramsForm.customTime = [];
            this.$emit("getList",this.paramsForm) ;            
        },
        showTime(val){
            console.log("sd",val)
            if(val!==null){
            this.searchForm.customTime=val;
            this.searchForm.timeType=null;
            this.paramsForm.customTime = val;
            this.paramsForm.timeType = null;
            this.paramsForm.startTime = this.$moment(val[0]).format("YYYY-MM-DD HH:mm:ss");
            this.paramsForm.endTime = this.$moment(val[1]).format( "YYYY-MM-DD HH:mm:ss" ); 
            this.$emit("getList",this.paramsForm) ;
            }else{
            this.searchForm.customTime="";
            this.searchForm.timeType=3;
            this.paramsForm.customTime = val;
            this.paramsForm.timeType=3;
            this.paramsForm.startTime = "";
            this.paramsForm.endTime = ""; 
            this.$emit("getList",this.paramsForm) ;
            }
           
        },   
        getAllList(type){
            if(type==1){
                this.$emit("getList",this.searchForm) ;
            }else{
                this.paramsForm.keyWord=this.searchForm.keyWord;
                this.paramsForm.deptId=this.searchForm.deptId;
                this.$emit('update:page',{         
                    currentPage: 1,
                    total:0,
                    layout: "total, sizes, prev, pager, next, jumper", 
                    background: true ,
                    pageSizes: [ 5, 8, 10, 20, 30, 40, 50, 100 ],//选择每页显示条数
                    pageSize:20
                })
                this.$emit("getList",this.paramsForm) ;
            }
        },
        reset(){
            this.searchForm.keyWord="";
            this.searchForm.deptId="";
            this.paramsForm.keyWord="";
            this.paramsForm.deptId="";
            this.$emit("getList",this.paramsForm) ;
        },
        getDropList() {          
            if(this.tabName==2){
                this.timeLable="签约时间："
            }else if(this.tabName==4){
                this.timeLable="跟进时间："
            }else if(this.tabName==1){
                this.timeLable="回款时间："
            }else if(this.tabName==4){
                this.timeLable="创建时间："
            }  
            let params = {
                menuFlag:"achievements_list"
            };    
            fetchNewTree(params).then((response) => {
                this.treeData = response.data.data;
            });
        }, 
    },
    created(){
        if(sessionStorage.getItem(`staff-achievements`)){
            let obj=JSON.parse(sessionStorage.getItem(`staff-achievements`));
            if(obj["formDatas"+this.tabName]){
                this.searchForm.deptId=obj["formDatas"+this.tabName].deptId;
                this.searchForm.timeType=obj["formDatas"+this.tabName].timeType;
                this.searchForm.customTime=obj["formDatas"+this.tabName].customTime;  
                this.searchForm.keyWord=obj["formDatas"+this.tabName].keyWord;                 
            };
            if(this.searchForm.customTime && this.searchForm.customTime.length>0){
                this.searchForm.startTime = this.$moment(this.searchForm.customTime[0]).format("YYYY-MM-DD HH:mm:ss");
                this.searchForm.endTime = this.$moment(this.searchForm.customTime[1]).format( "YYYY-MM-DD HH:mm:ss" ); 
            }
        }
        console.log(JSON.parse(sessionStorage.getItem(`staff-achievements`)),this.searchForm,"huancun22")
        this.getDropList();
        this.paramsForm=Object.assign({},this.searchForm);
        this.$emit("getList",this.searchForm) ;
    },

}
</script>


<style scoped>
.search-form{
    margin:10px 0;
}
.search-form >>> .el-form-item{
    margin-right:30px;
}
.time{
    display: flex;
    align-items: center;
    font-size:14px;
    margin:10px 0  20px 0
}
</style>