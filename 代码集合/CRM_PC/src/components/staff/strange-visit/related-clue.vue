<template>
  <div class="related-contain">
    <el-dialog
      title="选择陌拜记录关联线索"
      width="1000px"
      :center="true"
      :modal="false"
      :visible.sync="relatedDialog"
      v-if="relatedDialog"
      :close-on-click-modal="false"
      :before-close="handldeClose">
      <span class="client-name-sty">线索类型：</span>
      <el-radio-group v-model="filters.clueType" @change="changeTab()">
        <el-radio-button border :label="2" class="client-btn-sty">单位</el-radio-button>
        <el-radio-button border :label="1" class="client-type-sty">个人</el-radio-button>
      </el-radio-group>
      <el-form :model="filters" inline class="form-sty">
        <el-form-item label="关键字：">
          <el-input 
            class="input-sty" 
            v-model.trim="filters.keyWords" 
            @keyup.enter.native="getAllList()" 
            :placeholder="filters.clueType==2?'请输入线索名称/线索编号/信用代码':'请输入线索名称/线索编号/手机号'">
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="getAllList()">搜索</el-button>
        <el-button @click="reset()">重置</el-button>
      </el-form>
      <div v-show="filters.clueType == 2">
        <avue-crud
        ref="crud"
        class="batch-choose"
        v-loading="tableLoading"
        :data="dataList"
        :option="tableOption"
        :page.sync="page"
        @selection-change="selectionChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @on-load="getList">
      </avue-crud>
      </div>
      <div v-show="filters.clueType == 1">
        <avue-crud
        ref="crud"
        class="batch-choose"
        v-loading="tableLoading"
        :data="dataList"
        :option="personOption"
        :page.sync="page"
        @selection-change="selectionChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @on-load="getList">
      </avue-crud>
      </div>
      <div class="btn-contain">
        <el-button size="medium" class="btn-right-sty" type="primary" @click="checkSubmit()">确定</el-button>
        <el-button size="medium" @click="handldeClose()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getVisitConnectClue,batchVisitConnection } from "@/api/staff/meet-visit"
import { tableOption, personOption } from "@/const/crud/staff/related-clue";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  data() {
    return {
      filters: {
        keyWords: "",
        clueType: 2,
      },
      previewImg: "",
      relatedDialog: false,
      dataList: [
        {
          clueNo: "xs3434343434",
          clueName: "滔滔科技滔滔科技滔滔科技",
          organization: "3434343434343434",
          contractName: "胡桃",
          mobile: "17730078761",
          createTime: "2022-03-12 12:34",
        },
      ],
      tableLoading: false,
      tableOption: tableOption,
      personOption: personOption,
      page: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
        pageSizes: [5, 8, 10, 20, 30, 50, 100],
      },
      selectClueList:[],
      selectVisitList:[],
    };
  },
  methods: {
    selectionChange(val) {
      this.selectClueList = val;
    },
    // 校验至少选择一条线索
    checkSubmit(){
      if(this.selectClueList.length == 0||this.selectClueList.length > 1){
        this.$message({
          type:"warning",
          message: this.selectClueList.length ==0 ? "请选择一条关联线索！":"最多只能选择一条关联线索！",
          offset: 300
        })
      }else{
        this.submit()
      }
    },
    submit() {
      this.$confirm("确定把所选陌拜记录关联到此线索？", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
      }).then(() => {
        this.batchConnection()
      });
    },
    batchConnection(){
      let clueInfo = this.selectClueList[0]
      let params = {
        clueType:this.filters.clueType,
        clueNo:clueInfo.clueNo,
        clueName: this.filters.clueType == 2?clueInfo.companyName:clueInfo.contactName,
        clueId: this.filters.clueType == 2?clueInfo.clueCompanyId:clueInfo.cluePersonId,
        visitIds: this.selectVisitList
      }
      batchVisitConnection(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:"success",
            message:"操作成功！",
            offset: 300
          })
          this.relatedDialog = false
          this.$emit("closeDialog")
        }
      })
    },
    handldeClose() {
      this.relatedDialog = false;
    },
    changeTab() {
      this.getAllList()
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
    currentChange(val) {
      this.page.currentPage = val;
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      this.tableLoading = true
      let params = {
        keywords:this.filters.keyWords,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      getVisitConnectClue(params,this.filters.clueType).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          let r = res.data.data
          this.dataList = r.records
          this.page.total = r.total
          this.tableLoading = false
        }
      })
    },
    reset() {
      this.filters.keyWords = "";
      this.getAllList();
    },
  },
};
</script>

<style scoped>
.related-contain {
  z-index: 999 !important;
}
.client-btn-sty {
  margin: 0 20px 0 5px;
}
.client-type-sty {
  border-left: 1px solid #dcdfe6;
}
.input-sty {
  width: 280px;
}
.form-sty {
  margin-top: 20px;
}
.btn-contain {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.btn-right-sty {
  margin-right: 50px;
}
</style>