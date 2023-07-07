<template>
  <div class="examine-task-detail">
    <el-steps :space="200" :active="activeStep" finish-status="success" class="step">
      <el-step title="基础信息"></el-step>
      <el-step title="结果录入人配置"></el-step>
      <el-step title="考核流程"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <div class="step-first" v-show="activeStep == 0">
      <el-form :model="basicInfo" ref="basicInfo" :rules="basicRules" label-width="120px">
        <el-form-item label="任务名称：" prop="name">
          <el-input class="examine-task-name" placeholder="请输入任务名称(20个字)" maxlength="20" v-model.trim="basicInfo.name" />
        </el-form-item>
        <el-form-item label="涉及考核方案：" prop="planId">
          <el-select v-model="basicInfo.planId" @change="checkPlan">
            <el-option
              v-for="item in planList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <div class="position-dept">
          <el-form-item label="被考核人员：" prop="position">
            <el-select placeholder="请选择职位" v-model="basicInfo.position" @change="checkPosition">
              <el-option
                v-for="item in positionList"
                :key="item.positionId"
                :value="item.positionId"
                :label="item.positionName"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="deptIdsList" v-if="basicInfo.position > 0" label-width="10px">
            <el-select placeholder="请选择部门" class="dept-select" v-model="basicInfo.deptIdsList" multiple collapse-tags filterable @change="changeDept">
              <el-option
                v-for="item in deptList"
                :key="item.deptId"
                :value="item.deptId"
                :label="item.deptFullName"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="考核类型：">
          <el-radio-group v-model="basicInfo.cycle">
            <el-radio :label="1">月度</el-radio>
            <el-radio :label="2" disabled>年度</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发起考核时间：">
          <span>每月1号</span>
        </el-form-item>
        <el-form-item label="计算规则：">
          <span>四舍五入，保留两位小数点</span>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="activeStep == 1" class="entry-step">
      <span class="step-title">结果录入人</span>
      <div v-for="(item, subScript) in basicInfo.jobDeptList" :key="item.id">
        <p>{{item.deptFullName}}</p>
        <div v-for="(entry, index) in item.jobEnteredConfList" :key="index">
          <el-form :model="entry" ref="deptInfo" :rules="deptRules" class="entry-basic">
            <span class="task-subtitle">{{entry.name}}</span>
            <el-form-item prop="enteredType" :rules="deptRules.enteredType">
              <el-radio-group v-model="entry.enteredType" @change="checkType(entry)">
                <el-radio :label="1">被考核人</el-radio>
                <el-radio :label="2">指定人员</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="emp-info" v-show="entry.enteredType == 2" :prop="subScript+'/'+index+'/'+'enterperson'" :rules="deptRules.enterperson">
              <el-cascader filterable :show-all-levels="false" ref="belong" :options="empList" :props="{emitPath: false,}" v-model="entry.enterperson"  @change="getEmpInfo(entry,index)"/>
            </el-form-item>
            <span class="task-subtitle modify">是否允许录入人修改系统结果值：</span>
            <el-form-item>
              <el-radio-group v-model="entry.isModify">
                <el-radio :label="1" >是</el-radio>
                <el-radio :label="0" >否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="instauctions">
        <p>说明：</p>
        <p>1.指标中存在有对应系统项的指标和无对应系统项的指标，有对应系统项的指标其结果值将由系统自动获取，无对应系统项的指标其结果将由录入人填写</p>
        <p>2.被考核人录入，需要录入结果的部分将由被考核人统一录入</p>
        <p>3.统一指定人录入，需要录入结果的部分将由该指定人统一录入</p>
      </div>
    </div>

    <div class="step-process" v-if="activeStep == 2">
      <span class="step-title">审核配置</span>
      <div v-for="(item, subScript) in basicInfo.jobDeptList" :key="subScript">
        <p>{{item.deptFullName}}</p>
        <div v-for="(process, index) in item.jobFlowConfList" :key="index">
          <el-form :model="process" ref="process" :rules="deptRules" class="entry-basic">
            <span class="audit-plan">{{process.flowStep | flowStep}}</span>
            <el-form-item class="emp-info" label="审核人：" label-width="100px" prop="processPerson" :rules="deptRules.processPerson">
              <el-cascader filterable :show-all-levels="false" ref="auditor" :options="empList" :props="{emitPath: false,value:'customerId'}" v-model="process.processPerson"  @change="getAuditInfo(process,subScript,index)"/>
            </el-form-item>
            <el-form-item label="审核方案：" label-width="100px">
              <el-checkbox-group v-model="process.checkPlanList" @change="checkAuditor(process)">
                <div class="plan-list" v-for="plan in process.jobFlowConfPlanList" :key="plan.planId">
                  <el-checkbox class="checkbox" :label="plan.planId" :disabled="(process.flowStep == 1 && plan.planType == 1) || ( process.flowStep == 2 && plan.planType == 2) || process.flowStep == 3">{{plan.name}}</el-checkbox>
                  <a>
                    <span class="task-subtitle modify">允许审核人修改结果值：</span>
                    <el-radio-group v-model="plan.isModify" >
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0" :disabled="plan.planType == 3 || plan.planType == 4">否</el-radio>
                    </el-radio-group>
                  </a>
                </div>
              </el-checkbox-group>
              <!-- <a v-for="modify in basicInfo.jobPlanList" :key="modify.planId" >
                <div v-if="(process.flowStep == 3 && modify.planType != 1)  || (process.flowStep != 3 && (modify.planType == 1 || modify.planType == 2))">
                  <span class="task-subtitle modify">允许审核人修改结果值：</span>
                  <el-radio-group v-model="process.isModify">
                    <el-radio :label="1" >是</el-radio>
                    <el-radio :label="0" >否</el-radio>
                  </el-radio-group>
                </div>
              </a> -->
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="instauctions">
        <p>说明：</p>
        <p>1.审核人若为为自定义，该任务发起后需要被考核人自定义添加审核人，添加完成后审核将会流转至该审核人</p>
        <p>2.审核人若为指定人员，该任务发起后审核将会流转至指定审核人</p>
      </div>
    </div>

    <div class="examine-step">
      <el-button size="mini" @click="cancel()">取消</el-button>
      <el-button size="mini" type="primary" v-if="activeStep > 0" @click="lastStep()">上一步</el-button>
      <el-button size="mini" type="primary" v-if="activeStep < 2" @click="nextStep()">下一步</el-button>
      <el-button size="mini" type="primary" v-if="activeStep == 2" @click="nextStep()">保存</el-button>
    </div>

  </div>
