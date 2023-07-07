<template>
  <div class="allot">
    <el-form v-model="filters" inline @keyup.enter.native="getAllList()" class="form-sty">
      <el-form-item label="关键字：">
        <el-input class="key-width" v-model="filters.keyWords" placeholder="请输入操作人姓名或字段名称关键字"></el-input>
      </el-form-item>
      <el-form-item label="操作时间：" label-width="100px">
        <el-date-picker
          v-model="filters.activeTime"
          :unlink-panels="true"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" style="margin-left: 10px;" @click="getAllList">搜索</el-button>
      <el-button style="margin-left: 10px;" @click="reset">重置</el-button>
    </el-form>
    <avue-crud
      ref="crud"
      :table-loading="tableLoading"
      :page.sync="page"
      :data="dataList"
      @size-change="sizeChange"
      :option="tableOption">
      <template slot="operateEmpName" slot-scope="scope">
        <div class="disbale_content">
          <el-tooltip effect="dark" :content="'工号：'+scope.row.operatorNo +' 部门：' +scope.row.operatorDept" placement="right">
            <span>{{ scope.row.operatorName }}</span>
          </el-tooltip>
          <img v-if="scope.row.operatorLockFlag!==null&&scope.row.operatorLockFlag=='9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
        </div>
      </template>
      <template slot="field" slot-scope="scope">
        <div v-for="(item,index) in scope.row.property.split('|')" :key="index">{{ item }}</div>
      </template>
      <template slot="oldValue" slot-scope="scope">
        <div v-for="(item,index) in scope.row.oldValue.split('|')" :key="index">{{ item }}</div>
      </template>
      <template slot="newValue" slot-scope="scope">
        <div v-for="(item,index) in scope.row.newValue.split('|')" :key="index">{{ item }}</div>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange"
import { tableOption } from "@/const/crud/user/allot";
import { getActList, getUserOperateRecords } from "@/api/admin/user";
export default {
  props: ["id","type"],
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      tableLoading:false,
      tableOption: tableOption,
      filters: {
        keyWords:"",
        activeTime:null,
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
      },
      dataList: [],
    };
  },
  methods: {
    reset(){
      this.filters.keyWords = ""
      this.filters.activeTime = null
      this.getAllList()
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getAllList()
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      this.tableLoading = true
      let params = {
        page: JSON.stringify({
          size: this.page.pageSize,
          current: this.page.currentPage,
        }),
        accountId: this.$route.query.id,
        token: this.type == 1?"pwd":""
      };
      if(this.filters.keyWords!==""){
       params.keyWords = this.filters.keyWords
      }
      if(this.filters.activeTime !== null){
       params.startTime = this.$moment(this.filters.activeTime[0]).format( "YYYY-MM-DD HH:mm:ss")
       params.endTime = this.$moment(this.filters.activeTime[1]).format( "YYYY-MM-DD HH:mm:ss")
      }
      getUserOperateRecords(params).then((res) => {
        if(res.data.code == CodeMsg.CODE_0){
          this.dataList = res.data.data.records;
          this.page.total = res.data.data.total;
          this.tableLoading = false
        }
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped>
.allot {
  width: 1200px;
  margin: 20px 10px;
}
.key-width{
  width: 300px;
}
.form-sty{
  margin-left: 22px;
}
.disbale_content{
  display: flex;
  justify-content: center;
}
.disable_img_sty{
  width:20px;
  height:20px;
  margin-left: 3px;
}
</style>