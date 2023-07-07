
<template>
  <el-dialog v-if="countDialog" :visible.sync="countDialog" :modal="pageFrom == 1 ? false : true" :close-on-click-modal="false"  width="50%">
    <el-form :model="filters" ref="filters" inline @keydown.enter.native="getAllList()">
      <el-form-item label="产品类型：" prop="productType" class="mr">
        <el-select v-model="filters.productType" @change="changeType()">
          <el-option 
            v-for="item in optionList" 
            :key="item.id" 
            :label="item.categoryName"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字：" prop="productName">
        <el-input placeholder="请输入产品编号或产品名称关键字" class="input-sty" v-model="filters.productName">
        </el-input>
      </el-form-item>
      <el-button type="primary" class="relate-btn" @click="getAllList()">搜索</el-button>
      <el-button class="relate-btn" @click="resetForm()">重置</el-button>
    </el-form>
     <!-- 勾选产品回显 -->
     <!-- <div class="pro-contain" v-if="policyIdList.length > 0">
      <div class="policy-item" v-for="(item,index) in policyIdList" :key="item.spuId">
        <span>{{ item.spuTitle }}</span>
        <i class="el-icon-delete delete-sty" @click="deleteProItem(item,index)"></i>
      </div>
    </div> -->
    <div class="mt">
      <el-tag
        class="mtr"
        v-for="(item, index) in policyIdList"
        :key="item.id"
        type=""
        :disable-transitions="true">
        {{item.spuTitle}}
        <i class="el-icon-close" @click="deleteRow(index)"></i>
      </el-tag>
    </div>
    <el-table ref="multipleTable" border :row-key="rowKey" :data="dataList" class="table" @selection-change="handleSelectionChange" :header-cell-class-name="cellClass" >
      <el-table-column type="selection" :reserve-selection="true" :selectable="radioBox"></el-table-column>
      <el-table-column label="产品编号" prop="spuCode"></el-table-column>
      <el-table-column label="产品类型" prop="categoryName"></el-table-column>
      <el-table-column label="产品名称" prop="spuTitle"></el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next, total"
      @current-change="currentChange"
      :current-page="page.currentPage"
      :page-size="10"
      :total='page.total'
    ></el-pagination>
    <!-- <avue-crud 
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
    </avue-crud> -->
    <div class="btn-flex-sty">
      <el-button size="medium" type="primary" class="btn-left-sty" :disabled="policyIdList == 0 ? true : false" @click="addProduct()">确定</el-button>
      <el-button size="medium" @click="handClose()">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getProType } from "@/api/new-client/clue";
