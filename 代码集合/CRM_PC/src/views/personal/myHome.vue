<!-- 排查完成 -->
<template>
  <div >
    <div class="personal-home">
      <div>
        <quick-tool></quick-tool>
        <div class="clue-grid">
          <div class="rank-grid">
            <depart-rank class="box" ref="depart" :treeData="treeData" v-if="permissions.bt_dept_ranking_flag"></depart-rank>
            <achieve-data class="box" ref="achieve" :treeData="treeData" v-if="permissions.bt_achievement_flag"></achieve-data>
            <my-clue class="box" v-if="clueStatus" :num="num"></my-clue>
            <my-task class="box" v-if="taskStatus" :num="num"></my-task>
          </div>
        </div>
      </div>
      <div class="user-info-box">
        <user-info></user-info>
      </div>
    </div>
  </div>
</template>
<script>
import  othersHome from "@/views/personal/othersHome.vue";
import { fetchNewTree } from "@/api/admin/dept";
import userInfo from "@/components/personal/my-home/user-info";
import quickTool from "@/components/personal/my-home/quick-tool";
import achieveData from "@/components/personal/my-home/achieve-data";
import departRank from "@/components/personal/my-home/depart-rank";
import myClue from "@/components/personal/my-home/my-clue";
import myTask from "@/components/personal/my-home/my-task";
import myOrder from "@/components/personal/my-home/my-order";
import * as CodeMsg from "@/api/common/CodeChange";
import { mapGetters } from "vuex";
export default {
  components: {
    userInfo,
    quickTool,
    achieveData,
    departRank,
    myClue,
    myTask,
    myOrder,
    othersHome,
  },
  computed: {
    ...mapGetters(["permissions","userInfo"]),
  },
  data() {
    return {
      treeData:[],
      num: 0,
      clueStatus: false,
      taskStatus: false,
      orderStatus: false,
      userData:{
        content:{
          isPartner:null
        }
      }
    };
  },

  methods: {
    translate() {
      this.num = 0;
      if (this.permissions.sys_page_my_clueInfo) {
        this.clueStatus = this.permissions.sys_page_my_clueInfo;
        this.num += 1;
      }
      if (this.permissions.bt_page_task_my_flag) {
        this.taskStatus = this.permissions.bt_page_task_my_flag;
        this.num += 1;
      }
      if (this.permissions.sys_page_my_order) {
        this.orderStatus = this.permissions.sys_page_my_order;
        this.num += 1;  
      }
    },
     init() {
      let params = {
        menuFlag: "emp_list",
      };
      fetchNewTree(params).then((res) => {
        if(res.data.code == CodeMsg.CODE_0){
          this.treeData = res.data.data;
          this.$refs.depart.filters.depart = this.userInfo.deptId;
          this.$refs.achieve.filtersDepart.depart = this.userInfo.deptId;
        }
      });
    },
  },
  mounted() {
    this.userData =JSON.parse(sessionStorage.getItem('pigx-userInfo'))

    this.translate();
    this.init()
  },
};
</script>

<style scoped>
.personal-home{
  display: grid;
  grid-template-columns: 78% 22%;
  margin: 0 10px;
  background: #F4F7FC;
  min-height: 100vh;
}
.box{
  width: 49.6% !important;
  height: 530px !important;
}
.home-top-one {
  width: 100%;
  display: flex;
}
.home-top {
  width: 100%;
  display: flex;
}
.home-top-three {
  display: flex;
  flex-direction: column;
}
.rank-grid{
  display: flex;
  background: #f4f7fc;
  justify-content: space-between;
  flex-wrap: wrap;
}
.clue-grid{
  margin-right: 10px;
  border-radius: 10px;
  background: #FFFFFF;
}
</style>