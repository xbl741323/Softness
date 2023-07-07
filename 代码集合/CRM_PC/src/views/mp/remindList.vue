<template>
    <div>
        <div class="vx_detail ">
            <h3>提醒方案详情</h3>
            <el-card class="box-card">
                <div class="clearfix" style="line-height: 32px;">
                    <span class="title">{{wxDetail.wxTemplate.msgTitle}}</span>
                    <span class="wxPlantId">微信模版ID：{{ wxDetail.wxTemplate.templateId}}</span>
                </div>
            </el-card>
            <div class="accept">
                <h3>
                    <i></i>
                    接收对象
                </h3>
                <!-- 接收对象列表 -->   
                <div style="width:100%;padding:10px;min-height:360px;background:#fff">
                    <avue-crud ref="crud"    :data="showDate" :option="tableOption">
                        <template slot="planId" slot-scope="scope">
                            <span >{{scope.row.receTypeName}}</span>
                        </template>
                        <template slot="msgHead" slot-scope="scope" >
                            <div class="spans">
                                <span >{{scope.row.msgHead}}</span>               
                                <span >{{ wxDetail.wxTemplate.templateContent}}</span>
                                <span >{{scope.row.msgFoot}}</span>
                            </div>
                        </template>
                        <template slot="receNameList" slot-scope="scope">
                        <div class="spans">
                            <span v-for="(item,index) in scope.row.receNameList" :key="index">{{index+1}}、{{item}}</span>
                        </div>
                        </template>
                        <template slot="receStatus" slot-scope="scope">
                            <div class="spans spans-center">
                                {{scope.row.receStatus == 1 ? '开' : '关'}}
                            </div>
                        </template>
                        <template slot="gmtCreate" slot-scope="scope">
                            <div class="spans spans-center">
                                <div class="label_bottom">{{ scope.row.gmtCreate }}</div>
                            </div>
                        </template>
                        <template slot="menu" slot-scope="scope">
                            <el-button icon="el-icon-edit" type="text" size="mini" @click="addObject(2,scope.row)" >编辑</el-button>
                            <el-button  type="text" size="mini" v-if="scope.row.receStatus== 0" @click="change(scope.row)">启用</el-button>
                            <el-button  type="text" size="mini" v-if="scope.row.receStatus== 1" @click="change(scope.row)">停用</el-button>
                        </template>
                    </avue-crud>
                </div>
                 
            </div>
        </div>
        <!-- 编辑提醒方案 -->
        <el-dialog title="编辑提醒方案" v-if="editFormVisible" width="800px" :visible.sync="editFormVisible" :before-close="handleClose"  >
            <edit-wx ref="wxeditor" @closeForm="handleClose" :editType="2" :editorId="editorId"></edit-wx>
        </el-dialog>
        <!-- 编辑、添加对象 -->
        <el-dialog v-if="objDialogVisible" :title="title" :visible.sync="objDialogVisible" width="600px" :before-close="reset" :close-on-click-modal="false" center>
            <el-form :model="objForm" ref="objForm" :rules="rules" label-width="100px" label-position="left">
            <el-form-item class="duixianglx" label="接收对象：" prop="specialRece" >
                <!-- <el-select v-model="objForm.specialRece" placeholder="请选择" style="width:183px"  multiple collapse-tags="" >
                    <el-option
                        v-for="item in childrenOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select> -->
                {{objForm.receRemark}}
                <!-- <el-checkbox label="自定义" v-model="objForm.checked" style="margin:0 10px;" @change="selectChange"></el-checkbox>
                    <el-cascader 
                        filterable
                        :show-all-levels='false'
                        v-if="objForm.checked"
                        width="500px"                                                     
                        :options="empSelect"
                        v-model="objForm.customer"
                        :props="props"
                        clearable
                        collapse-tags
                        @change="empChange"
                    ></el-cascader>                                                                                                              -->
                </el-form-item>                
                <el-form-item label="提醒前缀:" prop="msgHead" >
                    <el-input type="textarea" v-model="objForm.msgHead" maxlength="100" show-word-limit placeholder="您有线索客户注册了卧涛网"></el-input>
                </el-form-item>
                <el-form-item label="提醒尾缀:">
                    <el-input type="textarea" v-model="objForm.msgFoot" maxlength="100" show-word-limit placeholder="请注意查看"></el-input>
                </el-form-item>                          
            </el-form>   
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit()">确 定</el-button>
                <el-button @click="reset()">取 消</el-button>               
            </span>                       
        </el-dialog>
    </div>
