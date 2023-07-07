<template>
  <basic-container>
    <div v-if="permissions.sys_invoice_detail || permissions.sys_invoice_audit || this.$route.path.includes('personal')">
      <el-form :model="processlistForm" ref="processlistForm" class="search" inline label-width="90" @keyup.enter.native="handleSearch()">
        <div>
          <el-form-item :label="$t('label.processState')" prop="state">
            <el-radio-group size="medium" v-model="processlistForm.taskStatus" @change="stateChange">
              <el-radio-button class="state-right" :class="{ 'radio-sty-left': index != 0 }" v-for="(item, index) in stateList" :key="index" :label="item.taskStatus">
                <span v-show="item.taskStatus ==0" class="circleBlue"></span>
                <span v-show="item.taskStatus ==1" class="success"><b>✔</b></span>
                <span v-show="item.taskStatus ==2" class="circleBlue circleRed"></span>
                <span v-if="item.taskStatus ==1 || index==0 || index==4">{{ item.label }}</span>
                <span v-else>{{ item.label }}({{ item.count }})</span>
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <!-- 关键字 -->
          <el-form-item :label="$t('label.processkey')" prop="keyWords">
            <el-input style="width: 300px" placeholder="请输入流程编号、合同编号或客户名称关键字" class="keyword" v-model="processlistForm.keyWords"></el-input>
          </el-form-item>
          <el-form-item label="费用类型：">
            <el-select v-model="processlistForm.amountType">
                <el-option label="全部" value="null"></el-option>
                <el-option label="代理费" value="0"></el-option>
                <el-option label="第三方费用" value="1"></el-option>
                <el-option label="官费" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('label.sponsor')" prop="sponsor">
            <el-cascader style="width: 110px" :show-all-levels="false" :key="isResouceShow" clearable filterable :before-filter="beforeFilter" ref="sponsorDom" :options="sponsorList" v-model="processlistForm.sponsor" @change="sponsorChange" :props="{ value: 'customerId', label: 'label'}">
              <template slot-scope="{data}">
                <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                  <div slot="content">{{data.customerNo}}</div>
                  <span>{{data.label}}</span>
                </el-tooltip>
              </template>
            </el-cascader>
          </el-form-item>
          <el-form-item :label="$t('label.pendperson')" prop="pendperson">
            <el-cascader style="width: 110px" :show-all-levels="false" :key="isResouceShow" clearable filterable :before-filter="beforeFilter1" ref="pendpersonDom" :options="pendpersonList" v-model="processlistForm.pendperson" @change="pendpersonChange" :props="{ value: 'customerId', label: 'label' }">
              <template slot-scope="{data}">
                <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                  <div slot="content">{{data.customerNo}}</div>
                  <span>{{data.label}}</span>
                </el-tooltip>
              </template>
            </el-cascader>
          </el-form-item>
          <el-button size="small" type="primary" @click="handleSearch()">{{$t("button.search")}}</el-button>
          <el-button size="small" type="warning" @click="reset('processlistForm')" >{{ $t("button.reset") }}</el-button>
        </div>
      </el-form>
      <!-- 流程列表 -->
      <avue-crud ref="crud" class="batch-choose" :data="tableData" :option="listOption" :page.sync="page" @on-load="getprocessList" @size-change="sizeChange" @current-change="currentChange">
       <template slot="taskNo" slot-scope="scope">
          <span style="cursor: pointer;color: #409EFF;" @click="showDetail(scope.row)"> {{ scope.row.taskNo }}</span>
        </template>
        <template slot="corporateName" slot-scope="scope">
          {{ scope.row.corporateName? scope.row.corporateName: scope.row.personalName}}
        </template>
        <template slot="invoiceAmount" slot-scope="scope">
          <span>{{ scope.row.invoiceAmount | filterPrice }}</span>
        </template>
        <template slot="amountType" slot-scope="scope">
          <span> {{ scope.row.amountType | filterAmount }}</span>
        </template>
        <template slot="taskCommitName" slot-scope="scope">
          <div style="cursor: pointer">
            <el-tooltip effect="dark" :content=" '工号：' + scope.row.taskCommitNo +'   部门：' + scope.row.taskCommitDeptName" placement="right">
              <span>{{ scope.row.taskCommitName }}</span>
            </el-tooltip>
            <img v-if="scope.row.taskCommitStatus == 9" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" >
          </div>
        </template>
        <template slot="taskCurrentName" slot-scope="scope">
          <div style="cursor: pointer">
            <div v-if="scope.row.taskCurrentEmpId">
              <el-tooltip effect="dark"  :content=" '工号：' + scope.row.taskCurrentNo +'   部门：' + scope.row.taskCurrentDeptName" placement="right">
                <span>{{ scope.row.taskCurrentName }}</span>
              </el-tooltip>
              <img v-if="scope.row.taskCurrentStatus == 9" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" >
            </div>           
            <el-tooltip effect="dark" v-else content="暂无" placement="right">
              <span>无</span>
            </el-tooltip>
          </div>
        </template>
        <template slot="taskStatus" slot-scope="scope">
          <span v-show="scope.row.taskStatus == 0" class="circleBluec"></span>
          <span v-show="scope.row.taskStatus == 1" class="successc"><b>✔</b></span>
          <span v-show="scope.row.taskStatus == 2" class="circleRedc"></span>
          <span v-show="scope.row.taskStatus == 6"><b style="color:red">x </b></span>
          <span>{{ scope.row.taskStatus | filterStatus }} </span>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" icon="el-icon-view" @click="showDetail(scope.row)" >{{ $t("button.godetail") }}</el-button>
        </template>
      </avue-crud>
    </div>
  </basic-container>
