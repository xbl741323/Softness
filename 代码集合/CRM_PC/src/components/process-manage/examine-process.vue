<template>
  <div class="examine-process-frame">
    <div class="examine-head">
      <img :src="img_url+'images/任务.png'" class="process-img" alt="">
      <p>流程编号：{{processInfo.flowNo}}</p>
      <div class="step-examine">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="任务发起"></el-step>
          <el-step title="提交审核"></el-step>
          <el-step title="上级审核"></el-step>
          <el-step title="行政审核"></el-step>
          <el-step title="财务审核"></el-step>
        </el-steps>
      </div>
      <div class="audit-btn" v-if="active > 1 && active < 5 && !(source == 'personal' && processHeadInfo.handlerIds != userInfo.id) ">
       <!-- <el-button size="mini" type="primary" v-if="completedNum != 0"  @click="audit(1)">审核通过</el-button> -->
       <el-button size="mini" type="warning" @click="permissions.salary_flow_approval_reject ? audit(0) : $notAuthorized()">审核不通过</el-button>
      </div>
    </div>
    <div class="examine-process-info">
      <div v-for="item in processHeadInfo" :key="item.value">
        <p class="process-subtitle">{{item.label}}</p>
        <p v-if="item.key != 'processState'" class="subcontent">{{item.key | transfer(that)}}</p>
        <p v-if="item.key == 'processState'" class="subcontent">
          <span class=""></span>
          {{item.key | processState(that)}}</p>
      </div>
    </div>

    <div class="tab-btn">
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabList" :key="item.id" :label="item.name" :name="''+item.index">
          <span slot="label">
            {{item.name}}
            <el-badge :value="item.status == 1 ? '待处理' : '已处理'" :type="item.status == 1 ? '' : 'info'" v-if="item.id != -1"></el-badge>
          </span>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-if="planList.length > 0 && activeTab != -1">
      <!-- 头部信息 -->
      <div class="plan-head">
        <p>考核项</p>
        <p>指标说明</p>
        <p>录入结果</p>
        <p>计算结果</p>
        <p>备注</p>
      </div>
      <div v-for="(item, voIndex) in planList[Number(activeTab)].planDetailVoList" :key="item.planItemValId">
        <div v-if="!item.isManager">
          <p class="examine-plan-name">{{item.planItemValName}}</p>
          <div v-for="(examine, index) in item.indexValDtoList" :key="examine.indexValId">
            <el-form :model="examine" ref="examine" :rules="examineRules">
              <div class="process-examine-content" v-if="examine.indexType != '1-2'">
                <p>{{examine.name}}</p>
                <p>{{examine.des || '/'}}</p>
                <p v-if='!examine.isParam && !examine.isComputed && examine.type == 1'>{{examine.val || ''}}</p>
                <!-- <p v-if='!examine.isParam && examine.isComputed && examine.type == 1'>{{examine.val || ''}}</p> -->
                <el-form-item v-if="examine.isParam && examine.isComputed && examine.type == 1" :prop="'#'+voIndex+'#'+index+'#enterVal'" :rules="examineRules.enterVal">
                  <el-input-number :disabled="planList[Number(activeTab)].isModify == 0 || planList[Number(activeTab)].status == 2" placeholder='待录入'  controls-position="right" :precision="2" v-model="examine.enterVal" />
                </el-form-item>
                <!-- 电话中心绩效方案新增isComputed == false -->
                <el-form-item v-if="examine.isParam && !examine.isComputed && examine.type == 1" :prop="'#'+voIndex+'#'+index+'#enterVal'" :rules="examineRules.enterVal">
                  <el-input-number :disabled="planList[Number(activeTab)].isModify == 0 || planList[Number(activeTab)].status == 2" placeholder='待录入'  controls-position="right" :precision="2" v-model="examine.enterVal" />
                </el-form-item>
                <el-form-item v-if="!examine.isParam && examine.isComputed && examine.type == 1" :prop="'#'+voIndex+'#'+index+'#enterVal'" :rules="examineRules.enterVal">
                  <el-input-number :disabled="planList[Number(activeTab)].isModify == 0 || planList[Number(activeTab)].status == 2" placeholder='待录入'  controls-position="right" :precision="2" v-model="examine.enterVal" />
                </el-form-item>
                <el-form-item v-if="examine.type != 1" :prop="'#'+voIndex+'#'+index+'#enterVal'" :rules="examineRules.enterVal">
                  <el-input-number :disabled="examine.type == 3 || planList[Number(activeTab)].status == 2 || (active > 1 && planList[Number(activeTab)].isModify == 0)" :placeholder="examine.type == 2 ? '待录入' : examine.type == 3 && active == 1 ? '待计算' : '' "  controls-position="right" :precision="2" v-model="examine.enterVal" />
                </el-form-item>
                <p>{{examine.result || (examine.isComputed ? '待计算' : '') }}</p>
                <p class="process-reamrk" @click="addRemark(examine)">添加/查看备注</p>
              </div>
              <div class="process-examine-content" v-if="examine.indexType == '1-2'">
                <p>{{examine.name}}</p>
                <p></p>
                <p>{{examine.val}}</p>
                <!-- <el-form-item v-if="examine.isParam && examine.isComputed && examine.type == 1" :prop="'#'+voIndex+'#'+index+'#enterVal'" :rules="examineRules.enterVal">
                  <el-input-number :disabled="planList[Number(activeTab)].isModify == 0  || planList[Number(activeTab)].status == 2" placeholder='待录入'  controls-position="right" :precision="2" v-model="examine.enterVal" />
                </el-form-item>
                <el-form-item v-if="examine.type != 1" :prop="'#'+voIndex+'#'+index+'#enterVal'" :rules="examineRules.enterVal">
                  <el-input-number :disabled="examine.type == 3 || planList[Number(activeTab)].status == 2" :placeholder="examine.type == 2 ? '待录入' : '待计算'"  controls-position="right" :precision="2" v-model="examine.enterVal" />
                </el-form-item> -->
                <p>{{examine.result || (examine.isComputed ? '待计算' : '') }}</p>
                <p></p>
              </div>
              <div v-if="examine.indexType == '1-2' && examine.gradeIndexValDtoList && examine.gradeIndexValDtoList.length > 0">
                <div v-for="(grade,subScript) in examine.gradeIndexValDtoList" :key="grade.gradeIndexValId" class="process-examine-content">
                  <p class="grade-name">{{grade.name}}</p>
                  <p>{{grade.des || '/'}}</p>
                  <p v-if='!grade.isParam && !grade.isComputed && grade.type == 1'>{{grade.val}}</p>
                  <el-form-item v-if="grade.isParam && grade.isComputed && grade.type == 1" :prop="'#'+voIndex+'#'+index+'#'+subScript+'#enterVal'" :rules="examineRules.enterVal">
                    <el-input-number :disabled="planList[Number(activeTab)].isModify == 0 || planList[Number(activeTab)].status == 2" placeholder='待录入'  controls-position="right" :precision="2" v-model="grade.enterVal" />
                  </el-form-item>
                  <el-form-item v-if="grade.type != 1" :prop="'#'+voIndex+'#'+index+'#'+subScript+'#enterVal'" :rules="examineRules.enterVal">
                    <el-input-number :disabled="grade.type == 3 || planList[Number(activeTab)].status == 2 || (active > 1 && planList[Number(activeTab)].isModify == 0)" :placeholder="grade.type == 2 ? '待录入' : grade.type == 3 && active == 1 ? '待计算' : ''"  controls-position="right" :precision="2" v-model.trim="grade.enterVal" />
                  </el-form-item>
                  <p>{{grade.result || (examine.isComputed ? '待计算' : '') }}</p>
                  <p class="process-reamrk" @click="addRemark(grade)">添加/查看备注</p>
                </div>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <examine-operate-log :flowId="processInfo.flowId" v-if="activeTab == -1" />
    </div>
    <div class="examine-process-operate" v-if="activeTab != -1 && planList[Number(activeTab)] && planList[Number(activeTab)].status == 1">
      <el-button size="mini" v-if="(planList[Number(activeTab)].status == 1 && planList[Number(activeTab)].isModify == 1) || active == 1" @click="getDetailHead()">取消</el-button>
      <el-button size="mini" type="primary" v-if="(planList[Number(activeTab)].status == 1 && planList[Number(activeTab)].isModify == 1) || active == 1" @click="permissions.salary_flow_save_draft ||source != 'list' ? checkValidate(planList[Number(activeTab)],1) : $notAuthorized()">保存草稿</el-button>
      <el-button size="mini" type="primary" @click="permissions.salary_flow_save ||source != 'list' ? checkValidate(planList[Number(activeTab)],2) : $notAuthorized()" v-if="active == 1">提交审核</el-button>
      <el-button size="mini" type="primary" @click="permissions.salary_flow_save ||source != 'list' ? checkValidate(planList[Number(activeTab)],2) : $notAuthorized()" v-if="active > 1">确认无误</el-button>
    </div>

    <!-- 备注 -->
    <el-dialog :visible.sync="remarkDialog" title="添加/查看备注" :close-on-click-modal="false">
      <div class="view-remark">
        <p style="white-space: pre-wrap;" >{{pastRemark}}</p>
      </div>
      <el-input placeholder="添加备注" type="textarea" :rows="4" v-model="remark" maxlength="30" show-word-limit />
      <dir slot="footer">
        <el-button type="primary" @click="confirmRemark()">确定</el-button>
      </dir>
    </el-dialog>

    <!-- 审核通过 -->
    <el-dialog :visible.sync="auditDialog" title="审批通过" :close-on-click-modal="false">
      <el-form :model="auditForm">
        <el-form-item label="审批意见">
          <el-input type="textarea" :rows="4"  v-model="auditForm.approvedRemark" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="auditDialog = false;">取消</el-button>
        <el-button size="mini" type="primary" @click="approved()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 审核不通过 -->
    <el-dialog :visible.sync="refuseDialog" title="审批不通过" :close-on-click-modal="false">
      <span class="audit-prompt">审批不通过，流程将驳回到结果值录入人，请选择驳回方案</span>
      <el-form :model="refuseForm" ref="refuseForm">
        <el-form-item prop="checkList" :rules="examineRules.checkList">
          <el-checkbox-group v-model="refuseForm.checkList" >
            <el-checkbox class="group-check" v-for="item in currentHandleList" :key="item.planValId" :label="item.planValName">{{item.planValName}} <span class="entry-result">结果录入人：{{item.handlerName}}</span></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="审批意见" prop="refuseRemark" :rules="examineRules.refuseRemark">
          <el-input type="textarea" :rows="4"  v-model="refuseForm.refuseRemark" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="cancelAudit">取消</el-button>
        <el-button size="mini" type="primary" @click="approvalReject()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { detailHead, getPlanDetail, saveFlow } from "@/api/salary/examine";
