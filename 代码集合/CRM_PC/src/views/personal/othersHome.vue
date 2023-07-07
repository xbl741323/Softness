<!-- 排查完成 -->
<template>
  <div class="personal-home">
  <div>
    <workBox></workBox>
    <div class="clue-grid">
      <div class="rank-grid">
        <my-clue v-if="clueStatus" :num="num" class="box"></my-clue>
        <task-item v-if="taskStatus" :num="num" class="box"></task-item>
      </div>
    </div>
  </div>
  <div class="user-info-box">
    <user-info></user-info>
  </div>
</div>
</template>

<script>
import userInfo from "@/components/personal/othersHome/user-info";
import workBox from "@/components/personal/othersHome/work-box";
import taskItem from "@/components/personal/othersHome/task-item";
import myClue from "@/components/personal/othersHome/my-clue";
import { mapGetters } from "vuex";
export default {
  components: {
    taskItem,
    userInfo,
    workBox,
    myClue,
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
    };
  },
  methods: {
    translate() {
      this.num = 0;
      if (this.permissions.sys_page_my_clueInfo) {
        this.clueStatus = this.permissions.sys_page_my_clueInfo;
        this.num += 1;
      }
      if (this.permissions.bt_page_my_task) {
        this.taskStatus = this.permissions.bt_page_my_task;
        this.num += 1;
      }
    },
  },
  mounted() {
    this.translate();
  },
};
</script>

<style scoped>.personal-home{
  display: grid;
  grid-template-columns: 78% 22%;
  padding: 10px 20px;
  background: #F4F7FC;
  min-height: 100%;
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
.box{
  width: 49.6% !important;
  height: 530px !important;
}
</style>