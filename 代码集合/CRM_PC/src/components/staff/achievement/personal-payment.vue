<template>
  <div>
    <basic-container>
      <div class="title">
        <span @click="dialogVisible = true">{{ staffInfo.userName }}</span
        >的关联回款
      </div>
      <div class="time">
        <span>回款时间：</span>
        <el-radio-group v-model="searchForm.timeType" @change="timeTypeChange">
          <el-radio :label="1">上月</el-radio>
          <el-radio :label="2">本周</el-radio>
          <el-radio :label="3">本月</el-radio>
        </el-radio-group>
        <el-date-picker
          style="margin-left: 20px"
          :clearable="false"
          v-model="signTime"
          :unlink-panels="true"
          @change="showTime"
          format="yyyy-MM-dd HH:mm"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </div>
      <el-form
        :model="searchForm"
        ref="searchForm"
        inline
        style="margin: 10px 0 20px 0">
        <div>
          <el-form-item label="关键字：">
            <el-input
              v-model.trim="searchForm.keyWord"
              @keyup.enter.native="getAllList()"
              placeholder="请输入客户名称/回款去向关键字/回款编号"
              style="width: 300px"></el-input>
          </el-form-item>
          <el-button type="primary" @click="getAllList()">搜索</el-button>
          <el-button @click="reset()">重置</el-button>
        </div>
      </el-form>
      <avue-crud
        ref="crud"
        v-loading="showLoading"
        :data="tableData"
        :option="perContractsOption"
        :page.sync="page"
        @size-change="sizeChange"
        @current-change="currentChange">
        <template slot="claimName" slot-scope="scope">
          <el-tooltip effect="dark" :content="tooltipContent" placement="top-start">
              <span @mouseover="showUserInfo(scope.row.claimId)">{{ scope.row.claimName }}</span>
          </el-tooltip>
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
        <template slot="saleBelongName" slot-scope="scope">
          <el-tooltip effect="dark" :content="tooltipContent" placement="top-start">
              <span @mouseover="showUserInfo(scope.row.saleBelongId)">{{ scope.row.saleBelongName }}</span>
          </el-tooltip>
        </template>
        <template slot="agencyFee" slot-scope="scope">
          <div v-if="scope.row.trReceivePaymentList!=null&&scope.row.trReceivePaymentList.length>0">
            <div v-for="(item,index) in scope.row.trReceivePaymentList" :key="index">
              {{item.agencyFee}}
            </div>
          </div>
          <div v-else>/</div>
        </template>
        <template slot="govermentFee" slot-scope="scope">
          <div v-if="scope.row.trReceivePaymentList!=null&&scope.row.trReceivePaymentList.length>0">
            <div v-for="(item,index) in scope.row.trReceivePaymentList" :key="index">
              {{item.governmentFee}}
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
      </avue-crud>
      <!-- 姓名切换 -->
      <el-dialog :visible.sync="dialogVisible" width="24%">
        <div>
          <span>姓名：</span>
          <el-cascader
            v-model="staffInfo.number"
            ref="cascader"
            :show-all-levels="false"
            filterable
            :options="serviceList"
            :props="{ value: 'customerNo', label: 'label' }"></el-cascader>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="changeStaff">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { getMyPaymentCollectionList,getReturnDirection } from "@/api/staff/achievement";
