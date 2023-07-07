<template>
    <div style="font-size:14px;color:#333">
        <!-- 流程信息 -->
        <div class="block">
            <div class="title">
                <span v-for="(item,index) in processList" :key="index">{{item.title}}<span class="title-item">{{item.desc}}</span></span>
            </div>
            <div class="process-detail">
                <div  v-for="(item,index) in processData" :key="index" >
                    <p >{{item.title}}</p>
                    <div style="display:flex;align-items:center" class="item-desc" v-if="index==0">
                        <div v-if="item.desc==0" class="circle"></div>
                        <div v-if="item.desc==1" class="circle circle-green"></div>
                        <div v-if="item.desc==2" class="circle circle-red"></div>
                        <div v-if="item.desc==6" style="color:red;margin-right:4px;font-weight:600">X</div>
                        <span>{{item.desc | filtertaskStatus}}</span> 
                    </div>
                    <div class="item-desc" v-if="index==1">{{item.desc | filterPrice}} </div>
                    <div class="item-desc" v-if="index==2">{{item.desc | filterAmount}} </div>
                    <div class="item-desc" v-if="index==3">
                        <span v-if="item.desc==2">无退款</span>
                        <div v-else>有退款<img v-if="item.desc==0" class="icon" src="@/assets/iconfonts/circle.svg" /></div>
                    </div>
                </div>
            </div>
            <div   class="invoicing-table">
                <el-table  :data="tableData" style="width: 100%" tooltip-effect="dark">
                    <el-table-column prop="receiveNo"   label="回款编号"  >      </el-table-column>
                    <el-table-column  label="可开票金额" >    
                        <template slot-scope="scope">
                            <span>{{scope.row.receiveAmount | filterPrice}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="payerName" label="付款方名称" show-overflow-tooltip>      </el-table-column>
                    <el-table-column prop="customerName" label="客户名称" show-overflow-tooltip>      </el-table-column>
                </el-table>
            </div>            
        </div>
        <!-- 开票信息 -->
        <div class="block">
            <div class="title">开票信息</div>
            <div class="process-detail" v-if="headerType===0">
                <div  v-for="(item,index) in invoicingPersonalInfo " :key="index" >
                    <p>{{item.title}}</p>
                    <div class="item-desc" v-if="index==0">{{item.desc | fiterbillType}}</div>
                    <div class="item-desc" v-else>{{item.desc}}</div>
                </div>
            </div>
            <div v-else class="process-detail" >
                <div  v-for="(item,index) in invoicingUintInfo" :key="index" >
                    <p>{{item.title}}</p>
                    <div class="item-desc" v-if="index==0">{{item.desc | fiterbillType}}</div>
                    <div class="item-desc" v-else>{{item.desc}}</div>
                </div>
            </div>
            <!-- 已通过的票据信息 -->
            <div class="process-detail" v-if="taskStatus==1 || (taskStatus==6 && hasPassed)">
                <div  v-for="(item,index) in invoicingPassedInfo" :key="index" >
                    <p>{{item.title}}</p>
                    <div :class="['item-desc',index==2?'has-link':'']"  v-if="index==3">
                        <div v-if="item.expressCompany">{{item.expressCompany}}</div>
                        <div v-if="item.expressNumber">{{item.expressNumber}}</div>
                    </div>
                    <div :class="['item-desc',index==2?'has-link':'']" @click="toInvoicing(item.invoiceUrl)" v-else>{{item.desc}}</div>
                </div>
            </div>
        </div>
        <!-- 审批意见 -->
        <div class="block">
            <div class="title">审批意见</div>
            <div class="audit-opinion" v-if="taskStatus==0">待审核</div>
            <div class="audit-opinion" v-else>
                <div style="margin-bottom:10px" v-if="invoiceProcessInfo.auditNote">{{invoiceProcessInfo.auditNote}}</div>
                <div>
                    <span  style="margin-right:26px">{{invoiceProcessInfo.gmtCreate}}</span>
                    <el-tooltip effect="dark" :content="'工号：'+invoiceProcessInfo.operatorNo +'   部门：'+invoiceProcessInfo.operatorDept" placement="top">
                        <span>{{invoiceProcessInfo.operatorName}}</span>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <!-- 重新开票按钮 -->
        <div style="width:100%;display:flex;justify-content:center;margin-bottom:20px" v-if="taskStatus==2">
          <el-button @click="applyInvoicing()"  type="primary">重新申请开票</el-button>
        </div>
    </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange"
import {getInvoicingDetail} from "@/api/invoicing/invoicing"

export default {
    props:["receiveNo","source","row"],
    data(){
        return{
            imgURL:process.env.NODE_ENV === "production"?"//static.wotao.com/":"//static-tst.wotao.com/",
            processList:[{title:"流程编号："},{title:"申请时间："},{title:"申请人："},],
            processData:[{title:"审核状态"},{title:"合计开票金额"},{title:"费用类型"},{title:"退款状态"}],
            tableData:[],
            taskStatus:"",//审核状态
            hasPassed:false,
            headerType:null,
            operatorName:"",
            gmtCreate:"",
            isRefund:"",
            invoiceUrl:"",//发票文件地址
            invoiceProcessInfo:{},
            invoicingPersonalInfo:[{title:"票据类型"},{title:"发票抬头"},{title:"个人姓名"},{title:"开票备注"}],
            invoicingUintInfo:[{title:"票据类型"},{title:"单位名称"},{title:"发票税号"},{title:"注册地址"},{title:"注册电话"},{title:"开户银行"},{title:"银行账号"},{title:"开票备注"}],
            invoicingPassedInfo:[{title:"发票代码"},{title:"发票号码"},{title:"发票文件"},{title:"快递信息"}],
        }
    },
    filters: {
        filtertaskStatus(val) {
            if (val == "0") {
                return "待审核";
            } else if (val == "1") {
                return "已通过";
            } else if (val == "2") {
                return "未通过";
            } else if(val=="6"){
                return "已作废";
            }
        },
        filterPrice(val) {
            if (val) {
                return (val / 100).toFixed(2);
            } else {
                return "待定";
            }
        },
        filterAmount(val) {
            if (val == "0") {
                return "代理费";
            } else if (val == "1") {
                return "第三方费用";
            } else if (val == "2") {
                return "官费";
            }
        },
        filterauditStatus(val) {
            if (val == "0") {
                return "提交审核";
            } else if (val == "1") {
                return "审核通过";
            } else if (val == "2") {
                return "审核不通过";
            } else {
                return "撤销申请";
            }
        },
        fiterbillType(val){
            if(val==0){
                return '增值税专用发票'
            }else if(val==1){
                return '增值税普通发票'
            }else{
                return '政府收据'
            }
        },
        filterType(val) {
            if (val == 0) {
                return "个人";
            } else {
                return "单位";
            }
        },
        filterrefundStatus(val){
            if(val==2){
                return '未通过'
            }else if(val==5){
                return  '已撤销'
            }
        }
    },
    methods:{
        applyInvoicing(){
            if(this.row.refundStatus==0){//refundStatus:是否正在退款流程中
                this.$message({
                    message: '您有退款申请流程正在进行中，请退款完成后再申请开票',
                    type: 'info',
                    offset:300
                });  
            }else{
                this.$emit("applyInvoicing",this.row)
            }
        },
        toInvoicing(url){
            if(url){
                window.open(this.imgURL+url,"_blank")
            }
        },
        getInvoicingDetail(){
            getInvoicingDetail(this.receiveNo).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                    console.log(res.data.data,"data")
                    let data=res.data.data;
                    this.processList[0].desc=data.taskNo;
                    this.processList[1].desc=data.gmtCreate;
                    this.processList[2].desc=data.taskNo;
                    this.processData[0].desc=data.taskStatus;
                    this.taskStatus=data.taskStatus;
                    this.processData[1].desc=data.invoiceAmount;
                    this.processData[2].desc=data.amountType;
                    this.processData[3].desc=data.isRefund;

                    this.tableData=data.receiveList;
                    this.headerType=data.headerType;
                    this.invoiceProcessInfo=data.invoiceProcessList.length>0?data.invoiceProcessList[0]:{};
                   
                    if(data.headerType===0){
                        this.invoicingPersonalInfo[0].desc=data.billType;
                        this.invoicingPersonalInfo[1].desc="个人";
                        this.invoicingPersonalInfo[2].desc=data.personalName;
                        this.invoicingPersonalInfo[3].desc=data.remark?data.remark:"未填写";
                    }else{
                        this.invoicingUintInfo[0].desc=data.billType;
                        this.invoicingUintInfo[1].desc=data.corporateName?data.corporateName:data.personalName;
                        this.invoicingUintInfo[2].desc=data.invoiceTaxNo;
                        this.invoicingUintInfo[3].desc=data.invoiceAddress?data.invoiceAddress:"未填写";
                        this.invoicingUintInfo[4].desc=data.invoicePhone?data.invoicePhone:"未填写";
                        this.invoicingUintInfo[5].desc=data.invoiceBank?data.invoiceBank:"未填写";
                        this.invoicingUintInfo[6].desc=data.invoiceNumber?data.invoiceNumber:"未填写";
                        this.invoicingUintInfo[7].desc=data.remark?data.remark:"未填写";
                    } 
                    if(data.invoiceUrl)  this.hasPassed=true;
                    this.invoicingPassedInfo[0].desc=data.invoiceCode?data.invoiceCode:"未填写" ;                                                          
                    this.invoicingPassedInfo[1].desc=data.number?data.number:"未填写" ;                                                          
                    this.invoicingPassedInfo[2].desc=data.invoiceUrlName?data.invoiceUrlName:"" ;                                                          
                    this.invoicingPassedInfo[2].invoiceUrl=data.invoiceUrl?data.invoiceUrl:"" ;                                                          
                    this.invoicingPassedInfo[3].expressNumber=data.expressCompany?data.expressCompany:"未填写" ; 
                    this.invoicingPassedInfo[3].expressNumber=data.expressNumber?data.expressNumber:"未填写" ; 
                    console.log(this.processData,"data")
                    this.$forceUpdate()
                }
            })
        }
    },
    mounted(){
        console.log(this.row,"row")
        this.getInvoicingDetail()
    },
}
</script>

