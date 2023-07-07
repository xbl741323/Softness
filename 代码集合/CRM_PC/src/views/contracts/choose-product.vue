<template>
  <div>
    <el-form :model="productForm" ref="productForm" label-width="100px" @submit.native.prevent  @keyup.enter.native="search">
      <el-form-item label="请选择产品：">
         <!-- <el-cascader filterable style="width:150px" @change="currentPage = 1;search()" :show-all-levels="false" :options="productTypelist" v-model="productForm.productType"  :props="{value: 'id',label: 'categoryName', children:'child'}" /> -->
        <el-select v-model="productForm.productType" @change="currentPage = 1;search()" :disabled="productQuantity > 0">
          <el-option  
            v-for="item in productTypelist"
            :key="item.id"
            :value="item.id"
            :label="item.categoryName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关键字：" prop="keyWords" >
        <el-input class="product-input" placeholder="请输入产品编号或产品名称关键字" v-model.trim="productForm.keyWords" />
        <el-button size="mini" type="primary" @click="currentPage = 1,search()">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="multipleTable" :data="productList" max-height="400" border @selection-change="handleSelectionChange" :row-key="(row)=>{return row.spuCode}" :header-cell-class-name="cellClass">
      <el-table-column type="selection" :selectable="selectAble" :reserve-selection="true" ></el-table-column>
      <el-table-column label="产品编号" prop="spuCode" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品类型" prop="categoryName" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品名称" prop="spuTitle" show-overflow-tooltip></el-table-column>
      <el-table-column label="当前合同模板" prop="spuContractTemplateName" show-overflow-tooltip></el-table-column>
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
import { getList, getCategory } from '@/api/contracts/contracts'
export default {
  props: {
    existingProducts:{//父组件带过来的已选择产品
      type: Array,
      default: []
    },
    currentTemplateId:{
      type: Number,
      default: -1
    },
    multipleNum:{
      type: Number,
      default: 1
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
      productForm:{
        productType: 1
      },
      productList: [],
      orderDialog:false,
      product:[],
      noList: [],
      ordersLength: 0,
      productTypelist: []
    }
  },
  mounted(){
    this.ordersLength = this.existingProducts.length;
    this.getCategoryList();
    this.search();
  },
  methods:{
    getCategoryList(){
      getCategory({parentId:0}).then(res=>{
        this.productTypelist = res.data.data;
      })
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
      };
    },
    cancle(){//取消
      this.$emit('closeDialog',false);
    },
    addProduct(){//确定添加产品
      this.$emit('list',this.product);//订单产品列表
      this.$emit('closeDialog',false);
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
      if(val){
        this.noList = [];
        val.forEach(element => {
          this.noList.push({
            productId:element.productId,
            categoryId: element.categoryId
          });
        });
      }
      this.productQuantity = val.length;
      this.product = val;
    },
    search(){
      let para = {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        categoryId: this.productForm.productType,
        keywords: this.productForm.keyWords,
      }
      // if(this.existingProducts && this.existingProducts.length>0){
      //   para.productType = this.existingProducts[0].productType;
      // }
      getList(para).then(res=>{
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