import { payOption } from "@/const/crud/staff/personal-payment";
import { getDeptService } from "@/api/admin/user";
export default {
  data() {
    return {
      directionList:[],
      staffInfo: {},
      tableData: [],
      showLoading: false,
      serviceList: [],
      baseUrl: process.env.BASE_URL,
      dialogVisible: false,
      perContractsOption: payOption,
      page: {
        currentPage: 1,
        total: 0,
        layout: "total, sizes, prev, pager, next, jumper",
        background: true,
        pageSizes: [5, 8, 10, 20, 30, 40, 50, 100], //选择每页显示条数
        pageSize: 20,
      },
      signTime: "",
      // 费用类型,0-代理费，1-第三方费用，2-官费(回款金额-个人 中使用)
      typeOptions: [
        { value: null, label: "全部" },
        { value: 0, label: "代理费" },
        { value: 1, label: "第三方费用" },
        { value: 2, label: "官费" },
      ],
      searchForm: {
        //表单信息
        keyWord: "",
        amountType: null,
        timeType: 3,
        startTime: "",
        endTime: "",
      },
      paramsForm: {
        //搜索信息
        keyWord: "",
        amountType: null,
        timeType: 3,
        startTime: "",
        endTime: "",
        sortType: 'DESC',
      },
    };
  },
  filters: {
    transFee(value) {
      if(value!==null){
        return Number(value)/100
      }
    },
  },
  methods: {
    // 获取回款去数据
    getDirection(){
      let params = {
       no:"hkqx"
      }
      getReturnDirection(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.directionList = res.data.data[0].constants
        }
      })
    },
    timeTypeChange() {
      this.signTime = [];
      this.searchForm.startTime = "";
      this.searchForm.endTime = "";
      this.paramsForm = Object.assign({}, this.searchForm);
      this.getAllList();
    },
    showTime(val) {
      if(val!==null){
        this.signTime = val;
        this.searchForm.timeType = 4;
        this.searchForm.startTime = this.$moment(val[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.searchForm.endTime = this.$moment(val[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.paramsForm = Object.assign({}, this.searchForm);
        this.getAllList();
      }else{
        this.searchForm.timeType = 3;
        this.signTime = null;
        this.searchForm.startTime = ""
        this.searchForm.endTime = ""
        this.paramsForm = Object.assign({}, this.searchForm);
        this.getAllList();
      }
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getAllList(1);
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getAllList(1);
    },
    changeStaff() {
      this.staffInfo = {
        number: this.$refs.cascader.getCheckedNodes()[0].value,
        name: this.$refs.cascader.getCheckedNodes()[0].label,
        userName:this.$refs.cascader.getCheckedNodes()[0].label,
        userId: this.$refs.cascader.getCheckedNodes()[0].data.value-0
      };
      console.log(this.$refs.cascader.getCheckedNodes()[0], "11");
      this.staffInfo.empNo = this.$refs.cascader.getCheckedNodes()[0].value
      this.staffInfo.empName = this.$refs.cascader.getCheckedNodes()[0].label
      this.getAllList();
      this.dialogVisible = false;
    },
    getService() {
      getDeptService().then((res) => {
        this.serviceList = res.data.data;
      });
    },
    getAllList(type) {
      console.log(this.signTime,'iiiiiiiiiiii');
      this.showLoading = true;
      let params = {
        empNo: this.staffInfo.userId,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      if (!type) {
        //type  需要带表单信息查询
        this.paramsForm = Object.assign({}, this.searchForm);
      }
      // 日期字段名修改
      this.paramsForm = JSON.parse(JSON.stringify(this.paramsForm).replace(/startTime/g,'startLocalDateTime').replace(/endTime/g,'endLocalDateTime'))        
      getMyPaymentCollectionList(Object.assign(this.paramsForm, params)).then((res) => {
        if(res.data.code == CodeMsg.CODE_0){
          this.showLoading = false;
          this.tableData = res.data.data.records;
          this.page.total = res.data.data.total;
          if (this.tableData.length == 0 && this.page.currentPage > 1) {
            this.page.currentPage = 1;
            this.getAllList();
          }
        }
      });
      this.$set(this.paramsForm,'customTime',this.signTime);
      if (this.$route.query.source) {
        //需要缓存
        let urlQuery = {
          staffInfo: JSON.stringify(this.staffInfo),
          searchForm: JSON.stringify(Object.assign(this.paramsForm, params)),
        };
        sessionStorage.setItem(`personal-payment`,JSON.stringify(urlQuery));
      }
    },
    reset() {
      this.searchForm.keyWord = "";
      this.getAllList();
    },
    InitializeData(){
      this.staffInfo = JSON.parse(this.$route.query.staffInfo);
      if(this.staffInfo.number){
      this.staffInfo.empNo = this.staffInfo.number
      }
      if(this.staffInfo.name){
      this.staffInfo.empName = this.staffInfo.name
      }
      let forms = JSON.parse(this.$route.query.searchForm);
      console.log(forms,'============');
      this.searchForm.timeType = forms.timeType;
      if ( forms.customTime && forms.customTime.length > 0 || forms.startLocalDateTime!=''&&forms.endLocalDateTime!=''){
        this.signTime = forms.customTime; //自定义时间回显
        this.searchForm.startTime = this.$moment(this.signTime[0]).format("YYYY-MM-DD HH:mm:ss");
        this.searchForm.endTime = this.$moment(this.signTime[1]).format("YYYY-MM-DD HH:mm:ss");
      }
    },
  },

  mounted() {
    if(!sessionStorage.getItem(`personal-payment`)){
      this.InitializeData();
    }
    this.getService();
    this.getAllList();
    this.getDirection()
  },
  created(){
    if(sessionStorage.getItem(`personal-payment`)){
        let obj=JSON.parse(sessionStorage.getItem(`personal-payment`));
        let forms = JSON.parse(obj.searchForm);
        console.log(forms);
        this.staffInfo = JSON.parse(obj.staffInfo);
        if(this.staffInfo.number){
          this.staffInfo.empNo = this.staffInfo.number
        }
        if(this.staffInfo.name){
          this.staffInfo.empName = this.staffInfo.name
        }
        if(forms){
          this.signTime = forms.customTime;
          this.searchForm.startTime = this.$moment(this.signTime[0]).format("YYYY-MM-DD HH:mm:ss");
          this.searchForm.endTime = this.$moment(this.signTime[1]).format("YYYY-MM-DD HH:mm:ss");
          this.searchForm.timeType = forms.timeType;
          this.searchForm.keyWord = forms.keyWord;
        }
    }
  },
};
</script>


<style scoped>
.title {
  font-size: 18px;
  padding: 10px 0 20px 0;
}
.title span {
  color: #36a6fe;
  cursor: pointer;
  margin-right: 20px;
  text-decoration: underline;
  font-weight: 500;
}
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
.time {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin: 10px 0 20px 0;
}
</style>