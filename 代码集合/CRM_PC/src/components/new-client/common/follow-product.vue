<template>
  <div class="follow-product">
    <el-form :model="filters" @keyup.enter.native="getAllList()" inline>
      <el-form-item label="产品类型：">
        <el-select v-model="filters.productType" @change="changeType">
          <el-option v-for="(item,index) in optionList" :key="index" :label="item.categoryName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-input v-model.trim="filters.keyWords" class="input-sty" placeholder="请输入产品编号或产品名称关键字"></el-input>
      </el-form-item>
      <el-button type="primary" @click="getAllList()">搜索</el-button>
      <el-button @click="reset()">重置</el-button>
    </el-form>
    <avue-crud class="batch-choose" ref="crud" :option="option" :page.sync="page" :data="dataList"
      @selection-change="selectionChange"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
    </avue-crud>
     <div v-for="(item,index) in selectOption" :key="index" class="select-list">
       <span>{{item.spuCode}}</span>-
       <span>{{item.spuTitle}}</span>
     </div>
    <div class="btn-footer">
      <el-button size="nedium" type="primary" class="right-btn-sty" @click="submit()">确定</el-button>
      <el-button size="nedium" @click="cancel()">取消</el-button>
    </div>
  </div>
</template>
<script>
import { getFollowProduct, getProType } from "@/api/new-client/clue";
import { tableOption } from "@/const/crud/new-client/follow-product";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  props:['selectPro'],
  data() {
    return {
      optionList: [],
      selectOption: [],
      listLoading: true,
      option: tableOption,
      filters: {
        productType: 1,
        keyWords: "",
      },
      dataList: [],
      page: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
      },
      idList: []
    };
  },
  mounted() {
    this.getDropData();
  },
  methods: {
    changeType() {
      this.getAllList();
    },
    submit() {
      if (this.selectOption.length <= 3) {
        this.$emit("selectProduct", this.selectOption);
      } else {
        this.$message({
          type: "warning",
          message: "最多选择3个产品！",
          offset: 300,
        });
      }
    },
    cancel() {
      this.$emit("closeDialog");
      this.selectOption = [];
    },
    getDropData() {
      let params = {
        parentId: 0,
      };
      getProType(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.optionList = res.data.data;
        }
      });
    },
    selectionChange(val) {
      this.idList = [];
      this.selectOption.forEach(element => {
        this.idList.push(element.id);
      })
      this.selectOption = val;
      if(this.selectOption.length >= 3){
        this.$message({
          type: "warning",
          message: "最多选择3个产品！",
          offset: 300,
        });
      }
      this.getselectedData()
    },
    reset() {
      this.filters.keyWords = "";
      this.filters.productType = 1;
      this.getAllList();
    },
    getselectedData(){
      if (this.selectOption.length >= 3) {
        this.dataList.forEach((item) => {
          item.checked = true;
          this.selectOption.forEach((cItem) => {
            if ( item.id == cItem.id) {
              item.checked = false;
            }
          });
        });
      } else {
        this.dataList.forEach((item) => {
          item.checked = false;
        });
      };
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      let params = {
        categoryId: this.filters.productType,
        keywords: this.filters.keyWords,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      getFollowProduct(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let result = res.data.data.records;
          result.forEach((item) => {
            item.checked = false;
          });
          this.dataList = result;
          this.getselectedData()
          this.page.total = res.data.data.total;
          //编辑回显
          if(this.selectPro.length > 0){
            this.dataList.forEach(item => {
              this.selectPro.forEach(el => {
                if(item.id == el.id ){
                  if(!this.idList.includes(el.id)){
                    this.$refs.crud.toggleRowSelection(item, true);
                  };
                }
              });
            });
          };
          this.idList = [];
          this.selectOption.forEach(item => {
            if(!this.idList.includes(item.id)){
              this.idList.push(item.id);
            }
          });
        };
      });
    },
    sizeChange(val) {
      this.page.pageSize = val;
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
.btn-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.right-btn-sty {
  margin-right: 80px;
}
.select-list {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
</style>