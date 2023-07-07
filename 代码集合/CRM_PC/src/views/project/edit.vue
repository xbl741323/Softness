<template>
<!-- 排查完成 -->
    <div class="project_edit">
        <!-- <div class="avue-header top-fixed">
            <a class="avue-logo" href="/#/wel/index"><span class="avue-logo_title">卧涛管理中心 </span></a>
            <detail-head></detail-head>
        </div> -->
        <div class="my_publish">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="basicInfo">
              <set-project ref="project" @getTitle="titleData"></set-project>
            </el-tab-pane>
            <el-tab-pane label="交易信息" name="trade">
              <trade-info ref="trade"  @refresh="refresh" :editType="true" ></trade-info>
            </el-tab-pane>
            <el-tab-pane label="详细内容" name="detailContent">
              <set-content ref="content"></set-content>
            </el-tab-pane>
            <!-- <el-tab-pane label="操作记录" name="operateRecords">
              <handle-record ref="record" :title="title" :type="type" :number="number"></handle-record>
            </el-tab-pane> -->
          </el-tabs>
        </div>
    </div>
</template>

<script>
import tradeInfo from "@/components/ip-service/project-trade";
import detailHead from "@/page/index/top/index";
import setProject from "@/components/project/set-project";
import setContent from "@/components/project/set-content";
import handleRecord from "@/components/project/handleRecord";
export default {
    components: {
        detailHead,
        setProject,
        setContent,
        handleRecord,
        tradeInfo
    },
  data() {
    return {
      activeName: "basicInfo",
      showStatus: "0",
      type:'',
      title:'',
      number:'',
      beFrom:'',
    };
  },
  methods: {
    refresh(){
		this.$refs.trade.getData()
    },
    handleClick(val) {
      this.showStatus = val.index;
      if(this.$refs.content){
        this.$refs.content.getDetail();
      }
      // if(this.$refs.record){
      //   this.$refs.record.getList();
      // }
      // if(this.$refs.trade){
      //   this.$refs.trade.getTrade();
      // }
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
.project_edit{
  background: #ffffff;
  margin-left: 10px;
}
.my_publish {
  width: 80%;
  margin-left: 5%;
  padding: 20px 0;
}
</style>