</template>
<script>
import editWx from "@/components/wechat/edit";
import { getEmpList} from '@/api/clue/clue'
import detailHead from "@/page/index/top/index";
import {getWxDetail,delWxDetail,getChildren,addWxRece,editWxRece,switchOn,switchOff} from '@/api/wx/wx'
import { tableOption } from '@/const/crud/mp/wxdetail'

export default {
    components: {
      detailHead,editWx
  },
    data() {
        var objValidate = (rule, value, callback)=>{//接收对象验证
            if(!value){
                callback();
            }else{
                if(this.validateStatus=true&&this.objForm.specialRece.length==0 && this.objForm.customer.length==0){
                    callback(new Error('请选择对象类型!'));                                                
                }else{
                    callback();
                }
            }
        };
        return {
            editorId:this.$route.query.id,
            validateStatus:false,
            props: { multiple: true },
            list:[],
            objectData:"",
            editId:"",
            addType:"",
            editFormVisible:false,
            alertmsg:"",
            empSelect:[],
            childrenOptions: [],
            title:"",
            objDialogVisible:false,
            tableOption: tableOption,
            objForm:{ 
                checked:false,  
                specialRece:[],
                checkList: [],
                msgHead:'',
                msgFoot:"",
                customerRece:[],
                customer:[],
                objType:'',               
                    },
            wxDetail:{
                wxTemplate:{
                    msgTitle: "",
                    templateId:""
                },
                receVOS:[]
            },
            showDate:[],
            page: {         
                currentPage: 1,
                total:0,
                layout: "total, sizes, prev, pager, next, jumper", 
                background: true ,
                pageSize:20
            },
            rules:{
                msgHead:[{required:true, message:'请输入提醒前缀!', trigger: 'blur'}],
                // specialRece:[{required:true,validator: objValidate}],
            },
        }
    },
    methods: {
        //自定义切换
        selectChange(val){
            // console.log(val,"shelu")
            if(!val){
                this.objForm.customer=[]
                this.objForm.customerRece=[]
            }
        },
         //编辑提醒方案关闭dilog叉叉
        handleClose(){
            // console.log(1111111)
          this.editFormVisible=false;
          this.getList() 
        },
        //编辑提醒方案弹框打开按钮
        editor(){
            this.editFormVisible=true;
        },        
        //编辑对象弹框确认按钮
        submit(){
            this.validateStatus = true;
            this.$refs.objForm.validate((valid) => {
            if (valid) {
                let params={}
                if(this.addType==1){  //添加                 
                    params.planId=this.wxDetail.id;
                    params.msgHead=this.objForm.msgHead;
                    params.msgFoot=this.objForm.msgFoot;
                    params.customerRece=this.objForm.customerRece;
                    params.specialRece=this.objForm.specialRece;
                    params.receStatus = '1';
                    params.gmtCreate = this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                    addWxRece(params).then(res=>{
                        if(res.data.code==0){
                            this.$message({
                            message: this.alertmsg,
                            type: 'success'
                            }); 
                            this.reset()
                            this.getList()
                        }else{
                            this.$message({
                                message: res.data.msg,
                                type: 'warning'
                             }); 
                        }
                    })
                }else{ //编辑                  
                    params.id=this.editId;
                    params.planId=this.wxDetail.id;
                    params.msgHead=this.objForm.msgHead;
                    params.msgFoot=this.objForm.msgFoot;
                    if(this.objForm.customerRece){
                        params.customerRece=this.objForm.customerRece;
                    }                   
                    params.specialRece=this.objForm.specialRece;
                    editWxRece(params).then(res=>{
                        if(res.data.code==0){
                            this.$message({
                            message: this.alertmsg,
                            type: 'success'
                            }); 
                            this.reset()
                            this.getList()
                        }else{
                            this.$message({
                                message: res.data.msg,
                                type: 'warning'
                                }); 
                        }
                    })
                }
            }
           });
         },
       //编辑对象弹框取消按钮
        reset() {
            this.$refs.objForm.resetFields();
            this.objForm={  
                checked:false, 
                specialRece:[],
                checkList: [],
                msgHead:'',
                msgFoot:"",
                customerRece:[],
                customer:[],
                objType:'',
                }
            this.objDialogVisible=false
        },
        //  添加,编辑接收对象按钮
        addObject(type,row){
            getChildren({parentNumber:row.msgTypeNumber}).then(res=>{
                let name = []
                this.childrenOptions = []
                res.data.data.forEach(item => {
                    name.push(item.label)
                });
                this.childrenOptions = name
            })
            getEmpList(false).then(res=>{
                this.empSelect=res.data.data;
                // console.log(this.empSelect,"huxingdas")
            })   
            this.validateStatus=false
            this.objDialogVisible=true
            this.addType=type
            if(type==1){                
                this.title="添加接收对象"
                this.alertmsg="添加接收对象成功"
            }else{
                this.title="编辑提醒方案"
                this.alertmsg="编辑提醒方案成功"
                this.objForm=Object.assign({checked:false}, row);
                // console.log(this.objForm,11111111111111111)

                if(row.customerRece.length>0){
                    this.objForm.checked=true;
                    this.objForm.customer=row.customerRece;
                    // this.objForm.customer=[["40","41","1"]];
                    // console.log(this.objForm.customer,11111111111111111)
                    this.objForm.customerRece=row.customerRece.map((item,i)=>{
                        return item.join(",")
                    })
                }else{
                    
                    this.objForm.customer=[]
                }  
                this.editId=row.id
            }
        },              
         //自定义员工下拉框改变时
        empChange(val){
            this.objForm.customerRece=[];
            for(let i=0;i<val.length;i++){
                this.objForm.customerRece.push(val[i].join(","))  
            }                                            
        },
        //初始化详情信息
        getList(){
            getWxDetail(this.$route.query.id).then(res=>{
                if(res.data.code==0){
                    this.wxDetail=res.data.data;
                    this.showDate=res.data.data.receVOS;
                }
            })
        },
        //启用‘停用
        change(row){
            console.log(row);
            let status = row.receStatus
            if(status == 0){
                switchOn({
                    id: row.id,
                    receStatus: '1'
                }).then(res=>{
                    if(res.data.code == 0){
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
            }else if(status==1){
                this.$confirm('停用后所有对象将无法收到提醒，确定停用?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: "btn-custom-cancel",
                type: 'warning'
                }).then(() => {
                    switchOff({
                        id:row.id,
                        receStatus:'0'
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
        //删除对象
        deleteObj(row){            
            // console.log(row,33333333333)
            this.$confirm('确定删除该接收对象?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: "btn-custom-cancel",
                type: 'warning'
                }).then(() => {
                    delWxDetail(row.id).then(res=>{
                        // console.log(res,11111111111)
                        if(res.data.code==0){
                            this.$message({
                            message: '删除成功',
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
        },
    },
    mounted(){
        this.getList()
    }

}
</script>

<style scoped>
.spans{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.spans-center{
    align-items: center;
}
.vx_detail{
    width: 80%;   
    margin: 0 auto;  
}
.el-card.is-always-shadow {
    border: 1px solid#EBEEF5 !important;
    /* box-shadow:border-box;     */
}
.editBtn{
    float:right;
    margin-right:20px
}
.title{
    font-weight: bold;
}
.clearfix:before,
    .clearfix:after {
    display: table;
    content: "";
}   
    .clearfix:after {
        clear: both
}
.el-card /deep/ .el-card__header{
    border:none;
}
.item_box{
    display: flex;
    justify-content: space-between;
    width: 60%;
}
.label_box{
    margin-bottom: 20px;
    font-size: 14px;
    color: #303133;
}
.label_bottom{
    font-size: 14px;
}
.accept{
    margin-top: 40px;
}
.accept h3{
    display: flex;
    align-items: center;
}
.accept h3 i{
    display: inline-block;
    width: 5px;
    height: 18px;
    margin-right: 15px;
    background-color: cornflowerblue;
}
.add{
    margin-bottom:20px
}
.wxPlantId{
    font-size: 14px;
    margin-left: 60px;
}
.duixianglx{
    display:flex;
    align-items: center;
    
}
.duixianglx .el-form-item__content {
   margin-left:0px !important;
}
</style>