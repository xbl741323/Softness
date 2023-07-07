<template>
<!-- 排查完成 -->
    <div :style="{'min-height':(editType?'76vh':'56vh')}">
        <h3 class="basic-title">交易信息</h3>
        <el-form ref="tradeInfoForm" :model="tradeInfo" :rules="tradeInfoRules">
            <el-row class="row" v-if="editType">
                <el-col :span="3" class="row-title"><span class="must-sty" v-if="isOnline || tradeInfo.isOnline===0">*</span><span>是否在线交易</span></el-col>
                <el-col :span="21" class="row-content" >
                    <el-form-item  prop="isOnline">
                        <el-radio-group v-model="tradeInfo.isOnline">
                            <el-radio :label="0">是</el-radio>
                            <el-radio :label="1">否</el-radio>
                        </el-radio-group>
                    </el-form-item>                    
                </el-col>
            </el-row>
            <el-row class="row">
                <el-col :span="3" class="row-title"><span class="must-sty" v-if="isOnline || tradeInfo.isOnline===0">*</span><span>费用类型</span></el-col>
                <el-col :span="21" class="row-content" >
                    <el-form-item  prop="feeType">
                        <el-select v-model="tradeInfo.feeType" style="width:320px" @change="feeTypeChange">
                            <el-option v-for="(item,index) in costTypeList" :key="index" :label="item" :value="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="row">
                <el-col :span="3" class="row-title"><span class="must-sty" v-if="isOnline || tradeInfo.isOnline===0">*</span><span>开票类型</span></el-col>
                <el-col :span="21" class="row-content" >
                    <el-form-item  prop="allBillingType">                    
                        <el-radio-group v-model="tradeInfo.allBillingType">
                            <el-radio  label="0" border size="medium">电子/专用发票</el-radio>
                            <el-radio  label="1" border size="medium">政府收据</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="row" v-if="tradeInfo.feeType!=2">
                <el-col :span="3" class="row-title"><span class="must-sty" v-if="isOnline || tradeInfo.isOnline===0">*</span><span >原单价</span></el-col>
                <el-col :span="21" class="row-content">
                    <el-form-item  prop="previousFee" >  
                        <div class="row-content-flex">
                            <el-input type="number" style="width:320px" v-model="tradeInfo.previousFee" ></el-input>
                            <div class="warning-info">该价格为显示给用户的打折前的价格，不计费</div>                                 
                        </div>                                                                
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="row" :style="{'border-bottom':(tradeInfo.feeType==2?'1px solid #ebeef5':0)}">
                <el-col :span="3" class="row-title"><span class="must-sty" v-if="isOnline || tradeInfo.isOnline===0">*</span><span >现单价</span></el-col>
                <el-col :span="21" style="padding:16px;border-left:1px solid #ebeef5">  
                    <div v-if="tradeInfo.feeType == 1 || isShow" class="row-content-flex">                               
                        <div class="row-content-flex">
                            <span  class="must-sty" v-if="isOnline || tradeInfo.isOnline===0">*</span>
                            <span style="width:70px">代理费用：</span>
                            <el-form-item  prop="agencyFee" >
                                <el-input type="number" style="width:200px"  v-model="tradeInfo.agencyFee" ></el-input>           
                            </el-form-item>                               
                            </div>                                    
                        <div class="row-content-flex">
                            <span class="must-sty" style="margin-left:20px" v-if="isOnline || tradeInfo.isOnline===0">*</span>
                            <span style="width:86px;">第三方费用：</span>
                            <el-form-item  prop="thirdPartyFee"  >
                                <el-input type="number" style="width:200px" v-model="tradeInfo.thirdPartyFee" ></el-input>
                            </el-form-item>                                
                        </div> 
                        <div  class="warning-info">该价格为计费价格，请谨慎填写</div>                                 
                    </div>  
                    <div v-if="tradeInfo.feeType==1 || isShow" style="margin-top:28px;color:#57bc57">合并现单价：{{(Number(tradeInfo.agencyFee)+Number(tradeInfo.thirdPartyFee)).toFixed(2)}}</div>   
                    <el-form-item v-else  prop="nowFee"  >
                        <div style="display:flex">
                        <el-input style="width:320px" type="number" v-model="tradeInfo.nowFee" ></el-input>
                        <div  class="warning-info">该价格为计费价格，请谨慎填写</div>
                        </div>
                    </el-form-item>                   
                </el-col>
            </el-row>
            <el-row v-if="tradeInfo.feeType!=2" class="row" style="border-bottom:1px solid #ebeef5">
                <el-col :span="3" class="row-title"><span class="must-sty" v-if="isOnline || tradeInfo.isOnline===0">*</span><span >是否添加官费</span></el-col>
                <el-col :span="21" class="row-content" >                     
                    <el-form-item  prop="hasPublicExpense" >                          
                        <el-radio-group v-model="tradeInfo.hasPublicExpense">
                            <el-radio :label="0">是</el-radio>
                            <el-radio :label="1">否</el-radio>
                        </el-radio-group>
                        <div v-if="tradeInfo.hasPublicExpense===0">
                            <div  style="display:flex; margin-top:16px;">
                                <div><span class="must-sty" >*</span><span >官费：</span></div>
                                <div>
                                    <div  v-for="(item,index) in tradeInfo.governmentFeeTypeList " :key="index" style="display:flex;margin:0px 0px 18px 14px;align-items:center">
                                        <span>{{index+1}}</span>
                                        <el-form-item :prop="'governmentFeeTypeList.' + index+'.typeName'" :rules="tradeInfoRules.publicExpenseName" style="width:290px;margin-left:10px">
                                            <!-- tradeInfoRules.publicExpenseName -->
                                            <el-input v-model="item.typeName" placeholder="请输入费用名称"  maxlength="10" clearable ></el-input>
                                        </el-form-item>
                                        <el-form-item :prop="'governmentFeeTypeList.' + index+'.typeFee'" :rules="tradeInfoRules.publicExpensePrice" style="width:240px;margin-left:20px" >
                                            <el-input type="number" v-model="item.typeFee" placeholder="请输入金额,最多保留两位小数" clearable ></el-input>
                                        </el-form-item>
                                        <el-radio v-model="defaultGovernmentFee" :label="index" style="margin:10px">设为默认</el-radio>
                                        <div class="minus-icon" v-if="tradeInfo.governmentFeeTypeList.length>1" @click="operateGvernmentFee(0,index)">-</div>                            
                                        <div class="minus-icon" @click="operateGvernmentFee(1,index)">+</div> 
                                    </div>
                                </div>                                                                              
                            </div>  
                            <p class="public-expense-warning">建议：根据价格数额从低到高顺序添加官费</p> 
                            <el-form-item  prop="billingType">   
                                <div><span class="must-sty" >*</span><span >官费开票类型：</span></div>                 
                                <el-radio-group v-model="tradeInfo.billingType" style="margin:10px 60px">
                                    <el-radio  label="0" border size="medium">电子/专用发票</el-radio>
                                    <el-radio  label="1" border size="medium">政府收据</el-radio>
                                </el-radio-group>
                            </el-form-item>  
                        </div>                                                                                                                                
                    </el-form-item>
                </el-col>
            </el-row>           
        </el-form>
        <!-- 按钮区域 -->
        <div v-if="editType" class="btn-confirm">
            <el-button size="medium" type="primary" @click="saveProduct()">{{ $t('button.save') }}</el-button>
            <el-button size="medium" class="cancel-sty" @click="leave()">{{ $t('button.cancel') }}</el-button>
        </div>
    </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange"
