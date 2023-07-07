<template>
  <div class="my_publish">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="通知公告" name="notice"
        ><policy ref="policy" type="0"></policy
      ></el-tab-pane>
      <el-tab-pane label="政策汇编" name="policy"
        ><policy ref="policy" type="1"></policy
      ></el-tab-pane>
      <el-tab-pane label="疑难解答" name="trouble"
        ><policy ref="policy" type="2"></policy
      ></el-tab-pane>
      <el-tab-pane label="文件管理" name="fileManage"
        ><file></file
      ></el-tab-pane>
      <el-tab-pane label="行业资讯" name="industry"
        ><policy ref="policy" type="10"></policy>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import policy from "@/components/policy/setPolicyParam";
import file from "@/components/policy/setFileParam";
export default {
  components: {
    policy,
    file,
  },
  data() {
    return {
      activeName: "notice",
      showStatus: "0",
    };
  },
  methods: {
    handleClick(val) {},
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