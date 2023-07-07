<template>
        <div class="my_publish">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="文章信息" name="essayInfo"></el-tab-pane>
            <el-tab-pane label="操作记录" name="operateRecords"></el-tab-pane>
            <div v-if="showStatus == 0">
              <set-notice></set-notice>
            </div>
            <div v-if="showStatus == 1">
              <handle-record></handle-record>
            </div>
          </el-tabs>
        </div>
</template>

<script>
import setNotice from "@/components/nationalSite/columns/set-column";
import handleRecord from "@/components/nationalSite/columns/handleRecord";
export default {
    components: {
        setNotice,
        handleRecord
    },
  data() {
    return {
      title:"",
      activeName: "essayInfo",
      showStatus: "0",
    };
  },
  methods: {
    handleClick(val) {
      this.showStatus = val.index;
    }
  }
};
</script>

<style scoped>
.my_publish {
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 20px 100px 20px 30px;
}
</style>