<style scoped>
.block{
    margin-bottom:20px;
}
.title{
    background:#f2f2f2;
    width:100%;
    height:42px;
    font-weight: 600;
    line-height:42px  ;
    padding-left:10px
}
.title-item{
    color:#606266;
    margin-right:30px;
    font-weight:normal; 
}
.item-desc{
    color:#606266;
    width: 100%;
    margin-top:6px;
    margin-bottom:12px;
    font-weight:normal; 
    overflow:hidden;   
    text-overflow:ellipsis;  
    display:-webkit-box;   
    -webkit-box-orient:vertical;  
    -webkit-line-clamp:2;  
}
.has-link{
    cursor: pointer;
    color:#128EE9
}
.process-detail{
    padding-left:16px;
    font-weight: 600;
    display:grid;
    grid-template-columns: repeat(4,1fr);
	grid-column-gap: 16px;
	/* grid-row-gap: 16px; */
}
.audit-opinion{
    margin:12px 0 58px 16px;
}
.icon {
  position: relative;
  top: 2px;
  margin-left: 5px;
  width: 14px;
}
.invoicing-table{
    padding-left:6px;
    font-size:14px
}
.circle{
    width:7px;
    height: 7px;
    margin-right:4px;
    border-radius: 50%;
    background:#128EE9;
}
.circle-green{
    background:#0c9;
}
.circle-red{
    background:red;
}

</style>
<style >
 .invoicing-table .el-table td,.invoicing-table .el-table th.is-leaf {
    border-bottom: 0;
}
.invoicing-table .el-table--border::after,.invoicing-table .el-table--group::after,.invoicing-table .el-table::before {  
    background-color: #fff;
}
.invoicing-table .el-table--mini,.invoicing-table .el-table--small,.invoicing-table .el-table__expand-icon {
    font-size: 14px;
}
.invoicing-table .el-table thead {
    color: #333;
    font-weight: 400 !important;
}
</style>
