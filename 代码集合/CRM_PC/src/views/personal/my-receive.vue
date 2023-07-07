<!-- 排查完成 -->
<template>
  <div class="offline-receive-frame">
    <el-form :model="filters" @keyup.enter.native="getAllList()" inline label-width="90px">
      <el-form-item label="关键字：">
        <el-input placeholder="请输入付款方名称/客户名称/回款去向关键字/回款编号" v-model="filters.keyWords" class="key-input" />
      </el-form-item>
      <el-form-item label="回款时间：">
        <el-date-picker
          style="width: 340px"
          v-model="filters.receiveTime"
          type="datetimerange"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getAllList()">搜索</el-button>
      <el-button type="warning" @click="resetList()">重置</el-button>
      <el-button type="primary" @click="getList('export')">导出</el-button>
    </el-form>
    <avue-crud
      ref="crud"
      :data="dataList"
      :option="receiveOption"
      :page.sync="page"
      @size-change="sizeChange"
      @current-change="currentChange">
      <template slot="receiveAmount" slot-scope="scope">
        <span>{{ scope.row.receiveAmount }}</span>
      </template>
      <template slot="tradeNo" slot-scope="scope">
          <div v-if="scope.row.trReceivePaymentList!=null&&scope.row.trReceivePaymentList.length>0">
            <div v-for="(item,index) in scope.row.trReceivePaymentList" :key="index" class="over-sty">
              <el-tooltip effect="dark" :content="item.tradeNo" placement="top">
                 <span>{{item.tradeNo}}</span>
              </el-tooltip>
            </div>
          </div>
          <div v-else>/</div>
        </template>
        <template slot="contractNo" slot-scope="scope">
          <div v-if="scope.row.trReceivePaymentList!=null&&scope.row.trReceivePaymentList.length>0">
            <div v-for="(item,index) in scope.row.trReceivePaymentList" :key="index" class="over-sty">
              <el-tooltip effect="dark" :content="item.contractNo" placement="top">
                 <span>{{item.contractNo}}</span>
              </el-tooltip>
            </div>
          </div>
          <div v-else>/</div>
        </template>
        <template slot="orderNo" slot-scope="scope">
          <div v-if="scope.row.trReceivePaymentList!=null&&scope.row.trReceivePaymentList.length>0">
            <div v-for="(item,index) in scope.row.trReceivePaymentList" :key="index" class="over-sty">
              <el-tooltip effect="dark" :content="item.orderNo" placement="top">
                 <span>{{item.orderNo}}</span>
              </el-tooltip>
            </div>
          </div>
          <div v-else>/</div>
        </template>
      <template slot="agencyFee" slot-scope="scope">
          <div v-if="scope.row.trReceivePaymentList!=null&&scope.row.trReceivePaymentList.length>0">
            <div v-for="(item,index) in scope.row.trReceivePaymentList" :key="index">
              {{item.agencyFee}}
            </div>
          </div>
          <div v-else>/</div>
        </template>
        <template slot="thirdFee" slot-scope="scope">
          <div v-if="scope.row.trReceivePaymentList!=null&&scope.row.trReceivePaymentList.length>0">
            <div v-for="(item,index) in scope.row.trReceivePaymentList" :key="index">
              {{item.thirdPartyFee}}
            </div>
          </div>
          <div v-else>/</div>
        </template>
        <template slot="officialFee" slot-scope="scope">
          <div v-if="scope.row.trReceivePaymentList!=null&&scope.row.trReceivePaymentList.length>0">
            <div v-for="(item,index) in scope.row.trReceivePaymentList" :key="index">
              {{item.governmentFee}}
            </div>
          </div>
          <div v-else>/</div>
        </template>
    </avue-crud>
  </div>
</template>

<script>
import { receiveOption } from "@/const/crud/personal/my-receive";
import { getMyReceiveList,getReceiveExportData } from "@/api/receive/receive"
import { getExportProgress } from "@/api/receive/receive-api"
import * as CodeMsg from "@/api/common/CodeChange"
export default {
  data() {
    return {
      filters: {
        keyWords: '',
        receiveTime: null
      },
      receiveOption: receiveOption,
      page: {
        currentPage: 1,
        total: 1,
        layout: "total, sizes, prev, pager, next, jumper",
        background: true,
        pageSizes: [5, 8, 10, 20, 30, 40, 50, 100], //选择每页显示条数
        pageSize: 20,
      },
      dataList: [],
    };
  },
  filters: {},
  created(){
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      this.page.currentPage = keepParams.params.pageNo;
      this.page.pageSize = keepParams.params.pageSize;
      this.filters.keyWords = keepParams.params.keyWords;
      this.filters.receiveTime = keepParams.receiveTime;
    }
  },
  mounted() {
    this.setDefaultTime()
    this.getList();
  },
  methods: {
    setDefaultTime(){
      let startTime = this.$moment(new Date()).startOf('month').format("YYYY-MM-DD")
      let endTime = this.$moment(new Date()).endOf('month').format("YYYY-MM-DD")
      this.filters.receiveTime = [startTime,endTime]
    },
    // 获取我的回款列表
    getList(operate) {
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        keyWords: this.filters.keyWords,
        startReceiveTime:this.filters.receiveTime == null ? "" : this.$moment(this.filters.receiveTime[0]).format("YYYY-MM-DD")+' '+'00:00:00',// 开始时间
        endReceiveTime:this.filters.receiveTime == null ? "" : this.$moment(this.filters.receiveTime[1]).format("YYYY-MM-DD")+' '+'23:59:59', // 结束时间
      }
      // 需要缓存的参数
      let keepParams = {
        params: params,
        receiveTime: this.filters.receiveTime,
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getMyReceiveList(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          if(operate){
            params.claimId = JSON.parse(sessionStorage.getItem('pigx-userInfo')).content.id
            getExportProgress(params).then(res => {
              this.exportData(res)
            })
           }else{
            this.dataList = res.data.data.records
            this.page.total = res.data.data.total
           }
        }
      })
    },
    exportData(res){
        const link = document.createElement('a');
        let blob = new Blob([res.data],{type: 'application/vnd.ms-excel'});
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        let num = '';
        for(let i=0;i < 10;i++){
          num += Math.ceil(Math.random() * 10);
         }
        link.setAttribute('download', '我的回款数据_' + num + '.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    resetList() {
      this.filters.keyWords = '';
      this.setDefaultTime();
      this.getAllList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getList();
    },
  },
};
</script>

<style scoped>
.key-input {
  width: 350px;
}
.offline-receive-frame {
  padding: 20px;
  margin-left: 10px;
  background: #ffffff;
  height: 100%;
}
.over-sty{
  width: 100px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>