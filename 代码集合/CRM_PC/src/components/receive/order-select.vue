<template>
  <div class="">
    <p class="prompt">仅显示所选线索客户<span class="order-type">未结清的历史线下订单</span> ，线上下单无需认领回款，如有问题请联系工作人员</p>
    <el-form :model="orderForm" ref="orderForm" label-width="70px" @submit.native.prevent  @keyup.enter.native="search">
      <el-form-item label="关键字：" prop="keyWords" >
        <el-input class="product-input" placeholder="请输入合同编号/订单编号/产品名称关键字" v-model="orderForm.keyWords"  />
        <el-button size="mini" type="primary" @click="currentPage = 1,search()">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="multipleTable" :data="productList" border @selection-change="handleSelectionChange" :row-key="(row)=>{return row.orderNo}" :header-cell-class-name="cellClass">
      <el-table-column type="selection" :selectable="selectAble" :reserve-selection="true" ></el-table-column>
      <el-table-column label="合同编号" prop="contractNo" show-overflow-tooltip></el-table-column>
      <el-table-column label="订单编号" prop="orderNo" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品名称" prop="productName" show-overflow-tooltip></el-table-column>
      <el-table-column label="订单创建时间" prop="gmtCreate" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- <p>单次可最多选择{{multipleNum}}项产品，当前已选择{{this.productQuantity}}项</p> -->
    <p
      v-for="(item, index) in product"
      :key="index"
      class="name_title"
    >{{item.orderNo}}-{{item.productName}} 
      <span class="close-icon" @click="deleteProduct(item.orderNo)">
        <i class="el-icon-close"></i>
      </span>
    </p>

    <el-pagination
      class="pagination"
      background
      layout="sizes, prev, pager, next, total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size= pageSize
      :total='total'>
    </el-pagination>
    <div class="btn">
      <p class="orders_number_reached" v-if="ordersLength + product.length > 20">订单总数不能超过20条,当前已选订单{{ordersLength + product.length}}条。</p>
      <el-button size="small" type="primary" @click="addProduct()" :disabled="productQuantity == 0 || (ordersLength + product.length > 20)">下一步</el-button>
      <el-button size="small" type="warning" @click="cancle()">取消</el-button>
    </div>
  </div>
</template>

<script>
// import { getProductList } from '@/api/clue/clue'
import receiveData from '@/views/receivable/js/receivable.js'
export default {
  props: {
    existingProducts:{//父组件带过来的已选择产品
      type: Array,
      default: []
    },
    multipleNum:{
      type: Number,
      default: 1
    },
    clueId:{
      type: Number
    }
  },
  data(){
    return {
      currentPage:1,
      pageSize: 10,
      total: 0,
      selectProperty : false,
      selectProject : false,
      productQuantity: 0,
      orderForm:{},
      productList: [],
      selectList:[
        {
          label: 0,
          value: '项目申报'
        },
        {
          label: 1,
          value: '知识产权'
        },
      ],
      orderDialog:false,
      product:[],
      noList: [],
      ordersLength: 0,
    }
  },
  mounted(){
    this.ordersLength = this.existingProducts.length;
    this.search();
  },
  methods:{
    deleteProduct(orderNo){
      this.noList.splice(this.noList.indexOf(orderNo),1);
      this.product.forEach(item => {
        if(item.orderNo == orderNo){
          this.$refs.multipleTable.toggleRowSelection(item, false);
        }else{

        };
      });
      this.hasSelectEnough();
    },
    cellClass(row){
      if(row.columnIndex == 0){
        return 'productDisabledSelection'
      }
    },
    selectAble(row){
      if(row.able){
        return true;
      }else{
        return false;
      }
    },
    cancle(){//取消
      this.$emit('closeDialog',false);
    },
    addProduct(){//确定添加产品
      this.$emit('list',this.product);//订单产品列表
      // this.$emit('closeDialog',false);
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.search();
    },
    hasSelectEnough(){//选择数量是否达到规定数量
      if(this.noList.length == this.multipleNum){
        this.productList.forEach(item=>{
          if(this.noList.includes(item.orderNo)){
            item.able = true;
          }else{
            item.able = false;
          }
        });
      }else{
        this.productList.forEach(item=>{
          item.able = true;
        });
      };
      if(this.noList.length < 5){//每次选择最多五个
        if(this.existingProducts && this.existingProducts.length>0){//已选择的产品置灰
        //   this.orderForm.productType = this.existingProducts[0].productType;
          var list = [];
          this.existingProducts.forEach(item => {
            list.push(item.orderNo);
            this.productList.forEach(element => {
              if(list.includes(element.orderNo)){
                this.$set(element,'able', false);
              }else{
                this.$set(element,'able', true);
              }
            });
          });
        }else{
          for(let j=0;j< this.productList.length;j++){
            this.$set(this.productList[j],'able',true);
          }
        };
      }else{

      };
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.search();
    },
    handleSelectionChange(val){
      // if(val.length>0 && val[0].productType == 0){
      //   this.selectProject= true;
      // }else if(val.length>0 && val[0].productType == 1){
      //   this.selectProperty = true;
      // }else{
      //   this.selectProperty = false;
      //   this.selectProject = false;
      // };
      if(val){
        this.noList = [];
        val.forEach(element => {
          this.noList.push(element.orderNo);
        });
      }
      if(val.length == this.multipleNum){ 
        this.productList.forEach(item=>{
          if(this.noList.includes(item.orderNo)){
            item.able = true;
          }else{
            item.able = false;
          }
        });
      }else{
        this.productList.forEach(item=>{
          item.able = true;
        });
      };
      this.productQuantity = val.length;
      this.product = val;
      this.hasSelectEnough();
    },
    search(){
      let para ={
        size: this.pageSize,
        current: this.currentPage,
        clueId: this.clueId
      };
      if(this.orderForm.keyWords){
        para.keyWords = this.orderForm.keyWords.trim();
      }
      receiveData.myApprovedClue(para).then(res=>{
        if(res){
          this.productList = res.orderList.records;
          this.productList.forEach(element => {
            this.$set(element,'able',true);
          });
          this.total = res.orderTotal;
          /* yizou */
        }else{
          this.productList = [];
        };
        this.hasSelectEnough();
      });
      // if(this.existingProducts && this.existingProducts.length>0){
      //   para.productType = this.existingProducts[0].productType;
      // }
      // getProductList(para).then(res=>{
      //   if(res.data.data){
      //     this.productList = res.data.data.records;
      //     this.productList.forEach(element => {
      //       this.$set(element,'able',true);
      //     });
      //     this.total = res.data.data.total;
      //     /* yizou */
      //   }else{
      //     this.productList = [];
      //   };
      //   this.hasSelectEnough();
      // });
    }
  }
}
</script>

<style scoped>
.pagination{
  margin-top: 10px;
  text-align: right;
}
.btn{
  margin-top: 20px;
  text-align: center;
}
.product-input{
  width: 250px;
  margin-right: 10px;
}
/* 去除table表头的全选框 */
.el-table /deep/.productDisabledSelection .cell .el-checkbox__inner{ 
  display: none;
  position: relative;
}
.el-table /deep/.productDisabledSelection .cell:before{
  content: '';
  position: absolute;
}
.close-icon{
  cursor: pointer;
}
.close-icon:hover{
  width: 14px;
  height: 14px;
  border-radius: 14px;
  background: #e1e2e4;
  color: #ff0000;
}
.orders_number_reached{
  color: red;
}
.name_title{
  margin: 5px 0;
}
.order-type{
  color: #ff0000;
}
.prompt{
  font-size: 14px;
}
</style>