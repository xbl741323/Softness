<template>
    <basic-container>
        <div class="message">
            <h4>提醒管理</h4>
            <el-form :model="warn" :inline="true" ref="warn" @keyup.enter.native="getAllList()">
                <div style="display: flex">
                    <div>
                       <el-form-item label="搜索提醒：" prop="name">
                            <el-input v-model.trim="warn.keyWords" placeholder="请输入提醒标题关键字"></el-input>
                        </el-form-item>
                    </div>
                    <div>
                        <el-button type="primary" @click="getAllList()" >搜索</el-button>
                        <el-button @click="reset">重置</el-button>
                        <el-button v-if="false" class="filter-item" type="primary" size="small" @click="editorType(1)">添加提醒方案</el-button>
                    </div>
                </div>    
            </el-form>   
            <!-- 编辑提醒方案 -->
            <el-dialog v-if="editFormVisible" title="编辑提醒方案" width="800px" :visible.sync="editFormVisible" :before-close="handleClose" >
               <edit-wx ref="wxeditor" @closeForm="handleClose" :editType="2" :editorId="editorId"></edit-wx>
            </el-dialog>
            <!-- 添加提醒方案 -->
            <el-dialog v-if="dialogFormVisible" title="添加提醒方案" width="800px" :visible.sync="dialogFormVisible" :before-close="handleClose">
               <edit-wx ref="wxeditor"  @closeForm="handleClose" :editType="1"  ></edit-wx>
            </el-dialog>
            <!-- 列表 -->
            <avue-crud ref="crud" :page.sync="page" :data="tableData" :option="tableOption" @on-load="getList"  @size-change="sizeChange"   @current-change="currentChange">
                <template slot="templateId" slot-scope="scope">
                    <span >{{ scope.row.wxTemplate.templateId }}</span>
                </template>
                <template slot="wxTemplate" slot-scope="scope">
                    <span >{{ scope.row.wxTemplate.msgTitle }}</span>
                </template>
                <template slot="menu" slot-scope="scope" width="600px">
                    <el-button  type="primary" size="mini"  @click="goDetail(scope.row)">{{ $t("button.check") }}</el-button>
                    <!-- <el-button  type="primary" size="mini" @click="editorType(2,scope.row)">编辑</el-button>
                    <el-button  type="primary" size="mini" v-if="scope.row.planStatus==0" @click="change(scope.row)">启用</el-button>
                    <el-button  type="danger"  size="mini" v-if="scope.row.planStatus==1"  @click="change(scope.row)"> 停用</el-button> -->
                </template> 
            </avue-crud> 
        </div>
    </basic-container>
</template>

