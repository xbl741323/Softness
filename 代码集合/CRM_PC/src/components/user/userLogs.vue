<template>
        <div class="filters_form">
            <el-form :model="filters" :inline="true" ref="filters" @keyup.enter.native="getAllList()">
                <div style="display: flex">
                <div>
                    <el-form-item :label="$t('label.logType')+'：'" prop="logType">
                        <el-select v-model="filters.logType">
                            <el-option :label="$t('status.all')" value></el-option>   
                            <el-option v-for="item in logTypeList" :key="item.id" :label="item.dropdownValue" :value="item.dropdownKey"></el-option>                     
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('label.time')+'：'" prop="publishTime">
                        <el-date-picker v-model="filters.publishTime" @change="showTime" type="datetimerange" format="yyyy-MM-dd HH:mm" :range-separator="$t('message.to')" :start-placeholder="$t('message.startTime')" :end-placeholder="$t('message.endTime')"></el-date-picker>
                    </el-form-item>
                </div>
                <div>
                    <el-button type="primary" @click="getAllList">{{$t('button.search')}}</el-button>
                </div>
                </div>      
            </el-form>
            <avue-crud ref="crud" :page.sync="page" :data="logList" :option="tableOption" @on-load="getList">
            <template slot="title" slot-scope="scope">
                <div v-if="scope.row.logType=='key5'">
                    <div v-if="encrypted==1">
                        <span>{{$t('message.oldPhoneNumber')}}：{{scope.row.encryptedOldPhone}}</span>
                        <span class="new-phone">{{$t('message.newPhoneNumber')}}：{{scope.row.encryptedNewPhone}}</span>
                    </div>
                    <div v-else>
                        <span>{{$t('message.oldPhoneNumber')}}：{{scope.row.oldPhone}}</span>
                        <span class="new-phone">{{$t('message.newPhoneNumber')}}：{{scope.row.newPhone}}</span>
                    </div>
                </div>
                <div v-else> {{scope.row.title}} </div>
            </template>
            <template slot="terminalType" slot-scope="scope">
                <span >{{ scope.row.terminalType | terminalType}}</span>
            </template>
        </avue-crud> 
        </div>
</template>

<script>
import { tableOption } from "@/const/crud/user/myLog";
import { getLogList,getDropdownAccountType} from "@/api/admin/user";
export default {
    props:["encrypted"],
    data() {
        return {    
            tableOption: tableOption,  
            filters:{
                keyWords:'',
                logType:'',
                publishTime: [],
            },
            logTypeList:[],
            logList:[],  
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 20, // 每页显示多少条,
                isAsc: false // 是否倒序
            },
        };
    },
    filters: {  
        terminalType(val){
            if(val==1){
                return "PC端"
            }else if(val==2){
                return "移动端"
            }else if(val==3){
                return "小程序"
            }else if(val==4){
                return "APP"
            }else{
                return ""
            } 
        }    
    },
    methods: {   
        getAllList() {
            this.page.currentPage = 1;
            this.getList();
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getAllList()
        }, 
        getList(data){
            var pageObj = {
                current: this.page.currentPage,
                size: this.page.pageSize,
            };
            var logObj = {
                keywords: this.filters.keyWords.trim(),
                logType: this.filters.logType,
                encrypted: this.encrypted,
                userNo: this.$route.query.userNo,
                gmtCreateStart: this.filters.publishTime!=null&&this.filters.publishTime[0] != null ? this.$moment(this.filters.publishTime[0]).format( "YYYY-MM-DD HH:mm:ss"): null,
                gmtCreateend: this.filters.publishTime!=null&&this.filters.publishTime[1] != null? this.$moment(this.filters.publishTime[1]).format("YYYY-MM-DD HH:mm:ss"): null,
            }
            this.params = {
                page: JSON.stringify(pageObj),
                accountLog: JSON.stringify(logObj),
            };
            getLogList(this.params).then((res) => {
                this.logList = res.data.data.records;
                this.page.total = res.data.data.total;
            }).catch((err) => {
                console.log(err)
            });
        },
        showTime(val) {
            console.log(val, "输出需要的时间！");
        },
        getDropData(){
            getDropdownAccountType(0).then((res) => {
                this.logTypeList = res.data.data
            }).catch((err) => {
                console.log(err)
            });
        }
    },
    mounted() {
        this.getDropData();
    }
};
</script>

<style scoped>
.filters_form{
  width: 100%;
  padding: 0 30px;
}
.radio_item:nth-of-type(1) {
  border-left: none;
}
.radio_item {
  margin-right: 10px;
  margin-top: 10px;
  border-left: 1px solid #dcdfe6;
  border-radius: 0px 0px 0px 0px;
}
.new-phone{
    margin-left: 20px;
}
</style>

