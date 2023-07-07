<template>
  <div class="operate_records">
    <div class="left_span">
      <span></span>
      <span>{{ $t("message.operateLog") }}</span>
    </div>
    <div class="table_main">
      <el-form :model="filters" ref="filters" inline @keyup.enter.native="getAllOperate()">
        <el-form-item :label="$t('label.keywords')" prop="keyWords">
          <el-input placeholder="请输入标题关键字或数据编号" style="width:200px" v-model="filters.keyWords"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.belongMenu')+'：'" style="margin-left:20px;" prop="modelSpan">
          <el-select :placeholder="$t('message.pleaseSelect')" v-model="filters.modelSpan">
            <el-option :label="$t('status.all')" :value="null"></el-option>
            <el-option label="江苏站" :value="1"></el-option>
            <el-option label="政策广场" :value="2"></el-option>
            <el-option label="产品管理" :value="3"></el-option>
            <el-option label="栏目管理" :value="4"></el-option>
            <el-option label="权限管理" :value="5"></el-option>
            <el-option label="员工管理" :value="6"></el-option>
            <el-option label="网站设置" :value="7"></el-option>
            <el-option label="合同管理" :value="8"></el-option>
            <el-option label="订单管理" :value="9"></el-option>
            <el-option label="客户管理" :value="10"></el-option>
            <el-option label="公海管理" :value="11"></el-option>
            <el-option label="系统设置" :value="12"></el-option>
            <el-option label="回款管理" :value="13"></el-option>
            <el-option label="任务管理" :value="14"></el-option>
            <el-option label="微信管理" :value="15"></el-option>
            <el-option label="流程管理" :value="16"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item :label="$t('label.createTime')+'：'" style="margin-left:20px;" prop="publishTime">
              <el-date-picker
                @change="showTime"
                v-model="filters.publishTime"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                :range-separator="$t('message.to')"
                :start-placeholder="$t('message.startTime')"
                :end-placeholder="$t('message.endTime')"
                :unlink-panels="true"
              ></el-date-picker>
            </el-form-item>
        <el-button  icon="el-icon-search" style="width:80px;margin-left:20px;" type="primary" @click="getAllOperate">搜索</el-button>
        <el-button icon="el-icon-delete" @click="reset">清空</el-button>
      </el-form>
      <el-table :data="dataList" border>
        <el-table-column prop="createTime" :label="$t('label.createTime')" align="center"></el-table-column>
        <el-table-column prop="operateContent" :label="$t('table.title')" align="center"></el-table-column>
        <el-table-column prop="associationId" label="数据编号" align="center">
            <template slot-scope="scope">
                   <span>{{scope.row.associationId ?scope.row.associationId :'无'}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="menu" :label="$t('message.belongMenu')" align="center"></el-table-column>
      </el-table>
       <el-pagination
      @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      :page-sizes="[10,20,30,40,50]"
      :page-size="20"
      background
      :total="total"
      style="float:right;margin-top:20px;margin-right:20px;"
    ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getInfoByUsername } from "@/api/admin/user";
export default {
  props: ["userName"],
  data() {
    return {
      total:0,
      currentPage:1,
      pageSize:20,
      filters: {
        keyWords: "",
        modelSpan: null,
        publishTime:[]
      },
      dataList: []
    };
  },
  methods: {
    reset(){
      this.$refs['filters'].resetFields();
      this.getAllOperate()
    },
    handleSizeChange(val) {
        this.pageSize = val
        this.getOperate()
      },
    showTime(val) {},
    getAllOperate(){
      this.currentPage = 1
      this.getOperate()
    },
    handleCurrentChange(val){
      this.currentPage = val
      this.getOperate()
    },
    getOperate() {
      let params = {
        size:this.pageSize,
        start:this.currentPage,
        username: this.userName,
        menuType: this.filters.modelSpan,
        operateContent: this.filters.keyWords.trim(),
        startTime: this.filters.publishTime.length == 0 ?"":this.$moment(this.filters.publishTime[0]).format( "YYYY-MM-DD HH:mm:ss"),
        endTime: this.filters.publishTime.length == 0 ?"":this.$moment(this.filters.publishTime[1]).format("YYYY-MM-DD HH:mm:ss"),
      };
      getInfoByUsername(params).then(res => {
        this.dataList = res.data.data.list
        this.total = res.data.data.total
      });
    }
  },
  mounted() {
    this.getOperate();
  }
};
</script>

<style scoped>
.operate_records{
  padding-bottom: 150px;
}
.left_span {
  width: 100px;
  height: 25px;
  display: flex;
  margin: 40px 0 25px 0px;
}
.left_span > span:nth-of-type(1) {
  display: inline-block;
  width: 10px;
  height: 25px;
  background: #108ee9;
}
.left_span > span:nth-of-type(2) {
  display: flex;
  width: 80px;
  height: 25px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #666666;
  font-weight: bold;
}
</style>