<script>
import { tableOption } from '@/const/crud/mp/wxremind'
import editWx from "@/components/wechat/edit";
import { getWxList,onwxStatus,offwxStatus} from '@/api/wx/wx'
export default {
    components: {
        editWx,
    },
     filters: {
        planStatusName(val){
        if(val===null ){
            return "全部"
        }else if(val=="0"){
            return "关"
        }else if(val=="1"){
            return "开"
        }
     },
    },
    data() {
        return {
            editorId:"",
            alertID:null,
            objectData:{},
            textarea: '',
            editFormVisible:false,
            sysDetailStatus:false,
            tableData:[],
            dialogFormVisible:false,
            page: {         
                currentPage: 1,
                total:0,
                layout: "total, sizes, prev, pager, next, jumper", 
                background: true ,
                pageSize:20
            },
            tableOption: tableOption,
            warn:{
                keyWords: '',
                planStatus: "null",
            },
            personForm: {},
            dialogAddVisible: false,
            rules:{

            },
            addForm: {
                className: "",
            },
            classifyList: [],
        }
    },
    mounted(){
       
    },
    created(){
        if(sessionStorage.getItem("params")){
            let params = JSON.parse(sessionStorage.getItem("params"))
            this.warn.keyWords = params.keyWords
            this.warn.planStatus = params.planStatus
        }
    },
    methods: {
        //启用‘停用
        change(row){
            let status=row.planStatus
            if(status==0){
                if(row.receVOS.length==0){
                    this.$message({
                        message: '请先添加接收对象',
                        type: 'warning'
                    });
                }else{
                    onwxStatus({
                        id:row.id,
                        planStatus:1
                    }).then(res=>{
                        // console.log(res,"sheludas")
                        if(res.data.code==0){
                             this.$message({
                                message: '该提醒已开启',
                                type: 'success'
                            });
                            this.getList()
                        }else{
                             this.$message({
                                message: res.data.msg,
                                type: 'warning'
                            });
                        }
                    })                    
                }
            }else if(status==1){
                this.$confirm('停用后所有对象将无法收到提醒，确定停用?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: "btn-custom-cancel",
                type: 'warning'
                }).then(() => {
                    offwxStatus({
                        id:row.id,
                        planStatus:0
                    }).then(res=>{
                        console.log(res,"sheludas")
                        if(res.data.code==0){
                             this.$message({
                                message: '该提醒已关闭',
                                type: 'success'
                            });
                            this.getList()
                        }else{
                             this.$message({
                                message: res.data.msg,
                                type: 'warning'
                            });                           
                        }
                    })                              
                })               
            }
        },
        // 分页
        sizeChange(val){
            this.page.currentPage = 1
            this.page.pageSize = val
            this.getList()
        },
        currentChange(val){
            this.page.currentPage = val
            this.getList()
        },
        getAllList(){
            this.page.currentPage = 1
            this.getList()
        },
        // 列表初始化
        getList(){
            let params= {
                current:this.page.currentPage,
                size:this.page.pageSize,
                keyWords: this.warn.keyWords,
                planStatus: this.warn.planStatus,
            }
            sessionStorage.setItem("params",JSON.stringify(params))
            getWxList(params).then(res=>{
                this.tableData=res.data.data.records
            })
        },
        //重置
        reset(){
            this.warn.keyWords = ""
            this.warn.planStatus = "null"
            this.getList()            
        },
        //关闭dilog叉叉
        handleClose(){
          this.dialogFormVisible=false;
          this.editFormVisible=false;
        //   this.$refs.wxeditor.cancle(); 
          this.warn={}
          this.getList()       
        },
        //添加编辑提醒方案
        editorType(type,row){
            if(type==1){
                this.dialogFormVisible = true
            }else{
                this.editFormVisible = true;
                this.editorId=row.id
            }           
        },
        goDetail(row) {
            // 去提醒方案详情
            this.$router.push({
                path:"/mp-remindList" ,
                query: {
                    id:row.id
                },
            });
        },
        submit(formName){
            this.$refs[formName].validate((valid) => {
            if (valid) {
                alert('submit!');
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        remove(item,index){
            this.form.receiveObject.splice(index,1)
        },
        pushList() {
            let obj = {
                objectTypes:'',
                checkList: []
            };
            this.form.receiveObject.push(obj)
        },
    },

}
</script>

<style scoped>
.message{
     min-height:800px;
}
.spans{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.add{
    margin-top: 30px;
}
.card{
    margin-top: 15px;
}
.card /deep/ .el-card__body{
    padding: 0 !important;
}
.person_title{
    align-items: center;
    display: flex;
    justify-content: center;
    line-height: 40px;
    padding: 0 15px;
    background-color: gainsboro;
    /* border:1px solid gray; */
}
.form_box{
    padding: 20px;
}
.self{
    margin-left: 20px;
}
/* .self_tit{
    margin-left: 20px;
} */
.person_title{
    align-items: center;
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    padding: 0 15px;
    background-color: gainsboro;
}
.click_btn{
    padding: 50px 100px 0px;
    display: flex;
    justify-content: space-around;
}   
.click_btn .btn{
    width: 120px;
}
</style>
