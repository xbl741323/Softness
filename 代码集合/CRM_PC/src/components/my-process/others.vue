<template>
    <div>
        <div>
      <el-form :model="searchForm" ref="searchForm" class="search" inline label-width="90"  @keyup.enter.native="getprocessList()">
        <div>
          <el-form-item :label="$t('label.processState')" prop="state">
            <el-radio-group size="medium" v-model="searchForm.taskStatus" @change="stateChange">
              <el-radio-button class="state-right" :class="{ 'radio-sty-left': index != 0 }" v-for="(item, index) in stateList" :key="index" :label="item.taskStatus">
                <span v-show="item.taskStatus == 3 || item.taskStatus == 4" class="circleBlue"></span>
                <span v-show="item.taskStatus == 2" class="circleBlue circleRed"></span>
                <span v-show="item.taskStatus == 1" class="success"><b>✔</b></span>
                <span v-if="index === 0 || item.taskStatus == 1 || index==5 || index==6">{{ item.label }}</span>
                <span v-else>{{ item.label }}({{ item.count }})</span>
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="关键字：" prop="taskNo">
            <el-input style="width: 300px" placeholder="请输入客户用户名称关键字或用户ID、流程编号" class="keyword" v-model="searchForm.taskNo"></el-input>
          </el-form-item>
          <el-form-item label="流程类型：">
            <el-select v-model="searchForm.constantCatagoryId">
              <el-option v-for="item in selectList" :key="item.id" :label="item.constantValue" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('label.sponsor')" prop="sponsor">
            <el-cascader style="width: 110px" :show-all-levels="false" :key="isResouceShow" filterable ref="sponsorDom" :options="sponsorList" v-model="searchForm.sponsor" @change="sponsorChange" :props="{ value: 'customerId', label: 'label' }" />
          </el-form-item>
          <el-form-item :label="$t('label.pendperson')" prop="pendperson">
            <el-cascader style="width: 110px" :show-all-levels="false" :key="isResouceShow" filterable ref="pendpersonDom" :options="pendpersonList" v-model="searchForm.pendperson" @change="pendpersonChange" :props="{ value: 'customerId', label: 'label' }" />
          </el-form-item>
          <el-button size="small" type="primary" @click="getprocessList()">{{ $t("button.search") }}</el-button>
          <el-button size="small" type="warning" @click="reset('searchForm')" >{{ $t("button.reset") }}</el-button>
        </div>
      </el-form>
      <!-- 流程列表 -->
      <avue-crud ref="crud" class="batch-choose" :data="tableData" :option="listOption" :page.sync="page" @size-change="sizeChange" @current-change="currentChange"  v-loading="loading" >
        <template slot="taskNo" slot-scope="scope">
          <span style="cursor: pointer;color: #409EFF;"  @click="showDetail(scope.row)">{{ scope.row.taskNo }} </span>
        </template>
        <!-- 发起人 -->
        <template slot="taskCommitName" slot-scope="scope">
          <!-- 非认证审批 -->
          <span style="cursor: pointer" v-if="scope.row.taskType!='13'">
            <div v-if="scope.row.taskType == '14' || scope.row.taskType == '11'">
              <el-tooltip effect="dark" :content="scope.row.createName" placement="right">
                  <span>{{ scope.row.createName }}</span>
                </el-tooltip>
            </div>
            <div v-else>
                <el-tooltip effect="dark" :content=" '工号：' +scope.row.taskCommitNo + '   部门：' + scope.row.taskCommitDeptName" placement="right">
                  <span>{{ scope.row.taskCommitName }}</span>
                </el-tooltip>
                <img v-if="scope.row.taskCommitStatus == 9" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" >
            </div>
          </span>
          <span style="cursor: pointer" v-else>
            <el-tooltip effect="dark" :content="scope.row.customerName" placement="right">
              <span>{{ scope.row.taskCommitName }}</span>
            </el-tooltip>
          </span>
        </template>
        <!-- 用户名称类型不同字段不同 -->
        <template slot="customerName" slot-scope="scope">
          <span v-if="scope.row.taskType == '14'">{{ scope.row.userName }} </span>
          <span v-else>{{ scope.row.customerName }} </span>
        </template>
        <!-- 待处理人 -->
        <template slot="taskCurrentName" slot-scope="scope">
          <span style="cursor: pointer">
            <el-tooltip effect="dark" v-if="scope.row.taskCurrentEmpId" :content=" '工号：' + scope.row.taskCurrentNo + '   部门：' + scope.row.taskCurrentDeptName" placement="right">
              <span>{{ scope.row.taskCurrentName }}</span>
            </el-tooltip>
            <el-tooltip effect="dark" v-else content="暂无" placement="right">
              <span>无</span>
            </el-tooltip>
          <img v-if="scope.row.taskCurrentStatus == 9" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" >
          </span>
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
    </div>
