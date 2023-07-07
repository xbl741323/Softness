<template>
  <basic-container>
    <div v-if="permissions.sys_transfer_detail || permissions.sys_transfer_audit || this.$route.path.includes('personal')">
      <el-form :model="processlistForm" ref="processlistForm" class="search" inline label-width="90" @keyup.enter.native="handleSearch">
        <div>
          <el-form-item :label="$t('label.processState')" prop="state">
            <el-radio-group size="medium" v-model="processlistForm.taskStatus" @change="stateChange">
              <el-radio-button class="state-right" :class="{ 'radio-sty-left': index != 0 }" v-for="(item, index) in stateList" :key="index" :label="item.status">
                <span v-if="item.status ==0" class="circleBlue"></span>
                <span v-if="item.status ==1" class="success"><b>✔</b></span>
                <span v-if="item.status == 2" class="circleBlue circleRed"></span>
                {{ item.lable || item.label }}
                <span v-if="item.status != 1 && item.status != null && item.count != 0">({{ item.count }})</span>
                <!-- <span v-else>{{ item.label }}</span> -->
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
          <!-- 关键字 -->
          <el-form-item :label="$t('label.processkey')" prop="keyWords">
            <el-input v-model="processlistForm.keyWords" class="keywords-width keyword" placeholder="请输入流程编号、订单编号、用户ID或产品名称、用户名称" style="width:380px"></el-input>
          </el-form-item>
          <el-form-item label="订单类型：" prop="orderType">
            <el-select v-model="processlistForm.orderType" placeholder="请选择订单类型">
                <el-option label="全部" :value="null"></el-option>
                <el-option v-for="(item,index) in orderTypes" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('label.pendperson')" prop="pendperson">
            <el-cascader
              style="width: 110px"
              :show-all-levels="false"
              :key="isResouceShow"
              filterable
              clearable
              :before-filter="beforeFilter"
              ref="pendpersonDom"
              :options="pendpersonList"
              v-model="processlistForm.pendperson"
              @change="pendpersonChange"
              :props="{ value: 'customerId', label: 'label' }">
              <template slot-scope="{data}">
                <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                  <div slot="content">{{data.customerNo}}</div>
                  <span>{{data.label}}</span>
                </el-tooltip>
              </template>
            </el-cascader>
          </el-form-item>
          <el-button size="small" type="primary" @click="handleSearch">{{$t("button.search")}}</el-button>
          <el-button size="small" type="warning" @click="reset()">{{ $t("button.reset") }}</el-button
          >
      </el-form>
      <!-- 流程列表 -->
      <avue-crud
        v-loading="loading"
        ref="crud"
        class="batch-choose"
        :data="tableData"
        :option="listOption"
        :page.sync="page"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
       <template slot="taskNo" slot-scope="scope">
          <span style="cursor: pointer;color: #409EFF;" @click="showDetail(scope.row)">
            {{ scope.row.taskNo }}
          </span>
        </template>
        <template slot="taskCurrentEmpId" slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+empNo +'   部门：'+ deptName" placement="top">
            <span class="empName" @mouseenter="showUserInfo(scope.row.taskCurrentEmpId)">{{scope.row.taskCurrentEmpName}}</span>
          </el-tooltip>
        </template>
        <template slot="sponsorType" slot-scope="scope">
          <p v-if="scope.row.sponsorType=='1'">用户</p>
          <el-tooltip effect="dark" :content="'工号：'+empNo +'   部门：'+ deptName" placement="top" v-else>
            <span class="empName" @mouseenter="showUserInfo(scope.row.createBy)">{{scope.row.sponsorName}}</span>
          </el-tooltip>
        </template>
        <template slot="taskStatus" slot-scope="scope">
          <span v-if="scope.row.taskStatus == 0" class="circleBluec"></span>
          <span v-if="scope.row.taskStatus == 1" class="successc"
            ><b>✔</b></span>
          <span v-if="scope.row.taskStatus == 2" class="circleRedc"></span>
          <span>{{ scope.row.taskStatus | filterStatus }} </span>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" icon="el-icon-view" @click="showDetail(scope.row)">{{ $t("button.godetail") }}</el-button>
        </template>
      </avue-crud>
    </div>
  </basic-container>
