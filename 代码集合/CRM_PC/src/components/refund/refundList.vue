<template>
  <div>
    <div v-if="authority">
      <el-form :model="processlistForm" ref="processlistForm" class="search" inline label-width="90" @keyup.enter.native="handleSearch">
        <div>
          <el-form-item :label="$t('label.processState')" prop="taskStatus">
            <el-radio-group size="medium" v-model="processlistForm.taskStatus" @change="stateChange">
              <el-radio-button class="state-right" :class="{ 'radio-sty-left': index != 0 }" v-for="(item, index) in stateList" :key="index" :label="item.taskStatus">
                <span v-show="item.taskStatus == 1" class="circleBlue"></span>
                <span v-show="item.taskStatus == 4" class="success"><b>✔</b></span>
                <span v-show="item.taskStatus == -2" class="circleBlue circleRed"></span>
                <span v-if="item.taskStatus != 4 && item.taskStatus != -1 && item.taskStatus != null">{{ item.label }}({{ item.count }})</span>
                <span v-else>{{ item.label }}</span>
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <!-- 关键字 -->
          <el-form-item label="关键字搜索：" prop="keyWords">
            <el-input
              style="width: 390px"
              placeholder="请输入流程编号、订单编号、主体ID、客户名称"
              class="keyword"
              v-model.trim="processlistForm.keyWords"
            ></el-input>
          </el-form-item>
          <el-form-item label="费用类型：">
            <el-select v-model="processlistForm.amountType">
                <el-option label="全部" value="null"></el-option>
                <el-option label="代理费" value="1"></el-option>
                <el-option label="第三方费用" value="2"></el-option>
                <el-option label="官费" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('label.pendperson')" prop="pendperson">
              <el-cascader
                :disabled="this.processlistForm.taskStatus == 88"
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
                :props="{ value: 'customerId', label: 'label' }"
              >
                <template slot-scope="{data}">
                  <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                    <div slot="content">{{data.customerNo}}</div>
                    <span>{{data.label}}</span>
                  </el-tooltip>
                </template>
              </el-cascader>
            </el-form-item>
          <el-button size="small" type="primary" @click="handleSearch">{{
            $t("button.search")
          }}</el-button>
          <el-button
            size="small"
            type="warning"
            @click="reset('processlistForm')"
            >{{ $t("button.reset") }}</el-button
          >
        </div>
      </el-form>
      <!-- 流程列表 -->
      <avue-crud
        ref="crud"
        class="batch-choose"
        :data="tableData"
        :option="listOption"
        :page.sync="page"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
      <template slot="refundNo" slot-scope="scope">
          <span style="cursor: pointer;color: #409EFF;" @click="showDetail(scope.row)">
            {{ scope.row.refundNo }}
          </span>
        </template>
        <template slot="ttRefundFeeList" slot-scope="scope">
          <div v-if="scope.row.ttRefundFeeList && processlistForm.taskStatus != -1"><p v-for="item in scope.row.ttRefundFeeList" :key="item.id" class="margin-0">{{item.costTypeId | filterCostType}} {{ item.payTypeId == 2 ? '(尾款)' : item.payTypeId == 1 ? '(定金)' : '' }}</p></div>
          <p v-else>{{processlistForm.taskStatus == -1 ? '暂无':'待分配'}}</p>
        </template>
        <template slot="tmRefundApprovalList" slot-scope="scope">
          <div v-if="scope.row.tmRefundApprovalList && processlistForm.taskStatus != -1"><p v-for="(item,i) in scope.row.tmRefundApprovalList.slice(0,3)" :key="i" class="margin-0">{{item.handleByName}}</p></div>
          <p v-else>暂无</p>
          <p v-if="scope.row.tmRefundApprovalList && scope.row.tmRefundApprovalList.length>3" class="margin-0">...</p>
        </template>
        <!-- -2：未通过；-1：已撤销；1：待审核；2：审核中；3：审核通过；4：已完成 -->
        <template slot="refundStatus" slot-scope="scope">
          <span v-show="scope.row.refundStatus == 1||scope.row.refundStatus == 2||scope.row.refundStatus == 3" class="circleBluec"></span>
          <span v-show="scope.row.refundStatus == 4" class="successc"
            ><b>✔</b></span
          >
          <span v-show="scope.row.refundStatus == -2" class="circleRedc"></span>
          <span>{{ scope.row.refundStatus | filterStatus }} </span>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-view"
            @click="showDetail(scope.row)"
            >{{ $t("button.godetail") }}</el-button
          >
        </template>
      </avue-crud>
    </div>
    <div v-else class="no-authority">
      <img :src="require('@/assets/images/common/no-authority.svg')" alt="">
      <p>抱歉！暂无权限查看退款审批</p>
    </div>
  </div>
