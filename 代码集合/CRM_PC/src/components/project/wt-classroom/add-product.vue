<template>
  <el-dialog v-if="countDialog" :visible.sync="countDialog" :modal="pageFrom == 1?false:true" :close-on-click-modal="false" width="50%">
      <el-form :model="filters" ref="filters" inline @keydown.enter.native="getAllList()">
        <div>
          <el-form-item label="产品类型：" prop="productType">
            <el-select v-model="filters.productType" @change="changeType()">
              <el-option v-for="(item,index) in optionList" :key="index" :label="item.categoryName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="relate-pro-name">
          <el-form-item label="产品名称：" prop="productName">
            <el-input placeholder="产品名称关键字" class="input-sty" v-model="filters.productName">
            </el-input>
          </el-form-item>
          <el-button type="primary" class="relate-btn" @click="getAllList()">搜索</el-button>
          <el-button class="relate-btn" @click="resetForm()">重置</el-button>
        </div>
      </el-form>
      <avue-crud
        class="batch-choose"
        ref="crud"
        :option="option"
        :data="dataList"
        :page.sync="page"
        @selection-change="selectionChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @on-load="getList">
        <template slot="productType" slot-scope="scope">
          <span>{{ scope.row.productType }}</span>
        </template>
      </avue-crud>
      <div class="btn-flex-sty">
        <el-button size="medium" type="primary" class="btn-sty1" :disabled="policyIdList == 0 ? true : false" @click="addProduct()">确定</el-button>
        <el-button size="medium"  @click="handClose()">取消</el-button>
      </div>
  </el-dialog>
</template>

<script>
import { getProType } from "@/api/new-client/clue";
import { getRelatedProducts } from "@/api/project/wtClass";
import * as CodeMsg from "@/api/common/CodeChange";
import { clientOption } from "@/const/crud/project/relate-product";
export default {
  props: {
    pageFrom: {
      type: Number,
      default: 0, // 0-编辑页 1-列表页（快速修改） 2-添加页
    },
  },
  data() {
    return {
      optionList: [],
      policyIdList: [],
      countDialog: false,
      option: clientOption,
      filters: {
        productType: "",
        productName: "",
      },
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [5, 10],
      },
    };
  },
  methods: {
    resetForm() {
      this.filters.productType = this.optionList[0].id;
      this.filters.productName = "";
      this.getAllList();
    },
    changeType() {
      this.getAllList();
    },
    addProduct() {
      if (this.policyIdList.length < 7) {
        this.$emit("receive-product", this.policyIdList);
        this.countDialog = false;
      } else {
        this.$message({
          type: "warning",
          message: "最多添加6个产品！",
          offset: 300,
        });
      }
    },
    selectionChange(val) {
      this.policyIdList = []
      val.forEach(item=>{
       this.policyIdList.push({
          productName:item.spuTitle,
          categoryId:item.categoryId,
          productId:item.id,
          spuId:item.id,
       })
      })
    },
    // 外部调用显示弹窗
    showProduct() {
      this.countDialog = true;
      this.policyIdList = [];
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        categoryId: this.filters.productType,
        keywords: this.filters.productName,
      };
      getRelatedProducts(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.dataList = res.data.data.records;
          this.dataList.forEach(item=>{
            item.productId = item.id
            item.spuId = item.id
            item.productName = item.spuTitle
          })
          this.page.total = res.data.data.total;
        }
      });
    },
    handClose() {
      this.countDialog = false;
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getAllList();
    },
    currentChange(current) {
      this.page.currentPage = current;
    },
    // 获取产品分类下拉框数据
    getDropList() {
      getProType({ parentId: 0 }).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.optionList = res.data.data;
          this.filters.productType = this.optionList[0].id;
        }
      });
    },
  },
  mounted() {
    this.getDropList();
  },
};
</script>

<style scoped>
.input-sty {
  width: 300px;
}
.btn-sty1 {
  margin-right: 80px;
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
.btn-flex-sty {
  display: flex;
  justify-content: center;
  align-items: center;
}
.relate-btn {
  margin-left: 30px;
}
.relate-pro-name {
  margin: 15px 0 15px 0;
}
</style>