</template>

<script>
import { pageOrderTask } from "@/api/processmanage/list";
import orderData from '@/components/member/order-data'
import { getEmpList } from "@/api/clue/clue";
import { listOption } from "@/const/crud/processmanage/transfer";
import { saveDetal } from "@/util/clearDetail";
import { myPayOfflineStatistics, payOfflineStatistics,pageMyOrderTask } from "@/api/personal/myprocess";
import { mapGetters } from 'vuex';
export default {
  props:{
    refundFrom:{
      type: String,
      default:null,
    },
  },
  data() {
    return {
      loading:false,
      clickStatus:false,
      stateList: [
        {status: null, count: 0, lable: "全部"},
        {status: 0, count: 0, lable: "待审核"},
        {status: 2, count: 0, lable: "未通过"},
        {status: 1, count: 0, lable: "已通过"}
      ],
      selectList: [],
      isResouceShow: 0,
      baseUrl: process.env.BASE_URL,
      page: {
        currentPage: 1,
        total: 0,
        layout: "total, sizes, prev, pager, next, jumper",
        background: true,
        pageSizes: [5, 8, 10, 20, 30, 40, 50, 100], //选择每页显示条数
        pageSize: 20,
      },
      listOption: listOption,
      tableData: [],
      sponsorList: [],
      pendpersonList: [],
      processlistForm: {
        taskStatus: null,
        orderType:  null,
        keyWords: "", // 关键字
        sponsor: null,
        pendperson: null,
      },
      sponsorNo: "",
      pendpersonNo: "",
      orderTypes: orderData.proTypeData,
    };
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters: {
    filterResult(val) {
      if (val == "0") {
        return "待处理";
      } else if (val == "1") {
        return "已完结";
      } else if (val == "2") {
        return "已完结";
      }
    },
    filterType(val) {
      if (val == "0") {
        return "知识产权";
      } else if (val == "1") {
        return "项目申报";
      } else {
          return "未知";
      }
    },
    filterStatus(val) {
      if (val == "0") {
        return "待审核";
      } else if (val == "1") {
        return "已通过";
      } else if (val == "2") {
        return "未通过";
      }
    },
    filterPrice(val) {
      if (val) {
        return (val / 100).toFixed(2);
      } else {
        return "待定";
      }
    },
  },


  created() {
    if (!this.permissions.sys_transfer_detail && !this.permissions.sys_transfer_audit && !this.$route.path.includes('personal')) this.$notAuthorized()
    if(sessionStorage.getItem(`${this.$route.path}`)){
        let keepParams =JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
        if(keepParams.detail.path!==''){
          this.$router.push({
            path: keepParams.detail.path,
            query: keepParams.detail.query
          })
          return
        }
      this.processlistForm = keepParams.params;
      this.clickStatus = keepParams.clickStatus;
      this.page = keepParams.page
    }
  },
  mounted() {
    this.getData();
    this.getprocessList();
  },
  methods: {
    //显示工号
    async beforeFilter() {
      await getEmpList(true).then((res) => {
        if(res.data.code == 0) {
          this.pendpersonList = res.data.data;
        }
      });
      this.$loop(this.pendpersonList[0], this.pendpersonList[0])
      return false
    },
    getData() {
      // 流程状态
      this.processlistForm.taskStatus = 0;
      this.clickStatus = true;
      let url = this.refundFrom ? myPayOfflineStatistics : payOfflineStatistics
      url().then((res) => {
        if(res.data.code == 0){
          this.stateList[1].count = res.data.data.waitAudit;
          this.stateList[2].count = res.data.data.auditFail;
          this.stateList[3].count = res.data.data.auditPass;
          let sum = 0;
          this.stateList.forEach(item => {
            return sum += item.count
          });
          if(this.refundFrom) return this.$emit('update:numberParent', sum);
        }
      });
      this.getprocessList();
      // 组织架构
      getEmpList(true).then((res) => {
        let data = res.data.data;
        this.sponsorList = data;
        this.pendpersonList = data;
      });
    },
    //获取列表
    getprocessList() {
      this.loading = true
        var params = {
            taskStatus: this.clickStatus==true?(this.processlistForm.taskStatus):null,
            keyWord: this.clickStatus==true?(this.processlistForm.keyWords):null,
            categoryId: this.clickStatus==true?(this.processlistForm.orderType):null,
            pageNo: this.page.currentPage,
            pageSize: this.page.pageSize,
            taskCurrentEmpId: this.clickStatus==true?(this.processlistForm.pendperson?this.processlistForm.pendperson[this.processlistForm.pendperson.length-1]:''):null,
        };
        let keepParams = {
            clickStatus: this.clickStatus,
            params:this.processlistForm,
            clickStatus: this.clickStatus,
            page:this.page,
            detail:{
                path:'',
                query:{}
            }
         }
        sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
        if(this.refundFrom){
          pageMyOrderTask(Object.assign(params)).then(res => {
            this.loading = false
            this.tableData = res.data.data.records;
            this.page.total = res.data.data.total;
          });
        }else{
          pageOrderTask(Object.assign(params)).then((res) => {
              this.loading = false
              this.tableData = res.data.data.records;
              this.page.total = res.data.data.total;
          });
        };
    },
    // 状态栏切换
    stateChange(val) {
      this.clickStatus = true;
      this.getprocessList();
    },
    sponsorChange(val) {
      ++this.isResouceShow;
      this.$nextTick(() => {
        this.sponsorNo = this.$refs[
          "sponsorDom"
        ].getCheckedNodes()[0].data.customerId;
      });
    },
    pendpersonChange(val) {
      console.log(val);
      ++this.isResouceShow;
      this.$nextTick(() => {
        this.pendpersonNo = this.$refs[
          "pendpersonDom"
        ].getCheckedNodes()[0].data.customerId;
      });
    },
    //重置
    reset() {
      this.clickStatus = false;
      ++this.isResouceShow;
      this.clearForm()
      this.sponsorNo = "";
      this.pendpersonNo = "";
      this.getprocessList();
    },
    //清除搜索数据
    clearForm(){
      this.processlistForm.taskStatus = null;
      this.processlistForm.keyWords = ""; // 关键字
      this.processlistForm.orderType = null;
      this.processlistForm.pendperson = null;
      this.page.pageSize = 20;
      this.page.currentPage = 1;
    },
    // 查看详情
    showDetail(row) {
      let querys = {
        id: row.taskId,
        time: Date.now(),
        source: this.$route.path.includes('personal') ? 'personal' : 'transfer'
      }
      saveDetal(`${this.$route.path}`,"/transfer-detail",querys)
      this.$router.push({
        path: "/transfer-detail",
        query: {
          id: row.taskId,
          time: Date.now(),
          source: this.$route.path.includes('personal') ? 'personal' : 'transfer'
        },
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getprocessList();
    },
    // 搜索
    handleSearch(){
      this.clickStatus = true;
      this.getprocessList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getprocessList();
    },
  },
};
</script>

<style scoped>
.text {
  overflow: hidden;
  white-space: nowrap;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.orderMsg {
  display: flex;
  flex-direction: column;
}
.orangeName {
  color: #e6a23c;
}
.senior {
  margin: 10px 0px;
}
.radio-sty {
  margin-left: 20px;
}
.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}
.cell-blue {
  color: #36a6fe;
  cursor: pointer;
}
.list-btn {
  padding: 8px 20px;
  margin: 0 5px;
  border: 1px solid #eee;
  border-radius: 5px;
  cursor: pointer;
}
.activebtn {
  background: #36a6fe;
  border-radius: 5px;
  border: 0;
  color: #fff;
}
.circleBlue {
  width: 6px;
  height: 6px;
  float: left;
  border-radius: 50%;
  background: #36a6fe;
  margin-top: 4px;
  margin-right: 7px;
}
.circleBluec {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 7px;
}
.circleRed {
  background: red;
}
.circleRedc {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  margin-right: 7px;
  background: red;
}
.success {
  font-weight: bolder;
  font-size: 12px;
  float: left;
  color: green;
  margin-top: 2px;
  margin-right: 6px;
}
.successc {
  font-weight: bolder;
  font-size: 12px;
  color: green;
  margin-right: 6px;
}
.pagination {
  float: right;
}
.keyword {
  width: 350px;
}
.state-right {
  margin-right: 20px;
}
.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}

</style>
