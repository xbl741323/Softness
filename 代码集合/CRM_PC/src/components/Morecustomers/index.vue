<template>
  <div>
      <div>
        <el-form :model="filters" ref="filters" inline  @keyup.enter.native="getAllList()"  @submit.native.prevent>
           <div>
              <el-form-item label="产品类型：" prop="productType">
                <el-radio-group v-model="filters.productType" @change="changeType()">
                  <el-radio :disabled="filters.productType==1 && recordchanpingList.length !==0" label="0">项目申报</el-radio>
                  <el-radio :disabled="filters.productType==0 && recordchanpingList.length !==0"  label="1">知识产权</el-radio>
                </el-radio-group>
            </el-form-item>
           </div>
            <el-form-item label="产品名称：" prop="productName">
                <el-input placeholder="请输入产品编号或产品名称关键字" class="input-sty" v-model="filters.productName"></el-input>
            </el-form-item>
            <el-button type="primary" class="btn-sty1"  @click="getAllList()">
               搜索
            </el-button>
        </el-form>
        <el-table :data="dataList"  ref="multipleTable" row-key="productId" border @selection-change="selectionChange" :header-cell-class-name="cellClass">
            <el-table-column type="selection" :selectable="selectAble"  :reserve-selection="true"></el-table-column>
            <el-table-column label="产品编号" prop="productNo" show-overflow-tooltip></el-table-column>
            <el-table-column label="产品类型" prop="productType" show-overflow-tooltip>
               <template slot-scope="scope">
                      <span>{{ scope.row.productType|typeFilter }}</span>
               </template>
            </el-table-column>
            <el-table-column label="产品名称" prop="productName" show-overflow-tooltip></el-table-column>
       </el-table>
          <div style="margin-top:10px">
           <template v-if="recordchanpingList && recordchanpingList.length>0">
                <div v-for="(item,index) in recordchanpingList" :key="index">
                   <p>{{item.productNo?(item.productNo+'-'):''}}{{item.productName}}</p>
                </div>
           </template>
       </div>
        <el-pagination
            style="margin-top:10px;text-align:right"
            class="pagination"
            background
            layout="sizes, prev, pager, next, total"
            @current-change="currentChange"
            @size-change="sizeChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size= pageSize
            :total='total'>
        </el-pagination>
        <div class="btn-flex-sty" style="margin-top:10px">
          <el-button type="primary" class="btn-sty1" :disabled="recordchanpingList.length==0"  v-preventReClick  @click="addProduct()">确定</el-button>
          <el-button class="btn-sty1 btn-sty2" @click="handleclose()">取消</el-button>
        </div>
      </div>
  </div>
</template>

<script>
import { getProductList } from '@/api/clue/clue'
export default {
  props:['chanping'],
  data() {
    return {
      currentPage:1,
      pageSize: 10,
      total: 0,
      flowList:[],
      flowInfo:{},
      workIdList:[],
      policyIdList:[],
      workInfo:{},
      editInfo:{
          productName:"xxx产品名称",
          workFlow:""
      },
      filters:{
          productType:"0",
          productName:""
      },
      dataList: [
          {
           number:"CP23232323",
           type:"知识产权",
           name:"发明专利申请"   
          }
      ],
      page: {
        total: 10, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [5, 10],
      },
      recordchanpingList:[]
    };
  },
  filters:{
    typeFilter(val){
     return val==1?"知识产权":"项目申报"
    }
  },
   mounted(){
      if(this.chanping && this.chanping.length>0){
        console.log(1212);
         if(this.chanping[0].productType==1){
           this.filters.productType = "1";
         }
      }
       this.recordchanpingList = this.chanping;
       this.recordchanpingList.forEach(item=>{
            this.$refs.multipleTable.toggleRowSelection(item, true);
          })
       this.showInfo();
    },
  methods: {
    selectAble(row){
      if(row.checked){
        return true;
      }else{
        return false;
      }
    },
    cellClass(row){
      if(row.columnIndex == 0){
        return 'productDisabledSelection'
      }
    },
    changeType(){
      // this.recordchanpingList = []
      // this.$emit("dochange",[])
      this.getAllList()
    },
    addProduct(){
      let emitList = [];
      this.recordchanpingList.forEach(item=>{
        emitList.push({
          productType:item.productType,
          productId:item.productId,
          productName:item.productName,
          productNo:item.productNo
        })
      })
      this.$emit("dochange",emitList);
    },
    selectionChange(val){
      this.recordchanpingList = []
         if (val.length == 3) {
            let Ids = []
            val.slice(0,3).forEach((item)=>{
                Ids.push(item.productId)
            })
            this.dataList.forEach((item)=>{
                if(Ids.includes(item.productId)){
                     item.checked = true;
                }else{
                    item.checked = false;
                }
            }) 
            this.recordchanpingList = val
            this.updata()
         }else if(val.length>=1 &&val.length<3){
              this.dataList.forEach((item)=>{
                     item.checked = true;
            })
            this.recordchanpingList = val
         }else{
             this.dataList.forEach((item)=>{
                 item.checked = true;
            })
         }
    },
    showInfo(){
      this.filters.productName = ""
      this.getAllList()
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    
    getList() {
      let params = {
        keyWords:this.filters.productName.trim(),
        productType:this.filters.productType,
        current:this.page.currentPage,
        size:this.page.pageSize
      }
      getProductList(params).then(res=>{
        
        res.data.data.records.forEach(item => {
             item.checked = true
        });
        if(res.data.data.records){
            this.dataList = res.data.data.records  
        }else if(!res.data.data.records){
               this.dataList = []
        }
        this.total = res.data.data.total
        this.updata();
      })
    },
     updata(){
         if(this.recordchanpingList.length==3){
                   let a = []
                  this.recordchanpingList.slice(0,3).forEach(item=>{
                      a.push(item.productId)
                  })
                this.$nextTick(()=>{
                    this.dataList.forEach(item => {
                    if(a.includes(item.productId)){
                        item.checked = true
                      }else{
                        item.checked = false
                      }
                    });
                  })
          }
     },
    handleclose(){
       this.countDialog = false
        this.recordchanpingList = []
        this.$emit("dochange",this.chanping)
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getAllList();
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.getList();
    },
  },
};
</script>

<style scoped>
.input-sty{
  width:300px;
}
.btn-sty1{
  width:80px;
}
.btn-sty2{
  margin-left:100px;
}
.role-btn-sty {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
.confirm-sty {
  margin-right: 40px;
  width: 80px;
}
.btn-flex-sty{
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>