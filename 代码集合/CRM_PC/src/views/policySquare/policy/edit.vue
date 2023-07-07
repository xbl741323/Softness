<template>
        <div class="my_publish">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-if="type==4" label="项目详情" name="essayInfo"></el-tab-pane>
            <el-tab-pane v-else label="文章信息" name="essayInfo"></el-tab-pane>
            <el-tab-pane label="操作记录" name="operateRecords"></el-tab-pane>
            <div v-if="showStatus == 0">
              <set-notice @getTitle="titleData"></set-notice>
            </div>
            <div v-if="showStatus == 1">
              <handle-record :title="title" :type="type" :number="number"></handle-record>
            </div>
          </el-tabs>
        </div>
</template>

<script>
import detailHead from "@/page/index/top/index";
import setNotice from "@/components/policy/setPolicy";
import handleRecord from "@/components/policy/handleRecord";
export default {
    components: {
        detailHead,
        setNotice,
        handleRecord
    },
  data() {
    return {
      activeName: "essayInfo",
      showStatus: "0",
      type:'',
      title:'',
      number:'',
      beFrom:'',
    };
  },
  methods: {
    handleClick(val) {
      this.showStatus = val.index;
    },
    titleData(data){
      this.title=data.title;
      this.number=data.number;
    },
  },
  created() {
    this.type = this.$route.query.type;
    this.beFrom = this.$route.query.beFrom;
  },
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