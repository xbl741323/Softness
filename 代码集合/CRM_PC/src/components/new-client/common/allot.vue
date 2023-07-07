<template>
  <!-- 统一分配操作组件 -->
  <!-- 排查完成 -->
  <div class="allot">
    <el-dialog :visible.sync="openVisble" v-if="openVisble" :before-close="cancle" :title="dialogTitle" width="400px" :close-on-click-modal="false">
      <el-form :model="distriForm" v-if="openVisble" v-loading="loading">
        <el-form-item label="选择人员：">
          <el-cascader filterable :show-all-levels="false" ref="belong" :options="filterEmp" :before-filter="beforeFilter" clearable v-model="distriForm.distriMan" >
            <template slot-scope="{data}">
              <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                <div slot="content">{{data.customerNo}}</div>
                <span>{{data.label}}</span>
              </el-tooltip>
            </template>
          </el-cascader>
        </el-form-item>
        <div class="distri-sty">
          <el-button size="small" class="btn_right_sty" type="primary" @click="allotConfirm()" :disabled="!distriForm.distriMan">{{ $t("button.confirm") }}</el-button>
          <el-button size="small" @click="cancle()">{{  $t("button.cancel") }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { allotBelong } from "@/api/new-client/my-clue";
import { getEmpList } from "@/api/clue/clue";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  data() {
    return {
      loading: false,
      isPerson: false, // 属于个人的 true:属于 false:不属于
      clueType:1, // clueType：1-单位（线索/客户） 0-个人（线索/客户
      openVisble: false,
      filterEmp: [],
      clueList: [],
      allotType: "", // 0-分配线索归属 1-分配业务员
      dialogTitle: "",
      clueEmpNo: "",
      clueEmpDeptNo: "",
      clueEmpId: "",
      clueEmpName: "",
      clueEmpDeptId: "",
      clueEmpDeptName: "",
      distriForm: {
        distriMan: "",
      },
      resolveCount:0
    };
  },
  mounted() {
    this.getDropList();
  },
  methods: {
    //显示工号
    async beforeFilter() {
      await getEmpList(false).then((res) => {
        if (res.data.code == 0) {
          this.filterEmp = res.data.data;
        }
      });
      this.$loop(this.filterEmp[0], this.filterEmp[0])
      return false
    },
    // 获取分配人信息
    getAllotmanInfo() {
      let object = this.$refs.belong.getCheckedNodes()[0].data;
      this.clueEmpNo = object.customerNo;
      this.clueEmpDeptNo = object.deptNumber;
      this.clueEmpId = object.value;
      this.clueEmpName = object.label;
      this.clueEmpDeptId = object.customerDeptId;
      this.clueEmpDeptName = object.customerDeptName;
    },
    // 获取数据员工 false-去除禁用后的员工 true-获取所有员工
    getDropList() {
      getEmpList(false).then((res) => {
        this.filterEmp = res.data.data;
      });
    },
    // 点击取消按钮
    cancle() {
      this.openVisble = false;
      this.distriForm.distriMan = "";
    },
    // 初始化数据
    distrBelong(val,title) {
      this.openVisble = true;
      this.allotType = val;
      this.dialogTitle = title;
    },
    // 获取选择的列表项id
    fixIdList() {
      let clueType = this.clueType
      let idList = [];
      this.clueList.forEach((item) => {
        idList.push(Number(clueType == 1?item.clueCompanyId:item.cluePersonId));
      });
      return idList;
    },
    // 客户分配 业务员分配
    allotConfirm() {
      this.resolveCount = 0
      this.getAllotmanInfo()
      let clueEmpName = this.clueEmpName
      try {
        if (clueEmpName.split('(').length > 1) {
          clueEmpName = this.clueEmpName.split('(')[0]
        }
      } catch (error) {
        
      }
      this.fixIdList().forEach(item=>{
        this.allotItem(item,clueEmpName)
      })
    },
    closeDialog(){
      this.openVisble = false;
      this.clueList = [];
      this.distriForm.distriMan = "";
      this.loading = false
      this.$emit("refresh");
    },
    allotItem(clueId,clueEmpName){
      let param = {
        clueEmpId: this.clueEmpId, // 指定线索归属/业务员id
        clueEmpName: clueEmpName, // 指定线索归属/业务员名称
        clueEmpNo:this.clueEmpNo, // 指定线索归属/业务员Number
        clueEmpDeptId: this.clueEmpDeptId, // 指定线索归属/业务员部门id
        clueEmpDeptName: this.clueEmpDeptName, // 指定线索归属/业务员部门名称
        clueEmpDeptNo:this.clueEmpDeptNo, // 指定线索归属/业务员部门Number
        clueIdList: [clueId], // 待分配线索ID列表
      };
      this.loading = true
      allotBelong(param, this.allotType, this.clueType, this.isPerson).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.resolveCount = this.resolveCount + 1
          if(this.resolveCount == this.fixIdList().length){
            this.$message({
            type: "success",
            message: res.data.data,
            offset: 300,
          });
            this.closeDialog()
          }
        } else {
          this.resolveCount = this.resolveCount + 1
          this.loading = false
          this.$message({
            type: "warning",
            message: res.data.msg,
            offset: 300,
          });
          if(this.resolveCount == this.fixIdList().length){
            this.closeDialog()
          }
        }
      });
    }
  },
};
</script>

<style scoped>
.distri-sty {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn_right_sty {
  margin-right: 50px;
}
</style>