import { remark, getReamrk, approved, approvalReject, getInputHandlers } from "@/api/processmanage/salary";
import processData from './examine'
import examineOperateLog from './examine-operateLog.vue';
import { mapGetters } from "vuex";
export default {
  components: { 
    examineOperateLog
  },
  data(){
    var valValidate = (rule, value, callback)=>{
      let indexList = rule.field.match(/(?<=#).*?(?=#)/ig);
      let index = 0;
      if(indexList && indexList.length > 2){
        if(typeof(this.planList[Number(this.activeTab)].planDetailVoList[indexList[index]].indexValDtoList[indexList[index+1]].gradeIndexValDtoList[indexList[index+2]].enterVal) == 'number'){
          callback()
        }else{
          callback(new Error('请输入录入值'));
        }
      }else{
        if(typeof(this.planList[Number(this.activeTab)].planDetailVoList[indexList[index]].indexValDtoList[indexList[index+1]].enterVal || this.planList[Number(this.activeTab)].planDetailVoList[indexList[index]].indexValDtoList[indexList[index+1]].enterVal) == 'number' || this.planList[Number(this.activeTab)].planDetailVoList[indexList[index]].indexValDtoList[indexList[index+1]].type == 3){
          callback();
        }else{
          callback(new Error('请输入录入值'));
        }
      }
    }
    return {
      that: this,
      remarkDialog: false,
      auditDialog: false,
      refuseDialog: false,
      processInfo: {},
      remarkInfo: {},
      auditForm: {
        approvedRemark: '审批通过'
      },
      refuseForm: {
        checkList: [],
      },
      examineRules:{
        enterVal: [{required: true, validator: valValidate,trigger:'blur'}],
        refuseRemark: [{required: true, message:'请输入审批意见', trigger:' blur'}],
        checkList:[{required: true, message:'请选择驳回方案', trigger:'blur'}]
      },
      active: 1,
      processHeadInfo : processData.processInfo,
      img_url: process.env.BASE_URL,
      tabList: [],
      planList: [],
      currentHandleList: [],
      activeTab: '',
      flowId: '',
      source: '',
      remark: '',
      pastRemark: '',
      approvedRemark: '审批通过',
      refuseRemark: '',
      handleList: [],//当前需要处理的方案
      completedNum: 1,//1-全部已确认 0-存在未确认
      userInfo: {},
    }
  },
  filters:{
    transfer(val, that){
      return that.processInfo[val] || '无';
    },
    processState(val,that){
      return processData.processState(that.processInfo[val]);
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted(){
    this.flowId = this.$route.query.id;
    this.source = this.$route.query.source;
    this.getDetailHead();
    this.userInfo = JSON.parse(sessionStorage.getItem('pigx-userInfo')).content;
  },
  methods:{
    cancelAudit(){
      this.refuseForm = {
        checkList: [],
      },
      this.refuseDialog = false;
    },
    jump(){
      if(this.$route.query.source == 'list'){
        let keepParams = JSON.parse(sessionStorage.getItem(`${this.$route.query.path}`));
        keepParams.detail.path = this.$route.query.path
        keepParams.detail.query = {}
        sessionStorage.setItem(`${this.$route.query.path}`, JSON.stringify(keepParams));
      }else{
        let keepParams = JSON.parse(sessionStorage.getItem(`${this.$route.query.path}+salary`));
        keepParams.detail.query = {}
        sessionStorage.setItem(`${this.$route.query.path}+salary`, JSON.stringify(keepParams));
      }
      this.$router.push(this.$route.query.path)
    },
    audit(status){
      if(status == 1){
        this.auditForm.approvedRemark = '审批通过';
        this.auditDialog = true;
      }else{
        console.log(this.handleList);
        let param = {
          flowId: this.processInfo.flowId,
          planValIds: Array.from(this.handleList,({planValId})=>planValId),
        }
        getInputHandlers(param).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.currentHandleList = res.data.data
            this.refuseDialog = true;
          }
        })
      }
    },
    approved(){
      let param = {
        flowId: this.processInfo.flowId,
        planNames: Array.from(this.handleList,({planName})=>planName).join(','),
        remark: this.auditForm.approvedRemark || '审批通过'
      }
      approved(param).then(res=>{
        this.auditDialog = false;
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message: res.data.msg
          })
          this.jump();
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        }
      })
    },
    approvalReject(){
      this.$refs.refuseForm.validate(valid=>{
        if(valid){
          let param = {
            flowId: this.processInfo.flowId,
            planNames: this.refuseForm.checkList.join(','),
            remark: this.refuseForm.refuseRemark
          }
          approvalReject(param, this.source).then(res=>{
            this.refuseDialog = false;
            if(res.data.code == CodeMsg.CODE_0){
              this.$message({
                type:'success',
                message: res.data.msg
              })
              this.jump();
            }else{
              this.$message({
                type:'warning',
                message: res.data.msg
              })
            }
          })
        }else{
          return false;
        }
      })
    },
    confirmRemark(){
      let param = {
        indexValId : this.remarkInfo.indexValId,
        remark: this.remark
      }
      if(this.remark.length > 0){
        remark(param).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.$message({
              type:'success',
              message:'添加备注成功！'
            })
            this.remarkDialog = false;
            this.remark = '';
          }else{
            this.$message({
              type:'warning',
              message: res.data.msg
            })
          }
        })
      }else{
        this.remarkDialog = false;
      }
      
    },
    addRemark(row){
      this.remarkInfo = JSON.parse(JSON.stringify(row));
      getReamrk(this.remarkInfo.indexValId).then(res=>{
        this.pastRemark = res.data.data;
      })
      this.remarkDialog = true;
    },
    checkValidate(row, operateId){
      switch (operateId) {
        case 1:
          this.save(row, operateId);
          break;
        case 2:
          let validateSatus = true;
          if(this.$refs.examine && this.$refs.examine.length > 0){
            this.$refs.examine.forEach( item=>{
              item.validate(valid=>{
                if(valid){
                  
                }else{
                  validateSatus = false;
                }
              })
            })
          };
          if(validateSatus){
            this.save(row, operateId);
          }
          break;
        default:
          break;
      }
    },
    save(row, operateId){
      let info = {};
      info.planValId = row.planValId;
      info.flowHandlerId = row.flowHandlerId;
      info.indexValSaveParams = [];
      row.planDetailVoList.forEach( el => {
        el.indexValDtoList.forEach(item => {
          if(item.gradeIndexValDtoList && item.gradeIndexValDtoList.length > 0){
            let gradeIndexValList = [];
            item.gradeIndexValDtoList.forEach(grade => {
              if(grade.type != 3){
                gradeIndexValList.push({
                  gradeIndexValId: grade.gradeIndexValId,
                  indexId: grade.indexId,
                  val: grade.enterVal,
                  type: grade.type
                })
              }
            });
            info.indexValSaveParams.push(Object.assign({gradeIndexValList:gradeIndexValList},{
              indexId: item.indexId,
              indexValId: item.indexValId,
              val: item.enterVal,
              type: item.type,
            }))
          }else{
            info.indexValSaveParams.push({
              indexId: item.indexId,
              indexValId: item.indexValId,
              val: item.enterVal,
              type: item.type
            })
          }
        });
      });
      let lastStep = 0
      this.planList.forEach(item => {
        if(item.status == 1){
          lastStep++;
        }
      });
      if(lastStep == 1 && operateId == 2 && this.active > 1){
        this.$confirm('确认无误后，当前节点默认为审核通过，该流程将流转至下一审核阶段，是否确认无误？', '确认提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.saveFlow(info, operateId);
        })
      }else{
        this.saveFlow(info, operateId);
      }
    },
    saveFlow(info, operateId){
      saveFlow(info, operateId, this.source).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message: res.data.msg
          })
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        }
        if(res.data.data && this.active == 1){//完成录入结果值
          this.jump();
        }else{
          this.getDetailHead();
        }
      })
    },
    getDetailHead(){
      detailHead({id:this.flowId},this.source).then(res=>{
        this.processInfo = res.data.data;
        this.active = this.processInfo.processBar;
        let planList = Array.from(res.data.data.plans,({planValId})=> planValId)
        let planNameList = Array.from(res.data.data.plans,({planName})=> planName)
        this.activeTab = '0';
        this.tabList = [];
        planList.forEach((el, index) => {
          this.tabList.push({
            name: planNameList[index],
            id: el,
            index: index
          })
        });
        this.handleList = [];
        res.data.data.plans.forEach(item => {
          if(item.handlerState == this.processInfo.processBar){
            this.handleList.push(item);
          }
        });
        this.tabList.push({
          id: '-1',
          name: '操作记录',
          index: -1
        })
        this.getPlan(res.data.data.plans);
      })
    },
    getPlan(plans){
      let ids = Array.from(plans,({flowHandlerId})=> flowHandlerId);
      getPlanDetail(ids).then(res=>{
        this.planList = res.data.data;
        this.completedNum = 1;
        this.planList.forEach((el, index) => {
          if(el.status == 1){
            this.completedNum = 0;
          }else{

          }
          this.tabList[index].status = el.status;
          el.planDetailVoList.forEach( (detailVo, index) => {
            if(detailVo.isManager){
              // el.planDetailVoList.splice(index, 1);
            }else{
              detailVo.indexValDtoList.forEach(element => {
                if(!Boolean(element.val == '')){
                  this.$set(element,'enterVal', element.val);
                }
                if(element.gradeIndexValDtoList){
                  element.gradeIndexValDtoList.forEach( grade=>{
                    if(!Boolean(grade.val == '')){
                      this.$set(grade,'enterVal', grade.val);
                    }
                  })
                }
              });
            }
          });
        });
      })
    },
    handleClick(val){

    },
  }
}
</script>

