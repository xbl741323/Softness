<!-- 排查完成 -->
<template>
  <div class="setting">
    <h3>公海设置</h3>
    <el-table :data="settingList" border>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="公海类型">
        <template slot-scope="scope">
          <p>{{scope.row.type | type}}</p>
        </template>
      </el-table-column>
      <el-table-column label="等待时间" prop="time">
        <template slot-scope="scope">
          <p>距最近客户跟进时间=
            <el-input v-model="scope.row.time" @blur="blurSetting(scope.row)" @focus="focusSetting(scope.row)" type="Number" class="time-input" />天
            <el-button icon="el-icon-check" @click="saveSetting(scope.row)" v-if="scope.row.status"></el-button>
            <el-button icon="el-icon-close" @click="cancelSaveSetting()" v-if="scope.row.status"></el-button>
            </p>
        </template>
      </el-table-column>
    </el-table>
    <p>等待时间规则说明：</p>
    <p>从计算的日期+等待天数后的当天24:00流入公海</p>
    <p>例如：最近跟进时间为3月1日，流入地区公海的等待时间为20天，则用户在3月21日24:00流入地区公海</p>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange"
import { getSetttingList, settingTime } from '@/api/dep-areas/department-areas'
export default {
  data(){
    return{
      settingList:[],
    }
  },
  filters:{
    type(value){
      return value == 0 ? '地区公海' : '集团公海';
    }
  },
  mounted(){
    this.getSetting();
  },
  methods:{
    blurSetting(row){
      row.time = parseInt(row.time);
      setTimeout(() => {
        if(row.blurStatus){

        }else{
          if(row.time == this.temporary){

          }else{
            row.time = this.temporary;
          }
          row.status = false;
        }
      }, 300);
      
    },
    focusSetting(row){
      setTimeout(() => {
        this.temporary = row.time;
        row.status = true;
      },400);
    },
    cancelSaveSetting(){
      this.getSetting();
    },
    saveSetting(row){
      row.blurStatus = true;
      if(row.time <=0 || row.time ==''){
        row.time = 1;
      }
      let param ={
        id: row.id,
        time: row.time
      }
      settingTime(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type: 'success',
            message:'跟进等待时间修改成功！',
            offset: 100
          })
        }
        this.getSetting();
      })
    },
    getSetting(){
      getSetttingList().then(res=>{
        this.settingList = res.data.data;
        this.settingList.forEach(element => {
          this.$set(element,'status',false);
          this.$set(element,'blurStatus',false);
        });
      })
    }
  }
}
</script>

<style scoped>
.setting{
  background: #FFF;
  padding: 10px;
  height: 100%;
  font-size: 12px;
}
.time-input{
  width: 80px;
}
</style>