<template>
    <div class="industry_edit">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="文章信息" name="essayInfo"></el-tab-pane>
            <el-tab-pane label="操作记录" name="operateRecords"></el-tab-pane>
            <div v-if="showStatus == 0">
              <set-Industry v-if="operateType==1" @getTitle="titleData"></set-Industry>
              <industry-detail v-if="operateType==0" @getTitle="titleData"></industry-detail>
            </div>
            <div v-if="showStatus == 1">
              <handle-record v-if="type==1" :title="title" :type="type" :number="number"></handle-record>
              <solo-record v-if="type==0" :title="title" :type="type" :number="number"></solo-record>
            </div>
          </el-tabs>
    </div>
</template>

<script>
import detailHead from "@/page/index/top/index";
import setIndustry from "@/components/policy/setIndustry";
import industryDetail from "@/components/policy/industry-detail";
import soloRecord from "@/components/personal/myPublish/handleRecord";
import handleRecord from "@/components/policy/handleRecord";
export default {
    components: {
        detailHead,
        setIndustry,
        handleRecord,
        industryDetail,
        soloRecord
    },
  data() {
    return {
      activeName: "essayInfo",
      showStatus: 0,
      operateType:"",
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
    this.operateType = this.$route.query.operateType;
    this.number = this.$route.query.number;
  },
};
</script>

<style scoped>
.industry_edit{
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 20px 100px 20px 30px;
}
</style>