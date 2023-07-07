<template>
  <div class="tabBox">
    <div class="ml">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="课程订单" name="first" v-if="permissions.bt_check_list_courses">
          <course-list></course-list>
        </el-tab-pane>
        <el-tab-pane label="会员订单" name="second" v-if="permissions.bt_check_list_courses_vip">
          <member-list></member-list>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import courseList from "@/components/course/course-list.vue";
import memberList from "@/components/member/member-list.vue";
import { mapGetters } from 'vuex'
export default {
  components : {
    courseList,
    memberList
  },
  computed:{
    ...mapGetters(['permissions']),

  },
  data () {
    return {
      activeName:"first"
    }
  },
  methods: {
    handleClick(val) {
      let obj = JSON.parse(sessionStorage.getItem(`${this.$route.path}`));
      obj.activeName = this.activeName
      obj.detail = {path: "",query: {}}
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(obj));
    },
  },

  created () {
    if (!this.permissions.bt_check_list_courses) {
      this.activeName='second'
    }else if(!this.permissions.bt_check_list_courses_vip){
      this.activeName='first'
    }
    if(sessionStorage.getItem(`${this.$route.path}`)){
        let obj = JSON.parse(sessionStorage.getItem(`${this.$route.path}`));
        this.activeName = obj.activeName
        obj.detail = {path: "",query: {}}
    }else{
        let urlQuery = {
          activeName: this.activeName,
          detail: {path: "",query: {}}
        }
        sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(urlQuery));
    }
  },

  mounted () {

  }

}
</script>

<style scoped>
.tabBox {
  background: #FFF;
  padding: 10px;
  font-size: 14px;
}
.tabBox .ml{
  margin-left: 12px;  
}
</style>