</template>

<script>
import { getpersonalList, getOtherStateList, getStateNameList } from "@/api/personal/myprocess";
import { getEmpList } from "@/api/clue/clue";
import { listOption } from "@/const/crud/personal/process";
import { saveDetal } from "@/util/clearDetail";
export default {
    data(){
        return{
            loading:false,
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
                pageSize: 20
            },
            listOption: listOption,
            tableData: [],
            sponsorList: [],
            pendpersonList: [],
            searchForm: {
                taskStatus: null,
                taskNo: "",
                constantCatagoryId: null,
                sponsor: null,
                pendperson: null
            },
            sponsorNo: "",
            pendpersonNo: ""
        }
    },
    methods:{
        getData() {
        // 流程状态
            getOtherStateList().then(res => {
                this.stateList = res.data.data;
                // 设置选中项
                if (this.stateList[1].count) {
                  this.searchForm.taskStatus = 3;
                } else if (this.stateList[2].count) {
                  this.searchForm.taskStatus = 4;
                } else {
                  this.searchForm.taskStatus = null;
                };
                let index = this.stateList.find((item) => {
                  return item.taskStatus == '3'
                });
                if(index){
                  this.$emit('update:numberOther',index.count);
                } 
                this.getprocessList()
            });
        
        
        // 流程名称
            getStateNameList({ no: "gzlclx" }).then(res => {
                let data = res.data.data[0].constants;
                data.unshift({
                constantCatagoryId: null,
                constantValue: "全部",
                gmtCreate: null,
                gmtModifed: null,
                id: null
                });
                this.selectList = data;
            });
        // 组织架构
            getEmpList(true).then(res => {
                let data = res.data.data;
                this.sponsorList = data;
                this.pendpersonList = data;
            });
        },
        //获取列表
        getprocessList() {
            this.loading = true  
            let params = {
                taskStatus: this.searchForm.taskStatus,
                taskType: this.searchForm.constantCatagoryId,
                taskCommitEmpId: this.sponsorNo,
                taskCurrentEmpId: this.pendpersonNo
            };
            if(this.searchForm.taskNo){
                params.keyWords = this.searchForm.taskNo.trim();
            };
            let keepParams = {   
                params: this.searchForm,
                page:this.page,  
                detail:{
                path:'',
                query:{},
            }
        } 
            //保存页面信息
              sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
              getpersonalList(Object.assign({ current: this.page.currentPage,size: this.page.pageSize}, params)).then(res => {
                  this.loading = false
                  this.tableData = res.data.data.records;
                  this.page.total = res.data.data.total;
              });
            },
            // 状态栏切换
            stateChange(val) {
              this.getprocessList();
            },
            sponsorChange(val) {
            ++this.isResouceShow;
            this.$nextTick(() => { this.sponsorNo = this.$refs["sponsorDom"].getCheckedNodes()[0].data.customerId;});
            },
            pendpersonChange(val) {
            ++this.isResouceShow;
            this.$nextTick(() => { this.pendpersonNo = this.$refs["pendpersonDom"].getCheckedNodes()[0].data.customerId;});
            },
            //重置
            reset(formName) {
            // 设置选中项
            if (this.stateList[1].count) {
                this.searchForm.taskStatus = 3;
            } else if (this.stateList[2].count) {
                this.searchForm.taskStatus = 4;
            } else {
                this.searchForm.taskStatus = null;
            }
            ++this.isResouceShow;
            this.$refs[formName].resetFields();
            this.searchForm.constantCatagoryId = null;
            this.searchForm.taskNo = "";
            this.sponsorNo = "";
            this.pendpersonNo = "";
            this.searchForm.sponsor = null;
            this.searchForm.pendperson = null;
            this.getprocessList();
            },
            // 查看详情
            showDetail(row) {
            if (row.taskName == "文章审批") {
                saveDetal(`${this.$route.path}`,"/contracts-newarticle",{ taskId: row.id,taskNo: row.taskNo})   
                this.$router.push({
                path: "/contracts-newarticle",
                query: {
                    taskId: row.id,
                    taskNo: row.taskNo
                }
                });
            } else if(row.taskName == "合同审批"){
                saveDetal(`${this.$route.path}`,"/contracts-newprocessdetail",{ id: row.businessKey,contractStatus: row.taskStatus == 1 ? 1 : 2,taskNo: row.taskNo,taskId: row.id})   
                this.$router.push({
                  path: "/contracts-newprocessdetail",
                  query: {
                      id: row.businessKey,
                      contractStatus: row.taskStatus == 1 ? 1 : 2,
                      taskNo: row.taskNo,
                      taskId: row.id
                  }
                });
            }else if(row.taskName == "退款审批"){
                saveDetal(`${this.$route.path}`,"/refund-personal",{ taskNo: row.taskNo})   
                this.$router.push({
                        path: "/refund-personal",
                        query: {
                            taskNo: row.taskNo,
                        },
                    });
            }else if(row.taskName == "开票审批"){
                saveDetal(`${this.$route.path}`,"/invoicing-person",{ taskNo: row.taskNo})   
                this.$router.push({
                        path: "/invoicing-person",
                        query: {
                            taskNo: row.taskNo,
                        },
                    });
            } else if (row.taskType == "14"){
                let querys = {
                    orderNo: row.orderNo,
                    taskNo:row.taskNo,
                    time: Date.now(),
                    taskStatus: row.taskStatus
                }
                saveDetal(`${this.$route.path}`,"/transfer-detail",querys)
                this.$router.push({
                        path: "/transfer-detail",
                        query: {
                        orderNo: row.orderNo,
                        taskNo:row.taskNo,
                        time: Date.now(),
                        taskStatus: row.taskStatus
                        },
                    });
            } else {
                // 单位认证
                if(row.authAuditType ==1){
                    saveDetal(`${this.$route.path}`,"/certificationapproval-company",{ taskNo: row.taskNo})   
                    this.$router.push({
                            path: "/certificationapproval-company",
                            query: {
                                taskNo: row.taskNo,
                                person:true
                            },
                    });
                }else{
                  saveDetal(`${this.$route.path}`,"/certificationapproval-person",{ taskNo: row.taskNo})
                      this.$router.push({
                          path: "/certificationapproval-person",
                          query: {
                          taskNo: row.taskNo,
                          person:true,
                          },
                      });
                }
                
            }
        },
        sizeChange(val) {
            this.page.currentPage = 1;
            this.page.pageSize = val;
            this.getprocessList();
        },
        currentChange(val) {
            this.page.currentPage = val;
            this.getprocessList();
        }
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
        filterStatus(val) {
        if (val == "0") {
                return "待审核"
            } else if (val == "1") {
                return "已通过"
            } else if (val == "2") {
                return "未通过"
            }else if (val == "5"){
                return "已撤销"
            } else if (val == "6"){
                return "已作废"
            }
        }
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
                this.searchForm = keepParams.params
                this.page = keepParams.page
            }
        }
    },
    beforeDestroy() {
        sessionStorage.removeItem("to-process");
    },
    mounted(){    
        if (sessionStorage.getItem("to-process")) {
            this.searchForm.taskStatus = sessionStorage.getItem("to-process");
        }
        this.getData();    
    }
}
</script>

<style scoped>
.disable_img_sty{
  width:20px;
  height:20px;
  margin-left: 3px;
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