import { clearDetail } from "@/util/clearDetail";
import { editTradeInfo } from "@/api/project/ip";
const math = require('mathjs')


export default {
    props:{
        editType:{//是否是编辑详情
            type:Boolean,
        },
        isOnline:{//新建时是否是线上交易
            type:Boolean,
        },
        productInfo:{//编辑时带入的数据

        }
    },

    data(){
        var checkAgencyFee=(rule, value, callback) => {
            if(value){
                if (this.reg.test(value) && Number(value)>0){                        
                    callback();                                     
                }else {
                    callback(new Error('金额应为大于0的数字且不超过小数点后两位'));
                }
            }else{
                if(this.isOnline || this.tradeInfo.isOnline===0){
                    callback(new Error('请输入金额'));
                }else{
                    callback();
                }
            }           
        };
        var mustChoosed=(rule, value, callback) => {
            if(this.isOnline || this.tradeInfo.isOnline===0){
                if (value==null) {
                    return callback(new Error('请选择'));
                }else{
                    return callback();
                }
            }else{
                return callback();
            }
        };
        var checkPrice = (rule, value, callback) => {
            if(value){
                if (this.reg.test(value) && Number(value)>0){                        
                    callback();                                     
                }else {
                    callback(new Error('金额应为大于0的数字且不超过小数点后两位'));
                }
            }else{
                return callback(new Error('价格不能为空'));
            }                                                                
        };
        var checkpreviousFee = (rule, value, callback) => {
            if(value){
                if (this.reg.test(value) && Number(value)>0){   
                    if(this.tradeInfo.feeType==1 ){//第三方+代理费
                        callback();                                     
                    }else{
                        if(!this.isOnline && this.tradeInfo.isOnline!=0 && !this.tradeInfo.nowFee){
                            callback();                                     
                        }else{
                            if(Number(value)>=Number(this.tradeInfo.nowFee)) {
                                callback();                                     
                            }else{
                                callback(new Error('原单价应大于等于现单价'));                                     
                            } 
                        }                         
                    }                                      
                }else {
                    callback(new Error('金额应为大于0的数字且不超过小数点后两位'));
                }
            }else{
                if(this.isOnline || this.tradeInfo.isOnline===0){
                    callback(new Error('请输入金额'));
                }else{
                    callback();
                }
            }                                               
        };
        var checkNewFee = (rule, value, callback) => {
            if(value){
                if (this.reg.test(value) && Number(value)>0){   
                    if(this.tradeInfo.feeType==2){
                        callback();
                    }else{
                        if(!this.isOnline && this.tradeInfo.isOnline!=0 && !this.tradeInfo.previousFee){
                            callback();                                     
                        }else{
                            if(Number(value)<=Number(this.tradeInfo.previousFee)) {
                            callback();                                     
                            }else{
                                callback(new Error('现单价应小于等于原单价'));                                     
                            } 
                        }                          
                    }                                       
                }else {
                    callback(new Error('金额应为大于0的数字且不超过小数点后两位'));
                }
            }else{
                if(this.isOnline || this.tradeInfo.isOnline===0){
                    callback(new Error('请输入金额'));
                }else{
                    callback();
                }
            }                                               
        };
        return{
            tradeInfo:{
                feeType:null,
                allBillingType:null,
                billingType:null,
                previousFee:null,
                nowFee:null,
                isOnline:null,
                hasPublicExpense:null,
                agencyFee:null,
                thirdPartyFee:null,
                governmentFeeTypeList:[
                    {typeName:"",typeFee:null,isDefault:1},
                ]
            },
            isShow:false,
            reg : /^(?!0\d|[0.]+$)\d+(\.\d{1,2})?$/ ,         
            defaultGovernmentFee:0,
            costTypeList:["仅代理费","代理费+第三方费用","仅官费"],
            tradeInfoRules:{
                feeType:[{ validator:mustChoosed, message: "请选择", trigger: "change" }],
                allBillingType:[{ validator:mustChoosed, message: "请选择", trigger: "change" }],
                billingType:[{ required:true, message: "请选择", trigger: "change" }],
                hasPublicExpense:[{ validator:mustChoosed, message: "请选择", trigger: "change" }],
                publicExpenseName:[{required:true,message: "费用名称不能为空", trigger: "blur"}],
                publicExpensePrice:[{validator:checkPrice,trigger: "blur"}],
                previousFee:[{validator:checkpreviousFee,trigger: "blur"}],
                nowFee:[{validator:checkNewFee,trigger: "blur"}],
                agencyFee:[{validator:checkAgencyFee,trigger: "blur"}],
                thirdPartyFee:[{validator:checkAgencyFee,trigger: "blur"}],                
            },
            
        }
    },
    methods:{
        feeTypeChange(val){
            this.isShow=false
        },
        operateGvernmentFee(type,index){//type:0-减；1-加
            if(type==1){
                if(this.tradeInfo.governmentFeeTypeList.length>4){
                    this.$message.error('最多只能添加5个官费')
                }else{
                    this.tradeInfo.governmentFeeTypeList.splice(index+1,0,{typeName:"",typeFee:null,isDefault:1})
                }
            }else{
                this.tradeInfo.governmentFeeTypeList.splice(index,1)
            }
            if(!this.tradeInfo.governmentFeeTypeList.some(item=> item.isDefault==0)) this.defaultGovernmentFee=0;
        },
        leave() {
			clearDetail("/project/ip-service/index")
            this.$router.push("/project/ip-service/index");
            this.$emit("close-dialog")
         },
        saveProduct() {
            this.$refs["tradeInfoForm"].validate((val) => {
                if(val){
                    let params={}
                    let tradeInfo=Object.assign({},this.tradeInfo);  
                    console.log(tradeInfo,"sss")
                    console.log(tradeInfo,"tradeInfo")    
                    params.number=this.productInfo.number;
                    params.id=this.productInfo.id; 
                    params.isOnline=this.tradeInfo.isOnline;
                    params.hasPublicExpense=tradeInfo.hasPublicExpense;
                    params.feeType=tradeInfo.feeType;
                    params.allBillingType=tradeInfo.allBillingType;   
                    params.previousFee= !tradeInfo.previousFee?null:Number(math.format(tradeInfo.previousFee*100,12));//因为非必填 
                    params.nowFee=!tradeInfo.nowFee?null:Number(math.format(tradeInfo.nowFee*100,12))
                    if(tradeInfo.feeType==2){//费用类型改变，注意清空之前的选择
                        params.previousFee=null;
                        params.thirdPartyFee=null;
                        params.agencyFee=null;
                        params.governmentFee=!tradeInfo.nowFee?null:Number(math.format(tradeInfo.nowFee*100,12)) 
                    }else if(tradeInfo.feeType==1){
                        params.thirdPartyFee=!tradeInfo.thirdPartyFee?null:Number(math.format(tradeInfo.thirdPartyFee*100,12)) ;
                        params.agencyFee=!tradeInfo.agencyFee?null:Number(math.format(tradeInfo.agencyFee*100,12)) ;
                        params.nowFee=(tradeInfo.thirdPartyFee || tradeInfo.agencyFee)?Number(math.format(tradeInfo.agencyFee*100,12))+Number(math.format(tradeInfo.thirdPartyFee*100,12)):null;
                        params.governmentFee=null
                    }else if(tradeInfo.feeType===0){
                        params.thirdPartyFee=null;
                        params.governmentFee=null
                        params.agencyFee=!tradeInfo.nowFee?null:Number(math.format(tradeInfo.nowFee*100,12));
                    }else{
                        params.thirdPartyFee=null;
                        params.agencyFee=null;
                        params.governmentFee=null;                       
                    }                     
                    params.governmentFeeTypeList=[];
                    params.billingType=null;
                    if(tradeInfo.feeType!=2 && tradeInfo.hasPublicExpense===0){//是否选择官费
                        tradeInfo.governmentFeeTypeList.forEach((item,index)=>{
                            console.log(item,"item")
                            params.governmentFeeTypeList.push({typeFee:Number(math.format(item.typeFee*100,12)),typeName:item.typeName,isDefault:1})
                            if(this.defaultGovernmentFee==index){
                                params.governmentFeeTypeList[index].isDefault=0;
                            }
                        })
                        console.log(params.governmentFeeTypeList,"params.governmentFeeTypeList")
                        params.billingType=tradeInfo.billingType;
                    }                                      
                    editTradeInfo(params).then((res) => {
                        if (res.data.code == CodeMsg.CODE_0) {
                            this.$message({
                                type: "success",
                                message: this.$t("button.modifySuccess"),
                                offset: 300,
                                    });
                            this.$emit("refresh")
                        } else {
                            this.$message({
                                type: "warning",
                                message: res.data.data,
                                offset: 300,
                            });
                        }
                    });                    
                }                       
            })
        }             
    },
    mounted(){
        if(this.editType){
            console.log(this.productInfo,"tradeInfo")
            this.tradeInfo={
                feeType:this.productInfo.feeType,
                allBillingType:this.productInfo.allBillingType===null?null:this.productInfo.allBillingType.toString(),
                billingType:this.productInfo.billingType===null?null:this.productInfo.billingType.toString(),
                previousFee:this.productInfo.previousFee===null?null:(Number(this.productInfo.previousFee))/100,
                nowFee:this.productInfo.nowFee===null?null:Number(this.productInfo.nowFee)/100,
                isOnline:this.productInfo.isOnline,
                hasPublicExpense:this.productInfo.hasPublicExpense,
                agencyFee:this.productInfo.agencyFee===null?null:Number(this.productInfo.agencyFee)/100,
                thirdPartyFee:this.productInfo.thirdPartyFee===null?null:Number(this.productInfo.thirdPartyFee)/100,
                governmentFeeTypeList:this.productInfo.governmentFeeTypeList
            };
            if((this.productInfo.agencyFee || this.productInfo.thirdPartyFee)&&this.productInfo.feeType==1) this.isShow=true
            this.tradeInfo.governmentFeeTypeList=[];
            if(!this.productInfo.governmentFeeTypeList || this.productInfo.governmentFeeTypeList.length==0){              
                this.tradeInfo.governmentFeeTypeList.push({typeName:"",typeFee:null,isDefault:1});
            }else{
                this.productInfo.governmentFeeTypeList.forEach((item,index)=>{
                    this.tradeInfo.governmentFeeTypeList.push({typeName:item.typeName,typeFee:Number(item.typeFee)/100,isDefault:item.isDefault});
                    // item.typeFee= Number(item.typeFee)/100;
                    if(item.isDefault==0){
                        this.defaultGovernmentFee=index;
                    }
                })
            } 
        }
    }
}
</script>


