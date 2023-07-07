<template>
<!-- 排查完成 -->
    <div class="requirement">
        <div class="content">
            <div v-if="!id">新建需求</div>
            <div class="title">基本信息</div>
            <el-form :model="dataList" ref="requirementForm" label-position="left" :rules="rules" label-width="100px" class="requirement-form">
                 <el-form-item label="需求名称：" prop="requirementName">
                    <el-input type="text" v-model="dataList.requirementName" placeholder="不超过35个字"></el-input>
                </el-form-item>                
                <el-form-item label="需求类型：" prop="requirementType">
                    <el-select v-model="dataList.requirementType"  style="width:360px" placeholder="请选择需求类型">
                        <el-option 
                        v-for="item in requirementTypeList"
                        :key="item.dropdownKey"
                        :value="item.dropdownKey"
                        :label="item.dropdownValue">
                        </el-option>                        
                    </el-select>
                </el-form-item>
                 <el-form-item label="所属行业：" prop="industry" >                    
                    <el-select v-model="dataList.industry" multiple :multiple-limit="3" style="width:360px" placeholder="请选择所属行业">
                        <el-option  
                        v-for="item in industryData"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name">
                        </el-option>                     
                    </el-select>
                    <span style="color:red;margin-left:5px;font-size:12px;">最多可选3个行业</span>
                </el-form-item>
                <el-form-item label="投入预算：" prop="tradePriceMax">
                    <el-input type="number" min="0" :disabled="dataList.priceType" v-model="dataList.tradePriceMin"  style="width:130px" ></el-input>&nbsp;-万元&nbsp;&nbsp;&nbsp;至
                    <el-input type="number" min="0"  :disabled="dataList.priceType" v-model="dataList.tradePriceMax"  style="width:130px" ></el-input>&nbsp;-万元
                    <el-checkbox label="面议"  ref="priceType" v-model="dataList.priceType" ></el-checkbox>
                </el-form-item> 
                <el-form-item label="所在地：" prop="area" >
                    <el-cascader 
                    ref="myCascader"
                    placeholder="请选择所在地"
                    style="width:360px"
                    size="large" 
                    :options="areaList"                     
                    v-model="dataList.area" 
                    :props="{value: 'id',label: 'areaName'}"                  
                    >
                    </el-cascader>
                </el-form-item>                              
                <el-form-item label="显示状态：" prop="status" >
                    <el-radio-group v-model="dataList.status" >
                        <el-radio v-for="(item,index) in showStatusList" :key="index" :label="index+1">{{item}}</el-radio>
                    </el-radio-group>
                </el-form-item>                                                                 
                <el-form-item label="需求描述：" prop="requirementDesc">
                <div class='technicalDesc'>
                    <tinymce-editor 
                        v-model="dataList.requirementDesc" 
                        @getEditorValue="getChildEditor"  
                        @limit='limitNum' >
                    </tinymce-editor>
                </div>
                </el-form-item>               
                <div class="title desc">备注</div>
                <el-form-item label="备注：" prop="remark" >
                    <el-input type="textarea" 
                    v-model="dataList.remark"
                    cols="5"
                    rows="6"
                    maxlength="200" 
                    show-word-limit></el-input>
                </el-form-item>
                <div v-if="id" class="button">
                    <el-button size="medium " v-preventReClick @click="submitForm('requirementForm')" type="primary">保存</el-button>
                    <el-button size="medium " type="primary" @click="preview('requirementForm',1)">预览</el-button> 
                    <el-button size="medium " type="warning" @click="cancle()">取消</el-button>   
                </div>
                <div v-else class="button">
                    <el-button size="medium " v-preventReClick @click="submitForm('requirementForm')" type="primary">提交</el-button>
                    <el-button size="medium " type="warning" @click="preview('requirementForm',2)">预览</el-button>                                    
                </div> 
            </el-form>
        </div>
    </div>
</template>

