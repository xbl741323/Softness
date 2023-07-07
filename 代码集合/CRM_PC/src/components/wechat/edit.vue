<template>
    <div class="wx-sty">
        <el-form :model="form" ref="form" label-width="100px" label-position="right" >
            <h3>基本信息：</h3>
            <el-form-item label="提醒类别:" prop="type">
                <el-select v-model="form.type" placeholder="请选择提醒类别" style="width: 450px;" @change="changeType">
                    <el-option                    
                    v-for="(item,index) in typeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.number">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="微信模版ID:" prop="vxID" :rules="{required: true, message: '请选择模版ID',trigger: 'change'}">
                <el-select v-model="form.vxID" placeholder="请选择模版ID" style="width: 450px;"  value-key="id"  @change="changeID">
                    <el-option
                    v-for="(item,index) in IDoptions"
                    :key="index"
                    :label="item.msgTitle+'('+item.templateId+')'"
                    :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提醒标题:">
               <span>{{msgTitle}}</span>
            </el-form-item>
            <el-form-item label="附加数据:">
                 <span>{{templateContent}}</span>
            </el-form-item>
            <el-form-item label="提醒状态:">
                <el-radio-group v-model="form.statuaVal">
                    <el-radio label="1">开</el-radio>
                    <el-radio label="0">关</el-radio>
                </el-radio-group>
            </el-form-item>
            <h3>接收对象：</h3>
            <div v-for="(item,index) in form.receiveObject" :key="index" >               
                <el-card class="card">
                    <div class="person_title">
                        <span>接收对象{{index+1}}</span>
                        <i class="el-icon-close" @click="remove(item,index)"></i>
                    </div>
                    <div class="form_box">
                        <el-form-item class="duixianglx" label="对象类型：" :prop="'receiveObject.' + index" :rules="objRules.objCheckList">
                            <!-- <el-checkbox-group v-model="item.objCheckList" > -->
                                <!-- <el-checkbox label="看不见我" style="display:none"></el-checkbox> -->
                                <el-select v-model="item.specialRece" placeholder="请选择"  multiple collapse-tags="" style="width: 183px">
                                    <el-option
                                        v-for="item in childrenOptions"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.value"
                                       >
                                    </el-option>
                                </el-select>
                                <el-checkbox label="自定义" v-model="item.checked" style="margin:0 10px;"  @change="selectChange(item.checked,index)"></el-checkbox>
                                    <el-cascader 
                                        filterable
                                        :show-all-levels='false'
                                        v-if="item.checked"
                                        width="500px"                                                     
                                        :options="empSelect"
                                        v-model="item.customer"
                                        :props="{ multiple: true }"
                                        clearable
                                        collapse-tags
                                        @change="empChange(item.customer,index)"
                                    ></el-cascader> 
                            <!-- </el-checkbox-group>                                                                                      -->
                        </el-form-item>
                        <!-- <el-form-item label="子类别:" >
                        <el-checkbox-group v-model="item.checkList">
                            <el-checkbox label="复选框 A"></el-checkbox>
                            <el-checkbox label="复选框 B"></el-checkbox>
                            <el-checkbox label="复选框 C"></el-checkbox>
                        </el-checkbox-group>
                        </el-form-item> -->
                        <el-form-item label="提醒前缀:" :prop="'receiveObject.' + index + '.msgHead'" :rules="objRules.msgHead">
                            <el-input type="textarea" v-model="item.msgHead" maxlength="100" show-word-limit placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="提醒尾缀:">
                            <el-input type="textarea" v-model="item.msgFoot" maxlength="100" show-word-limit placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </div>
                </el-card>
            </div>                
        </el-form>
        <div >                    
            <el-button type="primary" class="add" icon="el-icon-plus" @click="pushList">接收对象</el-button>
            <div class="click_btn">
                <el-button type="primary" class="btn" plain @click="submit()" :disabled="disabled">确定</el-button>
                <el-button type="info" class="btn" plain @click="reset()">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { getWxType,getWxID,getChildren,addWxObject,editWxObject,wxIDcheck,getWxDetail} from '@/api/wx/wx'
