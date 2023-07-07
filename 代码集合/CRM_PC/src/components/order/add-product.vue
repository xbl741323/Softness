<template>
  <div class="add-order-product">
    <el-form :model="filters" ref="filters" @keyup.enter.native="getAllList()" inline :rules="rules">
      <div class="source-group-sty">
        <el-form-item label="下单渠道：" class="source-group-sty">
          <el-radio-group v-model="filters.orderSource" class="source-group-sty" @change="changeOrderSource()">
            <el-radio :label="0" class="source-radio-sty">卧涛平台</el-radio>
            <el-radio :label="1" class="source-radio-sty">电商平台</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="filters.orderSource == 1">
          <el-select v-model="filters.platformName" class="platform-select-sty">
            <el-option
              v-for="(item, index) in platformOptions"
              :key="index"
              :label="item.title"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="filters.orderSource == 1" prop="platformOrderNo">
          <el-input
            @change="filters.platformOrderNo = oninput(filters.platformOrderNo)"
            @keyup.native="filters.platformOrderNo = oninput(filters.platformOrderNo)"
            v-model.trim="filters.platformOrderNo"
            class="input-sty"
            placeholder="请输入12/19位电商订单编号">
          </el-input>
        </el-form-item>
      </div>
      <el-form-item label="产品类型：">
        <el-select v-model="filters.productType" @change="changeType">
          <el-option
            v-for="(item, index) in optionList"
            :key="index"
            :label="item.categoryName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-input v-model.trim="filters.keyWords" class="input-sty" placeholder="请输入产品编号或产品名称关键字"></el-input>
      </el-form-item>
      <el-button type="primary" @click="getAllList()">搜索</el-button>
      <el-button @click="reset()">重置</el-button>
    </el-form>
    <avue-crud
      class="batch-choose"
      ref="crud"
      :option="option"
      :page.sync="page"
      :data="dataList"
      @selection-change="selectionChange"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
    </avue-crud>
    <div v-for="(item, index) in selectOption" :key="index" class="select-list">
      <span>{{ item.spuCode }}</span>-
      <span>{{ item.spuTitle }}</span>
      <i class="el-icon-close pointer" @click="delProduct(item, index)"></i>
    </div>
    <div class="btn-footer">
      <el-button size="nedium" type="primary" class="right-btn-sty" @click="validateSubmit()">下一步</el-button>
      <el-button size="nedium" @click="cancel()">取消</el-button>
    </div>
  </div>
</template>
<script>
import { getFollowProduct, getProType } from "@/api/new-client/clue";
import { tableOption } from "@/const/crud/new-client/follow-product";
export default {
  props: {
    existOrder: {
      type: Array,
    },
  },
  data() {
    var validatePlatformNo = (rule, value, callback)=>{//联系人手机号码验证
      if((value != ''&&value.length==12) || (value != ''&&value.length==19)){
        callback();
      }else{
        callback(new Error('请输入12/19位电商订单编号'));
      };
    };
    return {
      optionList: [],
      selectOption: [],
      listLoading: true,
      option: tableOption,
      multipleNum: 5,
      filters: {
        keyWords: "",
        productType: 1,
        orderSource: 0, // 下单渠道
        platformName: 2, // 电商平台-默认电商京东
        platformOrderNo: "", // 电商订单编号
      },
      platformOptions: [
        {
          title: "京东",
          value: 2,
        },
        {
          title: "淘宝",
          value: 3,
        },
      ],
      dataList: [],
      page: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条,
        isAsc: false, // 是否倒序
        isOnline: 1, //是否线上交易
      },
      idList: [],
      specificationList: [],
      priceInfo: [],
      modelform: {
        skuList: [],
      },
      orderList: [],
      hasSelected: [],
      rules: {
        platformOrderNo: [{ required: true, validator: validatePlatformNo, trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getDropData();
  },
  methods: {
    changeOrderSource() {
      this.multipleNum = this.filters.orderSource == 0 ? 5 : 1;
      this.getselectedData();
    },
    // 校验数字
    oninput(value) {
      value = value.replace(/^0*(0\.|[1-9])/, "$1");
      value = value.replace(/[^\d]/g, ""); //清除"数字"以外的字符
      value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
      value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
      value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      value =
        value.indexOf(".") > 0
          ? value.split(".")[0].substring(0, 10) + "." + value.split(".")[1]
          : value.substring(0, 19);
      return value;
    },
    delProduct(row) {
      this.selectOption.forEach((item,index)=>{
        if(item.id == row.id){
          this.selectOption.splice(index, 1);
          this.$refs.crud.toggleRowSelection(row, false);
        }
      })
    },
    changeType() {
      this.getAllList();
    },
    filterOrderSource() {
      if (this.filters.orderSource == 0) {
        return 1;
      } else {
        return this.filters.platformName;
      }
    },
    validateSubmit(){
      this.$refs['filters'].validate(valid=>{
        if(valid){
          this.submit()
        }
      })
    },
    submit() {
      if(this.selectOption.length == 0){
        this.$message({
          type: "warning",
          message: "请至少选择一个产品",
          offset: 300,
        });
      } else if (this.selectOption.length <= this.multipleNum) {
        let orderChannel = this.filterOrderSource();
        this.$emit(
          "selectProduct",
          this.selectOption,
          orderChannel,
          this.filters.platformOrderNo
        );
      } else {
        this.$message({
          type: "warning",
          message: "最多选择" + this.multipleNum + "个产品！",
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
      this.selectOption = val;
      if (val.length + this.existOrder.length > 20) {
        this.$message.warning("最多选择20个产品");
        this.getselectedData();
      } else {
        this.idList = [];
        this.selectOption.forEach((element) => {
          this.idList.push(element.id);
        });
        this.getselectedData();
      }
    },
    reset() {
      this.filters.keyWords = "";
      this.filters.productType = 1;
      this.getAllList();
    },
    getselectedData() {
      let that = this;
      if (that.existOrder && that.existOrder.length > 0) {
        that.dataList.forEach((item) => {
          item.checked = false;
          that.existOrder.forEach((el) => {
            if (item.id == el.spuId) {
              item.checked = true;
            }
          });
        });
      }
      if (that.selectOption.length >= that.multipleNum) {
        that.dataList.forEach((item) => {
          item.checked = true;
          that.selectOption.forEach((cItem) => {
            if (item.id == cItem.id) {
              item.checked = false;
            }
          });
        });
      } else if (that.selectOption.length < that.multipleNum) {
        that.dataList.forEach((item) => {
          item.checked = false;
        });
      } else {
        if (that.selectOption.length + that.existOrder.length >= 20) {
          that.dataList.forEach((item) => {
            if (this.idList.includes(item.id)) {
              item.checked = false;
            } else {
              item.checked = true;
            }
          });
        } else {
        }
      }
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
          this.page.total = res.data.data.total;
          //编辑回显
          if (this.existOrder && this.existOrder.length > 0) {
            this.dataList.forEach((item) => {
              item.checked = false;
              this.existOrder.forEach((el) => {
                if (item.id == el.spuId) {
                  item.checked = true;
                }
              });
            });
          }
          this.getselectedData();
          this.idList = [];
          this.selectOption.forEach((item) => {
            if (!this.idList.includes(item.id)) {
              this.idList.push(item.id);
            }
          });
        }
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
.add-order-product {
  margin: 0;
}
.input-sty {
  width: 240px;
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
.pointer {
  cursor: pointer;
  margin-left: 10px;
}
.source-group-sty {
  display: flex;
  align-items: center;
}
.source-radio-sty {
  display: flex;
  align-items: center;
}

.platform-select-sty {
  width: 80px;
}
</style>