<script>
import { clearDetail } from "@/util/clearDetail"
import {transmitPrice,receivePrice} from '@/util/price.js';
import {getAreaData} from './requirements.js';
import tinymceEditor from "@/views/project/ip-service/tinymceEditor";
import {checkRequirementName,checkRequirementNameEdit,addRequirement,getDetails,editRequirement} from '@/api/requirement/index';
import {getType,getIndustryList} from '@/api/achievement/create'
import { mapGetters } from 'vuex';
export default {
    components:{ tinymceEditor },
    props:['id','isEditor'],
    data(){        
        var checkChoice = (rule, value, callback) => {
            const reg = /^(?!0\d|[0.]+$)\d+(\.\d{1,2})?$/
            if(this.dataList.priceType){
                return callback();
            }else{
                if (!value && !this.dataList.tradePriceMin) {
                    return callback(new Error('请输入预算'));
                } 
                if(value){
                    if (reg.test(value) && Number(value)>=Number(this.dataList.tradePriceMin)) {
                        callback();                 
                    }else if(!reg.test(value)){
                        callback(new Error('请输入有效金额(大于0且不超过小数点后两位,如:88,88.5)'));
                    }else{
                        callback(new Error('预算上限不能小于预算下限'));
                    }
                }
                if(this.dataList.tradePriceMin){
                    if (reg.test(this.dataList.tradePriceMin)) {
                    callback();
                    } else {
                    callback(new Error('请输入有效金额(大于0且不超过小数点后两位,如:88,88.5)'));
                    }
                } 
            }                                     
        };
        var checkName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入需求名称'));
            }else {                
                if(this.id){
                    checkRequirementNameEdit(value,this.id).then(res=>{
                        if(res.data.code==0){ 
                            callback(); 
                        }else{
                           callback(new Error('此成果名称已存在，请重新输入'));                                                                              
                        } 
                    })
                }else{
                    checkRequirementName(value).then(res=>{
                        if(res.data.code==0){ 
                             callback(); 
                        }else{
                           callback(new Error('此成果名称已存在，请重新输入'));                                                                              
                        } 
                    })
                }
            }                                                                                                         
        };
        return {                           
            dataList:{
                industry:[],
                requirementType:'',
                requirementName:'',
                tradePriceMin:null,
                tradePriceMax:null,                
                area:'',
                requirementDesc:'',
                status:1,
                priceType:false
            },     
            havePrice:false,      
            requirementTypeList:[],
            industryData:[],
            areaList:[],            
            showStatusList:["上架","下架"],            
            rules:{
                requirementName:[
                    {required: true,validator:checkName, trigger: 'blur' },
                    {max: 35, message: '长度小于35个字符', trigger: 'blur' }
                ],           
                requirementType:[
                    { required: true, message: '请选择需求类型', trigger: 'change' }
                ],            
                industry:[
                    { required: true, message: '请选择所属行业', trigger: 'change' }
                ],
                area:[
                    { required: true, message: '请选择所在地', trigger: 'change' }
                ],    
                requirementDesc:[
                    { required: true, message: '请输入需求描述', trigger: 'blur' }
                ],
                tradePriceMax:[{ required: true,validator:checkChoice, trigger: 'blur'}],
                status:[{ required: true, trigger: 'change'}],
            },            
        }
    },
    computed: {
        ...mapGetters(['permissions'])
    },
    mounted(){
        this.getDropData()  
        this.getEditor()  
    },
    watch: {
        'dataList.priceType'(val){
            if(val){
                this.dataList.tradePriceMin=null;
                this.dataList.tradePriceMax=null;
            }
            deep: true
        },             
    }, 
    methods:{
        //下拉框数据
        getDropData(){           
            let requirementType = new FormData();   
            requirementType.append("type","requirementType");
            getType(requirementType).then(res=>{
                this.requirementTypeList=res.data.data
            }).catch(err=>{
                return err;
            });
            getIndustryList('industrytype').then(res=>{                
                this.industryData=res.data.data[0].options
            }).catch(err=>{
                return err;
            });
            // 地区
            getAreaData().then(res=>{
                this.areaList=res
            })
        },
        //编辑回显数据
        getEditor(){
            if(this.id){               
                let param = new FormData();
                param.append('id',this.id);
                getDetails(param).then(res => {                                    
                    this.dataList = res.data.data;  
                    this.dataList.tradePriceMin=this.dataList.tradePriceMin!=null?receivePrice(this.dataList.tradePriceMin,2):null
                    // console.log(this.dataList.tradePriceMin,"price")
                    this.dataList.tradePriceMax=this.dataList.tradePriceMax!=null?receivePrice(this.dataList.tradePriceMax,2):null 
                    this.dataList.priceType=res.data.data.priceType==1?true:false;                                            
                    let industryList=res.data.data.industry.split(',');
                    this.dataList.industry=industryList.map(item=>{
                        return  Number(item)
                    })
                    let areaList=res.data.data.area.split(',');
                    this.dataList.area=areaList.map(item=>{
                        return  Number(item)
                    }) 
                })                              
            }
        },
        //编辑器
        getChildEditor(data) {
            this.dataList.requirementDesc = data;        
        },
        limitNum(val){
            this.limit = val;
        },         
        //表单操作
        submitForm(formName,isPreview) {    //提交                
            this.$refs[formName].validate((valid) => {                
            if (valid) {  
                let params=Object.assign({}, this.dataList )
                params.tradePriceMin=params.tradePriceMin?transmitPrice(params.tradePriceMin,2):null
                params.tradePriceMax=params.tradePriceMax?transmitPrice(params.tradePriceMax,2):null                
                params.industry=params.industry==[]?'':params.industry.join(',');
                params.area=params.area==[]?'':params.area.join(',');  
                params.priceType=params.priceType?1:0;                                            
                if(this.id){
                    params.id=this.id
                    editRequirement(params).then(res=>{
                        if(res.data.code==0){
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                                });
                            clearDetail('/project/technical-requirements/index')       
                            setTimeout(
                                this.$router.push({
                                path:'/project/technical-requirements/index',                                
                            }), 4000)                                
                        }   
                    })
                }else{
                    addRequirement(params).then(res=>{
                        if(res.data.code==0){
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                                });
                            clearDetail('/project/technical-requirements/index')       
                            setTimeout(
                                this.$router.push({
                                path:'/project/technical-requirements/index',                                
                            }), 4000)                                
                        }                    
                    })
                }                                                          
            } else {
                this.$message({
                    message: '信息填写有误，请检查表单',
                    type: 'error',
                    duration:4000,
                    offset:160
                });
                return false;
            }                
                });                     
        },
        cancle(){ //取消
            this.$emit('update:isEditor',false)
        },
        preview(){//预览
            this.$refs.requirementForm.validate(valid=>{
                if(valid){
                    let data=Object.assign({},this.dataList)
                    if(!data.requirementTypeTxt){
                        this.requirementTypeList.forEach(item=>{
                            if(data.requirementType==item.dropdownKey){
                                data.requirementTypeTxt=item.dropdownValue
                            }
                        })
                    }
                    if(!data.industryTxt){
                        let industryTxt=[]
                        this.industryData.forEach(item=>{
                            if(data.industry.includes(item.id)){
                                industryTxt.push(item.name)
                            }
                        })
                        data.industryTxt=industryTxt.join()
                    }
                    sessionStorage.setItem('demandInfo',JSON.stringify(data))
                    window.open('/#/requirement-preview','_blank')   
                }else{
                    this.$message({
                    message: '信息填写有误，请检查表单',
                    type: 'error',
                    duration:4000,
                    offset:160
                });
                }
            })  

        }
    },        
}
</script>

<style scoped>
.requirement{
    width:100%;
    background :#fff;
    margin-left: 10px;
    padding: 20px 0;
}    
.content{
    width :80%;
    margin-left: 5%;
}       
.title{
    padding-left :18px ;
    margin-top: 30px;
    border-left :10px solid #3D85DC;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:bold;   
    color:rgba(51,51,51,1);
}
.desc{
    margin-top: 60px;
    margin-bottom: 50px;
    position:relative;
    left:-30px
}
.requirement-form{
    margin-top:30px;
    margin-left:20px;
} 
.technicalDesc{
    margin-top:30px
}  
.button{
    margin:100px auto;
    width:240px;
    display: flex;
    justify-content: space-around;
}                                                                  
</style>
