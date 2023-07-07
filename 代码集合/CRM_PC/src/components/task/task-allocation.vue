<template>
  <div class="task-allot">
    <div v-if="allotType == 1">
      <span class="task-title">任务数量：</span>
      <span>{{ taskIdList.length }}</span>
    </div>
    <div v-else>
      <span class="task-title">任务名称：</span>
      <span>{{ taskInfo.productName }}</span>
    </div>
    <div class="task-emp">
      <el-form :model="allotForm" inline ref="allotForm" :rules="allotRules">
        <el-form-item label="选择人员：" prop="selectMan">
          <el-cascader @change="changeEngineer" :props="{value: 'customerNo', label: 'label',multiple:true }" 
          filterable clearable :show-all-levels="false" ref="engineer" :options="empList" v-model="allotForm.selectMan" :before-filter="beforeFilter">
            <template slot-scope="{data}">
              <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                <div slot="content">{{data.customerNo}}</div>
                <span>{{data.label}}</span>
              </el-tooltip>
            </template>
          </el-cascader>
        </el-form-item>
      </el-form>
    </div>
    <div class="submitBtn">
      <el-button class="confirm-sty" type="primary" :disabled="allotStatus" @click="mergeSubmit()" v-preventReClick>确认</el-button>
      <el-button @click="cancelAllot()">取消</el-button>
    </div>
  </div>
</template>
<script>
import { allByDeptAndPartnerDept } from "@/api/clue/clue";
import * as CodeMsg from "@/api/common/CodeChange";
import { batchAllot } from "@/api/task/new-task";
export default {
  props: {
    taskInfo: {
      type: Object,
      required: false,
    },
    taskIdList:{
      type: Array,
      required: false,
    },
    allotType: {
      type: Number,
      default:0,
      required: false,
    },
    listType:{//personal-我的 其他值-任务管理
      required: true,
      default: ''
    },
    apiInfo:{
      type: Object,
      required: true,
      default: ()=>{}
    }
  },
  data() {
    return {
      allotForm:{
        selectMan:[],
      },
      allotStatus: true,
      allotManList:[],
      empList: [],
      isShowFinancial: false,
      financialList: [],
      allotRules: {
        selectMan: [{ required:true,message: "请选择", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getDropList()
    if(this.taskInfo.trTaskEngineerList){
        this.taskInfo.trTaskEngineerList.forEach((item)=>{
        this.allotForm.selectMan.push(item.engineerNo)
      })
    }
  },
  methods: {
    //显示工号
    async beforeFilter() {
      await allByDeptAndPartnerDept(false).then((res) => {
        if(res.data.code == CodeMsg.CODE_0){
          const emp = res.data.data;
          this.empList = [...emp.deptTree,...emp.partnerDeptTree];
        }
      });
      this.$loop(this.empList[0], this.empList[0])
      return false
    },
    // 编辑工程师
    changeEngineer() {
      this.$nextTick(() => {
        let rList = this.$refs.engineer.getCheckedNodes();
        if (rList.length > 3) {
          this.allotStatus = true
          this.$message({
            type: "warning",
            message: "至多选择三个工程师！",
            offset: 300,
          });
        } else {
          this.allotStatus = false
          this.allotManList = [];
          rList.forEach((item) => {
            if (item.data.customerId != null) {
              this.allotManList.push({
                engineerId: item.data.customerId,
                engineerNo: item.data.customerNo,
                engineerName: item.data.customerName,
              });
            }
          });
        }
      });
    },
    // 获取数据员工 false-去除禁用后的员工 true-获取所有员工
    getDropList() {
      allByDeptAndPartnerDept().then(res=>{
        const emp = res.data.data;
        this.empList = [...emp.deptTree,...emp.partnerDeptTree];
      })
    },
    cancelAllot() {
      this.$emit("cancelAllotDialog", false);
    },
    // 批量分配操作
    submitBatchAllot(){
      let params = {
        trTaskEngineerList: this.allotManList, // 工程师id
        tmOrderTaskVoList: this.allotType == 0?[{
          id:this.taskInfo.id
        }]:this.taskIdList // 任务id集合
      }
      batchAllot(params, this.listType, this.apiInfo).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:"success",
            message:"分配成功！",
            offset: 300
          })
          this.$emit("closeAllotDialog",false);
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        }
      })
    },
    // 必填项校验
    mergeSubmit() {
      this.$refs.allotForm.validate((valid) => {
        if (valid) {
          this.submitBatchAllot()
        }
      });
    },
  },
};
</script>

<style scoped>
.task-allot {
  font-size: 14px;
  width: 100%;
}
.task-title {
  font-weight: 600;
  color: #333;
}
.task-emp {
  margin-top: 20px;
}
.submitBtn {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
.confirm-sty {
  margin-right: 50px;
}
.name-flow{
  padding: 5px;
  margin: 0;
  display: inline-block;
}
</style>