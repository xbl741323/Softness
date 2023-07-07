<template>
  <div class="frame"
    v-loading="loading"
    :element-loading-text="promtMessage"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-form :inline="true" :model="fileForm" @submit.native.prevent>
      <el-form-item :label="$t('label.keywords')" prop="keyWords">
        <el-input
          style="width:320px"
          v-model="fileForm.keyWords"
          placeholder="请输入客户名称/更新人姓名关键字/完整信用代码"
          @keyup.enter.native="getAllList()"
        />
      </el-form-item>
      <el-button size="small" type="primary" @click="getAllList()">搜索</el-button>
      <el-button size="small" type="warning" @click="reSet()">重置</el-button>
    </el-form>
    <avue-crud
      ref="crud"
      class="batch-choose"
      :page.sync="page"
      :data="tableData"
      :option="tableOption"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList"
    >
      <template slot="customerName" slot-scope="scope">
        <span class="file-name" @click="goCustomerDetail(scope.row)">{{ scope.row.customerName }}</span>
      </template>
      <template slot="updateByName" slot-scope="scope">
        <el-tooltip effect="dark" :content="tooltipContent" placement="top-start" v-if="scope.row.updateBy">
          <span @mouseover="showUserInfo(scope.row.updateBy)">
            {{ scope.row.updateByName }}
          </span>
        </el-tooltip>
        <span v-else>-</span>
      </template>
      <template slot="updateTime" slot-scope="scope">
        <span>{{ scope.row.updateTime || '-' }}</span>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { tableOption} from "@/const/crud/documentLibrary/customer-files";
import * as CodeMsg from "@/api/common/CodeChange"
import { pageCustomer} from "@/api/task/index";
import { saveDetal } from "@/util/clearDetail";
import { mixin } from "@/mixins/userInfo";
export default {
  mixins: [mixin],
  data() {
    return {
      loadstatus:'',
      promtMessage: "",
      loading: false,
      isResouceShow: 0,
      tableData: [],
      tableOption: tableOption,
      fileForm: {
        keyWords:"",
      },
      roleList: [],  
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 15, // 每页显示多少条
        pageSizes:[5,10,15,20,30,50,100]
      },
    };
  },
  created(){
    if(sessionStorage.getItem(`${this.$route.path}`)){
      let keepParams = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
      if(keepParams.detail.path!==''){
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query
        })
        return;
      }
      this.fileForm.keyWords = keepParams.params.keyWords
      this.page.currentPage = keepParams.params.currentPage
      this.page.pageSize = keepParams.params.pageSize
    }
  },
  watch: {
    loadstatus(val) {
      if (val == undefined) {
        this.loading = true;
      } else {
        this.loading = false;
      }
    }
  },
  methods: {
    // 列表
    getList() {
      let param = {
        keyword: this.fileForm.keyWords.trim(),
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      }
      let keepParams = {   
        params: {
          keyWords: this.fileForm.keyWords,
          currentPage: this.page.currentPage,
          pageSize: this.page.pageSize
        },
        detail:{
          path:'',
          query:{}
        }
      } 
      //保存页面信息
      sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
      pageCustomer(param).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          this.tableData = res.data.data.records;
          this.page.total = res.data.data.total;
        }else{
          this.$message({
            type:'warning',
            message:res.data.data
          })
        }
      }).catch(err => {
        console.log(err);
      });
    },
    getAllList(){
      this.page.currentPage = 1;
      this.getList();
    },
    goCustomerDetail(row){
      let path = "/customer-files-detail"
      let query = {
        customerId: row.customerId,
        customerName: row.customerName,
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    sizeChange(val){
      this.page.pageSize = val;
      this.getList();
    },
    //重置
    reSet() {
      this.fileForm.keyWords = ""
      this.getAllList();
    },
  },
};
</script>

<style scoped>
.titslot{
  color: #409EFF;
  cursor: pointer;
}
.frame {
  width: 100%;
  padding: 10px 20px;
  background: #fff;
}
.promt {
  position: relative !important;
}
.promt-box {
  position: fixed !important;
  width: 100px;
  height: 50px;
  margin-left: 50%;
  background: gainsboro;
}
.table-list {
  margin-top: 10px;
}
.table {
  margin-top: 10px;
}
.footer {
  width: 500px;
  margin-top: 10px;
  margin: 0 auto;
}
.upload {
  margin: 20px;
}
.title {
  width: 150px;
  margin: 0 auto;
  font-size: 16px;
  text-align: center;
  margin-top: -40px;
}
.box {
  width: 100%;
  overflow: hidden;
}
.related_article {
  font-size: 12px;
  color: #36a6fe;
  cursor: pointer;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.btn {
  float: right;
  margin-top: 10px;
}
.choose-file {
  text-align: center;
  margin: 10px;
}
.batchOperate {
  margin: 10px 0;
}
.dialogBtn {
  margin-top: 40px;
  text-align: center;
}
.file-name {
  color: #36a6fe;
  cursor: pointer;
}
</style>