</template>

<script>
import { getList,getStateList,countStateOfMy,getTaskInvoiceOfMy} from "@/api/processmanage/invoicing";
import { getEmpList } from "@/api/clue/clue";
import { listOption } from "@/const/crud/processmanage/invoicing";
import { saveDetal } from "@/util/clearDetail";
import { getOtherStateList, getpersonalList } from "@/api/personal/myprocess";
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
      stateList: [],
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
        keyWords: "", // 关键字
        sponsor: null,
        pendperson: null,
        amountType:null
      },
      sponsorNo: "",
      pendpersonNo: "",
    };
  },
  filters: {
    filterPrice(val){
        if(val){
            return (val/100).toFixed(2)
        }else{
            return ''
        }
    },
    filterAmount(val){
       if (val == "0") {
            return "代理费"
        } else if (val == "1") {
            return "第三方费用"
        } else if (val == "2") {
            return "官费"
        }
    },
    filterStatus(val) {
      if (val == "0") {
        return "待审核"
      } else if (val == "1") {
        return "已通过"
      } else if (val == "2") {
        return "未通过"
      }else{
        return "已作废"
      }
    },
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    if (!this.permissions.sys_invoice_detail && !this.permissions.sys_invoice_audit && !this.$route.path.includes('personal')) this.$notAuthorized()
    if(sessionStorage.getItem(`${this.$route.path}`)){
        let keepParams =JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
        if(keepParams.detail.path!==''){
            this.$router.push({
            path: keepParams.detail.path,
            query: keepParams.detail.query
            })
           return
        }
      this.processlistForm = keepParams.params
      this.page = keepParams.page
      if(this.processlistForm.taskStatus == undefined){
        this.processlistForm.taskStatus = null;
      }
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    //显示工号
    async beforeFilter() {
      await getEmpList(true).then((res) => {
        if(res.data.code == 0) {
          this.sponsorList = res.data.data;
        }
      });
      this.$loop(this.sponsorList[0], this.sponsorList[0])
      return false
    },
    //显示工号
    async beforeFilter1() {
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
      if(this.refundFrom){
        countStateOfMy().then((res) => {
          this.stateList = res.data.data;
          let sum = 0;
          res.data.data.forEach(item => {
            return sum += item.count;
          });
          this.$emit('update:numberParent', sum);
            // 设置选中项
          if (this.stateList[1].count) {
            this.processlistForm.taskStatus = 3;
          } else if (this.stateList[2].count) {
            this.processlistForm.taskStatus = 4;
          } else {
            this.processlistForm.taskStatus = null;
          }; 
          this.getprocessList();
        });
      }else{
        getStateList({ constantNo: "key4" }).then((res) => {
          this.stateList = res.data.data;
        });
      };
      // 组织架构
      getEmpList(true).then((res) => {
        let data = res.data.data;
        this.sponsorList = data;
        this.pendpersonList = data;
      });
    },
    //获取列表
    getprocessList() {
       if(sessionStorage.getItem(`${this.$route.path}special`)){
           var realform = JSON.parse(sessionStorage.getItem(`${this.$route.path}special`))
        }
      let params = {
        amountType:realform && realform.amountType!="null"?realform.amountType:'',
        taskStatus: this.processlistForm.taskStatus,
        keyWords: realform?realform.keyWords:'',
        taskCommitEmpId:realform&&realform.sponsor!=null?realform.sponsor[realform.sponsor.length-1]:'',
        taskCurrentEmpId:realform&&realform.pendperson!=null?realform.pendperson[realform.pendperson.length-1]:'',
      };
      let keepParams = {   
         params:this.processlistForm,
         page:this.page,  
         detail:{
          path:'',
          query:{}
         }
       } 
      //保存页面信息
      sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
      if(this.refundFrom){
        getTaskInvoiceOfMy(Object.assign({ pageNo: this.page.currentPage,pageSize: this.page.pageSize}, params)).then(res => {
          this.loading = false
          this.tableData = res.data.data.records;
          this.page.total = res.data.data.total;
        });
      }else{
        getList(Object.assign({ pageNo: this.page.currentPage,pageSize: this.page.pageSize,},params)).then((res) => {
          this.tableData = res.data.data.records;
          this.page.total = res.data.data.total;
        });
      };
    },
    // 状态栏切换
    stateChange(val) {
      this.getprocessList();
    },
    sponsorChange(val) {
      ++this.isResouceShow;
      this.$nextTick(() => {
        this.sponsorNo = this.$refs["sponsorDom"].getCheckedNodes()[0].data.customerId;
      });
    },
    pendpersonChange(val) {
      ++this.isResouceShow;
      this.$nextTick(() => {
        this.pendpersonNo = this.$refs["pendpersonDom"].getCheckedNodes()[0].data.customerId;
      });
    },
     //搜索
    handleSearch(){
        sessionStorage.setItem(`${this.$route.path}special`,JSON.stringify(this.processlistForm))
        this.getprocessList();
    },
    //重置
    reset(formName) {
      ++this.isResouceShow;
      this.$refs[formName].resetFields();
      this.processlistForm.taskStatus = null;
      this.processlistForm.amountType = 'null'
      this.processlistForm.keyWords = ""; // 关键字
      this.sponsorNo = "";
      this.pendpersonNo = "";
      this.processlistForm.sponsor = null;
      this.processlistForm.pendperson = null;
       if(sessionStorage.getItem(`${this.$route.path}special`)){
         sessionStorage.removeItem(`${this.$route.path}special`)
      }
      this.getprocessList();
    },
    // 查看详情
    showDetail(row) {
      if(this.refundFrom){
        saveDetal(`${this.$route.path}`,"/invoicing-person",{ taskNo: row.taskNo})   
        this.$router.push({
          path: "/invoicing-person",
          query: {
            taskNo: row.taskNo,
            source: this.$route.path.includes('personal') ? 'personal' : 'invoicing'
          },
        });
      }else{
        saveDetal(`${this.$route.path}`,"/invoicing-detail",{ taskNo: row.taskNo})
        this.$router.push({
          path: "/invoicing-detail",
          query: {
            taskNo: row.taskNo,
            time: Date.now(),
            source: this.$route.path.includes('personal') ? 'personal' : 'invoicing'
          },
        });
      };
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
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
.search {
  margin: 25px 0px;
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