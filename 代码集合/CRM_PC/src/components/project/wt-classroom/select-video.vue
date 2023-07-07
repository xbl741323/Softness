<template>
  <!-- 选择视频弹窗 -->
    <el-dialog title="选择视频" :visible.sync="relateVisble" :center="true" width="50%" :close-on-click-modal="false">
      <el-form :model="mainForm" inline @keyup.enter.native="getMainList()">
        <el-form-item label="关键字：">
          <el-input v-model="mainForm.keyWords" placeholder="请输入视频标题关键字" class="main-input"></el-input>
        </el-form-item>
        <el-form-item label="专业分类：">
          <el-select v-model="mainForm.professionalType" @change="changeProType()">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in optionList" :key="index" :label="item.categoryName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="getMainList()">搜索</el-button>
        <el-button @click="resetMainForm()">重置</el-button>
      </el-form>
       <avue-crud
        v-if="relateVisble"
        class="batch-choose"
        ref="crud"
        :page.sync="mainPage"
        :data="mainDataList"
        :option="selectOption"
        @selection-change="selectionChange"
        @size-change="mainSizeChange"
        @current-change="mainCurrentChange"
        @on-load="getMainList">
        <template slot="professionalType" slot-scope="scope">
          <span>{{scope.row.professionalType|filterProType}}</span>
        </template>
       </avue-crud>
       <div class="wt-select-batch">
        <el-button type="primary" class="wt-select-batch-confirm" v-preventReClick @click="submitMinSelect()">确 定</el-button>
        <el-button @click="relateVisble = false">取 消</el-button>
      </div>
     </el-dialog>
</template>

<script>
let that = ""
import { getOptionList, getVideoList} from "@/api/project/wtClass";
import { selectOption } from "@/const/crud/project/select-video";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  data() {
    return {
      optionList: [],
       // 选择视频区域
      mainSelectList: [],
      mainForm: {
        keyWords: "",
        professionalType: "",
      },
      relateVisble: false,
      selectOption: selectOption,
      mainDataList: [],
      mainPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
    };
  },
  beforeCreate(){
    that = this
  },
  filters: {
    filterProType(val) {
     let result = that.optionList.filter(item=>{
        return item.id == val
      })
      return result.length>0? result[0].categoryName : '';
    },
  },
  mounted(){
    this.getDropList()
  },
  methods:{
    // 获取产品分类下拉框数据
    getDropList() {
      getOptionList().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.optionList = res.data.data;
        }
      });
    },
    /**
     * 关联课程区域
     */
    selectionChange(val) {
      this.mainSelectList = val;
    },
    changeProType() {
      this.$refs.crud.toggleSelection();
      this.currentPage = 1;
      this.getMainList();
    },
    oninput(value) {
      value = value.replace(/^0*(0\.|[1-9])/, "$1");
      value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
      value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
      value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      value = value.replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      value =
        value.indexOf(".") > 0
          ? value.split(".")[0].substring(0, 10) + "." + value.split(".")[1]
          : value.substring(0, 10);
      return value;
    },
    // 切换到否时重置时间
    changeView() {
      if (this.form.isView == 0) {
        this.form.second = 0;
        this.form.minute = 0;
      }
    },
    submitMinSelect() {
      if (this.mainSelectList.length > 1) {
        this.$message({
          type: "warning",
          message: "只能选择一个视频！",
          offset: 300,
        });
      } else {
        // 视频数组传给父组件
        this.$emit('selectVideo',this.mainSelectList)
      }
    },
    getMainList() {
      let params = {
        pageNo: this.mainPage.currentPage,
        pageSize: this.mainPage.pageSize,
        videoName: this.mainForm.keyWords,
        professionalType: this.mainForm.professionalType,
        classId: this.classId,
      };
      getVideoList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let r = res.data.data;
          this.mainDataList = r.records;
          this.mainPage.total = r.total;
        }
      });
    },
    mainSizeChange(val) {
      this.mainPage.pageSize = val;
    },
    mainCurrentChange(val) {
      this.mainPage.currentPage = val;
      this.getMainList();
    },
    resetMainForm() {
      this.mainForm.keyWords = "";
      this.mainForm.professionalType = "";
      this.mainPage.currentPage = 1;
      this.getMainList();
    },
  }
};
</script>

<style scoped>
.main-input {
  width: 200px;
}
.wt-select-batch {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.wt-select-batch-confirm {
  margin-right: 40px;
}
.custom-tree-node {
  font-size: 14px;
  margin-right: 5px;
}
.custom-node {
  display: flex;
  align-items: center;
}
.custom-node i {
  padding-top: 2px;
  font-size: 16px;
}
.row-sty{
  margin-top: 20px
}
</style>