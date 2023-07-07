<!-- 排查完成 -->
<template>
  <div :class="['my-clue',num==1?'complete-sty':'']">
    <div class="tool-title">
      <span>我的线索-待跟进</span>
    </div>
    <avue-crud
      class="clue-avue"
      ref="crud"
      :option="option"
      :data="dataList"
      @on-load="getList">
      <template slot="contact" slot-scope="scope">
        <span>
          {{scope.row.contactName + scope.row.contactMobileNonSensitive}}
        </span>
      </template>
      <template slot="menu" slot-scope="scope">
        <span  @click="fllowClue(scope.row)" v-preventReClick id="handle-style">跟进</span>
      </template>
      <template slot="clueNo" slot-scope="scope">
        <span id="handle-style" @click="checkDetail(scope.row)">{{ scope.row.clueNo }}</span>
      </template>
    </avue-crud>
    <follow ref="follow" @refresh="refresh"></follow>
  </div>
</template>
<script>
import follow from '@/components/new-client/common/follow';
import { pageMyClueInfo } from '@/api/personal/myhome';
import { getfollowTypy } from '@/api/clue/clue';
import { soloOption } from "@/const/crud/othersHome/my-clue";
export default {
  components:{
    follow,
  },
  props:['num'],
  data() {
    return {
      option: soloOption,
      followClueTypeList: [],
      dataList:[],
      taskList:[],
      cEmpNo:"",
      cDeptName:"",
    };
  },
  methods: {
    // 弹出跟进弹窗
    fllowClue(row){
      this.$nextTick(()=>{
        this.$refs.follow.followClueDialog = true
        this.$refs.follow.followInfo = row
        this.$refs.follow.followTitle = "线索跟进"
        this.$refs.follow.clueType = Number(row.clueType)
        this.$refs.follow.publicTime = row.publicTime;
        this.$refs.follow.followClueTypeList = this.followClueTypeList
        if(row.clueType == 2){
          this.$refs.follow.followInfo.clueCompanyId = row.clueId
        }else{
          this.$refs.follow.followInfo.cluePersonId = row.clueId
        }
      })
    },
    // 查看详情
    checkDetail(row) {
          let path = "/new-clue-detail";
          let query = {
              type: 0,
              id: row.clueId,
              clueType: Number(row.clueType)-1
          };
      this.$router.push({ path: path, query: query });
    },
    goToDetail() {
      // true 线索    
        let path = "/personal/customer/my-clue";
        this.$router.push({ path: path });
    },
    // 获取弹框跟进方式数据
    getfollowTypeList(){
      const followClueTypeId = '15ea644a8fa2470b933e303dbc7fe19e';//跟进方式下拉框数据id
      getfollowTypy(followClueTypeId).then(res=>{
        this.followClueTypeList = res.data.data[0].options;
      });
    },
      // 刷新列表
    refresh() {
      this.getList();
    },
    // 获取表格列表
    getList() {
      pageMyClueInfo({pageNo: 1, pageSize: 10}).then(res=>{
        this.dataList = res.data.data.records
      })
    },
  },
  mounted(){
    this.getfollowTypeList()
  }
};
</script>

<style scoped>
.borcolor >>> .el-input__inner{
  border-color: red !important;
}
.my-clue {
  background: #fff;
  min-height: 370px;
  border-radius: 10px;
  margin-top: 10px;
}
.complete-sty{
  width: 98.8% !important;
}
.tool-title {
  margin: 15px 0 15px 15px;
  display: flex;
  align-items: center;
  color: #333333;
  font-size: 22px;
  font-weight: 700;
}
.tool-title img {
  width: 26px;
  height: 26px;
  margin-right: 1px;
}
.clue-title {
  margin: 15px 0 15px 45px;
}
.clue-avue{
  width: 97%;
  padding: 0 12px;
}
.clue-pointer-sty{
  cursor: pointer;
  transition: 0.3s;
  margin-right: 2.5%;
}
.clue-pointer-sty:hover{
  color: #409EFF;
}
#handle-style{
  color: rgb(64, 158, 255) !important;
  cursor: pointer
}
.footer{
  text-align: right;
}
.disable_img_sty{
  width:20px;
  height:20px;
  margin-left: 3px;
}
</style>