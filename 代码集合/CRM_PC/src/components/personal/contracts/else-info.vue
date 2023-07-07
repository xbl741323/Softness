<template>
    <div class="order_main">
        <div class="list-header"><p class="rectangle"></p><b class="text">订单信息</b></div>  
        <!-- 审核通过状态订单详情 -->
        <div class="table" style="text-align:center">
            <!-- 头：列名   -->
            <el-row type="flex" align="middle" class="thead">
                <el-col :span="4"><span>订单编号</span></el-col>                   
                <el-col :span="4"><span>产品名称</span></el-col>                   
                <el-col :span="3"><span>数量</span></el-col>                
                <el-col :span="3"><span>代理费总价</span></el-col>                   
                <el-col :span="3"><span>第三方总价</span></el-col>                   
                <el-col :span="3"><span>官费总价</span></el-col>                     
                <el-col :span="3"><span>订单总价</span></el-col>                   
            </el-row>
            <!-- 订单列表 -->
            <div v-for="(item,index) in orderData" :key="index" class="list" >  
                <el-row type="flex" align="middle">                                 
                    <el-col :span="4"><span>{{item.orderNo}}</span></el-col>                   
                    <el-col :span="4"><span>{{item.spuName}}</span></el-col>                   
                    <el-col :span="3"><span>{{item.buyNum}}</span></el-col>    
                    <template v-if="data.totalAmount != 0">
                        <!-- 代理费 -->
                        <el-col :span="3" >{{item.agentFee | filterPrice}}</el-col>  
                        <!-- 第三方费用 -->
                        <el-col :span="3">{{item.thirdFee | filterPrice}}</el-col> 
                        <!-- 官费-->                  
                        <el-col :span="3">{{item.govFee | filterPrice}}</el-col>
                        <!-- 订单总价 -->                  
                        <el-col :span="3">{{item.totalAmount | filterPrice}}</el-col>              
                    </template>    
                    <template v-else>
                        <!-- 代理费 -->
                        <el-col :span="3" >待定</el-col>  
                        <!-- 第三方费用 -->
                        <el-col :span="3">待定</el-col> 
                        <!-- 官费-->                  
                        <el-col :span="3">待定</el-col>
                        <!-- 订单总价 -->                  
                        <el-col :span="3">待定</el-col>              
                   </template>    
                </el-row>
             </div>
            <!-- 尾：合计   -->
            <div class="count">
                <el-row  type="flex" align="middle" v-if="data.totalAmount != 0">
                    <el-col :span="4"><span>合计：</span></el-col>                   
                    <el-col :span="7"></el-col>                   
                    <el-col :span="3"><span>{{agentTotal | filterPrice}}</span></el-col>                   
                    <el-col :span="3"><span>{{thirdTotal | filterPrice}}</span></el-col>                   
                    <el-col :span="3"><span>{{govTotal | filterPrice}}</span></el-col>              
                    <el-col :span="3"><span >{{total | filterPrice}}</span></el-col>              
                </el-row> 
                <el-row  type="flex" align="middle" v-else>
                    <el-col :span="4"><span>合计：</span></el-col>                   
                    <el-col :span="7"></el-col>                   
                    <el-col :span="3"><span>待定</span></el-col>                   
                    <el-col :span="3"><span>待定</span></el-col>                   
                    <el-col :span="3"><span>待定</span></el-col>              
                    <el-col :span="3"><span >待定</span></el-col>              
                </el-row> 
             </div>   
        </div>
                      
    </div>  
</template>
<script>
import { orderOption } from '@/const/crud/personal/order'

export default {
    props:["orderData","data","contractStatus"],
    data(){
        return{
            isPassed:true,
            orgSum: 0,
            agentSum: 0,
            otherSum: 0,
            orderOption:orderOption,
            agentTotal: 0,
            thirdTotal: 0,
            govTotal: 0,
            total: 0
        }
    },
    filters:{
        filterPrice(val){
          return Number(val).toFixed(2)
        }
    },
    methods:{
      //列尾求和
      getSummaries(){
        if(this.orderData.length > 0){
            this.orderData.forEach(item => {
                this.$set(item,'agentFee',0);
                this.$set(item,'thirdFee',0);
                this.$set(item,'govFee',0);
                item.orderFeeVoList.length > 0 && item.orderFeeVoList.forEach(childItem=>{
                    if(childItem.costType == 1){
                        item.agentFee += childItem.buyNum * childItem.price;
                    }else if(childItem.costType == 2){
                        item.thirdFee += childItem.buyNum * childItem.price;
                    }else if(childItem.costType == 3){
                        item.govFee += childItem.buyNum * childItem.price;
                    }
                });
                this.agentTotal += item.agentFee
                this.thirdTotal += item.thirdFee
                this.govTotal += item.govFee
                this.total += item.totalAmount
            })
          }
      },
      addRedStar(h, { column }) { // 给表头加标识
        return [h('span', { style: 'color: red' }, '*'), h('span', ' ' + column.label)]
      },
    },
    mounted(){
        this.getSummaries();
    }
}
</script>
<style scoped>
.count{
    font-size:14px !important;
    font-weight:bold !important;
    margin-top:8px;
    background:#FAFAFA
}
.change{
    background:#FAFAFA 
}
.red{
    color:red;
}
.list-header{
    display: flex;
    margin:0 0 ;
}
.rectangle{
    width:5px;
    height:15px;
    background:#0aa1ed;
    border-radius:3px;
    padding:0
}
.text{
    font-size:14px;
    padding:10px 10px;
    margin:3px 0
}
.table{
   padding-bottom: 50px;  
}
.thead{
    font-size:12px;
    font-weight: bold;
    background:#FAFAFA
}
.list{
    border:1px solid #eee;
    margin-top:8px ;
    font-size:12px;
    color:#606266
}
.order {
    font-size:10px !important; 
    color:#bbb
}
</style>
<style >
.order_main .batch-choose .avue-crud__pagination{
    margin:0 0;
    padding:0 0;
}
.order_main .table .el-row{  
    min-height:45px;
    border-bottom: 1px solid #f5f7fa;
}
.order_main .table .el-col{   
    margin:0 0 ; 
    padding:8px 0px 8px 15px;
}
.order_main .table .el-col span{
    overflow: hidden;
}

</style>