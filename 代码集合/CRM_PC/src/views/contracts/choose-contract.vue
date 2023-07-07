<template>
  <div>
    <el-form :model="productForm" ref="productForm" label-width="70px" @submit.native.prevent  @keyup.enter.native="search">
      <el-form-item label="关键字：" prop="keyWords" >
        <el-input class="product-input" placeholder="请输入主体名称/产品名称关键字/订单编号/主体ID/合同编号" v-model.trim="productForm.keyWords" />
        <el-button size="mini" type="primary" @click="currentPage = 1,search()">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="multipleTable" :data="productList" max-height="400" border @selection-change="handleSelectionChange" :row-key="(row)=>{return row.spuCode}" :header-cell-class-name="cellClass">
      <el-table-column type="selection" :selectable="selectAble" :reserve-selection="true" ></el-table-column>
      <el-table-column label="合同编号" prop="contractNo" show-overflow-tooltip></el-table-column>
      <el-table-column label="订单编号" prop="orderNo" show-overflow-tooltip></el-table-column>
      <el-table-column label="主体名称" prop="authName" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品名称" prop="orderInfo" show-overflow-tooltip></el-table-column>
      <el-table-column label="合同金额" prop="totalAmount" show-overflow-tooltip></el-table-column>
      <el-table-column label="业务员" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-tooltip effect="dark" :content="'工号：'+ empNo +' 部门：'+ deptName" placement="top">
          <span @mouseover="showUserInfo(row.clueSalesmanEmpId)">{{row.clueSalesmanEmpName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      background
      layout="sizes, prev, pager, next, total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page.sync="currentPage"
      :page-sizes="[3, 10, 20, 30, 40]"
      :page-size= pageSize
      :total='total'>
    </el-pagination>
    <div class="btn">
      <!-- <p class="orders_number_reached" v-if="ordersLength + product.length > 20">订单总数不能超过20条,当前已选订单{{ordersLength + product.length}}条。</p> -->
      <el-button size="small" type="primary" @click="addProduct()" :disabled="productQuantity == 0">确 定</el-button>
      <el-button size="small" type="warning" @click="cancle()">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { getPersonalContractList, getAllContractList } from '@/api/supplement/index'
export default {
  props: {
    existingProducts:{//父组件带过来的已选择合同
      type: Array,
      default: ()=> {return []}
    },
    currentTemplateId:{
      type: Number,
      default: -1
    },
    multipleNum:{
      type: Number,
      default: 1
    },
    source:{//操作来源
      type: String,
      required: true
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
      productForm:{},
      productList: [],
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
    cellClass(row){
      if(row.columnIndex == 0){
        return 'productDisabledSelection'
      }
    },
    selectAble(row){
      return row.able;
    },
    cancle(){//取消
      this.$emit('closeDialog',false);
    },
    addProduct(){//确定合同
      this.$emit('list',this.product);//合同list
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.search();
    },
    hasSelectEnough(){//选择数量是否达到规定数量
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.search();
    },
    handleSelectionChange(val){
      if(val.length > 0){
        this.noList = [];
        val.forEach(element => {
          this.noList.push({
            productId:element.productId,
            categoryId: element.categoryId
          });
        });
        this.productList.forEach( el => {
          if(el.contractNo == val[0].contractNo){
            this.$set(el,'able',true);
          }else{
            this.$set(el,'able',false);
          }
        });
      }else{
        this.productList.forEach( el => {
          this.$set(el, 'able', true);
        });
      };
      this.productQuantity = val.length;
      this.product = val;
    },
    search(){
      let para = {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        keywords: this.productForm.keyWords,
      }
      if(this.source == 'personal'){
        getPersonalContractList(para).then(res=>{
          if(res.data.data){
            this.productList = res.data.data.records;
            this.productList.forEach(element => {
              if(element.spuContractTemplateId == this.currentTemplateId){
                this.$set(element,'able',false);
              }else{
                this.$set(element,'able',true);
              };
            });
            this.total = res.data.data.total;
          }else{
            this.productList = [];
          };
        });
      };
      if(this.source == 'list'){
        getAllContractList(para).then(res=>{
          if(res.data.data){
            this.productList = res.data.data.records;
            this.productList.forEach(element => {
              if(element.spuContractTemplateId == this.currentTemplateId){
                this.$set(element,'able',false);
              }else{
                this.$set(element,'able',true);
              };
            });
            this.total = res.data.data.total;
          }else{
            this.productList = [];
          };
        });
      }
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
  width: 400px;
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
  border-radius: 14px;
  background: #e1e2e4;
  color: #ff0000;
}
.orders_number_reached{
  color: red;
}
</style>
