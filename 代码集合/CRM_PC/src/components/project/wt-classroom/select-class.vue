<template>
  <el-dialog v-if="plateVisble" :visible.sync="plateVisble" :modal="pageform == 0?true:false" :before-close="closePlate" :close-on-click-modal="false">
    <!-- 筛选区域 -->
    <div class="common-service">
      <el-form :model="filters" ref="filters" inline @keyup.enter.native="getAllList()">
        <el-form-item label="关键字：" prop="keyWords">
          <el-input class="input-sty" v-model.trim="filters.keyWords" placeholder="请输入课程标题关键字或精确课程编号"></el-input>
        </el-form-item>
        <el-form-item label="专业分类：" prop="themeType">
          <el-select v-model="filters.themeType">
          <el-option value="" label="全部"></el-option>
          <el-option v-for="(item,index) in optionList" :key="index" :label="item.categoryName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getAllList()">搜索</el-button>
        <el-button icon="el-icon-refresh-left" @click="resetForm()">重置</el-button>
      </el-form>
      <div class="batch-operate">
        <span class="handle-txt-select" v-if="this.batchList.length != 0">已选择<b>{{batchList.length}}</b>项</span>
      </div>
    <!-- 列表区域 -->
    <avue-crud
      class="batch-choose"
      ref="crud"
      :page.sync="page"
      :data="dataList"
      :option="option"
      :table-loading="tableLoading"
      @selection-change="selectionChange"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
      <template slot="classNumber" slot-scope="scope">
        <span>{{ scope.row.classNo }}</span>
      </template>
      <template slot="classTitle" slot-scope="scope">
        <span>{{ scope.row.baseTitle }}</span>
      </template>
      <template slot="themeType" slot-scope="scope">
        <div v-for="(item,index) in scope.row.listSubject" :key="index">{{item.subjectName}}</div>
      </template>
    </avue-crud>
    <div class="plate-btn">
      <el-button size="medium" type="primary" class="confirm-btn" @click="submitSelect()">确定</el-button>
      <el-button size="medium" @click="closePlate">取消</el-button>
    </div>
    </div>
  </el-dialog>
</template>

<script>
import { getOptionList, getClassList } from "@/api/project/wtClass";
import * as CodeMsg from "@/api/common/CodeChange";
import { tableOption } from "@/const/crud/wt-classroom/select-class";
export default {
  props:['pageform'], // 0-列表页 1-组件页面
  data() {
    return {
      originalCourseIds:[],
      plateVisble: false,
      optionList: [],
      batchList: [],
      senior: false,
      tableLoading: false,
      dataList: [],
      option: tableOption,
      filters: {
        keyWords: "",
        showStatus: "1",
        publishTime: null,
        themeType: "",
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
    };
  },
  methods: {
    submitSelect(){
      this.$emit('selectClass',this.batchList)
    },
    closePlate(){
      this.plateVisble = false
      this.batchList = []
      this.filters.keyWords = ""
      this.filters.themeType = ""
    },
    selectionChange(val) {
      this.batchList = [];
      val.forEach((item) => {
        this.batchList.push({
          id:item.id,
          title:item.baseTitle
        });
      });
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        keyWord: this.filters.keyWords,
        // baseShowState: this.filters.showStatus,
        startPublishTime:
          this.filters.publishTime == null
            ? ""
            : this.$moment(this.filters.publishTime[0]).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
        endPublishTime:
          this.filters.publishTime == null
            ? ""
            : this.$moment(this.filters.publishTime[1]).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
      };
      if (this.filters.themeType !== "") {
        params.listSubject = [{ subjectId: this.filters.themeType }];
      }
      getClassList(params, this.senior).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let r = res.data.data;
          this.dataList = r.records;
          this.page.total = r.total;
          this.filterCids()
        }
      });
    },
    // 复制disbaled
    filterCids(){
      this.dataList.forEach(pItem=>{
        pItem.isRelated = false
        if(this.originalCourseIds.length>0){
          this.originalCourseIds.forEach(item=>{
            if(pItem.id == item){
              pItem.isRelated = true
            }
         })
        }
      })
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    resetForm() {
      this.filters.keyWords = "";
      this.filters.themeType = "";
      this.getAllList();
    },
    // 获取产品分类下拉框数据
    getDropList() {
      getOptionList().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.optionList = res.data.data;
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
#handle-style {
  color: rgb(64, 158, 255) !important;
  cursor: pointer;
}
.senior-box {
  margin-bottom: 10px;
}
.batch-operate {
  margin-bottom: 10px;
}
.handle-txt-select {
  margin-right: 10px;
  font-size: 14px;
}
.wt-index-batch {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}
.wt-index-batch-confirm {
  margin-right: 40px;
}
.plate-btn{
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
.confirm-btn{
  margin-right: 100px;
}
.input-sty{
  width: 250px;
}
</style>