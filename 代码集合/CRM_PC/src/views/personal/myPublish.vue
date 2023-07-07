<template>
  <div class="my_publish">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="通知公告" name="notice">
        <notice v-if="activeName == 'notice'"></notice>
      </el-tab-pane>
      <!-- <el-tab-pane label="政策汇编" name="policy">
        <policy></policy>
      </el-tab-pane> -->
      <el-tab-pane label="行业资讯" name="industry">
        <industry v-if="activeName == 'industry'"></industry>
      </el-tab-pane>
      <el-tab-pane label="卧涛问答" name="issue">
        <issue v-if="activeName == 'issue'"></issue>
      </el-tab-pane>
      <el-tab-pane label="卧涛文档" name="wtFile">
        <wtFile v-if="activeName == 'wtFile'"></wtFile>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import notice from "@/components/personal/myPublish/notice";
import policy from "@/components/personal/myPublish/policy";
import trouble from "@/components/personal/myPublish/trouble";
import industry from "@/components/personal/myPublish/industry";
import wtFile from "@/components/personal/myPublish/wtFile";
import issue from "@/views/policySquare/qa/issue";
import { mapGetters } from "vuex";
export default {
  components: {
    notice,
    policy,
    trouble,
    industry,
    issue,
    wtFile
  },
  data() {
    return {
      activeName: "",
      showStatus: "0",
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    handleClick(val) {
      this.showStatus = val.index;
      sessionStorage.setItem(`my-publish-index`, this.activeName);
    },
    translate() {
      this.activeName = "notice";
      // this.permissions.sys_my_notice==true?"notice":
      // this.permissions.sys_my_policy==true?"policy":
      // this.permissions.sys_my_problem==true?"trouble":
      // this.permissions.sys_my_industry==true?"industry":""
      if (sessionStorage.getItem(`my-publish-index`)) {
        this.activeName = sessionStorage.getItem(`my-publish-index`);
      }
    },
  },
  mounted() {
    this.translate();
  },
};
</script>

<style scoped>
.my_publish {
  background: #fff;
  padding: 20px 15px;
  margin: -20px 0 0 10px;
}
</style>