<style scoped>
  .examine-process-frame{
    position: relative;
    background: #FFFFFF;
    min-height: 100%;
    padding: 20px;
    padding-bottom: 150px;
  }
  .examine-head{
    display: grid;
    grid-template-columns: 2% 25% 58% 15%;
  }
  .examine-head p{
    font-size: 18px;
    font-weight: 550;
  }
  .step-examine{
    max-width: 700px;
    margin-left: 40px;
  }
  .examine-process-info{
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(7,1fr);
    grid-gap: 20px;
  }
  .process-subtitle{
    font-weight: 550;
    font-size: 14px;
  }
  .subcontent{
    font-size: 14px;
    color: #555555;
  }
  .plan-head{
    display: grid;
    grid-template-columns: 15% 15% 15% 15% 40%;
    background: #F2F2F2;
    grid-gap: 20px;
    padding-left: 20px;
  }
  .examine-plan-name{
    background: #F2F2F2;
    width: 200px;
    padding: 10px 20px;
    margin-top: 10px;
    margin-bottom: 0;
  }
  .process-examine-content{
    display: grid;
    grid-template-columns: 15% 15% 15% 15% 40%;
    grid-gap: 20px;
    padding-left: 20px;
    font-size: 14px;
    color: #555555;
    border-top: 1px solid #F2F2F2;
    border-bottom: 1px solid #F2F2F2;
  }
  .process-examine-content >>> .el-form-item{
    margin: 10px;
  }
  .process-examine-content >>> .el-input__inner{
    max-width: 150px;
  }
  .process-reamrk{
    border: 1px solid #F2F2F2;
    padding: 5px;
    width: 100px;
    cursor: pointer;
    height: 18px;
    line-height: 18px;
    border-radius: 3px;
  }
  .examine-process-operate{
    position: fixed;
    bottom: 0;
    left: 0;
    height: 45px;
    width: 100%;
    padding-top: 20px;
    text-align: center;
    background: #FFFFFF;
    border-top: 1px solid #dbdbdb;
    z-index: 100;
  }
  .view-remark{
    max-height: 200px;
    overflow: auto;
  }
  .audit-btn{
    text-align: right;
    right: 20px;
    min-width: 200px;
  }
  .grade-name{
    padding-left: 20px;
  }
  .process-img{
    margin: auto 0;
  }
  .tab-btn{
    display: grid;
    grid-template-columns: 70% 30%;
  }
  .salary{
    display: flex;
    font-size: 14px;
    line-height: 30px;
    margin-left: 40px;
    min-width: 30%;
  }
  .salary-num{
    color: #D9001B;
    font-weight: 600;
    margin-left: 5px;
    font-size: 16px;
  }
  .shouldpay{
    margin-right: 20px;
  }
  .group-check{
    display: block;
  }
  .audit-prompt{
    color: #62B4FF;
  }
  .entry-result{
    color: #7F7F94;
    margin-left: 5px;
  }
</style>