<template>
  <div class="log-setting">
    <el-form :model="filters">
      <el-form-item>
         <el-tooltip effect="dark"
          placement="top">
          <div slot="content">
            过期范围内日志仍可填写，但将会是过期状态<br/>
            例：过期时间为3天，若当天时间为4号，则1号的<br/>
            日志为过期日志，2、3、4号日志为正常日志
          </div>
          <div class="log_title">
            <span>过期日志设置：</span>
            <span class="circle_sty">?</span>
          </div>
        </el-tooltip>
        <span>创建时间与日志时间的时间差 ></span>
        <el-select v-model="filters.failTime" class="log_set_sty" @change="changeTime(true,1)">
          <el-option
            v-for="(item, index) in countList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <span>天，为过期日志</span>
        <span class="start_sty">生效日期：{{ filters.overdueStartTime|formatDate() }}</span>
      </el-form-item>
      <el-form-item>
        <span class="log_title">可编辑时间设置：</span>
        <span>日志时间距当天时间 ≤</span>
        <el-select v-model="filters.editTime" class="log_set_sty" @change="changeTime(true,2)">
          <el-option
            v-for="(item, index) in countList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <span>天，可编辑</span>
         <span class="start_sty">生效日期：{{ filters.editStartTime|formatDate() }}</span>
      </el-form-item>
    </el-form>

    <!--日志日期dialog-->
    <el-dialog title="过期日志设置" center :visible.sync="dialogVisible" :close-on-click-modal="false" width="400px">
      <div class="fail_set_contain">
      <el-form :model="failInfo" label-width="80px" :rules="rules">
        <el-form-item label="生效日期" prop="status">
          <el-radio-group v-model="failInfo.status">
            <el-radio :label="false">当月生效</el-radio>
            <el-radio :label="true">下月生效</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="jour_btn_sty">
        <el-button type="primary" size="medium" @click="submitEdit()">确定</el-button>
        <el-button size="medium" class="left_btn_sty" @click="cancel()">取消</el-button>
      </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { editJournalTime,getDataSet,editDayFitTime } from "@/api/work-log/index"
import * as CodeMsg from "@/api/common/CodeChange"
export default {
  data() {
    return {
      statusNum:0,
      dialogVisible:false,
      timeInfo:{},
      countList: [],
      failInfo:{
        status:false,
      },
      rules:{
        status:[{ required: true, message: '请选择', trigger: 'blur' },]
      },
      filters: {
        failTime: 0,
        editTime: 0,
      },
    };
  },
  filters:{
   formatDate(dateString) {
        const crtTime = new Date(dateString);
        let yyyy = crtTime.getFullYear();
        let MM = crtTime.getMonth() + 1;
        let dd = crtTime.getDate();
        MM = MM < 10 ? "0" + MM : MM;
        dd = dd < 10 ? "0" + dd : dd;
        return yyyy + "-" + MM + "-" + dd;
    }
  },
  methods: {
    cancel(){
      this.dialogVisible = false
      this.geTimeData()
    },
    submitEdit(){
   
      if (this.statusNum==1) {
        let params = {      
          day:this.filters.failTime,
          isNextMonth:this.failInfo.status 
        }
        editDayFitTime(params).then(res=>{
         if(res.data.code == CodeMsg.CODE_0){
           this.$message({
             type:"success",
             message:"修改成功！",
             offset:300
           })
           this.dialogVisible = false
           this.geTimeData()
          //  this.getList()
         }
      })
      }else{
         let params = {      
          day:this.filters.editTime,
          isNextMonth:this.failInfo.status 
        }
      editJournalTime(params).then(res=>{
         if(res.data.code == CodeMsg.CODE_0){
           this.$message({
             type:"success",
             message:"修改成功！",
             offset:300
           })
           this.dialogVisible = false
           this.geTimeData()
          //  this.getList()
         }
      })
      }
    
    },
    changeTime(status,num){
        this.statusNum=num
        this.dialogVisible = status
    },
    getCountList() {
      this.countList = [];
      for (var i = 0; i <= 15; i++) {
        this.countList.push(Number(i));
      }
    },
    geTimeData(){
      getDataSet().then(res=>{
         if(res.data.code == CodeMsg.CODE_0){
           let timeInfo = res.data.data
           this.filters=timeInfo
           this.filters.failTime = Number(timeInfo.overdueDay)
           this.filters.editTime = Number(timeInfo.editDay)
         }
      })
    }
  },
  mounted() {
    this.getCountList();
    this.geTimeData();
  },
};
</script>

<style scoped>
.log-setting {
  margin: 20px 0 0 20px;
  padding-bottom: 300px;
}
.log_set_sty {
  width: 100px !important;
  margin: 0 10px;
}
.log_title {
  position: relative;
  display: inline-block;
  width: 130px;
  text-align: right;
  color: #0099ff;
}
.circle_sty{
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 8px;
  /* right: 10px; */
  width: 15px;
  height: 15px;
  border-radius: 10px;
  background: #ffffff;
  color: #5a5c5d;
  border: 1px solid #5a5c5d;
}
.jour_btn_sty{
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.left_btn_sty{
  margin-left: 60px !important;
}
.fail_set_contain{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.start_sty{
  margin-left: 20px;
  color: #ff6633;
}
</style>