import { getRelatedProducts } from "@/api/project/wtClass";
import * as CodeMsg from "@/api/common/CodeChange";
import { clientOption } from "@/const/crud/policy/relate-product";
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
      rowList: [],
      disabledIds: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [5, 10],
      },
    };
  },
  methods: {
    // 删除单个勾选产品
    deleteProItem(item, index) {
      this.policyIdList.splice(index, 1)
      this.dataList.forEach(pItem => {
        if (item.spuId == pItem.id) {
          this.$refs.crud.toggleRowSelection(pItem, false);
        }
      })
    },
    resetForm() {
      this.filters.productType = this.optionList[0].id;
      this.filters.productName = "";
      this.getAllList();
    },
    changeType() {
      this.getAllList();
    },
    addProduct() {
      if (this.policyIdList.length < 6) {
        let policyIdList = JSON.parse(JSON.stringify(this.policyIdList))
        this.$emit("receive-product", policyIdList);
        this.countDialog = false;
        this.rowList = []
      } else {
        this.$message({
          type: "warning",
          message: "最多添加5个产品！",
          offset: 300,
        });
      }
    },
    cellClass(row){
      if(row.columnIndex == 0){
        return 'disabledSelection'
      }
    },
    rowKey(row) {
      return row.id
    },
    radioBox(row){
      if(row.able){
        return true;
      }else{
        return false;
      }
    },
    //删除标签
    deleteRow(index) {
      let i = this.dataList.findIndex(item => item.id === this.policyIdList[index].id)
      if (i >= 0) {
        this.$refs.multipleTable.toggleRowSelection(this.dataList[i], false);
      } else {
        this.disabledIds.push(this.policyIdList[index].id)
        this.policyIdList.splice(index, 1)
      }
      this.disabledBox()
    },
    handleSelectionChange(row){
      //取消勾选判断
      if (this.rowList.length > row.length) {
        let missingItems = this.rowList.filter(item1 =>
          !row.some(item2 => item1.id === item2.id && item1.spuTitle === item2.spuTitle)
        );
        this.policyIdList.splice(this.policyIdList.findIndex(item => item.id === missingItems[0].id), 1)
      }
      //勾选判断
      row.forEach((item, index) => {
        if (!this.isIdInArray(item.id, this.policyIdList)) {
          this.policyIdList.push(item)
        }
      })
      this.disabledBox()
      this.rowList = JSON.parse(JSON.stringify(row))
    },
    // 添加产品数据
    disabledBox(val) {
      //禁用多选选框
      if (this.policyIdList.length >= 5) {
        this.dataList.forEach(item => {
          if (!this.isIdInArray(item.id, this.policyIdList)) {
            this.$set(item, 'able', false)
          }
        })
      } else {
        this.dataList.forEach(item => {
          this.$set(item, 'able', true)
        })
      }
    },
    isIdInArray(objectId, objectArray) {
      for (let i = 0; i < objectArray.length; i++) {
        if (objectArray[i].id === objectId) {
          return true;
        }
      }
      return false;
    },
    // 外部调用显示弹窗
    showProduct() {
      this.countDialog = true;
    },
    // 产品回显
    setProList(val) {
      this.policyIdList = val
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      let params = {
        pageNo: this.page.currentPage,
        pageSize: 10,
        categoryId: this.filters.productType,
        keywords: this.filters.productName,
        status: "1",// 上架产品
      };
      getRelatedProducts(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let r = res.data.data
          this.dataList = r.records;
          this.page.total = r.total;
          this.$nextTick(() => {
            let policyIdList = []
            this.dataList.forEach(item => {
              if (!this.isIdInArray(item.id, this.policyIdList) && this.policyIdList.length >= 5) {
                this.$set(item, 'able', false)
              } else {
                this.$set(item, 'able', true)
              }
              if (this.isIdInArray(item.id, this.policyIdList)) {
                policyIdList.push(item)
              }
            })
            policyIdList.forEach(item => {
              this.$refs.multipleTable.toggleRowSelection(item, true);
            })
            if (this.disabledIds.length > 0) {
              this.disabledIds.forEach(item => {
                let i = this.dataList.findIndex(val => val.id == item)
                if (i >= 0) {
                  this.$refs.multipleTable.toggleRowSelection(this.dataList[i], false);
                }
              })
            }
          })
          // this.setCheckd()
        }
      });
    },
    // 处理勾选项
    setCheckd() {
      this.$nextTick(() => {
        this.dataList.forEach(item => {
          this.policyIdList.forEach(cItem => {
            if (item.id == cItem.spuId) {
              this.$refs.crud.toggleRowSelection(item, true);
            }
          })
        })
      })
    },
    handClose() {
      this.countDialog = false;
      this.policyIdList = []
      this.dataList = []
      this.rowList = []
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getAllList();
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.getList();
    },
    // 获取产品分类下拉框数据
    getDropList() {
      getProType({ parentId: 0 }).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.optionList = res.data.data;
          this.filters.productType = this.optionList[0].id;
          this.getList()
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

.btn-left-sty {
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
  margin-left: 15px;
}

.relate-pro-name {
  margin: 15px 0 15px 0;
}

.mr {
  margin-right: 15px;
}

.table {
  margin-top: 10px;
}

/* 去除table表头的全选框 */
.el-table /deep/.disabledSelection .cell .el-checkbox__inner{ 
    display: none;
    position: relative;
}

.el-table /deep/.disabledSelection .cell:before{
    content: '';
    position: absolute;
}

.el-pagination{
  text-align: center;
  margin: 15px 0;
}

.mtr {
  margin-right: 8px;
  margin-top: 5px;
}

.mt {
  margin: 5px 0 15px 0;
}

.policy-item {
  margin-bottom: 2px;
}

.delete-sty {
  margin-left: 4px;
  cursor: pointer;
}
.pro-contain{
  margin-bottom: 4px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>