</template>

<script>
import { jobList, listDeptByPositionId } from "@/api/staff/index";
import { examinePlan, addJobTask, getTask, editJobTask  } from "@/api/salary/examine";
import { getEmpList } from "@/api/clue/clue";
import { mapGetters } from "vuex";
import Vue from "vue";
export default {
  data(){
    var enterValidate = (rule, value, callback)=>{
      let indexList = rule.field.match(/\d/ig);
      let index = 0;
      if(this.basicInfo.jobDeptList[indexList[index]].jobEnteredConfList[indexList[index+1]].enterperson || this.basicInfo.jobDeptList[indexList[index]].jobEnteredConfList[indexList[index+1]].enteredType == 1){
        callback();
      }else{
        callback(new Error('请选择录入人'));
      }
    }
    return {
      this_:this,
      hasChangeDept: false,
      activeStep: 0,
      deptList: [],
      planList: [],
      positionList: [],
      empList: [],
      checkPlanList: [],
      allPlanList: [],
      basicExamine: {},
      taxExamine: {},
      financialExamine: {},
      basicInfo: {
        cycle: 1,
        trigger:1,
        jobDeptList: [],
        jobPlanList:[],
        deptIdsList:[]
      },
      deptInfo:{},
      taskId:'',
      currentPlanId: null,
      basicRules:{
        name:[{required: true, message:'请输入任务名称',trigger:'blur'}],
        planId:[{required: true, message:'请选择考核方案',trigger:'blur'}],
        position:[{required: true, message:'请选择考核职位', trigger:'blur'}],
        deptIdsList:[{required: true, message:'请选择考核部门', trigger:'blur'}]
      },
      deptRules: {
        enteredType:[{required: true, message:'请选择录入人',trigger:'blur'}],
        enterperson:[{required: true, validator:enterValidate, trigger:'blur'}],
        processPerson:[{required: true, message:'请选择审核人', trigger:'blur'}],
      }
    }
  },
  filters:{
    flowStep(val){
      return val == 1 ? '上级审核：' : val == 2 ? '行政审核：' : val == 3 ? '财务审核：' : '';
    },
    getPlanName(val,this_){
      this_.planList.forEach(el=>{
        if(el.id == val){
          return el.name
        }
      })
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted(){
    this.getPositionList();
    if(this.$route.query.id){
      if(this.permissions.salary_job_detail){
        this.taskId = this.$route.query.id;
        this.getTaskDetail();
      }else{
        this.$notAuthorized();
      };
    }else{
      this.getDeptInfo();
    }
  },
  methods:{
    changeDept(){
      this.basicInfo.jobDeptList = []
      this.getDeptInfo();
      this.hasChangeDept = true;
    },
    cancel(){
      this.$confirm('取消后将不会保存该方案内容，是否取消？','取消提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.$router.push('/salary/examine-task')
      })
    },
    getTaskDetail(){
      getTask(this.taskId).then(res=>{
        let taskInfo = res.data.data;
        this.checkPosition(taskInfo.position);
        taskInfo.jobPlanList.forEach(el => {
          if(el.planType == 1){
            taskInfo.planId = el.planId;
          }
        });

        this.$set(taskInfo,'deptIdsList',[]);
        taskInfo.jobDeptList.forEach(el=>{
          taskInfo.deptIdsList.push(el.deptId);
        })

        let param = {
          current: 1,
          size: -1,
        }
        examinePlan(param).then(res=>{
          this.allPlanList = res.data.data.records;
          var [relPlan] = this.allPlanList.filter( item =>{
            return item.id == taskInfo.planId;
          })
          let [basicExamine] = this.allPlanList.filter( item =>{
            return (relPlan && relPlan.planRelList && relPlan.planRelList.length > 0 && relPlan.planRelList[0].planId == item.id);
          })
          this.basicExamine = basicExamine;
          res.data.data.records.forEach((item, index) => {
            // if(item.planType == 2 ){
            //   this.basicExamine = item;
            // }
            if(item.planType == 3){
              this.financialExamine = item;
            }
            // if(item.planType == 4){
            //   this.taxExamine = item;
            // }
          });
          this.planList = res.data.data.records.filter((item)=>{
            return item.planType == 1;
          });
          this.allPlanList.forEach(el => {
            taskInfo.jobDeptList.forEach(item => {
              item.jobEnteredConfList.forEach(element => {
                // if(element.planId == el.id){//业绩考核方案
                //   element.name = el.name;
                // }
                if(el.id == element.planId){//基础考核方案
                  element.name = el.name;
                }
                if(element.enteredBy){
                  element.enterperson = ''+element.enteredBy;
                }
              });
              item.jobFlowConfList.forEach(item=>{
                this.$set(item,'checkPlanList',[]);
                item.jobFlowConfPlanList.forEach(job=>{
                  item.checkPlanList.push(job.planId)
                })
              })
            });
            taskInfo.jobPlanList.forEach(item=>{
              if(item.planId == el.id){
                item.planName = el.name
              }
            })
          });
        })

        this.basicInfo = taskInfo;
        this.currentPlanId = JSON.parse(JSON.stringify(this.basicInfo.planId));
        this.checkPlan(this.basicInfo.planId);
      })
    },
    checkAuditor(row){
      // row.jobFlowConfPlanList = []
      // row.checkPlanList.forEach( el => {
      //   this.basicInfo.jobPlanList.forEach(item => {
      //     if(el == item.planId){
      //       row.jobFlowConfPlanList.push(item)
      //     }
      //   });
      // });
    },
    checkPlan(id){
      if(id != this.currentPlanId){
        this.basicInfo.deptIdsList = [];
        this.$set(this.basicInfo, 'position', null);
        this.currentPlanId = JSON.parse(JSON.stringify(id));
      }
      var [relPlan] = this.allPlanList.filter( item =>{
        return item.id == id;
      })
      let [basicExamine] = this.allPlanList.filter( item =>{
        return (relPlan && relPlan.planRelList && relPlan.planRelList.length > 0 && relPlan.planRelList[0].planId == item.id);
      })
      this.basicExamine = basicExamine;
      this.allPlanList.forEach(el => {
        this.basicInfo.jobDeptList.forEach(item => {
          item.jobEnteredConfList.forEach(element => {
            if(element.planType == 2){//基础考核方案
              element.name = this.basicExamine.name;
              element.planId = this.basicExamine.id
            }else if(id == el.id && element.planType == 1){
              element.name = el.name;
              element.id = el.planId;
            }
          });
        });
      });
      this.basicInfo.jobPlanList = [];
      this.basicInfo.jobPlanList.push({planId: this.basicExamine.id ,planType: this.basicExamine.planType, name: this.basicExamine.name, isModify: 0})
      this.allPlanList.forEach(item => {
        if(id && item.id == id){
          this.basicInfo.jobPlanList.push({planId: item.id,planType: 1,name: item.name,isModify: 0});
        }
      });
      this.basicInfo.jobPlanList.push({planId: this.financialExamine.id ,planType: this.financialExamine.planType, name: this.financialExamine.name, isModify: 1})
      // this.basicInfo.jobPlanList.push({planId: this.taxExamine.id ,planType: this.taxExamine.planType, name: this.taxExamine.name, isModify: 1})
    },
    checkType(row){
      if(row.enteredType == 1){
        this.$set(row,'enteredBy', null);
        this.$set(row,'enteredNo', null);
        this.$set(row,'enteredName', null);
        Vue.delete(row,'enterperson');
      }
    },
    getAuditInfo(row,subScript,index){
      this.$nextTick(()=>{
        let object = this.$refs.auditor[3*subScript+index].getCheckedNodes()[0].data;
        this.$set(row,'auditBy',object.customerId);
        this.$set(row,'auditNo',object.customerNo);
        this.$set(row,'auditName',object.customerName);
      })
    },
    getEmpInfo(row,index){
      this.$nextTick(()=>{
        let object = this.$refs.belong[index].getCheckedNodes()[0].data;
        this.$set(row,'enteredBy',object.customerId);
        this.$set(row,'enteredNo',object.customerNo);
        this.$set(row,'enteredName',object.customerName);
      })
    },
    setDeptPlan(){
      this.basicInfo.jobDeptList.forEach(el=>{
        this.basicInfo.jobPlanList.forEach(item => {
          el.jobFlowConfList.forEach( flowConf => {
            if(flowConf.flowStep == 1 && (item.planType == 1 || item.planType == 2)){
              if(item.planType == 1){
                let ids = flowConf.checkPlanList;
                if(!ids.includes(item.planId)){
                  flowConf.checkPlanList.push(item.planId);
                }
              }else{
                let list = Array.from(flowConf.jobFlowConfPlanList,({planId})=> planId);
                if(!list.includes(item.planId)){
                  item.isModify = 1;
                  flowConf.jobFlowConfPlanList.push(JSON.parse(JSON.stringify(item)));
                }
              }
              flowConf.jobFlowConfPlanList.forEach(flowPlan => {
                if(flowPlan.planId == item.planId){
                  this.$set(flowPlan,'name',item.name)
                }
              });
            }
            if(flowConf.flowStep == 2 && (item.planType == 1 || item.planType == 2)){
              if(item.planType == 2){
                let ids = flowConf.checkPlanList;
                if(!ids.includes(item.planId)){
                  flowConf.checkPlanList.push(item.planId);
                }
              }else{
                let list = Array.from(flowConf.jobFlowConfPlanList,({planId})=> planId);
                if(!list.includes(item.planId)){
                  flowConf.jobFlowConfPlanList.push(JSON.parse(JSON.stringify(item)));
                }
              }
              flowConf.jobFlowConfPlanList.forEach(flowPlan => {
                if(flowPlan.planId == item.planId){
                  this.$set(flowPlan,'name',item.name)
                }
              });
            }
            if(flowConf.flowStep == 3){
              flowConf.jobFlowConfPlanList = this.basicInfo.jobPlanList;
              let ids = flowConf.checkPlanList;
              if(!ids.includes(item.planId)){
                flowConf.checkPlanList.push(item.planId);
              }
              if(item.planType == 1 || item.planType ==2){
                item.isModify = 0
              }
              flowConf.jobFlowConfPlanList.forEach(flowPlan => {
                if(flowPlan.planId == item.planId){
                  this.$set(flowPlan,'name',item.name)
                }
              });
            }
          });
        });
      })
    },
    lastStep(){
      this.activeStep--;
    },
    nextStep(){
      switch (this.activeStep) {
        case 0:
          this.$refs.basicInfo.validate(valid=>{
            if(valid){
              if(this.$route.query.operate != 'edit' || this.hasChangeDept){
                // this.getDeptInfo();
              }else{
                this.setDeptPlan();
              }
              this.activeStep++;
            }else{
              return false;
            }
          })
          break;
        case 1:
          let validateStatus = true;//验证是否全部通过
          this.$refs.deptInfo.forEach(el => {
            el.validate(valid=>{
              if(valid){

              }else{
                validateStatus = false;
                return false;
              }
            })
          });
          if(validateStatus){
            if(this.$route.query.operate == 'edit' && !this.hasChangeDept){
              this.getJobFlowConfPlanList();
            }
            this.activeStep++;
          }
          break;
        case 2:
          let processValidate = true
          this.$refs.process.forEach(el => {
            el.validate(valid=>{
              if(valid){

              }else{
                processValidate = false;
                return false;
              }
            })
          });
          if(processValidate){
            if(this.$route.query.operate == 'edit'){
              this.editPlanTask();
            }else{
              this.addPlanTask();
            }
          }
          break;
        default:
          break;
      }
    },
    getJobFlowConfPlanList(){
      this.basicInfo.jobDeptList.forEach( el => {
        el.jobFlowConfList.forEach(item => {
          // this.$set(item,'checkPlanList',[]);
          this.$set(item,'processPerson',item.auditBy);
          // item.jobFlowConfPlanList.forEach( plan => {
          //   item.checkPlanList.push(plan.planId);
          // });
        });
      });
    },
    editPlanTask(){
      this.basicInfo.jobDeptList.forEach(dept => {
        dept.jobFlowConfList.forEach(flowConf => {
          flowConf.jobFlowConfPlanList = flowConf.jobFlowConfPlanList.filter( item => {
            return flowConf.checkPlanList.indexOf(item.planId) > -1
          });
        });
      });
      editJobTask(this.basicInfo).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message:'考核任务编辑成功！',
            duration: 1000
          })
          history.go(-1);
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        }
      })
    },
    addPlanTask(){
      this.basicInfo.jobDeptList.forEach(dept => {
        dept.jobFlowConfList.forEach(flowConf => {
          flowConf.jobFlowConfPlanList = flowConf.jobFlowConfPlanList.filter( item => {
            return flowConf.checkPlanList.indexOf(item.planId) > -1
          });
        });
      });
      addJobTask(this.basicInfo).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message: '考核任务添加成功!',
            duration:1000,
          })
          this.$router.push('/salary/examine-task')
        }else{
          this.$message({
            type:"warning",
            message: res.data.msg
          })
        }
      })
    },
    getDeptInfo(){
      this.basicInfo.jobDeptList = [];
      this.deptList.forEach( el => {
        if(this.basicInfo.deptIdsList.includes(el.deptId)){
          this.$set(el,'jobEnteredConfList',[]);
          this.$nextTick(()=>{
            this.basicInfo.jobPlanList.forEach( item => {
              if(item.planType == 1 || item.planType == 2){
                el.jobEnteredConfList.push({name:item.name, planId:item.planId,planType:item.planType, isModify: 0})
              }
            });
          })
          this.$set(el,'jobFlowConfList',[
            {isModify: 1, flowStep: 1,auditType:2, checkPlanList:[],jobFlowConfPlanList:[]},
            {isModify: 1,flowStep: 2,auditType:2, checkPlanList:[],jobFlowConfPlanList:[]},
            {isModify: 0,flowStep: 3,auditType:2, checkPlanList:[],jobFlowConfPlanList:[]}
          ])
          this.basicInfo.jobPlanList.forEach(item => {
            el.jobFlowConfList.forEach( flowConf => {
              if(flowConf.flowStep == 1 && (item.planType == 1 || item.planType == 2)){
                if(item.planType == 1){
                  flowConf.checkPlanList.push(item.planId);
                }
                item.isModify = 1
                flowConf.jobFlowConfPlanList.push(JSON.parse(JSON.stringify(item)));
              }
              if(flowConf.flowStep == 2 && (item.planType == 1 || item.planType == 2)){
                if(item.planType == 2){
                  flowConf.checkPlanList.push(item.planId);
                }
                item.isModify = 1
                flowConf.jobFlowConfPlanList.push(JSON.parse(JSON.stringify(item)));
              }
              if(flowConf.flowStep == 3){
                flowConf.checkPlanList.push(item.planId);
                if(item.planType == 1 || item.planType ==2){
                  item.isModify = 0
                }
                flowConf.jobFlowConfPlanList.push(JSON.parse(JSON.stringify(item)));
              }
            });
          });
          this.basicInfo.jobDeptList.push(el);
        }
      });
    },
    checkPosition(positionId){
      this.basicInfo.deptIdsList = [];
      listDeptByPositionId(positionId).then(res=>{
        this.deptList = res.data.data;
        if(this.$route.query.operate == 'edit'){
          this.basicInfo.jobDeptList.forEach(el => {
            this.deptList.forEach( item => {
              if(el.deptId == item.deptId){
                this.$set(el,'deptFullName',item.deptFullName);
              }
            });
          });
        }
      })
    },
    getPositionList(){
      let param = {
        current: 1,
        size: -1,
      }
      jobList(param).then(res=>{
        this.positionList = res.data.data.records;
      })
      examinePlan(param).then(res=>{
        this.allPlanList = res.data.data.records;
        res.data.data.records.forEach((item, index) => {
        //   // if(item.planType == 2 && this.basicInfo.planId == item.id){
        //   //   this.basicExamine = item;
        //   // }
          if(item.planType == 3){
            this.financialExamine = item;
          }
          if(item.planType == 4){
            this.taxExamine = item;
          }
        });
        this.planList = res.data.data.records.filter((item)=>{
          return item.planType == 1;
        });
      })
      getEmpList(false).then(res=>{
        this.empList = res.data.data;
      })
    },
  }
}
</script>
<style scoped>
.examine-task-detail{
  padding: 20px;
  background: #FFFFFF;
  min-height: 100%;
}
.examine-step{
  border-top: 1px solid #C0C4CC;
  padding-top: 20px;
  text-align: center;
}
.step-first{
  max-width: 500px;
  margin: 20px auto;
}
.step-first span{
  color: #555555;
}
.examine-task-name{
  width: 300px;
}
.dept-select{
  width: 180px;
  margin-left: 10px;
}
.position-dept{
  display: flex;
}
.entry-basic{
  display: flex;
}
.task-subtitle{
  min-width: 170px;
  max-width: 220px;
  color: #333333;
  font-size: 14px;
  line-height: 32px;
  margin-left: 10px;
}
.step-title{
  border-left: 3px solid #409EFF;
  padding-left: 5px;
}
.step{
  width: 800px;
  margin: 20px auto;
}
.emp-info{
  margin-left: 10px;
}
.modify{
  margin-left: 20px;
}
.entry-step{
  min-width: 1200px;
  padding: 20px;
  background: #F7FBFF;
}
.instauctions{
  color: #555555;
  font-size: 12px;
}
.plan-list{
  display: block
}
.audit-plan{
  width: 100px;
  padding-top: 5px;
}
.checkbox{
  width: 200px;
}
</style>
