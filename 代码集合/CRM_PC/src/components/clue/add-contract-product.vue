<template>
<!-- 排查完成 -->
  <div>
    <el-form :model="productForm" ref="productForm" label-width="100px" @submit.native.prevent  @keyup.enter.native="search">
      <el-form-item label="关键字：" prop="keyWords" >
        <el-input class="product-input" placeholder="请输入主体名称/产品名称关键字/订单编号/主体ID" v-model.trim="productForm.keyWords"  />
        <el-button size="mini" type="primary" @click="currentPage = 1,search()">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="multipleTable" :data="orderList" max-height="400" border @selection-change="handleSelectionChange" :row-key="(row)=>{return row.orderNo}" :header-cell-class-name="cellClass">
      <el-table-column type="selection" :selectable="selectAble" :reserve-selection="true" ></el-table-column>
      <el-table-column label="订单编号" prop="orderNo" align="center"></el-table-column>
      <el-table-column label="主体ID" prop="userNo" align="center"></el-table-column>
      <el-table-column label="主体名称" prop="subjectName" align="center"></el-table-column>
      <el-table-column label="产品名称" prop="spuName" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="数量" prop="buyNum" align="center"></el-table-column>
      <el-table-column label="订单总价" prop="totalAmount" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.totalAmount | amount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单归属" prop="belongName" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.belongName!='自主'">
            <el-tooltip effect="dark" :content="'工号：'+ cEmpNo +'   部门：'+ cDeptName" placement="top">
              <span @mouseover="showUserInfo(scope.row.belongId)">
                {{scope.row.belongName}}
              </span>
            </el-tooltip>
          </div>
          <div v-else>
            <span>{{scope.row.belongName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="业务员" prop="clueSalesmanEmpName" align="center">
        <template slot-scope="scope">
         <div v-if="scope.row.clueSalesmanEmpName!='自主'">
            <el-tooltip effect="dark" :content="'工号：'+ cEmpNo +'   部门：'+ cDeptName" placement="top">
              <span @mouseover="showUserInfo(scope.row.clueSalesmanEmpId)">
                <!-- <img src="/img/disable.png" class="emp_disabled" alt="" /> -->
                {{scope.row.clueSalesmanEmpName}}
              </span>
            </el-tooltip>
          </div>
          <div v-else>
            <span>{{scope.row.clueSalesmanEmpName}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <p>单次可最多选择{{multipleNum}}项产品，当前已选择{{this.productQuantity}}项</p>
    <p
      v-for="(item, index) in product"
      :key="index"
    >{{item.orderNo}}-{{item.spuName}} 
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
import { getOrderList } from '@/api/clue/clue'
import { getEmpInfo } from "@/api/project/wtClass"
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
    clueInfo:{
      type: Object,
      default: {}
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
        productType: 0,
        keyWords:''      
      },
      orderList: [],
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
      cEmpNo:'',
      cDeptName:''

    }
  },
  filters:{
    amount(val){
      if(!isNaN(Number(val)) && val!=null){
        return Number(val).toFixed(2)
      }
    }
  },
  mounted(){
    this.ordersLength = this.existingProducts.length;
    this.search();
  },
  methods:{
    // 获取员工信息
    showUserInfo(id){
      getEmpInfo(id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.cEmpNo = res.data.data.number
          this.cDeptName = res.data.data.deptName
        }
      })
    },
    deleteProduct(orderNo){
      this.product.forEach(item => {
        if(item.orderNo == orderNo){
          this.$refs.multipleTable.toggleRowSelection(item, false);
        }
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
      this.$emit('closeDialog',false);
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.search();
    },
    hasSelectEnough(){//选择数量是否达到规定数量
      if(this.noList.length == this.multipleNum){
        this.orderList.forEach(item=>{
          if(this.noList.includes(item.orderNo)){
            item.able = true;
          }else{
            item.able = false;
          }
        });
      }else{
        this.orderList.forEach(item=>{
          item.able = true;
        });
      };
      if(this.noList.length < 5){//每次选择最多五个
        if(this.existingProducts && this.existingProducts.length>0){//已选择的产品置灰
          this.productForm.productType = this.existingProducts[0].productType;
          var list = [];
          this.existingProducts.forEach(item => {
            list.push(item.orderNo);
            this.orderList.forEach(element => {
              if(list.includes(element.orderNo)){
                this.$set(element,'able', false);
              }else{
                this.$set(element,'able', true);
              }
            });
          });
        }else{
          for(let j=0;j< this.orderList.length;j++){
            this.$set(this.orderList[j],'able',true);
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
      if(val){
        this.noList = [];
        val.forEach(element => {
          this.noList.push(element.orderNo);
        });
      }
      if(val.length == this.multipleNum){ 
        this.orderList.forEach(item=>{
          if(this.noList.includes(item.orderNo)){
            item.able = true;
          }else{
            item.able = false;
          }
        });
      }else{
        this.orderList.forEach(item=>{
          item.able = true;
        });
      };
      this.productQuantity = val.length;
      this.product = val;
      this.hasSelectEnough();
    },
    search(){
      let para ={
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        contractType:2, //合同类型（1：电子；2：纸质）
        keyWord:this.productForm.keyWords,
        clueType: this.clueInfo.clueType,
        clueId: Number(this.clueInfo.clueId)
      }
      if(this.$route.query.clueId){
        para.clueId = this.$route.query.clueId
        para.clueType = Number(this.$route.query.clueType) + 1
      }
      console.log(para)
      getOrderList(para).then(res=>{
        if(res.data.code == 0){
          this.orderList = res.data.data.records;
          this.orderList.forEach(element => {
            this.$set(element,'able',true);
          });
          this.total = res.data.data.total;
        }else{
          this.orderList = [];
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