import { getEmpList} from '@/api/clue/clue'
export default {
    props:["editType","editorId"],
    data() {
        var objValidate = (rule, value, callback)=>{
            if(!value){
                callback();
            }else{
                if(this.validateStatus && value.specialRece.length==0 && value.customer.length==0 ){                   
                    callback(new Error('请选择对象类型!'));                   
                }else{
                    callback();
                }
            }
        };
        return { 
            modelID:"",
            disabled:false,
            alertID:null,
            validateStatus:false,
            customerReceList:[],
            emp:"",
            showStatus: 0,
            isShow:false,         
            checked:false,
            empSelect:[],
            templateContent:"",
            msgTitle:"",
            childrenOptions:[],
            typeOptions:[],
            IDoptions:[],
            textarea: '',          
            form:{
                vxID:"",
                type: '',
                title: '',
                otherInfo: '',
                statuaVal: '0',
                ob: [],
                id: '',
                receiveObject: [
                    {   
                        specialRece:[],
                        checked: false,
                        msgHead:'',
                        msgFoot:"",
                        customerRece:[],
                        customer:[],
                        objType:'',
                        // objCheckList:[],
                    }
                ],
            },
            objRules:{
                msgHead:[{required:true, message:'请输入提醒前缀!', trigger: 'blur'}],
                objCheckList:[{required:true,validator: objValidate}],
            },
        }
    },
    mounted(){
        this.getData()
    },
    // computed: {
    //     newType: function () {
    //          return this.form.type
    //     }
    // },
    // watch:{
    //     newType(val, oldVal){    
            
    //         getChildren({parentNumber:val}).then(res=>{
    //            this.childrenOptions=res.data.data
    //         })
    //     }
    // },
    methods: {
        //提醒类型改变
        changeType(val){
            getChildren({parentNumber:val}).then(res=>{
               this.childrenOptions=res.data.data
            })
            if(this.form.receiveObject.length>0){
                for(var i=0;i<this.form.receiveObject.length;i++){
                    this.form.receiveObject[i].specialRece=[]
                }
            }
        },
        //初始化、下拉框数据
        getData(){           
            //提醒类别下拉框
            getWxType({type:2}).then(res=>{
                if(res.data.code==0){
                    this.typeOptions=res.data.data
                }               
            })
            getWxID().then(res=>{
                if(res.data.code==0){
                     this.IDoptions=res.data.data
                }               
            })
            getEmpList(false).then(res=>{
                this.empSelect=res.data.data
            })
            //编辑时数据回显
            if(this.editType==2){
                getWxDetail(this.editorId).then(res=>{
                    if(res.data.code==0){
                        this.objectData=res.data.data
                        console.log(this.objectData,"cheds")
                        this.alertID=this.objectData.id
                        this.form.type=this.objectData.msgTypeNumber;
                        this.form.vxID=this.objectData.wxTemplate
                        this.modelID=this.objectData.wxTemplate.id
                        this.msgTitle=this.form.vxID.msgTitle;
                        this.templateContent=this.form.vxID.templateContent;
                        this.form.statuaVal=this.objectData.planStatus
                        this.form.receiveObject=this.objectData.receVOS.map(item=>{
                            return Object.assign({checked:false,customer:[]},item)
                        })   
                        if(this.form.type){
                            getChildren({parentNumber:this.form.type}).then(res=>{
                                this.childrenOptions=res.data.data
                            })
                        }
                        // console.log( this.form.receiveObject,"shelu")                    
                        for(let i=0;i<this.objectData.receVOS.length;i++){
                            this.form.receiveObject[i].customer=this.objectData.receVOS[i].customerRece
                            if(this.objectData.receVOS[i].customerRece){
                                if(this.objectData.receVOS[i].customerRece.length>0){
                                    this.form.receiveObject[i].checked=true;
                                    this.form.receiveObject[i].customerRece=this.objectData.receVOS[i].customerRece.map(item=>{
                                    return item.join(",")
                                })
                                }                       
                            }
                        }                               
                    }
                })
                
            }                           
        },
        //自定义多选框切换
        selectChange(val,i){
            // console.log(val,i,"rui")
            if(!val){
                this.form.receiveObject[i].customerRece=[];
                this.form.receiveObject[i].customer=[];
            }
        },
        //自定义员工下拉框
        empChange(val,index){
            let data=val.map(item=>{
                return item.join(",")
            })          
            this.form.receiveObject[index].customerRece=data
        },
        // change模板id
        changeID(val){   
            console.log(this.modelID,"chegnwne")
            // console.log(val,111111222222)        
            this.msgTitle=val.msgTitle;
            this.templateContent=val.templateContent; 
            wxIDcheck({
                id:this.modelID,
                type:val.msgType
                }).then(res=>{
                    if(!res.data.data){
                        this.$message({
                            message: "此微信模板已被占用,请重新选择",
                            type: 'success'
                        }); 
                        this.disabled=true
                    }else{
                        this.disabled=false
                    }
            })           
        },
        //取消按钮
        reset(){
            // console.log("sheludasha")
            this.$refs.form.resetFields();
            this.$emit("closeForm");
        },
        // cancle(){
        //     this.$refs.form.resetFields();
        // },
        //提交表单
        submit(){
            this.validateStatus = true;//提交表单时才验证
            this.$refs.form.validate(valid=>{
                if(valid){                   
                    if(this.editType=="1"){//添加
                        if(this.form.receiveObject.length<1){
                            this.$message({
                                message: "请先添加一个接收对象",
                                type: 'warning'
                                });
                        }else{
                            let params={};
                            params.msgTypeNumber=this.form.type==undefined?"":this.form.type;
                            params.wxId=this.form.vxID.id==undefined?"":this.form.vxID.id;
                            params.planStatus=this.form.statuaVal;
                            params.receDtos=this.form.receiveObject
                            addWxObject(params).then(res=>{
                                console.log(res,111111111)
                            if(res.data.code==0){
                                    this.$message({
                                    message: "提醒方案添加成功",
                                    type: 'success'
                                    }); 
                                    this.reset()
                                }else{
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'warning'
                                        }); 
                                }
                            }) 
                        }                  
                    }else{//编辑                        
                        if(this.form.receiveObject.length<1){
                            this.$message({
                                message: "请先添加一个接收对象",
                                type: 'warning'
                                });
                        }else{
                            let params={};
                            params.id=this.objectData.id;
                            params.msgTypeNumber=this.form.type==undefined?"":this.form.type;
                            params.msgTypeId=this.form.type.id==undefined?"":this.form.type.id;
                            params.wxId=this.form.vxID.id==undefined?"":this.form.vxID.id;
                            params.planStatus=this.form.statuaVal;
                            params.receDtos=this.form.receiveObject
                            editWxObject(params).then(res=>{
                                console.log(res,1111111111)
                                if(res.data.code==0){
                                    this.$message({
                                    message: "提醒方案编辑成功",
                                    type: 'success'
                                    }); 
                                    this.reset()
                                }else{
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'warning'
                                        }); 
                                }
                            })  
                        }
                    }
                 }
            })            
        },
        remove(item,index){
            this.form.receiveObject.splice(index,1)           
        },
        pushList() {
            let obj = {
                        specialRece:[],
                        checked:false,
                        msgHead:'',
                        msgFoot:"",
                        customerRece:[],
                        customer:[],
                        objType:'',
                        receStatus: '1',
                        gmtCreate: this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                    };
            this.form.receiveObject.push(obj)
        },
    },

}
</script>

<style scoped>
.check{
    margin-left:-80px
}
.checked{
    margin-left:10px
}
.spanStyle{
   color:#F56C6C;
   font-size:10px;
   position:relative;
   top:27px;
   left:-170px
}
.star{
    color:#F56C6C;
    margin-right:4px;
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
<style>
.wx-sty .el-select__caret .el-input__icon .el-icon-circle-close {
  display: none;
}
.wx-sty .el-input__suffix{
  display: none !important;
}
.duixianglx{
    display:flex;
    align-items: center;
    
}
.duixianglx .el-form-item__content {
   margin-left:0px !important;
}
</style>
