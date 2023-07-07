<template>
    <div class="sum_sty_main">
        <el-table :summary-method="getSummaries"  show-summary v-if="invoicingInfo.type==1" :data="invoicingInfo.invoicingList"   border style="width:90%;margin-bottom:20px">
            <el-table-column label="回款时间" prop="receiveTime" align="center"></el-table-column>
            <el-table-column label="回款编号" prop="receiveNo" align="center"></el-table-column>
            <el-table-column label="可开票回款金额(元)" align="center">
                <template slot-scope="scope">
                    <span >{{(scope.row.receiveAmount/100).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="费用类型"  align="center">
                <template slot-scope="scope">
                    <span >{{scope.row.amountType | amountType}}</span>
                </template>
            </el-table-column>  
            <el-table-column label="操作"  align="center">
                 <template slot-scope="scope">
                    <span @click="deleteRow(scope.row)" class="delButton">移除</span>
                </template>
            </el-table-column>
        </el-table>
        <el-form :model="invoicingForm" :rules="rules" ref="invoicingForm" label-width="100px" class="demo-ruleForm">
            <div v-if="invoicingInfo.type==0" style="margin-bottom:20px">
                <span>可开票金额： </span><span style="font-size:16px;font-weight:bold;color:#333;margin-right:60px">{{(invoicingInfo.invoiceAmount/100).toFixed(2)}}元</span>
                <span>费用类型：<span>{{invoicingInfo.amountType | amountType}}</span></span>
            </div>
            <el-form-item label="发票抬头："  v-if="invoicingInfo.customerType==0" prop="invoicingHeader">
                <el-radio-group @change="handleChange"  v-model="invoicingForm.invoicingHeader">
                    <el-radio :label="0" >个人</el-radio>
                    <el-radio :label="1">单位</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="票据类型：" prop="invoicingType">
                <el-radio-group  v-model="invoicingForm.invoicingType">
                    <el-radio :label="0" v-if="invoicingInfo.customerType==1 ||invoicingForm.invoicingHeader!=0">增值税专用发票</el-radio>
                    <el-radio :label="1">增值税普通发票</el-radio>
                    <el-radio :label="2">政府收据</el-radio>
                </el-radio-group>               
            </el-form-item>
            <el-form-item v-if="invoicingInfo.customerType==1" label="单位名称：" >
                <div>{{invoicingInfo.customerName}}</div> 
                <div style="color:#bbb">如需修改，请去我的线索中修改线索名称</div>            
            </el-form-item>
            <el-form-item v-if="invoicingInfo.customerType==0 && invoicingForm.invoicingHeader==0" label="个人姓名：" >
                <div>{{invoicingInfo.customerName}}</div> 
                <div style="color:#bbb">如需修改，请去我的线索中修改线索名称</div>            
            </el-form-item>
            <el-form-item v-if="invoicingInfo.customerType==0 && invoicingForm.invoicingHeader==1" label="单位名称：" prop="corporateName" >
               <el-input placeholder="请输入内容" maxlength=50  v-model="invoicingForm.corporateName"  clearable></el-input>            
            </el-form-item>
            <div v-if="invoicingInfo.customerType==1 || invoicingForm.invoicingHeader!=0">
                <el-form-item label="发票税号：" prop="taxNumber" style="margin-bottom:20px">
                    <div v-if="invoicingInfo.customerType==1">
                        <span v-if="invoicingForm.taxNumber">{{invoicingForm.taxNumber}}</span>    
                        <el-input v-else placeholder="当前客户信息信用代码缺失，请补全后再申请开票" disabled></el-input>  
                    </div>          
                    <el-input v-else placeholder="请输入内容" maxlength=50  v-model="invoicingForm.taxNumber"  clearable></el-input>            
                </el-form-item>
                <div class="form-item">
                    <span class="required" v-if="invoicingForm.invoicingType===0">*</span>&nbsp;                    
                    <el-form-item class="item-label"  label="注册地址：" prop="address" >
                        <el-input placeholder="请输入内容" maxlength=50  v-model="invoicingForm.address"  clearable></el-input>            
                    </el-form-item>
                </div>
                <div class="form-item">
                    <span class="required" v-if="invoicingForm.invoicingType===0">*</span>&nbsp;                    
                    <el-form-item class="item-label" label="注册电话：" prop="telNumber" >
                        <el-input placeholder="请输入内容" maxlength=50  v-model="invoicingForm.telNumber"  clearable></el-input>            
                    </el-form-item>
                </div>
                <div class="form-item">
                    <span class="required" v-if="invoicingForm.invoicingType===0">*</span>&nbsp;                    
                    <el-form-item class="item-label" label="开户银行：" prop="bankName" >
                        <el-input placeholder="请输入内容" maxlength=50  v-model="invoicingForm.bankName"  clearable></el-input>            
                    </el-form-item>
                </div>
                <div class="form-item">
                    <span class="required" v-if="invoicingForm.invoicingType===0">*</span>&nbsp;                    
                    <el-form-item class="item-label" label="银行账号：" prop="bankNumber" >
                        <el-input placeholder="请输入内容" type="number" maxlength=50  v-model="invoicingForm.bankNumber"  clearable></el-input>            
                    </el-form-item>
                </div>                                                                                       
            </div>
            <el-form-item label="开票备注：" prop="remark" >
                <el-input  type="textarea"  :rows="5"  v-model="invoicingForm.remark"  maxlength="100"  show-word-limit />
            </el-form-item>
            <el-form-item label="审批人员：" prop="auditor" >
                <div v-if="auditorList.length==1">{{auditorList[0].name}}</div>
                <el-select v-else-if="auditorList.length>1" v-model="invoicingForm.auditor" placeholder="请选择">
                    <el-option
                    v-for="item in auditorList"
                    :key="item.userId"
                    :label="item.name"
                    :value="item.userId">
                     <span>{{item.name}}</span>
                     <img v-if="item.lockFlag && item.lockFlag ==9" src="/img/disable.png" class="disableman" alt="" />
                    </el-option>
                </el-select>
                <el-cascader  v-else :show-all-levels='false' 
                    :props="{ value: 'customerId', label: 'label'}" 
                    :options="empList"
                    filterable 
                    v-model="invoicingForm.auditor" 
                    placeholder="请选择" 
                    lang="审批人"
                    >
                   <template slot-scope="{ node,data }">
                    <span>{{ data.label }}</span>
                    <span v-if="node.isLeaf && data.lockFlag && data.lockFlag ==9" ><img src="/img/disable.png" class="disablemancal" alt="" /></span>
                  </template>
                </el-cascader>
            </el-form-item>
        </el-form>
        <div class="form-button">
            <el-button size="medium " type="primary" @click="submitForm('invoicingForm')">提交申请</el-button>
            <el-button size="medium " style="margin-left:60px" @click="resetForm('invoicingForm')">取消</el-button>
        </div>
    </div>
</template>
<script>
import * as CodeMsg from "@/api/common/CodeChange"
import {getAuditors,applyInvoice,applyPersonalInvoice} from "@/api/invoicing/invoicing";
import { getEmpList} from '@/api/clue/clue'

export default {
    props:{
        invoicingInfo:{
            type: Object,
        },
        source:{
            type:String,
        }
    },

    data() {
        var validateAddress = (rule, value, callback) => {
            if(this.invoicingForm.invoicingType!=0){               
                callback();                
            }else{
                if(!value){
                    callback(new Error('请输入相关信息(50字以内)'));
                }else{
                    callback();
                }
            }
        };
        var validateTaxNumber = (rule, value, callback) => {
            if(!value){               
                return callback(new Error('请输入相关信息(50字以内)'));                
            }else{
                let reg=/^[0-9a-zA-Z]+$/;
                if(reg.test(value)){
                    return callback();
                }else{
                    return callback(new Error('税号格式不正确(由字母或数字组成)'));
                }
            }
        };
        var validateTel= (rule, value, callback) => {
            var str="0123456789-+";
            if(value.trim()){
                let passabled=true;
                for(var item of value.trim()){
                    if(str.indexOf(item)==-1){
                        passabled=false;
                    }
                }
                if(passabled){
                    callback();
                }else{
                    callback("请输入一个正确格式的号码");
                }
            }else{
                if(this.invoicingForm.invoicingType!=0){
                    callback();
                }else{
                    callback("请输入相关信息(50字以内)");
                }
            }
        };
      return {
        // List:[],
        invoicingForm: {
          invoicingHeader:0,
          invoicingType:null,
          taxNumber:'',
          address:"",
          bankName:"",
          telNumber:"",
          bankNumber:"",
          remark:"",
          auditor:"",
          corporateName:"",
        },
        empList:[],
        auditorList:[],
        receiveAmountTotal:0,//合并回款总额
        rules: {
            invoicingHeader: [
                { required: true, message: '请选择发票抬头', trigger: 'change' }
            ],
            invoicingType: [
                { required: true, message: '请选择票据类型', trigger: 'change' }
            ],
            taxNumber: [
                { validator: validateTaxNumber, trigger: 'blur' },
                { required: true, message: '请输入相关信息(50字以内)', trigger: 'blur' },
            ],
            address: [
                { validator: validateAddress, trigger: 'blur' },
            ],
            bankName: [
                { validator: validateAddress, trigger: 'blur' },
            ],
            corporateName: [
                { required: true, message: '请输入相关信息(50字以内)', trigger: 'blur' },
                {  max:50, message: '50个字符以内', trigger: 'blur' }
            ],
            telNumber: [
                { validator: validateTel, trigger: 'blur' },
            ],
            bankNumber: [
                { validator: validateAddress, trigger: 'blur' },
            ],
            auditor: [
                { required: true, message: '请选择审批人员', trigger: 'change' }
            ],
        }
      };
    },

    filters:{
        amountType(value){
            return value == 0 ? '代理费' : value == 1 ? '第三方费用' : value == 2 ? '官费' : '';
        },
    },

    methods: {
        deleteRow(row){
            console.log(row,"row")
            for(let index=0;index<this.invoicingInfo.invoicingList.length;index++){
                if(this.invoicingInfo.invoicingList[index].receiveNo==row.receiveNo){
                    this.invoicingInfo.invoicingList.splice(index,1);
                    break;
                }
            }
            console.log(this.invoicingInfo.invoicingList,"insd")
            this.getAmountTotal();
            console.log(this.receiveAmountTotal)
            this.$forceUpdate();
        },
        getSummaries({ columns, data }) {    
            console.log(data,"data111")
            const sums = [];           
            sums[0] = '合计开票金额';
            sums[2] =(this.receiveAmountTotal/100).toFixed(2);   
            return sums;            
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                let params={
                    orderNo:this.invoicingInfo.orderNo,
                    contractNo:this.invoicingInfo.contractNo,
                    amountType:this.invoicingInfo.amountType,
                    personalName:this.invoicingInfo.customerName,
                    billType:this.invoicingForm.invoicingType,
                    headerType:this.invoicingForm.invoicingHeader,
                    corporateName:this.invoicingForm.corporateName,
                    remark:this.invoicingForm.remark,
                }

                if(this.invoicingInfo.clueId) params.clueId=this.invoicingInfo.clueId; 
                if(this.invoicingInfo.type==1){//合并开票
                    if(this.receiveAmountTotal==0){
                        this.$message.warning("暂无可开票金额，请返回重新选择")
                    }else{
                         params.invoiceAmount=this.receiveAmountTotal;
                        params.receiveList=[]; 
                        let receiveLists=[]; //贱
                        this.invoicingInfo.invoicingList.forEach(item=>{
                            params.receiveList.push({receiveNo:item.receiveNo});
                            receiveLists.push(item.receiveNo)
                        })  
                        params.receiveLists=receiveLists.join(',')
                    }                   
                }else{//单个开票
                    params.invoiceAmount=this.invoicingInfo.invoiceAmount; 
                    params.receiveList=[{receiveNo:this.invoicingInfo.receiveNo}]                            
                    params.receiveLists=this.invoicingInfo.receiveNo;                            
                } 
                if(this.empList.length>0){//审核人
                    params.taskCurrentEmpId=this.invoicingForm.auditor[1]
                }else{
                    params.taskCurrentEmpId=this.invoicingForm.auditor
                }  
                //发票抬头个人无此些信息           
                let inputObj={
                    invoiceAddress:this.invoicingForm.address,
                    invoiceBank:this.invoicingForm.bankName,
                    invoiceNumber:this.invoicingForm.bankNumber,
                    invoicePhone: this.invoicingForm.telNumber,
                    invoiceTaxNo: this.invoicingForm.taxNumber,
                }                   
                if(this.invoicingInfo.customerType==1) params.headerType="";
                if(this.invoicingInfo.customerType==1 || this.invoicingForm.invoicingHeader!=0){
                    console.log("invoice")
                    params=Object.assign(params,inputObj);
                }
                if(this.source != 'personal'){
                    applyInvoice(params).then(res=>{
                        if(res.data.code == CodeMsg.CODE_0){
                            this.$message({
                                message: '申请开票成功！',
                                type: 'success',
                                offset:300
                            });
                            this.$refs[formName].resetFields();
                            this.$emit('closeRefundDialog',false);                       
                        }
                    })
                }else{
                    applyPersonalInvoice(params).then(res=>{
                        if(res.data.code == CodeMsg.CODE_0){
                            this.$message({
                                message: '申请开票成功！',
                                type: 'success',
                                offset:300
                            });
                            this.$refs[formName].resetFields();
                            this.$emit('closeRefundDialog',false);                       
                        }
                    })
                }
                
            }else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        resetForm(formName) {
            this.$confirm('确认取消开票申请吗？','取消',{
                type: 'warning',
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                cancelButtonClass: "btn-custom-cancel"
            }).then(()=>{
                this.$refs[formName].resetFields();
                this.$emit('closeRefundDialog',false);                
            })
        },
        handleChange(){
            this.invoicingForm.invoicingType="";
            console.log(this.invoicingForm.invoicingType,"invoicingType")
        },
        getDropData(){
            getAuditors().then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                    this.auditorList=res.data.data;
                    console.log(this.auditorList,"auditorList")
                    if(this.auditorList.length==0){
                        getEmpList(true).then(res=>{//员工
                            this.empList = res.data.data;
                         }).catch(err=>{
                            return false;
                        });
                    }else if(this.auditorList.length==1){
                        this.invoicingForm.auditor=this.auditorList[0].userId;
                    }
                }
            })
        },
        getAmountTotal(){
            this.receiveAmountTotal=0;
            this.invoicingInfo.invoicingList.forEach(item => {
                this.receiveAmountTotal+=(item.receiveAmount-item.refundAmount);
                // console.log(this.receiveAmountTotal,item.receiveAmount,"receiveAmountTotal")
            })
        },
    },
    created(){
        if(this.invoicingInfo.type==1){//合并开票总额计算
            this.getAmountTotal();
        }
    },
    mounted(){
        this.getDropData()
        console.log(this.invoicingInfo,"invoicingInfo");
        if(this.invoicingInfo.invoice){//线索中带入的开票信息
            let data=this.invoicingInfo.invoice
            this.invoicingForm.corporateName=data.invoiceOrgName?data.invoiceOrgName:"";
            this.invoicingForm.taxNumber=data.invoiceTaxNo?data.invoiceTaxNo:"";
            this.invoicingForm.address=data.invoiceAddress?data.invoiceAddress:"";
            this.invoicingForm.telNumber=data.invoicePhone?data.invoicePhone:"";
            this.invoicingForm.bankName=data.invoiceBank?data.invoiceBank:"";
            this.invoicingForm.bankNumber=data.invoiceNumber?data.invoiceNumber:"";
        }     
    }
  }
</script>

<style scoped>
.demo-ruleForm{
    width:90%;
}
.delButton{
    cursor: pointer;
    color:#409EFF
}
.form-button{
    width:100%;
    margin-top:80px;
    margin-bottom:40px;
    display: flex;
    justify-content: center;
}
.required{
    color:red;
    opacity: .9;
    margin-left:8px;
}
.item-label{
    position:absolute;   
    top:-8px;
}
.form-item{
    position:relative;
    width:584px;
    height:32px;
    margin:12px 0;
}
.disableman{
    width: 15px;
    height: 15px;
    position: relative;
    top: 3px;
    left: -10px;
}
.disablemancal{
    width: 15px;
    height: 15px;
    position: relative;
    top: 3px;
    left: 5px;
}
</style>
<style >
.sum_sty_main .el-input__inner {
    width:584px;
}
.sum_sty_main   input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"]{
        -moz-appearance: textfield;
    }
</style>