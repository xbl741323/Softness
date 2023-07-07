<template>
  <div class="relate-product">
    <el-dialog :before-close="closeDialog" :visible.sync="countDialog" :close-on-click-modal="false" :title="workInfo.flowName + ' - 关联产品清单'" width="55%">
      <div v-if="countDialog">
        <el-form :model="filters" ref="filters" inline @keydown.enter.native="getAllList()">
          <el-form-item label="产品类型：" prop="productType">
            <el-select v-model="filters.productType">
              <el-option label="全部" :value="0"></el-option>
              <el-option :label="item.categoryName" :value="item.id" v-for="(item, index) in optionList" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品名称：" prop="keyWords">
            <el-input placeholder="请输入产品编号或产品名称关键字" class="input-sty" v-model="filters.keyWords"></el-input>
          </el-form-item>
          <el-button type="primary" class="btn-sty1" @click="getAllList()">搜索</el-button>
          <el-button type="warning" @click="resetForm('filters')">重置</el-button>
          <el-button type="primary" class="btn-sty2" @click="showProduct()">添加关联产品</el-button>
        </el-form>
        <avue-crud ref="crud" :option="option" :data="dataList" :page.sync="page"
          @size-change="sizeChange"
          @current-change="currentChange"
          @on-load="getList">
          <template slot="type" slot-scope="scope">
            <span>{{ scope.row.type | typeFilter }}</span>
          </template>
        </avue-crud>
      </div>
    </el-dialog>
    <!-- 添加关联产品dialog -->
    <add-product @refresh="refresh" ref="child" :optionList="optionList"></add-product>
  </div>
</template>

<script>
import { getProType } from "@/api/new-client/clue";
import { clientOption } from "@/const/crud/processmanage/product";
import * as CodeMsg from "@/api/common/CodeChange";
import addProduct from "@/components/process-manage/add-product";
import { getRelatedProducts } from "@/api/processmanage/work-flow";
export default {
  components: {
    addProduct,
  },
  data() {
    return {
      optionList: [], // 产品类型下拉框
      countDialog: false,
      workInfo: {},
      option: clientOption,
      rules: {
        workFlow: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      filters: {
        productType: 0,
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
  filters: {
    typeFilter(val) {},
  },
  methods: {
    closeDialog(){
      this.countDialog = false
      this.$emit("refresh");
    },
    refresh() {
      this.getDropdown();
      this.getAllList();
    },
    showProduct() {
      this.$nextTick(()=>{
        this.$refs.child.countDialog = true;
        this.$refs.child.optionList = this.optionList;
        this.$refs.child.filters.productType = this.optionList[0].id;
        this.$refs.child.workInfo = this.workInfo;
        this.$refs.child.showInfo();
      })
    },
    // 获取关联产品列表及下拉框相关信息
    showInfo() {
      this.filters.productType = 0
      this.filters.keyWords = "";
      this.getDropdown();
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    // 获取关联产品列表
    getList() {
      let params = {
        workflowId: this.workInfo.id,
        categoryId: this.filters.productType,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        keywords: this.filters.keyWords,
      };
      getRelatedProducts(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let r = res.data.data
          this.dataList = r.records;
          this.page.total = r.total;
        }
      });
    },
    // 重置筛选项
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getAllList();
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getAllList();
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.getList();
    },
    // 获取产品下拉框数据
    getDropdown() {
      getProType({ parentId: 0 }).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.optionList = res.data.data;
        }
      });
    },
  },
};
</script>

<style scoped>
.input-sty {
  width: 300px;
}
.btn-sty1 {
  width: 80px;
}
.btn-sty2 {
  margin-left: 100px;
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
</style>