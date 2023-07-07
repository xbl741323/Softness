<template>
  <basic-container>
    <div>
      <el-tabs  v-model="tabName" @tab-click="handleClick" >
          <el-tab-pane name="1" label="详细数据"></el-tab-pane>
          <el-tab-pane name="2" label="统计数据"></el-tab-pane>
      </el-tabs>
    </div>
    <!-- 新增合同列表 -->
    <detail-data v-if="tabName==1"></detail-data>
    <statistic-data v-if="tabName==2"></statistic-data>
  </basic-container>
</template>

<script>
import detailData from "@/components/staff/meet-visit/detail-data"
import statisticData from "@/components/staff/meet-visit/statistic-data"
import { mapGetters } from "vuex"
export default {
  components:{
    detailData,
    statisticData
  },
  data() {
    return {
      tabName:"1",
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    if(sessionStorage.getItem(`staff-meetvisit`)){
        let obj = JSON.parse(sessionStorage.getItem(`staff-meetvisit`));
        this.tabName = obj.tabName;
    }else{
        let urlQuery = {
            tabName:this.tabName,
        }
        sessionStorage.setItem(`staff-meetvisit`, JSON.stringify(urlQuery));
    }
  },
  mounted(){
    
  },
  filters: {
    
  },
  methods: {
    handleClick(val) {
      let obj = JSON.parse(sessionStorage.getItem(`staff-meetvisit`));
      obj.tabName = this.tabName
      sessionStorage.setItem(`staff-meetvisit`, JSON.stringify(obj));
    },
  },
};
</script>

<style scoped>

</style>