<style scoped>
.row{
    border:1px solid #ebeef5;
    border-bottom:0;
    color:#2c3e50;
    font-size:14px;
}
.row >>>.el-col-3 {
    width: 12.5%;
    height:100%;
}
.row >>>.el-col {
    margin-bottom: 0px;
    min-height: 65px;
}
.row-title{
    display: flex;
    justify-content: flex-end;
    align-items:center;
    font-weight:700;
    padding-right:10px
}
.row-content{
    display: flex;
    align-items:center;
    padding:16px;
    border-left:1px solid #ebeef5
}
.row-content-flex{
    display: flex;
    align-items:center
}
/* .row >>>.el-form-item__error {
    padding-left:16px;
    padding-top:4px;
} */
.row >>>.el-form-item--mini.el-form-item, .row >>>.el-form-item--small.el-form-item {
    margin-bottom:0px;
}
.warning-info{
    color:#FF9508;
    width:300px;
    margin-left:20px
}
.basic-title {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  font-size: 16px;
}
.must-sty {
  color: red;
}
.minus-icon{
    width:25px;
    height:25px;
    background:#409eff;
    margin-left:12px;
    border-radius: 4px;
    line-height: 25px;
    text-align: center;
    color:#fff;
    font-weight:bold;
    font-size:16px;
    cursor: pointer;
}
 .btn-confirm {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}
.cancel-sty {
  margin-left: 40px;
  width: 84px;
} 
.public-expense-warning{
    color:#aaa;
    margin-left:60px
}
.row >>> input::-webkit-outer-spin-button,.row >>> input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
.row >>> input[type="number"]{
    -moz-appearance: textfield;
}

</style>