</template>

<script>
import { pageTmRefundVo,statisticsRefund,statisticsMyRefund, pageMyTmRefundVo } from "@/api/processmanage/refund";
import { getEmpList } from "@/api/clue/clue"
// import { getStateList } from "@/api/personal/myprocess";
import refundData from './refund'
import { listOption } from "@/const/crud/processmanage/refund";
import { saveDetal } from "@/util/clearDetail";
import { mapGetters } from 'vuex';
export default {   
props:{
      refundFrom:{
          type: String,
          default:null,
      },
  }, 
  data(){
      return{
          stateList: [{
            taskStatus:null,
            label:'全部',
            count:0,
          },{
            taskStatus:1,
            label:'待审核',
            count:0,
          },{
            taskStatus:-2,
            label:'未通过',
            count:0,
          },{
            taskStatus: 4,
            label:'已通过',
            count:0,
          },{
            taskStatus: -1,
            label:'已撤销',
            count:0,
          }],
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
          userId:null,
      }
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
          }else{
            return '服务费'
          };
      },
      filterCostType(val) {
        return refundData.filterCostType(val);
      },
      filterStatus(val) {
        return refundData.refundStatus(val);
      },      
      filterUnique(val) {
        return refundData.uniqueArr(val,'handleByNo');
      },
  },    
  computed: {
    ...mapGetters(['permissions']),    
    authority(){
      if(this.refundFrom){
        return this.permissions.bt_refund_detail_my || this.permissions.bt_refund_audit_my;
      } else {
        return this.permissions.bt_refund_detail || this.permissions.bt_refund_audit;
      }
    }
  },
  methods:{
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
          if(!this.authority) return; //判断无权限不调接口
          if(this.refundFrom){
            this.stateList[1].label = '待我处理';
            this.stateList[1].taskStatus = 88;
            let para = {
              taskStatus: 99,
              label:'待他人处理',
              count:0,
            }
            this.stateList.splice(2, 0, para);
            statisticsMyRefund().then((res) => {
              let count = res.data.data.waitMeHandleCount?res.data.data.waitMeHandleCount:res.data.data.waitOtherHandleCount
                this.$emit('update:numberParent',count);
                  // 设置选中项
                this.stateList[1].count = res.data.data.waitMeHandleCount;
                this.stateList[2].count = res.data.data.waitOtherHandleCount;
                this.stateList[3].count = res.data.data.notPassCount;            
                this.getprocessList();
            });              
          } else {
            statisticsRefund().then((res) => {
              if(res.data.code == CodeMsg.CODE_0){
                // 获取各状态数据
                this.stateList[1].count = res.data.data.waitHandleCount
                this.stateList[2].count = res.data.data.notPassCount                
                this.getprocessList();
              }
            });
          }
          // 组织架构
          getEmpList(true).then((res) => {
              let data = res.data.data;
              this.sponsorList = data;
              this.pendpersonList = data;
          });
      },
      //获取列表
      getprocessList() {
          if(!this.authority) return; //判断无权限不调接口
          if(sessionStorage.getItem(`${this.$route.path}special`)){
              var realform = JSON.parse(sessionStorage.getItem(`${this.$route.path}special`))
              }
              let params = {
                  costTypeId:realform && realform.amountType!="null"?realform.amountType:'',
                  refundStatus: [1,88,99].includes(this.processlistForm.taskStatus) ? null : this.processlistForm.taskStatus,
                  keyWord: realform?realform.keyWords:'',
                  handleBy: this.processlistForm.taskStatus==88?this.userId:realform&&realform.pendperson!=null?realform.pendperson[realform.pendperson.length-1]:'',
              };
              if([1,88,99].includes(this.processlistForm.taskStatus)){
                params.refundStatusList = [1,2,3]
              }
              if(this.refundFrom && this.processlistForm.taskStatus== 99){
                params.handleByOther = this.userId
              }
              let keepParams = {   
                params:this.processlistForm,
                page:this.page,  
                detail:{
                  path:'',
                  query:{}
                }
              }; 
              let page = {
                pageNo: this.page.currentPage,
                pageSize: this.page.pageSize,
              }
          //保存页面信息
          console.log(this.refundFrom)
          sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
          pageTmRefundVo(Object.assign(page,params),this.refundFrom).then((res) => {
              let data = res.data.data.records;
              data.forEach(e => {
                if(e.tmRefundApprovalList && e.tmRefundApprovalList.length > 0) {
                  e.tmRefundApprovalList = refundData.uniqueArr(e.tmRefundApprovalList,'handleByNo');                  
                };
                if(e.ttRefundFeeList && e.ttRefundFeeList.length > 0) {
                  e.ttRefundFeeList = refundData.doubleUniqueArr(e.ttRefundFeeList,'costTypeId','payTypeId');
                };
              });
              this.tableData = data;
              this.page.total = res.data.data.total;
          });
      },
      //搜索
      handleSearch(){
          sessionStorage.setItem(`${this.$route.path}special`,JSON.stringify(this.processlistForm))
          this.getprocessList();
      },
      // 状态栏切换
      stateChange(val) {
        console.log(this.page.currentPage)
        if(val == 88){
          this.processlistForm.pendperson = null;
          this.pendperson = "";       
        }
        this.page.currentPage = 1;
        this.processlistForm.taskStatus = val;        
        this.getprocessList();
      },
      pendpersonChange(val) {
        console.log(val);
          ++this.isResouceShow;
          this.$nextTick(() => {
              this.pendpersonNo = this.$refs["pendpersonDom"].getCheckedNodes()[0].data.customerId;
          });
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
          this.processlistForm.pendperson = null;
          this.processlistForm.sponsor = null;
          if(sessionStorage.getItem(`${this.$route.path}special`)){
              sessionStorage.removeItem(`${this.$route.path}special`)
          }
          this.getprocessList();
      },
      // 查看详情
      showDetail(row) {
        if(!this.authority) return this.$notAuthorized();
        saveDetal(`${this.$route.path}`,"/refund-detail",{ taskNo: row.taskNo, id: row.id,from: this.refundFrom,source: this.$route.path.includes('personal') ? 'personal' : 'refund',});
        this.$router.push({
          path: "/refund-detail",
          query: {
            id: row.id,
            from: this.refundFrom,
            time: Date.now(),
            source: this.$route.path.includes('personal') ? 'personal' : 'refund',
          },
        });
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
  created() {
    if(sessionStorage.getItem(`${this.$route.path}`)){
        let keepParams =JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
        if(keepParams.detail.path!==''){
            this.$router.push({
              path: keepParams.detail.path,
              query: keepParams.detail.query
            })
            return
        }
        if(keepParams&&keepParams.params){
            this.processlistForm = keepParams.params
            this.page = keepParams.page
        }

    }
  },
  mounted(){
    console.log(this.permissions);
    let userInfo = JSON.parse(sessionStorage.getItem('pigx-userInfo')).content;
    this.userId = userInfo.id;
    this.getData();
  }
}
</script>

<style scoped>
.no-authority{
  width: 100%;
  min-height: 600px;
}
.no-authority img{
  width: 260px;
  display: block;
  margin: 120px auto;
}
.no-authority p{
  text-align: center;
  font-size: 14px;
  color: #666;
  margin: auto;
}
.text {
overflow: hidden;
white-space: nowrap;
-ms-text-overflow: ellipsis;
text-overflow: ellipsis;
}
.margin-0{
  margin: 0
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
.handlers-sty{
cursor: pointer;
max-height: 70px;
overflow: hidden;
}
</style>