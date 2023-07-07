<template>
  <el-dialog :visible.sync="countDialog" :close-on-click-modal="false" width="55%" title="添加关联产品">
    <div v-if="countDialog">
      <el-form :model="filters" ref="filters" inline @keydown.enter.native="getAllList()">
      <el-form-item label="产品类型：" prop="productType">
        <el-select v-model="filters.productType" @change="changeType()">
          <el-option :label="item.categoryName" :value="item.id" v-for="(item, index) in optionList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称：" prop="keyWords">
        <el-input placeholder="请输入产品编号或产品名称关键字" class="input-sty" v-model="filters.keyWords"></el-input>
      </el-form-item>
      <el-button type="primary" @click="getAllList()">搜索</el-button>
    </el-form>
    <avue-crud ref="crud" :option="option" :data="dataList" :page.sync="page"
      @selection-change="selectionChange"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
      <template slot="workflowId" slot-scope="scope">
        <span>{{ scope.row.workflowId | typeFilter }}</span>
      </template>
    </avue-crud>
    </div>
    <div class="btn-flex-sty">
      <el-button size="medium" class="confirm-sty" type="primary" :disabled="policyIdList.length == 0 ? true : false" @click="addProduct()">确定</el-button>
      <el-button size="medium" @click="handClose()">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
let that = ""
import { addRealtedProduct,getRelatedProducts,getAllFlow} from "@/api/processmanage/work-flow";
import * as CodeMsg from "@/api/common/CodeChange";
import { clientOption } from "@/const/crud/processmanage/add-product";
export default {
  data() {
    return {
      allWorkFlow:[], // 所有的工作流
      optionList: [], // 产品类型下拉框
      policyIdList: [], // 列表勾选项
      countDialog: false,
      option: clientOption,
      workInfo: {},
      filters: {
        productType: "",
        keyWords: "",
      },
      dataList: [],
      page: {
        total: 10, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [5, 10],
      },
    };
  },
  beforeCreate(){
    that = this
  },
  filters:{
    typeFilter(val){
      console.log(val,"val")
      console.log(that.allWorkFlow,"allWorkFlow")
      let result = that.allWorkFlow.filter(item=>{
        return item.id == val
      })
      return result.length>0? result[0].flowName : '';
    }
  },
  methods: {
    // 获取所有工作流
    getAllflowList(){
      getAllFlow().then(res=>{
        if (res.data.code == CodeMsg.CODE_0) {
          this.allWorkFlow = res.data.data
        }
      })
    },
    // 修改产品类型
    changeType() {
      this.getAllList();
    },
    // 添加关联产品
    addProduct() {
      let params = {
        workflowId: this.workInfo.id,
        ids: this.policyIdList
      }
      addRealtedProduct(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: "操作成功，修改工作流只对新任务生效！",
            offset: 300
          });
          this.countDialog = false;
          this.getAllList();
          this.$emit("refresh");
        }
      });
    },
    // 勾选项修改
    selectionChange(val) {
      this.policyIdList = [];
      val.forEach(item=>{
        this.policyIdList.push(item.id)
      })
    },
    showInfo() {
      this.filters.keyWords = "";
      this.getAllflowList()
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    // 获取产品列表信息
    getList() {
      let params = {
        categoryId: this.filters.productType,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        keywords: this.filters.keyWords,
        neWorkflowId: this.workInfo.id,
      };
      getRelatedProducts(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let r = res.data.data;
          this.dataList = r.records;
          this.page.total = r.total;
        }
      });
    },
    // 关闭弹窗
    handClose() {
      this.countDialog = false;
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
.input-sty {
  width: 300px;
}
.confirm-sty {
  margin-right: 100px;
}
.role-btn-sty {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
.btn-flex-sty {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>