<template>
  <div>
    <el-form :model="productForm" ref="productForm" label-width="100px" @submit.native.prevent  @keyup.enter.native="search">
      <el-form-item label="请选择订单：">
        <el-radio-group v-model="productForm.productType" @change="currentPage = 1;search()" v-if="this.existingProducts && this.existingProducts.length>0">
          <el-radio :label="0" :disabled="this.existingProducts[0].productType == 1">项目申报</el-radio>
          <el-radio :label="1" :disabled="this.existingProducts[0].productType == 0">知识产权</el-radio>
        </el-radio-group>
        <el-radio-group v-model="productForm.productType" @change="currentPage = 1;search()" v-else>
          <el-radio :label="0" :disabled="this.selectProperty">项目申报</el-radio>
          <el-radio :label="1" :disabled="this.selectProject">知识产权</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关键字：" prop="keyWords" >
        <el-input class="product-input" placeholder="请输入用户名称/产品名称关键字/订单编号/主体ID" v-model="productForm.keyWords"  />
        <el-button size="mini" type="primary" @click="currentPage = 1,search()">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="multipleTable" :data="productList" max-height="400" border @selection-change="handleSelectionChange" :row-key="(row)=>{return row.orderNo}" :header-cell-class-name="cellClass">
      <el-table-column type="selection" :selectable="selectAble" :reserve-selection="true" ></el-table-column>
      <el-table-column label="订单编号" prop="orderNo" show-overflow-tooltip></el-table-column>
      <el-table-column label="主体ID" prop="userNo" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名称" prop="customerName" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品名称" prop="productName" show-overflow-tooltip></el-table-column>
      <el-table-column label="数量" prop="productCount" show-overflow-tooltip></el-table-column>
      <el-table-column label="订单总价" >
        <template slot-scope="scope">
          <span >{{Number(scope.row.totalAmount)/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单归属" >
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+scope.row.userBelongNo +' 部门：'+scope.row.userBelongDeptName" placement="top" >
            <p>{{scope.row.userBelongName}}</p>
          </el-tooltip>        
        </template>
      </el-table-column>
      <el-table-column label="业务员" >
        <template slot-scope="scope">
                  <el-tooltip effect="dark" :content="'工号：'+scope.row.salesmanNo +'   部门：'+scope.row.salesmanDeptName" placement="top">
          <span>{{scope.row.salesmanName}}</span>
        </el-tooltip>   
        </template>
      </el-table-column>
      <!-- <el-table-column label="推广归属" >
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+scope.row.userBelongNo +' 部门：'+scope.row.userBelongDeptName" placement="top" >
            <p>{{scope.row.userBelongName}}</p>
          </el-tooltip>        
        </template>
      </el-table-column> -->
    </el-table>
    <p>单次可最多选择{{multipleNum}}项产品，当前已选择{{this.productQuantity}}项</p>
    <p
      v-for="(item, index) in product"
      :key="index"
    >{{item.orderNo}}-{{item.productName}} 
      <a class="close-icon" @click="deleteProduct(item.orderNo)">
        <i class="el-icon-close"></i>
      </a>
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
      <el-button size="small" type="primary" @click="addProduct()" :disabled="productQuantity == 0 || (ordersLength + product.length > 20)">确定</el-button>
      <el-button size="small" type="warning" @click="cancle()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { selectContractOrder } from '@/api/clue/clue'
export default {
  props: {
    existingProducts:{//父组件带过来的已选择产品
      type: Array,
      default: []
    },
    multipleNum:{
      type: Number,
      default: 1
    }
  },
  data(){
    return {
      currentPage:1,
      pageSize: 20,
      total: 0,
      selectProperty : false,
      selectProject : false,
      productQuantity: 0,
      productForm:{
        productType: 0
      },
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
      contractUserVo:{},
      accountId:'',
      authDialog: false
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
      var arr = this.product.filter(item=>{
        return item.autStatus == 0; //0-未认证 1-已认证
      })
      if(arr.length == 0){
        this.$emit('orderList',this.product);//订单产品列表
        this.$emit('contractUserVo',this.contractUserVo);//客户
      }else{
        this.$alert('用户信息尚未认证！请提醒用户前去认证！', '认证提示', {
          confirmButtonText: '确定',
        });
      };
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
          this.productForm.productType = this.existingProducts[0].productType;
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
        if(this.accountId){//只能选同一用户的订单
          this.productList.forEach(item => {
            if(item.accountId == this.accountId){
              if(item.able == false){

              }else{
                this.$set(item,'able',true);
              };
            }else{
              this.$set(item,'able',false);
            };
          });
        }else{
          this.productList.forEach(item => {
            this.$set(item,'able',true);
          });
        };
      }else{

      };
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.search();
    },
    handleSelectionChange(val){
      this.accountId = val[0] ? val[0].accountId : '';
      if(val.length>0 && val[0].productType == 0){
        this.selectProject= true;
      }else if(val.length>0 && val[0].productType == 1){
        this.selectProperty = true;
      }else{
        this.selectProperty = false;
        this.selectProject = false;
      };
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
        productType: this.productForm.productType,
        enterSource: this.$route.query.source == 'personal' ? 1 : 2,
        sysUserNo: JSON.parse(sessionStorage.getItem('pigx-userInfo')).content.number
      }
      if(this.productForm.keyWords){
        para.keyWords = this.productForm.keyWords.trim();
      };
      if(this.existingProducts && this.existingProducts.length>0){
        para.productType = this.existingProducts[0].productType;
        this.$set(this.productForm,'productType',this.existingProducts[0].productType)
        this.accountId = this.existingProducts[0].accountId;
      }
      selectContractOrder(para).then(res=>{
        if(res.data.data){
          this.productList = res.data.data.ipage.records;
          console.log("3333333",this.productList)
          this.contractUserVo = res.data.data.contractUserVo;
          this.productList.forEach(element => {
            this.$set(element,'able',true);
          });
          this.total = res.data.data.ipage.total;
          /* yizou */
        }else{
          this.productList = [];
        };
        this.hasSelectEnough();
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
  width: 300px;
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