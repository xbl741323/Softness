<template>
  <div class="return" v-if="leftStatus">
    <el-tooltip content="后退" placement="top">
      <i class="el-icon-back" @click="toRouter(true)"></i>
    </el-tooltip>
    <el-tooltip content="前进" placement="top">
      <i class="el-icon-right" @click="toRouter(false)"></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  data() {
    return {
      leftStatus: false,
      rightStatus: false,
      count:0
    };
  },
  methods: {
    toRouter(status) {
      if(this.$route.path=="/personal-create-clue"){ //业绩统计
        sessionStorage.removeItem("personal-create-clue");
      }
      if(this.$route.path=="/personal-payment"){ //业绩统计
        sessionStorage.removeItem("personal-payment");
      }
      if(this.$route.path=="/personal-follow"){ //业绩统计
        sessionStorage.removeItem("personal-follow");
      }
      if(this.$route.path=="/personal-new-contracts"){ //业绩统计
        sessionStorage.removeItem("personal-new-contracts");
      }
      if(this.$route.path=="/new-clue-detail" && this.$route.query.sourceType){
        sessionStorage.removeItem("staff-new-clue-detail");
      }
      let cParams  = JSON.parse(sessionStorage.getItem('pigx-tag')).content
      if(sessionStorage.getItem(`${cParams.value}`)){
      let keepParams  = JSON.parse(sessionStorage.getItem(`${cParams.value}`))
      if(keepParams.detail){
        keepParams.detail.path = ""
        keepParams.detail.query = {}
        sessionStorage.setItem(`${cParams.value}`,JSON.stringify(keepParams))
      }
      }
      if (status) {
        if(this.$route.path=="/create-examine"){//考核方案详情
          sessionStorage.removeItem('/salary/examine-plan');
        }
        if(this.$route.path=="/create-examinetask"){//考核任务详情
          sessionStorage.removeItem('/salary/examine-task');
        }
         if(this.$route.path == '/customer-files-detail'){ //任务管理-文件库-客户文件
          sessionStorage.removeItem("/task/files-library/customer-files/indexspecial")
        }
        this.$router.go(-1);
      } else {
        this.$router.go(1);
      }
    },
    changePath(){
      if(this.$route.query !== {}){
        this.leftStatus = true
        this.rightStatus = true;
      }
    }
  },
  watch: {
    $route(to, from) {
      this.count+=1
      if (to) {
        this.rightStatus = true;
      } else {
        this.rightStatus = false;
      }
      if (from) {
        this.leftStatus = true;
      } else {
        this.leftStatus = false;
      }
    },
  },
  mounted() {
    if(this.count==0&&this.$route.path!=='/personal/myHome'){
      this.changePath()
    }
  },
};
</script>

<style scoped>
.return {
  position: absolute;
  background: #409eff;
  margin: 0 0 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  color: #fff;
  padding: 5px 10px;
  bottom: 10px;
  left: 170px;
  z-index: 100000;
}
.return i {
  font-size: 25px;
  cursor: pointer;
}
.return i:nth-of-type(1) {
  margin-right: 20px;
}
.return span {
  cursor: pointer;
  width: 30px;
  height: 30px;
}
</style>
